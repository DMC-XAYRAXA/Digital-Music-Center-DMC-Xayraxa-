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
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Megaphone,
  Image as ImageIcon,
} from 'lucide-react';
import { QrCodeModal } from '../common/QrCodeModal';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { CopyrightCertificateModal } from '../common/CopyrightCertificateModal';
import { DmcOfficialLogo } from '../common/DmcLogo';
import { LaoShippingCarrierModal } from '../common/LaoShippingCarrierModal';
import { UserControlPanelModal } from '../common/UserControlPanelModal';
import { AuthPortalModal } from '../common/AuthPortalModal';
import { DownlineOrganizeTree } from '../common/DownlineOrganizeTree';
import { MemberRegistrationTutorialGuide } from '../common/MemberRegistrationTutorialGuide';
import {
  LaoShippingCarrierId,
  ProductSKU,
  EventActivityPost,
  SupportLocationItem,
} from '../../types/dmc';

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
    allMembers,
    setCurrentMemberId,
    getMemberBalances,
    getMemberSongs,
    language,
    setLanguage,
    redeemHeldCreditForQualification,
    products,
    createOrder,
    adminUpdateMember,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    eventPosts,
    adminAddEventPost,
    adminUpdateEventPost,
    adminDeleteEventPost,
    supportLocations,
    adminAddSupportLocation,
    adminUpdateSupportLocation,
    adminDeleteSupportLocation,
    isAdminMode,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    getDownlines,
    isLoggedOut,
    setIsLoggedOut,
  } = useDmc();
  const t = translations[language];

  const isAdmin = isAdminAuthenticated || isAdminMode;
  const balances = getMemberBalances(currentMember.memberId);
  const songs = getMemberSongs(currentMember.memberId);
  const myDownlines = getDownlines(currentMember.memberId);
  const totalMyDownlines =
    myDownlines.l1.length + myDownlines.l2.length + myDownlines.l3.length;

  const [activeQrModal, setActiveQrModal] = useState<'MEMBER' | 'REFERRAL' | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportModalMode, setSupportModalMode] = useState<
    'REGISTER_VIDEO_GUIDE' | 'LIST' | 'EDIT' | 'CREATE'
  >('REGISTER_VIDEO_GUIDE');
  const [editingSupportId, setEditingSupportId] = useState<string | null>(null);
  const [expandedMapItemId, setExpandedMapItemId] = useState<string | null>('support-office-1');
  const [supportForm, setSupportForm] = useState<{
    category: SupportLocationItem['category'];
    label: string;
    value: string;
    locationAddress: string;
    mapQuery: string;
    mapUrl: string;
    photoUrl: string;
    notes: string;
  }>({
    category: 'OFFICE_LOCATION',
    label: 'Head Office & Studios',
    value: 'Dongdok Campus, Vientiane Capital',
    locationAddress: 'Dongdok Campus, Xaythany District, Vientiane Capital, Lao PDR',
    mapQuery: 'Dongdok Campus, Vientiane Capital, Laos',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dongdok+Campus+Vientiane+Capital+Laos',
    photoUrl: '',
    notes: 'Main Recording Studios, Member Service Center & Guitar Showroom',
  });
  const [redemptionNotice, setRedemptionNotice] = useState<string | null>(null);
  const [showDirectPayQr, setShowDirectPayQr] = useState(false);
  const [selectedBannerProductForQr, setSelectedBannerProductForQr] = useState<ProductSKU | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [activeCarrierId] = useState<LaoShippingCarrierId>('ANOUSITH');
  const [showUserControlModal, setShowUserControlModal] = useState(false);
  const [showAuthPortalModal, setShowAuthPortalModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  // Circle Profile Image Modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState(currentMember.avatarUrl || '');

  // Event & Activity Slideshow state + Admin Post/Edit/Delete modal
  const [activeEventIdx, setActiveEventIdx] = useState(0);
  const [showEventAdminModal, setShowEventAdminModal] = useState(false);
  const [viewingEventDetail, setViewingEventDetail] = useState<EventActivityPost | null>(null);
  const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const [eventModalMode, setEventModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    headline: '',
    title: '',
    information: '',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    eventDate: '25 Oct 2026 • 18:00',
    location: 'DMC Central Studio, Vientiane',
    badge: 'EVENT & ACTIVITY',
  });

  useEffect(() => {
    if (eventPosts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveEventIdx((prev) => (prev + 1) % eventPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [eventPosts.length]);

  const currentEvent: EventActivityPost | undefined =
    eventPosts[activeEventIdx % Math.max(1, eventPosts.length)] || eventPosts[0];

  const openCreateEventModal = () => {
    if (!isAdmin) {
      setAuthInitialMode('ADMIN');
      setShowAuthPortalModal(true);
      return;
    }
    setEventModalMode('CREATE');
    setEditingEventId(null);
    setEventForm({
      headline: '',
      title: '',
      information: '',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
      eventDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: 'DMC Central Studio, Vientiane',
      badge: 'EVENT & ACTIVITY',
    });
    setShowEventAdminModal(true);
  };

  const openEditEventModal = (evt: EventActivityPost) => {
    if (!isAdmin) {
      setViewingEventDetail(evt);
      return;
    }
    setEventModalMode('EDIT');
    setEditingEventId(evt.id);
    setEventForm({
      headline: evt.headline,
      title: evt.title,
      information: evt.information,
      imageUrl: evt.imageUrl,
      eventDate: evt.eventDate,
      location: evt.location,
      badge: evt.badge || 'EVENT & ACTIVITY',
    });
    setShowEventAdminModal(true);
  };

  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEventForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEventPost = (e: React.FormEvent) => {
    e.preventDefault();
    const headlineText = eventForm.headline.trim() || eventForm.title.trim() || 'DMC Xayraxa Event & Activity';
    const titleText = eventForm.title.trim() || headlineText;
    if (eventModalMode === 'EDIT' && editingEventId) {
      adminUpdateEventPost(editingEventId, {
        headline: headlineText,
        title: titleText,
        information: eventForm.information.trim(),
        imageUrl: eventForm.imageUrl.trim(),
        eventDate: eventForm.eventDate.trim(),
        location: eventForm.location.trim(),
        badge: eventForm.badge.trim() || 'EVENT & ACTIVITY',
      });
      setRedemptionNotice(`Updated Event & Activity: "${titleText}"`);
    } else {
      adminAddEventPost({
        headline: headlineText,
        title: titleText,
        information: eventForm.information.trim() || 'Official DMC Xayraxa Event & Activity announcement.',
        imageUrl:
          eventForm.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
        eventDate: eventForm.eventDate.trim() || 'Upcoming Event',
        location: eventForm.location.trim() || 'Vientiane Capital',
        badge: eventForm.badge.trim() || 'EVENT & ACTIVITY',
      });
      setActiveEventIdx(0);
      setRedemptionNotice(`Posted new Event & Activity: "${titleText}"`);
    }
    setTimeout(() => setRedemptionNotice(null), 4000);
    setShowEventAdminModal(false);
  };

  // Administrator Product Image Upload, Edit, Delete, Update Modal state
  const [showProductAdminModal, setShowProductAdminModal] = useState(false);
  const [productModalMode, setProductModalMode] = useState<'CREATE' | 'EDIT'>('EDIT');
  const [productForm, setProductForm] = useState<{
    sku: string;
    category: ProductSKU['category'];
    titleEn: string;
    titleLo: string;
    titleTh: string;
    descriptionEn: string;
    priceLak: number;
    commissionPoolLak: number;
    stockSellable: number;
    itemType: ProductSKU['itemType'];
    imageUrl: string;
  }>({
    sku: '',
    category: 'GUITAR',
    titleEn: '',
    titleLo: '',
    titleTh: '',
    descriptionEn: '',
    priceLak: 1600000,
    commissionPoolLak: 300000,
    stockSellable: 20,
    itemType: 'PHYSICAL',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  });

  const openCreateProductModal = () => {
    setProductModalMode('CREATE');
    setProductForm({
      sku: `DMC-PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'GUITAR',
      titleEn: '',
      titleLo: '',
      titleTh: '',
      descriptionEn: '',
      priceLak: 1800000,
      commissionPoolLak: 300000,
      stockSellable: 25,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    });
    setShowProductAdminModal(true);
  };

  const openEditProductModal = (prod: ProductSKU) => {
    setProductModalMode('EDIT');
    setProductForm({
      sku: prod.sku,
      category: prod.category,
      titleEn: prod.titleEn,
      titleLo: prod.titleLo || prod.titleEn,
      titleTh: prod.titleTh || prod.titleEn,
      descriptionEn: prod.descriptionEn,
      priceLak: prod.priceLak,
      commissionPoolLak: prod.commissionPoolLak,
      stockSellable: prod.stockSellable,
      itemType: prod.itemType,
      imageUrl: prod.imageUrl,
    });
    setShowProductAdminModal(true);
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProductAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSku = productForm.sku.trim().toUpperCase() || `DMC-PROD-${Date.now().toString().slice(-4)}`;
    const titleEn = productForm.titleEn.trim() || 'DMC Official Product';
    if (productModalMode === 'EDIT') {
      adminUpdateProduct(cleanSku, {
        category: productForm.category,
        titleEn,
        titleLo: productForm.titleLo.trim() || titleEn,
        titleTh: productForm.titleTh.trim() || titleEn,
        descriptionEn: productForm.descriptionEn.trim(),
        priceLak: Number(productForm.priceLak) || 0,
        commissionPoolLak: Number(productForm.commissionPoolLak) || 0,
        stockSellable: Number(productForm.stockSellable) || 0,
        itemType: productForm.itemType,
        imageUrl: productForm.imageUrl.trim(),
      });
      setRedemptionNotice(`Updated product "${titleEn}" (${cleanSku})`);
    } else {
      const newProd: ProductSKU = {
        sku: cleanSku,
        category: productForm.category,
        titleEn,
        titleLo: productForm.titleLo.trim() || titleEn,
        titleTh: productForm.titleTh.trim() || titleEn,
        descriptionEn: productForm.descriptionEn.trim() || 'Official DMC Xayraxa product.',
        priceLak: Number(productForm.priceLak) || 1500000,
        commissionPoolLak: Number(productForm.commissionPoolLak) || 300000,
        splitRule: {
          ruleType: 'POOL_PERCENTAGE',
          l1Share: 50,
          l2Share: 30,
          l3Share: 20,
        },
        stockSellable: Number(productForm.stockSellable) || 20,
        stockReserved: 0,
        warehouseId: 'Vientiane Central Warehouse',
        itemType: productForm.itemType,
        imageUrl:
          productForm.imageUrl.trim() ||
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        featured: true,
      };
      adminAddProduct(newProd);
      setActiveBannerIdx(0);
      setRedemptionNotice(`Added new product "${titleEn}" (${cleanSku})`);
    }
    setTimeout(() => setRedemptionNotice(null), 4000);
    setShowProductAdminModal(false);
  };

  // Featured Banner Products Carousel state (Shows live products; defaults to first 4 or all added)
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

  // Member's Own Circle Profile Image URL (independent from constant Official DMC Logo)
  const avatarUrl =
    currentMember.avatarUrl && !currentMember.avatarUrl.startsWith('data:image/svg+xml')
      ? currentMember.avatarUrl
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80';

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
        setRedemptionNotice(`Updated profile image for ${currentMember.name}!`);
        setTimeout(() => setRedemptionNotice(null), 3500);
        setShowAvatarModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-0 pb-8 animate-in fade-in select-none">
      {/* ---------------- 1. CRIMSON RED LUXURY HEADER SECTION ---------------- */}
      <div className="relative z-30 bg-gradient-to-b from-[#69030e] via-[#850818] to-[#990c1e] text-white pt-3 pb-6 px-4 shadow-lg rounded-b-[24px]">
        {/* Mobile Phone Status Bar (8:01, Signal, Wifi, Battery) - Shown only in desktop phone frame mockup */}
        <div className="hidden sm:flex items-center justify-between text-xs text-white/90 mb-3 px-1">
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

        {/* Single-Row Member Profile Header (Circle Profile Image + Member Name/ID + Drop Down List Login/Log Out + Bell & Language) */}
        <div className="relative flex items-center justify-between gap-2 mb-2.5">
          {/* Left: Circle Profile Image + Member Name, ID & Status */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* MEMBER'S OWN CIRCLE PROFILE IMAGE (Fixed 52x52px, shrink-0 so it NEVER squishes) */}
            <div
              onClick={() => setShowAvatarModal(true)}
              className="relative w-13 h-13 min-w-[52px] min-h-[52px] shrink-0 cursor-pointer group"
              title="Tap to update your own Member Profile Image"
            >
              <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-tr from-[#f5a623] via-[#fff3b0] to-[#e69110] shadow-lg">
                <img
                  src={avatarUrl}
                  alt={currentMember.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#69030e]"
                />
              </div>
              {/* Online Status Dot */}
              <span className="absolute bottom-0.5 left-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#850818] rounded-full shadow" />
              {/* Camera Edit Badge */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 border border-[#69030e] flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
              </span>
            </div>

            {/* Profile Identifiers (Name, ID, Status — Spacious & Always Visible on Mobile) */}
            <div
              onClick={() => setShowUserControlModal(true)}
              className="min-w-[90px] flex-1 cursor-pointer group"
              title="Click to open User Profile Control Panel"
            >
              <h2 className="text-[13px] sm:text-sm font-extrabold text-white group-hover:text-amber-200 tracking-tight leading-tight truncate">
                {(currentMember.name || 'DMC Xayraxa').replace(/\s*\(.*?\)\s*/g, '')}
              </h2>
              <div className="text-[10px] text-red-200 font-mono leading-tight mt-0.5 truncate">
                ID: {currentMember.memberId || 'DM000123'}
              </div>
              <div className="text-[9px] font-black text-amber-300 tracking-wider uppercase leading-tight mt-0.5 truncate flex items-center gap-1">
                <span>{isActive ? t.activeMember : t.freeMember}</span>
                {isAdmin && (
                  <span className="px-1 py-0.2 rounded bg-emerald-400 text-slate-950 text-[8px] font-black uppercase shrink-0">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls: Drop Down List Login / Log Out + Bell + Language Selector */}
          <div className="flex items-center gap-1 shrink-0">
            {/* 1/ DROP DOWN LIST: LOGIN / LOG OUT */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowLoginDropdown(!showLoginDropdown);
                  setShowLanguagePicker(false);
                }}
                className="px-2 py-1.5 rounded-xl border border-amber-300/80 bg-black/50 hover:bg-black/70 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 shadow-md"
                title="Drop Down List: Log In / Log Out"
              >
                <LogIn className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-extrabold text-amber-300 whitespace-nowrap leading-none">
                  Login / Out
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-amber-200 shrink-0 transition-transform ${
                    showLoginDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showLoginDropdown && (
                <>
                  {/* Click-outside backdrop */}
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setShowLoginDropdown(false)}
                  />
                  <div className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-72 top-full mt-2 bg-slate-900/98 backdrop-blur-xl border-2 border-amber-400/70 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 z-[100] space-y-2 animate-in fade-in zoom-in-95 text-slate-100">
                    {/* Dropdown Title Bar */}
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300 border-b border-slate-800 flex items-center justify-between">
                      <span>Login / Log Out Menu</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          isLoggedOut
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isLoggedOut ? 'LOGGED OUT' : 'ONLINE'}
                      </span>
                    </div>

                    {/* Active Session Header */}
                    <div className="px-2.5 py-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-2.5">
                      <img
                        src={avatarUrl}
                        alt={currentMember.name}
                        className="w-9 h-9 rounded-full object-cover border border-amber-400 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-extrabold text-white truncate">
                          {(currentMember.name || 'DMC Xayraxa').replace(/\s*\(.*?\)\s*/g, '')}
                        </div>
                        <div className="text-[10px] font-mono text-amber-300 truncate">
                          {currentMember.memberId} • {isAdmin ? 'ADMIN ACTIVE' : 'MEMBER'}
                        </div>
                      </div>
                    </div>

                    {/* PRIMARY DROP DOWN OPTIONS: 1. LOG IN & 2. LOG OUT */}
                    <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                      {/* 1. Log In */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          setAuthInitialMode('MEMBER');
                          setShowAuthPortalModal(true);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 flex items-center justify-between transition-all cursor-pointer shadow-md"
                      >
                        <span className="flex items-center gap-2">
                          <LogIn className="w-4 h-4 text-slate-950 shrink-0 stroke-[2.5]" />
                          <span>1. {t.logIn} (Member Login)</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-900" />
                      </button>

                      {/* 2. Log Out */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          setIsAdminAuthenticated(false);
                          setIsLoggedOut(true);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold text-rose-200 bg-rose-600/25 hover:bg-rose-600/40 border border-rose-500/50 flex items-center justify-between transition-all cursor-pointer shadow-sm"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5]" />
                          <span>2. {t.logOut} (Sign Out)</span>
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200">
                          Exit
                        </span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1.5 space-y-1">
                      {/* 3. Register New Member */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          setAuthInitialMode('REGISTER');
                          setShowAuthPortalModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{t.register} (New Account)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>

                      {/* 4. Profile & SMS (+856) */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          setAuthInitialMode('RECOVERY');
                          setShowAuthPortalModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-sky-300 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>{t.profileAndSms} (+856)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>

                      {/* 5. Update My Own Profile Image */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          setShowAvatarModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Update My Profile Image</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>

                      {/* 6. Administrator Login / Lock */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginDropdown(false);
                          if (isAdmin) {
                            setIsAdminAuthenticated(false);
                            setRedemptionNotice('Switched to Standard Member View (Admin Post Locked)');
                            setTimeout(() => setRedemptionNotice(null), 3000);
                          } else {
                            setAuthInitialMode('ADMIN');
                            setShowAuthPortalModal(true);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isAdmin
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'text-emerald-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{isAdmin ? 'Admin Active (Click to Lock)' : t.adminLogin}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

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
                onClick={() => {
                  setShowLanguagePicker(!showLanguagePicker);
                  setShowLoginDropdown(false);
                }}
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

        {/* 2A/ HEAD LINE EVENT AND ACTIVITY SLIDE SHOW (Administrator Only Post) */}
        <div className="mb-2 rounded-lg bg-white text-[#850818] px-2.5 py-1.5 shadow-md border border-amber-300/80 flex items-center justify-between gap-2">
          <div
            onClick={() => {
              if (currentEvent) {
                if (isAdmin) openEditEventModal(currentEvent);
                else setViewingEventDetail(currentEvent);
              } else if (isAdmin) {
                openCreateEventModal();
              }
            }}
            className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
            title={
              isAdmin
                ? 'Administrator: Click to Edit Head Line Event & Activity'
                : 'Head Line Event And Activity Slide Show (Click to view details)'
            }
          >
            <span className="px-1.5 py-0.5 rounded bg-[#df1c2d] text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Megaphone className="w-2.5 h-2.5" />
              <span>EVENT</span>
            </span>
            <span className="text-[11px] font-extrabold text-[#850818] truncate">
              {currentEvent
                ? currentEvent.headline
                : 'Head Line Event And Activity Slide Show'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isAdmin ? (
              <button
                type="button"
                onClick={openCreateEventModal}
                className="px-2 py-0.5 rounded bg-[#850818] hover:bg-red-950 text-amber-300 text-[9px] font-black flex items-center gap-0.5 cursor-pointer shadow-xs"
                title="Administrator Only: Post New Event & Activity"
              >
                <Plus className="w-2.5 h-2.5" />
                <span>Post</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthInitialMode('ADMIN');
                  setShowAuthPortalModal(true);
                }}
                className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-[#850818] text-[8px] font-bold flex items-center gap-0.5 cursor-pointer border border-slate-200"
                title="Administrator Only Post — Click to Sign In as Administrator"
              >
                <Lock className="w-2.5 h-2.5 text-[#850818]" />
                <span>Admin Post</span>
              </button>
            )}
          </div>
        </div>

        {/* 2B/ SLIDE SHOW IMAGE EVENT AND ACTIVITY (Administrator Only Post / Edit / Delete) */}
        <div className="mb-3.5 rounded-xl overflow-hidden bg-white text-slate-900 shadow-xl border-2 border-white/95 relative group">
          {currentEvent ? (
            <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
              <img
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                onClick={() => {
                  if (!isAdmin) setViewingEventDetail(currentEvent);
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20 pointer-events-none" />

              {/* Top Row: Event Badge & Date + Admin-Only Post / Edit / Delete Controls */}
              <div className="absolute top-2 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                    {currentEvent.badge || 'EVENT & ACTIVITY'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-semibold flex items-center gap-1 truncate">
                    <Calendar className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                    <span className="truncate">{currentEvent.eventDate}</span>
                  </span>
                </div>

                {/* Admin Quick Post / Upload / Edit / Delete Buttons — SHOWN ONLY TO ADMINISTRATOR */}
                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={openCreateEventModal}
                      className="px-1.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-black flex items-center gap-0.5 shadow cursor-pointer"
                      title="Administrator Only: Post New Event & Activity Image"
                    >
                      <Upload className="w-2.5 h-2.5" />
                      <span>+Post</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditEventModal(currentEvent)}
                      className="p-1 rounded-md bg-sky-500/85 hover:bg-sky-500 text-white shadow cursor-pointer"
                      title="Administrator Only: Edit Event Image & Information"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    {eventPosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          adminDeleteEventPost(currentEvent.id);
                          setActiveEventIdx(0);
                          setRedemptionNotice(`Deleted event "${currentEvent.title}"`);
                          setTimeout(() => setRedemptionNotice(null), 3500);
                        }}
                        className="p-1 rounded-md bg-red-600/85 hover:bg-red-600 text-white shadow cursor-pointer"
                        title="Administrator Only: Delete Event Slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Left / Right Slide Arrows */}
              {eventPosts.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveEventIdx((prev) => (prev - 1 + eventPosts.length) % eventPosts.length)
                    }
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/55 hover:bg-black/80 text-white border border-white/25 flex items-center justify-center cursor-pointer"
                    aria-label="Previous Event Slide"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEventIdx((prev) => (prev + 1) % eventPosts.length)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/55 hover:bg-black/80 text-white border border-white/25 flex items-center justify-center cursor-pointer"
                    aria-label="Next Event Slide"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {/* Bottom Event Title, Information & Slide Indicators */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 flex items-end justify-between gap-2">
                <div
                  onClick={() => {
                    if (isAdmin) openEditEventModal(currentEvent);
                    else setViewingEventDetail(currentEvent);
                  }}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <h4 className="text-xs sm:text-sm font-black text-white leading-tight truncate drop-shadow">
                    {currentEvent.title}
                  </h4>
                  <p className="text-[10px] text-slate-200 leading-snug line-clamp-2 mt-0.5">
                    {currentEvent.information}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-amber-300 font-semibold mt-0.5 truncate">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{currentEvent.location}</span>
                  </div>
                </div>

                {/* Slide Dots */}
                <div className="flex items-center gap-1 shrink-0">
                  {eventPosts.map((evt, idx) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => setActiveEventIdx(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeEventIdx % eventPosts.length
                          ? 'w-4 bg-amber-400'
                          : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Event Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-32 flex flex-col items-center justify-center p-4 text-center">
              <p className="text-xs font-bold text-[#850818]">Slide Show Image Event and Activity</p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={openCreateEventModal}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-[#df1c2d] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Event & Activity</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* ---------------- 2. GOLD METALLIC DMC MEMBERSHIP CARD ---------------- */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#f5a623] via-[#f7b733] to-[#e69110] text-slate-950 p-4 shadow-xl border border-amber-200/60">
          {/* Subtle Metallic Specular Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex items-stretch justify-between gap-3">
            {/* Left Card Details */}
            <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0">
              <div className="flex items-center gap-2.5">
                <DmcOfficialLogo
                  size={50}
                  rounded="full"
                  withGoldRing={false}
                  title="Official DMC R (ໄຊລາຊາ) Logo"
                  className="shadow-md border border-amber-900/20 shrink-0"
                />
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
                    <DmcOfficialLogo size={22} rounded="xl" withGoldRing={false} className="shadow" />
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

          {/* 3B: DOWNLINE ORGANIZE TREE BANNER (Allow Administrator and User to see their Downline Organize) */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white p-3 shadow-lg border border-purple-400/40 flex items-center justify-between gap-2.5">
            <div
              onClick={() => setShowOrganizeModal(true)}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-purple-300/30 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white truncate">
                    Downline Organize (3-Level Tree)
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[8px] font-black uppercase shrink-0">
                    {totalMyDownlines} Members
                  </span>
                </div>
                <div className="text-[10px] text-purple-200 truncate mt-0.5 font-mono">
                  L1: {myDownlines.l1.length} • L2: {myDownlines.l2.length} • L3: {myDownlines.l3.length} ({isAdmin ? 'Admin & User Tree' : 'My Organize Tree'})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowOrganizeModal(true)}
                className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-black cursor-pointer shadow"
              >
                Organize Chart
              </button>
              <button
                type="button"
                onClick={() => onNavigate('network')}
                className="px-2 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold cursor-pointer"
              >
                Full View →
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================================
            Section 4: BANNER PRODUCTS SHOWCASE (Hero Carousel + Product Banners + Admin CRUD)
           ===================================================================== */}
        <div className="pt-2 space-y-3">
          {/* Header Row with Administrator Upload / Add Product Button */}
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
            <div className="flex items-center gap-1 shrink-0">
              {isAdmin && (
                <button
                  type="button"
                  onClick={openCreateProductModal}
                  className="px-2.5 py-1 rounded-full bg-indigo-950 hover:bg-slate-800 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  title="Administrator: Upload New Product Image & Details"
                >
                  <Upload className="w-3 h-3" />
                  <span>+ Product</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('catalog')}
                className="px-2.5 py-1 rounded-full bg-[#df1c2d]/10 hover:bg-[#df1c2d]/20 text-[#df1c2d] text-[10px] font-extrabold transition-colors cursor-pointer shrink-0"
              >
                {t.viewAllFour}
              </button>
            </div>
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

                {/* Top Badges + Admin Edit/Upload/Delete Controls */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#f5a623] to-[#e69110] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow truncate">
                      {currentHeroLocalized.categoryBadge}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-slate-950 text-[10px] font-black font-mono shadow hidden xs:inline">
                      {t.poolLabel}: {formatLakCompact(currentHeroProduct.commissionPoolLak)}
                    </span>
                  </div>

                  {/* Admin Quick Upload Image / Edit / Delete on Hero Product */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditProductModal(currentHeroProduct);
                      }}
                      className="px-2 py-1 rounded-lg bg-sky-500/90 hover:bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                      title="Administrator: Upload Product Image / Edit / Update"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit / Image</span>
                    </button>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adminDeleteProduct(currentHeroProduct.sku);
                          setActiveBannerIdx(0);
                          setRedemptionNotice(`Deleted product ${currentHeroProduct.sku}`);
                          setTimeout(() => setRedemptionNotice(null), 3500);
                        }}
                        className="p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow cursor-pointer"
                        title="Administrator: Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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

          {/* 4B. Visual Banner Products Grid (With Admin Upload Image / Edit / Delete on every card) */}
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
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-amber-300 text-[8px] font-bold uppercase max-w-[55%] truncate">
                      {loc.categoryBadge}
                    </span>

                    {/* Admin Quick Edit/Upload & Delete Buttons */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProductModal(prod);
                        }}
                        className="p-1 rounded-md bg-sky-500/90 hover:bg-sky-500 text-white shadow cursor-pointer"
                        title="Upload Product Image / Edit / Update"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            adminDeleteProduct(prod.sku);
                            setActiveBannerIdx(0);
                            setRedemptionNotice(`Deleted product ${prod.sku}`);
                            setTimeout(() => setRedemptionNotice(null), 3500);
                          }}
                          className="p-1 rounded-md bg-red-600/90 hover:bg-red-600 text-white shadow cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>

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
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProductModal(prod);
                        }}
                        className="text-[9px] font-bold text-sky-700 hover:underline flex items-center gap-0.5 truncate cursor-pointer"
                      >
                        <Camera className="w-2.5 h-2.5 shrink-0" />
                        <span>Image / Edit</span>
                      </button>
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

      {/* Member's Own Circle Profile Image Picker / Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Update My Profile Image</h4>
                  <span className="text-[10px] text-slate-500">
                    {currentMember.name} ({currentMember.memberId})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Member Profile Image Preview */}
            <div className="flex flex-col items-center py-2">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#f5a623] via-[#fff3b0] to-[#e69110] shadow-lg">
                <img
                  src={avatarUrl}
                  alt={currentMember.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2">
                {currentMember.name} • {currentMember.memberId}
              </span>
            </div>

            {/* Upload Member's Own Profile Photo from Device */}
            <div>
              <label className="w-full py-2.5 px-4 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload My Profile Image from Device</span>
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
                      setRedemptionNotice(`Updated profile image for ${currentMember.name}!`);
                      setTimeout(() => setRedemptionNotice(null), 3500);
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
                Or Paste Profile Image URL
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
                      setRedemptionNotice(`Updated profile image for ${currentMember.name}!`);
                      setTimeout(() => setRedemptionNotice(null), 3500);
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

      {/* DMC Support Modal: How New User Member Register Step-by-Step with Video Show + Studio Photo & Location */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5 animate-in zoom-in-95 text-slate-900 max-h-[93vh] overflow-y-auto my-auto border border-purple-200/80">
            {/* Top Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#2e1d87] to-[#df1c2d] text-white shrink-0 shadow-sm">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-slate-900 truncate">
                      DMC Support Center
                    </h4>
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-[#df1c2d] border border-red-200 text-[8px] font-black uppercase shrink-0">
                      VIDEO GUIDE
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    How New Member Register Step-by-Step Video Show & Official Support
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowSupportModal(false);
                    setAuthInitialMode('REGISTER');
                    setShowAuthPortalModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                  title="Open New Member Registration Form"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Register Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSupportModalMode('CREATE');
                    setEditingSupportId(null);
                    setSupportForm({
                      category: 'OFFICE_LOCATION',
                      label: 'DMC Branch / Studio Location',
                      value: 'Dongdok Campus, Vientiane Capital',
                      locationAddress: 'Vientiane Capital, Lao PDR',
                      mapQuery: 'Dongdok Campus, Vientiane Capital, Laos',
                      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dongdok+Campus+Vientiane+Capital+Laos',
                      photoUrl:
                        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
                      notes: 'Open Mon–Sat • 08:30 – 18:00',
                    });
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                  title="Administrator: Add New Location, Photo or Support Contact"
                >
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">+ Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSupportModalMode('REGISTER_VIDEO_GUIDE');
                    setShowSupportModal(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary DMC Support Navigation Bar: Video Registration Guide vs Contacts & Map */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setSupportModalMode('REGISTER_VIDEO_GUIDE')}
                className={`py-2 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  supportModalMode === 'REGISTER_VIDEO_GUIDE'
                    ? 'bg-gradient-to-r from-[#df1c2d] to-[#2e1d87] text-white shadow-md'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">How to Register (Video Show)</span>
              </button>
              <button
                type="button"
                onClick={() => setSupportModalMode('LIST')}
                className={`py-2 px-2.5 rounded-xl text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  supportModalMode === 'LIST' ||
                  supportModalMode === 'EDIT' ||
                  supportModalMode === 'CREATE'
                    ? 'bg-[#2e1d87] text-white shadow-md'
                    : 'text-slate-700 hover:bg-white/70'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Support Contacts & Map ({supportLocations.length})</span>
              </button>
            </div>

            {/* Quick Item Switcher Bar when viewing Contacts & Map */}
            {supportModalMode !== 'REGISTER_VIDEO_GUIDE' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSupportModalMode('LIST')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer ${
                    supportModalMode === 'LIST'
                      ? 'bg-[#2e1d87] text-white shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All Contacts & Map ({supportLocations.length})
                </button>
                {supportLocations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSupportModalMode('EDIT');
                      setEditingSupportId(item.id);
                      setSupportForm({
                        category: item.category,
                        label: item.label,
                        value: item.value,
                        locationAddress: item.locationAddress || item.value,
                        mapQuery: item.mapQuery || item.locationAddress || item.value,
                        mapUrl: item.mapUrl || '',
                        photoUrl: item.photoUrl || '',
                        notes: item.notes || '',
                      });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer flex items-center gap-1 max-w-[140px] truncate ${
                      supportModalMode === 'EDIT' && editingSupportId === item.id
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Pencil className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {supportModalMode === 'REGISTER_VIDEO_GUIDE' ? (
              <MemberRegistrationTutorialGuide
                onStartRegistrationNow={() => {
                  setShowSupportModal(false);
                  setAuthInitialMode('REGISTER');
                  setShowAuthPortalModal(true);
                }}
              />
            ) : supportModalMode === 'LIST' ? (
              <div className="space-y-3 text-xs text-slate-700">
                {supportLocations.map((item) => {
                  const isLocationType =
                    item.category === 'OFFICE_LOCATION' || item.category === 'STUDIO_BRANCH';
                  const hasMapOrLocation = Boolean(
                    isLocationType || item.mapQuery || item.locationAddress
                  );
                  const isMapExpanded =
                    expandedMapItemId === item.id ||
                    (expandedMapItemId === null && isLocationType);
                  const mapSearchQuery =
                    item.mapQuery?.trim() ||
                    item.locationAddress?.trim() ||
                    item.value?.trim() ||
                    'Dongdok Campus, Vientiane Capital, Laos';
                  const googleMapsExternalUrl =
                    item.mapUrl?.trim() ||
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      mapSearchQuery
                    )}`;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                    >
                      {/* Top Info Row + Admin Edit / Upload Photo / Location / Delete Controls */}
                      <div className="p-3 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              item.category === 'HOTLINE' || item.category === 'WHATSAPP'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                : 'bg-blue-50 text-[#1268e8] border border-blue-200/60'
                            }`}
                          >
                            {item.category === 'HOTLINE' ? (
                              <Phone className="w-4 h-4" />
                            ) : item.category === 'WHATSAPP' ? (
                              <MessageCircle className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-slate-500 font-semibold block truncate">
                              {item.label}
                            </span>
                            <strong
                              className={`text-slate-900 block break-words ${
                                item.category === 'HOTLINE' || item.category === 'WHATSAPP'
                                  ? 'font-mono text-xs sm:text-sm'
                                  : 'font-bold text-xs sm:text-sm'
                              }`}
                            >
                              {item.value}
                            </strong>
                            {item.locationAddress && item.locationAddress !== item.value && (
                              <span className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-2.5 h-2.5 text-[#df1c2d] shrink-0" />
                                <span className="truncate">{item.locationAddress}</span>
                              </span>
                            )}
                            {item.notes && (
                              <span className="text-[9px] text-slate-400 block mt-0.5">
                                {item.notes}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Administrator Action Bar on Each Item: Edit, Photo Upload, Location, Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Quick Direct Upload Photo Button */}
                          <label
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 cursor-pointer transition-colors"
                            title="Upload Photo from Device"
                          >
                            <Camera className="w-3.5 h-3.5" />
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
                                    adminUpdateSupportLocation(item.id, {
                                      photoUrl: reader.result,
                                    });
                                    setRedemptionNotice(`Uploaded photo for "${item.label}"!`);
                                    setTimeout(() => setRedemptionNotice(null), 3500);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>

                          {/* Toggle Map & Location Preview */}
                          {hasMapOrLocation && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMapItemId(isMapExpanded ? '__NONE__' : item.id)
                              }
                              className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                                isMapExpanded
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200/80'
                              }`}
                              title="Show / Hide Map & Location"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit / Update Item, Photo & Location */}
                          <button
                            type="button"
                            onClick={() => {
                              setSupportModalMode('EDIT');
                              setEditingSupportId(item.id);
                              setSupportForm({
                                category: item.category,
                                label: item.label,
                                value: item.value,
                                locationAddress: item.locationAddress || item.value,
                                mapQuery: item.mapQuery || item.locationAddress || item.value,
                                mapUrl: item.mapUrl || '',
                                photoUrl: item.photoUrl || '',
                                notes: item.notes || '',
                              });
                            }}
                            className="px-2 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                            title="Edit / Update Photo, Location & Details"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Item */}
                          {supportLocations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                adminDeleteSupportLocation(item.id);
                                setRedemptionNotice(`Deleted "${item.label}" from Support & Locations.`);
                                setTimeout(() => setRedemptionNotice(null), 3500);
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Uploaded Photo Display (with Upload / Replace / Delete Photo controls) */}
                      {item.photoUrl && (
                        <div className="px-3 pb-2.5">
                          <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 group">
                            <img
                              src={item.photoUrl}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/65 text-amber-300 text-[9px] font-bold uppercase flex items-center gap-1">
                              <ImageIcon className="w-2.5 h-2.5" />
                              <span>Location / Studio Photo</span>
                            </span>
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                              <label className="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[9px] font-bold flex items-center gap-1 shadow cursor-pointer">
                                <Upload className="w-2.5 h-2.5 text-[#df1c2d]" />
                                <span>Change Photo</span>
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
                                        adminUpdateSupportLocation(item.id, {
                                          photoUrl: reader.result,
                                        });
                                        setRedemptionNotice(`Updated photo for "${item.label}"!`);
                                        setTimeout(() => setRedemptionNotice(null), 3500);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  adminUpdateSupportLocation(item.id, { photoUrl: '' });
                                  setRedemptionNotice(`Removed photo from "${item.label}".`);
                                  setTimeout(() => setRedemptionNotice(null), 3500);
                                }}
                                className="p-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white shadow cursor-pointer"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive Map & Location Embed (for Head Office / Studio / Expanded Location) */}
                      {hasMapOrLocation && isMapExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36 relative">
                            <iframe
                              title={`Map - ${item.label}`}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                mapSearchQuery
                              )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full border-0"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            />
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px]">
                            <a
                              href={googleMapsExternalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#1268e8] hover:underline font-bold flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">Open Location in Google Maps</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setSupportModalMode('EDIT');
                                setEditingSupportId(item.id);
                                setSupportForm({
                                  category: item.category,
                                  label: item.label,
                                  value: item.value,
                                  locationAddress: item.locationAddress || item.value,
                                  mapQuery: item.mapQuery || item.locationAddress || item.value,
                                  mapUrl: item.mapUrl || '',
                                  photoUrl: item.photoUrl || '',
                                  notes: item.notes || '',
                                });
                              }}
                              className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <MapPin className="w-3 h-3 text-[#df1c2d]" />
                              <span>Update Location</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Administrator Edit / Update / Delete / Upload Photo & Location Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanLabel = supportForm.label.trim() || 'Head Office & Studios';
                  const cleanValue =
                    supportForm.value.trim() || 'Dongdok Campus, Vientiane Capital';
                  const cleanAddress = supportForm.locationAddress.trim() || cleanValue;
                  const cleanMapQuery = supportForm.mapQuery.trim() || cleanAddress;

                  if (supportModalMode === 'EDIT' && editingSupportId) {
                    adminUpdateSupportLocation(editingSupportId, {
                      category: supportForm.category,
                      label: cleanLabel,
                      value: cleanValue,
                      locationAddress: cleanAddress,
                      mapQuery: cleanMapQuery,
                      mapUrl: supportForm.mapUrl.trim(),
                      photoUrl: supportForm.photoUrl.trim(),
                      notes: supportForm.notes.trim(),
                    });
                    setRedemptionNotice(`Updated "${cleanLabel}" (${cleanValue})!`);
                  } else {
                    const created = adminAddSupportLocation({
                      category: supportForm.category,
                      label: cleanLabel,
                      value: cleanValue,
                      locationAddress: cleanAddress,
                      mapQuery: cleanMapQuery,
                      mapUrl: supportForm.mapUrl.trim(),
                      photoUrl: supportForm.photoUrl.trim(),
                      notes: supportForm.notes.trim(),
                    });
                    setExpandedMapItemId(created.id);
                    setRedemptionNotice(`Added new Support & Location "${cleanLabel}"!`);
                  }
                  setTimeout(() => setRedemptionNotice(null), 3500);
                  setSupportModalMode('LIST');
                }}
                className="space-y-3 text-xs"
              >
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#2e1d87]">
                    {supportModalMode === 'EDIT'
                      ? 'Edit, Update, Upload Photo & Location'
                      : 'Add New Support Contact / Studio Location'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#2e1d87] text-white text-[9px] font-bold uppercase">
                    Admin CRUD
                  </span>
                </div>

                {/* Live Photo + Map Preview Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Photo Preview Box */}
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                    {supportForm.photoUrl ? (
                      <>
                        <img
                          src={supportForm.photoUrl}
                          alt="Location Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setSupportForm({ ...supportForm, photoUrl: '' })}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-600 text-white shadow cursor-pointer"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <Camera className="w-5 h-5 mx-auto mb-1 opacity-70" />
                        <span className="text-[10px] block">No Photo Uploaded</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[8px] font-bold">
                      PHOTO PREVIEW
                    </span>
                  </div>

                  {/* Map Preview Box */}
                  <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <iframe
                      title="Location Map Preview"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        supportForm.mapQuery ||
                          supportForm.locationAddress ||
                          supportForm.value ||
                          'Dongdok Campus, Vientiane Capital, Laos'
                      )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                    <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-amber-300 text-[8px] font-bold">
                      MAP LOCATION PREVIEW
                    </span>
                  </div>
                </div>

                {/* Upload Photo from Device or URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="py-2 px-3 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo from Device</span>
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
                            setSupportForm((prev) => ({
                              ...prev,
                              photoUrl: reader.result as string,
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={supportForm.photoUrl}
                    onChange={(e) => setSupportForm({ ...supportForm, photoUrl: e.target.value })}
                    placeholder="Or paste Photo URL (https://...)"
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                {/* Category & Title / Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Type / Category
                    </label>
                    <select
                      value={supportForm.category}
                      onChange={(e) =>
                        setSupportForm({
                          ...supportForm,
                          category: e.target.value as SupportLocationItem['category'],
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold"
                    >
                      <option value="OFFICE_LOCATION">Head Office & Studios</option>
                      <option value="STUDIO_BRANCH">Studio Branch / Showroom</option>
                      <option value="HOTLINE">Hotline Phone (Lao PDR)</option>
                      <option value="WHATSAPP">WhatsApp Official Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Title / Label *
                    </label>
                    <input
                      type="text"
                      required
                      value={supportForm.label}
                      onChange={(e) => setSupportForm({ ...supportForm, label: e.target.value })}
                      placeholder="e.g. Head Office & Studios"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                {/* Main Display Value (Location Name or Phone Number) */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Location Name or Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={supportForm.value}
                    onChange={(e) => setSupportForm({ ...supportForm, value: e.target.value })}
                    placeholder="e.g. Dongdok Campus, Vientiane Capital or +856 20 5511 2233"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold"
                  />
                </div>

                {/* Detailed Address & Map Location Query */}
                <div className="space-y-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-700 uppercase flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#df1c2d]" />
                      <span>Map & Location Settings</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if ('geolocation' in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              const coords = `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
                              setSupportForm((prev) => ({
                                ...prev,
                                mapQuery: coords,
                                mapUrl: `https://www.google.com/maps/search/?api=1&query=${coords}`,
                              }));
                            },
                            () => {
                              setSupportForm((prev) => ({
                                ...prev,
                                mapQuery: 'Dongdok Campus, Vientiane Capital, Laos',
                              }));
                            }
                          );
                        }
                      }}
                      className="px-2 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 text-[9px] font-bold cursor-pointer"
                    >
                      📍 Use Current GPS
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Full Address / Campus / District / Province
                    </label>
                    <input
                      type="text"
                      value={supportForm.locationAddress}
                      onChange={(e) =>
                        setSupportForm({ ...supportForm, locationAddress: e.target.value })
                      }
                      placeholder="e.g. Dongdok Campus, Xaythany District, Vientiane Capital"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Google Maps Pin / Search Query or GPS Coordinates
                    </label>
                    <input
                      type="text"
                      value={supportForm.mapQuery}
                      onChange={(e) => setSupportForm({ ...supportForm, mapQuery: e.target.value })}
                      placeholder="e.g. Dongdok Campus, Vientiane Capital, Laos"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                    {/* Quick Lao Location Presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {[
                        'Dongdok Campus, Vientiane Capital',
                        'That Luang, Vientiane Capital',
                        'Luang Prabang Studio Hub',
                        'Pakse Champasak Hub',
                        'Savannakhet Hub',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() =>
                            setSupportForm((prev) => ({
                              ...prev,
                              value:
                                prev.category === 'OFFICE_LOCATION' ||
                                prev.category === 'STUDIO_BRANCH'
                                  ? preset
                                  : prev.value,
                              locationAddress: `${preset}, Lao PDR`,
                              mapQuery: `${preset}, Laos`,
                            }))
                          }
                          className="px-2 py-0.5 rounded-md bg-slate-200/80 hover:bg-amber-300 text-slate-800 text-[9px] font-semibold cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">
                      Google Maps Link URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={supportForm.mapUrl}
                      onChange={(e) => setSupportForm({ ...supportForm, mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Notes / Operating Hours */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Notes / Operating Hours
                  </label>
                  <input
                    type="text"
                    value={supportForm.notes}
                    onChange={(e) => setSupportForm({ ...supportForm, notes: e.target.value })}
                    placeholder="e.g. Open Mon–Sat 08:30–18:00 • Main Studio & Service Center"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                {/* Save / Update / Delete Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {supportModalMode === 'EDIT' &&
                    editingSupportId &&
                    supportLocations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          adminDeleteSupportLocation(editingSupportId);
                          setSupportModalMode('LIST');
                          setRedemptionNotice('Deleted item from Support & Locations.');
                          setTimeout(() => setRedemptionNotice(null), 3500);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={() => setSupportModalMode('LIST')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    {supportModalMode === 'EDIT' ? 'Update & Save' : 'Save Location'}
                  </button>
                </div>
              </form>
            )}

            {(supportModalMode === 'LIST' || supportModalMode === 'REGISTER_VIDEO_GUIDE') && (
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close DMC Support
              </button>
            )}
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

      {/* 2/ Administrator Event & Activity Post, Image Upload, Edit & Delete Modal */}
      {showEventAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-[#df1c2d]">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {eventModalMode === 'EDIT'
                      ? 'Edit Event & Activity Slide'
                      : 'Post New Event & Activity'}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Administrator Post, Image, Information, Event & Activity
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEventAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Switcher between Existing Events or + New Post */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={openCreateEventModal}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer ${
                  eventModalMode === 'CREATE'
                    ? 'bg-[#df1c2d] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>+ New Post</span>
              </button>
              {eventPosts.map((evt, idx) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => openEditEventModal(evt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer truncate max-w-[120px] ${
                    eventModalMode === 'EDIT' && editingEventId === evt.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Slide #{idx + 1}: {evt.title}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveEventPost} className="space-y-3 text-xs">
              {/* Live Event Slide Preview */}
              <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                <img
                  src={eventForm.imageUrl}
                  alt={eventForm.title || 'Event Preview'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  {eventForm.badge || 'EVENT & ACTIVITY'}
                </span>
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <div className="text-xs font-black truncate">
                    {eventForm.title || 'Slide Show Image Event and Activity'}
                  </div>
                  <div className="text-[10px] text-slate-200 line-clamp-1">
                    {eventForm.information || 'Event information preview...'}
                  </div>
                </div>
              </div>

              {/* Upload Event Image from Phone/Computer or URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="py-2 px-3 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Event Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEventImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={eventForm.imageUrl}
                  onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                  placeholder="Or paste Image URL (https://...)"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              {/* Headline for Head Line Event And Activity Slide Show */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Head Line Event & Activity Text *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.headline}
                  onChange={(e) => setEventForm({ ...eventForm, headline: e.target.value })}
                  placeholder="e.g. DMC Xayraxa Live Studio Showcase — Vientiane Capital"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                />
              </div>

              {/* Slide Title & Badge */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Event / Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Grand Music Concert & Open House"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={eventForm.badge}
                    onChange={(e) => setEventForm({ ...eventForm, badge: e.target.value })}
                    placeholder="LIVE EVENT"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-bold uppercase"
                  />
                </div>
              </div>

              {/* Event Date & Location */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    placeholder="25 Oct 2026 • 18:00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="DMC Central Studio, Vientiane"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Detailed Information */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Information & Activity Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={eventForm.information}
                  onChange={(e) => setEventForm({ ...eventForm, information: e.target.value })}
                  placeholder="Enter full Event & Activity information, schedule, and highlights..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              {/* Save / Delete Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {eventModalMode === 'EDIT' && editingEventId && eventPosts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      adminDeleteEventPost(editingEventId);
                      setActiveEventIdx(0);
                      setShowEventAdminModal(false);
                      setRedemptionNotice('Deleted Event & Activity slide.');
                      setTimeout(() => setRedemptionNotice(null), 3500);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowEventAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  {eventModalMode === 'EDIT' ? 'Update Event' : 'Post Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3/ Administrator Product Image Upload, Edit, Delete & Update Modal */}
      {showProductAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-900">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {productModalMode === 'EDIT'
                      ? `Edit / Update Product (${productForm.sku})`
                      : 'Upload & Add New Product'}
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Administrator Product Image Upload, Edit, Delete & Update
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProductAdminModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Product Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={openCreateProductModal}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer ${
                  productModalMode === 'CREATE'
                    ? 'bg-[#df1c2d] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Plus className="w-3 h-3" />
                <span>+ Add Product</span>
              </button>
              {products.map((p) => (
                <button
                  key={p.sku}
                  type="button"
                  onClick={() => openEditProductModal(p)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 cursor-pointer truncate max-w-[130px] ${
                    productModalMode === 'EDIT' && productForm.sku === p.sku
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.titleEn}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProductAdmin} className="space-y-3 text-xs">
              {/* Product Image Live Preview */}
              <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                <img
                  src={productForm.imageUrl}
                  alt={productForm.titleEn || 'Product Preview'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[9px] font-mono font-bold">
                  {productForm.sku}
                </span>
                <span className="absolute bottom-2 left-2.5 text-white font-black font-mono text-xs">
                  {formatNumberWithCommas(Number(productForm.priceLak) || 0)} LAK
                </span>
              </div>

              {/* Upload Product Image from Device or URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="py-2 px-3 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Product Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="Or paste Image URL (https://...)"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Product SKU *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={productModalMode === 'EDIT'}
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono uppercase disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as ProductSKU['category'],
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold"
                  >
                    <option value="MUSIC_PACKAGE">MUSIC_PACKAGE</option>
                    <option value="GUITAR">GUITAR</option>
                    <option value="AUDIO_GEAR">AUDIO_GEAR</option>
                    <option value="ACCESSORY">ACCESSORY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Product Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.titleEn}
                  onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                  placeholder="e.g. DMC Signature Acoustic Guitar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Title (Lao / ພາສາລາວ)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleLo}
                    onChange={(e) => setProductForm({ ...productForm, titleLo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Title (Thai / ไทย)
                  </label>
                  <input
                    type="text"
                    value={productForm.titleTh}
                    onChange={(e) => setProductForm({ ...productForm, titleTh: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Price (LAK) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={productForm.priceLak}
                    onChange={(e) =>
                      setProductForm({ ...productForm, priceLak: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pool (LAK) *
                  </label>
                  <input
                    type="number"
                    step="10000"
                    required
                    value={productForm.commissionPoolLak}
                    onChange={(e) =>
                      setProductForm({ ...productForm, commissionPoolLak: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={productForm.stockSellable}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockSellable: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Product Information / Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.descriptionEn}
                  onChange={(e) => setProductForm({ ...productForm, descriptionEn: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              {/* Action Buttons: Delete, Cancel, Save/Update */}
              <div className="flex items-center gap-2 pt-2">
                {productModalMode === 'EDIT' && products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      adminDeleteProduct(productForm.sku);
                      setActiveBannerIdx(0);
                      setShowProductAdminModal(false);
                      setRedemptionNotice(`Deleted product ${productForm.sku}`);
                      setTimeout(() => setRedemptionNotice(null), 3500);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowProductAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  {productModalMode === 'EDIT' ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read-Only Event & Activity Detail Modal for Users */}
      {viewingEventDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="relative h-48 w-full bg-slate-900">
              <img
                src={viewingEventDetail.imageUrl}
                alt={viewingEventDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                {viewingEventDetail.badge || 'EVENT & ACTIVITY'}
              </span>
              <button
                type="button"
                onClick={() => setViewingEventDetail(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <h4 className="text-base font-black leading-tight">{viewingEventDetail.title}</h4>
                <div className="flex items-center gap-3 text-[11px] text-amber-300 font-semibold mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {viewingEventDetail.eventDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {viewingEventDetail.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-[#850818] font-bold">
                {viewingEventDetail.headline}
              </div>
              <p className="text-slate-700 leading-relaxed">{viewingEventDetail.information}</p>
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">
                  Note: Only Administrator can Post or Edit Event & Activity
                </span>
                <button
                  type="button"
                  onClick={() => setViewingEventDetail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Downline Organize Tree Modal (Accessible directly from Home Screen for both Admin & User) */}
      {showOrganizeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-950 border-2 border-purple-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm sm:text-base font-black text-white">
                  Downline Organize — 3-Level Unilevel Hierarchy
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowOrganizeModal(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <DownlineOrganizeTree />
          </div>
        </div>
      )}
    </div>
  );
};
