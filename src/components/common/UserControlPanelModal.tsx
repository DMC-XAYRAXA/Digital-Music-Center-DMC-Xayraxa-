/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * USER CONTROL PANEL & AUTHENTICATION HUB
 * Dedicated login, session management, identity profile, Lao Banking & account control.
 */

import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak, formatLakCompact } from '../../utils/i18n';
import { 
  User, 
  KeyRound, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  LogIn, 
  Building2, 
  Lock, 
  Sparkles, 
  X,
  CreditCard,
  FileCheck,
  Check,
  Smartphone,
  ExternalLink,
  Plus,
  Landmark,
  Trash2,
  Edit3,
  CheckCircle,
  Copy,
  QrCode,
  Award,
  Download,
  Loader2,
  Truck,
  Globe,
  MapPin,
  Navigation,
  MessageSquare,
  Send,
  Camera,
  Upload
} from 'lucide-react';
import { Member, BankAccountInfo, DEFAULT_LAO_BANKS, LaoShippingCarrierId, LAO_SHIPPING_CARRIERS } from '../../types/dmc';
import { SUPPORTED_LANGUAGES } from '../../utils/i18n';
import { BankQrPaymentModal } from './BankQrPaymentModal';
import { CopyrightCertificateModal, downloadDmcCertificateImage } from './CopyrightCertificateModal';
import { LaoShippingCarrierModal } from './LaoShippingCarrierModal';
import { DmcOfficialLogo } from './DmcLogo';

interface UserControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserControlPanelModal: React.FC<UserControlPanelModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentMember, 
    allMembers, 
    setCurrentMemberId, 
    getMemberBalances,
    isAdminMode,
    setIsAdminMode,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    language,
    setLanguage,
    adminUpdateMember,
    laoBanks,
    updateMemberBankAccount,
    getMemberSongs,
    superAdminProfile,
    updateSuperAdminProfile,
    sendSmsRecoveryOtp,
    resetPasswordWithSmsOtp
  } = useDmc();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BANK' | 'SHIPPING' | 'PRESETS' | 'LOGIN' | 'SECURITY'>('PROFILE');
  const [profileRoleTarget, setProfileRoleTarget] = useState<'MEMBER' | 'SUPER_ADMIN'>('MEMBER');
  const [profileNameInput, setProfileNameInput] = useState(currentMember.name);
  const [profilePhoneInput, setProfilePhoneInput] = useState(currentMember.phone);
  const [profileEmailInput, setProfileEmailInput] = useState(currentMember.email || '');
  const [profilePasswordInput, setProfilePasswordInput] = useState(currentMember.password || '123456');
  const [smsOtpInfo, setSmsOtpInfo] = useState<{
    otpCode: string;
    phone: string;
    matchedId: string;
    matchedName: string;
    carrier: string;
  } | null>(null);
  const [smsOtpEntered, setSmsOtpEntered] = useState('');
  const [profileUpdateNotice, setProfileUpdateNotice] = useState('');
  const [profileUpdateError, setProfileUpdateError] = useState('');
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [preferredCarrier, setPreferredCarrier] = useState<LaoShippingCarrierId>(
    currentMember.preferredCarrierId || 'ANOUSITH'
  );
  const [shippingRecipientName, setShippingRecipientName] = useState(
    currentMember.deliveryAddress?.recipientName || currentMember.name
  );
  const [shippingPhone, setShippingPhone] = useState(
    currentMember.deliveryAddress?.phone || currentMember.phone
  );
  const [shippingProvince, setShippingProvince] = useState(
    currentMember.deliveryAddress?.province || 'ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)'
  );
  const [shippingDistrict, setShippingDistrict] = useState(
    currentMember.deliveryAddress?.district || 'Chanthabouly'
  );
  const [shippingVillage, setShippingVillage] = useState(
    currentMember.deliveryAddress?.village || 'Dongdok Campus'
  );
  const [shippingNote, setShippingNote] = useState(
    currentMember.deliveryAddress?.note || ''
  );
  const [shippingNotice, setShippingNotice] = useState<string>('');

  const handleDirectCertDownload = async () => {
    setIsDownloadingCert(true);
    try {
      const userSongs = getMemberSongs(currentMember.memberId);
      await downloadDmcCertificateImage({
        memberId: currentMember.memberId,
        memberName: currentMember.name,
        isActiveLifetime: currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER',
        workTitle: userSongs.length > 0 ? userSongs[0].title : 'ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)',
      });
    } catch (err) {
      console.error('Certificate download error', err);
    } finally {
      setIsDownloadingCert(false);
    }
  };
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [bankSuccessNotice, setBankSuccessNotice] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [viewingUserBankQr, setViewingUserBankQr] = useState<BankAccountInfo | null>(null);

  // Bank Form State
  const [showAddBankForm, setShowAddBankForm] = useState(false);
  const [selectedBankPreset, setSelectedBankPreset] = useState<string>(
    currentMember.bankAccount?.bankName || DEFAULT_LAO_BANKS[0].name
  );
  const [customBankName, setCustomBankName] = useState('');
  const [accountNumberInput, setAccountNumberInput] = useState(currentMember.bankAccount?.accountNumber || '');
  const [accountNameInput, setAccountNameInput] = useState(
    currentMember.bankAccount?.accountName || currentMember.name.toUpperCase()
  );
  const [branchInput, setBranchInput] = useState(currentMember.bankAccount?.branch || 'Head Office Vientiane');
  const [customQrImageInput, setCustomQrImageInput] = useState(currentMember.bankAccount?.customQrImageUrl || '');
  const [editingBankAccountId, setEditingBankAccountId] = useState<string | null>(null);

  // Keep form in sync when current member changes
  useEffect(() => {
    if (currentMember.bankAccount) {
      setSelectedBankPreset(currentMember.bankAccount.bankName);
      setAccountNumberInput(currentMember.bankAccount.accountNumber);
      setAccountNameInput(currentMember.bankAccount.accountName);
      setBranchInput(currentMember.bankAccount.branch || 'Head Office Vientiane');
      setCustomQrImageInput(currentMember.bankAccount.customQrImageUrl || '');
    } else {
      setSelectedBankPreset(DEFAULT_LAO_BANKS[0].name);
      setAccountNumberInput('');
      setAccountNameInput(currentMember.name.toUpperCase());
      setBranchInput('Head Office Vientiane');
      setCustomQrImageInput('');
    }
    if (profileRoleTarget === 'SUPER_ADMIN') {
      setProfileNameInput(superAdminProfile.name);
      setProfilePhoneInput(superAdminProfile.phone);
      setProfileEmailInput(superAdminProfile.email);
      setProfilePasswordInput(superAdminProfile.passwordPin);
    } else {
      setProfileNameInput(currentMember.name);
      setProfilePhoneInput(currentMember.phone);
      setProfileEmailInput(currentMember.email || '');
      setProfilePasswordInput(currentMember.password || '123456');
    }
    setSmsOtpInfo(null);
    setSmsOtpEntered('');
  }, [currentMember, profileRoleTarget, superAdminProfile]);

  if (!isOpen) return null;

  const balances = getMemberBalances(currentMember.memberId);
  const isActive = currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    const trimmed = loginIdentifier.trim().toUpperCase();
    const found = allMembers.find(
      m => m.memberId.toUpperCase() === trimmed || m.phone.includes(loginIdentifier.trim())
    );

    if (found) {
      setCurrentMemberId(found.memberId);
      if (found.memberId !== 'DMC-LA-00001') {
        setIsAdminMode(false);
        setIsAdminAuthenticated(false);
      }
      setLoginSuccess(`Successfully authenticated as ${found.name} (${found.memberId})!`);
      setTimeout(() => {
        setLoginSuccess('');
        setActiveTab('PROFILE');
      }, 1000);
    } else {
      setLoginError(`No account found matching "${loginIdentifier}". Try selecting from the 1-Click Preset accounts below.`);
    }
  };

  const handleQuickLogin = (memberId: string) => {
    setCurrentMemberId(memberId);
    if (memberId !== 'DMC-LA-00001') {
      setIsAdminMode(false);
      setIsAdminAuthenticated(false);
    }
    setLoginSuccess(`Switched active session to ${memberId}!`);
    setTimeout(() => {
      setLoginSuccess('');
      setActiveTab('PROFILE');
    }, 600);
  };

  const handleSaveBank = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!accountNumberInput.trim()) {
      setBankSuccessNotice('Please enter an account number.');
      return;
    }

    const finalBankName = selectedBankPreset === 'CUSTOM' ? customBankName.trim() : selectedBankPreset;
    if (!finalBankName) {
      setBankSuccessNotice('Please enter a bank name.');
      return;
    }

    const matchedBank = laoBanks.find(b => b.name === finalBankName);

    const newAccount: BankAccountInfo = {
      id: editingBankAccountId || `usr-bank-${Date.now()}`,
      bankName: finalBankName,
      bankCode: matchedBank?.code || 'CUSTOM',
      accountNumber: accountNumberInput.trim(),
      accountName: (accountNameInput.trim() || currentMember.name).toUpperCase(),
      branch: branchInput.trim() || matchedBank?.branchDefault || 'Vientiane',
      customQrImageUrl: customQrImageInput.trim() || undefined,
      isDefault: true,
    };

    const existingList =
      currentMember.bankAccounts && currentMember.bankAccounts.length > 0
        ? currentMember.bankAccounts
        : currentMember.bankAccount
        ? [currentMember.bankAccount]
        : [];

    if (editingBankAccountId) {
      const updatedList = existingList.map(acc =>
        acc.id === editingBankAccountId || acc.accountNumber === editingBankAccountId ? newAccount : acc
      );
      adminUpdateMember(currentMember.memberId, {
        bankAccount: newAccount,
        bankAccounts: updatedList,
      });
    } else {
      updateMemberBankAccount(currentMember.memberId, newAccount);
    }

    setShowAddBankForm(false);
    setEditingBankAccountId(null);
    setBankSuccessNotice(`Successfully updated ${finalBankName} account & QR Code!`);
    setTimeout(() => setBankSuccessNotice(''), 3500);
  };

  const handleDeleteUserBank = (targetAcc: BankAccountInfo) => {
    const existingList =
      currentMember.bankAccounts && currentMember.bankAccounts.length > 0
        ? currentMember.bankAccounts
        : currentMember.bankAccount
        ? [currentMember.bankAccount]
        : [];
    const remaining = existingList.filter(
      acc => acc.accountNumber !== targetAcc.accountNumber || acc.bankName !== targetAcc.bankName
    );
    adminUpdateMember(currentMember.memberId, {
      bankAccount: remaining[0] || undefined,
      bankAccounts: remaining,
    });
    setBankSuccessNotice(`Deleted ${targetAcc.bankName} (${targetAcc.accountNumber}).`);
    setTimeout(() => setBankSuccessNotice(''), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(text);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Get active bank theme colors
  const getBankBadge = (bankNameStr: string) => {
    const b = laoBanks.find(lb => lb.name === bankNameStr);
    if (!b) {
      return {
        badgeBg: 'bg-slate-700 text-slate-200 border-slate-600',
        color: 'from-slate-700 to-slate-900',
        logoText: 'BANK',
        swift: 'LAOPDR',
      };
    }
    return {
      badgeBg: b.badgeBg,
      color: b.color,
      logoText: b.logoText,
      swift: b.swiftCode || 'LAOPDR',
    };
  };

  const userAccounts = currentMember.bankAccounts && currentMember.bankAccounts.length > 0
    ? currentMember.bankAccounts
    : currentMember.bankAccount
    ? [currentMember.bankAccount]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full flex flex-col text-slate-100 shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <DmcOfficialLogo size={38} rounded="xl" withGoldRing={true} className="shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>User Control Panel & Sign In Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  Rev 2.6
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Session ID: <strong className="font-mono text-amber-300">{currentMember.memberId}</strong> ({currentMember.name})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Super Admin Fast Switch — Only visible when authenticated as Administrator */}
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsAdminMode(!isAdminMode);
                  if (!isAdminMode) onClose();
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                  isAdminMode
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-amber-300 border border-amber-500/40'
                }`}
                title="Open Super Admin Control Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdminMode ? 'Exit Super Admin' : 'Super Admin'}</span>
              </button>
            )}

            {/* Sign Out / Switch Session Button */}
            <button
              onClick={() => {
                setActiveTab('LOGIN');
                setLoginSuccess('Session signed out. Please sign in or select an account below.');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-300 border border-slate-700 hover:border-red-500/40 text-slate-300 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
              title="Sign Out / Sign In to another account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/80 border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PROFILE'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('BANK')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'BANK'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Lao Bank Accounts</span>
            {userAccounts.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'BANK' ? 'bg-slate-950/20' : 'bg-slate-800 text-amber-300'}`}>
                {userAccounts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('SHIPPING')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SHIPPING'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-300" />
            <span>Shipping & Languages</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'PRESETS'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Switch Account</span>
          </button>

          <button
            onClick={() => setActiveTab('LOGIN')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'LOGIN'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-2 px-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'SECURITY'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security & KYC</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loginSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          {bankSuccessNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{bankSuccessNotice}</span>
            </div>
          )}

          {/* TAB 1: PROFILE OVERVIEW */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              {/* Member Card with Member's Own Editable Profile Image */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/80 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-14 h-14 shrink-0">
                      <img
                        src={
                          currentMember.avatarUrl && !currentMember.avatarUrl.startsWith('data:image/svg+xml')
                            ? currentMember.avatarUrl
                            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
                        }
                        alt={currentMember.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-400"
                      />
                      <label
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border border-slate-900 flex items-center justify-center shadow cursor-pointer"
                        title="Upload your own Member Profile Image"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                adminUpdateMember(currentMember.memberId, { avatarUrl: reader.result });
                                setProfileUpdateNotice(`Updated profile image for ${currentMember.name}!`);
                                setTimeout(() => setProfileUpdateNotice(''), 3500);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-400 tracking-wider uppercase font-bold">
                        DMC Member Identity
                      </span>
                      <h4 className="text-base font-bold text-white mt-0.5 truncate">{currentMember.name}</h4>
                      <p className="font-mono text-xs text-slate-300 mt-0.5">{currentMember.memberId}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {isActive ? 'ACTIVE LIFETIME' : 'FREE MEMBER'}
                    </span>
                    <label className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>Update Own Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              adminUpdateMember(currentMember.memberId, { avatarUrl: reader.result });
                              setProfileUpdateNotice(`Updated profile image for ${currentMember.name}!`);
                              setTimeout(() => setProfileUpdateNotice(''), 3500);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone (Lao PDR)</span>
                    <span className="font-mono font-medium">{currentMember.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">KYC Status</span>
                    <span className={`font-semibold ${
                      currentMember.kycStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {currentMember.kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update Profile & Password + Phone SMS Recovery Card (User & Super Admin) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">
                        Update Profile & Password + Phone SMS Recovery (+856)
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Edit Member or Super Admin profile, change password, or recover via SMS OTP
                      </div>
                    </div>
                  </div>

                  {/* Role Toggle: Member vs Super Admin */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setProfileRoleTarget('MEMBER')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        profileRoleTarget === 'MEMBER'
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Member ({currentMember.memberId})
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileRoleTarget('SUPER_ADMIN')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        profileRoleTarget === 'SUPER_ADMIN'
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Super Admin
                    </button>
                  </div>
                </div>

                {profileUpdateNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{profileUpdateNotice}</span>
                  </div>
                )}

                {profileUpdateError && (
                  <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-[11px] font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{profileUpdateError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                      {profileRoleTarget === 'SUPER_ADMIN' ? 'Super Admin Name' : 'Member Full Name'}
                    </label>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                      Lao Phone Number (SMS Recovery +856)
                    </label>
                    <input
                      type="text"
                      value={profilePhoneInput}
                      onChange={(e) => setProfilePhoneInput(e.target.value)}
                      placeholder="+856 20 55..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileEmailInput}
                      onChange={(e) => setProfileEmailInput(e.target.value)}
                      placeholder="user@dmcxayraxa.la"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">
                      New Password / 6-Digit PIN
                    </label>
                    <input
                      type="text"
                      value={profilePasswordInput}
                      onChange={(e) => setProfilePasswordInput(e.target.value)}
                      placeholder="Enter new password or PIN"
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone SMS Recovery OTP Trigger & Live SMS Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                      <span>Recover / Verify Password via Phone SMS (+856)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileUpdateError('');
                        const res = sendSmsRecoveryOtp(profileRoleTarget, profilePhoneInput);
                        if (res.success && res.otpCode) {
                          setSmsOtpInfo({
                            otpCode: res.otpCode,
                            phone: res.phone || profilePhoneInput,
                            matchedId: res.matchedId || currentMember.memberId,
                            matchedName: res.matchedName || profileNameInput,
                            carrier: res.carrier || 'Lao Telecom (+856)',
                          });
                          setSmsOtpEntered(res.otpCode);
                          setProfileUpdateNotice(
                            `SMS OTP [${res.otpCode}] sent to ${res.phone} via ${res.carrier}!`
                          );
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send SMS OTP to {profilePhoneInput}</span>
                    </button>
                  </div>

                  {smsOtpInfo && (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40 space-y-2 animate-in fade-in">
                      <div className="text-[10px] font-mono text-emerald-300">
                        [SMS • {smsOtpInfo.carrier}] Recovery OTP for{' '}
                        <strong>{smsOtpInfo.matchedName}</strong> is:{' '}
                        <strong className="text-sm text-emerald-400 font-black px-1.5 py-0.5 bg-emerald-500/20 rounded">
                          {smsOtpInfo.otpCode}
                        </strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={smsOtpEntered}
                          onChange={(e) => setSmsOtpEntered(e.target.value)}
                          placeholder="6-digit SMS OTP"
                          className="flex-1 bg-slate-900 border border-sky-500/50 rounded-lg px-2.5 py-1.5 text-emerald-300 font-mono font-bold text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const out = resetPasswordWithSmsOtp(
                              profileRoleTarget,
                              smsOtpInfo.matchedId,
                              smsOtpEntered,
                              profilePasswordInput,
                              {
                                name: profileNameInput.trim(),
                                phone: profilePhoneInput.trim(),
                                email: profileEmailInput.trim(),
                              }
                            );
                            if (out.success) {
                              setProfileUpdateNotice(out.message);
                              setProfileUpdateError('');
                            } else {
                              setProfileUpdateError(out.message);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] cursor-pointer"
                        >
                          Verify SMS & Reset Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Save Profile & Password Button */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileUpdateError('');
                    if (profileRoleTarget === 'SUPER_ADMIN') {
                      updateSuperAdminProfile({
                        name: profileNameInput.trim(),
                        phone: profilePhoneInput.trim(),
                        email: profileEmailInput.trim(),
                        passwordPin: profilePasswordInput.trim(),
                      });
                      setProfileUpdateNotice(
                        `Saved Super Admin (${superAdminProfile.operatorId}) Profile & Master Password!`
                      );
                    } else {
                      adminUpdateMember(currentMember.memberId, {
                        name: profileNameInput.trim(),
                        phone: profilePhoneInput.trim(),
                        email: profileEmailInput.trim(),
                        password: profilePasswordInput.trim(),
                        lastPasswordUpdatedAt: new Date().toISOString(),
                      });
                      setProfileUpdateNotice(
                        `Saved Member (${currentMember.memberId}) Profile & Password!`
                      );
                    }
                    setTimeout(() => setProfileUpdateNotice(''), 4000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    Save {profileRoleTarget === 'SUPER_ADMIN' ? 'Super Admin' : 'My Member'} Profile & Password
                  </span>
                </button>
              </div>

              {/* Official Copyright Certificate Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#500713]/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs">Official Copyright & Master Rights Certificate</div>
                    <div className="text-[11px] text-slate-400">Lao PDR Law No. 38/NA Certified Digital Master Registry</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleDirectCertDownload}
                    disabled={isDownloadingCert}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 disabled:opacity-60"
                    title="Download Certificate PNG Directly"
                  >
                    {isDownloadingCert ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsCertOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer shadow hover:scale-105 active:scale-95 border border-slate-700"
                    title="View & Customize Certificate"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Wallet Balances Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <span className="font-semibold text-slate-300 block">Wallet Financial Balances</span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Held for Qual.</span>
                    <span className="text-amber-400 font-bold text-xs block">{formatLak(balances.heldForQualification)}</span>
                    <span className="text-[9px] text-amber-300/80 font-bold">({formatLakCompact(balances.heldForQualification)})</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Available</span>
                    <span className="text-emerald-400 font-bold text-xs block">{formatLak(balances.available)}</span>
                    <span className="text-[9px] text-emerald-300/80 font-bold">({formatLakCompact(balances.available)})</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans">Pending</span>
                    <span className="text-slate-300 font-bold text-xs block">{formatLak(balances.pending)}</span>
                    <span className="text-[9px] text-slate-400/80 font-bold">({formatLakCompact(balances.pending)})</span>
                  </div>
                </div>
              </div>

              {/* Linked Payout Bank Information */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-amber-400" />
                    <span>Primary Lao Bank Account (Payouts)</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('BANK')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>Manage Banks</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {currentMember.bankAccount ? (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        {currentMember.bankAccount.bankName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentMember.bankAccount.bankCode || 'LAO BANK'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-slate-300 text-xs">
                      <span>Account: <strong>{currentMember.bankAccount.accountNumber}</strong></span>
                      <button
                        onClick={() => copyToClipboard(currentMember.bankAccount?.accountNumber || '')}
                        className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedAccount === currentMember.bankAccount.accountNumber ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Beneficiary: <strong className="text-slate-200">{currentMember.bankAccount.accountName}</strong>
                    </div>
                    {currentMember.bankAccount.branch && (
                      <div className="text-[10px] text-slate-500">
                        Branch: {currentMember.bankAccount.branch}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 text-center space-y-2">
                    <p className="text-slate-400 text-xs">No bank account linked yet.</p>
                    <button
                      onClick={() => {
                        setActiveTab('BANK');
                        setShowAddBankForm(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                    >
                      + Add Lao Bank Account
                    </button>
                  </div>
                )}
              </div>

              {/* Language & Preferred Lao Shipping Carrier Quick Overview */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Lao Shipping Carrier & Active Language</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('SHIPPING')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Configure</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* 6 Languages Quick Selector Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((langOpt) => (
                    <button
                      key={langOpt.code}
                      onClick={() => {
                        setLanguage(langOpt.code);
                        adminUpdateMember(currentMember.memberId, { language: langOpt.code });
                      }}
                      className={`p-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        language === langOpt.code
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-sm leading-none">{langOpt.flag}</div>
                      <div className="text-[9px] font-bold mt-1 truncate">{langOpt.name}</div>
                    </button>
                  ))}
                </div>

                {/* 3 Lao Carriers Quick Selector */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {LAO_SHIPPING_CARRIERS.map((c) => {
                    const isSelected = preferredCarrier === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          setPreferredCarrier(c.id);
                          adminUpdateMember(currentMember.memberId, { preferredCarrierId: c.id });
                        }}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-white truncate">{c.name}</div>
                        <div className="text-[9px] text-amber-400 font-mono">{formatLak(c.baseFeeLak)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED LAO BANK MANAGER */}
          {activeTab === 'BANK' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-2 text-white">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Official Lao Banking & Self-Service QR Manager (Rev 2.6)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Add, Edit, Update, Delete your Lao bank accounts and upload your own custom QR Code Image (including BCEL One, LDB, JDB, VietinBank Lao, and Phongsavanh Bank Laos).
                </p>
              </div>

              {/* Supported Lao Banks Carousel / Badges */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Supported Lao Banking Institutions (Click to Select / Add)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {laoBanks.map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setEditingBankAccountId(null);
                        setSelectedBankPreset(b.name);
                        setBranchInput(b.branchDefault || 'Head Office Vientiane');
                        setShowAddBankForm(true);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-500/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-black text-xs text-amber-300 group-hover:text-amber-200">
                          {idx + 1}/ {b.code}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {b.swiftCode}
                        </span>
                      </div>
                      <div className="font-semibold text-white text-[11px] line-clamp-1">
                        {b.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="truncate">{b.shortName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Bank Accounts List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>My Registered Bank Accounts & QR Codes</span>
                  </h4>
                  {!showAddBankForm && (
                    <button
                      onClick={() => {
                        setEditingBankAccountId(null);
                        setAccountNumberInput('');
                        setCustomQrImageInput('');
                        setShowAddBankForm(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Bank / QR</span>
                    </button>
                  )}
                </div>

                {userAccounts.map((acc, index) => {
                  const bMeta = getBankBadge(acc.bankName);
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/70 space-y-2.5 shadow-sm relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          {acc.customQrImageUrl && (
                            <div
                              onClick={() => setViewingUserBankQr(acc)}
                              className="w-14 h-14 rounded-xl bg-white p-1 border-2 border-amber-400 shrink-0 cursor-pointer overflow-hidden shadow"
                              title="Click to view custom QR Code"
                            >
                              <img
                                src={acc.customQrImageUrl}
                                alt="Custom QR"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${bMeta.badgeBg}`}>
                                {acc.bankCode || 'LAO BANK'}
                              </span>
                              <span className="font-bold text-white text-xs">{acc.bankName}</span>
                              {acc.customQrImageUrl && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                                  Custom QR Uploaded
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Beneficiary: <strong className="text-slate-200">{acc.accountName}</strong>
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <Check className="w-3 h-3" />
                          <span>Primary Payout</span>
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="font-mono text-xs text-amber-300 font-bold">
                          {acc.accountNumber}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Direct 1-Click Upload QR Image on Card */}
                          <label className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-colors border border-emerald-500/30 cursor-pointer">
                            <Upload className="w-3 h-3 text-emerald-400" />
                            <span>{acc.customQrImageUrl ? 'Change QR' : 'Upload QR'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = ev => {
                                  const dataUrl = ev.target?.result;
                                  if (typeof dataUrl === 'string') {
                                    const updatedAcc: BankAccountInfo = {
                                      ...acc,
                                      customQrImageUrl: dataUrl,
                                    };
                                    updateMemberBankAccount(currentMember.memberId, updatedAcc);
                                    setBankSuccessNotice(`Uploaded custom QR Code image for ${acc.bankName}!`);
                                    setTimeout(() => setBankSuccessNotice(''), 3500);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>

                          <button
                            onClick={() => setViewingUserBankQr(acc)}
                            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-colors border border-amber-500/30 cursor-pointer"
                          >
                            <QrCode className="w-3 h-3 text-amber-400" />
                            <span>View QR</span>
                          </button>

                          <button
                            onClick={() => copyToClipboard(acc.accountNumber)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedAccount === acc.accountNumber ? 'Copied' : 'Copy'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingBankAccountId(acc.id || acc.accountNumber);
                              setSelectedBankPreset(acc.bankName);
                              setAccountNumberInput(acc.accountNumber);
                              setAccountNameInput(acc.accountName);
                              setBranchInput(acc.branch || '');
                              setCustomQrImageInput(acc.customQrImageUrl || '');
                              setShowAddBankForm(true);
                            }}
                            className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUserBank(acc)}
                            className="px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                      {acc.branch && (
                        <div className="text-[10px] text-slate-500">
                          Branch / Location: {acc.branch}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add / Edit Bank & QR Code Image Form */}
              {showAddBankForm && (
                <form
                  onSubmit={handleSaveBank}
                  className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-amber-400" />
                      <span>{editingBankAccountId ? 'Edit / Update Lao Bank Account & QR Code' : 'Add Official Lao Bank Account & QR Code'}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddBankForm(false);
                        setEditingBankAccountId(null);
                      }}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bank Selector */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold text-[11px]">
                      Select Lao Bank Institution *
                    </label>
                    <select
                      value={selectedBankPreset}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedBankPreset(val);
                        const found = laoBanks.find(b => b.name === val);
                        if (found?.branchDefault) setBranchInput(found.branchDefault);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <optgroup label="Official Core Lao Banks">
                        {laoBanks.map((b, i) => (
                          <option key={b.id} value={b.name}>
                            {i + 1}/ {b.name} ({b.code})
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Other Options">
                        <option value="CUSTOM">+ Add Custom / Other Bank</option>
                      </optgroup>
                    </select>
                  </div>

                  {selectedBankPreset === 'CUSTOM' && (
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold text-[11px]">
                        Custom Bank Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Phongsavanh Bank Ltd (Laos) / APB"
                        value={customBankName}
                        onChange={e => setCustomBankName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Account Number & Beneficiary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold text-[11px]">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="010-12-00998877-001"
                        value={accountNumberInput}
                        onChange={e => setAccountNumberInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold text-[11px]">
                        Beneficiary / Account Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={currentMember.name.toUpperCase()}
                        value={accountNameInput}
                        onChange={e => setAccountNameInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:border-amber-500 focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  {/* Branch / Province */}
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold text-[11px]">
                      Branch / Province (Lao PDR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kaysone Phomvihane Ave, Vientiane Capital"
                      value={branchInput}
                      onChange={e => setBranchInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Custom QR Code Image Upload By User / Admin */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-amber-300 font-bold text-[11px] flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-amber-400" />
                        <span>Custom QR Code Image Upload (Optional)</span>
                      </label>
                      {customQrImageInput && (
                        <button
                          type="button"
                          onClick={() => setCustomQrImageInput('')}
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove QR Image</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                        {customQrImageInput ? (
                          <img src={customQrImageInput} alt="QR Preview" className="w-full h-full object-contain" />
                        ) : (
                          <QrCode className="w-7 h-7 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload QR Code Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = ev => {
                                if (typeof ev.target?.result === 'string') {
                                  setCustomQrImageInput(ev.target.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={customQrImageInput}
                          onChange={e => setCustomQrImageInput(e.target.value)}
                          placeholder="Or paste QR image URL..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddBankForm(false);
                        setEditingBankAccountId(null);
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingBankAccountId ? 'Update Bank & QR' : 'Save Bank & QR'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2.5: SHIPPING CARRIERS & 6 LANGUAGES */}
          {activeTab === 'SHIPPING' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              {shippingNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{shippingNotice}</span>
                </div>
              )}

              {/* 1. Multi-Language Selector (6 Languages: English, Lao, Thai, Vietnam, Chinese, Korean) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Multi-Language Selection (6 Supported Languages)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold uppercase">
                    Active: {language}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((langOpt, idx) => {
                    const isSelected = language === langOpt.code;
                    return (
                      <button
                        key={langOpt.code}
                        type="button"
                        onClick={() => {
                          setLanguage(langOpt.code);
                          adminUpdateMember(currentMember.memberId, { language: langOpt.code });
                          setShippingNotice(`Language switched to ${langOpt.name} (${langOpt.nativeName})`);
                          setTimeout(() => setShippingNotice(''), 2500);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                            : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{langOpt.flag}</span>
                          <div>
                            <div className="font-bold text-xs leading-tight">
                              {idx + 1}. {langOpt.name}
                            </div>
                            <div className={`text-[10px] ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                              {langOpt.nativeName}
                            </div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Lao Shipping Carriers (Anousith Logistics, HAL Express, Local Delivery) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      Official Lao Shipping Carriers (18 Provinces & Vientiane)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCarrierModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Track Parcel & Coverage</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {LAO_SHIPPING_CARRIERS.map((carrier) => {
                    const isSelected = preferredCarrier === carrier.id;
                    return (
                      <div
                        key={carrier.id}
                        onClick={() => {
                          setPreferredCarrier(carrier.id);
                          adminUpdateMember(currentMember.memberId, { preferredCarrierId: carrier.id });
                          setShippingNotice(`Default shipping carrier updated to ${carrier.name}!`);
                          setTimeout(() => setShippingNotice(''), 2500);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: carrier.logoColor }}
                              />
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {carrier.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 border border-slate-700">
                                {carrier.trackingPrefix}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 font-medium">
                              {carrier.nameLao}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed pt-0.5">
                              {carrier.description}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-amber-400 text-xs">
                              {formatLak(carrier.baseFeeLak)}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-semibold">
                              {carrier.estimatedDays}
                            </div>
                            {isSelected && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black bg-amber-500 text-slate-950">
                                DEFAULT
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Coverage: <strong className="text-slate-200">{carrier.badge}</strong></span>
                          <span className="font-mono text-amber-300">Hotline: {carrier.hotline}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Member Default Lao PDR Delivery Address */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs sm:text-sm">
                    Default Delivery Address (Lao PDR)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Recipient Full Name</label>
                    <input
                      type="text"
                      value={shippingRecipientName}
                      onChange={(e) => setShippingRecipientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Lao Phone Number</label>
                    <input
                      type="text"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Province (18 Provinces)</label>
                    <select
                      value={shippingProvince}
                      onChange={(e) => setShippingProvince(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs"
                    >
                      <option value="ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)">ນະຄອນຫຼວງວຽງຈັນ (Vientiane Capital)</option>
                      <option value="ແຂວງຫຼວງພະບາງ (Luang Prabang)">ແຂວງຫຼວງພະບາງ (Luang Prabang)</option>
                      <option value="ແຂວງຈຳປາສັກ (Champasak)">ແຂວງຈຳປາສັກ (Champasak)</option>
                      <option value="ແຂວງສະຫວັນນະເຂດ (Savannakhet)">ແຂວງສະຫວັນນະເຂດ (Savannakhet)</option>
                      <option value="ແຂວງຄຳມ່ວນ (Khammouane)">ແຂວງຄຳມ່ວນ (Khammouane)</option>
                      <option value="ແຂວງວຽງຈັນ (Vientiane Province)">ແຂວງວຽງຈັນ (Vientiane Province)</option>
                      <option value="ແຂວງອຸດົມໄຊ (Oudomxay)">ແຂວງອຸດົມໄຊ (Oudomxay)</option>
                      <option value="ແຂວງບໍ່ແກ້ວ (Bokeo)">ແຂວງບໍ່ແກ້ວ (Bokeo)</option>
                      <option value="ແຂວງຫຼວງນ້ຳທາ (Luang Namtha)">ແຂວງຫຼວງນ້ຳທາ (Luang Namtha)</option>
                      <option value="ແຂວງຊຽງຂວາງ (Xieng Khouang)">ແຂວງຊຽງຂວາງ (Xieng Khouang)</option>
                      <option value="ແຂວງບໍລິຄຳໄຊ (Bolikhamxay)">ແຂວງບໍລິຄຳໄຊ (Bolikhamxay)</option>
                      <option value="ແຂວງໄຊຍະບູລີ (Xayabury)">ແຂວງໄຊຍະບູລີ (Xayabury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">District (ເມືອງ)</label>
                    <input
                      type="text"
                      value={shippingDistrict}
                      onChange={(e) => setShippingDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Village / Branch Pickup (ບ້ານ)</label>
                    <input
                      type="text"
                      value={shippingVillage}
                      onChange={(e) => setShippingVillage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Delivery Note / Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Anousith Dongdok Branch"
                      value={shippingNote}
                      onChange={(e) => setShippingNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    adminUpdateMember(currentMember.memberId, {
                      preferredCarrierId: preferredCarrier,
                      deliveryAddress: {
                        recipientName: shippingRecipientName,
                        phone: shippingPhone,
                        province: shippingProvince,
                        district: shippingDistrict,
                        village: shippingVillage,
                        note: shippingNote,
                      },
                    });
                    setShippingNotice('Saved default Lao shipping carrier & delivery address!');
                    setTimeout(() => setShippingNotice(''), 3000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Shipping & Address Preferences</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PRESET TEST ACCOUNTS (1-CLICK SWITCH) */}
          {activeTab === 'PRESETS' && (
            <div className="space-y-3 text-xs animate-in fade-in">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                <strong>1-Click Multi-Tier Account Switcher:</strong> Instantly switch between test identities to inspect how unilevel commissions flow up from L1 to L2 to L3!
              </div>

              <div className="space-y-2">
                {allMembers.map(m => {
                  const isSelected = m.memberId === currentMember.memberId;
                  const mBalances = getMemberBalances(m.memberId);
                  const isMActive = m.membershipState === 'ACTIVE_LIFETIME_MEMBER';

                  return (
                    <button
                      key={m.memberId}
                      onClick={() => handleQuickLogin(m.memberId)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{m.name}</span>
                          {isSelected && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500 text-slate-950 font-bold">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          ID: <span className="text-amber-300">{m.memberId}</span> • {m.phone}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>Bank: <strong className="text-slate-300">{m.bankAccount?.bankName?.split(' ')[0] || 'Lao Bank'}</strong></span>
                          <span>•</span>
                          <span className={isMActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {isMActive ? 'Active Lifetime' : 'FREE'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-emerald-400 font-bold">
                          {formatLak(mBalances.available)} <span className="text-[10px] text-emerald-300/80">({formatLakCompact(mBalances.available)})</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Held: {formatLak(mBalances.heldForQualification)} <span className="text-amber-400/80 font-bold">({formatLakCompact(mBalances.heldForQualification)})</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL LOGIN FORM */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs animate-in fade-in">
              <p className="text-slate-400">
                Sign in with your Lao PDR telephone number or official Member ID (e.g. DMC-LA-00404).
              </p>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Member ID or Phone Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="DMC-LA-00404 or +856 20 2233 4455"
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">PIN or Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter 6-digit PIN or password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <span className="text-[10px] text-slate-500">
                  Demo mode: Any password accepted for verified accounts.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Authenticate Session</span>
              </button>
            </form>
          )}

          {/* TAB 5: SECURITY & KYC */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-3.5 text-xs animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <span className="font-semibold text-slate-200 block">Identity & Compliance Verification</span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Lao National ID / Passport:</span>
                  <span className="font-bold text-emerald-400">
                    {currentMember.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING REVIEW'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Two-Factor OTP Security:</span>
                  <span className="font-bold text-emerald-400">ENABLED (SMS +856)</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Terms of Service:</span>
                  <span className="font-bold text-slate-400">Accepted (Rev 2.6)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-[11px] space-y-1">
                <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dual Authorization Protocol (Spec 2.6)</span>
                </div>
                <p>
                  All external bank payouts undergo Maker/Checker dual authorization.
                  Bank account beneficiary name must match verified Lao KYC identity for settlement release.
                </p>
              </div>

              {/* Admin Portal Fast Switch & Profile/SMS Shortcut */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white block">Super Admin & SMS Password Recovery</span>
                  <span className="text-[10px] text-slate-400">
                    Admin Phone: {superAdminProfile.phone} ({superAdminProfile.telecomCarrier})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setProfileRoleTarget('SUPER_ADMIN');
                      setActiveTab('PROFILE');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs cursor-pointer"
                  >
                    Admin SMS Recovery
                  </button>
                  <button
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isAdminMode
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isAdminMode ? 'Admin Active' : 'Switch to Admin'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Identity: <strong>{currentMember.name}</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* User Personal Bank Receiving QR Modal */}
      {viewingUserBankQr && (
        <BankQrPaymentModal
          isOpen={viewingUserBankQr !== null}
          onClose={() => setViewingUserBankQr(null)}
          amountLak={500000}
          purpose="WALLET_DEPOSIT"
          title={`${viewingUserBankQr.bankName} Receiving QR`}
          description={`Lao QR receiving code for ${viewingUserBankQr.accountName} (Acct: ${viewingUserBankQr.accountNumber}).`}
          onPaymentSuccess={() => {
            setViewingUserBankQr(null);
          }}
        />
      )}

      {/* Official Copyright Certificate Modal */}
      <CopyrightCertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        isActiveLifetime={currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'}
        songs={getMemberSongs(currentMember.memberId)}
      />

      {/* Lao Shipping Carrier & Tracking Modal */}
      <LaoShippingCarrierModal
        isOpen={showCarrierModal}
        onClose={() => setShowCarrierModal(false)}
        initialCarrierId={preferredCarrier}
      />
    </div>
  );
};
