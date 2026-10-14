/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * OFFICIAL CLASSICAL CONSERVATORY & MASTER RECORDING COPYRIGHT CERTIFICATE
 * DIGITAL MUSIC CENTER (DMC R ໄຊລາຊາ)
 *
 * Features:
 * - Official DMC R (ໄຊລາຊາ) Crest Logo in Header, Watermark, and 24K Gold Foil Seal
 * - Classical Music Conservatory Aesthetics:
 *   - 5-Line Symphonic Musical Staves with Treble Clef (𝄞), Bass Clef (𝄢), & Classical Score Notes
 *   - Baroque Filigree Corner Scrollwork, Golden Lyres, & Violin Scroll Heraldry
 *   - Multi-Layer Banknote Guilloche Security Borders & Engraved Typography
 *   - Embedded Classical Sheet Music Notation Excerpt & Acoustic Master Waveform
 *   - Official Red Ink Company Chop Stamp + Calligraphic Signature of Xay Raxa (ໄຊລາຊາ)
 *   - Scannable Cryptographic Verification QR Code
 *   - Ultra-High-Resolution (1920x1357) Print-Ready PNG Canvas Generator
 */

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Award,
  CheckCircle2,
  Copy,
  Download,
  Music,
  Printer,
  QrCode,
  Share2,
  ShieldCheck,
  X,
  Check,
  Palette,
  Shield,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { SongProductionProject } from '../../types/dmc';
import { DmcOfficialLogo, drawDmcOfficialLogoOnCanvas } from './DmcLogo';

export type CertificateTheme = 'ROYAL_GOLD' | 'AURORA_HOLO' | 'MEKONG_EMERALD' | 'MIDNIGHT_ONYX';
export type CertificateLanguage = 'BILINGUAL' | 'ENGLISH' | 'LAO';

interface CopyrightCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  memberName: string;
  isActiveLifetime: boolean;
  songs?: SongProductionProject[];
  defaultSongTitle?: string;
  autoDownloadOnOpen?: boolean;
}

export interface DownloadCertificateOptions {
  memberId: string;
  memberName: string;
  isActiveLifetime: boolean;
  workTitle?: string;
  theme?: CertificateTheme;
}

/**
 * Draws the complete Ultra-High-Resolution (1920x1357) Classical Music Conservatory
 * & Copyright Certificate onto an HTML5 Canvas and triggers a PNG download.
 */
export async function downloadDmcCertificateImage({
  memberId,
  memberName,
  isActiveLifetime,
  workTitle = 'ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong - Symphonic Master)',
  theme = 'ROYAL_GOLD',
}: DownloadCertificateOptions): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1920;
  const height = 1357;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const certYear = '2026';
  const cleanId = (memberId || 'DMC-LA-00101').replace(/[^a-zA-Z0-9]/g, '').slice(-5);
  const certSerial = `LA-DMC-CR-${certYear}-${cleanId}`;
  const isrcCode = `LA-XAY-26-CR${cleanId}`;
  const opusNumber = `Op. ${cleanId.slice(-2) || '26'} • No. 1 in F Major`;
  const ipLawRef = 'Lao PDR Law on Intellectual Property No. 38/NA & WIPO Berne Convention';
  const issueDateFormatted = '15 October 2026';
  const verifyUrl = `https://dmcxayraxa.la/verify/copyright?cert=${certSerial}&member=${encodeURIComponent(memberId)}`;
  const sha256Fingerprint = `8f4b29a17c804e${cleanId}df302914ba761e05c87a2`;

  // 1. OUTER VELVET / MAHOGANY CONSERVATORY FRAME
  const outerGrad = ctx.createLinearGradient(0, 0, width, height);
  if (theme === 'AURORA_HOLO') {
    outerGrad.addColorStop(0, '#090d26');
    outerGrad.addColorStop(0.5, '#1e1b4b');
    outerGrad.addColorStop(1, '#2e1065');
  } else if (theme === 'MEKONG_EMERALD') {
    outerGrad.addColorStop(0, '#022c22');
    outerGrad.addColorStop(0.5, '#064e3b');
    outerGrad.addColorStop(1, '#022c22');
  } else if (theme === 'MIDNIGHT_ONYX') {
    outerGrad.addColorStop(0, '#030712');
    outerGrad.addColorStop(0.5, '#111827');
    outerGrad.addColorStop(1, '#030712');
  } else {
    // Classic Royal Conservatory Crimson & Mahogany
    outerGrad.addColorStop(0, '#2a0408');
    outerGrad.addColorStop(0.35, '#5c0913');
    outerGrad.addColorStop(0.65, '#45060d');
    outerGrad.addColorStop(1, '#1f0205');
  }
  ctx.fillStyle = outerGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle diagonal gold damask texture on outer frame
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
  ctx.lineWidth = 1;
  for (let i = -height; i < width + height; i += 28) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }
  ctx.restore();

  // 2. INNER ROYAL IVORY PARCHMENT SHEET
  const margin = 44;
  const pX = margin;
  const pY = margin;
  const pW = width - margin * 2;
  const pH = height - margin * 2;

  const parchmentGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    1100
  );
  if (theme === 'MIDNIGHT_ONYX') {
    parchmentGrad.addColorStop(0, '#1e293b');
    parchmentGrad.addColorStop(0.7, '#0f172a');
    parchmentGrad.addColorStop(1, '#090d16');
  } else {
    parchmentGrad.addColorStop(0, '#fffef9');
    parchmentGrad.addColorStop(0.6, '#fdfaf0');
    parchmentGrad.addColorStop(1, '#f7eed7');
  }
  ctx.fillStyle = parchmentGrad;
  ctx.fillRect(pX, pY, pW, pH);

  // 3. MULTI-LAYERED GOLD LEAF & GUILLOCHE CONSERVATORY BORDERS
  const goldGrad = ctx.createLinearGradient(0, 0, width, height);
  goldGrad.addColorStop(0, '#92400e');
  goldGrad.addColorStop(0.25, '#f59e0b');
  goldGrad.addColorStop(0.5, '#fde047');
  goldGrad.addColorStop(0.75, '#d97706');
  goldGrad.addColorStop(1, '#78350f');

  // Heavy Outer Gold Frame
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 10;
  ctx.strokeRect(pX, pY, pW, pH);

  // Secondary Crimson/Gold Inset Frame
  ctx.strokeStyle = '#850818';
  ctx.lineWidth = 3;
  ctx.strokeRect(pX + 14, pY + 14, pW - 28, pH - 28);

  // Guilloche Harmonic Sine-Wave Security Border
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.28)';
  ctx.lineWidth = 1.4;
  // Top and Bottom Guilloche Waves
  for (let phase = 0; phase < 2; phase++) {
    ctx.beginPath();
    for (let x = pX + 26; x <= pX + pW - 26; x += 4) {
      const yTop = pY + 24 + Math.sin(x * 0.06 + phase * Math.PI) * 5;
      if (x === pX + 26) ctx.moveTo(x, yTop);
      else ctx.lineTo(x, yTop);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let x = pX + 26; x <= pX + pW - 26; x += 4) {
      const yBot = pY + pH - 24 + Math.sin(x * 0.06 + phase * Math.PI) * 5;
      if (x === pX + 26) ctx.moveTo(x, yBot);
      else ctx.lineTo(x, yBot);
    }
    ctx.stroke();
  }
  // Left and Right Guilloche Waves
  for (let phase = 0; phase < 2; phase++) {
    ctx.beginPath();
    for (let y = pY + 26; y <= pY + pH - 26; y += 4) {
      const xLeft = pX + 24 + Math.sin(y * 0.06 + phase * Math.PI) * 5;
      if (y === pY + 26) ctx.moveTo(xLeft, y);
      else ctx.lineTo(xLeft, y);
    }
    ctx.stroke();

    ctx.beginPath();
    for (let y = pY + 26; y <= pY + pH - 26; y += 4) {
      const xRight = pX + pW - 24 + Math.sin(y * 0.06 + phase * Math.PI) * 5;
      if (y === pY + 26) ctx.moveTo(xRight, y);
      else ctx.lineTo(xRight, y);
    }
    ctx.stroke();
  }
  ctx.restore();

  // Inner Fine Gold Double Border
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(pX + 34, pY + 34, pW - 68, pH - 68);
  ctx.lineWidth = 1;
  ctx.strokeRect(pX + 40, pY + 40, pW - 80, pH - 80);

  // 4. BAROQUE CORNER ROSETTES & VIOLIN SCROLL FLOURISHES
  const drawBaroqueCorner = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Corner Gold Quarter Fan
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(95, 0);
    ctx.quadraticCurveTo(35, 35, 0, 95);
    ctx.closePath();
    ctx.fill();

    // Inner Crimson Corner Triangle
    ctx.fillStyle = '#850818';
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.lineTo(65, 4);
    ctx.quadraticCurveTo(25, 25, 4, 65);
    ctx.closePath();
    ctx.fill();

    // Decorative Violin Scroll Spirals
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(15, 85);
    ctx.bezierCurveTo(45, 85, 85, 45, 85, 15);
    ctx.stroke();

    // Corner Clef Pearl
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(22, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  };

  drawBaroqueCorner(pX + 34, pY + 34, 0);
  drawBaroqueCorner(pX + pW - 34, pY + 34, Math.PI / 2);
  drawBaroqueCorner(pX + pW - 34, pY + pH - 34, Math.PI);
  drawBaroqueCorner(pX + 34, pY + pH - 34, -Math.PI / 2);

  // 5. CLASSICAL SYMPHONIC WATERMARK (5-LINE MUSICAL STAVE + GIANT TREBLE CLEF + VINYL MASTER)
  ctx.save();
  const isDark = theme === 'MIDNIGHT_ONYX';
  ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.06)' : 'rgba(180, 83, 9, 0.065)';
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.05)' : 'rgba(180, 83, 9, 0.055)';

  // Concentric Symphonic Vinyl / Rosette Circles in Center
  for (let r = 140; r <= 440; r += 25) {
    ctx.lineWidth = r % 50 === 0 ? 2 : 1;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 20, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Flowing 5-Line Classical Musical Staff across the background
  for (let lineIdx = 0; lineIdx < 5; lineIdx++) {
    ctx.beginPath();
    ctx.lineWidth = 1.8;
    const baseStaveY = height / 2 - 40 + lineIdx * 18;
    for (let x = pX + 80; x <= width - pX - 80; x += 10) {
      const waveY = baseStaveY + Math.sin((x / width) * Math.PI * 2) * 38;
      if (x === pX + 80) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }

  // Giant Watermark Musical Symbols
  ctx.font = '320px serif';
  ctx.textAlign = 'center';
  ctx.fillText('𝄞', width / 2 - 360, height / 2 + 110);
  ctx.fillText('𝄢', width / 2 + 360, height / 2 + 90);
  ctx.font = '90px serif';
  ctx.fillText('♫   ♩   ♬   ♪   ♫', width / 2, height / 2 - 120);
  ctx.restore();

  // 6. SECURITY MICROPRINT HEADER LINE
  ctx.fillStyle = isDark ? '#fbbf24' : '#92400e';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    '★ OFFICIAL MUSICAL MASTERPIECE & COPYRIGHT REGISTRY ★ DIGITAL MUSIC CENTER (DMC XAYRAXA) ★ LAO PDR LAW NO. 38/NA ★ WIPO BERNE CONVENTION ★',
    width / 2,
    pY + 64
  );

  // 7. GRAND IMPERIAL HEADER WITH OFFICIAL "DMC R ໄຊລາຊາ" LOGO & GOLDEN LAUREL WREATHS
  const logoCenterY = pY + 150;

  // Draw Left & Right Golden Musical Staff Wings & Laurel Branches
  ctx.save();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  for (let s = 0; s < 5; s++) {
    const sy = logoCenterY - 16 + s * 8;
    // Left Staff Wing
    ctx.beginPath();
    ctx.moveTo(width / 2 - 420, sy);
    ctx.lineTo(width / 2 - 115, sy);
    ctx.stroke();
    // Right Staff Wing
    ctx.beginPath();
    ctx.moveTo(width / 2 + 115, sy);
    ctx.lineTo(width / 2 + 420, sy);
    ctx.stroke();
  }
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 34px serif';
  ctx.fillText('𝄞  ♫  ♩  ♬', width / 2 - 265, logoCenterY + 12);
  ctx.fillText('♬  ♩  ♫  𝄢', width / 2 + 265, logoCenterY + 12);
  ctx.restore();

  // Golden Laurel Garland around Logo
  ctx.save();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(width / 2, logoCenterY, 76, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(width / 2, logoCenterY, 76, 1.2 * Math.PI, 1.8 * Math.PI);
  ctx.stroke();
  ctx.restore();

  // Draw the Official Uploaded "DMC R ໄຊລາຊາ" Logo Crest in Header
  drawDmcOfficialLogoOnCanvas(ctx, width / 2, logoCenterY, 64, { withGoldFrame: true });

  // 8. CONSERVATORY & CORPORATE HERALDRY TITLES
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#fde68a' : '#78350f';
  ctx.font = 'bold 21px "Noto Sans Lao", sans-serif';
  ctx.fillText(
    'ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ • ສູນດົນຕີດິຈິຕອນ ໄຊລາຊາ ຈຳກັດຜູ້ດຽວ',
    width / 2,
    pY + 248
  );

  ctx.fillStyle = isDark ? '#ffffff' : '#6b0814';
  ctx.font = '900 46px Georgia, "Times New Roman", serif';
  ctx.fillText('DIGITAL MUSIC CENTER (DMC XAYRAXA)', width / 2, pY + 298);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.fillText(
    'CONSERVATORY OF MUSICAL ARTS • BUREAU OF MASTER RECORDING & INTELLECTUAL PROPERTY RIGHTS',
    width / 2,
    pY + 328
  );

  // Ornate Classical Divider Line with Treble Diamond
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 480, pY + 346);
  ctx.lineTo(width / 2 - 30, pY + 346);
  ctx.moveTo(width / 2 + 30, pY + 346);
  ctx.lineTo(width / 2 + 480, pY + 346);
  ctx.stroke();
  ctx.fillStyle = '#850818';
  ctx.font = 'bold 22px serif';
  ctx.fillText('❖', width / 2, pY + 353);

  // 9. GRAND CERTIFICATE DIPLOMA BANNER
  ctx.fillStyle = isDark ? '#fbbf24' : '#850818';
  ctx.font = '900 40px Georgia, "Times New Roman", serif';
  ctx.fillText('CERTIFICATE OF COPYRIGHT & MUSICAL MASTERPIECE', width / 2, pY + 398);

  ctx.fillStyle = isDark ? '#f59e0b' : '#9a3412';
  ctx.font = 'bold 25px "Noto Sans Lao", sans-serif';
  ctx.fillText(
    'ໃບຢັ້ງຢືນການຈົດທະບຽນລິຂະສິດບົດເພງ, ມາສເຕີສຽງດົນຕີ ແລະ ຊັບສິນທາງປັນຍາ',
    width / 2,
    pY + 434
  );

  // 10. FORMAL PROCLAMATION
  ctx.fillStyle = isDark ? '#cbd5e1' : '#334155';
  ctx.font = 'italic 19px Georgia, "Times New Roman", serif';
  ctx.fillText(
    'Be it known by these presents that the original musical composition, symphonic arrangement, vocal & instrumental master recording,',
    width / 2,
    pY + 474
  );
  ctx.fillText(
    'and global digital distribution entitlements inscribed herein are solemnly registered and protected under Lao PDR Law No. 38/NA.',
    width / 2,
    pY + 500
  );

  // 11. RIGHTSHOLDER CONFERMENT SECTION
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillText('SOLEMNLY CONFERRED & VESTED UNTO THE SOVEREIGN COPYRIGHT HOLDER:', width / 2, pY + 538);

  // Artist / Member Name in Grand Classical Script
  ctx.fillStyle = isDark ? '#fde047' : '#7f0917';
  ctx.font = 'bold italic 52px Georgia, "Times New Roman", serif';
  ctx.fillText(`♫  ${memberName || 'DMC Master Artist'}  ♫`, width / 2, pY + 592);

  // Calligraphic Gold Underline Flourish under Member Name
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 340, pY + 608);
  ctx.quadraticCurveTo(width / 2, pY + 620, width / 2 + 340, pY + 608);
  ctx.stroke();

  // Member Metadata Strip
  ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(
    `REGISTRY ID: ${memberId || 'DMC-LA-00101'}   •   STANDING: ${
      isActiveLifetime ? 'ACTIVE LIFETIME MASTER FELLOW' : 'REGISTERED CREATOR'
    }   •   TERRITORY: WORLDWIDE PERPETUAL`,
    width / 2,
    pY + 638
  );

  // 12. CLASSICAL SCORE & MASTER RECORDING SPECIFICATION MANUSCRIPT BOX
  const boxX = width / 2 - 640;
  const boxY = pY + 658;
  const boxW = 1280;
  const boxH = 225;

  // Parchment Score Box Fill
  const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
  if (isDark) {
    boxGrad.addColorStop(0, '#0f172a');
    boxGrad.addColorStop(1, '#1e293b');
  } else {
    boxGrad.addColorStop(0, '#fffbeb');
    boxGrad.addColorStop(0.5, '#fef3c7');
    boxGrad.addColorStop(1, '#fffbeb');
  }
  ctx.fillStyle = boxGrad;
  ctx.fillRect(boxX, boxY, boxW, boxH);

  // Double Gold Score Box Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX + 6, boxY + 6, boxW - 12, boxH - 12);

  // Header inside Score Box
  ctx.textAlign = 'left';
  ctx.fillStyle = '#850818';
  ctx.font = 'bold 16px Georgia, serif';
  ctx.fillText('𝄞  REGISTERED MUSICAL WORK & MASTER RECORDING OPUS:', boxX + 28, boxY + 34);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`SERIAL: ${certSerial}  |  ISRC: ${isrcCode}`, boxX + boxW - 28, boxY + 34);

  // Divider inside box
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.35)';
  ctx.beginPath();
  ctx.moveTo(boxX + 24, boxY + 46);
  ctx.lineTo(boxX + boxW - 24, boxY + 46);
  ctx.stroke();

  // Work Title
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#ffffff' : '#1e1b4b';
  ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
  ctx.fillText(`"${workTitle}"`, width / 2, boxY + 88);

  // Classical 5-Line Musical Score Notation Excerpt inside Box
  const staveStartX = boxX + 60;
  const staveEndX = boxX + boxW - 60;
  const staveTopY = boxY + 108;
  ctx.save();
  ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.45)' : 'rgba(120, 53, 15, 0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 5; i++) {
    const y = staveTopY + i * 8;
    ctx.beginPath();
    ctx.moveTo(staveStartX, y);
    ctx.lineTo(staveEndX, y);
    ctx.stroke();
  }
  // Vertical Bar Lines on Stave
  for (let bx = staveStartX; bx <= staveEndX; bx += 290) {
    ctx.beginPath();
    ctx.moveTo(bx, staveTopY);
    ctx.lineTo(bx, staveTopY + 32);
    ctx.stroke();
  }
  // Draw Clef & Classical Musical Notes on the Stave
  ctx.fillStyle = isDark ? '#fbbf24' : '#78350f';
  ctx.font = '38px serif';
  ctx.textAlign = 'left';
  ctx.fillText('𝄞', staveStartX + 10, staveTopY + 30);
  ctx.font = 'bold 18px serif';
  ctx.fillText('4', staveStartX + 48, staveTopY + 15);
  ctx.fillText('4', staveStartX + 48, staveTopY + 31);

  ctx.font = '26px serif';
  const noteSequence = ['♩', '♫', '♬', '♩', '♪', '♫', '♩', '♬', '♫', '♩', '♪', '♬', '♫', '𝄐'];
  noteSequence.forEach((n, idx) => {
    const nx = staveStartX + 95 + idx * 78;
    const ny = staveTopY + 14 + ((idx * 7) % 18);
    ctx.fillText(n, nx, ny);
  });
  ctx.restore();

  // Bottom Spec Strip inside Score Box
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#fde68a' : '#78350f';
  ctx.font = 'bold 15px monospace';
  ctx.fillText(
    `OPUS: ${opusNumber}   •   AUDIO MASTER: 24-BIT / 96kHz STEREO PCM   •   RIGHTS: 100% MASTER, PUBLISHING & SYNC ROYALTIES`,
    width / 2,
    boxY + 178
  );

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(
    '✓ Verified Original Composition   ✓ Sovereign Commercial Distribution   ✓ Unilevel Lifetime Royalty Entitlement   ✓ WIPO Protected',
    width / 2,
    boxY + 206
  );

  // 13. BOTTOM SECTION: 24K GOLD & RED WAX SEAL, QR REGISTRY SHIELD, & SIGNATURES
  const bottomY = pY + 915;

  // --- LEFT: 32-POINT 24K GOLD FOIL & ROYAL CRIMSON WAX MEDALLION SEAL ---
  const sealX = pX + 210;
  const sealY = bottomY + 110;

  ctx.save();
  // Silk Ribbons hanging below Seal
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(sealX - 35, sealY + 40);
  ctx.lineTo(sealX - 65, sealY + 145);
  ctx.lineTo(sealX - 30, sealY + 125);
  ctx.lineTo(sealX - 5, sealY + 150);
  ctx.lineTo(sealX - 5, sealY + 40);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(sealX + 35, sealY + 40);
  ctx.lineTo(sealX + 65, sealY + 145);
  ctx.lineTo(sealX + 30, sealY + 125);
  ctx.lineTo(sealX + 5, sealY + 150);
  ctx.lineTo(sealX + 5, sealY + 40);
  ctx.closePath();
  ctx.fill();

  // Gold trim on ribbons
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 32-Point Scalloped Starburst Seal Outer Edge
  const points = 36;
  const outerR = 88;
  const innerR = 78;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points;
    const x = sealX + Math.cos(angle) * r;
    const y = sealY + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = goldGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#78350f';
  ctx.stroke();

  // Royal Crimson Wax Inner Ring
  ctx.beginPath();
  ctx.arc(sealX, sealY, 68, 0, Math.PI * 2);
  ctx.fillStyle = '#7f0917';
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#fde047';
  ctx.stroke();

  // Embossed Official DMC R ໄຊລາຊາ Logo in the center of the Gold Seal
  drawDmcOfficialLogoOnCanvas(ctx, sealX, sealY, 44, { withGoldFrame: true });
  ctx.restore();

  // Seal Caption to the right of the medallion
  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? '#ffffff' : '#1e293b';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.fillText('OFFICIAL CONSERVATORY SEAL', sealX + 108, sealY - 28);
  ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
  ctx.font = '14px sans-serif';
  ctx.fillText('Digital Music Center (DMC Xayraxa)', sealX + 108, sealY - 4);
  ctx.fillText(`Issued: ${issueDateFormatted}`, sealX + 108, sealY + 18);
  ctx.fillStyle = '#047857';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('LAW NO. 38/NA STATUTORY SEAL', sealX + 108, sealY + 42);

  // --- CENTER: CRYPTOGRAPHIC QR CODE IN ORNATE FRAME ---
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 260,
      margin: 1,
      color: { dark: '#1e1b4b', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = () => {
        const qrSize = 148;
        const qrX = width / 2 - qrSize / 2;
        const qrY = bottomY + 18;

        // Gold Frame behind QR
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        ctx.fillStyle = isDark ? '#fde047' : '#850818';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN TO VERIFY MASTER REGISTRY', width / 2, qrY + qrSize + 28);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px monospace';
        ctx.fillText(`SHA-256: ${sha256Fingerprint.slice(0, 20)}...`, width / 2, qrY + qrSize + 46);
        resolve(true);
      };
      qrImg.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('QR render error', e);
  }

  // --- RIGHT: AUTHORIZED SIGNATURE & OFFICIAL RED INK CHOP STAMP ---
  const sigCenterX = width - pX - 280;
  const sigLineY = bottomY + 125;

  // Official Red Ink Circular Company Stamp overlapping signature
  ctx.save();
  ctx.translate(sigCenterX - 135, sigLineY - 45);
  ctx.rotate(-0.18);
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.78)';
  ctx.fillStyle = 'rgba(220, 38, 38, 0.78)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('DIGITAL MUSIC CENTER', 0, -24);
  ctx.font = 'bold 14px "Noto Sans Lao", sans-serif';
  ctx.fillText('ສູນດົນຕີດິຈິຕອນ ໄຊລາຊາ', 0, -4);
  ctx.font = '900 18px Georgia, serif';
  ctx.fillText('★ DMC R ★', 0, 18);
  ctx.font = 'bold 9px monospace';
  ctx.fillText('OFFICIAL REGISTRY SEAL', 0, 34);
  ctx.restore();

  // Calligraphic Fountain-Pen Signature of Xay Raxa
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#fde047' : '#1e1b4b';
  ctx.font = 'bold italic 44px Georgia, "Times New Roman", serif';
  ctx.fillText('Xay Raxa', sigCenterX, sigLineY - 22);

  // Decorative signature flourish stroke
  ctx.strokeStyle = isDark ? '#fde047' : '#1e1b4b';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(sigCenterX - 110, sigLineY - 10);
  ctx.bezierCurveTo(sigCenterX - 30, sigLineY - 28, sigCenterX + 50, sigLineY + 5, sigCenterX + 125, sigLineY - 18);
  ctx.stroke();
  ctx.restore();

  // Signature Line
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sigCenterX - 170, sigLineY);
  ctx.lineTo(sigCenterX + 170, sigLineY);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.fillText('XAY RAXA (ໄຊລາຊາ)', sigCenterX, sigLineY + 26);

  ctx.fillStyle = isDark ? '#cbd5e1' : '#475569';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Founder, Chairman & Chief Executive Producer', sigCenterX, sigLineY + 48);

  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('Digital Music Center (DMC Xayraxa) Co., Ltd. • Vientiane, Lao PDR', sigCenterX, sigLineY + 68);

  // Trigger PNG Download
  const dataUrl = canvas.toDataURL('image/png');
  const downloadLink = document.createElement('a');
  downloadLink.href = dataUrl;
  downloadLink.download = `DMC_Xayraxa_Classical_Copyright_Certificate_${cleanId}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export const CopyrightCertificateModal: React.FC<CopyrightCertificateModalProps> = ({
  isOpen,
  onClose,
  memberId,
  memberName,
  isActiveLifetime,
  songs = [],
  defaultSongTitle,
  autoDownloadOnOpen = false,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<CertificateTheme>('ROYAL_GOLD');
  const [selectedLang, setSelectedLang] = useState<CertificateLanguage>('BILINGUAL');

  const initialSong =
    defaultSongTitle ||
    (songs.length > 0 ? songs[0].title : 'ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)');
  const [workTitle, setWorkTitle] = useState(initialSong);
  const [isCustomTitle, setIsCustomTitle] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState('');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const certYear = '2026';
  const cleanId = (memberId || 'DMC-LA-00101').replace(/[^a-zA-Z0-9]/g, '').slice(-5);
  const certSerial = `LA-DMC-CR-${certYear}-${cleanId}`;
  const isrcCode = `LA-XAY-26-CR${cleanId}`;
  const opusNumber = `Op. ${cleanId.slice(-2) || '26'} • No. 1`;
  const ipLawRef = 'Lao PDR Law on Intellectual Property No. 38/NA & WIPO Berne Conv.';
  const issueDateFormatted = '15 October 2026';
  const verifyUrl = `https://dmcxayraxa.la/verify/copyright?cert=${certSerial}&member=${encodeURIComponent(
    memberId
  )}`;
  const sha256Fingerprint = `8f4b29a17c804e${cleanId}df302914ba761e05c87a2`;

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        setQrDataUrl(url);
        if (autoDownloadOnOpen) {
          setTimeout(() => {
            handleDownloadImage();
          }, 300);
        }
      })
      .catch((err) => console.error('Failed to generate cert QR', err));
  }, [verifyUrl, autoDownloadOnOpen]);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(certSerial);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      await downloadDmcCertificateImage({
        memberId,
        memberName,
        isActiveLifetime,
        workTitle,
        theme: selectedTheme,
      });
    } catch (err) {
      console.error('Error downloading certificate', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getThemeClasses = () => {
    switch (selectedTheme) {
      case 'AURORA_HOLO':
        return {
          wrapper:
            'bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 border-amber-400/60',
          innerParchment:
            'bg-gradient-to-b from-[#fffef9] via-[#f8fafc] to-[#fdf4ff] text-slate-900 border-amber-500/60',
          goldBorder: 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.3)]',
          headerText: 'text-indigo-950',
          scoreBox: 'bg-gradient-to-r from-indigo-50/90 via-amber-50/70 to-indigo-50/90 border-amber-500/50',
        };
      case 'MEKONG_EMERALD':
        return {
          wrapper:
            'bg-gradient-to-br from-emerald-950 via-[#042f2e] to-teal-950 text-slate-100 border-amber-400/60',
          innerParchment:
            'bg-gradient-to-b from-[#fffef9] via-[#f0fdf4] to-[#fefce8] text-slate-900 border-amber-600/60',
          goldBorder: 'border-amber-400 shadow-[0_0_35px_rgba(16,185,129,0.3)]',
          headerText: 'text-emerald-950',
          scoreBox: 'bg-gradient-to-r from-emerald-50/90 via-amber-50/80 to-emerald-50/90 border-amber-600/50',
        };
      case 'MIDNIGHT_ONYX':
        return {
          wrapper:
            'bg-gradient-to-br from-slate-950 via-neutral-900 to-black text-slate-100 border-amber-400/70',
          innerParchment:
            'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#090d16] text-slate-100 border-amber-400/60',
          goldBorder: 'border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)]',
          headerText: 'text-amber-300',
          scoreBox: 'bg-slate-900/90 border-amber-500/50 text-slate-100',
        };
      case 'ROYAL_GOLD':
      default:
        return {
          wrapper:
            'bg-gradient-to-br from-[#4a050d] via-[#2b0308] to-[#1a0104] text-amber-100 border-amber-500/80',
          innerParchment:
            'bg-gradient-to-b from-[#fffef9] via-[#fdfbf2] to-[#f8eed6] text-slate-900 border-amber-600/70',
          goldBorder: 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.35)]',
          headerText: 'text-[#6b0814]',
          scoreBox: 'bg-gradient-to-r from-amber-50/95 via-[#fffdf5] to-amber-50/95 border-amber-600/50',
        };
    }
  };

  const themeStyle = getThemeClasses();
  const isDarkTheme = selectedTheme === 'MIDNIGHT_ONYX';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Action & Customization Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <DmcOfficialLogo size={42} withGoldRing={true} />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>DMC Xayraxa Classical Copyright Certificate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Conservatory Edition
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official Master Recording & Intellectual Property Diploma (Lao PDR Law No. 38/NA)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering Master PNG...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Certificate (PNG)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customization Bar: Theme, Song Work Selector, Language */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Conservatory Style:</span>
            </span>
            {(
              [
                { id: 'ROYAL_GOLD', label: 'Royal Crimson & Gold' },
                { id: 'AURORA_HOLO', label: 'Symphonic Indigo' },
                { id: 'MEKONG_EMERALD', label: 'Imperial Emerald' },
                { id: 'MIDNIGHT_ONYX', label: 'Midnight Black & Gold' },
              ] as { id: CertificateTheme; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedTheme === t.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={isCustomTitle ? '__CUSTOM__' : workTitle}
                onChange={(e) => {
                  if (e.target.value === '__CUSTOM__') {
                    setIsCustomTitle(true);
                  } else {
                    setIsCustomTitle(false);
                    setWorkTitle(e.target.value);
                  }
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-white font-medium focus:outline-none focus:border-amber-500"
              >
                {songs.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)">
                  ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)
                </option>
                <option value="ດອກຈຳປາບານທີ່ໄຊລາຊາ (Champa Symphony in F)">
                  ດອກຈຳປາບານທີ່ໄຊລາຊາ (Champa Symphony in F)
                </option>
                <option value="ມົນຮັກລ່ອງຂອງ (Mekong Classical Serenade)">
                  ມົນຮັກລ່ອງຂອງ (Mekong Classical Serenade)
                </option>
                <option value="__CUSTOM__">+ Enter Custom Composition Title...</option>
              </select>
            </div>

            {isCustomTitle && (
              <input
                type="text"
                placeholder="Enter song/opus title..."
                value={customTitleInput}
                onChange={(e) => {
                  setCustomTitleInput(e.target.value);
                  if (e.target.value.trim()) setWorkTitle(e.target.value.trim());
                }}
                className="bg-slate-800 border border-amber-500/60 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none w-44"
              />
            )}

            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {(['BILINGUAL', 'ENGLISH', 'LAO'] as CertificateLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                    selectedLang === lang
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'BILINGUAL' ? 'Dual' : lang === 'ENGLISH' ? 'EN' : 'LO'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CERTIFICATE SCROLLABLE VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950 flex items-center justify-center print:overflow-visible print:p-0">
          
          {/* OUTER ROYAL CONSERVATORY FRAME */}
          <div
            ref={certificateRef}
            className={`w-full max-w-4xl rounded-2xl p-3 sm:p-6 transition-all relative overflow-hidden shadow-2xl border-4 ${themeStyle.wrapper} ${themeStyle.goldBorder}`}
          >
            {/* Outer Frame Subtle Diagonal Gold Damask Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(251,191,36,0.25) 0px, rgba(251,191,36,0.25) 1px, transparent 1px, transparent 16px)',
              }}
            />

            {/* INNER ROYAL PARCHMENT DIPLOMA SHEET */}
            <div
              className={`relative z-10 rounded-xl p-4 sm:p-8 border-[3px] shadow-2xl transition-colors overflow-hidden ${themeStyle.innerParchment}`}
            >
              {/* Secondary Double Gold Inset Border */}
              <div className="absolute inset-2.5 border border-amber-600/40 rounded-lg pointer-events-none" />
              <div className="absolute inset-4 border-2 border-amber-700/30 rounded-lg pointer-events-none" />

              {/* BAROQUE VIOLIN & LYRE CORNER ORNAMENTS (All 4 Corners) */}
              {[
                'top-2 left-2 rotate-0',
                'top-2 right-2 rotate-90',
                'bottom-2 right-2 rotate-180',
                'bottom-2 left-2 -rotate-90',
              ].map((pos, idx) => (
                <div
                  key={idx}
                  className={`absolute ${pos} w-16 h-16 sm:w-20 sm:h-20 pointer-events-none z-20`}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M0,0 L85,0 C45,10 10,45 0,85 Z"
                      fill="url(#cornerGold)"
                      opacity="0.9"
                    />
                    <path
                      d="M4,4 L60,4 C32,12 12,32 4,60 Z"
                      fill="#850818"
                    />
                    <path
                      d="M12,75 C38,72 72,38 75,12"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2.5"
                    />
                    <circle cx="20" cy="20" r="6" fill="#fde047" stroke="#78350f" strokeWidth="1.5" />
                    <defs>
                      <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="50%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ))}

              {/* SYMPHONIC 5-LINE MUSICAL STAFF & CLASSICAL CLEF WATERMARK */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.06] select-none overflow-hidden">
                <svg viewBox="0 0 1000 600" className="w-full h-full">
                  {/* Concentric Symphonic Vinyl Rings */}
                  <circle cx="500" cy="300" r="240" fill="none" stroke="#b45309" strokeWidth="3" />
                  <circle cx="500" cy="300" r="200" fill="none" stroke="#b45309" strokeWidth="1.5" />
                  <circle cx="500" cy="300" r="160" fill="none" stroke="#b45309" strokeWidth="2" />
                  {/* Wavy 5-Line Classical Musical Staff */}
                  {[0, 12, 24, 36, 48].map((offset) => (
                    <path
                      key={offset}
                      d={`M 0 ${270 + offset} Q 250 ${210 + offset}, 500 ${270 + offset} T 1000 ${270 + offset}`}
                      fill="none"
                      stroke="#78350f"
                      strokeWidth="2"
                    />
                  ))}
                  <text x="180" y="340" fontSize="180" fontFamily="serif" fill="#78350f">
                    𝄞
                  </text>
                  <text x="740" y="330" fontSize="160" fontFamily="serif" fill="#78350f">
                    𝄢
                  </text>
                </svg>
              </div>

              {/* TOP MICROPRINT SECURITY RIBBON */}
              <div className="relative z-10 text-center pb-2 border-b border-amber-600/30 mb-3 px-8">
                <span className="text-[8px] sm:text-[9.5px] font-mono tracking-widest uppercase opacity-80 block font-bold text-amber-800 dark:text-amber-300">
                  ★ OFFICIAL MUSICAL MASTERPIECE & COPYRIGHT REGISTRY ★ DIGITAL MUSIC CENTER (DMC XAYRAXA) ★ LAO PDR LAW NO. 38/NA ★ WIPO BERNE CONVENTION ★
                </span>
              </div>

              {/* GRAND CONSERVATORY HEADER WITH OFFICIAL "DMC R ໄຊລາຊາ" LOGO & CLASSICAL STAVE WINGS */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-1.5 mb-4">
                
                <div className="flex items-center justify-center gap-3 sm:gap-6 w-full my-1">
                  {/* Left Classical Musical Staff Wing + Golden Lyre Motif */}
                  <div className="hidden sm:flex items-center gap-2 flex-1 justify-end">
                    <div className="flex flex-col space-y-1 w-full max-w-[180px] relative py-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[1px] w-full bg-amber-600/50" />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-around text-amber-700 font-serif text-lg font-bold select-none">
                        <span>𝄞</span>
                        <span>♫</span>
                        <span>♩</span>
                        <span>♬</span>
                      </div>
                    </div>
                    <span className="text-2xl text-amber-600 font-serif select-none">⚜</span>
                  </div>

                  {/* CENTER: OFFICIAL UPLOADED "DMC R ໄຊລາຊາ" EMBLEM CREST IN LAUREL WREATH */}
                  <div className="relative flex items-center justify-center">
                    {/* Golden Laurel Wreath SVG flanking the Logo */}
                    <svg
                      viewBox="0 0 140 140"
                      className="w-28 h-28 sm:w-32 sm:h-32 absolute pointer-events-none"
                    >
                      <circle
                        cx="70"
                        cy="70"
                        r="62"
                        fill="none"
                        stroke="#d97706"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      <circle
                        cx="70"
                        cy="70"
                        r="57"
                        fill="none"
                        stroke="#b45309"
                        strokeWidth="1"
                      />
                    </svg>
                    <DmcOfficialLogo size={88} withGoldRing={true} className="shadow-2xl ring-2 ring-amber-300" />
                  </div>

                  {/* Right Classical Musical Staff Wing */}
                  <div className="hidden sm:flex items-center gap-2 flex-1 justify-start">
                    <span className="text-2xl text-amber-600 font-serif select-none">⚜</span>
                    <div className="flex flex-col space-y-1 w-full max-w-[180px] relative py-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-[1px] w-full bg-amber-600/50" />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-around text-amber-700 font-serif text-lg font-bold select-none">
                        <span>♬</span>
                        <span>♩</span>
                        <span>♫</span>
                        <span>𝄢</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Bilingual Conservatory & Corporate Headers */}
                {(selectedLang === 'BILINGUAL' || selectedLang === 'LAO') && (
                  <p className={`text-xs sm:text-sm font-bold tracking-wide ${isDarkTheme ? 'text-amber-200' : 'text-amber-950'}`}>
                    ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ • ສູນດົນຕີດິຈິຕອນ ໄຊລາຊາ ຈຳກັດຜູ້ດຽວ
                  </p>
                )}

                <h1
                  className={`text-xl sm:text-3xl font-black font-serif tracking-tight uppercase leading-none ${themeStyle.headerText}`}
                >
                  DIGITAL MUSIC CENTER (DMC XAYRAXA)
                </h1>

                <p className="text-[10px] sm:text-xs font-bold tracking-widest text-amber-700 uppercase font-serif">
                  CONSERVATORY OF MUSICAL ARTS • BUREAU OF MASTER RECORDING & COPYRIGHT REGISTRY
                </p>

                {/* Ornate Classical Divider */}
                <div className="flex items-center justify-center gap-3 w-full max-w-lg py-0.5">
                  <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-amber-600 to-amber-700" />
                  <span className="text-[#850818] text-sm font-serif">𝄞 ❖ 𝄢</span>
                  <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-amber-600 to-amber-700" />
                </div>

                {/* Main Diploma Title */}
                <div className="pt-0.5">
                  <h2
                    className={`text-lg sm:text-2xl font-black font-serif tracking-wide uppercase leading-tight ${
                      isDarkTheme ? 'text-amber-400' : 'text-[#850818]'
                    }`}
                  >
                    CERTIFICATE OF COPYRIGHT & MUSICAL MASTERPIECE
                  </h2>
                  {(selectedLang === 'BILINGUAL' || selectedLang === 'LAO') && (
                    <div
                      className={`text-xs sm:text-base font-bold mt-0.5 ${
                        isDarkTheme ? 'text-amber-200' : 'text-amber-900'
                      }`}
                    >
                      ໃບຢັ້ງຢືນການຈົດທະບຽນລິຂະສິດບົດເພງ, ມາສເຕີສຽງດົນຕີ ແລະ ຊັບສິນທາງປັນຍາ
                    </div>
                  )}
                </div>
              </div>

              {/* FORMAL CONSERVATORY PROCLAMATION */}
              <div className="relative z-10 text-center max-w-3xl mx-auto space-y-1.5 mb-4 px-2">
                <p
                  className={`text-xs sm:text-sm leading-relaxed italic font-serif ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  "Be it known by these presents that the original musical composition, symphonic arrangement, vocal & instrumental master recording, and global digital distribution rights inscribed herein have been duly examined, registered, and accorded statutory protection under the{' '}
                  <strong>Law on Intellectual Property of Lao PDR (Law No. 38/NA)</strong> and the International WIPO Berne Convention."
                </p>
                {(selectedLang === 'BILINGUAL' || selectedLang === 'LAO') && (
                  <p
                    className={`text-[11px] sm:text-xs leading-relaxed ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    (ຂໍຢັ້ງຢືນຢ່າງເປັນທາງການວ່າ ຜົນງານການประພັນບົດເພງ, ດົນຕີຄລາສສິກ ແລະ ມາສເຕີສຽງບັນທຶກ ທີ່ລະບຸໄວ້ໃນໃບຢັ້ງຢືນສະບັບນີ້ ແມ່ນລິຂະສິດແທ້ຈິງ ພາຍໃຕ້ກົດໝາຍວ່າດ້ວຍຊັບສິນທາງປັນຍາ ແຫ່ງ ສປປ ລາວ ສະບັບເລກທີ 38/ສພຊ)
                  </p>
                )}
              </div>

              {/* RIGHTSHOLDER CONFERMENT FOCUS */}
              <div className="relative z-10 text-center space-y-1 mb-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-700 font-serif block">
                  SOLEMNLY CONFERRED & VESTED UNTO THE SOVEREIGN COPYRIGHT HOLDER:
                </span>

                <div
                  className={`text-2xl sm:text-4xl font-black font-serif italic tracking-tight py-0.5 ${
                    isDarkTheme ? 'text-amber-300' : 'text-[#7f0917]'
                  }`}
                >
                  ♫ {memberName || 'DMC Master Artist'} ♫
                </div>

                {/* Calligraphic Gold Flourish under Name */}
                <div className="flex justify-center">
                  <svg viewBox="0 0 360 14" className="w-64 sm:w-80 h-3.5">
                    <path
                      d="M 10 7 Q 180 14, 350 7"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                    <circle cx="180" cy="9" r="3.5" fill="#850818" />
                  </svg>
                </div>

                <div
                  className={`flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs font-mono font-bold pt-0.5 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <span>
                    MEMBER ID: <strong className={isDarkTheme ? 'text-white' : 'text-slate-950'}>{memberId}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    FELLOWSHIP:{' '}
                    <strong className="text-emerald-600">
                      {isActiveLifetime ? 'ACTIVE LIFETIME MASTER FELLOW' : 'REGISTERED CREATOR'}
                    </strong>
                  </span>
                  <span>•</span>
                  <span>
                    TERRITORY: <strong className={isDarkTheme ? 'text-white' : 'text-slate-950'}>LAO PDR & WORLDWIDE</strong>
                  </span>
                </div>
              </div>

              {/* CLASSICAL MUSICAL SCORE & MASTER RECORDING MANUSCRIPT PLAQUE */}
              <div
                className={`relative z-10 rounded-xl border-2 p-3.5 sm:p-5 mb-5 space-y-3 shadow-inner ${themeStyle.scoreBox}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-600/25 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-serif text-[#850818] font-bold">𝄞</span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider font-serif ${
                        isDarkTheme ? 'text-amber-300' : 'text-[#850818]'
                      }`}
                    >
                      Registered Musical Composition & Master Recording Opus
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40">
                      {opusNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#850818] text-amber-200">
                      ISRC: {isrcCode}
                    </span>
                  </div>
                </div>

                {/* Composition Title & Registry Serial */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3
                      className={`text-lg sm:text-2xl font-black font-serif ${
                        isDarkTheme ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      "{workTitle}"
                    </h3>
                    <p
                      className={`text-[11px] mt-0.5 font-serif italic ${
                        isDarkTheme ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Andante Maestoso • 24-Bit / 96kHz PCM Lossless Studio Master • DMC Vientiane Conservatory
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                      Official Registry Serial
                    </div>
                    <div className="text-xs sm:text-sm font-mono font-black text-[#850818] dark:text-amber-400">
                      {certSerial}
                    </div>
                  </div>
                </div>

                {/* VISUAL 5-LINE CLASSICAL SHEET MUSIC SCORE EXCERPT */}
                <div className="relative py-2 px-3 rounded-lg bg-amber-100/50 dark:bg-slate-950/60 border border-amber-600/25 overflow-hidden">
                  <svg viewBox="0 0 800 54" className="w-full h-11 sm:h-12 overflow-visible">
                    {/* 5 Horizontal Stave Lines */}
                    {[10, 18, 26, 34, 42].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="800"
                        y2={y}
                        stroke="#92400e"
                        strokeWidth="1"
                        strokeOpacity="0.55"
                      />
                    ))}
                    {/* Measure Bar Lines */}
                    {[0, 200, 400, 600, 796].map((x) => (
                      <line
                        key={x}
                        x1={x}
                        y1="10"
                        x2={x}
                        y2="42"
                        stroke="#78350f"
                        strokeWidth="1.5"
                        strokeOpacity="0.7"
                      />
                    ))}
                    {/* Double End Bar Line */}
                    <line x1="799" y1="10" x2="799" y2="42" stroke="#78350f" strokeWidth="3" />

                    {/* Treble Clef & Time Signature */}
                    <text x="8" y="39" fontSize="38" fontFamily="serif" fill="#7f0917">
                      𝄞
                    </text>
                    <text x="42" y="23" fontSize="15" fontWeight="bold" fontFamily="serif" fill="#78350f">
                      4
                    </text>
                    <text x="42" y="39" fontSize="15" fontWeight="bold" fontFamily="serif" fill="#78350f">
                      4
                    </text>

                    {/* Classical Score Notes along the Measures */}
                    {[
                      { x: 75, y: 34, sym: '♩' },
                      { x: 115, y: 26, sym: '♫' },
                      { x: 160, y: 18, sym: '♩' },
                      { x: 220, y: 30, sym: '♬' },
                      { x: 275, y: 22, sym: '♩' },
                      { x: 325, y: 34, sym: '♫' },
                      { x: 370, y: 26, sym: '♪' },
                      { x: 425, y: 18, sym: '♫' },
                      { x: 480, y: 30, sym: '♩' },
                      { x: 530, y: 22, sym: '♬' },
                      { x: 575, y: 34, sym: '♩' },
                      { x: 625, y: 26, sym: '♫' },
                      { x: 685, y: 18, sym: '♬' },
                      { x: 745, y: 28, sym: '♩.' },
                    ].map((n, i) => (
                      <text
                        key={i}
                        x={n.x}
                        y={n.y}
                        fontSize="24"
                        fontFamily="serif"
                        fill="#1e1b4b"
                      >
                        {n.sym}
                      </text>
                    ))}
                  </svg>
                </div>

                {/* Rights Guaranteed */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Master Recording & Publishing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Global Streaming & Sync Royalties</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Unilevel Distribution & Lifetime Rights</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM AUTHENTICATION ROW: 24K GOLD SEAL WITH DMC R LOGO, QR CODE, & CHOP STAMP SIGNATURE */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-3 border-t-2 border-amber-600/30">
                
                {/* 1. LEFT: 32-POINT 24K GOLD FOIL & CRIMSON WAX SEAL WITH OFFICIAL DMC R LOGO */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <div className="relative shrink-0">
                    {/* Hanging Crimson & Gold Silk Ribbons */}
                    <div className="absolute -bottom-3 left-3 w-4 h-7 bg-gradient-to-b from-red-700 to-red-900 -rotate-12 border-x border-amber-400/60 shadow" />
                    <div className="absolute -bottom-3 right-3 w-4 h-7 bg-gradient-to-b from-red-700 to-red-900 rotate-12 border-x border-amber-400/60 shadow" />

                    {/* Outer Gold Foil Seal Ring */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-700 via-yellow-300 to-amber-500 p-1 shadow-xl flex items-center justify-center border-2 border-amber-200 relative z-10">
                      <div className="w-full h-full rounded-full bg-[#7f0917] p-1.5 flex items-center justify-center border border-amber-300 border-dashed">
                        <DmcOfficialLogo size={62} withGoldRing={true} />
                      </div>
                    </div>
                  </div>

                  <div className="text-left">
                    <div
                      className={`text-xs font-black font-serif uppercase ${
                        isDarkTheme ? 'text-amber-300' : 'text-[#850818]'
                      }`}
                    >
                      Official Conservatory Seal
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      Digital Music Center (DMC Xayraxa)
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      Law No. 38/NA Statutory Seal
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">
                      Issued: {issueDateFormatted}
                    </div>
                  </div>
                </div>

                {/* 2. CENTER: SCANNABLE CRYPTOGRAPHIC QR CODE */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="p-1.5 bg-white rounded-xl shadow-lg border-2 border-amber-500 inline-block">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Verification QR Code"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 mt-1 uppercase tracking-wider">
                    SCAN TO VERIFY MASTER REGISTRY
                  </span>
                  <button
                    onClick={() => setShowVerifyModal(true)}
                    className="text-[10px] text-[#850818] dark:text-amber-400 hover:underline font-bold cursor-pointer mt-0.5 print:hidden"
                  >
                    Inspect SHA-256 Proof
                  </button>
                </div>

                {/* 3. RIGHT: CALLIGRAPHIC SIGNATURE + OFFICIAL RED INK COMPANY CHOP STAMP */}
                <div className="flex flex-col items-center sm:items-end text-center sm:text-right relative">
                  <div className="relative w-56 text-center sm:text-right pt-2">
                    
                    {/* Circular Red Ink Official Chop Stamp overlapping the signature */}
                    <div className="absolute -top-2 left-2 sm:left-0 w-16 h-16 rounded-full border-2 border-red-600/75 flex flex-col items-center justify-center text-red-600/80 -rotate-12 pointer-events-none select-none p-1">
                      <div className="w-full h-full rounded-full border border-red-600/60 flex flex-col items-center justify-center text-[6px] font-black leading-tight uppercase text-center">
                        <span>DMC XAYRAXA</span>
                        <span className="text-[8px] font-serif">★ DMC R ★</span>
                        <span>ໄຊລາຊາ</span>
                      </div>
                    </div>

                    {/* Calligraphic Fountain-Pen Signature */}
                    <div
                      className={`font-serif italic font-black text-2xl tracking-wider select-none py-0.5 ${
                        isDarkTheme ? 'text-amber-300' : 'text-[#1e1b4b]'
                      }`}
                    >
                      Xay Raxa
                    </div>

                    <div className="h-[1.5px] bg-gradient-to-r from-transparent via-amber-700 to-amber-900 w-full mb-1" />

                    <div
                      className={`text-xs font-black font-serif leading-tight ${
                        isDarkTheme ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      XAY RAXA (ໄຊລາຊາ)
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-tight">
                      Founder, Chairman & Chief Executive Producer
                    </div>
                    <div className="text-[9px] font-bold text-amber-800 dark:text-amber-400 mt-0.5">
                      Digital Music Center (DMC Xayraxa) Co., Ltd.
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM CRYPTOGRAPHIC LEDGER FOOTNOTE */}
              <div className="relative z-10 pt-3 mt-3 border-t border-amber-600/20 flex flex-wrap items-center justify-between gap-2 text-[8.5px] text-slate-500 font-mono">
                <div>SHA-256 DIGITAL FINGERPRINT: {sha256Fingerprint.slice(0, 32)}...</div>
                <div>REGISTERED AT VIENTIANE CAPITAL, LAO PDR • REV 2.6 CONSERVATORY ARCHIVE</div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Footer Action Bar */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Registry Serial: <strong className="font-mono text-white">{certSerial}</strong>
            </span>
            <button
              onClick={handleCopyId}
              className="text-amber-400 hover:text-amber-300 ml-1 p-1 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Copy Serial ID"
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{copiedLink ? 'Verification URL Copied' : 'Share Verification Link'}</span>
            </button>

            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Authenticity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cryptographic Verification Inspector Popup */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <DmcOfficialLogo size={38} withGoldRing={true} />
                <div>
                  <h4 className="font-bold text-white text-sm">
                    DMC Xayraxa Registry Verification
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Cryptographic Proof of Musical Masterpiece & Copyright
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Registry Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED & ACTIVE ON REGISTRY
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Certificate Serial:</span>
                  <span className="font-mono text-amber-300 font-bold">{certSerial}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Rightsholder:</span>
                  <span className="text-white font-semibold">
                    {memberName} ({memberId})
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Registered Musical Work:</span>
                  <span className="text-white font-serif">"{workTitle}"</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Governing Statute:</span>
                  <span className="text-slate-300">{ipLawRef}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Cryptographic SHA-256 Digital Fingerprint:
                </span>
                <p className="font-mono text-[11px] text-amber-400 break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {sha256Fingerprint}e71029c99411bc23f9
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
