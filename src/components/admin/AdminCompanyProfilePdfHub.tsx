/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * ADMINISTRATOR PANEL — 1/ COMPANY PROFILE DIGITAL MUSIC CENTER PDF FILE HUB
 * Features:
 * - Full Lao Language Version (`LO` - ສະບັບພາສາລາວ) & English Version (`EN`) Live Preview & PDF Export
 * - 1-Click Download of:
 *   1) Lao Version PDF (`1_DMC_Company_Profile_Lao_Version.pdf`)
 *   2) English Version PDF (`1_DMC_Company_Profile_English_Version.pdf`)
 *   3) Combined Lao + English 8-Page PDF (`1_DMC_Company_Profile_Lao_And_English.pdf`)
 * - Executive Print-Ready (White & Gold) + Luxury Dark & Gold Theme Switcher
 * - Full-Width Large A4 View, 2-Column Grid View & Click-to-Zoom Fullscreen Lightbox
 * - Full Administrator Edit, Update & Reset controls for both Lao & English Company Profile data
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useDmc } from '../../context/DmcContext';
import {
  CompanyProfileData,
  CompanyProfileRuntimeStats,
  DEFAULT_COMPANY_PROFILE_DATA,
  PdfLanguageVersion,
  PdfThemeStyle,
  renderCompanyProfilePageToCanvas,
  downloadCompanyProfilePdf,
} from '../../utils/companyProfilePdfGenerator';
import { DmcOfficialLogo } from '../common/DmcLogo';
import { LAO_SHIPPING_CARRIERS } from '../../types/dmc';
import {
  FileText,
  Download,
  Edit3,
  CheckCircle2,
  RotateCcw,
  Eye,
  Save,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LayoutGrid,
  Maximize2,
  Globe,
} from 'lucide-react';

const STORAGE_KEY_COMPANY_PROFILE = 'dmc_company_profile_pdf_v28';

export const AdminCompanyProfilePdfHub: React.FC = () => {
  const {
    allMembers,
    products,
    orders,
    getMemberSongs,
    laoBanks,
  } = useDmc();

  const [profileData, setProfileData] = useState<CompanyProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY_PROFILE);
      if (saved) {
        return { ...DEFAULT_COMPANY_PROFILE_DATA, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage error
    }
    return DEFAULT_COMPANY_PROFILE_DATA;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<'ALL' | 1 | 2 | 3 | 4>('ALL');
  const [layoutColumns, setLayoutColumns] = useState<1 | 2>(1);
  const [zoomedPage, setZoomedPage] = useState<1 | 2 | 3 | 4 | null>(null);
  const [pagePreviews, setPagePreviews] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeLang: PdfLanguageVersion = profileData.pdfLanguage || 'LO';
  const activeTheme: PdfThemeStyle = profileData.pdfTheme || 'EXECUTIVE_LIGHT';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPANY_PROFILE, JSON.stringify(profileData));
    } catch {
      // ignore storage error
    }
  }, [profileData]);

  const runtimeStats: CompanyProfileRuntimeStats = useMemo(() => {
    const activeLifetimeMembers = allMembers.filter(
      m => m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
    ).length;
    const totalSongs = allMembers.reduce(
      (sum, m) => sum + getMemberSongs(m.memberId).length,
      0
    );
    return {
      totalMembers: allMembers.length,
      activeLifetimeMembers,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSongs,
      totalBanks: laoBanks.length,
      supportedBanksList: laoBanks.map(b => `${b.code} (${b.name})`),
      shippingCarriersList: LAO_SHIPPING_CARRIERS.map(c => c.name),
    };
  }, [allMembers, products, orders, getMemberSongs, laoBanks]);

  // Render 4 A4 pages into high-resolution preview DataURLs whenever profileData or runtimeStats change
  useEffect(() => {
    const urls: Record<number, string> = {};
    ([1, 2, 3, 4] as const).forEach(pageNum => {
      const canvas = renderCompanyProfilePageToCanvas(
        pageNum,
        profileData,
        runtimeStats,
        activeLang
      );
      urls[pageNum] = canvas.toDataURL('image/jpeg', 0.95);
    });
    setPagePreviews(urls);
  }, [profileData, runtimeStats, activeLang]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSetLanguage = (lang: PdfLanguageVersion) => {
    setProfileData(prev => ({ ...prev, pdfLanguage: lang }));
    showToast(
      lang === 'LO'
        ? 'ປ່ຽນເປັນ ສະບັບພາສາລາວ (Lao Language Version) ແລ້ວ!'
        : 'Switched to English Version!'
    );
  };

  const handleSetTheme = (theme: PdfThemeStyle) => {
    setProfileData(prev => ({ ...prev, pdfTheme: theme }));
    showToast(
      theme === 'EXECUTIVE_LIGHT'
        ? 'Switched to Executive Print-Ready (White & Gold) PDF Theme.'
        : 'Switched to Luxury Dark & Gold PDF Theme.'
    );
  };

  const handleDownloadLaoPdf = () => {
    downloadCompanyProfilePdf(
      profileData,
      runtimeStats,
      '1_DMC_Company_Profile_Lao_Version.pdf',
      'LO'
    );
    showToast(
      'ດາວໂຫຼດ ໂປຣໄຟລ໌ບໍລິສັດ ສະບັບພາສາລາວ (1_DMC_Company_Profile_Lao_Version.pdf) ສຳເລັດແລ້ວ!'
    );
  };

  const handleDownloadEnglishPdf = () => {
    downloadCompanyProfilePdf(
      profileData,
      runtimeStats,
      '1_DMC_Company_Profile_English_Version.pdf',
      'EN'
    );
    showToast(
      'Downloaded English Company Profile PDF (1_DMC_Company_Profile_English_Version.pdf)!'
    );
  };

  const handleDownloadBothPdf = () => {
    downloadCompanyProfilePdf(
      profileData,
      runtimeStats,
      '1_DMC_Company_Profile_Lao_And_English_8Pages.pdf',
      'BOTH'
    );
    showToast(
      'Downloaded Combined 8-Page Lao + English Company Profile PDF (1_DMC_Company_Profile_Lao_And_English_8Pages.pdf)!'
    );
  };

  const handleDownloadSinglePagePng = (pageNum: 1 | 2 | 3 | 4) => {
    const canvas = renderCompanyProfilePageToCanvas(
      pageNum,
      profileData,
      runtimeStats,
      activeLang
    );
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `1_DMC_Company_Profile_${activeLang}_Page_${pageNum}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded Page ${pageNum} (${activeLang}) High-Resolution PNG!`);
  };

  const handleResetDefault = () => {
    setProfileData({
      ...DEFAULT_COMPANY_PROFILE_DATA,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    showToast('Restored default Digital Music Center (DMC) Company Profile data.');
  };

  const pageTitles: Record<1 | 2 | 3 | 4, { title: string; subtitle: string }> =
    activeLang === 'LO'
      ? {
          1: {
            title: 'ໜ້າທີ 1 — ໜ້າປົກບໍລິຫານ ແລະ ຂໍ້ມູນການຈົດທະບຽນວິສາຫະກິດ (Page 1)',
            subtitle: 'ຊື່ບໍລິສັດ, ເລກທະບຽນວິສາຫະກິດ, ເລກອາກອນ, ບົດສະຫຼຸບຜູ້ບໍລິຫານ ແລະ ສະຖິຕິອົງກອນ',
          },
          2: {
            title: 'ໜ້າທີ 2 — ວິໄສທັດ, ພັນທະກິດ ແລະ ຂັ້ນຕອນການຜະລິດເພງ 5 ຂັ້ນຕອນ (Page 2)',
            subtitle: 'ຂະບວນການແຕ່ງເພງ, ບັນທຶກສຽງຮ້ອງ, ມິກ-ມາສເຕີຣິງ ແລະ ພະແນກຈຳໜ່າຍເຄື່ອງດົນຕີ',
          },
          3: {
            title: 'ໜ້າທີ 3 — ແພັກເກັດຫຼັກ 1,600,000 ກີບ ແລະ ລະບົບບັນຊີ 5 ກະເປົາ (Page 3)',
            subtitle: 'ການແບ່ງປັນງົບ 900k ຫ້ອງອັດ / 400k L1 / 200k L2 / 100k L3 ແລະ ລະບົບບັນຊີ LAK',
          },
          4: {
            title: 'ໜ້າທີ 4 — 5 ທະນາຄານຄູ່ຮ່ວມງານໃນລາວ, ຂົນສົ່ງດ່ວນ ແລະ ກາຈ້ຳບໍລິສັດ (Page 4)',
            subtitle: 'BCEL, LDB, JDB, VietinBank, ທະນາຄານພົງສະຫວັນ (PSVB), ຂົນສົ່ງ 18 ແຂວງ ແລະ ລາຍເຊັນ CEO',
          },
        }
      : {
          1: {
            title: 'Page 1 — Executive Cover & Corporate Statutory Registration',
            subtitle: 'Legal Entity, Tax ID, Executive Summary & Real-Time Enterprise KPIs',
          },
          2: {
            title: 'Page 2 — Corporate Vision, Mission & 5-Stage Music Studio Pipeline',
            subtitle: 'Digital Music Center Recording, Mixing, Mastering & Instrument E-Commerce',
          },
          3: {
            title: 'Page 3 — Core 1,600,000 LAK Package & 5-Balance Financial Ledger',
            subtitle: '900k Studio / 400k L1 / 200k L2 / 100k L3 Split & Anti-Pyramid Safeguards',
          },
          4: {
            title: 'Page 4 — Official Lao Banking Partners, Logistics & Executive Seal',
            subtitle: 'BCEL, LDB, JDB, VietinBank, Phongsavanh Bank Laos, Express Carriers & CEO Signature',
          },
        };

  const pagesToShow: (1 | 2 | 3 | 4)[] =
    selectedPage === 'ALL' ? [1, 2, 3, 4] : [selectedPage];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Executive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <DmcOfficialLogo size={58} rounded="full" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                  OFFICIAL CORPORATE PDF DOSSIER (LAO & ENGLISH)
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {profileData.documentNumber}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  1/ Company Profile — Digital Music Center (DMC) PDF (ສະບັບພາສາລາວ & English)
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {profileData.companyNameLao} • {profileData.companyNameEn}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switcher: LAO vs ENGLISH */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-amber-500/40">
              <button
                type="button"
                onClick={() => handleSetLanguage('LO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeLang === 'LO'
                    ? 'bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🇱🇦 ສະບັບພາສາລາວ (LAO)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage('EN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeLang === 'EN'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🇬🇧 English Version (EN)</span>
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleSetTheme('EXECUTIVE_LIGHT')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTheme === 'EXECUTIVE_LIGHT'
                    ? 'bg-white text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Print White</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetTheme('LUXURY_DARK')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTheme === 'LUXURY_DARK'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Luxury Dark</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                isEditing
                  ? 'bg-sky-500 text-slate-950 border-sky-300 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Close Editor' : 'Edit / ແກ້ໄຂຂໍ້ມູນ'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click PDF Download Buttons Row (Lao PDF, English PDF, Combined 8-Page PDF) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleDownloadLaoPdf}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>🇱🇦 ດາວໂຫຼດ PDF ພາສາລາວ (4 ໜ້າ)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadEnglishPdf}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>🇬🇧 Download English PDF (4 Pages)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBothPdf}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>🇱🇦+🇬🇧 Download Both (Lao + EN 8 Pages)</span>
          </button>
        </div>

        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Administrator Editable Company Profile Form (Both Lao & English) */}
      {isEditing && (
        <div className="bg-slate-900 border-2 border-sky-500/40 rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>ແກ້ໄຂຂໍ້ມູນໂປຣໄຟລ໌ບໍລິສັດ (ພາສາລາວ & English Live Sync)</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                ທຸກການແກ້ໄຂຈະອັບເດດທັງຟາຍ PDF ສະບັບພາສາລາວ ແລະ ສະບັບພາສາອັງກິດທັນທີ.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  showToast('ບັນທຶກຂໍ້ມູນໂປຣໄຟລ໌ບໍລິສັດ (Lao & English) ສຳເລັດແລ້ວ!');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Apply to PDF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-amber-300 font-bold block mb-1">
                🇱🇦 ຊື່ບໍລິສັດທາງການ (ພາສາລາວ)
              </label>
              <input
                type="text"
                value={profileData.companyNameLao}
                onChange={e => setProfileData({ ...profileData, companyNameLao: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-sky-300 font-bold block mb-1">
                🇬🇧 Company Legal Name (English)
              </label>
              <input
                type="text"
                value={profileData.companyNameEn}
                onChange={e => setProfileData({ ...profileData, companyNameEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ເລກທີເອກະສານ (Doc Ref)</label>
              <input
                type="text"
                value={profileData.documentNumber}
                onChange={e => setProfileData({ ...profileData, documentNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-300 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ເລກທະບຽນວິສາຫະກິດ</label>
              <input
                type="text"
                value={profileData.enterpriseRegNo}
                onChange={e => setProfileData({ ...profileData, enterpriseRegNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ເລກປະຈຳຕົວຜູ້ເສຍອາກອນ</label>
              <input
                type="text"
                value={profileData.taxIdLao}
                onChange={e => setProfileData({ ...profileData, taxIdLao: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">ເບີໂທສາຍດ່ວນ / WhatsApp</label>
              <input
                type="text"
                value={profileData.hotlinePhone}
                onChange={e =>
                  setProfileData({
                    ...profileData,
                    hotlinePhone: e.target.value,
                    whatsappOfficial: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-emerald-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-amber-300 font-bold block mb-1">
                🇱🇦 ບົດສະຫຼຸບຜູ້ບໍລິຫານ (ພາສາລາວ)
              </label>
              <textarea
                rows={3}
                value={profileData.executiveSummaryLao}
                onChange={e =>
                  setProfileData({ ...profileData, executiveSummaryLao: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
              />
            </div>
            <div>
              <label className="text-sky-300 font-bold block mb-1">
                🇬🇧 Executive Summary (English)
              </label>
              <textarea
                rows={3}
                value={profileData.executiveSummary}
                onChange={e => setProfileData({ ...profileData, executiveSummary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-amber-300 font-bold block mb-1">
                🇱🇦 ວິໄສທັດຂອງບໍລິສັດ (ພາສາລາວ)
              </label>
              <textarea
                rows={3}
                value={profileData.visionStatementLao}
                onChange={e =>
                  setProfileData({ ...profileData, visionStatementLao: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
              />
            </div>
            <div>
              <label className="text-sky-300 font-bold block mb-1">
                🇬🇧 Corporate Vision Statement (English)
              </label>
              <textarea
                rows={3}
                value={profileData.visionStatement}
                onChange={e => setProfileData({ ...profileData, visionStatement: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Page Filter, Zoom Layout & Language Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold mr-2 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>
              {activeLang === 'LO' ? 'ເລືອກໜ້າເອກະສານ (ພາສາລາວ):' : 'Preview PDF Pages (EN):'}
            </span>
          </span>
          {(
            [
              { id: 'ALL', label: activeLang === 'LO' ? 'ທັງໝົດ 4 ໜ້າ' : 'All 4 Pages' },
              { id: 1, label: activeLang === 'LO' ? 'ໜ້າ 1: ໜ້າປົກ & ທະບຽນ' : 'Page 1: Cover' },
              { id: 2, label: activeLang === 'LO' ? 'ໜ້າ 2: ວິໄສທັດ & ຫ້ອງອັດ' : 'Page 2: Studio' },
              { id: 3, label: activeLang === 'LO' ? 'ໜ້າ 3: ແພັກເກັດ 1.6M' : 'Page 3: 1.6M Split' },
              { id: 4, label: activeLang === 'LO' ? 'ໜ້າ 4: ທະນາຄານ & ກາຈ້ຳ' : 'Page 4: Banks & Seal' },
            ] as const
          ).map(tab => (
            <button
              key={String(tab.id)}
              type="button"
              onClick={() => setSelectedPage(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedPage === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedPage === 'ALL' && (
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setLayoutColumns(1)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                  layoutColumns === 1
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Large Full-Size</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutColumns(2)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer ${
                  layoutColumns === 2
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>2-Column Grid</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Multi-Page A4 PDF Preview Grid */}
      <div
        className={`grid gap-6 ${
          selectedPage === 'ALL' && layoutColumns === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 max-w-4xl mx-auto'
        }`}
      >
        {pagesToShow.map(pageNum => {
          const meta = pageTitles[pageNum];
          const previewUrl = pagePreviews[pageNum];
          return (
            <div
              key={pageNum}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[10px] font-bold">
                      {activeLang === 'LO' ? `ໜ້າທີ ${pageNum} / 4 (LAO)` : `A4 PAGE ${pageNum} / 4 (EN)`}
                    </span>
                    <h4 className="font-bold text-white text-xs sm:text-sm">{meta.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{meta.subtitle}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setZoomedPage(pageNum)}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Zoom Fullscreen"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadSinglePagePng(pageNum)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title={`Download Page ${pageNum} as PNG`}
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={activeLang === 'LO' ? handleDownloadLaoPdf : handleDownloadEnglishPdf}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{activeLang === 'LO' ? 'ດາວໂຫຼດ .PDF (ລາວ)' : 'Full .PDF (EN)'}</span>
                  </button>
                </div>
              </div>

              {/* A4 Page Image Container */}
              <div
                onClick={() => setZoomedPage(pageNum)}
                className="rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-950 shadow-2xl cursor-zoom-in group relative"
                title="Click to inspect full-size A4 page"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`DMC Company Profile Page ${pageNum}`}
                    className="w-full h-auto block"
                  />
                ) : (
                  <div className="aspect-[1/1.414] flex items-center justify-center text-slate-500 text-xs">
                    Rendering A4 PDF Page {pageNum}...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen High-Resolution Zoom Lightbox Modal */}
      {zoomedPage !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-between p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-mono text-xs font-black">
                {activeLang === 'LO' ? `ໜ້າທີ ${zoomedPage} / 4 (ລາວ)` : `PAGE ${zoomedPage} OF 4 (EN)`}
              </span>
              <span className="text-sm font-bold text-white">
                {pageTitles[zoomedPage].title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSetLanguage(activeLang === 'LO' ? 'EN' : 'LO')
                }
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{activeLang === 'LO' ? 'Switch to English' : 'ປ່ຽນເປັນ ພາສາລາວ'}</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoomedPage(prev =>
                    prev ? (((prev + 2) % 4) + 1) as 1 | 2 | 3 | 4 : 1
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoomedPage(prev =>
                    prev ? ((prev % 4) + 1) as 1 | 2 | 3 | 4 : 1
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={activeLang === 'LO' ? handleDownloadLaoPdf : handleDownloadEnglishPdf}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{activeLang === 'LO' ? 'ດາວໂຫຼດ PDF (ລາວ)' : 'Download PDF (EN)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setZoomedPage(null)}
                className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-5xl my-4 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-white">
            {pagePreviews[zoomedPage] && (
              <img
                src={pagePreviews[zoomedPage]}
                alt={`Full Resolution Page ${zoomedPage}`}
                className="w-full h-auto block"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
