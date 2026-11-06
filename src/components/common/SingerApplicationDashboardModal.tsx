import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDmc } from '../../context/DmcContext';
import {
  formatNumberWithCommas,
  getLocalizedProduct,
} from '../../utils/i18n';
import {
  DMC_SINGER_VOCAL_STYLES,
  DmcSingerProfile,
  DmcSingerBankQrItem,
} from '../../types/dmc';
import {
  Mic,
  Wallet,
  Share2,
  ArrowDownCircle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Pencil,
  QrCode,
  ShieldCheck,
  Building2,
  UserPlus,
  Award,
  Star,
  X,
  Phone,
  MapPin,
  Link as LinkIcon,
  ShoppingBag,
  TrendingUp,
  Users,
  Globe,
  KeyRound,
  Calendar,
  Landmark,
  Clock,
  LogIn,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';
import { LoanWalletAndSingerBookingHub } from './LoanWalletAndSingerBookingHub';

interface SingerApplicationDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'APPLY' | 'DASHBOARD' | 'BOOKING_PARTY' | 'LOAN_WALLET' | 'DIRECTORY';
  onNavigateTab?: (tab: any) => void;
}

const SINGER_PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80',
];

export const SingerApplicationDashboardModal: React.FC<
  SingerApplicationDashboardModalProps
> = ({ isOpen, onClose, initialTab = 'DASHBOARD', onNavigateTab }) => {
  const {
    currentMember,
    allMembers,
    products,
    language,
    laoBanks,
    isAdminMode,
    isAdminAuthenticated,
    singerProfiles,
    applyForSingerJob,
    updateSingerProfile,
    deleteSingerProfile,
    addSingerBankQrAccount,
    updateSingerBankQrAccount,
    deleteSingerBankQrAccount,
    setDefaultSingerBankQrAccount,
    toggleSingerRecommendedProduct,
    recordSingerAffiliateSale,
    withdrawFromSingerWallet,
    resetSingerMemberWalletToZero,
    adminApproveWithdrawalRequest,
    rejectWithdrawal,
    singerBookings,
    createSingerPartyBooking,
    triggerUserMemberNetworkActivationCommission,
    getSponsorChain,
    getDownlines,
    getMemberBalances,
    getMemberSongs,
    getCustomerAffiliateCommissionBalance,
    transferAffiliateCommissionToCustomerWallet,
    recordCustomerAffiliateCommission,
    setCurrentMemberId,
    setIsLoggedOut,
    adminUpdateMember,
  } = useDmc();

  const isAdmin = isAdminMode || isAdminAuthenticated;
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState<
    'APPLY' | 'DASHBOARD' | 'BOOKING_PARTY' | 'LOAN_WALLET' | 'DIRECTORY'
  >(initialTab);
  const [dashboardSection, setDashboardSection] = useState<
    'ALL' | 'WALLET' | 'WITHDRAW' | 'AFFILIATE' | 'PARTY_SCHEDULE' | 'QR_BANK'
  >('ALL');
  const [justRegisteredSingerId, setJustRegisteredSingerId] = useState<
    string | null
  >(null);
  const [showSingerSignInBox, setShowSingerSignInBox] = useState<boolean>(true);
  const [singerLoginIdentifier, setSingerLoginIdentifier] = useState<string>('DMC-LA-00404');
  const [singerLoginPassword, setSingerLoginPassword] = useState<string>('123456');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
    if (isOpen) {
      try {
        const savedSingerId = sessionStorage.getItem('dmc_post_login_singer_id');
        if (savedSingerId) {
          sessionStorage.removeItem('dmc_post_login_singer_id');
          setSelectedSingerId(savedSingerId);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen, initialTab]);

  // Default selected singer profile (matches currentMember if available, else first singer)
  const matchedMemberSinger = useMemo(
    () =>
      singerProfiles.find((s) => s.memberId === currentMember.memberId) ||
      singerProfiles[0],
    [singerProfiles, currentMember.memberId]
  );

  const [selectedSingerId, setSelectedSingerId] = useState<string>(
    matchedMemberSinger?.id || singerProfiles[0]?.id || ''
  );

  const activeSinger: DmcSingerProfile = useMemo(() => {
    return (
      singerProfiles.find((s) => s.id === selectedSingerId) ||
      matchedMemberSinger ||
      singerProfiles[0]
    );
  }, [singerProfiles, selectedSingerId, matchedMemberSinger]);

  // Inline Edit Singer Profile state
  const [isEditingSingerProfile, setIsEditingSingerProfile] = useState<boolean>(false);
  const [editSingerStageName, setEditSingerStageName] = useState<string>(
    activeSinger?.stageName || ''
  );
  const [editSingerFullName, setEditSingerFullName] = useState<string>(
    activeSinger?.fullName || ''
  );
  const [editSingerGender, setEditSingerGender] = useState<'MAN' | 'WOMAN'>(
    activeSinger?.gender || 'MAN'
  );
  const [editSingerVocalStyle, setEditSingerVocalStyle] = useState<string>(
    activeSinger?.vocalStyle || 'Lao Modern Pop / Acoustic'
  );
  const [editSingerExpYears, setEditSingerExpYears] = useState<number>(
    activeSinger?.experienceYears || 3
  );
  const [editSingerProvince, setEditSingerProvince] = useState<string>(
    activeSinger?.province || 'Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)'
  );
  const [editSingerPhone, setEditSingerPhone] = useState<string>(
    activeSinger?.phone || '+856 20 5511 9900'
  );
  const [editSingerEmail, setEditSingerEmail] = useState<string>(
    activeSinger?.email || ''
  );
  const [editSingerPassword, setEditSingerPassword] = useState<string>(
    activeSinger?.password || '123456'
  );
  const [editSingerBio, setEditSingerBio] = useState<string>(
    activeSinger?.bio || ''
  );
  const [editSingerAvatarUrl, setEditSingerAvatarUrl] = useState<string>(
    activeSinger?.avatarUrl || SINGER_PRESET_AVATARS[0]
  );
  const [singerProfileNotice, setSingerProfileNotice] = useState<string | null>(null);

  useEffect(() => {
    if (activeSinger) {
      setEditSingerStageName(activeSinger.stageName);
      setEditSingerFullName(activeSinger.fullName);
      setEditSingerGender(activeSinger.gender || 'MAN');
      setEditSingerVocalStyle(activeSinger.vocalStyle);
      setEditSingerExpYears(activeSinger.experienceYears || 3);
      setEditSingerProvince(activeSinger.province);
      setEditSingerPhone(activeSinger.phone);
      setEditSingerEmail(activeSinger.email || '');
      setEditSingerPassword(activeSinger.password || '123456');
      setEditSingerBio(activeSinger.bio || '');
      setEditSingerAvatarUrl(activeSinger.avatarUrl || SINGER_PRESET_AVATARS[0]);
    }
  }, [activeSinger]);

  // Normalized list of QR Code Bank Accounts for activeSinger
  const activeSingerQrAccounts: DmcSingerBankQrItem[] = useMemo(() => {
    if (!activeSinger) return [];
    if (activeSinger.bankQrAccounts && activeSinger.bankQrAccounts.length > 0) {
      return activeSinger.bankQrAccounts;
    }
    if (activeSinger.bankAccount && activeSinger.bankAccount.accountNumber) {
      return [
        {
          id: `sng-qr-init-${activeSinger.id}`,
          bankName: activeSinger.bankAccount.bankName,
          accountNumber: activeSinger.bankAccount.accountNumber,
          accountName: activeSinger.bankAccount.accountName,
          branch: activeSinger.bankAccount.branch || activeSinger.province,
          customQrImageUrl: activeSinger.bankAccount.customQrImageUrl,
          isDefault: true,
          updatedAt: activeSinger.appliedAt,
        },
      ];
    }
    return [];
  }, [activeSinger]);

  // Customer Party Bookings for activeSinger (Schedule Date & Time on Singer Dashboard)
  const activeSingerBookings = useMemo(() => {
    if (!activeSinger) return [];
    return singerBookings.filter(
      (b) =>
        b.singerId === activeSinger.id ||
        b.singerCode === activeSinger.singerCode
    );
  }, [singerBookings, activeSinger]);

  // Total Affiliate Commission earned by activeSinger
  const activeSingerAffiliateTotalLak = useMemo(() => {
    if (!activeSinger) return 0;
    return activeSinger.affiliateSales.reduce(
      (sum, item) => sum + (item.affiliateCommissionLak || 0),
      0
    );
  }, [activeSinger]);

  // Total 90% Net earned from Customer Party Bookings by activeSinger
  const activeSingerBookingNetTotalLak = useMemo(() => {
    return activeSingerBookings.reduce(
      (sum, b) => sum + (b.singerNetPayout90PercentLak || 0),
      0
    );
  }, [activeSingerBookings]);

  // Quick Customer Party Booking form state inside Singer Dashboard
  const [quickBookDate, setQuickBookDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [quickBookTimeSlot, setQuickBookTimeSlot] = useState<string>(
    '18:00 - 22:00 (Evening Party Set)'
  );
  const [quickBookCustomerName, setQuickBookCustomerName] = useState<string>(
    'Vientiane VIP Party Customer'
  );
  const [quickBookCustomerPhone, setQuickBookCustomerPhone] = useState<string>(
    '+856 20 5599 8877'
  );
  const [quickBookEventName, setQuickBookEventName] = useState<string>(
    'Music Cain Party Set VIP Celebration'
  );
  const [quickBookLocation, setQuickBookLocation] = useState<string>(
    'Vientiane Capital Grand Event Hall'
  );
  const [quickBookTier, setQuickBookTier] = useState<
    'CHEAPER' | 'MEDIUM' | 'EXPENSIVE'
  >('MEDIUM');

  // Toast / status banner
  const [noticeBanner, setNoticeBanner] = useState<{
    type: 'SUCCESS' | 'ERROR';
    text: string;
  } | null>(null);

  const showNotice = (text: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    setNoticeBanner({ text, type });
    setTimeout(() => setNoticeBanner(null), 5500);
  };
  const setBannerMessage = (text: string) => showNotice(text, 'SUCCESS');
  const setDashboardNotice = (text: string) => showNotice(text, 'SUCCESS');

  // ---------------- 1/ SINGER JOB APPLICATION REGISTER FORM STATE ----------------
  // Default to GENERAL_PUBLIC so General People can Register Singer immediately!
  const [appRegistrationType, setAppRegistrationType] = useState<
    'GENERAL_PUBLIC' | 'EXISTING_MEMBER'
  >('GENERAL_PUBLIC');
  const [appSelectedMemberId, setAppSelectedMemberId] = useState<string>(
    currentMember.memberId
  );
  const [appFullName, setAppFullName] = useState('Soukphaphone Chanthavong');
  const [appStageName, setAppStageName] = useState('Nong Souk DMC Vocal');
  const [appGender, setAppGender] = useState<'MAN' | 'WOMAN'>('MAN');
  const [appStartSingerPriceLak, setAppStartSingerPriceLak] =
    useState<number>(2500000);
  const [appPackagePartyPriceLak, setAppPackagePartyPriceLak] =
    useState<number>(8300000);
  const [appPhone, setAppPhone] = useState('+856 20 5588 9911');
  const [appEmail, setAppEmail] = useState('soukphaphone@dmcxayraxa.music');
  const [appPassword, setAppPassword] = useState('123456');
  const [appProvince, setAppProvince] = useState(
    'Vientiane Capital (Dongdok Studio Hub)'
  );
  const [appVocalStyle, setAppVocalStyle] = useState<string>(
    DMC_SINGER_VOCAL_STYLES[0]
  );
  const [appExperienceYears, setAppExperienceYears] = useState<number>(2);
  const [appDemoUrl, setAppDemoUrl] = useState('');
  const [appAvatarUrl, setAppAvatarUrl] = useState(SINGER_PRESET_AVATARS[0]);
  const [appBio, setAppBio] = useState(
    'General Public Vocalist registering for DMC Xayraxa Official Singer & Affiliate Artist Program.'
  );
  const [appSelectedSkus, setAppSelectedSkus] = useState<string[]>(
    products.slice(0, 3).map((p) => p.sku)
  );

  // Applicant's Bank QR Code List inside the Registration Form (supports Add, Edit, Delete, Update!)
  const [appQrList, setAppQrList] = useState<DmcSingerBankQrItem[]>([
    {
      id: 'app-qr-1',
      bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
      accountNumber: '160-12-00884421-001',
      accountName: 'SOUKPHAPHONE CHANTHAVONG',
      branch: 'Vientiane Capital',
      customQrImageUrl: '',
      isDefault: true,
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [appEditingQrId, setAppEditingQrId] = useState<string | null>(null);
  const [appBankName, setAppBankName] = useState(
    'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [appBankAccNumber, setAppBankAccNumber] = useState('160-12-00884421-001');
  const [appBankAccName, setAppBankAccName] = useState(
    'SOUKPHAPHONE CHANTHAVONG'
  );
  const [appBankBranch, setAppBankBranch] = useState('Vientiane Capital');
  const [appBankQrUrl, setAppBankQrUrl] = useState('');
  const [appAgreedTerms, setAppAgreedTerms] = useState(true);

  // Switch between General People vs Existing Member in Apply Form
  const handleSwitchRegistrationType = (
    mode: 'GENERAL_PUBLIC' | 'EXISTING_MEMBER'
  ) => {
    setAppRegistrationType(mode);
    if (mode === 'GENERAL_PUBLIC') {
      setAppFullName('');
      setAppStageName('');
      setAppPhone('+856 20 ');
      setAppEmail('');
      setAppBankAccName('');
      setAppAvatarUrl(SINGER_PRESET_AVATARS[0]);
    } else {
      const mem =
        allMembers.find((m) => m.memberId === appSelectedMemberId) ||
        currentMember;
      const cleanName = mem.name.replace(/\s*\(.*?\)\s*/g, '');
      setAppFullName(cleanName);
      setAppStageName(`${cleanName.split(' ')[0]} DMC Star`);
      setAppPhone(mem.phone || '+856 20 ');
      setAppEmail(
        mem.email || `${mem.memberId.toLowerCase()}@dmcxayraxa.music`
      );
      setAppBankName(
        mem.bankAccount?.bankName ||
          'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
      );
      setAppBankAccNumber(
        mem.bankAccount?.accountNumber || '160-12-00884421-001'
      );
      setAppBankAccName(
        mem.bankAccount?.accountName || cleanName.toUpperCase()
      );
      setAppBankQrUrl(mem.bankAccount?.customQrImageUrl || '');
    }
  };

  // Quick Fill Sample General Person helper
  const handleQuickFillGeneralPerson = () => {
    const sampleNames = [
      { full: 'Soukphaphone Chanthavong', stage: 'Nong Souk DMC Vocal', phone: '+856 20 5588 9911' },
      { full: 'Anousone Phommachanh', stage: 'Anousone Acoustic Star', phone: '+856 20 9944 3322' },
      { full: 'Dalavone Keomany', stage: 'Dala Morlam Modern', phone: '+856 20 7766 5544' },
    ];
    const pick = sampleNames[singerProfiles.length % sampleNames.length];
    setAppRegistrationType('GENERAL_PUBLIC');
    setAppFullName(pick.full);
    setAppStageName(pick.stage);
    setAppPhone(pick.phone);
    setAppEmail(`${pick.full.split(' ')[0].toLowerCase()}@gmail.com`);
    setAppBankAccName(pick.full.toUpperCase());
    setAppBankAccNumber(`160-12-00${Math.floor(100000 + Math.random() * 899999)}-001`);
  };

  // Add / Update QR Code inside the Registration Form
  const handleSaveAppQrItem = () => {
    const cleanAccNo = appBankAccNumber.trim() || '160-12-00884421-001';
    const cleanHolder = (
      appBankAccName.trim() ||
      appFullName.trim() ||
      'GENERAL SINGER'
    ).toUpperCase();

    if (appEditingQrId) {
      setAppQrList((prev) =>
        prev.map((item) =>
          item.id === appEditingQrId
            ? {
                ...item,
                bankName: appBankName,
                accountNumber: cleanAccNo,
                accountName: cleanHolder,
                branch: appBankBranch,
                customQrImageUrl: appBankQrUrl || undefined,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      setAppEditingQrId(null);
      showNotice(`Updated QR Code Bank (${cleanAccNo}) in your registration form.`);
    } else {
      const newQr: DmcSingerBankQrItem = {
        id: `app-qr-${Date.now()}`,
        bankName: appBankName,
        accountNumber: cleanAccNo,
        accountName: cleanHolder,
        branch: appBankBranch,
        customQrImageUrl: appBankQrUrl || undefined,
        isDefault: appQrList.length === 0,
        updatedAt: new Date().toISOString(),
      };
      setAppQrList((prev) => [...prev, newQr]);
      showNotice(`Added new QR Code Bank (${cleanAccNo}) to your registration form.`);
    }
  };

  // ---------------- 2/ SINGER PROFILE DASHBOARD STATE ----------------
  const [copiedLinkKey, setCopiedLinkKey] = useState<string | null>(null);
  const [affiliateFilter, setAffiliateFilter] = useState<'ALL' | 'RECOMMENDED'>(
    'ALL'
  );
  const [qrPreviewProductSku, setQrPreviewProductSku] = useState<string | null>(
    null
  );
  const [fanBuyerNameInput] = useState('Soukphaphone Fan');

  // Singer Dashboard Bank QR Code CRUD State (Add, Edit, Delete, Update)
  const [qrCrudMode, setQrCrudMode] = useState<'LIST' | 'ADD' | 'EDIT'>('LIST');
  const [editingDashboardQrId, setEditingDashboardQrId] = useState<string | null>(
    null
  );
  const [qrFormBankName, setQrFormBankName] = useState<string>(
    activeSinger?.bankAccount?.bankName ||
      'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [qrFormAccountNumber, setQrFormAccountNumber] = useState<string>(
    activeSinger?.bankAccount?.accountNumber || '160-12-00884421-001'
  );
  const [qrFormAccountName, setQrFormAccountName] = useState<string>(
    activeSinger?.bankAccount?.accountName ||
      activeSinger?.fullName?.toUpperCase() ||
      'KHAMLA SAYSANA'
  );
  const [qrFormBranch, setQrFormBranch] = useState<string>(
    activeSinger?.bankAccount?.branch || 'Vientiane Capital'
  );
  const [qrFormImageUrl, setQrFormImageUrl] = useState<string>(
    activeSinger?.bankAccount?.customQrImageUrl || ''
  );
  const [qrFormIsDefault, setQrFormIsDefault] = useState<boolean>(true);
  const [previewLargeQrItem, setPreviewLargeQrItem] =
    useState<DmcSingerBankQrItem | null>(null);

  // Singer Withdrawal Form State
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('500000');
  const [withdrawBankName, setWithdrawBankName] = useState<string>(
    activeSinger?.bankAccount?.bankName ||
      'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState<string>(
    activeSinger?.bankAccount?.accountNumber || '160-12-00884421-001'
  );
  const [withdrawAccountName, setWithdrawAccountName] = useState<string>(
    activeSinger?.bankAccount?.accountName ||
      activeSinger?.fullName?.toUpperCase() ||
      'KHAMLA SAYSANA'
  );
  const [withdrawQrUrl, setWithdrawQrUrl] = useState<string>(
    activeSinger?.bankAccount?.customQrImageUrl || ''
  );

  // Sync withdrawal bank fields when switching active singer
  const handleSelectSinger = (singer: DmcSingerProfile) => {
    setSelectedSingerId(singer.id);
    setWithdrawBankName(singer.bankAccount.bankName);
    setWithdrawAccountNumber(singer.bankAccount.accountNumber);
    setWithdrawAccountName(singer.bankAccount.accountName);
    setWithdrawQrUrl(singer.bankAccount.customQrImageUrl || '');
    setQrCrudMode('LIST');
    setEditingDashboardQrId(null);
  };

  const openAddDashboardQrForm = () => {
    setEditingDashboardQrId(null);
    setQrFormBankName('BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC');
    setQrFormAccountNumber('');
    setQrFormAccountName(activeSinger?.fullName?.toUpperCase() || '');
    setQrFormBranch(activeSinger?.province || 'Vientiane Capital');
    setQrFormImageUrl('');
    setQrFormIsDefault(true);
    setQrCrudMode('ADD');
  };

  const openEditDashboardQrForm = (qrItem: DmcSingerBankQrItem) => {
    setEditingDashboardQrId(qrItem.id);
    setQrFormBankName(qrItem.bankName);
    setQrFormAccountNumber(qrItem.accountNumber);
    setQrFormAccountName(qrItem.accountName);
    setQrFormBranch(qrItem.branch || 'Vientiane Capital');
    setQrFormImageUrl(qrItem.customQrImageUrl || '');
    setQrFormIsDefault(Boolean(qrItem.isDefault));
    setQrCrudMode('EDIT');
  };

  const handleSaveDashboardQrForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSinger) return;
    if (!qrFormAccountNumber.trim()) {
      showNotice('Please enter a valid Bank Account Number.', 'ERROR');
      return;
    }
    const cleanHolder = (
      qrFormAccountName.trim() || activeSinger.fullName
    ).toUpperCase();

    if (qrCrudMode === 'EDIT' && editingDashboardQrId) {
      updateSingerBankQrAccount(activeSinger.id, editingDashboardQrId, {
        bankName: qrFormBankName,
        accountNumber: qrFormAccountNumber.trim(),
        accountName: cleanHolder,
        branch: qrFormBranch.trim() || 'Vientiane Capital',
        customQrImageUrl: qrFormImageUrl || undefined,
        isDefault: qrFormIsDefault,
      });
      if (qrFormIsDefault) {
        setWithdrawBankName(qrFormBankName);
        setWithdrawAccountNumber(qrFormAccountNumber.trim());
        setWithdrawAccountName(cleanHolder);
        setWithdrawQrUrl(qrFormImageUrl || '');
      }
      showNotice(
        `Updated QR Code Bank Account (${qrFormAccountNumber.trim()}) for ${activeSinger.stageName}!`,
        'SUCCESS'
      );
    } else {
      const created = addSingerBankQrAccount(activeSinger.id, {
        bankName: qrFormBankName,
        accountNumber: qrFormAccountNumber.trim(),
        accountName: cleanHolder,
        branch: qrFormBranch.trim() || 'Vientiane Capital',
        customQrImageUrl: qrFormImageUrl || undefined,
        isDefault: qrFormIsDefault,
      });
      if (created && qrFormIsDefault) {
        setWithdrawBankName(created.bankName);
        setWithdrawAccountNumber(created.accountNumber);
        setWithdrawAccountName(created.accountName);
        setWithdrawQrUrl(created.customQrImageUrl || '');
      }
      showNotice(
        `Added new QR Code Bank Account (${qrFormAccountNumber.trim()}) for ${activeSinger.stageName}!`,
        'SUCCESS'
      );
    }
    setQrCrudMode('LIST');
    setEditingDashboardQrId(null);
  };

  if (!isOpen) return null;

  const handleSubmitSingerApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedFullName = appFullName.trim() || 'Soukphaphone Chanthavong';
    const resolvedPhone = appPhone.trim() || '+856 20 5588 9911';
    const resolvedStageName =
      appStageName.trim() || `${resolvedFullName.split(' ')[0]} DMC Star`;

    const cleanHolder = (
      appBankAccName.trim() || resolvedFullName
    ).toUpperCase();
    const currentFormPrimaryQr: DmcSingerBankQrItem = {
      id: `sng-qr-${Date.now()}`,
      bankName: appBankName,
      accountNumber: appBankAccNumber.trim() || '160-12-00884421-001',
      accountName: cleanHolder,
      branch: appBankBranch || appProvince,
      customQrImageUrl: appBankQrUrl || undefined,
      isDefault: true,
      updatedAt: new Date().toISOString(),
    };

    const mergedQrList: DmcSingerBankQrItem[] =
      appQrList.length > 0
        ? appQrList.map((item, idx) =>
            idx === 0
              ? {
                  ...item,
                  bankName: appBankName,
                  accountNumber: appBankAccNumber.trim() || item.accountNumber,
                  accountName: cleanHolder,
                  branch: appBankBranch || item.branch,
                  customQrImageUrl: appBankQrUrl || item.customQrImageUrl,
                  isDefault: true,
                }
              : item
          )
        : [currentFormPrimaryQr];

    const created = applyForSingerJob({
      registrationType: appRegistrationType,
      gender: appGender,
      memberId:
        appRegistrationType === 'EXISTING_MEMBER'
          ? appSelectedMemberId
          : undefined,
      password: appPassword || '123456',
      fullName: resolvedFullName,
      stageName: resolvedStageName,
      phone: resolvedPhone,
      email: appEmail,
      province: appProvince,
      vocalStyle: appVocalStyle,
      experienceYears: appExperienceYears,
      demoAudioOrVideoUrl: appDemoUrl,
      avatarUrl: appAvatarUrl,
      bio: appBio,
      packagePartyPriceLak: appPackagePartyPriceLak,
      recommendedProductSkus: appSelectedSkus,
      bankAccount: {
        bankName: appBankName,
        accountNumber: appBankAccNumber.trim() || '160-12-00884421-001',
        accountName: cleanHolder,
        branch: appBankBranch || appProvince,
        customQrImageUrl: appBankQrUrl || undefined,
      },
      bankQrAccounts: mergedQrList,
    });

    if (created.memberId) {
      setCurrentMemberId(created.memberId);
      setSingerLoginIdentifier(created.memberId);
    }
    setSingerLoginPassword(appPassword || '123456');
    handleSelectSinger(created);
    setJustRegisteredSingerId(created.id);
    setShowSingerSignInBox(false);
    setIsLoggedOut(false);
    const welcomeText = `Registered Singer & Automatic Official Member! Sign In Member ID: ${created.memberId} | Password: ${
      appPassword || '123456'
    } | Singer: ${created.stageName} (${created.singerCode}). Welcome to your Singer & Member Dashboard!`;
    try {
      sessionStorage.setItem('dmc_active_home_role', 'SINGER');
      sessionStorage.setItem('dmc_post_login_dashboard', 'SINGER');
      sessionStorage.setItem('dmc_post_login_singer_id', created.id);
      sessionStorage.setItem('dmc_post_booking_notice', welcomeText);
    } catch {
      // ignore storage errors
    }
    showNotice(welcomeText, 'SUCCESS');
    onClose();
  };

  const handleSingerSignInToDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = singerLoginIdentifier.trim().toLowerCase();
    const matched = raw
      ? singerProfiles.find(
          (s) =>
            (s.memberId && s.memberId.toLowerCase() === raw) ||
            s.singerCode.toLowerCase() === raw ||
            s.stageName.toLowerCase().includes(raw) ||
            s.fullName.toLowerCase().includes(raw) ||
            s.phone.replace(/\s+/g, '').includes(raw.replace(/\s+/g, ''))
        )
      : activeSinger || singerProfiles[0];

    if (!matched) {
      showNotice(
        `Singer account "${singerLoginIdentifier}" not found. Enter your Singer Member ID (e.g. DMC-LA-00404) & Password (123456) or select a Singer below.`,
        'ERROR'
      );
      return;
    }

    const linkedMember = allMembers.find(
      (m) =>
        matched.memberId &&
        m.memberId.toUpperCase() === matched.memberId.toUpperCase()
    );
    if (
      linkedMember?.password &&
      singerLoginPassword.trim() !== '' &&
      singerLoginPassword.trim() !== linkedMember.password &&
      singerLoginPassword.trim() !== '123456'
    ) {
      showNotice(
        `Invalid password for ${matched.stageName} (${matched.memberId}). Default password is 123456.`,
        'ERROR'
      );
      return;
    }

    if (matched.memberId) {
      setCurrentMemberId(matched.memberId);
    }
    setIsLoggedOut(false);
    try {
      sessionStorage.setItem('dmc_active_home_role', 'SINGER');
      sessionStorage.setItem('dmc_post_login_dashboard', 'SINGER');
      sessionStorage.setItem('dmc_post_login_singer_id', matched.id);
    } catch {
      // ignore
    }
    handleSelectSinger(matched);
    setShowSingerSignInBox(false);
    setActiveTab('DASHBOARD');
    setDashboardSection('ALL');
    setTimeout(() => {
      scrollBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    showNotice(
      `Signed In as User Singer & Official Member: ${matched.stageName} (Member ID: ${matched.memberId} • Singer ID: ${matched.singerCode})!`,
      'SUCCESS'
    );
  };

  const handleQuickDashboardPartyBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSinger) return;
    const res = createSingerPartyBooking({
      singerId: activeSinger.id,
      customerName: quickBookCustomerName.trim() || 'VIP Party Customer',
      customerPhone: quickBookCustomerPhone.trim() || '+856 20 5599 8877',
      customerPassword: '123456',
      partyEventName:
        quickBookEventName.trim() ||
        `${activeSinger.stageName} Live Music Cain Party Set`,
      eventLocation:
        quickBookLocation.trim() || 'Vientiane Capital Grand Event Hall',
      bookingDate: quickBookDate,
      bookingTimeSlot: quickBookTimeSlot,
      singerPriceTier: quickBookTier,
      customSingerPriceLak: 0,
      brandSetPackageType: 'NEW_BRAND_SET',
      copyrightMusicType: 'ROCK_PERFORMANCE',
      ownMusicSongTitles: `${activeSinger.stageName} Original Copyright Live Set`,
      paymentMethod: 'BCEL_ONE_QR',
      notes: 'Scheduled directly on Singer Profile Dashboard — Customer enrolled as Member Free Active (PW: 123456) & Singer warned by Schedule Calendar Date & Time.',
    });
    showNotice(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  const handleCopyText = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
    setCopiedLinkKey(key);
    setTimeout(() => setCopiedLinkKey(null), 2500);
  };

  const handleExecuteSingerWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSinger) return;

    const cleanNum = Math.round(
      Number(String(withdrawAmountInput).replace(/[^0-9]/g, '')) || 0
    );
    const res = withdrawFromSingerWallet(activeSinger.id, cleanNum, {
      bankName: withdrawBankName,
      accountNumber: withdrawAccountNumber,
      accountName: withdrawAccountName || activeSinger.fullName.toUpperCase(),
      customQrImageUrl: withdrawQrUrl || undefined,
    });

    if (!res.success) {
      showNotice(res.message, 'ERROR');
      return;
    }
    showNotice(res.message, 'SUCCESS');
  };

  const numericWithdrawAmount = Math.round(
    Number(String(withdrawAmountInput).replace(/[^0-9]/g, '')) || 0
  );
  const bankFeeLak = 5000;
  const netWithdrawPayoutLak = Math.max(0, numericWithdrawAmount - bankFeeLak);

  const mainSingerProfileLink = activeSinger
    ? `https://dmcxayraxa.music/register?ref=${encodeURIComponent(
        activeSinger.memberId || currentMember.memberId
      )}&singer=${encodeURIComponent(
        activeSinger.singerCode
      )}&aff=${encodeURIComponent(activeSinger.affiliateCode)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 text-slate-900 max-h-[94vh] flex flex-col my-auto border-2 border-amber-400">
        {/* ---------------- TOP LUXURY HEADER ---------------- */}
        <div className="bg-gradient-to-r from-[#69030e] via-[#8f0b1c] to-[#b81126] text-white p-3.5 sm:p-4 border-b border-amber-400/50 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0 border border-white/40">
                <Mic className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black tracking-tight text-white truncate">
                    {activeTab === 'BOOKING_PARTY'
                      ? 'DMC Party Booking — Official Customer Booking Form'
                      : 'DMC Singer Registration & Profile Studio'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                    {singerProfiles.length} Singers
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-200 truncate">
                  {activeTab === 'BOOKING_PARTY'
                    ? 'Select your Singer, Event Date & Time, Party Package, and create your password to log in'
                    : 'Official DMC Xayraxa Singer Registration & Studio Profile'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white/90 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Top Navigation Bar */}
          {activeTab === 'APPLY' ? (
            <div className="flex items-center justify-start gap-2 mt-3 p-1 rounded-2xl bg-black/35 border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab('APPLY')}
                className="py-2 px-4 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span>Register Singer</span>
              </button>
            </div>
          ) : activeTab === 'BOOKING_PARTY' ? (
            <div className="flex items-center justify-center gap-2 mt-3 p-1 rounded-2xl bg-black/35 border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab('BOOKING_PARTY')}
                className="py-2 px-5 rounded-xl text-[11px] sm:text-xs font-black flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Customer Party Booking Form</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mt-3 p-1 rounded-2xl bg-black/35 border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab('APPLY')}
                className="py-2 px-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer text-white/90 hover:bg-white/10"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">1/ Register Singer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DASHBOARD')}
                className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'DASHBOARD'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">2/ Singer Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BOOKING_PARTY')}
                className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'BOOKING_PARTY'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">3/ Booking Party Set</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('LOAN_WALLET')}
                className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'LOAN_WALLET'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">4/ DMC Party Wallet (10% Saving for Loan)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('DIRECTORY')}
                className={`py-2 px-2 rounded-xl text-[10px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  activeTab === 'DIRECTORY'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Singers ({singerProfiles.length})
                </span>
              </button>
            </div>
          )}
        </div>

        {/* ---------------- SCROLLABLE CONTENT BODY ---------------- */}
        <div
          ref={scrollBodyRef}
          className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-slate-50/70"
        >
          {/* Status Notification Banner */}
          {noticeBanner && (
            <div
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-in fade-in ${
                noticeBanner.type === 'SUCCESS'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    noticeBanner.type === 'SUCCESS'
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                />
                <span>{noticeBanner.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setNoticeBanner(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* =====================================================================
              TAB 1: 1/ SINGER JOB APPLICATION REGISTER FORM (OPEN TO GENERAL PEOPLE)
             ===================================================================== */}
          {activeTab === 'APPLY' && (
            <div className="space-y-3">
              <form
                onSubmit={handleSubmitSingerApplication}
                className="bg-white rounded-2xl border border-amber-200/90 p-4 space-y-4 shadow-sm text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase">
                        OPEN TO GENERAL PEOPLE (ບຸກຄົນທົ່ວໄປສະໝັກໄດ້ຟຣີ 0 LAK)
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#df1c2d] border border-red-200 text-[9px] font-black uppercase">
                        INSTANT SINGER DASHBOARD & WALLET
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                      1/ General People & Artist Singer Registration Form (ສະໝັກເປັນນັກຮ້ອງ DMC Xayraxa)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      General people can register directly as a DMC Singer (0 LAK Free) to recommend affiliate products, manage their own Bank QR Codes, and withdraw earnings.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleQuickFillGeneralPerson}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-[10px] cursor-pointer"
                    >
                      + Auto-Fill General Applicant
                    </button>
                  </div>
                </div>

              {/* Applicant Type Selector: General People (Default) vs Existing DMC Member */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSwitchRegistrationType('GENERAL_PUBLIC')}
                  className={`py-2.5 px-3 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    appRegistrationType === 'GENERAL_PUBLIC'
                      ? 'bg-gradient-to-r from-[#df1c2d] to-[#990c1e] text-white shadow-md'
                      : 'bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        appRegistrationType === 'GENERAL_PUBLIC'
                          ? 'bg-white/20 text-amber-300'
                          : 'bg-red-50 text-[#df1c2d]'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">
                        General People Register Singer
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          appRegistrationType === 'GENERAL_PUBLIC'
                            ? 'text-amber-200'
                            : 'text-slate-500'
                        }`}
                      >
                        ບຸກຄົນທົ່ວໄປສະໝັກໃໝ່ (Free 0 LAK • No Member ID needed)
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                      appRegistrationType === 'GENERAL_PUBLIC'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Public Open
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchRegistrationType('EXISTING_MEMBER')}
                  className={`py-2.5 px-3 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    appRegistrationType === 'EXISTING_MEMBER'
                      ? 'bg-slate-900 text-amber-300 shadow-md'
                      : 'bg-white/70 hover:bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        appRegistrationType === 'EXISTING_MEMBER'
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black truncate">
                        Existing DMC Member
                      </div>
                      <div
                        className={`text-[10px] truncate ${
                          appRegistrationType === 'EXISTING_MEMBER'
                            ? 'text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        Link to existing Member ID ({currentMember.memberId})
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                      appRegistrationType === 'EXISTING_MEMBER'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    Member
                  </span>
                </button>
              </div>

              {/* If Existing Member selected, allow picking Member ID */}
              {appRegistrationType === 'EXISTING_MEMBER' && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-800">
                    Select Existing DMC Member Account to Link Singer Profile:
                  </span>
                  <select
                    value={appSelectedMemberId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setAppSelectedMemberId(id);
                      const mem = allMembers.find((m) => m.memberId === id);
                      if (mem) {
                        const cleanName = mem.name.replace(/\s*\(.*?\)\s*/g, '');
                        setAppFullName(cleanName);
                        setAppStageName(`${cleanName.split(' ')[0]} DMC Star`);
                        setAppPhone(mem.phone);
                        setAppEmail(mem.email || '');
                        if (mem.bankAccount) {
                          setAppBankName(mem.bankAccount.bankName);
                          setAppBankAccNumber(mem.bankAccount.accountNumber);
                          setAppBankAccName(mem.bankAccount.accountName);
                          setAppBankQrUrl(mem.bankAccount.customQrImageUrl || '');
                        }
                      }
                    }}
                    className="bg-white border border-amber-400 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                  >
                    {allMembers.map((m) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberId} — {m.name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Singer Profile Photo Upload & Preset Portraits */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-3.5">
                <div className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#df1c2d] via-amber-400 to-amber-200 shadow-md shrink-0">
                  <img
                    src={appAvatarUrl}
                    alt="Singer Applicant"
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                  />
                  <span className="absolute -bottom-1 right-0 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black uppercase shadow">
                    Singer
                  </span>
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Singer Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setAppAvatarUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Or select preset portrait:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {SINGER_PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAppAvatarUrl(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition-transform hover:scale-110 ${
                            appAvatarUrl === url
                              ? 'border-[#df1c2d] ring-2 ring-amber-400'
                              : 'border-slate-300'
                          }`}
                        >
                          <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={appAvatarUrl}
                    onChange={(e) => setAppAvatarUrl(e.target.value)}
                    placeholder="Or paste Singer profile image URL..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-[11px] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 1: Full Name & Stage Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Full Name — General Person (ຊື່ ແລະ ນາມສະກຸນຜູ້ສະໝັກ) *
                  </label>
                  <input
                    type="text"
                    value={appFullName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAppFullName(val);
                      setAppBankAccName(val.toUpperCase());
                    }}
                    placeholder="e.g. Soukphaphone Chanthavong"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Artist / Stage Name (ຊື່ໃນວົງການນັກຮ້ອງ) *
                  </label>
                  <input
                    type="text"
                    value={appStageName}
                    onChange={(e) => setAppStageName(e.target.value)}
                    placeholder="e.g. Nong Souk DMC Vocal"
                    className="w-full bg-amber-50/60 border border-amber-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
                  />
                </div>
              </div>

              {/* Singer Gender (Man or Woman) + Automatic Member ID & Official Member Status (Start Singer Price Removed) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div>
                  <label className="block text-[11px] font-black text-slate-800 mb-1">
                    Singer Gender (Man or Woman) *
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAppGender('MAN')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer transition-all ${
                        appGender === 'MAN'
                          ? 'bg-sky-600 text-white border-sky-700 shadow'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      MAN (ນັກຮ້ອງຊາຍ)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppGender('WOMAN')}
                      className={`py-2 px-3 rounded-xl text-xs font-black border cursor-pointer transition-all ${
                        appGender === 'WOMAN'
                          ? 'bg-pink-600 text-white border-pink-700 shadow'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      WOMAN (ນັກຮ້ອງຍິງ)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-emerald-900 mb-1 flex items-center justify-between">
                    <span>Singer Auto Member ID (Sign In ID)</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                      Auto Member ✓
                    </span>
                  </label>
                  <div className="w-full bg-emerald-50 border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-950 flex items-center justify-between">
                    <span>
                      {appRegistrationType === 'EXISTING_MEMBER'
                        ? appSelectedMemberId
                        : `DMC-LA-${String(405 + allMembers.length).padStart(5, '0')}`}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-emerald-700">
                      Become Member Automatically
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Phone / WhatsApp, Member & Singer Login Password & Province */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Phone / WhatsApp (+856) *
                  </label>
                  <input
                    type="text"
                    value={appPhone}
                    onChange={(e) => setAppPhone(e.target.value)}
                    placeholder="+856 20 5511 2233"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-[#df1c2d]" />
                    <span>Member ID &amp; Singer Password *</span>
                  </label>
                  <input
                    type="text"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Province / Studio Branch *
                  </label>
                  <select
                    value={appProvince}
                    onChange={(e) => setAppProvince(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                  >
                    <option value="Vientiane Capital (Dongdok Studio Hub)">
                      Vientiane Capital (Dongdok Studio Hub)
                    </option>
                    <option value="Luang Prabang Studio Hub">
                      Luang Prabang Studio Hub
                    </option>
                    <option value="Pakse Champasak Hub">
                      Pakse Champasak Hub
                    </option>
                    <option value="Savannakhet Studio Branch">
                      Savannakhet Studio Branch
                    </option>
                    <option value="Vientiane Province">Vientiane Province</option>
                    <option value="Bolikhamxai / Khammouane">
                      Bolikhamxai / Khammouane
                    </option>
                  </select>
                </div>
              </div>

              {/* Row 3: Vocal Style, Experience Years & Demo Link (Optional for General People) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Vocal Style / Music Genre *
                  </label>
                  <select
                    value={appVocalStyle}
                    onChange={(e) => setAppVocalStyle(e.target.value)}
                    className="w-full bg-amber-50/70 border-2 border-amber-400 rounded-xl px-2.5 py-2 text-xs font-black text-slate-900"
                  >
                    {DMC_SINGER_VOCAL_STYLES.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Singing Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={appExperienceYears}
                    onChange={(e) =>
                      setAppExperienceYears(
                        Math.max(0, Number(e.target.value) || 0)
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Facebook / YouTube Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={appDemoUrl}
                    onChange={(e) => setAppDemoUrl(e.target.value)}
                    placeholder="Optional for general applicants..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Select Initial Products to Recommend on Singer Affiliate Profile */}
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#df1c2d]" />
                    <span>
                      Select Products to Recommend with Your Singer Affiliate Link ({appSelectedSkus.length} Selected)
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700">
                    Earn L1 50% (225,000 – 400,000 LAK / sale)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {products.map((prod) => {
                    const isChecked = appSelectedSkus.includes(prod.sku);
                    const l1Comm =
                      prod.sku === 'MUSIC_SINGLE_1600'
                        ? prod.splitRule.l1Share || 400000
                        : Math.round(
                            (prod.commissionPoolLak *
                              (prod.splitRule.l1Share || 50)) /
                              100
                          );
                    return (
                      <button
                        key={prod.sku}
                        type="button"
                        onClick={() =>
                          setAppSelectedSkus((prev) =>
                            prev.includes(prod.sku)
                              ? prev.filter((item) => item !== prod.sku)
                              : [...prev, prod.sku]
                          )
                        }
                        className={`p-2 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-emerald-500 ring-1 ring-emerald-400 shadow-xs'
                            : 'bg-white/60 border-slate-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={prod.imageUrl}
                            alt={prod.titleEn}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold text-slate-900 truncate">
                              {prod.titleEn}
                            </div>
                            <div className="text-[9px] font-mono text-emerald-700 font-bold">
                              Affiliate Earn: +{formatNumberWithCommas(l1Comm)} LAK
                            </div>
                          </div>
                        </div>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isChecked
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SINGER PAYOUT BANK ACCOUNT & QR CODE (ADD, EDIT, DELETE, UPDATE) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-emerald-300/90 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-slate-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>
                      Singer Bank QR Code Setup — Allow Add, Edit, Delete & Update QR Code
                    </span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {appQrList.length} QR Code Account(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Lao Bank Name *
                    </label>
                    <select
                      value={appBankName}
                      onChange={(e) => setAppBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                    >
                      {laoBanks.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.shortName} ({b.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={appBankAccNumber}
                      onChange={(e) => setAppBankAccNumber(e.target.value)}
                      placeholder="160-12-00884421-001"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      value={appBankAccName}
                      onChange={(e) =>
                        setAppBankAccName(e.target.value.toUpperCase())
                      }
                      placeholder="FULL NAME IN CAPS"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase"
                    />
                  </div>
                </div>

                {/* Upload / Paste / Add / Update / Delete QR Code Image */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Bank QR Code Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setAppBankQrUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleSaveAppQrItem}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {appEditingQrId
                          ? 'Update Selected QR Code'
                          : '+ Add / Save QR Code to List'}
                      </span>
                    </button>

                    {appBankQrUrl && (
                      <button
                        type="button"
                        onClick={() => setAppBankQrUrl('')}
                        className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete QR Image</span>
                      </button>
                    )}
                  </div>

                  {appBankQrUrl && (
                    <div className="flex items-center gap-2">
                      <img
                        src={appBankQrUrl}
                        alt="Singer Bank QR"
                        className="w-10 h-10 rounded-lg object-contain border border-emerald-400 bg-white p-0.5"
                      />
                      <span className="text-[10px] font-bold text-emerald-700">
                        QR Image Ready ✓
                      </span>
                    </div>
                  )}
                </div>

                {/* Saved QR Codes in Applicant Form with Edit & Delete */}
                {appQrList.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="text-[10px] font-black uppercase text-slate-500">
                      Applicant Saved Bank QR Codes (Click Edit or Delete):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {appQrList.map((qr) => (
                        <div
                          key={qr.id}
                          className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {qr.customQrImageUrl ? (
                              <img
                                src={qr.customQrImageUrl}
                                alt="QR"
                                className="w-9 h-9 rounded-lg object-contain border border-emerald-400 bg-white p-0.5 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                                <QrCode className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-[10px] font-black text-slate-900 truncate">
                                {qr.accountName}
                              </div>
                              <div className="text-[9px] font-mono text-slate-600 truncate">
                                {qr.accountNumber}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setAppEditingQrId(qr.id);
                                setAppBankName(qr.bankName);
                                setAppBankAccNumber(qr.accountNumber);
                                setAppBankAccName(qr.accountName);
                                setAppBankBranch(qr.branch || '');
                                setAppBankQrUrl(qr.customQrImageUrl || '');
                              }}
                              className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAppQrList((prev) =>
                                  prev.filter((item) => item.id !== qr.id)
                                );
                                if (appEditingQrId === qr.id) {
                                  setAppEditingQrId(null);
                                }
                              }}
                              className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                              title="Delete QR Code"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Consent & Submit Button */}
              <div className="pt-1 space-y-3">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appAgreedTerms}
                    onChange={(e) => setAppAgreedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#df1c2d] rounded"
                  />
                  <span className="text-[11px] text-slate-700 leading-snug">
                    I agree to the{' '}
                    <strong className="text-slate-900">
                      DMC Xayraxa Official Singer Job Application & Product Affiliate Agreement
                    </strong>{' '}
                    (Open to General People • Free 0 LAK Registration • Includes Singer Wallet, Affiliate Product Links & Bank QR Code Withdrawals).
                  </span>
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#df1c2d] via-[#b80d22] to-[#850818] hover:from-red-600 hover:to-red-800 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-amber-300" />
                    <span>
                      {appRegistrationType === 'GENERAL_PUBLIC'
                        ? 'Submit Singer Registration (Free 0 LAK)'
                        : 'Submit Singer Registration'}
                    </span>
                  </button>
                </div>
              </div>
              </form>
            </div>
          )}

          {/* =====================================================================
              TAB 2: 2/ SINGER PROFILE DASHBOARD (WALLET, AFFILIATE, QR CRUD & WITHDRAW)
             ===================================================================== */}
          {activeTab === 'DASHBOARD' && activeSinger && (
            <div className="space-y-4">
              {/* Active Singer Switcher Bar */}
              <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-1.5 shrink-0">
                    Active Singer:
                  </span>
                  {singerProfiles.map((sng) => {
                    const isSelected = sng.id === activeSinger.id;
                    return (
                      <button
                        key={sng.id}
                        type="button"
                        onClick={() => handleSelectSinger(sng)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-amber-300 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <img
                          src={sng.avatarUrl}
                          alt={sng.stageName}
                          className="w-5 h-5 rounded-full object-cover border border-amber-400"
                        />
                        <span>{sng.stageName}</span>
                        <span className="text-[9px] font-mono opacity-75">
                          ({sng.singerCode})
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('APPLY')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Register Singer</span>
                </button>
              </div>

              {/* 🔔 SINGER SCHEDULE CALENDAR DATE & TIME WARNING BANNER */}
              {activeSingerBookings.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950 via-[#6B0816] to-slate-900 text-white border-2 border-amber-400 shadow-lg space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                        🔔 SINGER SCHEDULE CALENDAR DATE &amp; TIME WARNING
                      </span>
                      <span className="text-xs sm:text-sm font-black text-white">
                        Warning for Singer {activeSinger.stageName} ({activeSinger.singerCode}): You have {activeSingerBookings.length} Customer Party Booking(s) Scheduled!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDashboardSection('PARTY_SCHEDULE')}
                      className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer"
                    >
                      Check Schedule Calendar ({activeSingerBookings.length}) →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {activeSingerBookings.slice(0, 4).map((bk) => (
                      <div
                        key={bk.id}
                        className="p-2 rounded-xl bg-black/40 border border-amber-400/50 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-mono font-black text-amber-300">
                            📅 {bk.bookingDate} • ⏰ {bk.bookingTimeSlot}
                          </div>
                          <div className="font-bold text-white truncate">
                            Customer: {bk.customerName} (Member Free Active: {bk.customerMemberId || 'DMC-LA-00303'})
                          </div>
                          <div className="text-[10px] text-slate-300 truncate">
                            Venue: {bk.eventLocation} • Package: {formatNumberWithCommas(bk.totalPackagePriceLak)} LAK
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-mono text-[9px] font-black shrink-0">
                          BOOKED ✓
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====================================================================
                  GOLD METALLIC DMC USER MEMBER CARD & 3 BALANCE TILES (SAME AS USER MEMBER DASHBOARD)
                 ==================================================================== */}
              {(() => {
                const singerMemberId = activeSinger.memberId || currentMember.memberId;
                const singerMemberBalances = getMemberBalances(singerMemberId);
                const singerSongs = getMemberSongs(singerMemberId);
                const singerCommPool = getCustomerAffiliateCommissionBalance(singerMemberId);
                const combinedAvailableLak = Math.max(
                  activeSinger.walletAvailableLak,
                  singerMemberBalances.available
                );
                const singerDownlines = getDownlines(singerMemberId);
                return (
                  <div className="rounded-3xl bg-gradient-to-b from-[#69030e] via-[#850818] to-slate-900 p-3.5 shadow-xl border-2 border-amber-400 space-y-3">
                    {/* Top Row: Unified User Member + Singer Identity */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-white">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                          SINGER DASHBOARD = SAME AS USER MEMBER DASHBOARD
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-black">
                          Member ID: {singerMemberId} • PW: {activeSinger.password || '123456'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const res = resetSingerMemberWalletToZero(activeSinger.id);
                            showNotice(res.message, 'SUCCESS');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-rose-500/25 hover:bg-rose-500/40 border border-rose-300/60 text-rose-100 text-[10px] font-black cursor-pointer shadow"
                        >
                          Reset Wallet to 0 LAK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (activeSinger.memberId) {
                              setCurrentMemberId(activeSinger.memberId);
                            }
                            setIsLoggedOut(false);
                            try {
                              sessionStorage.setItem('dmc_active_home_role', 'MEMBER');
                            } catch {}
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer shadow"
                        >
                          Open Full User Member Home →
                        </button>
                      </div>
                    </div>

                    {/* 1. GOLD METALLIC DMC MEMBERSHIP CARD (EXACT SAME AS USER MEMBER) */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f5a623] via-[#f7b733] to-[#e69110] text-slate-950 p-4 shadow-xl border border-amber-200/60">
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/20 to-transparent pointer-events-none" />
                      <div className="relative z-10 flex items-stretch justify-between gap-3">
                        <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
                          <div className="flex items-center gap-2.5">
                            <DmcOfficialLogo
                              size={48}
                              rounded="full"
                              withGoldRing={false}
                              title="Official DMC Logo"
                              className="shadow-md border border-amber-900/20 shrink-0"
                            />
                            <div className="min-w-0">
                              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 leading-none">
                                DMC
                              </h1>
                              <div className="text-[10px] font-bold text-slate-900 tracking-wider mt-1 uppercase truncate">
                                DIGITAL MUSIC CENTER • {activeSinger.stageName} ({singerMemberId})
                              </div>
                            </div>
                          </div>

                          <div className="pt-1">
                            <div className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight leading-snug">
                              ACTIVE MEMBER — FREE MEMBER ACTIVE ({activeSinger.singerCode})
                            </div>
                            <div className="text-xs font-semibold text-slate-900/90 mt-0.5">
                              Same 3-Level User Member Network Commission (L1: 400,000 • L2: 200,000 • L3: 100,000 LAK)
                            </div>
                          </div>
                        </div>

                        {/* White Card Insert with Singer Referral QR Code (dmcxayraxa.music) */}
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                `https://dmcxayraxa.music/register?ref=${singerMemberId}&singer=${activeSinger.singerCode}`,
                                'SINGER_MEMBER_QR'
                              )
                            }
                            className="bg-white p-2 rounded-xl shadow-md border border-amber-200/80 hover:scale-105 transition-transform flex flex-col items-center cursor-pointer"
                            title="Click to Copy Singer User Member Referral QR Link (dmcxayraxa.music)"
                          >
                            <div className="w-14 h-14 bg-slate-950 rounded-lg p-1.5 grid grid-cols-4 gap-0.5 relative">
                              {Array.from({ length: 16 }).map((_, i) => (
                                <div
                                  key={i}
                                  className={`rounded-xs ${
                                    i % 2 === 0 || i === 0 || i === 3 || i === 12 || i === 15
                                      ? 'bg-amber-400'
                                      : 'bg-slate-700'
                                  }`}
                                />
                              ))}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <DmcOfficialLogo
                                  size={20}
                                  rounded="xl"
                                  withGoldRing={false}
                                  className="shadow"
                                />
                              </div>
                            </div>
                            <span className="mt-1 text-[9px] font-black text-[#0c4bb2] tracking-wider uppercase">
                              {copiedLinkKey === 'SINGER_MEMBER_QR' ? 'COPIED QR!' : 'REFERRAL QR'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 2. WHITE USER MEMBER QUALIFICATION BAR + 3 BALANCE & STATUS TILES + QUICK ACTION BUTTONS */}
                    <div className="bg-white rounded-2xl text-slate-800 p-3.5 shadow-md space-y-3">
                      {/* Qualification Progress: 100% Free Member Active */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-black text-indigo-950">
                          <span>Qualification Progress (Same as User Member)</span>
                          <span className="text-emerald-600 font-mono">
                            1,600,000 / 1,600,000 LAK (100% ACTIVE)
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
                          <div className="h-full w-full rounded-full bg-emerald-500" />
                        </div>
                      </div>

                      {/* 3 White Balance & Status Tiles (Exact Same as User Member Home) */}
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center space-y-0.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1a73e8] flex items-center justify-center mx-auto">
                            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                            1,600,000
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">
                            Qualification (Unlocked)
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center space-y-0.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#137333] flex items-center justify-center mx-auto">
                            <Wallet className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                            {formatNumberWithCommas(combinedAvailableLak)}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">
                            Withdrawable Balance (LAK)
                          </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-center space-y-0.5">
                          <div className="w-8 h-8 rounded-xl bg-red-50 text-[#df1c2d] flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div className="text-xs sm:text-sm font-black text-emerald-700">
                            ACTIVE
                          </div>
                          <div className="text-[10px] font-semibold text-slate-500">
                            Member Status (Free Active)
                          </div>
                        </div>
                      </div>

                      {/* 4 Colorful User Member Action Buttons (Buy Music Package, My Network 3 Levels, My Music, Transfer Commission -> Wallet) */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeSinger.memberId) setCurrentMemberId(activeSinger.memberId);
                            onClose();
                            onNavigateTab?.('catalog');
                          }}
                          className="bg-gradient-to-br from-[#e0192d] to-[#bd0d1e] text-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-0.5 shadow cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-white" />
                          <span className="text-[10px] font-black">Buy Music Package</span>
                          <span className="text-[9px] font-mono text-amber-200">1,600,000 LAK</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeSinger.memberId) setCurrentMemberId(activeSinger.memberId);
                            onClose();
                            onNavigateTab?.('network');
                          }}
                          className="bg-gradient-to-br from-[#1268e8] to-[#0c4bb2] text-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-0.5 shadow cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-white" />
                          <span className="text-[10px] font-black">My Network (3 Levels)</span>
                          <span className="text-[9px] font-mono text-sky-200">
                            L1:{singerDownlines.l1.length} • L2:{singerDownlines.l2.length} • L3:{singerDownlines.l3.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeSinger.memberId) setCurrentMemberId(activeSinger.memberId);
                            onClose();
                            onNavigateTab?.('wallet');
                          }}
                          className="bg-gradient-to-br from-[#05b865] to-[#038e4c] text-white rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-0.5 shadow cursor-pointer"
                        >
                          <Award className="w-4 h-4 text-white" />
                          <span className="text-[10px] font-black">Member Wallet &amp; Songs</span>
                          <span className="text-[9px] font-mono text-emerald-100">
                            {singerSongs.length} Studio Song(s)
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (activeSinger.memberId) setCurrentMemberId(activeSinger.memberId);
                            onClose();
                            onNavigateTab?.('wallet');
                          }}
                          className="bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 rounded-xl p-2.5 flex flex-col items-center justify-center text-center gap-0.5 shadow cursor-pointer"
                        >
                          <Wallet className="w-4 h-4 text-slate-950" />
                          <span className="text-[10px] font-black">Financial Wallet</span>
                          <span className="text-[9px] font-mono font-black">
                            {formatNumberWithCommas(combinedAvailableLak)} LAK
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Singer Profile Hero Banner Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#4a050d] to-slate-900 text-white p-4 shadow-lg border border-amber-400/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-200 to-[#df1c2d] shrink-0 shadow-lg">
                      <img
                        src={activeSinger.avatarUrl}
                        alt={activeSinger.stageName}
                        className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                        <Mic className="w-2.5 h-2.5 text-white" />
                      </span>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-base sm:text-lg font-black text-white truncate">
                          {activeSinger.stageName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                          {activeSinger.singerCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-black uppercase">
                          {activeSinger.registrationType === 'GENERAL_PUBLIC'
                            ? 'GENERAL PUBLIC SINGER'
                            : activeSinger.applicationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-amber-200 font-semibold flex items-center gap-2 flex-wrap">
                        <span>{activeSinger.fullName}</span>
                        <span>•</span>
                        <span>{activeSinger.vocalStyle}</span>
                        <span>•</span>
                        <span>{activeSinger.experienceYears} Yrs Exp</span>
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-amber-400" />
                          {activeSinger.phone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {activeSinger.province}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate ID, Edit Singer Profile & Main Share Link */}
                  <div className="bg-black/40 border border-amber-400/40 rounded-xl p-2.5 text-right shrink-0 space-y-1.5">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                      Official Singer Affiliate Code
                    </div>
                    <div className="font-mono text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg inline-block">
                      {activeSinger.affiliateCode}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsEditingSingerProfile((prev) => !prev)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>
                          {isEditingSingerProfile ? 'Close Edit' : 'Edit Singer Profile'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(mainSingerProfileLink, 'MAIN_SINGER_LINK')
                        }
                        className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow"
                      >
                        {copiedLinkKey === 'MAIN_SINGER_LINK' ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Copied Profile Link!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Singer Affiliate Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {singerProfileNotice && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{singerProfileNotice}</span>
                  </div>
                )}

                {/* Inline Edit Singer Profile Form */}
                {isEditingSingerProfile && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateSingerProfile(activeSinger.id, {
                        stageName: editSingerStageName.trim() || activeSinger.stageName,
                        fullName: editSingerFullName.trim() || activeSinger.fullName,
                        gender: editSingerGender,
                        vocalStyle: editSingerVocalStyle.trim() || activeSinger.vocalStyle,
                        experienceYears: Number(editSingerExpYears) || activeSinger.experienceYears,
                        province: editSingerProvince.trim() || activeSinger.province,
                        phone: editSingerPhone.trim() || activeSinger.phone,
                        email: editSingerEmail.trim(),
                        password: editSingerPassword.trim() || '123456',
                        bio: editSingerBio.trim() || activeSinger.bio,
                        avatarUrl: editSingerAvatarUrl.trim() || activeSinger.avatarUrl,
                      });
                      if (activeSinger.memberId) {
                        adminUpdateMember(activeSinger.memberId, {
                          name: editSingerFullName.trim() || activeSinger.fullName,
                          phone: editSingerPhone.trim() || activeSinger.phone,
                          email: editSingerEmail.trim(),
                          password: editSingerPassword.trim() || '123456',
                          avatarUrl: editSingerAvatarUrl.trim() || activeSinger.avatarUrl,
                        });
                      }
                      setSingerProfileNotice(
                        `Updated Singer Profile for ${editSingerStageName.trim() || activeSinger.stageName} (${activeSinger.singerCode})!`
                      );
                      setIsEditingSingerProfile(false);
                      setTimeout(() => setSingerProfileNotice(null), 4500);
                    }}
                    className="mt-3 p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/70 space-y-3 text-xs animate-in fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-white/15 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Pencil className="w-4 h-4 text-amber-400" />
                        <span className="font-black text-amber-300">
                          Edit 2/ User Singer Profile ({activeSinger.singerCode} • Member ID: {activeSinger.memberId || currentMember.memberId})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingSingerProfile(false)}
                        className="text-slate-400 hover:text-white text-[11px] font-bold cursor-pointer"
                      >
                        Cancel ✕
                      </button>
                    </div>

                    {/* Singer Avatar Upload & Presets */}
                    <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <img
                        src={editSingerAvatarUrl || activeSinger.avatarUrl}
                        alt={editSingerStageName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shrink-0"
                      />
                      <div className="flex-1 min-w-[200px] space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <label className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow">
                            <Upload className="w-3 h-3" />
                            <span>Upload Singer Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    setEditSingerAvatarUrl(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          {SINGER_PRESET_AVATARS.map((url, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setEditSingerAvatarUrl(url)}
                              className={`w-7 h-7 rounded-full overflow-hidden border cursor-pointer ${
                                editSingerAvatarUrl === url
                                  ? 'border-amber-400 ring-2 ring-amber-400'
                                  : 'border-slate-700'
                              }`}
                              title={`Preset Singer Portrait #${idx + 1}`}
                            >
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={editSingerAvatarUrl}
                          onChange={(e) => setEditSingerAvatarUrl(e.target.value)}
                          placeholder="https://... (Or paste Singer Photo URL)"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-300 mb-1">
                          Stage Name (Artist Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editSingerStageName}
                          onChange={(e) => setEditSingerStageName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Full Legal Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editSingerFullName}
                          onChange={(e) => setEditSingerFullName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Gender (Man / Woman)
                        </label>
                        <select
                          value={editSingerGender}
                          onChange={(e) => setEditSingerGender(e.target.value as 'MAN' | 'WOMAN')}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        >
                          <option value="MAN">MAN (Male Singer)</option>
                          <option value="WOMAN">WOMAN (Female Singer)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Vocal Style / Genre
                        </label>
                        <input
                          type="text"
                          value={editSingerVocalStyle}
                          onChange={(e) => setEditSingerVocalStyle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={editSingerExpYears}
                          onChange={(e) => setEditSingerExpYears(Number(e.target.value) || 0)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Province / Location
                        </label>
                        <input
                          type="text"
                          value={editSingerProvince}
                          onChange={(e) => setEditSingerProvince(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Phone Number (+856) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editSingerPhone}
                          onChange={(e) => setEditSingerPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editSingerEmail}
                          onChange={(e) => setEditSingerEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-300 mb-1">
                          Login Password / PIN *
                        </label>
                        <input
                          type="text"
                          required
                          value={editSingerPassword}
                          onChange={(e) => setEditSingerPassword(e.target.value)}
                          className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">
                          Singer Bio & Performance Highlights
                        </label>
                        <textarea
                          rows={2}
                          value={editSingerBio}
                          onChange={(e) => setEditSingerBio(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingSingerProfile(false)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Singer Profile & Password</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Newly Registered / Active Singer Profile 4-Pillar Overview Card (Wallet, Withdraw, Affiliate Commission, Booking Party Schedule Date & Time) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-[#4a050d] text-white border-2 border-amber-400 shadow-lg space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                      {justRegisteredSingerId === activeSinger.id
                        ? '✓ NEW SINGER REGISTERED — PROFILE DASHBOARD READY'
                        : 'SINGER PROFILE DASHBOARD'}
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      {activeSinger.stageName} ({activeSinger.singerCode}) • Wallet • Withdraw • Affiliate Commission • Customer Booking Party Schedule
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoggedOut(false);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer"
                  >
                    Enter Main App as {activeSinger.stageName} →
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => setDashboardSection('WALLET')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-emerald-400/50 transition-all cursor-pointer text-left"
                  >
                    <div className="text-[9px] font-black uppercase text-emerald-300 flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      <span>1. Singer Wallet</span>
                    </div>
                    <div className="text-sm font-black font-mono text-white mt-0.5">
                      {formatNumberWithCommas(activeSinger.walletAvailableLak)} LAK
                    </div>
                    <div className="text-[9px] text-emerald-200">
                      Available Balance
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDashboardSection('WITHDRAW')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-400/50 transition-all cursor-pointer text-left"
                  >
                    <div className="text-[9px] font-black uppercase text-amber-300 flex items-center gap-1">
                      <ArrowDownCircle className="w-3 h-3" />
                      <span>2. Withdraw</span>
                    </div>
                    <div className="text-sm font-black font-mono text-white mt-0.5">
                      {formatNumberWithCommas(activeSinger.totalWithdrawnLak)} LAK
                    </div>
                    <div className="text-[9px] text-amber-200">
                      Click to Withdraw to Bank/QR
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDashboardSection('AFFILIATE')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-sky-400/50 transition-all cursor-pointer text-left"
                  >
                    <div className="text-[9px] font-black uppercase text-sky-300 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>3. Affiliate Commission</span>
                    </div>
                    <div className="text-sm font-black font-mono text-white mt-0.5">
                      +{formatNumberWithCommas(activeSingerAffiliateTotalLak)} LAK
                    </div>
                    <div className="text-[9px] text-sky-200">
                      {activeSinger.affiliateSales.length} Sales • {activeSinger.recommendedProductSkus.length} Links
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDashboardSection('PARTY_SCHEDULE')}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-rose-400/50 transition-all cursor-pointer text-left"
                  >
                    <div className="text-[9px] font-black uppercase text-rose-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>4. Customer Booking Party</span>
                    </div>
                    <div className="text-sm font-black font-mono text-white mt-0.5">
                      {activeSingerBookings.length} Scheduled
                    </div>
                    <div className="text-[9px] text-rose-200 truncate">
                      {activeSingerBookings[0]
                        ? `${activeSingerBookings[0].bookingDate} • ${activeSingerBookings[0].bookingTimeSlot.split(' ')[0]}`
                        : 'View Date & Time'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Dashboard Sub-Tabs Filter (All | 1. Wallet | 2. Withdraw | 3. Affiliate Commission | 4. Booking Party Schedule | 5. My QR Code) */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
                {(
                  [
                    { id: 'ALL', label: 'All Dashboard' },
                    { id: 'WALLET', label: '1. Wallet' },
                    { id: 'WITHDRAW', label: '2. Withdraw' },
                    {
                      id: 'AFFILIATE',
                      label: `3. Affiliate Commission`,
                    },
                    {
                      id: 'PARTY_SCHEDULE',
                      label: `4. Booking Schedule (${activeSingerBookings.length})`,
                    },
                    {
                      id: 'QR_BANK',
                      label: `5. My QR (${activeSingerQrAccounts.length})`,
                    },
                  ] as const
                ).map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setDashboardSection(sec.id)}
                    className={`py-2 px-2 rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                      dashboardSection === sec.id
                        ? 'bg-[#df1c2d] text-white border-[#df1c2d] shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* ---------------- SECTION 1: SINGER WALLET ---------------- */}
              {(dashboardSection === 'ALL' || dashboardSection === 'WALLET') && (
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          1. Singer Wallet &amp; Earnings Balance (ກະເປົາເງິນນັກຮ້ອງ)
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          Real-time LAK balance from Customer Party Bookings (90% Net), Affiliate Commission &amp; Welcome Bonus
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const res = resetSingerMemberWalletToZero(activeSinger.id);
                          showNotice(res.message, 'SUCCESS');
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <span>Reset Wallet to 0 LAK</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDashboardSection('QR_BANK');
                          openAddDashboardQrForm();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>+ Manage My QR Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDashboardSection('WITHDRAW')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        <span>Withdraw to Bank</span>
                      </button>
                    </div>
                  </div>

                  {/* 5-BALANCE ACCOUNT CARDS (Same as User Member: Pending Balance, Held for Qualification, Available for Payout, Held for In-Flight Withdrawal, Recovery Due) */}
                  {(() => {
                    const singerMemberId = activeSinger.memberId || currentMember.memberId;
                    const singerMemberBalances = getMemberBalances(singerMemberId);
                    const availablePayoutLak = Math.max(
                      activeSinger.walletAvailableLak || 0,
                      singerMemberBalances.available || 0
                    );
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {/* Account 1: PENDING */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Pending Balance
                            </span>
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div className="text-base font-black font-mono text-slate-200">
                            {formatNumberWithCommas(singerMemberBalances.pending)} LAK
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Uncleared awards awaiting settlement
                          </div>
                        </div>

                        {/* Account 2: HELD_FOR_QUALIFICATION */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-amber-500/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-400 uppercase">
                              Held for Qualification
                            </span>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <div className="text-base font-black font-mono text-amber-300">
                            {formatNumberWithCommas(singerMemberBalances.heldForQualification)} LAK
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Safeguarded toward 1,600,000 LAK qualification
                          </div>
                        </div>

                        {/* Account 3: AVAILABLE */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-emerald-500/30 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">
                              Available for Payout
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="text-base font-black font-mono text-emerald-300">
                            {formatNumberWithCommas(availablePayoutLak)} LAK
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Ready for bank withdrawal payout
                          </div>
                        </div>

                        {/* Account 4: HELD_FOR_WITHDRAWAL */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Held for In-Flight Withdrawal
                            </span>
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div className="text-base font-black font-mono text-slate-300">
                            {formatNumberWithCommas(singerMemberBalances.heldForWithdrawal)} LAK
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Locked for pending withdrawal requests
                          </div>
                        </div>

                        {/* Account 5: RECOVERY_DUE */}
                        <div className="p-3 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              Recovery Due
                            </span>
                            <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                          </div>
                          <div className="text-base font-black font-mono text-slate-300">
                            {formatNumberWithCommas(singerMemberBalances.recoveryDue)} LAK
                          </div>
                          <div className="text-[9px] text-slate-400">
                            Outstanding clawback / recovery balance
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ---------------- SECTION: CUSTOMER BOOKING PARTY SCHEDULE (DATE & TIME ON SINGER DASHBOARD) ---------------- */}
              {(dashboardSection === 'ALL' ||
                dashboardSection === 'PARTY_SCHEDULE') && (
                <div className="bg-white rounded-2xl border-2 border-rose-400 p-4 space-y-3.5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-rose-100 text-[#df1c2d]">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="text-xs sm:text-sm font-black text-slate-900">
                            Customer Booking Party — Schedule Date &amp; Time on {activeSinger.stageName}&apos;s Dashboard
                          </h5>
                          <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase">
                            {activeSingerBookings.length} Party Booking(s)
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Live schedule of Customer Party Bookings showing Date, Time Slot, Venue, Customer Host, 90% Singer Net Payout &amp; 10% Loan Wallet Cut
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('BOOKING_PARTY')}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#850818] hover:from-red-600 hover:to-red-800 text-white text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>Open Full Party Booking Calendar →</span>
                    </button>
                  </div>

                  {/* Scheduled Customer Party Bookings List for this Singer */}
                  <div className="space-y-2.5">
                    {activeSingerBookings.map((bk) => (
                      <div
                        key={bk.id}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/70 via-white to-amber-50/50 border-2 border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          {/* Schedule Date & Time Highlight Bar */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-[#df1c2d] text-white font-mono text-[11px] font-black flex items-center gap-1 shadow-2xs">
                              <Calendar className="w-3.5 h-3.5 text-amber-300" />
                              <span>Schedule Date: {bk.bookingDate}</span>
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-mono text-[11px] font-black flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Time: {bk.bookingTimeSlot}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-[10px] font-black">
                              {bk.bookingCode} • {bk.status}
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm font-black text-slate-900">
                            {bk.partyEventName}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700 font-semibold">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-emerald-600" />
                              <span>
                                Customer: <strong>{bk.customerName}</strong> ({bk.customerPhone})
                              </span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-600" />
                              <span>Venue: {bk.eventLocation}</span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[9.5px] font-black">
                              Selected Package Party: {formatNumberWithCommas(bk.totalPackagePriceLak)} LAK
                            </span>
                            {bk.customerMemberId && (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9.5px] font-black">
                                Customer Member Free Active: {bk.customerMemberId} (PW: 123456)
                              </span>
                            )}
                            {bk.autoAffiliateCode && (
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black">
                                Customer Auto-Affiliate: {bk.autoAffiliateCode}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-right shrink-0 space-y-1 border border-amber-400/50">
                          <div className="text-[10px] text-slate-300">
                            Total Party Package:{' '}
                            <span className="font-mono font-bold text-white">
                              {formatNumberWithCommas(bk.totalPackagePriceLak)} LAK
                            </span>
                          </div>
                          <div className="text-xs font-black font-mono text-emerald-400">
                            90% Singer Wallet: +{formatNumberWithCommas(bk.singerNetPayout90PercentLak)} LAK
                          </div>
                          <div className="text-[10px] font-mono text-amber-300">
                            10% Loan Wallet Cut: {formatNumberWithCommas(bk.loanWalletCut10PercentLak)} LAK
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add / Test Customer Party Booking Schedule Form on Singer Dashboard */}
                  <form
                    onSubmit={handleQuickDashboardPartyBooking}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-black text-slate-900 text-[11px] flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-[#df1c2d]" />
                        <span>
                          + Schedule New Customer Booking Party for {activeSinger.stageName} (Instant Dashboard Schedule)
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        90% Credited to {activeSinger.stageName}&apos;s Wallet • 10% to Loan Wallet
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Schedule Date *
                        </label>
                        <input
                          type="date"
                          value={quickBookDate}
                          onChange={(e) => setQuickBookDate(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Schedule Time Slot *
                        </label>
                        <select
                          value={quickBookTimeSlot}
                          onChange={(e) => setQuickBookTimeSlot(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold"
                        >
                          <option value="18:00 - 22:00 (Evening Party Set)">
                            18:00 - 22:00 (Evening Party Set)
                          </option>
                          <option value="12:00 - 16:00 (Afternoon Matinee Set)">
                            12:00 - 16:00 (Afternoon Set)
                          </option>
                          <option value="20:00 - 24:00 (Late Night Concert Set)">
                            20:00 - 24:00 (Late Night Set)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Singer Price Tier *
                        </label>
                        <select
                          value={quickBookTier}
                          onChange={(e) =>
                            setQuickBookTier(
                              e.target.value as 'CHEAPER' | 'MEDIUM' | 'EXPENSIVE'
                            )
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold"
                        >
                          <option value="CHEAPER">Cheaper price (1,500,000 LAK)</option>
                          <option value="MEDIUM">Medium Price (2,500,000 LAK)</option>
                          <option value="EXPENSIVE">Expensive price (5,000,000 LAK)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={quickBookCustomerName}
                          onChange={(e) =>
                            setQuickBookCustomerName(e.target.value)
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Party / Event Name
                        </label>
                        <input
                          type="text"
                          value={quickBookEventName}
                          onChange={(e) => setQuickBookEventName(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] font-bold text-slate-600 mb-0.5">
                          Venue / Location
                        </label>
                        <input
                          type="text"
                          value={quickBookLocation}
                          onChange={(e) => setQuickBookLocation(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>+ Add Party Schedule</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ---------------- SECTION 2: RECOMMEND LINK PRODUCTS AFFILIATE ---------------- */}
              {(dashboardSection === 'ALL' ||
                dashboardSection === 'AFFILIATE') && (
                <div className="bg-white rounded-2xl border border-amber-300/90 p-4 space-y-3.5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          2. Recommend Link Products Affiliate (ແນະນຳລິ້ງສິນຄ້າຮັບຄ່າຄອມມິດຊັ່ນ)
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          Select products to recommend, copy your personal Singer Affiliate Link, or record a fan referral purchase
                        </p>
                      </div>
                    </div>

                    {/* Filter All Products vs Recommended */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setAffiliateFilter('ALL')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                          affiliateFilter === 'ALL'
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All Products ({products.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAffiliateFilter('RECOMMENDED')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                          affiliateFilter === 'RECOMMENDED'
                            ? 'bg-amber-500 text-slate-950'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        ★ My Recommended ({activeSinger.recommendedProductSkus.length})
                      </button>
                    </div>
                  </div>

                  {/* Affiliate Commission Earned Summary & Recent Commission Sales Ledger */}
                  <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-2">
                    {/* Singer Free Member Active Level & Same 3-Level User Member Network Commission Card */}
                    {(() => {
                      const singerMemberId =
                        activeSinger.memberId || currentMember.memberId;
                      const singerChain = getSponsorChain(singerMemberId);
                      const singerDownlines = getDownlines(singerMemberId);
                      return (
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-indigo-950 text-white border-2 border-emerald-400/80 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                                  SINGER = FREE MEMBER ACTIVE LEVEL ({singerMemberId})
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[9px] font-black">
                                  Same Commission as 1/ User Member & 3/ Customer Booking
                                </span>
                              </div>
                              <div className="text-xs font-black text-white mt-1">
                                3-Level User Member Network Commission: L1 +400,000 LAK (50%) • L2 +200,000 LAK (30%) • L3 +100,000 LAK (20%)
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const res =
                                  triggerUserMemberNetworkActivationCommission(
                                    singerMemberId,
                                    activeSinger.stageName,
                                    `Singer Free Member Active Network (${activeSinger.stageName})`
                                  );
                                setBannerMessage({
                                  type: 'SUCCESS',
                                  text: res.message,
                                });
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow cursor-pointer shrink-0"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>
                                ⚡ Activate Member & Credit L1/L2/L3 Commission (+400,000 LAK)
                              </span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
                            <div className="p-2 rounded-xl bg-white/10 border border-emerald-400/40">
                              <div className="font-black text-emerald-300 uppercase">
                                L1 Direct (50% • +400,000 LAK)
                              </div>
                              <div className="text-white font-bold mt-0.5">
                                Upline: {singerChain.l1 ? `${singerChain.l1.name} (${singerChain.l1.memberId})` : 'DMC Root (DMC-LA-00001)'}
                              </div>
                              <div className="text-emerald-200">
                                Singer L1 Downlines: <span className="font-black">{singerDownlines.l1.length} Active</span>
                              </div>
                            </div>
                            <div className="p-2 rounded-xl bg-white/10 border border-amber-400/40">
                              <div className="font-black text-amber-300 uppercase">
                                L2 Tier-2 (30% • +200,000 LAK)
                              </div>
                              <div className="text-white font-bold mt-0.5">
                                Upline: {singerChain.l2 ? `${singerChain.l2.name} (${singerChain.l2.memberId})` : 'DMC Tier-2'}
                              </div>
                              <div className="text-amber-200">
                                Singer L2 Downlines: <span className="font-black">{singerDownlines.l2.length} Active</span>
                              </div>
                            </div>
                            <div className="p-2 rounded-xl bg-white/10 border border-sky-400/40">
                              <div className="font-black text-sky-300 uppercase">
                                L3 Tier-3 (20% • +100,000 LAK)
                              </div>
                              <div className="text-white font-bold mt-0.5">
                                Upline: {singerChain.l3 ? `${singerChain.l3.name} (${singerChain.l3.memberId})` : 'DMC Tier-3'}
                              </div>
                              <div className="text-sky-200">
                                Singer L3 Downlines: <span className="font-black">{singerDownlines.l3.length} Active</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                          Singer Affiliate Commission Ledger ({activeSinger.affiliateCode})
                        </span>
                        <div className="text-xs font-bold text-slate-800">
                          Total Affiliate Commission Credited to Wallet:{' '}
                          <span className="font-mono font-black text-emerald-700">
                            +{formatNumberWithCommas(activeSingerAffiliateTotalLak)} LAK
                          </span>{' '}
                          ({activeSinger.affiliateSales.length} Referral Sales)
                        </div>
                      </div>
                    </div>

                    {activeSinger.affiliateSales.length > 0 && (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                        {activeSinger.affiliateSales.map((sale) => (
                          <div
                            key={sale.id}
                            className="p-2 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-2 text-[11px]"
                          >
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 truncate">
                                {sale.productTitle} ({sale.sku})
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Buyer: {sale.buyerName} •{' '}
                                {new Date(sale.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right shrink-0 font-mono">
                              <div className="font-black text-emerald-700 text-xs">
                                +{formatNumberWithCommas(sale.affiliateCommissionLak)} LAK
                              </div>
                              <div className="text-[9px] text-slate-500">
                                Affiliate Commission
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Affiliate Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products
                      .filter((p) =>
                        affiliateFilter === 'RECOMMENDED'
                          ? activeSinger.recommendedProductSkus.includes(p.sku)
                          : true
                      )
                      .map((prod) => {
                        const loc = getLocalizedProduct(prod, language);
                        const isRecommended =
                          activeSinger.recommendedProductSkus.includes(prod.sku);
                        const l1CommissionLak =
                          prod.sku === 'MUSIC_SINGLE_1600'
                            ? prod.splitRule.l1Share || 400000
                            : Math.round(
                                (prod.commissionPoolLak *
                                  (prod.splitRule.l1Share || 50)) /
                                  100
                              );
                        const productAffiliateUrl = `https://dmcxayraxa.music/shop?sku=${encodeURIComponent(
                          prod.sku
                        )}&singer=${encodeURIComponent(
                          activeSinger.affiliateCode
                        )}&member=${encodeURIComponent(
                          activeSinger.memberId || currentMember.memberId
                        )}`;

                        return (
                          <div
                            key={prod.sku}
                            className={`rounded-2xl border p-3 space-y-2.5 transition-all ${
                              isRecommended
                                ? 'bg-amber-50/40 border-amber-400 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200'
                            }`}
                          >
                            {/* Product Top Info */}
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <img
                                  src={prod.imageUrl}
                                  alt={loc.title}
                                  className="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 text-[8px] font-mono font-bold">
                                      {prod.sku}
                                    </span>
                                    {isRecommended && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[8px] font-black uppercase flex items-center gap-0.5">
                                        <Star className="w-2.5 h-2.5 fill-slate-950" />
                                        <span>Recommended</span>
                                      </span>
                                    )}
                                  </div>
                                  <h6 className="text-xs font-black text-slate-900 truncate mt-0.5">
                                    {loc.title}
                                  </h6>
                                  <div className="text-[11px] font-mono font-bold text-[#df1c2d]">
                                    Member Price: {formatNumberWithCommas(prod.priceLak)} LAK
                                  </div>
                                  <div className="text-[10px] font-mono font-black text-emerald-700">
                                    Singer L1 Commission: +
                                    {formatNumberWithCommas(l1CommissionLak)} LAK / sale
                                  </div>
                                </div>
                              </div>

                              {/* Toggle Recommend Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  toggleSingerRecommendedProduct(
                                    activeSinger.id,
                                    prod.sku
                                  )
                                }
                                className={`px-2 py-1 rounded-lg text-[9px] font-black shrink-0 cursor-pointer border transition-colors ${
                                  isRecommended
                                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                {isRecommended ? '★ Recommended' : '+ Recommend'}
                              </button>
                            </div>

                            {/* Unique Affiliate Link Box */}
                            <div className="p-2 rounded-xl bg-white border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                                <span className="flex items-center gap-1">
                                  <LinkIcon className="w-2.5 h-2.5 text-[#df1c2d]" />
                                  <span>Personal Singer Affiliate Product Link:</span>
                                </span>
                                <span className="font-mono text-emerald-700">
                                  Ref: {activeSinger.affiliateCode}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  readOnly
                                  value={productAffiliateUrl}
                                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-700 select-all"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyText(
                                      productAffiliateUrl,
                                      `PROD_${prod.sku}`
                                    )
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer"
                                >
                                  {copiedLinkKey === `PROD_${prod.sku}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Link</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Action Buttons: Share QR & Record Affiliate Sale */}
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setQrPreviewProductSku(
                                    qrPreviewProductSku === prod.sku
                                      ? null
                                      : prod.sku
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <QrCode className="w-3.5 h-3.5 text-slate-700" />
                                <span>Affiliate QR</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  const res = recordSingerAffiliateSale(
                                    activeSinger.id,
                                    prod.sku,
                                    fanBuyerNameInput || 'Verified Fan Buyer'
                                  );
                                  showNotice(
                                    res.message,
                                    res.success ? 'SUCCESS' : 'ERROR'
                                  );
                                }}
                                className="flex-1 py-1.5 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] font-black flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                                title="Record an affiliate product purchase via this singer's link and credit commission to Singer Wallet"
                              >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>
                                  + Earn Affiliate Sale (+
                                  {formatNumberWithCommas(l1CommissionLak)} LAK)
                                </span>
                              </button>
                            </div>

                            {/* Expandable Affiliate QR Code Preview */}
                            {qrPreviewProductSku === prod.sku && (
                              <div className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3 animate-in fade-in">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-14 h-14 bg-white rounded-xl p-1.5 grid grid-cols-4 gap-0.5 relative shrink-0">
                                    {Array.from({ length: 16 }).map((_, idx) => (
                                      <div
                                        key={idx}
                                        className={`rounded-xs ${
                                          idx % 2 === 0 || idx === 3 || idx === 12
                                            ? 'bg-slate-950'
                                            : 'bg-amber-500'
                                        }`}
                                      />
                                    ))}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <DmcOfficialLogo
                                        size={18}
                                        rounded="full"
                                        withGoldRing={false}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-[10px]">
                                    <div className="font-black text-amber-300">
                                      Scan to Buy via {activeSinger.stageName}
                                    </div>
                                    <div className="text-slate-300 truncate max-w-[180px]">
                                      {loc.title}
                                    </div>
                                    <div className="font-mono text-emerald-400 font-bold">
                                      Code: {activeSinger.affiliateCode}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setQrPreviewProductSku(null)}
                                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* ---------------- SECTION 3: SINGER QR CODE BANK MANAGER (ADD, EDIT, DELETE, UPDATE) ---------------- */}
              {(dashboardSection === 'ALL' ||
                dashboardSection === 'QR_BANK') && (
                <div className="bg-white rounded-2xl border-2 border-amber-400 p-4 space-y-3.5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          3. Singer Bank QR Code Manager — Add, Edit, Delete & Update QR Code
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          Manage {activeSinger.stageName}&apos;s personal Lao Bank QR Codes for instant wallet payouts & fan tips
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {qrCrudMode !== 'LIST' && (
                        <button
                          type="button"
                          onClick={() => {
                            setQrCrudMode('LIST');
                            setEditingDashboardQrId(null);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={openAddDashboardQrForm}
                        className="px-3 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add New QR Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Add / Edit / Update QR Code Form */}
                  {(qrCrudMode === 'ADD' || qrCrudMode === 'EDIT') && (
                    <form
                      onSubmit={handleSaveDashboardQrForm}
                      className="p-3.5 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3 text-xs animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#df1c2d]" />
                          <span>
                            {qrCrudMode === 'EDIT'
                              ? `Edit & Update Bank QR Code (${qrFormAccountNumber})`
                              : 'Add New Singer Bank QR Code'}
                          </span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                          {qrCrudMode === 'EDIT' ? 'EDIT / UPDATE MODE' : 'ADD QR MODE'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            Lao Bank Name *
                          </label>
                          <select
                            value={qrFormBankName}
                            onChange={(e) => setQrFormBankName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                          >
                            {laoBanks.map((b) => (
                              <option key={b.id} value={b.name}>
                                {b.shortName} ({b.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            Account Number *
                          </label>
                          <input
                            type="text"
                            required
                            value={qrFormAccountNumber}
                            onChange={(e) =>
                              setQrFormAccountNumber(e.target.value)
                            }
                            placeholder="e.g. 160-12-00884421-001"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-700 mb-1">
                            Account Holder Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={qrFormAccountName}
                            onChange={(e) =>
                              setQrFormAccountName(e.target.value.toUpperCase())
                            }
                            placeholder="FULL NAME IN CAPS"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase"
                          />
                        </div>
                      </div>

                      {/* Upload / Change / Delete QR Code Image */}
                      <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {qrFormImageUrl ? (
                            <img
                              src={qrFormImageUrl}
                              alt="Bank QR Preview"
                              className="w-16 h-16 rounded-xl object-contain border-2 border-emerald-500 bg-white p-1 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-slate-500 shrink-0">
                              <QrCode className="w-6 h-6" />
                              <span className="text-[8px] font-bold mt-0.5">
                                Auto QR
                              </span>
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="text-xs font-black text-slate-900">
                              Upload or Paste Singer Bank QR Code Image
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <label className="px-3 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs">
                                <Upload className="w-3 h-3" />
                                <span>Upload QR Image from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      if (typeof reader.result === 'string') {
                                        setQrFormImageUrl(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                              {qrFormImageUrl && (
                                <button
                                  type="button"
                                  onClick={() => setQrFormImageUrl('')}
                                  className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove QR Image</span>
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={qrFormImageUrl}
                              onChange={(e) => setQrFormImageUrl(e.target.value)}
                              placeholder="Or paste QR Code image URL..."
                              className="w-full sm:w-72 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-[10px] text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={qrFormIsDefault}
                              onChange={(e) =>
                                setQrFormIsDefault(e.target.checked)
                              }
                              className="w-4 h-4 accent-emerald-600 rounded"
                            />
                            <span>Set as Default Withdrawal QR</span>
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setQrCrudMode('LIST');
                                setEditingDashboardQrId(null);
                              }}
                              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                              <span>
                                {qrCrudMode === 'EDIT'
                                  ? 'Update QR Code'
                                  : 'Save New QR Code'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* List of Singer's Saved Bank QR Codes with Edit, Update, Upload, Delete */}
                  {activeSingerQrAccounts.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-2">
                      <QrCode className="w-7 h-7 text-slate-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-700">
                        No Bank QR Code Saved Yet
                      </div>
                      <button
                        type="button"
                        onClick={openAddDashboardQrForm}
                        className="px-3.5 py-1.5 rounded-xl bg-[#df1c2d] text-white text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add First Bank QR Code</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSingerQrAccounts.map((qrItem) => {
                        const bankMeta = laoBanks.find(
                          (b) => b.name === qrItem.bankName
                        );
                        return (
                          <div
                            key={qrItem.id}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                              qrItem.isDefault
                                ? 'bg-emerald-50/50 border-emerald-400 shadow-xs'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5">
                              <div className="flex items-start gap-2.5 min-w-0">
                                {/* Clickable QR Code Thumbnail */}
                                <button
                                  type="button"
                                  onClick={() => setPreviewLargeQrItem(qrItem)}
                                  className="relative w-16 h-16 rounded-xl bg-white border-2 border-emerald-400 p-1 flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer shadow-xs"
                                  title="Click to View Full QR Code"
                                >
                                  {qrItem.customQrImageUrl ? (
                                    <img
                                      src={qrItem.customQrImageUrl}
                                      alt={qrItem.accountName}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full grid grid-cols-4 gap-0.5 p-0.5">
                                      {Array.from({ length: 16 }).map((_, i) => (
                                        <div
                                          key={i}
                                          className={`rounded-xs ${
                                            i % 2 === 0 || i === 5
                                              ? 'bg-slate-900'
                                              : 'bg-emerald-500'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </button>

                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 text-[9px] font-black uppercase">
                                      {bankMeta?.shortName || qrItem.bankName}
                                    </span>
                                    {qrItem.isDefault && (
                                      <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[8px] font-black uppercase">
                                        DEFAULT QR
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs font-black text-slate-900 truncate">
                                    {qrItem.accountName}
                                  </div>
                                  <div className="text-[11px] font-mono font-bold text-emerald-700">
                                    {qrItem.accountNumber}
                                  </div>
                                  <div className="text-[9px] text-slate-500 truncate">
                                    {qrItem.branch || 'Vientiane Capital'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons: Use for Withdrawal | Upload QR | Edit / Update | Delete */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-200/80">
                              <button
                                type="button"
                                onClick={() => {
                                  setDefaultSingerBankQrAccount(
                                    activeSinger.id,
                                    qrItem.id
                                  );
                                  setWithdrawBankName(qrItem.bankName);
                                  setWithdrawAccountNumber(qrItem.accountNumber);
                                  setWithdrawAccountName(qrItem.accountName);
                                  setWithdrawQrUrl(qrItem.customQrImageUrl || '');
                                  showNotice(
                                    `Selected QR Account ${qrItem.accountNumber} (${qrItem.accountName}) for Withdrawals.`
                                  );
                                }}
                                className={`px-2 py-1 rounded-lg text-[9.5px] font-black cursor-pointer ${
                                  qrItem.isDefault
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300'
                                }`}
                              >
                                {qrItem.isDefault
                                  ? '✓ Active Payout QR'
                                  : 'Set as Default'}
                              </button>

                              <div className="flex items-center gap-1">
                                {/* Quick Upload / Replace QR Code Image */}
                                <label
                                  className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[9.5px] font-bold flex items-center gap-1 cursor-pointer"
                                  title="Upload or Replace QR Image"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>QR Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        if (typeof reader.result === 'string') {
                                          updateSingerBankQrAccount(
                                            activeSinger.id,
                                            qrItem.id,
                                            { customQrImageUrl: reader.result }
                                          );
                                          if (qrItem.isDefault) {
                                            setWithdrawQrUrl(reader.result);
                                          }
                                          showNotice(
                                            `Updated QR Code image for ${qrItem.accountNumber}!`
                                          );
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                </label>

                                {/* Edit / Update Button */}
                                <button
                                  type="button"
                                  onClick={() => openEditDashboardQrForm(qrItem)}
                                  className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[9.5px] font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Edit / Update</span>
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteSingerBankQrAccount(
                                      activeSinger.id,
                                      qrItem.id
                                    );
                                    showNotice(
                                      `Deleted Bank QR Code (${qrItem.accountNumber}).`
                                    );
                                  }}
                                  className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[9.5px] font-bold flex items-center gap-1 cursor-pointer"
                                  title="Delete Bank QR Code"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ---------------- SECTION 4: ALLOW TO WITHDRAW ---------------- */}
              {(dashboardSection === 'ALL' ||
                dashboardSection === 'WITHDRAW') && (
                <div className="bg-white rounded-2xl border-2 border-emerald-400/90 p-4 space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                        <ArrowDownCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">
                          4. Singer Wallet Withdrawal (ถอนเงิน / ຖອນເງິນຈາກກະເປົານັກຮ້ອງ)
                        </h5>
                        <p className="text-[10px] text-slate-500">
                          Withdraw your Singer Affiliate & Vocal Royalty balance directly to your Lao Bank Account or QR Code
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">
                        Available Singer Wallet:
                      </span>
                      <span className="text-sm sm:text-base font-black font-mono text-emerald-600">
                        {formatNumberWithCommas(activeSinger.walletAvailableLak)} LAK
                      </span>
                      {activeSinger.walletPendingLak > 0 && (
                        <span className="block text-[10px] font-mono font-black text-amber-700">
                          Waiting Admin Approval: {formatNumberWithCommas(activeSinger.walletPendingLak)} LAK
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-950 flex items-center justify-between gap-2">
                    <span>
                      ⏳ Every Singer Wallet &amp; Affiliate Commission Withdrawal Request waits for Administrator Approved before bank payout.
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase shrink-0">
                      Wait Admin Approved
                    </span>
                  </div>

                  {/* Quick Select Saved Bank QR Code for Withdrawal */}
                  {activeSingerQrAccounts.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-600">
                          Select Saved Singer QR Code for Payout (Or Click Add / Edit / Delete):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setDashboardSection('QR_BANK');
                            openAddDashboardQrForm();
                          }}
                          className="text-[10px] font-black text-[#df1c2d] hover:underline cursor-pointer"
                        >
                          + Add / Edit / Delete QR Codes →
                        </button>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {activeSingerQrAccounts.map((qr) => {
                          const isCurrent =
                            withdrawAccountNumber === qr.accountNumber &&
                            withdrawBankName === qr.bankName;
                          const shortBank =
                            laoBanks.find((b) => b.name === qr.bankName)
                              ?.shortName || qr.bankName;
                          return (
                            <button
                              key={qr.id}
                              type="button"
                              onClick={() => {
                                setWithdrawBankName(qr.bankName);
                                setWithdrawAccountNumber(qr.accountNumber);
                                setWithdrawAccountName(qr.accountName);
                                setWithdrawQrUrl(qr.customQrImageUrl || '');
                              }}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2 shrink-0 cursor-pointer transition-all ${
                                isCurrent
                                  ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-400'
                                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              {qr.customQrImageUrl ? (
                                <img
                                  src={qr.customQrImageUrl}
                                  alt="QR"
                                  className="w-8 h-8 rounded-lg object-contain bg-white border border-emerald-300 p-0.5"
                                />
                              ) : (
                                <QrCode className="w-5 h-5 text-emerald-600" />
                              )}
                              <div>
                                <div className="text-[10px] font-black text-slate-900">
                                  {shortBank} • {qr.accountName}
                                </div>
                                <div className="text-[9px] font-mono text-emerald-700 font-bold">
                                  {qr.accountNumber}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={handleExecuteSingerWithdrawal}
                    className="space-y-3 text-xs"
                  >
                    {/* Quick Withdrawal Amount Presets */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-black text-slate-700">
                          Withdrawal Amount (LAK) *
                        </label>
                        <div className="flex flex-wrap items-center gap-1">
                          {[100000, 250000, 500000, 1000000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setWithdrawAmountInput(String(amt))}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold cursor-pointer"
                            >
                              {formatNumberWithCommas(amt)}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setWithdrawAmountInput(
                                String(activeSinger.walletAvailableLak)
                              )
                            }
                            className="px-2 py-0.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer"
                          >
                            Withdraw Max
                          </button>
                        </div>
                      </div>

                      <input
                        type="number"
                        min="50000"
                        step="any"
                        required
                        value={withdrawAmountInput}
                        onChange={(e) => setWithdrawAmountInput(e.target.value)}
                        placeholder="Enter amount in LAK (min 50,000 LAK)..."
                        className="w-full bg-emerald-50/50 border-2 border-emerald-400 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black text-slate-900"
                      />
                    </div>

                    {/* Destination Bank Account & QR Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Receiving Lao Bank *
                        </label>
                        <select
                          value={withdrawBankName}
                          onChange={(e) => setWithdrawBankName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                        >
                          {laoBanks.map((b) => (
                            <option key={b.id} value={b.name}>
                              {b.shortName} ({b.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Bank Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={withdrawAccountNumber}
                          onChange={(e) =>
                            setWithdrawAccountNumber(e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={withdrawAccountName}
                          onChange={(e) =>
                            setWithdrawAccountName(e.target.value.toUpperCase())
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase"
                        />
                      </div>
                    </div>

                    {/* Upload / Preview / Delete Singer QR Code Bank */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        {withdrawQrUrl ? (
                          <img
                            src={withdrawQrUrl}
                            alt="Singer Bank QR"
                            className="w-10 h-10 rounded-lg object-contain bg-white border border-emerald-400 p-0.5"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
                            <QrCode className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="text-[11px] font-bold text-slate-800">
                            Singer Personal QR Code Bank
                          </div>
                          <div className="text-[9px] text-slate-500">
                            Upload, update, or remove your BCEL One / Lao QR image
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Upload / Update QR</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setWithdrawQrUrl(reader.result);
                                  if (activeSingerQrAccounts[0]) {
                                    updateSingerBankQrAccount(
                                      activeSinger.id,
                                      activeSingerQrAccounts[0].id,
                                      { customQrImageUrl: reader.result }
                                    );
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {withdrawQrUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setWithdrawQrUrl('');
                              if (activeSingerQrAccounts[0]) {
                                updateSingerBankQrAccount(
                                  activeSinger.id,
                                  activeSingerQrAccounts[0].id,
                                  { customQrImageUrl: undefined }
                                );
                              }
                            }}
                            className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete QR</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Payout Summary Breakdown & Submit */}
                    <div className="p-3 rounded-xl bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="text-emerald-300 font-semibold">
                          Gross Withdrawal:{' '}
                          <span className="font-mono font-bold text-white">
                            {formatNumberWithCommas(numericWithdrawAmount)} LAK
                          </span>{' '}
                          • Bank Fee:{' '}
                          <span className="font-mono text-amber-300">
                            {formatNumberWithCommas(bankFeeLak)} LAK
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-amber-300 font-mono">
                          Net Payout to Bank:{' '}
                          {formatNumberWithCommas(netWithdrawPayoutLak)} LAK
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          numericWithdrawAmount < 50000 ||
                          numericWithdrawAmount > activeSinger.walletAvailableLak
                        }
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <ArrowDownCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>Request Withdraw (Wait Administrator Approved)</span>
                      </button>
                    </div>
                  </form>

                  {/* Singer Withdrawal History List */}
                  {activeSinger.withdrawals.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          Recent Singer Wallet Withdrawals ({activeSinger.withdrawals.length})
                        </div>
                        <span className="text-[9px] font-black text-amber-800">
                          Administrator Approval Status
                        </span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {activeSinger.withdrawals.map((wth) => {
                          const isWaitingAdmin =
                            wth.status === 'PENDING_REVIEW' ||
                            wth.status === 'APPROVED';
                          return (
                            <div
                              key={wth.id}
                              className={`p-2.5 rounded-xl border space-y-2 text-[11px] ${
                                isWaitingAdmin
                                  ? 'bg-amber-50/90 border-amber-400'
                                  : wth.status === 'PAID'
                                  ? 'bg-slate-50 border-emerald-300'
                                  : 'bg-red-50/60 border-red-200'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono text-xs">{wth.id}</span>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                        isWaitingAdmin
                                          ? 'bg-amber-400 text-slate-950'
                                          : wth.status === 'PAID'
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {isWaitingAdmin
                                        ? '⏳ WAITING ADMINISTRATOR APPROVED'
                                        : wth.status === 'PAID'
                                        ? '✓ ADMINISTRATOR APPROVED • PAID'
                                        : '✕ REJECTED (REFUNDED)'}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-600 font-mono">
                                    {wth.bankName} • {wth.accountNumber} ({wth.accountName})
                                  </div>
                                  {wth.note && (
                                    <div className="text-[9px] text-slate-500">
                                      {wth.note}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right font-mono shrink-0">
                                  <div className="font-black text-slate-900 text-xs">
                                    {formatNumberWithCommas(wth.amountLak)} LAK
                                  </div>
                                  <div className="text-[10px] font-bold text-emerald-700">
                                    Net: {formatNumberWithCommas(wth.netPayoutLak)} LAK
                                  </div>
                                  <div className="text-[9px] text-slate-400">
                                    {new Date(wth.requestedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              {isWaitingAdmin && (
                                <div className="pt-1.5 border-t border-amber-300/70 flex flex-wrap items-center justify-between gap-1.5">
                                  <span className="text-[10px] font-black text-amber-900">
                                    Administrator Action:
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const res =
                                          adminApproveWithdrawalRequest(
                                            wth.id,
                                            'SUPER-ADMIN-01'
                                          );
                                        setDashboardNotice({
                                          type: res.success ? 'success' : 'error',
                                          text: res.message,
                                        });
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Administrator Approve &amp; Pay</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        rejectWithdrawal(
                                          wth.id,
                                          'Rejected by Administrator — Refunded to Singer Wallet'
                                        );
                                        setDashboardNotice({
                                          type: 'error',
                                          text: `Withdrawal ${wth.id} rejected by Administrator and refunded to Available Singer Wallet.`,
                                        });
                                      }}
                                      className="px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-black cursor-pointer"
                                    >
                                      Reject &amp; Refund
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              TAB 3: SINGER ROSTER DIRECTORY & POPUP SINGER SELECTION (5 PEOPLE)
             ===================================================================== */}
          {activeTab === 'DIRECTORY' && (
            <div className="space-y-3">
              {/* Popup Singer Selection Header & Quick Select Dropdown */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Select Singer ({singerProfiles.length} Registered Singers — Man &amp; Woman)
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Select a Singer below to Book Party Package Set or Open Singer Dashboard
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('BOOKING_PARTY')}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Party Set</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('APPLY')}
                      className="px-3 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Register Singer</span>
                    </button>
                  </div>
                </div>

                {/* Quick Dropdown Select for the 5 Singers */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-slate-100">
                  <select
                    value={activeSinger?.id || singerProfiles[0]?.id || ''}
                    onChange={(e) => {
                      const picked = singerProfiles.find((s) => s.id === e.target.value);
                      if (picked) {
                        handleSelectSinger(picked);
                      }
                    }}
                    aria-label="Select Singer from 5 People"
                    className="flex-1 bg-amber-50/70 border border-amber-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {singerProfiles.map((sng, idx) => (
                      <option key={sng.id} value={sng.id}>
                        {idx + 1}. {sng.stageName} ({sng.singerCode} • {sng.gender === 'WOMAN' ? 'WOMAN' : 'MAN'}) — Start: {formatNumberWithCommas(sng.startSingerPriceLak || sng.cheaperPriceLak || 2500000)} LAK
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setActiveTab('BOOKING_PARTY')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black cursor-pointer shadow shrink-0"
                  >
                    Select &amp; Book Singer →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {singerProfiles.map((sng, idx) => {
                  const startPrice = sng.startSingerPriceLak || sng.cheaperPriceLak || 2500000;
                  const pkgPrice = sng.packagePartyPriceLak || 8300000;
                  const isSelected = activeSinger?.id === sng.id;
                  return (
                    <div
                      key={sng.id}
                      className={`p-3.5 rounded-2xl bg-white border-2 shadow-xs space-y-2.5 transition-all ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-200/60'
                          : 'border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={sng.avatarUrl}
                              alt={sng.stageName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                            />
                            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                              {idx + 1}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {sng.stageName}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-mono font-bold">
                                {sng.singerCode}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                                  sng.gender === 'WOMAN'
                                    ? 'bg-pink-100 text-pink-800'
                                    : 'bg-sky-100 text-sky-800'
                                }`}
                              >
                                {sng.gender === 'WOMAN' ? 'WOMAN' : 'MAN'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-600 truncate">
                              {sng.fullName} • {sng.vocalStyle}
                            </div>
                            <div className="text-[10px] font-mono text-emerald-700 font-bold">
                              Wallet: {formatNumberWithCommas(sng.walletAvailableLak)} LAK
                            </div>
                          </div>
                        </div>

                        {isAdmin && singerProfiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              deleteSingerProfile(sng.id);
                              showNotice(`Removed singer ${sng.stageName}.`);
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Admin: Delete Singer Profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Start Singer Price & Package Party Price */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="text-[8px] font-bold uppercase text-slate-500">
                            Start Singer Price
                          </div>
                          <div className="font-mono font-black text-emerald-700">
                            {formatNumberWithCommas(startPrice)} LAK
                          </div>
                        </div>
                        <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                          <div className="text-[8px] font-bold uppercase text-slate-500">
                            Package Party Price
                          </div>
                          <div className="font-mono font-black text-amber-700">
                            {formatNumberWithCommas(pkgPrice)} LAK
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          Affiliate: <strong>{sng.affiliateCode}</strong>
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectSinger(sng);
                              setActiveTab('DASHBOARD');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black cursor-pointer"
                          >
                            Dashboard
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectSinger(sng);
                              setActiveTab('BOOKING_PARTY');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer shadow-xs"
                          >
                            Select &amp; Book →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================================
              TAB 3: BOOKING FORM — BOOKING SINGER MUSIC CAIN PARTY SET PACKAGE
             ==================================================================== */}
          {activeTab === 'BOOKING_PARTY' && (
            <LoanWalletAndSingerBookingHub
              initialMode="BOOKING_FORM"
              preselectedSingerId={activeSinger?.id}
              onOpenAdminPanel={onClose}
              onBookingCompleted={onClose}
            />
          )}

          {/* ====================================================================
              TAB 4: LOAN WALLET CENTER (ADMIN DEPOSIT, WITHDRAW & 10% SINGER BOOKING CUT)
             ==================================================================== */}
          {activeTab === 'LOAN_WALLET' && (
            <LoanWalletAndSingerBookingHub
              initialMode="LOAN_WALLET"
              preselectedSingerId={activeSinger?.id}
              onOpenAdminPanel={onClose}
            />
          )}
        </div>

        {/* Full-Size QR Code Preview Modal */}
        {previewLargeQrItem && (
          <div className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center space-y-3 border-2 border-amber-400 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-900">
                  Singer Bank QR Code
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewLargeQrItem(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-48 h-48 mx-auto rounded-2xl border-2 border-emerald-500 p-2 bg-white flex items-center justify-center">
                {previewLargeQrItem.customQrImageUrl ? (
                  <img
                    src={previewLargeQrItem.customQrImageUrl}
                    alt={previewLargeQrItem.accountName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full grid grid-cols-5 gap-1 p-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i === 6 || i === 18
                            ? 'bg-slate-900'
                            : 'bg-emerald-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">
                  {previewLargeQrItem.accountName}
                </div>
                <div className="text-xs font-mono font-bold text-emerald-700">
                  {previewLargeQrItem.accountNumber}
                </div>
                <div className="text-[10px] text-slate-500">
                  {previewLargeQrItem.bankName}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const item = previewLargeQrItem;
                    setPreviewLargeQrItem(null);
                    setDashboardSection('QR_BANK');
                    openEditDashboardQrForm(item);
                  }}
                  className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs cursor-pointer"
                >
                  Edit / Update QR
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLargeQrItem(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- MODAL FOOTER ---------------- */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {activeTab === 'BOOKING_PARTY'
                ? 'DMC Xayraxa Official Party & Singer Booking'
                : 'DMC Xayraxa Official Singer Registration'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'BOOKING_PARTY' ? (
              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById(
                    'dmc-customer-party-booking-form'
                  ) as HTMLFormElement | null;
                  if (formEl) {
                    formEl.requestSubmit();
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Booking</span>
              </button>
            ) : (
              activeTab !== 'APPLY' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('APPLY')}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs cursor-pointer"
                >
                  1/ Register Singer
                </button>
              )
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
