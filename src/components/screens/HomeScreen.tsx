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

import React, { useState, useEffect, useMemo } from 'react';
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
  Search,
  Truck,
  Briefcase,
  ArrowRight,
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
import { DmcPricingStructureCard } from '../common/DmcPricingStructureCard';
import {
  LaoShippingCarrierId,
  ProductSKU,
  EventActivityPost,
  SupportLocationItem,
  StaffPosition,
  DMC_STAFF_POSITIONS,
  DmcStaffMember,
  DmcPromotionItem,
  DMC_STANDARD_PRICING,
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
    staffMembers,
    adminAddStaffMember,
    adminUpdateStaffMember,
    adminDeleteStaffMember,
    adminResetStaffMembers,
    adminUpgradeMemberToStaff,
    adminDowngradeStaffToMember,
    promotions,
    adminAddPromotion,
    adminUpdatePromotion,
    adminDeletePromotion,
    adminResetPromotions,
    customHomeIcons,
    adminUpdateHomeIcon,
    shippingCarriers,
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

  // Home Header Search Box state (placed right below Member Profile Header & above Event section)
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [isHomeSearchOpen, setIsHomeSearchOpen] = useState(false);
  const [homeSearchCategory, setHomeSearchCategory] = useState<
    'ALL' | 'PRODUCTS' | 'STAFF' | 'SHIPPING' | 'EVENTS' | 'MEMBERS'
  >('ALL');

  const normalizedHomeQuery = homeSearchQuery.trim().toLowerCase();

  const homeSearchResults = useMemo(() => {
    const q = normalizedHomeQuery;

    const matchedProducts = products.filter((p) => {
      if (!q) return true;
      const loc = getLocalizedProduct(p, language);
      return (
        p.sku.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        (p.titleLo && p.titleLo.toLowerCase().includes(q)) ||
        (p.titleTh && p.titleTh.toLowerCase().includes(q)) ||
        loc.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        String(p.priceLak).includes(q)
      );
    });

    const matchedStaff = staffMembers.filter((s) => {
      if (!q) return true;
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q) ||
        s.staffCode.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q) ||
        s.bioOrDuty.toLowerCase().includes(q)
      );
    });

    const matchedShipping = shippingCarriers.filter((c) => {
      if (!q) return true;
      return (
        c.nameEn.toLowerCase().includes(q) ||
        c.nameLo.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        String(c.baseFeeLak).includes(q)
      );
    });

    const matchedEvents = eventPosts.filter((e) => {
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.headline.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.information.toLowerCase().includes(q)
      );
    });

    const matchedSupport = supportLocations.filter((loc) => {
      if (!q) return true;
      return (
        loc.label.toLowerCase().includes(q) ||
        loc.value.toLowerCase().includes(q) ||
        (loc.locationAddress && loc.locationAddress.toLowerCase().includes(q))
      );
    });

    const matchedMembers = allMembers.filter((m) => {
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
      );
    });

    return {
      products: matchedProducts,
      staff: matchedStaff,
      shipping: matchedShipping,
      events: matchedEvents,
      support: matchedSupport,
      members: matchedMembers,
      totalCount:
        matchedProducts.length +
        matchedStaff.length +
        matchedShipping.length +
        matchedEvents.length +
        matchedSupport.length +
        matchedMembers.length,
    };
  }, [
    normalizedHomeQuery,
    products,
    staffMembers,
    shippingCarriers,
    eventPosts,
    supportLocations,
    allMembers,
    language,
  ]);

  const [activeQrModal, setActiveQrModal] = useState<'MEMBER' | 'REFERRAL' | null>(null);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showPromotionsModal, setShowPromotionsModal] = useState(false);
  const [promotionModalMode, setPromotionModalMode] = useState<'LIST' | 'CREATE' | 'EDIT'>('LIST');
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [promotionForm, setPromotionForm] = useState<{
    code: string;
    badge: string;
    title: string;
    titleLo: string;
    description: string;
    priceLak: number;
    originalPriceLak: number;
    bonusPoolLak: number;
    validUntil: string;
    imageUrl: string;
    targetTab: DmcPromotionItem['targetTab'];
    targetSku: string;
    status: DmcPromotionItem['status'];
  }>({
    code: 'PROMO-DMC-004',
    badge: 'SPECIAL MUSIC INCENTIVE',
    title: '',
    titleLo: '',
    description: '',
    priceLak: 1600000,
    originalPriceLak: 2000000,
    bonusPoolLak: 700000,
    validUntil: '31 Dec 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
    targetTab: 'musichub',
    targetSku: 'MUSIC_SINGLE_1600',
    status: 'ACTIVE',
  });
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaffPositionFilter, setSelectedStaffPositionFilter] = useState<StaffPosition | 'ALL'>('ALL');
  const [staffModalMode, setStaffModalMode] = useState<'LIST' | 'CREATE' | 'EDIT' | 'ICONS' | 'UPGRADE_MEMBER'>('LIST');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [selectedMemberToUpgradeId, setSelectedMemberToUpgradeId] = useState<string>('');
  const [memberUpgradeFilterQuery, setMemberUpgradeFilterQuery] = useState<string>('');
  const [staffForm, setStaffForm] = useState<{
    staffCode: string;
    fullName: string;
    position: StaffPosition;
    phone: string;
    email: string;
    branch: string;
    avatarUrl: string;
    customIconUrl: string;
    bioOrDuty: string;
    status: DmcStaffMember['status'];
  }>({
    staffCode: 'DMC-STF-009',
    fullName: '',
    position: 'Teacher',
    phone: '+856 20 ',
    email: '',
    branch: 'Dongdok Campus Studio Hub, Vientiane',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    customIconUrl: '',
    bioOrDuty: '',
    status: 'ACTIVE',
  });
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
    marketPriceLak: number;
    priceLak: number;
    memberDiscountLak: number;
    commissionPoolLak: number;
    l1Share: number;
    l2Share: number;
    l3Share: number;
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
    marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
    priceLak: DMC_STANDARD_PRICING.memberPriceLak,
    memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
    commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
    l1Share: DMC_STANDARD_PRICING.l1Percent,
    l2Share: DMC_STANDARD_PRICING.l2Percent,
    l3Share: DMC_STANDARD_PRICING.l3Percent,
    stockSellable: 20,
    itemType: 'PHYSICAL',
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  });

  const openCreateProductModal = () => {
    if (!isAdmin) {
      setAuthInitialMode('ADMIN');
      setShowAuthPortalModal(true);
      return;
    }
    setProductModalMode('CREATE');
    setProductForm({
      sku: `DMC-PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'GUITAR',
      titleEn: '',
      titleLo: '',
      titleTh: '',
      descriptionEn: '',
      marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
      priceLak: DMC_STANDARD_PRICING.memberPriceLak,
      memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
      commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
      l1Share: DMC_STANDARD_PRICING.l1Percent,
      l2Share: DMC_STANDARD_PRICING.l2Percent,
      l3Share: DMC_STANDARD_PRICING.l3Percent,
      stockSellable: 25,
      itemType: 'PHYSICAL',
      imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    });
    setShowProductAdminModal(true);
  };

  const openEditProductModal = (prod: ProductSKU) => {
    if (!isAdmin) {
      setAuthInitialMode('ADMIN');
      setShowAuthPortalModal(true);
      return;
    }
    setProductModalMode('EDIT');
    const marketPrice =
      prod.marketPriceLak ??
      (prod.sku === 'MUSIC_SINGLE_1600' ? prod.priceLak : DMC_STANDARD_PRICING.marketPriceLak);
    const memberDiscount =
      prod.memberDiscountLak ?? Math.max(0, marketPrice - prod.priceLak);
    setProductForm({
      sku: prod.sku,
      category: prod.category,
      titleEn: prod.titleEn,
      titleLo: prod.titleLo || prod.titleEn,
      titleTh: prod.titleTh || prod.titleEn,
      descriptionEn: prod.descriptionEn,
      marketPriceLak: marketPrice,
      priceLak: prod.priceLak,
      memberDiscountLak: memberDiscount,
      commissionPoolLak: prod.commissionPoolLak,
      l1Share:
        prod.splitRule.ruleType === 'POOL_PERCENTAGE'
          ? prod.splitRule.l1Share
          : DMC_STANDARD_PRICING.l1Percent,
      l2Share:
        prod.splitRule.ruleType === 'POOL_PERCENTAGE'
          ? prod.splitRule.l2Share
          : DMC_STANDARD_PRICING.l2Percent,
      l3Share:
        prod.splitRule.ruleType === 'POOL_PERCENTAGE'
          ? prod.splitRule.l3Share
          : DMC_STANDARD_PRICING.l3Percent,
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
    const marketPrice = Number(productForm.marketPriceLak) >= 0 ? Number(productForm.marketPriceLak) : DMC_STANDARD_PRICING.marketPriceLak;
    const memberPrice = Number(productForm.priceLak) >= 0 ? Number(productForm.priceLak) : DMC_STANDARD_PRICING.memberPriceLak;
    const memberDiscount =
      Number(productForm.memberDiscountLak) >= 0
        ? Number(productForm.memberDiscountLak)
        : Math.max(0, marketPrice - memberPrice);
    const commPool = Number(productForm.commissionPoolLak) >= 0 ? Number(productForm.commissionPoolLak) : DMC_STANDARD_PRICING.commissionPoolLak;
    const l1 = Number(productForm.l1Share) >= 0 ? Number(productForm.l1Share) : 50;
    const l2 = Number(productForm.l2Share) >= 0 ? Number(productForm.l2Share) : 30;
    const l3 = Number(productForm.l3Share) >= 0 ? Number(productForm.l3Share) : 20;

    if (productModalMode === 'EDIT') {
      adminUpdateProduct(cleanSku, {
        category: productForm.category,
        titleEn,
        titleLo: productForm.titleLo.trim() || titleEn,
        titleTh: productForm.titleTh.trim() || titleEn,
        descriptionEn: productForm.descriptionEn.trim(),
        marketPriceLak: marketPrice,
        priceLak: memberPrice,
        memberDiscountLak: memberDiscount,
        commissionPoolLak: commPool,
        splitRule: {
          ruleType: 'POOL_PERCENTAGE',
          l1Share: l1,
          l2Share: l2,
          l3Share: l3,
        },
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
        marketPriceLak: marketPrice,
        priceLak: memberPrice,
        memberDiscountLak: memberDiscount,
        commissionPoolLak: commPool,
        splitRule: {
          ruleType: 'POOL_PERCENTAGE',
          l1Share: l1,
          l2Share: l2,
          l3Share: l3,
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
              <div className="text-[9px] font-black text-amber-300 tracking-wider uppercase leading-tight mt-0.5 truncate flex items-center gap-1 flex-wrap">
                <span>{isActive ? t.activeMember : t.freeMember}</span>
                {(currentMember.isStaff || staffMembers.some((s) => s.memberId === currentMember.memberId)) && (
                  <span className="px-1.5 py-0.2 rounded bg-sky-400 text-slate-950 text-[8px] font-black uppercase shrink-0">
                    Staff: {currentMember.staffPosition || staffMembers.find((s) => s.memberId === currentMember.memberId)?.position}
                  </span>
                )}
                {isAdmin && (
                  <span className="px-1 py-0.2 rounded bg-emerald-400 text-slate-950 text-[8px] font-black uppercase shrink-0">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls: Drop Down List Sign In / Sign Out + Bell + Language Selector */}
          <div className="flex items-center gap-1 shrink-0">
            {/* 1/ DROP DOWN LIST: SIGN IN / SIGN OUT */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowLoginDropdown(!showLoginDropdown);
                  setShowLanguagePicker(false);
                }}
                className="px-2 py-1.5 rounded-xl border border-amber-300/80 bg-black/50 hover:bg-black/70 text-white font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1 shadow-md"
                title="Drop Down List: Sign In / Sign Out"
              >
                <LogIn className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="font-extrabold text-amber-300 whitespace-nowrap leading-none">
                  Sign In / Out
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
                      <span>Sign In / Sign Out Menu</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                          isLoggedOut
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {isLoggedOut ? 'SIGNED OUT' : 'ONLINE'}
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

                    {/* PRIMARY DROP DOWN OPTIONS: 1. SIGN IN & 2. SIGN OUT */}
                    <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                      {/* 1. Sign In */}
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
                          <span>1. {t.logIn} (Member Sign In)</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-900" />
                      </button>

                      {/* 2. Sign Out */}
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
                          <span>2. {t.logOut}</span>
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

        {/* 1B/ HOME SEARCH BOX & SEARCH BUTTON (Placed right below Profile Header & above Event Section) */}
        <div className="relative mt-3 mb-3.5">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 shadow-md border-2 transition-all ${
              isHomeSearchOpen
                ? 'border-amber-400 ring-2 ring-amber-300/40'
                : 'border-amber-300/90 hover:border-amber-400'
            }`}
          >
            <Search className="w-4 h-4 text-[#850818] shrink-0 stroke-[2.5]" />
            <input
              type="text"
              value={homeSearchQuery}
              onFocus={() => {
                setIsHomeSearchOpen(true);
                setShowLoginDropdown(false);
                setShowLanguagePicker(false);
              }}
              onChange={(e) => {
                setHomeSearchQuery(e.target.value);
                if (!isHomeSearchOpen) setIsHomeSearchOpen(true);
              }}
              placeholder="Search products, music, staff, shipping, events..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {homeSearchQuery && (
              <button
                type="button"
                onClick={() => setHomeSearchQuery('')}
                className="p-0.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer shrink-0"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsHomeSearchOpen(!isHomeSearchOpen)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#850818] to-[#b80d22] hover:from-[#69030e] hover:to-[#990c1e] text-amber-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs transition-all cursor-pointer shrink-0 border border-amber-400/50"
            >
              <Search className="w-2.5 h-2.5 text-amber-300 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>

          {/* Instant Search Dropdown Results Panel */}
          {isHomeSearchOpen && (
            <>
              <div
                className="fixed inset-0 z-[85]"
                onClick={() => setIsHomeSearchOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/98 backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl shadow-[0_22px_55px_rgba(0,0,0,0.9)] p-3 z-[95] space-y-2.5 animate-in fade-in zoom-in-95 text-slate-100">
                {/* Search Dropdown Header */}
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {normalizedHomeQuery
                        ? `Search Results (${homeSearchResults.totalCount})`
                        : 'Quick Search Directory'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsHomeSearchOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {(
                    [
                      { id: 'ALL', label: 'All' },
                      { id: 'PRODUCTS', label: `Products (${homeSearchResults.products.length})` },
                      { id: 'STAFF', label: `Staff (${homeSearchResults.staff.length})` },
                      { id: 'SHIPPING', label: `Shipping (${homeSearchResults.shipping.length})` },
                      { id: 'EVENTS', label: `Events (${homeSearchResults.events.length})` },
                      { id: 'MEMBERS', label: `Members (${homeSearchResults.members.length})` },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setHomeSearchCategory(tab.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer ${
                        homeSearchCategory === tab.id
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Scrollable Search Results */}
                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {/* 1. Products & Music Packages */}
                  {(homeSearchCategory === 'ALL' || homeSearchCategory === 'PRODUCTS') &&
                    homeSearchResults.products.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3 text-rose-400" />
                            <span>Products & Music Packages</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsHomeSearchOpen(false);
                              onNavigate('musichub');
                            }}
                            className="text-amber-400 hover:underline text-[10px] cursor-pointer"
                          >
                            Open Shop →
                          </button>
                        </div>
                        {homeSearchResults.products
                          .slice(0, homeSearchCategory === 'PRODUCTS' ? 10 : 3)
                          .map((prod) => {
                            const loc = getLocalizedProduct(prod, language);
                            return (
                              <button
                                key={prod.sku}
                                type="button"
                                onClick={() => {
                                  setIsHomeSearchOpen(false);
                                  setSelectedBannerProductForQr(prod);
                                }}
                                className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer group"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={prod.imageUrl}
                                    alt={loc.title}
                                    className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                                      {loc.title}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                                      <span>{prod.sku}</span>
                                      <span>•</span>
                                      <span className="text-amber-400 font-bold">
                                        {formatNumberWithCommas(prod.priceLak)} LAK
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black shrink-0">
                                  Buy / View
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    )}

                  {/* 2. DMC Staff (8 Positions) */}
                  {(homeSearchCategory === 'ALL' || homeSearchCategory === 'STAFF') &&
                    homeSearchResults.staff.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-sky-400" />
                            <span>DMC Staff (8 Positions)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsHomeSearchOpen(false);
                              setSelectedStaffPositionFilter('ALL');
                              setStaffModalMode('LIST');
                              setShowStaffModal(true);
                            }}
                            className="text-sky-400 hover:underline text-[10px] cursor-pointer"
                          >
                            All Staff →
                          </button>
                        </div>
                        {homeSearchResults.staff
                          .slice(0, homeSearchCategory === 'STAFF' ? 12 : 3)
                          .map((stf) => (
                            <button
                              key={stf.id}
                              type="button"
                              onClick={() => {
                                setIsHomeSearchOpen(false);
                                setSelectedStaffPositionFilter(stf.position);
                                setStaffModalMode('LIST');
                                setShowStaffModal(true);
                              }}
                              className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={stf.avatarUrl}
                                  alt={stf.fullName}
                                  className="w-8 h-8 rounded-full object-cover border border-sky-400/50 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                                    <span className="truncate">{stf.fullName}</span>
                                    <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[9px] font-black shrink-0">
                                      {stf.position}
                                    </span>
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400 truncate">
                                    {stf.staffCode} • {stf.phone}
                                  </div>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                            </button>
                          ))}
                      </div>
                    )}

                  {/* 3. Lao Shipping Carriers */}
                  {(homeSearchCategory === 'ALL' || homeSearchCategory === 'SHIPPING') &&
                    homeSearchResults.shipping.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3 text-amber-400" />
                            <span>Lao Shipping Carriers</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsHomeSearchOpen(false);
                              setShowShippingModal(true);
                            }}
                            className="text-amber-400 hover:underline text-[10px] cursor-pointer"
                          >
                            Manage Shipping →
                          </button>
                        </div>
                        {homeSearchResults.shipping
                          .slice(0, homeSearchCategory === 'SHIPPING' ? 10 : 2)
                          .map((car) => (
                            <button
                              key={car.id}
                              type="button"
                              onClick={() => {
                                setIsHomeSearchOpen(false);
                                setShowShippingModal(true);
                              }}
                              className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate">
                                  {car.nameEn} ({car.nameLo})
                                </div>
                                <div className="text-[10px] font-mono text-slate-400">
                                  {car.code} • {car.estimatedDays}
                                </div>
                              </div>
                              <span className="text-[11px] font-mono font-black text-amber-400 shrink-0">
                                {formatNumberWithCommas(car.baseFeeLak)} LAK
                              </span>
                            </button>
                          ))}
                      </div>
                    )}

                  {/* 4. Events & Support Locations */}
                  {(homeSearchCategory === 'ALL' || homeSearchCategory === 'EVENTS') &&
                    (homeSearchResults.events.length > 0 ||
                      homeSearchResults.support.length > 0) && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          <span>Events & Support Locations</span>
                        </div>
                        {homeSearchResults.events.slice(0, 3).map((evt) => (
                          <button
                            key={evt.id}
                            type="button"
                            onClick={() => {
                              setIsHomeSearchOpen(false);
                              setViewingEventDetail(evt);
                            }}
                            className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2.5 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">
                                {evt.title}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                                <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                <span className="truncate">
                                  {evt.eventDate} • {evt.location}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                  {/* 5. Members & Network */}
                  {(homeSearchCategory === 'ALL' || homeSearchCategory === 'MEMBERS') &&
                    homeSearchResults.members.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-emerald-400" />
                            <span>Members & Network</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsHomeSearchOpen(false);
                              setShowOrganizeModal(true);
                            }}
                            className="text-emerald-400 hover:underline text-[10px] cursor-pointer"
                          >
                            Organize Tree →
                          </button>
                        </div>
                        {homeSearchResults.members
                          .slice(0, homeSearchCategory === 'MEMBERS' ? 10 : 3)
                          .map((mem) => {
                            const existingStaffRecord = staffMembers.find(
                              (s) => s.memberId === mem.memberId
                            );
                            const isMemberStaff = Boolean(mem.isStaff || existingStaffRecord);
                            const memberStaffPos =
                              mem.staffPosition || existingStaffRecord?.position;
                            return (
                              <div
                                key={mem.memberId}
                                className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between gap-2 transition-colors group"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsHomeSearchOpen(false);
                                    setShowOrganizeModal(true);
                                  }}
                                  className="min-w-0 flex-1 text-left cursor-pointer"
                                >
                                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate flex items-center gap-1.5">
                                    <span className="truncate">{mem.name}</span>
                                    {isMemberStaff && (
                                      <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[8px] font-black uppercase shrink-0">
                                        Staff: {memberStaffPos}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                                    <span>{mem.memberId}</span>
                                    <span>•</span>
                                    <span>{mem.phone}</span>
                                  </div>
                                </button>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isAdmin && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setIsHomeSearchOpen(false);
                                        setSelectedMemberToUpgradeId(mem.memberId);
                                        setStaffForm((prev) => ({
                                          ...prev,
                                          staffCode:
                                            existingStaffRecord?.staffCode ||
                                            mem.staffCode ||
                                            `DMC-STF-${mem.memberId}`,
                                          fullName: mem.name.replace(/\s*\(.*?\)\s*/g, ''),
                                          position: memberStaffPos || 'Teacher',
                                          phone: mem.phone,
                                          email: mem.email || `${mem.memberId.toLowerCase()}@dmcxayraxa.la`,
                                          branch:
                                            existingStaffRecord?.branch ||
                                            mem.staffBranch ||
                                            'Dongdok Campus Studio Hub, Vientiane',
                                          avatarUrl: mem.avatarUrl || prev.avatarUrl,
                                          bioOrDuty:
                                            existingStaffRecord?.bioOrDuty ||
                                            mem.staffBioOrDuty ||
                                            '',
                                        }));
                                        setStaffModalMode('UPGRADE_MEMBER');
                                        setShowStaffModal(true);
                                      }}
                                      className="px-2 py-1 rounded-lg bg-gradient-to-r from-[#0088ff] to-[#0066cc] hover:from-sky-500 hover:to-blue-600 text-white text-[9px] font-black uppercase cursor-pointer shadow-xs"
                                      title="Administrator: Upgrade Member to Staff"
                                    >
                                      {isMemberStaff ? 'Edit Staff Role' : '↑ Upgrade to Staff'}
                                    </button>
                                  )}
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
                                      mem.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : 'bg-amber-500/20 text-amber-300'
                                    }`}
                                  >
                                    {mem.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                      ? 'ACTIVE'
                                      : 'FREE'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                  {/* Empty state */}
                  {homeSearchResults.totalCount === 0 && (
                    <div className="py-5 text-center text-xs text-slate-400">
                      No matching items found for "{homeSearchQuery}". Try searching for Guitar, Music, Staff, Anousith, or Member ID.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 2A/ HEAD LINE EVENT AND ACTIVITY SLIDE SHOW (Administrator Only Post) */}
        <div className="mt-1 mb-2.5 rounded-lg bg-white text-[#850818] px-2.5 py-1.5 shadow-md border border-amber-300/80 flex items-center justify-between gap-2">
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

          {/* Row 2: 5 Colorful Cards (Academy, Music Hub, Staff, Promotions, Support) with Clean White Icons */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {/* Button 4: Academy (Cyan Gradient with Clean White Graduation Cap Icon) */}
            <button
              onClick={() => onNavigate('academy')}
              className="bg-gradient-to-br from-[#13a8c7] to-[#0c829b] shadow-md shadow-cyan-500/20 text-white rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden group-hover:bg-white/25 transition-colors">
                {customHomeIcons.academy ? (
                  <img
                    src={customHomeIcons.academy}
                    alt="Academy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Clean White Mortarboard Graduation Cap Icon */
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M12 3L1 8.5L12 14L21 9.5V16H23V8.5L12 3ZM5 12.18V16.18C5 18.4 8.13 20.5 12 20.5C15.87 20.5 19 18.4 19 16.18V12.18L12 15.68L5 12.18Z" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                {t.btnAcademy}
              </span>
            </button>

            {/* Button 5: Music Hub (Electric Sky Blue Gradient with Clean White Headphones Icon — Placed between Academy and Staff) */}
            <button
              onClick={() => onNavigate('musichub')}
              className="bg-gradient-to-br from-[#0088ff] to-[#0066cc] shadow-md shadow-blue-400/20 text-white rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden group-hover:bg-white/25 transition-colors">
                {customHomeIcons.musicHub ? (
                  <img
                    src={customHomeIcons.musicHub}
                    alt="Music Hub"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Headphones className="w-4 h-4 text-white stroke-[2.2]" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                {t.btnMusicHub}
              </span>
            </button>

            {/* Button 6: Staff (Electric Sky Blue Gradient with Clean White 3-People Team Icon — Opens DMC Staff & 8 Positions Modal) */}
            <button
              onClick={() => {
                setStaffModalMode('LIST');
                setShowStaffModal(true);
              }}
              className="bg-gradient-to-br from-[#0088ff] to-[#0066cc] shadow-md shadow-blue-400/20 text-white rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group relative"
              title="DMC Staff & 8 Positions (Administrator, Assistance, Accounting, Marketing, IT, Teacher, Fencer, Part time)"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden group-hover:bg-white/25 transition-colors">
                {customHomeIcons.staff ? (
                  <img
                    src={customHomeIcons.staff}
                    alt="DMC Staff"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Clean White 3-People Staff Team Icon */
                  <svg viewBox="0 0 28 22" className="w-5 h-5 text-white" fill="currentColor">
                    {/* Left Person */}
                    <circle cx="6.5" cy="7.5" r="2.7" opacity="0.9" />
                    <path d="M1.5 18C1.5 14.3 3.7 12.5 6.5 12.5C7.4 12.5 8.2 12.7 8.9 13.1C7.8 14.3 7.2 16 7.2 18H1.5Z" opacity="0.9" />
                    {/* Right Person */}
                    <circle cx="21.5" cy="7.5" r="2.7" opacity="0.9" />
                    <path d="M26.5 18C26.5 14.3 24.3 12.5 21.5 12.5C20.6 12.5 19.8 12.7 19.1 13.1C20.2 14.3 20.8 16 20.8 18H26.5Z" opacity="0.9" />
                    {/* Center Leader Person */}
                    <circle cx="14" cy="5.8" r="3.4" />
                    <path d="M8.5 18.5C8.5 14.2 10.9 11.8 14 11.8C17.1 11.8 19.5 14.2 19.5 18.5H8.5Z" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                Staff ({staffMembers.length})
              </span>
            </button>

            {/* Button 6: Promotions (Hot Pink Gradient with Clean White Guitar Icon) */}
            <button
              onClick={() => {
                setPromotionModalMode('LIST');
                setShowPromotionsModal(true);
              }}
              className="bg-gradient-to-br from-[#e60067] to-[#b3004b] shadow-md shadow-pink-500/20 text-white rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden group-hover:bg-white/25 transition-colors">
                {customHomeIcons.promotions ? (
                  <img
                    src={customHomeIcons.promotions}
                    alt="Promotions"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Clean White Acoustic Guitar Icon (Larger & Fuller Proportion) */
                  <svg viewBox="2.5 0.2 19.8 20.2" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M19.8 2.2L21.8 4.2C22.2 4.6 22.2 5.2 21.8 5.6L19.9 7.5L18.5 6.1L14.2 10.4C15.3 11.8 15.4 13.7 14.2 15.2C13.6 15.9 12.8 16.4 12 16.6C11.8 17.5 11.3 18.3 10.6 19C8.9 20.6 6.1 20.4 4.4 18.7L5.3 17.8C3.6 16.1 3.4 13.3 5 11.6C5.7 10.9 6.5 10.4 7.4 10.2C7.6 9.4 8.1 8.6 8.8 8C10.3 6.8 12.2 6.9 13.6 8L17.9 3.7L16.5 2.3L18.4 0.4C18.8 0 19.4 0 19.8 2.2ZM9.6 12.6C8.8 13.4 8.8 14.7 9.6 15.5C10.4 16.3 11.7 16.3 12.5 15.5C13.3 14.7 13.3 13.4 12.5 12.6C11.7 11.8 10.4 11.8 9.6 12.6ZM6.4 15.3L8.7 17.6L7.5 18.8L5.2 16.5L6.4 15.3Z" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                {t.btnPromotions} ({promotions.length})
              </span>
            </button>

            {/* Button 7: Support (Deep Purple Gradient) */}
            <button
              onClick={() => setShowSupportModal(true)}
              className="bg-gradient-to-br from-[#2e1d87] to-[#1e1259] shadow-md shadow-purple-900/20 text-white rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center overflow-hidden group-hover:bg-white/25 transition-colors">
                {customHomeIcons.support ? (
                  <img
                    src={customHomeIcons.support}
                    alt="Support"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HelpCircle className="w-4 h-4 text-white stroke-[2.2]" />
                )}
              </div>
              <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
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

          {/* DMC Product & Music Course Official Pricing Structure Card */}
          <DmcPricingStructureCard
            marketPriceLak={currentHeroProduct?.marketPriceLak ?? DMC_STANDARD_PRICING.marketPriceLak}
            memberPriceLak={currentHeroProduct?.priceLak ?? DMC_STANDARD_PRICING.memberPriceLak}
            memberDiscountLak={currentHeroProduct?.memberDiscountLak ?? DMC_STANDARD_PRICING.memberDiscountLak}
            commissionPoolLak={currentHeroProduct?.commissionPoolLak ?? DMC_STANDARD_PRICING.commissionPoolLak}
            l1Percent={
              currentHeroProduct?.splitRule.ruleType === 'POOL_PERCENTAGE'
                ? currentHeroProduct.splitRule.l1Share
                : DMC_STANDARD_PRICING.l1Percent
            }
            l2Percent={
              currentHeroProduct?.splitRule.ruleType === 'POOL_PERCENTAGE'
                ? currentHeroProduct.splitRule.l2Share
                : DMC_STANDARD_PRICING.l2Percent
            }
            l3Percent={
              currentHeroProduct?.splitRule.ruleType === 'POOL_PERCENTAGE'
                ? currentHeroProduct.splitRule.l3Share
                : DMC_STANDARD_PRICING.l3Percent
            }
            title="DMC Product & Music Course Pricing Structure"
            subtitle="Commission calculated from 450,000 LAK pool (not member discount)"
            compact={true}
            onSavePricing={
              isAdmin && currentHeroProduct
                ? (values) => {
                    adminUpdateProduct(currentHeroProduct.sku, {
                      marketPriceLak: values.marketPriceLak,
                      priceLak: values.memberPriceLak,
                      memberDiscountLak: values.memberDiscountLak,
                      commissionPoolLak: values.commissionPoolLak,
                      splitRule: {
                        ruleType: 'POOL_PERCENTAGE',
                        l1Share: values.l1Percent,
                        l2Share: values.l2Percent,
                        l3Share: values.l3Percent,
                      },
                    });
                    setRedemptionNotice(
                      `Updated pricing for ${currentHeroProduct.sku} (${formatNumberWithCommas(values.memberPriceLak)} LAK)`
                    );
                    setTimeout(() => setRedemptionNotice(null), 3500);
                  }
                : undefined
            }
          />

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
                      {t.poolLabel}: {formatNumberWithCommas(currentHeroProduct.commissionPoolLak)} LAK
                    </span>
                  </div>

                  {/* Admin Quick Upload Image / Edit / Delete on Hero Product — ADMINISTRATOR ONLY */}
                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditProductModal(currentHeroProduct);
                        }}
                        className="px-2 py-1 rounded-lg bg-sky-500/90 hover:bg-sky-500 text-white text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                        title="Administrator Only: Upload Product Image / Edit / Update"
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
                          title="Administrator Only: Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
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
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      {currentHeroProduct.marketPriceLak && currentHeroProduct.marketPriceLak > currentHeroProduct.priceLak && (
                        <span className="text-[11px] font-mono text-slate-300 line-through">
                          Market: {formatNumberWithCommas(currentHeroProduct.marketPriceLak)} LAK
                        </span>
                      )}
                      <span className="text-sm font-black text-amber-400 font-mono">
                        DMC Member: {formatNumberWithCommas(currentHeroProduct.priceLak)} LAK
                      </span>
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
              const marketPrice = prod.marketPriceLak;
              const discount = prod.memberDiscountLak ?? (marketPrice && marketPrice > prod.priceLak ? marketPrice - prod.priceLak : 0);
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-amber-300 text-[8px] font-bold uppercase max-w-[55%] truncate">
                      {loc.categoryBadge}
                    </span>

                    {/* Admin Quick Edit/Upload & Delete Buttons — ADMINISTRATOR ONLY */}
                    {isAdmin && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditProductModal(prod);
                          }}
                          className="p-1 rounded-md bg-sky-500/90 hover:bg-sky-500 text-white shadow cursor-pointer"
                          title="Administrator Only: Upload Product Image / Edit / Update"
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
                            title="Administrator Only: Delete Product"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-2 right-2">
                      {marketPrice && marketPrice > prod.priceLak && (
                        <div className="text-[9px] font-mono text-slate-300 line-through leading-none">
                          Market: {formatNumberWithCommas(marketPrice)} LAK
                        </div>
                      )}
                      <div className="text-white font-black font-mono text-xs drop-shadow leading-tight">
                        {formatNumberWithCommas(prod.priceLak)} LAK
                      </div>
                    </div>
                  </div>

                  {/* Product Banner Details */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1.5">
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#df1c2d]">
                        {loc.title}
                      </div>
                      {discount > 0 && (
                        <div className="text-[9px] font-bold text-amber-700 font-mono mt-0.5">
                          Discount: {formatNumberWithCommas(discount)} LAK
                        </div>
                      )}
                      <div className="text-[10px] font-semibold text-emerald-700 font-mono mt-0.5">
                        Pool: {formatNumberWithCommas(prod.commissionPoolLak)} LAK (100%)
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditProductModal(prod);
                          }}
                          className="text-[9px] font-bold text-sky-700 hover:underline flex items-center gap-0.5 truncate cursor-pointer"
                          title="Administrator Only: Edit / Update Product"
                        >
                          <Camera className="w-2.5 h-2.5 shrink-0" />
                          <span>Image / Edit</span>
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono font-semibold text-slate-400 truncate">
                          {prod.sku}
                        </span>
                      )}
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
                        className="px-2.5 py-1 rounded-lg bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[10px] cursor-pointer shrink-0 ml-auto"
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

      {/* Promotions Modal (With Administrator Add, Edit, Delete, Update) */}
      {showPromotionsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900 max-h-[93vh] overflow-y-auto my-auto border-2 border-pink-300/80">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e60067] to-[#b3004b] text-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                  {customHomeIcons.promotions ? (
                    <img
                      src={customHomeIcons.promotions}
                      alt="Promotions"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg viewBox="2.5 0.2 19.8 20.2" className="w-6 h-6 text-white" fill="currentColor">
                      <path d="M19.8 2.2L21.8 4.2C22.2 4.6 22.2 5.2 21.8 5.6L19.9 7.5L18.5 6.1L14.2 10.4C15.3 11.8 15.4 13.7 14.2 15.2C13.6 15.9 12.8 16.4 12 16.6C11.8 17.5 11.3 18.3 10.6 19C8.9 20.6 6.1 20.4 4.4 18.7L5.3 17.8C3.6 16.1 3.4 13.3 5 11.6C5.7 10.9 6.5 10.4 7.4 10.2C7.6 9.4 8.1 8.6 8.8 8C10.3 6.8 12.2 6.9 13.6 8L17.9 3.7L16.5 2.3L18.4 0.4C18.8 0 19.4 0 19.8 2.2ZM9.6 12.6C8.8 13.4 8.8 14.7 9.6 15.5C10.4 16.3 11.7 16.3 12.5 15.5C13.3 14.7 13.3 13.4 12.5 12.6C11.7 11.8 10.4 11.8 9.6 12.6ZM6.4 15.3L8.7 17.6L7.5 18.8L5.2 16.5L6.4 15.3Z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {t.btnPromotions} & Special Incentives
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-pink-100 text-[#e60067] border border-pink-200 text-[9px] font-black uppercase">
                      {promotions.length} Active
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Rev 2.6 Music Packages, Guitar Showroom & Studio Deals
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setPromotionModalMode('CREATE');
                        setEditingPromotionId(null);
                        setPromotionForm({
                          code: `PROMO-DMC-${String(promotions.length + 1).padStart(2, '0')}`,
                          badge: 'SPECIAL PROMOTION',
                          title: '',
                          titleLo: '',
                          description: '',
                          priceLak: 1600000,
                          originalPriceLak: 2000000,
                          bonusPoolLak: 300000,
                          validUntil: '31 Dec 2026',
                          imageUrl:
                            'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
                          targetTab: 'catalog',
                          targetSku: 'MUSIC_SINGLE_1600',
                          status: 'ACTIVE',
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#e60067] hover:bg-pink-700 text-white text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                      title="Administrator: Add New Promotion"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Promo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        adminResetPromotions();
                        setPromotionModalMode('LIST');
                        setRedemptionNotice('Reset Promotions to default.');
                        setTimeout(() => setRedemptionNotice(null), 3500);
                      }}
                      className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer"
                      title="Reset Default Promotions"
                    >
                      Reset
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthInitialMode('ADMIN');
                      setShowAuthPortalModal(true);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                    title="Administrator Login to Add, Edit, Delete, Update Promotions"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Admin Edit</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowPromotionsModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode 1: Administrator Add / Edit / Update Promotion Form */}
            {(promotionModalMode === 'CREATE' || promotionModalMode === 'EDIT') && isAdmin ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanTitle =
                    promotionForm.title.trim() || 'DMC Special Seasonal Promotion';
                  const cleanCode =
                    promotionForm.code.trim().toUpperCase() || `PROMO-${Date.now().toString().slice(-4)}`;
                  if (promotionModalMode === 'EDIT' && editingPromotionId) {
                    adminUpdatePromotion(editingPromotionId, {
                      code: cleanCode,
                      badge: promotionForm.badge.trim() || 'SPECIAL PROMOTION',
                      title: cleanTitle,
                      titleLo: promotionForm.titleLo.trim() || cleanTitle,
                      description:
                        promotionForm.description.trim() ||
                        'Official DMC Xayraxa seasonal promotion & unilevel incentive.',
                      priceLak: Number(promotionForm.priceLak) || 0,
                      originalPriceLak: Number(promotionForm.originalPriceLak) || 0,
                      bonusPoolLak: Number(promotionForm.bonusPoolLak) || 0,
                      validUntil: promotionForm.validUntil.trim() || '31 Dec 2026',
                      imageUrl:
                        promotionForm.imageUrl.trim() ||
                        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
                      targetTab: promotionForm.targetTab,
                      targetSku: promotionForm.targetSku.trim(),
                      status: promotionForm.status,
                    });
                    setRedemptionNotice(`Updated Promotion "${cleanTitle}" (${cleanCode})!`);
                  } else {
                    adminAddPromotion({
                      code: cleanCode,
                      badge: promotionForm.badge.trim() || 'SPECIAL PROMOTION',
                      title: cleanTitle,
                      titleLo: promotionForm.titleLo.trim() || cleanTitle,
                      description:
                        promotionForm.description.trim() ||
                        'Official DMC Xayraxa seasonal promotion & unilevel incentive.',
                      priceLak: Number(promotionForm.priceLak) || 1600000,
                      originalPriceLak: Number(promotionForm.originalPriceLak) || 2000000,
                      bonusPoolLak: Number(promotionForm.bonusPoolLak) || 300000,
                      validUntil: promotionForm.validUntil.trim() || '31 Dec 2026',
                      imageUrl:
                        promotionForm.imageUrl.trim() ||
                        'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80',
                      targetTab: promotionForm.targetTab,
                      targetSku: promotionForm.targetSku.trim(),
                      status: promotionForm.status,
                    });
                    setRedemptionNotice(`Added new Promotion "${cleanTitle}" (${cleanCode})!`);
                  }
                  setTimeout(() => setRedemptionNotice(null), 3500);
                  setPromotionModalMode('LIST');
                }}
                className="p-4 rounded-2xl bg-pink-50/50 border border-pink-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-pink-200/80">
                  <span className="text-xs font-black text-[#e60067]">
                    {promotionModalMode === 'EDIT'
                      ? `Edit / Update Promotion (${promotionForm.code})`
                      : 'Add New DMC Promotion & Price'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPromotionModalMode('LIST')}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel ✕
                  </button>
                </div>

                {/* Promotion Banner Image Preview & Upload */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-pink-200">
                  <img
                    src={promotionForm.imageUrl}
                    alt={promotionForm.title || 'Promo Preview'}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-[#e60067] shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <label className="px-2.5 py-1.5 rounded-lg bg-[#e60067] hover:bg-pink-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs">
                        <Upload className="w-3 h-3" />
                        <span>Upload Promo Image</span>
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
                                setPromotionForm((prev) => ({
                                  ...prev,
                                  imageUrl: reader.result as string,
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={promotionForm.imageUrl}
                      onChange={(e) =>
                        setPromotionForm({ ...promotionForm, imageUrl: e.target.value })
                      }
                      placeholder="Or paste promotion image URL..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-800"
                    />
                  </div>
                </div>

                {/* Promo Code, Badge & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Promo Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={promotionForm.code}
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Highlight Badge *
                    </label>
                    <input
                      type="text"
                      required
                      value={promotionForm.badge}
                      onChange={(e) =>
                        setPromotionForm({ ...promotionForm, badge: e.target.value })
                      }
                      placeholder="SPECIAL MUSIC INCENTIVE"
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={promotionForm.status}
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          status: e.target.value as DmcPromotionItem['status'],
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-900"
                    >
                      <option value="FEATURED">FEATURED</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SEASONAL">SEASONAL</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>
                </div>

                {/* Title (EN & LO) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Promotion Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={promotionForm.title}
                      onChange={(e) =>
                        setPromotionForm({ ...promotionForm, title: e.target.value })
                      }
                      placeholder="e.g. Signature Acoustic Guitar Promo"
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Promotion Title (Lao / ພາສາລາວ)
                    </label>
                    <input
                      type="text"
                      value={promotionForm.titleLo}
                      onChange={(e) =>
                        setPromotionForm({ ...promotionForm, titleLo: e.target.value })
                      }
                      placeholder="ຊື່ໂປຣໂມຊັ່ນພາສາລາວ"
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Promotional Price (LAK), Original Price (LAK), Bonus Pool (LAK) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-black text-[#e60067] mb-1">
                      Promo Price (LAK) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={promotionForm.priceLak === 0 ? '' : promotionForm.priceLak}
                      placeholder="0"
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          priceLak: e.target.value === '' ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border-2 border-[#e60067] rounded-xl px-2.5 py-1.5 text-xs font-mono font-black text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Normal Price (LAK)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={promotionForm.originalPriceLak === 0 ? '' : promotionForm.originalPriceLak}
                      placeholder="0"
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          originalPriceLak: e.target.value === '' ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-700 mb-1">
                      Unilevel Pool (LAK)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={promotionForm.bonusPoolLak === 0 ? '' : promotionForm.bonusPoolLak}
                      placeholder="0"
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          bonusPoolLak: e.target.value === '' ? 0 : Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-emerald-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-900"
                    />
                  </div>
                </div>

                {/* Valid Until & Destination Screen */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Valid Until Date
                    </label>
                    <input
                      type="text"
                      value={promotionForm.validUntil}
                      onChange={(e) =>
                        setPromotionForm({ ...promotionForm, validUntil: e.target.value })
                      }
                      placeholder="e.g. 31 Dec 2026"
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Buy Button Destination
                    </label>
                    <select
                      value={promotionForm.targetTab}
                      onChange={(e) =>
                        setPromotionForm({
                          ...promotionForm,
                          targetTab: e.target.value as DmcPromotionItem['targetTab'],
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900"
                    >
                      <option value="musichub">Music Hub & Studio Package</option>
                      <option value="catalog">Product Catalog & Guitars</option>
                      <option value="academy">DMC Academy</option>
                      <option value="membership">Membership Activation</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Promotion Details & Incentive Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={promotionForm.description}
                    onChange={(e) =>
                      setPromotionForm({ ...promotionForm, description: e.target.value })
                    }
                    placeholder="Describe the promotion package, gifts, and commission pool..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                {/* Form Action Buttons (Delete, Cancel, Save/Update) */}
                <div className="flex items-center gap-2 pt-1">
                  {promotionModalMode === 'EDIT' &&
                    editingPromotionId &&
                    promotions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          adminDeletePromotion(editingPromotionId);
                          setPromotionModalMode('LIST');
                          setRedemptionNotice('Deleted promotion.');
                          setTimeout(() => setRedemptionNotice(null), 3500);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  <button
                    type="button"
                    onClick={() => setPromotionModalMode('LIST')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e60067] to-[#b3004b] hover:from-pink-600 hover:to-pink-800 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    {promotionModalMode === 'EDIT' ? 'Update Promotion' : 'Save New Promotion'}
                  </button>
                </div>
              </form>
            ) : (
              /* Mode 2: Promotions Cards List (With Admin Edit, Update, Delete on every card) */
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-0.5">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50/90 via-rose-50/70 to-amber-50/70 border border-pink-200/80 shadow-xs transition-all hover:shadow-md"
                  >
                    {/* Promotion Banner Image Header */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-[#e60067] text-white shadow">
                          {promo.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-black/65 text-amber-300">
                          {promo.code}
                        </span>
                      </div>

                      {/* Administrator Direct Edit / Update & Delete Controls on Card */}
                      {isAdmin && (
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromotionId(promo.id);
                              setPromotionForm({
                                code: promo.code,
                                badge: promo.badge,
                                title: promo.title,
                                titleLo: promo.titleLo || '',
                                description: promo.description,
                                priceLak: promo.priceLak,
                                originalPriceLak: promo.originalPriceLak || promo.priceLak,
                                bonusPoolLak: promo.bonusPoolLak || 0,
                                validUntil: promo.validUntil,
                                imageUrl: promo.imageUrl,
                                targetTab: promo.targetTab,
                                targetSku: promo.targetSku || '',
                                status: promo.status,
                              });
                              setPromotionModalMode('EDIT');
                            }}
                            className="px-2 py-1 rounded-lg bg-sky-500/95 hover:bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer"
                            title="Administrator: Edit / Update Promotion"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit / Update</span>
                          </button>
                          {promotions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                adminDeletePromotion(promo.id);
                                setRedemptionNotice(`Deleted promotion "${promo.title}"`);
                                setTimeout(() => setRedemptionNotice(null), 3500);
                              }}
                              className="p-1 rounded-lg bg-red-600/95 hover:bg-red-700 text-white shadow cursor-pointer"
                              title="Administrator: Delete Promotion"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between gap-2">
                        <span className="text-[10px] font-semibold text-amber-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-300" />
                          <span>Valid until: {promo.validUntil}</span>
                        </span>
                        {promo.bonusPoolLak && promo.bonusPoolLak > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[9px] font-mono font-black">
                            Pool: {formatLakCompact(promo.bonusPoolLak)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Promotion Card Body */}
                    <div className="p-3.5 space-y-2">
                      <div>
                        <h5 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {language === 'lo' && promo.titleLo ? promo.titleLo : promo.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-snug mt-1">
                          {promo.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-pink-200/60 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs sm:text-sm font-mono font-black text-[#e60067]">
                            {t.price}: {formatNumberWithCommas(promo.priceLak)} LAK
                          </div>
                          {promo.originalPriceLak && promo.originalPriceLak > promo.priceLak ? (
                            <div className="text-[10px] font-mono text-slate-400 line-through">
                              Normal: {formatNumberWithCommas(promo.originalPriceLak)} LAK
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPromotionId(promo.id);
                                setPromotionForm({
                                  code: promo.code,
                                  badge: promo.badge,
                                  title: promo.title,
                                  titleLo: promo.titleLo || '',
                                  description: promo.description,
                                  priceLak: promo.priceLak,
                                  originalPriceLak: promo.originalPriceLak || promo.priceLak,
                                  bonusPoolLak: promo.bonusPoolLak || 0,
                                  validUntil: promo.validUntil,
                                  imageUrl: promo.imageUrl,
                                  targetTab: promo.targetTab,
                                  targetSku: promo.targetSku || '',
                                  status: promo.status,
                                });
                                setPromotionModalMode('EDIT');
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowPromotionsModal(false);
                              onNavigate(promo.targetTab);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#e60067] to-[#b3004b] hover:from-pink-600 hover:to-pink-800 text-white text-[11px] font-black shadow-sm cursor-pointer"
                          >
                            {t.buyNowBtn}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500">
                {isAdmin
                  ? 'Administrator Mode Active: Add, Edit, Delete, Update Promotions'
                  : 'Tap Admin Edit to Add, Edit, Delete, or Update Promotions'}
              </span>
              <button
                type="button"
                onClick={() => setShowPromotionsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
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
                {isAdmin && (
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
                    title="Administrator Only: Add New Location, Photo or Support Contact"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden sm:inline">+ Location</span>
                  </button>
                )}
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

            {/* Quick Item Switcher Bar when viewing Contacts & Map (Administrator Only) */}
            {isAdmin && supportModalMode !== 'REGISTER_VIDEO_GUIDE' && (
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

                        {/* Action Bar on Each Item: Map Toggle for Everyone; Edit, Photo Upload, Delete for Administrator Only */}
                        <div className="flex items-center gap-1 shrink-0">
                          {isAdmin && (
                            <label
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/80 cursor-pointer transition-colors"
                              title="Administrator Only: Upload Photo from Device"
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
                          )}

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

                          {/* Edit / Update Item, Photo & Location — ADMINISTRATOR ONLY */}
                          {isAdmin && (
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
                              title="Administrator Only: Edit / Update Photo, Location & Details"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          )}

                          {/* Delete Item — ADMINISTRATOR ONLY */}
                          {isAdmin && supportLocations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                adminDeleteSupportLocation(item.id);
                                setRedemptionNotice(`Deleted "${item.label}" from Support & Locations.`);
                                setTimeout(() => setRedemptionNotice(null), 3500);
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 cursor-pointer"
                              title="Administrator Only: Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Uploaded Photo Display (with Upload / Replace / Delete Photo controls for Administrator) */}
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
                            {isAdmin && (
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
                                  title="Administrator Only: Delete Photo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
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
                            {isAdmin && (
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
                            )}
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Market Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productForm.marketPriceLak === 0 ? '' : productForm.marketPriceLak}
                    placeholder="6200000"
                    onChange={(e) => {
                      const mp = e.target.value === '' ? 0 : Number(e.target.value);
                      setProductForm({
                        ...productForm,
                        marketPriceLak: mp,
                        memberDiscountLak: Math.max(0, mp - productForm.priceLak),
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-700 mb-1">
                    DMC Member Price (LAK) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productForm.priceLak === 0 ? '' : productForm.priceLak}
                    placeholder="4200000"
                    onChange={(e) => {
                      const p = e.target.value === '' ? 0 : Number(e.target.value);
                      setProductForm({
                        ...productForm,
                        priceLak: p,
                        memberDiscountLak: Math.max(0, productForm.marketPriceLak - p),
                      });
                    }}
                    className="w-full bg-amber-50/70 border border-amber-400 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Member Discount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={productForm.memberDiscountLak === 0 ? '' : productForm.memberDiscountLak}
                    placeholder="2000000"
                    onChange={(e) => {
                      const disc = e.target.value === '' ? 0 : Number(e.target.value);
                      setProductForm({
                        ...productForm,
                        memberDiscountLak: disc,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                    Pool (LAK = 100%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={productForm.commissionPoolLak === 0 ? '' : productForm.commissionPoolLak}
                    placeholder="450000"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        commissionPoolLak: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-emerald-50/70 border border-emerald-400 rounded-xl px-2.5 py-2 text-xs text-emerald-950 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={productForm.stockSellable === 0 ? '' : productForm.stockSellable}
                    placeholder="0"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stockSellable: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Commission Distribution L1 / L2 / L3 (%) */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    L1 (%) • {formatNumberWithCommas(Math.round((productForm.commissionPoolLak * productForm.l1Share) / 100))}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={productForm.l1Share === 0 ? '' : productForm.l1Share}
                    placeholder="50"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        l1Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    L2 (%) • {formatNumberWithCommas(Math.round((productForm.commissionPoolLak * productForm.l2Share) / 100))}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={productForm.l2Share === 0 ? '' : productForm.l2Share}
                    placeholder="30"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        l2Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    L3 (%) • {formatNumberWithCommas(Math.round((productForm.commissionPoolLak * productForm.l3Share) / 100))}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={productForm.l3Share === 0 ? '' : productForm.l3Share}
                    placeholder="20"
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        l3Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono font-bold text-center"
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

      {/* DMC Staff & 8 Positions Modal (Administrator, Assistance, Accounting, Marketing, IT, Teacher, Fencer, Part time + Change Icons) */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900 max-h-[93vh] overflow-y-auto my-auto border-2 border-amber-300/80">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0088ff] to-[#0066cc] shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                  {customHomeIcons.staff ? (
                    <img
                      src={customHomeIcons.staff}
                      alt="Staff Icon"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 28 22" className="w-5 h-5 text-white" fill="currentColor">
                      <circle cx="6.5" cy="7.5" r="2.7" opacity="0.9" />
                      <path d="M1.5 18C1.5 14.3 3.7 12.5 6.5 12.5C7.4 12.5 8.2 12.7 8.9 13.1C7.8 14.3 7.2 16 7.2 18H1.5Z" opacity="0.9" />
                      <circle cx="21.5" cy="7.5" r="2.7" opacity="0.9" />
                      <path d="M26.5 18C26.5 14.3 24.3 12.5 21.5 12.5C20.6 12.5 19.8 12.7 19.1 13.1C20.2 14.3 20.8 16 20.8 18H26.5Z" opacity="0.9" />
                      <circle cx="14" cy="5.8" r="3.4" />
                      <path d="M8.5 18.5C8.5 14.2 10.9 11.8 14 11.8C17.1 11.8 19.5 14.2 19.5 18.5H8.5Z" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      DMC Staff & Positions Directory
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-black uppercase">
                      8 Official Positions
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    Administrator • Assistance • Accounting • Marketing • IT • Teacher • Fencer • Part time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isAdmin && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultMem = allMembers[0];
                        setSelectedMemberToUpgradeId(defaultMem?.memberId || '');
                        if (defaultMem) {
                          const existingStf = staffMembers.find(
                            (s) => s.memberId === defaultMem.memberId
                          );
                          setStaffForm((prev) => ({
                            ...prev,
                            staffCode:
                              existingStf?.staffCode ||
                              defaultMem.staffCode ||
                              `DMC-STF-${defaultMem.memberId}`,
                            fullName: defaultMem.name.replace(/\s*\(.*?\)\s*/g, ''),
                            position:
                              defaultMem.staffPosition ||
                              existingStf?.position ||
                              (selectedStaffPositionFilter === 'ALL'
                                ? 'Teacher'
                                : selectedStaffPositionFilter),
                            phone: defaultMem.phone,
                            email:
                              defaultMem.email ||
                              `${defaultMem.memberId.toLowerCase()}@dmcxayraxa.la`,
                            branch:
                              existingStf?.branch ||
                              defaultMem.staffBranch ||
                              'Dongdok Campus Studio Hub, Vientiane',
                            avatarUrl: defaultMem.avatarUrl || prev.avatarUrl,
                            bioOrDuty:
                              existingStf?.bioOrDuty || defaultMem.staffBioOrDuty || '',
                          }));
                        }
                        setStaffModalMode(
                          staffModalMode === 'UPGRADE_MEMBER' ? 'LIST' : 'UPGRADE_MEMBER'
                        );
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow cursor-pointer ${
                        staffModalMode === 'UPGRADE_MEMBER'
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                          : 'bg-gradient-to-r from-[#0088ff] to-[#0066cc] hover:from-sky-500 hover:to-blue-600 text-white'
                      }`}
                      title="Administrator: Upgrade any DMC Member to Become Official Staff"
                    >
                      <Users className="w-3 h-3" />
                      <span>↑ Upgrade Member</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffModalMode('CREATE');
                        setEditingStaffId(null);
                        setStaffForm({
                          staffCode: `DMC-STF-${String(staffMembers.length + 1).padStart(3, '0')}`,
                          fullName: '',
                          position:
                            selectedStaffPositionFilter === 'ALL'
                              ? 'Teacher'
                              : selectedStaffPositionFilter,
                          phone: '+856 20 ',
                          email: '',
                          branch: 'Dongdok Campus Studio Hub, Vientiane',
                          avatarUrl:
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
                          customIconUrl: '',
                          bioOrDuty: '',
                          status: 'ACTIVE',
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Add Staff</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStaffModalMode(staffModalMode === 'ICONS' ? 'LIST' : 'ICONS')
                      }
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow cursor-pointer ${
                        staffModalMode === 'ICONS'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-300'
                      }`}
                      title="Change Home Button Icons (Academy, Staff, Promotions, Support)"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Change Icon</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 8 Official Staff Positions Selector Grid */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Select Staff Position ({DMC_STAFF_POSITIONS.length} Positions):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaffPositionFilter('ALL');
                    setStaffModalMode('LIST');
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black cursor-pointer ${
                    selectedStaffPositionFilter === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Show All ({staffMembers.length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {DMC_STAFF_POSITIONS.map((pos) => {
                  const count = staffMembers.filter((m) => m.position === pos.id).length;
                  const isSelected = selectedStaffPositionFilter === pos.id;
                  return (
                    <button
                      key={pos.id}
                      type="button"
                      onClick={() => {
                        setSelectedStaffPositionFilter(isSelected ? 'ALL' : pos.id);
                        if (staffModalMode !== 'LIST') setStaffModalMode('LIST');
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                        isSelected
                          ? `bg-gradient-to-r ${pos.badgeColor} text-white border-transparent shadow-md scale-[1.01]`
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/90'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-black leading-tight truncate">
                          - {pos.labelEn}
                        </div>
                        <div
                          className={`text-[9px] truncate ${
                            isSelected ? 'text-white/85' : 'text-slate-500'
                          }`}
                        >
                          {language === 'th' ? pos.labelTh : pos.labelLo}
                        </div>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode 1: Change Home Icons Panel (Administrator Only) */}
            {staffModalMode === 'ICONS' && isAdmin ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">
                      Change Home Screen Button Icons
                    </h5>
                    <p className="text-[10px] text-slate-500">
                      Upload custom icon images or reset to the default Gold & Red badge icons
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStaffModalMode('LIST')}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] cursor-pointer"
                  >
                    ← Back to Staff List
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(
                    [
                      { key: 'academy', label: 'Academy Icon (Graduation Cap)' },
                      { key: 'musicHub', label: 'Music Hub Icon (Headphones)' },
                      { key: 'staff', label: 'Staff Icon (3-People Team)' },
                      { key: 'promotions', label: 'Promotions Icon (Guitar)' },
                      { key: 'support', label: 'Support Icon' },
                    ] as const
                  ).map((item) => (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900">{item.label}</div>
                        <div className="text-[9px] text-slate-500">
                          {customHomeIcons[item.key] ? 'Custom uploaded icon active' : 'Default badge icon active'}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <label className="px-2.5 py-1.5 rounded-lg bg-[#0088ff] hover:bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Upload</span>
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
                                  adminUpdateHomeIcon(item.key, reader.result);
                                  setRedemptionNotice(`Updated ${item.label}!`);
                                  setTimeout(() => setRedemptionNotice(null), 3500);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        {customHomeIcons[item.key] && (
                          <button
                            type="button"
                            onClick={() => adminUpdateHomeIcon(item.key, '')}
                            className="px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : staffModalMode === 'UPGRADE_MEMBER' && isAdmin ? (
              /* Mode 1B: Administrator Upgrade Member to Become Staff Panel */
              <div className="p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-300 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-sky-200">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#0088ff]" />
                      <span>Administrator: Upgrade Member to Become Staff</span>
                    </h5>
                    <p className="text-[10px] text-slate-600">
                      Select any DMC Member below and assign them one of the 8 Official Staff Positions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStaffModalMode('LIST')}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px] cursor-pointer"
                  >
                    ← Back to Staff List
                  </button>
                </div>

                {/* Search & Select Member List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                      1. Search & Select Member ({allMembers.length} Total Members)
                    </label>
                    <input
                      type="text"
                      value={memberUpgradeFilterQuery}
                      onChange={(e) => setMemberUpgradeFilterQuery(e.target.value)}
                      placeholder="Filter by Name, ID (DM000...), or Phone..."
                      className="w-56 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[10px] text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                    {allMembers
                      .filter((m) => {
                        const q = memberUpgradeFilterQuery.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          m.name.toLowerCase().includes(q) ||
                          m.memberId.toLowerCase().includes(q) ||
                          m.phone.toLowerCase().includes(q)
                        );
                      })
                      .map((mem) => {
                        const existingStf = staffMembers.find(
                          (s) => s.memberId === mem.memberId
                        );
                        const isAlreadyStaff = Boolean(mem.isStaff || existingStf);
                        const currentPos = mem.staffPosition || existingStf?.position;
                        const isSelected = selectedMemberToUpgradeId === mem.memberId;

                        return (
                          <button
                            key={mem.memberId}
                            type="button"
                            onClick={() => {
                              setSelectedMemberToUpgradeId(mem.memberId);
                              setStaffForm((prev) => ({
                                ...prev,
                                staffCode:
                                  existingStf?.staffCode ||
                                  mem.staffCode ||
                                  `DMC-STF-${mem.memberId}`,
                                fullName: mem.name.replace(/\s*\(.*?\)\s*/g, ''),
                                position: currentPos || prev.position || 'Teacher',
                                phone: mem.phone,
                                email:
                                  mem.email ||
                                  `${mem.memberId.toLowerCase()}@dmcxayraxa.la`,
                                branch:
                                  existingStf?.branch ||
                                  mem.staffBranch ||
                                  'Dongdok Campus Studio Hub, Vientiane',
                                avatarUrl: mem.avatarUrl || prev.avatarUrl,
                                bioOrDuty:
                                  existingStf?.bioOrDuty || mem.staffBioOrDuty || '',
                              }));
                            }}
                            className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-700 shadow-sm'
                                : 'bg-slate-50 hover:bg-sky-50/80 text-slate-900 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={
                                  mem.avatarUrl ||
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'
                                }
                                alt={mem.name}
                                className="w-8 h-8 rounded-full object-cover border border-amber-400 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-[11px] font-black truncate">
                                  {mem.name.replace(/\s*\(.*?\)\s*/g, '')}
                                </div>
                                <div
                                  className={`text-[9px] font-mono truncate ${
                                    isSelected ? 'text-sky-100' : 'text-slate-500'
                                  }`}
                                >
                                  {mem.memberId} • {mem.phone}
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {isAlreadyStaff ? (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                    isSelected
                                      ? 'bg-amber-300 text-slate-950'
                                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  }`}
                                >
                                  Staff: {currentPos}
                                </span>
                              ) : (
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  Member
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Upgrade Position & Details Form */}
                {selectedMemberToUpgradeId && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const upgraded = adminUpgradeMemberToStaff(
                        selectedMemberToUpgradeId,
                        staffForm.position,
                        {
                          staffCode: staffForm.staffCode.trim(),
                          branch: staffForm.branch.trim(),
                          bioOrDuty: staffForm.bioOrDuty.trim(),
                          status: staffForm.status,
                        }
                      );
                      if (upgraded) {
                        setRedemptionNotice(
                          `Upgraded Member ${selectedMemberToUpgradeId} (${upgraded.fullName}) to Official Staff (${upgraded.position})!`
                        );
                        setTimeout(() => setRedemptionNotice(null), 4000);
                        setSelectedStaffPositionFilter('ALL');
                        setStaffModalMode('LIST');
                      }
                    }}
                    className="p-3 rounded-xl bg-white border border-sky-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-slate-900">
                        2. Assign Official Staff Position for Member{' '}
                        <span className="text-[#0088ff] font-mono">
                          {selectedMemberToUpgradeId}
                        </span>{' '}
                        ({staffForm.fullName})
                      </span>
                      {(allMembers.find((m) => m.memberId === selectedMemberToUpgradeId)
                        ?.isStaff ||
                        staffMembers.some(
                          (s) => s.memberId === selectedMemberToUpgradeId
                        )) && (
                        <button
                          type="button"
                          onClick={() => {
                            adminDowngradeStaffToMember(selectedMemberToUpgradeId);
                            setRedemptionNotice(
                              `Removed Staff role from Member ${selectedMemberToUpgradeId}.`
                            );
                            setTimeout(() => setRedemptionNotice(null), 3500);
                            setStaffModalMode('LIST');
                          }}
                          className="px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[9px] font-black cursor-pointer"
                        >
                          Downgrade to Regular Member
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-700 mb-1">
                          Select Staff Position *
                        </label>
                        <select
                          value={staffForm.position}
                          onChange={(e) =>
                            setStaffForm({
                              ...staffForm,
                              position: e.target.value as StaffPosition,
                            })
                          }
                          className="w-full bg-amber-50/70 border-2 border-amber-400 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-black"
                        >
                          {DMC_STAFF_POSITIONS.map((pos) => (
                            <option key={pos.id} value={pos.id}>
                              - {pos.labelEn} ({pos.labelLo})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Staff ID Code
                        </label>
                        <input
                          type="text"
                          required
                          value={staffForm.staffCode}
                          onChange={(e) =>
                            setStaffForm({
                              ...staffForm,
                              staffCode: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 mb-1">
                          Branch / Location
                        </label>
                        <input
                          type="text"
                          value={staffForm.branch}
                          onChange={(e) =>
                            setStaffForm({ ...staffForm, branch: e.target.value })
                          }
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">
                        Staff Responsibilities / Bio Note
                      </label>
                      <input
                        type="text"
                        value={staffForm.bioOrDuty}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, bioOrDuty: e.target.value })
                        }
                        placeholder="Optional custom duty note (defaults to official position description)..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setStaffModalMode('LIST')}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0088ff] to-[#0066cc] hover:from-sky-500 hover:to-blue-700 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          Confirm Upgrade Member ({selectedMemberToUpgradeId}) to{' '}
                          {staffForm.position} Staff
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : staffModalMode === 'CREATE' || staffModalMode === 'EDIT' ? (
              /* Mode 2: Administrator Add / Edit / Update Staff Member & Position Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanName = staffForm.fullName.trim() || 'DMC Staff Member';
                  if (staffModalMode === 'EDIT' && editingStaffId) {
                    adminUpdateStaffMember(editingStaffId, {
                      staffCode: staffForm.staffCode.trim(),
                      fullName: cleanName,
                      position: staffForm.position,
                      phone: staffForm.phone.trim(),
                      email: staffForm.email.trim(),
                      branch: staffForm.branch.trim(),
                      avatarUrl: staffForm.avatarUrl.trim(),
                      customIconUrl: staffForm.customIconUrl.trim(),
                      bioOrDuty: staffForm.bioOrDuty.trim(),
                      status: staffForm.status,
                    });
                    setRedemptionNotice(
                      `Updated Staff "${cleanName}" (${staffForm.position})!`
                    );
                  } else if (selectedMemberToUpgradeId) {
                    adminUpgradeMemberToStaff(
                      selectedMemberToUpgradeId,
                      staffForm.position,
                      {
                        staffCode: staffForm.staffCode.trim(),
                        branch: staffForm.branch.trim(),
                        bioOrDuty: staffForm.bioOrDuty.trim(),
                        status: staffForm.status,
                      }
                    );
                    setRedemptionNotice(
                      `Upgraded Member ${selectedMemberToUpgradeId} ("${cleanName}") to Staff (${staffForm.position})!`
                    );
                  } else {
                    adminAddStaffMember({
                      staffCode: staffForm.staffCode.trim(),
                      fullName: cleanName,
                      position: staffForm.position,
                      phone: staffForm.phone.trim(),
                      email: staffForm.email.trim(),
                      branch: staffForm.branch.trim(),
                      avatarUrl: staffForm.avatarUrl.trim(),
                      customIconUrl: staffForm.customIconUrl.trim(),
                      bioOrDuty: staffForm.bioOrDuty.trim(),
                      status: staffForm.status,
                    });
                    setRedemptionNotice(
                      `Created new Staff "${cleanName}" in position "${staffForm.position}"!`
                    );
                  }
                  setTimeout(() => setRedemptionNotice(null), 3500);
                  setStaffModalMode('LIST');
                }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-black text-slate-900">
                    {staffModalMode === 'EDIT'
                      ? `Edit / Update Staff (${staffForm.fullName || staffForm.staffCode})`
                      : 'Create New DMC Staff Member (or Upgrade Existing Member)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStaffModalMode('LIST')}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel ✕
                  </button>
                </div>

                {/* Quick Upgrade Existing Member Selector inside Create Mode */}
                {staffModalMode === 'CREATE' && (
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-sky-900">
                        Upgrade Existing DMC Member to Become Staff (Optional):
                      </div>
                      <div className="text-[9px] text-sky-700">
                        Select any registered member to auto-fill details and upgrade their account to Staff
                      </div>
                    </div>
                    <select
                      value={selectedMemberToUpgradeId}
                      onChange={(e) => {
                        const memId = e.target.value;
                        setSelectedMemberToUpgradeId(memId);
                        const mem = allMembers.find((m) => m.memberId === memId);
                        if (mem) {
                          const existingStf = staffMembers.find((s) => s.memberId === memId);
                          setStaffForm((prev) => ({
                            ...prev,
                            staffCode:
                              existingStf?.staffCode ||
                              mem.staffCode ||
                              `DMC-STF-${mem.memberId}`,
                            fullName: mem.name.replace(/\s*\(.*?\)\s*/g, ''),
                            position: mem.staffPosition || existingStf?.position || prev.position,
                            phone: mem.phone,
                            email:
                              mem.email || `${mem.memberId.toLowerCase()}@dmcxayraxa.la`,
                            branch:
                              existingStf?.branch ||
                              mem.staffBranch ||
                              'Dongdok Campus Studio Hub, Vientiane',
                            avatarUrl: mem.avatarUrl || prev.avatarUrl,
                            bioOrDuty:
                              existingStf?.bioOrDuty || mem.staffBioOrDuty || '',
                          }));
                        }
                      }}
                      className="bg-white border border-sky-300 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="">-- Or Enter New Staff Manually --</option>
                      {allMembers.map((m) => (
                        <option key={m.memberId} value={m.memberId}>
                          {m.memberId} - {m.name} {m.isStaff ? `(Staff: ${m.staffPosition})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Staff Photo / Icon Preview & Upload */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200">
                  <img
                    src={staffForm.avatarUrl}
                    alt={staffForm.fullName || 'Staff Preview'}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <label className="px-2.5 py-1.5 rounded-lg bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-xs">
                        <Upload className="w-3 h-3" />
                        <span>Upload Staff Photo / Icon</span>
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
                                setStaffForm((prev) => ({
                                  ...prev,
                                  avatarUrl: reader.result as string,
                                }));
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {PRESET_AVATARS.slice(0, 4).map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setStaffForm((prev) => ({ ...prev, avatarUrl: url }))}
                          className="w-7 h-7 rounded-lg overflow-hidden border border-slate-300 hover:border-amber-500 cursor-pointer"
                          title={`Preset Avatar ${i + 1}`}
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={staffForm.avatarUrl}
                      onChange={(e) => setStaffForm({ ...staffForm, avatarUrl: e.target.value })}
                      placeholder="Or paste image URL..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-800"
                    />
                  </div>
                </div>

                {/* Staff Position Selection (All 8 Positions) & Staff Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-700 mb-1">
                      Staff Position * (8 Official Positions)
                    </label>
                    <select
                      value={staffForm.position}
                      onChange={(e) =>
                        setStaffForm({
                          ...staffForm,
                          position: e.target.value as StaffPosition,
                        })
                      }
                      className="w-full bg-white border-2 border-amber-400 rounded-xl px-3 py-2 text-xs text-slate-900 font-black"
                    >
                      {DMC_STAFF_POSITIONS.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          - {pos.labelEn} ({pos.labelLo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Staff ID Code & Status
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        required
                        value={staffForm.staffCode}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, staffCode: e.target.value.toUpperCase() })
                        }
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900"
                      />
                      <select
                        value={staffForm.status}
                        onChange={(e) =>
                          setStaffForm({
                            ...staffForm,
                            status: e.target.value as DmcStaffMember['status'],
                          })
                        }
                        className="bg-white border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-900"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="ON_DUTY">ON DUTY</option>
                        <option value="PART_TIME">PART TIME</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffForm.fullName}
                      onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                      placeholder="e.g. Somphone Keomany"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffForm.phone}
                      onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                      placeholder="+856 20 5511 2233"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      placeholder="staff@dmcxayraxa.la"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Branch / Department Location
                    </label>
                    <input
                      type="text"
                      value={staffForm.branch}
                      onChange={(e) => setStaffForm({ ...staffForm, branch: e.target.value })}
                      placeholder="Dongdok Campus Studio Hub, Vientiane"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Position Duties / Responsibilities
                  </label>
                  <textarea
                    rows={2}
                    value={staffForm.bioOrDuty}
                    onChange={(e) => setStaffForm({ ...staffForm, bioOrDuty: e.target.value })}
                    placeholder="Describe staff position responsibilities..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {staffModalMode === 'EDIT' && editingStaffId && staffMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        adminDeleteStaffMember(editingStaffId);
                        setStaffModalMode('LIST');
                        setRedemptionNotice('Deleted staff member.');
                        setTimeout(() => setRedemptionNotice(null), 3500);
                      }}
                      className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setStaffModalMode('LIST')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs shadow-md cursor-pointer"
                  >
                    {staffModalMode === 'EDIT'
                      ? 'Update Staff'
                      : selectedMemberToUpgradeId
                      ? `Upgrade Member (${selectedMemberToUpgradeId}) to Staff`
                      : 'Save New Staff'}
                  </button>
                </div>
              </form>
            ) : (
              /* Mode 3: Staff Directory List grouped/filtered by the 8 Positions */
              <div className="space-y-2.5 max-h-[52vh] overflow-y-auto pr-0.5">
                {staffMembers
                  .filter(
                    (stf) =>
                      selectedStaffPositionFilter === 'ALL' ||
                      stf.position === selectedStaffPositionFilter
                  )
                  .map((stf) => {
                    const posMeta =
                      DMC_STAFF_POSITIONS.find((p) => p.id === stf.position) ||
                      DMC_STAFF_POSITIONS[0];
                    return (
                      <div
                        key={stf.id}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-amber-400/80 transition-all flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <img
                              src={stf.avatarUrl}
                              alt={stf.fullName}
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[7px] font-black uppercase text-white bg-gradient-to-r ${posMeta.badgeColor} shadow`}
                            >
                              {stf.position}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-black text-slate-900">
                                {stf.fullName}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700 text-[9px] font-mono font-bold">
                                {stf.staffCode}
                              </span>
                              {stf.memberId && (
                                <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300 text-[9px] font-mono font-black">
                                  Member: {stf.memberId}
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white bg-gradient-to-r ${posMeta.badgeColor}`}
                              >
                                Position: {stf.position}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-600 leading-snug">
                              {stf.bioOrDuty || posMeta.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[10px] text-slate-500 font-medium">
                              <span className="flex items-center gap-1 text-slate-700 font-mono font-bold">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                {stf.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#df1c2d]" />
                                {stf.branch}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Administrator Direct Edit / Position Switch / Delete Controls */}
                        {isAdmin && (
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <select
                              value={stf.position}
                              onChange={(e) =>
                                adminUpdateStaffMember(stf.id, {
                                  position: e.target.value as StaffPosition,
                                })
                              }
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-900 cursor-pointer"
                              title="Administrator: Quick Change Staff Position"
                            >
                              {DMC_STAFF_POSITIONS.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.labelEn}
                                </option>
                              ))}
                            </select>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStaffId(stf.id);
                                  setStaffForm({
                                    staffCode: stf.staffCode,
                                    fullName: stf.fullName,
                                    position: stf.position,
                                    phone: stf.phone,
                                    email: stf.email || '',
                                    branch: stf.branch,
                                    avatarUrl: stf.avatarUrl,
                                    customIconUrl: stf.customIconUrl || '',
                                    bioOrDuty: stf.bioOrDuty,
                                    status: stf.status,
                                  });
                                  setStaffModalMode('EDIT');
                                }}
                                className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Pencil className="w-2.5 h-2.5" />
                                <span>Edit</span>
                              </button>
                              {staffMembers.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => adminDeleteStaffMember(stf.id)}
                                  className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer"
                                  title="Delete Staff Member"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500">
                Positions: Administrator, Assistance, Accounting, Marketing, IT, Teacher, Fencer, Part time
              </span>
              <button
                type="button"
                onClick={() => setShowStaffModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
