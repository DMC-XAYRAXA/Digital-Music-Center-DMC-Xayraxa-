import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore';
import {
  auth,
  AUTHORIZED_ADMIN_EMAIL,
  db,
  FirebaseUser,
  googleProvider,
  handleFirestoreError,
  onAuthStateChanged,
  OperationType,
  signInWithPopup,
  signOut,
} from '../firebase';
import { Language, Member, SuperAdminProfile } from '../types/dmc';
import { hashAccountPassword } from '../utils/emailVerificationService';

export interface CloudPublicDirectoryState {
  schemaVersion: number;
  adminOperatorId: string;
  adminPasswordHash: string;
  adminPasswordUpdatedAt: string;
  deletedMemberIds: string[];
  activeSponsorIds: string[];
  activeSponsorNames: Record<string, string>;
  memberAuthHashes: Record<string, string>;
  memberStates: Record<string, Member['membershipState']>;
  ownerUid: string;
  updatedAtIso?: string;
}

export interface CloudMemberRecord {
  memberId: string;
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  membershipState: Member['membershipState'];
  sponsorId: string;
  kycStatus: Member['kycStatus'];
  avatarUrl: string;
  language: Language;
  isAutomaticAffiliate?: boolean;
  autoAffiliateCode?: string;
  bankSummary?: string;
  ownerUid: string;
}

export interface CloudAdminVaultConfig {
  operatorId: string;
  name: string;
  phone: string;
  email: string;
  roleTitle: string;
  passwordHash: string;
  lastPasswordUpdatedAt: string;
  ownerUid: string;
}

export function isVerifiedAdminFirebaseUser(user: FirebaseUser | null): boolean {
  if (!user) return false;
  return (
    user.emailVerified === true &&
    (user.email || '').trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()
  );
}

export async function signInAdminWithGoogle(): Promise<{
  user: FirebaseUser | null;
  isAdmin: boolean;
  error?: string;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const isAdmin = isVerifiedAdminFirebaseUser(user);
    if (!isAdmin) {
      return {
        user,
        isAdmin: false,
        error: `Signed in as ${user.email || 'unknown'}, which is not the authorized Super Admin (${AUTHORIZED_ADMIN_EMAIL}). Please sign in with ${AUTHORIZED_ADMIN_EMAIL}.`,
      };
    }
    return { user, isAdmin: true };
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code || '';
    const msg = err instanceof Error ? err.message : String(err);
    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'dmcxayraxa.music';
      return {
        user: null,
        isAdmin: false,
        error: `Domain "${host}" is not authorized in Firebase Authentication yet. Open Firebase Console -> Authentication -> Settings -> Authorized Domains and add "${host}".`,
      };
    }
    if (code === 'auth/popup-closed-by-user') {
      return {
        user: null,
        isAdmin: false,
        error: 'Google sign-in popup was closed before completing authentication.',
      };
    }
    return {
      user: null,
      isAdmin: false,
      error: msg,
    };
  }
}

export async function signOutFirebaseCloud(): Promise<void> {
  await signOut(auth);
}

export function subscribeToFirebaseAuth(
  callback: (user: FirebaseUser | null, isAdmin: boolean) => void
): Unsubscribe {
  return onAuthStateChanged(auth, (user) => {
    callback(user, isVerifiedAdminFirebaseUser(user));
  });
}

function sanitizeId(raw: string, fallback = 'DMC-ID'): string {
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 64);
  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeLanguage(lang: unknown): Language {
  const valid: Language[] = ['en', 'lo', 'th', 'vi', 'zh', 'ko'];
  return valid.includes(lang as Language) ? (lang as Language) : 'en';
}

function sanitizeSafeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.length > 2048) return '';
  return trimmed;
}

function parsePublicDirectorySnap(
  d: Record<string, unknown>
): CloudPublicDirectoryState {
  let updatedAtIso: string | undefined;
  const rawUpdatedAt = d.updatedAt as { toDate?: () => Date } | undefined;
  if (rawUpdatedAt && typeof rawUpdatedAt.toDate === 'function') {
    updatedAtIso = rawUpdatedAt.toDate().toISOString();
  }
  return {
    schemaVersion: Number(d.schemaVersion || 1),
    adminOperatorId: String(d.adminOperatorId || 'SUPER-ADMIN-LAO'),
    adminPasswordHash: String(d.adminPasswordHash || ''),
    adminPasswordUpdatedAt: String(d.adminPasswordUpdatedAt || ''),
    deletedMemberIds: Array.isArray(d.deletedMemberIds)
      ? d.deletedMemberIds.map((x: unknown) => String(x).trim().toUpperCase()).filter(Boolean)
      : [],
    activeSponsorIds: Array.isArray(d.activeSponsorIds)
      ? d.activeSponsorIds.map((x: unknown) => String(x).trim().toUpperCase()).filter(Boolean)
      : [],
    activeSponsorNames:
      d.activeSponsorNames && typeof d.activeSponsorNames === 'object'
        ? (d.activeSponsorNames as Record<string, string>)
        : {},
    memberAuthHashes:
      d.memberAuthHashes && typeof d.memberAuthHashes === 'object'
        ? (d.memberAuthHashes as Record<string, string>)
        : {},
    memberStates:
      d.memberStates && typeof d.memberStates === 'object'
        ? (d.memberStates as Record<string, Member['membershipState']>)
        : {},
    ownerUid: String(d.ownerUid || ''),
    updatedAtIso,
  };
}

export async function fetchPublicDirectoryStateOnce(): Promise<CloudPublicDirectoryState | null> {
  const path = 'public_directory/state';
  try {
    const snap = await getDoc(doc(db, 'public_directory', 'state'));
    if (!snap.exists()) return null;
    return parsePublicDirectorySnap(snap.data() as Record<string, unknown>);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function fetchAdminVaultConfigOnce(): Promise<CloudAdminVaultConfig | null> {
  const path = 'admin_vault/super_admin_config';
  try {
    const snap = await getDoc(doc(db, 'admin_vault', 'super_admin_config'));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      operatorId: String(d.operatorId || 'SUPER-ADMIN-LAO'),
      name: String(d.name || 'Xayraxa Master Administrator'),
      phone: String(d.phone || '+856 20 5599 8888'),
      email: String(d.email || AUTHORIZED_ADMIN_EMAIL),
      roleTitle: String(d.roleTitle || 'Chief Executive & Master CRUD Controller'),
      passwordHash: String(d.passwordHash || ''),
      lastPasswordUpdatedAt: String(d.lastPasswordUpdatedAt || ''),
      ownerUid: String(d.ownerUid || ''),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function fetchCloudMembersOnce(): Promise<CloudMemberRecord[]> {
  const path = 'members';
  try {
    const snap = await getDocs(collection(db, 'members'));
    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        memberId: String(d.memberId || docSnap.id),
        name: String(d.name || ''),
        phone: String(d.phone || ''),
        email: String(d.email || ''),
        passwordHash: String(d.passwordHash || ''),
        membershipState:
          d.membershipState === 'ACTIVE_LIFETIME_MEMBER'
            ? 'ACTIVE_LIFETIME_MEMBER'
            : 'FREE_MEMBER',
        sponsorId: String(d.sponsorId || ''),
        kycStatus:
          d.kycStatus === 'VERIFIED' || d.kycStatus === 'PENDING'
            ? d.kycStatus
            : 'UNVERIFIED',
        avatarUrl: String(d.avatarUrl || ''),
        language: sanitizeLanguage(d.language),
        isAutomaticAffiliate: Boolean(d.isAutomaticAffiliate),
        autoAffiliateCode: d.autoAffiliateCode ? String(d.autoAffiliateCode) : undefined,
        bankSummary: d.bankSummary ? String(d.bankSummary) : undefined,
        ownerUid: String(d.ownerUid || ''),
      };
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export function listenToPublicDirectoryState(
  onData: (state: CloudPublicDirectoryState | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'public_directory/state';
  const ref = doc(db, 'public_directory', 'state');
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(parsePublicDirectorySnap(snap.data() as Record<string, unknown>));
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

export function listenToAdminVaultConfig(
  onData: (vault: CloudAdminVaultConfig | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'admin_vault/super_admin_config';
  const ref = doc(db, 'admin_vault', 'super_admin_config');
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        operatorId: String(d.operatorId || 'SUPER-ADMIN-LAO'),
        name: String(d.name || 'Xayraxa Master Administrator'),
        phone: String(d.phone || '+856 20 5599 8888'),
        email: String(d.email || AUTHORIZED_ADMIN_EMAIL),
        roleTitle: String(d.roleTitle || 'Chief Executive & Master CRUD Controller'),
        passwordHash: String(d.passwordHash || ''),
        lastPasswordUpdatedAt: String(d.lastPasswordUpdatedAt || ''),
        ownerUid: String(d.ownerUid || ''),
      });
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, path);
    }
  );
}

export function listenToCloudMembers(
  onData: (members: CloudMemberRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'members';
  const colRef = collection(db, 'members');
  return onSnapshot(
    colRef,
    (snap) => {
      const list: CloudMemberRecord[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          memberId: String(d.memberId || docSnap.id),
          name: String(d.name || ''),
          phone: String(d.phone || ''),
          email: String(d.email || ''),
          passwordHash: String(d.passwordHash || ''),
          membershipState:
            d.membershipState === 'ACTIVE_LIFETIME_MEMBER'
              ? 'ACTIVE_LIFETIME_MEMBER'
              : 'FREE_MEMBER',
          sponsorId: String(d.sponsorId || ''),
          kycStatus:
            d.kycStatus === 'VERIFIED' || d.kycStatus === 'PENDING'
              ? d.kycStatus
              : 'UNVERIFIED',
          avatarUrl: String(d.avatarUrl || ''),
          language: sanitizeLanguage(d.language),
          isAutomaticAffiliate: Boolean(d.isAutomaticAffiliate),
          autoAffiliateCode: d.autoAffiliateCode ? String(d.autoAffiliateCode) : undefined,
          bankSummary: d.bankSummary ? String(d.bankSummary) : undefined,
          ownerUid: String(d.ownerUid || ''),
        };
      });
      onData(list);
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, path);
    }
  );
}

export async function pushCloudDirectoryAndAdminState(params: {
  superAdminProfile: SuperAdminProfile;
  members: Member[];
  deletedMemberIds: string[];
  existingCloudHashes?: Record<string, string>;
  existingCloudAdminHash?: string;
  syncMemberDocs?: boolean;
}): Promise<CloudPublicDirectoryState> {
  const user = auth.currentUser;
  if (!user || !isVerifiedAdminFirebaseUser(user)) {
    throw new Error(
      `Admin Google Sign-In (${AUTHORIZED_ADMIN_EMAIL}) is required to sync changes to cloud database.`
    );
  }

  const operatorId = sanitizeId(params.superAdminProfile.operatorId || 'SUPER-ADMIN-LAO', 'SUPER-ADMIN-LAO');
  const adminPasswordHash = params.superAdminProfile.passwordPin?.trim()
    ? await hashAccountPassword(operatorId, params.superAdminProfile.passwordPin)
    : params.existingCloudAdminHash || (await hashAccountPassword(operatorId, '888888'));

  const deletedSet = new Set(
    params.deletedMemberIds.map((id) => sanitizeId(id.toUpperCase())).filter(Boolean)
  );
  const boundedDeletedIds = Array.from(deletedSet).slice(0, 200);

  const activeMembers = params.members
    .filter((m) => !deletedSet.has(sanitizeId(m.memberId.toUpperCase())))
    .slice(0, 200);

  const activeSponsorIds: string[] = [];
  const activeSponsorNames: Record<string, string> = {};
  const memberAuthHashes: Record<string, string> = { ...(params.existingCloudHashes || {}) };
  const memberStates: Record<string, Member['membershipState']> = {};

  for (const m of activeMembers) {
    const mid = sanitizeId(m.memberId.toUpperCase());
    activeSponsorIds.push(mid);
    activeSponsorNames[mid] = (m.name || mid).trim().slice(0, 100);
    memberStates[mid] = m.membershipState;
    if (m.password && m.password.trim()) {
      memberAuthHashes[mid] = await hashAccountPassword(mid, m.password.trim());
    } else if (!memberAuthHashes[mid]) {
      memberAuthHashes[mid] = await hashAccountPassword(mid, '123456');
    }
  }

  // Remove deleted members from auth hashes map too
  for (const delId of boundedDeletedIds) {
    delete memberAuthHashes[delId];
    delete activeSponsorNames[delId];
    delete memberStates[delId];
  }

  const publicPayload = {
    schemaVersion: 1,
    adminOperatorId: operatorId,
    adminPasswordHash,
    adminPasswordUpdatedAt: (
      params.superAdminProfile.lastPasswordUpdatedAt || new Date().toISOString()
    ).slice(0, 64),
    deletedMemberIds: boundedDeletedIds,
    activeSponsorIds,
    activeSponsorNames,
    memberAuthHashes,
    memberStates,
    ownerUid: user.uid,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'public_directory', 'state'), publicPayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'public_directory/state');
  }

  const vaultPayload = {
    operatorId,
    name: (params.superAdminProfile.name || 'Xayraxa Master Administrator').trim().slice(0, 120),
    phone: (params.superAdminProfile.phone || '+856 20 5599 8888').trim().slice(0, 40),
    email: (params.superAdminProfile.email || AUTHORIZED_ADMIN_EMAIL).trim().slice(0, 120),
    roleTitle: (
      params.superAdminProfile.roleTitle || 'Chief Executive & Master CRUD Controller'
    )
      .trim()
      .slice(0, 120),
    passwordHash: adminPasswordHash,
    lastPasswordUpdatedAt: (
      params.superAdminProfile.lastPasswordUpdatedAt || new Date().toISOString()
    ).slice(0, 64),
    ownerUid: user.uid,
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, 'admin_vault', 'super_admin_config'), vaultPayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'admin_vault/super_admin_config');
  }

  if (params.syncMemberDocs !== false) {
    let existingMap = new Map<string, boolean>();
    try {
      const existingSnap = await getDocs(collection(db, 'members'));
      existingSnap.forEach((docSnap) => {
        existingMap.set(docSnap.id.toUpperCase(), true);
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'members');
    }

    // Delete removed/deleted member records from Firestore
    for (const delId of boundedDeletedIds) {
      if (existingMap.has(delId)) {
        try {
          await deleteDoc(doc(db, 'members', delId));
        } catch (err) {
          handleFirestoreError(err, OperationType.DELETE, `members/${delId}`);
        }
      }
    }

    // Upsert active member records (preserving createdAt for existing documents)
    for (const m of activeMembers) {
      const mid = sanitizeId(m.memberId.toUpperCase());
      const passwordHash = memberAuthHashes[mid];
      const baseFields = {
        memberId: mid,
        name: (m.name || mid).trim().slice(0, 120),
        phone: (m.phone || '').trim().slice(0, 40),
        email: (m.email || '').trim().slice(0, 120),
        passwordHash,
        membershipState: m.membershipState,
        sponsorId: m.sponsorId ? sanitizeId(m.sponsorId.toUpperCase()) : '',
        kycStatus: m.kycStatus || 'UNVERIFIED',
        avatarUrl: sanitizeSafeUrl(m.avatarUrl),
        language: sanitizeLanguage(m.language),
        isAutomaticAffiliate: Boolean(m.isAutomaticAffiliate),
        autoAffiliateCode: (m.autoAffiliateCode || '').trim().slice(0, 64),
        bankSummary: m.bankAccount
          ? `${m.bankAccount.bankCode || ''} ${m.bankAccount.accountNumber || ''}`.trim().slice(0, 200)
          : '',
        ownerUid: user.uid,
      };

      if (existingMap.has(mid)) {
        try {
          const updateFields = {
            name: baseFields.name,
            phone: baseFields.phone,
            email: baseFields.email,
            passwordHash: baseFields.passwordHash,
            membershipState: baseFields.membershipState,
            sponsorId: baseFields.sponsorId,
            kycStatus: baseFields.kycStatus,
            avatarUrl: baseFields.avatarUrl,
            language: baseFields.language,
            isAutomaticAffiliate: baseFields.isAutomaticAffiliate,
            autoAffiliateCode: baseFields.autoAffiliateCode,
            bankSummary: baseFields.bankSummary,
            ownerUid: baseFields.ownerUid,
            updatedAt: serverTimestamp(),
          };
          await updateDoc(doc(db, 'members', mid), updateFields);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `members/${mid}`);
        }
      } else {
        try {
          await setDoc(doc(db, 'members', mid), {
            ...baseFields,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `members/${mid}`);
        }
      }
    }
  }

  return {
    schemaVersion: 1,
    adminOperatorId: operatorId,
    adminPasswordHash,
    adminPasswordUpdatedAt: publicPayload.adminPasswordUpdatedAt,
    deletedMemberIds: boundedDeletedIds,
    activeSponsorIds,
    activeSponsorNames,
    memberAuthHashes,
    memberStates,
    ownerUid: user.uid,
    updatedAtIso: new Date().toISOString(),
  };
}

export async function pushSingleDeletedMemberToCloud(
  memberId: string,
  allParams: {
    superAdminProfile: SuperAdminProfile;
    members: Member[];
    deletedMemberIds: string[];
    existingCloudHashes?: Record<string, string>;
    existingCloudAdminHash?: string;
  }
): Promise<CloudPublicDirectoryState> {
  const cleanId = sanitizeId(memberId.toUpperCase());
  const user = auth.currentUser;
  if (!user || !isVerifiedAdminFirebaseUser(user)) {
    throw new Error(
      `Admin Google Sign-In (${AUTHORIZED_ADMIN_EMAIL}) required to delete from cloud database.`
    );
  }
  try {
    const ref = doc(db, 'members', cleanId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `members/${cleanId}`);
  }
  return pushCloudDirectoryAndAdminState({
    ...allParams,
    deletedMemberIds: Array.from(new Set([...allParams.deletedMemberIds, cleanId])),
    syncMemberDocs: false,
  });
}

export async function pushNewMemberBySignedInUser(member: Member): Promise<void> {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;
  const mid = sanitizeId(member.memberId.toUpperCase());
  const passwordHash = await hashAccountPassword(mid, member.password || '123456');
  const payload = {
    memberId: mid,
    name: (member.name || mid).trim().slice(0, 120),
    phone: (member.phone || '').trim().slice(0, 40),
    email: (member.email || user.email || '').trim().slice(0, 120),
    passwordHash,
    membershipState: 'FREE_MEMBER' as const,
    sponsorId: member.sponsorId ? sanitizeId(member.sponsorId.toUpperCase()) : '',
    kycStatus: 'UNVERIFIED' as const,
    avatarUrl: sanitizeSafeUrl(member.avatarUrl),
    language: sanitizeLanguage(member.language),
    ownerUid: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  try {
    await setDoc(doc(db, 'members', mid), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `members/${mid}`);
  }
}
