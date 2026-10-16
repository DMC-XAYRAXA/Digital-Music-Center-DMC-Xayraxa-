import React, { useState, useEffect } from 'react';
import { formatLak } from '../../utils/i18n';
import { DMC_STANDARD_PRICING } from '../../types/dmc';
import { useDmc } from '../../context/DmcContext';
import { ShieldCheck, Sparkles, Tag, Users, Pencil, Check, RotateCcw, X } from 'lucide-react';

export interface DmcPricingUpdatePayload {
  marketPriceLak: number;
  memberPriceLak: number;
  memberDiscountLak: number;
  commissionPoolLak: number;
  l1Percent: number;
  l2Percent: number;
  l3Percent: number;
}

interface DmcPricingStructureCardProps {
  marketPriceLak?: number;
  memberPriceLak?: number;
  memberDiscountLak?: number;
  commissionPoolLak?: number;
  l1Percent?: number;
  l2Percent?: number;
  l3Percent?: number;
  compact?: boolean;
  title?: string;
  onSavePricing?: (payload: DmcPricingUpdatePayload) => void;
}

const STORAGE_KEY_STD_PRICING = 'dmc_rev26_standard_pricing_v1';

/**
 * Official DMC Product & Music Course Pricing Structure Component
 * Enforces that Commission Distribution (L1 50%, L2 30%, L3 20%) is calculated
 * strictly from the 450,000 LAK Commission Pool (100%), never from the Member Discount.
 * Also allows Administrators to input/edit values directly via type="number" inputs.
 */
export const DmcPricingStructureCard: React.FC<DmcPricingStructureCardProps> = ({
  marketPriceLak,
  memberPriceLak,
  memberDiscountLak,
  commissionPoolLak,
  l1Percent,
  l2Percent,
  l3Percent,
  compact = false,
  title = 'DMC Product & Music Course Pricing Structure',
  onSavePricing,
}) => {
  const { isAdminAuthenticated, isAdminMode } = useDmc();
  const isAdmin = isAdminAuthenticated || isAdminMode;

  // Load any saved global standard pricing override for default props
  const [savedGlobal, setSavedGlobal] = useState<DmcPricingUpdatePayload>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STD_PRICING);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          marketPriceLak: Number(parsed.marketPriceLak) || DMC_STANDARD_PRICING.marketPriceLak,
          memberPriceLak: Number(parsed.memberPriceLak) || DMC_STANDARD_PRICING.memberPriceLak,
          memberDiscountLak:
            parsed.memberDiscountLak !== undefined
              ? Number(parsed.memberDiscountLak)
              : DMC_STANDARD_PRICING.memberDiscountLak,
          commissionPoolLak:
            Number(parsed.commissionPoolLak) || DMC_STANDARD_PRICING.commissionPoolLak,
          l1Percent: Number(parsed.l1Percent) || DMC_STANDARD_PRICING.l1Percent,
          l2Percent: Number(parsed.l2Percent) || DMC_STANDARD_PRICING.l2Percent,
          l3Percent: Number(parsed.l3Percent) || DMC_STANDARD_PRICING.l3Percent,
        };
      }
    } catch {
      // ignore
    }
    return {
      marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
      memberPriceLak: DMC_STANDARD_PRICING.memberPriceLak,
      memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
      commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
      l1Percent: DMC_STANDARD_PRICING.l1Percent,
      l2Percent: DMC_STANDARD_PRICING.l2Percent,
      l3Percent: DMC_STANDARD_PRICING.l3Percent,
    };
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_STD_PRICING);
        if (raw) setSavedGlobal(JSON.parse(raw));
      } catch {
        // ignore
      }
    };
    window.addEventListener('dmc-standard-pricing-updated', handleSync);
    return () => window.removeEventListener('dmc-standard-pricing-updated', handleSync);
  }, []);

  const effectiveMarketPrice =
    marketPriceLak !== undefined && marketPriceLak >= 0
      ? marketPriceLak
      : savedGlobal.marketPriceLak;
  const effectiveMemberPrice =
    memberPriceLak !== undefined && memberPriceLak >= 0
      ? memberPriceLak
      : savedGlobal.memberPriceLak;
  const effectiveDiscount =
    memberDiscountLak !== undefined && memberDiscountLak >= 0
      ? memberDiscountLak
      : Math.max(0, effectiveMarketPrice - effectiveMemberPrice);
  const effectivePool =
    commissionPoolLak !== undefined && commissionPoolLak >= 0
      ? commissionPoolLak
      : savedGlobal.commissionPoolLak;
  const effL1Pct = l1Percent !== undefined ? l1Percent : savedGlobal.l1Percent;
  const effL2Pct = l2Percent !== undefined ? l2Percent : savedGlobal.l2Percent;
  const effL3Pct = l3Percent !== undefined ? l3Percent : savedGlobal.l3Percent;

  // Administrator inline number input state
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    marketPriceLak: string;
    memberPriceLak: string;
    memberDiscountLak: string;
    commissionPoolLak: string;
    l1Percent: string;
    l2Percent: string;
    l3Percent: string;
  }>({
    marketPriceLak: String(effectiveMarketPrice),
    memberPriceLak: String(effectiveMemberPrice),
    memberDiscountLak: String(effectiveDiscount),
    commissionPoolLak: String(effectivePool),
    l1Percent: String(effL1Pct),
    l2Percent: String(effL2Pct),
    l3Percent: String(effL3Pct),
  });

  const openEditor = () => {
    setDraft({
      marketPriceLak: String(effectiveMarketPrice),
      memberPriceLak: String(effectiveMemberPrice),
      memberDiscountLak: String(effectiveDiscount),
      commissionPoolLak: String(effectivePool),
      l1Percent: String(effL1Pct),
      l2Percent: String(effL2Pct),
      l3Percent: String(effL3Pct),
    });
    setIsEditing(true);
  };

  const activeMkt = isEditing ? Number(draft.marketPriceLak) || 0 : effectiveMarketPrice;
  const activeMem = isEditing ? Number(draft.memberPriceLak) || 0 : effectiveMemberPrice;
  const activeDisc = isEditing ? Number(draft.memberDiscountLak) || 0 : effectiveDiscount;
  const activePool = isEditing ? Number(draft.commissionPoolLak) || 0 : effectivePool;
  const activeL1Pct = isEditing ? Number(draft.l1Percent) || 0 : effL1Pct;
  const activeL2Pct = isEditing ? Number(draft.l2Percent) || 0 : effL2Pct;
  const activeL3Pct = isEditing ? Number(draft.l3Percent) || 0 : effL3Pct;

  // Commission MUST be calculated from the Commission Pool (e.g., 450,000 LAK = 100%), NOT the member discount
  const l2Amount = Math.floor((activePool * (activeL2Pct * 100)) / 10000);
  const l3Amount = Math.floor((activePool * (activeL3Pct * 100)) / 10000);
  const l1Amount = Math.max(0, activePool - l2Amount - l3Amount);

  const handleSaveNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DmcPricingUpdatePayload = {
      marketPriceLak: Math.max(0, Math.round(Number(draft.marketPriceLak) || 0)),
      memberPriceLak: Math.max(0, Math.round(Number(draft.memberPriceLak) || 0)),
      memberDiscountLak: Math.max(0, Math.round(Number(draft.memberDiscountLak) || 0)),
      commissionPoolLak: Math.max(0, Math.round(Number(draft.commissionPoolLak) || 0)),
      l1Percent: Math.max(0, Number(draft.l1Percent) || 0),
      l2Percent: Math.max(0, Number(draft.l2Percent) || 0),
      l3Percent: Math.max(0, Number(draft.l3Percent) || 0),
    };

    if (onSavePricing) {
      onSavePricing(payload);
    } else {
      setSavedGlobal(payload);
      try {
        localStorage.setItem(STORAGE_KEY_STD_PRICING, JSON.stringify(payload));
        window.dispatchEvent(new Event('dmc-standard-pricing-updated'));
      } catch {
        // ignore
      }
    }
    setIsEditing(false);
    setSavedNotice('Updated pricing & commission numbers!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleResetDefault = () => {
    const defPayload: DmcPricingUpdatePayload = {
      marketPriceLak: DMC_STANDARD_PRICING.marketPriceLak,
      memberPriceLak: DMC_STANDARD_PRICING.memberPriceLak,
      memberDiscountLak: DMC_STANDARD_PRICING.memberDiscountLak,
      commissionPoolLak: DMC_STANDARD_PRICING.commissionPoolLak,
      l1Percent: DMC_STANDARD_PRICING.l1Percent,
      l2Percent: DMC_STANDARD_PRICING.l2Percent,
      l3Percent: DMC_STANDARD_PRICING.l3Percent,
    };
    setDraft({
      marketPriceLak: String(defPayload.marketPriceLak),
      memberPriceLak: String(defPayload.memberPriceLak),
      memberDiscountLak: String(defPayload.memberDiscountLak),
      commissionPoolLak: String(defPayload.commissionPoolLak),
      l1Percent: String(defPayload.l1Percent),
      l2Percent: String(defPayload.l2Percent),
      l3Percent: String(defPayload.l3Percent),
    });
    if (onSavePricing) {
      onSavePricing(defPayload);
    } else {
      setSavedGlobal(defPayload);
      try {
        localStorage.setItem(STORAGE_KEY_STD_PRICING, JSON.stringify(defPayload));
        window.dispatchEvent(new Event('dmc-standard-pricing-updated'));
      } catch {
        // ignore
      }
    }
    setIsEditing(false);
    setSavedNotice('Reset to official default (6.2M / 4.2M / 450K LAK)!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  if (compact) {
    return (
      <div className="rounded-xl bg-slate-950/95 border border-amber-500/40 p-3 space-y-2.5 text-xs shadow-inner">
        {isAdmin && (
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Admin Number Input
            </span>
            {!isEditing ? (
              <button
                type="button"
                onClick={openEditor}
                className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Pencil className="w-2.5 h-2.5" />
                <span>Input / Edit Numbers</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-2.5 h-2.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        )}

        {savedNotice && (
          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
            {savedNotice}
          </div>
        )}

        {isAdmin && isEditing ? (
          <form onSubmit={handleSaveNumbers} className="space-y-2 text-[11px]">
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-0.5">
                  Market Price (LAK)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={draft.marketPriceLak}
                  onChange={(e) => {
                    const val = e.target.value;
                    const mktNum = Number(val) || 0;
                    const memNum = Number(draft.memberPriceLak) || 0;
                    setDraft({
                      ...draft,
                      marketPriceLak: val,
                      memberDiscountLak: String(Math.max(0, mktNum - memNum)),
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono font-bold text-xs focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                  Member Price (LAK)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={draft.memberPriceLak}
                  onChange={(e) => {
                    const val = e.target.value;
                    const memNum = Number(val) || 0;
                    const mktNum = Number(draft.marketPriceLak) || 0;
                    setDraft({
                      ...draft,
                      memberPriceLak: val,
                      memberDiscountLak: String(Math.max(0, mktNum - memNum)),
                    });
                  }}
                  className="w-full bg-slate-900 border border-amber-500/60 rounded-lg px-2 py-1 text-amber-300 font-mono font-black text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="block text-[10px] text-emerald-400 font-semibold mb-0.5">
                  Member Discount (LAK)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={draft.memberDiscountLak}
                  onChange={(e) =>
                    setDraft({ ...draft, memberDiscountLak: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-2 py-1 text-emerald-400 font-mono font-bold text-xs focus:border-emerald-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-amber-300 font-bold mb-0.5">
                  Commission Pool (LAK)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={draft.commissionPoolLak}
                  onChange={(e) =>
                    setDraft({ ...draft, commissionPoolLak: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-lg px-2 py-1 text-amber-300 font-mono font-bold text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <label className="block text-[9px] text-amber-300 font-bold mb-0.5">
                  L1 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={draft.l1Percent}
                  onChange={(e) => setDraft({ ...draft, l1Percent: e.target.value })}
                  className="w-full bg-slate-900 border border-amber-500/40 rounded-lg px-2 py-1 text-white font-mono font-bold text-xs text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-sky-300 font-bold mb-0.5">
                  L2 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={draft.l2Percent}
                  onChange={(e) => setDraft({ ...draft, l2Percent: e.target.value })}
                  className="w-full bg-slate-900 border border-sky-500/40 rounded-lg px-2 py-1 text-white font-mono font-bold text-xs text-center"
                />
              </div>
              <div>
                <label className="block text-[9px] text-emerald-300 font-bold mb-0.5">
                  L3 (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="any"
                  value={draft.l3Percent}
                  onChange={(e) => setDraft({ ...draft, l3Percent: e.target.value })}
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg px-2 py-1 text-white font-mono font-bold text-xs text-center"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Default</span>
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save Numbers</span>
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Top Pricing Rows: Market Price, DMC Member Price, Member Discount, Commission Pool */}
            <div className="space-y-1.5 pb-2 border-b border-slate-800/90">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-[11px] font-medium text-slate-400">Market Price:</span>
                <span className="font-mono font-semibold text-slate-300 line-through decoration-rose-500/80">
                  {formatLak(activeMkt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300">DMC Member Price:</span>
                <span className="font-mono font-black text-sm text-amber-400">
                  {formatLak(activeMem)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-400">Member Discount:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatLak(activeDisc)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/70">
                <span className="text-[11px] font-bold text-white">Commission Pool:</span>
                <span className="font-mono font-black text-amber-300">
                  {formatLak(activePool)} = 100%
                </span>
              </div>
            </div>

            {/* Commission Distribution: L1 50%, L2 30%, L3 20% from Pool */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Commission Distribution:
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  From {formatLak(activePool)} Pool
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                  <div className="text-[10px] font-bold text-amber-300">L1: {activeL1Pct}%</div>
                  <div className="text-[11px] font-black text-white mt-0.5">
                    {formatLak(l1Amount)}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-sky-500/15 border border-sky-500/30">
                  <div className="text-[10px] font-bold text-sky-300">L2: {activeL2Pct}%</div>
                  <div className="text-[11px] font-black text-white mt-0.5">
                    {formatLak(l2Amount)}
                  </div>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                  <div className="text-[10px] font-bold text-emerald-300">L3: {activeL3Pct}%</div>
                  <div className="text-[11px] font-black text-white mt-0.5">
                    {formatLak(l3Amount)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 p-4 sm:p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white">{title}</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Official Pricing
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              The commission is calculated strictly from the {formatLak(activePool)} pool (100%), not the member discount.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => (isEditing ? setIsEditing(false) : openEditor())}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border transition-all cursor-pointer ${
                isEditing
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow'
              }`}
              title="Administrator: Input or Edit Pricing & Commission Numbers"
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close Number Input</span>
                </>
              ) : (
                <>
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Admin: Input / Edit Numbers</span>
                </>
              )}
            </button>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Pool = 100% ({formatLak(activePool)})</span>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{savedNotice}</span>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="text-emerald-300 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSaveNumbers}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Left Column: Price & Discount Breakdown */}
          <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-3.5 space-y-2.5 flex flex-col justify-between">
            <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>DMC Product & Course Pricing</span>
              </span>
              {isAdmin && !isEditing && (
                <button
                  type="button"
                  onClick={openEditor}
                  className="text-[10px] text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Type Number ✎
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {/* Market Price */}
              <div className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <span className="text-slate-300 font-semibold shrink-0">• Market Price:</span>
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={draft.marketPriceLak}
                      onChange={(e) => {
                        const val = e.target.value;
                        const mktNum = Number(val) || 0;
                        const memNum = Number(draft.memberPriceLak) || 0;
                        setDraft({
                          ...draft,
                          marketPriceLak: val,
                          memberDiscountLak: String(Math.max(0, mktNum - memNum)),
                        });
                      }}
                      className="w-36 bg-slate-950 border border-slate-600 focus:border-amber-400 rounded-lg px-2.5 py-1 text-right font-mono font-bold text-white outline-none"
                    />
                    <span className="text-[10px] font-mono text-slate-400">LAK</span>
                  </div>
                ) : (
                  <span className="font-mono font-bold text-slate-300 line-through decoration-rose-500/80">
                    {formatLak(activeMkt)}
                  </span>
                )}
              </div>

              {/* DMC Member Price */}
              <div className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40">
                <span className="text-amber-200 font-extrabold shrink-0">• DMC Member Price:</span>
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={draft.memberPriceLak}
                      onChange={(e) => {
                        const val = e.target.value;
                        const memNum = Number(val) || 0;
                        const mktNum = Number(draft.marketPriceLak) || 0;
                        setDraft({
                          ...draft,
                          memberPriceLak: val,
                          memberDiscountLak: String(Math.max(0, mktNum - memNum)),
                        });
                      }}
                      className="w-36 bg-slate-950 border-2 border-amber-400 rounded-lg px-2.5 py-1 text-right font-mono font-black text-amber-300 outline-none"
                    />
                    <span className="text-[10px] font-mono text-amber-300">LAK</span>
                  </div>
                ) : (
                  <span className="font-mono font-black text-sm text-amber-400">
                    {formatLak(activeMem)}
                  </span>
                )}
              </div>

              {/* Member Discount */}
              <div className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-emerald-300 font-bold shrink-0">• Member Discount:</span>
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={draft.memberDiscountLak}
                      onChange={(e) =>
                        setDraft({ ...draft, memberDiscountLak: e.target.value })
                      }
                      className="w-36 bg-slate-950 border border-emerald-400 rounded-lg px-2.5 py-1 text-right font-mono font-black text-emerald-400 outline-none"
                    />
                    <span className="text-[10px] font-mono text-emerald-400">LAK</span>
                  </div>
                ) : (
                  <span className="font-mono font-black text-emerald-400">
                    {formatLak(activeDisc)}
                  </span>
                )}
              </div>

              {/* Commission Pool */}
              <div className="flex items-center justify-between gap-2 py-1.5 px-2.5 rounded-lg bg-indigo-500/15 border border-indigo-500/40">
                <span className="text-white font-extrabold shrink-0">• Commission Pool:</span>
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={draft.commissionPoolLak}
                      onChange={(e) =>
                        setDraft({ ...draft, commissionPoolLak: e.target.value })
                      }
                      className="w-36 bg-slate-950 border-2 border-amber-400 rounded-lg px-2.5 py-1 text-right font-mono font-black text-amber-300 outline-none"
                    />
                    <span className="text-[10px] font-mono text-amber-300">= 100%</span>
                  </div>
                ) : (
                  <span className="font-mono font-black text-amber-300">
                    {formatLak(activePool)} = 100%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Commission Distribution (L1 50%, L2 30%, L3 20%) */}
          <div className="rounded-xl bg-slate-950/90 border border-amber-500/30 p-3.5 space-y-2.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Commission Distribution</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                100% = {formatLak(activePool)}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-amber-500/15 border border-amber-500/40">
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-extrabold text-amber-300">• L1 (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={draft.l1Percent}
                      onChange={(e) => setDraft({ ...draft, l1Percent: e.target.value })}
                      className="w-16 bg-slate-950 border border-amber-400 rounded-lg px-2 py-0.5 text-center font-mono font-black text-white outline-none"
                    />
                  </div>
                ) : (
                  <span className="font-sans font-extrabold text-amber-300">
                    • L1: {activeL1Pct}%
                  </span>
                )}
                <span className="font-black text-sm text-white">= {formatLak(l1Amount)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-sky-500/15 border border-sky-500/40">
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-extrabold text-sky-300">• L2 (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={draft.l2Percent}
                      onChange={(e) => setDraft({ ...draft, l2Percent: e.target.value })}
                      className="w-16 bg-slate-950 border border-sky-400 rounded-lg px-2 py-0.5 text-center font-mono font-black text-white outline-none"
                    />
                  </div>
                ) : (
                  <span className="font-sans font-extrabold text-sky-300">
                    • L2: {activeL2Pct}%
                  </span>
                )}
                <span className="font-black text-sm text-white">= {formatLak(l2Amount)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40">
                {isAdmin && isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans font-extrabold text-emerald-300">• L3 (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      value={draft.l3Percent}
                      onChange={(e) => setDraft({ ...draft, l3Percent: e.target.value })}
                      className="w-16 bg-slate-950 border border-emerald-400 rounded-lg px-2 py-0.5 text-center font-mono font-black text-white outline-none"
                    />
                  </div>
                ) : (
                  <span className="font-sans font-extrabold text-emerald-300">
                    • L3: {activeL3Pct}%
                  </span>
                )}
                <span className="font-black text-sm text-white">= {formatLak(l3Amount)}</span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-amber-200/90 font-medium flex items-center justify-between border-t border-slate-800/80">
              <span>Calculated from {formatLak(activePool)} pool (not discount)</span>
              <span className="font-mono font-bold text-emerald-400">
                {activeL1Pct}% + {activeL2Pct}% + {activeL3Pct}% ={' '}
                {activeL1Pct + activeL2Pct + activeL3Pct}%
              </span>
            </div>
          </div>
        </div>

        {isAdmin && isEditing && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default (6.2M / 4.2M / 450K LAK)</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save / Update Pricing Numbers</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

