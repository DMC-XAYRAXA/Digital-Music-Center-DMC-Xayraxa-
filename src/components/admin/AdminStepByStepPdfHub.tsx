/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * ADMINISTRATOR PANEL — 2/ DMC_XAYRAXA_STEP_BY_STEP_SUMMARY PDF HUB
 * Features:
 * - 1-Click Download of 3-Page A4 Official PDF (`2_DMC_Xayraxa_Step_By_Step_Summary.pdf`)
 * - Full Lao Language Version (`LO` - ສະບັບພາສາລາວ), English Version (`EN`), & Combined Bilingual (`BOTH` - 6 Pages)
 * - Executive Print (White & Gold) & Luxury Dark & Gold themes
 * - Large Full-Size A4 Preview + Fullscreen Zoom Modal + Step-by-Step Content Customizer
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Maximize2,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Globe,
  Sun,
  Moon,
  Pencil,
} from 'lucide-react';
import {
  StepByStepSummaryData,
  DEFAULT_STEP_BY_STEP_SUMMARY_DATA,
  renderStepByStepPagesAsDataUrls,
  downloadStepByStepSummaryPdf,
} from '../../utils/stepByStepSummaryPdfGenerator';
import { PdfThemeStyle, PdfLanguageVersion } from '../../utils/companyProfilePdfGenerator';

const STORAGE_KEY = 'dmc_step_by_step_summary_pdf_v1';

export const AdminStepByStepPdfHub: React.FC = () => {
  const [summaryData, setSummaryData] = useState<StepByStepSummaryData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_STEP_BY_STEP_SUMMARY_DATA, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_STEP_BY_STEP_SUMMARY_DATA;
  });

  const [pdfLang, setPdfLang] = useState<'LO' | 'EN'>('LO');
  const [pdfTheme, setPdfTheme] = useState<PdfThemeStyle>('EXECUTIVE_LIGHT');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [zoomPageIdx, setZoomPageIdx] = useState<number | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(summaryData));
    } catch {
      // ignore
    }
  }, [summaryData]);

  useEffect(() => {
    const pages = renderStepByStepPagesAsDataUrls(summaryData, pdfTheme, pdfLang);
    setPreviewUrls(pages);
  }, [summaryData, pdfTheme, pdfLang]);

  const handleDownloadPdf = async (version: PdfLanguageVersion) => {
    setIsGenerating(true);
    try {
      const filename =
        version === 'LO'
          ? '2_DMC_Xayraxa_Step_By_Step_Summary_Lao.pdf'
          : version === 'BOTH'
          ? '2_DMC_Xayraxa_Step_By_Step_Summary_Bilingual_6Pages.pdf'
          : '2_DMC_Xayraxa_Step_By_Step_Summary.pdf';
      await downloadStepByStepSummaryPdf(summaryData, filename, version, pdfTheme);
      showToast(`Downloaded ${filename} successfully!`);
    } finally {
      setIsGenerating(false);
    }
  };

  const pageLabels =
    pdfLang === 'LO'
      ? [
          'ໜ້າທີ 1: ການສະໝັກສະມາຊິກ, ອັບເກຣດ 1,600,000 ກີບ & ສິດຜະລິດເພງ (STEP 01 – 04)',
          'ໜ້າທີ 2: ການແບ່ງປັນຄ່າແນະນຳ Unilevel 3 ຊັ້ນ & ກະເປົາເງິນ 5 ບັນຊີ (STEP 05 – 07)',
          'ໜ້າທີ 3: ຫ້ອງອັດສຽງ 5 ຂັ້ນຕອນ, ຂົນສົ່ງ 18 ແຂວງ & ທະນາຄານ LAO QR (STEP 08 – 10)',
        ]
      : [
          'Page 1: Member Registration, 1.6M LAK Qualification & Song Entitlement (STEPS 01 – 04)',
          'Page 2: 3-Level Unilevel Commission Split & 5-Balance Wallet Engine (STEPS 05 – 07)',
          'Page 3: 5-Stage Studio Pipeline, 18-Province Shipping & Banking Governance (STEPS 08 – 10)',
        ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Executive Control Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg shrink-0">
              <FileText className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  2/ OFFICIAL STEP-BY-STEP SUMMARY PDF
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  10 COMPLETE STEPS • 3-PAGE A4 DOSSIER (.PDF)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                2/ DMC_Xayraxa_Step_By_Step_Summary.pdf — Complete 10-Step Operational Guide
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ເອກະສານສະຫຼຸບຂັ້ນຕອນການເຮັດວຽກທັງໝົດ 10 ຂັ້ນຕອນ (STEP 01 – STEP 10) ສະບັບພາສາລາວ ແລະ ພາສາອັງກິດ ພ້ອມດາວໂຫຼດໄຟລ໌ PDF
              </p>
            </div>
          </div>

          {/* 1-Click PDF Download Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleDownloadPdf('LO')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#df1c2d] to-[#b50f1f] hover:from-red-600 hover:to-red-700 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>🇱🇦 ດາວໂຫຼດ PDF ພາສາລາວ (3 ໜ້າ)</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleDownloadPdf('EN')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>🇬🇧 Download English PDF (3 Pages)</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleDownloadPdf('BOTH')}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>🇱🇦+🇬🇧 Both (6 Pages .PDF)</span>
            </button>
          </div>
        </div>

        {/* Language & Theme Toolbar */}
        <div className="pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Preview Language:</span>
            </span>
            <button
              type="button"
              onClick={() => setPdfLang('LO')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                pdfLang === 'LO'
                  ? 'bg-[#df1c2d] text-white shadow'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              🇱🇦 ສະບັບພາສາລາວ (LAO VERSION)
            </button>
            <button
              type="button"
              onClick={() => setPdfLang('EN')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                pdfLang === 'EN'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800'
              }`}
            >
              🇬🇧 ENGLISH VERSION
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPdfTheme('EXECUTIVE_LIGHT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                pdfTheme === 'EXECUTIVE_LIGHT'
                  ? 'bg-white text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Executive Print (White & Gold)</span>
            </button>
            <button
              type="button"
              onClick={() => setPdfTheme('LUXURY_DARK')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                pdfTheme === 'LUXURY_DARK'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Luxury Dark & Gold</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEditor(!showEditor)}
              className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{showEditor ? 'Hide Editor' : 'Edit Titles & Steps'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSummaryData(DEFAULT_STEP_BY_STEP_SUMMARY_DATA);
                showToast('Reset Step-by-Step Summary PDF to Official Revision 2.6 Defaults!');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Optional Step-by-Step Customizer Panel */}
      {showEditor && (
        <div className="rounded-3xl bg-slate-900 border border-amber-500/40 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Customize 2/ DMC_Xayraxa_Step_By_Step_Summary Headings & Signatory</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Document Title (English)
              </label>
              <input
                type="text"
                value={summaryData.documentTitleEn}
                onChange={(e) =>
                  setSummaryData({ ...summaryData, documentTitleEn: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                ຫົວຂໍ້ເອກະສານ (ພາສາລາວ)
              </label>
              <input
                type="text"
                value={summaryData.documentTitleLo}
                onChange={(e) =>
                  setSummaryData({ ...summaryData, documentTitleLo: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Full-Size Live A4 Pages Preview */}
      <div className="space-y-6">
        {previewUrls.map((url, idx) => (
          <div
            key={idx}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs font-mono">
                  PAGE 0{idx + 1} / 03
                </span>
                <h4 className="text-sm font-black text-white">{pageLabels[idx]}</h4>
              </div>
              <button
                type="button"
                onClick={() => setZoomPageIdx(idx)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen Zoom</span>
              </button>
            </div>

            <div
              onClick={() => setZoomPageIdx(idx)}
              className="max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-white cursor-pointer"
            >
              <img
                src={url}
                alt={`Step-by-Step Summary Page ${idx + 1}`}
                className="w-full h-auto block"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Zoom Modal */}
      {zoomPageIdx !== null && previewUrls[zoomPageIdx] && (
        <div
          onClick={() => setZoomPageIdx(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-6 space-y-4 my-auto"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black text-white">
                {pageLabels[zoomPageIdx]}
              </h4>
              <button
                type="button"
                onClick={() => setZoomPageIdx(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[82vh] overflow-y-auto rounded-2xl border border-slate-700">
              <img
                src={previewUrls[zoomPageIdx]}
                alt="Zoomed PDF Page"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
