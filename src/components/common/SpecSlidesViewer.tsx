/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * STEP-BY-STEP MASTER SUMMARY, PDF DOCUMENT INVENTORY & SPECIFICATION VIEWER
 *
 * Includes:
 * 1. Step-by-Step Inventory of All 5 Official PDFs / Printable Documents Created in the App
 * 2. Complete 12-Step Build & Workflow Summary of the DMC Xayraxa Super App
 * 3. Original 5-Slide Architecture Specification Deck
 * 4. Real Multi-Page A4 PDF Generator (.pdf download) + Vector Print-to-PDF
 */

import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Printer,
  ListChecks,
  Presentation,
  Award,
  QrCode,
  Receipt,
  BookOpen,
  Sparkles,
  Loader2,
  Layers,
  Lock,
  Users,
  Wallet,
  Music,
} from 'lucide-react';
import { DmcOfficialLogo, drawDmcOfficialLogoOnCanvas } from './DmcLogo';

interface SpecSlidesViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PdfDocumentSummaryItem {
  pdfNumber: number;
  title: string;
  titleLao: string;
  moduleLocation: string;
  formatSpec: string;
  purpose: string;
  stepsToGenerate: string[];
  colorClass: string;
}

export interface AppBuildStepItem {
  stepNumber: number;
  title: string;
  moduleName: string;
  summary: string;
  keyFeatures: string[];
  status: 'COMPLETED';
}

export const PDF_DOCUMENTS_INVENTORY: PdfDocumentSummaryItem[] = [
  {
    pdfNumber: 1,
    title: 'Official Classical Conservatory Copyright Certificate (Diploma PDF / Print)',
    titleLao: 'ໃບຢັ້ງຢືນການຈົດທະບຽນລິຂະສິດບົດເພງ ແລະ ມາສເຕີສຽງດົນຕີ (Law No. 38/NA)',
    moduleLocation: 'Home Screen / Music Hub / Academy → "Copyright Certificate"',
    formatSpec: 'A4 Landscape Print-to-PDF & Ultra-HD 1920×1357 Master PNG',
    purpose:
      'Certifies 100% Master Recording, Publishing & Sync Royalties with Official DMC R Crest, 24K Gold Wax Seal, ISRC Code, SHA-256 QR, and Xay Raxa Signature.',
    stepsToGenerate: [
      'Step 1: Click "Certificate" on the Member Card (Home Screen) or inside Music Hub / Academy.',
      'Step 2: Select Conservatory Theme (Royal Crimson & Gold, Symphonic Indigo, Emerald, or Onyx) and Song Title.',
      'Step 3: Click "Print" (Save as PDF) or "Download Certificate (PNG)" for instant high-resolution export.',
    ],
    colorClass: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
  },
  {
    pdfNumber: 2,
    title: 'Official Lao Bank QR Payment & Verified Tax/Activation Receipt PDF',
    titleLao: 'ໃບບິນຢັ້ງຢືນການຊຳລະເງິນ LAO QR (BCEL One / LDB Trust / JDB Yes / APB)',
    moduleLocation: 'Home Screen ("Activate Now") / Membership / Music Hub / Wallet',
    formatSpec: 'A4 / Thermal Receipt Print-to-PDF with Official Bank Transaction Reference',
    purpose:
      'Provides an official payment voucher and verified settlement receipt for the 1,600,000 LAK Lifetime Music Package or studio instrument orders.',
    stepsToGenerate: [
      'Step 1: Click "Activate 1,600,000 LAK" or "Buy with Bank QR" on any of the 4 Featured Products.',
      'Step 2: Select Lao Partner Bank (BCEL One, LDB, JDB, APB, Maruhan, BIC, Indochina, or Sacombank).',
      'Step 3: Scan EMVCo Lao QR or upload/confirm payment slip ("I Already Paid Yesterday") to generate the verified receipt.',
    ],
    colorClass: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
  },
  {
    pdfNumber: 3,
    title: 'Digital Member Identity Card & Dual Scannable QR Pass (Identity + Referral)',
    titleLao: 'ບັດສະມາຊິກດິຈິຕອນ ແລະ ລະຫັດ QR ແນະນຳສະມາຊິກ 3 ຊັ້ນ (L1 / L2 / L3)',
    moduleLocation: 'Home Screen → Member Card ("Member QR" & "Referral QR")',
    formatSpec: 'High-Contrast Printable QR Pass & Downloadable PNG/PDF Badge',
    purpose:
      'Separates Personal Member Verification QR (`dmc://member/...`) from Sponsor Referral Recruitment QR (`?ref=DMC-LA-...`) per Rev 2.6 Unified Identity rules.',
    stepsToGenerate: [
      'Step 1: On the Home Screen Member Card, click "Member QR" or "Referral QR".',
      'Step 2: View cryptographic payload, Member ID, and Sponsor Tree binding.',
      'Step 3: Download or print the QR Pass for studio check-in or new member onboarding.',
    ],
    colorClass: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
  },
  {
    pdfNumber: 4,
    title: 'Double-Entry Wallet Ledger & Four-Eyes Bank Payout Audit Statement PDF',
    titleLao: 'ໃບລາຍງານບັນຊີກະເປົາເງິນຄູ່ (Integer LAK Ledger) ແລະ ການຖອນເງິນຜ່ານທະນາຄານ',
    moduleLocation: 'Wallet Screen & Super Admin Portal → Ledger / Withdrawal Queue',
    formatSpec: 'Structured Financial Audit Table (Print / Save as PDF)',
    purpose:
      'Documents every integer LAK debit/credit across Pending, Held for Qualification (1.6M LAK), Available, and Maker/Checker Bank Payouts.',
    stepsToGenerate: [
      'Step 1: Open the "Wallet" tab or "Administrator Login" → Super Admin Portal.',
      'Step 2: Filter ledger entries or inspect Four-Eyes (Maker/Checker) withdrawal requests.',
      'Step 3: Export or print the authoritative financial statement for accounting compliance.',
    ],
    colorClass: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
  },
  {
    pdfNumber: 5,
    title: 'DMC Xayraxa Rev 2.6 Master Step-by-Step System Summary & UI Specification PDF',
    titleLao: 'ເອກະສານສະຫຼຸບຂັ້ນຕອນການສ້າງລະບົບທັງໝົດ 12 ຂັ້ນຕອນ ແລະ ມາດຕະຖານ Rev 2.6 (PDF)',
    moduleLocation: 'Top Header Toolbar → "Step-by-Step PDF Summary" (This Window)',
    formatSpec: '2-Page A4 Portrait Native PDF File (`DMC_Xayraxa_Step_By_Step_Summary.pdf`)',
    purpose:
      'Complete executive summary of all 5 PDF documents and all 12 functional modules built across the DMC Xayraxa Super App.',
    stepsToGenerate: [
      'Step 1: Open this "Step-by-Step PDF Summary & Spec Deck" window from the top bar.',
      'Step 2: Review the 5 PDF Documents Inventory and the 12-Step System Build Summary below.',
      'Step 3: Click "Download Summary PDF (.pdf)" in the top-right corner to save the 2-page A4 PDF file.',
    ],
    colorClass: 'border-rose-500/40 bg-rose-950/20 text-rose-300',
  },
];

export const APP_BUILD_STEPS: AppBuildStepItem[] = [
  {
    stepNumber: 1,
    title: 'Classic Windows-Style User & Super Administrator Login Portal',
    moduleName: 'AuthPortalModal.tsx',
    summary:
      'Classic navy-and-gold desktop dialog with clean tabs for Member Login, Administrator Login, New Member Registration, and +856 SMS OTP Recovery.',
    keyFeatures: [
      'Direct Username / Member ID / Phone (+856) & Password/PIN login (with Quick Select & Admin Department fields hidden as requested)',
      'Instant 6-Digit PIN Demo Fillers & Show/Hide Password toggle',
      'Unitel, Lao Telecom, ETL, and TPlus SMS OTP password reset flow',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 2,
    title: 'Home Dashboard & Digital Member Card with Circle Profile Image',
    moduleName: 'HomeScreen.tsx',
    summary:
      'Royal crimson & gold mobile/expanded dashboard featuring the circular artist profile avatar, camera upload button, and real-time qualification tracker.',
    keyFeatures: [
      'Circular Profile Avatar with live custom photo upload & Gold Crown badge',
      'Active Lifetime vs. Free Member status badge + 1,600,000 LAK progress bar',
      '3 Wallet Summary Tiles (Qualification Held, Available LAK, Pending)',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 3,
    title: 'Featured Banner Products Carousel & 4-Product (2×2) Showcase Grid',
    moduleName: 'HomeScreen.tsx (Section 4)',
    summary:
      'Auto-playing hero product banner carousel plus a clean 2×2 grid displaying strictly the 4 core products (with the 5th item and Logistics section removed).',
    keyFeatures: [
      '1. DMC Xayraxa Single Song Production Package (1,600,000 LAK)',
      '2. DMC Signature Solid-Top Acoustic Guitar (4,800,000 LAK)',
      '3. DMC Studio Custom Electric Guitar (6,500,000 LAK)',
      '4. DMC Vocal Studio Condenser Mic Kit (2,900,000 LAK)',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 4,
    title: 'Dual Activation Engine (Direct Cash vs. Auto-Redeem at 1,600,000 LAK)',
    moduleName: 'MembershipScreen.tsx & DmcContext.tsx',
    summary:
      'Supports zero-fee member onboarding and two paths to Active Lifetime Membership with 1 Full Studio Song Production Entitlement.',
    keyFeatures: [
      'Method 1: Direct 1,600,000 LAK payment (emits L1/L2/L3 commissions)',
      'Method 2: Auto-Redemption when Held commissions reach 1,600,000 LAK (zero new commission emitted)',
      'Full Terms & Auto-Redeem Consent version tracking',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 5,
    title: 'Lao Bank QR Payment Gateway & "I Already Paid Yesterday" Slip Verification',
    moduleName: 'BankQrPaymentModal.tsx',
    summary:
      'Supports 8 major banks in Lao PDR with EMVCo QR generation and a dedicated "I Already Paid (Yesterday / Previous Transfer)" fast-track verification mode.',
    keyFeatures: [
      'BCEL One, LDB Trust, JDB Yes, APB, Maruhan, BIC, Indochina & Sacombank',
      '"I Already Paid Yesterday" date selector, transfer reference input & slip upload',
      'Instant activation & printable official payment receipt',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 6,
    title: 'Deterministic 3-Level Unilevel Sponsor Tree (L1 / L2 / L3 — No Binary)',
    moduleName: 'NetworkScreen.tsx',
    summary:
      'Strictly enforces the 3-Level Unilevel Genealogy invariant (L1: 400,000 LAK, L2: 200,000 LAK, L3: 100,000 LAK) with zero binary or spillover logic.',
    keyFeatures: [
      'Visual L1, L2, and L3 downline tree explorer with member search',
      'Automatic routing of missing upline tiers to DMC UNALLOCATED account',
      'One-click simulation of downline package purchases to test commission flow',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 7,
    title: 'Authoritative Integer-LAK Double-Entry Wallet & Bank Withdrawal System',
    moduleName: 'WalletScreen.tsx',
    summary:
      'Manages 5 segregated integer-LAK ledger buckets and bank withdrawal requests with Maker/Checker governance.',
    keyFeatures: [
      'Segregated Pending, Held for Qualification, Available, Held for Withdrawal & Recovery Due',
      'Multi-bank payout destination manager (BCEL, LDB, JDB)',
      'Full double-entry transaction ledger with debit/credit audit trail',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 8,
    title: 'Music Hub, Studio Production Tracker & E-Commerce Catalog',
    moduleName: 'CatalogScreen.tsx',
    summary:
      'Tracks active studio song production stages (Arranging, Vocal Recording, Mixing/Mastering, Released) and studio equipment orders.',
    keyFeatures: [
      'Live progress bars for member song production projects in Vientiane Studio',
      'Commission pool breakdown per SKU (L1 50%, L2 30%, L3 20%)',
      'Direct integration with Lao Bank QR checkout & Copyright Certificate issuance',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 9,
    title: 'DMC Music Academy & Conservatory Curriculum Portal',
    moduleName: 'AcademyScreen.tsx',
    summary:
      'Provides vocal training, traditional Lao Khene & classical symphony arrangement courses, and music business masterclasses.',
    keyFeatures: [
      'Interactive course modules with progress tracking & video/audio lesson previews',
      'Direct access to Classical Conservatory Diploma & Copyright Certificate',
      'Multilingual support (Lao, English, Thai, Vietnamese, Chinese, Korean)',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 10,
    title: 'AI DMC Songwriting, Lyricist & Studio Arrangement Studio',
    moduleName: 'AiDmcScreen.tsx',
    summary:
      'Assists artists with Lao/English lyric composition, chord progressions, tempo/key selection, and studio production briefs.',
    keyFeatures: [
      'Genre templates (Lao Lamvong, Modern Pop Ballad, Acoustic Folk, Symphonic)',
      'Instant verse/chorus structure generator & studio arrangement notes',
      'Seamless handoff to DMC Xayraxa Vientiane Recording Studio queue',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 11,
    title: 'Classical Conservatory Copyright Certificate & High-Res PNG/PDF Generator',
    moduleName: 'CopyrightCertificateModal.tsx',
    summary:
      'Generates official intellectual property diplomas under Lao PDR Law No. 38/NA & WIPO Berne Convention.',
    keyFeatures: [
      '5-Line symphonic musical stave watermark, Baroque corners & 24K Gold Foil Seal',
      '4 Conservatory color themes + bilingual Lao/English typography',
      '1920×1357 HTML5 Canvas PNG download + A4 Landscape Print-to-PDF',
    ],
    status: 'COMPLETED',
  },
  {
    stepNumber: 12,
    title: 'Super Admin Governance Portal (Four-Eyes Maker/Checker & Ledger Audit)',
    moduleName: 'AdminPortal.tsx',
    summary:
      'Enterprise back-office control center for managing members, approving bank withdrawals, and auditing unallocated commissions.',
    keyFeatures: [
      'Four-Eyes Maker/Checker workflow for bank payout approvals & rejections',
      'Global Double-Entry Ledger inspector & Unallocated Commission registry',
      'One-click Member Qualification simulator & system-wide audit logs',
    ],
    status: 'COMPLETED',
  },
];

/**
 * Packs an array of HTML5 Canvas elements (A4 aspect ratio) into a genuine,
 * standards-compliant multi-page PDF 1.4 binary file and triggers browser download.
 */
function downloadCanvasesAsPdf(canvases: HTMLCanvasElement[], filename: string) {
  const pageWidthPt = 595.28; // A4 width in points (72 dpi)
  const pageHeightPt = 841.89; // A4 height in points (72 dpi)

  const jpegBytesList: Uint8Array[] = canvases.map((canvas) => {
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const base64 = dataUrl.split(',')[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  });

  // Object numbering:
  // 1: Catalog
  // 2: Pages
  // For each page i (0..N-1):
  //   pageObjId = 3 + i * 3
  //   contentObjId = 4 + i * 3
  //   imageObjId = 5 + i * 3
  const numPages = canvases.length;
  const totalObjects = 2 + numPages * 3;
  const chunks: Uint8Array[] = [];
  const offsets: number[] = new Array(totalObjects + 1).fill(0);
  let currentOffset = 0;

  const encoder = new TextEncoder();
  const pushStr = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    currentOffset += bytes.length;
  };
  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    currentOffset += bytes.length;
  };

  // PDF Header
  pushStr('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n');

  // Obj 1: Catalog
  offsets[1] = currentOffset;
  pushStr('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Obj 2: Pages
  const kidsRefs = Array.from({ length: numPages }, (_, i) => `${3 + i * 3} 0 R`).join(' ');
  offsets[2] = currentOffset;
  pushStr(`2 0 obj\n<< /Type /Pages /Kids [ ${kidsRefs} ] /Count ${numPages} >>\nendobj\n`);

  // Each Page
  for (let i = 0; i < numPages; i++) {
    const pageObjId = 3 + i * 3;
    const contentObjId = 4 + i * 3;
    const imageObjId = 5 + i * 3;
    const canvas = canvases[i];
    const jpegBytes = jpegBytesList[i];

    // Page Object
    offsets[pageObjId] = currentOffset;
    pushStr(
      `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 ${pageWidthPt.toFixed(
        2
      )} ${pageHeightPt.toFixed(
        2
      )} ] /Resources << /XObject << /Im${i} ${imageObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>\nendobj\n`
    );

    // Content Stream
    const contentStream = `q\n${pageWidthPt.toFixed(2)} 0 0 ${pageHeightPt.toFixed(
      2
    )} 0 0 cm\n/Im${i} Do\nQ\n`;
    offsets[contentObjId] = currentOffset;
    pushStr(
      `${contentObjId} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
    );

    // Image XObject
    offsets[imageObjId] = currentOffset;
    pushStr(
      `${imageObjId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`
    );
    pushBytes(jpegBytes);
    pushStr('\nendstream\nendobj\n');
  }

  // XRef Table
  const xrefOffset = currentOffset;
  pushStr(`xref\n0 ${totalObjects + 1}\n`);
  pushStr('0000000000 65535 f \n');
  for (let objId = 1; objId <= totalObjects; objId++) {
    const padded = String(offsets[objId]).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  // Trailer
  pushStr(
    `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  // Combine into Blob and trigger download
  const blob = new Blob(chunks, { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

/**
 * Renders the 2-Page A4 Executive Summary (Page 1: 5 PDF Documents Created + Architecture,
 * Page 2: Complete 12-Step System Build Summary) onto high-resolution HTML5 Canvases
 * and downloads `DMC_Xayraxa_Step_By_Step_Summary_Rev2.6.pdf`.
 */
export async function generateAndDownloadStepByStepPdf(): Promise<void> {
  const width = 1240; // 150 DPI A4 Portrait
  const height = 1754;

  // =========================================================================
  // PAGE 1: EXECUTIVE HEADER + HOW MANY PDFs WE ARE CREATING (5 PDF DOCUMENTS)
  // =========================================================================
  const page1 = document.createElement('canvas');
  page1.width = width;
  page1.height = height;
  const ctx1 = page1.getContext('2d')!;

  // Background
  ctx1.fillStyle = '#ffffff';
  ctx1.fillRect(0, 0, width, height);

  // Outer Royal Gold & Crimson Border
  ctx1.strokeStyle = '#850818';
  ctx1.lineWidth = 6;
  ctx1.strokeRect(28, 28, width - 56, height - 56);
  ctx1.strokeStyle = '#d97706';
  ctx1.lineWidth = 2;
  ctx1.strokeRect(38, 38, width - 76, height - 76);

  // Header Banner
  const headerGrad = ctx1.createLinearGradient(44, 44, width - 44, 210);
  headerGrad.addColorStop(0, '#4a050d');
  headerGrad.addColorStop(0.5, '#7f0917');
  headerGrad.addColorStop(1, '#4a050d');
  ctx1.fillStyle = headerGrad;
  ctx1.fillRect(44, 44, width - 88, 175);

  // Official DMC Crest Logo in Header
  drawDmcOfficialLogoOnCanvas(ctx1, 135, 131, 56, { withGoldFrame: true });

  // Header Titles
  ctx1.fillStyle = '#fde047';
  ctx1.font = 'bold 16px sans-serif';
  ctx1.textAlign = 'left';
  ctx1.fillText('DIGITAL MUSIC CENTER (DMC XAYRAXA) • REVISION 2.6 EXECUTIVE SUMMARY', 215, 88);

  ctx1.fillStyle = '#ffffff';
  ctx1.font = 'bold 30px Georgia, serif';
  ctx1.fillText('STEP-BY-STEP PDF & SYSTEM BUILD SUMMARY', 215, 128);

  ctx1.fillStyle = '#fed7aa';
  ctx1.font = 'bold 18px "Noto Sans Lao", sans-serif';
  ctx1.fillText(
    'ສະຫຼຸບຂັ້ນຕອນການສ້າງເອກະສານ PDF (5 ສະບັບ) ແລະ ລະບົບທັງໝົດ 12 ຂັ້ນຕອນ',
    215,
    162
  );

  ctx1.fillStyle = '#cbd5e1';
  ctx1.font = '14px monospace';
  ctx1.fillText(
    'Document Ref: DMC-LA-2026-SUMMARY-PDF  •  Page 1 of 2  •  Vientiane Capital, Lao PDR',
    215,
    194
  );

  // Section 1 Title Banner
  let y = 250;
  ctx1.fillStyle = '#fef3c7';
  ctx1.fillRect(56, y, width - 112, 48);
  ctx1.strokeStyle = '#f59e0b';
  ctx1.lineWidth = 2;
  ctx1.strokeRect(56, y, width - 112, 48);

  ctx1.fillStyle = '#78350f';
  ctx1.font = 'bold 20px sans-serif';
  ctx1.fillText(
    'PART 1: HOW MANY PDF / PRINTABLE DOCUMENTS WE ARE CREATING (TOTAL: 5 PDFs)',
    74,
    y + 31
  );

  y += 68;

  // Render the 5 PDF Documents Box Cards
  PDF_DOCUMENTS_INVENTORY.forEach((doc) => {
    const cardH = 228;
    ctx1.fillStyle = '#f8fafc';
    ctx1.fillRect(56, y, width - 112, cardH);
    ctx1.strokeStyle = '#cbd5e1';
    ctx1.lineWidth = 1.5;
    ctx1.strokeRect(56, y, width - 112, cardH);

    // Left Number Badge
    ctx1.fillStyle = '#850818';
    ctx1.fillRect(56, y, 110, cardH);
    ctx1.fillStyle = '#fde047';
    ctx1.font = 'bold 15px monospace';
    ctx1.textAlign = 'center';
    ctx1.fillText('DOCUMENT', 111, y + 85);
    ctx1.font = 'bold 38px Georgia, serif';
    ctx1.fillText(`#${doc.pdfNumber}`, 111, y + 132);
    ctx1.fillStyle = '#ffffff';
    ctx1.font = 'bold 12px sans-serif';
    ctx1.fillText('PDF / PRINT', 111, y + 162);

    // Content on Right
    ctx1.textAlign = 'left';
    const cx = 186;
    ctx1.fillStyle = '#0f172a';
    ctx1.font = 'bold 20px sans-serif';
    ctx1.fillText(doc.title, cx, y + 34);

    ctx1.fillStyle = '#9a3412';
    ctx1.font = 'bold 15px "Noto Sans Lao", sans-serif';
    ctx1.fillText(doc.titleLao, cx, y + 60);

    ctx1.fillStyle = '#0369a1';
    ctx1.font = 'bold 13px monospace';
    ctx1.fillText(`Location: ${doc.moduleLocation}   |   Format: ${doc.formatSpec}`, cx, y + 84);

    ctx1.fillStyle = '#334155';
    ctx1.font = '14px sans-serif';
    ctx1.fillText(doc.purpose.slice(0, 118) + (doc.purpose.length > 118 ? '...' : ''), cx, y + 110);

    // Steps inside card
    ctx1.fillStyle = '#1e293b';
    ctx1.font = 'bold 13px sans-serif';
    doc.stepsToGenerate.forEach((st, sIdx) => {
      ctx1.fillText(`✓ ${st}`, cx + 8, y + 140 + sIdx * 26);
    });

    y += cardH + 18;
  });

  // Footer on Page 1
  ctx1.fillStyle = '#475569';
  ctx1.font = 'bold 14px sans-serif';
  ctx1.textAlign = 'center';
  ctx1.fillText(
    'Digital Music Center (DMC Xayraxa) • Rev 2.6 Official PDF Inventory • Continued on Page 2 (12-Step System Build)',
    width / 2,
    height - 52
  );

  // =========================================================================
  // PAGE 2: COMPLETE 12-STEP MASTER BUILD SUMMARY OF THE SUPER APP
  // =========================================================================
  const page2 = document.createElement('canvas');
  page2.width = width;
  page2.height = height;
  const ctx2 = page2.getContext('2d')!;

  ctx2.fillStyle = '#ffffff';
  ctx2.fillRect(0, 0, width, height);

  // Outer Border
  ctx2.strokeStyle = '#850818';
  ctx2.lineWidth = 6;
  ctx2.strokeRect(28, 28, width - 56, height - 56);
  ctx2.strokeStyle = '#d97706';
  ctx2.lineWidth = 2;
  ctx2.strokeRect(38, 38, width - 76, height - 76);

  // Page 2 Top Subheader
  ctx2.fillStyle = '#0f172a';
  ctx2.fillRect(44, 44, width - 88, 95);
  drawDmcOfficialLogoOnCanvas(ctx2, 105, 91, 36, { withGoldFrame: true });

  ctx2.textAlign = 'left';
  ctx2.fillStyle = '#fde047';
  ctx2.font = 'bold 22px Georgia, serif';
  ctx2.fillText('PART 2: COMPLETE 12-STEP SYSTEM BUILD SUMMARY (REV 2.6)', 160, 84);

  ctx2.fillStyle = '#cbd5e1';
  ctx2.font = '14px monospace';
  ctx2.fillText(
    'All 12 Completed Modules Across User Login, 4 Banner Products, Lao QR Payment, 3-Level Tree & Admin',
    160,
    114
  );

  let y2 = 160;
  const stepCardH = 116;

  APP_BUILD_STEPS.forEach((step) => {
    ctx2.fillStyle = step.stepNumber % 2 === 1 ? '#f8fafc' : '#fffbeb';
    ctx2.fillRect(56, y2, width - 112, stepCardH);
    ctx2.strokeStyle = '#cbd5e1';
    ctx2.lineWidth = 1.2;
    ctx2.strokeRect(56, y2, width - 112, stepCardH);

    // Step Pill on Left
    ctx2.fillStyle = '#1e293b';
    ctx2.fillRect(56, y2, 95, stepCardH);
    ctx2.fillStyle = '#fbbf24';
    ctx2.font = 'bold 13px monospace';
    ctx2.textAlign = 'center';
    ctx2.fillText('STEP', 103, y2 + 45);
    ctx2.font = 'bold 28px Georgia, serif';
    ctx2.fillText(String(step.stepNumber).padStart(2, '0'), 103, y2 + 80);

    // Step Details
    ctx2.textAlign = 'left';
    const sx = 170;
    ctx2.fillStyle = '#0f172a';
    ctx2.font = 'bold 17px sans-serif';
    ctx2.fillText(`${step.title}`, sx, y2 + 28);

    // Module Badge on Right
    ctx2.textAlign = 'right';
    ctx2.fillStyle = '#047857';
    ctx2.font = 'bold 13px monospace';
    ctx2.fillText(`[${step.moduleName}] • COMPLETED`, width - 74, y2 + 28);

    ctx2.textAlign = 'left';
    ctx2.fillStyle = '#334155';
    ctx2.font = '13.5px sans-serif';
    ctx2.fillText(
      step.summary.slice(0, 122) + (step.summary.length > 122 ? '...' : ''),
      sx,
      y2 + 54
    );

    // Key features bullets
    ctx2.fillStyle = '#78350f';
    ctx2.font = 'bold 12.5px sans-serif';
    const bulletLine1 = `• ${step.keyFeatures[0] || ''}`;
    const bulletLine2 = `• ${step.keyFeatures[1] || ''}   • ${step.keyFeatures[2] || ''}`;
    ctx2.fillText(bulletLine1.slice(0, 125), sx, y2 + 80);
    ctx2.fillText(bulletLine2.slice(0, 125), sx, y2 + 102);

    y2 += stepCardH + 9;
  });

  // Page 2 Footer
  ctx2.fillStyle = '#475569';
  ctx2.font = 'bold 14px sans-serif';
  ctx2.textAlign = 'center';
  ctx2.fillText(
    'Approved & Verified • Digital Music Center (DMC Xayraxa) Co., Ltd. • Vientiane Capital, Lao PDR • Page 2 of 2',
    width / 2,
    height - 46
  );

  downloadCanvasesAsPdf(
    [page1, page2],
    'DMC_Xayraxa_Step_By_Step_Summary_Rev2.6.pdf'
  );
}

export const SpecSlidesViewer: React.FC<SpecSlidesViewerProps> = ({ isOpen, onClose }) => {
  const [activeMode, setActiveMode] = useState<'PDF_AND_STEPS' | 'SLIDES'>('PDF_AND_STEPS');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateAndDownloadStepByStepPdf();
    } catch (e) {
      console.error('Failed to generate step-by-step PDF:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in print:static print:bg-white print:p-0">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden print:h-auto print:max-w-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Bar with Mode Switcher & Direct PDF Download */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <DmcOfficialLogo size={38} withGoldRing={true} />
            <div>
              <div className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                <span>DMC Xayraxa • Step-by-Step PDF Summary & Spec Center</span>
                <span className="text-[11px] font-mono text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  5 PDFs • 12 Build Steps
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete inventory of all PDFs created + 12-Step Master Build Guide (Downloadable .PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveMode('PDF_AND_STEPS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMode === 'PDF_AND_STEPS'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Step-by-Step PDF Summary</span>
              </button>
              <button
                onClick={() => setActiveMode('SLIDES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeMode === 'SLIDES'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>5 Spec Slides</span>
              </button>
            </div>

            {/* Download Real 2-Page A4 PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating .PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Summary PDF (.pdf)</span>
                </>
              )}
            </button>

            {/* Print / Save as PDF Button */}
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 print:bg-white print:text-black print:overflow-visible">
          {activeMode === 'PDF_AND_STEPS' ? (
            <div className="space-y-8 animate-in fade-in">
              {/* Executive KPI Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#4a050d] via-[#6b0814] to-[#3b040a] border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>EXECUTIVE STEP-BY-STEP SUMMARY • REV 2.6</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    We Are Creating <span className="text-amber-400 underline">5 Official PDF / Printable Documents</span> Across <span className="text-amber-400 underline">12 System Steps</span>
                  </h2>
                  <p className="text-xs text-amber-100/80">
                    ສັງລວມຂັ້ນຕອນການສ້າງເອກະສານ PDF ທັງໝົດ 5 ສະບັບ ແລະ 12 ຂັ້ນຕອນການພັດທະນາລະບົບ DMC Xayraxa Super App
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2.5 shrink-0 w-full md:w-auto">
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-center">
                    <div className="text-xl font-black text-amber-400">5</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase">PDF Documents</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30 text-center">
                    <div className="text-xl font-black text-emerald-400">12</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase">System Steps</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-sky-500/30 text-center">
                    <div className="text-xl font-black text-sky-400">4</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase">Banner Products</div>
                  </div>
                </div>
              </div>

              {/* PART 1: HOW MANY PDF DOCUMENTS WE ARE CREATING (5 PDFs STEP-BY-STEP) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      <span>PART 1: How Many PDFs We Are Creating — 5 Official PDF / Printable Documents</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Step-by-step guide to every printable PDF, certificate, receipt, QR pass, and audit report in the app
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {PDF_DOCUMENTS_INVENTORY.map((doc) => (
                    <div
                      key={doc.pdfNumber}
                      className={`p-4 sm:p-5 rounded-2xl border ${doc.colorClass} transition-all`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div className="flex items-start gap-3">
                          <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shrink-0 shadow">
                            PDF #{doc.pdfNumber}
                          </span>
                          <div>
                            <h4 className="font-black text-white text-sm sm:text-base">
                              {doc.title}
                            </h4>
                            <p className="text-xs text-amber-300/90 font-medium mt-0.5">
                              {doc.titleLao}
                            </p>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-700 text-slate-300 shrink-0">
                          {doc.formatSpec}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                        <div className="lg:col-span-5 space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Where & Purpose:
                          </div>
                          <div className="text-amber-200 font-semibold">
                            📍 {doc.moduleLocation}
                          </div>
                          <p className="text-slate-300 leading-relaxed">{doc.purpose}</p>
                        </div>

                        <div className="lg:col-span-7 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                            Step-by-Step How to Create / Download This PDF:
                          </div>
                          <ul className="space-y-1.5 text-slate-200">
                            {doc.stepsToGenerate.map((stepText, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{stepText}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 2: STEP-BY-STEP SUMMARY OF ALL 12 MODULES CREATED IN THE APP */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-400" />
                      <span>PART 2: Step-by-Step Summary of All 12 Created App Modules (Steps 1 – 12)</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Complete chronological walkthrough of every feature built and refined in DMC Xayraxa Rev 2.6
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {APP_BUILD_STEPS.map((item) => (
                    <div
                      key={item.stepNumber}
                      className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs">
                            STEP {String(item.stepNumber).padStart(2, '0')} / 12
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{item.moduleName}</span>
                          </span>
                        </div>

                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80">
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {item.keyFeatures.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ORIGINAL 5 ARCHITECTURE SLIDES */
            <div className="space-y-5">
              {/* Slide Selector Pills */}
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  Original Architecture Slide Deck (Slides 1 – 5):
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCurrentSlide(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentSlide === s
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Slide {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* SLIDE 1: PROGRAM SCOPE */}
              {currentSlide === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Slide 1 / 5
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Program Scope (Phase 1 – Rev 2.6 Scope Lock)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Screens 01–05 + Shared Backend + Membership + Music Package + 3-Level Commission + Wallet/Ledger + Admin & DMC Shell
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
                      <div className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>INCLUDED IN REV 2.6</span>
                      </div>
                      <ul className="space-y-2 text-slate-300">
                        <li>• Member Registration (Zero Fee, OTP, Consents)</li>
                        <li>• Music Package 1,600,000 LAK (1 Song Entitlement)</li>
                        <li>• Sponsor Tree 3 Levels (L1/L2/L3 strictly unilevel)</li>
                        <li>• Wallet & Qualification System (1.6M LAK threshold)</li>
                        <li>• Web Admin Configuration & Four-Eyes Payouts</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-3">
                      <div className="font-bold text-sm text-red-400 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        <span>REMOVED (NOT IN REV 2.6)</span>
                      </div>
                      <ul className="space-y-2 text-slate-300">
                        <li>• Binary System (Forbidden)</li>
                        <li>• Left / Right Tree placement (Removed)</li>
                        <li>• Matching Bonus (Removed)</li>
                        <li>• Pairing / Spillover (Removed)</li>
                        <li>• Logistics Section & 5th Product Card (Removed per mark)</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-3">
                      <div className="font-bold text-sm text-purple-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>FEATURED 4 BANNER PRODUCTS</span>
                      </div>
                      <ul className="space-y-2 text-slate-300">
                        <li>• 1. Single Song Production Package (1.6M LAK)</li>
                        <li>• 2. Signature Solid-Top Acoustic Guitar (4.8M LAK)</li>
                        <li>• 3. Studio Custom Electric Guitar (6.5M LAK)</li>
                        <li>• 4. Vocal Studio Condenser Mic Kit (2.9M LAK)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: UNIFIED SYSTEM ARCHITECTURE */}
              {currentSlide === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Slide 2 / 5
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Unified System Architecture & Core Invariants
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      One App – One Identity – Central Backend – Unified Commerce – Single Wallet Ledger
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-amber-400 text-sm">UNIFIED IDENTITY</h4>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• 1 person = 1 Global User ID (Lifetime)</li>
                        <li>• Member ID / Artist ID / Student ID as Display ID</li>
                        <li>• Multiple Roles with separated permissions</li>
                        <li>• Member QR code is strictly separate from Referral QR</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-amber-400 text-sm">SINGLE SOURCE OF TRUTH</h4>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• Order, Payment, Commission, Wallet from Backend only</li>
                        <li>• All financial writes must be Idempotent + Audited</li>
                        <li>• Fee/split changes require Version + Effective Date</li>
                        <li>• Core changes require documented Change Request</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 3: SCREEN 01 - HOME DASHBOARD */}
              {currentSlide === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Slide 3 / 5
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Screen 01 – Home Dashboard Specifications
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Member Portal | Circle Profile Image + 4 Banner Products + Wallet Tiles
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-white text-sm">CORE UI ELEMENTS</h4>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• Circular Profile Image with Live Photo Upload</li>
                        <li>• Digital Member Card + Dynamic Member & Referral QR</li>
                        <li>• Membership Status: FREE / ACTIVE LIFETIME</li>
                        <li>• Qualification Progress Bar: 1,600,000 LAK</li>
                        <li>• 4 Featured Banner Products (Carousel + 2×2 Grid)</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-white text-sm">CLASSIC LOGIN & ADMIN</h4>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• Classic Windows-style User & Administrator Login</li>
                        <li>• Direct Username/Member ID & Password/PIN fields</li>
                        <li>• Hidden redundant Quick Select & Department dropdowns</li>
                        <li>• +856 Lao Telecom / Unitel / ETL / TPlus SMS Recovery</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 4: MEMBERSHIP & COMMISSION FLOW */}
              {currentSlide === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Slide 4 / 5
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Membership, Music Package & Commission Flow
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Two Ways to Activate + Deterministic 3-Level Commission Split
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                      <div className="font-bold text-sm text-amber-400">
                        METHOD 1: PAY DIRECT ACTIVATION
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• Pay 1,600,000 LAK via Lao Bank QR (or Verify Yesterday Slip)</li>
                        <li>• Activate Immediately to Active Lifetime</li>
                        <li>• Receive 1 Studio Song Production entitlement</li>
                        <li>• Distributes commission: L1 400k, L2 200k, L3 100k</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <div className="font-bold text-sm text-emerald-400">
                        METHOD 2: AUTO ACTIVATION BY COMMISSION
                      </div>
                      <ul className="space-y-1.5 text-slate-300">
                        <li>• Zero initial payment (start as FREE Member)</li>
                        <li>• Commissions from team accumulate in Held</li>
                        <li>• At 1,600,000 LAK, auto-redeem to Active Lifetime</li>
                        <li>• Receive 1 Studio Song Production entitlement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 5: WALLET SYSTEM & MONEY FLOW */}
              {currentSlide === 5 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      Slide 5 / 5
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Wallet System & Money Flow
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Before Active vs After Active Ledger Routing
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="font-bold text-amber-400 text-sm">
                        BEFORE ACTIVE (FREE MEMBER)
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        Earned commissions are credited to <strong>HELD_FOR_QUALIFICATION</strong>.
                        Funds cannot be withdrawn to a bank account until the 1,600,000 LAK
                        threshold is satisfied.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="font-bold text-emerald-400 text-sm">
                        AFTER ACTIVE (ACTIVE LIFETIME)
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        New cleared commissions go directly to <strong>AVAILABLE</strong> balance.
                        Member can submit bank payout requests via BCEL One, LDB, or JDB through
                        Maker/Checker authorization.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Quick Download & Navigation */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-400">
            Total Inventory: <strong className="text-amber-400">5 Official PDFs</strong> •{' '}
            <strong className="text-emerald-400">12 System Build Steps</strong>
          </div>

          <div className="flex items-center gap-2">
            {activeMode === 'SLIDES' && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
                  disabled={currentSlide === 1}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => Math.min(5, prev + 1))}
                  disabled={currentSlide === 5}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download 2-Page Summary PDF (.pdf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
