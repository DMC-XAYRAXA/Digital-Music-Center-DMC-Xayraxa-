/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * ADMINISTRATOR PANEL — 1/ DESIGN BUSINESS CARDS STUDIO & PRINT HUB
 * Features:
 * - Interactive Front & Back Business Card Designer (Standard 3.5" x 2.0" / 1050x600px @ 300 DPI)
 * - Official DMC R (ໄຊລາຊາ) Emblem + Scannable Member/Referral QR Code + Portrait/Logo
 * - 4 Executive Themes:
 *    1. Royal Gold & Obsidian Dark (ROYAL_GOLD_DARK)
 *    2. DMC Signature Crimson & Imperial Navy (CRIMSON_IMPERIAL)
 *    3. Executive Pearl White & Gold (EXECUTIVE_PEARL_WHITE)
 *    4. Emerald Fintech & Gold (EMERALD_FINTECH)
 * - Bilingual Support: Lao + English (BOTH), Lao Only (LO), English Only (EN)
 * - 1-Click Populate from Founder/CEO, Super Admin, or any Registered Member
 * - 1-Click Export:
 *    - Front & Back PDF File (`1_DMC_Xayraxa_Business_Cards_Front_Back.pdf`)
 *    - A4 8-Card Commercial Print Sheet PDF with Crop Marks (`1_DMC_Xayraxa_Business_Cards_A4_Print_Sheet.pdf`)
 *    - High-Res Front PNG & Back PNG
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  CreditCard,
  Download,
  Printer,
  Upload,
  RotateCcw,
  Sparkles,
  UserCheck,
  QrCode,
  Camera,
  CheckCircle2,
  Eye,
  Maximize2,
  X,
  Palette,
  Globe,
  FileText,
} from 'lucide-react';
import { useDmc } from '../../context/DmcContext';
import { drawDmcOfficialLogoOnCanvas } from '../common/DmcLogo';

export type BusinessCardTheme =
  | 'ROYAL_GOLD_DARK'
  | 'CRIMSON_IMPERIAL'
  | 'EXECUTIVE_PEARL_WHITE'
  | 'EMERALD_FINTECH';

export type BusinessCardLanguage = 'BOTH' | 'LO' | 'EN';

export interface BusinessCardData {
  companyNameEn: string;
  companyNameLo: string;
  brandSubtitleEn: string;
  brandSubtitleLo: string;
  fullNameEn: string;
  fullNameLo: string;
  roleTitleEn: string;
  roleTitleLo: string;
  memberId: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  addressEn: string;
  addressLo: string;
  sloganEn: string;
  sloganLo: string;
  taxAndRegInfo: string;
  avatarDataUrl: string;
  customQrDataUrl: string;
  backServicesEn: string[];
  backServicesLo: string[];
}

export const DEFAULT_BUSINESS_CARD_DATA: BusinessCardData = {
  companyNameEn: 'DMC XAYRAXA ENTERTAINMENT SOLE CO., LTD',
  companyNameLo: 'ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ບັນເທີງ ຈຳກັດຜູ້ດຽວ',
  brandSubtitleEn: 'DIGITAL MUSIC CENTER • RECORDING STUDIO & E-COMMERCE',
  brandSubtitleLo: 'ສູນດົນຕີດິຈິຕອນ • ຫ້ອງອັດສຽງມາດຕະຖານສາກົນ ແລະ ການຄ້າອອນລາຍ',
  fullNameEn: 'XAY RAXA',
  fullNameLo: 'ໄຊ ຣາຊາ',
  roleTitleEn: 'Founder & Chief Executive Officer (CEO)',
  roleTitleLo: 'ຜູ້ກໍ່ຕັ້ງ ແລະ ປະທານຜູ້ບໍລິຫານສູງສຸດ',
  memberId: 'DMC-LA-00101',
  phone: '+856 20 5599 8888',
  whatsapp: '+856 20 5511 2233',
  email: 'xay.raxa@gmail.com',
  website: 'www.dmcxayraxa.la',
  addressEn: 'Dongdok Campus, Xaythany District, Vientiane Capital, Lao PDR',
  addressLo: 'ວິທະຍາເຂດດົງໂດກ, ເມືອງໄຊທານີ, ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ',
  sloganEn: 'Build Your Music Future • 1,600,000 LAK Lifetime Studio Membership',
  sloganLo: 'ສ້າງອະນາຄົດສາຍດົນຕີຂອງທ່ານ • ສະມາຊິກຕະຫຼອດຊີບ 1,600,000 ກີບ',
  taxAndRegInfo: 'Reg: NO. 01-009284/MOIC.VTE • Tax ID: 856-1099284-00',
  avatarDataUrl: '',
  customQrDataUrl: '',
  backServicesEn: [
    'Custom AI & Studio Song Production (WAV/MP3 + Master Certificate)',
    'Signature Acoustic & Electric Guitars + Pro Studio Audio Gear',
    '3-Level Unilevel Creator Rewards (L1: 400K • L2: 200K • L3: 100K LAK)',
    'Official Lao QR Banking (BCEL One, Phongsavanh, LDB, JDB, VietinBank)',
  ],
  backServicesLo: [
    'ຜະລິດເພງສ່ວນຕົວໃນຫ້ອງອັດມາດຕະຖານສາກົນ ພ້ອມໃບຢັ້ງຢືນລິຂະສິດ 100%',
    'ຈຳໜ່າຍກີຕ້າອະຄູສຕິກ, ກີຕ້າໄຟຟ້າ ແລະ ອຸປະກອນຫ້ອງອັດສຽງຄົບວົງຈອນ',
    'ລະບົບຄ່າແນະນຳ Unilevel 3 ຊັ້ນ (L1: 400K • L2: 200K • L3: 100K ກີບ)',
    'ຮອງຮັບ LAO QR 5 ທະນາຄານຊັ້ນນຳ (BCEL, ພົງສະຫວັນ, LDB, JDB, VietinBank)',
  ],
};

const STORAGE_KEY = 'dmc_admin_business_card_studio_v1';

const CARD_W = 1050;
const CARD_H = 600;
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

function getCardPalette(theme: BusinessCardTheme) {
  switch (theme) {
    case 'CRIMSON_IMPERIAL':
      return {
        bgStart: '#45050c',
        bgMid: '#7a0916',
        bgEnd: '#0f172a',
        cardSurface: '#1e1b4b',
        gold: '#fbbf24',
        goldSoft: '#fde68a',
        crimson: '#df1c2d',
        textPrimary: '#ffffff',
        textSecondary: '#fecdd3',
        textMuted: '#cbd5e1',
        pillBg: 'rgba(255,255,255,0.12)',
        isLight: false,
      };
    case 'EXECUTIVE_PEARL_WHITE':
      return {
        bgStart: '#ffffff',
        bgMid: '#f8fafc',
        bgEnd: '#f1f5f9',
        cardSurface: '#0f172a',
        gold: '#b45309',
        goldSoft: '#f59e0b',
        crimson: '#df1c2d',
        textPrimary: '#0f172a',
        textSecondary: '#1e293b',
        textMuted: '#475569',
        pillBg: '#f1f5f9',
        isLight: true,
      };
    case 'EMERALD_FINTECH':
      return {
        bgStart: '#022c22',
        bgMid: '#064e3b',
        bgEnd: '#090d16',
        cardSurface: '#065f46',
        gold: '#fbbf24',
        goldSoft: '#fde68a',
        crimson: '#10b981',
        textPrimary: '#ffffff',
        textSecondary: '#a7f3d0',
        textMuted: '#cbd5e1',
        pillBg: 'rgba(16,185,129,0.16)',
        isLight: false,
      };
    case 'ROYAL_GOLD_DARK':
    default:
      return {
        bgStart: '#090d16',
        bgMid: '#111827',
        bgEnd: '#1e1b4b',
        cardSurface: '#172033',
        gold: '#f5a623',
        goldSoft: '#fde68a',
        crimson: '#df1c2d',
        textPrimary: '#ffffff',
        textSecondary: '#fde68a',
        textMuted: '#cbd5e1',
        pillBg: 'rgba(245,166,35,0.14)',
        isLight: false,
      };
  }
}

function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function renderFrontBusinessCardCanvas(
  data: BusinessCardData,
  theme: BusinessCardTheme,
  lang: BusinessCardLanguage,
  qrDataUrl: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const p = getCardPalette(theme);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bgGrad.addColorStop(0, p.bgStart);
  bgGrad.addColorStop(0.55, p.bgMid);
  bgGrad.addColorStop(1, p.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Decorative geometric luxury waves on right side
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(CARD_W * 0.62, 0);
  ctx.quadraticCurveTo(CARD_W * 0.76, CARD_H * 0.5, CARD_W * 0.58, CARD_H);
  ctx.lineTo(CARD_W, CARD_H);
  ctx.lineTo(CARD_W, 0);
  ctx.closePath();
  ctx.fillStyle = p.isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(245, 166, 35, 0.06)';
  ctx.fill();
  ctx.restore();

  // Top & Bottom Gold & Crimson Ribbons
  const topRibbonGrad = ctx.createLinearGradient(0, 0, CARD_W, 0);
  topRibbonGrad.addColorStop(0, '#df1c2d');
  topRibbonGrad.addColorStop(0.5, '#f5a623');
  topRibbonGrad.addColorStop(1, '#2e1d87');
  ctx.fillStyle = topRibbonGrad;
  ctx.fillRect(0, 0, CARD_W, 12);
  ctx.fillRect(0, CARD_H - 10, CARD_W, 10);

  // Outer Luxury Gold Border Frame
  drawRoundRect(ctx, 22, 24, CARD_W - 44, CARD_H - 48, 22);
  ctx.strokeStyle = p.isLight ? '#cbd5e1' : 'rgba(245, 166, 35, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Top Header Row: Official DMC R ໄຊລາຊາ Emblem + Company Name
  drawDmcOfficialLogoOnCanvas(ctx, 84, 88, 44);

  ctx.textAlign = 'left';
  if (lang === 'LO') {
    ctx.fillStyle = p.isLight ? '#0f172a' : '#fde68a';
    ctx.font = `900 22px ${SANS_FONT}`;
    ctx.fillText(data.companyNameLo, 144, 74, 620);

    ctx.fillStyle = p.isLight ? '#df1c2d' : '#ffffff';
    ctx.font = `700 13.5px ${SANS_FONT}`;
    ctx.fillText(data.brandSubtitleLo, 144, 98, 620);
  } else if (lang === 'EN') {
    ctx.fillStyle = p.isLight ? '#0f172a' : '#fde68a';
    ctx.font = `900 21px ${SANS_FONT}`;
    ctx.fillText(data.companyNameEn, 144, 74, 620);

    ctx.fillStyle = p.isLight ? '#df1c2d' : '#ffffff';
    ctx.font = `800 12.5px ${SANS_FONT}`;
    ctx.fillText(data.brandSubtitleEn, 144, 96, 620);
  } else {
    // BOTH
    ctx.fillStyle = p.isLight ? '#0f172a' : '#fde68a';
    ctx.font = `900 19px ${SANS_FONT}`;
    ctx.fillText(data.companyNameLo, 144, 68, 620);

    ctx.fillStyle = p.isLight ? '#1e293b' : '#ffffff';
    ctx.font = `900 16px ${SANS_FONT}`;
    ctx.fillText(data.companyNameEn, 144, 91, 620);

    ctx.fillStyle = p.isLight ? '#df1c2d' : '#fbbf24';
    ctx.font = `700 11.5px ${SANS_FONT}`;
    ctx.fillText(data.brandSubtitleEn, 144, 111, 620);
  }

  // Member ID Badge Top Right
  drawRoundRect(ctx, CARD_W - 252, 46, 206, 44, 12);
  ctx.fillStyle = p.isLight ? '#0f172a' : 'rgba(245, 166, 35, 0.16)';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `800 10px ${MONO_FONT}`;
  ctx.fillText('OFFICIAL MEMBER ID', CARD_W - 149, 63);
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 15px ${MONO_FONT}`;
  ctx.fillText(data.memberId, CARD_W - 149, 82);
  ctx.textAlign = 'left';

  // Horizontal Gold Divider
  ctx.strokeStyle = p.isLight ? '#e2e8f0' : 'rgba(245, 166, 35, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(46, 142);
  ctx.lineTo(CARD_W - 46, 142);
  ctx.stroke();

  // Optional Avatar Portrait on Left or Executive Name Block
  let textLeftX = 52;
  if (data.avatarDataUrl) {
    const avatarImg = await loadImageElement(data.avatarDataUrl);
    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(106, 226, 48, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, 58, 178, 96, 96);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(106, 226, 49, 0, Math.PI * 2);
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 3.5;
      ctx.stroke();
      textLeftX = 172;
    }
  }

  // Executive / Member Name & Role
  const displayName =
    lang === 'LO'
      ? data.fullNameLo || data.fullNameEn
      : lang === 'EN'
      ? data.fullNameEn
      : `${data.fullNameEn} (${data.fullNameLo})`;

  ctx.fillStyle = p.textPrimary;
  ctx.font = `900 34px ${SANS_FONT}`;
  ctx.fillText(displayName, textLeftX, 198, 560);

  if (lang === 'BOTH') {
    ctx.fillStyle = p.isLight ? '#df1c2d' : '#fbbf24';
    ctx.font = `800 17px ${SANS_FONT}`;
    ctx.fillText(data.roleTitleEn, textLeftX, 227, 560);

    ctx.fillStyle = p.textMuted;
    ctx.font = `700 15px ${SANS_FONT}`;
    ctx.fillText(data.roleTitleLo, textLeftX, 251, 560);
  } else {
    ctx.fillStyle = p.isLight ? '#df1c2d' : '#fbbf24';
    ctx.font = `800 19px ${SANS_FONT}`;
    ctx.fillText(lang === 'LO' ? data.roleTitleLo : data.roleTitleEn, textLeftX, 232, 560);
  }

  // Contact Info Grid (Left Column)
  const contactStartY = 296;
  const contactItems = [
    {
      badge: 'TEL',
      label: lang === 'LO' ? 'ໂທລະສັບ / Hotline:' : 'Phone / Hotline:',
      value: `${data.phone}  •  WhatsApp: ${data.whatsapp}`,
    },
    {
      badge: 'WEB',
      label: lang === 'LO' ? 'ອີເມວ & ເວັບໄຊ:' : 'Email & Web:',
      value: `${data.email}  •  ${data.website}`,
    },
    {
      badge: 'LOC',
      label: lang === 'LO' ? 'ສຳນັກງານໃຫຍ່:' : 'Head Office:',
      value: lang === 'LO' ? data.addressLo : data.addressEn,
    },
    {
      badge: 'REG',
      label: lang === 'LO' ? 'ທະບຽນວິສາຫະກິດ:' : 'Statutory Reg:',
      value: data.taxAndRegInfo,
    },
  ];

  contactItems.forEach((item, idx) => {
    const ry = contactStartY + idx * 52;
    drawRoundRect(ctx, 52, ry, 650, 42, 10);
    ctx.fillStyle = p.isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)';
    ctx.fill();
    ctx.strokeStyle = p.isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Badge
    drawRoundRect(ctx, 60, ry + 7, 46, 28, 7);
    ctx.fillStyle = idx === 0 ? '#df1c2d' : idx === 1 ? '#2e1d87' : idx === 2 ? '#059669' : '#d97706';
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 11px ${MONO_FONT}`;
    ctx.fillText(item.badge, 83, ry + 25);
    ctx.textAlign = 'left';

    ctx.fillStyle = p.isLight ? '#64748b' : '#94a3b8';
    ctx.font = `700 12px ${SANS_FONT}`;
    ctx.fillText(item.label, 118, ry + 26);

    ctx.fillStyle = p.textPrimary;
    ctx.font = `800 14px ${SANS_FONT}`;
    ctx.fillText(item.value, 245, ry + 26, 445);
  });

  // Right Side QR Code Card Insert
  const qrBoxX = CARD_W - 295;
  const qrBoxY = 165;
  const qrBoxW = 245;
  const qrBoxH = 335;

  drawRoundRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Top Header inside QR Card
  drawRoundRect(ctx, qrBoxX + 12, qrBoxY + 12, qrBoxW - 24, 34, 10);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 12px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? 'ສະແກນສະໝັກສະມາຊິກ DMC' : 'SCAN TO JOIN DMC STUDIO',
    qrBoxX + qrBoxW / 2,
    qrBoxY + 34
  );

  // Draw QR Code Image
  const qrTargetSrc = data.customQrDataUrl || qrDataUrl;
  const qrImg = await loadImageElement(qrTargetSrc);
  if (qrImg) {
    ctx.drawImage(qrImg, qrBoxX + 25, qrBoxY + 54, 195, 195);
    if (!data.customQrDataUrl) {
      // Center mini logo inside auto QR
      drawDmcOfficialLogoOnCanvas(ctx, qrBoxX + qrBoxW / 2, qrBoxY + 151, 20);
    }
  }

  ctx.fillStyle = '#0f172a';
  ctx.font = `900 14px ${MONO_FONT}`;
  ctx.fillText(data.memberId, qrBoxX + qrBoxW / 2, qrBoxY + 272);

  ctx.fillStyle = '#df1c2d';
  ctx.font = `800 11.5px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO' ? 'ບັດສະມາຊິກ & ຜູ້ແນະນຳທາງການ' : 'OFFICIAL SPONSOR & MEMBER QR',
    qrBoxX + qrBoxW / 2,
    qrBoxY + 294
  );

  ctx.fillStyle = '#64748b';
  ctx.font = `700 10.5px ${SANS_FONT}`;
  ctx.fillText('BCEL • PSVB • LDB • JDB • VIETIN', qrBoxX + qrBoxW / 2, qrBoxY + 315);
  ctx.textAlign = 'left';

  // Bottom Footer Slogan Bar
  drawRoundRect(ctx, 48, CARD_H - 68, CARD_W - 96, 34, 10);
  ctx.fillStyle = p.isLight ? '#0f172a' : 'rgba(223, 28, 45, 0.22)';
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = `800 13px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? data.sloganLo
      : lang === 'EN'
      ? data.sloganEn
      : `${data.sloganLo}  •  ${data.sloganEn}`,
    CARD_W / 2,
    CARD_H - 46,
    CARD_W - 120
  );
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
}

async function renderBackBusinessCardCanvas(
  data: BusinessCardData,
  theme: BusinessCardTheme,
  lang: BusinessCardLanguage,
  qrDataUrl: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const p = getCardPalette(theme);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bgGrad.addColorStop(0, p.bgEnd);
  bgGrad.addColorStop(0.5, p.bgMid);
  bgGrad.addColorStop(1, p.bgStart);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Top & Bottom Gold & Crimson Ribbons
  const topRibbonGrad = ctx.createLinearGradient(0, 0, CARD_W, 0);
  topRibbonGrad.addColorStop(0, '#2e1d87');
  topRibbonGrad.addColorStop(0.5, '#f5a623');
  topRibbonGrad.addColorStop(1, '#df1c2d');
  ctx.fillStyle = topRibbonGrad;
  ctx.fillRect(0, 0, CARD_W, 12);
  ctx.fillRect(0, CARD_H - 10, CARD_W, 10);

  // Outer Luxury Gold Border Frame
  drawRoundRect(ctx, 22, 24, CARD_W - 44, CARD_H - 48, 22);
  ctx.strokeStyle = p.isLight ? '#cbd5e1' : 'rgba(245, 166, 35, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Left Emblem & Corporate Identity Column
  drawRoundRect(ctx, 48, 52, 340, CARD_H - 104, 20);
  ctx.fillStyle = p.isLight ? '#0f172a' : 'rgba(15, 23, 42, 0.78)';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Large Official DMC R ໄຊລາຊາ Emblem centered in Left Column
  drawDmcOfficialLogoOnCanvas(ctx, 218, 175, 84);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fde68a';
  ctx.font = `900 22px ${SANS_FONT}`;
  ctx.fillText('DMC XAYRAXA', 218, 292);

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 15px ${SANS_FONT}`;
  ctx.fillText('ບໍລິສັດ ດີເອັມຊີ ໄຊຣາຊາ ບັນເທີງ', 218, 318);

  ctx.fillStyle = '#fbbf24';
  ctx.font = `700 11.5px ${SANS_FONT}`;
  ctx.fillText('DIGITAL MUSIC CENTER LAO PDR', 218, 342);

  // Mini QR inside Left Column Bottom
  const qrTargetSrc = data.customQrDataUrl || qrDataUrl;
  const qrImg = await loadImageElement(qrTargetSrc);
  if (qrImg) {
    drawRoundRect(ctx, 158, 362, 120, 120, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.drawImage(qrImg, 166, 370, 104, 104);
  }

  ctx.fillStyle = '#94a3b8';
  ctx.font = `700 11px ${MONO_FONT}`;
  ctx.fillText(`ID: ${data.memberId} • ${data.website}`, 218, 506);
  ctx.textAlign = 'left';

  // Right Column: Core Ecosystem Pillars & 1,600,000 LAK Package Summary
  const rightX = 416;
  const rightW = CARD_W - rightX - 48;

  ctx.fillStyle = p.isLight ? '#df1c2d' : '#fbbf24';
  ctx.font = `900 14px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ບໍລິການຫຼັກ ແລະ ສິດທິປະໂຫຍດສະມາຊິກຕະຫຼອດຊີບ'
      : 'OFFICIAL STUDIO SERVICES & UNILEVEL REWARDS',
    rightX,
    78
  );

  ctx.fillStyle = p.textPrimary;
  ctx.font = `900 22px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ແພັກເກັດເພງສ່ວນຕົວ & ສະມາຊິກຕະຫຼອດຊີບ 1,600,000 ກີບ'
      : '1,600,000 LAK Lifetime Studio Song Package',
    rightX,
    108,
    rightW
  );

  const servicesList =
    lang === 'LO'
      ? data.backServicesLo
      : lang === 'EN'
      ? data.backServicesEn
      : data.backServicesLo.map((lo, idx) => `${lo} (${data.backServicesEn[idx] || ''})`);

  servicesList.slice(0, 4).forEach((srv, idx) => {
    const sy = 132 + idx * 72;
    drawRoundRect(ctx, rightX, sy, rightW, 58, 12);
    ctx.fillStyle = p.isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.65)';
    ctx.fill();
    ctx.strokeStyle = p.isLight ? '#cbd5e1' : 'rgba(245, 166, 35, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Number badge
    drawRoundRect(ctx, rightX + 12, sy + 13, 32, 32, 8);
    ctx.fillStyle = idx % 2 === 0 ? '#df1c2d' : '#2e1d87';
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 13px ${MONO_FONT}`;
    ctx.fillText(`0${idx + 1}`, rightX + 28, sy + 34);
    ctx.textAlign = 'left';

    if (lang === 'BOTH') {
      ctx.fillStyle = p.textPrimary;
      ctx.font = `800 13.5px ${SANS_FONT}`;
      ctx.fillText(data.backServicesLo[idx] || srv, rightX + 56, sy + 25, rightW - 70);

      ctx.fillStyle = p.textMuted;
      ctx.font = `600 11.5px ${SANS_FONT}`;
      ctx.fillText(data.backServicesEn[idx] || '', rightX + 56, sy + 45, rightW - 70);
    } else {
      ctx.fillStyle = p.textPrimary;
      ctx.font = `800 14.5px ${SANS_FONT}`;
      ctx.fillText(srv, rightX + 56, sy + 34, rightW - 70);
    }
  });

  // Bottom Financial Split Highlight Box on Back Card
  const splitY = 432;
  drawRoundRect(ctx, rightX, splitY, rightW, 114, 16);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = `900 12.5px ${SANS_FONT}`;
  ctx.fillText(
    lang === 'LO'
      ? 'ໂຄງສ້າງການແບ່ງປັນຜົນປະໂຫຍດ 1,600,000 ກີບ (UNILEVEL 3 ຊັ້ນ):'
      : '1,600,000 LAK TRANSPARENT COMMISSION SPLIT (3 LEVELS):',
    rightX + 16,
    splitY + 26
  );

  const pills = [
    { label: 'DMC STUDIO', val: '900,000 LAK', color: '#38bdf8' },
    { label: 'L1 DIRECT (25%)', val: '400,000 LAK', color: '#4ade80' },
    { label: 'L2 SECOND (12.5%)', val: '200,000 LAK', color: '#fbbf24' },
    { label: 'L3 THIRD (6.25%)', val: '100,000 LAK', color: '#f472b6' },
  ];

  const pillW = (rightW - 44) / 4;
  pills.forEach((pl, i) => {
    const px = rightX + 14 + i * (pillW + 5);
    drawRoundRect(ctx, px, splitY + 40, pillW, 58, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#cbd5e1';
    ctx.font = `800 9.5px ${SANS_FONT}`;
    ctx.fillText(pl.label, px + pillW / 2, splitY + 60, pillW - 6);

    ctx.fillStyle = pl.color;
    ctx.font = `900 13px ${MONO_FONT}`;
    ctx.fillText(pl.val, px + pillW / 2, splitY + 84, pillW - 6);
  });
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/png');
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

function pngDataUrlToJpegDataUrl(pngDataUrl: string, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }
      resolve(c.toDataURL('image/jpeg', 0.96));
    };
    img.src = pngDataUrl;
  });
}

function buildMultiPagePdfFromJpegs(
  pages: { jpegBytes: Uint8Array; imgW: number; imgH: number; pdfW: number; pdfH: number }[]
): Blob {
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

  pushStr(`%PDF-1.4\n%\xFF\xFF\xFF\xFF\n`);

  startObj(1);
  pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
  endObj();

  const numPages = pages.length;
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
    const pg = pages[i];

    startObj(pageObjId);
    pushStr(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pg.pdfW} ${pg.pdfH}] /Resources << /XObject << /Im${i} ${imageObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
    );
    endObj();

    const contentStream = `q\n${pg.pdfW} 0 0 ${pg.pdfH} 0 0 cm\n/Im${i} Do\nQ\n`;
    const contentBytes = encoder.encode(contentStream);
    startObj(contentObjId);
    pushStr(`<< /Length ${contentBytes.length} >>\nstream\n`);
    pushBytes(contentBytes);
    pushStr(`\nendstream`);
    endObj();

    startObj(imageObjId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width ${pg.imgW} /Height ${pg.imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.jpegBytes.length} >>\nstream\n`
    );
    pushBytes(pg.jpegBytes);
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

  return new Blob(chunks, { type: 'application/pdf' });
}

async function renderA4PrintSheetJpeg(frontPng: string, backPng: string, titleText: string): Promise<string> {
  const A4_W = 1240;
  const A4_H = 1754;
  const canvas = document.createElement('canvas');
  canvas.width = A4_W;
  canvas.height = A4_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, A4_W, A4_H);

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.font = `900 22px ${SANS_FONT}`;
  ctx.fillText('DMC XAYRAXA — A4 COMMERCIAL BUSINESS CARD PRINT SHEET (8 CARDS • 3.5" × 2.0")', 60, 52);

  ctx.fillStyle = '#64748b';
  ctx.font = `700 13px ${SANS_FONT}`;
  ctx.fillText(
    `${titleText} • Left Column: FRONT CARDS (x4) • Right Column: BACK CARDS (x4) • Trim along crop marks`,
    60,
    76
  );

  const frontImg = await loadImageElement(frontPng);
  const backImg = await loadImageElement(backPng);

  const cardPrintW = 525;
  const cardPrintH = 300;
  const startXLeft = 75;
  const startXRight = 640;
  const startY = 110;
  const gapY = 95;

  for (let row = 0; row < 4; row++) {
    const y = startY + row * (cardPrintH + gapY);

    // Draw Left (Front) & Right (Back)
    [
      { x: startXLeft, img: frontImg, label: `CARD #${row + 1} — FRONT SIDE (ດ້ານໜ້າ)` },
      { x: startXRight, img: backImg, label: `CARD #${row + 1} — BACK SIDE (ດ້ານຫຼັງ)` },
    ].forEach((slot) => {
      ctx.fillStyle = '#475569';
      ctx.font = `800 11px ${MONO_FONT}`;
      ctx.fillText(slot.label, slot.x, y - 10);

      if (slot.img) {
        ctx.drawImage(slot.img, slot.x, y, cardPrintW, cardPrintH);
      }

      // Printer Crop Marks at all 4 corners
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      const m = 14;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(slot.x - m, y);
      ctx.lineTo(slot.x - 3, y);
      ctx.moveTo(slot.x, y - m);
      ctx.lineTo(slot.x, y - 3);
      // Top-right
      ctx.moveTo(slot.x + cardPrintW + 3, y);
      ctx.lineTo(slot.x + cardPrintW + m, y);
      ctx.moveTo(slot.x + cardPrintW, y - m);
      ctx.lineTo(slot.x + cardPrintW, y - 3);
      // Bottom-left
      ctx.moveTo(slot.x - m, y + cardPrintH);
      ctx.lineTo(slot.x - 3, y + cardPrintH);
      ctx.moveTo(slot.x, y + cardPrintH + 3);
      ctx.lineTo(slot.x, y + cardPrintH + m);
      // Bottom-right
      ctx.moveTo(slot.x + cardPrintW + 3, y + cardPrintH);
      ctx.lineTo(slot.x + cardPrintW + m, y + cardPrintH);
      ctx.moveTo(slot.x + cardPrintW, y + cardPrintH + 3);
      ctx.lineTo(slot.x + cardPrintW, y + cardPrintH + m);
      ctx.stroke();
    });
  }

  return canvas.toDataURL('image/jpeg', 0.96);
}

export const AdminBusinessCardStudio: React.FC = () => {
  const { allMembers, superAdminProfile } = useDmc();

  const [cardData, setCardData] = useState<BusinessCardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_BUSINESS_CARD_DATA, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_BUSINESS_CARD_DATA;
  });

  const [cardTheme, setCardTheme] = useState<BusinessCardTheme>('ROYAL_GOLD_DARK');
  const [cardLang, setCardLang] = useState<BusinessCardLanguage>('BOTH');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string>('');
  const [backPreviewUrl, setBackPreviewUrl] = useState<string>('');
  const [zoomSide, setZoomSide] = useState<'FRONT' | 'BACK' | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardData));
    } catch {
      // ignore
    }
  }, [cardData]);

  // Generate QR code whenever memberId or website changes
  useEffect(() => {
    const payload = `https://dmcxayraxa.la/register?sponsor=${encodeURIComponent(
      cardData.memberId
    )}&name=${encodeURIComponent(cardData.fullNameEn)}&tel=${encodeURIComponent(cardData.phone)}`;

    QRCode.toDataURL(payload, {
      width: 420,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [cardData.memberId, cardData.fullNameEn, cardData.phone]);

  // Render Front & Back canvases live
  useEffect(() => {
    let cancelled = false;
    async function updatePreviews() {
      const front = await renderFrontBusinessCardCanvas(cardData, cardTheme, cardLang, qrDataUrl);
      const back = await renderBackBusinessCardCanvas(cardData, cardTheme, cardLang, qrDataUrl);
      if (!cancelled) {
        setFrontPreviewUrl(front);
        setBackPreviewUrl(back);
      }
    }
    updatePreviews();
    return () => {
      cancelled = true;
    };
  }, [cardData, cardTheme, cardLang, qrDataUrl]);

  const handleSelectPresetMember = (memberId: string) => {
    if (memberId === 'CEO_XAYRAXA') {
      setCardData(DEFAULT_BUSINESS_CARD_DATA);
      showToast('Loaded Founder & CEO (Xay Raxa • DMC-LA-00101) Business Card!');
      return;
    }
    if (memberId === 'SUPER_ADMIN') {
      setCardData((prev) => ({
        ...prev,
        fullNameEn: superAdminProfile.name.toUpperCase(),
        fullNameLo: 'ຜູ້ບໍລິຫານລະບົບສູງສຸດ DMC',
        roleTitleEn: superAdminProfile.roleTitle,
        roleTitleLo: 'ຜູ້ຄວບຄຸມລະບົບສູງສຸດ ແລະ ບໍລິຫານທົ່ວໄປ',
        memberId: superAdminProfile.operatorId,
        phone: superAdminProfile.phone,
        email: superAdminProfile.email,
      }));
      showToast(`Loaded Super Admin (${superAdminProfile.operatorId}) Business Card!`);
      return;
    }
    const found = allMembers.find((m) => m.memberId === memberId);
    if (found) {
      const cleanName = found.name.replace(/\s*\(.*?\)\s*/g, '').trim();
      const isLifetime = found.membershipState === 'ACTIVE_LIFETIME_MEMBER';
      setCardData((prev) => ({
        ...prev,
        fullNameEn: cleanName.toUpperCase(),
        fullNameLo: cleanName,
        roleTitleEn: found.isOriginAccount
          ? 'Founder & Chief Executive Officer (CEO)'
          : isLifetime
          ? 'Active Lifetime Member & Official Music Creator'
          : 'Registered Member & Brand Ambassador',
        roleTitleLo: found.isOriginAccount
          ? 'ຜູ້ກໍ່ຕັ້ງ ແລະ ປະທານຜູ້ບໍລິຫານສູງສຸດ'
          : isLifetime
          ? 'ສະມາຊິກຕະຫຼອດຊີບ ແລະ ຜູ້ສ້າງສັນຜົນງານເພງ'
          : 'ສະມາຊິກ DMC Xayraxa ຢ່າງເປັນທາງການ',
        memberId: found.memberId,
        phone: found.phone,
        whatsapp: found.phone,
        email: found.email || `${found.memberId.toLowerCase()}@dmcxayraxa.la`,
        avatarDataUrl: found.avatarUrl || '',
      }));
      showToast(`Loaded Business Card for ${found.name} (${found.memberId})!`);
    }
  };

  const handleDownloadFrontBackPdf = async () => {
    if (!frontPreviewUrl || !backPreviewUrl) return;
    setIsExporting(true);
    try {
      const frontJpeg = await pngDataUrlToJpegDataUrl(frontPreviewUrl, CARD_W, CARD_H);
      const backJpeg = await pngDataUrlToJpegDataUrl(backPreviewUrl, CARD_W, CARD_H);
      const blob = buildMultiPagePdfFromJpegs([
        {
          jpegBytes: dataUrlToUint8Array(frontJpeg),
          imgW: CARD_W,
          imgH: CARD_H,
          pdfW: 504, // 7 in x 72pt proportional landscape card page
          pdfH: 288,
        },
        {
          jpegBytes: dataUrlToUint8Array(backJpeg),
          imgW: CARD_W,
          imgH: CARD_H,
          pdfW: 504,
          pdfH: 288,
        },
      ]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `1_DMC_Xayraxa_Business_Cards_${cardData.memberId}_Front_Back.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast(
        `Downloaded Front & Back Business Card PDF (1_DMC_Xayraxa_Business_Cards_${cardData.memberId}_Front_Back.pdf)!`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadA4PrintSheetPdf = async () => {
    if (!frontPreviewUrl || !backPreviewUrl) return;
    setIsExporting(true);
    try {
      const sheetJpeg = await renderA4PrintSheetJpeg(
        frontPreviewUrl,
        backPreviewUrl,
        `${cardData.fullNameEn} (${cardData.memberId})`
      );
      const blob = buildMultiPagePdfFromJpegs([
        {
          jpegBytes: dataUrlToUint8Array(sheetJpeg),
          imgW: 1240,
          imgH: 1754,
          pdfW: 595.28,
          pdfH: 841.89,
        },
      ]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `1_DMC_Xayraxa_Business_Cards_A4_Print_Sheet_${cardData.memberId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      showToast(
        `Downloaded A4 8-Card Commercial Print Sheet PDF (1_DMC_Xayraxa_Business_Cards_A4_Print_Sheet_${cardData.memberId}.pdf)!`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPng = (side: 'FRONT' | 'BACK') => {
    const targetUrl = side === 'FRONT' ? frontPreviewUrl : backPreviewUrl;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `DMC_Business_Card_${cardData.memberId}_${side}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded High-Res ${side} Business Card PNG!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-600 text-slate-950 font-black flex items-center justify-center shadow-lg shrink-0">
              <CreditCard className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  1/ ADMINISTRATOR BUSINESS CARD STUDIO
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  300 DPI • FRONT & BACK + A4 8-CARD PRINT SHEET (.PDF & .PNG)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                1/ Design Business Cards — DMC Xayraxa Executive & Member Card Studio
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ອອກແບບນາມບັດບໍລິຫານ ແລະ ສະມາຊິກ DMC Xayraxa (ດ້ານໜ້າ & ດ້ານຫຼັງ) ພ້ອມໂລໂກ້ DMC R ໄຊລາຊາ, QR Code ແລະ ດາວໂຫຼດໄຟລ໌ PDF / PNG
              </p>
            </div>
          </div>

          {/* 1-Click PDF & PNG Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadFrontBackPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Business Card PDF (Front & Back)</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadA4PrintSheetPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Download A4 Print Sheet (8 Cards .PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPng('FRONT')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Front .PNG</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadPng('BACK')}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Back .PNG</span>
            </button>
          </div>
        </div>

        {/* Theme, Language & Member Quick-Fill Toolbar */}
        <div className="pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
          {/* 4 Luxury Card Themes */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Theme:</span>
            </span>
            {[
              { id: 'ROYAL_GOLD_DARK' as BusinessCardTheme, label: 'Royal Gold & Obsidian' },
              { id: 'CRIMSON_IMPERIAL' as BusinessCardTheme, label: 'DMC Crimson & Navy' },
              { id: 'EXECUTIVE_PEARL_WHITE' as BusinessCardTheme, label: 'Executive Pearl White' },
              { id: 'EMERALD_FINTECH' as BusinessCardTheme, label: 'Emerald & Gold' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setCardTheme(th.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  cardTheme === th.id
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language:</span>
            </span>
            {[
              { id: 'BOTH' as BusinessCardLanguage, label: '🇱🇦+🇬🇧 ລາວ + EN' },
              { id: 'LO' as BusinessCardLanguage, label: '🇱🇦 ພາສາລາວ' },
              { id: 'EN' as BusinessCardLanguage, label: '🇬🇧 English' },
            ].map((lg) => (
              <button
                key={lg.id}
                type="button"
                onClick={() => setCardLang(lg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  cardLang === lg.id
                    ? 'bg-[#df1c2d] text-white shadow'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {lg.label}
              </button>
            ))}
          </div>
        </div>

        {notice && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Live Front & Back High-Resolution Business Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FRONT CARD PREVIEW */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                FRONT SIDE • ດ້ານໜ້າຂອງນາມບັດ
              </span>
              <h4 className="text-sm font-bold text-white mt-1">
                Executive Identity, Official DMC R Logo & Sponsor QR Code
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomSide('FRONT')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Zoom</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPng('FRONT')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          <div
            onClick={() => setZoomSide('FRONT')}
            className="rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 cursor-pointer group relative"
          >
            {frontPreviewUrl ? (
              <img
                src={frontPreviewUrl}
                alt="Business Card Front Preview"
                className="w-full h-auto block"
              />
            ) : (
              <div className="aspect-[1050/600] flex items-center justify-center text-slate-400 text-xs">
                Rendering Front Business Card...
              </div>
            )}
          </div>
        </div>

        {/* BACK CARD PREVIEW */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                BACK SIDE • ດ້ານຫຼັງຂອງນາມບັດ
              </span>
              <h4 className="text-sm font-bold text-white mt-1">
                Studio Services, 1,600,000 LAK Split & Official Brand Seal
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoomSide('BACK')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Zoom</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadPng('BACK')}
                className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          <div
            onClick={() => setZoomSide('BACK')}
            className="rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 cursor-pointer group relative"
          >
            {backPreviewUrl ? (
              <img
                src={backPreviewUrl}
                alt="Business Card Back Preview"
                className="w-full h-auto block"
              />
            ) : (
              <div className="aspect-[1050/600] flex items-center justify-center text-slate-400 text-xs">
                Rendering Back Business Card...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Card Customizer & Member Auto-Fill Editor */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-base font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Customize Business Card Details, Portrait Photo & QR Code</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any executive or member below to auto-fill, or customize every line on the Front & Back cards.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              onChange={(e) => handleSelectPresetMember(e.target.value)}
              defaultValue="CEO_XAYRAXA"
              className="bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-200 font-bold"
            >
              <option value="CEO_XAYRAXA">★ Founder & CEO: Xay Raxa (DMC-LA-00101)</option>
              <option value="SUPER_ADMIN">★ Super Admin ({superAdminProfile.operatorId})</option>
              {allMembers.map((m) => (
                <option key={m.memberId} value={m.memberId}>
                  {m.memberId} — {m.name} ({m.membershipState})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setCardData(DEFAULT_BUSINESS_CARD_DATA);
                showToast('Reset Business Card to Default Executive Template!');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Executive / Member Name (English)
            </label>
            <input
              type="text"
              value={cardData.fullNameEn}
              onChange={(e) => setCardData({ ...cardData, fullNameEn: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              ຊື່ ແລະ ນາມສະກຸນ (ພາສາລາວ)
            </label>
            <input
              type="text"
              value={cardData.fullNameLo}
              onChange={(e) => setCardData({ ...cardData, fullNameLo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Official Member ID / Code
            </label>
            <input
              type="text"
              value={cardData.memberId}
              onChange={(e) => setCardData({ ...cardData, memberId: e.target.value.toUpperCase() })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Position / Role Title (English)
            </label>
            <input
              type="text"
              value={cardData.roleTitleEn}
              onChange={(e) => setCardData({ ...cardData, roleTitleEn: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              ຕຳແໜ່ງ (ພາສາລາວ)
            </label>
            <input
              type="text"
              value={cardData.roleTitleLo}
              onChange={(e) => setCardData({ ...cardData, roleTitleLo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Phone / Hotline (+856 20)
            </label>
            <input
              type="text"
              value={cardData.phone}
              onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={cardData.whatsapp}
              onChange={(e) => setCardData({ ...cardData, whatsapp: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Official Email
            </label>
            <input
              type="text"
              value={cardData.email}
              onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Website / App Domain
            </label>
            <input
              type="text"
              value={cardData.website}
              onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Head Office Address (English & Lao)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={cardData.addressEn}
                onChange={(e) => setCardData({ ...cardData, addressEn: e.target.value })}
                placeholder="English Address"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="text"
                value={cardData.addressLo}
                onChange={(e) => setCardData({ ...cardData, addressLo: e.target.value })}
                placeholder="ທີ່ຢູ່ພາສາລາວ"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Upload Portrait Photo & Custom QR (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-center cursor-pointer flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => {
                      if (typeof r.result === 'string') {
                        setCardData((prev) => ({ ...prev, avatarDataUrl: r.result as string }));
                        showToast('Uploaded Portrait Photo onto Business Card!');
                      }
                    };
                    r.readAsDataURL(f);
                  }}
                />
              </label>

              <label className="flex-1 py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-center cursor-pointer flex items-center justify-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>Custom QR</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = () => {
                      if (typeof r.result === 'string') {
                        setCardData((prev) => ({ ...prev, customQrDataUrl: r.result as string }));
                        showToast('Uploaded Custom QR Code onto Business Card!');
                      }
                    };
                    r.readAsDataURL(f);
                  }}
                />
              </label>

              {(cardData.avatarDataUrl || cardData.customQrDataUrl) && (
                <button
                  type="button"
                  onClick={() =>
                    setCardData((prev) => ({ ...prev, avatarDataUrl: '', customQrDataUrl: '' }))
                  }
                  className="p-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 cursor-pointer"
                  title="Clear Custom Photo & QR"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {zoomSide && (
        <div
          onClick={() => setZoomSide(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-white">
                DMC Xayraxa Business Card — {zoomSide === 'FRONT' ? 'FRONT SIDE' : 'BACK SIDE'} (300 DPI)
              </h4>
              <button
                type="button"
                onClick={() => setZoomSide(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={zoomSide === 'FRONT' ? frontPreviewUrl : backPreviewUrl}
              alt="Zoomed Business Card"
              className="w-full h-auto rounded-2xl border border-amber-500/30 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
