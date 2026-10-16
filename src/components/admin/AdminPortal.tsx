/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * WEB ADMIN PORTAL - FULL CRUD CONTROL CENTER
 * Comprehensive Add, Edit, Update, and Delete across Members, Products, Orders, Songs, and Commission Rules.
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak, formatLakCompact } from '../../utils/i18n';
import { BeautifulNumberInput } from '../common/BeautifulNumberInput';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  XCircle, 
  Truck, 
  Sliders, 
  Package, 
  FileText, 
  Play, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  Building, 
  UserCheck, 
  Send, 
  Boxes, 
  Database, 
  Layers, 
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Users,
  Search,
  DollarSign,
  Music,
  Headphones,
  Save,
  X,
  Landmark,
  Copy,
  ExternalLink,
  Smartphone,
  MessageSquare,
  KeyRound,
  Lock,
  Megaphone,
  Upload,
  Calendar,
  MapPin,
  FileSpreadsheet,
  Download,
  CreditCard
} from 'lucide-react';
import { DownlineOrganizeTree } from '../common/DownlineOrganizeTree';
import { DmcOfficialLogo } from '../common/DmcLogo';
import { AdminExcelReportHub, AdminReportId } from './AdminExcelReportHub';
import { AdminCompanyProfilePdfHub } from './AdminCompanyProfilePdfHub';
import { AdminBusinessCardStudio } from './AdminBusinessCardStudio';
import { AdminStepByStepPdfHub } from './AdminStepByStepPdfHub';
import {
  DEFAULT_COMPANY_PROFILE_DATA,
  downloadCompanyProfilePdf,
} from '../../utils/companyProfilePdfGenerator';
import {
  DEFAULT_STEP_BY_STEP_SUMMARY_DATA,
  downloadStepByStepSummaryPdf,
} from '../../utils/stepByStepSummaryPdfGenerator';
import { 
  Member, 
  ProductSKU, 
  Order, 
  SongProductionProject,
  LaoBankDefinition,
  CorporateBankAccount,
  BankAccountInfo,
  DEFAULT_LAO_BANKS,
  LaoShippingCarrierId,
  LaoShippingCarrier,
  LAO_SHIPPING_CARRIERS,
  EventActivityPost,
  SupportLocationItem,
  StaffPosition,
  DMC_STAFF_POSITIONS,
  DmcStaffMember
} from '../../types/dmc';

export const AdminPortal: React.FC = () => {
  const { 
    withdrawals, 
    makerApproveWithdrawal, 
    checkerExecutePayout, 
    rejectWithdrawal,
    products, 
    orders, 
    updateOrderStatus, 
    uatResults, 
    runAllUatTests, 
    auditLogs, 
    unallocatedAwards,
    allMembers,
    getMemberBalances,
    getMemberSongs,
    adminAddMember,
    adminUpdateMember,
    adminDeleteMember,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminAddOrder,
    adminUpdateOrder,
    adminDeleteOrder,
    adminAddSong,
    adminUpdateSong,
    adminDeleteSong,
    adminAdjustMemberBalance,
    language,
    laoBanks,
    corporateBankAccounts,
    adminAddLaoBank,
    adminUpdateLaoBank,
    adminDeleteLaoBank,
    adminAddCorporateBankAccount,
    adminUpdateCorporateBankAccount,
    adminDeleteCorporateBankAccount,
    updateMemberBankAccount,
    superAdminProfile,
    updateSuperAdminProfile,
    sendSmsRecoveryOtp,
    resetPasswordWithSmsOtp,
    eventPosts,
    adminAddEventPost,
    adminUpdateEventPost,
    adminDeleteEventPost,
    shippingCarriers,
    adminAddShippingCarrier,
    adminUpdateShippingCarrier,
    adminDeleteShippingCarrier,
    adminResetShippingCarriers,
    staffMembers,
    adminAddStaffMember,
    adminUpdateStaffMember,
    adminDeleteStaffMember,
    adminResetStaffMembers,
    adminUpgradeMemberToStaff,
    adminDowngradeStaffToMember
  } = useDmc();

  const [activeAdminTab, setActiveAdminTab] = useState<'BUSINESS_CARDS' | 'STEP_BY_STEP_PDF' | 'COMPANY_PROFILE_PDF' | 'EXCEL_REPORTS' | 'MEMBERS' | 'STAFF' | 'ORGANIZE' | 'EVENTS' | 'ADMIN_PROFILE' | 'PRODUCTS' | 'ORDERS' | 'SONGS' | 'WITHDRAWALS' | 'BANKS' | 'RULES' | 'UAT' | 'AUDIT'>('BUSINESS_CARDS');
  const [adminStaffFilterPos, setAdminStaffFilterPos] = useState<StaffPosition | 'ALL'>('ALL');
  const [adminEditingStaffId, setAdminEditingStaffId] = useState<string | null>(null);
  const [adminSelectedMemberToUpgrade, setAdminSelectedMemberToUpgrade] = useState<string>('');
  const [adminStaffForm, setAdminStaffForm] = useState<{
    staffCode: string;
    fullName: string;
    position: StaffPosition;
    phone: string;
    email: string;
    branch: string;
    avatarUrl: string;
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
    bioOrDuty: '',
    status: 'ACTIVE',
  });
  const [selectedExcelReport, setSelectedExcelReport] = useState<AdminReportId>('1_MEMBERS');
  const [adminEventForm, setAdminEventForm] = useState({
    id: '' as string,
    headline: '',
    title: '',
    information: '',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
    eventDate: '25 Oct 2026 • 18:00',
    location: 'DMC Central Studio, Vientiane',
    badge: 'EVENT & ACTIVITY',
  });
  const [adminFormName, setAdminFormName] = useState(superAdminProfile.name);
  const [adminFormOperatorId, setAdminFormOperatorId] = useState(superAdminProfile.operatorId);
  const [adminFormPhone, setAdminFormPhone] = useState(superAdminProfile.phone);
  const [adminFormEmail, setAdminFormEmail] = useState(superAdminProfile.email);
  const [adminFormRole, setAdminFormRole] = useState(superAdminProfile.roleTitle);
  const [adminFormCarrier, setAdminFormCarrier] = useState(superAdminProfile.telecomCarrier);
  const [adminFormPin, setAdminFormPin] = useState(superAdminProfile.passwordPin);
  const [adminSmsTarget, setAdminSmsTarget] = useState<'SUPER_ADMIN' | 'MEMBER'>('SUPER_ADMIN');
  const [adminSmsMemberId, setAdminSmsMemberId] = useState('DMC-LA-00404');
  const [adminSmsNewPass, setAdminSmsNewPass] = useState('888888');
  const [adminSmsOtpInput, setAdminSmsOtpInput] = useState('');
  const [adminDispatchedSms, setAdminDispatchedSms] = useState<{
    otpCode: string;
    phone: string;
    matchedId: string;
    matchedName: string;
    carrier: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // ---------------- MEMBERS CRUD MODALS ----------------
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [adjustingMember, setAdjustingMember] = useState<Member | null>(null);

  // Add Member State
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    phone: '',
    email: '',
    sponsorId: '',
    membershipState: 'FREE_MEMBER' as Member['membershipState'],
    initialHeldLak: 0,
    initialAvailableLak: 0,
  });

  // Adjust Balance State
  const [balanceAdjustForm, setBalanceAdjustForm] = useState({
    account: 'HELD_FOR_QUALIFICATION' as 'HELD_FOR_QUALIFICATION' | 'AVAILABLE' | 'PENDING',
    deltaLak: 0,
    note: 'Admin manual reconciliation adjustment',
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const created = adminAddMember({
      name: newMemberForm.name,
      phone: newMemberForm.phone,
      email: newMemberForm.email,
      sponsorId: newMemberForm.sponsorId || null,
      membershipState: newMemberForm.membershipState,
      initialHeldLak: Number(newMemberForm.initialHeldLak),
      initialAvailableLak: Number(newMemberForm.initialAvailableLak),
    });
    setShowAddMemberModal(false);
    setNewMemberForm({
      name: '',
      phone: '',
      email: '',
      sponsorId: '',
      membershipState: 'FREE_MEMBER',
      initialHeldLak: 0,
      initialAvailableLak: 0,
    });
    showNotification(`Successfully added member ${created.name} (${created.memberId})!`);
  };

  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    adminUpdateMember(editingMember.memberId, {
      name: editingMember.name,
      phone: editingMember.phone,
      email: editingMember.email,
      password: editingMember.password || '123456',
      sponsorId: editingMember.sponsorId || null,
      membershipState: editingMember.membershipState,
      kycStatus: editingMember.kycStatus,
      bankAccount: editingMember.bankAccount,
    });
    setEditingMember(null);
    showNotification(`Updated member ${editingMember.memberId} profile & password successfully!`);
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm(`Are you sure you want to delete member ${memberId}? This will remove the member record.`)) {
      adminDeleteMember(memberId);
      showNotification(`Deleted member ${memberId}.`);
    }
  };

  const handleExecuteBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingMember) return;
    adminAdjustMemberBalance(
      adjustingMember.memberId,
      balanceAdjustForm.account,
      Number(balanceAdjustForm.deltaLak),
      balanceAdjustForm.note
    );
    setAdjustingMember(null);
    showNotification(`Adjusted ${balanceAdjustForm.account} for ${adjustingMember.memberId} by ${balanceAdjustForm.deltaLak.toLocaleString()} LAK.`);
  };

  // ---------------- PRODUCTS CRUD MODALS ----------------
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSKU | null>(null);

  const [newProductForm, setNewProductForm] = useState({
    sku: '',
    category: 'GUITAR' as ProductSKU['category'],
    titleEn: '',
    titleLo: '',
    titleTh: '',
    descriptionEn: '',
    marketPriceLak: 6200000,
    priceLak: 4200000,
    memberDiscountLak: 2000000,
    commissionPoolLak: 450000,
    l1Share: 50,
    l2Share: 30,
    l3Share: 20,
    stockSellable: 20,
    warehouseId: 'Vientiane Central Warehouse',
    itemType: 'PHYSICAL' as ProductSKU['itemType'],
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const marketPrice = Number(newProductForm.marketPriceLak) || 6200000;
    const memberPrice = Number(newProductForm.priceLak) || 4200000;
    const memberDiscount =
      Number(newProductForm.memberDiscountLak) >= 0
        ? Number(newProductForm.memberDiscountLak)
        : Math.max(0, marketPrice - memberPrice);
    const prod: ProductSKU = {
      sku: newProductForm.sku.trim().toUpperCase(),
      category: newProductForm.category,
      titleEn: newProductForm.titleEn,
      titleLo: newProductForm.titleLo || newProductForm.titleEn,
      titleTh: newProductForm.titleTh || newProductForm.titleEn,
      descriptionEn: newProductForm.descriptionEn,
      marketPriceLak: marketPrice,
      priceLak: memberPrice,
      memberDiscountLak: memberDiscount,
      commissionPoolLak: Number(newProductForm.commissionPoolLak),
      splitRule: {
        ruleType: 'POOL_PERCENTAGE',
        l1Share: Number(newProductForm.l1Share),
        l2Share: Number(newProductForm.l2Share),
        l3Share: Number(newProductForm.l3Share),
      },
      stockSellable: Number(newProductForm.stockSellable),
      stockReserved: 0,
      warehouseId: newProductForm.warehouseId,
      itemType: newProductForm.itemType,
      imageUrl: newProductForm.imageUrl,
    };
    adminAddProduct(prod);
    setShowAddProductModal(false);
    showNotification(`Added product SKU ${prod.sku}!`);
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    adminUpdateProduct(editingProduct.sku, editingProduct);
    setEditingProduct(null);
    showNotification(`Updated product SKU ${editingProduct.sku}!`);
  };

  const handleDeleteProduct = (sku: string) => {
    if (window.confirm(`Are you sure you want to delete product SKU ${sku}?`)) {
      adminDeleteProduct(sku);
      showNotification(`Deleted product SKU ${sku}.`);
    }
  };

  // ---------------- ORDERS CRUD MODALS ----------------
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [newOrderForm, setNewOrderForm] = useState({
    buyerMemberId: allMembers[0]?.memberId || 'DMC-LA-00404',
    sku: 'GTR-DMC-ACOUSTIC-01',
    quantity: 1,
    paymentMethod: 'BCEL_ONE' as Order['paymentMethod'],
    carrierId: 'ANOUSITH' as LaoShippingCarrierId,
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = products.find(p => p.sku === newOrderForm.sku);
    if (!targetProd) return;

    const qty = Number(newOrderForm.quantity);
    const subtotal = targetProd.priceLak * qty;
    const carrier =
      shippingCarriers.find(c => c.id === newOrderForm.carrierId) ||
      shippingCarriers[0] ||
      LAO_SHIPPING_CARRIERS[0];
    const shipping = targetProd.itemType === 'PHYSICAL' ? carrier.baseFeeLak : 0;
    const total = subtotal + shipping;

    const ord: Order = {
      id: `ORD-ADMIN-${Date.now().toString().slice(-6)}`,
      buyerMemberId: newOrderForm.buyerMemberId,
      items: [
        {
          orderLineId: `line-adm-${Date.now()}`,
          sku: targetProd.sku,
          title: targetProd.titleEn,
          unitPriceLak: targetProd.priceLak,
          quantity: qty,
          totalLak: subtotal,
          commissionPoolLak: targetProd.commissionPoolLak * qty,
          itemType: targetProd.itemType,
        },
      ],
      subtotalLak: subtotal,
      shippingFeeLak: shipping,
      totalLak: total,
      paymentMethod: newOrderForm.paymentMethod,
      paymentReference: `ADM-PAY-${Date.now().toString().slice(-6)}`,
      status: 'PAID',
      carrierId: targetProd.itemType === 'PHYSICAL' ? carrier.id : undefined,
      carrierName: targetProd.itemType === 'PHYSICAL' ? carrier.name : undefined,
      trackingNumber: targetProd.itemType === 'PHYSICAL' ? `${carrier.trackingPrefix}-${Date.now().toString().slice(-6)}` : undefined,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };

    adminAddOrder(ord);
    setShowAddOrderModal(false);
    showNotification(`Created manual order ${ord.id} for buyer ${ord.buyerMemberId}!`);
  };

  const handleSaveOrderEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    adminUpdateOrder(editingOrder.id, editingOrder);
    setEditingOrder(null);
    showNotification(`Updated order ${editingOrder.id}!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete/cancel order ${orderId}?`)) {
      adminDeleteOrder(orderId);
      showNotification(`Deleted order ${orderId}.`);
    }
  };

  // ---------------- SHIPPING CARRIERS & PRICE CRUD STATE ----------------
  const [showShippingCrudModal, setShowShippingCrudModal] = useState(false);
  const [shippingCrudMode, setShippingCrudMode] = useState<'CREATE' | 'EDIT'>('EDIT');
  const [editingCarrierId, setEditingCarrierId] = useState<string>('ANOUSITH');
  const [shippingCarrierForm, setShippingCarrierForm] = useState({
    id: 'ANOUSITH',
    name: 'Anousith Logistics',
    nameLao: 'ອານຸສິດ ຂົນສົ່ງ (Anousith Logistics)',
    badge: 'Nationwide Network • 18 Provinces',
    estimatedDays: '1-2 Days',
    baseFeeLak: 35000,
    trackingPrefix: 'ANS-LA',
    hotline: '1668 / +856 20 5511 8899',
    logoColor: '#e11d48',
    description:
      'Largest door-to-door parcel delivery & branch network covering all 18 provinces in Lao PDR.',
  });

  const handleOpenEditShippingCarrier = (carrier: LaoShippingCarrier) => {
    setShippingCrudMode('EDIT');
    setEditingCarrierId(carrier.id);
    setShippingCarrierForm({
      id: carrier.id,
      name: carrier.name,
      nameLao: carrier.nameLao,
      badge: carrier.badge,
      estimatedDays: carrier.estimatedDays,
      baseFeeLak: carrier.baseFeeLak,
      trackingPrefix: carrier.trackingPrefix,
      hotline: carrier.hotline,
      logoColor: carrier.logoColor || '#f59e0b',
      description: carrier.description,
    });
    setShowShippingCrudModal(true);
  };

  const handleOpenCreateShippingCarrier = () => {
    setShippingCrudMode('CREATE');
    setEditingCarrierId('');
    setShippingCarrierForm({
      id: `CARRIER_${Date.now().toString().slice(-4)}`,
      name: '',
      nameLao: '',
      badge: 'Nationwide Express • 18 Provinces',
      estimatedDays: '1-2 Days',
      baseFeeLak: 30000,
      trackingPrefix: 'LAO-EXP',
      hotline: '+856 20 5500 9988',
      logoColor: '#3b82f6',
      description: 'Door-to-door and provincial branch delivery across Lao PDR.',
    });
    setShowShippingCrudModal(true);
  };

  const handleSaveShippingCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = shippingCarrierForm.name.trim() || 'Lao Express Carrier';
    const cleanNameLao = shippingCarrierForm.nameLao.trim() || cleanName;
    const cleanFee = Math.max(0, Math.round(Number(shippingCarrierForm.baseFeeLak) || 0));

    if (shippingCrudMode === 'EDIT' && editingCarrierId) {
      adminUpdateShippingCarrier(editingCarrierId, {
        name: cleanName,
        nameLao: cleanNameLao,
        badge: shippingCarrierForm.badge.trim() || 'Nationwide Delivery',
        estimatedDays: shippingCarrierForm.estimatedDays.trim() || '1-2 Days',
        baseFeeLak: cleanFee,
        trackingPrefix: shippingCarrierForm.trackingPrefix.trim().toUpperCase() || 'DMC-EXP',
        hotline: shippingCarrierForm.hotline.trim() || '+856 20 5511 2233',
        logoColor: shippingCarrierForm.logoColor || '#f59e0b',
        description: shippingCarrierForm.description.trim(),
      });
      showNotification(
        `Updated shipping carrier "${cleanName}" price to ${formatLak(cleanFee)}!`
      );
    } else {
      const created = adminAddShippingCarrier({
        id: shippingCarrierForm.id,
        name: cleanName,
        nameLao: cleanNameLao,
        badge: shippingCarrierForm.badge.trim() || 'Nationwide Delivery',
        estimatedDays: shippingCarrierForm.estimatedDays.trim() || '1-2 Days',
        baseFeeLak: cleanFee,
        trackingPrefix: shippingCarrierForm.trackingPrefix.trim().toUpperCase() || 'DMC-EXP',
        hotline: shippingCarrierForm.hotline.trim() || '+856 20 5511 2233',
        logoColor: shippingCarrierForm.logoColor || '#3b82f6',
        description: shippingCarrierForm.description.trim(),
      });
      showNotification(
        `Added new shipping carrier "${created.name}" (${formatLak(created.baseFeeLak)})!`
      );
    }
    setShowShippingCrudModal(false);
  };

  // ---------------- SONGS CRUD MODALS ----------------
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [editingSong, setEditingSong] = useState<SongProductionProject | null>(null);

  const [newSongForm, setNewSongForm] = useState({
    memberId: allMembers[0]?.memberId || 'DMC-LA-00404',
    title: '',
    genre: 'Lao Modern Pop',
    tempo: '90 BPM',
    producer: 'Xay Raxa',
    status: 'IN_QUEUE' as SongProductionProject['status'],
    progressPercent: 10,
  });

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    const song: SongProductionProject = {
      id: `sng-adm-${Date.now().toString().slice(-5)}`,
      memberId: newSongForm.memberId,
      title: newSongForm.title,
      genre: newSongForm.genre,
      tempo: newSongForm.tempo,
      producer: newSongForm.producer,
      studioLocation: 'DMC Central Studio, Vientiane',
      status: newSongForm.status,
      progressPercent: Number(newSongForm.progressPercent),
      previewAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
      updatedAt: new Date().toISOString(),
    };
    adminAddSong(song);
    setShowAddSongModal(false);
    showNotification(`Added new song project: "${song.title}"!`);
  };

  const handleSaveSongEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;
    adminUpdateSong(editingSong.id, editingSong);
    setEditingSong(null);
    showNotification(`Updated studio song "${editingSong.title}"!`);
  };

  const handleDeleteSong = (songId: string) => {
    if (window.confirm(`Are you sure you want to delete studio song ${songId}?`)) {
      adminDeleteSong(songId);
      showNotification(`Deleted song project ${songId}.`);
    }
  };

  // ---------------- LAO BANKS & CORPORATE BANKING CRUD ----------------
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState<LaoBankDefinition | null>(null);
  const [showAddCorpBankModal, setShowAddCorpBankModal] = useState(false);
  const [editingCorpBank, setEditingCorpBank] = useState<CorporateBankAccount | null>(null);
  const [viewingBankQr, setViewingBankQr] = useState<CorporateBankAccount | null>(null);
  const [memberForBankEdit, setMemberForBankEdit] = useState<Member | null>(null);

  const [newBankForm, setNewBankForm] = useState({
    code: '',
    name: '',
    shortName: '',
    swiftCode: '',
    color: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    logoText: '',
    branchDefault: 'Head Office Vientiane',
    routingFormat: 'XXX-XX-XXXXXXX-XXX',
    isActive: true,
  });

  const [newCorpBankForm, setNewCorpBankForm] = useState({
    bankName: 'Phongsavanh Bank Ltd (Laos)',
    bankCode: 'PSVB',
    accountNumber: '',
    accountName: 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD',
    branch: 'Head Office Vientiane, Kaysone Phomvihane Ave',
    swiftCode: 'PSVBLALA',
    qrPayload: '',
    customQrImageUrl: '',
    isPrimaryForDeposits: false,
    isPrimaryForWithdrawals: false,
  });

  const [memberBankForm, setMemberBankForm] = useState({
    bankName: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
    accountNumber: '',
    accountName: '',
    branch: '',
    customQrImageUrl: '',
  });

  const handleCreateLaoBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankForm.name || !newBankForm.code) return;
    adminAddLaoBank({
      code: newBankForm.code.toUpperCase().trim(),
      name: newBankForm.name.trim(),
      shortName: newBankForm.shortName.trim() || newBankForm.name.trim(),
      swiftCode: newBankForm.swiftCode.toUpperCase().trim() || 'LAOPDR',
      color: newBankForm.color,
      badgeBg: newBankForm.badgeBg,
      logoText: newBankForm.logoText || newBankForm.code.toUpperCase().trim(),
      branchDefault: newBankForm.branchDefault.trim(),
      routingFormat: newBankForm.routingFormat.trim(),
      isActive: true,
    });
    setShowAddBankModal(false);
    setNewBankForm({
      code: '',
      name: '',
      shortName: '',
      swiftCode: '',
      color: 'from-amber-600 to-yellow-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      logoText: '',
      branchDefault: 'Head Office Vientiane',
      routingFormat: 'XXX-XX-XXXXXXX-XXX',
      isActive: true,
    });
    showNotification(`Successfully added Lao bank institution: ${newBankForm.name}!`);
  };

  const handleSaveLaoBankEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBank) return;
    adminUpdateLaoBank(editingBank.id, editingBank);
    setEditingBank(null);
    showNotification(`Updated Lao bank institution: ${editingBank.name}!`);
  };

  const handleDeleteLaoBank = (bankId: string, bankName: string) => {
    if (window.confirm(`Delete Lao bank registry entry "${bankName}"?`)) {
      adminDeleteLaoBank(bankId);
      showNotification(`Deleted Lao bank registry entry ${bankName}.`);
    }
  };

  const handleCreateCorpBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCorpBankForm.accountNumber) return;
    adminAddCorporateBankAccount({
      bankName: newCorpBankForm.bankName,
      bankCode: newCorpBankForm.bankCode,
      accountNumber: newCorpBankForm.accountNumber.trim(),
      accountName: newCorpBankForm.accountName.trim(),
      branch: newCorpBankForm.branch.trim(),
      swiftCode: newCorpBankForm.swiftCode.trim(),
      qrPayload: newCorpBankForm.qrPayload.trim() || `DMC-${newCorpBankForm.bankCode}-${newCorpBankForm.accountNumber}`,
      customQrImageUrl: newCorpBankForm.customQrImageUrl.trim() || undefined,
      isPrimaryForDeposits: newCorpBankForm.isPrimaryForDeposits,
      isPrimaryForWithdrawals: newCorpBankForm.isPrimaryForWithdrawals,
    });
    setShowAddCorpBankModal(false);
    setNewCorpBankForm({
      bankName: 'Phongsavanh Bank Ltd (Laos)',
      bankCode: 'PSVB',
      accountNumber: '',
      accountName: 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD',
      branch: 'Head Office Vientiane, Kaysone Phomvihane Ave',
      swiftCode: 'PSVBLALA',
      qrPayload: '',
      customQrImageUrl: '',
      isPrimaryForDeposits: false,
      isPrimaryForWithdrawals: false,
    });
    showNotification(`Added corporate settlement bank account & QR Code!`);
  };

  const handleSaveCorpBankEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCorpBank) return;
    adminUpdateCorporateBankAccount(editingCorpBank.id, editingCorpBank);
    setEditingCorpBank(null);
    showNotification(`Updated corporate bank account & QR Code (${editingCorpBank.accountNumber})!`);
  };

  const handleDeleteCorpBank = (accId: string, accNum: string) => {
    if (window.confirm(`Delete corporate bank account ${accNum}?`)) {
      adminDeleteCorporateBankAccount(accId);
      showNotification(`Deleted corporate bank account ${accNum}.`);
    }
  };

  const handleOpenMemberBankEdit = (member: Member) => {
    setMemberForBankEdit(member);
    setMemberBankForm({
      bankName: member.bankAccount?.bankName || 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
      accountNumber: member.bankAccount?.accountNumber || '',
      accountName: member.bankAccount?.accountName || member.name.toUpperCase(),
      branch: member.bankAccount?.branch || 'Head Office Vientiane',
      customQrImageUrl: member.bankAccount?.customQrImageUrl || '',
    });
  };

  const handleSaveMemberBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForBankEdit) return;
    const matched = laoBanks.find(b => b.name === memberBankForm.bankName);
    updateMemberBankAccount(memberForBankEdit.memberId, {
      bankName: memberBankForm.bankName,
      bankCode: matched?.code || 'CUSTOM',
      accountNumber: memberBankForm.accountNumber.trim(),
      accountName: memberBankForm.accountName.trim().toUpperCase(),
      branch: memberBankForm.branch.trim() || 'Head Office Vientiane',
      customQrImageUrl: memberBankForm.customQrImageUrl.trim() || undefined,
      isDefault: true,
    });
    showNotification(`Updated bank account & QR Code for ${memberForBankEdit.name}!`);
    setMemberForBankEdit(null);
  };

  // Withdrawals rejection state
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [rejectReasonText, setRejectReasonText] = useState('Invalid beneficiary name on bank account');

  // Filtered members
  const filteredMembers = allMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      {/* Admin Title & Security Level Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <DmcOfficialLogo size={46} rounded="2xl" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  DMC Internal Web Admin Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                  MASTER CRUD CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full Add, Edit, Update & Delete permissions across Members, Products, Orders, Songs, and Commission Rules.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveAdminTab('BUSINESS_CARDS')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#df1c2d] via-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Open 1/ Design Business Cards Studio & Print Hub"
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>1/ Design Business Cards</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('STEP_BY_STEP_PDF')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-[#df1c2d] hover:from-indigo-500 hover:to-red-500 text-white font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Open 2/ DMC_Xayraxa_Step_By_Step_Summary PDF Hub"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>2/ DMC_Xayraxa_Step_By_Step_Summary (.PDF)</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('COMPANY_PROFILE_PDF')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Open Company Profile Digital Music Center PDF File Hub"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Company Profile DMC (.PDF)</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('EXCEL_REPORTS')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              title="Open Administrator Excel Report Center (Files 1 - 7)"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.5]" />
              <span>Excel Reports (Files 1–7)</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('ADMIN_PROFILE')}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Update Super Admin or Member Profile, Password & Phone SMS Recovery (+856)"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Profile, Password & SMS Recovery (+856)</span>
            </button>

            <button
              onClick={() => {
                const musicCore = products.find(p => p.sku === 'MUSIC_SINGLE_1600');
                if (musicCore) setEditingProduct(musicCore);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Edit MUSIC_SINGLE_1600 price, 1 song entitlement, and 400k/200k/100k splits"
            >
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Core Product (MUSIC_SINGLE_1600)</span>
            </button>
            <div className="text-right text-xs font-mono text-slate-400 hidden sm:block">
              <div>Logged in: <strong className="text-amber-300">{superAdminProfile.operatorId}</strong></div>
              <div className="text-emerald-400 text-[11px]">{superAdminProfile.phone} • SMS READY</div>
            </div>
          </div>
        </div>

        {/* Official PDF Dossier, Business Cards & Quick 7-File Excel Report Strip in Admin Header */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
          {/* Featured 1/ Design Business Cards & 2/ DMC_Xayraxa_Step_By_Step_Summary PDF Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {/* 1/ Design Business Cards Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#df1c2d]/20 via-slate-900 to-amber-500/15 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#df1c2d] text-slate-950 font-black flex items-center justify-center shrink-0 shadow">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white">
                      1/ Design Business Cards (Front & Back + A4 8-Card Print Sheet)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      300 DPI .PDF & .PNG
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    ອອກແບບນາມບັດບໍລິຫານ ແລະ ສະມາຊິກ DMC Xayraxa (4 ຮູບແບບ • ພາສາລາວ & English)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('BUSINESS_CARDS')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Open Business Card Studio</span>
                </button>
              </div>
            </div>

            {/* 2/ DMC_Xayraxa_Step_By_Step_Summary PDF Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-slate-900 to-emerald-500/15 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-white">
                      2/ DMC_Xayraxa_Step_By_Step_Summary PDF (ພາສາລາວ & English)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      10 STEPS • 3-PAGE .PDF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    ຄູ່ມືສະຫຼຸບ 10 ຂັ້ນຕອນ: ສະໝັກສະມາຊິກ, 1.6M LAK, Unilevel 3 ຊັ້ນ, ກະເປົາເງິນ 5 ບັນຊີ & ຫ້ອງອັດສຽງ
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('STEP_BY_STEP_PDF')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs cursor-pointer"
                >
                  Preview PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadStepByStepSummaryPdf(
                      DEFAULT_STEP_BY_STEP_SUMMARY_DATA,
                      '2_DMC_Xayraxa_Step_By_Step_Summary_Lao.pdf',
                      'LO'
                    );
                    showNotification(
                      'ດາວໂຫຼດ 2_DMC_Xayraxa_Step_By_Step_Summary_Lao.pdf (ພາສາລາວ) ສຳເລັດແລ້ວ!'
                    );
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-black text-xs flex items-center gap-1 shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>🇱🇦 Lao .PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadStepByStepSummaryPdf(
                      DEFAULT_STEP_BY_STEP_SUMMARY_DATA,
                      '2_DMC_Xayraxa_Step_By_Step_Summary.pdf',
                      'EN'
                    );
                    showNotification(
                      'Downloaded 2_DMC_Xayraxa_Step_By_Step_Summary.pdf (English Version)!'
                    );
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>🇬🇧 EN .PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Featured Company Profile Digital Music Center PDF Strip */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/10 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-white">
                    1/ Company Profile — Digital Music Center (DMC) Official PDF File (ພາສາລາວ & English)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    LAO & EN 4-PAGE A4 .PDF
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  ໂປຣໄຟລ໌ບໍລິສັດ ສະບັບພາສາລາວ ແລະ ພາສາອັງກິດ • Statutory Registration, 5-Stage Music Studio, 1.6M LAK Package & Lao Banks
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveAdminTab('COMPANY_PROFILE_PDF')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs cursor-pointer transition-colors"
              >
                Preview & Edit PDF
              </button>
              <button
                type="button"
                onClick={() => {
                  let savedProfile = DEFAULT_COMPANY_PROFILE_DATA;
                  try {
                    const raw = localStorage.getItem('dmc_company_profile_pdf_v28');
                    if (raw) savedProfile = { ...DEFAULT_COMPANY_PROFILE_DATA, ...JSON.parse(raw) };
                  } catch {
                    // ignore
                  }
                  const activeLifetimeMembers = allMembers.filter(
                    m => m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                  ).length;
                  const totalSongs = allMembers.reduce(
                    (sum, m) => sum + getMemberSongs(m.memberId).length,
                    0
                  );
                  downloadCompanyProfilePdf(
                    savedProfile,
                    {
                      totalMembers: allMembers.length,
                      activeLifetimeMembers,
                      totalProducts: products.length,
                      totalOrders: orders.length,
                      totalSongs,
                      totalBanks: laoBanks.length,
                      supportedBanksList: laoBanks.map(b => `${b.code} (${b.name})`),
                      shippingCarriersList: shippingCarriers.map(c => c.name),
                    },
                    '1_DMC_Company_Profile_Lao_Version.pdf',
                    'LO'
                  );
                  showNotification(
                    'ດາວໂຫຼດ ໂປຣໄຟລ໌ບໍລິສັດ ສະບັບພາສາລາວ (1_DMC_Company_Profile_Lao_Version.pdf) ສຳເລັດແລ້ວ!'
                  );
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>🇱🇦 PDF ພາສາລາວ (.pdf)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  let savedProfile = DEFAULT_COMPANY_PROFILE_DATA;
                  try {
                    const raw = localStorage.getItem('dmc_company_profile_pdf_v28');
                    if (raw) savedProfile = { ...DEFAULT_COMPANY_PROFILE_DATA, ...JSON.parse(raw) };
                  } catch {
                    // ignore
                  }
                  const activeLifetimeMembers = allMembers.filter(
                    m => m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                  ).length;
                  const totalSongs = allMembers.reduce(
                    (sum, m) => sum + getMemberSongs(m.memberId).length,
                    0
                  );
                  downloadCompanyProfilePdf(
                    savedProfile,
                    {
                      totalMembers: allMembers.length,
                      activeLifetimeMembers,
                      totalProducts: products.length,
                      totalOrders: orders.length,
                      totalSongs,
                      totalBanks: laoBanks.length,
                      supportedBanksList: laoBanks.map(b => `${b.code} (${b.name})`),
                      shippingCarriersList: shippingCarriers.map(c => c.name),
                    },
                    '1_DMC_Company_Profile_English_Version.pdf',
                    'EN'
                  );
                  showNotification(
                    'Downloaded English Company Profile PDF (1_DMC_Company_Profile_English_Version.pdf)!'
                  );
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>🇬🇧 PDF English (.pdf)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Administrator Official Excel Report Files (1 – 7):</span>
            </span>
            <button
              type="button"
              onClick={() => setActiveAdminTab('EXCEL_REPORTS')}
              className="text-[11px] font-bold text-amber-300 hover:underline cursor-pointer"
            >
              Open Full Excel Report Center →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: '1_MEMBERS' as AdminReportId, label: '1/ Register Member CRUD' },
              { id: '2_PASSWORDS' as AdminReportId, label: '2/ Admin & User Password' },
              { id: '3_PRODUCTS' as AdminReportId, label: '3/ Products & SKUs' },
              { id: '4_ORDERS' as AdminReportId, label: '4/ Orders & Shipping' },
              { id: '5_SONGS' as AdminReportId, label: '5/ Studio Song File' },
              { id: '6_PAYMENT_PROVED' as AdminReportId, label: '6/ Payment Proved' },
              { id: '7_ORGANIZE_TREE' as AdminReportId, label: '7/ Downline Organize Tree' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedExcelReport(item.id);
                  setActiveAdminTab('EXCEL_REPORTS');
                }}
                className={`px-2.5 py-2 rounded-xl border text-left text-[11px] font-extrabold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                  activeAdminTab === 'EXCEL_REPORTS' && selectedExcelReport === item.id
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                    : 'bg-slate-950/90 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <Download className="w-3 h-3 shrink-0 text-emerald-400" />
              </button>
            ))}
          </div>
        </div>

        {successBanner && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successBanner}</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto text-xs">
        {[
          { id: 'BUSINESS_CARDS', label: '1/ Design Business Cards', icon: CreditCard, count: 4 },
          { id: 'STEP_BY_STEP_PDF', label: '2/ Step-By-Step Summary PDF', icon: FileText, count: 10 },
          { id: 'COMPANY_PROFILE_PDF', label: 'Company Profile PDF', icon: FileText, count: 4 },
          { id: 'EXCEL_REPORTS', label: 'Excel Reports (1-7)', icon: FileSpreadsheet, count: 7 },
          { id: 'MEMBERS', label: 'Members CRUD', icon: Users, count: allMembers.length },
          { id: 'STAFF', label: 'Staff & Positions (8)', icon: Users, count: staffMembers.length },
          { id: 'ORGANIZE', label: 'Downline Organize Tree', icon: Layers, count: allMembers.length },
          { id: 'EVENTS', label: 'Event & Activity Posts', icon: Megaphone, count: eventPosts.length },
          { id: 'ADMIN_PROFILE', label: 'Admin & User SMS Security', icon: Smartphone },
          { id: 'PRODUCTS', label: 'Products & SKUs', icon: Package, count: products.length },
          { id: 'ORDERS', label: 'Orders & Shipping', icon: Truck, count: orders.length },
          { id: 'SONGS', label: 'Studio Songs', icon: Music, count: 3 },
          { id: 'WITHDRAWALS', label: 'Payout Approvals', icon: UserCheck, count: withdrawals.filter(w => w.status !== 'PAID').length },
          { id: 'BANKS', label: 'Lao Banks & Payout', icon: Landmark, count: laoBanks.length + corporateBankAccounts.length },
          { id: 'RULES', label: 'Commission Splits', icon: Sliders },
          { id: 'UAT', label: 'UAT Matrix (A01-E06)', icon: Play },
          { id: 'AUDIT', label: 'System Logs', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isAct = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isAct
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isAct ? 'bg-slate-950/20' : 'bg-slate-800'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB: 1/ DESIGN BUSINESS CARDS STUDIO ================= */}
      {activeAdminTab === 'BUSINESS_CARDS' && (
        <AdminBusinessCardStudio />
      )}

      {/* ================= TAB: 2/ DMC_XAYRAXA_STEP_BY_STEP_SUMMARY PDF ================= */}
      {activeAdminTab === 'STEP_BY_STEP_PDF' && (
        <AdminStepByStepPdfHub />
      )}

      {/* ================= TAB: COMPANY PROFILE DIGITAL MUSIC CENTER PDF ================= */}
      {activeAdminTab === 'COMPANY_PROFILE_PDF' && (
        <AdminCompanyProfilePdfHub />
      )}

      {/* ================= TAB: EXCEL REPORTS CENTER (FILES 1 - 7) ================= */}
      {activeAdminTab === 'EXCEL_REPORTS' && (
        <AdminExcelReportHub key={selectedExcelReport} initialReport={selectedExcelReport} />
      )}

      {/* ================= TAB: DOWNLINE ORGANIZE TREE ================= */}
      {activeAdminTab === 'ORGANIZE' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs text-slate-300 font-semibold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>7/ Report Down line Organize Tree File — Ready for Excel (.xls) & CSV Export</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedExcelReport('7_ORGANIZE_TREE');
                setActiveAdminTab('EXCEL_REPORTS');
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel (7/ Downline Organize Tree File)</span>
            </button>
          </div>
          <DownlineOrganizeTree />
        </div>
      )}

      {/* ================= TAB: EVENT & ACTIVITY POSTS (ADMIN ONLY) ================= */}
      {activeAdminTab === 'EVENTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>Administrator Only: Post Event & Activity Slideshow</span>
              </h3>
              <p className="text-xs text-slate-400">
                Only authenticated Administrators can post, upload images, edit, or delete Event & Activity announcements shown on the Home Screen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Post / Edit Event Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const headlineText = adminEventForm.headline.trim() || adminEventForm.title.trim() || 'DMC Event & Activity';
                const titleText = adminEventForm.title.trim() || headlineText;
                if (adminEventForm.id) {
                  adminUpdateEventPost(adminEventForm.id, {
                    headline: headlineText,
                    title: titleText,
                    information: adminEventForm.information.trim(),
                    imageUrl: adminEventForm.imageUrl.trim(),
                    eventDate: adminEventForm.eventDate.trim(),
                    location: adminEventForm.location.trim(),
                    badge: adminEventForm.badge.trim() || 'EVENT & ACTIVITY',
                  });
                  showNotification(`Updated Event & Activity: "${titleText}"`);
                } else {
                  adminAddEventPost({
                    headline: headlineText,
                    title: titleText,
                    information: adminEventForm.information.trim() || 'Official DMC Xayraxa Event & Activity.',
                    imageUrl: adminEventForm.imageUrl.trim(),
                    eventDate: adminEventForm.eventDate.trim() || 'Upcoming',
                    location: adminEventForm.location.trim() || 'Vientiane Capital',
                    badge: adminEventForm.badge.trim() || 'EVENT & ACTIVITY',
                  });
                  showNotification(`Posted new Event & Activity: "${titleText}"`);
                }
                setAdminEventForm({
                  id: '',
                  headline: '',
                  title: '',
                  information: '',
                  imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
                  eventDate: '25 Oct 2026 • 18:00',
                  location: 'DMC Central Studio, Vientiane',
                  badge: 'EVENT & ACTIVITY',
                });
              }}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-amber-300">
                  {adminEventForm.id ? 'Edit Event & Activity Slide' : '+ Post New Event & Activity'}
                </h4>
                {adminEventForm.id && (
                  <button
                    type="button"
                    onClick={() =>
                      setAdminEventForm({
                        id: '',
                        headline: '',
                        title: '',
                        information: '',
                        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80',
                        eventDate: '25 Oct 2026 • 18:00',
                        location: 'DMC Central Studio, Vientiane',
                        badge: 'EVENT & ACTIVITY',
                      })
                    }
                    className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    + Switch to New Post
                  </button>
                )}
              </div>

              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                <img
                  src={adminEventForm.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                  {adminEventForm.badge || 'EVENT & ACTIVITY'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Event Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setAdminEventForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={adminEventForm.imageUrl}
                  onChange={(e) => setAdminEventForm({ ...adminEventForm, imageUrl: e.target.value })}
                  placeholder="Or paste Image URL..."
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Head Line Ticker Text *
                </label>
                <input
                  type="text"
                  required
                  value={adminEventForm.headline}
                  onChange={(e) => setAdminEventForm({ ...adminEventForm, headline: e.target.value })}
                  placeholder="e.g. DMC Xayraxa Grand Music Gala 2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Event / Activity Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={adminEventForm.title}
                    onChange={(e) => setAdminEventForm({ ...adminEventForm, title: e.target.value })}
                    placeholder="Event Slide Title"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Badge</label>
                  <input
                    type="text"
                    value={adminEventForm.badge}
                    onChange={(e) => setAdminEventForm({ ...adminEventForm, badge: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={adminEventForm.eventDate}
                    onChange={(e) => setAdminEventForm({ ...adminEventForm, eventDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={adminEventForm.location}
                    onChange={(e) => setAdminEventForm({ ...adminEventForm, location: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Information & Activity Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={adminEventForm.information}
                  onChange={(e) => setAdminEventForm({ ...adminEventForm, information: e.target.value })}
                  placeholder="Enter full Event & Activity details..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow"
              >
                {adminEventForm.id ? 'Update Event & Activity Slide' : 'Post Event & Activity Slide'}
              </button>
            </form>

            {/* Right: Existing Event & Activity Slides */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Event & Activity Slides ({eventPosts.length})
              </h4>
              {eventPosts.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex gap-3 items-start text-xs"
                >
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-24 h-20 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                        {evt.badge || 'EVENT'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setAdminEventForm({
                              id: evt.id,
                              headline: evt.headline,
                              title: evt.title,
                              information: evt.information,
                              imageUrl: evt.imageUrl,
                              eventDate: evt.eventDate,
                              location: evt.location,
                              badge: evt.badge || 'EVENT & ACTIVITY',
                            })
                          }
                          className="px-2 py-1 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {eventPosts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              adminDeleteEventPost(evt.id);
                              showNotification(`Deleted event "${evt.title}"`);
                            }}
                            className="p-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-white truncate">{evt.title}</div>
                    <div className="text-[11px] text-amber-300/90 truncate">{evt.headline}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{evt.information}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {evt.eventDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {evt.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 1: MEMBERS CRUD ================= */}
      {activeAdminTab === 'MEMBERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>Member Accounts Management (Add, Edit, Update, Delete)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage registered user identities, adjust qualification held credits, change sponsors, or delete accounts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, phone, ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Member</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMembers.map(member => {
              const b = getMemberBalances(member.memberId);
              const isAct = member.membershipState === 'ACTIVE_LIFETIME_MEMBER';
              const existingStaff = staffMembers.find(s => s.memberId === member.memberId);
              const isMemberStaff = Boolean(member.isStaff || existingStaff);
              const currentStaffPosition = member.staffPosition || existingStaff?.position || 'Teacher';
              return (
                <div
                  key={member.memberId}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm flex items-center gap-2 flex-wrap">
                          <span>{member.name}</span>
                          <span className="font-mono text-amber-300 font-semibold text-xs">{member.memberId}</span>
                          {isMemberStaff && (
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black uppercase">
                              STAFF: {currentStaffPosition}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Phone: {member.phone}</span>
                          <span>•</span>
                          <span>Sponsor: {member.sponsorId || 'Direct (DMC)'}</span>
                          <span>•</span>
                          <span>KYC: <strong className={member.kycStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>{member.kycStatus}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-slate-400">Held: <strong className="text-amber-300">{formatLak(b.heldForQualification)}</strong> <span className="text-[9px] text-amber-400/90 font-bold">({formatLakCompact(b.heldForQualification)})</span></div>
                        <div className="text-[10px] text-slate-400">Available: <strong className="text-emerald-400">{formatLak(b.available)}</strong> <span className="text-[9px] text-emerald-400/90 font-bold">({formatLakCompact(b.available)})</span></div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isAct
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isAct ? 'ACTIVE' : 'FREE'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">
                      Bank: {member.bankAccount?.bankName} ({member.bankAccount?.accountNumber})
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Administrator Direct Upgrade Member to Staff Control */}
                      <div className="flex items-center gap-1 bg-slate-900/90 border border-sky-500/40 rounded-lg px-2 py-1">
                        <select
                          value={currentStaffPosition}
                          onChange={e => {
                            const newPos = e.target.value as StaffPosition;
                            adminUpgradeMemberToStaff(member.memberId, newPos);
                            showNotification(
                              `Upgraded Member ${member.name} (${member.memberId}) to ${newPos} Staff!`
                            );
                          }}
                          className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-bold text-amber-300 cursor-pointer"
                          title="Select Official Staff Position for this Member"
                        >
                          {DMC_STAFF_POSITIONS.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.labelEn}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            adminUpgradeMemberToStaff(member.memberId, currentStaffPosition);
                            showNotification(
                              `Upgraded Member ${member.name} (${member.memberId}) to Official Staff (${currentStaffPosition})!`
                            );
                          }}
                          className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-black text-[10px] cursor-pointer"
                        >
                          {isMemberStaff ? 'Update Staff Role' : '↑ Upgrade to Staff'}
                        </button>
                        {isMemberStaff && (
                          <button
                            type="button"
                            onClick={() => {
                              adminDowngradeStaffToMember(member.memberId);
                              showNotification(
                                `Downgraded ${member.name} (${member.memberId}) back to regular Member.`
                              );
                            }}
                            className="px-1.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[10px] cursor-pointer"
                            title="Remove Staff role"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => setAdjustingMember(member)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] flex items-center gap-1 border border-slate-700"
                        title="Adjust balance with audit note"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Adjust Balance</span>
                      </button>

                      <button
                        onClick={() => setEditingMember(member)}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold text-[11px] flex items-center gap-1 border border-sky-500/30"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit / Update</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMember(member.memberId)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-[11px] flex items-center gap-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 1B: DMC STAFF & 8 POSITIONS CRUD ================= */}
      {activeAdminTab === 'STAFF' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>DMC Staff & 8 Official Positions Management (Add, Edit, Delete, Update)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Positions: Administrator • Assistance • Accounting • Marketing • IT • Teacher • Fencer • Part time
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                adminResetStaffMembers();
                showNotification('Reset DMC Staff Directory to default 8 positions!');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold cursor-pointer"
            >
              Reset Default Staff
            </button>
          </div>

          {/* 8 Position Filter Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {DMC_STAFF_POSITIONS.map((pos) => {
              const count = staffMembers.filter((s) => s.position === pos.id).length;
              const isSelected = adminStaffFilterPos === pos.id;
              return (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setAdminStaffFilterPos(isSelected ? 'ALL' : pos.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `bg-gradient-to-r ${pos.badgeColor} text-white border-amber-300 shadow-lg`
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black truncate">- {pos.labelEn}</span>
                    <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px] font-mono font-bold">
                      {count}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-80 truncate mt-0.5">{pos.labelLo}</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Create / Edit Staff Member Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanName = adminStaffForm.fullName.trim() || 'DMC Staff';
                if (adminEditingStaffId) {
                  adminUpdateStaffMember(adminEditingStaffId, {
                    staffCode: adminStaffForm.staffCode.trim(),
                    fullName: cleanName,
                    position: adminStaffForm.position,
                    phone: adminStaffForm.phone.trim(),
                    email: adminStaffForm.email.trim(),
                    branch: adminStaffForm.branch.trim(),
                    avatarUrl: adminStaffForm.avatarUrl.trim(),
                    bioOrDuty: adminStaffForm.bioOrDuty.trim(),
                    status: adminStaffForm.status,
                  });
                  showNotification(`Updated Staff "${cleanName}" (${adminStaffForm.position})!`);
                } else if (adminSelectedMemberToUpgrade) {
                  adminUpgradeMemberToStaff(
                    adminSelectedMemberToUpgrade,
                    adminStaffForm.position,
                    {
                      staffCode: adminStaffForm.staffCode.trim(),
                      branch: adminStaffForm.branch.trim(),
                      bioOrDuty: adminStaffForm.bioOrDuty.trim(),
                      status: adminStaffForm.status,
                    }
                  );
                  showNotification(
                    `Upgraded Member ${adminSelectedMemberToUpgrade} ("${cleanName}") to Staff (${adminStaffForm.position})!`
                  );
                } else {
                  adminAddStaffMember({
                    staffCode: adminStaffForm.staffCode.trim(),
                    fullName: cleanName,
                    position: adminStaffForm.position,
                    phone: adminStaffForm.phone.trim(),
                    email: adminStaffForm.email.trim(),
                    branch: adminStaffForm.branch.trim(),
                    avatarUrl: adminStaffForm.avatarUrl.trim(),
                    bioOrDuty: adminStaffForm.bioOrDuty.trim(),
                    status: adminStaffForm.status,
                  });
                  showNotification(`Created Staff "${cleanName}" in position "${adminStaffForm.position}"!`);
                }
                setAdminEditingStaffId(null);
                setAdminSelectedMemberToUpgrade('');
                setAdminStaffForm({
                  staffCode: `DMC-STF-${String(staffMembers.length + 2).padStart(3, '0')}`,
                  fullName: '',
                  position: 'Teacher',
                  phone: '+856 20 ',
                  email: '',
                  branch: 'Dongdok Campus Studio Hub, Vientiane',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
                  bioOrDuty: '',
                  status: 'ACTIVE',
                });
              }}
              className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-black text-amber-400 text-sm">
                  {adminEditingStaffId
                    ? 'Edit / Update Staff Member'
                    : '+ Create Staff or Upgrade Member'}
                </span>
                {adminEditingStaffId && (
                  <button
                    type="button"
                    onClick={() => setAdminEditingStaffId(null)}
                    className="text-slate-400 hover:text-white text-[11px] font-bold cursor-pointer"
                  >
                    Cancel Edit ✕
                  </button>
                )}
              </div>

              {!adminEditingStaffId && (
                <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-500/40 space-y-1.5">
                  <label className="block text-[10px] font-black text-sky-300 uppercase">
                    ↑ Quick Upgrade Existing Member to Become Staff:
                  </label>
                  <select
                    value={adminSelectedMemberToUpgrade}
                    onChange={(e) => {
                      const memId = e.target.value;
                      setAdminSelectedMemberToUpgrade(memId);
                      const mem = allMembers.find((m) => m.memberId === memId);
                      if (mem) {
                        const existingStf = staffMembers.find((s) => s.memberId === memId);
                        setAdminStaffForm((prev) => ({
                          ...prev,
                          staffCode:
                            existingStf?.staffCode ||
                            mem.staffCode ||
                            `DMC-STF-${mem.memberId}`,
                          fullName: mem.name.replace(/\s*\(.*?\)\s*/g, ''),
                          position:
                            mem.staffPosition || existingStf?.position || prev.position,
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
                    className="w-full bg-slate-900 border border-sky-500/50 rounded-xl px-2.5 py-2 text-xs text-white font-bold"
                  >
                    <option value="">-- Or Enter New Staff Details Manually --</option>
                    {allMembers.map((m) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberId} - {m.name}{' '}
                        {m.isStaff ? `(Staff: ${m.staffPosition})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-amber-300 mb-1">
                  Staff Position * (8 Positions)
                </label>
                <select
                  value={adminStaffForm.position}
                  onChange={(e) =>
                    setAdminStaffForm({
                      ...adminStaffForm,
                      position: e.target.value as StaffPosition,
                    })
                  }
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-white font-black"
                >
                  {DMC_STAFF_POSITIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      - {p.labelEn} ({p.labelLo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminStaffForm.fullName}
                    onChange={(e) =>
                      setAdminStaffForm({ ...adminStaffForm, fullName: e.target.value })
                    }
                    placeholder="Full Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Staff Code *</label>
                  <input
                    type="text"
                    required
                    value={adminStaffForm.staffCode}
                    onChange={(e) =>
                      setAdminStaffForm({
                        ...adminStaffForm,
                        staffCode: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={adminStaffForm.phone}
                    onChange={(e) =>
                      setAdminStaffForm({ ...adminStaffForm, phone: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Branch / Studio</label>
                  <input
                    type="text"
                    value={adminStaffForm.branch}
                    onChange={(e) =>
                      setAdminStaffForm({ ...adminStaffForm, branch: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Duties / Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={adminStaffForm.bioOrDuty}
                  onChange={(e) =>
                    setAdminStaffForm({ ...adminStaffForm, bioOrDuty: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow"
              >
                {adminEditingStaffId ? 'Update Staff Member' : '+ Add Staff Member'}
              </button>
            </form>

            {/* Right: Staff Directory Cards */}
            <div className="lg:col-span-7 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {staffMembers
                .filter(
                  (s) => adminStaffFilterPos === 'ALL' || s.position === adminStaffFilterPos
                )
                .map((stf) => {
                  const posMeta =
                    DMC_STAFF_POSITIONS.find((p) => p.id === stf.position) ||
                    DMC_STAFF_POSITIONS[0];
                  return (
                    <div
                      key={stf.id}
                      className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/70 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={stf.avatarUrl}
                          alt={stf.fullName}
                          className="w-11 h-11 rounded-xl object-cover border border-amber-400/60 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{stf.fullName}</span>
                            <span className="font-mono text-[10px] text-amber-300">
                              {stf.staffCode}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r ${posMeta.badgeColor}`}
                            >
                              {stf.position}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {stf.bioOrDuty || posMeta.description}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {stf.phone} • {stf.branch}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setAdminEditingStaffId(stf.id);
                            setAdminStaffForm({
                              staffCode: stf.staffCode,
                              fullName: stf.fullName,
                              position: stf.position,
                              phone: stf.phone,
                              email: stf.email || '',
                              branch: stf.branch,
                              avatarUrl: stf.avatarUrl,
                              bioOrDuty: stf.bioOrDuty,
                              status: stf.status,
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {staffMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              adminDeleteStaffMember(stf.id);
                              showNotification(`Deleted staff member ${stf.fullName}`);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS CRUD ================= */}
      {activeAdminTab === 'PRODUCTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>Product Catalog & Commission SKU Pools (CRUD)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Add new products, update prices and stock levels, customize unilevel 50/30/20 splits, or remove items.
              </p>
            </div>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product SKU</span>
            </button>
          </div>

          {/* Prominent Core Package Spotlight */}
          {products.find(p => p.sku === 'MUSIC_SINGLE_1600') && (() => {
            const core = products.find(p => p.sku === 'MUSIC_SINGLE_1600')!;
            return (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-800/80 to-slate-900 border-2 border-amber-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                      Official Core Product (Rev 2.6)
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-300">{core.sku}</span>
                  </div>
                  <h4 className="font-bold text-white text-base">{core.titleEn}</h4>
                  <p className="text-xs text-slate-300 max-w-2xl">{core.descriptionEn}</p>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono pt-1">
                    <span className="text-slate-300">Price: <strong className="text-white">{formatLak(core.priceLak)}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-300">Studio: <strong>{formatLak(core.splitRule.dmcBudget || 900000)}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400">L1: <strong>{formatLak(core.splitRule.l1Share || 400000)}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400">L2: <strong>{formatLak(core.splitRule.l2Share || 200000)}</strong></span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400">L3: <strong>{formatLak(core.splitRule.l3Share || 100000)}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setEditingProduct(core)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Core Product</span>
                </button>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map(p => (
              <div
                key={p.sku}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-3 text-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img src={p.imageUrl} alt={p.titleEn} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">{p.sku}</span>
                      <h4 className="font-bold text-white text-sm mt-0.5 truncate">{p.titleEn}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.descriptionEn}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 shrink-0">
                      Stock: {p.stockSellable}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono">
                    <div className="flex justify-between text-slate-300">
                      <span>Price: <strong>{formatLak(p.priceLak)}</strong></span>
                      <span>Pool: <strong className="text-amber-300">{formatLak(p.commissionPoolLak)}</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {p.sku === 'MUSIC_SINGLE_1600' ? (
                        <span>Split: Studio {formatLak(p.splitRule.dmcBudget || 900000)} • L1 {formatLak(p.splitRule.l1Share)} • L2 {formatLak(p.splitRule.l2Share)} • L3 {formatLak(p.splitRule.l3Share)}</span>
                      ) : (
                        <span>Split: L1 {p.splitRule.l1Share}% • L2 {p.splitRule.l2Share}% • L3 {p.splitRule.l3Share}%</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{p.warehouseId}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold text-[11px] flex items-center gap-1 border border-sky-500/30"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {p.sku !== 'MUSIC_SINGLE_1600' && (
                      <button
                        onClick={() => handleDeleteProduct(p.sku)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-[11px] flex items-center gap-1 border border-red-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: ORDERS & SHIPPING CRUD ================= */}
      {activeAdminTab === 'ORDERS' && (
        <div className="space-y-6 animate-in fade-in">
          {/* SECTION 1: SHIPPING CARRIERS & PRICE MANAGEMENT (ADD, EDIT, UPDATE, DELETE) */}
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>
                    Lao Shipping Carriers & Price Control (Add, Edit, Delete, Update Shipping Price)
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage shipping companies and adjust shipping prices (LAK) anytime carrier rates change.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    adminResetShippingCarriers();
                    showNotification('Reset shipping carriers and prices to default!');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleOpenCreateShippingCarrier}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Shipping Carrier</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {shippingCarriers.map((carrier) => (
                <div
                  key={carrier.id}
                  className="p-4 rounded-2xl bg-slate-800/45 border border-slate-700/70 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: carrier.logoColor }}
                          />
                          <h4 className="font-black text-sm text-white truncate">
                            {carrier.name}
                          </h4>
                        </div>
                        <div className="text-[11px] text-amber-200 font-medium mt-0.5">
                          {carrier.nameLao}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-amber-300 shrink-0">
                        {carrier.trackingPrefix}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          Current Shipping Price
                        </span>
                        <span className="font-mono font-black text-sm text-amber-300">
                          {formatLak(carrier.baseFeeLak)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Delivery Time</span>
                        <span className="text-emerald-400 font-bold text-xs">
                          {carrier.estimatedDays}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate">{carrier.badge}</span>
                      <span className="font-mono text-slate-300 shrink-0">{carrier.hotline}</span>
                    </div>
                  </div>

                  {/* Quick Price Adjust & Edit / Delete Buttons */}
                  <div className="pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const nextFee = Math.max(0, carrier.baseFeeLak - 5000);
                          adminUpdateShippingCarrier(carrier.id, { baseFeeLak: nextFee });
                          showNotification(
                            `Updated ${carrier.name} shipping price to ${formatLak(nextFee)}!`
                          );
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono font-bold text-[10px] cursor-pointer"
                        title="Decrease price by 5,000 LAK"
                      >
                        -5K
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const nextFee = carrier.baseFeeLak + 5000;
                          adminUpdateShippingCarrier(carrier.id, { baseFeeLak: nextFee });
                          showNotification(
                            `Updated ${carrier.name} shipping price to ${formatLak(nextFee)}!`
                          );
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-mono font-bold text-[10px] cursor-pointer"
                        title="Increase price by 5,000 LAK"
                      >
                        +5K
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditShippingCarrier(carrier)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit / Update Price</span>
                      </button>

                      {shippingCarriers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            adminDeleteShippingCarrier(carrier.id);
                            showNotification(`Deleted shipping carrier "${carrier.name}"!`);
                          }}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 cursor-pointer"
                          title="Delete Shipping Carrier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: ORDERS & LOGISTICS MANAGEMENT */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-400" />
                  <span>Orders & Logistics Management (CRUD)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Create manual member orders, update fulfillment statuses (triggers commission clearance upon Delivery), or cancel orders.
                </p>
              </div>

              <button
                onClick={() => setShowAddOrderModal(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Create Manual Order</span>
              </button>
            </div>

            <div className="space-y-3">
              {orders.map(order => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="font-mono text-amber-300 font-bold">{order.id}</span>
                      <span>•</span>
                      <span>Buyer: <strong>{order.buyerMemberId}</strong></span>
                      <span>•</span>
                      <span>Total: <strong className="font-mono text-white">{formatLak(order.totalLak)}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Items: {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : order.status === 'SHIPPED'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Tracking: {order.trackingNumber || 'Pending'} ({order.carrierName || 'Lao Express'})
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => {
                          updateOrderStatus(order.id, 'DELIVERED');
                          showNotification(`Order ${order.id} marked as DELIVERED! Commission awards cleared.`);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Deliver (Clears Awards)</span>
                      </button>
                    )}

                    <button
                      onClick={() => setEditingOrder(order)}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold text-[11px] flex items-center gap-1 border border-sky-500/30"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-[11px] flex items-center gap-1 border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: SONGS CRUD ================= */}
      {activeAdminTab === 'SONGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-400" />
                <span>Studio Song Production Projects (CRUD)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage custom songs awarded through 1.6M activations. Update recording status, audio preview links, and progress percentages.
              </p>
            </div>

            <button
              onClick={() => setShowAddSongModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Song Project</span>
            </button>
          </div>

          <div className="space-y-3">
            {allMembers.flatMap(m => getMemberSongs(m.memberId)).map(song => (
              <div
                key={song.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{song.title}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Artist: {song.memberId}</span>
                      <span>•</span>
                      <span>Genre: {song.genre}</span>
                      <span>•</span>
                      <span>Tempo: {song.tempo}</span>
                      <span>•</span>
                      <span>Producer: {song.producer}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    {song.status} ({song.progressPercent}%)
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{song.studioLocation}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingSong(song)}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 font-semibold text-[11px] flex items-center gap-1 border border-sky-500/30"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit / Update Stage</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSong(song.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-[11px] flex items-center gap-1 border border-red-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: WITHDRAWALS QUEUE ================= */}
      {activeAdminTab === 'WITHDRAWALS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Dual-Review Maker / Checker Payout Authorization</span>
            </h3>
            <p className="text-xs text-slate-400">
              Maker reviews account & KYC; Checker approves bank transfer settlement. Rejections atomically release hold back to Available.
            </p>
          </div>

          <div className="space-y-3">
            {withdrawals.map(w => {
              const isSubmitted = w.status === 'ADMIN_REVIEW' || w.status === 'SUBMITTED';
              const isApproved = w.status === 'APPROVED';
              const isPaid = w.status === 'PAID';

              return (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="font-mono text-amber-300 font-bold">{w.id}</span>
                        <span>•</span>
                        <span>Member: <strong>{w.memberId}</strong></span>
                        <span>•</span>
                        <span className="text-slate-400">{w.bankName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Account: <strong className="font-mono text-slate-200">{w.accountNumber}</strong> ({w.accountName})
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-base font-black text-amber-300">
                        {formatLak(w.amountLak)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Fee: {formatLak(w.bankFeeLak)} | Net: {formatLak(w.netPayoutLak)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isApproved
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : isSubmitted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      Status: {w.status}
                    </span>

                    <div className="flex items-center gap-2">
                      {isSubmitted && (
                        <>
                          <button
                            onClick={() => makerApproveWithdrawal(w.id, 'ADM-FIN-MAKER-01')}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Maker: Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectReasonModal(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-300 font-bold text-[11px] transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <>
                          <button
                            onClick={() => checkerExecutePayout(w.id, 'ADM-FIN-CHECKER-02')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Checker: Settle Bank Payout</span>
                          </button>
                          <button
                            onClick={() => setRejectReasonModal(w.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-300 font-bold text-[11px] transition-colors"
                          >
                            Reject & Release
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB: LAO BANKS & PAYOUT MANAGEMENT ================= */}
      {activeAdminTab === 'BANKS' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <span>Lao Banking Infrastructure & Payout Hub (Administrator Control)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage supported Lao commercial banks (BCEL, LDB, JDB, VietinBank Lao), corporate treasury disbursement accounts, and member withdrawal settlement routing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddBankModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lao Bank</span>
                </button>
                <button
                  onClick={() => setShowAddCorpBankModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Building className="w-4 h-4" />
                  <span>+ Corporate Bank Account</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Supported Lao Banks</span>
                <span className="text-base font-mono font-bold text-white mt-0.5 block">{laoBanks.length} Institutions</span>
                <span className="text-[10px] text-emerald-400">BCEL • LDB • JDB • VietinBank</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Corporate Settlement Accounts</span>
                <span className="text-base font-mono font-bold text-amber-300 mt-0.5 block">{corporateBankAccounts.length} Treasury Accounts</span>
                <span className="text-[10px] text-slate-400">Order Deposits & Payouts</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Members with Linked Bank</span>
                <span className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
                  {allMembers.filter(m => m.bankAccount?.accountNumber).length} / {allMembers.length} Members
                </span>
                <span className="text-[10px] text-slate-400">Lao PDR KYC Compliant</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Pending Payout Queue</span>
                <span className="text-base font-mono font-bold text-amber-400 mt-0.5 block">
                  {withdrawals.filter(w => w.status !== 'PAID').length} Withdrawals
                </span>
                <button
                  onClick={() => setActiveAdminTab('WITHDRAWALS')}
                  className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>View Authorization Queue</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Supported Lao Banking Institutions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-amber-400" />
                  <span>Official Lao Commercial Banks Registry</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Authoritative list of commercial banks operating within the Lao PDR financial system.
                </p>
              </div>
              <button
                onClick={() => setShowAddBankModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bank</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {laoBanks.map((b, idx) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-black text-amber-400 text-xs">
                        {b.code}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-400">{idx + 1}/</span>
                          <h5 className="font-bold text-white text-xs">{b.name}</h5>
                        </div>
                        <p className="text-[11px] text-slate-400">{b.shortName}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${b.badgeBg}`}>
                      {b.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">SWIFT / BIC Code</span>
                      <span className="font-mono font-bold text-amber-300">{b.swiftCode || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Account Routing Format</span>
                      <span className="font-mono text-slate-300">{b.routingFormat || 'XXX-XX-XXXXXXX'}</span>
                    </div>
                  </div>

                  {b.branchDefault && (
                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-500">Default Branch:</span> {b.branchDefault}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {b.id}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingBank(b)}
                        className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-[11px] font-semibold border border-sky-500/30 flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteLaoBank(b.id, b.name)}
                        className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[11px] font-semibold border border-red-500/30 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Corporate Treasury Bank Accounts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>DMC Corporate Settlement Treasury Accounts</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Corporate Lao bank accounts for receiving order checkout deposits (BCEL OnePay, LDB Trust, JDB YesPay, VietinBank) and disbursing verified member payouts.
                </p>
              </div>
              <button
                onClick={() => setShowAddCorpBankModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Corporate Account</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {corporateBankAccounts.map(acc => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/70 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {acc.customQrImageUrl && (
                        <div
                          onClick={() => setViewingBankQr(acc)}
                          className="w-14 h-14 rounded-xl bg-white p-1 border-2 border-amber-400 shrink-0 cursor-pointer overflow-hidden shadow"
                          title="Click to inspect QR Code"
                        >
                          <img src={acc.customQrImageUrl} alt={acc.bankCode} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {acc.bankCode}
                          </span>
                          <h5 className="font-bold text-white text-xs">{acc.bankName}</h5>
                          {acc.customQrImageUrl && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                              Custom QR Image
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Company: <strong className="text-slate-200">{acc.accountName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {acc.isPrimaryForDeposits && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Primary Deposit
                        </span>
                      )}
                      {acc.isPrimaryForWithdrawals && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Primary Payout
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Account Number</span>
                      <span className="font-mono text-sm font-bold text-amber-300">{acc.accountNumber}</span>
                    </div>
                    {acc.swiftCode && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">SWIFT Code</span>
                        <span className="font-mono text-xs text-slate-300">{acc.swiftCode}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">Branch:</span> {acc.branch}
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[160px]">
                      QR: {acc.qrPayload || 'STANDARD_ONEPAY'}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <label className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1 cursor-pointer transition-colors">
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
                              if (typeof ev.target?.result === 'string') {
                                adminUpdateCorporateBankAccount(acc.id, {
                                  customQrImageUrl: ev.target.result,
                                });
                                showNotification(`Uploaded custom QR Code image for ${acc.bankName}!`);
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      <button
                        onClick={() => setViewingBankQr(acc)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-semibold border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <QrCode className="w-3 h-3 text-amber-400" />
                        <span>View QR</span>
                      </button>
                      <button
                        onClick={() => setEditingCorpBank(acc)}
                        className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-[11px] font-semibold border border-sky-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCorpBank(acc.id, acc.accountNumber)}
                        className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-[11px] font-semibold border border-red-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Member Bank Account Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Member Payout Accounts Directory</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Inspect and directly update Lao bank accounts for all registered members.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 pl-8"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredMembers.map(m => {
                const hasBank = !!m.bankAccount?.accountNumber;
                return (
                  <div
                    key={m.memberId}
                    className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="font-mono text-amber-300">({m.memberId})</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {m.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE' : 'FREE'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {hasBank ? (
                          <span>
                            Bank: <strong className="text-slate-200">{m.bankAccount?.bankName}</strong> • Account: <strong className="font-mono text-amber-300">{m.bankAccount?.accountNumber}</strong> ({m.bankAccount?.accountName})
                          </span>
                        ) : (
                          <span className="text-amber-400 italic">No Lao bank account linked</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.kycStatus === 'VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        KYC: {m.kycStatus}
                      </span>
                      <button
                        onClick={() => handleOpenMemberBankEdit(m)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/40 transition-colors"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>{hasBank ? 'Update Bank' : '+ Add Bank'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: COMMISSION RULES ================= */}
      {activeAdminTab === 'RULES' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>Commission Split Rules & Unallocated Reserve</span>
            </h3>
            <p className="text-xs text-slate-400">
              Candidate split versions and 50/30/20 default unilevel templates. Never hardcoded as immutable constants.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Music Package Fixed Staging Rule */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-amber-300 font-bold">MUSIC_SINGLE_1600 (Fixed Staging Candidate Rule)</span>
                  <div className="text-white font-bold mt-0.5">Price: 1,600,000 LAK</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                  RULE_VER: v2.6-APPROVED
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DMC Production Budget</span>
                  <span className="font-bold text-slate-200">900,000 LAK</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 block text-[10px]">L1 Direct Sponsor</span>
                  <span className="font-bold text-amber-300">400,000 LAK</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 block text-[10px]">L2 Second Sponsor</span>
                  <span className="font-bold text-amber-300">200,000 LAK</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 block text-[10px]">L3 Third Sponsor</span>
                  <span className="font-bold text-amber-300">100,000 LAK</span>
                </div>
              </div>
            </div>

            {/* Unallocated Pool */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-300">Auditable UNALLOCATED Reserve Account</span>
                <span className="font-mono text-amber-300 font-bold">
                  {formatLak(unallocatedAwards.reduce((acc, u) => acc + u.amountLak, 0))} Total
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                In accordance with Rev 2.6, unassigned tier amounts from missing uplines remain in UNALLOCATED. They are never rolled up to upper tiers or booked as unearned profit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 7: UAT MATRIX ================= */}
      {activeAdminTab === 'UAT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-emerald-400" />
                <span>Programmer Verification Matrix (PDF Section 11)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Automated regression and invariant verification for scenarios A01 through E06.
              </p>
            </div>
            <button
              onClick={runAllUatTests}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Run All UAT Test Assertions</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {uatResults.map(t => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-slate-900 border border-slate-700 text-amber-300">
                      {t.id}
                    </span>
                    <span>{t.title}</span>
                    <span className="text-slate-400 font-normal">({t.category})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{t.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
                    <strong className="text-slate-300 block mb-0.5">Required Pass Condition:</strong>
                    {t.expected}
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                    <strong className="text-emerald-400 block mb-0.5">Verified Runtime Observation:</strong>
                    {t.observed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: ADMIN & USER PROFILE + PHONE SMS RECOVERY ================= */}
      {activeAdminTab === 'ADMIN_PROFILE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Card 1: Super Admin Profile & Master Password Update */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Super Admin Profile & Master Password
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update Super Administrator identity, recovery phone (+856), email & master PIN
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                ACTIVE ADMIN
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateSuperAdminProfile({
                  operatorId: adminFormOperatorId.trim(),
                  name: adminFormName.trim(),
                  phone: adminFormPhone.trim(),
                  email: adminFormEmail.trim(),
                  roleTitle: adminFormRole.trim(),
                  telecomCarrier: adminFormCarrier as any,
                  passwordPin: adminFormPin.trim(),
                });
                showNotification(
                  `Updated Super Admin (${adminFormOperatorId}) profile, phone (${adminFormPhone}) & master password!`
                );
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Operator ID</label>
                  <input
                    type="text"
                    required
                    value={adminFormOperatorId}
                    onChange={(e) => setAdminFormOperatorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Super Admin Full Name</label>
                  <input
                    type="text"
                    required
                    value={adminFormName}
                    onChange={(e) => setAdminFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Recovery Phone Number (Lao SMS +856)
                  </label>
                  <input
                    type="text"
                    required
                    value={adminFormPhone}
                    onChange={(e) => setAdminFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminFormEmail}
                    onChange={(e) => setAdminFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Lao Telecom SMS Gateway</label>
                  <select
                    value={adminFormCarrier}
                    onChange={(e) => setAdminFormCarrier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Lao Telecom (020 5)">Lao Telecom (020 5)</option>
                    <option value="Unitel (020 9)">Unitel (020 9)</option>
                    <option value="ETL (020 2)">ETL (020 2)</option>
                    <option value="TPlus (020 7)">TPlus (020 7)</option>
                  </select>
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">
                    Super Admin Master Password / PIN
                  </label>
                  <input
                    type="text"
                    required
                    value={adminFormPin}
                    onChange={(e) => setAdminFormPin(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-2.5 text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Executive Title</label>
                <input
                  type="text"
                  value={adminFormRole}
                  onChange={(e) => setAdminFormRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Super Admin Profile & Master Password</span>
              </button>
            </form>
          </div>

          {/* Card 2: Phone SMS OTP Password Recovery Hub (Super Admin & All Members) */}
          <div className="bg-slate-900 border border-sky-500/30 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Phone SMS OTP Recovery Center (+856)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dispatch 6-digit SMS OTP code to recover Super Admin or Member password
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold">
                +856 SMS OTP
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminSmsTarget('SUPER_ADMIN');
                    setAdminDispatchedSms(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border cursor-pointer ${
                    adminSmsTarget === 'SUPER_ADMIN'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Recover Super Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminSmsTarget('MEMBER');
                    setAdminDispatchedSms(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border cursor-pointer ${
                    adminSmsTarget === 'MEMBER'
                      ? 'bg-amber-500 text-slate-950 border-amber-300 font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Recover Member User</span>
                </button>
              </div>

              {adminSmsTarget === 'MEMBER' && (
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Select Member Account to Recover via Phone SMS:
                  </label>
                  <select
                    value={adminSmsMemberId}
                    onChange={(e) => setAdminSmsMemberId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  >
                    {allMembers.map((m) => (
                      <option key={m.memberId} value={m.memberId}>
                        {m.memberId} — {m.name} ({m.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const targetLookup =
                    adminSmsTarget === 'SUPER_ADMIN' ? adminFormPhone : adminSmsMemberId;
                  const res = sendSmsRecoveryOtp(adminSmsTarget, targetLookup);
                  if (res.success && res.otpCode) {
                    setAdminDispatchedSms({
                      otpCode: res.otpCode,
                      phone: res.phone || adminFormPhone,
                      matchedId: res.matchedId || adminSmsMemberId,
                      matchedName: res.matchedName || adminFormName,
                      carrier: res.carrier || 'Lao Telecom (+856)',
                    });
                    setAdminSmsOtpInput(res.otpCode);
                    showNotification(
                      `Dispatched 6-digit SMS OTP [${res.otpCode}] to ${res.phone} (${res.carrier})!`
                    );
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  1. Send 6-Digit SMS OTP to{' '}
                  {adminSmsTarget === 'SUPER_ADMIN'
                    ? `Super Admin (${adminFormPhone})`
                    : `Member (${adminSmsMemberId})`}
                </span>
              </button>

              {adminDispatchedSms && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border-2 border-emerald-400/60 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-emerald-400">
                      LIVE SMS GATEWAY • {adminDispatchedSms.carrier}
                    </span>
                    <span className="font-mono text-slate-400">Phone: {adminDispatchedSms.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-slate-200 text-xs">
                    [DMC XAYRAXA SMS] Password recovery OTP for{' '}
                    <strong className="text-amber-300">{adminDispatchedSms.matchedName}</strong> is:{' '}
                    <strong className="text-emerald-400 font-black text-sm px-1.5 py-0.5 bg-emerald-500/20 rounded">
                      {adminDispatchedSms.otpCode}
                    </strong>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-sky-300 font-bold block mb-1">6-Digit SMS OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={adminSmsOtpInput}
                    onChange={(e) => setAdminSmsOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-slate-950 border border-sky-500/50 rounded-xl p-2.5 text-emerald-300 font-mono font-black tracking-widest"
                  />
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">New Password / PIN</label>
                  <input
                    type="text"
                    value={adminSmsNewPass}
                    onChange={(e) => setAdminSmsNewPass(e.target.value)}
                    placeholder="New password or PIN"
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const targetId =
                    adminSmsTarget === 'SUPER_ADMIN'
                      ? superAdminProfile.operatorId
                      : adminSmsMemberId;
                  const result = resetPasswordWithSmsOtp(
                    adminSmsTarget,
                    targetId,
                    adminSmsOtpInput || '123456',
                    adminSmsNewPass.trim()
                  );
                  if (result.success) {
                    if (adminSmsTarget === 'SUPER_ADMIN') {
                      setAdminFormPin(adminSmsNewPass.trim());
                    }
                    showNotification(result.message);
                  } else {
                    showNotification(result.message);
                  }
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>2. Verify SMS OTP & Reset Password Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 8: AUDIT LOGS ================= */}
      {activeAdminTab === 'AUDIT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Immutable System Event Outbox & Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-400">
              Append-only event log with actor attribution, UTC timestamps, and exactly-once economic effect.
            </p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1 font-mono"
              >
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>{new Date(log.timestamp).toISOString()}</span>
                  <span>Actor: {log.actor}</span>
                </div>
                <div className="font-bold text-amber-300">
                  {log.action} <span className="text-slate-400 font-normal">on {log.entityType} ({log.entityId})</span>
                </div>
                <pre className="text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-xl overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODALS FOR CRUD ================= */}

      {/* 1. ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add New Member Account</span>
              </h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soukthavy Keomany"
                  value={newMemberForm.name}
                  onChange={e => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+856 20 9988 1122"
                    value={newMemberForm.phone}
                    onChange={e => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="soukthavy@gmail.com"
                    value={newMemberForm.email}
                    onChange={e => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Sponsor Code (L1)</label>
                  <input
                    type="text"
                    placeholder="e.g. DMC-LA-00303"
                    value={newMemberForm.sponsorId}
                    onChange={e => setNewMemberForm({ ...newMemberForm, sponsorId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Membership Status</label>
                  <select
                    value={newMemberForm.membershipState}
                    onChange={e => setNewMemberForm({ ...newMemberForm, membershipState: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="FREE_MEMBER">FREE_MEMBER</option>
                    <option value="ACTIVE_LIFETIME_MEMBER">ACTIVE_LIFETIME_MEMBER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Initial Held Credit (LAK)</label>
                  <input
                    type="number"
                    step="50000"
                    placeholder="0"
                    value={newMemberForm.initialHeldLak}
                    onChange={e => setNewMemberForm({ ...newMemberForm, initialHeldLak: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Initial Available Credit (LAK)</label>
                  <input
                    type="number"
                    step="50000"
                    placeholder="0"
                    value={newMemberForm.initialAvailableLak}
                    onChange={e => setNewMemberForm({ ...newMemberForm, initialAvailableLak: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <span>Edit Member: {editingMember.memberId}</span>
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editingMember.phone}
                    onChange={e => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Sponsor ID</label>
                  <input
                    type="text"
                    value={editingMember.sponsorId || ''}
                    onChange={e => setEditingMember({ ...editingMember, sponsorId: e.target.value || null })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Membership State</label>
                  <select
                    value={editingMember.membershipState}
                    onChange={e => setEditingMember({ ...editingMember, membershipState: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="FREE_MEMBER">FREE_MEMBER</option>
                    <option value="ACTIVE_LIFETIME_MEMBER">ACTIVE_LIFETIME_MEMBER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">KYC Status</label>
                  <select
                    value={editingMember.kycStatus}
                    onChange={e => setEditingMember({ ...editingMember, kycStatus: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="VERIFIED">VERIFIED</option>
                  </select>
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">Member Password / PIN</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingMember.password || '123456'}
                      onChange={e => setEditingMember({ ...editingMember, password: e.target.value })}
                      className="w-full bg-slate-800 border border-amber-500/40 rounded-xl p-2.5 text-emerald-300 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const res = sendSmsRecoveryOtp('MEMBER', editingMember.phone);
                        if (res.success && res.otpCode) {
                          showNotification(
                            `SMS Password Recovery OTP [${res.otpCode}] sent to ${editingMember.name} (${editingMember.phone})!`
                          );
                        }
                      }}
                      className="px-2.5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-[10px] shrink-0 cursor-pointer"
                      title="Send Password Recovery SMS OTP to Member Phone"
                    >
                      SMS OTP
                    </button>
                  </div>
                </div>
              </div>

              {/* Linked Lao Bank Account */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="font-semibold text-slate-200 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-amber-400" />
                    <span>Linked Lao Payout Bank Account</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {editingMember.bankAccount?.bankCode || 'LAO PDR'}
                  </span>
                </div>

                <div>
                  <label className="text-slate-400 text-[11px] block mb-1">Bank Institution</label>
                  <select
                    value={editingMember.bankAccount?.bankName || 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'}
                    onChange={e => {
                      const bName = e.target.value;
                      const matched = laoBanks.find(b => b.name === bName);
                      setEditingMember({
                        ...editingMember,
                        bankAccount: {
                          bankName: bName,
                          bankCode: matched?.code || 'CUSTOM',
                          accountNumber: editingMember.bankAccount?.accountNumber || '',
                          accountName: editingMember.bankAccount?.accountName || editingMember.name.toUpperCase(),
                          branch: matched?.branchDefault || 'Head Office Vientiane',
                          isDefault: true,
                        }
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-xs"
                  >
                    <option value="BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC">1/ BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL)</option>
                    <option value="Development Bank CO LTD (LDB)">2/ Development Bank CO LTD (LDB)</option>
                    <option value="Joint Development Bank (JDB)">3/ Joint Development Bank (JDB)</option>
                    <option value="VietinBank Lao | Vientiane">4/ VietinBank Lao | Vientiane</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Account Number</label>
                    <input
                      type="text"
                      placeholder="160-12-00049281-001"
                      value={editingMember.bankAccount?.accountNumber || ''}
                      onChange={e => {
                        const accNum = e.target.value;
                        setEditingMember({
                          ...editingMember,
                          bankAccount: {
                            bankName: editingMember.bankAccount?.bankName || 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
                            bankCode: editingMember.bankAccount?.bankCode || 'BCEL',
                            accountNumber: accNum,
                            accountName: editingMember.bankAccount?.accountName || editingMember.name.toUpperCase(),
                            branch: editingMember.bankAccount?.branch || 'Head Office Vientiane',
                            isDefault: true,
                          }
                        });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block mb-1">Beneficiary Name</label>
                    <input
                      type="text"
                      placeholder={editingMember.name.toUpperCase()}
                      value={editingMember.bankAccount?.accountName || ''}
                      onChange={e => {
                        const accName = e.target.value;
                        setEditingMember({
                          ...editingMember,
                          bankAccount: {
                            bankName: editingMember.bankAccount?.bankName || 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
                            bankCode: editingMember.bankAccount?.bankCode || 'BCEL',
                            accountNumber: editingMember.bankAccount?.accountNumber || '',
                            accountName: accName.toUpperCase(),
                            branch: editingMember.bankAccount?.branch || 'Head Office Vientiane',
                            isDefault: true,
                          }
                        });
                      }}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADJUST BALANCE MODAL */}
      {adjustingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>Adjust Balances: {adjustingMember.memberId}</span>
              </h3>
              <button onClick={() => setAdjustingMember(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteBalanceAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Target Account</label>
                <select
                  value={balanceAdjustForm.account}
                  onChange={e => setBalanceAdjustForm({ ...balanceAdjustForm, account: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="HELD_FOR_QUALIFICATION">HELD_FOR_QUALIFICATION (Held)</option>
                  <option value="AVAILABLE">AVAILABLE (Withdrawable)</option>
                  <option value="PENDING">PENDING (In Transit)</option>
                </select>
              </div>

              <BeautifulNumberInput
                label="Delta Amount (Integer LAK)"
                helperLabel="Positive adds credit; negative debits"
                placeholder="e.g. 200,000 or 200k"
                value={balanceAdjustForm.deltaLak}
                onChange={num => setBalanceAdjustForm({ ...balanceAdjustForm, deltaLak: num })}
                required
                theme="amber"
                presetChips={[50000, 100000, 200000, 500000, 1600000]}
                showMaxButton={false}
                showKBadge={true}
              />

              <div>
                <label className="text-slate-300 font-medium block mb-1">Audit Justification Note *</label>
                <input
                  type="text"
                  required
                  value={balanceAdjustForm.note}
                  onChange={e => setBalanceAdjustForm({ ...balanceAdjustForm, note: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAdjustingMember(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Commit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add New Product SKU</span>
              </h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SKU Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GTR-DMC-BASS-05"
                    value={newProductForm.sku}
                    onChange={e => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={e => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="GUITAR">GUITAR</option>
                    <option value="AUDIO_GEAR">AUDIO_GEAR</option>
                    <option value="ACCESSORY">ACCESSORY</option>
                    <option value="MUSIC_PACKAGE">MUSIC_PACKAGE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Product Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DMC Custom Jazz Bass 4-String"
                  value={newProductForm.titleEn}
                  onChange={e => setNewProductForm({ ...newProductForm, titleEn: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Market Price (LAK) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newProductForm.marketPriceLak === 0 ? '' : newProductForm.marketPriceLak}
                    placeholder="6200000"
                    onChange={e => {
                      const mp = e.target.value === '' ? 0 : Number(e.target.value);
                      setNewProductForm({
                        ...newProductForm,
                        marketPriceLak: mp,
                        memberDiscountLak: Math.max(0, mp - newProductForm.priceLak),
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">DMC Member Price (LAK) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newProductForm.priceLak === 0 ? '' : newProductForm.priceLak}
                    placeholder="4200000"
                    onChange={e => {
                      const p = e.target.value === '' ? 0 : Number(e.target.value);
                      setNewProductForm({
                        ...newProductForm,
                        priceLak: p,
                        memberDiscountLak: Math.max(0, newProductForm.marketPriceLak - p),
                      });
                    }}
                    className="w-full bg-slate-800 border border-amber-500/40 rounded-xl p-2.5 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Member Discount (LAK)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newProductForm.memberDiscountLak === 0 ? '' : newProductForm.memberDiscountLak}
                    placeholder="2000000"
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        memberDiscountLak: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-emerald-300 font-bold block mb-1">Commission Pool (LAK = 100%) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={newProductForm.commissionPoolLak === 0 ? '' : newProductForm.commissionPoolLak}
                    placeholder="450000"
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        commissionPoolLak: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">L1 Share (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={newProductForm.l1Share === 0 ? '' : newProductForm.l1Share}
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        l1Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">L2 Share (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={newProductForm.l2Share === 0 ? '' : newProductForm.l2Share}
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        l2Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">L3 Share (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    value={newProductForm.l3Share === 0 ? '' : newProductForm.l3Share}
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        l3Share: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stock Sellable</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newProductForm.stockSellable === 0 ? '' : newProductForm.stockSellable}
                    onChange={e =>
                      setNewProductForm({
                        ...newProductForm,
                        stockSellable: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Warehouse</label>
                  <input
                    type="text"
                    value={newProductForm.warehouseId}
                    onChange={e => setNewProductForm({ ...newProductForm, warehouseId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              {/* Product Image Upload */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-slate-300 font-medium block">Product Image Upload / URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <img src={newProductForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer hover:bg-amber-400">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Product Image</span>
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
                              setNewProductForm(prev => ({ ...prev, imageUrl: ev.target!.result as string }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={newProductForm.imageUrl}
                      onChange={e => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                      placeholder="https://... or upload image file"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">
                  Edit Product SKU: <span className="font-mono text-amber-300">{editingProduct.sku}</span>
                </h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingProduct.sku === 'MUSIC_SINGLE_1600' && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <span className="font-black px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px]">CORE</span>
                <span>Authoritative Qualifying Package (Rev 2.6): One song-production entitlement per qualifying purchase.</span>
              </div>
            )}

            <form onSubmit={handleSaveProductEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.titleEn}
                  onChange={e => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Lao Title (ພາສາລາວ)</label>
                  <input
                    type="text"
                    value={editingProduct.titleLo || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, titleLo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Thai Title (ไทย)</label>
                  <input
                    type="text"
                    value={editingProduct.titleTh || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, titleTh: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Market Price (Integer LAK)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={(editingProduct.marketPriceLak ?? 6200000) === 0 ? '' : (editingProduct.marketPriceLak ?? 6200000)}
                    onChange={e => {
                      const mp = e.target.value === '' ? 0 : Number(e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        marketPriceLak: mp,
                        memberDiscountLak: Math.max(0, mp - editingProduct.priceLak),
                      });
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    {formatLak(editingProduct.marketPriceLak ?? 6200000)}
                  </span>
                </div>
                <div>
                  <label className="text-amber-300 font-bold block mb-1">DMC Member Price (LAK) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={editingProduct.priceLak === 0 ? '' : editingProduct.priceLak}
                    onChange={e => {
                      const p = e.target.value === '' ? 0 : Number(e.target.value);
                      const mp = editingProduct.marketPriceLak ?? 6200000;
                      setEditingProduct({
                        ...editingProduct,
                        priceLak: p,
                        memberDiscountLak: Math.max(0, mp - p),
                      });
                    }}
                    className="w-full bg-slate-800 border border-amber-500/40 rounded-xl p-2.5 text-amber-300 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    {formatLak(editingProduct.priceLak)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Member Discount (LAK)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={
                      (editingProduct.memberDiscountLak ??
                        Math.max(0, (editingProduct.marketPriceLak ?? 6200000) - editingProduct.priceLak)) === 0
                        ? ''
                        : (editingProduct.memberDiscountLak ??
                            Math.max(0, (editingProduct.marketPriceLak ?? 6200000) - editingProduct.priceLak))
                    }
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        memberDiscountLak: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    {formatLak(
                      editingProduct.memberDiscountLak ??
                        Math.max(0, (editingProduct.marketPriceLak ?? 6200000) - editingProduct.priceLak)
                    )}
                  </span>
                </div>
                <div>
                  <label className="text-emerald-300 font-bold block mb-1">Commission Pool (LAK = 100%) *</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={editingProduct.commissionPoolLak === 0 ? '' : editingProduct.commissionPoolLak}
                    onChange={e =>
                      setEditingProduct({
                        ...editingProduct,
                        commissionPoolLak: e.target.value === '' ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-800 border border-emerald-500/40 rounded-xl p-2.5 text-emerald-300 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    {formatLak(editingProduct.commissionPoolLak)}
                  </span>
                </div>
              </div>

              {/* Commission Split Controls */}
              {editingProduct.sku === 'MUSIC_SINGLE_1600' || editingProduct.splitRule.ruleType === 'FIXED_MUSIC' ? (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-amber-300">Music Package Allocation (Integer LAK)</span>
                    <span className="text-slate-400 font-mono text-[10px]">Table 5 / 7 Formula</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1">Studio</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editingProduct.splitRule.dmcBudget || 900000}
                        onChange={e => setEditingProduct({
                          ...editingProduct,
                          splitRule: { ...editingProduct.splitRule, dmcBudget: Number(e.target.value) }
                        })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white text-xs font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-amber-400 block mb-1">L1 Direct</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editingProduct.splitRule.l1Share}
                        onChange={e => {
                          const l1 = Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            splitRule: { ...editingProduct.splitRule, l1Share: l1 },
                            commissionPoolLak: l1 + (editingProduct.splitRule.l2Share || 0) + (editingProduct.splitRule.l3Share || 0)
                          });
                        }}
                        className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-1.5 text-amber-300 text-xs font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-amber-400 block mb-1">L2 Second</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editingProduct.splitRule.l2Share}
                        onChange={e => {
                          const l2 = Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            splitRule: { ...editingProduct.splitRule, l2Share: l2 },
                            commissionPoolLak: (editingProduct.splitRule.l1Share || 0) + l2 + (editingProduct.splitRule.l3Share || 0)
                          });
                        }}
                        className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-1.5 text-amber-300 text-xs font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-amber-400 block mb-1">L3 Third</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={editingProduct.splitRule.l3Share}
                        onChange={e => {
                          const l3 = Number(e.target.value);
                          setEditingProduct({
                            ...editingProduct,
                            splitRule: { ...editingProduct.splitRule, l3Share: l3 },
                            commissionPoolLak: (editingProduct.splitRule.l1Share || 0) + (editingProduct.splitRule.l2Share || 0) + l3
                          });
                        }}
                        className="w-full bg-slate-800 border border-amber-500/30 rounded-lg p-1.5 text-amber-300 text-xs font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">L1 Share (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={editingProduct.splitRule.l1Share === 0 ? '' : editingProduct.splitRule.l1Share}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        splitRule: { ...editingProduct.splitRule, l1Share: e.target.value === '' ? 0 : Number(e.target.value) }
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">L2 Share (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={editingProduct.splitRule.l2Share === 0 ? '' : editingProduct.splitRule.l2Share}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        splitRule: { ...editingProduct.splitRule, l2Share: e.target.value === '' ? 0 : Number(e.target.value) }
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white text-center font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">L3 Share (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={editingProduct.splitRule.l3Share === 0 ? '' : editingProduct.splitRule.l3Share}
                      onChange={e => setEditingProduct({
                        ...editingProduct,
                        splitRule: { ...editingProduct.splitRule, l3Share: e.target.value === '' ? 0 : Number(e.target.value) }
                      })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-white text-center font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Stock Sellable</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={editingProduct.stockSellable === 0 ? '' : editingProduct.stockSellable}
                    onChange={e => setEditingProduct({ ...editingProduct, stockSellable: e.target.value === '' ? 0 : Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Warehouse / Studio Location</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.warehouseId}
                    onChange={e => setEditingProduct({ ...editingProduct, warehouseId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Entitlement / Description *</label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionEn}
                  onChange={e => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
                  placeholder="one song-production entitlement per verified qualifying initial purchase..."
                />
              </div>

              {/* Product Image Upload in Edit Modal */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="text-slate-300 font-medium block">Product Image Upload / URL</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <img src={editingProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] cursor-pointer hover:bg-amber-400">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Product Image</span>
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
                              setEditingProduct(prev => prev ? { ...prev, imageUrl: ev.target!.result as string } : null);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={editingProduct.imageUrl}
                      onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      placeholder="https://... or upload image file"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CREATE MANUAL ORDER MODAL */}
      {showAddOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Create Manual Order</span>
              </h3>
              <button onClick={() => setShowAddOrderModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Buyer Member</label>
                <select
                  value={newOrderForm.buyerMemberId}
                  onChange={e => setNewOrderForm({ ...newOrderForm, buyerMemberId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {allMembers.map(m => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Select Product SKU</label>
                <select
                  value={newOrderForm.sku}
                  onChange={e => setNewOrderForm({ ...newOrderForm, sku: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {products.map(p => (
                    <option key={p.sku} value={p.sku}>
                      {p.titleEn} ({formatLak(p.priceLak)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newOrderForm.quantity}
                    onChange={e => setNewOrderForm({ ...newOrderForm, quantity: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Payment Channel</label>
                  <select
                    value={newOrderForm.paymentMethod}
                    onChange={e => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="BCEL_ONE">BCEL One QR</option>
                    <option value="LAO_QR">Lao QR Universal</option>
                    <option value="BANK_TRANSFER">Bank Wire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Lao Shipping Carrier</label>
                <select
                  value={newOrderForm.carrierId}
                  onChange={e => setNewOrderForm({ ...newOrderForm, carrierId: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {shippingCarriers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({formatLak(c.baseFeeLak)} • {c.estimatedDays})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddOrderModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Settle & Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6B. ADD / EDIT SHIPPING CARRIER & PRICE MODAL */}
      {showShippingCrudModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>
                  {shippingCrudMode === 'EDIT'
                    ? `Edit / Update Shipping & Price: ${shippingCarrierForm.name}`
                    : 'Add New Shipping Carrier & Price'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShippingCrudModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShippingCarrier} className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5">
                <BeautifulNumberInput
                  label="Shipping Fee / Price (Integer LAK)"
                  placeholder="e.g. 25,000 or 35,000 or 40,000"
                  value={shippingCarrierForm.baseFeeLak}
                  onChange={num =>
                    setShippingCarrierForm({ ...shippingCarrierForm, baseFeeLak: num })
                  }
                  required
                  theme="amber"
                  presetChips={[0, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000]}
                  showMaxButton={false}
                  showKBadge={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Shipping Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCarrierForm.name}
                    onChange={e =>
                      setShippingCarrierForm({ ...shippingCarrierForm, name: e.target.value })
                    }
                    placeholder="e.g. Anousith Logistics"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Shipping Name (Lao / ຊື່ພາສາລາວ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCarrierForm.nameLao}
                    onChange={e =>
                      setShippingCarrierForm({
                        ...shippingCarrierForm,
                        nameLao: e.target.value,
                      })
                    }
                    placeholder="e.g. ອານຸສິດ ຂົນສົ່ງ"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Estimated Delivery *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCarrierForm.estimatedDays}
                    onChange={e =>
                      setShippingCarrierForm({
                        ...shippingCarrierForm,
                        estimatedDays: e.target.value,
                      })
                    }
                    placeholder="1-2 Days"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-emerald-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Tracking Prefix *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingCarrierForm.trackingPrefix}
                    onChange={e =>
                      setShippingCarrierForm({
                        ...shippingCarrierForm,
                        trackingPrefix: e.target.value,
                      })
                    }
                    placeholder="ANS-LA"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Hotline *</label>
                  <input
                    type="text"
                    required
                    value={shippingCarrierForm.hotline}
                    onChange={e =>
                      setShippingCarrierForm({
                        ...shippingCarrierForm,
                        hotline: e.target.value,
                      })
                    }
                    placeholder="1668 / +856 20..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Coverage Badge</label>
                <input
                  type="text"
                  value={shippingCarrierForm.badge}
                  onChange={e =>
                    setShippingCarrierForm({ ...shippingCarrierForm, badge: e.target.value })
                  }
                  placeholder="Nationwide Network • 18 Provinces"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShippingCrudModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer"
                >
                  {shippingCrudMode === 'EDIT'
                    ? `Update Shipping (${formatLak(shippingCarrierForm.baseFeeLak)})`
                    : `Add Shipping (${formatLak(shippingCarrierForm.baseFeeLak)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. EDIT ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <span>Edit Order: {editingOrder.id}</span>
              </h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Order Status</label>
                <select
                  value={editingOrder.status}
                  onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="PAID">PAID (Settled)</option>
                  <option value="PACKING">PACKING (In Warehouse)</option>
                  <option value="SHIPPED">SHIPPED (In Transit)</option>
                  <option value="DELIVERED">DELIVERED (Cleared)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Lao Shipping Carrier</label>
                <select
                  value={editingOrder.carrierId || 'ANOUSITH'}
                  onChange={e => {
                    const cid = e.target.value as LaoShippingCarrierId;
                    const c = shippingCarriers.find(x => x.id === cid);
                    setEditingOrder({ 
                      ...editingOrder, 
                      carrierId: cid, 
                      carrierName: c?.name || editingOrder.carrierName 
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {shippingCarriers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.nameLao})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-medium">Tracking Number</label>
                  <button
                    type="button"
                    onClick={() => {
                      const cid = editingOrder.carrierId || 'ANOUSITH';
                      const c =
                        shippingCarriers.find(x => x.id === cid) ||
                        shippingCarriers[0] ||
                        LAO_SHIPPING_CARRIERS[0];
                      setEditingOrder({
                        ...editingOrder,
                        trackingNumber: `${c.trackingPrefix}-${Date.now().toString().slice(-6)}`
                      });
                    }}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Auto-Generate Tracking
                  </button>
                </div>
                <input
                  type="text"
                  value={editingOrder.trackingNumber || ''}
                  onChange={e => setEditingOrder({ ...editingOrder, trackingNumber: e.target.value })}
                  placeholder="ANS-LA-..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ADD SONG PROJECT MODAL */}
      {showAddSongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Studio Song Project</span>
              </h3>
              <button onClick={() => setShowAddSongModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSong} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Artist Member</label>
                <select
                  value={newSongForm.memberId}
                  onChange={e => setNewSongForm({ ...newSongForm, memberId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {allMembers.map(m => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ສຽງຮັກແຄນລາວ (Melody of Lao Heart)"
                  value={newSongForm.title}
                  onChange={e => setNewSongForm({ ...newSongForm, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Genre</label>
                  <input
                    type="text"
                    value={newSongForm.genre}
                    onChange={e => setNewSongForm({ ...newSongForm, genre: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Tempo</label>
                  <input
                    type="text"
                    value={newSongForm.tempo}
                    onChange={e => setNewSongForm({ ...newSongForm, tempo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Studio Status</label>
                  <select
                    value={newSongForm.status}
                    onChange={e => setNewSongForm({ ...newSongForm, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="IN_QUEUE">IN_QUEUE</option>
                    <option value="ARRANGING">ARRANGING</option>
                    <option value="VOCAL_RECORDING">VOCAL_RECORDING</option>
                    <option value="MIXING_MASTERING">MIXING_MASTERING</option>
                    <option value="RELEASED">RELEASED</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newSongForm.progressPercent}
                    onChange={e => setNewSongForm({ ...newSongForm, progressPercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSongModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Create Song Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. EDIT SONG MODAL */}
      {editingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <span>Update Studio Song Project</span>
              </h3>
              <button onClick={() => setEditingSong(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSongEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Song Title</label>
                <input
                  type="text"
                  required
                  value={editingSong.title}
                  onChange={e => setEditingSong({ ...editingSong, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Production Stage</label>
                  <select
                    value={editingSong.status}
                    onChange={e => setEditingSong({ ...editingSong, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="IN_QUEUE">IN_QUEUE</option>
                    <option value="ARRANGING">ARRANGING</option>
                    <option value="VOCAL_RECORDING">VOCAL_RECORDING</option>
                    <option value="MIXING_MASTERING">MIXING_MASTERING</option>
                    <option value="RELEASED">RELEASED</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingSong.progressPercent}
                    onChange={e => setEditingSong({ ...editingSong, progressPercent: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingSong(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Update Studio Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LAO BANK & CORPORATE BANK MODALS ================= */}

      {/* 1. ADD LAO BANK MODAL */}
      {showAddBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span>Add New Lao Commercial Bank</span>
              </h3>
              <button onClick={() => setShowAddBankModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLaoBank} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Bank Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCEL, LDB, JDB, VIETIN"
                    value={newBankForm.code}
                    onChange={e => setNewBankForm({ ...newBankForm, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    placeholder="e.g. COEBLALA, LDBNLALA"
                    value={newBankForm.swiftCode}
                    onChange={e => setNewBankForm({ ...newBankForm, swiftCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Full Official Bank Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC"
                  value={newBankForm.name}
                  onChange={e => setNewBankForm({ ...newBankForm, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Display Short Name</label>
                <input
                  type="text"
                  placeholder="e.g. BCEL One / BCEL Public"
                  value={newBankForm.shortName}
                  onChange={e => setNewBankForm({ ...newBankForm, shortName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Default Branch / City</label>
                  <input
                    type="text"
                    placeholder="Head Office Vientiane, Rue Pangkham"
                    value={newBankForm.branchDefault}
                    onChange={e => setNewBankForm({ ...newBankForm, branchDefault: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Routing Format Template</label>
                  <input
                    type="text"
                    placeholder="160-XX-XXXXXXXX-XXX"
                    value={newBankForm.routingFormat}
                    onChange={e => setNewBankForm({ ...newBankForm, routingFormat: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBankModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Add Bank Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT LAO BANK MODAL */}
      {editingBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <span>Edit Lao Bank: {editingBank.code}</span>
              </h3>
              <button onClick={() => setEditingBank(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLaoBankEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Bank Code</label>
                  <input
                    type="text"
                    required
                    value={editingBank.code}
                    onChange={e => setEditingBank({ ...editingBank, code: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SWIFT / BIC Code</label>
                  <input
                    type="text"
                    value={editingBank.swiftCode || ''}
                    onChange={e => setEditingBank({ ...editingBank, swiftCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Official Bank Name</label>
                <input
                  type="text"
                  required
                  value={editingBank.name}
                  onChange={e => setEditingBank({ ...editingBank, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Short Name</label>
                <input
                  type="text"
                  value={editingBank.shortName}
                  onChange={e => setEditingBank({ ...editingBank, shortName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Default Branch</label>
                  <input
                    type="text"
                    value={editingBank.branchDefault || ''}
                    onChange={e => setEditingBank({ ...editingBank, branchDefault: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Active Status</label>
                  <select
                    value={editingBank.isActive ? 'true' : 'false'}
                    onChange={e => setEditingBank({ ...editingBank, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="true">Active (Accepting Payouts)</option>
                    <option value="false">Inactive / Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingBank(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CORPORATE BANK ACCOUNT MODAL */}
      {showAddCorpBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                <span>Add Corporate Treasury Bank Account</span>
              </h3>
              <button onClick={() => setShowAddCorpBankModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCorpBank} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Lao Bank Institution *</label>
                <select
                  value={newCorpBankForm.bankName}
                  onChange={e => {
                    const bName = e.target.value;
                    const matched = laoBanks.find(b => b.name === bName);
                    setNewCorpBankForm({
                      ...newCorpBankForm,
                      bankName: bName,
                      bankCode: matched?.code || 'CUSTOM',
                      swiftCode: matched?.swiftCode || '',
                      branch: matched?.branchDefault || 'Vientiane',
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {laoBanks.map(b => (
                    <option key={b.id} value={b.name}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Corporate Account Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="160-12-00088888-001"
                    value={newCorpBankForm.accountNumber}
                    onChange={e => setNewCorpBankForm({ ...newCorpBankForm, accountNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    placeholder="COEBLALA"
                    value={newCorpBankForm.swiftCode}
                    onChange={e => setNewCorpBankForm({ ...newCorpBankForm, swiftCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Beneficiary Legal Entity Name *</label>
                <input
                  type="text"
                  required
                  value={newCorpBankForm.accountName}
                  onChange={e => setNewCorpBankForm({ ...newCorpBankForm, accountName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Branch / Office Location</label>
                <input
                  type="text"
                  value={newCorpBankForm.branch}
                  onChange={e => setNewCorpBankForm({ ...newCorpBankForm, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Custom QR Code Image Upload for New Corporate Account */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold block">Custom QR Code Image Upload</label>
                  {newCorpBankForm.customQrImageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewCorpBankForm({ ...newCorpBankForm, customQrImageUrl: '' })}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove QR Image
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {newCorpBankForm.customQrImageUrl ? (
                      <img src={newCorpBankForm.customQrImageUrl} alt="QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer">
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
                              setNewCorpBankForm(prev => ({ ...prev, customQrImageUrl: ev.target!.result as string }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={newCorpBankForm.customQrImageUrl}
                      onChange={e => setNewCorpBankForm({ ...newCorpBankForm, customQrImageUrl: e.target.value })}
                      placeholder="Or paste QR image URL..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newCorpBankForm.isPrimaryForDeposits}
                    onChange={e => setNewCorpBankForm({ ...newCorpBankForm, isPrimaryForDeposits: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Set as Primary Destination for Customer Order Deposits (QR Payments)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={newCorpBankForm.isPrimaryForWithdrawals}
                    onChange={e => setNewCorpBankForm({ ...newCorpBankForm, isPrimaryForWithdrawals: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Set as Primary Source for Maker/Checker Payout Disbursements</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCorpBankModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Corporate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. EDIT CORPORATE BANK ACCOUNT MODAL */}
      {editingCorpBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" />
                <span>Edit Corporate Account & QR: {editingCorpBank.accountNumber}</span>
              </h3>
              <button onClick={() => setEditingCorpBank(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorpBankEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Bank Institution</label>
                <input
                  type="text"
                  required
                  value={editingCorpBank.bankName}
                  onChange={e => setEditingCorpBank({ ...editingCorpBank, bankName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Account Number</label>
                  <input
                    type="text"
                    required
                    value={editingCorpBank.accountNumber}
                    onChange={e => setEditingCorpBank({ ...editingCorpBank, accountNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">SWIFT Code</label>
                  <input
                    type="text"
                    value={editingCorpBank.swiftCode || ''}
                    onChange={e => setEditingCorpBank({ ...editingCorpBank, swiftCode: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Beneficiary Legal Entity</label>
                <input
                  type="text"
                  required
                  value={editingCorpBank.accountName}
                  onChange={e => setEditingCorpBank({ ...editingCorpBank, accountName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Branch / Office</label>
                <input
                  type="text"
                  value={editingCorpBank.branch}
                  onChange={e => setEditingCorpBank({ ...editingCorpBank, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Custom QR Code Image Upload in Edit Corporate Modal */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold block">Custom QR Code Image Upload</label>
                  {editingCorpBank.customQrImageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingCorpBank({ ...editingCorpBank, customQrImageUrl: undefined })}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete QR Image</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {editingCorpBank.customQrImageUrl ? (
                      <img src={editingCorpBank.customQrImageUrl} alt="QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload / Replace QR Image</span>
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
                              setEditingCorpBank(prev => prev ? { ...prev, customQrImageUrl: ev.target!.result as string } : null);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={editingCorpBank.customQrImageUrl || ''}
                      onChange={e => setEditingCorpBank({ ...editingCorpBank, customQrImageUrl: e.target.value })}
                      placeholder="Or paste QR image URL..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCorpBank.isPrimaryForDeposits}
                    onChange={e => setEditingCorpBank({ ...editingCorpBank, isPrimaryForDeposits: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Primary for Customer Order Deposits</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingCorpBank.isPrimaryForWithdrawals}
                    onChange={e => setEditingCorpBank({ ...editingCorpBank, isPrimaryForWithdrawals: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700"
                  />
                  <span>Primary for Member Payout Disbursements</span>
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCorpBank(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DIRECT MEMBER LAO BANK EDIT MODAL */}
      {memberForBankEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <span>Update Member Bank & QR Code</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {memberForBankEdit.name} ({memberForBankEdit.memberId})
                </p>
              </div>
              <button onClick={() => setMemberForBankEdit(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberBank} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Select Lao Bank *</label>
                <select
                  value={memberBankForm.bankName}
                  onChange={e => {
                    const bName = e.target.value;
                    const matched = laoBanks.find(b => b.name === bName);
                    setMemberBankForm({
                      ...memberBankForm,
                      bankName: bName,
                      branch: matched?.branchDefault || 'Head Office Vientiane',
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  {laoBanks.map((b, idx) => (
                    <option key={b.id} value={b.name}>
                      {idx + 1}/ {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  placeholder="010-12-00998877-001"
                  value={memberBankForm.accountNumber}
                  onChange={e => setMemberBankForm({ ...memberBankForm, accountNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Beneficiary Name *</label>
                <input
                  type="text"
                  required
                  placeholder={memberForBankEdit.name.toUpperCase()}
                  value={memberBankForm.accountName}
                  onChange={e => setMemberBankForm({ ...memberBankForm, accountName: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white uppercase"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Branch / Province</label>
                <input
                  type="text"
                  placeholder="Head Office Vientiane"
                  value={memberBankForm.branch}
                  onChange={e => setMemberBankForm({ ...memberBankForm, branch: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Member Custom QR Code Image Upload */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold block">Member QR Code Image Upload</label>
                  {memberBankForm.customQrImageUrl && (
                    <button
                      type="button"
                      onClick={() => setMemberBankForm({ ...memberBankForm, customQrImageUrl: '' })}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove QR
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {memberBankForm.customQrImageUrl ? (
                      <img src={memberBankForm.customQrImageUrl} alt="Member QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Member QR Image</span>
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
                              setMemberBankForm(prev => ({ ...prev, customQrImageUrl: ev.target!.result as string }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={memberBankForm.customQrImageUrl}
                      onChange={e => setMemberBankForm({ ...memberBankForm, customQrImageUrl: e.target.value })}
                      placeholder="Or paste QR image URL..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-[11px] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setMemberForBankEdit(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Update Bank & QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT WITHDRAWAL MODAL */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-white">Reject Withdrawal & Release Hold</h3>
            <p className="text-xs text-slate-400">
              Provide justification. The atomic hold ({rejectReasonModal}) will be credited back to the member's Available balance immediately.
            </p>
            <textarea
              rows={3}
              value={rejectReasonText}
              onChange={e => setRejectReasonText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectWithdrawal(rejectReasonModal, rejectReasonText);
                  setRejectReasonModal(null);
                  showNotification(`Withdrawal ${rejectReasonModal} rejected and funds restored.`);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Bank Treasury QR Inspection Modal */}
      {viewingBankQr && (
        <BankQrPaymentModal
          isOpen={viewingBankQr !== null}
          onClose={() => setViewingBankQr(null)}
          amountLak={1600000}
          purpose="WALLET_DEPOSIT"
          title={`${viewingBankQr.bankCode} Official Treasury QR Code`}
          description={`Corporate Lao QR code for ${viewingBankQr.bankName} (Acct: ${viewingBankQr.accountNumber}).`}
          onPaymentSuccess={details => {
            showNotification(`Lao Bank QR test payment simulated for ${details.bankName} (Ref: ${details.reference})!`);
            setViewingBankQr(null);
          }}
        />
      )}
    </div>
  );
};
