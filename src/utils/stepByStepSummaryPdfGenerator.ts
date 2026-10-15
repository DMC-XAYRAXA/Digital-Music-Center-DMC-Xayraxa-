/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * 2/ DMC_XAYRAXA_STEP_BY_STEP_SUMMARY OFFICIAL MULTI-PAGE PDF GENERATOR
 * Supports:
 * - English Version (`EN`: `2_DMC_Xayraxa_Step_By_Step_Summary.pdf` - 3 A4 Pages)
 * - Lao Language Version (`LO`: `2_DMC_Xayraxa_Step_By_Step_Summary_Lao.pdf` - 3 A4 Pages)
 * - Combined Bilingual (`BOTH`: `2_DMC_Xayraxa_Step_By_Step_Summary_Bilingual.pdf` - 6 A4 Pages)
 * - Executive Print (White & Gold) & Luxury Dark & Gold themes
 */

import { drawDmcOfficialLogoOnCanvas } from '../components/common/DmcLogo';
import { PdfThemeStyle, PdfLanguageVersion } from './companyProfilePdfGenerator';

export interface StepByStepItem {
  stepCode: string;
  phaseBadgeEn: string;
  phaseBadgeLo: string;
  titleEn: string;
  titleLo: string;
  summaryEn: string;
  summaryLo: string;
  keyRuleEn: string;
  keyRuleLo: string;
  accentColor: string;
}

export interface StepByStepSummaryData {
  documentCode: string;
  documentTitleEn: string;
  documentTitleLo: string;
  subtitleEn: string;
  subtitleLo: string;
  introSummaryEn: string;
  introSummaryLo: string;
  signatoryName: string;
  signatoryNameLo: string;
  signatoryTitleEn: string;
  signatoryTitleLo: string;
  steps: StepByStepItem[];
}

export const DEFAULT_STEP_BY_STEP_SUMMARY_DATA: StepByStepSummaryData = {
  documentCode: 'DOC-ID: DMC-LA-STEP-BY-STEP-2026-V2.6',
  documentTitleEn: 'DMC XAYRAXA — STEP-BY-STEP MASTER OPERATIONAL SUMMARY',
  documentTitleLo: 'ສະຫຼຸບຂັ້ນຕອນການດຳເນີນງານແບບລະອຽດ 10 ຂັ້ນຕອນ — DMC ໄຊລາຊາ',
  subtitleEn:
    'Complete 10-Step Operational Guide: Registration, 1.6M LAK Qualification, Unilevel Splits, 5-Balance Wallet & Studio Production',
  subtitleLo:
    'ຄູ່ມືສະຫຼຸບເທື່ອລະຂັ້ນຕອນ: ການສະໝັກສະມາຊິກ, ແພັກເກັດ 1,600,000 ກີບ, ຄ່າແນະນຳ 3 ຊັ້ນ, ກະເປົາເງິນ 5 ບັນຊີ ແລະ ການຜະລິດເພງ',
  introSummaryEn:
    'This official Step-by-Step Summary defines the complete end-to-end operational lifecycle of the DMC Xayraxa Super App (Revision 2.6) for members, creators, banking partners, and administrators.',
  introSummaryLo:
    'ເອກະສານສະບັບນີ້ສະຫຼຸບຂັ້ນຕອນການເຮັດວຽກທັງໝົດ 10 ຂັ້ນຕອນຂອງລະບົບ DMC Xayraxa Super App (Revision 2.6) ສຳລັບສະມາຊິກໃໝ່, ນັກສ້າງສັນເພງ ແລະ ຜູ້ບໍລິຫານ.',
  signatoryName: 'XAY RAXA',
  signatoryNameLo: 'ໄຊ ຣາຊາ (XAY RAXA)',
  signatoryTitleEn: 'Founder & Chief Executive Officer (CEO)',
  signatoryTitleLo: 'ຜູ້ກໍ່ຕັ້ງ ແລະ ປະທານຜູ້ບໍລິຫານສູງສຸດ (CEO)',
  steps: [
    {
      stepCode: 'STEP 01',
      phaseBadgeEn: 'ONBOARDING',
      phaseBadgeLo: 'ການລົງທະບຽນ',
      titleEn: 'Free Member Registration & Sponsor Tree Linking (FREE_MEMBER)',
      titleLo: 'ສະໝັກສະມາຊິກຟຣີ (FREE_MEMBER) ແລະ ຜູກລະຫັດຜູ້ແນະນຳ (Sponsor ID)',
      summaryEn:
        'New users register for free (0 LAK) by entering their Full Name, Lao Mobile Number (+856 20), Password, and Sponsor ID (e.g., DMC-LA-00101) or scanning a Sponsor QR Code.',
      summaryLo:
        'ຜູ້ໃຊ້ໃໝ່ລົງທະບຽນຟຣີ (0 ກີບ) ໂດຍປ້ອນຊື່-ນາມສະກຸນ, ເບີໂທລະສັບ (+856 20), ລະຫັດຜ່ານ ແລະ ລະຫັດຜູ້ແນະນຳ (Sponsor ID ເຊັ່ນ DMC-LA-00101) ຫຼື ສະແກນ QR ຜູ້ແນະນຳ.',
      keyRuleEn: 'Rule: Every member is permanently linked to their L1, L2 & L3 upline tree at registration.',
      keyRuleLo: 'ກົດລະບຽບ: ສະມາຊິກທຸກຄົນຈະຖືກຜູກເຂົ້າກັບຜັງສາຍງານ L1, L2 ແລະ L3 ຢ່າງຖາວອນທັນທີ.',
      accentColor: '#df1c2d',
    },
    {
      stepCode: 'STEP 02',
      phaseBadgeEn: 'IDENTITY & QR',
      phaseBadgeLo: 'ຢືນຢັນຕົວຕົນ & QR',
      titleEn: 'Phone SMS OTP Verification, KYC & Gold Member QR Card Issuance',
      titleLo: 'ຢືນຢັນ SMS OTP, ອັບໂຫຼດຮູບໂປຣໄຟລ໌ ແລະ ຮັບບັດທອງຄຳ Member QR',
      summaryEn:
        'Verify mobile number via Lao Telecom, Unitel, ETL, or Beeline SMS OTP, accept Auto-Redeem & Terms consents (v2.6), and receive an official DMC-LA-XXXX ID and Gold QR Card.',
      summaryLo:
        'ຢືນຢັນເບີໂທຜ່ານ SMS OTP (Lao Telecom, Unitel, ETL, Beeline), ຍອມຮັບເງື່ອນໄຂ v2.6 ແລະ ຮັບລະຫັດສະມາຊິກ DMC-LA-XXXX ພ້ອມບັດທອງຄຳ Member QR ທັນທີ.',
      keyRuleEn: 'Rule: Free Members immediately receive their own Referral QR to invite L1/L2/L3 downlines.',
      keyRuleLo: 'ກົດລະບຽບ: ສະມາຊິກຟຣີສາມາດໃຊ້ QR ຂອງຕົນເອງແນະນຳສາຍງານ L1/L2/L3 ໄດ້ທັນທີ.',
      accentColor: '#2e1d87',
    },
    {
      stepCode: 'STEP 03',
      phaseBadgeEn: 'ACTIVATION',
      phaseBadgeLo: 'ອັບເກຣດຕະຫຼອດຊີບ',
      titleEn: 'Two Pathways to Qualify as ACTIVE_LIFETIME_MEMBER (1,600,000 LAK)',
      titleLo: '2 ຊ່ອງທາງອັບເກຣດເປັນ ສະມາຊິກຕະຫຼອດຊີບ (ACTIVE_LIFETIME_MEMBER 1,600,000 ກີບ)',
      summaryEn:
        'Pathway A: Direct payment of 1,600,000 LAK via Lao Bank QR (BCEL, Phongsavanh, LDB, JDB, VietinBank). Pathway B: Accumulate 1,600,000 LAK in Cleared Held Credit from downline sales for automatic redemption.',
      summaryLo:
        'ຊ່ອງທາງ A: ຊຳລະໂດຍກົງ 1,600,000 ກີບ ຜ່ານ LAO QR 5 ທະນາຄານ. ຊ່ອງທາງ B: สะສົມເງິນ Held Credit ຈາກສາຍງານຄົບ 1,600,000 ກີບ ເພື່ອຕັດອັບເກຣດອັດຕະໂນມັດ.',
      keyRuleEn: 'Rule: One-time lifetime qualification (1,600,000 LAK) — zero monthly maintenance fees.',
      keyRuleLo: 'ກົດລະບຽບ: ອັບເກຣດພຽງຄັ້ງດຽວຄຸ້ມຄອງຕະຫຼອດຊີບ — ບໍ່ມີຄ່າຮັກສາຍອດລາຍເດືອນ.',
      accentColor: '#059669',
    },
    {
      stepCode: 'STEP 04',
      phaseBadgeEn: 'SONG ENTITLEMENT',
      phaseBadgeLo: 'ສິດຜະລິດເພງສ່ວນຕົວ',
      titleEn: 'Unlock 1 Custom AI & Studio Song (2:00–5:00 min) + Copyright Certificate',
      titleLo: 'ຮັບສິດຜະລິດເພງສ່ວນຕົວ 1 ເພງ (2:00–5:00 ນາທີ) ພ້ອມໃບຢັ້ງຢືນລິຂະສິດ 100%',
      summaryEn:
        'Upon activating MUSIC_SINGLE_1600, the member unlocks 1 custom studio song project produced at DMC Central Studio Vientiane with official Master & Publishing Rights certification.',
      summaryLo:
        'ທັນທີທີ່ອັບເກຣດແພັກເກັດ MUSIC_SINGLE_1600, ສະມາຊິກຈະໄດ້ຮັບສິດສ້າງເພງສ່ວນຕົວ 1 ເພງ ພ້ອມໃບຢັ້ງຢືນລິຂະສິດເພງ (Copyright & Master Rights Certificate) ອອກເປັນຊື່ສະມາຊິກ.',
      keyRuleEn: 'Rule: Every 1,600,000 LAK qualification is backed by a real, tangible studio music product.',
      keyRuleLo: 'ກົດລະບຽບ: ທຸກໆ 1,600,000 ກີບ ແມ່ນການຊື້ຜົນງານເພງລິຂະສິດແທ້ 100%.',
      accentColor: '#d97706',
    },
    {
      stepCode: 'STEP 05',
      phaseBadgeEn: 'UNILEVEL SPLIT',
      phaseBadgeLo: 'ການແບ່ງປັນຄ່າແນະນຳ',
      titleEn: 'Atomic 3-Level Unilevel Commission Split (900K / 400K / 200K / 100K LAK)',
      titleLo: 'ການແບ່ງປັນລາຍຮັບອັດຕະໂນມັດ 3 ຊັ້ນ (900K ບໍລິສັດ / L1: 400K / L2: 200K / L3: 100K)',
      summaryEn:
        'Every 1,600,000 LAK MUSIC_SINGLE_1600 order splits atomically: 900,000 LAK (56.25%) to DMC Studio Budget, 400,000 LAK (25%) to L1 Direct Sponsor, 200,000 LAK (12.5%) to L2, and 100,000 LAK (6.25%) to L3.',
      summaryLo:
        'ທຸກໆຍອດຊື້ 1,600,000 ກີບ ລະບົບຈະແບ່ງປັນທັນທີ: 900,000 ກີບ (56.25%) ງົບຫ້ອງອັດສຽງ DMC, 400,000 ກີບ (25%) ໃຫ້ຊັ້ນ L1, 200,000 ກີບ (12.5%) ໃຫ້ຊັ້ນ L2 ແລະ 100,000 ກີບ (6.25%) ໃຫ້ຊັ້ນ L3.',
      keyRuleEn: 'Shallow Upline Rule: Any missing L1/L2/L3 level is retained by DMC Corporate Treasury (0 LAK leakage).',
      keyRuleLo: 'ກົດລະບຽບສາຍງານບໍ່ຄົບຊັ້ນ: ຖ້າບໍ່ມີ L2 ຫຼື L3 ເງິນສ່ວນນັ້ນຈະຖືກເກັບເຂົ້າຄັງບໍລິສັດ DMC ທັນທີ.',
      accentColor: '#7c3aed',
    },
    {
      stepCode: 'STEP 06',
      phaseBadgeEn: 'ROUTING & 7-DAY HOLD',
      phaseBadgeLo: 'ການโอนເຂົ້າກະເປົາ & 7 ວັນ',
      titleEn: 'Commission Routing by Member State & 7-Day Return Window Clearance',
      titleLo: 'ການຈັດສັນຄ່າແນະນຳຕາມສະຖານະສະມາຊິກ ແລະ ໄລຍະລໍຖ້າກວດສອບ 7 ວັນ',
      summaryEn:
        'If an upline is FREE_MEMBER, awards route to Pending Held Credit (pendingHeld) -> Cleared Held Credit (eligibleClearedHeld). If ACTIVE_LIFETIME_MEMBER, awards route to Pending Cash -> Available Cash.',
      summaryLo:
        'ຖ້າຜູ້ຮັບເປັນ FREE_MEMBER ເງິນຈະເຂົ້າບັນຊີສະສົມ (Held Credit) ເພື່ອອັບເກຣດ; ຖ້າເປັນ ACTIVE_LIFETIME_MEMBER ເງິນຈະເຂົ້າບັນຊີເງິນສົດ (Available Cash) ຫຼັງຄົບກຳນົດ 7 ວັນ.',
      keyRuleEn: 'Rule: If an order is refunded within 7 days, pending awards reverse automatically.',
      keyRuleLo: 'ກົດລະບຽບ: ໄລຍະຄຸ້ມຄອງ 7 ວັນ ປ້ອງກັນການຍົກເລີກຄຳສັ່ງຊື້ກ່ອນປ່ອຍຖອນເງິນສົດ.',
      accentColor: '#0284c7',
    },
    {
      stepCode: 'STEP 07',
      phaseBadgeEn: '5-BALANCE LEDGER',
      phaseBadgeLo: 'ກະເປົາເງິນ 5 ບັນຊີ',
      titleEn: '5 Segregated Wallet Balances (B-01 to B-05) & Anti-Pyramid Compliance',
      titleLo: 'ລະບົບກະເປົາເງິນແຍກອິດສະຫຼະ 5 ບັນຊີ (B-01 ຫາ B-05) ແລະ ມາດຕະຖານຕ້ານແຊລູກໂສ້',
      summaryEn:
        'Every member ledger tracks: B-01 Pending Cash, B-02 Available Cash (withdrawable), B-03 Pending Held, B-04 Cleared Held (for 1.6M qualification), and B-05 Redeemed Lifetime Audit Total.',
      summaryLo:
        'ກະເປົາເງິນແຍກເປັນ 5 ບັນຊີຊັດເຈນ: B-01 ເງິນສົດລໍຖ້າ, B-02 ເງິນສົດພ້ອມຖອນ, B-03 ເງິນສະສົມລໍຖ້າ, B-04 ເງິນສະສົມພ້ອມອັບເກຣດ ແລະ B-05 ຍອດສະສົມທີ່ໃຊ້ອັບເກຣດແລ້ວ.',
      keyRuleEn: 'Anti-Pyramid Law: Zero headhunting bounties — 100% of commissions come from verified product sales.',
      keyRuleLo: 'ກົດໝາຍ: ບໍ່ມີການຈ່າຍເງິນຄ່າຫົວຈາກການຊວນຄົນລ້າໆ — ທຸກລາຍຮັບມາຈາກການຊື້ສິນຄ້າແທ້ 100%.',
      accentColor: '#be123c',
    },
    {
      stepCode: 'STEP 08',
      phaseBadgeEn: 'STUDIO PIPELINE',
      phaseBadgeLo: 'ຂັ້ນຕອນຫ້ອງອັດສຽງ',
      titleEn: '5-Stage Professional Studio Song Production Pipeline (Vientiane Hub)',
      titleLo: 'ຂະບວນການຜະລິດເພງມາດຕະຖານສາກົນ 5 ຂັ້ນຕອນ (DMC Central Studio ວຽງຈັນ)',
      summaryEn:
        'Stage 1: Song Briefing & Lyrics -> Stage 2: Musical Arrangement -> Stage 3: Vocal Recording -> Stage 4: Mixing & Mastering -> Stage 5: Completed Master WAV/MP3 & Certificate.',
      summaryLo:
        'ຂັ້ນຕອນທີ 1: ວາງແຜນ & ແຕ່ງເນື້ອຮ້ອງ -> 2: ຮຽບຮຽງดົນຕີ -> 3: ອັດສຽງຮ້ອງ -> 4: Mixing & Mastering -> 5: ສົ່ງມອບໄຟລ໌ Master WAV/MP3 & ໃບລິຂະສິດ.',
      keyRuleEn: 'Rule: Members track live percentage progress (0%–100%) and stream audio previews in the app.',
      keyRuleLo: 'ກົດລະບຽບ: ສະມາຊິກສາມາດຕິດຕາມຄວາມຄືບໜ້າການຜະລິດເພງ (0%–100%) ແລະ ຟັງເພງໃນແອັບ.',
      accentColor: '#0f766e',
    },
    {
      stepCode: 'STEP 09',
      phaseBadgeEn: 'STORE & LOGISTICS',
      phaseBadgeLo: 'ຮ້ານຄ້າ & ຂົນສົ່ງ 18 ແຂວງ',
      titleEn: 'Musical Instrument Store & Nationwide 18-Province Lao Express Delivery',
      titleLo: 'ຮ້ານຄ້າເຄື່ອງດົນຕີ ແລະ ບໍລິການຂົນສົ່ງດ່ວນທົ່ວປະເທດ 18 ແຂວງ',
      summaryEn:
        'Purchase acoustic/electric guitars, studio microphones, and audio interfaces with unilevel commission pools, shipped via HAL Logistics, ANS Express, Mixay Express, Captain Express, or Lao Post.',
      summaryLo:
        'ສັ່ງຊື້ກີຕ້າ, ໄມໂຄຣໂຟນ ແລະ ອຸປະກອນອັດສຽງພ້ອມຄ່າແນະນຳ 3 ຊັ້ນ ແລະ ຈັດສົ່ງທົ່ວປະເທດຜ່ານ ຮຸ່ງອາລຸນ (HAL), ອານຸສິດ (ANS), ມີໄຊ, ກັບຕັນ ແລະ ໄປສະນີລາວ.',
      keyRuleEn: 'Rule: Every physical order includes a live tracking number and branch destination.',
      keyRuleLo: 'ກົດລະບຽບ: ທຸກຄຳສັ່ງຊື້ມີເລກພັດສະດຸ (Tracking Number) ກວດສອບສະຖານະການຈັດສົ່ງໄດ້ທັນທີ.',
      accentColor: '#b45309',
    },
    {
      stepCode: 'STEP 10',
      phaseBadgeEn: 'BANKING & ADMIN',
      phaseBadgeLo: 'ທະນາຄານ & ຜູ້ບໍລິຫານ',
      titleEn: 'Lao QR Banking (5 Banks), Maker-Checker Payouts & 7 Official Admin Reports',
      titleLo: 'ລະບົບຊຳລະ LAO QR 5 ທະນາຄານ, ການອະນຸມັດຖອນເງິນ ແລະ ລາຍງານບໍລິຫານ 7 ໝວດ',
      summaryEn:
        'Supports BCEL One, Phongsavanh Bank Laos (PSVB), LDB Trust, JDB YesPay, and VietinBank Lao. Withdrawals use dual Maker-Checker approval, and Admins export 7 Excel (.xls) & PDF reports.',
      summaryLo:
        'ຮອງຮັບ BCEL, ທະນາຄານພົງສະຫວັນ (PSVB), LDB, JDB ແລະ VietinBank. ການຖອນເງິນໃຊ້ລະບົບອະນຸມັດ 2 ຊັ້ນ (Maker-Checker) ພ້ອມລະບົບລາຍງານ Excel ແລະ PDF ຄົບວົງຈອນ.',
      keyRuleEn: 'Rule: Only authenticated Administrators can Edit, Delete, Update products, banks, and QR codes.',
      keyRuleLo: 'ກົດລະບຽບຄວາມປອດໄພ: ສະເພາະຜູ້ບໍລິຫານລະບົບ (Administrator) ເທົ່ານັ້ນທີ່ສາມາດແກ້ໄຂ, ລຶບ ຫຼື ອັບເດດຂໍ້ມູນ ແລະ QR ໄດ້.',
      accentColor: '#1d4ed8',
    },
  ],
};

const PAGE_W = 1240;
const PAGE_H = 1754;
const SANS_FONT = '"Noto Sans Lao", "Inter", system-ui, -apple-system, sans-serif';
const MONO_FONT = '"JetBrains Mono", monospace';

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  ctx.textAlign = 'left';
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText(line.trim() + '...', x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
  return currentY;
}

function getThemeColors(theme: PdfThemeStyle) {
  if (theme === 'LUXURY_DARK') {
    return {
      pageBg: '#090d16',
      cardBg: '#121826',
      cardBorder: '#2a344a',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8',
    };
  }
  return {
    pageBg: '#ffffff',
    cardBg: '#f8fafc',
    cardBorder: '#cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#1e293b',
    textMuted: '#475569',
  };
}

function drawRunningHeaderAndFooter(
  ctx: CanvasRenderingContext2D,
  pageNum: number,
  totalPages: number,
  data: StepByStepSummaryData,
  theme: PdfThemeStyle,
  lang: 'EN' | 'LO'
) {
  const c = getThemeColors(theme);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = c.pageBg;
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // Outer Frame
  ctx.strokeStyle = theme === 'EXECUTIVE_LIGHT' ? '#cbd5e1' : 'rgba(245, 166, 35, 0.35)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, PAGE_W - 64, PAGE_H - 64);

  // Top Header Bar
  const headerGrad = ctx.createLinearGradient(32, 32, PAGE_W - 32, 32);
  headerGrad.addColorStop(0, '#0f172a');
  headerGrad.addColorStop(0.55, '#1e1b4b');
  headerGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(32, 32, PAGE_W - 64, 62);

  ctx.fillStyle = '#f5a623';
  ctx.fillRect(32, 92, PAGE_W - 64, 3);

  // Mini Official Logo
  drawDmcOfficialLogoOnCanvas(ctx, 68, 63, 22);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `800 13px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? '2/ ຄູ່ມືສະຫຼຸບຂັ້ນຕອນ DMC ໄຊລາຊາ (STEP-BY-STEP SUMMARY) • ສະບັບພາສາລາວ'
      : '2/ DMC XAYRAXA STEP-BY-STEP OPERATIONAL SUMMARY • OFFICIAL DOSSIER',
    102,
    60
  );

  ctx.fillStyle = '#cbd5e1';
  ctx.font = `600 11px ${MONO_FONT}`;
  ctx.fillText(data.documentCode, 102, 80);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 12px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? `ໜ້າທີ ${pageNum} / ${totalPages}  •  ສປປ ລາວ (LAO PDR)`
      : `PAGE 0${pageNum} OF 0${totalPages}  •  LAO PDR`,
    PAGE_W - 56,
    68
  );

  // Bottom Footer Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(32, PAGE_H - 76, PAGE_W - 64, 44);
  ctx.fillStyle = '#f5a623';
  ctx.fillRect(32, PAGE_H - 76, PAGE_W - 64, 2);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = `600 11.5px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ບັນເທີງ ຈຳກັດຜູ້ດຽວ • 2/ DMC_Xayraxa_Step_By_Step_Summary.pdf'
      : 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD • 2/ DMC_Xayraxa_Step_By_Step_Summary.pdf',
    56,
    PAGE_H - 49
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `800 12px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? `ໜ້າ ${pageNum} / ${totalPages}` : `PAGE ${pageNum} / ${totalPages}`,
    PAGE_W - 56,
    PAGE_H - 49
  );

  ctx.textAlign = 'left';
  ctx.restore();
}

function drawStepCard(
  ctx: CanvasRenderingContext2D,
  step: StepByStepItem,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PdfThemeStyle,
  lang: 'EN' | 'LO'
) {
  const c = getThemeColors(theme);
  ctx.save();
  ctx.textAlign = 'left';

  drawRoundRect(ctx, x, y, w, h, 18);
  ctx.fillStyle = c.cardBg;
  ctx.fill();
  ctx.strokeStyle = c.cardBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Left Accent Strip
  drawRoundRect(ctx, x, y, 12, h, 6);
  ctx.fillStyle = step.accentColor;
  ctx.fill();

  // Step Badge Box
  drawRoundRect(ctx, x + 28, y + 22, 130, 44, 12);
  ctx.fillStyle = step.accentColor;
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 16px ${MONO_FONT}`;
  ctx.fillText(step.stepCode, x + 93, y + 50);

  // Phase Pill
  drawRoundRect(ctx, x + 28, y + 76, 130, 28, 8);
  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#0f172a' : 'rgba(255,255,255,0.1)';
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.font = `800 10.5px ${SANS_FONT}`;
  ctx.fillText(lang === 'LO' ? step.phaseBadgeLo : step.phaseBadgeEn, x + 93, y + 95, 120);
  ctx.textAlign = 'left';

  // Main Content Area
  const contentX = x + 178;
  const contentW = w - 204;

  ctx.fillStyle = c.textPrimary;
  ctx.font = `900 22px ${SANS_FONT}`;
  ctx.fillText(lang === 'LO' ? step.titleLo : step.titleEn, contentX, y + 44, contentW);

  ctx.fillStyle = c.textSecondary;
  ctx.font = `600 15.5px ${SANS_FONT}`;
  drawWrappedText(
    ctx,
    lang === 'LO' ? step.summaryLo : step.summaryEn,
    contentX,
    y + 78,
    contentW,
    24,
    3
  );

  // Bottom Key Rule Box inside Card
  drawRoundRect(ctx, contentX, y + h - 54, contentW, 38, 10);
  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#eff6ff' : 'rgba(245, 166, 35, 0.12)';
  ctx.fill();
  ctx.strokeStyle = theme === 'EXECUTIVE_LIGHT' ? '#bfdbfe' : 'rgba(245, 166, 35, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#1e3a8a' : '#fde68a';
  ctx.font = `800 13.5px ${SANS_FONT}`;
  ctx.fillText(lang === 'LO' ? step.keyRuleLo : step.keyRuleEn, contentX + 14, y + h - 30, contentW - 28);

  ctx.restore();
}

function renderPage1(
  data: StepByStepSummaryData,
  theme: PdfThemeStyle,
  lang: 'EN' | 'LO'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawRunningHeaderAndFooter(ctx, 1, 3, data, theme, lang);

  // Executive Hero Banner
  const heroX = 64;
  const heroY = 122;
  const heroW = PAGE_W - 128;
  const heroH = 230;

  drawRoundRect(ctx, heroX, heroY, heroW, heroH, 22);
  const heroGrad = ctx.createLinearGradient(heroX, heroY, heroX + heroW, heroY + heroH);
  heroGrad.addColorStop(0, '#0f172a');
  heroGrad.addColorStop(0.55, '#1e1b4b');
  heroGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = heroGrad;
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Official DMC R ໄຊລາຊາ Emblem inside Hero
  drawDmcOfficialLogoOnCanvas(ctx, heroX + 115, heroY + 115, 76);

  const tx = heroX + 220;
  const tw = heroW - 245;

  drawRoundRect(ctx, tx, heroY + 24, 480, 30, 8);
  ctx.fillStyle = '#f5a623';
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 13px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? '2/ ເອກະສານສະຫຼຸບຂັ້ນຕອນການເຮັດວຽກຢ່າງເປັນທາງການ (STEP 01 – STEP 10)'
      : '2/ OFFICIAL STEP-BY-STEP OPERATIONAL SUMMARY (STEP 01 – STEP 10)',
    tx + 14,
    heroY + 44
  );

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 28px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? data.documentTitleLo : data.documentTitleEn,
    tx,
    heroY + 90,
    tw
  );

  ctx.fillStyle = '#fde68a';
  ctx.font = `700 16px ${SANS_FONT}`;
  ctx.fillText(lang === 'LO' ? data.subtitleLo : data.subtitleEn, tx, heroY + 122, tw);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = `500 14.5px ${SANS_FONT}`;
  drawWrappedText(
    ctx,
    lang === 'LO' ? data.introSummaryLo : data.introSummaryEn,
    tx,
    heroY + 154,
    tw,
    22,
    3
  );

  // Section Header: PART I (Steps 01 - 04)
  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#0f172a' : '#fbbf24';
  ctx.font = `900 20px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ພາກທີ I: ຂັ້ນຕອນການສະໝັກສະມາຊິກ, ການອັບເກຣດ 1,600,000 ກີບ ແລະ ສິດຜະລິດເພງ (STEP 01 – 04)'
      : 'PART I: MEMBER REGISTRATION, 1,600,000 LAK QUALIFICATION & SONG ENTITLEMENT (STEPS 01 – 04)',
    64,
    392
  );

  // Render Steps 01 to 04
  const stepsPage1 = data.steps.slice(0, 4);
  const startY = 416;
  const cardH = 285;
  const gap = 24;

  stepsPage1.forEach((st, idx) => {
    drawStepCard(ctx, st, 64, startY + idx * (cardH + gap), PAGE_W - 128, cardH, theme, lang);
  });

  return canvas.toDataURL('image/png');
}

function renderPage2(
  data: StepByStepSummaryData,
  theme: PdfThemeStyle,
  lang: 'EN' | 'LO'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawRunningHeaderAndFooter(ctx, 2, 3, data, theme, lang);

  // Section Header: PART II (Steps 05 - 07)
  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#0f172a' : '#fbbf24';
  ctx.font = `900 20px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ພາກທີ II: ໂຄງສ້າງການແບ່ງປັນຄ່າແນະນຳ Unilevel 3 ຊັ້ນ ແລະ ກະເປົາເງິນ 5 ບັນຊີ (STEP 05 – 07)'
      : 'PART II: 3-LEVEL UNILEVEL COMMISSION ENGINE & 5-BALANCE WALLET LEDGER (STEPS 05 – 07)',
    64,
    144
  );

  // Render Steps 05, 06, 07
  const stepsPage2 = data.steps.slice(4, 7);
  const startY = 168;
  const cardH = 290;
  const gap = 24;

  stepsPage2.forEach((st, idx) => {
    drawStepCard(ctx, st, 64, startY + idx * (cardH + gap), PAGE_W - 128, cardH, theme, lang);
  });

  // Visual Reference Table at Bottom of Page 2: 1,600,000 LAK Split + 5 Wallet Balances Summary
  const boxY = 1120;
  const boxH = 520;
  drawRoundRect(ctx, 64, boxY, PAGE_W - 128, boxH, 20);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 19px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ຕາຕະລາງສະຫຼຸບການແບ່ງປັນ 1,600,000 ກີບ ແລະ ກະເປົາເງິນ 5 ບັນຊີ (FINANCIAL MATRIX)'
      : 'EXECUTIVE FINANCIAL MATRIX: 1,600,000 LAK SPLIT & 5 SEGREGATED BALANCES',
    92,
    boxY + 42
  );

  // 4 Split Pillars
  const splitBoxes = [
    {
      code: 'DMC BUDGET (56.25%)',
      lak: '900,000 LAK',
      desc: lang === 'LO' ? 'ງົບຜະລິດເພງ & ບໍລິຫານລະບົບ' : 'Studio Production & Operations',
      col: '#38bdf8',
    },
    {
      code: 'LEVEL 1 DIRECT (25%)',
      lak: '400,000 LAK',
      desc: lang === 'LO' ? 'ຜູ້ແນະນຳກົງຊັ້ນທີ 1 (L1)' : 'Direct Sponsor Reward (L1)',
      col: '#4ade80',
    },
    {
      code: 'LEVEL 2 SECOND (12.5%)',
      lak: '200,000 LAK',
      desc: lang === 'LO' ? 'ສາຍງານຊັ້ນທີ 2 (L2)' : 'Second Generation Reward (L2)',
      col: '#fbbf24',
    },
    {
      code: 'LEVEL 3 THIRD (6.25%)',
      lak: '100,000 LAK',
      desc: lang === 'LO' ? 'ສາຍງານຊັ້ນທີ 3 (L3)' : 'Third Generation Reward (L3)',
      col: '#f472b6',
    },
  ];

  const sw = (PAGE_W - 184 - 36) / 4;
  splitBoxes.forEach((sb, i) => {
    const sx = 92 + i * (sw + 12);
    drawRoundRect(ctx, sx, boxY + 66, sw, 126, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = sb.col;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `800 12px ${MONO_FONT}`;
    ctx.fillText(sb.code, sx + 16, boxY + 94);

    ctx.fillStyle = sb.col;
    ctx.font = `900 24px ${MONO_FONT}`;
    ctx.fillText(sb.lak, sx + 16, boxY + 132);

    ctx.fillStyle = '#f8fafc';
    ctx.font = `600 13px ${SANS_FONT}`;
    ctx.fillText(sb.desc, sx + 16, boxY + 166, sw - 28);
  });

  // 5 Wallet Balances Strip
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 16px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ໂຄງສ້າງກະເປົາເງິນ 5 ບັນຊີ (5 Segregated Member Ledger Balances):'
      : '5 Segregated Member Wallet Balances (Strict Ledger Accounting):',
    92,
    boxY + 232
  );

  const balances = [
    {
      code: 'B-01: pendingCash',
      desc:
        lang === 'LO'
          ? 'ເງິນສົດລໍຖ້າ 7 ວັນ (ສຳລັບສະມາຊິກຕະຫຼອດຊີບ ACTIVE_LIFETIME_MEMBER)'
          : 'Pending Cash Commission inside 7-day return hold (for Active Lifetime Members)',
    },
    {
      code: 'B-02: availableCash',
      desc:
        lang === 'LO'
          ? 'ເງິນສົດພ້ອມຖອນເຂົ້າທະນາຄານລາວ (BCEL, ພົງສະຫວັນ, LDB, JDB, VietinBank)'
          : 'Cleared Withdrawable Cash ready for Lao Bank payout (BCEL, PSVB, LDB, JDB, VietinBank)',
    },
    {
      code: 'B-03: pendingHeld',
      desc:
        lang === 'LO'
          ? 'ເງິນສະສົມລໍຖ້າ 7 ວັນ (ສຳລັບສະມາຊິກຟຣີ FREE_MEMBER)'
          : 'Pending Held Credit inside 7-day return hold (for Free Members)',
    },
    {
      code: 'B-04: eligibleClearedHeld',
      desc:
        lang === 'LO'
          ? 'ເງິນສະສົມພ້ອມໃຊ້ອັບເກຣດ 1,600,000 ກີບ ອັດຕະໂນມັດ (Auto-Redemption)'
          : 'Cleared Held Credit eligible for 1,600,000 LAK automatic lifetime qualification',
    },
    {
      code: 'B-05: redeemedLifetimeTotal',
      desc:
        lang === 'LO'
          ? 'ຍອດສະສົມທີ່ຖືກໃຊ້ອັບເກຣດຕະຫຼອດຊີບສຳເລັດແລ້ວ (ບັນທຶກກວດສອບຖາວອນ)'
          : 'Permanent audit total of Held Credit redeemed for Lifetime Qualification',
    },
  ];

  balances.forEach((b, idx) => {
    const by = boxY + 252 + idx * 48;
    drawRoundRect(ctx, 92, by, PAGE_W - 184, 40, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();

    ctx.fillStyle = '#fbbf24';
    ctx.font = `900 13.5px ${MONO_FONT}`;
    ctx.fillText(b.code, 110, by + 25);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = `600 14px ${SANS_FONT}`;
    ctx.fillText(b.desc, 360, by + 25, PAGE_W - 470);
  });

  return canvas.toDataURL('image/png');
}

function renderPage3(
  data: StepByStepSummaryData,
  theme: PdfThemeStyle,
  lang: 'EN' | 'LO'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawRunningHeaderAndFooter(ctx, 3, 3, data, theme, lang);

  // Section Header: PART III (Steps 08 - 10)
  ctx.fillStyle = theme === 'EXECUTIVE_LIGHT' ? '#0f172a' : '#fbbf24';
  ctx.font = `900 20px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ພາກທີ III: ຫ້ອງອັດສຽງ 5 ຂັ້ນຕອນ, ຮ້ານຄ້າ & ຂົນສົ່ງ 18 ແຂວງ ແລະ ລະບົບທະນາຄານ (STEP 08 – 10)'
      : 'PART III: 5-STAGE STUDIO PIPELINE, LAO EXPRESS LOGISTICS & BANKING GOVERNANCE (STEPS 08 – 10)',
    64,
    144
  );

  // Render Steps 08, 09, 10
  const stepsPage3 = data.steps.slice(7, 10);
  const startY = 168;
  const cardH = 290;
  const gap = 24;

  stepsPage3.forEach((st, idx) => {
    drawStepCard(ctx, st, 64, startY + idx * (cardH + gap), PAGE_W - 128, cardH, theme, lang);
  });

  // Official Certification & Executive Sign-Off Block at Bottom of Page 3
  const certY = 1130;
  const certH = 510;
  drawRoundRect(ctx, 64, certY, PAGE_W - 128, certH, 22);
  const certGrad = ctx.createLinearGradient(64, certY, PAGE_W - 64, certY + certH);
  certGrad.addColorStop(0, '#0f172a');
  certGrad.addColorStop(0.6, '#1e1b4b');
  certGrad.addColorStop(1, '#45050c');
  ctx.fillStyle = certGrad;
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 20px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ການຢັ້ງຢືນມາດຕະຖານລະບົບ ແລະ ລາຍເຊັນຮັບຮອງຈາກຜູ້ບໍລິຫານສູງສຸດ'
      : 'OFFICIAL SYSTEM GOVERNANCE & EXECUTIVE CERTIFICATION',
    96,
    certY + 48
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.font = `600 15px ${SANS_FONT}`;
  drawWrappedText(
    ctx,
    lang === 'LO'
      ? 'ເອກະສານ 2/ DMC_Xayraxa_Step_By_Step_Summary ສະບັບນີ້ ຢັ້ງຢືນວ່າທຸກຂັ້ນຕອນຕັ້ງແຕ່ STEP 01 ຫາ STEP 10 ຖືກຈັດຕັ້ງປະຕິບັດຢ່າງຖືກຕ້ອງຕາມລະບຽບກົດໝາຍ ສປປ ລາວ, ມາດຕະຖານທະນາຄານ LAO QR ແລະ ລະບົບຄວາມປອດໄພສູງສຸດ.'
      : 'This official 2/ DMC_Xayraxa_Step_By_Step_Summary document certifies that Steps 01 through 10 operate in strict compliance with Lao PDR commercial law, Lao National QR banking standards, and Administrator security protocols.',
    96,
    certY + 84,
    PAGE_W - 192,
    24,
    3
  );

  // 3 Summary Checklist Pillars
  const pillars = [
    {
      title: lang === 'LO' ? '5 ທະນາຄານຊັ້ນນຳ LAO QR' : '5 LAO QR PARTNER BANKS',
      items: ['BCEL OnePay', 'Phongsavanh Bank (PSVB)', 'LDB Trust • JDB • VietinBank'],
    },
    {
      title: lang === 'LO' ? '5 ບໍລິສັດຂົນສົ່ງດ່ວນ 18 ແຂວງ' : '5 EXPRESS CARRIERS (18 PROVINCES)',
      items: ['HAL Logistics (ຮຸ່ງອາລຸນ)', 'Anousith (ANS) • Mixay Express', 'Captain Express • Lao Post'],
    },
    {
      title: lang === 'LO' ? '7 ໄຟລ໌ລາຍງານຜູ້ບໍລິຫານ' : '7 OFFICIAL ADMIN REPORTS',
      items: ['1/ Members • 2/ Passwords', '3/ Products • 4/ Orders • 5/ Songs', '6/ Payment Proved • 7/ Organize Tree'],
    },
  ];

  const pw = (PAGE_W - 192 - 32) / 3;
  pillars.forEach((pl, i) => {
    const px = 96 + i * (pw + 16);
    drawRoundRect(ctx, px, certY + 154, pw, 145, 14);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 166, 35, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = `900 13.5px ${SANS_FONT}`;
    ctx.fillText(pl.title, px + 16, certY + 184);

    pl.items.forEach((it, j) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 13px ${SANS_FONT}`;
      ctx.fillText(`• ${it}`, px + 16, certY + 216 + j * 28, pw - 28);
    });
  });

  // Official Seal + CEO Signature Row
  drawDmcOfficialLogoOnCanvas(ctx, 175, certY + 405, 64);

  ctx.fillStyle = '#fde68a';
  ctx.font = `900 20px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ບັນເທີງ ຈຳກັດຜູ້ດຽວ'
      : 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD',
    265,
    certY + 375
  );

  ctx.fillStyle = '#cbd5e1';
  ctx.font = `700 14px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ວິທະຍາເຂດດົງໂດກ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ'
      : 'Dongdok Campus, Xaythany District, Vientiane Capital, Lao PDR',
    265,
    certY + 404
  );

  ctx.fillStyle = '#fbbf24';
  ctx.font = `700 13px ${MONO_FONT}`;
  ctx.fillText('OFFICIAL CORPORATE SEAL • REVISION 2.6 VERIFIED', 265, certY + 432);

  // Right Signature Box
  const sigX = PAGE_W - 430;
  drawRoundRect(ctx, sigX, certY + 332, 330, 148, 16);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = `italic 900 26px "Georgia", serif`;
  ctx.fillText(data.signatoryName, sigX + 165, certY + 382);

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.moveTo(sigX + 35, certY + 398);
  ctx.lineTo(sigX + 295, certY + 398);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 15px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? data.signatoryNameLo : data.signatoryName,
    sigX + 165,
    certY + 424
  );

  ctx.fillStyle = '#fbbf24';
  ctx.font = `700 12.5px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? data.signatoryTitleLo : data.signatoryTitleEn,
    sigX + 165,
    certY + 448,
    300
  );
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

export function renderStepByStepPagesAsDataUrls(
  data: StepByStepSummaryData,
  theme: PdfThemeStyle = 'EXECUTIVE_LIGHT',
  languageVersion: PdfLanguageVersion = 'LO'
): string[] {
  if (languageVersion === 'BOTH') {
    return [
      renderPage1(data, theme, 'LO'),
      renderPage2(data, theme, 'LO'),
      renderPage3(data, theme, 'LO'),
      renderPage1(data, theme, 'EN'),
      renderPage2(data, theme, 'EN'),
      renderPage3(data, theme, 'EN'),
    ];
  }
  const lang = languageVersion === 'LO' ? 'LO' : 'EN';
  return [
    renderPage1(data, theme, lang),
    renderPage2(data, theme, lang),
    renderPage3(data, theme, lang),
  ];
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function pngToJpegBytes(pngDataUrl: string): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = PAGE_W;
      c.height = PAGE_H;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, PAGE_W, PAGE_H);
        ctx.drawImage(img, 0, 0);
      }
      resolve(dataUrlToUint8Array(c.toDataURL('image/jpeg', 0.94)));
    };
    img.src = pngDataUrl;
  });
}

export async function downloadStepByStepSummaryPdf(
  data: StepByStepSummaryData = DEFAULT_STEP_BY_STEP_SUMMARY_DATA,
  filename = '2_DMC_Xayraxa_Step_By_Step_Summary.pdf',
  languageVersion: PdfLanguageVersion = 'EN',
  theme: PdfThemeStyle = 'EXECUTIVE_LIGHT'
): Promise<void> {
  const pagePngs = renderStepByStepPagesAsDataUrls(data, theme, languageVersion);
  const pageJpegs = await Promise.all(pagePngs.map((p) => pngToJpegBytes(p)));

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;

  const pushStr = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    byteLength += bytes.length;
  };

  const startObj = (id: number) => {
    offsets[id] = byteLength;
    pushStr(`${id} 0 obj\n`);
  };

  const endObj = () => {
    pushStr(`\nendobj\n`);
  };

  const pdfPageWidth = 595.28;
  const pdfPageHeight = 841.89;

  pushStr(`%PDF-1.4\n%\xFF\xFF\xFF\xFF\n`);

  startObj(1);
  pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
  endObj();

  const numPages = pageJpegs.length;
  const pageObjIds: number[] = [];
  for (let i = 0; i < numPages; i++) {
    pageObjIds.push(3 + i * 3);
  }

  startObj(2);
  pushStr(
    `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${numPages} >>`
  );
  endObj();

  for (let i = 0; i < numPages; i++) {
    const pageObjId = 3 + i * 3;
    const contentObjId = 4 + i * 3;
    const imageObjId = 5 + i * 3;
    const jpegBytes = pageJpegs[i];

    startObj(pageObjId);
    pushStr(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfPageWidth} ${pdfPageHeight}] /Resources << /XObject << /Im${i} ${imageObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
    );
    endObj();

    const contentStream = `q\n${pdfPageWidth} 0 0 ${pdfPageHeight} 0 0 cm\n/Im${i} Do\nQ\n`;
    const contentBytes = encoder.encode(contentStream);
    startObj(contentObjId);
    pushStr(`<< /Length ${contentBytes.length} >>\nstream\n`);
    pushBytes(contentBytes);
    pushStr(`\nendstream`);
    endObj();

    startObj(imageObjId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width ${PAGE_W} /Height ${PAGE_H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    );
    pushBytes(jpegBytes);
    pushStr(`\nendstream`);
    endObj();
  }

  const totalObjects = 2 + numPages * 3;
  const xrefOffset = byteLength;
  pushStr(`xref\n0 ${totalObjects + 1}\n`);
  pushStr(`0000000000 65535 f \n`);
  for (let id = 1; id <= totalObjects; id++) {
    const padded = String(offsets[id] || 0).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  pushStr(
    `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  );

  const blob = new Blob(chunks, { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
