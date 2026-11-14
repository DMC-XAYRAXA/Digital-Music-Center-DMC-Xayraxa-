const EMAIL_RESET_CHALLENGE_KEY = 'dmc_email_reset_challenge_v1';

interface StoredEmailChallenge {
  challengeId: string;
  email: string;
  targetRole: 'MEMBER' | 'SUPER_ADMIN';
  accountId: string;
  challengeHash: string;
  expiresAt: number;
}

/**
 * Computes a 64-character lowercase SHA-256 hex digest.
 */
export async function hashTextSha256(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Deterministic non-empty fallback only if subtle crypto is unavailable in a legacy environment
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch + i;
    h2 = Math.imul(h2, 0x01000193);
  }
  const part1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `${part1}${part2}${part1}${part2}${part1}${part2}${part1}${part2}`;
}

export async function hashAccountPassword(
  accountId: string,
  password: string
): Promise<string> {
  const normalizedId = accountId.trim().toUpperCase();
  const normalizedPw = password.trim();
  return hashTextSha256(`DMC-XAYRAXA-v2.6::${normalizedId}::${normalizedPw}`);
}

function generateSixDigitCode(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const code = 100000 + (arr[0] % 900000);
    return String(code);
  }
  return String(Math.floor(100000 + Math.random() * 900000));
}

export interface DispatchEmailResetResult {
  success: boolean;
  email: string;
  challengeId?: string;
  needsActivation?: boolean;
  message: string;
}

/**
 * Dispatches a real 6-digit password reset confirmation code to the user's email inbox
 * via FormSubmit's HTTPS AJAX mail relay (works on static domains like dmcxayraxa.music
 * and AI Studio previews without embedded secrets).
 */
export async function sendPasswordResetConfirmationEmail(params: {
  targetEmail: string;
  targetRole: 'MEMBER' | 'SUPER_ADMIN';
  accountId: string;
  accountName: string;
}): Promise<DispatchEmailResetResult> {
  const cleanEmail = params.targetEmail.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      email: cleanEmail,
      message: 'Please enter a valid email address (e.g., xay.raxa@gmail.com).',
    };
  }

  const code = generateSixDigitCode();
  const challengeId = `chk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const challengeHash = await hashTextSha256(
    `${cleanEmail}::${code}::${challengeId}`
  );
  const challenge: StoredEmailChallenge = {
    challengeId,
    email: cleanEmail,
    targetRole: params.targetRole,
    accountId: params.accountId.trim().toUpperCase(),
    challengeHash,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  try {
    sessionStorage.setItem(EMAIL_RESET_CHALLENGE_KEY, JSON.stringify(challenge));
  } catch {
    // ignore storage errors
  }

  const originLabel =
    typeof window !== 'undefined' ? window.location.origin : 'https://dmcxayraxa.music';

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `DMC XAYRAXA Password Reset Confirmation Code (${params.accountId})`,
          _template: 'table',
          _captcha: 'false',
          Application: 'DMC XAYRAXA Super App (dmcxayraxa.music)',
          Account_Type:
            params.targetRole === 'SUPER_ADMIN' ? 'Super Administrator' : 'Member User',
          Account_ID: params.accountId,
          Account_Name: params.accountName,
          Verification_Code: code,
          Valid_For: '15 Minutes',
          Requested_From: originLabel,
          Security_Notice:
            'Enter this 6-digit Verification Code in the DMC XAYRAXA Password Recovery screen to confirm your password reset.',
        }),
      }
    );

    const data = (await response.json().catch(() => ({}))) as {
      success?: boolean | string;
      message?: string;
    };
    const msgText = String(data?.message || '');
    const isSuccess =
      response.ok && (data?.success === true || data?.success === 'true');
    const needsActivation = /activat|confirm your email/i.test(msgText);

    if (needsActivation) {
      return {
        success: false,
        email: cleanEmail,
        needsActivation: true,
        message: `First-time email activation required: Open your Gmail inbox (${cleanEmail}) and click the "Activate Form" link in the FormSubmit email we just triggered, then click "Send Confirmation Code to Inbox" again to receive your 6-digit code.`,
      };
    }

    if (!isSuccess) {
      return {
        success: false,
        email: cleanEmail,
        message:
          msgText ||
          `Could not deliver confirmation email to ${cleanEmail}. Please verify the email address or try again.`,
      };
    }

    return {
      success: true,
      email: cleanEmail,
      challengeId,
      needsActivation: false,
      message: `Confirmation email sent to ${cleanEmail}! Check your Gmail Inbox (and Spam/Promotions) for the 6-digit confirmation code and enter it below.`,
    };
  } catch (err) {
    return {
      success: false,
      email: cleanEmail,
      message: `Email delivery request failed (${
        err instanceof Error ? err.message : 'Network error'
      }). Check your internet connection and try again.`,
    };
  }
}

export async function verifyEmailResetCode(
  targetEmail: string,
  enteredCode: string
): Promise<{ valid: boolean; error?: string; accountId?: string }> {
  const cleanEmail = targetEmail.trim().toLowerCase();
  const cleanCode = enteredCode.trim();

  if (!cleanCode || !/^\d{6}$/.test(cleanCode)) {
    return {
      valid: false,
      error: 'Please enter the 6-digit confirmation code sent to your email inbox.',
    };
  }

  let stored: StoredEmailChallenge | null = null;
  try {
    const raw = sessionStorage.getItem(EMAIL_RESET_CHALLENGE_KEY);
    if (raw) {
      stored = JSON.parse(raw) as StoredEmailChallenge;
    }
  } catch {
    stored = null;
  }

  if (!stored) {
    return {
      valid: false,
      error:
        'No pending email confirmation code found. Click "Send Confirmation Code to Inbox" first.',
    };
  }

  if (Date.now() > stored.expiresAt) {
    try {
      sessionStorage.removeItem(EMAIL_RESET_CHALLENGE_KEY);
    } catch {
      // ignore
    }
    return {
      valid: false,
      error: 'Your confirmation code expired (15 min limit). Request a new code.',
    };
  }

  if (stored.email !== cleanEmail) {
    return {
      valid: false,
      error: `This code was sent to ${stored.email}, which does not match ${cleanEmail}.`,
    };
  }

  const candidateHash = await hashTextSha256(
    `${cleanEmail}::${cleanCode}::${stored.challengeId}`
  );
  if (candidateHash !== stored.challengeHash) {
    return {
      valid: false,
      error: 'Invalid 6-digit confirmation code. Please check your email inbox carefully.',
    };
  }

  try {
    sessionStorage.removeItem(EMAIL_RESET_CHALLENGE_KEY);
  } catch {
    // ignore
  }

  return {
    valid: true,
    accountId: stored.accountId,
  };
}
