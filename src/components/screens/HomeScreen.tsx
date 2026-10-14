/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 01 - HOME DASHBOARD
 * Full 6-Language Localization (EN, LO, TH, VI, ZH, KO) & Mobile-First Layout:
 * - Crimson wine red top status header with Circle Profile Image, Language Selector & 6-Language Strip
 * - Gold metallic DMC membership card with white insert QR code
 * - Curved white card body with vibrant emerald qualification bar
 * - 3 white balance tiles with colored icons (Blue, Green, Red)
 * - 7 vibrant colorful action buttons (Red, Blue, Green, Cyan, Sky Blue, Pink, Deep Purple)
 * - Banner Products Showcase (Interactive Hero Product Banner Carousel + 4 Product Banner Cards)
 */

import React, { useState, useEffect } from 'react';
import { useDmc } from '../../context/DmcContext';
import {
  translations,
  formatLak,
  formatLakCompact,
  formatNumberWithCommas,
  SUPPORTED_LANGUAGES,
  getLocalizedProduct,
} from '../../utils/i18n';
import {
  Bell,
  QrCode,
  CheckCircle2,
  Lock,
  Wallet,
  ShieldCheck,
  Package,
  Users,
  Music,
  BookOpen,
  Headphones,
  Sparkles,
  HelpCircle,
  X,
  Award,
  Phone,
  MessageCircle,
  ExternalLink,
  Wifi,
  BatteryMedium,
  Signal,
  LogIn,
  LogOut,
  UserPlus,
  Camera,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Flame,
  Upload,
  Check,
  Globe,
} from 'lucide-react';
import { QrCodeModal } from '../common/QrCodeModal';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { CopyrightCertificateModal } from '../common/CopyrightCertificateModal';
import { DmcOfficialLogo } from '../common/DmcLogo';
import { LaoShippingCarrierModal } from '../common/LaoShippingCarrierModal';
import { UserControlPanelModal } from '../common/UserControlPanelModal';
import { AuthPortalModal } from '../common/AuthPortalModal';
import { LaoShippingCarrierId, ProductSKU } from '../../types/dmc';

interface HomeScreenProps {
  onNavigate: (tab: any) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const {
    currentMember,
    getMemberBalances,
    getMemberSongs,
    language,
    setLanguage,
    redeemHeldCreditForQualification,
    products,
    createOrder,
    adminUpdateMember,
    setIsLoggedOut,
  } = useDmc();
  const t = translations[language];

  const balances = getMemberBalances(currentMember.memberId);
  const songs = getMemberSongs(currentMember.memberId);

  const [activeQrModal, setActiveQrModal] = useState<'MEMBER' | 'REFERRAL' | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [redemptionNotice, setRedemptionNotice] = useState<string | null>(null);
  const [showDirectPayQr, setShowDirectPayQr] = useState(false);
  const [selectedBannerProductForQr, setSelectedBannerProductForQr] = useState<ProductSKU | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [activeCarrierId] = useState<LaoShippingCarrierId>('ANOUSITH');
  const [showUserControlModal, setShowUserControlModal] = useState(false);
  const [showAuthPortalModal, setShowAuthPortalModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  // Circle Profile Image Modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState(currentMember.avatarUrl || '');

  // Featured Banner Products Carousel state (Only 4 products)
  const featuredProducts = products.slice(0, 4);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % featuredProducts.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  // Dynamic qualification calculations bound to Core Product MUSIC_SINGLE_1600
  const coreProduct = products.find((p) => p.sku === 'MUSIC_SINGLE_1600');
  const QUALIFICATION_TARGET = coreProduct?.priceLak || 1600000;
  const isActive = currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER';
  const eligibleClearedHeld = balances.heldForQualification;
  const remainingToActive = Math.max(0, QUALIFICATION_TARGET - eligibleClearedHeld);
  const progressPercent = isActive
    ? 100
    : Math.min(100, Math.floor((eligibleClearedHeld / QUALIFICATION_TARGET) * 100));

  const handleRedeemQualification = () => {
    const res = redeemHeldCreditForQualification(currentMember.memberId);
    setRedemptionNotice(res.message);
    setTimeout(() => setRedemptionNotice(null), 6000);
  };

  const langOrder = ['en', 'lo', 'th', 'vi', 'zh', 'ko'] as const;
  const cycleLanguage = () => {
    const idx = langOrder.indexOf(language as any);
    const next = langOrder[(idx + 1) % langOrder.length];
    setLanguage(next);
  };

  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  // Circle Profile Avatar URL (never squished)
  const avatarUrl =
    currentMember.avatarUrl ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80';

  const currentHeroProduct = featuredProducts[activeBannerIdx] || featuredProducts[0];
  const currentHeroLocalized = currentHeroProduct
    ? getLocalizedProduct(currentHeroProduct, language)
    : null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        adminUpdateMember(currentMember.memberId, { avatarUrl: reader.result });
        setCustomAvatarInput(reader.result);
        setShowAvatarModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-0 pb-8 animate-in fade-in select-none">
      {/* ---------------- 1. CRIMSON RED LUXURY HEADER SECTION ---------------- */}
      <div className="relative z-30 bg-gradient-to-b from-[#69030e] via-[#850818] to-[#990c1e] text-white pt-3 pb-6 px-4 shadow-lg rounded-b-[24px]">
        {/* Mobile Phone Status Bar (8:01, Signal, Wifi, Battery) */}
        <div className="flex items-center justify-between text-xs text-white/90 mb-3 px-1">
          <span className="font-bold text-xs tracking-tight">8:01</span>

          {/* Center Dynamic Island Notch */}
          <div className="w-24 h-4 bg-black/80 rounded-full border border-black/40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2 border border-slate-700/50"></div>
          </div>

          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Member Profile Header Row (with Fixed Circle Profile Image) */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* CIRCLE PROFILE IMAGE (Fixed 56x56px, shrink-0 so it NEVER squishes) */}
            <div
              onClick={() => setShowAvatarModal(true)}
              className="relative w-14 h-14 min-w-[56px] min-h-[56px] shrink-0 cursor-pointer group"
              title="Tap to change Circle Profile Image"
            >
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#f5a623] via-[#fff3b0] to-[#e69110] shadow-lg">
                <img
                  src={avatarUrl}
                  alt={currentMember.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#69030e]"
                />
              </div>
              {/* Online Status Dot */}
              <span className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#850818] rounded-full shadow" />
              {/* Camera Edit Badge */}
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border border-[#69030e] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            </div>

            {/* Profile Identifiers */}
            <div
              onClick={() => setShowUserControlModal(true)}
              className="min-w-0 flex-1 cursor-pointer group"
              title="Click to open User Log In / Log Out & Profile Control Panel"
            >
              <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 tracking-tight leading-snug truncate">
                {currentMember.name || 'DMC Xayraxa'}
              </h2>
              <div className="text-[11px] text-red-200 font-mono leading-tight mt-0.5 truncate">
                ID: {currentMember.memberId || 'DM000123'}
              </div>
              <div className="text-[10px] font-black text-amber-300 tracking-wider uppercase leading-tight mt-1 flex flex-wrap items-center gap-1">
                <span className="truncate">{isActive ? t.activeMember : t.freeMember}</span>
                <span className="px-1.5 py-0.5 rounded bg-black/35 text-[9px] text-white/95 font-semibold border border-white/25 shrink-0">
                  {t.switchLogOut}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Certificate Button, Notification Bell & Language Selector */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setShowCertificateModal(true)}
              className="px-2 py-1.5 rounded-lg border border-amber-300/60 bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 font-bold text-[10px] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              title="Open Official DMC Xayraxa Classical Music Copyright Certificate"
            >
              <Award className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">{t.certShort}</span>
            </button>

            <button
              onClick={() => setShowNotificationToast(!showNotificationToast)}
              className="p-1.5 rounded-full bg-black/25 hover:bg-black/35 text-white transition-colors cursor-pointer relative shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            {/* Language Switcher Badge & Dropdown (6 Languages: EN, LO, TH, VI, ZH, KO) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                className="px-2 py-1.5 rounded-xl border border-amber-300/70 bg-black/40 hover:bg-black/60 text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-md"
                title="Select Language (English, ພາສາລາວ, ไทย, Tiếng Việt, 中文, 한국어)"
              >
                <span className="text-sm leading-none">{currentLangOption.flag}</span>
                <span className="font-extrabold text-amber-300">{currentLangOption.shortLabel}</span>
                <ChevronDown className="w-3 h-3 text-amber-200" />
              </button>

              {showLanguagePicker && (
                <>
                  {/* Click-outside backdrop */}
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setShowLanguagePicker(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/98 backdrop-blur-xl border-2 border-amber-400/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 z-[100] space-y-1 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.selectLanguageLabel}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleLanguage();
                        }}
                        className="text-amber-400 hover:text-amber-200 text-[10px] font-bold cursor-pointer px-1.5 py-0.5 rounded bg-amber-500/15"
                      >
                        {t.cycleNext}
                      </button>
                    </div>
                    {SUPPORTED_LANGUAGES.map((langOpt) => {
                      const isSelected = language === langOpt.code;
                      return (
                        <button
                          key={langOpt.code}
                          onClick={() => {
                            setLanguage(langOpt.code);
                            setShowLanguagePicker(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-md'
                              : 'text-slate-100 hover:bg-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-base leading-none">{langOpt.flag}</span>
                            <span>
                              <span className="block leading-tight">{langOpt.nativeName}</span>
                              <span
                                className={`text-[9px] block leading-tight ${
                                  isSelected ? 'text-slate-800 font-bold' : 'text-slate-400'
                                }`}
                              >
                                {langOpt.name}
                              </span>
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-[10px] font-mono uppercase opacity-80">
                              {langOpt.code}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 6-Language One-Tap Selector Bar (Instant visual language switching as shown in image) */}
        <div className="grid grid-cols-6 gap-1 mb-2.5 p-1 rounded-xl bg-black/30 border border-white/15">
          {SUPPORTED_LANGUAGES.map((langOpt) => {
            const isSelected = language === langOpt.code;
            return (
              <button
                key={langOpt.code}
                type="button"
                onClick={() => setLanguage(langOpt.code)}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#f5a623] to-[#e69110] text-slate-950 font-black shadow-sm scale-[1.02]'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
                title={`${langOpt.nativeName} (${langOpt.name})`}
              >
                <span className="text-xs leading-none">{langOpt.flag}</span>
                <span className="truncate">{langOpt.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Mobile Bar: User Log In, Register, Log Out, Profile & SMS Recovery, and Super Admin Portal */}
        <div className="flex flex-wrap items-center justify-between gap-1 mb-3.5 px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/15 text-[10px]">
          <button
            onClick={() => {
              setAuthInitialMode('MEMBER');
              setShowAuthPortalModal(true);
            }}
            className="flex items-center gap-1 font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
          >
            <LogIn className="w-3 h-3 text-amber-400" />
            <span>{t.logIn}</span>
          </button>
          <span className="text-white/25">|</span>
          <button
            onClick={() => {
              setAuthInitialMode('REGISTER');
              setShowAuthPortalModal(true);
            }}
            className="flex items-center gap-1 font-bold text-rose-200 hover:text-white transition-colors cursor-pointer"
          >
            <UserPlus className="w-3 h-3 text-amber-300" />
            <span>{t.register}</span>
          </button>
          <span className="text-white/25">|</span>
          <button
            onClick={() => setIsLoggedOut(true)}
            className="flex items-center gap-1 font-bold text-red-200 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-red-400" />
            <span>{t.logOut}</span>
          </button>
          <span className="text-white/25">|</span>
          <button
            onClick={() => {
              setAuthInitialMode('RECOVERY');
              setShowAuthPortalModal(true);
            }}
            className="flex items-center gap-1 font-bold text-sky-300 hover:text-white transition-colors cursor-pointer"
          >
            <Phone className="w-3 h-3 text-sky-400" />
            <span>{t.profileAndSms}</span>
          </button>
          <span className="text-white/25">|</span>
          <button
            onClick={() => {
              setAuthInitialMode('ADMIN');
              setShowAuthPortalModal(true);
            }}
            className="flex items-center gap-1 font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{t.adminLogin}</span>
          </button>
        </div>

        {/* ---------------- 2. GOLD METALLIC DMC MEMBERSHIP CARD ---------------- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f5a623] via-[#f7b733] to-[#e69110] text-slate-950 p-4 shadow-xl border border-amber-200/60">
          {/* Subtle Metallic Specular Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-stretch justify-between gap-3">
            {/* Left Card Details */}
            <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
              <div className="flex items-center gap-2.5">
                <DmcOfficialLogo size={42} withGoldRing={false} className="shadow-md border border-amber-900/20 shrink-0" />
                <div className="min-w-0">
                  <h1 className="text-3xl font-black tracking-tight text-slate-950 leading-none">
                    DMC
                  </h1>
                  <div className="text-[10px] font-bold text-slate-900 tracking-wider mt-1 uppercase truncate">
                    {t.digitalMusicCenter}
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight leading-snug">
                  {isActive ? t.activeMember : t.freeMember}
                </div>
                <div className="text-xs font-semibold text-slate-900/90 mt-0.5">
                  {t.buildYourMusicFuture}
                </div>
              </div>
            </div>

            {/* Right: White Card Insert with QR Code */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <button
                onClick={() => setActiveQrModal('MEMBER')}
                className="bg-white p-2 rounded-xl shadow-md border border-amber-200/80 hover:scale-105 transition-transform flex flex-col items-center cursor-pointer group"
                title="Tap to enlarge Member QR"
              >
                {/* Visual QR Code Matrix */}
                <div className="w-16 h-16 bg-slate-950 rounded-lg p-1.5 grid grid-cols-4 gap-0.5 relative">
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
                    <div className="w-4 h-4 rounded bg-[#df1c2d] text-white font-black text-[7px] flex items-center justify-center shadow">
                      D
                    </div>
                  </div>
                </div>

                {/* MEMBER QR text in royal blue */}
                <span className="mt-1 text-[9px] font-black text-[#0c4bb2] tracking-wider uppercase max-w-[74px] truncate">
                  {t.memberQr}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- 3. WHITE CURVED BODY CONTAINER ---------------- */}
      <div className="bg-white rounded-t-[32px] text-slate-800 p-4 -mt-4 shadow-2xl relative z-10 space-y-4">
        {/* Notification Alert Toast (if triggered) */}
        {showNotificationToast && (
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 text-slate-700">
              <Bell className="w-4 h-4 text-[#df1c2d] shrink-0" />
              <span>{t.qualifiedCongratulations}</span>
            </div>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Qualification Redemption Success Notice */}
        {redemptionNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{redemptionNotice}</span>
          </div>
        )}

        {/* Section 1: Qualification Progress */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-sm font-bold text-indigo-950 tracking-tight">
            {t.qualificationProgress}
          </h3>

          <div className="flex items-center justify-between text-sm font-bold text-indigo-950 font-mono">
            <span>
              {formatNumberWithCommas(eligibleClearedHeld)} / {formatNumberWithCommas(QUALIFICATION_TARGET)} LAK
            </span>
            <span>{progressPercent}%</span>
          </div>

          {/* Progress Bar Track: Soft Gray with Vibrant Emerald Green Fill */}
          <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden relative p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isActive ? 'bg-emerald-500' : 'bg-[#00c853]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* If ready to redeem */}
          {!isActive && eligibleClearedHeld >= QUALIFICATION_TARGET && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
              <span className="text-xs text-amber-900 font-semibold">
                {t.targetReachedActivateNow}
              </span>
              <button
                onClick={handleRedeemQualification}
                className="px-3 py-1 rounded-lg bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs shadow-sm cursor-pointer shrink-0"
              >
                {t.redeemNow}
              </button>
            </div>
          )}

          {/* Quick Pay with Bank QR option for Free Members */}
          {!isActive && eligibleClearedHeld < QUALIFICATION_TARGET && (
            <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-slate-600 font-medium">
                {t.needMoreToQualifyPrefix}{' '}
                <strong className="text-slate-900 font-mono">{formatLak(remainingToActive)}</strong>{' '}
                {t.needMoreToQualifySuffix}
              </span>
              <button
                type="button"
                onClick={() => setShowDirectPayQr(true)}
                className="px-2.5 py-1 rounded-lg bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <QrCode className="w-3 h-3" />
                <span>{t.pay16mWithBankQr}</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: 3 White Balance & Status Tiles */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Tile 1: Qualification (Locked) */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-2.5 sm:p-3 text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1a73e8] flex items-center justify-center mx-auto mb-1">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight truncate">
              {formatNumberWithCommas(eligibleClearedHeld)}
            </div>
            <div className="text-[10px] font-semibold text-slate-500 leading-tight line-clamp-2">
              {t.tileQualificationLocked}
            </div>
          </div>

          {/* Tile 2: Withdrawable Balance */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-2.5 sm:p-3 text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#137333] flex items-center justify-center mx-auto mb-1">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 font-mono leading-tight truncate">
              {formatNumberWithCommas(balances.available)}
            </div>
            <div className="text-[10px] font-semibold text-slate-500 leading-tight line-clamp-2">
              {t.tileWithdrawableBalance}
            </div>
          </div>

          {/* Tile 3: Member Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-2.5 sm:p-3 text-center space-y-1 hover:shadow-md transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#df1c2d] flex items-center justify-center mx-auto mb-1">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
              {isActive ? t.statusActiveShort : t.statusFreeShort}
            </div>
            <div className="text-[10px] font-semibold text-slate-500 leading-tight line-clamp-2">
              {t.tileMemberStatus}
            </div>
          </div>
        </div>

        {/* Section 3: Vibrant Colorful Action Buttons Grid (Exact 7 colors from screenshot) */}
        <div className="space-y-2.5 pt-1">
          {/* Row 1: 3 Big Colorful Gradient Cards (Red, Blue, Green) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Button 1: Buy Music Package (Vibrant Red Gradient) */}
            <button
              onClick={() => onNavigate('musichub')}
              className="bg-gradient-to-br from-[#e0192d] to-[#bd0d1e] shadow-md shadow-red-500/20 text-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Package className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold leading-tight text-white mt-0.5 line-clamp-2">
                {t.btnBuyMusicPackage}
              </span>
              <span className="text-[10px] font-semibold text-white/95 font-mono">
                1,600,000 LAK
              </span>
            </button>

            {/* Button 2: My Network (Rich Royal Blue Gradient) */}
            <button
              onClick={() => onNavigate('network')}
              className="bg-gradient-to-br from-[#1268e8] to-[#0c4bb2] shadow-md shadow-blue-500/20 text-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Users className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold leading-tight text-white mt-0.5 line-clamp-2">
                {t.btnMyNetwork}
              </span>
              <span className="text-[10px] font-semibold text-white/95">
                {t.btnThreeLevels}
              </span>
            </button>

            {/* Button 3: My Music (Vivid Emerald Green Gradient) */}
            <button
              onClick={() => onNavigate('musichub')}
              className="bg-gradient-to-br from-[#05b865] to-[#038e4c] shadow-md shadow-emerald-500/20 text-white rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Music className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold leading-tight text-white mt-0.5 line-clamp-2">
                {t.btnMyMusic}
              </span>
              <span className="text-[10px] font-semibold text-white/95">
                ({songs.length} {t.btnSongsCountSuffix})
              </span>
            </button>
          </div>

          {/* Row 2: 4 Colorful Cards (Cyan, Sky Blue, Pink, Deep Purple) */}
          <div className="grid grid-cols-4 gap-2">
            {/* Button 4: Academy (Cyan Gradient) */}
            <button
              onClick={() => onNavigate('academy')}
              className="bg-gradient-to-br from-[#13a8c7] to-[#0c829b] shadow-md shadow-cyan-500/20 text-white rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <BookOpen className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-tight line-clamp-1">
                {t.btnAcademy}
              </span>
            </button>

            {/* Button 5: Music Hub (Electric Sky Blue Gradient) */}
            <button
              onClick={() => onNavigate('musichub')}
              className="bg-gradient-to-br from-[#0088ff] to-[#0066cc] shadow-md shadow-blue-400/20 text-white rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Headphones className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-tight line-clamp-1">
                {t.btnMusicHub}
              </span>
            </button>

            {/* Button 6: Promotions (Hot Pink Gradient) */}
            <button
              onClick={() => setShowPromotionsModal(true)}
              className="bg-gradient-to-br from-[#e60067] to-[#b3004b] shadow-md shadow-pink-500/20 text-white rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <Sparkles className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-tight line-clamp-1">
                {t.btnPromotions}
              </span>
            </button>

            {/* Button 7: Support (Deep Purple Gradient) */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="bg-gradient-to-br from-[#2e1d87] to-[#1e1259] shadow-md shadow-purple-900/20 text-white rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                <HelpCircle className="w-4 h-4 text-white stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-tight line-clamp-1">
                {t.btnSupport}
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            Section 4: BANNER PRODUCTS SHOWCASE (Hero Carousel + 4 Product Banners)
           ===================================================================== */}
        <div className="pt-2 space-y-3">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-red-50 text-[#df1c2d] shrink-0">
                <Flame className="w-4 h-4 fill-[#df1c2d]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-indigo-950 tracking-tight leading-none truncate">
                  {t.featuredBannerProductsTitle}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                  {t.featuredBannerProductsSub}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="px-2.5 py-1 rounded-full bg-[#df1c2d]/10 hover:bg-[#df1c2d]/20 text-[#df1c2d] text-[10px] font-extrabold transition-colors cursor-pointer shrink-0"
            >
              {t.viewAllFour}
            </button>
          </div>

          {/* 4A. Interactive Hero Product Banner Carousel */}
          {currentHeroProduct && currentHeroLocalized && (
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-amber-400/50 bg-slate-900 text-white group">
              {/* Background Product Image with Rich Overlay */}
              <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                <img
                  src={currentHeroProduct.imageUrl}
                  alt={currentHeroLocalized.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f5a623] to-[#e69110] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                    {currentHeroLocalized.categoryBadge}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-black font-mono shadow">
                    {t.poolLabel}: {formatLakCompact(currentHeroProduct.commissionPoolLak)} LAK
                  </span>
                </div>

                {/* Prev / Next Carousel Buttons */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveBannerIdx((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center cursor-pointer"
                  aria-label="Previous Product Banner"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBannerIdx((prev) => (prev + 1) % featuredProducts.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center cursor-pointer"
                  aria-label="Next Product Banner"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Bottom Product Banner Info & CTA */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-amber-300 font-bold uppercase truncate">
                      SKU: {currentHeroProduct.sku}
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-white leading-tight line-clamp-1">
                      {currentHeroLocalized.title}
                    </h4>
                    <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                      {formatNumberWithCommas(currentHeroProduct.priceLak)} LAK
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (currentHeroProduct.sku === 'MUSIC_SINGLE_1600') {
                        setShowDirectPayQr(true);
                      } else {
                        setSelectedBannerProductForQr(currentHeroProduct);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e0192d] to-[#bd0d1e] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.buyNowBtn}</span>
                  </button>
                </div>
              </div>

              {/* Carousel Dots Bar */}
              <div className="bg-slate-950 px-3 py-1.5 flex items-center justify-between border-t border-white/10">
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  {currentHeroLocalized.description}
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {featuredProducts.map((p, idx) => (
                    <button
                      key={p.sku}
                      type="button"
                      onClick={() => setActiveBannerIdx(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeBannerIdx ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-600'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4B. Visual Banner Products Grid (Only 4 Official Products in 2x2 Grid) */}
          <div className="grid grid-cols-2 gap-2.5">
            {featuredProducts.map((prod) => {
              const loc = getLocalizedProduct(prod, language);
              return (
                <div
                  key={prod.sku}
                  onClick={() => {
                    onNavigate('catalog');
                  }}
                  className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Product Banner Image */}
                  <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                    <img
                      src={prod.imageUrl}
                      alt={loc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-amber-300 text-[9px] font-bold uppercase">
                      {loc.categoryBadge}
                    </span>
                    <span className="absolute bottom-1.5 left-2 right-2 text-white font-black font-mono text-xs drop-shadow">
                      {formatNumberWithCommas(prod.priceLak)} LAK
                    </span>
                  </div>

                  {/* Product Banner Details */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#df1c2d]">
                        {loc.title}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-700 font-mono mt-0.5">
                        L1/L2/L3 {t.poolLabel}: {formatLakCompact(prod.commissionPoolLak)}
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                      <span className="text-[9px] font-mono text-slate-400 truncate">
                        {prod.itemType === 'SERVICE'
                          ? t.studioMasterLabel
                          : `${t.stockLabel}: ${prod.stockSellable}`}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (prod.sku === 'MUSIC_SINGLE_1600') {
                            setShowDirectPayQr(true);
                          } else {
                            setSelectedBannerProductForQr(prod);
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[10px] cursor-pointer shrink-0"
                      >
                        {t.buyQrBtn}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------------- 4. MODALS (AVATAR PICKER, QR, PROMOTIONS, SUPPORT) ---------------- */}

      {/* Circle Profile Image Picker / Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Circle Profile Image</h4>
                  <span className="text-[10px] text-slate-500">{currentMember.name}</span>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Circle Profile Preview */}
            <div className="flex flex-col items-center py-2">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#f5a623] via-[#fff3b0] to-[#e69110] shadow-lg">
                <img
                  src={avatarUrl}
                  alt={currentMember.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2">{currentMember.memberId}</span>
            </div>

            {/* Upload from Device */}
            <div>
              <label className="w-full py-2.5 px-4 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Photo from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preset Circle Portraits */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Or Choose Preset Profile Portrait
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      adminUpdateMember(currentMember.memberId, { avatarUrl: url });
                      setCustomAvatarInput(url);
                      setShowAvatarModal(false);
                    }}
                    className={`w-11 h-11 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                      avatarUrl === url ? 'border-[#df1c2d] ring-2 ring-amber-400' : 'border-slate-200'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image URL Input */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Or Paste Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarInput.trim()) {
                      adminUpdateMember(currentMember.memberId, { avatarUrl: customAvatarInput.trim() });
                      setShowAvatarModal(false);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotions Modal */}
      {showPromotionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-50 text-[#e60067]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.btnPromotions}</h4>
                  <span className="text-[10px] text-slate-500">Rev 2.6 Seasonal Incentives</span>
                </div>
              </div>
              <button
                onClick={() => setShowPromotionsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 border border-pink-200/60 space-y-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#e60067] text-white">
                SPECIAL MUSIC INCENTIVE
              </span>
              <h5 className="text-xs font-bold text-slate-900">
                {t.featuredMusicTitle}
              </h5>
              <p className="text-[11px] text-slate-600 leading-snug">
                {t.featuredMusicDesc}
              </p>
              <div className="pt-1 flex items-center justify-between text-xs font-mono font-bold text-[#e60067]">
                <span>{t.price}: 1,600,000 LAK</span>
                <button
                  onClick={() => {
                    setShowPromotionsModal(false);
                    onNavigate('musichub');
                  }}
                  className="px-3 py-1 rounded-xl bg-[#e60067] hover:bg-pink-700 text-white text-[11px] font-bold shadow-sm cursor-pointer"
                >
                  {t.buyNowBtn}
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPromotionsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-[#2e1d87]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.quickSupport}</h4>
                  <span className="text-[10px] text-slate-500">Official Assistance & Inquiries</span>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Hotline Phone (Lao PDR)</span>
                  <strong className="text-slate-900 font-mono">+856 20 5511 2233</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">WhatsApp Official Support</span>
                  <strong className="text-slate-900 font-mono">+856 20 5511 2233</strong>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-[#1268e8] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block">Head Office & Studios</span>
                  <span className="text-slate-800 font-medium">Dongdok Campus, Vientiane Capital</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSupportModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Member QR & Referral QR Modal */}
      <QrCodeModal
        isOpen={activeQrModal !== null}
        onClose={() => setActiveQrModal(null)}
        type={activeQrModal || 'MEMBER'}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        referralCode={currentMember.memberId}
      />

      {/* Lao Bank QR Direct Activation Modal */}
      <BankQrPaymentModal
        isOpen={showDirectPayQr}
        onClose={() => setShowDirectPayQr(false)}
        amountLak={QUALIFICATION_TARGET}
        purpose="MEMBERSHIP_ACTIVATION"
        title="Lao Bank QR: Direct Lifetime Activation"
        description="Scan using BCEL One, LDB Trust, or any compatible Lao mobile banking app to unlock Active Lifetime status immediately."
        onPaymentSuccess={async (details) => {
          try {
            await createOrder([{ sku: 'MUSIC_SINGLE_1600', quantity: 1 }], 'BCEL_ONE');
            setRedemptionNotice(
              `Payment verified via ${details.bankName}! Active Lifetime status unlocked with 1 Studio Debut Single production entitlement.`
            );
          } catch (err) {
            console.error(err);
          }
          setShowDirectPayQr(false);
        }}
      />

      {/* Banner Product Direct QR Order Modal */}
      {selectedBannerProductForQr && (
        <BankQrPaymentModal
          isOpen={true}
          onClose={() => setSelectedBannerProductForQr(null)}
          amountLak={selectedBannerProductForQr.priceLak}
          purpose="STORE_ORDER"
          title={`${t.buyNowBtn}: ${getLocalizedProduct(selectedBannerProductForQr, language).title}`}
          description={`Scan with BCEL One or Lao QR to purchase ${selectedBannerProductForQr.sku} (${formatNumberWithCommas(
            selectedBannerProductForQr.priceLak
          )} LAK).`}
          onPaymentSuccess={async (details) => {
            try {
              await createOrder([{ sku: selectedBannerProductForQr.sku, quantity: 1 }], 'BCEL_ONE');
              setRedemptionNotice(
                `Order paid via ${details.bankName} for ${
                  getLocalizedProduct(selectedBannerProductForQr, language).title
                }!`
              );
            } catch (err) {
              console.error(err);
            }
            setSelectedBannerProductForQr(null);
          }}
        />
      )}

      {/* Official Copyright & Master Rights Certificate Modal */}
      <CopyrightCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        isActiveLifetime={isActive}
        songs={songs}
      />

      {/* Lao Shipping Carriers & Tracking Modal */}
      <LaoShippingCarrierModal
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        initialCarrierId={activeCarrierId}
      />

      {/* User Control Panel (Log In, Log Out, Switch Account, Bank & Shipping) */}
      <UserControlPanelModal
        isOpen={showUserControlModal}
        onClose={() => setShowUserControlModal(false)}
      />

      {/* Dedicated User & Super Admin Authentication Portal */}
      <AuthPortalModal
        isOpen={showAuthPortalModal}
        onClose={() => setShowAuthPortalModal(false)}
        initialMode={authInitialMode}
      />
    </div>
  );
};
