/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 04 - UNILEVEL L1/L2/L3 NETWORK & COMMISSION ENGINE
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak } from '../../utils/i18n';
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
  AlertCircle
} from 'lucide-react';
import { QrCodeModal } from '../common/QrCodeModal';
import { DownlineOrganizeTree } from '../common/DownlineOrganizeTree';

interface NetworkScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ onNavigate }) => {
  const { currentMember, getDownlines, getSponsorChain, getMemberAwards, unallocatedAwards, language } = useDmc();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'ORGANIZE' | 'L1' | 'L2' | 'L3' | 'COMMISSIONS' | 'UNALLOCATED'>('ORGANIZE');
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

  const referralUrl = `https://dmcxayraxa.la/register?ref=${currentMember.memberId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="@container space-y-6 pb-12 animate-in fade-in">
      {/* Scope Lock & Architecture Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-amber-950/40 border border-red-500/30 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300">
            <strong>CRITICAL SCOPE LOCK (Rev 2.6):</strong> Strict 3-Level Unilevel hierarchy. No Binary, no left/right placement, no pairing bonus, no spillover, and no carry-forward.
          </span>
        </div>
      </div>

      {/* Header & Referral Share Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>{t.networkTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.networkDesc}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{t.referralQr}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copyReferralLink}</span>
            </button>
          </div>
        </div>

        {/* 3-Level Metrics Stats */}
        <div className="grid grid-cols-2 @2xl:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.totalNetwork}</div>
            <div className="text-xl font-black text-white mt-0.5">{totalDownlineCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-[11px] text-emerald-400">{t.activeCount}</div>
            <div className="text-xl font-black text-emerald-300 mt-0.5">{activeCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-[11px] text-amber-400">{t.freeCount}</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">{freeCount}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="text-[11px] text-slate-400">{t.totalAwardsEarned}</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {formatLak(myAwards.reduce((acc, a) => acc + a.grossAwardLak, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* UPLINE SPONSOR CHAIN CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>{t.upwardSponsorLineage}</span>
        </h3>

        <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-3 text-xs">
          {/* L1 Sponsor */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="text-[10px] text-amber-400 font-bold uppercase">{t.l1Tab}</div>
            {sponsorChain.l1 ? (
              <div>
                <div className="font-bold text-white">{sponsorChain.l1.name}</div>
                <div className="text-[11px] font-mono text-slate-400">{sponsorChain.l1.memberId}</div>
              </div>
            ) : (
              <div className="text-slate-400 italic">{t.noSponsor}</div>
            )}
          </div>

          {/* L2 Sponsor */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{t.l2Tab}</div>
            {sponsorChain.l2 ? (
              <div>
                <div className="font-bold text-white">{sponsorChain.l2.name}</div>
                <div className="text-[11px] font-mono text-slate-400">{sponsorChain.l2.memberId}</div>
              </div>
            ) : (
              <div className="text-slate-400 italic">None (Unallocated L2)</div>
            )}
          </div>

          {/* L3 Sponsor */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1">
            <div className="text-[10px] text-slate-400 font-bold uppercase">{t.l3Tab}</div>
            {sponsorChain.l3 ? (
              <div>
                <div className="font-bold text-white">{sponsorChain.l3.name}</div>
                <div className="text-[11px] font-mono text-slate-400">{sponsorChain.l3.memberId}</div>
              </div>
            ) : (
              <div className="text-slate-400 italic">None (Unallocated L3)</div>
            )}
          </div>
        </div>
      </div>

      {/* TIER TABS & VIEWER */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('ORGANIZE')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ORGANIZE' ? 'bg-purple-600 text-white font-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Downline Organize Chart</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {totalDownlineCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('L1')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'L1' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.l1Tab}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {downlines.l1.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('L2')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'L2' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.l2Tab}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {downlines.l2.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('L3')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'L3' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.l3Tab}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {downlines.l3.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMMISSIONS')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'COMMISSIONS' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.commissionHistory}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {myAwards.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('UNALLOCATED')}
            className={`px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'UNALLOCATED' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.unallocatedLogTab}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/30">
              {unallocatedAwards.length}
            </span>
          </button>
        </div>

        {/* Tab 0: Visual Downline Organize Tree Chart */}
        {activeTab === 'ORGANIZE' && <DownlineOrganizeTree />}

        {/* Tab 1, 2, 3: Downlines List */}
        {(activeTab === 'L1' || activeTab === 'L2' || activeTab === 'L3') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>
                Showing {activeTab} level members invited directly or downline
              </span>
              <span>
                {activeTab === 'L1' ? '400k LAK Music split / 50% Catalog pool' : activeTab === 'L2' ? '200k LAK Music split / 30% Catalog pool' : '100k LAK Music split / 20% Catalog pool'}
              </span>
            </div>

            {downlines[activeTab.toLowerCase() as 'l1' | 'l2' | 'l3'].length > 0 ? (
              <div className="space-y-2">
                {downlines[activeTab.toLowerCase() as 'l1' | 'l2' | 'l3'].map(m => (
                  <div
                    key={m.memberId}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="font-mono text-slate-400">({m.memberId})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Joined: {new Date(m.createdAt).toLocaleDateString()} • Phone: {m.phone}
                      </div>
                    </div>

                    <div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                      }`}>
                        {m.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE LIFETIME' : 'FREE MEMBER'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No members found at tier {activeTab} yet. Share your invite link to build this level!
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Commission Award History */}
        {activeTab === 'COMMISSIONS' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span>Deterministic Unilevel Awards Record</span>
              <span>Rule Version: v2.6 Approved</span>
            </div>

            {myAwards.length > 0 ? (
              <div className="space-y-2">
                {myAwards.map(a => (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono text-[10px]">
                          {a.tier}
                        </span>
                        <span>{a.sku}</span>
                        <span className="text-slate-400 font-normal">Order: {a.orderId}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Buyer: {a.buyerMemberId} • Awarded: {new Date(a.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-amber-300 font-mono">
                        +{formatLak(a.grossAwardLak)}
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'AVAILABLE'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : a.status === 'HELD_FOR_QUALIFICATION'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No commission awards generated yet.
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Auditable Unallocated Pool */}
        {activeTab === 'UNALLOCATED' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.unallocatedNotice}</span>
            </div>

            <div className="space-y-2">
              {unallocatedAwards.map(u => (
                <div
                  key={u.id}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-200">
                      Tier {u.tier} missing upline on {u.sku}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Order: {u.orderId} • Logged at {new Date(u.recordedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-300">{formatLak(u.amountLak)}</div>
                    <span className="text-[10px] text-amber-400 font-mono uppercase">Held in Unallocated</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        type="REFERRAL"
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        referralCode={currentMember.memberId}
      />
    </div>
  );
};
