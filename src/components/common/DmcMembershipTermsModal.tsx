import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Scale,
  Coins,
  Users,
  Music,
  Lock,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Save,
} from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';
import { useDmc } from '../../context/DmcContext';
import { DmcPrivacyPolicyCategory, DmcPrivacyPolicySection } from '../../types/dmc';

interface DmcMembershipTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptTerms?: () => void;
}

const CATEGORY_META: Record<
  DmcPrivacyPolicyCategory,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  MEMBERSHIP_TERMS: {
    label: 'Membership Terms (0 LAK)',
    badgeClass: 'bg-amber-100 text-[#6B0816] border-amber-300',
    icon: Sparkles,
  },
  PRIVACY_POLICY: {
    label: 'Privacy & Data Protection',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: ShieldCheck,
  },
  COMMISSION_FINANCE: {
    label: 'Commission & Wallet Rules',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    icon: Coins,
  },
  COPYRIGHT_LAW: {
    label: 'Copyright Law No. 38/NA',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    icon: Music,
  },
  DATA_SECURITY: {
    label: '12-Hour Session & Security',
    badgeClass: 'bg-slate-200 text-slate-900 border-slate-400',
    icon: Lock,
  },
};

export const DmcMembershipTermsModal: React.FC<DmcMembershipTermsModalProps> = ({
  isOpen,
  onClose,
  onAcceptTerms,
}) => {
  const {
    privacyPolicySections,
    adminAddPrivacyPolicySection,
    adminUpdatePrivacyPolicySection,
    adminDeletePrivacyPolicySection,
    adminResetPrivacyPolicySections,
    isAdminAuthenticated,
    isAdminMode,
  } = useDmc();

  const isAdmin = isAdminAuthenticated || isAdminMode;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
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

  if (!isOpen) return null;

  const openAddForm = () => {
    setEditingId(null);
    setFormState({
      articleNo: `Article ${privacyPolicySections.length + 1}`,
      category: 'PRIVACY_POLICY',
      title: '',
      titleLo: '',
      summary: '',
      bulletPointsText: '',
      effectiveDate: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE',
    });
    setIsAddingNew(true);
  };

  const openEditForm = (sec: DmcPrivacyPolicySection) => {
    setIsAddingNew(false);
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

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    const bullets = formState.bulletPointsText
      .split('\n')
      .map((b) => b.trim())
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
      setEditingId(null);
    } else {
      adminAddPrivacyPolicySection({
        articleNo: formState.articleNo.trim() || `Article ${privacyPolicySections.length + 1}`,
        category: formState.category,
        title: formState.title.trim() || 'Official DMC Policy Article',
        titleLo: formState.titleLo.trim() || undefined,
        summary: formState.summary.trim(),
        bulletPoints: bullets.length > 0 ? bullets : [formState.summary.trim()],
        effectiveDate: formState.effectiveDate,
        status: formState.status,
      });
      setIsAddingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#FAF8F5] text-slate-900 border-2 border-[#C5A059] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* 1. HERITAGE HEADER */}
        <div className="bg-gradient-to-b from-[#6B0816] via-[#4E0510] to-[#36030A] text-white px-5 py-4 border-b-2 border-[#C5A059] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-0.5 rounded-full bg-gradient-to-b from-[#E5C158] to-[#9A7426] shrink-0">
              <DmcOfficialLogo size={42} rounded="full" withGoldRing={false} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#E5C158] text-[#36030A] text-[10px] font-black uppercase tracking-wider">
                  Official Terms & Privacy Policy v2.6
                </span>
                <span className="text-[11px] text-amber-200/90 font-mono">
                  Free 0 LAK Registration • {privacyPolicySections.length} Articles
                </span>
              </div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#F9E498] tracking-wide truncate mt-0.5">
                DMC XAYRAXA Membership Terms & Privacy Policy
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && (
              <button
                type="button"
                onClick={openAddForm}
                className="px-2.5 py-1.5 rounded-lg bg-[#E5C158] hover:bg-amber-300 text-[#36030A] text-[11px] font-black flex items-center gap-1 cursor-pointer shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Article</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-100 hover:text-white border border-white/20 transition-colors cursor-pointer shrink-0"
              aria-label="Close Terms and Conditions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. SCROLLABLE TERMS & PRIVACY POLICY BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Intro Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-[#C5A059]/60 text-slate-800 space-y-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 font-bold text-[#6B0816] text-xs sm:text-sm">
                <FileText className="w-4 h-4 shrink-0" />
                <span>
                  Xayraxa Digital Music Center (DMC) — Membership Terms & Privacy Policy
                </span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={adminResetPrivacyPolicySections}
                  className="px-2 py-0.5 rounded bg-white hover:bg-amber-100 border border-[#C5A059] text-[#6B0816] text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-700">
              Please read these official Membership Terms & Privacy Policy articles before registering your account. By checking{' '}
              <strong className="text-[#6B0816]">
                &ldquo;I agree to the DMC XAYRAXA Membership Terms (Free 0 LAK Registration)&rdquo;
              </strong>
              , you acknowledge and accept the rights, privacy protections, and rules below.
            </p>
          </div>

          {/* Admin Add / Edit Form Inside Modal */}
          {isAdmin && (isAddingNew || editingId) && (
            <form
              onSubmit={handleSaveSection}
              className="p-4 rounded-xl bg-amber-50 border-2 border-[#6B0816] space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                <span className="text-xs font-black uppercase text-[#6B0816]">
                  {editingId ? 'Edit Privacy & Policy Article' : 'Create New Privacy & Policy Article'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setIsAddingNew(false);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Article No.
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.articleNo}
                    onChange={(e) => setFormState({ ...formState, articleNo: e.target.value })}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        category: e.target.value as DmcPrivacyPolicyCategory,
                      })
                    }
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  >
                    <option value="MEMBERSHIP_TERMS">Membership Terms (0 LAK)</option>
                    <option value="PRIVACY_POLICY">Privacy & Data Protection</option>
                    <option value="COMMISSION_FINANCE">Commission & Wallet Rules</option>
                    <option value="COPYRIGHT_LAW">Copyright Law No. 38/NA</option>
                    <option value="DATA_SECURITY">12-Hour Session & Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="text"
                    value={formState.effectiveDate}
                    onChange={(e) => setFormState({ ...formState, effectiveDate: e.target.value })}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Article Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.title}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Article Title (Lao ພາສາລາວ)
                  </label>
                  <input
                    type="text"
                    value={formState.titleLo}
                    onChange={(e) => setFormState({ ...formState, titleLo: e.target.value })}
                    className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  Summary Description *
                </label>
                <input
                  type="text"
                  required
                  value={formState.summary}
                  onChange={(e) => setFormState({ ...formState, summary: e.target.value })}
                  className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                  Detailed Clauses / Bullet Points (One per line) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formState.bulletPointsText}
                  onChange={(e) => setFormState({ ...formState, bulletPointsText: e.target.value })}
                  className="w-full bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#6B0816] hover:bg-[#8A0B1D] text-[#F9E498] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingId ? 'Update Policy Article' : 'Save New Policy Article'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Dynamic List of Privacy & Policy / Membership Terms Articles */}
          {privacyPolicySections.map((sec) => {
            const meta = CATEGORY_META[sec.category] || CATEGORY_META.PRIVACY_POLICY;
            const Icon = meta.icon;
            return (
              <div
                key={sec.id}
                className="p-4 rounded-xl bg-white border border-[#D8D0C0] space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#6B0816] text-[#F9E498] text-[10px] font-black uppercase">
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
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm pt-1">
                      <Icon className="w-4 h-4 text-[#6B0816] shrink-0" />
                      <span>{sec.title}</span>
                    </h3>
                    {sec.titleLo && (
                      <div className="text-[11px] font-semibold text-amber-800">{sec.titleLo}</div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditForm(sec)}
                        className="px-2 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => adminDeletePrivacyPolicySection(sec.id)}
                        className="p-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                        title="Delete Policy Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {sec.summary && (
                  <p className="text-xs text-slate-600 italic">{sec.summary}</p>
                )}

                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  {sec.bulletPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 3. FOOTER ACTIONS */}
        <div className="bg-[#EFECE4] px-5 py-3.5 border-t border-[#C8BFA8] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
            <Scale className="w-3.5 h-3.5 text-[#6B0816]" />
            <span>Governed by Xayraxa Digital Music Center (DMC) • Lao PDR</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            {onAcceptTerms && (
              <button
                type="button"
                onClick={() => {
                  onAcceptTerms();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#7C0A1B] to-[#510510] hover:from-[#8F0C20] hover:to-[#630614] text-[#F9E498] font-bold text-xs border border-[#C5A059] shadow flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F9E498]" />
                <span>I Agree to Membership Terms (0 LAK)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
