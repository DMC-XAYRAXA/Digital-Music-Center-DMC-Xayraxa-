/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 04 - UNILEVEL L1/L2/L3 NETWORK & COMMISSION ENGINE
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak } from '../../utils/i18n';
import { DmcOfficialLogo } from '../common/DmcLogo';
import { 
  Users, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Copy, 
  Check, 
  QrCode, 
  Lock, 
  Clock, 
  History,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Globe,
  HelpCircle,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { QrCodeModal } from '../common/QrCodeModal';
import { DownlineOrganizeTree } from '../common/DownlineOrganizeTree';

interface NetworkScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ onNavigate }) => {
  const { currentMember, getDownlines, getSponsorChain, getMemberAwards, getMemberBalances, unallocatedAwards, language } = useDmc();
  const t = translations[language];
  const balances = getMemberBalances(currentMember.memberId);

  const [activeTab, setActiveTab] = useState<'ORGANIZE' | 'L1' | 'L2' | 'L3' | 'COMMISSIONS' | 'UNALLOCATED'>('ORGANIZE');
  const [sheetLevelTab, setSheetLevelTab] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [memberSearch, setMemberSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FREE'>('ALL');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const downlines = getDownlines(currentMember.memberId);
  const sponsorChain = getSponsorChain(currentMember.memberId);
  const myAwards = getMemberAwards(currentMember.memberId);

  const totalDownlineCount = downlines.l1.length + downlines.l2.length + downlines.l3.length;
  const activeCount = [...downlines.l1, ...downlines.l2, ...downlines.l3].filter(
    m => m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
  ).length;
  const freeCount = totalDownlineCount - activeCount;

  const referralUrl = `https://dmcxayraxa.music/register?ref=${currentMember.memberId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentSheetMembers =
    sheetLevelTab === 'L1'
      ? downlines.l1
      : sheetLevelTab === 'L2'
      ? downlines.l2
      : downlines.l3;

  const filteredSheetMembers = currentSheetMembers.filter((m) => {
    const matchesSearch =
      !memberSearch.trim() ||
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.memberId.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
        : m.membershipState !== 'ACTIVE_LIFETIME_MEMBER';
    return matchesSearch && matchesStatus;
  });

  const totalSalesRewardsLak = myAwards.reduce((acc, a) => acc + a.grossAwardLak, 0);

  return (
    <div className="@container pb-12 animate-in fade-in bg-white min-h-full">
      {/* =====================================================================
          04 · NETWORK — CRIMSON TOP APP BAR (Matches image_b670fd1b.png)
         ===================================================================== */}
      <div className="bg-gradient-to-b from-[#8f0c1c] to-[#7a0916] px-4 pt-3 pb-6 space-y-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
              aria-label="Back to Home"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <DmcOfficialLogo size={36} rounded="full" withGoldRing={true} />
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-widest text-amber-200/90 uppercase leading-none">
                DMC XAYRAXA
              </div>
              <h1 className="text-base font-black tracking-tight text-white truncate mt-0.5">
                Network
              </h1>
              <p className="text-[10px] text-amber-100/80 truncate leading-none">
                Your music community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-300" />
              <span className="uppercase">{language}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Network Info"
            >
              <HelpCircle className="w-4 h-4 text-amber-200" />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          04 · NETWORK — WHITE ROUNDED SHEET BODY (Matches image_b670fd1b.png)
         ===================================================================== */}
      <div className="bg-white rounded-t-[28px] -mt-3 px-3.5 pt-4 pb-8 min-h-[calc(100vh-140px)] space-y-4 text-slate-900 shadow-[0_-8px_25px_rgba(0,0,0,0.18)]">
        {/* Gold YOUR REFERRAL Card */}
        <div className="rounded-2xl bg-gradient-to-r from-[#f8e7b9] via-[#f3d58d] to-[#e4bc60] border border-amber-300/80 p-3.5 text-slate-900 shadow-sm flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="text-[9px] font-black uppercase tracking-wider text-amber-900/80">
              YOUR REFERRAL
            </div>
            <div className="text-sm font-black text-slate-950 truncate">
              {currentMember.name}
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 border border-amber-300 text-[10px] font-mono font-bold text-slate-800 shadow-2xs">
              {currentMember.memberId}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-[#850818] hover:bg-red-900 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : 'Copy referral link'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-[#850818] border border-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Referral QR</span>
            </button>
          </div>
        </div>

        {/* Network Overview 3-Column Card */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-slate-900">Network overview</h3>
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="flex items-center gap-2 border-r border-slate-100 pr-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#850818] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 font-mono leading-none">
                  {totalDownlineCount}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                  Total members
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-r border-slate-100 pr-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 font-mono leading-none">
                  {activeCount}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                  Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 font-mono leading-none">
                  {freeCount}
                </div>
                <div className="text-[9px] text-slate-500 font-semibold mt-0.5">
                  Free
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members (3-level Unilevel) Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">Members</h3>
            <span className="text-[10px] font-bold text-amber-700">3-level Unilevel</span>
          </div>

          {/* L1 / L2 / L3 Pill Tabs */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'L1', label: `L1 · ${downlines.l1.length}` },
                { id: 'L2', label: `L2 · ${downlines.l2.length}` },
                { id: 'L3', label: `L3 · ${downlines.l3.length}` },
              ] as const
            ).map((lvl) => {
              const isSelected = sheetLevelTab === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    setSheetLevelTab(lvl.id);
                    setActiveTab(lvl.id);
                  }}
                  className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#850818] border-[#850818] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 font-medium">
            {sheetLevelTab === 'L1'
              ? 'Direct referrals and 2 further levels'
              : `${sheetLevelTab} Indirect Unilevel tier members`}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member..."
                className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#850818]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'FREE')}
              className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#850818]"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="FREE">Free</option>
            </select>
          </div>

          {/* Clean Member Rows */}
          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {filteredSheetMembers.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No members found in {sheetLevelTab}.
              </div>
            ) : (
              filteredSheetMembers.map((m) => {
                const isMemActive = m.membershipState === 'ACTIVE_LIFETIME_MEMBER';
                return (
                  <div
                    key={m.memberId}
                    className="px-3 py-2.5 flex items-center justify-between gap-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {m.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {m.memberId} · {sheetLevelTab}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isMemActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isMemActive ? 'Active' : 'Free'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-[10px] text-slate-400">
            Showing {filteredSheetMembers.length} of {currentSheetMembers.length}
          </div>
        </div>

        {/* Sales Rewards Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#850818] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500">Sales rewards</div>
              <div className="text-lg font-black text-[#850818] font-mono leading-tight">
                {formatLak(totalSalesRewardsLak)}
              </div>
              <div className="text-[10px] text-slate-400">
                Passed hold window · Lifetime
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('COMMISSIONS')}
            className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#850818] hover:underline cursor-pointer"
          >
            <span>View reward history</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Withdrawable Now Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#850818] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-slate-500">Withdrawable now</div>
              <div className="text-sm font-black text-slate-900 font-mono">
                {formatLak(balances.available)}
              </div>
              <div className="text-[9px] text-slate-400 truncate">
                1.6M rule and available balance are separate
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('wallet')}
            className="px-3 py-1.5 rounded-xl border border-[#850818] text-[#850818] hover:bg-red-50 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            Open Wallet
          </button>
        </div>

        {/* Green Verification Notice Bar */}
        <button
          type="button"
          onClick={() => setActiveTab('COMMISSIONS')}
          className="w-full rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 flex items-center justify-between gap-2 text-xs text-emerald-800 font-semibold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Rewards follow verified sales.</span>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
        </button>
      </div>

      <div>
      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        type="REFERRAL"
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        referralCode={currentMember.memberId}
      />
      </div>
    </div>
  );
};
