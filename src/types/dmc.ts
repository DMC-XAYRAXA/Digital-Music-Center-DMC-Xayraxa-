/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * Canonical Data Types & State Machine Definitions
 */

export type Language = 'en' | 'lo' | 'th' | 'vi' | 'zh' | 'ko';

export type LaoShippingCarrierId = 'ANOUSITH' | 'HAL_EXPRESS' | 'LOCAL_DELIVERY' | string;

export interface LaoShippingCarrier {
  id: LaoShippingCarrierId;
  name: string;
  nameLao: string;
  nameTh?: string;
  nameVi?: string;
  nameZh?: string;
  nameKo?: string;
  badge: string;
  estimatedDays: string;
  baseFeeLak: number;
  trackingPrefix: string;
  hotline: string;
  logoColor: string;
  description: string;
}

export const LAO_SHIPPING_CARRIERS: LaoShippingCarrier[] = [
  {
    id: 'ANOUSITH',
    name: 'Anousith Logistics',
    nameLao: 'ອານຸສິດ ຂົນສົ່ງ (Anousith Logistics)',
    nameTh: 'อานุสิทธิ์ ขนส่ง (Anousith Logistics)',
    nameVi: 'Vận chuyển Anousith Logistics',
    nameZh: '阿努西特物流 (Anousith Logistics)',
    nameKo: '아누싯 물류 (Anousith Logistics)',
    badge: 'Nationwide Network • 18 Provinces',
    estimatedDays: '1-2 Days',
    baseFeeLak: 35000,
    trackingPrefix: 'ANS-LA',
    hotline: '1668 / +856 20 5511 8899',
    logoColor: '#e11d48',
    description: 'Largest door-to-door parcel delivery & branch network covering all 18 provinces in Lao PDR.'
  },
  {
    id: 'HAL_EXPRESS',
    name: 'HAL Express',
    nameLao: 'ຮຸ່ງອາລຸນ ຂົນສົ່ງ (HAL Logistics / Houng Ah Loun)',
    nameTh: 'ฮุ่งอาลุน ขนส่ง (HAL Logistics)',
    nameVi: 'Vận chuyển HAL Express (Houng Ah Loun)',
    nameZh: '洪阿伦快递 (HAL Express / Houng Ah Loun)',
    nameKo: 'HAL 익스프레스 (Houng Ah Loun 물류)',
    badge: 'Express Priority Cargo',
    estimatedDays: '1-2 Days',
    baseFeeLak: 40000,
    trackingPrefix: 'HAL-LA',
    hotline: '1441 / +856 20 5599 0011',
    logoColor: '#f97316',
    description: 'Premier express transport with priority regional hub routing along Route 13 and provincial hubs.'
  },
  {
    id: 'LOCAL_DELIVERY',
    name: 'Local Delivery',
    nameLao: 'ຈັດສົ່ງດ່ວນພາຍໃນນະຄອນຫຼວງ (Vientiane Same-Day Rider)',
    nameTh: 'จัดส่งด่วนในนครหลวงเวียงจันทน์ (Same-Day Rider)',
    nameVi: 'Giao hàng hỏa tốc Vientiane (Rider trong ngày)',
    nameZh: '万象同城专送 (Vientiane Same-Day Rider)',
    nameKo: '비엔티안 당일 퀵배송 (Same-Day Rider)',
    badge: 'Same-Day Express • 2-4 Hours',
    estimatedDays: 'Same-Day (2-4 hrs)',
    baseFeeLak: 25000,
    trackingPrefix: 'DMC-LOCAL',
    hotline: '+856 20 5500 2233',
    logoColor: '#10b981',
    description: 'Direct motorbike courier delivery across Vientiane Capital (Chanthabouly, Sikhottabong, Xaysetha, Sisattanak).'
  }
];

export type MembershipState = 'FREE_MEMBER' | 'ACTIVE_LIFETIME_MEMBER';

export type ActivationMethod = 'DIRECT_CASH' | 'EARNED_CREDIT_REDEMPTION';

export interface UserConsent {
  termsAccepted: boolean;
  termsVersion: string;
  termsAcceptedAt?: string;
  autoRedeemConsent: boolean;
  autoRedeemVersion: string;
  autoRedeemAcceptedAt?: string;
}

export interface BankAccountInfo {
  id?: string;
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
  branch?: string;
  customQrImageUrl?: string;
  isDefault?: boolean;
}

export interface Member {
  id: string; // Internal global UUID
  memberId: string; // Public display ID e.g., DMC-LA-00404
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  password?: string; // Member PIN or Password (default '123456')
  lastPasswordUpdatedAt?: string;
  lastRecoverySmsAt?: string;
  language: Language;
  membershipState: MembershipState;
  sponsorId: string | null; // Direct canonical parent (L1)
  createdAt: string;
  activatedAt?: string;
  activationMethod?: ActivationMethod;
  consents: UserConsent;
  kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
  bankAccount?: BankAccountInfo;
  bankAccounts?: BankAccountInfo[];
  preferredCarrierId?: LaoShippingCarrierId;
  deliveryAddress?: {
    recipientName?: string;
    phone?: string;
    province?: string;
    district?: string;
    village?: string;
    note?: string;
  };
  isStaff?: boolean;
  staffPosition?: StaffPosition;
  staffCode?: string;
  staffBranch?: string;
  staffBioOrDuty?: string;
}

export interface SuperAdminProfile {
  operatorId: string; // e.g., 'SUPER-ADMIN-LAO'
  name: string; // e.g., 'Xayraxa Master Administrator'
  phone: string; // e.g., '+856 20 5599 8888'
  email: string; // e.g., 'xay.raxa@gmail.com'
  avatarUrl?: string;
  roleTitle: string;
  passwordPin: string; // e.g., '888888'
  twoFactorSmsEnabled: boolean;
  telecomCarrier: 'Unitel (020 9)' | 'Lao Telecom (020 5)' | 'ETL (020 2)' | 'TPlus (020 7)';
  lastPasswordUpdatedAt?: string;
  lastRecoverySmsAt?: string;
}

export type LedgerBalanceType = 
  | 'PENDING' 
  | 'HELD_FOR_QUALIFICATION' 
  | 'AVAILABLE' 
  | 'HELD_FOR_WITHDRAWAL' 
  | 'RECOVERY_DUE';

export interface MemberBalances {
  pending: number; // Integer LAK
  heldForQualification: number; // Integer LAK
  available: number; // Integer LAK
  heldForWithdrawal: number; // Integer LAK
  recoveryDue: number; // Integer LAK
}

export type TransactionType =
  | 'COMMISSION_PENDING'
  | 'COMMISSION_CLEARED_HELD'
  | 'COMMISSION_CLEARED_AVAILABLE'
  | 'QUALIFICATION_REDEMPTION'
  | 'DIRECT_ACTIVATION_PURCHASE'
  | 'WITHDRAWAL_RESERVE'
  | 'WITHDRAWAL_PAID'
  | 'WITHDRAWAL_REJECTED_RELEASE'
  | 'COMMISSION_REVERSAL'
  | 'RECOVERY_ADJUSTMENT';

export interface LedgerEntry {
  id: string;
  txRef: string;
  timestamp: string;
  memberId: string;
  type: TransactionType;
  sourceRef: string; // Order ID, Award ID, Withdrawal ID
  debit: number; // Integer LAK
  credit: number; // Integer LAK
  targetBalance: LedgerBalanceType;
  balanceAfter: number;
  description: string;
}

export type CommissionTier = 'L1' | 'L2' | 'L3';

export type AwardStatus = 'PENDING' | 'HELD_FOR_QUALIFICATION' | 'AVAILABLE' | 'REVERSED';

export interface CommissionAward {
  id: string;
  orderId: string;
  orderLineId: string;
  sku: string;
  tier: CommissionTier;
  beneficiaryMemberId: string | 'UNALLOCATED';
  buyerMemberId: string;
  grossAwardLak: number; // Integer LAK
  status: AwardStatus;
  ruleVersion: string;
  createdAt: string;
  clearedAt?: string;
  reversedAt?: string;
}

export interface UnallocatedAwardRecord {
  id: string;
  orderId: string;
  sku: string;
  tier: CommissionTier;
  amountLak: number;
  reason: 'MISSING_UPLINE' | 'RESTRICTED_SPONSOR';
  recordedAt: string;
}

export interface SongProductionProject {
  id: string;
  memberId: string;
  title: string;
  genre: string;
  tempo: string;
  status: 'IN_QUEUE' | 'ARRANGING' | 'VOCAL_RECORDING' | 'MIXING_MASTERING' | 'RELEASED';
  producer: string;
  studioLocation: string;
  progressPercent: number;
  previewAudioUrl?: string;
  downloadWavUrl?: string;
  updatedAt: string;
}

export const DMC_STANDARD_PRICING = {
  marketPriceLak: 6200000,
  memberPriceLak: 4200000,
  memberDiscountLak: 2000000,
  commissionPoolLak: 450000,
  l1Percent: 50,
  l2Percent: 30,
  l3Percent: 20,
  l1AmountLak: 225000,
  l2AmountLak: 135000,
  l3AmountLak: 90000,
} as const;

export interface ProductSKU {
  sku: string;
  category: 'MUSIC_PACKAGE' | 'GUITAR' | 'AUDIO_GEAR' | 'ACCESSORY';
  titleEn: string;
  titleLo: string;
  titleTh: string;
  descriptionEn: string;
  marketPriceLak?: number; // Market Price (e.g., 6,200,000 LAK)
  priceLak: number; // DMC Member Price (e.g., 4,200,000 LAK)
  memberDiscountLak?: number; // Member Discount (e.g., 2,000,000 LAK)
  commissionPoolLak: number; // Commission Pool = 100% (e.g., 450,000 LAK, never calculated from member discount)
  splitRule: {
    ruleType: 'FIXED_MUSIC' | 'POOL_PERCENTAGE';
    l1Share: number; // Amount or percentage (50/30/20)
    l2Share: number;
    l3Share: number;
    dmcBudget?: number;
  };
  stockSellable: number;
  stockReserved: number;
  warehouseId: string;
  itemType: 'SERVICE' | 'PHYSICAL';
  imageUrl: string;
  featured?: boolean;
}

export interface EventActivityPost {
  id: string;
  headline: string;
  title: string;
  information: string;
  imageUrl: string;
  eventDate: string;
  location: string;
  badge: string;
  createdAt: string;
}

export interface CartItem {
  sku: string;
  quantity: number;
}

export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'PAID' 
  | 'PACKING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export interface OrderItemSnapshot {
  orderLineId: string;
  sku: string;
  title: string;
  unitPriceLak: number;
  quantity: number;
  totalLak: number;
  commissionPoolLak: number;
  itemType: 'SERVICE' | 'PHYSICAL';
}

export interface Order {
  id: string; // e.g. ORD-20261013-0091
  buyerMemberId: string;
  items: OrderItemSnapshot[];
  subtotalLak: number;
  shippingFeeLak: number;
  totalLak: number;
  paymentMethod: 'BCEL_ONE' | 'LAO_QR' | 'BANK_TRANSFER' | 'CREDIT_CARD';
  paymentReference?: string;
  status: OrderStatus;
  shippingAddress?: {
    recipientName: string;
    phone: string;
    province: string;
    district: string;
    village: string;
    carrierBranch?: string;
  };
  carrierId?: LaoShippingCarrierId;
  trackingNumber?: string;
  carrierName?: string;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
}

export type WithdrawalState =
  | 'DRAFT'
  | 'PENDING_OTP'
  | 'OTP_VERIFIED'
  | 'SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'PAID'
  | 'REJECTED'
  | 'FAILED';

export interface WithdrawalRequest {
  id: string; // e.g. WTH-20261013-004
  memberId: string;
  amountLak: number;
  bankFeeLak: number;
  netPayoutLak: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: WithdrawalState;
  requestedAt: string;
  makerAdminId?: string;
  makerApprovedAt?: string;
  checkerAdminId?: string;
  checkerPaidAt?: string;
  rejectionReason?: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
}

export interface UatTestCaseResult {
  id: string;
  title: string;
  category: string;
  pass: boolean;
  status: 'PENDING' | 'RUNNING' | 'PASSED' | 'FAILED';
  observed: string;
  expected: string;
}

export interface LaoBankDefinition {
  id: string;
  code: string;
  name: string;
  shortName: string;
  swiftCode?: string;
  color: string;
  badgeBg: string;
  logoText: string;
  isActive: boolean;
  branchDefault?: string;
  routingFormat?: string;
}

export interface CorporateBankAccount {
  id: string;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  swiftCode?: string;
  qrPayload?: string;
  customQrImageUrl?: string;
  isPrimaryForDeposits: boolean;
  isPrimaryForWithdrawals: boolean;
}

export const DEFAULT_LAO_BANKS: LaoBankDefinition[] = [
  {
    id: 'bank-bcel',
    code: 'BCEL',
    name: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
    shortName: 'BCEL One / BCEL Public',
    swiftCode: 'COEBLALA',
    color: 'from-red-600 via-rose-600 to-red-800',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    logoText: 'BCEL',
    isActive: true,
    branchDefault: 'Head Office Vientiane, Rue Pangkham',
    routingFormat: '160-XX-XXXXXXXX-XXX'
  },
  {
    id: 'bank-ldb',
    code: 'LDB',
    name: 'Development Bank CO LTD (LDB)',
    shortName: 'Lao Development Bank (LDB)',
    swiftCode: 'LDBNLALA',
    color: 'from-blue-600 via-indigo-600 to-blue-800',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    logoText: 'LDB',
    isActive: true,
    branchDefault: 'Lane Xang Avenue Branch, Vientiane',
    routingFormat: '020-XX-XXXXXXX-XXX'
  },
  {
    id: 'bank-jdb',
    code: 'JDB',
    name: 'Joint Development Bank (JDB)',
    shortName: 'Joint Development Bank (JDB)',
    swiftCode: 'JDBLLALA',
    color: 'from-amber-600 via-yellow-600 to-amber-800',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    logoText: 'JDB',
    isActive: true,
    branchDefault: 'Lane Xang Branch, Hatsady, Chanthabouly',
    routingFormat: '010-XX-XXXXXXXX-XXX'
  },
  {
    id: 'bank-vietin',
    code: 'VIETIN',
    name: 'VietinBank Lao | Vientiane',
    shortName: 'VietinBank Lao (Vientiane Branch)',
    swiftCode: 'ICBVLA2X',
    color: 'from-emerald-600 via-teal-600 to-emerald-800',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    logoText: 'VIETIN',
    isActive: true,
    branchDefault: 'No. 088 Lanexang Avenue, Hatsady, Vientiane',
    routingFormat: '108-XX-XXXXXXX-XXX'
  },
  {
    id: 'bank-psvb',
    code: 'PSVB',
    name: 'Phongsavanh Bank Ltd (Laos)',
    shortName: 'Phongsavanh Bank Laos (PSVB)',
    swiftCode: 'PSVBLALA',
    color: 'from-green-600 via-lime-600 to-emerald-800',
    badgeBg: 'bg-green-500/20 text-green-300 border-green-500/40',
    logoText: 'PSVB',
    isActive: true,
    branchDefault: 'Kaysone Phomvihane Ave, Phakhao, Xaythany, Vientiane',
    routingFormat: '040-XX-XXXXXXXX-XXX'
  }
];

export interface SupportLocationItem {
  id: string;
  category: 'HOTLINE' | 'WHATSAPP' | 'OFFICE_LOCATION' | 'STUDIO_BRANCH';
  label: string;
  value: string;
  locationAddress?: string;
  mapQuery?: string;
  mapUrl?: string;
  photoUrl?: string;
  notes?: string;
  updatedAt: string;
}

export type StaffPosition =
  | 'Administrator'
  | 'Assistance'
  | 'Accounting'
  | 'Marketing'
  | 'IT'
  | 'Teacher'
  | 'Fencer'
  | 'Part time';

export interface StaffPositionDefinition {
  id: StaffPosition;
  labelEn: string;
  labelLo: string;
  labelTh: string;
  badgeColor: string;
  iconKey: 'SHIELD' | 'USERS' | 'WALLET' | 'MEGAPHONE' | 'CPU' | 'GRADUATION' | 'SPARKLES' | 'CLOCK';
  description: string;
}

export const DMC_STAFF_POSITIONS: StaffPositionDefinition[] = [
  {
    id: 'Administrator',
    labelEn: 'Administrator',
    labelLo: 'ຜູ້ບໍລິຫານລະບົບ (Administrator)',
    labelTh: 'ผู้ดูแลระบบ / ผู้บริหาร (Administrator)',
    badgeColor: 'from-red-600 to-rose-800',
    iconKey: 'SHIELD',
    description: 'Executive system administration, full platform control & approvals'
  },
  {
    id: 'Assistance',
    labelEn: 'Assistance',
    labelLo: 'ຜູ້ຊ່ວຍບໍລິຫານ (Assistance)',
    labelTh: 'ผู้ช่วยประสานงาน (Assistance)',
    badgeColor: 'from-amber-500 to-orange-600',
    iconKey: 'USERS',
    description: 'Executive & member coordination, studio scheduling & administrative support'
  },
  {
    id: 'Accounting',
    labelEn: 'Accounting',
    labelLo: 'ພະແນກບັນຊີ ແລະ ການເງິນ (Accounting)',
    labelTh: 'ฝ่ายบัญชีและการเงิน (Accounting)',
    badgeColor: 'from-emerald-600 to-teal-700',
    iconKey: 'WALLET',
    description: 'Financial ledger, LAK commission payouts, bank reconciliation & tax'
  },
  {
    id: 'Marketing',
    labelEn: 'Marketing',
    labelLo: 'ພະແນກການຕະຫຼາດ (Marketing)',
    labelTh: 'ฝ่ายการตลาดและประชาสัมพันธ์ (Marketing)',
    badgeColor: 'from-pink-600 to-rose-700',
    iconKey: 'MEGAPHONE',
    description: 'Brand campaigns, artist promotion, affiliate network growth & events'
  },
  {
    id: 'IT',
    labelEn: 'IT',
    labelLo: 'ພະແນກໄອທີ ແລະ ເຕັກໂນໂລຊີ (IT)',
    labelTh: 'ฝ่ายเทคโนโลยีสารสนเทศ (IT)',
    badgeColor: 'from-blue-600 to-indigo-700',
    iconKey: 'CPU',
    description: 'Platform engineering, studio audio networks, servers & technical support'
  },
  {
    id: 'Teacher',
    labelEn: 'Teacher',
    labelLo: 'ຄູສອນດົນຕີ (Teacher)',
    labelTh: 'ตัวแทนครูสอนดนตรี (Teacher)',
    badgeColor: 'from-cyan-600 to-sky-700',
    iconKey: 'GRADUATION',
    description: 'Music Academy instructor, vocal/instrument coaching & curriculum'
  },
  {
    id: 'Fencer',
    labelEn: 'Fencer',
    labelLo: 'ທີມງານອິດສະຫຼະ / ຕົວແທນພິເສດ (Fencer)',
    labelTh: 'ตัวแทนอิสระ / ฟรีแลนซ์ (Fencer)',
    badgeColor: 'from-purple-600 to-violet-800',
    iconKey: 'SPARKLES',
    description: 'Independent field specialist, studio session partner & creative contractor'
  },
  {
    id: 'Part time',
    labelEn: 'Part time',
    labelLo: 'ພະນັກງານນອກເວລາ (Part time)',
    labelTh: 'พนักงานพาร์ทไทม์ (Part time)',
    badgeColor: 'from-slate-600 to-slate-800',
    iconKey: 'CLOCK',
    description: 'Flexible shift staff, event support, studio assistant & logistics'
  }
];

export interface DmcStaffMember {
  id: string;
  staffCode: string;
  memberId?: string;
  fullName: string;
  position: StaffPosition;
  phone: string;
  email?: string;
  branch: string;
  avatarUrl: string;
  customIconUrl?: string;
  bioOrDuty: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'PART_TIME' | 'INACTIVE';
  joinedDate: string;
}

export interface DmcPromotionItem {
  id: string;
  code: string;
  badge: string;
  title: string;
  titleLo?: string;
  description: string;
  priceLak: number;
  originalPriceLak?: number;
  bonusPoolLak?: number;
  validUntil: string;
  imageUrl: string;
  targetTab: 'musichub' | 'catalog' | 'academy' | 'membership';
  targetSku?: string;
  status: 'ACTIVE' | 'FEATURED' | 'SEASONAL' | 'EXPIRED';
  updatedAt: string;
}



