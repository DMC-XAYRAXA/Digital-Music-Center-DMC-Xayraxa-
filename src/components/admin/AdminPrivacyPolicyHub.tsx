import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { DmcPrivacyPolicyCategory, DmcPrivacyPolicySection } from '../../types/dmc';
import { downloadExcelWorkbook, downloadCsvFile, ExcelSheetData } from '../../utils/excelExport';
import { DmcOfficialLogo } from '../common/DmcLogo';
import {
  ShieldCheck,
  FileText,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  Coins,
  Music,
  Lock,
  Download,
  FileSpreadsheet,
  Search,
  Eye,
} from 'lucide-react';
import { DmcMembershipTermsModal } from '../common/DmcMembershipTermsModal';

const CATEGORY_META: Record<
  DmcPrivacyPolicyCategory,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  MEMBERSHIP_TERMS: {
    label: 'Membership Terms (0 LAK)',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: Sparkles,
  },
  PRIVACY_POLICY: {
    label: 'Privacy & Data Protection',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: ShieldCheck,
  },
  COMMISSION_FINANCE: {
    label: 'Commission & Wallet Rules',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: Coins,
  },
  COPYRIGHT_LAW: {
    label: 'Copyright Law No. 38/NA',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    icon: Music,
  },
  DATA_SECURITY: {
    label: '12-Hour Session & Security',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: Lock,
  },
};

export const AdminPrivacyPolicyHub: React.FC = () => {
  const {
    privacyPolicySections,
    adminAddPrivacyPolicySection,
    adminUpdatePrivacyPolicySection,
    adminDeletePrivacyPolicySection,
    adminResetPrivacyPolicySections,
  } = useDmc();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<DmcPrivacyPolicyCategory | 'ALL'>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formState, setFormState] = useState<{
    articleNo: string;
    category: DmcPrivacyPolicyCategory;
    title: string;
    titleLo: string;
    summary: string;
    bulletPointsText: string;
    effectiveDate: string;
    status: 'ACTIVE' | 'DRAFT';
  }>({
    articleNo: `Article ${privacyPolicySections.length + 1}`,
    category: 'PRIVACY_POLICY',
    title: '',
    titleLo: '',
    summary: '',
    bulletPointsText: '',
    effectiveDate: '2026-10-18',
    status: 'ACTIVE',
  });

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const resetForm = (nextCount = privacyPolicySections.length + 1) => {
    setEditingId(null);
    setFormState({
      articleNo: `Article ${nextCount}`,
      category: 'PRIVACY_POLICY',
      title: '',
      titleLo: '',
      summary: '',
      bulletPointsText: '',
      effectiveDate: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE',
    });
  };

  const handleEditSection = (sec: DmcPrivacyPolicySection) => {
    setEditingId(sec.id);
    setFormState({
      articleNo: sec.articleNo,
      category: sec.category,
      title: sec.title,
      titleLo: sec.titleLo || '',
      summary: sec.summary,
      bulletPointsText: sec.bulletPoints.join('\n'),
      effectiveDate: sec.effectiveDate,
      status: sec.status,
    });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bullets = formState.bulletPointsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingId) {
      adminUpdatePrivacyPolicySection(editingId, {
        articleNo: formState.articleNo.trim() || 'Article',
        category: formState.category,
        title: formState.title.trim() || 'Official DMC Policy Article',
        titleLo: formState.titleLo.trim() || undefined,
        summary: formState.summary.trim(),
        bulletPoints: bullets.length > 0 ? bullets : [formState.summary.trim()],
        effectiveDate: formState.effectiveDate,
        status: formState.status,
      });
      showToast(`Updated Privacy & Policy Article: "${formState.title}"`);
      resetForm(privacyPolicySections.length + 1);
    } else {
      const created = adminAddPrivacyPolicySection({
        articleNo: formState.articleNo.trim() || `Article ${privacyPolicySections.length + 1}`,
        category: formState.category,
        title: formState.title.trim() || 'Official DMC Policy Article',
        titleLo: formState.titleLo.trim() || undefined,
        summary: formState.summary.trim(),
        bulletPoints: bullets.length > 0 ? bullets : [formState.summary.trim()],
        effectiveDate: formState.effectiveDate,
        status: formState.status,
      });
      showToast(`Created new Privacy & Policy Article: "${created.title}"`);
      resetForm(privacyPolicySections.length + 2);
    }
  };

  const buildPolicySheet = (): ExcelSheetData => ({
    sheetName: '8_Privacy_And_Policy',
    title: '8/ PRIVACY & POLICY AND MEMBERSHIP TERMS REPORT — DMC XAYRAXA',
    subtitle: `Total Policy Articles: ${privacyPolicySections.length} • Official Membership Terms (0 LAK) & Data Protection Clauses`,
    headers: [
      'No.',
      'Policy ID',
      'Article Number',
      'Category',
      'Policy Title (English)',
      'Policy Title (Lao ພາສາລາວ)',
      'Summary Description',
      'Detailed Clauses / Bullet Points',
      'Effective Date',
      'Status',
      'Last Updated At',
    ],
    rows: privacyPolicySections.map((sec, idx) => [
      idx + 1,
      sec.id,
      sec.articleNo,
      sec.category,
      sec.title,
      sec.titleLo || '-',
      sec.summary,
      sec.bulletPoints.join(' | '),
      sec.effectiveDate,
      sec.status,
      sec.updatedAt ? sec.updatedAt.slice(0, 19).replace('T', ' ') : '-',
    ]),
  });

  const handleExportExcel = () => {
    const sheet = buildPolicySheet();
    downloadExcelWorkbook('8_DMC_Privacy_And_Policy_File.xls', [sheet]);
    showToast('Downloaded 8_DMC_Privacy_And_Policy_File.xls!');
  };

  const handleExportCsv = () => {
    const sheet = buildPolicySheet();
    downloadCsvFile('8_DMC_Privacy_And_Policy_File.csv', sheet);
    showToast('Downloaded 8_DMC_Privacy_And_Policy_File.csv!');
  };

  const filteredSections = privacyPolicySections.filter((sec) => {
    if (filterCategory !== 'ALL' && sec.category !== filterCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      (sec.titleLo || '').toLowerCase().includes(q) ||
      sec.summary.toLowerCase().includes(q) ||
      sec.articleNo.toLowerCase().includes(q) ||
      sec.bulletPoints.some((b) => b.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border-2 border-teal-500/40 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DmcOfficialLogo size={46} rounded="xl" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span>Privacy & Policy + Membership Terms (0 LAK) — Admin CRUD</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-400/40">
                  {privacyPolicySections.length} ARTICLES • LIVE SYNC
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Create, Edit, Update, Delete, and Export all DMC Xayraxa Privacy Policy & Membership Terms articles shown on the New Member Registration & Policy screen.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Member Reader Modal</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel (.xls)</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>.CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                adminResetPrivacyPolicySections();
                resetForm(8);
                showToast('Reset Privacy & Policy articles to official defaults.');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {notice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notice}</span>
            </span>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-emerald-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main 2-Column CRUD Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Add / Edit Privacy & Policy Form */}
        <form
          onSubmit={handleSaveSubmit}
          className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 self-start"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  {editingId ? 'Edit & Update Policy Article' : 'Create New Policy Article'}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Synchronizes immediately with Registration Terms & Report #8
                </p>
              </div>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={() => resetForm()}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Article Number *
              </label>
              <input
                type="text"
                required
                value={formState.articleNo}
                onChange={(e) => setFormState({ ...formState, articleNo: e.target.value })}
                placeholder="e.g. Article 8"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={formState.category}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    category: e.target.value as DmcPrivacyPolicyCategory,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-teal-300 font-bold"
              >
                <option value="MEMBERSHIP_TERMS">Membership Terms (0 LAK)</option>
                <option value="PRIVACY_POLICY">Privacy & Data Protection</option>
                <option value="COMMISSION_FINANCE">Commission & Wallet Rules</option>
                <option value="COPYRIGHT_LAW">Copyright Law No. 38/NA</option>
                <option value="DATA_SECURITY">12-Hour Session & Security</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Effective Date
              </label>
              <input
                type="text"
                value={formState.effectiveDate}
                onChange={(e) => setFormState({ ...formState, effectiveDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Status
              </label>
              <select
                value={formState.status}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    status: e.target.value as 'ACTIVE' | 'DRAFT',
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold"
              >
                <option value="ACTIVE">ACTIVE (Published)</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Policy Title (English) *
              </label>
              <input
                type="text"
                required
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                placeholder="e.g. Personal Data Privacy & Lao Banking Confidentiality"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Policy Title (Lao ພາສາລາວ)
              </label>
              <input
                type="text"
                value={formState.titleLo}
                onChange={(e) => setFormState({ ...formState, titleLo: e.target.value })}
                placeholder="e.g. ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Summary Description *
              </label>
              <input
                type="text"
                required
                value={formState.summary}
                onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                placeholder="Brief summary of this policy article..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Detailed Clauses / Bullet Points (One per line) *
              </label>
              <textarea
                rows={4}
                required
                value={formState.bulletPointsText}
                onChange={(e) =>
                  setFormState({ ...formState, bulletPointsText: e.target.value })
                }
                placeholder="Enter each clause on a new line..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white leading-relaxed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>
              {editingId ? 'Save & Update Policy Article' : '+ Add Privacy & Policy Article'}
            </span>
          </button>
        </form>

        {/* Right: Existing Privacy & Policy Articles List */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <FileText className="w-4 h-4 text-teal-400" />
              <h4 className="text-sm font-black text-white">
                Official Privacy & Policy Articles ({filteredSections.length})
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as DmcPrivacyPolicyCategory | 'ALL')
                }
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-semibold"
              >
                <option value="ALL">All Categories</option>
                <option value="MEMBERSHIP_TERMS">Membership Terms (0 LAK)</option>
                <option value="PRIVACY_POLICY">Privacy & Data Protection</option>
                <option value="COMMISSION_FINANCE">Commission & Wallet Rules</option>
                <option value="COPYRIGHT_LAW">Copyright Law No. 38/NA</option>
                <option value="DATA_SECURITY">12-Hour Session & Security</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search policy..."
                  className="bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-40 sm:w-48"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => {
              const meta = CATEGORY_META[sec.category] || CATEGORY_META.PRIVACY_POLICY;
              const Icon = meta.icon;
              return (
                <div
                  key={sec.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2 ${
                    editingId === sec.id
                      ? 'bg-slate-950 border-amber-400 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                          {sec.articleNo}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-bold ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Effective: {sec.effectiveDate}
                        </span>
                      </div>
                      <h5 className="text-sm font-black text-white flex items-center gap-2 pt-0.5">
                        <Icon className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{sec.title}</span>
                      </h5>
                      {sec.titleLo && (
                        <div className="text-xs font-semibold text-amber-300/90">
                          {sec.titleLo}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditSection(sec)}
                        className="px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/35 border border-sky-500/40 text-sky-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          adminDeletePrivacyPolicySection(sec.id);
                          showToast(`Deleted Policy Article: "${sec.title}"`);
                        }}
                        className="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 cursor-pointer"
                        title="Delete Policy Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {sec.summary && (
                    <p className="text-xs text-slate-400 italic">{sec.summary}</p>
                  )}

                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    {sec.bulletPoints.map((pt, idx) => (
                      <li key={idx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DmcMembershipTermsModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
};
