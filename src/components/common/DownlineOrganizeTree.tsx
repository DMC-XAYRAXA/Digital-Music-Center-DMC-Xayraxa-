import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { formatLakCompact } from '../../utils/i18n';
import { Member } from '../../types/dmc';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  RotateCcw,
  Crown,
  ChevronRight,
  Phone,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';

interface DownlineOrganizeTreeProps {
  initialRootMemberId?: string;
  compactMode?: boolean;
  onAddDownlineClick?: (sponsorId: string) => void;
}

export const DownlineOrganizeTree: React.FC<DownlineOrganizeTreeProps> = ({
  initialRootMemberId,
  compactMode = false,
  onAddDownlineClick,
}) => {
  const {
    currentMember,
    allMembers,
    getDownlines,
    getSponsorChain,
    getMemberBalances,
    isAdminAuthenticated,
    isAdminMode,
    adminAddMember,
  } = useDmc();

  const isAdmin = isAdminAuthenticated || isAdminMode;

  const [focusedMemberId, setFocusedMemberId] = useState<string>(
    initialRootMemberId || currentMember.memberId
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddSponsorId, setQuickAddSponsorId] = useState<string>(currentMember.memberId);
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddPhone, setQuickAddPhone] = useState('+856 20 ');
  const [quickAddState, setQuickAddState] = useState<Member['membershipState']>(
    'ACTIVE_LIFETIME_MEMBER'
  );

  // Sync root if currentMember changes and user hasn't manually drilled down
  React.useEffect(() => {
    if (!initialRootMemberId) {
      setFocusedMemberId(currentMember.memberId);
    }
  }, [currentMember.memberId, initialRootMemberId]);

  const rootMember =
    allMembers.find((m) => m.memberId === focusedMemberId) || currentMember;
  const downlines = getDownlines(rootMember.memberId);
  const sponsorChain = getSponsorChain(rootMember.memberId);

  const totalDownlines =
    downlines.l1.length + downlines.l2.length + downlines.l3.length;
  const activeDownlines = [
    ...downlines.l1,
    ...downlines.l2,
    ...downlines.l3,
  ].filter((m) => m.membershipState === 'ACTIVE_LIFETIME_MEMBER').length;

  const selectedMember = selectedNodeId
    ? allMembers.find((m) => m.memberId === selectedNodeId) || rootMember
    : rootMember;
  const selectedBalances = getMemberBalances(selectedMember.memberId);
  const selectedDownlines = getDownlines(selectedMember.memberId);

  const getAvatar = (m: Member, fallbackIdx = 0) => {
    if (m.avatarUrl) return m.avatarUrl;
    const defaults = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
    ];
    return defaults[fallbackIdx % defaults.length];
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddName.trim()) return;
    adminAddMember({
      name: quickAddName.trim(),
      phone: quickAddPhone.trim() || '+856 20 5500 1122',
      sponsorId: quickAddSponsorId,
      membershipState: quickAddState,
      initialHeldLak: quickAddState === 'FREE_MEMBER' ? 400000 : 0,
      initialAvailableLak: quickAddState === 'ACTIVE_LIFETIME_MEMBER' ? 400000 : 0,
    });
    setQuickAddName('');
    setQuickAddPhone('+856 20 ');
    setShowQuickAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Organization Control Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <DmcOfficialLogo size={38} rounded="xl" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Downline Organize Chart (3-Level Unilevel Tree)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  {isAdmin ? 'ADMIN & USER VIEW' : 'MY DOWNLINE ORGANIZE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Visual organization hierarchy (Root → Level 1 → Level 2 → Level 3). Tap any member node to inspect or expand their branch.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {focusedMemberId !== currentMember.memberId && (
              <button
                type="button"
                onClick={() => {
                  setFocusedMemberId(currentMember.memberId);
                  setSelectedNodeId(currentMember.memberId);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>My Root ({currentMember.memberId})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onAddDownlineClick) {
                  onAddDownlineClick(rootMember.memberId);
                } else {
                  setQuickAddSponsorId(rootMember.memberId);
                  setShowQuickAddModal(true);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-black flex items-center gap-1 shadow cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Downline</span>
            </button>
          </div>
        </div>

        {/* Member Selector Bar (For Administrator to switch any Member Root, or User to search/jump) */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[220px]">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Viewing Organize Root:</span>
            </span>
            <select
              value={rootMember.memberId}
              onChange={(e) => {
                setFocusedMemberId(e.target.value);
                setSelectedNodeId(e.target.value);
              }}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {allMembers
                .filter(
                  (m) =>
                    !searchFilter.trim() ||
                    m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    m.memberId.toLowerCase().includes(searchFilter.toLowerCase())
                )
                .map((m) => {
                  const dl = getDownlines(m.memberId);
                  const count = dl.l1.length + dl.l2.length + dl.l3.length;
                  return (
                    <option key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId}) — {count} Downlines
                    </option>
                  );
                })}
            </select>

            {sponsorChain.l1 && (
              <button
                type="button"
                onClick={() => {
                  if (sponsorChain.l1) {
                    setFocusedMemberId(sponsorChain.l1.memberId);
                    setSelectedNodeId(sponsorChain.l1.memberId);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 cursor-pointer"
                title="Go up 1 level to Direct Upline Sponsor"
              >
                ↑ Upline: {sponsorChain.l1.name.split(' ')[0]} ({sponsorChain.l1.memberId})
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search member..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-36 sm:w-44"
            />
          </div>
        </div>

        {/* Summary Level Pills */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <div className="text-[10px] font-bold text-purple-300 uppercase">Total Organize</div>
            <div className="text-sm sm:text-base font-black text-white font-mono">
              {totalDownlines}
            </div>
            <div className="text-[9px] text-emerald-400 font-semibold">
              {activeDownlines} Active
            </div>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <div className="text-[10px] font-bold text-amber-300 uppercase">Level 1 (Direct)</div>
            <div className="text-sm sm:text-base font-black text-amber-400 font-mono">
              {downlines.l1.length}
            </div>
            <div className="text-[9px] text-slate-400">400k / 50%</div>
          </div>
          <div className="p-2 rounded-xl bg-sky-950/30 border border-sky-500/30">
            <div className="text-[10px] font-bold text-sky-300 uppercase">Level 2</div>
            <div className="text-sm sm:text-base font-black text-sky-400 font-mono">
              {downlines.l2.length}
            </div>
            <div className="text-[9px] text-slate-400">200k / 30%</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <div className="text-[10px] font-bold text-emerald-300 uppercase">Level 3</div>
            <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">
              {downlines.l3.length}
            </div>
            <div className="text-[9px] text-slate-400">100k / 20%</div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          VISUAL HIERARCHICAL ORGANIZATION TREE DIAGRAM (Matching Oganize.jpg)
         ======================================================================== */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-purple-50/40 text-slate-900 rounded-3xl border-2 border-purple-200/80 shadow-xl p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[540px] flex flex-col items-center">
          {/* ---------------- LEVEL 0: ROOT HEAD NODE ---------------- */}
          <div className="flex flex-col items-center relative">
            <div
              onClick={() => setSelectedNodeId(rootMember.memberId)}
              className={`group cursor-pointer flex flex-col items-center transition-transform hover:scale-105 ${
                selectedMember.memberId === rootMember.memberId ? 'scale-105' : ''
              }`}
            >
              {/* Crown Badge */}
              <div className="mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow">
                <Crown className="w-3 h-3 text-amber-300" />
                <span>ORGANIZE HEAD (ROOT)</span>
              </div>

              {/* Circle Profile Ring matching Oganize.jpg */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-amber-400 shadow-lg">
                <img
                  src={getAvatar(rootMember, 0)}
                  alt={rootMember.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                <span
                  className={`absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white shadow ${
                    rootMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                      ? 'bg-emerald-500'
                      : 'bg-amber-400'
                  }`}
                  title={rootMember.membershipState}
                />
              </div>

              {/* Name & ID Pill Box below Circle (Matching Oganize.jpg purple pill bar) */}
              <div className="mt-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-center shadow-md border border-purple-400/40 min-w-[130px] max-w-[180px]">
                <div className="text-[11px] font-black truncate">{rootMember.name}</div>
                <div className="text-[9px] font-mono text-amber-300 font-bold">
                  {rootMember.memberId}
                </div>
                <div className="mt-0.5 flex items-center justify-center gap-1">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                      rootMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-amber-300 text-slate-950'
                    }`}
                  >
                    {rootMember.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE' : 'FREE'}
                  </span>
                  <span className="text-[8px] text-purple-200 font-mono">
                    L1: {downlines.l1.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Stem Down from Root to L1 Branch Bar */}
            {downlines.l1.length > 0 && (
              <div className="w-0.5 h-6 bg-purple-700/70" />
            )}
          </div>

          {/* ---------------- LEVEL 1 -> LEVEL 2 -> LEVEL 3 BRANCHING TREE ---------------- */}
          {downlines.l1.length > 0 ? (
            <div className="w-full flex flex-col items-center">
              {/* L1 Nodes Row */}
              <div className="relative flex items-start justify-center gap-3 sm:gap-5 w-full pt-0">
                {downlines.l1.map((l1Member, l1Idx) => {
                  const l2Children = downlines.l2.filter(
                    (m) => m.sponsorId === l1Member.memberId
                  );
                  const isFirstL1 = l1Idx === 0;
                  const isLastL1 = l1Idx === downlines.l1.length - 1;
                  const onlyOneL1 = downlines.l1.length === 1;

                  return (
                    <div
                      key={l1Member.memberId}
                      className="flex-1 flex flex-col items-center relative min-w-[145px]"
                    >
                      {/* Top Horizontal Connector Line across L1 siblings */}
                      {!onlyOneL1 && (
                        <div
                          className={`absolute top-0 h-0.5 bg-purple-700/70 ${
                            isFirstL1
                              ? 'left-1/2 right-0'
                              : isLastL1
                              ? 'left-0 right-1/2'
                              : 'left-0 right-0'
                          }`}
                        />
                      )}

                      {/* Vertical Drop Line into L1 Node */}
                      <div className="w-0.5 h-5 bg-purple-700/70" />

                      {/* LEVEL 1 NODE CARD */}
                      <div
                        onClick={() => setSelectedNodeId(l1Member.memberId)}
                        onDoubleClick={() => setFocusedMemberId(l1Member.memberId)}
                        className={`cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                          selectedMember.memberId === l1Member.memberId
                            ? 'ring-2 ring-purple-600 rounded-2xl p-1 bg-purple-100/60'
                            : ''
                        }`}
                        title="Click to inspect • Double-click to focus tree on this member"
                      >
                        <span className="mb-1 px-2 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow-xs">
                          LEVEL 1 (L1)
                        </span>

                        <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-400 shadow-md">
                          <img
                            src={getAvatar(l1Member, l1Idx + 1)}
                            alt={l1Member.name}
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
                              l1Member.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                ? 'bg-emerald-500'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>

                        {/* Purple Label Pill matching Oganize.jpg */}
                        <div className="mt-1 px-2.5 py-1 rounded-xl bg-purple-800 text-white text-center shadow border border-purple-500/30 w-32 sm:w-36">
                          <div className="text-[10px] font-extrabold truncate">
                            {l1Member.name}
                          </div>
                          <div className="text-[8px] font-mono text-amber-300">
                            {l1Member.memberId}
                          </div>
                          <div className="mt-0.5 flex items-center justify-center gap-1">
                            <span
                              className={`px-1 rounded text-[7px] font-black ${
                                l1Member.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-amber-300 text-slate-950'
                              }`}
                            >
                              {l1Member.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                ? 'ACTIVE'
                                : 'FREE'}
                            </span>
                            <span className="text-[8px] text-purple-200 font-mono">
                              L2:{l2Children.length}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ---------------- LEVEL 2 CHILDREN UNDER THIS L1 NODE ---------------- */}
                      {l2Children.length > 0 && (
                        <>
                          {/* Vertical Stem from L1 to L2 */}
                          <div className="w-0.5 h-5 bg-purple-600/60" />

                          <div className="relative flex items-start justify-center gap-2 w-full">
                            {l2Children.map((l2Member, l2Idx) => {
                              const l3Children = downlines.l3.filter(
                                (m) => m.sponsorId === l2Member.memberId
                              );
                              const isFirstL2 = l2Idx === 0;
                              const isLastL2 = l2Idx === l2Children.length - 1;
                              const onlyOneL2 = l2Children.length === 1;

                              return (
                                <div
                                  key={l2Member.memberId}
                                  className="flex-1 flex flex-col items-center relative min-w-[96px]"
                                >
                                  {/* Horizontal Bar connecting L2 siblings */}
                                  {!onlyOneL2 && (
                                    <div
                                      className={`absolute top-0 h-0.5 bg-purple-600/60 ${
                                        isFirstL2
                                          ? 'left-1/2 right-0'
                                          : isLastL2
                                          ? 'left-0 right-1/2'
                                          : 'left-0 right-0'
                                      }`}
                                    />
                                  )}

                                  {/* Vertical Drop into L2 Node */}
                                  <div className="w-0.5 h-4 bg-purple-600/60" />

                                  {/* LEVEL 2 NODE */}
                                  <div
                                    onClick={() => setSelectedNodeId(l2Member.memberId)}
                                    onDoubleClick={() => setFocusedMemberId(l2Member.memberId)}
                                    className={`cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                                      selectedMember.memberId === l2Member.memberId
                                        ? 'ring-2 ring-purple-600 rounded-xl p-0.5 bg-purple-100/70'
                                        : ''
                                    }`}
                                  >
                                    <span className="mb-0.5 px-1.5 py-0.2 rounded-full bg-sky-600 text-white text-[7px] font-black uppercase">
                                      L2
                                    </span>

                                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 to-sky-400 shadow">
                                      <img
                                        src={getAvatar(l2Member, l1Idx * 3 + l2Idx + 2)}
                                        alt={l2Member.name}
                                        className="w-full h-full rounded-full object-cover border border-white"
                                      />
                                      <span
                                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                                          l2Member.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                            ? 'bg-emerald-500'
                                            : 'bg-amber-400'
                                        }`}
                                      />
                                    </div>

                                    <div className="mt-1 px-2 py-0.5 rounded-lg bg-purple-700 text-white text-center shadow-xs w-24 sm:w-28">
                                      <div className="text-[9px] font-bold truncate">
                                        {l2Member.name.split(' ')[0]}
                                      </div>
                                      <div className="text-[7px] font-mono text-amber-200 truncate">
                                        {l2Member.memberId}
                                      </div>
                                    </div>
                                  </div>

                                  {/* ---------------- LEVEL 3 CHILDREN UNDER THIS L2 NODE ---------------- */}
                                  {l3Children.length > 0 && (
                                    <>
                                      <div className="w-0.5 h-4 bg-purple-500/50" />
                                      <div className="relative flex items-start justify-center gap-1.5 w-full">
                                        {l3Children.map((l3Member, l3Idx) => {
                                          const isFirstL3 = l3Idx === 0;
                                          const isLastL3 = l3Idx === l3Children.length - 1;
                                          const onlyOneL3 = l3Children.length === 1;

                                          return (
                                            <div
                                              key={l3Member.memberId}
                                              className="flex-1 flex flex-col items-center relative min-w-[72px]"
                                            >
                                              {!onlyOneL3 && (
                                                <div
                                                  className={`absolute top-0 h-0.5 bg-purple-500/50 ${
                                                    isFirstL3
                                                      ? 'left-1/2 right-0'
                                                      : isLastL3
                                                      ? 'left-0 right-1/2'
                                                      : 'left-0 right-0'
                                                  }`}
                                                />
                                              )}
                                              <div className="w-0.5 h-3.5 bg-purple-500/50" />

                                              {/* LEVEL 3 NODE */}
                                              <div
                                                onClick={() =>
                                                  setSelectedNodeId(l3Member.memberId)
                                                }
                                                onDoubleClick={() =>
                                                  setFocusedMemberId(l3Member.memberId)
                                                }
                                                className={`cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                                                  selectedMember.memberId === l3Member.memberId
                                                    ? 'ring-2 ring-purple-600 rounded-lg p-0.5 bg-purple-100/70'
                                                    : ''
                                                }`}
                                              >
                                                <span className="mb-0.5 px-1 rounded bg-emerald-600 text-white text-[6px] font-black uppercase">
                                                  L3
                                                </span>
                                                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full p-0.5 bg-gradient-to-tr from-purple-500 to-emerald-400 shadow-xs">
                                                  <img
                                                    src={getAvatar(
                                                      l3Member,
                                                      l1Idx + l2Idx + l3Idx + 4
                                                    )}
                                                    alt={l3Member.name}
                                                    className="w-full h-full rounded-full object-cover border border-white"
                                                  />
                                                </div>
                                                <div className="mt-0.5 px-1.5 py-0.5 rounded bg-purple-800/95 text-white text-center w-18 sm:w-20 shadow-xs">
                                                  <div className="text-[8px] font-bold truncate">
                                                    {l3Member.name.split(' ')[0]}
                                                  </div>
                                                  <div className="text-[6px] font-mono text-amber-200 truncate">
                                                    {l3Member.memberId}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600">
                No Direct Downline (L1) members under {rootMember.name} ({rootMember.memberId}) yet.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuickAddSponsorId(rootMember.memberId);
                  setShowQuickAddModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite / Add First L1 Downline Member</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Member Inspector Card */}
      {!compactMode && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={getAvatar(selectedMember, 0)}
              alt={selectedMember.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-white text-sm">{selectedMember.name}</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">
                  {selectedMember.memberId}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    selectedMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {selectedMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                    ? 'ACTIVE LIFETIME'
                    : 'FREE MEMBER'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-sky-400" />
                  {selectedMember.phone}
                </span>
                <span>•</span>
                <span>Sponsor: {selectedMember.sponsorId || 'ROOT (Direct)'}</span>
                <span>•</span>
                <span>
                  Sub-Organize: L1({selectedDownlines.l1.length}) / L2(
                  {selectedDownlines.l2.length}) / L3({selectedDownlines.l3.length})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-right font-mono">
              <div className="text-[10px] text-slate-400">
                Held:{' '}
                <strong className="text-amber-300">
                  {formatLakCompact(selectedBalances.heldForQualification)}
                </strong>
              </div>
              <div className="text-[10px] text-slate-400">
                Avail:{' '}
                <strong className="text-emerald-400">
                  {formatLakCompact(selectedBalances.available)}
                </strong>
              </div>
            </div>

            {selectedMember.memberId !== focusedMemberId && (
              <button
                type="button"
                onClick={() => setFocusedMemberId(selectedMember.memberId)}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow"
              >
                <span>Focus Organize Here</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setQuickAddSponsorId(selectedMember.memberId);
                setShowQuickAddModal(true);
              }}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 cursor-pointer shadow"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add L1 Under {selectedMember.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Downline Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-black text-white">
                  Add Downline Member to Organize Tree
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Direct Upline Sponsor (L1 Parent)
                </label>
                <select
                  value={quickAddSponsorId}
                  onChange={(e) => setQuickAddSponsorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold"
                >
                  {allMembers.map((m) => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.name} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  New Downline Member Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={quickAddName}
                  onChange={(e) => setQuickAddName(e.target.value)}
                  placeholder="e.g. Souriya Phommachanh"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Phone Number (+856) *
                </label>
                <input
                  type="text"
                  required
                  value={quickAddPhone}
                  onChange={(e) => setQuickAddPhone(e.target.value)}
                  placeholder="+856 20 5588 9900"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Initial Membership Status
                </label>
                <select
                  value={quickAddState}
                  onChange={(e) =>
                    setQuickAddState(e.target.value as Member['membershipState'])
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold"
                >
                  <option value="ACTIVE_LIFETIME_MEMBER">
                    ACTIVE LIFETIME MEMBER (1.6M LAK Qualified)
                  </option>
                  <option value="FREE_MEMBER">FREE MEMBER (Accumulating Held Credit)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black cursor-pointer shadow"
                >
                  Save to Organize Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
