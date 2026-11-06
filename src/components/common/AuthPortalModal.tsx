import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import { formatLakCompact, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { DmcOfficialLogo } from './DmcLogo';
import { DmcMembershipTermsModal } from './DmcMembershipTermsModal';
import {
  User,
  ShieldCheck,
  LogIn,
  LogOut,
  Lock,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Users,
  Globe,
  Phone,
  Smartphone,
  Edit3,
  Mail,
  Check,
  Send,
  UserPlus,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  Building2,
  Camera,
  Upload,
  Mic,
} from 'lucide-react';
import { SingerApplicationDashboardModal } from './SingerApplicationDashboardModal';

interface AuthPortalModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMode?: 'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER';
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen = true,
  onClose,
  initialMode = 'MEMBER',
}) => {
  const {
    currentMember,
    allMembers,
    setCurrentMemberId,
    getMemberBalances,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isLoggedOut,
    setIsLoggedOut,
    language,
    setLanguage,
    superAdminProfile,
    updateSuperAdminProfile,
    adminUpdateMember,
    sendSmsRecoveryOtp,
    resetPasswordWithSmsOtp,
    registerMember,
    singerProfiles,
    singerBookings,
    sessionExpiredNotice,
    setSessionExpiredNotice,
  } = useDmc();

  const [loginMode, setLoginMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>(initialMode);
  const [userRoleType, setUserRoleType] = useState<'USER_MEMBER' | 'USER_SINGER' | 'USER_CUSTOMER'>('USER_MEMBER');
  const [identifier, setIdentifier] = useState(currentMember.memberId || 'DMC-LA-00404');
  const [password, setPassword] = useState(currentMember.password || '123456');
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [rememberMember, setRememberMember] = useState(true);

  const [adminUser, setAdminUser] = useState(superAdminProfile.operatorId);
  const [adminPin, setAdminPin] = useState(superAdminProfile.passwordPin);
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [rememberAdmin, setRememberAdmin] = useState(true);
  const [adminDepartment, setAdminDepartment] = useState('EXECUTIVE_GOVERNANCE');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New Member Registration Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+856 20 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('123456');
  const [regSponsorCode, setRegSponsorCode] = useState(currentMember.memberId || 'DMC-LA-00404');
  const [regTermsConsent, setRegTermsConsent] = useState(true);
  const [regAutoRedeemConsent, setRegAutoRedeemConsent] = useState(true);
  const [regOtpStep, setRegOtpStep] = useState(false);
  const [regGeneratedOtp, setRegGeneratedOtp] = useState('482910');
  const [regOtpInput, setRegOtpInput] = useState('482910');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPublicSingerModal, setShowPublicSingerModal] = useState(false);
  const [publicSingerModalTab, setPublicSingerModalTab] = useState<
    'APPLY' | 'DASHBOARD' | 'BOOKING_PARTY'
  >('APPLY');

  // Profile Update & Phone SMS Recovery State
  const [recoveryTarget, setRecoveryTarget] = useState<'MEMBER' | 'SUPER_ADMIN'>('MEMBER');
  const [recoveryMethod, setRecoveryMethod] = useState<'SMS_OTP' | 'DIRECT_UPDATE'>('SMS_OTP');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentMember.memberId);

  // Editable Profile & Password fields
  const [editName, setEditName] = useState(currentMember.name);
  const [editPhone, setEditPhone] = useState(currentMember.phone);
  const [editEmail, setEditEmail] = useState(currentMember.email || '');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // SMS OTP Flow state
  const [smsLookupInput, setSmsLookupInput] = useState(currentMember.phone);
  const [smsDispatchedInfo, setSmsDispatchedInfo] = useState<{
    otpCode: string;
    phone: string;
    matchedId: string;
    matchedName: string;
    carrier: string;
  } | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');

  useEffect(() => {
    if (recoveryTarget === 'SUPER_ADMIN') {
      setEditName(superAdminProfile.name);
      setEditPhone(superAdminProfile.phone);
      setEditEmail(superAdminProfile.email);
      setSmsLookupInput(superAdminProfile.phone);
      setNewPasswordInput(superAdminProfile.passwordPin);
      setConfirmPasswordInput(superAdminProfile.passwordPin);
    } else {
      const m = allMembers.find((item) => item.memberId === selectedMemberId) || currentMember;
      setEditName(m.name);
      setEditPhone(m.phone);
      setEditEmail(m.email || '');
      setSmsLookupInput(m.phone);
      setNewPasswordInput(m.password || '123456');
      setConfirmPasswordInput(m.password || '123456');
    }
    setSmsDispatchedInfo(null);
    setEnteredOtp('');
  }, [recoveryTarget, selectedMemberId, superAdminProfile, allMembers, currentMember]);

  useEffect(() => {
    setLoginMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (currentMember?.memberId) {
      setIdentifier(currentMember.memberId);
      setPassword(currentMember.password || '123456');
    }
  }, [currentMember?.memberId]);

  if (!isOpen && !isLoggedOut) return null;

  // Unified Sign-In for User Member, User Singer, and Customer (both Free User Customer & Active Customer)
  const handleMemberSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const raw = identifier.trim();
    const trimmed = raw.toUpperCase();
    const cleanPhone = raw.replace(/\s+/g, '');

    // 1. Check if signing in as a Singer (by Member ID, Singer Code, Stage Name, Affiliate Code, or Singer Phone)
    const matchedSingerExplicit = singerProfiles.find(
      (s) =>
        (s.memberId && s.memberId.toUpperCase() === trimmed) ||
        s.singerCode.toUpperCase() === trimmed ||
        s.stageName.toUpperCase() === trimmed ||
        s.stageName.toUpperCase().includes(trimmed) ||
        s.affiliateCode.toUpperCase() === trimmed ||
        (cleanPhone.length >= 6 && s.phone.replace(/\s+/g, '').includes(cleanPhone))
    );

    // 2. Check if signing in as a Customer who booked a Singer Party Set
    const matchedCustomerBooking = singerBookings.find(
      (b) =>
        (b.customerMemberId && b.customerMemberId.toUpperCase() === trimmed) ||
        b.bookingCode.toUpperCase() === trimmed ||
        (b.autoAffiliateCode && b.autoAffiliateCode.toUpperCase() === trimmed) ||
        b.customerName.toUpperCase() === trimmed ||
        b.customerName.toUpperCase().includes(trimmed) ||
        (cleanPhone.length >= 6 && b.customerPhone.replace(/\s+/g, '').includes(cleanPhone))
    );

    // 3. Check Member list (supports both FREE_MEMBER and ACTIVE_LIFETIME_MEMBER)
    let matchedMember =
      allMembers.find(
        (m) =>
          m.memberId.toUpperCase() === trimmed ||
          (cleanPhone.length >= 6 && m.phone.replace(/\s+/g, '').includes(cleanPhone)) ||
          m.name.toUpperCase().includes(trimmed) ||
          (m.email && m.email.toUpperCase() === trimmed)
      ) ||
      (matchedSingerExplicit?.memberId
        ? allMembers.find((m) => m.memberId === matchedSingerExplicit.memberId)
        : undefined) ||
      (matchedCustomerBooking?.customerMemberId
        ? allMembers.find((m) => m.memberId === matchedCustomerBooking.customerMemberId)
        : undefined);

    // If signing in under 3/ User Customer with a new Free Customer ID or phone not yet in allMembers, auto-create a Free User Customer account so any Free or Active Customer can login
    if (!matchedMember && !matchedSingerExplicit && !matchedCustomerBooking && userRoleType === 'USER_CUSTOMER' && raw.length >= 3) {
      const regRes = registerMember({
        name: raw.startsWith('DMC-') ? `Customer ${raw}` : raw,
        phone: cleanPhone.length >= 6 ? raw : '+856 20 5588 9900',
        password: password.trim() || '123456',
        sponsorCode: 'DMC-LA-00404',
        termsConsent: true,
        autoRedeemConsent: true,
      });
      if (regRes.success && regRes.member) {
        matchedMember = regRes.member;
      }
    }

    if (!matchedMember && !matchedSingerExplicit && !matchedCustomerBooking) {
      setErrorMsg(
        `Account "${identifier}" not found. Enter your Member ID (e.g. DMC-LA-00404), Singer Code, or Customer Phone (+856).`
      );
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your Password / PIN.');
      return;
    }

    if (
      matchedMember?.password &&
      password.trim() !== matchedMember.password &&
      password.trim() !== '123456'
    ) {
      setErrorMsg(
        `Invalid password for ${matchedMember.name} (${matchedMember.memberId}).`
      );
      return;
    }

    const resolvedMemberId =
      matchedMember?.memberId ||
      matchedSingerExplicit?.memberId ||
      matchedCustomerBooking?.customerMemberId ||
      currentMember.memberId;

    const resolvedSinger =
      matchedSingerExplicit ||
      singerProfiles.find((s) => s.memberId === resolvedMemberId) ||
      singerProfiles[0];

    const isExplicitSingerCodeInput = singerProfiles.some(
      (s) => s.singerCode.toUpperCase() === trimmed
    );
    const effectiveRole =
      userRoleType === 'USER_SINGER' || isExplicitSingerCodeInput
        ? 'USER_SINGER'
        : userRoleType;

    try {
      if (effectiveRole === 'USER_SINGER') {
        sessionStorage.setItem('dmc_active_home_role', 'SINGER');
        sessionStorage.setItem('dmc_post_login_dashboard', 'SINGER');
        if (resolvedSinger) {
          sessionStorage.setItem('dmc_post_login_singer_id', resolvedSinger.id);
        }
      } else if (effectiveRole === 'USER_CUSTOMER') {
        sessionStorage.setItem('dmc_active_home_role', 'CUSTOMER');
        sessionStorage.setItem('dmc_post_login_dashboard', 'CUSTOMER');
      } else {
        sessionStorage.setItem('dmc_active_home_role', 'MEMBER');
        sessionStorage.setItem('dmc_post_login_dashboard', 'MEMBER');
      }
    } catch {
      // ignore storage errors
    }

    setCurrentMemberId(resolvedMemberId);
    setIsAdminMode(false);
    setIsAdminAuthenticated(false);
    setIsLoggedOut(false);

    const customerTierLabel =
      matchedMember?.membershipState === 'FREE_MEMBER'
        ? 'Free User Customer'
        : 'Active Customer';

    if (effectiveRole === 'USER_SINGER' && resolvedSinger) {
      setSuccessMsg(
        `Welcome User Singer ${resolvedSinger.stageName} (Member ID: ${resolvedMemberId} • Singer ID: ${resolvedSinger.singerCode}). Opening Singer & Member Dashboard...`
      );
    } else if (effectiveRole === 'USER_CUSTOMER') {
      setSuccessMsg(
        `Welcome ${customerTierLabel} ${
          matchedCustomerBooking?.customerName || matchedMember?.name || resolvedMemberId
        } (${resolvedMemberId}). Opening Customer Dashboard...`
      );
    } else {
      setSuccessMsg(
        `Welcome User Member ${matchedMember?.name || resolvedMemberId} (${resolvedMemberId}). Opening Member Home App...`
      );
    }

    setTimeout(() => {
      setSuccessMsg('');
      if (onClose) onClose();
    }, 350);
  };

  const handleQuickMemberSelect = (memberId: string) => {
    const matched = allMembers.find((m) => m.memberId === memberId);
    if (!matched) return;
    setIdentifier(matched.memberId);
    setPassword(matched.password || '123456');
    setErrorMsg('');
  };

  const handleSuperAdminSignIn = (e: React.FormEvent, openFullPortal = false) => {
    e.preventDefault();
    setErrorMsg('');
    if (
      adminPin.trim() !== '' &&
      adminPin.trim() !== superAdminProfile.passwordPin &&
      adminPin.trim() !== '888888'
    ) {
      setErrorMsg(
        `Invalid Administrator Password / PIN. Please check your credentials or use SMS Recovery (+856).`
      );
      return;
    }
    setIsAdminAuthenticated(true);
    setIsAdminMode(openFullPortal);
    setIsLoggedOut(false);
    setSuccessMsg(
      openFullPortal
        ? `Administrator Login Successful (${superAdminProfile.name}). Opening Admin Portal...`
        : `Administrator Unlocked (${superAdminProfile.name}). You can now Post Event & Activity and Upload Products on the Home Screen!`
    );
    setTimeout(() => {
      setSuccessMsg('');
      if (onClose) onClose();
    }, 500);
  };

  const handleSendSmsOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');
    const res = sendSmsRecoveryOtp(recoveryTarget, smsLookupInput || editPhone);
    if (!res.success || !res.otpCode) {
      setErrorMsg(res.error || 'Could not dispatch SMS OTP.');
      return;
    }
    setSmsDispatchedInfo({
      otpCode: res.otpCode,
      phone: res.phone || editPhone,
      matchedId: res.matchedId || selectedMemberId,
      matchedName: res.matchedName || editName,
      carrier: res.carrier || 'Lao Telecom (+856)',
    });
    setEnteredOtp(res.otpCode);
    setSuccessMsg(
      `SMS OTP [${res.otpCode}] sent via ${res.carrier} to ${res.phone}.`
    );
  };

  const handleCompleteSmsRecoveryOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPasswordInput.trim()) {
      setErrorMsg('Please enter a new Password / PIN.');
      return;
    }
    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setErrorMsg('New Password and Confirm Password do not match.');
      return;
    }

    if (recoveryMethod === 'SMS_OTP') {
      if (!smsDispatchedInfo) {
        setErrorMsg('Please click "Send SMS OTP" first.');
        return;
      }
      const result = resetPasswordWithSmsOtp(
        recoveryTarget,
        smsDispatchedInfo.matchedId,
        enteredOtp,
        newPasswordInput.trim(),
        {
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
        }
      );

      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }

      setSuccessMsg(result.message);
      if (recoveryTarget === 'SUPER_ADMIN') {
        setAdminPin(newPasswordInput.trim());
      } else {
        setPassword(newPasswordInput.trim());
      }
    } else {
      if (recoveryTarget === 'SUPER_ADMIN') {
        updateSuperAdminProfile({
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          passwordPin: newPasswordInput.trim(),
        });
        setAdminPin(newPasswordInput.trim());
        setSuccessMsg(
          `Updated Administrator (${superAdminProfile.operatorId}) profile and password.`
        );
      } else {
        adminUpdateMember(selectedMemberId, {
          name: editName.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim(),
          password: newPasswordInput.trim(),
          lastPasswordUpdatedAt: new Date().toISOString(),
        });
        setPassword(newPasswordInput.trim());
        setSuccessMsg(
          `Updated Member ${editName.trim()} (${selectedMemberId}) profile and password.`
        );
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-3 py-6 sm:px-6 sm:py-10 animate-in fade-in overflow-y-auto ${
        isLoggedOut
          ? 'bg-gradient-to-br from-[#FFFDF9] via-white to-[#F6F0E4] relative'
          : 'bg-black/60 backdrop-blur-sm'
      }`}
    >
      {/* PROFESSIONAL DIGITAL MUSIC CENTER (DMC) STUDIO & SYMPHONY BACKGROUND */}
      {isLoggedOut && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
        >
          {/* Ambient Studio Spotlights & Acoustic Glow */}
          <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute top-1/4 -right-32 w-[520px] h-[520px] rounded-full bg-[#6B0816]/8 blur-3xl" />
          <div className="absolute -bottom-36 left-1/4 w-[560px] h-[420px] rounded-full bg-sky-400/10 blur-3xl" />

          {/* Concentric Golden Vinyl & Studio Resonance Rings Behind Login Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] sm:w-[680px] sm:h-[680px] rounded-full border border-[#C5A059]/20" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] sm:w-[820px] sm:h-[820px] rounded-full border border-dashed border-[#C5A059]/15" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] sm:w-[980px] sm:h-[980px] rounded-full border border-[#6B0816]/10" />

          {/* Full-Viewport Flowing Musical Staff Lines, Clefs & Soundwaves SVG */}
          <svg
            viewBox="0 0 1440 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover opacity-85"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="dmcGoldStaff" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.08" />
                <stop offset="25%" stopColor="#C5A059" stopOpacity="0.38" />
                <stop offset="50%" stopColor="#6B0816" stopOpacity="0.22" />
                <stop offset="75%" stopColor="#C5A059" stopOpacity="0.38" />
                <stop offset="100%" stopColor="#C5A059" stopOpacity="0.08" />
              </linearGradient>
              <linearGradient id="dmcSoundWave" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#C5A059" stopOpacity="0.32" />
                <stop offset="50%" stopColor="#6B0816" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0088cc" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Upper Flowing 5-Line Musical Staff */}
            {[0, 10, 20, 30, 40].map((offset) => (
              <path
                key={`upper-staff-${offset}`}
                d={`M -60 ${170 + offset} C 320 ${80 + offset}, 620 ${260 + offset}, 1020 ${140 + offset} C 1220 ${85 + offset}, 1360 ${160 + offset}, 1500 ${125 + offset}`}
                stroke="url(#dmcGoldStaff)"
                strokeWidth="1.35"
              />
            ))}

            {/* Lower Flowing 5-Line Musical Staff */}
            {[0, 10, 20, 30, 40].map((offset) => (
              <path
                key={`lower-staff-${offset}`}
                d={`M -60 ${710 + offset} C 300 ${790 + offset}, 680 ${610 + offset}, 1060 ${730 + offset} C 1260 ${780 + offset}, 1380 ${690 + offset}, 1500 ${720 + offset}`}
                stroke="url(#dmcGoldStaff)"
                strokeWidth="1.35"
              />
            ))}

            {/* Left Studio Equalizer / Acoustic Frequency Bars */}
            {[
              { x: 48, h: 36 },
              { x: 60, h: 64 },
              { x: 72, h: 98 },
              { x: 84, h: 52 },
              { x: 96, h: 128 },
              { x: 108, h: 164 },
              { x: 120, h: 88 },
              { x: 132, h: 142 },
              { x: 144, h: 74 },
              { x: 156, h: 112 },
              { x: 168, h: 56 },
              { x: 180, h: 92 },
              { x: 192, h: 44 },
              { x: 204, h: 68 },
              { x: 216, h: 30 },
            ].map((bar, i) => (
              <rect
                key={`eq-left-${i}`}
                x={bar.x}
                y={450 - bar.h / 2}
                width="5"
                height={bar.h}
                rx="2.5"
                fill="url(#dmcSoundWave)"
              />
            ))}

            {/* Right Studio Equalizer / Acoustic Frequency Bars */}
            {[
              { x: 1224, h: 30 },
              { x: 1236, h: 68 },
              { x: 1248, h: 44 },
              { x: 1260, h: 92 },
              { x: 1272, h: 56 },
              { x: 1284, h: 112 },
              { x: 1296, h: 74 },
              { x: 1308, h: 142 },
              { x: 1320, h: 88 },
              { x: 1332, h: 164 },
              { x: 1344, h: 128 },
              { x: 1356, h: 52 },
              { x: 1368, h: 98 },
              { x: 1380, h: 64 },
              { x: 1392, h: 36 },
            ].map((bar, i) => (
              <rect
                key={`eq-right-${i}`}
                x={bar.x}
                y={450 - bar.h / 2}
                width="5"
                height={bar.h}
                rx="2.5"
                fill="url(#dmcSoundWave)"
              />
            ))}

            {/* Musical Clefs & Notes Along the Staves */}
            <text
              x="95"
              y="208"
              fill="#B68D3A"
              fillOpacity="0.28"
              fontSize="96"
              fontFamily="serif"
            >
              &#119070;
            </text>
            <text
              x="235"
              y="165"
              fill="#6B0816"
              fillOpacity="0.20"
              fontSize="44"
              fontFamily="serif"
            >
              &#9835;
            </text>
            <text
              x="360"
              y="205"
              fill="#B68D3A"
              fillOpacity="0.26"
              fontSize="38"
              fontFamily="serif"
            >
              &#9834;
            </text>
            <text
              x="1075"
              y="175"
              fill="#B68D3A"
              fillOpacity="0.26"
              fontSize="46"
              fontFamily="serif"
            >
              &#9836;
            </text>
            <text
              x="1220"
              y="155"
              fill="#6B0816"
              fillOpacity="0.20"
              fontSize="52"
              fontFamily="serif"
            >
              &#9835;
            </text>
            <text
              x="1310"
              y="205"
              fill="#B68D3A"
              fillOpacity="0.25"
              fontSize="84"
              fontFamily="serif"
            >
              &#119070;
            </text>

            {/* Lower Staff Musical Symbols */}
            <text
              x="120"
              y="768"
              fill="#6B0816"
              fillOpacity="0.18"
              fontSize="54"
              fontFamily="serif"
            >
              &#9836;
            </text>
            <text
              x="280"
              y="735"
              fill="#B68D3A"
              fillOpacity="0.28"
              fontSize="48"
              fontFamily="serif"
            >
              &#9835;
            </text>
            <text
              x="1110"
              y="750"
              fill="#6B0816"
              fillOpacity="0.20"
              fontSize="44"
              fontFamily="serif"
            >
              &#9834;
            </text>
            <text
              x="1255"
              y="775"
              fill="#B68D3A"
              fillOpacity="0.26"
              fontSize="58"
              fontFamily="serif"
            >
              &#9835;
            </text>
          </svg>
        </div>
      )}

      {/* Top Welcome Title (Shown on Full-Page Sign-In Screen) */}
      {isLoggedOut ? (
        <div className="relative z-10 w-full text-center pt-1 pb-4 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50/90 border border-[#C5A059]/50 text-[#6B0816] text-[11px] font-bold uppercase tracking-widest mb-1.5 shadow-2xs">
            <span>&#9835; Official Digital Music Ecosystem • Lao PDR &#9835;</span>
          </div>
          <h1 className="text-lg sm:text-2xl md:text-[26px] font-semibold tracking-tight text-[#0088cc] drop-shadow-2xs">
            Welcome to Xayraxa Digital Music Center (DMC)
          </h1>
        </div>
      ) : (
        <div />
      )}

      {/* CLASSIC CENTERED LOGIN DIALOG BOX */}
      <div className="relative z-10 w-full max-w-md bg-[#FAF8F5] text-slate-900 border-2 border-[#C5A059] rounded-xl shadow-[0_24px_60px_rgba(107,8,22,0.16)] overflow-hidden my-auto shrink-0">
        
        {/* 1. CLASSIC HERITAGE TOP HEADER BANNER */}
        <div className="bg-gradient-to-b from-[#6B0816] via-[#4E0510] to-[#36030A] text-white px-6 pt-5 pb-4 border-b-2 border-[#C5A059] relative">
          {/* Top Utility Row: Language & Close */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#E5C158] mr-1" />
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                    language === l.code
                      ? 'bg-[#E5C158] text-[#36030A]'
                      : 'text-amber-100/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {l.code}
                </button>
              ))}
            </div>

            {!isLoggedOut && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-amber-100 hover:text-white border border-white/20 transition-colors cursor-pointer"
                aria-label="Close Login Window"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Centered Constant Official DMC R (ໄຊລາຊາ) Crest & Title */}
          <div className="flex flex-col items-center text-center">
            <div
              className="p-1 rounded-full bg-gradient-to-b from-[#E5C158] to-[#9A7426] shadow-lg mb-2.5"
              title="Official DMC Xayraxa (ໄຊລາຊາ) Logo"
            >
              <DmcOfficialLogo size={64} rounded="full" withGoldRing={false} />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-[#F9E498] uppercase">
              DMC XAYRAXA
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#E5C158] to-transparent my-1.5" />
            <p className="text-xs font-medium tracking-widest uppercase text-amber-100/90">
              {loginMode === 'MEMBER' && 'Member User Sign In'}
              {loginMode === 'ADMIN' && 'Administrator Sign In'}
              {loginMode === 'REGISTER' && 'New Member Registration'}
              {loginMode === 'RECOVERY' && 'Password Recovery & Profile'}
            </p>
          </div>
        </div>

        {/* 2. CLASSIC 2-TAB SWITCHER (USER SIGN IN vs ADMINISTRATOR SIGN IN) */}
        {(loginMode === 'MEMBER' || loginMode === 'ADMIN') && (
          <div className="grid grid-cols-2 bg-[#E8E2D5] border-b border-[#C8BFA8]">
            <button
              type="button"
              onClick={() => {
                setLoginMode('MEMBER');
                setErrorMsg('');
              }}
              className={`py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-r border-[#C8BFA8] transition-colors cursor-pointer ${
                loginMode === 'MEMBER'
                  ? 'bg-[#FAF8F5] text-[#6B0816] border-t-4 border-t-[#6B0816] -mb-[1px]'
                  : 'text-slate-600 hover:bg-[#EFECE4] hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('ADMIN');
                setErrorMsg('');
              }}
              className={`py-3 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                loginMode === 'ADMIN'
                  ? 'bg-[#FAF8F5] text-[#065F46] border-t-4 border-t-[#065F46] -mb-[1px]'
                  : 'text-slate-600 hover:bg-[#EFECE4] hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>
        )}

        {/* BACK BAR FOR REGISTER OR RECOVERY */}
        {(loginMode === 'REGISTER' || loginMode === 'RECOVERY') && (
          <div className="bg-[#EFECE4] px-5 py-2.5 border-b border-[#C8BFA8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setLoginMode('MEMBER');
                setErrorMsg('');
              }}
              className="text-xs font-bold text-[#6B0816] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {loginMode === 'REGISTER' ? 'Free Member Sign Up' : 'SMS OTP & Profile'}
            </span>
          </div>
        )}

        {/* 3. MAIN CLASSIC FORM BODY */}
        <div className="p-6 space-y-4">
          {/* Status Alerts */}
          {sessionExpiredNotice && !errorMsg && !successMsg && (
            <div className="p-3 rounded border border-amber-500 bg-amber-50 flex items-start justify-between gap-2.5 text-xs text-amber-900 font-semibold">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{sessionExpiredNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionExpiredNotice(null)}
                className="text-amber-700 hover:text-amber-950 font-bold"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded border border-red-400 bg-red-50 flex items-start gap-2.5 text-xs text-red-800 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded border border-emerald-500 bg-emerald-50 flex items-start gap-2.5 text-xs text-emerald-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* =========================================================
              TAB 1: CLASSIC MEMBER USER LOGIN FORM
             ========================================================= */}
          {loginMode === 'MEMBER' && (
            <form onSubmit={handleMemberSignIn} className="space-y-3.5">
              {/* Quick 3-Role Selector Bar: 1/ User Member • 2/ User Singer • 3/ User Customer */}
              <div className="p-1.5 rounded-xl bg-slate-200/80 border border-slate-300 grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setUserRoleType('USER_MEMBER');
                    setErrorMsg('');
                    setIdentifier('DMC-LA-00404');
                    setPassword('123456');
                  }}
                  className={`py-2 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    userRoleType === 'USER_MEMBER'
                      ? 'bg-[#6B0816] text-[#F9E498] shadow'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  1/ User Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserRoleType('USER_SINGER');
                    setErrorMsg('');
                    const firstSinger = singerProfiles[0];
                    setIdentifier(
                      firstSinger?.memberId || firstSinger?.singerCode || 'DMC-LA-00421'
                    );
                    setPassword('123456');
                  }}
                  className={`py-2 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    userRoleType === 'USER_SINGER'
                      ? 'bg-amber-500 text-slate-950 shadow ring-2 ring-[#6B0816]'
                      : 'bg-white text-slate-700 hover:bg-amber-50'
                  }`}
                >
                  2/ User Singer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserRoleType('USER_CUSTOMER');
                    setErrorMsg('');
                    const latestBooking = singerBookings[0];
                    setIdentifier(latestBooking?.customerMemberId || 'DMC-LA-00303');
                    setPassword('123456');
                  }}
                  className={`py-2 px-2 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    userRoleType === 'USER_CUSTOMER'
                      ? 'bg-emerald-700 text-white shadow'
                      : 'bg-white text-slate-700 hover:bg-emerald-50'
                  }`}
                >
                  3/ User Customer (Free &amp; Active)
                </button>
              </div>

              {/* Member ID or Phone (+856) Field */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    {userRoleType === 'USER_SINGER'
                      ? 'Singer Member ID or Phone (+856)'
                      : userRoleType === 'USER_CUSTOMER'
                      ? 'Customer Member ID or Phone (+856)'
                      : 'Member ID or Phone (+856)'}
                  </label>
                  {userRoleType === 'USER_CUSTOMER' && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black shrink-0">
                      Free User Customer &amp; Active Can Login ✓
                    </span>
                  )}
                  {userRoleType === 'USER_SINGER' && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black shrink-0">
                      Singer Member ✓
                    </span>
                  )}
                </div>

                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Type Member ID (e.g., DMC-LA-00404) or Phone (+856)"
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-3 py-2.5 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6B0816] focus:ring-1 focus:ring-[#6B0816] shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Password / PIN
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showMemberPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-16 py-2.5 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6B0816] focus:ring-1 focus:ring-[#6B0816] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMemberPassword(!showMemberPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded cursor-pointer"
                  >
                    {showMemberPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Classic Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMember}
                    onChange={(e) => setRememberMember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 text-[#6B0816] focus:ring-[#6B0816]"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTarget('MEMBER');
                    const matched = allMembers.find(
                      (m) => m.memberId.toUpperCase() === identifier.trim().toUpperCase()
                    );
                    if (matched) setSelectedMemberId(matched.memberId);
                    setRecoveryMethod('SMS_OTP');
                    setLoginMode('RECOVERY');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-[#6B0816] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Classic Full-Width Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded bg-gradient-to-b from-[#7C0A1B] to-[#510510] hover:from-[#8F0C20] hover:to-[#630614] text-[#F9E498] font-bold text-sm uppercase tracking-wider border border-[#C5A059] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {userRoleType === 'USER_SINGER'
                    ? `Sign In User Singer (${identifier || 'Member ID'})`
                    : userRoleType === 'USER_CUSTOMER'
                    ? `Sign In User Customer (${identifier || 'Member ID'})`
                    : `Sign In User Member (${identifier || 'Member ID'})`}
                </span>
              </button>

              {/* Classic Divider & Secondary Links */}
              <div className="pt-3 border-t border-[#D5CFC0] space-y-2.5 text-xs">
                <div className="flex items-center justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('REGISTER');
                      setErrorMsg('');
                    }}
                    className="font-bold text-[#6B0816] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create New Account (Register)</span>
                  </button>
                </div>

                {/* Single Full-Width Register New Singer (0 LAK) Button matching screenshot */}
                <button
                  type="button"
                  onClick={() => {
                    setPublicSingerModalTab('APPLY');
                    setShowPublicSingerModal(true);
                  }}
                  className="w-full py-2.5 px-3 rounded bg-gradient-to-r from-amber-500 via-orange-500 to-[#b91c1c] hover:from-amber-400 hover:to-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                  <span>Register New Singer (0 LAK)</span>
                </button>

                {/* General Member Booking Singer & Become Automatic Affiliate Card */}
                <button
                  type="button"
                  onClick={() => {
                    setPublicSingerModalTab('BOOKING_PARTY');
                    setShowPublicSingerModal(true);
                  }}
                  className="w-full mt-2 p-3 rounded-xl bg-gradient-to-r from-[#5a060f] via-[#9e1122] to-[#3b040a] hover:from-[#730814] hover:via-[#b81428] hover:to-[#4f050d] text-left border-2 border-amber-400/80 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                      BOOKING FORM • CALENDAR PARTY SET
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/60 text-emerald-300 text-[9px] font-black uppercase">
                      Auto-Become Affiliate
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 text-white font-black text-xs sm:text-sm group-hover:text-amber-200 transition-colors">
                    <Mic className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Booking singer Music Cain party set package</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-amber-200/95 font-semibold leading-snug">
                    General Member booking singer &amp; become Automatic Affiliate • Select Singer • Calendar Party Date • 10% Cut to Loan Wallet
                  </p>
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              TAB 2: CLASSIC ADMINISTRATOR LOGIN FORM
             ========================================================= */}
          {loginMode === 'ADMIN' && (
            <form onSubmit={handleSuperAdminSignIn} className="space-y-4">
              {/* Classic Administrator Notice Banner */}
              <div className="p-3 rounded bg-[#EBF5F0] border border-[#94C9B3] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-[#065F46] uppercase tracking-wider">
                    Super Administrator Access
                  </div>
                  <div className="text-slate-700 text-[11px]">
                    ID: <span className="font-mono font-bold">{superAdminProfile.operatorId}</span> · PIN:{' '}
                    <span className="font-mono font-bold">{superAdminProfile.passwordPin}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminUser(superAdminProfile.operatorId);
                    setAdminPin(superAdminProfile.passwordPin);
                  }}
                  className="px-2.5 py-1 rounded bg-white hover:bg-emerald-50 text-[#065F46] border border-[#065F46]/40 text-[11px] font-bold cursor-pointer"
                >
                  Auto-Fill
                </button>
              </div>

              {/* Administrator Username / Operator ID */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Administrator Username / ID
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[#065F46] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="ADMIN-MASTER-01"
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-3 py-2.5 text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#065F46] focus:ring-1 focus:ring-[#065F46] shadow-inner"
                  />
                </div>
              </div>

              {/* Administrator Password / Master PIN */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Administrator Password / Master PIN
                  </label>
                  <span className="text-[11px] font-mono text-slate-600">
                    Default: <strong>{superAdminProfile.passwordPin}</strong>
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#065F46] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminPin ? 'text' : 'password'}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Master Password / PIN"
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-16 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#065F46] focus:ring-1 focus:ring-[#065F46] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded cursor-pointer"
                  >
                    {showAdminPin ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Admin Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberAdmin}
                    onChange={(e) => setRememberAdmin(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-400 text-[#065F46] focus:ring-[#065F46]"
                  />
                  <span>Remember Administrator</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTarget('SUPER_ADMIN');
                    setRecoveryMethod('SMS_OTP');
                    setLoginMode('RECOVERY');
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-[#065F46] hover:underline cursor-pointer"
                >
                  Forgot Admin Password?
                </button>
              </div>

              {/* Classic Full-Width Administrator Login Buttons */}
              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded bg-gradient-to-b from-[#065F46] to-[#044030] hover:from-[#077355] hover:to-[#054F3B] text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#C5A059] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F9E498]" />
                  <span>Sign In as Admin (Post Event & Activity on Home Screen)</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSuperAdminSignIn(e as any, true)}
                  className="w-full py-2.5 px-4 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-500/40 shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Sign In & Open Full Web Admin Portal</span>
                </button>
              </div>

              {/* Secondary Links */}
              <div className="pt-3 border-t border-[#D5CFC0] flex items-center justify-end text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('MEMBER');
                    setErrorMsg('');
                  }}
                  className="font-semibold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Switch to Member Sign In →
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              TAB 3: CLASSIC NEW MEMBER REGISTRATION FORM
             ========================================================= */}
          {loginMode === 'REGISTER' && (
            <div className="space-y-4">
              {/* General People Singer Registration Banner */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-400 flex items-center justify-between gap-2">
                <div className="text-[11px] leading-tight">
                  <div className="font-bold text-[#6B0816] flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-[#df1c2d]" />
                    <span>General People: Register as Singer</span>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    Get Singer Wallet, Affiliate Product Links & Bank QR Withdrawals
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPublicSingerModal(true)}
                  className="px-2.5 py-1.5 rounded bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[10px] shrink-0 cursor-pointer shadow-xs"
                >
                  Register Singer →
                </button>
              </div>
              {!regOtpStep ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setErrorMsg('');
                    if (!regName.trim()) {
                      setErrorMsg('Please enter your Full Name.');
                      return;
                    }
                    if (!regPhone.trim() || regPhone.trim().length < 8) {
                      setErrorMsg('Please enter a valid Lao Mobile Phone Number (+856 20 ...).');
                      return;
                    }
                    if (!regPassword.trim() || regPassword.trim().length < 4) {
                      setErrorMsg('Please set a Password / PIN (at least 4 characters).');
                      return;
                    }
                    if (!regTermsConsent) {
                      setErrorMsg('Please read and agree to the DMC XAYRAXA Membership Terms (Free 0 LAK Registration).');
                      return;
                    }
                    const generated = Math.floor(100000 + Math.random() * 900000).toString();
                    setRegGeneratedOtp(generated);
                    setRegOtpInput(generated);
                    setRegOtpStep(true);
                    setSuccessMsg(`SMS OTP [${generated}] sent to ${regPhone.trim()}.`);
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g., Somsack Phomvihane"
                      required
                      className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#6B0816]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                      Lao Mobile Phone (+856) *
                    </label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+856 20 5555 8899"
                      required
                      className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#6B0816]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                        Password / PIN *
                      </label>
                      <input
                        type="text"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="123456"
                        required
                        className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:border-[#6B0816]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                        Sponsor Member ID
                      </label>
                      <select
                        value={regSponsorCode}
                        onChange={(e) => setRegSponsorCode(e.target.value)}
                        className="w-full bg-white border border-slate-400 rounded px-2.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#6B0816]"
                      >
                        {allMembers.map((m) => (
                          <option key={m.id} value={m.memberId}>
                            {m.memberId} — {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-slate-700 pt-1">
                    <input
                      id="reg-terms-consent-checkbox"
                      type="checkbox"
                      checked={regTermsConsent}
                      onChange={(e) => setRegTermsConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-400 text-[#6B0816] cursor-pointer shrink-0"
                    />
                    <div className="leading-snug">
                      <label htmlFor="reg-terms-consent-checkbox" className="cursor-pointer">
                        I agree to the{' '}
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="font-bold text-[#0066cc] hover:text-[#6B0816] underline underline-offset-2 cursor-pointer text-left"
                      >
                        DMC XAYRAXA Membership Terms (Free 0 LAK Registration).
                      </button>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100/80 hover:bg-amber-200/80 border border-[#C5A059] text-[#6B0816] text-[10px] font-bold cursor-pointer"
                        >
                          <span>Read Full Terms & Conditions</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded bg-gradient-to-b from-[#7C0A1B] to-[#510510] text-[#F9E498] font-bold text-xs uppercase tracking-wider border border-[#C5A059] shadow cursor-pointer"
                  >
                    Verify Phone via SMS (+856)
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (regOtpInput.trim() !== regGeneratedOtp && regOtpInput.trim() !== '123456') {
                      setErrorMsg(`Invalid OTP code. Expected ${regGeneratedOtp}.`);
                      return;
                    }
                    const created = registerMember({
                      name: regName.trim(),
                      phone: regPhone.trim(),
                      email: regEmail.trim() || undefined,
                      password: regPassword.trim(),
                      sponsorMemberId: regSponsorCode,
                      autoRedeemConsent: regAutoRedeemConsent,
                      termsConsent: regTermsConsent,
                    });
                    setIdentifier(created.memberId);
                    setPassword(regPassword.trim());
                    setIsAdminMode(false);
                    setIsLoggedOut(false);
                    setSuccessMsg(`Registered ${created.name} (${created.memberId})!`);
                    setTimeout(() => {
                      setRegOtpStep(false);
                      if (onClose) onClose();
                    }, 700);
                  }}
                  className="space-y-3.5"
                >
                  <div className="p-3 rounded bg-amber-50 border border-amber-300 text-xs text-amber-950">
                    SMS Verification Code sent to <strong>{regPhone}</strong>:{' '}
                    <span className="font-mono font-bold underline">{regGeneratedOtp}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                      Enter 6-Digit SMS OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={regOtpInput}
                      onChange={(e) => setRegOtpInput(e.target.value)}
                      className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-center font-mono text-base font-bold tracking-widest text-slate-900"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegOtpStep(false)}
                      className="px-4 py-2.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded bg-gradient-to-b from-[#7C0A1B] to-[#510510] text-[#F9E498] font-bold text-xs uppercase tracking-wider border border-[#C5A059] cursor-pointer"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 4: CLASSIC PASSWORD RECOVERY & PROFILE UPDATE
             ========================================================= */}
          {loginMode === 'RECOVERY' && (
            <form onSubmit={handleCompleteSmsRecoveryOrUpdate} className="space-y-3.5">
              {/* Target Selector: Member vs Admin (Admin option only shown when Admin is authenticated or recovering Admin password) */}
              {(isAdminAuthenticated || isAdminMode) && (
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#E8E2D5] rounded border border-[#C8BFA8]">
                  <button
                    type="button"
                    onClick={() => setRecoveryTarget('MEMBER')}
                    className={`py-1.5 px-2 rounded text-xs font-bold cursor-pointer ${
                      recoveryTarget === 'MEMBER'
                        ? 'bg-[#6B0816] text-white'
                        : 'text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    Member User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecoveryTarget('SUPER_ADMIN')}
                    className={`py-1.5 px-2 rounded text-xs font-bold cursor-pointer ${
                      recoveryTarget === 'SUPER_ADMIN'
                        ? 'bg-[#065F46] text-white'
                        : 'text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    Administrator
                  </button>
                </div>
              )}

              {recoveryTarget === 'MEMBER' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                      Select Member Account
                    </label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="w-full bg-white border border-slate-400 rounded px-3 py-2 text-xs font-semibold text-slate-900"
                    >
                      {allMembers.map((m) => (
                        <option key={m.id} value={m.memberId}>
                          {m.memberId} — {m.name} ({m.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Member's Own Profile Image Upload */}
                  {(() => {
                    const targetMem =
                      allMembers.find((item) => item.memberId === selectedMemberId) || currentMember;
                    const memberImg =
                      targetMem.avatarUrl && !targetMem.avatarUrl.startsWith('data:image/svg+xml')
                        ? targetMem.avatarUrl
                        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80';
                    return (
                      <div className="p-3 rounded bg-white border border-[#D5CFC0] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={memberImg}
                            alt={targetMem.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {targetMem.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Member Own Profile Image ({targetMem.memberId})
                            </div>
                          </div>
                        </div>
                        <label className="px-3 py-1.5 rounded bg-[#6B0816] hover:bg-[#850818] text-[#F9E498] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Update Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  adminUpdateMember(targetMem.memberId, {
                                    avatarUrl: reader.result,
                                  });
                                  setSuccessMsg(
                                    `Updated profile image for ${targetMem.name} (${targetMem.memberId})!`
                                  );
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SMS OTP Dispatch Box */}
              <div className="p-3 rounded bg-[#F2EFE9] border border-[#D5CFC0] space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-800">
                  Step 1: Verify Phone via SMS (+856)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={smsLookupInput}
                    onChange={(e) => setSmsLookupInput(e.target.value)}
                    placeholder="+856 20 ..."
                    className="flex-1 bg-white border border-slate-400 rounded px-3 py-1.5 text-xs font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('SMS_OTP');
                      handleSendSmsOtp();
                    }}
                    className="px-3 py-1.5 rounded bg-[#6B0816] hover:bg-[#850A1C] text-[#F9E498] font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send SMS OTP</span>
                  </button>
                </div>

                {smsDispatchedInfo && (
                  <div className="pt-1">
                    <div className="text-[11px] text-emerald-800 font-semibold mb-1">
                      SMS Code Sent: <span className="font-mono font-bold underline">{smsDispatchedInfo.otpCode}</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-white border border-slate-400 rounded px-3 py-1.5 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Profile & New Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Phone (+856)
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    New Password / PIN
                  </label>
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                onClick={() => {
                  if (!smsDispatchedInfo) setRecoveryMethod('DIRECT_UPDATE');
                }}
                className="w-full py-2.5 px-4 rounded bg-gradient-to-b from-[#7C0A1B] to-[#510510] text-[#F9E498] font-bold text-xs uppercase tracking-wider border border-[#C5A059] shadow cursor-pointer"
              >
                Save New Password & Profile
              </button>
            </form>
          )}
        </div>

        {/* 4. CLASSIC FOOTER SESSION BAR */}
        <div className="bg-[#EFECE4] px-6 py-3 border-t border-[#C8BFA8] flex items-center justify-between gap-2 text-xs text-slate-700">
          <div className="min-w-0 truncate">
            <div>
              <span className="font-semibold">Active: </span>
              {isLoggedOut ? (
                <span className="text-red-700 font-bold">Signed Out</span>
              ) : isAdminMode ? (
                <span className="text-[#065F46] font-bold">{superAdminProfile.name} (Admin)</span>
              ) : (
                <span className="text-[#6B0816] font-bold">
                  {currentMember.name} ({currentMember.memberId})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-medium truncate">
              Active Session: 12 Hours (Auto Sign-Out when inactive)
            </div>
          </div>

          {!isLoggedOut && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
                setIsAdminAuthenticated(false);
                setIsLoggedOut(true);
                setSuccessMsg('Signed out successfully.');
              }}
              className="px-2.5 py-1 rounded bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Portal Directory Links (Shown on Full-Page Sign-In Screen) */}
      {isLoggedOut ? (
        <div className="relative z-10 w-full text-center pt-6 pb-1 shrink-0">
          <nav
            aria-label="DMC Portal Directory"
            className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm sm:text-lg md:text-xl font-medium text-[#0088cc]"
          >
            <span>DMC Office</span>
            <span className="text-[#0088cc]/70">|</span>
            <span>About</span>
            <span className="text-[#0088cc]/70">|</span>
            <span>Academy</span>
            <span className="text-[#0088cc]/70">|</span>
            <span>Music</span>
            <span className="text-[#0088cc]/70">|</span>
            <span>Staff</span>
            <span className="text-[#0088cc]/70">|</span>
            <button
              type="button"
              onClick={() => setShowPublicSingerModal(true)}
              className="hover:underline font-bold text-[#df1c2d] cursor-pointer"
            >
              Register Singer
            </button>
            <span className="text-[#0088cc]/70">|</span>
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="hover:underline cursor-pointer"
            >
              Policy
            </button>
            <span className="text-[#0088cc]/70">|</span>
            <span>Contact</span>
          </nav>
        </div>
      ) : (
        <div />
      )}

      {/* Official DMC XAYRAXA Membership Terms & Conditions Reader Modal */}
      <DmcMembershipTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAcceptTerms={() => {
          setRegTermsConsent(true);
          setErrorMsg('');
        }}
      />

      {/* General People Singer Registration & Profile Dashboard Modal */}
      <SingerApplicationDashboardModal
        isOpen={showPublicSingerModal}
        onClose={() => {
          setShowPublicSingerModal(false);
          if (onClose) onClose();
        }}
        initialTab={publicSingerModalTab}
      />
    </div>
  );
};
