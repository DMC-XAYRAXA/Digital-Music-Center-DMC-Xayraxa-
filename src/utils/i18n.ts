/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * Multi-language localization (English, Lao, Thai, Vietnamese, Chinese, Korean) & Currency Formatters
 */

import { Language, ProductSKU } from '../types/dmc';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  shortLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'lo', name: 'Lao', nativeName: 'ພາສາລາວ', shortLabel: 'ລາວ', flag: '🇱🇦' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', shortLabel: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', shortLabel: 'Việt', flag: '🇻🇳' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', shortLabel: '中文', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', shortLabel: '한국어', flag: '🇰🇷' },
];

export function formatLak(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 LAK';
  }
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('en-US')} LAK`;
}

export function formatLakSymbol(amount: number): string {
  const rounded = Math.round(amount);
  return `₭${rounded.toLocaleString('en-US')}`;
}

/**
 * Formats Lao Kip amount using compact "K" or "M" shorthand notation.
 */
export function formatLakCompact(
  amount: number,
  options?: { showSymbol?: boolean; useMil?: boolean; lowercase?: boolean }
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return options?.showSymbol ? '0 ₭' : '0';
  }
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const symbol = options?.showSymbol !== false ? ' ₭' : '';
  const kChar = options?.lowercase ? 'k' : 'K';
  const mChar = options?.lowercase ? 'm' : 'M';

  if (abs >= 1_000_000 && options?.useMil) {
    const mil = abs / 1_000_000;
    const formatted = mil % 1 === 0 ? mil.toFixed(0) : mil.toFixed(1).replace(/\.0$/, '');
    return `${sign}${formatted}${mChar}${symbol}`;
  }

  if (abs >= 1_000) {
    const thousands = Math.round(abs / 1_000);
    return `${sign}${thousands.toLocaleString('en-US')}${kChar}${symbol}`;
  }

  return `${sign}${abs.toLocaleString('en-US')}${symbol}`;
}

/**
 * Parses user input that may contain 'k', 'K', 'm', 'M', commas, or spaces.
 */
export function parseAmountWithK(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;

  const clean = input.trim().toLowerCase().replace(/[₭,lak\s]/g, '');
  if (!clean) return 0;

  if (clean.endsWith('m')) {
    const val = parseFloat(clean.slice(0, -1));
    return isNaN(val) ? 0 : Math.round(val * 1_000_000);
  }

  if (clean.endsWith('k')) {
    const val = parseFloat(clean.slice(0, -1));
    return isNaN(val) ? 0 : Math.round(val * 1_000);
  }

  const num = parseFloat(clean);
  return isNaN(num) ? 0 : Math.round(num);
}

export function formatNumberWithCommas(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseAmountWithK(amount);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

/**
 * Product localization helper for all 6 languages
 */
const PRODUCT_TRANSLATIONS: Record<
  string,
  Record<Language, { title: string; description: string; categoryBadge: string }>
> = {
  MUSIC_SINGLE_1600: {
    en: {
      title: 'MUSIC_SINGLE_1600: Studio Song Production Package',
      description:
        'One custom studio song production entitlement at DMC Studios Vientiane. Professional composition, coaching, recording, mixing, and digital release.',
      categoryBadge: 'VIP PACKAGE',
    },
    lo: {
      title: 'ແພັກເກດຜະລິດເພງສະຕູດິໂອ DMC (1 ເພງຄົບວົງຈອນ)',
      description:
        'ສິດທິຜະລິດເພງສະຕູດິໂອ 1 ເພງ ທີ່ DMC Studios ນະຄອນຫຼວງວຽງຈັນ. ແຕ່ງເພງ, ຝຶກສຽງຮ້ອງ, ອັດສຽງ, ມິກສຽງ ແລະ ເຜີຍແຜ່ດິຈິທັລ.',
      categoryBadge: 'ແພັກເກດ VIP',
    },
    th: {
      title: 'แพ็กเกจผลิตเพลงสตูดิโอ DMC (1 เพลงครบวงจร)',
      description:
        'สิทธิ์ผลิตเพลงสตูดิโอ 1 เพลงที่ DMC Studios เวียงจันทน์ แต่งเพลง ฝึกซ้อมร้อง อัดเสียง มิกซ์แอนด์มาสเตอร์ และเผยแพร่ดิจิทัล',
      categoryBadge: 'แพ็กเกจ VIP',
    },
    vi: {
      title: 'Gói Sản Xuất Âm Nhạc Phòng Thu DMC (1 Bài Trọn Gói)',
      description:
        'Đặc quyền sản xuất 1 bài hát tại DMC Studios Viêng Chăn: sáng tác, luyện thanh, thu âm, hòa âm phối khí và phát hành nhạc số.',
      categoryBadge: 'GÓI VIP',
    },
    zh: {
      title: 'DMC 录音棚单曲制作套餐 (1首完整定制单曲)',
      description:
        '万象 DMC 录音棚 1 首定制单曲制作特权：专业词曲创作、声乐指导、录音混音及全球数字音乐平台发行。',
      categoryBadge: 'VIP 尊享包',
    },
    ko: {
      title: 'DMC 스튜디오 음원 제작 패키지 (1곡 올인원 제작)',
      description:
        '비엔티안 DMC 스튜디오 맞춤형 싱글 1곡 제작 특권: 전문 작사·작곡, 보컬 디렉팅, 레코딩, 믹싱 및 글로벌 음원 발매.',
      categoryBadge: 'VIP 패키지',
    },
  },
  'GTR-DMC-ACOUSTIC-01': {
    en: {
      title: 'DMC Xayraxa Signature Solid-Top Acoustic Guitar',
      description:
        'Hand-crafted solid spruce top acoustic guitar with warm resonance, bone nut, and ebony fingerboard.',
      categoryBadge: 'GUITAR',
    },
    lo: {
      title: 'ກີຕ້າໂປ່ງ DMC Xayraxa Signature Solid-Top',
      description: 'ກີຕ້າໂປ່ງໄມ້ແທ້ Solid Spruce ສຽງກັງວານອົບອຸ່ນ ງານຝີມືລະດັບສະຕູດິໂອ.',
      categoryBadge: 'ກີຕ້າ',
    },
    th: {
      title: 'กีตาร์โปร่ง DMC Xayraxa Signature Solid-Top',
      description: 'กีตาร์โปร่งไม้แท้ Solid Spruce เสียงกังวานอบอุ่น งานฝีมือระดับสตูดิโอ',
      categoryBadge: 'กีตาร์',
    },
    vi: {
      title: 'Đàn Guitar Acoustic DMC Xayraxa Signature Solid-Top',
      description: 'Đàn guitar acoustic mặt gỗ thông nguyên tấm chế tác thủ công, âm thanh ấm áp.',
      categoryBadge: 'ĐÀN GUITAR',
    },
    zh: {
      title: 'DMC Xayraxa 签名款单板民谣木吉他',
      description: '手工精选云杉单板面板，音色温暖共鸣出色，黑檀木指板与牛骨琴枕。',
      categoryBadge: '精品吉他',
    },
    ko: {
      title: 'DMC 자이라사 시그니처 솔리드탑 어쿠스틱 기타',
      description: '수제 솔리드 스프루스 탑 어쿠스틱 기타, 깊고 따뜻한 울림과 에보니 지판.',
      categoryBadge: '기타',
    },
  },
  'GTR-DMC-ELECTRIC-02': {
    en: {
      title: 'DMC Studio Custom Electric Guitar (Alnico V)',
      description:
        'Roasted maple neck, dual humbucking pickups with coil tap, tailored for stage and studio recording.',
      categoryBadge: 'GUITAR',
    },
    lo: {
      title: 'ກີຕ້າໄຟຟ້າ DMC Studio Custom (Alnico V Pickups)',
      description: 'ຄໍໄມ້ Roasted Maple ພ້ອມຄອນແທັກຄູ່ Alnico V ສຳລັບເວທີ ແລະ ຫ້ອງອັດສຽງ.',
      categoryBadge: 'ກີຕ້າໄຟຟ້າ',
    },
    th: {
      title: 'กีตาร์ไฟฟ้า DMC Studio Custom (Alnico V Pickups)',
      description: 'คอไม้ Roasted Maple พร้อมปิ๊กอัพคู่ Alnico V สำหรับงานเวทีและห้องบันทึกเสียง',
      categoryBadge: 'กีตาร์ไฟฟ้า',
    },
    vi: {
      title: 'Đàn Guitar Điện DMC Studio Custom (Alnico V)',
      description: 'Cần đàn gỗ Roasted Maple, cặp pickup Humbucker Alnico V chuyên nghiệp cho phòng thu.',
      categoryBadge: 'GUITAR ĐIỆN',
    },
    zh: {
      title: 'DMC 录音棚定制款电吉他 (Alnico V 拾音器)',
      description: '烤枫木琴颈，双线圈 Alnico V 拾音器支持切单，专为舞台演出与专业录音打造。',
      categoryBadge: '电吉他',
    },
    ko: {
      title: 'DMC 스튜디오 커스텀 일렉트릭 기타 (Alnico V)',
      description: '로스티드 메이플 넥, 코일탭 지원 듀얼 험버커 픽업 장착 스튜디오 및 라이브용 기타.',
      categoryBadge: '일렉 기타',
    },
  },
  'ACC-DMC-MIC-03': {
    en: {
      title: 'DMC Vocal Studio Large-Diaphragm Condenser Mic Kit',
      description:
        'Broadcast grade 34mm gold-sputtered capsule, shockmount, pop filter, and balanced XLR cable.',
      categoryBadge: 'AUDIO GEAR',
    },
    lo: {
      title: 'ຊຸດໄມຄອນເດນເຊີ DMC Vocal Studio ພ້ອມ Shockmount',
      description: 'ໄມອັດສຽງຮ້ອງຄຸນນະພາບສູງ 34mm Gold Capsule ພ້ອມຂາຈັບກັນสะເທືອນ ແລະ Pop Filter.',
      categoryBadge: 'ອຸປະກອນສຽງ',
    },
    th: {
      title: 'ชุดไมค์คอนเดนเซอร์ DMC Vocal Studio พร้อม Shockmount',
      description: 'ไมโครโฟนบันทึกเสียงร้อง 34mm Gold Capsule พร้อมขาจับกันสั่นและ Pop Filter',
      categoryBadge: 'อุปกรณ์เสียง',
    },
    vi: {
      title: 'Bộ Micro Thu Âm Condenser DMC Vocal Studio',
      description: 'Màng thu mạ vàng 34mm chuẩn phòng thu, kèm shockmount, màng lọc âm và cáp XLR.',
      categoryBadge: 'THIẾT BỊ THU ÂM',
    },
    zh: {
      title: 'DMC 录音棚大振膜电容麦克风套装',
      description: '广播级 34mm 镀金振膜音头，配备防震架、防喷罩及平衡 XLR 卡农线。',
      categoryBadge: '录音设备',
    },
    ko: {
      title: 'DMC 보컬 스튜디오 대구경 콘덴서 마이크 키트',
      description: '방송급 34mm 골드 캡슐 콘덴서 마이크, 쇼크마운트, 팝필터 및 밸런스드 XLR 케이블 포함.',
      categoryBadge: '오디오 장비',
    },
  },
  'ACC-DMC-PICKS-04': {
    en: {
      title: 'DMC Celluloid Guitar Picks Pro Pack (12-Piece)',
      description: 'Vintage celluloid picks with non-slip grip surface in medium-heavy gauge.',
      categoryBadge: 'ACCESSORY',
    },
    lo: {
      title: 'ປິກກີຕ້າ DMC Celluloid ຊຸດ 12 ອັນ (0.88mm)',
      description: 'ປິກກີຕ້າຄຸນນະພາບສູງ ຈັບถະໜັດມື ຂະໜາດມາດຕະຖານ 0.88mm ຈຳນວນ 12 ອັນ.',
      categoryBadge: 'ອຸປະກອນເສີມ',
    },
    th: {
      title: 'ปิ๊กกีตาร์ DMC Celluloid ชุด 12 ชิ้น (0.88mm)',
      description: 'ปิ๊กกีตาร์เซลลูลอยด์เกรดพรีเมียม จับถนัดมือ ขนาด 0.88mm จำนวน 12 ชิ้น',
      categoryBadge: 'อุปกรณ์เสริม',
    },
    vi: {
      title: 'Bộ 12 Phím Gảy Guitar DMC Celluloid (0.88mm)',
      description: 'Phím gảy guitar chất liệu celluloid cao cấp chống trượt, độ dày 0.88mm.',
      categoryBadge: 'PHỤ KIỆN',
    },
    zh: {
      title: 'DMC 赛璐珞专业吉他拨片套装 (12片装)',
      description: '经典赛璐珞材质防滑磨砂握面，0.88mm 中厚规格专业演奏拨片。',
      categoryBadge: '配件',
    },
    ko: {
      title: 'DMC 셀룰로이드 프로 기타 피크 세트 (12개입)',
      description: '미끄럼 방지 그립 처리가 된 0.88mm 미디엄 헤비 게이지 셀룰로이드 피크.',
      categoryBadge: '액세서리',
    },
  },
};

export function getLocalizedProduct(prod: ProductSKU, language: Language) {
  const entry = PRODUCT_TRANSLATIONS[prod.sku]?.[language];
  if (entry) {
    return entry;
  }
  return {
    title:
      language === 'lo' && prod.titleLo
        ? prod.titleLo
        : language === 'th' && prod.titleTh
        ? prod.titleTh
        : prod.titleEn,
    description: prod.descriptionEn,
    categoryBadge: prod.category === 'MUSIC_PACKAGE' ? 'VIP PACKAGE' : prod.category.replace('_', ' '),
  };
}

export const translations = {
  // 1. ENGLISH (en)
  en: {
    appTitle: 'DMC Xayraxa Super App',
    subtitle: 'Digital Music Center • Rev 2.6',
    selectLanguageLabel: 'Select Language',
    cycleNext: 'Cycle Next ↻',
    navHome: 'Home',
    navAcademy: 'Academy',
    navMusicHub: 'Music Hub',
    navMembership: 'Membership',
    navCatalog: 'Catalog & Music',
    navNetwork: 'Network',
    navWallet: 'Wallet',
    navAiDmc: 'AI DMC',
    navAdmin: 'Web Admin',

    // Header & Quick Bar
    memberLogin: 'Member Login',
    adminLogin: 'Admin Login',
    signOut: 'Sign Out',
    logIn: 'Log In',
    register: 'Register',
    logOut: 'Log Out',
    profileAndSms: 'Profile & SMS',
    switchLogOut: 'Switch / Log Out',
    certShort: 'Cert',
    profileLabel: 'Profile',
    digitalMusicCenter: 'DIGITAL MUSIC CENTER',
    buildYourMusicFuture: 'Build Your Music Future',

    // Member card & Qualification
    freeMember: 'FREE MEMBER',
    activeMember: 'ACTIVE LIFETIME',
    memberId: 'Member ID',
    sponsor: 'Sponsor',
    noSponsor: 'Direct (No Upline)',
    qualificationProgress: 'Qualification Progress',
    qualificationGoal: '1,600,000 LAK Target',
    eligibleClearedHeld: 'Eligible Cleared Held',
    remainingToActive: 'Remaining to Active',
    qualifiedCongratulations:
      'Qualified! You are an Active Lifetime Member with 1 Studio Song Entitlement.',
    targetReachedActivateNow: 'Target reached! Activate Lifetime status now.',
    redeemNow: 'Redeem Now',
    needMoreToQualifyPrefix: 'Need',
    needMoreToQualifySuffix: 'more to qualify',
    pay16mWithBankQr: 'Pay 1.6M with Bank QR',
    memberQr: 'MEMBER QR',
    referralQr: 'Referral QR',
    copyReferralLink: 'Copy Referral Link',
    copied: 'Copied!',

    // 3 Home Balance Tiles
    tileQualificationLocked: 'Qualification (Locked)',
    tileWithdrawableBalance: 'Withdrawable Balance',
    tileMemberStatus: 'Member Status',
    statusActiveShort: 'ACTIVE',
    statusFreeShort: 'FREE',

    // 7 Home Action Buttons
    btnBuyMusicPackage: 'Buy Music Package',
    btnMyNetwork: 'My Network',
    btnThreeLevels: '(3 Levels)',
    btnMyMusic: 'My Music',
    btnSongsCountSuffix: 'Songs',
    btnAcademy: 'Academy',
    btnMusicHub: 'Music Hub',
    btnPromotions: 'Promotions',
    btnSupport: 'Support',

    // Featured Banner Products on Home
    featuredBannerProductsTitle: 'Featured Banner Products',
    featuredBannerProductsSub: 'Official DMC Studio Packages, Guitars & Pro Audio Gear',
    viewAllFour: 'View All (4) →',
    poolLabel: 'Pool',
    buyNowBtn: 'Buy Now',
    buyQrBtn: 'Buy QR',
    studioMasterLabel: 'Studio Master',
    stockLabel: 'Stock',

    // Balances (Wallet)
    pendingBalance: 'Pending Balance',
    heldForQualification: 'Held for Qualification',
    availableBalance: 'Available for Payout',
    heldForWithdrawal: 'Held for In-Flight Withdrawal',
    recoveryDue: 'Recovery Due',
    pendingDesc:
      'Commissions pending delivery of physical goods or within return risk policy window.',
    heldDesc:
      'Cleared referral earnings held strictly toward the 1,600,000 LAK qualification threshold.',
    availableDesc:
      'Ready for external bank transfer via BCEL One, LDB, or JDB (Active members only).',
    heldWithdrawalDesc:
      'Atomic reserved funds currently undergoing Maker/Checker bank payout review.',
    recoveryDueDesc:
      'Recoverable negative position from refunds or chargebacks. Never hidden in fake balances.',
    financialActions: 'Financial Actions',
    depositTopUpQr: 'Deposit / Top-up via Bank QR',

    // Quick actions
    quickMusic: 'Music Package',
    quickCatalog: 'Products / Catalog',
    quickNetwork: 'My Network',
    quickWallet: 'My Wallet',
    quickSong: 'My Song Studio',
    quickSupport: 'DMC Support',

    // Production / Entitlement
    songEntitlementTitle: 'Studio Music Production Entitlement',
    songTitle: 'Title',
    genre: 'Genre',
    status: 'Status',
    inQueue: 'In Queue',
    recording: 'Vocal Recording',
    mixing: 'Mixing & Mastering',
    released: 'Released',
    listenPreview: 'Preview Audio Track',

    // Shipping & Logistics
    shippingCarrier: 'Lao Shipping Carrier',
    selectCarrier: 'Select Shipping Carrier',
    anousithCarrier: 'Anousith Logistics',
    halCarrier: 'HAL Express',
    localDeliveryCarrier: 'Local Delivery',
    trackingNumber: 'Tracking Number',
    deliveryAddress: 'Delivery Address',

    // Screen 02 Academy
    academyTitle: 'DMC Academy • Learning Center',
    academySubtitle:
      'Professional songwriting, vocal preparation, copyright education, and ethical network building.',
    certificationPathway: 'Certification Pathway',
    downloadCertificate: 'Download Certificate',
    currentModuleInProgress: 'Current Module In Progress',
    featuredLessonTitle: 'Studio Debut Preparation: Choosing Your Genre & BPM',
    featuredLessonDesc:
      'Learn how the DMC production team arranges your custom melody before you arrive for vocal recording.',
    resumeLessonBtn: 'Resume Lesson (12 mins left)',
    progressLabel: 'Progress',
    instructorLabel: 'Instructor',
    reviewCourseMaterial: 'Review Course Material',
    continueWatching: 'Continue Watching',
    startCourse: 'Start Course',

    // Screen 02 Membership
    registerTitle: 'DMC Member Registration',
    registerSubtitle: 'Zero signup fee. Instant public Member ID & 3-level referral link.',
    newMemberFormHeading: 'New Member Registration Form (0 LAK Free Signup + Phone SMS OTP)',
    newMemberFormSub:
      'Register a new DMC Member account with Lao Phone (+856) SMS verification & L1 Sponsor assignment.',
    freeSignupBadge: 'FREE SIGNUP • 0 LAK',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number (Lao/Thai/Intl)',
    optionalEmail: 'Email Address (Optional)',
    setPasswordPin: 'Set Password / 6-Digit PIN',
    sponsorCodeLabel: 'Sponsor Code (Optional)',
    sponsorFound: 'Valid Sponsor Found',
    sponsorNotFound: 'No Sponsor (Direct DMC Unallocated)',
    consentTerms: 'I agree to the DMC Member Terms of Service and Privacy Policy (v2.6)',
    consentAutoRedeem:
      'I consent to automatic qualification redemption once my held credit reaches 1,600,000 LAK to unlock Active Lifetime status & 1 Studio Song entitlement without cash.',
    registerButton: 'Send Phone SMS OTP (+856) & Register Member →',
    referralCredentialsTitle: 'Your Personal DMC Referral Credentials',
    referralCredentialsSub:
      'Share your link or QR code to build your direct L1 unilevel sponsor line.',
    shareableReferralLink: 'Shareable Referral Link',
    officialInvitationQr: 'Official Invitation QR',
    showReferralQr: 'Show Referral QR',
    directPayVsEarned: 'Two Ways to Activate Lifetime Membership',
    method1Title: 'Method 1: Direct External Purchase',
    method1Desc:
      'Pay 1,600,000 LAK for the Music Package. Activates immediately, unlocks 1 song entitlement, and distributes candidate commission (L1 400k, L2 200k, L3 100k).',
    method2Title: 'Method 2: Earned Credit Auto-Activation',
    method2Desc:
      'Start as Free Member. Build referrals. Cleared commissions accumulate in Held for Qualification. At 1,600,000 LAK, redeem once to become Active Lifetime + 1 Song Entitlement.',

    // Screen 03 Catalog
    catalogScreenTitle: 'Product Catalog & Music Package',
    catalogScreenSub:
      'Authoritative SKU pricing, warehouse inventory, and transparent candidate commission rules.',
    officialCorePackageBadge: 'Official Core Package',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - Official Music Production Package',
    featuredMusicDesc:
      'One custom studio song production entitlement at DMC Studios, Vientiane. Professional songwriting, vocal coaching, recording, and digital release.',
    price: 'Price',
    buyMusicNow: 'Activate Lifetime',
    commissionSplitDisclosure: 'Rev 2.6 Music Package Candidate Allocation:',
    dmcProductionBudget: 'DMC Studio Production: 900,000 LAK',
    tier1Reward: 'L1 Direct Sponsor: 400,000 LAK',
    tier2Reward: 'L2 Second Sponsor: 200,000 LAK',
    tier3Reward: 'L3 Third Sponsor: 100,000 LAK',
    addToCart: 'Add to Cart',
    editCoreProduct: 'Edit Core Product',
    catAll: 'All Products',
    catGuitar: 'Guitars & Basses',
    catAudio: 'Studio Mics & Gear',
    catAccessory: 'Picks & Accessories',
    cart: 'Shopping Cart',
    checkout: 'Checkout & Pay',
    inStock: 'In Stock',
    warehouse: 'Warehouse',
    orderHistoryTitle: 'Order Fulfillment & Tracking History',

    // Screen 04 Network
    networkTitle: 'Unilevel 3-Level Network',
    networkDesc:
      'Strict 3-Level Unilevel model. No binary, no left/right legs, no pairing bonus, no spillover.',
    totalNetwork: 'Total Team Members',
    activeCount: 'Active Lifetime',
    freeCount: 'Free Members',
    totalAwardsEarned: 'Total Awards Earned',
    upwardSponsorLineage: 'Your Upward Sponsor Lineage (L1, L2, L3 Ancestors)',
    l1Tab: 'L1 Direct Referrals',
    l2Tab: 'L2 Second Generation',
    l3Tab: 'L3 Third Generation',
    commissionHistory: 'Award History',
    unallocatedLogTab: 'Unallocated Log',
    unallocatedNotice:
      'Auditable Unallocated Pool: Missing sponsor tiers are transparently logged and held; never rolled up.',

    // Screen 05 Wallet
    walletTitle: 'Financial Wallet & Ledger',
    walletDesc: 'Balanced double-entry immutable ledger. Real-time Asia/Vientiane snapshots.',
    requestWithdrawal: 'Request Bank Withdrawal',
    withdrawalPolicyFree:
      'Withdrawal is locked for Free Members. Reach 1,600,000 LAK to qualify for Active status to withdraw available funds.',
    redeemQualificationBtn: 'Redeem 1,600,000 LAK Held Credit for Active Lifetime',
    transactionLedger: 'Immutable Transaction Journal',
    downloadStatement: 'Export Ledger (CSV)',

    // Screen 06 AI DMC
    aiDmcTitle: 'AI DMC Assistant',
    aiDmcSubtitle: 'Music Production Coach & Rev 2.6 Policy Knowledge Base',
    aiDmcPlaceholder:
      'Ask AI DMC about song production, lyrics ideas, or Rev 2.6 unilevel rules...',

    // Admin Portal
    adminTitle: 'DMC Web Admin Portal (Internal Operations)',
    adminMakerChecker: 'Finance Maker / Checker Payout Review',
    adminCommissionConfig: 'Commission Rules & SKU Pool Control',
    adminWarehouse: 'Warehouse Inventory & Logistics Fulfillment',
    adminUat: 'Integrated UAT Verification Matrix (A01 - E06)',
    adminAudit: 'System Event Outbox & Audit Logs',

    // Switcher
    switchPersona: 'Switch Test Persona',
    currentPersona: 'Current Persona',
  },

  // 2. LAO (lo)
  lo: {
    appTitle: 'DMC Xayraxa Super App',
    subtitle: 'ສູນດົນຕີດິຈິທັລ • ລຸ້ນ 2.6',
    selectLanguageLabel: 'ເລືອກພາສາ (Language)',
    cycleNext: 'ປ່ຽນພາສາ ↻',
    navHome: 'ໜ້າຫຼັກ',
    navAcademy: 'ອາຄາເດມີ',
    navMusicHub: 'ສູນເພງ',
    navMembership: 'ສະມາຊິກ',
    navCatalog: 'ສິນຄ້າ ແລະ ເພງ',
    navNetwork: 'ສາຍງານ',
    navWallet: 'ກະເປົາເງິນ',
    navAiDmc: 'AI DMC',
    navAdmin: 'ລະບົບຜູ້ດູແລ',

    memberLogin: 'ເຂົ້າລະບົບສະມາຊິກ',
    adminLogin: 'ຜູ້ດູແລລະບົບ',
    signOut: 'ອອກຈາກລະບົບ',
    logIn: 'ເຂົ້າລະບົບ',
    register: 'ລົງທະບຽນ',
    logOut: 'ອອກລະບົບ',
    profileAndSms: 'ໂປຣໄຟລ໌ & SMS',
    switchLogOut: 'สลับບັນຊີ / ອອກ',
    certShort: 'ໃບຢັ້ງຢືນ',
    profileLabel: 'ໂປຣໄຟລ໌',
    digitalMusicCenter: 'ສູນດົນຕີດິຈິທັລ DMC',
    buildYourMusicFuture: 'ສ້າງອະນາຄົດສາຍດົນຕີຂອງທ່ານ',

    freeMember: 'ສະມາຊິກທົ່ວໄປ (FREE)',
    activeMember: 'ສະມາຊິກຕະຫຼອດຊີວິດ (ACTIVE)',
    memberId: 'ລະຫັດສະມາຊິກ',
    sponsor: 'ຜູ້ແນະນຳ',
    noSponsor: 'ໂດຍກົງ (ບໍ່ມີສາຍງານ)',
    qualificationProgress: 'ຄວາມຄືບໜ້າການປົດລັອກ Active',
    qualificationGoal: 'ເປົ້າໝາຍ 1,600,000 ກີບ',
    eligibleClearedHeld: 'ຍອດເງິນສະສົມທີ່ຜ່ານເງື່ອນໄຂ',
    remainingToActive: 'ຍອດທີ່ຍັງເຫຼືອເພື່ອເປັນ Active',
    qualifiedCongratulations:
      'ຍິນດີນຳ! ທ່ານເປັນສະມາຊິກ Active Lifetime ແລ້ວ ພ້ອມສິດຜະລິດເພງ 1 ເພງ.',
    targetReachedActivateNow: 'ຄົບເປົ້າໝາຍແລ້ວ! ກົດປົດລັອກ Active ທັນທີ.',
    redeemNow: 'ປົດລັອກດຽວນີ້',
    needMoreToQualifyPrefix: 'ຍັງຂາດອີກ',
    needMoreToQualifySuffix: 'ເພື່ອປົດລັອກ Active',
    pay16mWithBankQr: 'ຊຳລະ 1.6M ດ້ວຍ QR ທະນາຄານ',
    memberQr: 'ຄິວອາສະມາຊິກ',
    referralQr: 'ຄິວອາໂຄ້ດແນະນຳ',
    copyReferralLink: 'ຄັດລອກລິ້ງແນະນຳ',
    copied: 'ຄັດລອກແລ້ວ!',

    tileQualificationLocked: 'ຍອດສະສົມ (ລັອກໄວ້)',
    tileWithdrawableBalance: 'ຍອດເງິນທີ່ຖອນໄດ້',
    tileMemberStatus: 'ສະຖານະສະມາຊິກ',
    statusActiveShort: 'ACTIVE',
    statusFreeShort: 'FREE',

    btnBuyMusicPackage: 'ຊື້ແພັກເກດເພງ',
    btnMyNetwork: 'ສາຍງານຂອງຂ້ອຍ',
    btnThreeLevels: '(3 ຊັ້ນ)',
    btnMyMusic: 'ເພງຂອງຂ້ອຍ',
    btnSongsCountSuffix: 'ເພງ',
    btnAcademy: 'ອາຄາເດມີ',
    btnMusicHub: 'ສູນເພງ',
    btnPromotions: 'ໂປຣໂມຊັນ',
    btnSupport: 'ຊ່ວຍເຫຼືອ',

    featuredBannerProductsTitle: 'ສິນຄ້າ ແລະ ແພັກເກດແນະນຳ',
    featuredBannerProductsSub: 'ແພັກເກດຜະລິດເພງ DMC Studio, ກີຕ້າ ແລະ ອຸປະກອນຫ້ອງອັດ',
    viewAllFour: 'ເບິ່ງທັງໝົດ (4) →',
    poolLabel: 'ກອງທຶນປັນຜົນ',
    buyNowBtn: 'ຊື້ເລີຍ',
    buyQrBtn: 'ຊື້ຜ່ານ QR',
    studioMasterLabel: 'ບໍລິການສະຕູດິໂອ',
    stockLabel: 'ສາງ',

    pendingBalance: 'ຍອດລໍຖ້າກວດສອບ (Pending)',
    heldForQualification: 'ຍອດສະສົມເພື່ອຄຸນວຸດທິ (Held)',
    availableBalance: 'ຍອດທີ່ຖອນໄດ້ (Available)',
    heldForWithdrawal: 'ຍອດລໍຖ້າໂອນຖອນເງິນ',
    recoveryDue: 'ຍອດລໍຖ້າຫັກຄືນ (Recovery)',
    pendingDesc: 'ລາງວັນໃນໄລຍະຂົນສົ່ງ / ຍັງບໍ່ທັນຖອນໄດ້',
    heldDesc: 'ຍອດລາງວັນຂອງສະມາຊິກ FREE ເພື່ອສະສົມຮອດ 1.6M ກີບ',
    availableDesc: 'ພ້ອມຖອນເຂົ້າບັນຊີທະນາຄານ BCEL One, LDB, JDB (ສະເພາະ Active)',
    heldWithdrawalDesc: 'ຍອດເງິນທີ່ກຳລັງກວດສອບອະນຸມັດໂອນໂດຍຝ່າຍການເງິນ Maker/Checker',
    recoveryDueDesc: 'ຍອດປັບປຸງບັນຊີຈາກການຄືນສິນຄ້າ ໂປ່ງໃສກວດສອບໄດ້',
    financialActions: 'ທຸລະກຳການເງິນ',
    depositTopUpQr: 'ຝາກເງິນ / ເຕີມເງິນຜ່ານ QR ທະນາຄານ',

    quickMusic: 'ແພັກເກດເພງ',
    quickCatalog: 'ສິນຄ້າ / ເຄື່ອງດົນຕີ',
    quickNetwork: 'ສາຍງານຂອງຂ້ອຍ',
    quickWallet: 'ກະເປົາເງິນ',
    quickSong: 'ຫ້ອງບັນທຶກສຽງ',
    quickSupport: 'ຕິດຕໍ່ສອບຖາມ',

    songEntitlementTitle: 'ສິດທິຜະລິດເພງສະຕູດິໂອ DMC',
    songTitle: 'ຊື່ເພງ',
    genre: 'ປະເພດເພງ',
    status: 'ສະຖານະ',
    inQueue: 'ລໍຖ້າຄິວ',
    recording: 'ກຳລັງອັດສຽງຮ້ອງ',
    mixing: 'ມິກສຽງ ແລະ ມາສເຕີຣິງ',
    released: 'ເຜີຍແຜ່ແລ້ວ',
    listenPreview: 'ຟັງຕົວຢ່າງເພງ',

    shippingCarrier: 'ບໍລິສັດຂົນສົ່ງລາວ (Lao Logistics)',
    selectCarrier: 'ເລືອກບໍລິສັດຂົນສົ່ງ',
    anousithCarrier: 'ອານຸສິດ ຂົນສົ່ງ (Anousith Logistics)',
    halCarrier: 'ຮຸ່ງອາລຸນ ຂົນສົ່ງ (HAL Express)',
    localDeliveryCarrier: 'ຈັດສົ່ງດ່ວນພາຍໃນນະຄອນຫຼວງ (Local Delivery)',
    trackingNumber: 'ເລກຕິດຕາມພັດສະດຸ',
    deliveryAddress: 'ທີ່ຢູ່ຈັດສົ່ງສິນຄ້າ',

    academyTitle: 'ສະຖາບັນ DMC Academy • ສູນການຮຽນຮູ້',
    academySubtitle: 'ການແຕ່ງເພງມືອາຊີບ, ການຝຶກຮ້ອງເພງ, ກົດໝາຍລິຂະສິດ ແລະ ການສ້າງສາຍງານຢ່າງຖືກຕ້ອງ.',
    certificationPathway: 'ໃບຢັ້ງຢືນລິຂະສິດ',
    downloadCertificate: 'ດາວໂຫຼດໃບຢັ້ງຢືນ',
    currentModuleInProgress: 'ບົດຮຽນທີ່ກຳລັງຮຽນຢູ່',
    featuredLessonTitle: 'ການກຽມພ້ອມອັດສຽງ: ການເລືອກຈັງຫວະ BPM ແລະ ແນວເພງ',
    featuredLessonDesc:
      'ຮຽນຮູ້ວິທີທີ່ທີມໂປຣດິວເຊີ DMC ຮຽບຮຽງດົນຕີຕົ້ນສະບັບໃຫ້ທ່ານກ່ອນເຂົ້າຫ້ອງອັດສຽງ.',
    resumeLessonBtn: 'ຮຽນຕໍ່ (ເຫຼືອ 12 ນາທີ)',
    progressLabel: 'ຄວາມຄືບໜ້າ',
    instructorLabel: 'ຜູ້ສອນ',
    reviewCourseMaterial: 'ທົບທວນບົດຮຽນ',
    continueWatching: 'ຮຽນຕໍ່ບົດຮຽນ',
    startCourse: 'ເລີ່ມຮຽນ',

    registerTitle: 'ລົງທະບຽນສະມາຊິກ DMC',
    registerSubtitle: 'ສະໝັກຟຣີ ບໍ່ມີຄ່າທຳນຽມ. ຮັບລະຫັດສະມາຊິກ ແລະ ລິ້ງແນະນຳ 3 ຊັ້ນທັນທີ.',
    newMemberFormHeading: 'ແບບຟອມລົງທະບຽນສະມາຊິກໃໝ່ (ສະໝັກຟຣີ 0 ກີບ + ຢືນຢັນ SMS OTP)',
    newMemberFormSub: 'ລົງທະບຽນບັນຊີສະມາຊິກ DMC ດ້ວຍເບີໂທລາວ (+856) ແລະ ຜູກລະຫັດຜູ້ແນະນຳ L1.',
    freeSignupBadge: 'ສະໝັກຟຣີ • 0 ກີບ',
    fullName: 'ຊື່ ແລະ ນາມສະກຸນ',
    phoneNumber: 'ເບີໂທລະສັບ (ລາວ/ໄທ/ສາກົນ)',
    optionalEmail: 'ອີເມວ (ຖ້າມີ)',
    setPasswordPin: 'ຕັ້ງລະຫັດຜ່ານ / PIN 6 ຕົວເລກ',
    sponsorCodeLabel: 'ລະຫັດຜູ້ແນະນຳ (ຖ້າມີ)',
    sponsorFound: 'ພົບຜູ້ແນະນຳທີ່ຖືກຕ້ອງ',
    sponsorNotFound: 'ບໍ່ມີຜູ້ແນະນຳ (ເຂົ້າສູນກາງ DMC ໂດຍກົງ)',
    consentTerms: 'ຂ້າພະເຈົ້າເຫັນດີກັບຂໍ້ກຳນົດ ແລະ ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ DMC (v2.6)',
    consentAutoRedeem:
      'ຍິນຍອມໃຫ້ປົດລັອກ Active ອັດຕະໂນມັດເມື່ອຍອດສະສົມຮອດ 1,600,000 ກີບ ເພື່ອຮັບສິດຜະລິດເພງ 1 ເພງ ໂດຍບໍ່ຕ້ອງຈ່າຍເງິນສົດ.',
    registerButton: 'ສົ່ງລະຫັດ SMS OTP (+856) ແລະ ຢືນຢັນລົງທະບຽນ →',
    referralCredentialsTitle: 'ຂໍ້ມູນລິ້ງແນະນຳສະມາຊິກສ່ວນຕົວຂອງທ່ານ',
    referralCredentialsSub: 'ແບ່ງປັນລິ້ງ ຫຼື ຄິວອາໂຄ້ດ ເພື່ອສ້າງທີມງານຊັ້ນ L1 ໂດຍກົງ.',
    shareableReferralLink: 'ລິ້ງແນະນຳສະມາຊິກ',
    officialInvitationQr: 'ຄິວອາໂຄ້ດແນະນຳຢ່າງເປັນທາງການ',
    showReferralQr: 'ສະແດງ QR ແນະນຳ',
    directPayVsEarned: '2 ຊ່ອງທາງສູ່ການເປັນສະມາຊິກ Active Lifetime',
    method1Title: 'ວິທີທີ 1: ຊື້ແພັກເກດເພງໂດຍກົງ',
    method1Desc:
      'ຊຳລະ 1,600,000 ກີບ ເພື່ອປົດລັອກ Active ທັນທີ, ຮັບສິດຜະລິດເພງ 1 ເພງ ແລະ ຈ່າຍຄອມມິດຊັນ (L1 400k, L2 200k, L3 100k).',
    method2Title: 'ວິທີທີ 2: ສະສົມຍອດຄອມມິດຊັນຈາກການແນະນຳ',
    method2Desc:
      'ເລີ່ມຕົ້ນເປັນສະມາຊິກຟຣີ, ແນະນຳທີມງານ, ຄອມມິດຊັນຈະສະສົມໃນ Held. ເມື່ອຮອດ 1.6M ກີບ, ປົດລັອກ Active + ສິດຜະລິດເພງ 1 ເພງ.',

    catalogScreenTitle: 'ລາຍການສິນຄ້າ ແລະ ແພັກເກດຜະລິດເພງ',
    catalogScreenSub: 'ລາຄາມາດຕະຖານ SKU, ສາງສິນຄ້າຕົວຈິງ ແລະ ກົດການປັນຜົນຄອມມິດຊັນ 3 ຊັ້ນ.',
    officialCorePackageBadge: 'ແພັກເກດຫຼັກຢ່າງເປັນທາງການ',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - ແພັກເກດຜະລິດເພງມືອາຊີບ',
    featuredMusicDesc:
      'ສິດທິຜະລິດເພງສະຕູດິໂອ 1 ເພງ ທີ່ DMC Studios ນະຄອນຫຼວງວຽງຈັນ. ແຕ່ງເພງ, ຄູຝຶກສຽງຮ້ອງ, ອັດສຽງ, ແລະ ເຜີຍແຜ່ດິຈິທັລທົ່ວໂລກ.',
    price: 'ລາຄາ',
    buyMusicNow: 'ປົດລັອກ Active Lifetime',
    commissionSplitDisclosure: 'ໂຄງສ້າງການປັນຜົນຕາມມາດຕະຖານ Rev 2.6:',
    dmcProductionBudget: 'ງົບປະມານຜະລິດເພງ DMC Studio: 900,000 ກີບ',
    tier1Reward: 'ຜູ້ແນະນຳກົງ L1: 400,000 ກີບ',
    tier2Reward: 'ຜູ້ແນະນຳຊັ້ນ 2 L2: 200,000 ກີບ',
    tier3Reward: 'ຜູ້ແນະນຳຊັ້ນ 3 L3: 100,000 ກີບ',
    addToCart: 'ເພີ່ມລົງກະຕ່າ',
    editCoreProduct: 'ແກ້ໄຂແພັກເກດຫຼັກ',
    catAll: 'ສິນຄ້າທັງໝົດ',
    catGuitar: 'ກີຕ້າ ແລະ ເບສ',
    catAudio: 'ໄມ ແລະ ອຸປະກອນຫ້ອງອັດ',
    catAccessory: 'ປິກກີຕ້າ ແລະ ອຸປະກອນເສີມ',
    cart: 'ກະຕ່າສິນຄ້າ',
    checkout: 'ສັ່ງຊື້ ແລະ ຊຳລະເງິນ',
    inStock: 'ມີໃນສາງ',
    warehouse: 'ສາງສິນຄ້າ',
    orderHistoryTitle: 'ປະຫວັດການສັ່ງຊື້ ແລະ ການຈັດສົ່ງ',

    networkTitle: 'ຜັງສາຍງານ Unilevel 3 ຊັ້ນ',
    networkDesc:
      'ລະບົບ Unilevel ແທ້ 3 ຊັ້ນ. ບໍ່ມີໄບນະລີ, ບໍ່ມີຂາຊ້າຍ-ຂວາ, ບໍ່ມີຈັບຄູ່, ບໍ່ມີໂຍນສາຍງານ.',
    totalNetwork: 'ສະມາຊິກທັງໝົດໃນສາຍງານ',
    activeCount: 'ສະມາຊິກ Active',
    freeCount: 'ສະມາຊິກ Free',
    totalAwardsEarned: 'ລວມຄອມມິດຊັນທີ່ໄດ້ຮັບ',
    upwardSponsorLineage: 'ສາຍງານຜູ້ແນະນຳດ້ານເທິງຂອງທ່ານ (L1, L2, L3)',
    l1Tab: 'ຊັ້ນ L1 (ແນະນຳກົງ)',
    l2Tab: 'ຊັ້ນ L2 (ລູກທີມຊັ້ນ 2)',
    l3Tab: 'ຊັ້ນ L3 (ລູກທີມຊັ້ນ 3)',
    commissionHistory: 'ປະຫວັດຄອມມິດຊັນ',
    unallocatedLogTab: 'ບັນທຶກ Unallocated',
    unallocatedNotice:
      'ກອງທຶນ Unallocated ທີ່ກວດສອບໄດ້: ຫາກຂາດຊັ້ນຜູ້ແນະນຳ ເງິນຈະຖືກບັນທຶກໄວ້ໃນລະບົບຢ່າງໂປ່ງໃສ ບໍ່ມີການ Roll-up.',

    walletTitle: 'ກະເປົາເງິນ ແລະ ບັນຊີການເງິນ',
    walletDesc: 'ລະບົບບັນຊີຄູ່ Double-Entry ທີ່ແກ້ໄຂບໍ່ໄດ້. ໂປ່ງໃສ ແລະ ກວດສອບໄດ້ຕາມເວລາຈິງ.',
    requestWithdrawal: 'ແຈ້ງຖອນເງິນເຂົ້າບັນຊີທະນາຄານ',
    withdrawalPolicyFree:
      'ສະມາຊິກ FREE ບໍ່ສາມາດຖອນເງິນໄດ້. ຕ້ອງສະສົມຮອດ 1,600,000 ກີບ ເພື່ອປົດລັອກ Active ກ່ອນ.',
    redeemQualificationBtn: 'ກົດປົດລັອກ Active ດ້ວຍຍອດສະສົມ 1,600,000 ກີບ',
    transactionLedger: 'ປື້ມບັນຊີລາຍການເຄື່ອນໄຫວ (Ledger)',
    downloadStatement: 'ດາວໂຫຼດລາຍງານບັນຊີ (CSV)',

    aiDmcTitle: 'ຜູ້ຊ່ວຍອັດສະລິຍະ AI DMC',
    aiDmcSubtitle: 'ທີ່ປຶກສາການຜະລິດເພງ ແລະ ຂໍ້ມູນນະໂຍບາຍ Rev 2.6',
    aiDmcPlaceholder: 'ຖາມ AI DMC ກ່ຽວກັບການແຕ່ງເພງ, ອັດສຽງ, ຫຼື ກົດລະບຽບ Unilevel 3 ຊັ້ນ...',

    adminTitle: 'ລະບົບຜູ້ດູແລ DMC (Admin Portal)',
    adminMakerChecker: 'ກວດສອບການຖອນເງິນ (Maker / Checker)',
    adminCommissionConfig: 'ຕັ້ງຄ່າກົດຄອມມິດຊັນ ແລະ SKU',
    adminWarehouse: 'ຈັດການສາງສິນຄ້າ ແລະ ຂົນສົ່ງ',
    adminUat: 'ລະບົບທົດສອບ UAT (A01 - E06)',
    adminAudit: 'ບັນທຶກເຫດການ ແລະ ກວດສອບລະບົບ',

    switchPersona: 'ປ່ຽນບັນຊີທົດສອບ',
    currentPersona: 'ບັນຊີປັດຈຸບັນ',
  },

  // 3. THAI (th)
  th: {
    appTitle: 'DMC Xayraxa Super App',
    subtitle: 'ศูนย์ดนตรีดิจิทัล • เวอร์ชัน 2.6',
    selectLanguageLabel: 'เลือกภาษา (Language)',
    cycleNext: 'เปลี่ยนภาษา ↻',
    navHome: 'หน้าแรก',
    navAcademy: 'อะคาเดมี่',
    navMusicHub: 'ศูนย์เพลง',
    navMembership: 'สมาชิก',
    navCatalog: 'สินค้าและเพลง',
    navNetwork: 'สายงาน',
    navWallet: 'กระเป๋าเงิน',
    navAiDmc: 'AI DMC',
    navAdmin: 'ระบบแอดมิน',

    memberLogin: 'เข้าสู่ระบบสมาชิก',
    adminLogin: 'แอดมินเข้าสู่ระบบ',
    signOut: 'ออกจากระบบ',
    logIn: 'เข้าสู่ระบบ',
    register: 'สมัครสมาชิก',
    logOut: 'ออกระบบ',
    profileAndSms: 'โปรไฟล์ & SMS',
    switchLogOut: 'สลับบัญชี / ออก',
    certShort: 'ใบรับรอง',
    profileLabel: 'โปรไฟล์',
    digitalMusicCenter: 'ศูนย์ดนตรีดิจิทัล DMC',
    buildYourMusicFuture: 'สร้างอนาคตงานดนตรีของคุณ',

    freeMember: 'สมาชิกทั่วไป (FREE)',
    activeMember: 'สมาชิกตลอดชีพ (ACTIVE)',
    memberId: 'รหัสสมาชิก',
    sponsor: 'ผู้แนะนำ',
    noSponsor: 'ตรง (ไม่มีสายงาน)',
    qualificationProgress: 'ความคืบหน้าการปลดล็อก Active',
    qualificationGoal: 'เป้าหมาย 1,600,000 กีบ',
    eligibleClearedHeld: 'ยอดสะสมที่ผ่านเงื่อนไข',
    remainingToActive: 'ยอดคงเหลือเพื่อเป็น Active',
    qualifiedCongratulations:
      'ยินดีด้วย! คุณเป็นสมาชิก Active Lifetime แล้ว พร้อมสิทธิ์ทำเพลง 1 เพลง',
    targetReachedActivateNow: 'ครบเป้าหมายแล้ว! กดปลดล็อกสถานะ Active ได้ทันที',
    redeemNow: 'ปลดล็อกทันที',
    needMoreToQualifyPrefix: 'ขาดอีก',
    needMoreToQualifySuffix: 'เพื่อปลดล็อก Active',
    pay16mWithBankQr: 'ชำระ 1.6M ด้วย QR ธนาคาร',
    memberQr: 'คิวอาร์สมาชิก',
    referralQr: 'คิวอาร์โค้ดแนะนำ',
    copyReferralLink: 'คัดลอกลิงก์แนะนำ',
    copied: 'คัดลอกแล้ว!',

    tileQualificationLocked: 'ยอดสะสม (ล็อกไว้)',
    tileWithdrawableBalance: 'ยอดเงินที่ถอนได้',
    tileMemberStatus: 'สถานะสมาชิก',
    statusActiveShort: 'ACTIVE',
    statusFreeShort: 'FREE',

    btnBuyMusicPackage: 'ซื้อแพ็กเกจเพลง',
    btnMyNetwork: 'สายงานของฉัน',
    btnThreeLevels: '(3 ชั้น)',
    btnMyMusic: 'เพลงของฉัน',
    btnSongsCountSuffix: 'เพลง',
    btnAcademy: 'อะคาเดมี่',
    btnMusicHub: 'ศูนย์เพลง',
    btnPromotions: 'โปรโมชั่น',
    btnSupport: 'ติดต่อเรา',

    featuredBannerProductsTitle: 'สินค้าและแพ็กเกจแนะนำ',
    featuredBannerProductsSub: 'แพ็กเกจทำเพลง DMC Studio กีตาร์ และอุปกรณ์บันทึกเสียง',
    viewAllFour: 'ดูทั้งหมด (4) →',
    poolLabel: 'กองทุนคอมมิชชั่น',
    buyNowBtn: 'ซื้อเลย',
    buyQrBtn: 'ซื้อด้วย QR',
    studioMasterLabel: 'บริการสตูดิโอ',
    stockLabel: 'คลัง',

    pendingBalance: 'ยอดรอดำเนินการ (Pending)',
    heldForQualification: 'ยอดสะสมเพื่อคุณสมบัติ (Held)',
    availableBalance: 'ยอดที่ถอนได้ (Available)',
    heldForWithdrawal: 'ยอดรอโอนถอนเงิน',
    recoveryDue: 'ยอดรอหักคืน (Recovery)',
    pendingDesc: 'รางวัลระหว่างการจัดส่ง / ยังไม่สามารถถอนได้',
    heldDesc: 'ยอดสะสมของสมาชิก FREE เพื่อสะสมครบ 1.6M กีบ',
    availableDesc: 'พร้อมถอนเข้าบัญชีธนาคาร BCEL One, LDB, JDB (เฉพาะสมาชิก Active)',
    heldWithdrawalDesc: 'ยอดเงินที่อยู่ระหว่างการอนุมัติโอนโดยฝ่ายการเงิน Maker/Checker',
    recoveryDueDesc: 'ยอดปรับปรุงจากการคืนสินค้า โปร่งใสตรวจสอบได้',
    financialActions: 'ทำรายการทางการเงิน',
    depositTopUpQr: 'ฝากเงิน / เติมเงินผ่าน QR ธนาคาร',

    quickMusic: 'แพ็กเกจเพลง',
    quickCatalog: 'สินค้า / เครื่องดนตรี',
    quickNetwork: 'สายงานของฉัน',
    quickWallet: 'กระเป๋าเงิน',
    quickSong: 'สตูดิโอเพลงของฉัน',
    quickSupport: 'ฝ่ายบริการลูกค้า',

    songEntitlementTitle: 'สิทธิ์ผลิตเพลงสตูดิโอ DMC',
    songTitle: 'ชื่อเพลง',
    genre: 'แนวเพลง',
    status: 'สถานะ',
    inQueue: 'รอคิวบันทึก',
    recording: 'กำลังอัดเสียง',
    mixing: 'มิกซ์และมาสเตอริ่ง',
    released: 'เผยแพร่แล้ว',
    listenPreview: 'ฟังตัวอย่างเพลง',

    shippingCarrier: 'บริษัทขนส่งลาว (Lao Shipping)',
    selectCarrier: 'เลือกบริษัทขนส่ง',
    anousithCarrier: 'อนุสิทธิ์ โลจิสติกส์ (Anousith Logistics)',
    halCarrier: 'HAL เอ็กซ์เพรส (ฮุ่งอาลุน)',
    localDeliveryCarrier: 'จัดส่งด่วนในเวียงจันทน์ (Local Delivery)',
    trackingNumber: 'หมายเลขพัสดุ',
    deliveryAddress: 'ที่อยู่สำหรับจัดส่ง',

    academyTitle: 'สถาบัน DMC Academy • ศูนย์การเรียนรู้',
    academySubtitle:
      'การแต่งเพลงระดับอาชีพ การเตรียมเสียงร้อง กฎหมายลิขสิทธิ์ และการสร้างทีมอย่างมีจริยธรรม',
    certificationPathway: 'ใบรับรองลิขสิทธิ์',
    downloadCertificate: 'ดาวน์โหลดใบรับรอง',
    currentModuleInProgress: 'บทเรียนที่กำลังเรียนอยู่',
    featuredLessonTitle: 'การเตรียมตัวเข้าห้องอัด: การเลือกแนวเพลงและจังหวะ BPM',
    featuredLessonDesc:
      'เรียนรู้วิธีที่ทีมโปรดิวเซอร์ DMC เรียบเรียงทำนองเพลงต้นฉบับให้คุณก่อนวันอัดเสียงจริง',
    resumeLessonBtn: 'เรียนต่อ (เหลือ 12 นาที)',
    progressLabel: 'ความคืบหน้า',
    instructorLabel: 'ผู้สอน',
    reviewCourseMaterial: 'ทบทวนบทเรียน',
    continueWatching: 'เรียนต่อบทเรียน',
    startCourse: 'เริ่มเรียน',

    registerTitle: 'ลงทะเบียนสมาชิก DMC',
    registerSubtitle: 'สมัครฟรีไม่มีค่าใช้จ่าย รับรหัสสมาชิกและลิงก์แนะนำ 3 ชั้นทันที',
    newMemberFormHeading: 'แบบฟอร์มสมัครสมาชิกใหม่ (สมัครฟรี 0 กีบ + ยืนยัน SMS OTP)',
    newMemberFormSub: 'ลงทะเบียนสมาชิก DMC ด้วยเบอร์โทรลาว (+856) และผูกผู้แนะนำตรง L1',
    freeSignupBadge: 'สมัครฟรี • 0 กีบ',
    fullName: 'ชื่อ-นามสกุล',
    phoneNumber: 'เบอร์โทรศัพท์ (ลาว/ไทย/ต่างประเทศ)',
    optionalEmail: 'อีเมล (ถ้ามี)',
    setPasswordPin: 'ตั้งรหัสผ่าน / PIN 6 หลัก',
    sponsorCodeLabel: 'รหัสผู้แนะนำ (ถ้ามี)',
    sponsorFound: 'พบผู้แนะนำที่ถูกต้อง',
    sponsorNotFound: 'ไม่มีผู้แนะนำ (เข้าบริษัทโดยตรง)',
    consentTerms: 'ข้าพเจ้ายอมรับข้อกำหนดและนโยบายความเป็นส่วนตัว DMC (v2.6)',
    consentAutoRedeem:
      'ยินยอมให้ระบบเปลี่ยนสถานะเป็น Active อัตโนมัติเมื่อยอดสะสมครบ 1,600,000 กีบ เพื่อรับสิทธิ์ผลิตเพลง 1 เพลงโดยไม่ต้องจ่ายเงินสด',
    registerButton: 'ส่งรหัส SMS OTP (+856) และยืนยันสมัครสมาชิก →',
    referralCredentialsTitle: 'ข้อมูลลิงก์แนะนำสมาชิกส่วนตัวของคุณ',
    referralCredentialsSub: 'แชร์ลิงก์หรือคิวอาร์โค้ดเพื่อสร้างทีมงานชั้น L1 โดยตรง',
    shareableReferralLink: 'ลิงก์แนะนำสมาชิก',
    officialInvitationQr: 'คิวอาร์โค้ดแนะนำอย่างเป็นทางการ',
    showReferralQr: 'แสดง QR แนะนำ',
    directPayVsEarned: '2 ช่องทางในการเป็นสมาชิก Active Lifetime',
    method1Title: 'วิธีที่ 1: ชำระเงินซื้อแพ็กเกจเพลงโดยตรง',
    method1Desc:
      'ชำระ 1,600,000 กีบ ซื้อแพ็กเกจเพลง ปลดล็อก Active ทันที ได้รับสิทธิ์ทำเพลง 1 เพลง และกระจายคอมมิชชั่น L1 400k, L2 200k, L3 100k',
    method2Title: 'วิธีที่ 2: สะสมคอมมิชชั่นจากการขยายทีม',
    method2Desc:
      'เริ่มต้นสมัครฟรี แนะนำสมาชิก ค่าแนะนำจะถูกเก็บสะสมใน Held เมื่อครบ 1,600,000 กีบ ระบบจะปลดล็อก Active และมอบสิทธิ์ทำเพลง 1 เพลงให้ทันที',

    catalogScreenTitle: 'รายการสินค้าและแพ็กเกจผลิตเพลง',
    catalogScreenSub: 'ราคามาตรฐาน SKU คลังสินค้าจริง และโครงสร้างคอมมิชชั่น 3 ชั้นที่โปร่งใส',
    officialCorePackageBadge: 'แพ็กเกจหลักอย่างเป็นทางการ',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - แพ็กเกจผลิตเพลงมืออาชีพ',
    featuredMusicDesc:
      'สิทธิ์ผลิตเพลงสตูดิโอ 1 เพลงที่ DMC Studios เวียงจันทน์ แต่งเพลง เทรนเนอร์เสียง อัดเสียง มิกซ์เสียง และปล่อยลงสตรีมมิ่งดิจิทัล',
    price: 'ราคา',
    buyMusicNow: 'ปลดล็อก Active Lifetime',
    commissionSplitDisclosure: 'โครงสร้างการแบ่งรายได้ตามเกณฑ์ Rev 2.6:',
    dmcProductionBudget: 'งบประมาณการผลิตเพลง DMC: 900,000 กีบ',
    tier1Reward: 'ผู้แนะนำตรง L1: 400,000 กีบ',
    tier2Reward: 'ผู้แนะนำชั้นที่ 2 L2: 200,000 กีบ',
    tier3Reward: 'ผู้แนะนำชั้นที่ 3 L3: 100,000 กีบ',
    addToCart: 'เพิ่มลงตะกร้า',
    editCoreProduct: 'แก้ไขแพ็กเกจหลัก',
    catAll: 'สินค้าทั้งหมด',
    catGuitar: 'กีตาร์และเบส',
    catAudio: 'ไมค์และอุปกรณ์ห้องอัด',
    catAccessory: 'ปิ๊กและอุปกรณ์เสริม',
    cart: 'ตะกร้าสินค้า',
    checkout: 'สั่งซื้อและชำระเงิน',
    inStock: 'มีสินค้า',
    warehouse: 'คลังสินค้า',
    orderHistoryTitle: 'ประวัติคำสั่งซื้อและการจัดส่ง',

    networkTitle: 'ผังสายงาน Unilevel 3 ชั้น',
    networkDesc:
      'ระบบ Unilevel 3 ชั้นแท้ ไม่มีไบนารี ไม่มีขาซ้าย-ขวา ไม่มีการจับคู่ ไม่มีการโยนสายงาน',
    totalNetwork: 'สมาชิกในทีมทั้งหมด',
    activeCount: 'สมาชิก Active',
    freeCount: 'สมาชิก Free',
    totalAwardsEarned: 'รวมคอมมิชชั่นที่ได้รับ',
    upwardSponsorLineage: 'สายงานผู้แนะนำด้านบนของคุณ (L1, L2, L3)',
    l1Tab: 'ชั้น L1 (แนะนำตรง)',
    l2Tab: 'ชั้น L2 (ชั้นที่ 2)',
    l3Tab: 'ชั้น L3 (ชั้นที่ 3)',
    commissionHistory: 'ประวัติคอมมิชชั่น',
    unallocatedLogTab: 'บันทึก Unallocated',
    unallocatedNotice:
      'ยอดเงินที่ไม่มีผู้รับ (Unallocated): หากไม่มีสายงาน จะถูกบันทึกในระบบอย่างโปร่งใส ไม่มีการ Roll-up',

    walletTitle: 'กระเป๋าเงินและบัญชีการเงิน',
    walletDesc: 'สมุดบัญชีคู่ Double-Entry ที่แก้ไขไม่ได้ โปร่งใสและตรวจสอบย้อนหลังได้ทุกรายการ',
    requestWithdrawal: 'แจ้งถอนเงินเข้าบัญชีธนาคาร',
    withdrawalPolicyFree:
      'สมาชิก FREE ไม่สามารถถอนเงินได้ ต้องสะสมครบ 1,600,000 กีบ เพื่อปลดล็อก Active ก่อน',
    redeemQualificationBtn: 'กดปลดล็อก Active ด้วยยอดสะสม 1,600,000 กีบ',
    transactionLedger: 'บันทึกรายการเคลื่อนไหวทางบัญชี (Ledger)',
    downloadStatement: 'ดาวน์โหลดรายงานบัญชี (CSV)',

    aiDmcTitle: 'ผู้ช่วยอัจฉริยะ AI DMC',
    aiDmcSubtitle: 'โค้ชการผลิตเพลงและฐานความรู้กฎระเบียบ Rev 2.6',
    aiDmcPlaceholder: 'ถาม AI DMC เกี่ยวกับการทำเพลง แต่งเนื้อร้อง หรือกฎ Unilevel 3 ชั้น...',

    adminTitle: 'ระบบแอดมิน DMC (Admin Portal)',
    adminMakerChecker: 'อนุมัติการถอนเงิน (Maker / Checker)',
    adminCommissionConfig: 'ตั้งค่ากฎคอมมิชชั่นสินค้า',
    adminWarehouse: 'จัดการคลังสินค้าและจัดส่ง',
    adminUat: 'ระบบทดสอบ UAT (A01 - E06)',
    adminAudit: 'บันทึกเหตุการณ์และการตรวจสอบระบบ',

    switchPersona: 'เปลี่ยนบัญชีทดสอบ',
    currentPersona: 'บัญชีปัจจุบัน',
  },

  // 4. VIETNAMESE (vi)
  vi: {
    appTitle: 'DMC Xayraxa Super App',
    subtitle: 'Trung Tâm Âm Nhạc Kỹ Thuật Số • Bản 2.6',
    selectLanguageLabel: 'Chọn ngôn ngữ',
    cycleNext: 'Đổi ngôn ngữ ↻',
    navHome: 'Trang chủ',
    navAcademy: 'Học viện',
    navMusicHub: 'Nhạc số',
    navMembership: 'Hội viên',
    navCatalog: 'Sản phẩm & Âm nhạc',
    navNetwork: 'Mạng lưới',
    navWallet: 'Ví tiền',
    navAiDmc: 'AI DMC',
    navAdmin: 'Quản trị Web',

    memberLogin: 'Đăng nhập Hội viên',
    adminLogin: 'Đăng nhập Admin',
    signOut: 'Đăng xuất',
    logIn: 'Đăng nhập',
    register: 'Đăng ký',
    logOut: 'Thoát',
    profileAndSms: 'Hồ sơ & SMS',
    switchLogOut: 'Đổi TK / Thoát',
    certShort: 'Chứng nhận',
    profileLabel: 'Hồ sơ',
    digitalMusicCenter: 'TRUNG TÂM ÂM NHẠC SỐ DMC',
    buildYourMusicFuture: 'Kiến Tạo Tương Lai Âm Nhạc Của Bạn',

    freeMember: 'THÀNH VIÊN MIỄN PHÍ',
    activeMember: 'HỘI VIÊN TRỌN ĐỜI (ACTIVE)',
    memberId: 'Mã thành viên',
    sponsor: 'Người giới thiệu',
    noSponsor: 'Trực tiếp (Không có tuyến trên)',
    qualificationProgress: 'Tiến Độ Mở Khóa Active',
    qualificationGoal: 'Mục tiêu 1.600.000 LAK',
    eligibleClearedHeld: 'Tích lũy đủ điều kiện',
    remainingToActive: 'Còn lại để kích hoạt Active',
    qualifiedCongratulations:
      'Chúc mừng! Bạn đã trở thành Hội viên Active Trọn đời với 1 bài hát phòng thu.',
    targetReachedActivateNow: 'Đã đạt mục tiêu! Kích hoạt Hội viên Trọn đời ngay.',
    redeemNow: 'Kích Hoạt Ngay',
    needMoreToQualifyPrefix: 'Cần thêm',
    needMoreToQualifySuffix: 'để đủ điều kiện Active',
    pay16mWithBankQr: 'Thanh toán 1.6M qua QR',
    memberQr: 'MÃ QR HỘI VIÊN',
    referralQr: 'Mã QR giới thiệu',
    copyReferralLink: 'Sao chép liên kết giới thiệu',
    copied: 'Đã sao chép!',

    tileQualificationLocked: 'Tích lũy (Đang giữ)',
    tileWithdrawableBalance: 'Số dư có thể rút',
    tileMemberStatus: 'Hạng thành viên',
    statusActiveShort: 'ACTIVE',
    statusFreeShort: 'FREE',

    btnBuyMusicPackage: 'Mua Gói Âm Nhạc',
    btnMyNetwork: 'Mạng Lưới',
    btnThreeLevels: '(3 Cấp)',
    btnMyMusic: 'Nhạc Của Tôi',
    btnSongsCountSuffix: 'Bài',
    btnAcademy: 'Học Viện',
    btnMusicHub: 'Nhạc Số',
    btnPromotions: 'Khuyến Mãi',
    btnSupport: 'Hỗ Trợ',

    featuredBannerProductsTitle: 'Sản Phẩm & Gói Nổi Bật',
    featuredBannerProductsSub: 'Gói thu âm DMC Studio, Đàn Guitar & Thiết bị phòng thu',
    viewAllFour: 'Xem tất cả (4) →',
    poolLabel: 'Quỹ thưởng',
    buyNowBtn: 'Mua Ngay',
    buyQrBtn: 'Mua QR',
    studioMasterLabel: 'Dịch vụ Studio',
    stockLabel: 'Kho',

    pendingBalance: 'Số dư chờ xử lý (Pending)',
    heldForQualification: 'Tích lũy điều kiện (Held)',
    availableBalance: 'Số dư khả dụng (Available)',
    heldForWithdrawal: 'Đang chờ duyệt rút tiền',
    recoveryDue: 'Số dư cần thu hồi (Recovery)',
    pendingDesc: 'Phần thưởng đang trong thời gian giao hàng/đổi trả',
    heldDesc: 'Điểm thưởng thành viên FREE tích lũy đạt 1,6 triệu LAK',
    availableDesc: 'Sẵn sàng rút về tài khoản ngân hàng (Chỉ dành cho Active)',
    heldWithdrawalDesc: 'Khoản tiền đang được bộ phận tài chính Maker/Checker duyệt chi',
    recoveryDueDesc: 'Khoản điều chỉnh từ hoàn trả đơn hàng, minh bạch 100%',
    financialActions: 'Tác Vụ Tài Chính',
    depositTopUpQr: 'Nạp tiền qua QR Ngân hàng Lào',

    quickMusic: 'Gói âm nhạc',
    quickCatalog: 'Sản phẩm / Nhạc cụ',
    quickNetwork: 'Mạng lưới của tôi',
    quickWallet: 'Ví tiền',
    quickSong: 'Phòng thu âm',
    quickSupport: 'Hỗ trợ DMC',

    songEntitlementTitle: 'Quyền sản xuất bài hát phòng thu DMC',
    songTitle: 'Tên bài hát',
    genre: 'Thể loại',
    status: 'Trạng thái',
    inQueue: 'Đang chờ',
    recording: 'Thu âm giọng hát',
    mixing: 'Mixing & Mastering',
    released: 'Đã phát hành',
    listenPreview: 'Nghe thử bản nhạc',

    shippingCarrier: 'Đơn vị vận chuyển Lào',
    selectCarrier: 'Chọn đơn vị vận chuyển',
    anousithCarrier: 'Anousith Logistics (Toàn quốc)',
    halCarrier: 'HAL Express (Hỏa tốc)',
    localDeliveryCarrier: 'Giao hàng nội thành (Local Delivery)',
    trackingNumber: 'Mã vận đơn',
    deliveryAddress: 'Địa chỉ nhận hàng',

    academyTitle: 'Học Viện DMC Academy • Trung Tâm Đào Tạo',
    academySubtitle:
      'Sáng tác chuyên nghiệp, luyện thanh phòng thu, bản quyền âm nhạc và phát triển mạng lưới.',
    certificationPathway: 'Chứng Nhận Bản Quyền',
    downloadCertificate: 'Tải Chứng Nhận',
    currentModuleInProgress: 'Học Phần Đang Học',
    featuredLessonTitle: 'Chuẩn Bị Thu Âm Đầu Tay: Chọn Thể Loại & Nhịp Độ BPM',
    featuredLessonDesc:
      'Tìm hiểu cách đội ngũ sản xuất DMC phối khí giai điệu riêng cho bạn trước buổi thu âm.',
    resumeLessonBtn: 'Học Tiếp (Còn 12 phút)',
    progressLabel: 'Tiến độ',
    instructorLabel: 'Giảng viên',
    reviewCourseMaterial: 'Xem Lại Bài Học',
    continueWatching: 'Tiếp Tục Học',
    startCourse: 'Bắt Đầu Học',

    registerTitle: 'Đăng ký thành viên DMC',
    registerSubtitle: 'Miễn phí 100%. Nhận ngay mã thành viên và liên kết giới thiệu 3 cấp.',
    newMemberFormHeading: 'Biểu Mẫu Đăng Ký Hội Viên Mới (Miễn phí 0 LAK + Xác thực SMS OTP)',
    newMemberFormSub:
      'Đăng ký tài khoản DMC bằng số điện thoại Lào (+856) và gắn mã người giới thiệu L1.',
    freeSignupBadge: 'ĐĂNG KÝ MIỄN PHÍ • 0 LAK',
    fullName: 'Họ và tên',
    phoneNumber: 'Số điện thoại',
    optionalEmail: 'Địa chỉ Email (Không bắt buộc)',
    setPasswordPin: 'Đặt Mật Khẩu / Mã PIN 6 Số',
    sponsorCodeLabel: 'Mã người giới thiệu (Nếu có)',
    sponsorFound: 'Đã tìm thấy người giới thiệu',
    sponsorNotFound: 'Không có người giới thiệu (Trực tiếp công ty)',
    consentTerms: 'Tôi đồng ý với Điều khoản dịch vụ và Chính sách quyền riêng tư của DMC (v2.6)',
    consentAutoRedeem:
      'Đồng ý tự động chuyển sang Active khi tích lũy đủ 1.600.000 LAK để nhận 1 bài hát phòng thu không cần tiền mặt.',
    registerButton: 'Gửi Mã SMS OTP (+856) & Hoàn Tất Đăng Ký →',
    referralCredentialsTitle: 'Thông Tin Giới Thiệu Cá Nhân Của Bạn',
    referralCredentialsSub: 'Chia sẻ liên kết hoặc mã QR để phát triển đội nhóm trực tiếp L1.',
    shareableReferralLink: 'Liên Kết Giới Thiệu',
    officialInvitationQr: 'Mã QR Giới Thiệu Chính Thức',
    showReferralQr: 'Hiện Mã QR',
    directPayVsEarned: '2 cách để trở thành Hội viên Active Trọn đời',
    method1Title: 'Cách 1: Mua gói âm nhạc trực tiếp',
    method1Desc:
      'Thanh toán 1.600.000 LAK để kích hoạt Active ngay lập tức, nhận 1 bài hát và phân phối hoa hồng (L1 400k, L2 200k, L3 100k).',
    method2Title: 'Cách 2: Tích lũy hoa hồng từ giới thiệu',
    method2Desc:
      'Bắt đầu miễn phí, chia sẻ giới thiệu, hoa hồng tích lũy vào Held. Đạt 1,6 triệu LAK hệ thống tự nâng cấp Active + 1 bài hát.',

    catalogScreenTitle: 'Danh Mục Sản Phẩm & Gói Âm Nhạc',
    catalogScreenSub: 'Bảng giá SKU chuẩn, tồn kho thực tế và quy tắc chia hoa hồng 3 cấp.',
    officialCorePackageBadge: 'Gói Chủ Lực Chính Thức',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - Gói sản xuất âm nhạc chuyên nghiệp',
    featuredMusicDesc:
      'Đặc quyền sản xuất 1 bài hát tại DMC Studios Viêng Chăn: sáng tác, luyện thanh, thu âm, phát hành nhạc số toàn cầu.',
    price: 'Giá',
    buyMusicNow: 'Kích Hoạt Active Trọn Đời',
    commissionSplitDisclosure: 'Cơ cấu phân chia hoa hồng theo chuẩn Rev 2.6:',
    dmcProductionBudget: 'Chi phí sản xuất DMC Studio: 900.000 LAK',
    tier1Reward: 'Người giới thiệu trực tiếp L1: 400.000 LAK',
    tier2Reward: 'Người giới thiệu cấp 2 L2: 200.000 LAK',
    tier3Reward: 'Người giới thiệu cấp 3 L3: 100.000 LAK',
    addToCart: 'Thêm vào giỏ',
    editCoreProduct: 'Sửa Gói Chính',
    catAll: 'Tất Cả Sản Phẩm',
    catGuitar: 'Đàn Guitar & Bass',
    catAudio: 'Micro & Thiết Bị Thu',
    catAccessory: 'Phím Gảy & Phụ Kiện',
    cart: 'Giỏ hàng',
    checkout: 'Thanh toán đơn hàng',
    inStock: 'Còn hàng',
    warehouse: 'Kho hàng',
    orderHistoryTitle: 'Lịch Sử Đơn Hàng & Vận Chuyển',

    networkTitle: 'Mạng lưới Unilevel 3 Cấp',
    networkDesc: 'Mô hình Unilevel 3 cấp chuẩn: không nhị phân, không cân nhánh, không tràn tầng ảo.',
    totalNetwork: 'Tổng số thành viên đội nhóm',
    activeCount: 'Thành viên Active',
    freeCount: 'Thành viên Free',
    totalAwardsEarned: 'Tổng Hoa Hồng Đạt Được',
    upwardSponsorLineage: 'Tuyến Bảo Trợ Cấp Trên Của Bạn (L1, L2, L3)',
    l1Tab: 'Cấp L1 (Giới thiệu trực tiếp)',
    l2Tab: 'Cấp L2 (Thế hệ thứ 2)',
    l3Tab: 'Cấp L3 (Thế hệ thứ 3)',
    commissionHistory: 'Lịch sử hoa hồng',
    unallocatedLogTab: 'Nhật ký Chưa phân bổ',
    unallocatedNotice:
      'Quỹ chưa phân bổ minh bạch: Tuyến thiếu sẽ được ghi nhận rõ ràng, không roll-up.',

    walletTitle: 'Ví tài chính & Sổ cái kế toán',
    walletDesc: 'Hệ thống sổ cái kép đối ứng bất biến, đối soát minh bạch theo thời gian thực.',
    requestWithdrawal: 'Yêu cầu rút tiền ngân hàng',
    withdrawalPolicyFree:
      'Thành viên FREE chưa thể rút tiền. Cần đạt 1.600.000 LAK để nâng cấp Active.',
    redeemQualificationBtn: 'Đổi điểm tích lũy 1.600.000 LAK sang Active Trọn đời',
    transactionLedger: 'Nhật ký giao dịch bất biến (Ledger)',
    downloadStatement: 'Xuất sao kê (CSV)',

    aiDmcTitle: 'Trợ Lý Thông Minh AI DMC',
    aiDmcSubtitle: 'Huấn luyện viên Sản xuất Âm nhạc & Cố vấn Chính sách Rev 2.6',
    aiDmcPlaceholder:
      'Hỏi AI DMC về sản xuất bài hát, sáng tác lời, hoặc quy tắc Unilevel 3 cấp...',

    adminTitle: 'Cổng quản trị DMC (Admin Portal)',
    adminMakerChecker: 'Kiểm duyệt thanh toán (Maker / Checker)',
    adminCommissionConfig: 'Cấu hình hoa hồng sản phẩm',
    adminWarehouse: 'Quản lý kho hàng & Vận chuyển',
    adminUat: 'Ma trận kiểm thử UAT (A01 - E06)',
    adminAudit: 'Nhật ký hệ thống & Kiểm toán',

    switchPersona: 'Chuyển đổi tài khoản thử nghiệm',
    currentPersona: 'Tài khoản hiện tại',
  },

  // 5. CHINESE (zh)
  zh: {
    appTitle: 'DMC Xayraxa 超级应用',
    subtitle: '数字音乐中心 • 版本 2.6',
    selectLanguageLabel: '选择语言 (Language)',
    cycleNext: '切换下一语言 ↻',
    navHome: '首页',
    navAcademy: '音乐学院',
    navMusicHub: '音乐中心',
    navMembership: '会员中心',
    navCatalog: '音乐与商品',
    navNetwork: '团队网络',
    navWallet: '财务钱包',
    navAiDmc: 'AI 音乐',
    navAdmin: '管理系统',

    memberLogin: '会员登录',
    adminLogin: '管理员登录',
    signOut: '退出登录',
    logIn: '登录',
    register: '注册',
    logOut: '退出',
    profileAndSms: '资料与短信',
    switchLogOut: '切换 / 退出',
    certShort: '版权证书',
    profileLabel: '个人资料',
    digitalMusicCenter: 'DMC 数字音乐中心',
    buildYourMusicFuture: '打造您的音乐未来',

    freeMember: '普通会员 (FREE)',
    activeMember: '终身正式会员 (ACTIVE)',
    memberId: '会员编号',
    sponsor: '推荐人',
    noSponsor: '直接注册 (无上线)',
    qualificationProgress: 'Active 终身会员升级进度',
    qualificationGoal: '1,600,000 基普目标',
    eligibleClearedHeld: '已达标累计金额',
    remainingToActive: '距离升级尚需',
    qualifiedCongratulations:
      '恭喜！您已成功升级为终身正式会员，并获赠1首录音棚单曲制作特权。',
    targetReachedActivateNow: '已达标！立即免费解锁终身正式会员。',
    redeemNow: '立即兑换升级',
    needMoreToQualifyPrefix: '还需积累',
    needMoreToQualifySuffix: '即可升级正式会员',
    pay16mWithBankQr: '银行扫码支付 1.6M',
    memberQr: '会员二维码',
    referralQr: '推广二维码',
    copyReferralLink: '复制推广链接',
    copied: '已复制！',

    tileQualificationLocked: '升级预留金 (锁定)',
    tileWithdrawableBalance: '可提现余额',
    tileMemberStatus: '会员等级状态',
    statusActiveShort: '正式会员',
    statusFreeShort: '普通会员',

    btnBuyMusicPackage: '购买音乐制作包',
    btnMyNetwork: '我的团队网络',
    btnThreeLevels: '(3 级直推)',
    btnMyMusic: '我的音乐作品',
    btnSongsCountSuffix: '首单曲',
    btnAcademy: '音乐学院',
    btnMusicHub: '音乐中心',
    btnPromotions: '优惠活动',
    btnSupport: '官方客服',

    featuredBannerProductsTitle: '精选推荐套餐与乐器',
    featuredBannerProductsSub: 'DMC 官方单曲制作套餐、精品吉他与专业录音设备',
    viewAllFour: '查看全部 (4) →',
    poolLabel: '总奖金池',
    buyNowBtn: '立即购买',
    buyQrBtn: '扫码购买',
    studioMasterLabel: '录音棚定制',
    stockLabel: '库存',

    pendingBalance: '待结算余额 (Pending)',
    heldForQualification: '升级预留金 (Held)',
    availableBalance: '可提现余额 (Available)',
    heldForWithdrawal: '提现审核冻结金',
    recoveryDue: '待冲抵退款金额',
    pendingDesc: '运输/退换期内的奖励；暂不可提现',
    heldDesc: '普通会员专属累计奖励，专门用于达到 160 万基普升级',
    availableDesc: '可随时申请 BCEL One / LDB / JDB 银行提现 (仅限正式会员)',
    heldWithdrawalDesc: '正在进行财务双人复核 (Maker/Checker) 的提现资金',
    recoveryDueDesc: '因退货或冲正产生的待扣回款项，账目公开透明',
    financialActions: '快捷财务操作',
    depositTopUpQr: '老挝银行扫码充值 / 入金',

    quickMusic: '单曲制作包',
    quickCatalog: '产品与乐器',
    quickNetwork: '我的团队',
    quickWallet: '我的钱包',
    quickSong: '音乐工作室',
    quickSupport: '官方客服',

    songEntitlementTitle: 'DMC 录音棚音乐制作权益',
    songTitle: '歌曲名称',
    genre: '音乐风格',
    status: '制作状态',
    inQueue: '排队等候',
    recording: '人声录制中',
    mixing: '混音与母带处理',
    released: '已全网发行',
    listenPreview: '试听音乐片段',

    shippingCarrier: '老挝物流承运商 (Logistics)',
    selectCarrier: '选择物流承运商',
    anousithCarrier: 'Anousith 物流 (全国门到门网点)',
    halCarrier: 'HAL 鸿亚伦特快 (HAL Express)',
    localDeliveryCarrier: '同城即时配送 (万象同城专送)',
    trackingNumber: '物流运单号',
    deliveryAddress: '收货人地址信息',

    academyTitle: 'DMC 音乐学院 • 学习中心',
    academySubtitle: '专业词曲创作、录音棚声乐指导、音乐版权法律与合规团队建设。',
    certificationPathway: '官方版权证书',
    downloadCertificate: '下载版权证书',
    currentModuleInProgress: '正在学习的课程模块',
    featuredLessonTitle: '录音棚首秀准备：如何选择音乐风格与 BPM 速度',
    featuredLessonDesc: '了解 DMC 制作团队如何在您进入录音棚录制人声前为您编配专属伴奏。',
    resumeLessonBtn: '继续学习 (剩余 12 分钟)',
    progressLabel: '学习进度',
    instructorLabel: '主讲导师',
    reviewCourseMaterial: '复习课程内容',
    continueWatching: '继续观看课程',
    startCourse: '开始学习',

    registerTitle: 'DMC 会员注册',
    registerSubtitle: '零注册费，即刻获取专属会员编号和3级推荐裂变链接。',
    newMemberFormHeading: '新会员免费注册表 (0 基普免费注册 + 手机短信 OTP 验证)',
    newMemberFormSub: '使用老挝手机号 (+856) 短信验证注册 DMC 账户并绑定 L1 直接推荐人。',
    freeSignupBadge: '免费注册 • 0 LAK',
    fullName: '姓名 (Full Name)',
    phoneNumber: '手机号码 (老挝/泰国/国际)',
    optionalEmail: '电子邮箱 (选填)',
    setPasswordPin: '设置登录密码 / 6位安全PIN码',
    sponsorCodeLabel: '推荐人编号 (选填)',
    sponsorFound: '已验证有效推荐人',
    sponsorNotFound: '无推荐人 (直接归属 DMC 官方)',
    consentTerms: '我已阅读并同意 DMC 会员服务协议和隐私政策 (v2.6)',
    consentAutoRedeem:
      '同意在累计奖金达到 160 万基普时自动转为 Active 终身正式会员，免现金获赠 1 首单曲制作权益。',
    registerButton: '发送手机短信验证码 (+856) 并完成注册 →',
    referralCredentialsTitle: '您的专属推广链接与二维码',
    referralCredentialsSub: '分享推广链接或二维码，拓展您的 L1 直接推荐团队。',
    shareableReferralLink: '专属推广链接',
    officialInvitationQr: '官方邀请二维码',
    showReferralQr: '显示推广二维码',
    directPayVsEarned: '成为终身正式会员的 2 种途径',
    method1Title: '方式 1: 直接购买音乐制作包',
    method1Desc:
      '支付 1,600,000 基普购买单曲包，立即激活 Active，获得 1 首单曲权益，并分配三级佣金 (L1 40万, L2 20万, L3 10万)。',
    method2Title: '方式 2: 团队裂变佣金免费升级',
    method2Desc:
      '免费注册，推荐好友，佣金自动计入预留金 (Held)。满 160 万基普后自动升级 Active 并获赠 1 首单曲制作特权。',

    catalogScreenTitle: '商品中心与音乐制作套餐',
    catalogScreenSub: '官方授权 SKU 定价、实时仓库库存及透明的三级佣金分配方案。',
    officialCorePackageBadge: '官方核心套餐',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - 专业音乐制作套餐',
    featuredMusicDesc:
      '万象 DMC 录音棚 1 首定制歌曲制作特权：专业作词作曲、声乐指导、录音混音及全球数字音乐发行。',
    price: '价格',
    buyMusicNow: '立即升级终身会员',
    commissionSplitDisclosure: 'Rev 2.6 标准佣金分配透明公示：',
    dmcProductionBudget: 'DMC 录音棚制作成本：900,000 基普',
    tier1Reward: 'L1 直接推荐人奖励：400,000 基普',
    tier2Reward: 'L2 第二代推荐人奖励：200,000 基普',
    tier3Reward: 'L3 第三代推荐人奖励：100,000 基普',
    addToCart: '加入购物车',
    editCoreProduct: '编辑核心套餐',
    catAll: '全部商品',
    catGuitar: '吉他与贝斯',
    catAudio: '专业麦克风与设备',
    catAccessory: '拨片与配件',
    cart: '购物车',
    checkout: '去结算与支付',
    inStock: '现货库存',
    warehouse: '物流仓库',
    orderHistoryTitle: '订单履约与物流追踪记录',

    networkTitle: 'Unilevel 3 级直推体系',
    networkDesc: '严格三级单线体系，无双轨，无左右腿对碰，无虚假滑落。',
    totalNetwork: '团队总人数',
    activeCount: '正式会员 (Active)',
    freeCount: '普通会员 (Free)',
    totalAwardsEarned: '累计获得佣金总额',
    upwardSponsorLineage: '您的上级推荐关系链 (L1, L2, L3)',
    l1Tab: 'L1 直接推荐',
    l2Tab: 'L2 第二代成员',
    l3Tab: 'L3 第三代成员',
    commissionHistory: '佣金结算记录',
    unallocatedLogTab: '未分配奖金日志',
    unallocatedNotice: '可审计未分配奖金池：缺失层级的资金透明留存，绝无暗箱沉淀。',

    walletTitle: '财务钱包与不可篡改分类账',
    walletDesc: '复式记账法双向平衡，支持亚洲/万象时区实时流水追溯。',
    requestWithdrawal: '申请银行卡提现',
    withdrawalPolicyFree:
      '普通会员暂不可提现，累计满 160 万基普升级正式会员后即可自由提现。',
    redeemQualificationBtn: '使用 160 万预留金兑换正式会员',
    transactionLedger: '不可篡改流水明细账 (Ledger)',
    downloadStatement: '导出财务报表 (CSV)',

    aiDmcTitle: 'AI DMC 智能音乐助手',
    aiDmcSubtitle: '录音棚音乐制作指导 & Rev 2.6 制度知识库',
    aiDmcPlaceholder: '向 AI DMC 咨询单曲制作、歌词创作灵感或三级分润规则...',

    adminTitle: 'DMC 管理后台系统 (Admin Portal)',
    adminMakerChecker: '财务双人复核出款 (Maker / Checker)',
    adminCommissionConfig: '产品佣金规则设置',
    adminWarehouse: '仓库库存与物流管理',
    adminUat: '集成 UAT 测试矩阵 (A01 - E06)',
    adminAudit: '系统事件日志与审计',

    switchPersona: '切换测试身份',
    currentPersona: '当前账户',
  },

  // 6. KOREAN (ko)
  ko: {
    appTitle: 'DMC 자이라사 슈퍼 앱',
    subtitle: '디지털 뮤직 센터 • 버전 2.6',
    selectLanguageLabel: '언어 선택 (Language)',
    cycleNext: '다음 언어 ↻',
    navHome: '홈',
    navAcademy: '아카데미',
    navMusicHub: '뮤직 허브',
    navMembership: '멤버십',
    navCatalog: '스토어 & 음악',
    navNetwork: '네트워크',
    navWallet: '지갑 & 자산',
    navAiDmc: 'AI DMC',
    navAdmin: '관리자 포털',

    memberLogin: '회원 로그인',
    adminLogin: '관리자 로그인',
    signOut: '로그아웃',
    logIn: '로그인',
    register: '회원가입',
    logOut: '로그아웃',
    profileAndSms: '프로필 & SMS',
    switchLogOut: '계정전환 / 로그아웃',
    certShort: '저작권증',
    profileLabel: '프로필',
    digitalMusicCenter: 'DMC 디지털 뮤직 센터',
    buildYourMusicFuture: '당신의 음악적 미래를 만드세요',

    freeMember: '일반 회원 (FREE)',
    activeMember: '평생 정회원 (ACTIVE)',
    memberId: '회원 번호',
    sponsor: '추천인',
    noSponsor: '본사 직접 등록',
    qualificationProgress: 'Active 정회원 승급 진행률',
    qualificationGoal: '1,600,000 LAK 목표',
    eligibleClearedHeld: '적격 누적 금액',
    remainingToActive: '승급까지 남은 금액',
    qualifiedCongratulations:
      '축하합니다! 평생 정회원(Active)으로 승급되었으며 스튜디오 싱글 음원 1곡 제작 특권이 부여되었습니다.',
    targetReachedActivateNow: '목표 달성! 지금 바로 평생 정회원으로 승급하세요.',
    redeemNow: '지금 승급하기',
    needMoreToQualifyPrefix: '정회원 승급까지',
    needMoreToQualifySuffix: '더 필요합니다',
    pay16mWithBankQr: '은행 QR로 1.6M 결제',
    memberQr: '회원 QR 코드',
    referralQr: '추천 QR 코드',
    copyReferralLink: '추천 링크 복사',
    copied: '복사 완료!',

    tileQualificationLocked: '승급 적립금 (보류)',
    tileWithdrawableBalance: '출금 가능 잔액',
    tileMemberStatus: '회원 등급 상태',
    statusActiveShort: 'ACTIVE',
    statusFreeShort: 'FREE',

    btnBuyMusicPackage: '음원 패키지 구매',
    btnMyNetwork: '내 네트워크',
    btnThreeLevels: '(3단계)',
    btnMyMusic: '내 음악 작품',
    btnSongsCountSuffix: '곡',
    btnAcademy: '아카데미',
    btnMusicHub: '뮤직 허브',
    btnPromotions: '프로모션',
    btnSupport: '고객 지원',

    featuredBannerProductsTitle: '추천 배너 상품 & 패키지',
    featuredBannerProductsSub: '공식 DMC 스튜디오 음원 제작 패키지, 기타 & 프로 오디오 장비',
    viewAllFour: '전체 보기 (4) →',
    poolLabel: '수수료 풀',
    buyNowBtn: '즉시 구매',
    buyQrBtn: 'QR 구매',
    studioMasterLabel: '스튜디오 제작',
    stockLabel: '재고',

    pendingBalance: '정산 대기 잔액 (Pending)',
    heldForQualification: '승급 적립금 (Held)',
    availableBalance: '출금 가능 잔액 (Available)',
    heldForWithdrawal: '출금 심사 중 보류금',
    recoveryDue: '환수 대기 금액 (Recovery)',
    pendingDesc: '배송 및 교환 기간 중 보류된 수수료 (출금 불가)',
    heldDesc: '일반 회원이 160만 킵 승급을 위해 적립한 금액',
    availableDesc: 'BCEL One, LDB, JDB 은행 계좌로 즉시 출금 가능 (정회원 전용)',
    heldWithdrawalDesc: '재무팀 Maker/Checker 출금 승인 심사 중인 안전 예치금',
    recoveryDueDesc: '환불 또는 취소로 인해 발생한 차감 예정 금액 (투명 원장 관리)',
    financialActions: '금융 거래 메뉴',
    depositTopUpQr: '라오스 은행 QR 입금 / 충전',

    quickMusic: '음원 패키지',
    quickCatalog: '상품 / 악기',
    quickNetwork: '내 네트워크',
    quickWallet: '내 지갑',
    quickSong: '음악 스튜디오',
    quickSupport: '고객 지원',

    songEntitlementTitle: 'DMC 스튜디오 음원 제작 권리',
    songTitle: '곡명',
    genre: '장르',
    status: '제작 상태',
    inQueue: '대기 중',
    recording: '보컬 레코딩',
    mixing: '믹싱 & 마스터링',
    released: '발매 완료',
    listenPreview: '미리 듣기',

    shippingCarrier: '라오스 택배 배송사 (Logistics)',
    selectCarrier: '배송 택배사 선택',
    anousithCarrier: '아누싯 로지스틱스 (Anousith Logistics)',
    halCarrier: 'HAL 익스프레스 (Houng Ah Loun)',
    localDeliveryCarrier: '비엔티안 당일 퀵배송 (Local Delivery)',
    trackingNumber: '운송장 번호',
    deliveryAddress: '배송지 주소',

    academyTitle: 'DMC 아카데미 • 러닝 센터',
    academySubtitle: '전문 작곡 및 보컬 트레이닝, 음악 저작권 교육, 윤리적 네트워크 구축.',
    certificationPathway: '공식 저작권 증명서',
    downloadCertificate: '증명서 다운로드',
    currentModuleInProgress: '현재 수강 중인 강의',
    featuredLessonTitle: '스튜디오 데뷔 준비: 나에게 맞는 장르와 BPM 템포 선택하기',
    featuredLessonDesc:
      '보컬 녹음 전 DMC 프로덕션 팀이 맞춤형 멜로디와 편곡을 완성하는 과정을 배워보세요.',
    resumeLessonBtn: '이어서 수강하기 (12분 남음)',
    progressLabel: '진도율',
    instructorLabel: '강사',
    reviewCourseMaterial: '강의 복습하기',
    continueWatching: '이어서 보기',
    startCourse: '강의 시작하기',

    registerTitle: 'DMC 회원 가입',
    registerSubtitle: '가입비 무료. 즉시 고유 회원 번호와 3단계 추천 링크가 발급됩니다.',
    newMemberFormHeading: '신규 회원 가입 양식 (가입비 0 LAK 무료 + 휴대폰 SMS OTP 인증)',
    newMemberFormSub: '라오스 전화번호(+856) SMS 인증 및 L1 추천인 지정으로 DMC 계정을 등록하세요.',
    freeSignupBadge: '무료 가입 • 0 LAK',
    fullName: '성명 (Full Name)',
    phoneNumber: '전화번호 (라오스/태국/국제)',
    optionalEmail: '이메일 주소 (선택 사항)',
    setPasswordPin: '비밀번호 / 6자리 PIN 설정',
    sponsorCodeLabel: '추천인 코드 (선택 사항)',
    sponsorFound: '유효한 추천인 확인 완료',
    sponsorNotFound: '추천인 없음 (DMC 본사 직속)',
    consentTerms: 'DMC 회원 서비스 이용약관 및 개인정보 처리방침(v2.6)에 동의합니다.',
    consentAutoRedeem:
      '적립금이 1,600,000 LAK에 도달하면 현금 결제 없이 정회원(Active) 및 스튜디오 음원 1곡 제작권으로 자동 전환되는 것에 동의합니다.',
    registerButton: 'SMS OTP(+856) 발송 및 회원 가입 완료 →',
    referralCredentialsTitle: '나의 개인 추천 링크 및 QR 코드',
    referralCredentialsSub: '추천 링크나 QR 코드를 공유하여 직추 L1 파트너 라인을 구축하세요.',
    shareableReferralLink: '공유 가능한 추천 링크',
    officialInvitationQr: '공식 초대 QR 코드',
    showReferralQr: '추천 QR 보기',
    directPayVsEarned: '평생 정회원이 되는 2가지 방법',
    method1Title: '방법 1: 음원 패키지 직접 구매',
    method1Desc:
      '1,600,000 LAK를 결제하여 즉시 정회원으로 전환되고, 음원 1곡 제작권을 얻으며, 3단계 추천 수수료(L1 40만, L2 20만, L3 10만)가 지급됩니다.',
    method2Title: '방법 2: 추천 활동을 통한 무자본 자동 승급',
    method2Desc:
      '무료 회원으로 시작하여 팀을 확장하면 수수료가 Held에 적립됩니다. 160만 킵 달성 시 자동 승급 및 음원 1곡 제작권이 지급됩니다.',

    catalogScreenTitle: '상품 카탈로그 & 음원 제작 패키지',
    catalogScreenSub: '공식 SKU 정가, 실시간 창고 재고 및 투명한 3단계 추천 수수료 규정.',
    officialCorePackageBadge: '공식 코어 패키지',
    featuredMusicTitle: 'MUSIC_SINGLE_1600 - 프로 스튜디오 음원 제작 패키지',
    featuredMusicDesc:
      '비엔티안 DMC 스튜디오에서 1곡의 맞춤형 음원을 제작할 수 있는 권리: 전문 작사/작곡, 보컬 트레이닝, 레코딩, 전 세계 디지털 음원 발매.',
    price: '가격',
    buyMusicNow: '평생 정회원 즉시 활성화',
    commissionSplitDisclosure: 'Rev 2.6 수수료 배분 투명 공시:',
    dmcProductionBudget: 'DMC 스튜디오 제작 원가: 900,000 LAK',
    tier1Reward: 'L1 직접 추천인 보상: 400,000 LAK',
    tier2Reward: 'L2 2단계 추천인 보상: 200,000 LAK',
    tier3Reward: 'L3 3단계 추천인 보상: 100,000 LAK',
    addToCart: '장바구니 담기',
    editCoreProduct: '코어 패키지 편집',
    catAll: '전체 상품',
    catGuitar: '기타 & 베이스',
    catAudio: '스튜디오 마이크 & 장비',
    catAccessory: '피크 & 액세서리',
    cart: '장바구니',
    checkout: '주문 및 결제하기',
    inStock: '재고 있음',
    warehouse: '물류 창고',
    orderHistoryTitle: '주문 이행 및 배송 조회 내역',

    networkTitle: '유니레벨 3단계 네트워크 조직도',
    networkDesc:
      '엄격한 3단계 유니레벨 모델. 바이너리 없음, 좌우 균형 조건 없음, 추천 수수료 왜곡 없음.',
    totalNetwork: '전체 팀원 수',
    activeCount: '정회원 (Active)',
    freeCount: '일반 회원 (Free)',
    totalAwardsEarned: '총 누적 수수료 수익',
    upwardSponsorLineage: '나의 상위 추천인 계보 (L1, L2, L3)',
    l1Tab: '1단계 L1 (직접 추천)',
    l2Tab: '2단계 L2 (2대 파트너)',
    l3Tab: '3단계 L3 (3대 파트너)',
    commissionHistory: '수수료 수당 내역',
    unallocatedLogTab: '미배정 수수료 기록',
    unallocatedNotice:
      '미지급 수수료 풀 투명 보존: 상위 추천인이 없을 경우 회사가 임의 회수하지 않고 시스템에 투명하게 보존됩니다.',

    walletTitle: '금융 지갑 & 불변 분개 원장',
    walletDesc: '조작 불가능한 복식 부기 원장. 비엔티안 표준시 기준 실시간 금융 내역.',
    requestWithdrawal: '은행 계좌 출금 신청',
    withdrawalPolicyFree:
      '일반 회원은 출금이 제한됩니다. 160만 킵을 달성하여 정회원으로 승급 후 출금 가능합니다.',
    redeemQualificationBtn: '160만 킵 적립금으로 정회원 승급하기',
    transactionLedger: '불변 분개 원장 (Ledger)',
    downloadStatement: '원장 내역 다운로드 (CSV)',

    aiDmcTitle: 'AI DMC 스마트 어시스턴트',
    aiDmcSubtitle: '음원 제작 코치 & Rev 2.6 정책 지식 베이스',
    aiDmcPlaceholder:
      'AI DMC에게 음원 제작, 작사 아이디어 또는 3단계 유니레벨 규정을 질문하세요...',

    adminTitle: 'DMC 웹 관리자 포털 (Admin Portal)',
    adminMakerChecker: '출금 결재 시스템 (Maker / Checker)',
    adminCommissionConfig: '수수료 규정 및 SKU 관리',
    adminWarehouse: '창고 재고 및 배송 물류 관리',
    adminUat: '통합 UAT 검증 매트릭스 (A01 - E06)',
    adminAudit: '시스템 이벤트 로그 & 감사 기록',

    switchPersona: '테스트 계정 전환',
    currentPersona: '현재 접속 계정',
  },
};
