import React, { useState, useMemo, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import { formatLak, formatNumberWithCommas } from '../../utils/i18n';
import {
  SingerPriceTier,
  BrandSetPackageType,
  SingerCopyrightMusicType,
  DmcBookingPackageCategory,
  DmcBookingPackageOption,
  DmcSingerPartyBooking,
  DmcLoanWalletTransaction,
  DmcAdminPanelBookingReport,
  DmcSingerProfile,
  DMC_SINGER_VOCAL_STYLES,
} from '../../types/dmc';
import {
  Landmark,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Calendar,
  Mic,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  User,
  Trash2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Percent,
  Radio,
  Disc,
  Award,
  Plus,
  Pencil,
  Save,
  X,
  FileSpreadsheet,
  Send,
  RotateCcw,
  Download,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Link as LinkIcon,
  QrCode,
  Upload,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface LoanWalletAndSingerBookingHubProps {
  initialMode?:
    | 'ALL'
    | 'SINGER_REGISTER_REPORT'
    | 'LOAN_WALLET'
    | 'BOOKING_FORM'
    | 'CUSTOMER_AFFILIATE_DASHBOARD'
    | 'ADMIN_PRICE_CRUD'
    | 'ADMIN_REPORTS';
  preselectedSingerId?: string;
  compact?: boolean;
  onOpenAdminPanel?: () => void;
  onBookingCompleted?: () => void;
}

export const LoanWalletAndSingerBookingHub: React.FC<
  LoanWalletAndSingerBookingHubProps
> = ({
  initialMode = 'ALL',
  preselectedSingerId,
  onOpenAdminPanel,
  onBookingCompleted,
}) => {
  const {
    currentMember,
    allMembers,
    setCurrentMemberId,
    setIsLoggedOut,
    getMemberBalances,
    getMemberLedger,
    getMemberAwards,
    products,
    withdrawals,
    singerProfiles,
    applyForSingerJob,
    updateSingerProfile,
    deleteSingerProfile,
    laoBanks,
    corporateBankAccounts,
    setIsAdminMode,
    setIsAdminAuthenticated,
    loanWalletBalanceLak,
    loanWalletTransactions,
    adminDepositLoanWallet,
    adminWithdrawLoanWallet,
    adminUpdateLoanWalletTransaction,
    adminDeleteLoanWalletTransaction,
    singerBookingPricing,
    updateSingerBookingPricing,
    bookingPackageOptions,
    adminAddBookingPackageOption,
    adminUpdateBookingPackageOption,
    adminDeleteBookingPackageOption,
    adminResetBookingPackageOptions,
    singerBookings,
    createSingerPartyBooking,
    recordCustomerAffiliateCommission,
    getCustomerAffiliateCommissionBalance,
    getCustomerAffiliateTransfers,
    transferAffiliateCommissionToCustomerWallet,
    withdrawCustomerAffiliateWallet,
    triggerUserMemberNetworkActivationCommission,
    submitCustomerActivePackagePayment,
    adminApproveCustomerToActiveMember,
    getSponsorChain,
    getDownlines,
    adminApproveWithdrawalRequest,
    rejectWithdrawal,
    updateSingerPartyBooking,
    deleteSingerPartyBooking,
    adminPanelBookingReports,
    submitReportToAdminPanel,
    updateAdminPanelBookingReport,
    deleteAdminPanelBookingReport,
    adminUpdateMember,
  } = useDmc();

  const [activeView, setActiveView] = useState<
    | 'ALL'
    | 'SINGER_REGISTER_REPORT'
    | 'LOAN_WALLET'
    | 'BOOKING_FORM'
    | 'CUSTOMER_AFFILIATE_DASHBOARD'
    | 'ADMIN_PRICE_CRUD'
    | 'ADMIN_REPORTS'
  >(initialMode === 'ADMIN_PRICE_CRUD' ? 'ALL' : initialMode);
  const isCustomerBookingModal = initialMode === 'BOOKING_FORM';

  // Toast notice
  const [bannerNotice, setBannerNotice] = useState<{
    type: 'SUCCESS' | 'ERROR';
    text: string;
  } | null>(null);

  const showBanner = (text: string, type: 'SUCCESS' | 'ERROR' = 'SUCCESS') => {
    setBannerNotice({ text, type });
    setTimeout(() => setBannerNotice(null), 6500);
  };

  // Switch directly to full Administrator Portal
  const handleGoToAdministratorPanel = () => {
    setIsAdminAuthenticated(true);
    setIsAdminMode(true);
    if (onOpenAdminPanel) {
      onOpenAdminPanel();
    }
  };

  // Categorized package options from context
  const singerPriceTierOptions = useMemo(
    () =>
      bookingPackageOptions.filter((o) => o.category === 'SINGER_PRICE_TIER'),
    [bookingPackageOptions]
  );
  const brandSetPackageOptions = useMemo(
    () =>
      bookingPackageOptions.filter((o) => o.category === 'BRAND_SET_PACKAGE'),
    [bookingPackageOptions]
  );
  const copyrightMusicOptions = useMemo(
    () =>
      bookingPackageOptions.filter((o) => o.category === 'COPYRIGHT_OWN_MUSIC'),
    [bookingPackageOptions]
  );

  // ============================================================================
  // INLINE PACKAGE PRICE ADD / EDIT / UPDATE / DELETE STATE
  // ============================================================================
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editPkgTitle, setEditPkgTitle] = useState<string>('');
  const [editPkgSubtitle, setEditPkgSubtitle] = useState<string>('');
  const [editPkgBadge, setEditPkgBadge] = useState<string>('');
  const [editPkgPriceLak, setEditPkgPriceLak] = useState<number>(0);

  const [addingCategory, setAddingCategory] =
    useState<DmcBookingPackageCategory | null>(null);
  const [newPkgTitle, setNewPkgTitle] = useState<string>('');
  const [newPkgSubtitle, setNewPkgSubtitle] = useState<string>('');
  const [newPkgBadge, setNewPkgBadge] = useState<string>('CUSTOM PACKAGE');
  const [newPkgPriceLak, setNewPkgPriceLak] = useState<number>(3000000);

  const startEditPackageOption = (opt: DmcBookingPackageOption) => {
    setEditingPackageId(opt.id);
    setEditPkgTitle(opt.title);
    setEditPkgSubtitle(opt.subtitle);
    setEditPkgBadge(opt.badge);
    setEditPkgPriceLak(opt.priceLak);
  };

  const handleSaveEditPackageOption = (opt: DmcBookingPackageOption) => {
    const cleanPrice = Math.max(0, Math.round(Number(editPkgPriceLak) || 0));
    adminUpdateBookingPackageOption(opt.id, {
      title: editPkgTitle.trim() || opt.title,
      subtitle: editPkgSubtitle.trim() || opt.subtitle,
      badge: editPkgBadge.trim() || opt.badge,
      priceLak: cleanPrice,
    });
    // Sync active booking form price if currently selected
    if (
      opt.category === 'SINGER_PRICE_TIER' &&
      (singerPriceTier === opt.code || singerPriceTier === opt.id)
    ) {
      setCustomSingerPriceLak(cleanPrice);
    } else if (
      opt.category === 'BRAND_SET_PACKAGE' &&
      (brandSetPackageType === opt.code || brandSetPackageType === opt.id)
    ) {
      setCustomBrandSetPriceLak(cleanPrice);
    } else if (
      opt.category === 'COPYRIGHT_OWN_MUSIC' &&
      (copyrightMusicType === opt.code || copyrightMusicType === opt.id)
    ) {
      setCustomCopyrightPriceLak(cleanPrice);
    }
    setEditingPackageId(null);
    showBanner(
      `Updated price for "${editPkgTitle || opt.title}" to ${formatLak(cleanPrice)}!`
    );
  };

  const handleOpenAddCategoryForm = (cat: DmcBookingPackageCategory) => {
    setAddingCategory(cat);
    if (cat === 'SINGER_PRICE_TIER') {
      setNewPkgTitle('VIP Custom Singer Party Price');
      setNewPkgSubtitle('Custom Singer Live Party Vocal Performance Set');
      setNewPkgBadge('CUSTOM SINGER TIER');
      setNewPkgPriceLak(4500000);
    } else if (cat === 'BRAND_SET_PACKAGE') {
      setNewPkgTitle('Festival Concert Brand Set Price');
      setNewPkgSubtitle('Full Outdoor Concert Line-Array & Stage Lighting Set');
      setNewPkgBadge('FESTIVAL BRAND SET');
      setNewPkgPriceLak(8000000);
    } else {
      setNewPkgTitle('Acoustic & Indie Own Music');
      setNewPkgSubtitle('Singer performs original copyright Acoustic & Indie songs');
      setNewPkgBadge('OWN COPYRIGHT • ACOUSTIC');
      setNewPkgPriceLak(1600000);
    }
  };

  const handleCreatePackageOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingCategory) return;
    const cleanPrice = Math.max(0, Math.round(Number(newPkgPriceLak) || 0));
    const code = `${addingCategory}_${Date.now().toString().slice(-4)}`;
    const created = adminAddBookingPackageOption({
      category: addingCategory,
      code,
      title: newPkgTitle.trim() || 'Custom Package Price',
      subtitle: newPkgSubtitle.trim() || 'Custom Singer Party Set Package',
      badge: newPkgBadge.trim() || 'CUSTOM PACKAGE',
      priceLak: cleanPrice,
    });
    // Select the newly added package automatically
    if (addingCategory === 'SINGER_PRICE_TIER') {
      setSingerPriceTier(created.code);
      setCustomSingerPriceLak(created.priceLak);
    } else if (addingCategory === 'BRAND_SET_PACKAGE') {
      setBrandSetPackageType(created.code);
      setCustomBrandSetPriceLak(created.priceLak);
    } else {
      setCopyrightMusicType(created.code);
      setCustomCopyrightPriceLak(created.priceLak);
    }
    setAddingCategory(null);
    showBanner(
      `Added new package "${created.title}" (${formatLak(created.priceLak)})!`
    );
  };

  // ============================================================================
  // 1. LOAN WALLET CENTER STATE (ADMINISTRATOR PANEL: WITHDRAW + 10% CUT)
  // ============================================================================
  const [loanActionTab, setLoanActionTab] = useState<
    'WITHDRAW' | 'PRICING_CONFIG'
  >('WITHDRAW');
  const [txFilter, setTxFilter] = useState<
    'ALL' | 'WITHDRAW' | 'SINGER_BOOKING_10_PERCENT_CUT'
  >('ALL');

  // Deposit Form
  const [depositAmountLak, setDepositAmountLak] = useState<number>(5000000);
  const [depositBankName, setDepositBankName] = useState<string>(
    'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [depositAccountNumber, setDepositAccountNumber] = useState<string>(
    '160-12-00998877-001'
  );
  const [depositAccountName, setDepositAccountName] = useState<string>(
    'DMC XAYRAXA LOAN WALLET CENTER'
  );
  const [depositNote, setDepositNote] = useState<string>(
    'Administrator Treasury Deposit to Loan Wallet Center'
  );

  // Withdraw Form
  const [withdrawSource, setWithdrawSource] = useState<
    'SINGER_10_PERCENT_CUT' | 'LOAN_WALLET_BALANCE'
  >('SINGER_10_PERCENT_CUT');
  const [withdrawAmountLak, setWithdrawAmountLak] = useState<number>(1000000);
  const [withdrawBankName, setWithdrawBankName] = useState<string>(
    'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState<string>(
    '160-12-00049281-001'
  );
  const [withdrawAccountName, setWithdrawAccountName] = useState<string>(
    'DMC PARTY WALLET PAYOUT BENEFICIARY'
  );
  const [withdrawNote, setWithdrawNote] = useState<string>(
    'Administrator Withdraw from 10% Saving for Loan'
  );

  // Inline Edit Loan Wallet Transaction
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editTxAmountLak, setEditTxAmountLak] = useState<number>(0);
  const [editTxNote, setEditTxNote] = useState<string>('');
  const [editTxBankName, setEditTxBankName] = useState<string>('');
  const [editTxAccountNumber, setEditTxAccountNumber] = useState<string>('');

  const startEditLoanTx = (tx: DmcLoanWalletTransaction) => {
    setEditingTxId(tx.id);
    setEditTxAmountLak(tx.amountLak);
    setEditTxNote(tx.note);
    setEditTxBankName(tx.bankName || '');
    setEditTxAccountNumber(tx.accountNumber || '');
  };

  const handleSaveLoanTx = (tx: DmcLoanWalletTransaction) => {
    adminUpdateLoanWalletTransaction(tx.id, {
      amountLak: Math.max(0, Math.round(Number(editTxAmountLak) || 0)),
      note: editTxNote.trim() || tx.note,
      bankName: editTxBankName.trim() || tx.bankName,
      accountNumber: editTxAccountNumber.trim() || tx.accountNumber,
    });
    setEditingTxId(null);
    showBanner(`Updated Loan Wallet transaction ${tx.txRef}!`);
  };

  // Summary metrics for Loan Wallet Center (5% from Singer Wallet + 5% from DMC Party Wallet = 10% Saving for Loan)
  const loanWalletSummary = useMemo(() => {
    let totalDeposited = 0;
    let totalWithdrawn = 0;
    let total10PercentSingerCuts = 0;
    let totalSingerWallet5PercentSaving = 0;
    let totalPartyWallet5PercentSaving = 0;
    let withdrawnFrom10PercentCut = 0;
    let cutCount = 0;

    for (const tx of loanWalletTransactions) {
      if (tx.type === 'DEPOSIT') totalDeposited += tx.amountLak;
      else if (tx.type === 'WITHDRAW') {
        totalWithdrawn += tx.amountLak;
        if (
          tx.note?.toLowerCase().includes('10%') ||
          tx.note?.toLowerCase().includes('saving for loan') ||
          Boolean(tx.bookingId)
        ) {
          withdrawnFrom10PercentCut += tx.amountLak;
        }
      } else if (tx.type === 'SINGER_BOOKING_10_PERCENT_CUT') {
        total10PercentSingerCuts += tx.amountLak;
        const s5 =
          tx.singerWallet5PercentSavingLak !== undefined
            ? tx.singerWallet5PercentSavingLak
            : Math.round((tx.singerPriceLak || 2500000) * 0.05);
        const p5 =
          tx.dmcPartyWallet5PercentSavingLak !== undefined
            ? tx.dmcPartyWallet5PercentSavingLak
            : Math.max(0, tx.amountLak - s5);
        totalSingerWallet5PercentSaving += s5;
        totalPartyWallet5PercentSaving += p5;
        cutCount += 1;
      }
    }

    // Fallback to active singerBookings if transactions were cleared so 10% Saving for Loan always reflects confirmed bookings
    const activeBookings = singerBookings.filter(
      (b) => b.status !== 'CANCELLED'
    );
    if (cutCount === 0 && activeBookings.length > 0) {
      for (const b of activeBookings) {
        const sPrice = b.startSingerPriceLak || b.singerPriceLak || 2500000;
        const pPrice =
          b.packagePartyPriceLak !== undefined
            ? b.packagePartyPriceLak
            : (b.brandSetPackagePriceLak || 0) +
              (b.copyrightMusicPriceLak || 0);
        const s5 =
          b.singerWallet5PercentSavingLak !== undefined
            ? b.singerWallet5PercentSavingLak
            : Math.round(sPrice * 0.05);
        const p5 =
          b.dmcPartyWallet5PercentSavingLak !== undefined
            ? b.dmcPartyWallet5PercentSavingLak
            : Math.round(pPrice * 0.05);
        totalSingerWallet5PercentSaving += s5;
        totalPartyWallet5PercentSaving += p5;
        total10PercentSingerCuts += s5 + p5;
        cutCount += 1;
      }
    }

    const available10PercentCutLak = Math.max(
      0,
      total10PercentSingerCuts - withdrawnFrom10PercentCut
    );
    return {
      totalDeposited,
      totalWithdrawn,
      total10PercentSingerCuts,
      totalSingerWallet5PercentSaving,
      totalPartyWallet5PercentSaving,
      withdrawnFrom10PercentCut,
      available10PercentCutLak,
      cutCount,
    };
  }, [loanWalletTransactions, singerBookings]);

  const filteredLoanTransactions = useMemo(() => {
    const nonDepositTxs = loanWalletTransactions.filter(
      (t) => t.type !== 'DEPOSIT'
    );
    if (txFilter === 'ALL') return nonDepositTxs;
    return nonDepositTxs.filter((t) => t.type === txFilter);
  }, [loanWalletTransactions, txFilter]);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = adminDepositLoanWallet(depositAmountLak, depositNote, {
      bankName: depositBankName,
      accountNumber: depositAccountNumber,
      accountName: depositAccountName,
    });
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveNote =
      withdrawSource === 'SINGER_10_PERCENT_CUT' &&
      !withdrawNote.toLowerCase().includes('10%')
        ? `10% Saving for Loan Withdrawal — ${withdrawNote}`
        : withdrawNote;
    const res = adminWithdrawLoanWallet(withdrawAmountLak, effectiveNote, {
      bankName: withdrawBankName,
      accountNumber: withdrawAccountNumber,
      accountName: withdrawAccountName,
    });
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  const handleInstantWithdraw10PercentCut = (
    customAmtLak?: number,
    customLabel?: string
  ) => {
    const targetAmt =
      customAmtLak !== undefined && customAmtLak > 0
        ? customAmtLak
        : loanWalletSummary.available10PercentCutLak > 0
        ? loanWalletSummary.available10PercentCutLak
        : loanWalletSummary.total10PercentSingerCuts;
    if (targetAmt <= 0) {
      showBanner(
        'No 10% Saving for Loan balance available to withdraw.',
        'ERROR'
      );
      return;
    }
    const noteText =
      customLabel ||
      `Administrator Withdraw from 10% Saving for Loan (${loanWalletSummary.cutCount} Singer Party Bookings)`;
    const res = adminWithdrawLoanWallet(targetAmt, noteText, {
      bankName: withdrawBankName,
      accountNumber: withdrawAccountNumber,
      accountName: withdrawAccountName,
    });
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  // ============================================================================
  // 2. BOOKING FORM STATE — BOOKING SINGER MUSIC CAIN PARTY SET PACKAGE
  // ============================================================================
  const [singerGenderFilter, setSingerGenderFilter] = useState<
    'ALL' | 'MAN' | 'WOMAN'
  >('ALL');
  const filteredSingersByGender = useMemo(() => {
    if (singerGenderFilter === 'ALL') return singerProfiles;
    return singerProfiles.filter(
      (s) => (s.gender || 'MAN') === singerGenderFilter
    );
  }, [singerProfiles, singerGenderFilter]);

  const [selectedSingerId, setSelectedSingerId] = useState<string>(
    preselectedSingerId || singerProfiles[0]?.id || ''
  );
  const selectedSinger = useMemo(
    () =>
      singerProfiles.find((s) => s.id === selectedSingerId) ||
      filteredSingersByGender[0] ||
      singerProfiles[0],
    [singerProfiles, selectedSingerId, filteredSingersByGender]
  );

  // Customer Automatic Affiliate Dashboard State (Wallet • Withdraw • Affiliate Commission)
  const [customerAffiliateTab, setCustomerAffiliateTab] = useState<
    'ALL' | 'WALLET' | 'WITHDRAW' | 'AFFILIATE_COMMISSION'
  >('ALL');
  const [custWithdrawAmountLak, setCustWithdrawAmountLak] =
    useState<number>(300000);
  const [custWithdrawBankName, setCustWithdrawBankName] = useState<string>(
    'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [custWithdrawAccountNumber, setCustWithdrawAccountNumber] =
    useState<string>('160-12-00778833-001');
  const [custWithdrawAccountName, setCustWithdrawAccountName] =
    useState<string>('THIPPAVANH KEOMANY');
  const [custRecommendBuyerName, setCustRecommendBuyerName] = useState<string>(
    'Vientiane VIP Party Friend'
  );

  // Inline Edit Selected Singer Booking Price Override
  const [showEditSelectedSingerPrice, setShowEditSelectedSingerPrice] =
    useState<boolean>(false);
  const [singerOverrideCheaperLak, setSingerOverrideCheaperLak] =
    useState<number>(singerBookingPricing.cheaperPriceLak);
  const [singerOverrideMediumLak, setSingerOverrideMediumLak] =
    useState<number>(singerBookingPricing.mediumPriceLak);
  const [singerOverrideExpensiveLak, setSingerOverrideExpensiveLak] =
    useState<number>(singerBookingPricing.expensivePriceLak);

  // 1) Singer price tier & Auto Start Singer Price from Singer Register
  const [singerPriceTier, setSingerPriceTier] =
    useState<SingerPriceTier>('CHEAPER');
  const [customSingerPriceLak, setCustomSingerPriceLak] = useState<number>(
    () =>
      selectedSinger?.startSingerPriceLak ||
      selectedSinger?.cheaperPriceLak ||
      singerBookingPricing.cheaperPriceLak
  );

  // Auto-sync Start Singer Price whenever Selected Singer changes (auto price from Singer Register)
  useEffect(() => {
    if (selectedSinger) {
      const registeredStartPrice =
        selectedSinger.startSingerPriceLak ||
        selectedSinger.cheaperPriceLak ||
        singerBookingPricing.cheaperPriceLak;
      setCustomSingerPriceLak(registeredStartPrice);
    }
  }, [
    selectedSinger?.id,
    selectedSinger?.startSingerPriceLak,
    selectedSinger?.cheaperPriceLak,
    singerBookingPricing.cheaperPriceLak,
  ]);

  // 2) Select Calendar Booking singer for party + Administrator Editable Selected Package (LAK) Price options
  const DEFAULT_SELECTED_PACKAGE_PARTY_OPTIONS = [
    { id: 'pkg-lak-25m', value: 25000000, label: 'Price: 25,000,000kip' },
    { id: 'pkg-lak-30m', value: 30000000, label: 'Price: 30,000,000kip' },
    { id: 'pkg-lak-40m', value: 40000000, label: 'Price: 40,000,000kip' },
    { id: 'pkg-lak-50m', value: 50000000, label: 'Price: 50,000,000kip' },
  ];

  const [selectedPackagePartyOptions, setSelectedPackagePartyOptions] =
    useState<{ id: string; value: number; label: string }[]>(() => {
      try {
        const saved = localStorage.getItem(
          'dmc_rev26_selected_pkg_party_opts_v1'
        );
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {
        // ignore
      }
      return DEFAULT_SELECTED_PACKAGE_PARTY_OPTIONS;
    });

  const saveSelectedPackagePartyOptions = (
    next: { id: string; value: number; label: string }[]
  ) => {
    setSelectedPackagePartyOptions(next);
    try {
      localStorage.setItem(
        'dmc_rev26_selected_pkg_party_opts_v1',
        JSON.stringify(next)
      );
    } catch {
      // ignore
    }
  };

  const SELECTED_PACKAGE_PARTY_OPTIONS = selectedPackagePartyOptions;

  // Administrator state for managing Selected Package (LAK) Price options & All Singer Profiles in Report Singer Register
  const [newSelectedPkgValueLak, setNewSelectedPkgValueLak] =
    useState<number>(35000000);
  const [newSelectedPkgLabel, setNewSelectedPkgLabel] = useState<string>(
    'Price: 35,000,000kip'
  );
  const [editingSelectedPkgId, setEditingSelectedPkgId] = useState<
    string | null
  >(null);
  const [editSelectedPkgValueLak, setEditSelectedPkgValueLak] =
    useState<number>(25000000);
  const [editSelectedPkgLabel, setEditSelectedPkgLabel] =
    useState<string>('');

  const [singerReportSearch, setSingerReportSearch] = useState<string>('');
  const [singerReportGenderFilter, setSingerReportGenderFilter] = useState<
    'ALL' | 'MAN' | 'WOMAN'
  >('ALL');
  const [editingSingerProfileId, setEditingSingerProfileId] = useState<
    string | null
  >(null);
  const [editSingerForm, setEditSingerForm] = useState<{
    fullName: string;
    stageName: string;
    gender: 'MAN' | 'WOMAN';
    phone: string;
    email: string;
    province: string;
    vocalStyle: string;
    experienceYears: number;
    avatarUrl: string;
    bio: string;
    applicationStatus: DmcSingerProfile['applicationStatus'];
    startSingerPriceLak: number;
    packagePartyPriceLak: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>({
    fullName: '',
    stageName: '',
    gender: 'MAN',
    phone: '',
    email: '',
    province: '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)',
    vocalStyle: 'Lao Modern Pop',
    experienceYears: 3,
    avatarUrl: '',
    bio: '',
    applicationStatus: 'APPROVED_ACTIVE',
    startSingerPriceLak: 2500000,
    packagePartyPriceLak: 25000000,
    bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
    accountNumber: '',
    accountName: '',
  });

  const [showAddSingerAdminForm, setShowAddSingerAdminForm] =
    useState<boolean>(false);
  const [newSingerAdminForm, setNewSingerAdminForm] = useState<{
    fullName: string;
    stageName: string;
    gender: 'MAN' | 'WOMAN';
    phone: string;
    email: string;
    province: string;
    vocalStyle: string;
    experienceYears: number;
    avatarUrl: string;
    startSingerPriceLak: number;
    packagePartyPriceLak: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>({
    fullName: 'Soukphaphone Chanthavong',
    stageName: 'Nong Souk DMC Vocal',
    gender: 'MAN',
    phone: '+856 20 5588 9911',
    email: 'soukphaphone@dmcxayraxa.music',
    province: '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)',
    vocalStyle: 'Lao Modern Pop',
    experienceYears: 3,
    avatarUrl:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=320&q=80',
    startSingerPriceLak: 2500000,
    packagePartyPriceLak: 25000000,
    bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
    accountNumber: '160-12-00884421-001',
    accountName: 'SOUKPHAPHONE CHANTHAVONG',
  });

  const handleStartEditSingerProfile = (s: DmcSingerProfile) => {
    setEditingSingerProfileId(s.id);
    setEditSingerForm({
      fullName: s.fullName || '',
      stageName: s.stageName || '',
      gender: s.gender || 'MAN',
      phone: s.phone || '',
      email: s.email || '',
      province: s.province || '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)',
      vocalStyle: String(s.vocalStyle || 'Lao Modern Pop'),
      experienceYears: s.experienceYears || 2,
      avatarUrl: s.avatarUrl || '',
      bio: s.bio || '',
      applicationStatus: s.applicationStatus || 'APPROVED_ACTIVE',
      startSingerPriceLak:
        s.startSingerPriceLak ||
        s.cheaperPriceLak ||
        singerBookingPricing.cheaperPriceLak,
      packagePartyPriceLak: s.packagePartyPriceLak || 25000000,
      bankName:
        s.bankAccount?.bankName ||
        'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
      accountNumber: s.bankAccount?.accountNumber || '160-12-00884421-001',
      accountName:
        s.bankAccount?.accountName || (s.fullName || '').toUpperCase(),
    });
  };

  const handleSaveEditSingerProfile = (singer: DmcSingerProfile) => {
    const cleanStartPrice = Math.max(
      0,
      Math.round(Number(editSingerForm.startSingerPriceLak) || 0)
    );
    const cleanPkgPrice = Math.max(
      0,
      Math.round(Number(editSingerForm.packagePartyPriceLak) || 0)
    );
    updateSingerProfile(singer.id, {
      fullName: editSingerForm.fullName.trim() || singer.fullName,
      stageName: editSingerForm.stageName.trim() || singer.stageName,
      gender: editSingerForm.gender,
      phone: editSingerForm.phone.trim() || singer.phone,
      email: editSingerForm.email.trim(),
      province: editSingerForm.province,
      vocalStyle: editSingerForm.vocalStyle,
      experienceYears: Math.max(0, Number(editSingerForm.experienceYears) || 1),
      avatarUrl: editSingerForm.avatarUrl.trim() || singer.avatarUrl,
      bio: editSingerForm.bio.trim() || singer.bio,
      applicationStatus: editSingerForm.applicationStatus,
      startSingerPriceLak: cleanStartPrice,
      cheaperPriceLak: cleanStartPrice,
      packagePartyPriceLak: cleanPkgPrice,
      bankAccount: {
        ...singer.bankAccount,
        bankName: editSingerForm.bankName,
        accountNumber: editSingerForm.accountNumber.trim(),
        accountName: editSingerForm.accountName.trim().toUpperCase(),
      },
    });
    if (selectedSinger?.id === singer.id) {
      setCustomSingerPriceLak(cleanStartPrice);
      setCustomBrandSetPriceLak(cleanPkgPrice);
    }
    setEditingSingerProfileId(null);
    showBanner(
      `Updated Singer Profile "${editSingerForm.stageName}" (${singer.singerCode}) • Start Singer Price: ${formatLak(cleanStartPrice)} • Selected Package Price: ${formatLak(cleanPkgPrice)}!`
    );
  };

  const handleAdminCreateSingerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const created = applyForSingerJob({
      registrationType: 'GENERAL_PUBLIC',
      gender: newSingerAdminForm.gender,
      fullName: newSingerAdminForm.fullName.trim() || 'DMC Registered Singer',
      stageName: newSingerAdminForm.stageName.trim() || 'DMC Vocal Star',
      phone: newSingerAdminForm.phone.trim() || '+856 20 5588 9911',
      email: newSingerAdminForm.email.trim(),
      province: newSingerAdminForm.province,
      vocalStyle: newSingerAdminForm.vocalStyle,
      experienceYears: Number(newSingerAdminForm.experienceYears) || 2,
      avatarUrl: newSingerAdminForm.avatarUrl.trim(),
      startSingerPriceLak:
        Math.round(Number(newSingerAdminForm.startSingerPriceLak)) || 2500000,
      packagePartyPriceLak:
        Math.round(Number(newSingerAdminForm.packagePartyPriceLak)) || 25000000,
      bankAccount: {
        bankName: newSingerAdminForm.bankName,
        accountNumber: newSingerAdminForm.accountNumber.trim(),
        accountName: newSingerAdminForm.accountName.trim().toUpperCase(),
      },
    });
    setShowAddSingerAdminForm(false);
    showBanner(
      `Registered new Singer Profile "${created.stageName}" (${created.singerCode}) • Selected Package Price: ${formatLak(created.packagePartyPriceLak || 25000000)}!`
    );
  };

  const filteredSingerProfilesForReport = useMemo(() => {
    const q = singerReportSearch.trim().toLowerCase();
    return singerProfiles.filter((s) => {
      const sGender = s.gender || 'MAN';
      if (
        singerReportGenderFilter !== 'ALL' &&
        sGender !== singerReportGenderFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        s.stageName.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.singerCode.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.province.toLowerCase().includes(q) ||
        String(s.vocalStyle).toLowerCase().includes(q)
      );
    });
  }, [singerProfiles, singerReportSearch, singerReportGenderFilter]);

  // Official 18 Provinces in Laos for Party / Event Location
  const LAO_18_PROVINCES = [
    '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)',
    '2. Phongsaly Province (ແຂວງຜົ້ງສາລີ)',
    '3. Luang Namtha Province (ແຂວງຫຼວງນໍ້າທາ)',
    '4. Oudomxay Province (ແຂວງອຸດົມໄຊ)',
    '5. Bokeo Province (ແຂວງບໍ່ແກ້ວ)',
    '6. Luang Prabang Province (ແຂວງຫຼວງພະບາງ)',
    '7. Houaphanh Province (ແຂວງຫົວພັນ)',
    '8. Xayaboury Province (ແຂວງໄຊຍະບູລີ)',
    '9. Xiangkhouang Province (ແຂວງຊຽງຂວາງ)',
    '10. Vientiane Province (ແຂວງວຽງຈັນ)',
    '11. Bolikhamxai Province (ແຂວງບໍລິຄໍາໄຊ)',
    '12. Khammouane Province (ແຂວງຄໍາມ່ວນ)',
    '13. Savannakhet Province (ແຂວງສະຫວັນນະເຂດ)',
    '14. Salavan Province (ແຂວງສາລະວັນ)',
    '15. Sekong Province (ແຂວງເຊກອງ)',
    '16. Champasak Province (ແຂວງຈໍາປາສັກ)',
    '17. Attapeu Province (ແຂວງອັດຕະປື)',
    '18. Xaisomboun Province (ແຂວງໄຊສົມບູນ)',
  ];
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);
  const [selectedBookingDate, setSelectedBookingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>(
    '18:00 - 22:00 (Evening Party Set)'
  );
  const [brandSetPackageType, setBrandSetPackageType] =
    useState<BrandSetPackageType>('NEW_BRAND_SET');
  const [customBrandSetPriceLak, setCustomBrandSetPriceLak] =
    useState<number>(25000000);

  // 3) Singer copies right own Music: Rock performance | Music performance | Traditional music
  const [copyrightMusicType, setCopyrightMusicType] =
    useState<SingerCopyrightMusicType>('ROCK_PERFORMANCE');
  const [customCopyrightPriceLak, setCustomCopyrightPriceLak] =
    useState<number>(0);
  const [ownMusicSongTitles, setOwnMusicSongTitles] = useState<string>(
    'Original Singer Copyright Live Set (3 Signature Tracks + Encore)'
  );

  // Customer Booking State (with custom password creation for log in)
  const [selectedCustomerMemberId, setSelectedCustomerMemberId] =
    useState<string>('NEW_GENERAL_MEMBER');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('+856 20 ');
  const [customerPassword, setCustomerPassword] = useState<string>('');
  const [customerLoginIdentifier, setCustomerLoginIdentifier] =
    useState<string>(currentMember?.memberId || 'DMC-LA-00303');
  const [customerLoginPassword, setCustomerLoginPassword] =
    useState<string>('123456');
  const [showCustomerLoginPassword, setShowCustomerLoginPassword] =
    useState<boolean>(false);
  const [singerScheduleAlertBanner, setSingerScheduleAlertBanner] = useState<
    string | null
  >(null);
  const [adminVerifiedBookingIds, setAdminVerifiedBookingIds] = useState<
    Record<string, boolean>
  >({});
  const [adminDailyReportDateFilter, setAdminDailyReportDateFilter] =
    useState<string>('ALL');
  const [adminDailyReportSingerFilter, setAdminDailyReportSingerFilter] =
    useState<string>('ALL');
  const [adminDailyReportSearch, setAdminDailyReportSearch] =
    useState<string>('');

  const adminDailyBookingReportData = useMemo(() => {
    const dateMap = new Map<
      string,
      { date: string; count: number; totalLak: number; loan10Lak: number }
    >();
    for (const bk of singerBookings) {
      const dKey = bk.bookingDate || bk.createdAt.slice(0, 10);
      const prev = dateMap.get(dKey) || {
        date: dKey,
        count: 0,
        totalLak: 0,
        loan10Lak: 0,
      };
      prev.count += 1;
      prev.totalLak += bk.totalPackagePriceLak;
      prev.loan10Lak += bk.loanWalletCut10PercentLak;
      dateMap.set(dKey, prev);
    }
    const uniqueDates = Array.from(dateMap.values()).sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    const q = adminDailyReportSearch.trim().toLowerCase();
    const filteredBookings = singerBookings.filter((bk) => {
      if (
        adminDailyReportDateFilter !== 'ALL' &&
        bk.bookingDate !== adminDailyReportDateFilter &&
        !bk.createdAt.startsWith(adminDailyReportDateFilter)
      ) {
        return false;
      }
      if (
        adminDailyReportSingerFilter !== 'ALL' &&
        bk.singerId !== adminDailyReportSingerFilter &&
        bk.singerCode !== adminDailyReportSingerFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        bk.customerName.toLowerCase().includes(q) ||
        (bk.customerMemberId || '').toLowerCase().includes(q) ||
        bk.customerPhone.toLowerCase().includes(q) ||
        bk.singerStageName.toLowerCase().includes(q) ||
        bk.singerCode.toLowerCase().includes(q) ||
        bk.bookingCode.toLowerCase().includes(q) ||
        bk.partyEventName.toLowerCase().includes(q) ||
        (bk.eventLocation || '').toLowerCase().includes(q)
      );
    });

    const totalPackagePriceLak = filteredBookings.reduce(
      (sum, b) => sum + b.totalPackagePriceLak,
      0
    );
    const totalLoanSaving10Lak = filteredBookings.reduce(
      (sum, b) => sum + b.loanWalletCut10PercentLak,
      0
    );
    const totalSingerNetLak = filteredBookings.reduce(
      (sum, b) => sum + b.singerNetPayout90PercentLak,
      0
    );
    const totalPartyWalletNetLak = filteredBookings.reduce(
      (sum, b) =>
        sum +
        (b.dmcPartyWalletNetCreditLak !== undefined
          ? b.dmcPartyWalletNetCreditLak
          : Math.round(b.totalPackagePriceLak * 0.95)),
      0
    );

    return {
      uniqueDates,
      filteredBookings,
      totalPackagePriceLak,
      totalLoanSaving10Lak,
      totalSingerNetLak,
      totalPartyWalletNetLak,
    };
  }, [
    singerBookings,
    adminDailyReportDateFilter,
    adminDailyReportSingerFilter,
    adminDailyReportSearch,
  ]);

  const handleExportDailyBookingsCsv = () => {
    const rows = [
      [
        'Booking Code',
        'Schedule Date',
        'Time Slot',
        'Customer Name (Who Is Booking)',
        'Customer Member ID',
        'Customer Phone',
        'Booked Singer',
        'Singer Code',
        'Party Event Name',
        'Event Location',
        'Package Price (LAK)',
        '10% Saving for Loan (LAK)',
        'Payment Method',
        'Status',
        'Created At',
      ],
      ...adminDailyBookingReportData.filteredBookings.map((bk) => [
        bk.bookingCode,
        bk.bookingDate,
        bk.bookingTimeSlot,
        bk.customerName,
        bk.customerMemberId || 'DMC-LA-00303',
        bk.customerPhone,
        bk.singerStageName,
        bk.singerCode,
        bk.partyEventName,
        bk.eventLocation,
        String(bk.totalPackagePriceLak),
        String(bk.loanWalletCut10PercentLak),
        bk.paymentMethod,
        bk.status,
        bk.createdAt,
      ]),
    ];
    const csvContent = rows
      .map((r) =>
        r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DMC_Daily_Booking_Report_${
      adminDailyReportDateFilter === 'ALL'
        ? 'All_Dates'
        : adminDailyReportDateFilter
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showBanner(
      `Exported Daily Booking Report (${adminDailyBookingReportData.filteredBookings.length} customer bookings) to CSV/Excel!`
    );
  };

  const [partyEventName, setPartyEventName] = useState<string>(
    'Music Cain Party Set Celebration'
  );
  const [eventLocation, setEventLocation] = useState<string>(
    '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)'
  );
  const [paymentMethod, setPaymentMethod] =
    useState<DmcSingerPartyBooking['paymentMethod']>('BCEL_ONE_QR');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [copiedAffiliateRef, setCopiedAffiliateRef] = useState<string | null>(
    null
  );
  const [lastActivatedAffiliateBooking, setLastActivatedAffiliateBooking] =
    useState<DmcSingerPartyBooking | null>(null);

  const handleSelectBookingMember = (memberIdValue: string) => {
    setSelectedCustomerMemberId(memberIdValue);
    if (memberIdValue === 'NEW_GENERAL_MEMBER') {
      setCustomerName('General Member VIP Host');
      setCustomerPhone('+856 20 5599 7788');
      setCustomerPassword('123456');
      return;
    }
    const found = allMembers.find((m) => m.memberId === memberIdValue);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerPassword(found.password || '123456');
      setCustomerLoginIdentifier(found.memberId);
      setCustomerLoginPassword(found.password || '123456');
    }
  };

  const handleCustomerSignInAsMemberFreeActive = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = customerLoginIdentifier.trim().toUpperCase();
    const cleanPw = customerLoginPassword.trim() || '123456';
    const matchedMember = allMembers.find(
      (m) =>
        m.memberId.toUpperCase() === cleanId ||
        m.phone.replace(/\s+/g, '') ===
          customerLoginIdentifier.trim().replace(/\s+/g, '')
    );
    const matchedBooking = singerBookings.find(
      (bk) =>
        (bk.customerMemberId &&
          bk.customerMemberId.toUpperCase() === cleanId) ||
        bk.customerPhone.replace(/\s+/g, '') ===
          customerLoginIdentifier.trim().replace(/\s+/g, '')
    );
    const targetMemberId =
      matchedMember?.memberId ||
      matchedBooking?.customerMemberId ||
      'DMC-LA-00303';
    const targetName =
      matchedMember?.name ||
      matchedBooking?.customerName ||
      'Thippavanh Keomany';
    const targetPhone =
      matchedMember?.phone ||
      matchedBooking?.customerPhone ||
      '+856 20 7788 3344';

    setSelectedCustomerMemberId(targetMemberId);
    setCustomerName(targetName);
    setCustomerPhone(targetPhone);
    setCustomerPassword(cleanPw);
    setCurrentMemberId(targetMemberId);
    setIsLoggedOut(false);
    setIsAdminMode(false);
    showBanner(
      `✓ Signed In Customer Booking as Member Free Active: ${targetName} (Member ID: ${targetMemberId} • Password: ${cleanPw} • Status: FREE ACTIVE MEMBER)!`
    );
  };

  const handleWarnSingerByScheduleCalendar = (
    singerStageName: string,
    singerCode: string,
    dateStr: string,
    timeSlotStr: string,
    custName: string,
    locStr: string
  ) => {
    const warnMsg = `🔔 SCHEDULE CALENDAR WARNING SENT TO SINGER ${singerStageName} (${singerCode}): Booked on Calendar Date ${dateStr} • Time Slot ${timeSlotStr} by Customer ${custName} at ${locStr}. Administrator & Singer Schedule Calendar notified!`;
    setSingerScheduleAlertBanner(warnMsg);
    showBanner(warnMsg);
  };

  const previewAutoAffiliateInfo = useMemo(() => {
    const cleanPhone = customerPhone.replace(/\s+/g, '');
    const matched =
      selectedCustomerMemberId !== 'NEW_GENERAL_MEMBER'
        ? allMembers.find((m) => m.memberId === selectedCustomerMemberId)
        : cleanPhone.length > 7
        ? allMembers.find(
            (m) => m.phone.replace(/\s+/g, '') === cleanPhone
          )
        : undefined;
    const effectiveMemberId = matched
      ? matched.memberId
      : `DMC-LA-${String(800 + allMembers.length + 1).padStart(5, '0')}`;
    const affCode =
      matched?.autoAffiliateCode || `AFF-${effectiveMemberId}`;
    const affLink = `https://dmcxayraxa.music/register?ref=${encodeURIComponent(
      effectiveMemberId
    )}&aff=${encodeURIComponent(affCode)}&singer=${encodeURIComponent(
      selectedSinger?.singerCode || 'DMC-SNG-001'
    )}`;
    return {
      isExistingMember: Boolean(matched),
      memberRecord: matched,
      effectiveMemberId,
      affCode,
      affLink,
    };
  }, [
    selectedCustomerMemberId,
    allMembers,
    customerPhone,
    selectedSinger?.singerCode,
  ]);

  const handleCopyAffiliateLink = (linkText: string, refKey: string) => {
    navigator.clipboard?.writeText(linkText).catch(() => {});
    setCopiedAffiliateRef(refKey);
    showBanner(`Copied Automatic Affiliate Link: ${linkText}`);
    setTimeout(() => setCopiedAffiliateRef(null), 3000);
  };

  const handleSignInAsAutomaticAffiliate = (memberIdToLogin?: string) => {
    if (!memberIdToLogin) return;
    setCurrentMemberId(memberIdToLogin);
    setSelectedCustomerMemberId(memberIdToLogin);
    setCustomerLoginIdentifier(memberIdToLogin);
    setIsLoggedOut(false);
    setIsAdminMode(false);
    showBanner(
      `Signed in as Customer Member Free Active (${memberIdToLogin} • Password: 123456)!`
    );
    if (onOpenAdminPanel) {
      onOpenAdminPanel();
    }
  };

  // Inline Edit Confirmed Booking State
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editBkPartyEventName, setEditBkPartyEventName] = useState<string>('');
  const [editBkCustomerName, setEditBkCustomerName] = useState<string>('');
  const [editBkEventLocation, setEditBkEventLocation] = useState<string>('');
  const [editBkDate, setEditBkDate] = useState<string>('');
  const [editBkSingerPriceLak, setEditBkSingerPriceLak] = useState<number>(0);
  const [editBkBrandSetPriceLak, setEditBkBrandSetPriceLak] =
    useState<number>(0);
  const [editBkCopyrightPriceLak, setEditBkCopyrightPriceLak] =
    useState<number>(0);
  const [editBkStatus, setEditBkStatus] =
    useState<DmcSingerPartyBooking['status']>('CONFIRMED_PAID');

  const startEditBooking = (bk: DmcSingerPartyBooking) => {
    setEditingBookingId(bk.id);
    setEditBkPartyEventName(bk.partyEventName);
    setEditBkCustomerName(bk.customerName);
    setEditBkEventLocation(
      bk.eventLocation || '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)'
    );
    setEditBkDate(bk.bookingDate);
    setEditBkSingerPriceLak(bk.singerPriceLak);
    setEditBkBrandSetPriceLak(bk.brandSetPackagePriceLak);
    setEditBkCopyrightPriceLak(bk.copyrightMusicPriceLak);
    setEditBkStatus(bk.status);
  };

  const handleSaveBookingEdit = (bk: DmcSingerPartyBooking) => {
    updateSingerPartyBooking(bk.id, {
      partyEventName: editBkPartyEventName.trim() || bk.partyEventName,
      customerName: editBkCustomerName.trim() || bk.customerName,
      eventLocation: editBkEventLocation.trim() || bk.eventLocation,
      bookingDate: editBkDate || bk.bookingDate,
      singerPriceLak: Math.max(0, Math.round(Number(editBkSingerPriceLak) || 0)),
      brandSetPackagePriceLak: Math.max(
        0,
        Math.round(Number(editBkBrandSetPriceLak) || 0)
      ),
      copyrightMusicPriceLak: Math.max(
        0,
        Math.round(Number(editBkCopyrightPriceLak) || 0)
      ),
      status: editBkStatus,
    });
    setEditingBookingId(null);
    const newTotal =
      Math.max(0, Math.round(Number(editBkSingerPriceLak) || 0)) +
      Math.max(0, Math.round(Number(editBkBrandSetPriceLak) || 0)) +
      Math.max(0, Math.round(Number(editBkCopyrightPriceLak) || 0));
    showBanner(
      `Updated booking ${bk.bookingCode}! New Total: ${formatLak(newTotal)} (10% Saving for Loan: ${formatLak(Math.round(newTotal * 0.1))}).`
    );
  };

  // Handlers when user clicks a package option card
  const handleSelectSingerTierOpt = (opt: DmcBookingPackageOption) => {
    setSingerPriceTier(opt.code);
    const price =
      opt.code === 'CHEAPER'
        ? selectedSinger?.cheaperPriceLak || opt.priceLak
        : opt.code === 'MEDIUM'
        ? selectedSinger?.mediumPriceLak || opt.priceLak
        : opt.code === 'EXPENSIVE'
        ? selectedSinger?.expensivePriceLak || opt.priceLak
        : opt.priceLak;
    setCustomSingerPriceLak(price);
  };

  const handleSelectBrandSetOpt = (opt: DmcBookingPackageOption) => {
    setBrandSetPackageType(opt.code);
    const price =
      opt.code === 'NEW_BRAND_SET'
        ? selectedSinger?.newBrandSetPriceLak || opt.priceLak
        : opt.code === 'OLD_BRAND_SET'
        ? selectedSinger?.oldBrandSetPriceLak || opt.priceLak
        : opt.priceLak;
    setCustomBrandSetPriceLak(price);
  };

  const handleSelectCopyrightMusicOpt = (opt: DmcBookingPackageOption) => {
    setCopyrightMusicType(opt.code);
    setCustomCopyrightPriceLak(opt.priceLak);
  };

  // Quick Update Selected Price back to Package Option
  const handleAdminQuickUpdateSelectedSingerPrice = () => {
    const matched = singerPriceTierOptions.find(
      (o) => o.code === singerPriceTier || o.id === singerPriceTier
    );
    if (matched) {
      adminUpdateBookingPackageOption(matched.id, {
        priceLak: customSingerPriceLak,
      });
      showBanner(
        `Administrator Updated "${matched.title}" default price to ${formatLak(customSingerPriceLak)}!`
      );
    }
  };

  const handleAdminQuickUpdateSelectedBrandSetPrice = () => {
    const matched = brandSetPackageOptions.find(
      (o) => o.code === brandSetPackageType || o.id === brandSetPackageType
    );
    if (matched) {
      adminUpdateBookingPackageOption(matched.id, {
        priceLak: customBrandSetPriceLak,
      });
      showBanner(
        `Administrator Updated "${matched.title}" default price to ${formatLak(customBrandSetPriceLak)}!`
      );
    }
  };

  const handleAdminQuickUpdateSelectedCopyrightPrice = () => {
    const matched = copyrightMusicOptions.find(
      (o) => o.code === copyrightMusicType || o.id === copyrightMusicType
    );
    if (matched) {
      adminUpdateBookingPackageOption(matched.id, {
        priceLak: customCopyrightPriceLak,
      });
      showBanner(
        `Administrator Updated "${matched.title}" default price to ${formatLak(customCopyrightPriceLak)}!`
      );
    }
  };

  // Interactive Calendar Month Generator
  const calendarData = useMemo(() => {
    const base = new Date();
    const target = new Date(
      base.getFullYear(),
      base.getMonth() + calendarMonthOffset,
      1
    );
    const year = target.getFullYear();
    const month = target.getMonth();
    const monthLabel = target.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; bookingsCount: number }[] =
      [];
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${year}-${mStr}-${dStr}`;
      const bookingsCount = singerBookings.filter(
        (b) => b.bookingDate === dateStr && b.status !== 'CANCELLED'
      ).length;
      days.push({ dateStr, dayNum: d, bookingsCount });
    }

    return { monthLabel, firstDayOfWeek, days };
  }, [calendarMonthOffset, singerBookings]);

  // Live financial calculation (Start Singer Price Removed — 100% Based on Selected Package Party Price):
  // - Selected Package Party -> 10% Saving for Loan (5% Singer Wallet + 5% DMC Party Wallet)
  const livePricingSummary = useMemo(() => {
    const sPrice = 0;
    const bPrice = Math.max(0, Math.round(Number(customBrandSetPriceLak) || 0));
    const cPrice = Math.max(
      0,
      Math.round(Number(customCopyrightPriceLak) || 0)
    );
    const partyPackageLak = bPrice + cPrice;
    const totalLak = partyPackageLak;
    const cutPercent = singerBookingPricing.loanWalletCutPercent || 10;

    // 5% from Singer share to Saving for Loan & 5% from DMC Party Wallet to Saving for Loan = 10% Saving for Loan
    const singerSaving5Lak = Math.round(partyPackageLak * 0.05);
    const partyWalletSaving5Lak = Math.round(partyPackageLak * 0.05);
    const loanWalletCut10Lak = singerSaving5Lak + partyWalletSaving5Lak;

    const singerNet90Lak = Math.round(partyPackageLak * 0.45);
    const partyWalletNet95Lak = Math.max(
      0,
      partyPackageLak - partyWalletSaving5Lak
    );
    const singerOnly10PercentLak = singerSaving5Lak;

    const sLabel = 'Package Party Set';
    const bLabel =
      brandSetPackageOptions.find((o) => o.code === brandSetPackageType)
        ?.title || 'Selected Package Party Set';
    const cLabel =
      copyrightMusicOptions.find((o) => o.code === copyrightMusicType)?.title ||
      'Live Party Performance';

    return {
      sPrice,
      bPrice,
      cPrice,
      partyPackageLak,
      sLabel,
      bLabel,
      cLabel,
      totalLak,
      cutPercent,
      singerSaving5Lak,
      partyWalletSaving5Lak,
      partyWalletNet95Lak,
      loanWalletCut10Lak,
      singerOnly10PercentLak,
      singerNet90Lak,
    };
  }, [
    customBrandSetPriceLak,
    customCopyrightPriceLak,
    singerBookingPricing.loanWalletCutPercent,
    brandSetPackageType,
    copyrightMusicType,
    brandSetPackageOptions,
    copyrightMusicOptions,
  ]);

  // QR Code Payment Modal State for Booking Singer Party Set (Confirm -> Attach Bill Payment Upload -> Submit)
  const [showBookingQrPaymentModal, setShowBookingQrPaymentModal] =
    useState<boolean>(false);
  const [copiedQrAccount, setCopiedQrAccount] = useState<boolean>(false);
  const [isQrPaymentConfirmedForBillUpload, setIsQrPaymentConfirmedForBillUpload] =
    useState<boolean>(false);
  const [billPaymentImageUrl, setBillPaymentImageUrl] = useState<string>('');
  const [billPaymentFileName, setBillPaymentFileName] = useState<string>('');
  const [billPaymentRefNo, setBillPaymentRefNo] = useState<string>('');
  const [billPaymentUploadError, setBillPaymentUploadError] = useState<
    string | null
  >(null);

  const activeCorporateBank = useMemo(() => {
    return (
      corporateBankAccounts?.[0] || {
        id: 'corp-bcel-default',
        bankId: 'BCEL',
        bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL One)',
        accountNumber: '160-12-00998877-001',
        accountName: 'DMC XAYRAXA STUDIO & SINGER BOOKING',
        currency: 'LAK',
        isPrimary: true,
      }
    );
  }, [corporateBankAccounts]);

  const generateSampleBillSlipDataUrl = () => {
    const refCode =
      billPaymentRefNo.trim() ||
      `BCEL-ONE-${Date.now().toString().slice(-6)}`;
    const singerName = selectedSinger?.stageName || 'DMC Singer';
    const amountFormatted = formatLak(livePricingSummary.totalLak);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="320" viewBox="0 0 520 320">
      <rect width="520" height="320" rx="18" fill="#0f172a"/>
      <rect x="10" y="10" width="500" height="300" rx="14" fill="#ffffff" stroke="#10b981" stroke-width="3"/>
      <rect x="10" y="10" width="500" height="62" rx="14" fill="#df1c2d"/>
      <text x="28" y="38" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">BCEL ONE — OFFICIAL BILL PAYMENT RECEIPT</text>
      <text x="28" y="58" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#fde047">BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC</text>
      <rect x="385" y="24" width="105" height="28" rx="8" fill="#10b981"/>
      <text x="437" y="42" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">PAID SUCCESS</text>
      <text x="30" y="105" font-family="Arial, sans-serif" font-size="12" fill="#64748b">Bill Ref No:</text>
      <text x="190" y="105" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#0f172a">${refCode}</text>
      <text x="30" y="135" font-family="Arial, sans-serif" font-size="12" fill="#64748b">Customer / Host:</text>
      <text x="190" y="135" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">${customerName}</text>
      <text x="30" y="165" font-family="Arial, sans-serif" font-size="12" fill="#64748b">Booked Singer:</text>
      <text x="190" y="165" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#df1c2d">${singerName} (${selectedSinger?.singerCode || ''})</text>
      <text x="30" y="195" font-family="Arial, sans-serif" font-size="12" fill="#64748b">To Account:</text>
      <text x="190" y="195" font-family="Courier, monospace" font-size="13" font-weight="bold" fill="#0f172a">${activeCorporateBank.accountNumber}</text>
      <text x="30" y="225" font-family="Arial, sans-serif" font-size="12" fill="#64748b">Booking Date:</text>
      <text x="190" y="225" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">${selectedBookingDate} • ${bookingTimeSlot}</text>
      <line x1="28" y1="246" x2="492" y2="246" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="4,4"/>
      <text x="30" y="280" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">TOTAL BILL AMOUNT PAID:</text>
      <text x="490" y="282" text-anchor="end" font-family="Courier, monospace" font-size="20" font-weight="bold" fill="#059669">${amountFormatted}</text>
    </svg>`;
    return {
      dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      refCode,
      fileName: `BCEL-One-Bill-${refCode}.png`,
    };
  };

  const handleBillPaymentFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBillPaymentUploadError(null);
    setBillPaymentFileName(file.name);
    if (!billPaymentRefNo.trim()) {
      setBillPaymentRefNo(`BCEL-BILL-${Date.now().toString().slice(-6)}`);
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBillPaymentImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAttachSampleBillReceipt = () => {
    const sample = generateSampleBillSlipDataUrl();
    setBillPaymentImageUrl(sample.dataUrl);
    setBillPaymentFileName(sample.fileName);
    setBillPaymentRefNo(sample.refCode);
    setBillPaymentUploadError(null);
  };

  const handleConfirmPartyBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSinger) {
      showBanner('Please select a Singer first.', 'ERROR');
      return;
    }
    if (
      paymentMethod !== 'BCEL_ONE_QR' &&
      paymentMethod !== 'LAO_QR'
    ) {
      setPaymentMethod('BCEL_ONE_QR');
    }
    setIsQrPaymentConfirmedForBillUpload(false);
    setBillPaymentUploadError(null);
    setShowBookingQrPaymentModal(true);
  };

  const handleConfirmQrStepToBillUpload = () => {
    setIsQrPaymentConfirmedForBillUpload(true);
    setBillPaymentUploadError(null);
    if (!billPaymentRefNo.trim()) {
      setBillPaymentRefNo(`BCEL-BILL-${Date.now().toString().slice(-6)}`);
    }
  };

  const handleCompleteQrPartyBookingPayment = () => {
    if (!selectedSinger) {
      showBanner('Please select a Singer first.', 'ERROR');
      return;
    }
    if (!billPaymentImageUrl.trim()) {
      setBillPaymentUploadError(
        'Please attach/upload your Bill Payment receipt image before clicking the Submit button.'
      );
      return;
    }
    const effectiveBillRef =
      billPaymentRefNo.trim() ||
      `BCEL-BILL-${Date.now().toString().slice(-6)}`;
    const effectiveBillFileName =
      billPaymentFileName.trim() || `Bill-Payment-${effectiveBillRef}.png`;

    const res = createSingerPartyBooking({
      singerId: selectedSinger.id,
      customerMemberId:
        selectedCustomerMemberId !== 'NEW_GENERAL_MEMBER'
          ? selectedCustomerMemberId
          : undefined,
      customerName,
      customerPhone,
      customerPassword: customerPassword.trim() || '123456',
      partyEventName,
      eventLocation,
      bookingDate: selectedBookingDate,
      bookingTimeSlot,
      singerPriceTier,
      customSingerPriceLak: 0,
      brandSetPackageType,
      customBrandSetPriceLak: livePricingSummary.bPrice,
      copyrightMusicType,
      customCopyrightMusicPriceLak: livePricingSummary.cPrice,
      ownMusicSongTitles,
      paymentMethod:
        paymentMethod === 'LAO_QR' ? 'LAO_QR' : 'BCEL_ONE_QR',
      paymentBillImageUrl: billPaymentImageUrl,
      paymentBillFileName: effectiveBillFileName,
      paymentBillRefNo: effectiveBillRef,
      notes: `${bookingNotes} • Customer Member Free Active (PW: ${customerPassword.trim() || '123456'}) • Singer Schedule Calendar Warning: ${selectedBookingDate} (${bookingTimeSlot}) • Bill Payment Attached: ${effectiveBillFileName} (Ref: ${effectiveBillRef})`,
    });
    if (res.success && res.booking) {
      setShowBookingQrPaymentModal(false);
      setIsQrPaymentConfirmedForBillUpload(false);
      setBillPaymentImageUrl('');
      setBillPaymentFileName('');
      setBillPaymentRefNo('');
      setBillPaymentUploadError(null);
      setLastActivatedAffiliateBooking(res.booking);
      if (res.booking.customerMemberId) {
        setSelectedCustomerMemberId(res.booking.customerMemberId);
        setCustomerLoginIdentifier(res.booking.customerMemberId);
        setCurrentMemberId(res.booking.customerMemberId);
      }
      if (res.autoAffiliateMember) {
        setCustWithdrawAccountName(res.autoAffiliateMember.name.toUpperCase());
        setCurrentMemberId(res.autoAffiliateMember.memberId);
      }
      setSingerScheduleAlertBanner(
        `🔔 SINGER SCHEDULE WARNING: ${res.booking.singerStageName} (${res.booking.singerCode}) is now booked on Schedule Calendar Date ${res.booking.bookingDate} • Time ${res.booking.bookingTimeSlot} by Customer ${res.booking.customerName} (Member Free Active ID: ${res.booking.customerMemberId} • Password: ${customerPassword.trim() || '123456'})!`
      );
      setIsLoggedOut(false);
      setIsAdminMode(false);
      setCustomerAffiliateTab('ALL');
      // Also auto-log to Administrator Panel Reports so Admin has immediate visibility
      submitReportToAdminPanel({
        reportTitle: `Admin Booking Check & Schedule Warning: ${res.booking.partyEventName} (${res.booking.bookingCode})`,
        reportType: 'SINGER_BOOKING_REPORT',
        submittedBy: `${res.booking.customerName} (Member Free Active: ${res.booking.customerMemberId} • PW: ${customerPassword.trim() || '123456'})`,
        bookingId: res.booking.id,
        bookingCode: res.booking.bookingCode,
        singerStageName: res.booking.singerStageName,
        totalPackagePriceLak: res.booking.totalPackagePriceLak,
        loanWalletCut10PercentLak: res.booking.loanWalletCut10PercentLak,
        singerNetPayout90PercentLak: res.booking.singerNetPayout90PercentLak,
        loanWalletBalanceSnapshotLak:
          loanWalletBalanceLak + res.booking.loanWalletCut10PercentLak,
        packageSummary: `Selected Package Party Price: ${formatLak(res.booking.totalPackagePriceLak)} (${res.booking.brandSetPackageLabel}) • 10% Saving for Loan: +${formatLak(res.booking.loanWalletCut10PercentLak)} • Schedule Calendar Warning: ${res.booking.bookingDate} (${res.booking.bookingTimeSlot})`,
        paymentBillImageUrl: billPaymentImageUrl,
        paymentBillFileName: effectiveBillFileName,
        paymentBillRefNo: effectiveBillRef,
        notes: `Customer ${res.booking.customerName} (Member Free Active ID: ${res.booking.customerMemberId} • Password: ${customerPassword.trim() || '123456'}) booked Singer ${res.booking.singerStageName} (${res.booking.singerCode}) for Schedule Calendar Date ${res.booking.bookingDate} • Time ${res.booking.bookingTimeSlot} at ${res.booking.eventLocation} via ${res.booking.paymentMethod} (Bill Ref: ${effectiveBillRef}). Singer warned on Schedule Calendar & Administrator notified.`,
      });
      try {
        sessionStorage.setItem('dmc_active_home_role', 'CUSTOMER');
        sessionStorage.setItem('dmc_post_login_dashboard', 'CUSTOMER');
        sessionStorage.setItem('dmc_post_booking_notice', res.message);
      } catch {
        // ignore storage errors
      }
      showBanner(
        `Bill Payment Submitted (${effectiveBillRef})! ${res.message}`,
        'SUCCESS'
      );
      if (onBookingCompleted) {
        onBookingCompleted();
        return;
      }
      if (onOpenAdminPanel) {
        onOpenAdminPanel();
        return;
      }
    }
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  // Active Customer Member for the Customer Automatic Affiliate Dashboard (Wallet • Withdraw • Affiliate Commission)
  const activeCustomerAffiliateMemberId = useMemo(() => {
    if (lastActivatedAffiliateBooking?.customerMemberId) {
      return lastActivatedAffiliateBooking.customerMemberId;
    }
    if (
      selectedCustomerMemberId &&
      selectedCustomerMemberId !== 'NEW_GENERAL_MEMBER'
    ) {
      return selectedCustomerMemberId;
    }
    return currentMember?.memberId || 'DMC-LA-00303';
  }, [
    lastActivatedAffiliateBooking?.customerMemberId,
    selectedCustomerMemberId,
    currentMember?.memberId,
  ]);

  const activeCustomerAffiliateMember = useMemo(
    () =>
      allMembers.find((m) => m.memberId === activeCustomerAffiliateMemberId) ||
      currentMember,
    [allMembers, activeCustomerAffiliateMemberId, currentMember]
  );

  // Inline Edit Customer Profile state
  const [isEditingCustomerProfile, setIsEditingCustomerProfile] =
    useState<boolean>(false);
  const [editCustName, setEditCustName] = useState<string>(
    activeCustomerAffiliateMember?.name || ''
  );
  const [editCustPhone, setEditCustPhone] = useState<string>(
    activeCustomerAffiliateMember?.phone || '+856 20 '
  );
  const [editCustEmail, setEditCustEmail] = useState<string>(
    activeCustomerAffiliateMember?.email || ''
  );
  const [editCustProvince, setEditCustProvince] = useState<string>(
    activeCustomerAffiliateMember?.deliveryAddress?.province ||
      '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)'
  );
  const [editCustPassword, setEditCustPassword] = useState<string>(
    activeCustomerAffiliateMember?.password || '123456'
  );
  const [editCustAvatarUrl, setEditCustAvatarUrl] = useState<string>(
    activeCustomerAffiliateMember?.avatarUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
  );

  useEffect(() => {
    if (activeCustomerAffiliateMember) {
      setEditCustName(activeCustomerAffiliateMember.name);
      setEditCustPhone(activeCustomerAffiliateMember.phone);
      setEditCustEmail(activeCustomerAffiliateMember.email || '');
      setEditCustProvince(
        activeCustomerAffiliateMember.deliveryAddress?.province ||
          '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)'
      );
      setEditCustPassword(activeCustomerAffiliateMember.password || '123456');
      setEditCustAvatarUrl(
        activeCustomerAffiliateMember.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
      );
    }
  }, [activeCustomerAffiliateMember]);

  const customerAffiliateBalances = useMemo(
    () => getMemberBalances(activeCustomerAffiliateMemberId),
    [getMemberBalances, activeCustomerAffiliateMemberId, allMembers, withdrawals]
  );

  const customerAffiliateLedger = useMemo(
    () => getMemberLedger(activeCustomerAffiliateMemberId),
    [getMemberLedger, activeCustomerAffiliateMemberId, allMembers, withdrawals]
  );

  const customerAffiliateAwards = useMemo(
    () => getMemberAwards(activeCustomerAffiliateMemberId),
    [getMemberAwards, activeCustomerAffiliateMemberId, allMembers]
  );

  const customerAffiliateWithdrawals = useMemo(
    () =>
      withdrawals.filter(
        (w) => w.memberId === activeCustomerAffiliateMemberId
      ),
    [withdrawals, activeCustomerAffiliateMemberId]
  );

  const customerAffiliateCommissionBalance = useMemo(
    () => getCustomerAffiliateCommissionBalance(activeCustomerAffiliateMemberId),
    [getCustomerAffiliateCommissionBalance, activeCustomerAffiliateMemberId, customerAffiliateAwards, customerAffiliateLedger]
  );

  const customerAffiliateTransfersList = useMemo(
    () => getCustomerAffiliateTransfers(activeCustomerAffiliateMemberId),
    [getCustomerAffiliateTransfers, activeCustomerAffiliateMemberId, customerAffiliateLedger]
  );

  const [custTransferAmountLak, setCustTransferAmountLak] = useState<number>(600000);
  const [custTransferNote, setCustTransferNote] = useState<string>(
    'Transfer from Affiliate Commission to Customer Wallet for Withdrawal'
  );

  const totalCustomerCommissionEarnedLak = useMemo(() => {
    const fromAwards = customerAffiliateAwards.reduce(
      (sum, a) => sum + a.grossAwardLak,
      0
    );
    return Math.max(
      fromAwards,
      customerAffiliateCommissionBalance + customerAffiliateBalances.available
    );
  }, [
    customerAffiliateAwards,
    customerAffiliateCommissionBalance,
    customerAffiliateBalances.available,
  ]);

  const totalCustomerWithdrawnLak = useMemo(
    () =>
      customerAffiliateWithdrawals
        .filter((w) => w.status === 'PAID')
        .reduce((sum, w) => sum + w.amountLak, 0),
    [customerAffiliateWithdrawals]
  );

  const totalCustomerPendingWithdrawalLak = useMemo(
    () =>
      customerAffiliateWithdrawals
        .filter(
          (w) =>
            w.status === 'ADMIN_REVIEW' ||
            w.status === 'APPROVED' ||
            w.status === 'OTP_PENDING'
        )
        .reduce((sum, w) => sum + w.amountLak, 0),
    [customerAffiliateWithdrawals]
  );

  const pendingAdminApprovalWithdrawals = useMemo(
    () =>
      withdrawals.filter(
        (w) =>
          w.status === 'ADMIN_REVIEW' ||
          w.status === 'APPROVED' ||
          w.status === 'OTP_PENDING'
      ),
    [withdrawals]
  );

  const [selectedRecommendProductSku, setSelectedRecommendProductSku] =
    useState<string>('SHOWROOM_GUITAR_4200');

  const selectedRecommendProduct = useMemo(
    () =>
      products.find((p) => p.sku === selectedRecommendProductSku) ||
      products[0],
    [products, selectedRecommendProductSku]
  );

  const handleCustomerRecommendEarn = (
    itemTitle: string,
    orderAmountLak: number,
    commissionLak: number
  ) => {
    const nextComm = customerAffiliateCommissionBalance + commissionLak;
    const res = recordCustomerAffiliateCommission(
      activeCustomerAffiliateMemberId,
      itemTitle,
      orderAmountLak,
      commissionLak,
      custRecommendBuyerName.trim() || 'Recommended Party Customer'
    );
    if (res.success) {
      setCustTransferAmountLak(nextComm);
    }
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  const handleTransferCommissionToWalletSubmit = (
    e?: React.FormEvent,
    overrideAmountLak?: number
  ) => {
    if (e) e.preventDefault();
    const amtToTransfer =
      overrideAmountLak !== undefined
        ? overrideAmountLak
        : custTransferAmountLak > 0
        ? custTransferAmountLak
        : customerAffiliateCommissionBalance;
    const res = transferAffiliateCommissionToCustomerWallet(
      activeCustomerAffiliateMemberId,
      amtToTransfer,
      custTransferNote
    );
    if (res.success) {
      setCustWithdrawAmountLak(res.newWalletAvailableLak);
      setCustTransferAmountLak(res.remainingCommissionLak);
    }
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  const handleCustomerAffiliateWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = withdrawCustomerAffiliateWallet(
      activeCustomerAffiliateMemberId,
      custWithdrawAmountLak,
      {
        bankName: custWithdrawBankName,
        accountNumber: custWithdrawAccountNumber,
        accountName:
          custWithdrawAccountName ||
          activeCustomerAffiliateMember?.name ||
          'CUSTOMER AFFILIATE',
      }
    );
    showBanner(res.message, res.success ? 'SUCCESS' : 'ERROR');
  };

  // ============================================================================
  // 3. REPORT TO ADMINISTRATOR PANEL STATE & HANDLERS
  // ============================================================================
  const [newReportTitle, setNewReportTitle] = useState<string>(
    'Official Singer Party Set Package & 10% Saving for Loan Report'
  );
  const [newReportType, setNewReportType] =
    useState<DmcAdminPanelBookingReport['reportType']>('FULL_SUMMARY_REPORT');
  const [newReportTotalLak, setNewReportTotalLak] = useState<number>(
    livePricingSummary.totalLak
  );
  const [newReportNotes, setNewReportNotes] = useState<string>(
    'Submitted to Administrator Panel for audit & settlement verification.'
  );
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [editReportTitle, setEditReportTitle] = useState<string>('');
  const [editReportTotalLak, setEditReportTotalLak] = useState<number>(0);
  const [editReportNotes, setEditReportNotes] = useState<string>('');
  const [editReportStatus, setEditReportStatus] =
    useState<DmcAdminPanelBookingReport['status']>('SENT_TO_ADMIN_PANEL');

  const handleQuickReportCurrentConfigToAdmin = () => {
    const rpt = submitReportToAdminPanel({
      reportTitle: `Singer Party Set Package Report — ${selectedSinger?.stageName || 'DMC Singer'} (${selectedBookingDate})`,
      reportType: 'SINGER_BOOKING_REPORT',
      singerStageName: selectedSinger?.stageName,
      totalPackagePriceLak: livePricingSummary.totalLak,
      loanWalletCut10PercentLak: livePricingSummary.loanWalletCut10Lak,
      singerNetPayout90PercentLak: livePricingSummary.singerNet90Lak,
      loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
      packageSummary: `${livePricingSummary.sLabel} (${formatLak(livePricingSummary.sPrice)}) + ${livePricingSummary.bLabel} (${formatLak(livePricingSummary.bPrice)}) + ${livePricingSummary.cLabel} (${formatLak(livePricingSummary.cPrice)})`,
      notes: `Reported from Booking Singer Party Set Form • Event: ${partyEventName}`,
    });
    showBanner(
      `Report ${rpt.reportCode} sent to Administrator Panel! Total: ${formatLak(rpt.totalPackagePriceLak)} • 10% Saving for Loan: ${formatLak(rpt.loanWalletCut10PercentLak)}.`
    );
    setActiveView('ADMIN_REPORTS');
  };

  const handleReportSingleBookingToAdmin = (bk: DmcSingerPartyBooking) => {
    const rpt = submitReportToAdminPanel({
      reportTitle: `Booking Report ${bk.bookingCode} — ${bk.partyEventName} (${bk.singerStageName})`,
      reportType: 'SINGER_BOOKING_REPORT',
      submittedBy: bk.customerName,
      bookingId: bk.id,
      bookingCode: bk.bookingCode,
      singerStageName: bk.singerStageName,
      totalPackagePriceLak: bk.totalPackagePriceLak,
      loanWalletCut10PercentLak: bk.loanWalletCut10PercentLak,
      singerNetPayout90PercentLak: bk.singerNetPayout90PercentLak,
      loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
      packageSummary: `${bk.singerPriceTierLabel} (${formatLak(bk.singerPriceLak)}) + ${bk.brandSetPackageLabel} (${formatLak(bk.brandSetPackagePriceLak)}) + ${bk.copyrightMusicLabel} (${formatLak(bk.copyrightMusicPriceLak)})`,
      notes: `Event Date: ${bk.bookingDate} • Location: ${bk.eventLocation}`,
    });
    showBanner(
      `Booking ${bk.bookingCode} reported to Administrator Panel as ${rpt.reportCode}!`
    );
  };

  const handleCreateCustomAdminReport = (e: React.FormEvent) => {
    e.preventDefault();
    const rpt = submitReportToAdminPanel({
      reportTitle: newReportTitle,
      reportType: newReportType,
      singerStageName: selectedSinger?.stageName,
      totalPackagePriceLak: newReportTotalLak,
      loanWalletCut10PercentLak: Math.round(newReportTotalLak * 0.1),
      singerNetPayout90PercentLak: Math.round(newReportTotalLak * 0.9),
      loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
      packageSummary: `Singer: ${selectedSinger?.stageName || 'All Singers'} • DMC Party Wallet Balance: ${formatLak(loanWalletBalanceLak)} • Total 10% Saving for Loan: ${formatLak(loanWalletSummary.total10PercentSingerCuts)}`,
      notes: newReportNotes,
    });
    showBanner(
      `Created & sent Report ${rpt.reportCode} to Administrator Panel!`
    );
  };

  const handleExportAdminReportsCsv = () => {
    const headers = [
      'Report Code',
      'Created At',
      'Report Title',
      'Report Type',
      'Singer',
      'Booking Code',
      'Total Package Price (LAK)',
      '10% Saving for Loan (LAK)',
      '90% Singer Net Payout (LAK)',
      'DMC Party Wallet Balance Snapshot (LAK)',
      'Package Breakdown',
      'Status',
      'Notes',
    ];
    const rows = adminPanelBookingReports.map((r) => [
      r.reportCode,
      new Date(r.createdAt).toLocaleString(),
      `"${(r.reportTitle || '').replace(/"/g, '""')}"`,
      r.reportType,
      `"${(r.singerStageName || '-').replace(/"/g, '""')}"`,
      r.bookingCode || '-',
      r.totalPackagePriceLak,
      r.loanWalletCut10PercentLak,
      r.singerNetPayout90PercentLak,
      r.loanWalletBalanceSnapshotLak,
      `"${(r.packageSummary || '').replace(/"/g, '""')}"`,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DMC-Admin-Panel-Singer-Booking-Party-Wallet-Report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showBanner(
      'Downloaded Administrator Panel Singer Booking & DMC Party Wallet Balance Excel/CSV Report!'
    );
  };

  return (
    <div className="space-y-5 text-slate-900">
      {/* Top Mode Switcher & Administrator Report Bar (hidden when opened in dedicated Customer Booking Form mode) */}
      {initialMode !== 'BOOKING_FORM' && (
      <div className="flex flex-col gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#4a040c] to-slate-900 text-white border border-amber-400/40 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <Landmark className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-black tracking-tight text-white">
                  DMC Party Wallet Balance & Singer Music Cain Party Set Booking
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  10% Saving for Loan
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90">
                DMC Party Wallet Balance (Withdraw & 10% Saving for Loan) • Booking Singer Party Set • Report to Administrator Panel
              </p>
            </div>
          </div>

          {/* Quick Report to Administrator Panel & Open Admin Panel Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleQuickReportCurrentConfigToAdmin}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-[10px] sm:text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Report to Administrator Panel</span>
            </button>
            <button
              type="button"
              onClick={handleExportAdminReportsCsv}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black flex items-center gap-1 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel/CSV</span>
            </button>
            {onOpenAdminPanel && (
              <button
                type="button"
                onClick={handleGoToAdministratorPanel}
                className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Admin Panel</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Pill Bar */}
        <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/15">
          <button
            type="button"
            onClick={() => setActiveView('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
              activeView === 'ALL'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            All View
          </button>
          <button
            type="button"
            onClick={() => setActiveView('SINGER_REGISTER_REPORT')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'SINGER_REGISTER_REPORT'
                ? 'bg-pink-400 text-slate-950 shadow ring-2 ring-amber-300'
                : 'bg-pink-500/20 text-pink-200 border border-pink-400/40 hover:bg-pink-500/30'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>Report Singer Register ({singerProfiles.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('BOOKING_FORM')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'BOOKING_FORM'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              Booking Singer Party Set (Who Is Booking • Daily Report) (
              {singerBookings.length})
            </span>
          </button>
          {false && (
            <button
              type="button"
              onClick={() => setActiveView('ADMIN_PRICE_CRUD')}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                activeView === 'ADMIN_PRICE_CRUD'
                  ? 'bg-sky-400 text-slate-950 shadow'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>
                Admin Add / Edit / Delete / Update Price ({bookingPackageOptions.length})
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveView('LOAN_WALLET')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'LOAN_WALLET'
                ? 'bg-emerald-400 text-slate-950 shadow'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <Wallet className="w-3 h-3" />
            <span>DMC Party Wallet Balance (10% Saving for Loan)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('ADMIN_REPORTS')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center gap-1 ${
              activeView === 'ADMIN_REPORTS'
                ? 'bg-purple-400 text-slate-950 shadow'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>
              Report to Administrator Panel ({adminPanelBookingReports.length})
            </span>
          </button>
        </div>
      </div>
      )}

      {/* Status Notification Banner */}
      {bannerNotice && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 shadow-md animate-in fade-in ${
            bannerNotice.type === 'SUCCESS'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-red-50 border-red-300 text-red-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 shrink-0 ${
                bannerNotice.type === 'SUCCESS'
                  ? 'text-emerald-600'
                  : 'text-red-600'
              }`}
            />
            <span>{bannerNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setBannerNotice(null)}
            className="text-[10px] font-black underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ============================================================================
          SECTION 0: REPORT SINGER REGISTER — ADMINISTRATOR EDIT, DELETE, UPDATE ALL SINGER PROFILES & SELECTED PACKAGE (LAK) PRICE
         ============================================================================ */}
      {activeView === 'SINGER_REGISTER_REPORT' && (
        <div className="rounded-3xl bg-white border-2 border-pink-400 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-[#69030e] to-slate-900 p-4 sm:p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    <span>Report Singer Register • Administrator Control</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    Edit • Delete • Update All Singer Profiles &amp; Selected Package (LAK) Price
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pink-400" />
                  <span>
                    Report Singer Register ({singerProfiles.length} Registered Singers) — Edit, Delete, Update All Singer Profiles &amp; Selected Package (LAK) Price
                  </span>
                </h4>
                <p className="text-xs text-pink-200/90">
                  Administrator can Edit, Delete, and Update every registered Singer Profile, Start Singer Price (LAK), and Selected Package (LAK) Price
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSingerAdminForm((prev) => !prev)}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {showAddSingerAdminForm
                      ? 'Close Add Singer Form'
                      : '+ Register / Add Singer'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const totalStartLak = singerProfiles.reduce(
                      (sum, s) =>
                        sum +
                        (s.startSingerPriceLak ||
                          s.cheaperPriceLak ||
                          singerBookingPricing.cheaperPriceLak),
                      0
                    );
                    const totalSelectedPkgLak = singerProfiles.reduce(
                      (sum, s) => sum + (s.packagePartyPriceLak || 25000000),
                      0
                    );
                    const combinedLak = totalStartLak + totalSelectedPkgLak;
                    const rpt = submitReportToAdminPanel({
                      reportTitle: `Report Singer Register (${singerProfiles.length} Singers) & Selected Package (LAK) Price`,
                      reportType: 'FULL_SUMMARY_REPORT',
                      totalPackagePriceLak: combinedLak,
                      loanWalletCut10PercentLak: Math.round(combinedLak * 0.1),
                      singerNetPayout90PercentLak: Math.round(
                        combinedLak * 0.9
                      ),
                      loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
                      packageSummary: singerProfiles
                        .map(
                          (s) =>
                            `${s.stageName} (${s.singerCode}): Start ${formatLak(
                              s.startSingerPriceLak || 2500000
                            )} + Selected Package ${formatLak(
                              s.packagePartyPriceLak || 25000000
                            )}`
                        )
                        .join(' | '),
                      notes: `Official Report Singer Register (${singerProfiles.length} Singers) submitted to Administrator Panel.`,
                    });
                    showBanner(
                      `Report Singer Register (${rpt.reportCode}) sent to Administrator Panel!`
                    );
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Report All Singers to Admin Panel</span>
                </button>
              </div>
            </div>

            {/* Summary KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="p-2.5 rounded-2xl bg-white/10 border border-pink-400/40">
                <span className="text-[10px] font-bold uppercase text-pink-200 block">
                  Total Registered Singers
                </span>
                <div className="text-base sm:text-lg font-black font-mono text-white">
                  {singerProfiles.length} Singers
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-400/40">
                <span className="text-[10px] font-bold uppercase text-sky-200 block">
                  Man Singers (ນັກຮ້ອງຊາຍ)
                </span>
                <div className="text-base sm:text-lg font-black font-mono text-sky-300">
                  {
                    singerProfiles.filter((s) => (s.gender || 'MAN') === 'MAN')
                      .length
                  }{' '}
                  Man
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-pink-500/15 border border-pink-400/40">
                <span className="text-[10px] font-bold uppercase text-pink-200 block">
                  Woman Singers (ນັກຮ້ອງຍິງ)
                </span>
                <div className="text-base sm:text-lg font-black font-mono text-pink-300">
                  {singerProfiles.filter((s) => s.gender === 'WOMAN').length}{' '}
                  Woman
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40">
                <span className="text-[10px] font-bold uppercase text-emerald-200 block">
                  Selected Package (LAK) Options
                </span>
                <div className="text-base sm:text-lg font-black font-mono text-emerald-300">
                  {selectedPackagePartyOptions.length} Packages
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* 1. ADMINISTRATOR EDIT / DELETE / UPDATE SELECTED PACKAGE (LAK) PRICE OPTIONS */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-slate-50 border-2 border-emerald-400 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-2.5">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                    Selected Package (LAK) Price Manager
                  </span>
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                    Selected Package (LAK) Price: — Administrator Edit, Delete, Update &amp; Add Package Prices
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    saveSelectedPackagePartyOptions(
                      DEFAULT_SELECTED_PACKAGE_PARTY_OPTIONS
                    );
                    showBanner(
                      'Reset Selected Package (LAK) Price options to default (25M, 30M, 40M, 50M LAK)!'
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default Packages</span>
                </button>
              </div>

              {/* Existing Selected Package (LAK) Price Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {selectedPackagePartyOptions.map((pkg, idx) => {
                  const isEditingPkg = editingSelectedPkgId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className="p-3 rounded-xl bg-white border-2 border-emerald-300 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-black uppercase">
                          Package #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingPkg) {
                                setEditingSelectedPkgId(null);
                              } else {
                                setEditingSelectedPkgId(pkg.id);
                                setEditSelectedPkgValueLak(pkg.value);
                                setEditSelectedPkgLabel(pkg.label);
                              }
                            }}
                            className="px-2 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black flex items-center gap-0.5 cursor-pointer"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                            <span>{isEditingPkg ? 'Close' : 'Edit'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedPackagePartyOptions.length <= 1) {
                                showBanner(
                                  'At least 1 Selected Package (LAK) Price option must remain.',
                                  'ERROR'
                                );
                                return;
                              }
                              const next = selectedPackagePartyOptions.filter(
                                (item) => item.id !== pkg.id
                              );
                              saveSelectedPackagePartyOptions(next);
                              showBanner(
                                `Deleted Selected Package (LAK) Price "${pkg.label}"!`
                              );
                            }}
                            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Delete Selected Package (LAK) Price"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="font-black text-slate-900 text-xs">
                        {pkg.label}
                      </div>
                      <div className="font-mono font-black text-emerald-700 text-sm">
                        {formatLak(pkg.value)}
                      </div>

                      {/* Quick Inline Update Price Input */}
                      <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                        {isEditingPkg && (
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-600 mb-0.5">
                              Package Label
                            </label>
                            <input
                              type="text"
                              value={editSelectedPkgLabel}
                              onChange={(e) =>
                                setEditSelectedPkgLabel(e.target.value)
                              }
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-900"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            step="any"
                            value={
                              isEditingPkg ? editSelectedPkgValueLak : pkg.value
                            }
                            onChange={(e) => {
                              const nextVal = Math.max(
                                0,
                                Math.round(Number(e.target.value) || 0)
                              );
                              if (isEditingPkg) {
                                setEditSelectedPkgValueLak(nextVal);
                                setEditSelectedPkgLabel(
                                  `Price: ${formatNumberWithCommas(nextVal)}kip`
                                );
                              } else {
                                const nextList =
                                  selectedPackagePartyOptions.map((item) =>
                                    item.id === pkg.id
                                      ? {
                                          ...item,
                                          value: nextVal,
                                          label: `Price: ${formatNumberWithCommas(
                                            nextVal
                                          )}kip`,
                                        }
                                      : item
                                  );
                                saveSelectedPackagePartyOptions(nextList);
                              }
                            }}
                            className="w-full bg-slate-50 border border-emerald-400 rounded-lg px-2 py-1 text-xs font-mono font-black text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingPkg) {
                                const cleanVal = Math.max(
                                  0,
                                  Math.round(
                                    Number(editSelectedPkgValueLak) || 0
                                  )
                                );
                                const cleanLbl =
                                  editSelectedPkgLabel.trim() ||
                                  `Price: ${formatNumberWithCommas(cleanVal)}kip`;
                                const nextList =
                                  selectedPackagePartyOptions.map((item) =>
                                    item.id === pkg.id
                                      ? {
                                          ...item,
                                          value: cleanVal,
                                          label: cleanLbl,
                                        }
                                      : item
                                  );
                                saveSelectedPackagePartyOptions(nextList);
                                setEditingSelectedPkgId(null);
                                showBanner(
                                  `Updated Selected Package (LAK) Price to "${cleanLbl}" (${formatLak(cleanVal)})!`
                                );
                              } else {
                                showBanner(
                                  `Updated Selected Package (LAK) Price "${pkg.label}" (${formatLak(pkg.value)})!`
                                );
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shrink-0 cursor-pointer"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Selected Package (LAK) Price Bar */}
              <div className="p-3 rounded-xl bg-white border border-emerald-300 grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end text-xs">
                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-900 mb-1">
                    Add New Selected Package (LAK) Price *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={newSelectedPkgValueLak}
                    onChange={(e) => {
                      const val = Math.max(
                        0,
                        Math.round(Number(e.target.value) || 0)
                      );
                      setNewSelectedPkgValueLak(val);
                      setNewSelectedPkgLabel(
                        `Price: ${formatNumberWithCommas(val)}kip`
                      );
                    }}
                    className="w-full bg-slate-50 border border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={newSelectedPkgLabel}
                    onChange={(e) => setNewSelectedPkgLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const cleanVal = Math.max(
                      0,
                      Math.round(Number(newSelectedPkgValueLak) || 0)
                    );
                    const cleanLbl =
                      newSelectedPkgLabel.trim() ||
                      `Price: ${formatNumberWithCommas(cleanVal)}kip`;
                    const next = [
                      ...selectedPackagePartyOptions,
                      {
                        id: `pkg-lak-${Date.now()}`,
                        value: cleanVal,
                        label: cleanLbl,
                      },
                    ];
                    saveSelectedPackagePartyOptions(next);
                    showBanner(
                      `Added new Selected Package (LAK) Price: "${cleanLbl}" (${formatLak(cleanVal)})!`
                    );
                  }}
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Selected Package (LAK) Price</span>
                </button>
              </div>
            </div>

            {/* 2. OPTIONAL ADD / REGISTER NEW SINGER PROFILE FORM (ADMIN) */}
            {showAddSingerAdminForm && (
              <form
                onSubmit={handleAdminCreateSingerProfile}
                className="p-4 rounded-2xl bg-pink-50/80 border-2 border-pink-400 space-y-3 text-xs animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                  <span className="font-black text-sm text-pink-950 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-pink-600" />
                    <span>
                      Administrator Register / Add New Singer Profile &amp; Selected Package (LAK) Price
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddSingerAdminForm(false)}
                    className="p-1 rounded-lg bg-white text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Stage Name (ຊື່ໃນວົງການ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSingerAdminForm.stageName}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          stageName: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Full Name (ຊື່ ແລະ ນາມສະກຸນ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSingerAdminForm.fullName}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                          accountName: e.target.value.toUpperCase(),
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Gender (Man / Woman) *
                    </label>
                    <select
                      value={newSingerAdminForm.gender}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          gender: e.target.value as 'MAN' | 'WOMAN',
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-black"
                    >
                      <option value="MAN">MAN (ນັກຮ້ອງຊາຍ)</option>
                      <option value="WOMAN">WOMAN (ນັກຮ້ອງຍິງ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Phone (+856 20) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSingerAdminForm.phone}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-emerald-900 mb-1">
                      Selected Package (LAK) Price: *
                    </label>
                    <select
                      value={newSingerAdminForm.packagePartyPriceLak}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          packagePartyPriceLak:
                            Number(e.target.value) || 25000000,
                        }))
                      }
                      className="w-full bg-white border-2 border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-black"
                    >
                      {selectedPackagePartyOptions.map((opt) => (
                        <option key={opt.id} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Location (18 Provinces in Laos) *
                    </label>
                    <select
                      value={newSingerAdminForm.province}
                      onChange={(e) =>
                        setNewSingerAdminForm((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                    >
                      {LAO_18_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save New Singer Profile</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 3. ALL REGISTERED SINGER PROFILES LIST (ADMIN EDIT, DELETE, UPDATE SINGER PROFILE & SELECTED PACKAGE (LAK) PRICE) */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-[#df1c2d]" />
                    <span>
                      All Registered Singer Profiles ({filteredSingerProfilesForReport.length})
                    </span>
                  </h5>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(
                      [
                        {
                          id: 'ALL',
                          label: `All (${singerProfiles.length})`,
                        },
                        {
                          id: 'MAN',
                          label: `Man (${
                            singerProfiles.filter(
                              (s) => (s.gender || 'MAN') === 'MAN'
                            ).length
                          })`,
                        },
                        {
                          id: 'WOMAN',
                          label: `Woman (${
                            singerProfiles.filter((s) => s.gender === 'WOMAN')
                              .length
                          })`,
                        },
                      ] as const
                    ).map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSingerReportGenderFilter(g.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer ${
                          singerReportGenderFilter === g.id
                            ? 'bg-slate-900 text-amber-300 shadow-2xs'
                            : 'text-slate-600 hover:bg-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={singerReportSearch}
                  onChange={(e) => setSingerReportSearch(e.target.value)}
                  placeholder="Search Singer Name, Code, Phone, Province..."
                  className="w-full sm:w-64 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-3">
                {filteredSingerProfilesForReport.map((s, idx) => {
                  const isEditingThisSinger = editingSingerProfileId === s.id;
                  const sGender = s.gender || 'MAN';
                  const currentStartPrice =
                    s.startSingerPriceLak ||
                    s.cheaperPriceLak ||
                    singerBookingPricing.cheaperPriceLak;
                  const currentSelectedPkgLak =
                    s.packagePartyPriceLak ||
                    selectedPackagePartyOptions[0]?.value ||
                    25000000;

                  return (
                    <div
                      key={s.id}
                      className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-pink-300 transition-all space-y-3 text-xs shadow-2xs"
                    >
                      {/* Top Row: Singer Identity + Inline Quick Price & Selected Package (LAK) Price + Edit / Update / Delete Buttons */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        {/* Left: Singer Avatar & Info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <img
                              src={s.avatarUrl}
                              alt={s.stageName}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                            />
                            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black flex items-center justify-center border border-amber-400">
                              {idx + 1}
                            </span>
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-black">
                                {s.singerCode}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  sGender === 'WOMAN'
                                    ? 'bg-pink-600 text-white'
                                    : 'bg-sky-600 text-white'
                                }`}
                              >
                                {sGender === 'WOMAN'
                                  ? 'WOMAN (ນັກຮ້ອງຍິງ)'
                                  : 'MAN (ນັກຮ້ອງຊາຍ)'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase">
                                {s.applicationStatus}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[9px] font-bold">
                                {s.vocalStyle}
                              </span>
                            </div>
                            <div className="text-sm font-black text-slate-900">
                              {s.stageName}{' '}
                              <span className="text-xs font-bold text-slate-500">
                                ({s.fullName})
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                              <span>Phone: {s.phone}</span>
                              <span>• Location: {s.province}</span>
                              <span>
                                • Bank: {s.bankAccount?.bankName} (
                                {s.bankAccount?.accountNumber})
                              </span>
                              <span className="font-mono font-black text-emerald-700">
                                • Singer Wallet:{' '}
                                {formatLak(s.walletAvailableLak)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Inline Selected Package (LAK) Price: + Edit / Update / Delete Buttons */}
                        <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shrink-0">
                          {/* Selected Package (LAK) Price: */}
                          <div className="w-56">
                            <label className="block text-[9px] font-black uppercase text-emerald-800 mb-0.5">
                              Selected Package (LAK) Price:
                            </label>
                            <select
                              value={currentSelectedPkgLak}
                              onChange={(e) => {
                                const nextPkg =
                                  Number(e.target.value) || 25000000;
                                updateSingerProfile(s.id, {
                                  packagePartyPriceLak: nextPkg,
                                });
                                if (selectedSinger?.id === s.id) {
                                  setCustomBrandSetPriceLak(nextPkg);
                                }
                                showBanner(
                                  `Updated Selected Package (LAK) Price for ${s.stageName} to ${formatLak(nextPkg)}!`
                                );
                              }}
                              className="w-full bg-emerald-50 border border-emerald-400 rounded-lg px-2 py-1 text-xs font-mono font-black text-emerald-950 cursor-pointer"
                            >
                              {!selectedPackagePartyOptions.some(
                                (o) => o.value === currentSelectedPkgLak
                              ) && (
                                <option value={currentSelectedPkgLak}>
                                  Price:{' '}
                                  {formatNumberWithCommas(currentSelectedPkgLak)}
                                  kip
                                </option>
                              )}
                              {selectedPackagePartyOptions.map((opt) => (
                                <option key={opt.id} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Action Buttons: Edit | Update | Delete */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                isEditingThisSinger
                                  ? setEditingSingerProfileId(null)
                                  : handleStartEditSingerProfile(s)
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>{isEditingThisSinger ? 'Close' : 'Edit'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                showBanner(
                                  `Updated ${s.stageName} (${s.singerCode}) • Selected Package (LAK) Price: ${formatLak(currentSelectedPkgLak)}!`
                                );
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Save className="w-3 h-3" />
                              <span>Update</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                deleteSingerProfile(s.id);
                                showBanner(
                                  `Deleted Singer Profile "${s.stageName}" (${s.singerCode}).`
                                );
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                              title="Delete Singer Profile"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Full Edit Singer Profile & Selected Package (LAK) Price Form */}
                      {isEditingThisSinger && (
                        <div className="p-4 rounded-2xl bg-white border-2 border-sky-400 space-y-3 animate-in fade-in">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5 text-sky-600" />
                              <span>
                                Edit Singer Profile &amp; Selected Package (LAK) Price — {s.stageName} ({s.singerCode})
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingSingerProfileId(null)}
                              className="text-[10px] font-black text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              Close
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1">
                                Stage Name (ຊື່ໃນວົງການ) *
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.stageName}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    stageName: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-black"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1">
                                Full Name (ຊື່ແທ້) *
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.fullName}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    fullName: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1">
                                Singer Gender (Man / Woman) *
                              </label>
                              <select
                                value={editSingerForm.gender}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    gender: e.target.value as 'MAN' | 'WOMAN',
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-black"
                              >
                                <option value="MAN">MAN (ນັກຮ້ອງຊາຍ)</option>
                                <option value="WOMAN">WOMAN (ນັກຮ້ອງຍິງ)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1">
                                Phone (+856 20) *
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.phone}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-black text-emerald-900 mb-1">
                                Selected Package (LAK) Price: (Dropdown)
                              </label>
                              <select
                                value={editSingerForm.packagePartyPriceLak}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    packagePartyPriceLak:
                                      Number(e.target.value) || 25000000,
                                  }))
                                }
                                className="w-full bg-emerald-50 border-2 border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-black text-emerald-950"
                              >
                                {!selectedPackagePartyOptions.some(
                                  (o) =>
                                    o.value ===
                                    editSingerForm.packagePartyPriceLak
                                ) && (
                                  <option
                                    value={editSingerForm.packagePartyPriceLak}
                                  >
                                    Price:{' '}
                                    {formatNumberWithCommas(
                                      editSingerForm.packagePartyPriceLak
                                    )}
                                    kip
                                  </option>
                                )}
                                {selectedPackagePartyOptions.map((opt) => (
                                  <option key={opt.id} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-emerald-900 mb-1">
                                Selected Package (LAK) Custom Amount:
                              </label>
                              <input
                                type="number"
                                min={0}
                                step="any"
                                value={editSingerForm.packagePartyPriceLak}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    packagePartyPriceLak:
                                      Number(e.target.value) || 0,
                                  }))
                                }
                                className="w-full bg-white border-2 border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-black text-emerald-950"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-700 mb-1">
                                Location (18 Provinces in Laos) *
                              </label>
                              <select
                                value={editSingerForm.province}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    province: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              >
                                {!LAO_18_PROVINCES.includes(
                                  editSingerForm.province
                                ) &&
                                  editSingerForm.province && (
                                    <option value={editSingerForm.province}>
                                      {editSingerForm.province}
                                    </option>
                                  )}
                                {LAO_18_PROVINCES.map((prov) => (
                                  <option key={prov} value={prov}>
                                    {prov}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Vocal Style
                              </label>
                              <select
                                value={editSingerForm.vocalStyle}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    vocalStyle: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              >
                                {DMC_SINGER_VOCAL_STYLES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Status
                              </label>
                              <select
                                value={editSingerForm.applicationStatus}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    applicationStatus:
                                      e.target.value as DmcSingerProfile['applicationStatus'],
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              >
                                <option value="APPROVED_ACTIVE">
                                  APPROVED_ACTIVE
                                </option>
                                <option value="FEATURED_ARTIST">
                                  FEATURED_ARTIST
                                </option>
                                <option value="PENDING_AUDITION">
                                  PENDING_AUDITION
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Bank Name
                              </label>
                              <select
                                value={editSingerForm.bankName}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    bankName: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
                              >
                                {laoBanks.map((b) => (
                                  <option key={b.id} value={b.name}>
                                    {b.shortName} — {b.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Bank Account Number
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.accountNumber}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    accountNumber: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Account Holder Name
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.accountName}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    accountName: e.target.value.toUpperCase(),
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold uppercase"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-1">
                                Singer Avatar URL
                              </label>
                              <input
                                type="text"
                                value={editSingerForm.avatarUrl}
                                onChange={(e) =>
                                  setEditSingerForm((prev) => ({
                                    ...prev,
                                    avatarUrl: e.target.value,
                                  }))
                                }
                                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEditSingerProfile(s)}
                                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>
                                  Update Singer Profile &amp; Package Price
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingSingerProfileId(null)}
                                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          DEDICATED ADMIN PRICE CRUD MANAGER (HIDDEN)
         ============================================================================ */}
      {false && activeView === 'ADMIN_PRICE_CRUD' && (
        <div className="rounded-3xl bg-white border-2 border-sky-300 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 text-[10px] font-black uppercase">
                Administrator Price Control Center
              </span>
              <h4 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                <span>
                  Administrator Add, Edit, Delete & Update Price (All Party Set Packages)
                </span>
              </h4>
              <p className="text-xs text-sky-200/90">
                Manage Singer Price Tiers, Brand Set Packages, and Singer Copyright Own Music prices in LAK
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenAddCategoryForm('SINGER_PRICE_TIER')}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Package Price</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  adminResetBookingPackageOptions();
                  showBanner('Reset all Booking Package Prices to default LAK rates.');
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {(
              [
                {
                  category: 'SINGER_PRICE_TIER' as DmcBookingPackageCategory,
                  label:
                    '1/ Booking singer Music Cain party set package (Singer Price Tiers)',
                  items: singerPriceTierOptions,
                },
                {
                  category: 'BRAND_SET_PACKAGE' as DmcBookingPackageCategory,
                  label:
                    '2/ Select Calendar Booking singer for party (Brand Set Package Prices)',
                  items: brandSetPackageOptions,
                },
                {
                  category: 'COPYRIGHT_OWN_MUSIC' as DmcBookingPackageCategory,
                  label:
                    '3/ Singer copies right own Music (Rock, Music & Traditional Performance)',
                  items: copyrightMusicOptions,
                },
              ] as const
            ).map((group) => (
              <div
                key={group.category}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900">
                    {group.label} ({group.items.length})
                  </h5>
                  <button
                    type="button"
                    onClick={() => handleOpenAddCategoryForm(group.category)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {group.items.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[9px] font-black uppercase">
                          {opt.badge}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEditPackageOption(opt)}
                            className="px-2 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black flex items-center gap-0.5 cursor-pointer"
                          >
                            <Pencil className="w-2.5 h-2.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              adminDeleteBookingPackageOption(opt.id);
                              showBanner(`Deleted package "${opt.title}".`);
                            }}
                            className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="font-black text-slate-900 text-xs sm:text-sm">
                        {opt.title}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {opt.subtitle}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={opt.priceLak}
                          onChange={(e) =>
                            adminUpdateBookingPackageOption(opt.id, {
                              priceLak: Number(e.target.value) || 0,
                            })
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-black text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            showBanner(
                              `Updated price for "${opt.title}" to ${formatLak(opt.priceLak)}!`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shrink-0 cursor-pointer"
                        >
                          Update Price
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================================
          SECTION 1: DMC PARTY WALLET BALANCE (ADMINISTRATOR PANEL — WITHDRAW + 10% SAVING FOR LOAN)
         ============================================================================ */}
      {(activeView === 'ALL' || activeView === 'LOAN_WALLET') && (
        <div className="rounded-3xl bg-white border-2 border-emerald-300 shadow-xl overflow-hidden">
          {/* DMC Party Wallet Balance Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-4 sm:p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Administrator Panel • DMC Party Wallet Balance</span>
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                  <span>DMC Party Wallet Balance (Administrator Withdraw)</span>
                </h4>
              </div>

              {/* Quick Action Buttons: Withdraw, Package Prices, Report */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLoanActionTab('WITHDRAW')}
                  className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow ${
                    loanActionTab === 'WITHDRAW'
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-white'
                      : 'bg-rose-600/90 hover:bg-rose-500 text-white'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoanActionTab('PRICING_CONFIG')}
                  className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow ${
                    loanActionTab === 'PRICING_CONFIG'
                      ? 'bg-sky-400 text-slate-950 ring-2 ring-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Update Package Prices</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const rpt = submitReportToAdminPanel({
                      reportTitle: `DMC Party Wallet Balance Financial Report (Balance: ${formatLak(loanWalletBalanceLak)})`,
                      reportType: 'LOAN_WALLET_10_PERCENT_REPORT',
                      totalPackagePriceLak:
                        loanWalletSummary.total10PercentSingerCuts * 10,
                      loanWalletCut10PercentLak:
                        loanWalletSummary.total10PercentSingerCuts,
                      singerNetPayout90PercentLak:
                        loanWalletSummary.total10PercentSingerCuts * 9,
                      loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
                      packageSummary: `Withdrawals: -${formatLak(loanWalletSummary.totalWithdrawn)}`,
                      notes:
                        'Official DMC Party Wallet Balance Summary reported to Administrator Panel.',
                    });
                    showBanner(
                      `DMC Party Wallet Report ${rpt.reportCode} sent to Administrator Panel!`
                    );
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Report to Admin Panel</span>
                </button>
              </div>
            </div>

            {/* 2 Live Balance KPI Tiles (DMC Party Wallet Balance • Total Admin Withdrawals) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-emerald-400/40 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                    DMC Party Wallet Balance
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-300 mt-0.5">
                    {formatLak(loanWalletBalanceLak)}
                  </div>
                  <span className="text-[9px] text-emerald-100/80 block">
                    Receives 3. Selected Package Party Net Credit
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoanActionTab('WITHDRAW');
                    setWithdrawSource('LOAN_WALLET_BALANCE');
                    setWithdrawAmountLak(loanWalletBalanceLak);
                    setWithdrawNote(
                      'Administrator DMC Party Wallet Balance Withdrawal / Disbursement'
                    );
                  }}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 shadow cursor-pointer"
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  <span>Withdraw DMC Party Wallet Balance</span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex flex-col justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200 block">
                    Total Admin Withdrawals
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-rose-300 mt-0.5">
                    -{formatLak(loanWalletSummary.totalWithdrawn)}
                  </div>
                  <span className="text-[9px] text-rose-100/80 block">
                    Disbursed from DMC Party Wallet Balance
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Body: Withdraw Form / Pricing Config + Ledger */}
          <div className="p-4 sm:p-5 space-y-5">

            {loanActionTab === 'WITHDRAW' && (
              <form
                onSubmit={handleWithdrawSubmit}
                className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-200 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-200">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-rose-600 text-white">
                      <ArrowUpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-black text-rose-950">
                        Withdraw from DMC Party Wallet Balance (Administrator)
                      </h5>
                      <p className="text-[10px] text-rose-700">
                        DMC Party Wallet Balance:{' '}
                        <strong className="font-mono">
                          {formatLak(loanWalletBalanceLak)}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {[500000, 1000000, 3000000, 5000000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmountLak(amt)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-black font-mono cursor-pointer border ${
                          withdrawAmountLak === amt
                            ? 'bg-rose-700 text-white border-rose-800'
                            : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {formatNumberWithCommas(amt)}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setWithdrawSource('LOAN_WALLET_BALANCE');
                        setWithdrawAmountLak(loanWalletBalanceLak);
                        setWithdrawNote(
                          'Administrator DMC Party Wallet Balance Withdrawal / Disbursement'
                        );
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-500 text-slate-950 cursor-pointer"
                    >
                      MAX ({formatNumberWithCommas(loanWalletBalanceLak)})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-rose-900 mb-1">
                      Withdraw Amount (LAK) *
                    </label>
                    <input
                      type="number"
                      min={1000}
                      max={Math.max(
                        loanWalletBalanceLak,
                        loanWalletSummary.total10PercentSingerCuts
                      )}
                      step="any"
                      required
                      value={withdrawAmountLak || ''}
                      onChange={(e) =>
                        setWithdrawAmountLak(Number(e.target.value) || 0)
                      }
                      className="w-full bg-white border-2 border-rose-400 rounded-xl px-3 py-2 text-sm font-mono font-black text-rose-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Destination Bank
                    </label>
                    <select
                      value={withdrawBankName}
                      onChange={(e) => setWithdrawBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                    >
                      {laoBanks.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.shortName} — {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Beneficiary Account Number
                    </label>
                    <input
                      type="text"
                      value={withdrawAccountNumber}
                      onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Beneficiary Account Name
                    </label>
                    <input
                      type="text"
                      value={withdrawAccountName}
                      onChange={(e) =>
                        setWithdrawAccountName(e.target.value.toUpperCase())
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Withdrawal / Loan Purpose Note
                    </label>
                    <input
                      type="text"
                      value={withdrawNote}
                      onChange={(e) => setWithdrawNote(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>
                      Confirm Withdraw (-{formatNumberWithCommas(withdrawAmountLak)} LAK)
                    </span>
                  </button>
                </div>
              </form>
            )}

            {loanActionTab === 'PRICING_CONFIG' && (
              <div className="p-4 rounded-2xl bg-sky-50/80 border-2 border-sky-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-sky-200">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-sky-950">
                      Administrator Update Default Singer Party Set Package Prices (LAK)
                    </h5>
                    <p className="text-[10px] text-sky-700">
                      Add, Edit, Delete, or Update default rates for Cheaper price, Medium Price, Expensive price, Brand Set & Copyright Own Music
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px]">
                      10% Saving for Loan: {singerBookingPricing.loanWalletCutPercent}%
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const rpt = submitReportToAdminPanel({
                          reportTitle:
                            'Updated Singer Party Set Package Price Schedule Report',
                          reportType: 'PACKAGE_PRICE_UPDATE_REPORT',
                          totalPackagePriceLak:
                            singerBookingPricing.mediumPriceLak +
                            singerBookingPricing.newBrandSetPackagePriceLak +
                            singerBookingPricing.rockPerformancePriceLak,
                          packageSummary: `Cheaper: ${formatLak(singerBookingPricing.cheaperPriceLak)} • Medium: ${formatLak(singerBookingPricing.mediumPriceLak)} • Expensive: ${formatLak(singerBookingPricing.expensivePriceLak)} • New Brand Set: ${formatLak(singerBookingPricing.newBrandSetPackagePriceLak)} • Old Brand Set: ${formatLak(singerBookingPricing.oldBrandSetPackagePriceLak)}`,
                          notes:
                            'Administrator updated official Singer Party Set package price schedule.',
                        });
                        showBanner(
                          `Price Schedule Report ${rpt.reportCode} sent to Administrator Panel!`
                        );
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-black text-[10px] cursor-pointer"
                    >
                      Save & Report Prices to Admin Panel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-emerald-700 mb-1">
                      Cheaper price (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.cheaperPriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({ cheaperPriceLak: v });
                        if (singerPriceTier === 'CHEAPER')
                          setCustomSingerPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-blue-700 mb-1">
                      Medium Price (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.mediumPriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({ mediumPriceLak: v });
                        if (singerPriceTier === 'MEDIUM')
                          setCustomSingerPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-purple-700 mb-1">
                      Expensive price (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.expensivePriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({ expensivePriceLak: v });
                        if (singerPriceTier === 'EXPENSIVE')
                          setCustomSingerPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-amber-700 mb-1">
                      New Brand Set package price (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.newBrandSetPackagePriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({
                          newBrandSetPackagePriceLak: v,
                        });
                        if (brandSetPackageType === 'NEW_BRAND_SET')
                          setCustomBrandSetPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-orange-700 mb-1">
                      Old Brand Set Package Price (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.oldBrandSetPackagePriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({
                          oldBrandSetPackagePriceLak: v,
                        });
                        if (brandSetPackageType === 'OLD_BRAND_SET')
                          setCustomBrandSetPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-red-700 mb-1">
                      Rock performance (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.rockPerformancePriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({
                          rockPerformancePriceLak: v,
                        });
                        if (copyrightMusicType === 'ROCK_PERFORMANCE')
                          setCustomCopyrightPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-indigo-700 mb-1">
                      Music performance (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.musicPerformancePriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({
                          musicPerformancePriceLak: v,
                        });
                        if (copyrightMusicType === 'MUSIC_PERFORMANCE')
                          setCustomCopyrightPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                    <label className="block text-[10px] font-black text-teal-700 mb-1">
                      Traditional music (LAK)
                    </label>
                    <input
                      type="number"
                      value={singerBookingPricing.traditionalMusicPriceLak}
                      onChange={(e) => {
                        const v = Number(e.target.value) || 0;
                        updateSingerBookingPricing({
                          traditionalMusicPriceLak: v,
                        });
                        if (copyrightMusicType === 'TRADITIONAL_MUSIC')
                          setCustomCopyrightPriceLak(v);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DMC Party Wallet Balance Transaction Ledger (with Admin Edit / Update Price & Delete) */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <span>
                    DMC Party Wallet Balance Ledger (Withdrawals &amp; 10% Saving for Loan)
                  </span>
                </h5>
                <div className="flex flex-wrap items-center gap-1">
                  {(
                    [
                      { id: 'ALL', label: 'All' },
                      {
                        id: 'SINGER_BOOKING_10_PERCENT_CUT',
                        label: '10% Saving for Loan',
                      },
                      { id: 'WITHDRAW', label: 'Withdrawals' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTxFilter(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                        txFilter === tab.id
                          ? 'bg-slate-900 text-amber-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {filteredLoanTransactions.map((tx) => {
                  const isCut = tx.type === 'SINGER_BOOKING_10_PERCENT_CUT';
                  const isDeposit = tx.type === 'DEPOSIT';
                  const isEditingThisTx = editingTxId === tx.id;
                  return (
                    <div
                      key={tx.id}
                      className={`p-3 rounded-2xl border space-y-2 text-xs ${
                        isCut
                          ? 'bg-amber-50/70 border-amber-200'
                          : isDeposit
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                isCut
                                  ? 'bg-amber-400 text-slate-950'
                                  : isDeposit
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              {isCut
                                ? '10% SAVING FOR LOAN'
                                : isDeposit
                                ? 'DEPOSIT'
                                : 'WITHDRAW'}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-500">
                              {tx.txRef}
                            </span>
                            {tx.singerStageName && (
                              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[9px] font-black">
                                Singer: {tx.singerStageName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            {tx.note}
                          </p>
                          <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-2">
                            <span>
                              {new Date(tx.createdAt).toLocaleString()}
                            </span>
                            {tx.bankName && (
                              <span>
                                • {tx.bankName} ({tx.accountNumber})
                              </span>
                            )}
                            {tx.grossBookingAmountLak && (
                              <span className="font-mono text-amber-800 font-bold">
                                • Booking Gross: {formatLak(tx.grossBookingAmountLak)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-1.5 shrink-0">
                          <div>
                            <div
                              className={`text-sm font-black font-mono ${
                                isCut
                                  ? 'text-amber-700'
                                  : isDeposit
                                  ? 'text-emerald-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {isCut || isDeposit ? '+' : '-'}
                              {formatLak(tx.amountLak)}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              Bal: {formatLak(tx.balanceAfterLak)}
                            </div>
                          </div>

                          {isCut && (
                            <button
                              type="button"
                              onClick={() =>
                                handleInstantWithdraw10PercentCut(
                                  tx.amountLak,
                                  `Administrator Withdraw 10% Saving for Loan from Singer Booking ${
                                    tx.bookingCode || tx.txRef
                                  } (${tx.singerStageName || 'DMC Singer'})`
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer"
                              title="Withdraw this 10% Saving for Loan"
                            >
                              <ArrowUpCircle className="w-3 h-3" />
                              <span>Withdraw 10% Saving for Loan</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              isEditingThisTx
                                ? setEditingTxId(null)
                                : startEditLoanTx(tx)
                            }
                            className="px-2 py-1 rounded-lg bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                            title="Edit / Update Price"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              adminDeleteLoanWalletTransaction(tx.id);
                              showBanner(
                                `Removed transaction record ${tx.txRef}.`
                              );
                            }}
                            className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-200 cursor-pointer"
                            title="Delete transaction record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Inline Edit / Update Price Form for Loan Wallet Transaction */}
                      {isEditingThisTx && (
                        <div className="p-2.5 rounded-xl bg-white border border-sky-300 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-600 mb-0.5">
                              Update Amount (LAK)
                            </label>
                            <input
                              type="number"
                              value={editTxAmountLak}
                              onChange={(e) =>
                                setEditTxAmountLak(Number(e.target.value) || 0)
                              }
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-black"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[9px] font-black uppercase text-slate-600 mb-0.5">
                              Transaction Note
                            </label>
                            <input
                              type="text"
                              value={editTxNote}
                              onChange={(e) => setEditTxNote(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSaveLoanTx(tx)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Update Price</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTxId(null)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          INLINE MODAL / PANEL FOR ADDING A NEW PACKAGE PRICE OPTION
         ============================================================================ */}
      {addingCategory && (
        <form
          onSubmit={handleCreatePackageOption}
          className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-400 shadow-lg space-y-3 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-sky-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-black uppercase">
                Administrator Add New Package Price
              </span>
              <span className="font-black text-slate-900">
                {addingCategory === 'SINGER_PRICE_TIER'
                  ? '1/ Singer Price Tier Package'
                  : addingCategory === 'BRAND_SET_PACKAGE'
                  ? '2/ Brand Set Package Price'
                  : '3/ Singer Copies Right Own Music'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAddingCategory(null)}
              className="p-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-1">
                Package Title *
              </label>
              <input
                type="text"
                required
                value={newPkgTitle}
                onChange={(e) => setNewPkgTitle(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-700 mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={newPkgBadge}
                onChange={(e) => setNewPkgBadge(e.target.value.toUpperCase())}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-emerald-800 mb-1">
                Package Price (LAK) *
              </label>
              <input
                type="number"
                min={0}
                step="any"
                required
                value={newPkgPriceLak}
                onChange={(e) => setNewPkgPriceLak(Number(e.target.value) || 0)}
                className="w-full bg-white border-2 border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-black text-emerald-950"
              />
            </div>
            <div className="flex items-end gap-1.5">
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Package</span>
              </button>
              <button
                type="button"
                onClick={() => setAddingCategory(null)}
                className="py-2 px-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 mb-1">
              Package Description / Subtitle
            </label>
            <input
              type="text"
              value={newPkgSubtitle}
              onChange={(e) => setNewPkgSubtitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs"
            />
          </div>
        </form>
      )}

      {/* ============================================================================
          SECTION 2: CUSTOMER PARTY BOOKING FORM (CUSTOMER VIEW ONLY)
         ============================================================================ */}
      {isCustomerBookingModal && activeView === 'BOOKING_FORM' && (
        <div className="rounded-3xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden">
          {/* Clean Professional Customer Booking Form Header */}
          <div className="bg-gradient-to-r from-[#69030e] via-[#850818] to-amber-900 p-4 sm:p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Official Customer Booking Form
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-amber-400" />
                  <span>
                    Customer Party Booking Form (ແບບຟອມຈອງນັກຮ້ອງ ແລະ ຊຸດປາຕີ້ DMC)
                  </span>
                </h4>
                <p className="text-xs text-amber-100/90">
                  Select your Singer, Party Package, Event Date &amp; Time, and create your password for logging in.
                </p>
              </div>
            </div>
          </div>

          <form
            id="dmc-customer-party-booking-form"
            onSubmit={handleConfirmPartyBooking}
            className="p-4 sm:p-5 space-y-5"
          >
            {/* STEP 1: SELECT SINGER (MAN OR WOMAN) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#df1c2d]">
                    Step 1 of 3
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-slate-900">
                    1. Select Singer (ເລືອກນັກຮ້ອງຊາຍ ຫຼື ຍິງ)
                  </h5>
                </div>

                {/* Gender Filter Buttons: All | Man | Woman */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                  {(
                    [
                      { id: 'ALL', label: `All (${singerProfiles.length})` },
                      {
                        id: 'MAN',
                        label: `Man (${
                          singerProfiles.filter(
                            (s) => (s.gender || 'MAN') === 'MAN'
                          ).length
                        })`,
                      },
                      {
                        id: 'WOMAN',
                        label: `Woman (${
                          singerProfiles.filter((s) => s.gender === 'WOMAN')
                            .length
                        })`,
                      },
                    ] as const
                  ).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setSingerGenderFilter(g.id);
                        const matching =
                          g.id === 'ALL'
                            ? singerProfiles
                            : singerProfiles.filter(
                                (s) => (s.gender || 'MAN') === g.id
                              );
                        if (
                          matching.length > 0 &&
                          !matching.some((s) => s.id === selectedSinger?.id)
                        ) {
                          setSelectedSingerId(matching[0].id);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all ${
                        singerGenderFilter === g.id
                          ? 'bg-[#df1c2d] text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Singer Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {filteredSingersByGender.map((s, idx) => {
                  const isSel = selectedSinger?.id === s.id;
                  const sGender = s.gender || 'MAN';
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSelectedSingerId(s.id);
                      }}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isSel
                          ? 'bg-amber-50/90 border-[#df1c2d] ring-2 ring-amber-300 shadow-md'
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={s.avatarUrl}
                          alt={s.stageName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
                        />
                        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                          {idx + 1}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          sGender === 'WOMAN'
                            ? 'bg-pink-100 text-pink-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {sGender === 'WOMAN' ? 'WOMAN' : 'MAN'}
                      </span>
                      <div className="text-xs font-black text-slate-900 leading-snug break-words w-full">
                        {s.stageName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: SELECT PARTY PACKAGE & EVENT SCHEDULE DATE / TIME */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#df1c2d]">
                  Step 2 of 3
                </span>
                <h5 className="text-sm sm:text-base font-black text-slate-900">
                  2. Select Party Package &amp; Event Date / Time (ເລືອກຊຸດປາຕີ້ ແລະ ວັນທີຈັດງານ)
                </h5>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Selected Singer */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Selected Singer *
                  </label>
                  <select
                    value={selectedSinger?.id || ''}
                    onChange={(e) => {
                      setSelectedSingerId(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 cursor-pointer"
                  >
                    {filteredSingersByGender.map((s, idx) => (
                      <option key={s.id} value={s.id}>
                        {idx + 1}. {s.stageName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Party Package (LAK) */}
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Party Set Package (LAK) *
                  </label>
                  <select
                    value={livePricingSummary.bPrice + livePricingSummary.cPrice}
                    onChange={(e) => {
                      const selectedPrice =
                        Number(e.target.value) ||
                        SELECTED_PACKAGE_PARTY_OPTIONS[0].value;
                      setCustomBrandSetPriceLak(selectedPrice);
                      setCustomCopyrightPriceLak(0);
                    }}
                    className="w-full bg-emerald-50 border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-950 cursor-pointer"
                  >
                    {SELECTED_PACKAGE_PARTY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Date & Time Slot */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={selectedBookingDate}
                      onChange={(e) => setSelectedBookingDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-700 mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={bookingTimeSlot}
                      onChange={(e) => setBookingTimeSlot(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-2 py-2 text-[11px] font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="18:00 - 22:00 (Evening Party Set)">
                        18:00 - 22:00 (Evening)
                      </option>
                      <option value="12:00 - 16:00 (Afternoon Matinee Set)">
                        12:00 - 16:00 (Afternoon)
                      </option>
                      <option value="20:00 - 24:00 (Late Night Concert Set)">
                        20:00 - 24:00 (Late Night)
                      </option>
                      <option value="Full Day Event & Gala Package">
                        Full Day Event
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Clean Monthly Availability Calendar */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#df1c2d]" />
                    <span>
                      Select Event Date on Calendar ({calendarData.monthLabel})
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset((p) => p - 1)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset(0)}
                      className="px-2 py-1 rounded-lg bg-amber-100 text-amber-900 cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalendarMonthOffset((p) => p + 1)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarData.days.map((d) => {
                    const isSelectedDate = selectedBookingDate === d.dateStr;
                    const singerBookedOnDate = singerBookings.some(
                      (bk) =>
                        bk.singerId === selectedSinger?.id &&
                        bk.bookingDate === d.dateStr &&
                        bk.status !== 'CANCELLED'
                    );
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        onClick={() => setSelectedBookingDate(d.dateStr)}
                        className={`py-1.5 px-1 rounded-lg text-[10px] font-mono font-black transition-all cursor-pointer border ${
                          isSelectedDate
                            ? 'bg-[#df1c2d] text-white border-[#df1c2d] shadow'
                            : singerBookedOnDate
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200/70'
                        }`}
                      >
                        <div>{d.dayNum}</div>
                        {singerBookedOnDate && (
                          <div className="text-[8px] leading-none">Booked</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 3: CUSTOMER INFORMATION & CREATE PASSWORD FOR LOG IN */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="border-b border-slate-200 pb-2.5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#df1c2d]">
                    Step 3 of 3
                  </span>
                  <h5 className="text-sm sm:text-base font-black text-slate-900">
                    3. Customer Information &amp; Create Password for Log In (ຂໍ້ມູນລູກຄ້າ ແລະ ຕັ້ງລະຫັດຜ່ານເຂົ້າສູ່ລະບົບ)
                  </h5>
                </div>
                <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-300 text-[11px] font-bold text-slate-800">
                  Your Login Member ID:{' '}
                  <span className="font-mono font-black text-[#df1c2d]">
                    {previewAutoAffiliateInfo.effectiveMemberId}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Customer Full Name (ຊື່ ແລະ ນາມສະກຸນລູກຄ້າ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Phone / WhatsApp (+856 20) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+856 20 5588 9900"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Create Password for Log In (ຕັ້ງລະຫັດຜ່ານເຂົ້າສູ່ລະບົບ) *
                  </label>
                  <div className="relative">
                    <input
                      type={showCustomerLoginPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      placeholder="Create your login password"
                      className="w-full bg-amber-50/50 border-2 border-amber-400 rounded-xl px-3 pr-14 py-2 text-xs font-mono font-black text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCustomerLoginPassword(!showCustomerLoginPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-slate-200 hover:bg-slate-300 text-[10px] font-black text-slate-700 cursor-pointer"
                    >
                      {showCustomerLoginPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Party / Event Name (ຊື່ງານປາຕີ້) *
                  </label>
                  <input
                    type="text"
                    required
                    value={partyEventName}
                    onChange={(e) => setPartyEventName(e.target.value)}
                    placeholder="e.g. Birthday / Wedding / VIP Party"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Event Location (18 Provinces in Laos) *
                  </label>
                  <select
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer"
                  >
                    {!LAO_18_PROVINCES.includes(eventLocation) &&
                      eventLocation && (
                        <option value={eventLocation}>{eventLocation}</option>
                      )}
                    {LAO_18_PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 mb-1">
                    Special Requests / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Any special song or venue requests..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Clean Booking Summary & Submit Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#4a040c] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                <div className="space-y-0.5 text-xs">
                  <div className="text-amber-300 font-black">
                    Selected Singer: {selectedSinger?.stageName} • {selectedBookingDate} ({bookingTimeSlot})
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Location: {eventLocation} • Login ID:{' '}
                    <span className="font-mono font-bold text-emerald-300">
                      {previewAutoAffiliateInfo.effectiveMemberId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold uppercase text-amber-200">
                      Total Package Price
                    </div>
                    <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                      {formatLak(livePricingSummary.totalLak)}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0"
                  >
                    <QrCode className="w-4 h-4 stroke-[2.5]" />
                    <span>Confirm &amp; Book Party Set</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden legacy step-by-step sections */}
            {false && (
              <>
                {/* STEP 1: Booking singer Music Cain party set package — Start Singer price */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                        1/ Booking singer Music Cain party set package — Start Singer Price
                  </span>
                  <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>
                      Start Singer Price (Cheaper price • Medium Price • Expensive price)
                    </span>
                  </h5>
                </div>

                {/* Admin Price Controls: Selected Singer Price + Update Price + Add Package */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-600">
                    Selected Singer Price (LAK):
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={customSingerPriceLak}
                    onChange={(e) =>
                      setCustomSingerPriceLak(Number(e.target.value) || 0)
                    }
                    className="w-32 bg-white border-2 border-amber-400 rounded-xl px-2.5 py-1 text-xs font-mono font-black text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAdminQuickUpdateSelectedSingerPrice}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Save & Update Default Tier Price"
                  >
                    <Save className="w-3 h-3" />
                    <span>Update Price</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenAddCategoryForm('SINGER_PRICE_TIER')
                    }
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Price</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {singerPriceTierOptions.map((item) => {
                  const isSelected =
                    singerPriceTier === item.code || singerPriceTier === item.id;
                  const isEditingCard = editingPackageId === item.id;
                  const effectiveLak =
                    item.code === 'CHEAPER'
                      ? selectedSinger?.cheaperPriceLak || item.priceLak
                      : item.code === 'MEDIUM'
                      ? selectedSinger?.mediumPriceLak || item.priceLak
                      : item.code === 'EXPENSIVE'
                      ? selectedSinger?.expensivePriceLak || item.priceLak
                      : item.priceLak;
                  const cut10 = Math.round(effectiveLak * 0.1);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!isEditingCard) handleSelectSingerTierOpt(item);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/10 border-[#df1c2d] ring-2 ring-amber-400 shadow-md'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[9px] font-black uppercase">
                            {item.badge}
                          </span>
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                isEditingCard
                                  ? setEditingPackageId(null)
                                  : startEditPackageOption(item)
                              }
                              className="px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[9px] font-black flex items-center gap-0.5 cursor-pointer"
                              title="Admin Edit / Update Price"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                adminDeleteBookingPackageOption(item.id);
                                showBanner(`Deleted "${item.title}" package.`);
                              }}
                              className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Admin Delete Package"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#df1c2d]" />
                            )}
                          </div>
                        </div>

                        {isEditingCard ? (
                          <div
                            className="space-y-1.5 pt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editPkgTitle}
                              onChange={(e) => setEditPkgTitle(e.target.value)}
                              className="w-full bg-white border border-sky-400 rounded-lg px-2 py-1 text-xs font-black"
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              value={editPkgSubtitle}
                              onChange={(e) =>
                                setEditPkgSubtitle(e.target.value)
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-[10px]"
                              placeholder="Subtitle"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editPkgPriceLak}
                                onChange={(e) =>
                                  setEditPkgPriceLak(
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full bg-white border-2 border-emerald-500 rounded-lg px-2 py-1 text-xs font-mono font-black"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEditPackageOption(item)
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shrink-0 cursor-pointer"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-black text-slate-900">
                              {item.title}
                            </div>
                            <p className="text-[10px] text-slate-600 leading-snug">
                              {item.subtitle}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 w-full flex items-end justify-between gap-1">
                        <div>
                          <div className="text-sm sm:text-base font-black font-mono text-[#850818]">
                            {formatLak(effectiveLak)}
                          </div>
                          <div className="text-[9px] font-bold text-emerald-700 mt-0.5">
                            10% Saving for Loan: {formatLak(cut10)}
                          </div>
                        </div>
                        {!isEditingCard && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditPackageOption(item);
                            }}
                            className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[9px] font-black cursor-pointer"
                          >
                            Update Price
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Select Calendar Booking singer for party */}
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                    2/ Select Calendar Booking singer for party
                  </span>
                  <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>
                      Select Calendar Date • Select Singer • New Brand Set / Old Brand Set Package Price
                    </span>
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddCategoryForm('BRAND_SET_PACKAGE')}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add Brand Set Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column (5 cols): Interactive Party Booking Calendar */}
                <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#df1c2d]" />
                      <span>{calendarData.monthLabel}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonthOffset((prev) => prev - 1)
                        }
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarMonthOffset(0)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[9px] font-bold text-slate-700 cursor-pointer"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonthOffset((prev) => prev + 1)
                        }
                        className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Weekday Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black text-slate-400 uppercase">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (d) => (
                        <div key={d}>{d}</div>
                      )
                    )}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: calendarData.firstDayOfWeek }).map(
                      (_, idx) => (
                        <div key={`empty-${idx}`} className="h-8" />
                      )
                    )}
                    {calendarData.days.map((day) => {
                      const isSel = selectedBookingDate === day.dateStr;
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          onClick={() => setSelectedBookingDate(day.dateStr)}
                          className={`h-8 rounded-lg text-[11px] font-bold flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                            isSel
                              ? 'bg-[#df1c2d] text-white font-black shadow ring-2 ring-amber-400'
                              : day.bookingsCount > 0
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                          }`}
                        >
                          <span>{day.dayNum}</span>
                          {day.bookingsCount > 0 && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSel ? 'bg-amber-300' : 'bg-[#df1c2d]'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct Date & Time Slot Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        Selected Party Date
                      </label>
                      <input
                        type="date"
                        value={selectedBookingDate}
                        onChange={(e) => setSelectedBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        Party Time Slot
                      </label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-900"
                      >
                        <option value="18:00 - 22:00 (Evening Party Set)">
                          18:00 - 22:00 (Evening Party)
                        </option>
                        <option value="12:00 - 16:00 (Afternoon Matinee Set)">
                          12:00 - 16:00 (Afternoon Set)
                        </option>
                        <option value="20:00 - 24:00 (Late Night Concert Set)">
                          20:00 - 24:00 (Late Night Set)
                        </option>
                        <option value="Full Day Event & Gala Package">
                          Full Day Event & Gala
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 cols): Select Singer + New Brand Set / Old Brand Set Package Price */}
                <div className="lg:col-span-7 space-y-3.5 min-w-0">
                  {/* Select Singer — clean full-width dropdown with zero overflow */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-[#df1c2d]" />
                        <span>
                          Select Singer: ({singerProfiles.length} Registered Singers)
                        </span>
                      </label>
                      {selectedSinger && (
                        <button
                          type="button"
                          onClick={() => {
                            setSingerOverrideCheaperLak(
                              selectedSinger.cheaperPriceLak ||
                                singerBookingPricing.cheaperPriceLak
                            );
                            setSingerOverrideMediumLak(
                              selectedSinger.mediumPriceLak ||
                                singerBookingPricing.mediumPriceLak
                            );
                            setSingerOverrideExpensiveLak(
                              selectedSinger.expensivePriceLak ||
                                singerBookingPricing.expensivePriceLak
                            );
                            setShowEditSelectedSingerPrice(
                              !showEditSelectedSingerPrice
                            );
                          }}
                          className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>
                            Edit {selectedSinger.stageName} Custom Prices
                          </span>
                        </button>
                      )}
                    </div>

                    <select
                      value={selectedSingerId}
                      onChange={(e) => setSelectedSingerId(e.target.value)}
                      className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-black text-slate-900 truncate"
                    >
                      {singerProfiles.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.stageName} ({s.fullName} • {s.singerCode})
                        </option>
                      ))}
                    </select>

                    {/* Optional Per-Singer Admin Price Override Editor */}
                    {showEditSelectedSingerPrice && selectedSinger && (
                      <div className="p-3 rounded-xl bg-sky-50 border border-sky-300 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sky-950 text-[11px]">
                            Admin Update Custom Tier Prices for{' '}
                            {selectedSinger.stageName}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setShowEditSelectedSingerPrice(false)
                            }
                            className="text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">
                              Cheaper price (LAK)
                            </label>
                            <input
                              type="number"
                              value={singerOverrideCheaperLak}
                              onChange={(e) =>
                                setSingerOverrideCheaperLak(
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">
                              Medium Price (LAK)
                            </label>
                            <input
                              type="number"
                              value={singerOverrideMediumLak}
                              onChange={(e) =>
                                setSingerOverrideMediumLak(
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">
                              Expensive price (LAK)
                            </label>
                            <input
                              type="number"
                              value={singerOverrideExpensiveLak}
                              onChange={(e) =>
                                setSingerOverrideExpensiveLak(
                                  Number(e.target.value) || 0
                                )
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 font-mono font-bold text-xs"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateSingerProfile(selectedSinger.id, {
                              cheaperPriceLak: singerOverrideCheaperLak,
                              mediumPriceLak: singerOverrideMediumLak,
                              expensivePriceLak: singerOverrideExpensiveLak,
                            });
                            if (singerPriceTier === 'CHEAPER')
                              setCustomSingerPriceLak(singerOverrideCheaperLak);
                            else if (singerPriceTier === 'MEDIUM')
                              setCustomSingerPriceLak(singerOverrideMediumLak);
                            else if (singerPriceTier === 'EXPENSIVE')
                              setCustomSingerPriceLak(
                                singerOverrideExpensiveLak
                              );
                            setShowEditSelectedSingerPrice(false);
                            showBanner(
                              `Updated custom Singer Booking Prices for ${selectedSinger.stageName}!`
                            );
                          }}
                          className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] cursor-pointer"
                        >
                          Save {selectedSinger.stageName} Prices
                        </button>
                      </div>
                    )}

                    {/* Visual Singer Selector Strip (Filtered by Man / Woman) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {filteredSingersByGender.map((s) => {
                        const isSel = selectedSinger?.id === s.id;
                        const sGender = s.gender || 'MAN';
                        const startPrice =
                          s.startSingerPriceLak ||
                          s.cheaperPriceLak ||
                          singerBookingPricing.cheaperPriceLak;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSingerId(s.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                              isSel
                                ? 'bg-amber-50 border-[#df1c2d] ring-2 ring-amber-400 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <img
                              src={s.avatarUrl}
                              alt={s.stageName}
                              className="w-10 h-10 rounded-full object-cover border border-amber-400 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                                    sGender === 'WOMAN'
                                      ? 'bg-pink-600 text-white'
                                      : 'bg-sky-600 text-white'
                                  }`}
                                >
                                  {sGender}
                                </span>
                                <span className="text-[11px] font-black text-slate-900 truncate">
                                  {s.stageName}
                                </span>
                              </div>
                              <div className="text-[9px] text-slate-500 truncate">
                                {s.vocalStyle}
                              </div>
                              <div className="text-[9px] font-mono font-bold text-[#850818]">
                                Start Singer Price: {formatLak(startPrice)}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* New Brand Set package price vs Old Brand Set Package Price */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-amber-600" />
                        <span>
                          Brand Set Package Price (New Brand Set vs Old Brand Set)
                        </span>
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">
                          Brand Set Price (LAK):
                        </span>
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={customBrandSetPriceLak}
                          onChange={(e) =>
                            setCustomBrandSetPriceLak(
                              Number(e.target.value) || 0
                            )
                          }
                          className="w-28 bg-slate-50 border-2 border-amber-400 rounded-lg px-2 py-1 text-xs font-mono font-black text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleAdminQuickUpdateSelectedBrandSetPrice}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Update Price</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {brandSetPackageOptions.map((item) => {
                        const isSel =
                          brandSetPackageType === item.code ||
                          brandSetPackageType === item.id;
                        const isEditingCard = editingPackageId === item.id;
                        const effectivePrice =
                          item.code === 'NEW_BRAND_SET'
                            ? selectedSinger?.newBrandSetPriceLak ||
                              item.priceLak
                            : item.code === 'OLD_BRAND_SET'
                            ? selectedSinger?.oldBrandSetPriceLak ||
                              item.priceLak
                            : item.priceLak;

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (!isEditingCard) handleSelectBrandSetOpt(item);
                            }}
                            className={`p-3 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                              isSel
                                ? 'bg-amber-50 border-[#df1c2d] ring-2 ring-amber-400 shadow-xs'
                                : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                                  {item.badge}
                                </span>
                                <div
                                  className="flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      isEditingCard
                                        ? setEditingPackageId(null)
                                        : startEditPackageOption(item)
                                    }
                                    className="px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[9px] font-black flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Pencil className="w-2.5 h-2.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      adminDeleteBookingPackageOption(item.id);
                                      showBanner(`Deleted "${item.title}".`);
                                    }}
                                    className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  {isSel && (
                                    <CheckCircle2 className="w-4 h-4 text-[#df1c2d]" />
                                  )}
                                </div>
                              </div>

                              {isEditingCard ? (
                                <div
                                  className="space-y-1.5 pt-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="text"
                                    value={editPkgTitle}
                                    onChange={(e) =>
                                      setEditPkgTitle(e.target.value)
                                    }
                                    className="w-full bg-white border border-sky-400 rounded-lg px-2 py-1 text-xs font-black"
                                  />
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={editPkgPriceLak}
                                      onChange={(e) =>
                                        setEditPkgPriceLak(
                                          Number(e.target.value) || 0
                                        )
                                      }
                                      className="w-full bg-white border-2 border-emerald-500 rounded-lg px-2 py-1 text-xs font-mono font-black"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveEditPackageOption(item)
                                      }
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
                                    >
                                      Update
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                                    {item.title}
                                  </div>
                                  <p className="text-[10px] text-slate-600">
                                    {item.subtitle}
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                              <span className="text-sm font-black font-mono text-[#850818]">
                                {formatLak(effectivePrice)}
                              </span>
                              {!isEditingCard && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditPackageOption(item);
                                  }}
                                  className="px-2 py-0.5 rounded bg-white border border-slate-300 hover:bg-amber-100 text-[9px] font-black text-slate-800 cursor-pointer"
                                >
                                  Update Price
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Singer copies right own Music (Rock performance, Music performance, Traditional music) */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border-2 border-purple-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 block">
                    3/ Singer copies right own Music
                  </span>
                  <h5 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-purple-600" />
                    <span>
                      Singer copies right own Music (Rock performance • Music performance • Traditional music)
                    </span>
                  </h5>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-600">
                    Copyright Music Fee (LAK):
                  </span>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={customCopyrightPriceLak}
                    onChange={(e) =>
                      setCustomCopyrightPriceLak(Number(e.target.value) || 0)
                    }
                    className="w-28 bg-white border-2 border-purple-400 rounded-xl px-2.5 py-1 text-xs font-mono font-black text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAdminQuickUpdateSelectedCopyrightPrice}
                    className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>Update Price</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenAddCategoryForm('COPYRIGHT_OWN_MUSIC')
                    }
                    className="px-2.5 py-1 rounded-xl bg-purple-900 hover:bg-purple-800 text-amber-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add Music Style</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {copyrightMusicOptions.map((item) => {
                  const isSel =
                    copyrightMusicType === item.code ||
                    copyrightMusicType === item.id;
                  const isEditingCard = editingPackageId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!isEditingCard)
                          handleSelectCopyrightMusicOpt(item);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSel
                          ? 'bg-white border-purple-600 ring-2 ring-purple-400 shadow-md'
                          : 'bg-white/80 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded bg-purple-900 text-amber-300 text-[9px] font-black uppercase">
                            {item.badge}
                          </span>
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                isEditingCard
                                  ? setEditingPackageId(null)
                                  : startEditPackageOption(item)
                              }
                              className="px-1.5 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[9px] font-black flex items-center gap-0.5 cursor-pointer"
                            >
                              <Pencil className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                adminDeleteBookingPackageOption(item.id);
                                showBanner(`Deleted "${item.title}".`);
                              }}
                              className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            {isSel && (
                              <CheckCircle2 className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                        </div>

                        {isEditingCard ? (
                          <div
                            className="space-y-1.5 pt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              value={editPkgTitle}
                              onChange={(e) => setEditPkgTitle(e.target.value)}
                              className="w-full bg-white border border-sky-400 rounded-lg px-2 py-1 text-xs font-black"
                            />
                            <input
                              type="text"
                              value={editPkgSubtitle}
                              onChange={(e) =>
                                setEditPkgSubtitle(e.target.value)
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-[10px]"
                            />
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={editPkgPriceLak}
                                onChange={(e) =>
                                  setEditPkgPriceLak(
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full bg-white border-2 border-emerald-500 rounded-lg px-2 py-1 text-xs font-mono font-black"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEditPackageOption(item)
                                }
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black cursor-pointer"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-black text-slate-900">
                              {item.title}
                            </div>
                            <p className="text-[10px] text-slate-600 leading-snug">
                              {item.subtitle}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-black font-mono text-purple-900">
                          +{formatLak(item.priceLak)}
                        </span>
                        {!isEditingCard && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditPackageOption(item);
                            }}
                            className="px-2 py-0.5 rounded bg-purple-100 hover:bg-purple-200 text-purple-950 text-[9px] font-black cursor-pointer"
                          >
                            Update Price
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-purple-950 mb-1">
                  Singer Own Copyright Song Titles / Requested Setlist
                </label>
                <input
                  type="text"
                  value={ownMusicSongTitles}
                  onChange={(e) => setOwnMusicSongTitles(e.target.value)}
                  placeholder="Enter Singer's own copyright songs to perform at the party..."
                  className="w-full bg-white border border-purple-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* STEP 4: General Member Booking Singer -> Become Automatic Affiliate + 10% Cut to Loan Wallet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-50 border-2 border-emerald-300 space-y-3.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider">
                      4/ General Member Booking Singer → Become Automatic Affiliate
                    </span>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>
                        General Member / Host Details &amp; Automatic Affiliate Enrollment
                      </span>
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-black">
                    Instant Official Affiliate Upgrade
                  </span>
                </div>

                {/* General Member Selector Dropdown */}
                <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-950">
                    Select General Member (or Register New General Person as Automatic Affiliate)
                  </label>
                  <select
                    value={selectedCustomerMemberId}
                    onChange={(e) => handleSelectBookingMember(e.target.value)}
                    className="w-full bg-white border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-black text-slate-900"
                  >
                    <option value="NEW_GENERAL_MEMBER">
                      + New General Person / Customer (Auto-Create Member ID &amp; Become Automatic Affiliate)
                    </option>
                    {allMembers.map((m) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.name} ({m.memberId} • {m.phone}) —{' '}
                        {m.isAutomaticAffiliate
                          ? `Automatic Affiliate (${m.autoAffiliateCode})`
                          : m.membershipState === 'REGISTERED_UNPAID'
                          ? 'General Member (Unpaid → Auto-Upgrades to Affiliate)'
                          : 'General Member'}
                      </option>
                    ))}
                  </select>

                  {/* Live Automatic Affiliate Preview Box */}
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                          AUTOMATIC AFFILIATE CODE: {previewAutoAffiliateInfo.affCode}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800">
                          • Booking Singer automatically activates Lifetime Affiliate status!
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-600 truncate flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{previewAutoAffiliateInfo.affLink}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAffiliateLink(
                          previewAutoAffiliateInfo.affLink,
                          'PREVIEW_AFF'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedAffiliateRef === 'PREVIEW_AFF' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Affiliate Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      General Member / Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Member / Customer Phone (+856 20) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Party / Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={partyEventName}
                      onChange={(e) => setPartyEventName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Party / Event Location (18 Provinces in Laos) *
                    </label>
                    <select
                      required
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      {!LAO_18_PROVINCES.includes(eventLocation) &&
                        eventLocation && (
                          <option value={eventLocation}>{eventLocation}</option>
                        )}
                      {LAO_18_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Settlement Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target
                            .value as DmcSingerPartyBooking['paymentMethod']
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                    >
                      <option value="BCEL_ONE_QR">BCEL One Bank QR</option>
                      <option value="LAO_QR">Lao National QR</option>
                      <option value="BANK_TRANSFER">Corporate Bank Transfer</option>
                      <option value="CASH_SETTLEMENT">Studio Cash Settlement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Special Notes
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live 10% Loan Wallet Cut, 90% Singer Payout & Automatic Affiliate Activation */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-[#4a040c] to-slate-900 text-white border-2 border-amber-400/70 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                      Music Cain Party Set Summary
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                      General Member → Automatic Affiliate
                    </span>
                  </div>

                  <div className="space-y-1 text-xs pt-1">
                    <div className="flex justify-between text-slate-300">
                      <span>
                        Selected Singer ({selectedSinger?.stageName} •{' '}
                        {selectedSinger?.gender === 'WOMAN' ? 'WOMAN' : 'MAN'}):
                      </span>
                      <span className="font-mono font-bold text-amber-300">
                        {selectedSinger?.singerCode}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>
                        Start Singer Price ({livePricingSummary.sLabel}):
                      </span>
                      <span className="font-mono font-bold text-white">
                        {formatLak(livePricingSummary.sPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>
                        Package Party Price ({livePricingSummary.bLabel} +{' '}
                        {livePricingSummary.cLabel}):
                      </span>
                      <span className="font-mono font-bold text-emerald-300">
                        {formatLak(
                          livePricingSummary.bPrice + livePricingSummary.cPrice
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Booking Calendar Date &amp; Time:</span>
                      <span className="font-mono font-bold text-sky-300">
                        {selectedBookingDate} • {bookingTimeSlot}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-300">
                      Total Party Package Set Price:
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono text-amber-400">
                      {formatLak(livePricingSummary.totalLak)}
                    </span>
                  </div>

                  {/* 10% Saving for Loan + Automatic Affiliate Status Box */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 space-y-1">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-300">
                      <span>10% Saving for Loan:</span>
                      <span className="font-mono">
                        +{formatLak(livePricingSummary.loanWalletCut10Lak)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-200">
                      <span>
                        90% Net to Singer Wallet ({selectedSinger?.stageName}):
                      </span>
                      <span className="font-mono">
                        +{formatLak(livePricingSummary.singerNet90Lak)}
                      </span>
                    </div>
                    <div className="pt-1 border-t border-emerald-400/30 flex items-center justify-between text-[10px] font-black text-white">
                      <span>Member Automatic Affiliate Status:</span>
                      <span className="text-emerald-300 font-mono">
                        {previewAutoAffiliateInfo.affCode} (AUTO-ACTIVE)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      Book Singer &amp; Become Automatic Affiliate (10% Saving for Loan)
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickReportCurrentConfigToAdmin}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/40 font-black text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Report Package &amp; Price to Administrator Panel</span>
                  </button>
                </div>
              </div>
            </div>
              </>
            )}

            {/* Instant Post-Booking Automatic Affiliate Activated Certificate Card */}
            {lastActivatedAffiliateBooking && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white border-2 border-emerald-400 shadow-lg space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                      AUTOMATIC AFFILIATE ACTIVATED
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Booking {lastActivatedAffiliateBooking.bookingCode} • Member ID:{' '}
                      {lastActivatedAffiliateBooking.customerMemberId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lastActivatedAffiliateBooking.autoAffiliateLink && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyAffiliateLink(
                            lastActivatedAffiliateBooking.autoAffiliateLink!,
                            lastActivatedAffiliateBooking.id
                          )
                        }
                        className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Affiliate Link</span>
                      </button>
                    )}
                    {lastActivatedAffiliateBooking.customerMemberId && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSignInAsAutomaticAffiliate(
                            lastActivatedAffiliateBooking.customerMemberId
                          )
                        }
                        className="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Open Member Affiliate Dashboard</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-emerald-100">
                  Congratulations{' '}
                  <span className="font-black text-white">
                    {lastActivatedAffiliateBooking.customerName}
                  </span>
                  ! By booking Singer{' '}
                  <span className="font-black text-amber-300">
                    {lastActivatedAffiliateBooking.singerStageName}
                  </span>
                  , your account is now an{' '}
                  <span className="font-black text-emerald-300">
                    Official Automatic Affiliate ({lastActivatedAffiliateBooking.autoAffiliateCode})
                  </span>{' '}
                  with referral link:{' '}
                  <span className="font-mono underline text-amber-200">
                    {lastActivatedAffiliateBooking.autoAffiliateLink}
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ============================================================================
          SECTION 2A: ADMINISTRATOR — BOOKING SINGER PARTY SET (WHO IS BOOKING • DAILY REPORT)
         ============================================================================ */}
      {!isCustomerBookingModal &&
        (activeView === 'BOOKING_FORM' || activeView === 'ALL') && (
          <div className="rounded-3xl bg-white border-2 border-amber-400 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-[#69030e] to-slate-900 p-4 sm:p-5 text-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        ADMINISTRATOR DAILY BOOKING REPORT • WHO IS BOOKING
                      </span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                      {adminDailyBookingReportData.filteredBookings.length} Customer Booking(s)
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>
                      Booking Singer Party Set — Who Is Booking &amp; Daily Report (ລາຍງານປະຈຳວັນ ລູກຄ້າຜູ້ຈອງນັກຮ້ອງ ແລະ ຊຸດປາຕີ້)
                    </span>
                  </h4>
                  <p className="text-xs text-amber-100/90">
                    Administrator daily report of who is booking, Customer Member ID &amp; Phone, Booked Singer, Schedule Calendar Date &amp; Time, Package Price, and 10% Saving for Loan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const dateLabel =
                        adminDailyReportDateFilter === 'ALL'
                          ? 'All Dates'
                          : adminDailyReportDateFilter;
                      const rpt = submitReportToAdminPanel({
                        reportTitle: `Daily Booking Report (${dateLabel}) — ${adminDailyBookingReportData.filteredBookings.length} Customer Bookings`,
                        reportType: 'SINGER_BOOKING_REPORT',
                        totalPackagePriceLak:
                          adminDailyBookingReportData.totalPackagePriceLak,
                        loanWalletCut10PercentLak:
                          adminDailyBookingReportData.totalLoanSaving10Lak,
                        singerNetPayout90PercentLak:
                          adminDailyBookingReportData.totalSingerNetLak,
                        loanWalletBalanceSnapshotLak: loanWalletBalanceLak,
                        packageSummary:
                          adminDailyBookingReportData.filteredBookings
                            .map(
                              (b) =>
                                `${b.bookingDate}: Customer ${b.customerName} (${
                                  b.customerMemberId || 'DMC-LA-00303'
                                } • ${b.customerPhone}) booked ${
                                  b.singerStageName
                                } (${formatLak(b.totalPackagePriceLak)})`
                            )
                            .join(' | ') || 'No bookings on selected filter',
                        notes: `Official Daily Booking Report (${dateLabel}) logged in Administrator Panel.`,
                      });
                      showBanner(
                        `Daily Booking Report (${rpt.reportCode}) saved to Administrator Panel!`
                      );
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Daily Report to Admin Panel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportDailyBookingsCsv}
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Daily Report (CSV / Excel)</span>
                  </button>
                </div>
              </div>

              {/* 3 Daily Report KPI Summary Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
                <div className="p-3 rounded-2xl bg-white/10 border border-amber-400/40">
                  <span className="text-[10px] font-bold uppercase text-amber-200 block">
                    Who Is Booking (Customers)
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-white mt-0.5">
                    {adminDailyBookingReportData.filteredBookings.length} Booking(s)
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">
                    Date:{' '}
                    {adminDailyReportDateFilter === 'ALL'
                      ? `All Dates (${singerBookings.length} Total)`
                      : adminDailyReportDateFilter}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-400/40">
                  <span className="text-[10px] font-bold uppercase text-sky-200 block">
                    Daily Total Package Price
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-sky-300 mt-0.5">
                    {formatLak(adminDailyBookingReportData.totalPackagePriceLak)}
                  </div>
                  <span className="text-[10px] text-sky-200/80">
                    Gross Customer Party Set Amount
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40">
                  <span className="text-[10px] font-bold uppercase text-emerald-200 block">
                    Daily Party Wallet Net (-5%)
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-300 mt-0.5">
                    +{formatLak(adminDailyBookingReportData.totalPartyWalletNetLak)}
                  </div>
                  <span className="text-[10px] text-emerald-200/80">
                    Credited to DMC Party Wallet
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-slate-50 space-y-4">
              {/* Daily Report Filter Bar: Date Filter + Booked Singer Filter + Customer Search */}
              <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-300 shadow-2xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  {/* Daily Date Selector */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                      1. Daily Report Date Filter (ເລືອກວັນທີລາຍງານປະຈຳວັນ)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdminDailyReportDateFilter('ALL')}
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-black cursor-pointer shrink-0 border ${
                          adminDailyReportDateFilter === 'ALL'
                            ? 'bg-[#df1c2d] text-white border-[#df1c2d]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        All Dates ({singerBookings.length})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setAdminDailyReportDateFilter(
                            new Date().toISOString().split('T')[0]
                          )
                        }
                        className={`px-2.5 py-2 rounded-xl text-[11px] font-black cursor-pointer shrink-0 border ${
                          adminDailyReportDateFilter ===
                          new Date().toISOString().split('T')[0]
                            ? 'bg-amber-400 text-slate-950 border-amber-500'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        Today
                      </button>
                      <input
                        type="date"
                        value={
                          adminDailyReportDateFilter === 'ALL'
                            ? ''
                            : adminDailyReportDateFilter
                        }
                        onChange={(e) =>
                          setAdminDailyReportDateFilter(
                            e.target.value ? e.target.value : 'ALL'
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Filter by Singer */}
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                      2. Filter by Booked Singer (ເລືອກນັກຮ້ອງ)
                    </label>
                    <select
                      value={adminDailyReportSingerFilter}
                      onChange={(e) =>
                        setAdminDailyReportSingerFilter(e.target.value)
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="ALL">
                        All Singers ({singerProfiles.length} Singers)
                      </option>
                      {singerProfiles.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.stageName} ({s.singerCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Who Is Booking */}
                  <div className="sm:col-span-5">
                    <label className="block text-[10px] font-black uppercase text-slate-700 mb-1">
                      3. Search Who Is Booking (Customer Name, Member ID, Phone +856, Code)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={adminDailyReportSearch}
                        onChange={(e) =>
                          setAdminDailyReportSearch(e.target.value)
                        }
                        placeholder="Search Customer Name, Member ID (DMC-LA-...), Phone (+856), or Booking Code..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                      />
                      {(adminDailyReportDateFilter !== 'ALL' ||
                        adminDailyReportSingerFilter !== 'ALL' ||
                        adminDailyReportSearch.trim() !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminDailyReportDateFilter('ALL');
                            setAdminDailyReportSingerFilter('ALL');
                            setAdminDailyReportSearch('');
                          }}
                          className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-black shrink-0 cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Daily Date Pills Breakdown */}
                {adminDailyBookingReportData.uniqueDates.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-600 mr-1">
                      Daily Report Dates:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAdminDailyReportDateFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black cursor-pointer border ${
                        adminDailyReportDateFilter === 'ALL'
                          ? 'bg-slate-900 text-amber-300 border-slate-900'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      All Dates ({singerBookings.length} Bookings)
                    </button>
                    {adminDailyBookingReportData.uniqueDates.map((dItem) => (
                      <button
                        key={dItem.date}
                        type="button"
                        onClick={() =>
                          setAdminDailyReportDateFilter(dItem.date)
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black cursor-pointer border ${
                          adminDailyReportDateFilter === dItem.date
                            ? 'bg-[#df1c2d] text-white border-[#df1c2d] shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-slate-900 border-amber-300'
                        }`}
                      >
                        📅 {dItem.date} • {dItem.count} Booking(s) (
                        {formatLak(dItem.totalLak)})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Official Daily Booking Report Summary Table (Who Is Booking) */}
              <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <span className="text-xs sm:text-sm font-black">
                      Daily Report Table — Who Is Booking Singer Party Set (
                      {adminDailyBookingReportData.filteredBookings.length}{' '}
                      Records)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-300">
                    Total:{' '}
                    {formatLak(adminDailyBookingReportData.totalPackagePriceLak)}
                  </span>
                </div>

                {adminDailyBookingReportData.filteredBookings.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-bold">
                    No customer bookings found for the selected Daily Report filter. Click &quot;All Dates&quot; or &quot;Reset&quot; to view all customer bookings.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-700">
                          <th className="py-2.5 px-3"># / Booking Code</th>
                          <th className="py-2.5 px-3">Schedule Date &amp; Time</th>
                          <th className="py-2.5 px-3">
                            Who Is Booking (Customer Name, Member ID &amp; Phone)
                          </th>
                          <th className="py-2.5 px-3">
                            Booked Singer &amp; Event Location
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            Package Price (LAK)
                          </th>
                          <th className="py-2.5 px-3">Payment &amp; Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {adminDailyBookingReportData.filteredBookings.map(
                          (bk, idx) => {
                            const linkedMember = allMembers.find(
                              (m) => m.memberId === bk.customerMemberId
                            );
                            const isActiveMember =
                              linkedMember?.membershipState ===
                              'ACTIVE_LIFETIME_MEMBER';
                            return (
                              <tr
                                key={bk.id}
                                className="hover:bg-amber-50/50 transition-colors"
                              >
                                <td className="py-2.5 px-3 font-mono font-black text-slate-900 whitespace-nowrap">
                                  <div>
                                    {idx + 1}. {bk.bookingCode}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-normal">
                                    Booked:{' '}
                                    {new Date(bk.createdAt).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                                  <div className="font-black text-rose-700">
                                    📅 {bk.bookingDate}
                                  </div>
                                  <div className="text-[10px] text-slate-600 font-bold">
                                    {bk.bookingTimeSlot}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-black text-slate-900">
                                    {bk.customerName}
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-black">
                                      ID: {bk.customerMemberId || 'DMC-LA-00303'}
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-slate-700">
                                      {bk.customerPhone}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black">
                                      {isActiveMember
                                        ? 'ACTIVE MEMBER'
                                        : 'FREE ACTIVE'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="font-black text-slate-900">
                                    🎤 {bk.singerStageName} ({bk.singerCode})
                                  </div>
                                  <div className="text-[10px] text-slate-600 font-semibold">
                                    {bk.partyEventName} • {bk.eventLocation}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                                  {formatLak(bk.totalPackagePriceLak)}
                                </td>
                                <td className="py-2.5 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-black block w-fit">
                                    ✓ {bk.status}
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono block">
                                    {bk.paymentMethod}
                                  </span>
                                  {bk.customerMemberId && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const res =
                                          adminApproveCustomerToActiveMember(
                                            bk.customerMemberId!,
                                            'ADMINISTRATOR'
                                          );
                                        showBanner(res.message);
                                      }}
                                      className={`mt-1 px-2 py-0.5 rounded text-[9px] font-black cursor-pointer block ${
                                        linkedMember?.membershipState ===
                                          'ACTIVE_LIFETIME_MEMBER' &&
                                        linkedMember?.activePackagePaymentStatus ===
                                          'APPROVED'
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                                      }`}
                                    >
                                      {linkedMember?.membershipState ===
                                        'ACTIVE_LIFETIME_MEMBER' &&
                                      linkedMember?.activePackagePaymentStatus ===
                                        'APPROVED'
                                        ? '✓ Approved User Member'
                                        : '✓ Approve → User Member (1.6M)'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Administrator Approval Any Time: Customer Active Package (1,600,000 LAK) -> Become User Member */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-amber-50 border-2 border-amber-400 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                        Administrator Approval • Active Package (1,600,000 LAK)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                        Approve Customer → Become User Member Any Time
                      </span>
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-1">
                      Allow Administrator to Approve Any Customer to Become an Active User Member When They Pay Active Package (1,600,000 LAK) Any Time
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allMembers
                    .filter(
                      (m) =>
                        m.memberId === 'DMC-LA-00404' ||
                        m.isAutomaticAffiliate ||
                        m.membershipState === 'FREE_MEMBER' ||
                        m.activePackagePaymentStatus === 'PENDING_ADMIN_APPROVAL' ||
                        m.activePackagePaymentStatus === 'APPROVED'
                    )
                    .map((custMem) => {
                      const custBal = getMemberBalances(custMem.memberId);
                      const isApprovedUserMember =
                        custMem.membershipState === 'ACTIVE_LIFETIME_MEMBER' &&
                        custMem.activePackagePaymentStatus === 'APPROVED';
                      const isPendingApproval =
                        custMem.activePackagePaymentStatus ===
                        'PENDING_ADMIN_APPROVAL';
                      return (
                        <div
                          key={custMem.memberId}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs"
                        >
                          <div className="min-w-0">
                            <div className="font-black text-slate-900 truncate flex items-center gap-1.5 flex-wrap">
                              <span>{custMem.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[9px]">
                                {custMem.memberId}
                              </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                              Held: {formatLak(custBal.heldForQualification)} • Avail:{' '}
                              <span className="font-black text-emerald-700">
                                {formatLak(custBal.available)}
                              </span>
                            </div>
                            <div className="mt-1">
                              {isApprovedUserMember ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[9px] font-black uppercase">
                                  ✓ Approved User Member (Active Package 1.6M)
                                </span>
                              ) : isPendingApproval ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black uppercase">
                                  ⏳ Paid 1,600,000 LAK • Waiting Admin Approval
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-[9px] font-black uppercase">
                                  Customer ({custMem.membershipState})
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1">
                            {!isApprovedUserMember && !isPendingApproval && (
                              <button
                                type="button"
                                onClick={() => {
                                  const res = submitCustomerActivePackagePayment(
                                    custMem.memberId,
                                    {
                                      paymentMethod: 'LAO_QR',
                                      amountLak: 1600000,
                                    }
                                  );
                                  showBanner(res.message);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] cursor-pointer"
                              >
                                Pay Active Pkg (1.6M)
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const res = adminApproveCustomerToActiveMember(
                                  custMem.memberId,
                                  'ADMINISTRATOR'
                                );
                                showBanner(res.message);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>
                                {isApprovedUserMember
                                  ? 'Approved User Member'
                                  : 'Approve → User Member'}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Detailed Customer Booking Cards (Admin Check, Warn Singer on Calendar, Edit/Update Price, Delete) */}
              <div className="space-y-2.5">
                {adminDailyBookingReportData.filteredBookings.map((bk) => {
                  const isEditingBk = editingBookingId === bk.id;
                  const isAdminChecked =
                    adminVerifiedBookingIds[bk.id] !== undefined
                      ? adminVerifiedBookingIds[bk.id]
                      : true;
                  const linkedMember = allMembers.find(
                    (m) => m.memberId === bk.customerMemberId
                  );
                  const customerPw = linkedMember?.password || '123456';
                  return (
                    <div
                      key={bk.id}
                      className="p-3.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 shadow-xs space-y-2.5 text-xs transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {bk.singerAvatarUrl && (
                            <img
                              src={bk.singerAvatarUrl}
                              alt={bk.singerStageName}
                              className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shrink-0"
                            />
                          )}
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-black">
                                {bk.bookingCode}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-black">
                                WHO IS BOOKING: {bk.customerName} (ID:{' '}
                                {bk.customerMemberId || 'DMC-LA-00303'})
                              </span>
                              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-black">
                                🔔 SCHEDULE DATE: {bk.bookingDate} •{' '}
                                {bk.bookingTimeSlot}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-black">
                                Package Party:{' '}
                                {formatLak(bk.totalPackagePriceLak)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  isAdminChecked
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {isAdminChecked
                                  ? '✓ Admin Verified Booking'
                                  : 'Pending Admin Check'}
                              </span>
                            </div>

                            <div className="font-black text-slate-900 text-xs sm:text-sm">
                              {bk.partyEventName} — Booked Singer:{' '}
                              {bk.singerStageName} ({bk.singerCode})
                            </div>

                            {/* Administrator Inspection Breakdown: Who Is Booking */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px]">
                              <div>
                                <div className="font-black uppercase text-emerald-800">
                                  1. Who Is Booking (Customer):
                                </div>
                                <div className="font-bold text-slate-900">
                                  {bk.customerName} ({bk.customerPhone})
                                </div>
                                <div className="font-mono text-emerald-700 font-black">
                                  Member ID:{' '}
                                  {bk.customerMemberId || 'DMC-LA-00303'} | PW:{' '}
                                  {customerPw}
                                </div>
                              </div>
                              <div>
                                <div className="font-black uppercase text-rose-800">
                                  2. Booked Singer &amp; Schedule Calendar:
                                </div>
                                <div className="font-bold text-slate-900">
                                  Singer: {bk.singerStageName} ({bk.singerCode})
                                </div>
                                <div className="font-mono text-rose-700 font-black">
                                  🔔 Date: {bk.bookingDate} (
                                  {bk.bookingTimeSlot})
                                </div>
                              </div>
                              <div>
                                <div className="font-black uppercase text-indigo-800">
                                  3. Event Location &amp; Payment:
                                </div>
                                <div className="font-bold text-slate-900">
                                  Payment: {bk.paymentMethod} • Status:{' '}
                                  {bk.status}
                                </div>
                                <div className="text-slate-600 truncate">
                                  Location: {bk.eventLocation}
                                </div>
                              </div>
                            </div>

                            {/* Action Strip */}
                            <div className="pt-1 flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleWarnSingerByScheduleCalendar(
                                    bk.singerStageName,
                                    bk.singerCode,
                                    bk.bookingDate,
                                    bk.bookingTimeSlot,
                                    bk.customerName,
                                    bk.eventLocation
                                  )
                                }
                                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black cursor-pointer"
                              >
                                🔔 Notify Singer ({bk.singerStageName}) on
                                Calendar
                              </button>
                              {bk.customerMemberId && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSignInAsAutomaticAffiliate(
                                      bk.customerMemberId
                                    )
                                  }
                                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black cursor-pointer"
                                >
                                  Inspect Customer Account ({bk.customerMemberId}
                                  ) →
                                </button>
                              )}
                              {bk.customerMemberId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const res =
                                      adminApproveCustomerToActiveMember(
                                        bk.customerMemberId!,
                                        'ADMINISTRATOR'
                                      );
                                    showBanner(res.message);
                                  }}
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black cursor-pointer"
                                >
                                  ✓ Approve Customer → Become User Member (Active Package 1,600,000 LAK)
                                </button>
                              )}
                            </div>

                            {bk.paymentBillImageUrl && (
                              <div className="pt-1.5 flex items-center gap-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                                <img
                                  src={bk.paymentBillImageUrl}
                                  alt="Attached Bill Payment Receipt"
                                  className="w-14 h-10 object-cover rounded-lg border border-emerald-400 shrink-0 bg-white"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10px] font-black text-emerald-900 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>
                                      Customer Bill Payment Attached{' '}
                                      {bk.paymentBillRefNo
                                        ? `(${bk.paymentBillRefNo})`
                                        : ''}
                                    </span>
                                  </div>
                                  {bk.paymentBillFileName && (
                                    <div className="text-[9px] font-mono text-emerald-700 truncate">
                                      File: {bk.paymentBillFileName}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <div className="text-sm font-black font-mono text-slate-900">
                            Package Party: {formatLak(bk.totalPackagePriceLak)}
                          </div>
                          <div className="text-[10px] font-mono font-bold text-emerald-800">
                            DMC Party Wallet (-5%): +
                            {formatLak(
                              bk.dmcPartyWalletNetCreditLak !== undefined
                                ? bk.dmcPartyWalletNetCreditLak
                                : Math.round(bk.totalPackagePriceLak * 0.95)
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-end gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setAdminVerifiedBookingIds((prev) => ({
                                  ...prev,
                                  [bk.id]: !isAdminChecked,
                                }));
                                showBanner(
                                  `Administrator Checked Booking ${bk.bookingCode}: Customer ${bk.customerName} (${bk.customerMemberId}) booked Singer ${bk.singerStageName} on ${bk.bookingDate} (${bk.bookingTimeSlot}).`
                                );
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                isEditingBk
                                  ? setEditingBookingId(null)
                                  : startEditBooking(bk)
                              }
                              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit / Update Price</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleReportSingleBookingToAdmin(bk)
                              }
                              className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                            >
                              <Send className="w-3 h-3" />
                              <span>Report</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteSingerPartyBooking(bk.id);
                                showBanner(
                                  `Deleted booking ${bk.bookingCode}.`
                                );
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Inline Booking Edit & Price Update Form */}
                      {isEditingBk && (
                        <div className="p-3 rounded-xl bg-sky-50 border border-sky-300 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-sky-950">
                              Administrator Edit &amp; Update Booking Party Set (
                              {bk.bookingCode})
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingBookingId(null)}
                              className="text-slate-500 hover:text-slate-800 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">
                                Event Name
                              </label>
                              <input
                                type="text"
                                value={editBkPartyEventName}
                                onChange={(e) =>
                                  setEditBkPartyEventName(e.target.value)
                                }
                                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">
                                Customer / Host Name
                              </label>
                              <input
                                type="text"
                                value={editBkCustomerName}
                                onChange={(e) =>
                                  setEditBkCustomerName(e.target.value)
                                }
                                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">
                                Party / Event Location (18 Provinces)
                              </label>
                              <select
                                value={editBkEventLocation}
                                onChange={(e) =>
                                  setEditBkEventLocation(e.target.value)
                                }
                                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                              >
                                {!LAO_18_PROVINCES.includes(
                                  editBkEventLocation
                                ) &&
                                  editBkEventLocation && (
                                    <option value={editBkEventLocation}>
                                      {editBkEventLocation}
                                    </option>
                                  )}
                                {LAO_18_PROVINCES.map((prov) => (
                                  <option key={prov} value={prov}>
                                    {prov}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-slate-600">
                                Schedule Calendar Date
                              </label>
                              <input
                                type="date"
                                value={editBkDate}
                                onChange={(e) => setEditBkDate(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                            <div>
                              <label className="block text-[9px] font-black text-blue-800">
                                Selected Package Party Price (LAK)
                              </label>
                              <input
                                type="number"
                                value={editBkBrandSetPriceLak}
                                onChange={(e) => {
                                  setEditBkSingerPriceLak(0);
                                  setEditBkBrandSetPriceLak(
                                    Number(e.target.value) || 0
                                  );
                                }}
                                className="w-full bg-white border-2 border-blue-400 rounded-lg px-2 py-1 text-xs font-mono font-black"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black text-purple-800">
                                Extra Copyright Music (LAK)
                              </label>
                              <input
                                type="number"
                                value={editBkCopyrightPriceLak}
                                onChange={(e) =>
                                  setEditBkCopyrightPriceLak(
                                    Number(e.target.value) || 0
                                  )
                                }
                                className="w-full bg-white border-2 border-purple-400 rounded-lg px-2 py-1 text-xs font-mono font-black"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSaveBookingEdit(bk)}
                                className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Update Package Price</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      {/* ============================================================================
          SECTION 2B: CUSTOMER AUTOMATIC AFFILIATE MEMBER DASHBOARD (HIDDEN)
         ============================================================================ */}
      {false && activeView === 'CUSTOMER_AFFILIATE_DASHBOARD' && (
        <div className="rounded-3xl bg-white border-2 border-emerald-400 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 p-4 sm:p-5 text-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Customer Automatic Member &amp; Affiliate Dashboard
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black">
                    Wallet • Withdraw • Affiliate Commission
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>
                    Customer Automatic Affiliate Dashboard — Wallet, Withdraw &amp; Affiliate Commission When They Recommend
                  </span>
                </h4>
                <p className="text-xs text-emerald-100/90">
                  Every General Customer who books a Singer Party Package Set automatically becomes an Official Member &amp; Affiliate with their own Wallet, Withdraw, and Affiliate Commission center.
                </p>
              </div>

              {/* Select Active Customer Affiliate Member */}
              <div className="flex flex-wrap items-center gap-2 bg-black/40 p-2 rounded-2xl border border-emerald-400/40">
                <span className="text-[10px] font-black uppercase text-emerald-300">
                  Customer Affiliate Account:
                </span>
                <select
                  value={activeCustomerAffiliateMemberId}
                  onChange={(e) => {
                    const mId = e.target.value;
                    setSelectedCustomerMemberId(mId);
                    const found = allMembers.find((m) => m.memberId === mId);
                    if (found) {
                      setCustomerName(found.name);
                      setCustomerPhone(found.phone);
                      setCustWithdrawAccountName(found.name.toUpperCase());
                    }
                  }}
                  className="bg-slate-900 border border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-black text-white"
                >
                  {allMembers.map((m) => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId} •{' '}
                      {m.autoAffiliateCode || `AFF-${m.memberId}`})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsEditingCustomerProfile((prev) => !prev)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer shadow"
                >
                  <Pencil className="w-3 h-3" />
                  <span>
                    {isEditingCustomerProfile ? 'Close Edit' : 'Edit Customer Profile'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSignInAsAutomaticAffiliate(
                      activeCustomerAffiliateMemberId
                    )
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Sign In as Member</span>
                </button>
              </div>
            </div>

            {/* Inline Edit Customer Profile Form */}
            {isEditingCustomerProfile && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName =
                    editCustName.trim() ||
                    activeCustomerAffiliateMember?.name ||
                    'Customer Member';
                  const cleanPhone =
                    editCustPhone.trim() ||
                    activeCustomerAffiliateMember?.phone ||
                    '+856 20 5511 2233';
                  adminUpdateMember(activeCustomerAffiliateMemberId, {
                    name: cleanName,
                    phone: cleanPhone,
                    email: editCustEmail.trim(),
                    password: editCustPassword.trim() || '123456',
                    avatarUrl:
                      editCustAvatarUrl.trim() ||
                      activeCustomerAffiliateMember?.avatarUrl,
                    deliveryAddress: {
                      recipientName: cleanName,
                      phone: cleanPhone,
                      province:
                        editCustProvince.trim() ||
                        '1. Vientiane Capital (ນະຄອນຫຼວງວຽງຈັນ)',
                      district:
                        activeCustomerAffiliateMember?.deliveryAddress
                          ?.district || 'Chanthabouly',
                      village:
                        activeCustomerAffiliateMember?.deliveryAddress
                          ?.village || 'Dongdok Campus',
                      note:
                        activeCustomerAffiliateMember?.deliveryAddress?.note ||
                        '',
                    },
                    lastPasswordUpdatedAt: new Date().toISOString(),
                  });
                  setCustomerName(cleanName);
                  setCustomerPhone(cleanPhone);
                  setIsEditingCustomerProfile(false);
                  showBanner(
                    `Updated 3/ User Customer Profile for ${cleanName} (${activeCustomerAffiliateMemberId})!`
                  );
                }}
                className="mt-3 p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-400/70 space-y-3 text-xs animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Pencil className="w-4 h-4 text-emerald-400" />
                    <span className="font-black text-emerald-300">
                      Edit 3/ User Customer Profile ({activeCustomerAffiliateMemberId})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomerProfile(false)}
                    className="text-slate-400 hover:text-white text-[11px] font-bold cursor-pointer"
                  >
                    Cancel ✕
                  </button>
                </div>

                {/* Customer Profile Photo Upload & URL */}
                <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <img
                    src={
                      editCustAvatarUrl ||
                      activeCustomerAffiliateMember?.avatarUrl ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
                    }
                    alt={editCustName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
                  />
                  <div className="flex-1 min-w-[200px] space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-2.5 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[10px] flex items-center gap-1 cursor-pointer shadow">
                        <Upload className="w-3 h-3" />
                        <span>Upload Customer Photo</span>
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
                                setEditCustAvatarUrl(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Or paste image URL below
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editCustAvatarUrl}
                      onChange={(e) => setEditCustAvatarUrl(e.target.value)}
                      placeholder="https://... (Customer Profile Photo URL)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[10px] text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-300 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCustName}
                      onChange={(e) => setEditCustName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">
                      Phone Number (+856) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCustPhone}
                      onChange={(e) => setEditCustPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editCustEmail}
                      onChange={(e) => setEditCustEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-300 mb-1">
                      Province / Event Location
                    </label>
                    <select
                      value={editCustProvince}
                      onChange={(e) => setEditCustProvince(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs"
                    >
                      {!LAO_18_PROVINCES.includes(editCustProvince) &&
                        editCustProvince && (
                          <option value={editCustProvince}>
                            {editCustProvince}
                          </option>
                        )}
                      {LAO_18_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-300 mb-1">
                      Login Password / PIN *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCustPassword}
                      onChange={(e) => setEditCustPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-1.5 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomerProfile(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Customer Profile & Password</span>
                  </button>
                </div>
              </form>
            )}

            {/* Sub-navigation tabs: All | 1/ Wallet | 2/ Withdraw | 3/ Affiliate Commission */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/15">
              {(
                [
                  {
                    id: 'ALL',
                    label: 'All (Wallet • Withdraw • Affiliate Commission)',
                  },
                  { id: 'WALLET', label: '1/ Wallet' },
                  { id: 'WITHDRAW', label: '2/ Withdraw' },
                  {
                    id: 'AFFILIATE_COMMISSION',
                    label: '3/ Affiliate Commission (Recommend & Earn)',
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCustomerAffiliateTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                    customerAffiliateTab === tab.id
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'bg-white/10 text-emerald-100 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-5">
            {/* 1/ CUSTOMER WALLET SUMMARY CARDS */}
            {(customerAffiliateTab === 'ALL' ||
              customerAffiliateTab === 'WALLET') && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>
                      1/ Customer Affiliate Wallet —{' '}
                      {activeCustomerAffiliateMember?.name} (
                      {activeCustomerAffiliateMemberId})
                    </span>
                  </h5>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                    Affiliate Code:{' '}
                    {activeCustomerAffiliateMember?.autoAffiliateCode ||
                      `AFF-${activeCustomerAffiliateMemberId}`}
                  </span>
                </div>

                {/* UNIFIED FREE MEMBER ACTIVE LEVEL & 3-LEVEL USER MEMBER NETWORK COMMISSION CARD */}
                {(() => {
                  const chain = getSponsorChain(activeCustomerAffiliateMemberId);
                  const downlines = getDownlines(activeCustomerAffiliateMemberId);
                  const isSingerAccount = singerProfiles.some(
                    (s) =>
                      s.memberId?.toUpperCase() ===
                      activeCustomerAffiliateMemberId.toUpperCase()
                  );
                  return (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-emerald-950 to-indigo-950 text-white border-2 border-emerald-400/80 shadow-md space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                              FREE MEMBER ACTIVE LEVEL (ACTIVE_LIFETIME_MEMBER)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/50 text-amber-300 text-[10px] font-black">
                              {isSingerAccount
                                ? '2/ User Singer + 1/ User Member Network'
                                : '3/ Customer Booking + 1/ User Member Network'}
                            </span>
                          </div>
                          <h6 className="text-xs sm:text-sm font-black text-white mt-1">
                            Same 3-Level User Member Network Commission When Activated to Member (L1: 400,000 • L2: 200,000 • L3: 100,000 LAK)
                          </h6>
                          <p className="text-[11px] text-emerald-100/90">
                            Both Registered Singers and Booking Customers have the exact same Free Member Active level and earn the exact same L1 (50%), L2 (30%), and L3 (20%) User Member Network Commission when they or their network activate to Member.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const res = triggerUserMemberNetworkActivationCommission(
                              activeCustomerAffiliateMemberId,
                              activeCustomerAffiliateMember?.name,
                              'Customer / Singer Free Member Active Network Activation'
                            );
                            showBanner('SUCCESS', res.message);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>
                            ⚡ Activate to Member & Get L1/L2/L3 Network Commission (+400,000 LAK)
                          </span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-white/10 border border-emerald-400/40">
                          <div className="text-[10px] font-black uppercase text-emerald-300">
                            L1 Direct Network (50% • +400,000 LAK)
                          </div>
                          <div className="font-black text-white mt-0.5">
                            Upline L1:{' '}
                            {chain.l1
                              ? `${chain.l1.name} (${chain.l1.memberId})`
                              : 'DMC Root (DMC-LA-00001)'}
                          </div>
                          <div className="text-[11px] text-emerald-200 mt-0.5">
                            My L1 Direct Downlines: <span className="font-black">{downlines.l1.length} Members</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/10 border border-amber-400/40">
                          <div className="text-[10px] font-black uppercase text-amber-300">
                            L2 Tier-2 Network (30% • +200,000 LAK)
                          </div>
                          <div className="font-black text-white mt-0.5">
                            Upline L2:{' '}
                            {chain.l2
                              ? `${chain.l2.name} (${chain.l2.memberId})`
                              : 'DMC Tier-2 Sponsor'}
                          </div>
                          <div className="text-[11px] text-amber-200 mt-0.5">
                            My L2 Downlines: <span className="font-black">{downlines.l2.length} Members</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/10 border border-sky-400/40">
                          <div className="text-[10px] font-black uppercase text-sky-300">
                            L3 Tier-3 Network (20% • +100,000 LAK)
                          </div>
                          <div className="font-black text-white mt-0.5">
                            Upline L3:{' '}
                            {chain.l3
                              ? `${chain.l3.name} (${chain.l3.memberId})`
                              : 'DMC Tier-3 Sponsor'}
                          </div>
                          <div className="text-[11px] text-sky-200 mt-0.5">
                            My L3 Downlines: <span className="font-black">{downlines.l3.length} Members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 5-BALANCE ACCOUNT CARDS (Same as User Member: Pending Balance, Held for Qualification, Available for Payout, Held for In-Flight Withdrawal, Recovery Due) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Account 1: PENDING */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Pending Balance
                      </span>
                      <Clock className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-slate-200">
                      {formatLak(customerAffiliateBalances.pending)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Uncleared awards awaiting order settlement.
                    </p>
                  </div>

                  {/* Account 2: HELD_FOR_QUALIFICATION */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                        Held for Qualification
                      </span>
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-amber-300">
                      {formatLak(customerAffiliateBalances.heldForQualification)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Safeguarded toward 1,600,000 LAK qualification.
                    </p>
                  </div>

                  {/* Account 3: AVAILABLE */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                        Available for Payout
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-emerald-300">
                      {formatLak(customerAffiliateBalances.available)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Cleared and ready for withdrawal payout.
                    </p>
                  </div>

                  {/* Account 4: HELD_FOR_WITHDRAWAL */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Held for In-Flight Withdrawal
                      </span>
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-slate-300">
                      {formatLak(
                        Math.max(
                          customerAffiliateBalances.heldForWithdrawal,
                          totalCustomerPendingWithdrawalLak
                        )
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Locked for pending bank withdrawal requests.
                    </p>
                  </div>

                  {/* Account 5: RECOVERY_DUE */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Recovery Due
                      </span>
                      <AlertTriangle className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-slate-300">
                      {formatLak(customerAffiliateBalances.recoveryDue)}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Outstanding clawback or reversal recovery balance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2/ CUSTOMER WITHDRAW & 3/ AFFILIATE COMMISSION (RECOMMEND & EARN) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* 2/ WITHDRAW PANEL */}
              {(customerAffiliateTab === 'ALL' ||
                customerAffiliateTab === 'WITHDRAW') && (
                <div
                  className={`${
                    customerAffiliateTab === 'WITHDRAW'
                      ? 'lg:col-span-12'
                      : 'lg:col-span-5'
                  } p-4 rounded-2xl bg-slate-50 border-2 border-emerald-300 space-y-3 text-xs`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                      <span>2/ Customer Wallet Withdraw</span>
                    </h5>
                    <span className="font-mono text-[11px] font-black text-emerald-700">
                      Available for Payout: {formatLak(customerAffiliateBalances.available)}
                    </span>
                  </div>

                  <form
                    onSubmit={handleCustomerAffiliateWithdrawSubmit}
                    className="space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-black uppercase text-slate-700">
                          Withdraw Amount (LAK) *
                        </label>
                        <div className="flex items-center gap-1">
                          {[200000, 400000].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setCustWithdrawAmountLak(amt)}
                              className="px-1.5 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[9px] font-black cursor-pointer"
                            >
                              {formatNumberWithCommas(amt)}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setCustWithdrawAmountLak(
                                Math.max(
                                  0,
                                  customerAffiliateBalances.available
                                )
                              )
                            }
                            className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black cursor-pointer"
                          >
                            100% Max
                          </button>
                        </div>
                      </div>
                      <input
                        type="number"
                        min={10000}
                        step="any"
                        required
                        value={custWithdrawAmountLak}
                        onChange={(e) =>
                          setCustWithdrawAmountLak(Number(e.target.value) || 0)
                        }
                        className="w-full bg-white border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-black text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        Select Lao Bank for Payout *
                      </label>
                      <select
                        value={custWithdrawBankName}
                        onChange={(e) =>
                          setCustWithdrawBankName(e.target.value)
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
                      >
                        {laoBanks.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.code} — {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Bank Account Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={custWithdrawAccountNumber}
                          onChange={(e) =>
                            setCustWithdrawAccountNumber(e.target.value)
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={custWithdrawAccountName}
                          onChange={(e) =>
                            setCustWithdrawAccountName(
                              e.target.value.toUpperCase()
                            )
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold uppercase text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>
                        Request Withdraw {formatLak(custWithdrawAmountLak)} (Wait Administrator Approved)
                      </span>
                    </button>
                  </form>

                  {/* Customer Withdrawal History & Administrator Approval Controls */}
                  {customerAffiliateWithdrawals.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase text-slate-600">
                          Customer Withdrawal Requests &amp; History (
                          {customerAffiliateWithdrawals.length})
                        </div>
                        <span className="text-[9px] font-black text-amber-800">
                          Admin Approval Queue
                        </span>
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {customerAffiliateWithdrawals.map((w) => {
                          const isWaitingAdmin =
                            w.status === 'ADMIN_REVIEW' ||
                            w.status === 'APPROVED' ||
                            w.status === 'OTP_PENDING';
                          return (
                            <div
                              key={w.id}
                              className={`p-2.5 rounded-xl border space-y-2 text-[11px] ${
                                isWaitingAdmin
                                  ? 'bg-amber-50/90 border-amber-400'
                                  : w.status === 'PAID'
                                  ? 'bg-white border-emerald-300'
                                  : 'bg-red-50/60 border-red-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-black text-slate-900 flex items-center gap-1.5 flex-wrap">
                                    <span>{w.id}</span>
                                    <span>•</span>
                                    <span>{w.bankName}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-600">
                                    Acc: {w.accountNumber} ({w.accountName})
                                  </div>
                                  <div className="text-[9px] text-slate-500">
                                    Requested: {new Date(w.requestedAt).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-mono font-black text-slate-900">
                                    {formatLak(w.amountLak)}
                                  </div>
                                  <div className="text-[9px] font-mono text-emerald-700 font-bold">
                                    Net: {formatLak(w.netPayoutLak)}
                                  </div>
                                  <span
                                    className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                      isWaitingAdmin
                                        ? 'bg-amber-400 text-slate-950'
                                        : w.status === 'PAID'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {isWaitingAdmin
                                      ? '⏳ WAITING ADMINISTRATOR APPROVED'
                                      : w.status === 'PAID'
                                      ? '✓ ADMINISTRATOR APPROVED • PAID'
                                      : `✕ ${w.status}`}
                                  </span>
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
                                            w.id,
                                            'SUPER-ADMIN-01'
                                          );
                                        showBanner(
                                          res.message,
                                          res.success ? 'SUCCESS' : 'ERROR'
                                        );
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
                                          w.id,
                                          'Rejected by Administrator — Refunded to Wallet'
                                        );
                                        showBanner(
                                          `Withdrawal ${w.id} rejected by Administrator and refunded to Available Wallet.`,
                                          'ERROR'
                                        );
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

              {/* 3/ AFFILIATE COMMISSION PANEL (WHEN CUSTOMER RECOMMENDS) */}
              {(customerAffiliateTab === 'ALL' ||
                customerAffiliateTab === 'AFFILIATE_COMMISSION') && (
                <div
                  className={`${
                    customerAffiliateTab === 'AFFILIATE_COMMISSION'
                      ? 'lg:col-span-12'
                      : 'lg:col-span-7'
                  } p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3 text-xs`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-[#df1c2d] text-white text-[9px] font-black uppercase">
                        3/ Affiliate Commission — Recommend &amp; Earn
                      </span>
                      <h5 className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                        Customer Automatic Affiliate Commission When They Recommend
                      </h5>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAffiliateLink(
                          activeCustomerAffiliateMember?.autoAffiliateLink ||
                            `https://dmcxayraxa.music/register?ref=${activeCustomerAffiliateMemberId}&aff=AFF-${activeCustomerAffiliateMemberId}`,
                          'CUST_DASH_AFF'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                    >
                      {copiedAffiliateRef === 'CUST_DASH_AFF' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Copied Referral Link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Customer Referral Link (dmcxayraxa.music)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Personal Referral Link Display */}
                  <div className="p-2.5 rounded-xl bg-white border border-amber-300 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono text-slate-700 truncate">
                      {activeCustomerAffiliateMember?.autoAffiliateLink ||
                        `https://dmcxayraxa.music/register?ref=${activeCustomerAffiliateMemberId}&aff=AFF-${activeCustomerAffiliateMemberId}&singer=${
                          selectedSinger?.singerCode || 'DMC-SNG-001'
                        }`}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[9px] font-black shrink-0">
                      dmcxayraxa.music • AUTO-AFFILIATE
                    </span>
                  </div>

                  {/* Recommend to Friend / Customer Input */}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-700">
                      Recommended Friend / Customer Name:
                    </label>
                    <input
                      type="text"
                      value={custRecommendBuyerName}
                      onChange={(e) =>
                        setCustRecommendBuyerName(e.target.value)
                      }
                      placeholder="Enter recommended customer name..."
                      className="flex-1 min-w-[180px] bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  {/* 4 Recommend & Earn Affiliate Commission Channels (New User • New Customer • New Member • Buy Products) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        title: 'New User Account Registration Referral',
                        orderLak: 200000,
                        commissionLak: 200000,
                        badge: '1. RECOMMEND NEW USER',
                        buttonLabel: 'Recommend New User',
                      },
                      {
                        title: `New Customer Singer Party Booking (${
                          selectedSinger?.stageName || 'DMC Singer'
                        })`,
                        orderLak: livePricingSummary.totalLak || 25000000,
                        commissionLak: Math.max(
                          500000,
                          Math.round(
                            (livePricingSummary.totalLak || 25000000) * 0.05
                          )
                        ),
                        badge: '2. RECOMMEND NEW CUSTOMER (5%)',
                        buttonLabel: 'Recommend New Customer',
                      },
                      {
                        title:
                          'New Member Activation (Studio Song Production Package)',
                        orderLak: 1600000,
                        commissionLak: 400000,
                        badge: '3. RECOMMEND NEW MEMBER',
                        buttonLabel: 'Recommend New Member',
                      },
                    ].map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-white border border-amber-200 flex flex-col justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[8px] font-black uppercase">
                            {rec.badge}
                          </span>
                          <div className="text-xs font-black text-slate-900 leading-snug">
                            {rec.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Order Value: {formatLak(rec.orderLak)}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-600">
                              Wallet Credit (Withdrawable):
                            </span>
                            <span className="font-mono font-black text-emerald-700 text-xs">
                              +{formatLak(rec.commissionLak)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCustomerRecommendEarn(
                                rec.title,
                                rec.orderLak,
                                rec.commissionLak
                              )
                            }
                            className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>
                              {rec.buttonLabel} (+{formatLak(rec.commissionLak)})
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* 4. Recommend Buy Products from System */}
                    <div className="p-3 rounded-2xl bg-white border-2 border-emerald-300 flex flex-col justify-between gap-2 shadow-2xs">
                      <div className="space-y-1.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[8px] font-black uppercase">
                          4. RECOMMEND BUY PRODUCTS FROM SYSTEM
                        </span>
                        <div className="text-xs font-black text-slate-900 leading-snug">
                          Recommend System Products &amp; Withdraw Commission
                        </div>
                        <select
                          value={selectedRecommendProductSku}
                          onChange={(e) =>
                            setSelectedRecommendProductSku(e.target.value)
                          }
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1 text-[11px] font-bold text-slate-900"
                        >
                          {products.map((prod) => (
                            <option key={prod.sku} value={prod.sku}>
                              {prod.title} — {formatLak(prod.priceLak)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-600">
                            Wallet Credit (Withdrawable):
                          </span>
                          <span className="font-mono font-black text-emerald-700 text-xs">
                            +
                            {formatLak(
                              selectedRecommendProduct?.sku ===
                                'MUSIC_SINGLE_1600'
                                ? 400000
                                : 225000
                            )}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const prodTitle =
                              selectedRecommendProduct?.title ||
                              'DMC System Product';
                            const prodPrice =
                              selectedRecommendProduct?.priceLak || 4200000;
                            const prodComm =
                              selectedRecommendProduct?.sku ===
                              'MUSIC_SINGLE_1600'
                                ? 400000
                                : 225000;
                            handleCustomerRecommendEarn(
                              `Product Purchase Referral: ${prodTitle}`,
                              prodPrice,
                              prodComm
                            );
                          }}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>
                            Recommend Buy Product (+
                            {formatLak(
                              selectedRecommendProduct?.sku ===
                                'MUSIC_SINGLE_1600'
                                ? 400000
                                : 225000
                            )}
                            )
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Customer Affiliate Commission Ledger */}
                  <div className="pt-2 border-t border-amber-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-700">
                        Customer Affiliate Commission Ledger (
                        {customerAffiliateLedger.length} Entries)
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-800">
                        Available Wallet:{' '}
                        {formatLak(customerAffiliateBalances.available)}
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {customerAffiliateLedger.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-[11px]"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 truncate">
                              {entry.description}
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono">
                              {entry.txRef} •{' '}
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div
                            className={`font-mono font-black shrink-0 ${
                              entry.credit > 0
                                ? 'text-emerald-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {entry.credit > 0
                              ? `+${formatLak(entry.credit)}`
                              : `-${formatLak(entry.debit)}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          SECTION 3: REPORT TO ADMINISTRATOR PANEL
          (Shown on its dedicated tab — keeps All View compact without long scroll)
         ============================================================================ */}
      {activeView === 'ADMIN_REPORTS' && (
        <div className="rounded-3xl bg-white border-2 border-purple-300 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  Report to Administrator Panel
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black">
                  {adminPanelBookingReports.length} Official Reports Logged
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-amber-400" />
                <span>
                  Report to Administrator Panel — Singer Bookings, Package Prices & 10% Saving for Loan
                </span>
              </h4>
              <p className="text-xs text-purple-200/90">
                Submit, Edit, Update Price, Delete, or Export official Singer Party Set & DMC Party Wallet Balance reports in the Administrator Panel
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportAdminReportsCsv}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Report (CSV / Excel)</span>
              </button>
              {onOpenAdminPanel && (
                <button
                  type="button"
                  onClick={handleGoToAdministratorPanel}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Administrator Panel</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Pending Wallet & Affiliate Commission Withdrawals — Waiting Administrator Approval */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    Administrator Withdrawal Approvals ({pendingAdminApprovalWithdrawals.length} Waiting)
                  </span>
                  <h5 className="font-black text-slate-900 text-xs sm:text-sm">
                    Wallet • Withdraw • Affiliate Commission — Waiting Administrator Approved
                  </h5>
                </div>
                <span className="text-[10px] font-bold text-amber-900">
                  Every withdrawal request waits here for Administrator approval
                </span>
              </div>

              {pendingAdminApprovalWithdrawals.length === 0 ? (
                <div className="p-3 rounded-xl bg-white/80 border border-amber-200 text-[11px] text-slate-600 font-semibold">
                  No pending withdrawal requests waiting for Administrator approval right now.
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingAdminApprovalWithdrawals.map((w) => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl bg-white border-2 border-amber-300 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-black text-slate-900 flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px]">
                            {w.id}
                          </span>
                          <span>Member / Singer: {w.memberId}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black">
                            ⏳ WAITING ADMINISTRATOR APPROVED
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          Bank: {w.bankName} • Acc: {w.accountNumber} ({w.accountName})
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Requested: {new Date(w.requestedAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-right mr-2">
                          <div className="font-mono font-black text-sm text-slate-900">
                            {formatLak(w.amountLak)}
                          </div>
                          <div className="text-[10px] font-mono font-bold text-emerald-700">
                            Net Payout: {formatLak(w.netPayoutLak)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const res = adminApproveWithdrawalRequest(
                              w.id,
                              'SUPER-ADMIN-01'
                            );
                            showBanner(
                              res.message,
                              res.success ? 'SUCCESS' : 'ERROR'
                            );
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Administrator Approve &amp; Pay</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            rejectWithdrawal(
                              w.id,
                              'Rejected by Administrator — Refunded to Wallet'
                            );
                            showBanner(
                              `Rejected withdrawal ${w.id} and refunded ${formatLak(w.amountLak)} to Available Wallet.`,
                              'ERROR'
                            );
                          }}
                          className="px-2.5 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-black text-xs cursor-pointer"
                        >
                          Reject &amp; Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit New Report to Administrator Panel Form */}
            <form
              onSubmit={handleCreateCustomAdminReport}
              className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-purple-700" />
                  <span>
                    Create & Send Report to Administrator Panel
                  </span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800">
                  Auto 10% Saving for Loan: {formatLak(Math.round(newReportTotalLak * 0.1))} • 90% Singer Net: {formatLak(Math.round(newReportTotalLak * 0.9))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReportTitle}
                    onChange={(e) => setNewReportTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Report Category
                  </label>
                  <select
                    value={newReportType}
                    onChange={(e) =>
                      setNewReportType(
                        e.target
                          .value as DmcAdminPanelBookingReport['reportType']
                      )
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold"
                  >
                    <option value="FULL_SUMMARY_REPORT">
                      Full Summary Report
                    </option>
                    <option value="SINGER_BOOKING_REPORT">
                      Singer Party Booking Report
                    </option>
                    <option value="PACKAGE_PRICE_UPDATE_REPORT">
                      Package Price Update Report
                    </option>
                    <option value="LOAN_WALLET_10_PERCENT_REPORT">
                      DMC Party Wallet & 10% Saving for Loan Report
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-purple-900 mb-1">
                    Total Package Price (LAK)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={newReportTotalLak}
                    onChange={(e) =>
                      setNewReportTotalLak(Number(e.target.value) || 0)
                    }
                    className="w-full bg-white border-2 border-purple-400 rounded-xl px-3 py-1.5 text-xs font-mono font-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Report Notes / Summary for Administrator
                  </label>
                  <input
                    type="text"
                    value={newReportNotes}
                    onChange={(e) => setNewReportNotes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Report to Admin Panel</span>
                </button>
              </div>
            </form>

            {/* List of Reports in Administrator Panel */}
            <div className="space-y-2.5">
              {adminPanelBookingReports.map((rpt) => {
                const isEditingRpt = editingReportId === rpt.id;
                return (
                  <div
                    key={rpt.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] font-black">
                            {rpt.reportCode}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 text-[9px] font-black uppercase">
                            {rpt.reportType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              rpt.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {rpt.status}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(rpt.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="font-black text-slate-900 text-xs sm:text-sm">
                          {rpt.reportTitle}
                        </div>
                        <div className="text-[11px] text-slate-700 font-medium">
                          {rpt.packageSummary}
                        </div>
                        {rpt.notes && (
                          <div className="text-[10px] text-slate-500">
                            Note: {rpt.notes}
                          </div>
                        )}
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <div className="text-sm font-black font-mono text-slate-900">
                          Total: {formatLak(rpt.totalPackagePriceLak)}
                        </div>
                        <div className="text-[10px] font-mono font-black text-emerald-700">
                          10% Saving for Loan: +{formatLak(rpt.loanWalletCut10PercentLak)}
                        </div>
                        <div className="flex items-center justify-end gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingRpt) {
                                setEditingReportId(null);
                              } else {
                                setEditingReportId(rpt.id);
                                setEditReportTitle(rpt.reportTitle);
                                setEditReportTotalLak(rpt.totalPackagePriceLak);
                                setEditReportNotes(rpt.notes || '');
                                setEditReportStatus(rpt.status);
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit / Update Price</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateAdminPanelBookingReport(rpt.id, {
                                status:
                                  rpt.status === 'APPROVED'
                                    ? 'SENT_TO_ADMIN_PANEL'
                                    : 'APPROVED',
                              });
                              showBanner(
                                `Updated status for report ${rpt.reportCode}!`
                              );
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[10px] font-black cursor-pointer"
                          >
                            {rpt.status === 'APPROVED' ? 'Approved' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteAdminPanelBookingReport(rpt.id);
                              showBanner(`Deleted report ${rpt.reportCode}.`);
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {isEditingRpt && (
                      <div className="p-3 rounded-xl bg-white border border-sky-300 grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                        <div className="sm:col-span-2">
                          <label className="block text-[9px] font-bold text-slate-600">
                            Report Title
                          </label>
                          <input
                            type="text"
                            value={editReportTitle}
                            onChange={(e) => setEditReportTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black text-emerald-800">
                            Update Total Price (LAK)
                          </label>
                          <input
                            type="number"
                            value={editReportTotalLak}
                            onChange={(e) =>
                              setEditReportTotalLak(Number(e.target.value) || 0)
                            }
                            className="w-full bg-slate-50 border-2 border-emerald-400 rounded-lg px-2 py-1 text-xs font-mono font-black"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              updateAdminPanelBookingReport(rpt.id, {
                                reportTitle:
                                  editReportTitle.trim() || rpt.reportTitle,
                                totalPackagePriceLak: editReportTotalLak,
                                notes: editReportNotes,
                                status: editReportStatus,
                              });
                              setEditingReportId(null);
                              showBanner(
                                `Updated report ${rpt.reportCode} price & details!`
                              );
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer"
                          >
                            Update Report
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingReportId(null)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          BOOKING SINGER PARTY SET — QR CODE PAYMENT MODAL
      ========================================================================== */}
      {showBookingQrPaymentModal && selectedSinger && (
        <div
          className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setShowBookingQrPaymentModal(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-[#3b0710] to-slate-950 border-2 border-amber-400 text-white shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#df1c2d] via-red-700 to-amber-600 flex items-center justify-between gap-3 border-b border-amber-300/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
                  <QrCode className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-300 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                    INSTANT QR CODE SETTLEMENT
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                    Payment by QR Code — Booking Singer Party Set
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBookingQrPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              {/* Payment Method Header: BCEL One QR Code */}
              <div className="w-full py-2.5 px-3 rounded-xl border-2 bg-[#df1c2d] border-amber-300 text-white shadow-md text-xs font-black flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>BCEL One QR Code</span>
              </div>

              {/* QR Code Card + Booking Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Left: Scannable QR Code Display */}
                <div className="sm:col-span-5 flex flex-col items-center">
                  <div className="p-3.5 rounded-2xl bg-white text-slate-950 border-4 border-amber-400 shadow-xl flex flex-col items-center w-full max-w-[230px]">
                    <div className="w-full flex items-center justify-between px-1 pb-2 mb-2 border-b border-slate-200">
                      <span className="text-[10px] font-black uppercase text-[#df1c2d]">
                        BCEL ONE PAY QR
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black">
                        LAK
                      </span>
                    </div>

                    {selectedSinger.bankAccount?.customQrImageUrl ? (
                      <img
                        src={selectedSinger.bankAccount.customQrImageUrl}
                        alt="Booking Payment QR Code"
                        className="w-44 h-44 object-contain rounded-lg border border-slate-200"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                          `DMC-BOOKING|SINGER:${selectedSinger.singerCode}|STAGE:${selectedSinger.stageName}|START:${livePricingSummary.sPrice}|PARTY:${livePricingSummary.bPrice + livePricingSummary.cPrice}|TOTAL:${livePricingSummary.totalLak}|DATE:${selectedBookingDate}|ACC:${activeCorporateBank.accountNumber}`
                        )}`}
                        alt="BCEL One / Lao QR Code"
                        className="w-44 h-44 object-contain rounded-lg border border-slate-200"
                      />
                    )}

                    <div className="mt-2 text-center">
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        Scan to Pay Total Amount
                      </div>
                      <div className="text-sm font-black font-mono text-[#df1c2d]">
                        {formatLak(livePricingSummary.totalLak)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Clean Customer Booking & Bank Account Breakdown */}
                <div className="sm:col-span-7 space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-black/45 border border-white/15 space-y-1.5">
                    <div className="text-[10px] font-black uppercase text-amber-300">
                      Booking Summary
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Singer:</span>
                      <span className="font-black text-white">
                        {selectedSinger.stageName} (
                        {selectedSinger.gender === 'WOMAN' ? 'Woman' : 'Man'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Event Date &amp; Time:</span>
                      <span className="font-mono font-black text-white">
                        {selectedBookingDate} • {bookingTimeSlot}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Customer Name:</span>
                      <span className="font-bold text-white">
                        {customerName || 'Customer'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Login Member ID:</span>
                      <span className="font-mono font-black text-amber-300">
                        {previewAutoAffiliateInfo.effectiveMemberId}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-sm">
                      <span className="font-black text-amber-300 uppercase">
                        Total Amount:
                      </span>
                      <span className="font-mono font-black text-base text-white">
                        {formatLak(livePricingSummary.totalLak)}
                      </span>
                    </div>
                  </div>

                  {/* Receiving Bank Account Details */}
                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-400/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-300">
                        Official Receiving Bank Account
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard
                            ?.writeText(activeCorporateBank.accountNumber)
                            .catch(() => {});
                          setCopiedQrAccount(true);
                          setTimeout(() => setCopiedQrAccount(false), 2500);
                        }}
                        className="px-2 py-0.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        {copiedQrAccount ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Account</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] font-bold text-white">
                      {activeCorporateBank.bankName}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Account No:</span>
                      <span className="font-mono font-black text-amber-300">
                        {activeCorporateBank.accountNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Account Name:</span>
                      <span className="font-black text-white">
                        {activeCorporateBank.accountName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ====================================================================
                  STEP 1: CONFIRM QR CODE PAYMENT -> STEP 2: ATTACH BILL PAYMENT UPLOAD -> CLICK SUBMIT BUTTON
              ==================================================================== */}
              {!isQrPaymentConfirmedForBillUpload ? (
                <div className="space-y-2.5 pt-2 border-t border-white/15">
                  <div className="px-3 py-2 rounded-xl bg-amber-400/15 border border-amber-400/40 text-[11px] text-amber-200 font-bold flex items-center justify-between gap-2">
                    <span>
                      Step 1 of 2: Scan QR Code above, then click Confirm to attach your Bill Payment slip.
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase shrink-0">
                      Next: Bill Upload
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowBookingQrPaymentModal(false)}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      Back to Edit Booking
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmQrStepToBillUpload}
                      className="w-full flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>
                        Confirm QR Code Payment ({formatLak(livePricingSummary.totalLak)}) — Attach Bill Payment Upload
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-2 border-emerald-400 shadow-xl space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-400/30 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                        STEP 2 OF 2 • QR CONFIRMED
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>
                          Attach Bill Payment Upload (ໃບບິນໂອນເງິນ / Bank Transfer Slip)
                        </span>
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono font-black text-amber-300">
                      Amount: {formatLak(livePricingSummary.totalLak)}
                    </span>
                  </div>

                  {/* Upload Controls + Sample Receipt Helper */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
                    <div className="sm:col-span-7 space-y-2.5">
                      <label className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-dashed border-amber-400 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center gap-1.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-black text-white">
                          Click to Upload / Attach Bill Payment Image *
                        </div>
                        <div className="text-[10px] text-slate-300">
                          Supports BCEL One / Bank QR Slip Screenshot (JPG, PNG, WEBP)
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBillPaymentFileUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAttachSampleBillReceipt}
                          className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/60 text-amber-200 text-[10px] font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-300" />
                          <span>Attach Sample BCEL One Bill Payment Slip</span>
                        </button>
                        {billPaymentImageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setBillPaymentImageUrl('');
                              setBillPaymentFileName('');
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Remove Bill</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-emerald-200 mb-1">
                          Bill Payment Reference / Transaction No. (Optional)
                        </label>
                        <input
                          type="text"
                          value={billPaymentRefNo}
                          onChange={(e) => setBillPaymentRefNo(e.target.value)}
                          placeholder="e.g. BCEL-BILL-884920"
                          className="w-full bg-slate-900/90 border border-emerald-400/50 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white"
                        />
                      </div>
                    </div>

                    {/* Live Preview of Attached Bill Payment */}
                    <div className="sm:col-span-5 flex flex-col justify-between p-3 rounded-2xl bg-black/50 border border-white/15">
                      <div className="text-[10px] font-black uppercase text-emerald-300 mb-1.5 flex items-center justify-between">
                        <span>Attached Bill Preview</span>
                        {billPaymentImageUrl ? (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[8px] font-black">
                            READY TO SUBMIT
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[8px] font-black">
                            WAITING UPLOAD
                          </span>
                        )}
                      </div>

                      {billPaymentImageUrl ? (
                        <div className="space-y-1.5 flex flex-col items-center">
                          <img
                            src={billPaymentImageUrl}
                            alt="Attached Bill Payment Slip"
                            className="w-full h-32 object-contain rounded-xl border-2 border-emerald-400 bg-white p-1"
                          />
                          <div className="w-full text-[10px] font-mono text-emerald-300 truncate text-center">
                            {billPaymentFileName || 'Bill-Payment-Receipt.png'}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 min-h-[120px] rounded-xl border border-dashed border-slate-600 flex flex-col items-center justify-center p-3 text-center text-slate-400 gap-1">
                          <ImageIcon className="w-6 h-6 text-slate-500" />
                          <span className="text-[10px] font-semibold">
                            No Bill Payment image attached yet.
                          </span>
                          <span className="text-[9px] text-slate-500">
                            Upload your payment slip on the left before clicking Submit.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {billPaymentUploadError && (
                    <div className="p-2.5 rounded-xl bg-red-500/25 border border-red-400 text-xs font-bold text-red-100 flex items-center justify-between gap-2">
                      <span>{billPaymentUploadError}</span>
                      <button
                        type="button"
                        onClick={handleAttachSampleBillReceipt}
                        className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black shrink-0 cursor-pointer"
                      >
                        Quick Attach Bill Slip
                      </button>
                    </div>
                  )}

                  {/* Final Action Row: Back to QR | SUBMIT BUTTON */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-emerald-400/30">
                    <button
                      type="button"
                      onClick={() => {
                        setIsQrPaymentConfirmedForBillUpload(false);
                        setBillPaymentUploadError(null);
                      }}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                    >
                      ← Back to QR Step
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteQrPartyBookingPayment}
                      className="w-full flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl ring-2 ring-amber-300 cursor-pointer"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      <span>
                        Submit Bill Payment &amp; Complete Booking ({formatLak(livePricingSummary.totalLak)})
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
