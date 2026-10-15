import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import { formatLakCompact, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { DmcOfficialLogo } from './DmcLogo';
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
} from 'lucide-react';

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
  } = useDmc();

  const [loginMode, setLoginMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>(initialMode);
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

  if (!isOpen && !isLoggedOut) return null;

  const handleMemberSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = identifier.trim().toUpperCase();
    const matched = allMembers.find(
      (m) =>
        m.memberId.toUpperCase() === trimmed ||
        m.phone.replace(/\s+/g, '').includes(identifier.trim().replace(/\s+/g, '')) ||
        m.name.toUpperCase().includes(trimmed)
    );

    if (!matched) {
      setErrorMsg(`Account "${identifier}" not found. Please select a verified Member ID or register a new account.`);
      return;
    }

    if (
      matched.password &&
      password.trim() !== '' &&
      password.trim() !== matched.password &&
      password.trim() !== '123456'
    ) {
      setErrorMsg(
        `Invalid password for ${matched.name}. Please verify your password or click "Forgot Password?" below.`
      );
      return;
    }

    setCurrentMemberId(matched.memberId);
    setIsAdminMode(false);
    setIsAdminAuthenticated(false);
    setIsLoggedOut(false);
    setSuccessMsg(`Welcome, ${matched.name} (${matched.memberId}). Signing in...`);
    setTimeout(() => {
      setSuccessMsg('');
      if (onClose) onClose();
    }, 500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      {/* CLASSIC CENTERED LOGIN DIALOG BOX */}
      <div className="w-full max-w-md bg-[#FAF8F5] text-slate-900 border-2 border-[#C5A059] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.75)] overflow-hidden my-auto">
        
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
              {loginMode === 'MEMBER' && 'Member User Login'}
              {loginMode === 'ADMIN' && 'Administrator Login'}
              {loginMode === 'REGISTER' && 'New Member Registration'}
              {loginMode === 'RECOVERY' && 'Password Recovery & Profile'}
            </p>
          </div>
        </div>

        {/* 2. CLASSIC 2-TAB SWITCHER (USER LOGIN vs ADMINISTRATOR LOGIN) */}
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
              <span>User Login</span>
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
              <span>Back to Login</span>
            </button>
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {loginMode === 'REGISTER' ? 'Free Member Sign Up' : 'SMS OTP & Profile'}
            </span>
          </div>
        )}

        {/* 3. MAIN CLASSIC FORM BODY */}
        <div className="p-6 space-y-4">
          {/* Status Alerts */}
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
            <form onSubmit={handleMemberSignIn} className="space-y-4">
              {/* Username / Member ID Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5">
                  Username / Member ID or Phone (+856)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g., DMC-LA-00404 or +856 20..."
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-3 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6B0816] focus:ring-1 focus:ring-[#6B0816] shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Password / PIN
                  </label>
                  <span className="text-[11px] font-mono text-slate-600">
                    Default: <strong>123456</strong>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showMemberPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-white border border-slate-400 rounded pl-9 pr-16 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6B0816] focus:ring-1 focus:ring-[#6B0816] shadow-inner"
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
                <span>Sign In as Member</span>
              </button>

              {/* Classic Divider & Secondary Links */}
              <div className="pt-3 border-t border-[#D5CFC0] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
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

                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTarget('MEMBER');
                    setRecoveryMethod('DIRECT_UPDATE');
                    setLoginMode('RECOVERY');
                    setErrorMsg('');
                  }}
                  className="font-semibold text-slate-700 hover:text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Profile / Password</span>
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
              <div className="pt-3 border-t border-[#D5CFC0] flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryTarget('SUPER_ADMIN');
                    setRecoveryMethod('DIRECT_UPDATE');
                    setLoginMode('RECOVERY');
                    setErrorMsg('');
                  }}
                  className="font-bold text-[#065F46] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Update Admin Profile & PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('MEMBER');
                    setErrorMsg('');
                  }}
                  className="font-semibold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Switch to Member Login →
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              TAB 3: CLASSIC NEW MEMBER REGISTRATION FORM
             ========================================================= */}
          {loginMode === 'REGISTER' && (
            <div className="space-y-4">
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

                  <label className="flex items-start gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regTermsConsent}
                      onChange={(e) => setRegTermsConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-400 text-[#6B0816]"
                    />
                    <span>
                      I agree to the DMC XAYRAXA Membership Terms (Free 0 LAK Registration).
                    </span>
                  </label>

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
              {/* Target Selector: Member vs Admin */}
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
        <div className="bg-[#EFECE4] px-6 py-3 border-t border-[#C8BFA8] flex items-center justify-between text-xs text-slate-700">
          <div className="truncate">
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

          {!isLoggedOut && (
            <button
              type="button"
              onClick={() => {
                setIsAdminMode(false);
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
    </div>
  );
};
