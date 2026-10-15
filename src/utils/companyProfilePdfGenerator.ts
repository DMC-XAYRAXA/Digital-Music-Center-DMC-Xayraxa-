/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * 1/ COMPANY PROFILE - DIGITAL MUSIC CENTER (DMC) OFFICIAL MULTI-PAGE PDF GENERATOR
 * Supports BOTH:
 * - Lao Language Version (`LO` - ສະບັບພາສາລາວ: `1_DMC_Company_Profile_Lao_Version.pdf`)
 * - English Language Version (`EN` - English Version: `1_DMC_Company_Profile_English_Version.pdf`)
 * Generates a real, standards-compliant A4 Multi-Page PDF (.pdf) binary document
 * with 4 executive pages + high-resolution canvas previews.
 */

import { drawDmcOfficialLogoOnCanvas } from '../components/common/DmcLogo';

export type PdfThemeStyle = 'EXECUTIVE_LIGHT' | 'LUXURY_DARK';
export type PdfLanguageVersion = 'LO' | 'EN';

export interface CompanyProfileData {
  documentNumber: string;
  companyNameEn: string;
  companyNameLao: string;
  brandShortName: string;
  brandShortNameLao: string;
  tagline: string;
  taglineLao: string;
  enterpriseRegNo: string;
  taxIdLao: string;
  foundedYear: string;
  ceoFounderName: string;
  ceoTitle: string;
  ceoTitleLao: string;
  headquartersAddress: string;
  headquartersAddressLao: string;
  studioCampus: string;
  studioCampusLao: string;
  hotlinePhone: string;
  whatsappOfficial: string;
  officialEmail: string;
  websiteUrl: string;
  executiveSummary: string;
  executiveSummaryLao: string;
  visionStatement: string;
  visionStatementLao: string;
  missionStatement: string;
  missionStatementLao: string;
  corePackageTitle: string;
  corePackageTitleLao: string;
  corePackagePriceLak: number;
  studioBudgetLak: number;
  l1SponsorLak: number;
  l2SponsorLak: number;
  l3SponsorLak: number;
  pdfTheme?: PdfThemeStyle;
  pdfLanguage?: PdfLanguageVersion;
  customCoverPhotoUrl?: string;
  customLogoUrl?: string;
  updatedAt: string;
}

export const DEFAULT_COMPANY_PROFILE_DATA: CompanyProfileData = {
  documentNumber: 'DMC-CP-2026-REV2.6',
  companyNameEn: 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD',
  companyNameLao: 'ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ເອັນເຕີເທນເມັ້ນ ຈຳກັດຜູ້ດຽວ (ສູນດົນຕີດິຈິຕອນ)',
  brandShortName: 'DIGITAL MUSIC CENTER (DMC)',
  brandShortNameLao: 'ສູນດົນຕີດິຈິຕອນ (DIGITAL MUSIC CENTER - DMC)',
  tagline:
    'Official Lao PDR Digital Music Production, Acoustic Instrument Commerce & 3-Tier Unilevel Ecosystem',
  taglineLao:
    'ສູນຜະລິດເພງລະບົບດິຈິຕອນ, ຈຳໜ່າຍເຄື່ອງດົນຕີຄຸນນະພາບສູງ ແລະ ລະບົບສະມາຊິກ 3 ຊັ້ນ ແຫ່ງ ສປປ ລາວ',
  enterpriseRegNo: 'ENT-VTE-01-2026-008942',
  taxIdLao: 'TAX-LA-856-00404992-01',
  foundedYear: '2026 (Rev 2.6 Architecture)',
  ceoFounderName: 'XAY RAXA (ໄຊ ຣາຊາ)',
  ceoTitle: 'Founder, Chief Executive Officer & Executive Music Producer',
  ceoTitleLao: 'ຜູ້ກໍ່ຕັ້ງ, ປະທານບໍລິຫານສູງສຸດ (CEO) ແລະ ໂປຣດິວເຊີຜະລິດເພງ',
  headquartersAddress: 'Dongdok Campus, Xaythany District, Vientiane Capital, Lao PDR',
  headquartersAddressLao: 'ວິທະຍາເຂດດົງໂດກ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
  studioCampus: 'DMC Central Recording & Mastering Studios — Dongdok Campus, Vientiane',
  studioCampusLao: 'ຫ້ອງອັດສຽງ ແລະ ມາສເຕີຣິງກາງ DMC — ວິທະຍາເຂດດົງໂດກ, ນະຄອນຫຼວງວຽງຈັນ',
  hotlinePhone: '+856 20 5511 2233',
  whatsappOfficial: '+856 20 5511 2233',
  officialEmail: 'xay.raxa@gmail.com',
  websiteUrl: 'https://dmc-xayraxa.la',
  executiveSummary:
    'Digital Music Center (DMC Xayraxa Entertainment Sole Co., Ltd) is Lao PDR’s premier integrated music production house, custom song studio, and musical instrument e-commerce platform. Combining world-class vocal arrangement, mixing, and mastering with a transparent 3-Level Unilevel royalty and commission ledger in Integer LAK (₭), DMC empowers Lao artists, creators, and entrepreneurs nationwide.',
  executiveSummaryLao:
    'ສູນດົນຕີດິຈິຕອນ (ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ເອັນເຕີເທນເມັ້ນ ຈຳກັດຜູ້ດຽວ) ແມ່ນສູນກາງການຜະລິດເພງຄົບວົງຈອນ, ຫ້ອງອັດສຽງມາດຕະຖານສາກົນ ແລະ ແພລັດຟອມຈຳໜ່າຍເຄື່ອງດົນຕີຊັ້ນນຳໃນ ສປປ ລາວ. ໂດຍປະສົມປະສານການແຕ່ງເພງ, ຮຽບຮຽງດົນຕີ, ມິກສຽງ ແລະ ມາສເຕີຣິງ ຄູ່ກັບລະບົບບັນຊີຄອມມິດຊັ່ນ 3 ຊັ້ນ (3-Level Unilevel) ທີ່ໂປ່ງໃສເປັນສະກຸນເງິນກີບ (LAK ₭) ເພື່ອສົ່ງເສີມສິລະປິນ ແລະ ຜູ້ປະກອບການລາວທົ່ວປະເທດ.',
  visionStatement:
    'To elevate Lao music production and creative entrepreneurship to international standards through an auditable, bank-integrated digital ecosystem across all 18 provinces of Lao PDR.',
  visionStatementLao:
    'ຍົກລະດັບອຸດສາຫະກຳການຜະລິດເພງລາວ ແລະ ຜູ້ປະກອບການສ້າງສັນກ້າວສູ່ມາດຕະຖານສາກົນ ຜ່ານລະບົບນິເວດດິຈິຕອນທີ່ໂປ່ງໃສ, ກວດສອບໄດ້ ແລະ ເຊື່ອມຕໍ່ທະນາຄານຊັ້ນນຳຄົບທັງ 18 ແຂວງທົ່ວ ສປປ ລາວ.',
  missionStatement:
    '1. Produce broadcast-quality original songs with verified Master & Publishing copyright certificates.\n2. Deliver authentic acoustic, electric, and traditional Lao instruments via national express logistics.\n3. Empower members with an immutable 5-balance LAK financial ledger and instant 3-tier unilevel rewards.',
  missionStatementLao:
    '1. ຜະລິດຜົນງານເພງຕົ້ນສະບັບຄຸນນະພາບລະດັບສາກົນ ພ້ອມອອກໃບຢັ້ງຢືນລິຂະສິດ Master & Publishing ຖືກຕ້ອງ 100%.\n2. ຈຳໜ່າຍເຄື່ອງດົນຕີອະຄູສຕິກ, ໄຟຟ້າ ແລະ ເຄື່ອງດົນຕີພື້ນເມືອງລາວແທ້ ພ້ອມຈັດສົ່ງດ່ວນທົ່ວປະເທດ.\n3. ສ້າງລາຍຮັບທີ່ໝັ້ນຄົງໃຫ້ສະມາຊິກດ້ວຍລະບົບບັນຊີ 5 ກະເປົາເປັນເງິນກີບ (LAK) ແລະ ຄອມມິດຊັ່ນແນະນຳ 3 ຊັ້ນ.',
  corePackageTitle:
    'MUSIC_SINGLE_1600 — Custom Studio Single Production & Lifetime Membership Activation',
  corePackageTitleLao:
    'MUSIC_SINGLE_1600 — ແພັກເກັດສັ່ງຜະລິດເພງໃໝ່ 1 ບົດເພງ ແລະ ເປີດບັນຊີສະມາຊິກຕະຫຼອດຊີບ',
  corePackagePriceLak: 1600000,
  studioBudgetLak: 900000,
  l1SponsorLak: 400000,
  l2SponsorLak: 200000,
  l3SponsorLak: 100000,
  pdfTheme: 'EXECUTIVE_LIGHT',
  pdfLanguage: 'LO',
  updatedAt: new Date().toISOString().slice(0, 10),
};

export interface CompanyProfileRuntimeStats {
  totalMembers: number;
  activeLifetimeMembers: number;
  totalProducts: number;
  totalOrders: number;
  totalSongs: number;
  totalBanks: number;
  supportedBanksList: string[];
  shippingCarriersList: string[];
}

const FONT_STACK = '"Noto Sans Lao", "Phetsarath OT", "Segoe UI", sans-serif';

/**
 * Safely wraps and draws left-aligned multi-line text inside [x, x + maxWidth].
 * Always forces ctx.textAlign = 'left' so text is never clipped on the left margin.
 */
function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const paragraphs = (text || '').split('\n');
  let curY = y;
  for (const para of paragraphs) {
    const words = para.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, curY);
      curY += lineHeight;
    }
  }
  ctx.restore();
  return curY;
}

/**
 * Truncates single-line text with ellipsis if it exceeds maxWidth
 */
function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  align: CanvasTextAlign = 'left'
) {
  ctx.save();
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  let output = text || '';
  if (ctx.measureText(output).width > maxWidth) {
    while (output.length > 3 && ctx.measureText(output + '…').width > maxWidth) {
      output = output.slice(0, -1);
    }
    output += '…';
  }
  ctx.fillText(output, x, y);
  ctx.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillStyle?: string | CanvasGradient,
  strokeStyle?: string | CanvasGradient,
  lineWidth = 1.5
) {
  ctx.save();
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
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawDmcSealEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  drawDmcOfficialLogoOnCanvas(ctx, cx, cy, radius, {
    withGoldFrame: true,
    shape: 'circle',
  });
}

function drawSectionHeading(
  ctx: CanvasRenderingContext2D,
  numStr: string,
  title: string,
  subtitle: string,
  x: number,
  y: number,
  w: number,
  isLight: boolean
) {
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Badge Pill for section number
  const badgeGrad = ctx.createLinearGradient(x, y, x + 56, y + 36);
  badgeGrad.addColorStop(0, '#df1c2d');
  badgeGrad.addColorStop(1, '#991b1b');
  drawRoundedRect(ctx, x, y, 56, 36, 8, badgeGrad, '#f59e0b', 1.5);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 17px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(numStr, x + 28, y + 24);

  // Title & Subtitle
  ctx.textAlign = 'left';
  ctx.fillStyle = isLight ? '#0f172a' : '#fbbf24';
  ctx.font = `900 21px ${FONT_STACK}`;
  drawFittedText(ctx, title, x + 70, y + 24, w - 75, 'left');

  if (subtitle) {
    ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
    ctx.font = `600 13px ${FONT_STACK}`;
    drawFittedText(ctx, subtitle, x + 70, y + 44, w - 75, 'left');
  }

  // Subtle horizontal rule
  ctx.strokeStyle = isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 54);
  ctx.lineTo(x + w, y + 54);
  ctx.stroke();

  ctx.restore();
}

function drawPageChrome(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  pageNumber: number,
  totalPages: number,
  profile: CompanyProfileData,
  isLight: boolean,
  isLao: boolean
) {
  ctx.save();

  // 1. Page Background
  if (isLight) {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.5, '#f8fafc');
    bgGrad.addColorStop(1, '#f1f5f9');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Outer Executive Frame
  const goldGrad = ctx.createLinearGradient(0, 0, W, H);
  goldGrad.addColorStop(0, '#d97706');
  goldGrad.addColorStop(0.5, '#f59e0b');
  goldGrad.addColorStop(1, '#b45309');

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 4;
  ctx.strokeRect(32, 32, W - 64, H - 64);

  ctx.strokeStyle = isLight ? '#e2e8f0' : 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  // 3. Top Executive Header Banner
  const headerGrad = ctx.createLinearGradient(44, 44, W - 44, 134);
  headerGrad.addColorStop(0, '#0f172a');
  headerGrad.addColorStop(0.6, '#1e1b4b');
  headerGrad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(44, 44, W - 88, 88);

  // Gold bottom trim on header
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(44, 130, W - 88, 4);

  // Left Header Mini Logo + Text
  drawDmcOfficialLogoOnCanvas(ctx, 90, 88, 25, { withGoldFrame: true, shape: 'circle' });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 18px ${FONT_STACK}`;
  ctx.fillText(
    isLao
      ? '1/ ໂປຣໄຟລ໌ບໍລິສັດ — ສູນດົນຕີດິຈິຕອນ (DIGITAL MUSIC CENTER - DMC)'
      : '1/ COMPANY PROFILE — DIGITAL MUSIC CENTER (DMC)',
    130,
    82
  );

  ctx.fillStyle = '#e2e8f0';
  ctx.font = `600 13px ${FONT_STACK}`;
  ctx.fillText(
    isLao
      ? `ເລກທີເອກະສານ: ${profile.documentNumber}   •   ທະບຽນວິສາຫະກິດ: ${profile.enterpriseRegNo}   •   ເລກອາກອນ: ${profile.taxIdLao}`
      : `DOC REF: ${profile.documentNumber}   •   ENTERPRISE REG: ${profile.enterpriseRegNo}   •   TAX ID: ${profile.taxIdLao}`,
    130,
    108
  );

  // Right Header Page Badge
  drawRoundedRect(
    ctx,
    W - 310,
    64,
    240,
    46,
    10,
    'rgba(245, 158, 11, 0.18)',
    '#fbbf24',
    1.5
  );
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fef08a';
  ctx.font = `900 14px ${FONT_STACK}`;
  ctx.fillText(
    isLao
      ? `ເອກະສານທາງການ • ໜ້າທີ ${pageNumber} / ${totalPages}`
      : `OFFICIAL DOSSIER • PAGE ${pageNumber} / ${totalPages}`,
    W - 190,
    92
  );

  // 4. Bottom Footer Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(44, H - 96, W - 88, 52);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(44, H - 98, W - 88, 3);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = `600 13px ${FONT_STACK}`;
  drawFittedText(
    ctx,
    isLao
      ? `${profile.companyNameLao}  •  ${profile.headquartersAddressLao || profile.headquartersAddress}`
      : `${profile.companyNameEn}  •  ${profile.headquartersAddress}`,
    72,
    H - 65,
    W - 460,
    'left'
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `bold 13px ${FONT_STACK}`;
  ctx.fillText(
    isLao
      ? `ສາຍດ່ວນ/WhatsApp: ${profile.hotlinePhone}  •  ໜ້າທີ ${pageNumber} ຈາກ ${totalPages}`
      : `Hotline/WhatsApp: ${profile.hotlinePhone}  •  Page ${pageNumber} of ${totalPages}`,
    W - 72,
    H - 65
  );

  // Reset alignment so page body always starts with left alignment!
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();
}

/**
 * Renders a specific page (1..4) of the Company Profile PDF onto an A4 canvas (1240 x 1754)
 */
export function renderCompanyProfilePageToCanvas(
  pageNumber: 1 | 2 | 3 | 4,
  profile: CompanyProfileData,
  stats: CompanyProfileRuntimeStats,
  langOverride?: PdfLanguageVersion
): HTMLCanvasElement {
  const W = 1240;
  const H = 1754;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const isLight = (profile.pdfTheme || 'EXECUTIVE_LIGHT') === 'EXECUTIVE_LIGHT';
  const lang: PdfLanguageVersion = langOverride || profile.pdfLanguage || 'LO';
  const isLao = lang === 'LO';

  drawPageChrome(ctx, W, H, pageNumber, 4, profile, isLight, isLao);

  // Always enforce default left alignment
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  const X = 72;
  const CONTENT_W = W - 144; // 1096px

  if (pageNumber === 1) {
    // ================= PAGE 1: EXECUTIVE COVER & CORPORATE IDENTITY =================
    const heroY = 156;
    const heroH = 345;
    const heroGrad = ctx.createLinearGradient(X, heroY, X + CONTENT_W, heroY + heroH);
    heroGrad.addColorStop(0, '#0f172a');
    heroGrad.addColorStop(0.55, '#1e1b4b');
    heroGrad.addColorStop(1, '#7f1d1d');
    drawRoundedRect(ctx, X, heroY, CONTENT_W, heroH, 18, heroGrad, '#f59e0b', 2.5);

    // Official DMC R ໄຊລາຊາ Logo Seal on Left
    drawDmcSealEmblem(ctx, X + 135, heroY + heroH / 2, 96);

    // Hero Texts on Right
    const hx = X + 265;
    const hw = CONTENT_W - 295;
    ctx.textAlign = 'left';

    // Top Gold Ribbon Pill
    drawRoundedRect(ctx, hx, heroY + 26, 470, 30, 6, 'rgba(245, 158, 11, 0.2)', '#fbbf24', 1);
    ctx.fillStyle = '#fde68a';
    ctx.font = `bold 13px ${FONT_STACK}`;
    ctx.fillText(
      isLao
        ? 'ໂປຣໄຟລ໌ວິສາຫະກິດທາງການ ແຫ່ງ ສປປ ລາວ • ລຸ້ນ 2.6 (ສະບັບພາສາລາວ)'
        : 'LAO PDR OFFICIAL ENTERPRISE PROFILE • REV 2.6 (ENGLISH VERSION)',
      hx + 14,
      heroY + 46
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isLao ? '31px' : '35px'} ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao
        ? profile.brandShortNameLao || 'ສູນດົນຕີດິຈິຕອນ (DIGITAL MUSIC CENTER)'
        : profile.brandShortName || 'DIGITAL MUSIC CENTER (DMC)',
      hx,
      heroY + 95,
      hw
    );

    ctx.fillStyle = '#fbbf24';
    ctx.font = `800 21px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao ? profile.companyNameLao : profile.companyNameEn,
      hx,
      heroY + 132,
      hw
    );

    ctx.fillStyle = '#f1f5f9';
    ctx.font = `600 18px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao ? profile.companyNameEn : profile.companyNameLao,
      hx,
      heroY + 166,
      hw
    );

    ctx.fillStyle = '#cbd5e1';
    ctx.font = `500 15px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao ? profile.taglineLao || profile.tagline : profile.tagline,
      hx,
      heroY + 202,
      hw,
      23
    );

    // 3 Statutory Badges inside Hero
    const badges = isLao
      ? [
          { label: 'ເລກທະບຽນວິສາຫະກິດ', val: profile.enterpriseRegNo },
          { label: 'ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ', val: profile.taxIdLao },
          { label: 'ສະກຸນເງິນທາງການ', val: 'ກີບລາວ (LAK ₭)' },
        ]
      : [
          { label: 'ENTERPRISE REG NO.', val: profile.enterpriseRegNo },
          { label: 'LAO PDR TAX ID', val: profile.taxIdLao },
          { label: 'OFFICIAL CURRENCY', val: 'INTEGER LAK (₭)' },
        ];
    const bw = Math.floor((hw - 24) / 3);
    badges.forEach((b, i) => {
      const bx = hx + i * (bw + 12);
      const by = heroY + 262;
      drawRoundedRect(ctx, bx, by, bw, 58, 10, 'rgba(15, 23, 42, 0.78)', '#f59e0b', 1.2);
      ctx.fillStyle = '#94a3b8';
      ctx.font = `bold 11px ${FONT_STACK}`;
      ctx.textAlign = 'left';
      ctx.fillText(b.label, bx + 14, by + 22);
      ctx.fillStyle = '#fde68a';
      ctx.font = `bold 14px ${FONT_STACK}`;
      drawFittedText(ctx, b.val, bx + 14, by + 44, bw - 24, 'left');
    });

    // Section 01: Executive Summary
    let curY = 528;
    drawSectionHeading(
      ctx,
      '01',
      isLao
        ? 'ບົດສະຫຼຸບຜູ້ບໍລິຫານ ແລະ ພາບລວມບໍລິສັດ (EXECUTIVE SUMMARY)'
        : 'EXECUTIVE SUMMARY & CORPORATE OVERVIEW',
      isLao
        ? 'ພາລະກິດການຜະລິດເພງມາດຕະຖານສາກົນ, ການຈຳໜ່າຍເຄື່ອງດົນຕີ ແລະ ລະບົບຄອມມິດຊັ່ນ 3 ຊັ້ນ'
        : 'Official Corporate Mandate, Studio Production & Unilevel E-Commerce Architecture',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      152,
      14,
      isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.85)',
      isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.4)',
      1.5
    );
    drawRoundedRect(ctx, X, curY, 10, 152, 5, '#df1c2d');

    ctx.fillStyle = isLight ? '#1e293b' : '#f1f5f9';
    ctx.font = `500 17px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao ? profile.executiveSummaryLao || profile.executiveSummary : profile.executiveSummary,
      X + 32,
      curY + 38,
      CONTENT_W - 60,
      29
    );

    // Section 02: Official Corporate Registration & Statutory Details Table
    curY += 178;
    drawSectionHeading(
      ctx,
      '02',
      isLao
        ? 'ຂໍ້ມູນການຈົດທະບຽນວິສາຫະກິດ ແລະ ລາຍລະອຽດທາງກົດໝາຍ'
        : 'OFFICIAL CORPORATE REGISTRATION & STATUTORY DETAILS',
      isLao
        ? 'ຂໍ້ມູນທະບຽນວິສາຫະກິດ, ເລກອາກອນ, ສຳນັກງານໃຫຍ່, ຫ້ອງອັດສຽງ ແລະ ຄະນະຜູ້ບໍລິຫານ'
        : 'Verified Legal Entity Credentials, Headquarters, Studio Campus & Executive Leadership',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    const rows: [string, string][] = isLao
      ? [
          ['ຊື່ບໍລິສັດທາງການ (ພາສາລາວ)', profile.companyNameLao],
          ['ຊື່ບໍລິສັດທາງການ (ພາສາອັງກິດ)', profile.companyNameEn],
          ['ຊື່ເຄື່ອງໝາຍການຄ້າ (Brand)', profile.brandShortNameLao || profile.brandShortName],
          ['ເລກທະບຽນວິສາຫະກິດ', profile.enterpriseRegNo],
          ['ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ (ສປປ ລາວ)', profile.taxIdLao],
          [
            'ຜູ້ກໍ່ຕັ້ງ ແລະ ປະທານບໍລິຫານ (CEO)',
            `${profile.ceoFounderName} — ${profile.ceoTitleLao || profile.ceoTitle}`,
          ],
          ['ສຳນັກງານໃຫຍ່ (Headquarters)', profile.headquartersAddressLao || profile.headquartersAddress],
          ['ຫ້ອງອັດສຽງ ແລະ ມາສເຕີຣິງ', profile.studioCampusLao || profile.studioCampus],
          [
            'ເບີໂທສາຍດ່ວນ ແລະ WhatsApp',
            `${profile.hotlinePhone}  •  WhatsApp: ${profile.whatsappOfficial}`,
          ],
          ['ອີເມວ ແລະ ເວັບໄຊທາງການ', `${profile.officialEmail}  •  ${profile.websiteUrl}`],
        ]
      : [
          ['Legal Entity Name (English)', profile.companyNameEn],
          ['Legal Entity Name (Lao PDR)', profile.companyNameLao],
          ['Operating Brand Identity', profile.brandShortName],
          ['Enterprise Registration No.', profile.enterpriseRegNo],
          ['Lao PDR Tax Identification', profile.taxIdLao],
          ['Founder & Chief Executive', `${profile.ceoFounderName} — ${profile.ceoTitle}`],
          ['Corporate Headquarters', profile.headquartersAddress],
          ['Recording & Mastering Campus', profile.studioCampus],
          [
            'Official Hotline & WhatsApp',
            `${profile.hotlinePhone}  •  WhatsApp: ${profile.whatsappOfficial}`,
          ],
          ['Official Email & Portal', `${profile.officialEmail}  •  ${profile.websiteUrl}`],
        ];

    const rowH = 50;
    rows.forEach(([label, val], idx) => {
      const ry = curY + idx * rowH;
      const bg = isLight
        ? idx % 2 === 0
          ? '#f8fafc'
          : '#ffffff'
        : idx % 2 === 0
        ? 'rgba(15, 23, 42, 0.9)'
        : 'rgba(30, 41, 59, 0.7)';
      ctx.fillStyle = bg;
      ctx.fillRect(X, ry, CONTENT_W, rowH);
      ctx.strokeStyle = isLight ? '#cbd5e1' : 'rgba(71, 85, 105, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(X, ry, CONTENT_W, rowH);

      // Left Label Column Shading
      ctx.fillStyle = isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(X, ry, 340, rowH);
      ctx.strokeRect(X, ry, 340, rowH);

      ctx.fillStyle = isLight ? '#0f172a' : '#fbbf24';
      ctx.font = `bold 15px ${FONT_STACK}`;
      drawFittedText(ctx, label, X + 18, ry + 31, 310, 'left');

      ctx.fillStyle = isLight ? '#1e293b' : '#ffffff';
      ctx.font = `600 15px ${FONT_STACK}`;
      drawFittedText(ctx, val, X + 358, ry + 31, CONTENT_W - 374, 'left');
    });

    // Bottom 4 Executive KPI Cards
    const kpiY = 1475;
    const kpis = isLao
      ? [
          {
            label: 'ສະມາຊິກໃນລະບົບທັງໝົດ',
            val: `${stats.totalMembers} ບັນຊີ`,
            sub: `ສະມາຊິກຕະຫຼອດຊີບ ${stats.activeLifetimeMembers} ທ່ານ`,
            accent: '#df1c2d',
          },
          {
            label: 'ແພັກເກັດເປີດບັນຊີຫຼັກ',
            val: `${profile.corePackagePriceLak.toLocaleString()} LAK`,
            sub: 'ຜະລິດ 1 ເພງ + ບັດສະມາຊິກຕະຫຼອດຊີບ',
            accent: '#d97706',
          },
          {
            label: 'ລາຍການສິນຄ້າ & ແພັກເກັດ',
            val: `${stats.totalProducts} ລາຍການ (SKUs)`,
            sub: 'ເຄື່ອງດົນຕີ ແລະ ແພັກເກັດເພງ',
            accent: '#2563eb',
          },
          {
            label: 'ທະນາຄານຄູ່ຮ່ວມງານໃນລາວ',
            val: `${stats.totalBanks} ທະນາຄານຊັ້ນນຳ`,
            sub: 'BCEL • LDB • JDB • VIETIN • PSVB',
            accent: '#059669',
          },
        ]
      : [
          {
            label: 'REGISTERED MEMBERS',
            val: `${stats.totalMembers} Members`,
            sub: `${stats.activeLifetimeMembers} Active Lifetime`,
            accent: '#df1c2d',
          },
          {
            label: 'CORE ACTIVATION',
            val: `${profile.corePackagePriceLak.toLocaleString()} LAK`,
            sub: '1 Studio Song + Lifetime ID',
            accent: '#d97706',
          },
          {
            label: 'OFFICIAL CATALOG',
            val: `${stats.totalProducts} Active SKUs`,
            sub: 'Instruments & Packages',
            accent: '#2563eb',
          },
          {
            label: 'LAO BANK PARTNERS',
            val: `${stats.totalBanks} Major Banks`,
            sub: 'BCEL • LDB • JDB • VIETIN • PSVB',
            accent: '#059669',
          },
        ];
    const cardW = Math.floor((CONTENT_W - 36) / 4);
    kpis.forEach((k, i) => {
      const kx = X + i * (cardW + 12);
      drawRoundedRect(
        ctx,
        kx,
        kpiY,
        cardW,
        142,
        14,
        isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.9)',
        k.accent,
        2
      );
      drawRoundedRect(ctx, kx, kpiY, cardW, 10, 4, k.accent);

      ctx.fillStyle = isLight ? '#64748b' : '#94a3b8';
      ctx.font = `bold 12px ${FONT_STACK}`;
      drawFittedText(ctx, k.label, kx + 18, kpiY + 38, cardW - 32, 'left');

      ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
      ctx.font = `900 22px ${FONT_STACK}`;
      drawFittedText(ctx, k.val, kx + 18, kpiY + 78, cardW - 32, 'left');

      ctx.fillStyle = k.accent;
      ctx.font = `bold 13px ${FONT_STACK}`;
      drawFittedText(ctx, k.sub, kx + 18, kpiY + 114, cardW - 32, 'left');
    });
  } else if (pageNumber === 2) {
    // ================= PAGE 2: VISION, MISSION & DIGITAL MUSIC STUDIO ECOSYSTEM =================
    let curY = 158;

    drawSectionHeading(
      ctx,
      '03',
      isLao
        ? 'ວິໄສທັດ ແລະ ພັນທະກິດຍຸດທະສາດຂອງບໍລິສັດ (VISION & MISSION)'
        : 'CORPORATE VISION & STRATEGIC MISSION PILLARS',
      isLao
        ? 'ທິດທາງການພັດທະນາອຸດສາຫະກຳດົນຕີລາວ ແລະ ຄຳໝັ້ນສັນຍາການບໍລິການທົ່ວທັງ 18 ແຂວງ'
        : 'Long-Term National Creative Direction & Core Operational Commitments Across Lao PDR',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    // Vision Card
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      142,
      14,
      isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.12)',
      '#f59e0b',
      2
    );
    drawRoundedRect(ctx, X, curY, 10, 142, 4, '#f59e0b');

    drawRoundedRect(ctx, X + 28, curY + 18, 305, 28, 6, '#f59e0b');
    ctx.fillStyle = '#0f172a';
    ctx.font = `900 13px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao ? '★ ວິໄສທັດຂອງບໍລິສັດ (CORPORATE VISION)' : '★ CORPORATE VISION STATEMENT',
      X + 40,
      curY + 37,
      285,
      'left'
    );

    ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
    ctx.font = `600 18px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao ? profile.visionStatementLao || profile.visionStatement : profile.visionStatement,
      X + 28,
      curY + 74,
      CONTENT_W - 56,
      28
    );

    // Mission Card
    curY += 160;
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      195,
      14,
      isLight ? '#f0f9ff' : 'rgba(15, 23, 42, 0.9)',
      '#0284c7',
      2
    );
    drawRoundedRect(ctx, X, curY, 10, 195, 4, '#0284c7');

    drawRoundedRect(ctx, X + 28, curY + 18, 315, 28, 6, '#0284c7');
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 13px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao ? '◆ ພັນທະກິດຍຸດທະສາດ 3 ເສົາຄ້ຳ (MISSION)' : '◆ STRATEGIC MISSION PILLARS',
      X + 40,
      curY + 37,
      295,
      'left'
    );

    ctx.fillStyle = isLight ? '#0f172a' : '#f1f5f9';
    ctx.font = `600 17px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao ? profile.missionStatementLao || profile.missionStatement : profile.missionStatement,
      X + 28,
      curY + 74,
      CONTENT_W - 56,
      34
    );

    // Section 04: 5-Stage Studio Production Pipeline
    curY += 222;
    drawSectionHeading(
      ctx,
      '04',
      isLao
        ? 'ຂັ້ນຕອນການຜະລິດເພງມາດຕະຖານຫ້ອງອັດ 5 ຂັ້ນຕອນ (STUDIO PIPELINE)'
        : 'DIGITAL MUSIC CENTER — 5-STAGE STUDIO PRODUCTION PIPELINE',
      isLao
        ? 'ຂະບວນການແຕ່ງເງ, ຮຽບຮຽງດົນຕີ, ບັນທຶກສຽງຮ້ອງ, ມິກ-ມາສເຕີຣິງ ແລະ ອອກໃບຢັ້ງຢືນລິຂະສິດ'
        : 'End-to-End Songwriting, Instrumental Tracking, Vocal Recording, Mastering & Copyright Issuance',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    const stages = isLao
      ? [
          {
            num: '01',
            step: 'ຂັ້ນຕອນທີ 01 — ຮັບຄິວຜະລິດ ແລະ ວາງແນວຄິດເນື້ອຮ້ອງ (IN_QUEUE & LYRICS)',
            badge: 'ແຕ່ງເນື້ອຮ້ອງ & ຄີສຽງ',
            desc: 'ວິເຄາະໂທນສຽງສິລະປິນ, ກຳນົດຄີເພງ ແລະ ແຕ່ງເນື້ອຮ້ອງ-ທຳນອງຕົ້ນສະບັບໂດຍທີມງານນັກແຕ່ງເພງມືອາຊີບ.',
            color: '#df1c2d',
          },
          {
            num: '02',
            step: 'ຂັ້ນຕອນທີ 02 — ຮຽບຮຽງດົນຕີ ແລະ ບັນທຶກສຽງເຄື່ອງດົນຕີ (ARRANGING)',
            badge: 'ຮຽບຮຽງດົນຕີຄົບວົງ',
            desc: 'ຮຽບຮຽງດົນຕີຄົບວົງ ປະສົມປະສານກີຕ້າອະຄູສຕິກ, ເຄື່ອງດົນຕີພື້ນເມືອງລາວ (ແຄນ/ພິນ), ຄີບອດ ແລະ ກອງ.',
            color: '#d97706',
          },
          {
            num: '03',
            step: 'ຂັ້ນຕອນທີ 03 — ບັນທຶກສຽງຮ້ອງຢູ່ສະຕູດິໂອ ດົງໂດກ (VOCAL RECORDING)',
            badge: 'ຫ້ອງອັດສຽງ ດົງໂດກ',
            desc: 'ບັນທຶກສຽງຮ້ອງໃນຫ້ອງອັດມາດຕະຖານ ໂດຍໂປຣດິວເຊີອາວຸໂສຂອງ DMC ຄວບຄຸມຄຸນນະພາບສຽງຢ່າງລະອຽດ.',
            color: '#2563eb',
          },
          {
            num: '04',
            step: 'ຂັ້ນຕອນທີ 04 — ມິກສຽງ ແລະ ມາສເຕີຣິງລະບົບສາກົນ (MIXING & MASTERING)',
            badge: 'ມາດຕະຖານ -14 LUFS',
            desc: 'ປັບแต่งມິຕິສຽງແຍກແທຣັກ ແລະ ເຮັດ Mastering ຕາມມາດຕະຖານສາກົນ (-14 LUFS) ສຳລັບທຸກແພລັດຟອມ.',
            color: '#7c3aed',
          },
          {
            num: '05',
            step: 'ຂັ້ນຕອນທີ 05 — ເຜີຍແຜ່ຜົນງານ ແລະ ມອບໃບຢັ້ງຢືນລິຂະສິດ (RELEASE)',
            badge: 'ໃບລິຂະສິດແທ້ 100%',
            desc: 'ມອບຟາຍເພງຄຸນນະພາບສູງ ພ້ອມອອກໃບຢັ້ງຢືນລິຂະສິດ Master & Publishing ທາງການ 100% ໃຫ້ສະມາຊິກ.',
            color: '#059669',
          },
        ]
      : [
          {
            num: '01',
            step: 'STAGE 01 — IN_QUEUE & LYRIC CONCEPTUALIZATION',
            badge: 'VOCAL & LYRIC BRIEF',
            desc: 'Onboarding artist vocal profile, key signature selection, and original Lao / international songwriting.',
            color: '#df1c2d',
          },
          {
            num: '02',
            step: 'STAGE 02 — INSTRUMENTAL ARRANGING & ACOUSTIC TRACKING',
            badge: 'STUDIO ARRANGEMENT',
            desc: 'Full studio arrangement combining acoustic guitars, traditional Lao Khene/Pin, keyboards, and percussion.',
            color: '#d97706',
          },
          {
            num: '03',
            step: 'STAGE 03 — VOCAL RECORDING AT DONGDOK CAMPUS STUDIO',
            badge: 'DONGDOK VOCAL BOOTH',
            desc: 'Dedicated vocal booth tracking engineered by DMC senior producers with pitch & timing perfection.',
            color: '#2563eb',
          },
          {
            num: '04',
            step: 'STAGE 04 — MIXING & ANALOG / DIGITAL MASTERING',
            badge: '-14 LUFS MASTER',
            desc: 'Broadcast-grade multi-stem mixing and loudness mastering (-14 LUFS standard) for streaming & radio.',
            color: '#7c3aed',
          },
          {
            num: '05',
            step: 'STAGE 05 — OFFICIAL RELEASE & COPYRIGHT CERTIFICATE',
            badge: '100% VERIFIED CERTIFICATE',
            desc: 'Issuance of Official Master & Publishing Copyright Certificate (100% Verified) and digital distribution.',
            color: '#059669',
          },
        ];

    stages.forEach((st, i) => {
      const sy = curY + i * 106;
      drawRoundedRect(
        ctx,
        X,
        sy,
        CONTENT_W,
        94,
        12,
        isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.85)',
        isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.4)',
        1.5
      );

      // Left Step Number Box
      drawRoundedRect(ctx, X + 16, sy + 16, 62, 62, 12, st.color);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(st.num, X + 47, sy + 55);

      // Stage Title
      ctx.textAlign = 'left';
      ctx.fillStyle = isLight ? '#0f172a' : '#fbbf24';
      ctx.font = `900 17px ${FONT_STACK}`;
      drawFittedText(ctx, st.step, X + 96, sy + 36, CONTENT_W - 340, 'left');

      // Right Badge
      drawRoundedRect(ctx, X + CONTENT_W - 228, sy + 14, 210, 28, 6, st.color);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 12px ${FONT_STACK}`;
      ctx.textAlign = 'center';
      ctx.fillText(st.badge, X + CONTENT_W - 123, sy + 33);

      // Stage Description
      ctx.textAlign = 'left';
      ctx.fillStyle = isLight ? '#334155' : '#e2e8f0';
      ctx.font = `500 15px ${FONT_STACK}`;
      drawFittedText(ctx, st.desc, X + 96, sy + 68, CONTENT_W - 116, 'left');
    });

    // Section 05: Musical Instrument E-Commerce Division
    curY += 552;
    drawSectionHeading(
      ctx,
      '05',
      isLao
        ? 'ພະແນກຈຳໜ່າຍເຄື່ອງດົນຕີ ແລະ ອຸປະກອນຫ້ອງອັດສຽງ (E-COMMERCE)'
        : 'MUSICAL INSTRUMENT & STUDIO GEAR E-COMMERCE DIVISION',
      isLao
        ? 'ຈຳໜ່າຍກີຕ້າອະຄູສຕິກ, ເຄື່ອງດົນຕີໄຟຟ້າ, ໄມໂຄຣໂຟນຫ້ອງອັດ ແລະ ແບ່ງປັນຄອມມິດຊັ່ນ 3 ຊັ້ນ'
        : 'Authentic Guitars, Traditional Lao Instruments, Studio Microphones & Unilevel Pool Distribution',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      190,
      14,
      isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)',
      '#059669',
      2
    );
    drawRoundedRect(ctx, X, curY, 10, 190, 4, '#059669');

    ctx.fillStyle = isLight ? '#065f46' : '#6ee7b7';
    ctx.font = `900 18px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao
        ? 'ກີຕ້າອະຄູສຕິກ, ກີຕ້າໄຟຟ້າ, ຊຸດໄມຫ້ອງອັດສຽງ ແລະ ເຄື່ອງດົນຕີພື້ນເມືອງລາວຄຸນນະພາບສູງ'
        : 'Authentic Acoustic Guitars, Electric Instruments, Studio Mics & Traditional Lao Instruments',
      X + 28,
      curY + 38,
      CONTENT_W - 56,
      'left'
    );

    ctx.fillStyle = isLight ? '#1e293b' : '#f1f5f9';
    ctx.font = `500 16px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao
        ? 'ທຸກລາຍການສິນຄ້າ (SKU) ໃນລະບົບ DMC ມາພ້ອມກັບງົບຄອມມິດຊັ່ນແນະນຳ 3 ຊັ້ນ (ແບ່ງປັນ 50% L1 / 30% L2 / 20% L3), ລະບົບຕັດສະຕັອກສິນຄ້າອັດຕະໂນມັດ ແລະ ບໍລິການຈັດສົ່ງດ່ວນຄົບທັງ 18 ແຂວງທົ່ວ ສປປ ລາວ.'
        : 'Every physical SKU in the DMC Catalog includes a dedicated Unilevel Commission Pool (distributed 50% L1 / 30% L2 / 20% L3), real-time warehouse stock reservation, and nationwide express delivery across all 18 provinces of Lao PDR.',
      X + 28,
      curY + 72,
      CONTENT_W - 56,
      26
    );

    const ecomPills = isLao
      ? [
          '✓ ແບ່ງປັນຄອມມິດຊັ່ນ 50% L1 / 30% L2 / 20% L3',
          '✓ ກວດສອບສະຕັອກສິນຄ້າແບບ Real-Time',
          '✓ ຈັດສົ່ງດ່ວນທົ່ວປະເທດ 18 ແຂວງ',
        ]
      : [
          '✓ 50% L1 / 30% L2 / 20% L3 Commission Pool',
          '✓ Verified Warehouse Stock Reservation',
          '✓ 18 Provinces Lao Express Delivery',
        ];
    const pw = Math.floor((CONTENT_W - 80) / 3);
    ecomPills.forEach((p, idx) => {
      const px = X + 28 + idx * (pw + 12);
      drawRoundedRect(ctx, px, curY + 136, pw, 36, 8, '#059669');
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold 13px ${FONT_STACK}`;
      drawFittedText(ctx, p, px + 14, curY + 159, pw - 24, 'left');
    });
  } else if (pageNumber === 3) {
    // ================= PAGE 3: CORE PACKAGE (1.6M LAK) & 3-TIER UNILEVEL FINANCIAL ARCHITECTURE =================
    let curY = 158;

    drawSectionHeading(
      ctx,
      '06',
      isLao
        ? 'ແພັກເກັດເປີດບັນຊີຫຼັກ (1,600,000 ກີບ) ແລະ ກົດລະບຽບການແບ່ງປັນລາຍຮັບ'
        : 'CORE ACTIVATION PACKAGE (MUSIC_SINGLE_1600) & SPLIT RULES',
      isLao
        ? 'ໂຄງສ້າງການຈັດສັນງົບປະມານຫ້ອງອັດສຽງ ແລະ ຄ່າແນະນຳສະມາຊິກ 3 ຊັ້ນ (L1, L2, L3) ເປັນເງິນກີບ (LAK)'
        : 'Exact Integer LAK (₭) Revenue Allocation, Studio Budget & 3-Generation Sponsor Rewards',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    // Hero Package Card
    const pkgGrad = ctx.createLinearGradient(X, curY, X + CONTENT_W, curY + 165);
    pkgGrad.addColorStop(0, '#0f172a');
    pkgGrad.addColorStop(0.6, '#1e1b4b');
    pkgGrad.addColorStop(1, '#78350f');
    drawRoundedRect(ctx, X, curY, CONTENT_W, 165, 16, pkgGrad, '#f59e0b', 2.5);

    ctx.fillStyle = '#fbbf24';
    ctx.font = `900 18px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao ? profile.corePackageTitleLao || profile.corePackageTitle : profile.corePackageTitle,
      X + 28,
      curY + 38,
      CONTENT_W - 56,
      'left'
    );

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 31px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao
        ? `ລາຄາແພັກເກັດ: ${profile.corePackagePriceLak.toLocaleString()} ກີບ (LAK ₭)`
        : `PACKAGE PRICE: ${profile.corePackagePriceLak.toLocaleString()} LAK (₭)`,
      X + 28,
      curY + 82,
      CONTENT_W - 56,
      'left'
    );

    ctx.fillStyle = '#fde68a';
    ctx.font = `600 15px ${FONT_STACK}`;
    drawFittedText(
      ctx,
      isLao
        ? 'ສິດທິພິເສດ: ສັ່ງຜະລິດເພງໃໝ່ 1 ບົດເພງ (2:00–5:00 ນາທີ) + ໃບຢັ້ງຢືນລິຂະສິດເພງ + ສະຖານະສະມາຊິກຕະຫຼອດຊີບ'
        : 'Entitlement: 1 Custom Studio Song Production (2:00–5:00 min) + Official Copyright Certificate + Active Lifetime Member ID',
      X + 28,
      curY + 114,
      CONTENT_W - 56,
      'left'
    );

    // Visual Proportional Split Bar inside Hero Card
    const barX = X + 28;
    const barY = curY + 128;
    const barW = CONTENT_W - 56;
    const barH = 22;
    const wStudio = Math.round(barW * 0.5625);
    const wL1 = Math.round(barW * 0.25);
    const wL2 = Math.round(barW * 0.125);
    const wL3 = barW - wStudio - wL1 - wL2;

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(barX, barY, wStudio, barH);
    ctx.fillStyle = '#059669';
    ctx.fillRect(barX + wStudio, barY, wL1, barH);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(barX + wStudio + wL1, barY, wL2, barH);
    ctx.fillStyle = '#df1c2d';
    ctx.fillRect(barX + wStudio + wL1 + wL2, barY, wL3, barH);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 11px ${FONT_STACK}`;
    ctx.fillText(
      isLao ? 'ງົບຫ້ອງອັດ 56.25% (900k)' : 'STUDIO 56.25% (900k)',
      barX + 12,
      barY + 15
    );
    ctx.fillText('L1 25% (400k)', barX + wStudio + 10, barY + 15);
    ctx.fillText('L2 12.5%', barX + wStudio + wL1 + 8, barY + 15);
    ctx.fillText('L3', barX + wStudio + wL1 + wL2 + 6, barY + 15);

    // Structured 4-Column Financial Split Table
    curY += 186;
    const col1W = 450;
    const col2W = 200;
    const col3W = 115;
    const col4W = CONTENT_W - col1W - col2W - col3W; // 331px

    // Table Header Bar
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(X, curY, CONTENT_W, 46);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(X, curY, CONTENT_W, 46);

    ctx.fillStyle = '#fbbf24';
    ctx.font = `900 13px ${FONT_STACK}`;
    ctx.textAlign = 'left';
    ctx.fillText(isLao ? 'ລາຍການຈັດສັນງົບປະມານ' : 'ALLOCATION COMPONENT', X + 16, curY + 28);
    ctx.fillText(isLao ? 'ຈຳນວນເງິນ (LAK)' : 'AMOUNT (LAK)', X + col1W + 16, curY + 28);
    ctx.fillText(isLao ? 'ອັດຕາສ່ວນ %' : 'SHARE %', X + col1W + col2W + 16, curY + 28);
    ctx.fillText(
      isLao ? 'ກົດລະບຽບການຊຳລະ ແລະ ບັນຊີ' : 'LEDGER & SETTLEMENT RULE',
      X + col1W + col2W + col3W + 16,
      curY + 28
    );

    const totalPool = profile.l1SponsorLak + profile.l2SponsorLak + profile.l3SponsorLak;
    const splitRows = isLao
      ? [
          [
            '1. ງົບປະມານຜະລິດເພງ ແລະ ຫ້ອງອັດ DMC',
            `${profile.studioBudgetLak.toLocaleString()} LAK`,
            '56.25%',
            'ຄ່າແຕ່ງເພງ, ອັດສຽງ, ມິກ & ໂປຣດິວເຊີ',
          ],
          [
            '2. ຄອມມິດຊັ່ນຜູ້ແນະນຳກົງ ຊັ້ນທີ 1 (L1)',
            `${profile.l1SponsorLak.toLocaleString()} LAK`,
            '25.00%',
            'ລາງວັນຜູ້ແນະນຳກົງທັນທີ (Direct)',
          ],
          [
            '3. ຄອມມິດຊັ່ນອັບລາຍ ຊັ້ນທີ 2 (L2)',
            `${profile.l2SponsorLak.toLocaleString()} LAK`,
            '12.50%',
            'ລາງວັນບໍລິຫານທີມ ລຸ້ນທີ 2',
          ],
          [
            '4. ຄອມມິດຊັ່ນອັບລາຍ ຊັ້ນທີ 3 (L3)',
            `${profile.l3SponsorLak.toLocaleString()} LAK`,
            '6.25%',
            'ລາງວັນຂະຫຍາຍເຄືອຂ່າຍ ລຸ້ນທີ 3',
          ],
          [
            'ລວມງົບຄອມມິດຊັ່ນທັງໝົດ (L1 + L2 + L3)',
            `${totalPool.toLocaleString()} LAK`,
            '43.75%',
            'ບໍ່ມີການເລື່ອນຊັ້ນ • ໂອນເຂົ້າບັນຊີສຳຮອງ',
          ],
        ]
      : [
          [
            '1. DMC Studio Production Budget',
            `${profile.studioBudgetLak.toLocaleString()} LAK`,
            '56.25%',
            'Recording, Mixing & Producer',
          ],
          [
            '2. Level 1 (L1) Direct Sponsor',
            `${profile.l1SponsorLak.toLocaleString()} LAK`,
            '25.00%',
            'Direct Referral Commission',
          ],
          [
            '3. Level 2 (L2) Second-Tier Upline',
            `${profile.l2SponsorLak.toLocaleString()} LAK`,
            '12.50%',
            '2nd Gen Leadership Reward',
          ],
          [
            '4. Level 3 (L3) Third-Tier Upline',
            `${profile.l3SponsorLak.toLocaleString()} LAK`,
            '6.25%',
            '3rd Gen Network Reward',
          ],
          [
            'TOTAL UNILEVEL POOL (L1 + L2 + L3)',
            `${totalPool.toLocaleString()} LAK`,
            '43.75%',
            'Zero Roll-Up • Unassigned -> Reserve',
          ],
        ];

    const splitRowH = 56;
    splitRows.forEach(([title, amt, pct, note], i) => {
      const ry = curY + 46 + i * splitRowH;
      const isTotal = i === splitRows.length - 1;
      ctx.fillStyle = isTotal
        ? isLight
          ? '#ecfdf5'
          : 'rgba(16, 185, 129, 0.2)'
        : isLight
        ? i % 2 === 0
          ? '#ffffff'
          : '#f8fafc'
        : 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(X, ry, CONTENT_W, splitRowH);
      ctx.strokeStyle = isTotal ? '#059669' : isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = isTotal ? 2 : 1;
      ctx.strokeRect(X, ry, CONTENT_W, splitRowH);

      [X + col1W, X + col1W + col2W, X + col1W + col2W + col3W].forEach(divX => {
        ctx.beginPath();
        ctx.moveTo(divX, ry);
        ctx.lineTo(divX, ry + splitRowH);
        ctx.stroke();
      });

      ctx.fillStyle = isTotal
        ? isLight
          ? '#065f46'
          : '#6ee7b7'
        : isLight
        ? '#0f172a'
        : '#ffffff';
      ctx.font = `${isTotal ? '900' : 'bold'} 15px ${FONT_STACK}`;
      drawFittedText(ctx, title, X + 16, ry + 34, col1W - 28, 'left');

      ctx.fillStyle = isTotal ? '#059669' : '#d97706';
      ctx.font = '900 17px monospace';
      drawFittedText(ctx, amt, X + col1W + 16, ry + 34, col2W - 28, 'left');

      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 15px monospace';
      drawFittedText(ctx, pct, X + col1W + col2W + 16, ry + 34, col3W - 24, 'left');

      ctx.fillStyle = isLight ? '#334155' : '#cbd5e1';
      ctx.font = `600 14px ${FONT_STACK}`;
      drawFittedText(ctx, note, X + col1W + col2W + col3W + 16, ry + 34, col4W - 24, 'left');
    });

    // Section 07: Immutable 5-Balance Ledger Architecture
    curY += 46 + splitRows.length * splitRowH + 34;
    drawSectionHeading(
      ctx,
      '07',
      isLao
        ? 'ລະບົບບັນຊີການເງິນ 5 ກະເປົາ ແລະ ມາດຕະການປ້ອງກັນຄວາມສ່ຽງ'
        : 'IMMUTABLE 5-BALANCE LEDGER & ANTI-PYRAMID SAFEGUARDS',
      isLao
        ? 'ການບັນທຶກບັນຊີເປັນເງິນກີບລາວ (Integer LAK), ການສະສົມຍອດເປີດບັນຊີ ແລະ ການອະນຸມັດຖອນເງິນ'
        : 'Strict Integer LAK Accounting, Self-Activation Qualification & Maker/Checker Treasury Controls',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    const balancesInfo = isLao
      ? [
          {
            code: 'B-01',
            title: '1. ຍອດເງິນລໍຖ້າການຢັ້ງຢືນ (PENDING BALANCE)',
            desc: 'ພັກຍອດຄອມມິດຊັ່ນຈາກການສັ່ງຊື້ເຄື່ອງດົນຕີ ຈົນກວ່າບໍລິສັດຂົນສົ່ງຈະຢັ້ງຢືນການສົ່ງມອບສຳເລັດ.',
            color: '#64748b',
          },
          {
            code: 'B-02',
            title: '2. ຍອດສະສົມເພື່ອເປີດບັນຊີສະມາຊິກ (HELD FOR QUALIFICATION)',
            desc: 'ສະສົມລາຍຮັບຄອມມິດຊັ່ນຂອງສະມາຊິກຟຣີ (FREE_MEMBER) ໃຫ້ຄົບ 1,600,000 ກີບ ເພື່ອເປີດບັນຊີຕະຫຼອດຊີບ.',
            color: '#2563eb',
          },
          {
            code: 'B-03',
            title: '3. ຍອດເງິນພ້ອມຖອນໄດ້ທັນທີ (AVAILABLE BALANCE)',
            desc: 'ຍອດເງິນກີບທີ່ອະນຸມັດແລ້ວ ສາມາດສັ່ງຖອນເຂົ້າບັນຊີທະນາຄານລາວໄດ້ທັນທີ ສຳລັບສະມາຊິກຕະຫຼອດຊີບ.',
            color: '#059669',
          },
          {
            code: 'B-04',
            title: '4. ຍອດເງິນລໍຖ້າໂອນຈ່າຍ (WITHDRAWAL HOLD)',
            desc: 'ລັອກຍອດເງິນຊົ່ວຄາວຫຼັງຢັ້ງຢືນລະຫັດ SMS OTP ໃນຂະນະລໍຖ້າຝ່າຍບັນຊີໂອນເຂົ້າທະນາຄານ.',
            color: '#d97706',
          },
          {
            code: 'B-05',
            title: '5. ຍອດໂອນຈ່າຍສຳເລັດ ແລະ ກອງທຶນສຳຮອງ (PAID OUT & UNALLOCATED)',
            desc: 'ບັນທຶກຍອດໂອນເງິນເຂົ້າທະນາຄານທັງໝົດ ແລະ ຍອດຄອມມິດຊັ່ນທີ່ບໍ່ມີອັບລາຍເຂົ້າຄັງສຳຮອງບໍລິສັດ.',
            color: '#7c3aed',
          },
        ]
      : [
          {
            code: 'B-01',
            title: '1. PENDING BALANCE (ESCROW)',
            desc: 'Holds unilevel commissions from physical instrument orders until carrier delivery is verified.',
            color: '#64748b',
          },
          {
            code: 'B-02',
            title: '2. HELD FOR QUALIFICATION (LOCKED)',
            desc: 'Accumulates commissions for FREE_MEMBER accounts toward the 1,600,000 LAK self-activation target.',
            color: '#2563eb',
          },
          {
            code: 'B-03',
            title: '3. AVAILABLE WITHDRAWABLE BALANCE',
            desc: 'Cleared, immediately withdrawable Integer LAK funds for ACTIVE_LIFETIME_MEMBER accounts.',
            color: '#059669',
          },
          {
            code: 'B-04',
            title: '4. WITHDRAWAL HOLD (OTP VERIFIED)',
            desc: 'Atomic lock placed upon SMS OTP verification while awaiting Maker/Checker bank payout.',
            color: '#d97706',
          },
          {
            code: 'B-05',
            title: '5. PAID OUT & UNALLOCATED RESERVE',
            desc: 'Cumulative external Lao bank disbursements & auditable Unallocated missing-upline reserve.',
            color: '#7c3aed',
          },
        ];

    balancesInfo.forEach((b, i) => {
      const by = curY + i * 96;
      drawRoundedRect(
        ctx,
        X,
        by,
        CONTENT_W,
        84,
        12,
        isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.85)',
        isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.35)',
        1.5
      );

      drawRoundedRect(ctx, X + 16, by + 16, 72, 52, 10, b.color);
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.code, X + 52, by + 48);

      ctx.textAlign = 'left';
      ctx.fillStyle = isLight ? '#0f172a' : '#fcd34d';
      ctx.font = `900 16px ${FONT_STACK}`;
      drawFittedText(ctx, b.title, X + 106, by + 34, CONTENT_W - 126, 'left');

      ctx.fillStyle = isLight ? '#334155' : '#e2e8f0';
      ctx.font = `500 15px ${FONT_STACK}`;
      drawFittedText(ctx, b.desc, X + 106, by + 62, CONTENT_W - 126, 'left');
    });
  } else {
    // ================= PAGE 4: OFFICIAL LAO BANKING, LOGISTICS, REPORTS & EXECUTIVE SEAL =================
    let curY = 158;

    drawSectionHeading(
      ctx,
      '08',
      isLao
        ? 'ທະນາຄານການຄ້າຄູ່ຮ່ວມງານ ແລະ ລະບົບຊຳລະເງິນ QR ໃນ ສປປ ລາວ'
        : 'OFFICIAL LAO COMMERCIAL BANKING & QR SETTLEMENT PARTNERS',
      isLao
        ? 'ເຊື່ອມຕໍ່ 5 ທະນາຄານຊັ້ນນຳໃນ ສປປ ລາວ ເພື່ອຮັບຊຳລະເງິນຜ່ານ QR ແລະ ໂອນຈ່າຍຄອມມິດຊັ່ນ'
        : '5 Major Lao Commercial Banks Integrated for Instant QR Payment & Commission Disbursements',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    const bankRows = isLao
      ? [
          {
            code: '1/ BCEL',
            name: 'ທະນາຄານການຄ້າຕ່າງປະເທດລາວ ມະຫາຊົນ (BCEL One)',
            swift: 'BCEL OnePay • SWIFT: COEBLALA',
          },
          {
            code: '2/ LDB',
            name: 'ທະນາຄານພັດທະນາລາວ ຈຳກັດ (Lao Development Bank)',
            swift: 'LDB Trust • SWIFT: LDBNLALA',
          },
          {
            code: '3/ JDB',
            name: 'ທະນາຄານຮ່ວມພັດທະນາ (Joint Development Bank)',
            swift: 'JDB YesPay • SWIFT: JDBKLALA',
          },
          {
            code: '4/ VIETIN',
            name: 'ທະນາຄານ ຫວຽດຕິນລາວ ຈຳກັດ (VietinBank Lao)',
            swift: 'VietinBank iPay • SWIFT: ICBVLALA',
          },
          {
            code: '5/ PSVB',
            name: 'ທະນາຄານພົງສະຫວັນ ຈຳກັດ (Phongsavanh Bank Laos)',
            swift: 'PSVB Hi App • SWIFT: PSVBLALA',
          },
        ]
      : [
          {
            code: '1/ BCEL',
            name: 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC',
            swift: 'BCEL OnePay • SWIFT: COEBLALA',
          },
          {
            code: '2/ LDB',
            name: 'Lao Development Bank CO., LTD (ທະນາຄານພັດທະນາລາວ)',
            swift: 'LDB Trust • SWIFT: LDBNLALA',
          },
          {
            code: '3/ JDB',
            name: 'Joint Development Bank (ທະນາຄານຮ່ວມພັດທະນາ)',
            swift: 'JDB YesPay • SWIFT: JDBKLALA',
          },
          {
            code: '4/ VIETIN',
            name: 'VietinBank Lao | Vientiane Head Office',
            swift: 'VietinBank iPay • SWIFT: ICBVLALA',
          },
          {
            code: '5/ PSVB',
            name: 'Phongsavanh Bank Ltd (Laos) (ທະນາຄານພົງສະຫວັນ)',
            swift: 'PSVB Hi App • SWIFT: PSVBLALA',
          },
        ];

    bankRows.forEach((bk, idx) => {
      const by = curY + idx * 58;
      drawRoundedRect(
        ctx,
        X,
        by,
        CONTENT_W,
        50,
        10,
        isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.88)',
        isLight ? '#cbd5e1' : 'rgba(16, 185, 129, 0.45)',
        1.5
      );

      drawRoundedRect(ctx, X + 12, by + 9, 145, 32, 7, '#059669');
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`✓ ${bk.code} QR`, X + 84, by + 30);

      ctx.textAlign = 'left';
      ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
      ctx.font = `bold 15px ${FONT_STACK}`;
      drawFittedText(ctx, bk.name, X + 174, by + 31, CONTENT_W - 470, 'left');

      ctx.textAlign = 'right';
      ctx.fillStyle = isLight ? '#0369a1' : '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(bk.swift, X + CONTENT_W - 18, by + 31);
    });

    // Section 09: National Express Logistics & 6-Language Accessibility
    curY += 312;
    drawSectionHeading(
      ctx,
      '09',
      isLao
        ? 'ບໍລິສັດຂົນສົ່ງດ່ວນທົ່ວປະເທດ (18 ແຂວງ) ແລະ ລະບົບຮອງຮັບ 6 ພາສາ'
        : 'LAO NATIONAL EXPRESS LOGISTICS & 6-LANGUAGE ACCESSIBILITY',
      isLao
        ? 'ການຈັດສົ່ງເຄື່ອງດົນຕີທົ່ວ ສປປ ລາວ ແລະ ລະບົບປ່ຽນພາສາອັດຕະໂນມັດ 6 ພາສາ'
        : 'Nationwide Delivery Across All 18 Provinces & Multi-Language Super App Localization',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    const halfW = Math.floor((CONTENT_W - 20) / 2);

    // Left Box: Shipping Carriers
    drawRoundedRect(
      ctx,
      X,
      curY,
      halfW,
      155,
      12,
      isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.85)',
      isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.4)',
      1.5
    );
    drawRoundedRect(ctx, X, curY, halfW, 8, 4, '#d97706');
    ctx.textAlign = 'left';
    ctx.fillStyle = isLight ? '#0f172a' : '#fde68a';
    ctx.font = `900 16px ${FONT_STACK}`;
    ctx.fillText(
      isLao
        ? 'ບໍລິສັດຂົນສົ່ງດ່ວນທາງການ (ຄົບທັງ 18 ແຂວງ)'
        : 'OFFICIAL LAO EXPRESS CARRIERS (18 PROVINCES)',
      X + 20,
      curY + 38
    );

    ctx.fillStyle = isLight ? '#334155' : '#f1f5f9';
    ctx.font = `600 14px ${FONT_STACK}`;
    ctx.fillText('• 1/ ອານຸສິດ ຂົນສົ່ງດ່ວນ (Anousith Express)', X + 20, curY + 70);
    ctx.fillText('• 2/ ຮຸ່ງອາລຸນ ຂົນສົ່ງດ່ວນ (HAL Logistics)', X + 20, curY + 98);
    ctx.fillText('• 3/ ມີໄຊ ຂົນສົ່ງດ່ວນ (Mixay Express)', X + 20, curY + 126);

    // Right Box: 6 Supported Languages
    const rx = X + halfW + 20;
    drawRoundedRect(
      ctx,
      rx,
      curY,
      halfW,
      155,
      12,
      isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.85)',
      isLight ? '#cbd5e1' : 'rgba(56, 189, 248, 0.4)',
      1.5
    );
    drawRoundedRect(ctx, rx, curY, halfW, 8, 4, '#0284c7');
    ctx.fillStyle = isLight ? '#0f172a' : '#38bdf8';
    ctx.font = `900 16px ${FONT_STACK}`;
    ctx.fillText(
      isLao ? 'ຮອງຮັບການໃຊ້ງານ 6 ພາສາສາກົນ' : '6-LANGUAGE SUPER APP LOCALIZATION',
      rx + 20,
      curY + 38
    );

    ctx.fillStyle = isLight ? '#334155' : '#f1f5f9';
    ctx.font = `600 14px ${FONT_STACK}`;
    ctx.fillText('• ພາສາລາວ (LO - Lao PDR)   • English (EN)', rx + 20, curY + 70);
    ctx.fillText('• ภาษาไทย (TH)             • Tiếng Việt (VI)', rx + 20, curY + 98);
    ctx.fillText('• 中文 (ZH)                 • 한국어 (KO)', rx + 20, curY + 126);

    // Section 10: Enterprise Governance & 7 Official Administrator Reports
    curY += 178;
    drawSectionHeading(
      ctx,
      '10',
      isLao
        ? 'ລະບົບຄຸ້ມຄອງບໍລິຫານ ແລະ ຟາຍລາຍງານ Excel / PDF ທາງການ 7 ລາຍການ'
        : 'ENTERPRISE GOVERNANCE & 7 OFFICIAL ADMINISTRATOR REPORTS',
      isLao
        ? 'ລະບົບກວດສອບຂໍ້ມູນ ແລະ ດາວໂຫຼດຟາຍລາຍງານ Excel (.xls) ແລະ ໂປຣໄຟລ໌ບໍລິສັດ (.pdf)'
        : 'Complete Audit Trail & 1-Click Excel / PDF Export Center in the Administrator Panel',
      X,
      curY,
      CONTENT_W,
      isLight
    );

    curY += 68;
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      148,
      12,
      isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.85)',
      isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.35)',
      1.5
    );

    const colLeftReports = isLao
      ? [
          '1/ ຟາຍລາຍງານຂໍ້ມູນສະມາຊິກ (Register Member CRUD .xls)',
          '2/ ຟາຍລະຫັດຜ່ານ Admin & User (Password File .xls)',
          '3/ ຟາຍລາຍການສິນຄ້າ ແລະ ແພັກເກັດ (Products & SKUs .xls)',
          '4/ ຟາຍຄຳສັ່ງຊື້ ແລະ ການຂົນສົ່ງ (Orders & Shipping .xls)',
        ]
      : [
          '1/ Register Member CRUD File (.xls)',
          '2/ Admin & User Password File (.xls)',
          '3/ Products & SKUs File (.xls)',
          '4/ Orders & Shipping File (.xls)',
        ];
    const colRightReports = isLao
      ? [
          '5/ ຟາຍລາຍງານເພງສະຕູດິໂອ (Studio Song File .xls)',
          '6/ ຟາຍຢັ້ງຢືນການຊຳລະເງິນ (Payment Proved File .xls)',
          '7/ ຟາຍຜັງສາຍງານສະມາຊິກ 3 ຊັ້ນ (Downline Tree .xls)',
          '★ 1/ ໂປຣໄຟລ໌ບໍລິສັດ ສູນດົນຕີດິຈິຕອນ (Lao & EN .pdf)',
        ]
      : [
          '5/ Studio Song File (.xls)',
          '6/ Payment Proved File (.xls)',
          '7/ Report Downline Organize Tree File (.xls)',
          '★ 1/ Company Profile Digital Music Center (.pdf)',
        ];

    ctx.font = `bold 14px ${FONT_STACK}`;
    colLeftReports.forEach((rep, i) => {
      ctx.fillStyle = isLight ? '#0f172a' : '#e2e8f0';
      drawFittedText(ctx, rep, X + 24, curY + 36 + i * 29, halfW - 30, 'left');
    });
    colRightReports.forEach((rep, i) => {
      ctx.fillStyle = i === 3 ? '#df1c2d' : isLight ? '#0f172a' : '#e2e8f0';
      drawFittedText(ctx, rep, X + halfW + 24, curY + 36 + i * 29, halfW - 30, 'left');
    });

    // Executive Sign-off & Official Corporate Seal Block
    curY += 172;
    drawRoundedRect(
      ctx,
      X,
      curY,
      CONTENT_W,
      275,
      16,
      isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.09)',
      '#f59e0b',
      2.5
    );

    ctx.textAlign = 'left';
    ctx.fillStyle = isLight ? '#92400e' : '#fcd34d';
    ctx.font = `900 20px ${FONT_STACK}`;
    ctx.fillText(
      isLao
        ? 'ການຢັ້ງຢືນທາງການຈາກຝ່າຍບໍລິຫານ ແລະ ກາຈ້ຳບໍລິສັດ (OFFICIAL CERTIFICATION)'
        : 'OFFICIAL EXECUTIVE CERTIFICATION & CORPORATE SEAL',
      X + 32,
      curY + 44
    );

    ctx.fillStyle = isLight ? '#334155' : '#cbd5e1';
    ctx.font = `500 15px ${FONT_STACK}`;
    wrapCanvasText(
      ctx,
      isLao
        ? `ເອກະສານໂປຣໄຟລ໌ບໍລິສັດສະບັບນີ້ (${profile.documentNumber}) ອອກໂດຍ ${profile.companyNameLao}, ສຳນັກງານໃຫຍ່ຕັ້ງຢູ່ ${profile.headquartersAddressLao || profile.headquartersAddress}. ຢັ້ງຢືນຄວາມຖືກຕ້ອງຂອງຂໍ້ມູນທາງການ ວັນທີ ${profile.updatedAt}.`
        : `This Company Profile dossier (${profile.documentNumber}) is officially issued and certified by ${profile.companyNameEn}, headquartered at ${profile.headquartersAddress}. All financial rules, studio production workflows, and banking integrations are verified accurate as of ${profile.updatedAt}.`,
      X + 32,
      curY + 78,
      CONTENT_W - 340,
      26
    );

    // Signature Line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(X + 32, curY + 202);
    ctx.lineTo(X + 440, curY + 202);
    ctx.stroke();

    ctx.fillStyle = isLight ? '#b45309' : '#fde68a';
    ctx.font = `italic bold 28px Georgia, ${FONT_STACK}`;
    ctx.fillText(profile.ceoFounderName, X + 48, curY + 188);

    ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
    ctx.font = `900 16px ${FONT_STACK}`;
    ctx.fillText(profile.ceoFounderName, X + 32, curY + 228);

    ctx.fillStyle = isLight ? '#475569' : '#94a3b8';
    ctx.font = `600 14px ${FONT_STACK}`;
    ctx.fillText(
      isLao ? profile.ceoTitleLao || profile.ceoTitle : profile.ceoTitle,
      X + 32,
      curY + 252
    );

    // Official Corporate Seal on Right
    drawDmcSealEmblem(ctx, X + CONTENT_W - 155, curY + 138, 96);
  }

  return canvas;
}

/**
 * Helper to convert a DataURL ("data:image/jpeg;base64,...") to raw Uint8Array bytes
 */
function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

/**
 * Packs an array of rendered HTMLCanvasElements into a genuine multi-page PDF 1.4 binary Blob
 * and triggers a browser file download (.pdf) without any popup windows.
 */
export function buildMultiPagePdfBlobFromCanvases(canvases: HTMLCanvasElement[]): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  let currentOffset = 0;

  const pushStr = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    currentOffset += bytes.length;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    currentOffset += bytes.length;
  };

  const offsets: number[] = [0];

  const startObj = (objNum: number) => {
    offsets[objNum] = currentOffset;
    pushStr(`${objNum} 0 obj\n`);
  };

  const endObj = () => {
    pushStr(`\nendobj\n`);
  };

  pushStr(`%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`);

  const numPages = canvases.length;
  startObj(1);
  pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
  endObj();

  const pageObjIds = canvases.map((_, i) => 3 + i * 3);

  startObj(2);
  pushStr(
    `<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${numPages} >>`
  );
  endObj();

  const pdfW = 595.28;
  const pdfH = 841.89;

  canvases.forEach((canvas, idx) => {
    const pageObjId = 3 + idx * 3;
    const contentObjId = 4 + idx * 3;
    const imgObjId = 5 + idx * 3;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.94);
    const jpegBytes = dataUrlToUint8Array(jpegDataUrl);

    startObj(pageObjId);
    pushStr(
      `<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 ${imgObjId} 0 R >> >> /MediaBox [0 0 ${pdfW} ${pdfH}] /Contents ${contentObjId} 0 R >>`
    );
    endObj();

    const contentStream = `q\n${pdfW} 0 0 ${pdfH} 0 0 cm\n/Im0 Do\nQ\n`;
    const contentBytes = encoder.encode(contentStream);
    startObj(contentObjId);
    pushStr(`<< /Length ${contentBytes.length} >>\nstream\n`);
    pushBytes(contentBytes);
    pushStr(`endstream`);
    endObj();

    startObj(imgObjId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    );
    pushBytes(jpegBytes);
    pushStr(`\nendstream`);
    endObj();
  });

  const totalObjects = 2 + numPages * 3 + 1;
  const xrefOffset = currentOffset;
  pushStr(`xref\n0 ${totalObjects}\n`);
  pushStr(`0000000000 65535 f \n`);
  for (let i = 1; i < totalObjects; i++) {
    const offStr = String(offsets[i] || 0).padStart(10, '0');
    pushStr(`${offStr} 00000 n \n`);
  }

  pushStr(`trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  return new Blob(chunks, { type: 'application/pdf' });
}

/**
 * Generates and downloads the complete 4-Page Official Company Profile PDF File
 * in either Lao (`LO`), English (`EN`), or Combined 8-Page (`BOTH` = 4 Lao + 4 English pages).
 */
export function downloadCompanyProfilePdf(
  profile: CompanyProfileData,
  stats: CompanyProfileRuntimeStats,
  filename = '1_DMC_Company_Profile_Digital_Music_Center.pdf',
  langMode?: 'LO' | 'EN' | 'BOTH'
): void {
  const mode = langMode || profile.pdfLanguage || 'LO';
  const pages: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  let canvases: HTMLCanvasElement[] = [];
  if (mode === 'BOTH') {
    const laoCanvases = pages.map(p => renderCompanyProfilePageToCanvas(p, profile, stats, 'LO'));
    const enCanvases = pages.map(p => renderCompanyProfilePageToCanvas(p, profile, stats, 'EN'));
    canvases = [...laoCanvases, ...enCanvases];
  } else {
    canvases = pages.map(p => renderCompanyProfilePageToCanvas(p, profile, stats, mode));
  }

  const pdfBlob = buildMultiPagePdfBlobFromCanvases(canvases);

  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
