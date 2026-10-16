import React, { useState, useRef } from 'react';
import { useDmc } from '../../context/DmcContext';
import { formatLakCompact } from '../../utils/i18n';
import {
  Member,
  LAO_SHIPPING_CARRIERS,
  LaoShippingCarrierId,
  DMC_STAFF_POSITIONS,
  StaffPosition,
} from '../../types/dmc';
import {
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  Users,
  RotateCcw,
  Crown,
  ChevronRight,
  Phone,
  Search,
  Camera,
  Edit3,
  Trash2,
  Upload,
  Save,
  X,
  Lock,
  Unlock,
  Mail,
  Building2,
  MapPin,
  Wallet,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';
import { downloadExcelWorkbook, ExcelSheetData } from '../../utils/excelExport';

interface DownlineOrganizeTreeProps {
  initialRootMemberId?: string;
  compactMode?: boolean;
  onAddDownlineClick?: (sponsorId: string) => void;
}

const PRESET_PORTRAITS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
];

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
    setIsAdminAuthenticated,
    isAdminMode,
    adminAddMember,
    adminUpdateMember,
    adminDeleteMember,
    adminAdjustMemberBalance,
    staffMembers,
    adminUpgradeMemberToStaff,
    adminDowngradeStaffToMember,
  } = useDmc();

  const isAdmin = isAdminAuthenticated || isAdminMode;

  const [focusedMemberId, setFocusedMemberId] = useState<string>(
    initialRootMemberId || currentMember.memberId
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Quick Add Downline Modal state
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddSponsorId, setQuickAddSponsorId] = useState<string>(currentMember.memberId);
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddPhone, setQuickAddPhone] = useState('+856 20 ');
  const [quickAddEmail, setQuickAddEmail] = useState('');
  const [quickAddAvatar, setQuickAddAvatar] = useState(PRESET_PORTRAITS[0]);
  const [quickAddState, setQuickAddState] = useState<Member['membershipState']>(
    'ACTIVE_LIFETIME_MEMBER'
  );
  const quickAddFileInputRef = useRef<HTMLInputElement>(null);

  // Full Administrator Member Edit / Update / Delete / Photo Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOriginalId, setEditingOriginalId] = useState<string>('');
  const [editMemberId, setEditMemberId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>('');
  const [editMembershipState, setEditMembershipState] =
    useState<Member['membershipState']>('FREE_MEMBER');
  const [editSponsorId, setEditSponsorId] = useState<string>('');
  const [editKycStatus, setEditKycStatus] = useState<Member['kycStatus']>('VERIFIED');
  const [editPassword, setEditPassword] = useState<string>('123456');
  const [editBankName, setEditBankName] = useState<string>('BCEL One');
  const [editBankAccountNum, setEditBankAccountNum] = useState<string>('');
  const [editBankAccountName, setEditBankAccountName] = useState<string>('');
  const [editCarrierId, setEditCarrierId] = useState<LaoShippingCarrierId>('ANOUSITH');
  const [editProvince, setEditProvince] = useState<string>('Vientiane Capital');
  const [editDistrict, setEditDistrict] = useState<string>('');
  const [editVillage, setEditVillage] = useState<string>('');
  const [editHeldLak, setEditHeldLak] = useState<number>(0);
  const [editAvailableLak, setEditAvailableLak] = useState<number>(0);
  const [editIsStaff, setEditIsStaff] = useState<boolean>(false);
  const [editStaffPosition, setEditStaffPosition] = useState<StaffPosition>('Teacher');
  const [editStaffCode, setEditStaffCode] = useState<string>('');
  const [editStaffBranch, setEditStaffBranch] = useState<string>(
    'Dongdok Campus Studio Hub, Vientiane'
  );
  const [confirmDeleteStep, setConfirmDeleteStep] = useState<boolean>(false);

  const editPhotoInputRef = useRef<HTMLInputElement>(null);

  // Sync root if currentMember changes and user hasn't manually drilled down
  React.useEffect(() => {
    if (!initialRootMemberId) {
      setFocusedMemberId(currentMember.memberId);
    }
  }, [currentMember.memberId, initialRootMemberId]);

  const rootMember =
    allMembers.find((m) => m.memberId === focusedMemberId) ||
    allMembers[0] ||
    currentMember;
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
    if (m.avatarUrl && !m.avatarUrl.startsWith('data:image/svg+xml')) return m.avatarUrl;
    return PRESET_PORTRAITS[fallbackIdx % PRESET_PORTRAITS.length];
  };

  const showToast = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };

  // Open the full Member Update / Edit / Delete / Photo Modal when clicking any node
  const openMemberEditModal = (member: Member, fallbackAvatarIdx = 0) => {
    setSelectedNodeId(member.memberId);
    const bal = getMemberBalances(member.memberId);
    setEditingOriginalId(member.memberId);
    setEditMemberId(member.memberId);
    setEditName(member.name || '');
    setEditPhone(member.phone || '+856 20 ');
    setEditEmail(member.email || '');
    setEditAvatarUrl(getAvatar(member, fallbackAvatarIdx));
    setEditMembershipState(member.membershipState);
    setEditSponsorId(member.sponsorId || '');
    setEditKycStatus(member.kycStatus || 'VERIFIED');
    setEditPassword(member.password || '123456');
    setEditBankName(member.bankAccount?.bankName || 'BCEL One');
    setEditBankAccountNum(member.bankAccount?.accountNumber || '160-12-00000000-001');
    setEditBankAccountName(member.bankAccount?.accountName || member.name.toUpperCase());
    setEditCarrierId(member.preferredCarrierId || 'ANOUSITH');
    setEditProvince(member.deliveryAddress?.province || 'Vientiane Capital');
    setEditDistrict(member.deliveryAddress?.district || 'Chanthabouly');
    setEditVillage(member.deliveryAddress?.village || '');
    setEditHeldLak(bal.heldForQualification);
    setEditAvailableLak(bal.available);
    const existingStaff = staffMembers.find((s) => s.memberId === member.memberId);
    setEditIsStaff(Boolean(member.isStaff || existingStaff));
    setEditStaffPosition(
      member.staffPosition || existingStaff?.position || 'Teacher'
    );
    setEditStaffCode(
      existingStaff?.staffCode || member.staffCode || `DMC-STF-${member.memberId}`
    );
    setEditStaffBranch(
      existingStaff?.branch ||
        member.staffBranch ||
        'Dongdok Campus Studio Hub, Vientiane'
    );
    setConfirmDeleteStep(false);
    setShowEditModal(true);
  };

  const handleEditPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleQuickAddPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQuickAddAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const cleanNewId = editMemberId.trim() || editingOriginalId;
    const currentBal = getMemberBalances(editingOriginalId);

    adminUpdateMember(editingOriginalId, {
      memberId: cleanNewId,
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      avatarUrl: editAvatarUrl.trim() || PRESET_PORTRAITS[0],
      membershipState: editMembershipState,
      sponsorId: editSponsorId ? editSponsorId : null,
      kycStatus: editKycStatus,
      password: editPassword.trim() || '123456',
      preferredCarrierId: editCarrierId,
      bankAccount: {
        bankName: editBankName.trim() || 'BCEL One',
        accountNumber: editBankAccountNum.trim() || '160-12-00000000-001',
        accountName: editBankAccountName.trim() || editName.trim().toUpperCase(),
      },
      deliveryAddress: {
        recipientName: editName.trim(),
        phone: editPhone.trim(),
        province: editProvince.trim() || 'Vientiane Capital',
        district: editDistrict.trim(),
        village: editVillage.trim(),
      },
    });

    // Apply balance adjustments if changed
    const heldDelta = Math.round(editHeldLak) - currentBal.heldForQualification;
    if (heldDelta !== 0) {
      adminAdjustMemberBalance(
        cleanNewId,
        'HELD_FOR_QUALIFICATION',
        heldDelta,
        'Admin Organize Tree Held Balance Update'
      );
    }

    const availDelta = Math.round(editAvailableLak) - currentBal.available;
    if (availDelta !== 0) {
      adminAdjustMemberBalance(
        cleanNewId,
        'AVAILABLE',
        availDelta,
        'Admin Organize Tree Available Balance Update'
      );
    }

    if (editIsStaff) {
      adminUpgradeMemberToStaff(cleanNewId, editStaffPosition, {
        staffCode: editStaffCode.trim() || `DMC-STF-${cleanNewId}`,
        branch: editStaffBranch.trim() || 'Dongdok Campus Studio Hub, Vientiane',
      });
    } else {
      adminDowngradeStaffToMember(cleanNewId);
    }

    if (focusedMemberId === editingOriginalId && cleanNewId !== editingOriginalId) {
      setFocusedMemberId(cleanNewId);
    }
    setSelectedNodeId(cleanNewId);
    setShowEditModal(false);
    showToast(
      editIsStaff
        ? `Updated member ${editName.trim()} (${cleanNewId}) & Upgraded to ${editStaffPosition} Staff!`
        : `Updated member ${editName.trim()} (${cleanNewId}) in Organize Tree!`
    );
  };

  const handleDeleteMemberFromTree = () => {
    if (!editingOriginalId) return;
    if (allMembers.length <= 1) {
      showToast('Cannot delete the last remaining member in the system.');
      return;
    }
    const target = allMembers.find((m) => m.memberId === editingOriginalId);
    const fallbackRootId =
      target?.sponsorId ||
      allMembers.find((m) => m.memberId !== editingOriginalId)?.memberId ||
      currentMember.memberId;

    adminDeleteMember(editingOriginalId);

    if (focusedMemberId === editingOriginalId) {
      setFocusedMemberId(fallbackRootId);
    }
    setSelectedNodeId(fallbackRootId);
    setShowEditModal(false);
    setConfirmDeleteStep(false);
    showToast(
      `Deleted member ${target?.name || editingOriginalId} (${editingOriginalId}) and re-linked downlines.`
    );
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddName.trim()) return;
    const created = adminAddMember({
      name: quickAddName.trim(),
      phone: quickAddPhone.trim() || '+856 20 5500 1122',
      email: quickAddEmail.trim() || undefined,
      avatarUrl: quickAddAvatar,
      sponsorId: quickAddSponsorId,
      membershipState: quickAddState,
      initialHeldLak: quickAddState === 'FREE_MEMBER' ? 400000 : 0,
      initialAvailableLak: quickAddState === 'ACTIVE_LIFETIME_MEMBER' ? 400000 : 0,
    });
    setQuickAddName('');
    setQuickAddPhone('+856 20 ');
    setQuickAddEmail('');
    setShowQuickAddModal(false);
    showToast(`Added ${created.name} (${created.memberId}) under ${quickAddSponsorId}!`);
  };

  return (
    <div className="space-y-4">
      {/* Status Toast Banner */}
      {statusBanner && (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-extrabold flex items-center justify-between shadow-lg animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusBanner}</span>
          </span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Organization Control Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <DmcOfficialLogo size={38} rounded="xl" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                  Downline Organize Chart (3-Level Unilevel Tree)
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isAdmin
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                  }`}
                >
                  {isAdmin
                    ? 'ADMIN FULL CRUD: CLICK ANY MEMBER TO EDIT / PHOTO / DELETE'
                    : 'MY DOWNLINE ORGANIZE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAdmin
                  ? 'Administrator Active: Click any member photo or card in the tree below to update Photo, Edit all Member Info, or Delete.'
                  : 'Visual organization hierarchy (Root → Level 1 → Level 2 → Level 3). Click any member node to view or unlock Admin Edit.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* 1-Click Admin Edit Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !isAdminAuthenticated;
                setIsAdminAuthenticated(next);
                showToast(
                  next
                    ? 'Administrator Edit Mode Enabled: Click any member node in the tree to Update, Edit, Upload Photo, or Delete!'
                    : 'Switched to Standard Member Organize View.'
                );
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all shadow ${
                isAdmin
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
              }`}
              title="Toggle Administrator Edit / Update / Delete / Photo Mode"
            >
              {isAdmin ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Admin Edit: ON</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Admin Edit</span>
                </>
              )}
            </button>

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
                const rows: (string | number)[][] = [];
                const visited = new Set<string>();
                const buildTree = (memberId: string, depth: number) => {
                  if (visited.has(memberId)) return;
                  const m = allMembers.find((x) => x.memberId === memberId);
                  if (!m) return;
                  visited.add(memberId);
                  const bal = getMemberBalances(m.memberId);
                  const dl = getDownlines(m.memberId);
                  const chain = getSponsorChain(m.memberId);
                  const levelText =
                    depth === 0
                      ? 'ROOT (Organize Head)'
                      : `LEVEL ${depth} (L${depth})`;
                  const prefix =
                    depth === 0 ? '👑 ROOT: ' : `${'   '.repeat(depth - 1)}└── L${depth}: `;
                  rows.push([
                    rows.length + 1,
                    levelText,
                    `${prefix}${m.name} (${m.memberId})`,
                    m.memberId,
                    m.name,
                    m.phone,
                    m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                      ? 'ACTIVE LIFETIME'
                      : 'FREE MEMBER',
                    chain.l1 ? `${chain.l1.name} (${chain.l1.memberId})` : 'ROOT HEAD',
                    chain.l2 ? `${chain.l2.name} (${chain.l2.memberId})` : '-',
                    chain.l3 ? `${chain.l3.name} (${chain.l3.memberId})` : '-',
                    dl.l1.length,
                    dl.l2.length,
                    dl.l3.length,
                    dl.l1.length + dl.l2.length + dl.l3.length,
                    bal.heldForQualification,
                    bal.available,
                    m.kycStatus,
                  ]);
                  allMembers
                    .filter((c) => c.sponsorId === m.memberId)
                    .forEach((c) => buildTree(c.memberId, depth + 1));
                };
                buildTree(rootMember.memberId, 0);
                allMembers.forEach((m) => {
                  if (!visited.has(m.memberId)) buildTree(m.memberId, 0);
                });
                const sheet: ExcelSheetData = {
                  sheetName: '7_Downline_Organize_Tree',
                  title: '7/ REPORT DOWN LINE ORGANIZE TREE FILE — DMC XAYRAXA',
                  subtitle: `Focused Root: ${rootMember.name} (${rootMember.memberId}) • Total Members: ${rows.length}`,
                  headers: [
                    'No.',
                    'Hierarchy Level',
                    'Visual Organize Tree Path',
                    'Member ID',
                    'Full Name',
                    'Phone (+856)',
                    'Status',
                    'Direct Sponsor (L1)',
                    'L2 Upline',
                    'L3 Upline',
                    'L1 Count',
                    'L2 Count',
                    'L3 Count',
                    'Total 3-Level Team',
                    'Held Qualification (LAK)',
                    'Available Balance (LAK)',
                    'KYC Status',
                  ],
                  rows,
                };
                downloadExcelWorkbook('7_DMC_Report_Downline_Organize_Tree_File.xls', [sheet]);
                showToast(
                  'Downloaded Excel File: 7_DMC_Report_Downline_Organize_Tree_File.xls!'
                );
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 text-xs font-extrabold flex items-center gap-1 shadow cursor-pointer"
              title="Download 7/ Report Down line Organize Tree Excel File (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>7/ Organize Excel (.xls)</span>
            </button>

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

            <button
              type="button"
              onClick={() => openMemberEditModal(rootMember, 0)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-extrabold border border-amber-500/40 flex items-center gap-1 cursor-pointer"
              title="Edit / Update / Upload Photo / Delete this Root Member"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Root Member</span>
            </button>

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
          VISUAL HIERARCHICAL ORGANIZATION TREE DIAGRAM (Click any node to Edit/Update/Delete/Photo)
         ======================================================================== */}
      <div className="bg-gradient-to-b from-white via-slate-50 to-purple-50/40 text-slate-900 rounded-3xl border-2 border-purple-200/80 shadow-xl p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[540px] flex flex-col items-center">
          {/* ---------------- LEVEL 0: ROOT HEAD NODE ---------------- */}
          <div className="flex flex-col items-center relative">
            <div
              onClick={() => openMemberEditModal(rootMember, 0)}
              className={`group cursor-pointer flex flex-col items-center transition-transform hover:scale-105 ${
                selectedMember.memberId === rootMember.memberId ? 'scale-105' : ''
              }`}
              title="Click to Update Photo, Edit Member Information, or Delete"
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
                {/* Admin Camera / Edit Overlay Badge */}
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 border border-purple-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Camera className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>

              {/* Name & ID Pill Box below Circle (Matching Oganize.jpg purple pill bar) */}
              <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 text-white text-center shadow-md border border-purple-400/40 min-w-[140px] max-w-[195px]">
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
                  <span className="px-1 py-0.2 rounded bg-white/15 text-amber-200 text-[7px] font-bold flex items-center gap-0.5">
                    <Edit3 className="w-2 h-2" />
                    <span>Edit</span>
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
                        onClick={() => openMemberEditModal(l1Member, l1Idx + 1)}
                        className={`group cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                          selectedMember.memberId === l1Member.memberId
                            ? 'ring-2 ring-purple-600 rounded-2xl p-1 bg-purple-100/60'
                            : ''
                        }`}
                        title="Click to Update Photo, Edit Member Information, or Delete"
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
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 border border-purple-900 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                            <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                          </span>
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
                            <span className="px-1 rounded bg-white/15 text-amber-200 text-[7px] font-bold">
                              Edit
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
                                    onClick={() =>
                                      openMemberEditModal(l2Member, l1Idx * 3 + l2Idx + 2)
                                    }
                                    className={`group cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                                      selectedMember.memberId === l2Member.memberId
                                        ? 'ring-2 ring-purple-600 rounded-xl p-0.5 bg-purple-100/70'
                                        : ''
                                    }`}
                                    title="Click to Update Photo, Edit Member Information, or Delete"
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
                                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 border border-purple-900 flex items-center justify-center shadow">
                                        <Edit3 className="w-2 h-2 stroke-[2.5]" />
                                      </span>
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
                                                  openMemberEditModal(
                                                    l3Member,
                                                    l1Idx + l2Idx + l3Idx + 4
                                                  )
                                                }
                                                className={`group cursor-pointer flex flex-col items-center transition-all hover:scale-105 ${
                                                  selectedMember.memberId === l3Member.memberId
                                                    ? 'ring-2 ring-purple-600 rounded-lg p-0.5 bg-purple-100/70'
                                                    : ''
                                                }`}
                                                title="Click to Update Photo, Edit Member Information, or Delete"
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
                                                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 text-slate-950 border border-purple-900 flex items-center justify-center shadow">
                                                    <Edit3 className="w-1.5 h-1.5 stroke-[2.5]" />
                                                  </span>
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

      {/* Selected Member Inspector & Quick Admin Action Card */}
      {!compactMode && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div
              onClick={() => openMemberEditModal(selectedMember, 0)}
              className="relative cursor-pointer group shrink-0"
              title="Click to update Member Photo & Information"
            >
              <img
                src={getAvatar(selectedMember, 0)}
                alt={selectedMember.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                <Camera className="w-3 h-3" />
              </span>
            </div>
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
                {(selectedMember.isStaff ||
                  staffMembers.some((s) => s.memberId === selectedMember.memberId)) && (
                  <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-black uppercase">
                    STAFF:{' '}
                    {selectedMember.staffPosition ||
                      staffMembers.find((s) => s.memberId === selectedMember.memberId)
                        ?.position}
                  </span>
                )}
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

            <button
              type="button"
              onClick={() => openMemberEditModal(selectedMember, 0)}
              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit / Photo / Delete</span>
            </button>

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

      {/* ========================================================================
          ADMINISTRATOR FULL MEMBER EDIT, UPDATE, PHOTO UPLOAD & DELETE MODAL
         ======================================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 text-white my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <DmcOfficialLogo size={36} rounded="xl" withGoldRing={true} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-black text-white">
                      Organize Member Control (Update, Edit, Photo & Delete)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ADMIN CRUD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Editing Node: <strong className="text-amber-300">{editName}</strong> ({editingOriginalId})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4 text-xs">
              {/* 1. PHOTO / PROFILE IMAGE UPLOAD & PRESETS */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    onClick={() => editPhotoInputRef.current?.click()}
                    className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-amber-400 to-emerald-400 shrink-0 cursor-pointer group shadow-lg"
                    title="Click to upload photo from your device"
                  >
                    <img
                      src={editAvatarUrl || PRESET_PORTRAITS[0]}
                      alt={editName}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                    />
                    <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-amber-400 text-slate-950 border-2 border-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>1. Member Photo / Profile Image</span>
                      </label>
                      <input
                        ref={editPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEditPhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => editPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-[11px] flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-[11px] text-white font-mono focus:outline-none focus:border-amber-400"
                    />

                    {/* Quick Preset Portraits */}
                    <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto pb-1">
                      <span className="text-[10px] text-slate-400 shrink-0 mr-1">Presets:</span>
                      {PRESET_PORTRAITS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatarUrl(url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 shrink-0 cursor-pointer transition-transform hover:scale-110 ${
                            editAvatarUrl === url ? 'border-amber-400 scale-110' : 'border-slate-700'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. CORE MEMBER IDENTITY & ORGANIZE HIERARCHY */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="text-[11px] font-black text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>2. Member Identity & Organize Tree Position</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Full Name (Shown on Organize Node) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="e.g. Somphone Xayraxa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Member ID Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={editMemberId}
                      onChange={(e) => setEditMemberId(e.target.value)}
                      placeholder="e.g. DMC-LA-00303"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Phone Number (+856) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-sky-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+856 20 5511 2233"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="member@dmcxayraxa.la"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Membership Status (ACTIVE / FREE)
                    </label>
                    <select
                      value={editMembershipState}
                      onChange={(e) =>
                        setEditMembershipState(e.target.value as Member['membershipState'])
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-extrabold text-emerald-300 focus:outline-none focus:border-amber-400"
                    >
                      <option value="ACTIVE_LIFETIME_MEMBER">
                        ACTIVE LIFETIME MEMBER (1.6M Qualified)
                      </option>
                      <option value="FREE_MEMBER">
                        FREE MEMBER (Accumulating Held Credit)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Direct Upline Sponsor (L1 Parent in Tree)
                    </label>
                    <select
                      value={editSponsorId}
                      onChange={(e) => setEditSponsorId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-purple-300 focus:outline-none focus:border-amber-400"
                    >
                      <option value="">ROOT (Top Head — No Upline Sponsor)</option>
                      {allMembers
                        .filter((m) => m.memberId !== editingOriginalId)
                        .map((m) => (
                          <option key={m.memberId} value={m.memberId}>
                            {m.name} ({m.memberId})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      KYC Verification Status
                    </label>
                    <select
                      value={editKycStatus}
                      onChange={(e) =>
                        setEditKycStatus(e.target.value as Member['kycStatus'])
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="UNVERIFIED">UNVERIFIED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Member Login PIN / Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-amber-200 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. WALLET BALANCES & BANK / DELIVERY INFORMATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Wallet Balances */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>3. Member Balances (LAK)</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Held Qualification Balance (LAK)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={editHeldLak}
                      onChange={(e) => setEditHeldLak(Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">
                      Available Withdrawable Balance (LAK)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={editAvailableLak}
                      onChange={(e) => setEditAvailableLak(Number(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Bank & Delivery Info */}
                <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2.5">
                  <div className="text-[11px] font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>4. Bank & Shipping Info</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={editBankName}
                        onChange={(e) => setEditBankName(e.target.value)}
                        placeholder="BCEL One"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={editBankAccountNum}
                        onChange={(e) => setEditBankAccountNum(e.target.value)}
                        placeholder="160-12-..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Province / City
                      </label>
                      <div className="relative">
                        <MapPin className="w-3 h-3 text-rose-400 absolute left-2 top-2" />
                        <input
                          type="text"
                          value={editProvince}
                          onChange={(e) => setEditProvince(e.target.value)}
                          placeholder="Vientiane"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-6 pr-2 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Shipping Carrier
                      </label>
                      <select
                        value={editCarrierId}
                        onChange={(e) =>
                          setEditCarrierId(e.target.value as LaoShippingCarrierId)
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                      >
                        {LAO_SHIPPING_CARRIERS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. ADMINISTRATOR UPGRADE MEMBER TO BECOME STAFF */}
              <div className="p-3.5 rounded-2xl bg-sky-950/40 border-2 border-sky-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-black text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>5. Administrator: Upgrade Member to Become Official Staff</span>
                  </div>
                  <label className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-sky-500/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsStaff}
                      onChange={(e) => setEditIsStaff(e.target.checked)}
                      className="rounded border-slate-600 text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-xs font-black text-white">
                      {editIsStaff ? 'Active Official Staff Member' : 'Upgrade to Staff'}
                    </span>
                  </label>
                </div>

                {editIsStaff && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="block text-[10px] font-black text-sky-200 mb-1">
                        Official Staff Position (8 Positions) *
                      </label>
                      <select
                        value={editStaffPosition}
                        onChange={(e) =>
                          setEditStaffPosition(e.target.value as StaffPosition)
                        }
                        className="w-full bg-slate-900 border-2 border-amber-400 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-black"
                      >
                        {DMC_STAFF_POSITIONS.map((pos) => (
                          <option key={pos.id} value={pos.id}>
                            - {pos.labelEn} ({pos.labelLo})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        Staff ID Code
                      </label>
                      <input
                        type="text"
                        value={editStaffCode}
                        onChange={(e) => setEditStaffCode(e.target.value.toUpperCase())}
                        placeholder={`DMC-STF-${editMemberId}`}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">
                        Staff Branch / Department
                      </label>
                      <input
                        type="text"
                        value={editStaffBranch}
                        onChange={(e) => setEditStaffBranch(e.target.value)}
                        placeholder="Dongdok Campus Studio Hub, Vientiane"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 6. ORGANIZE TREE QUICK ACTIONS & DELETE CONFIRMATION */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Delete Member Button / Confirmation */}
                  {!confirmDeleteStep ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteStep(true)}
                      className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Member</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/60 px-2.5 py-1.5 rounded-xl">
                      <span className="text-[11px] font-black text-rose-200">
                        Confirm Delete?
                      </span>
                      <button
                        type="button"
                        onClick={handleDeleteMemberFromTree}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteStep(false)}
                        className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                      >
                        No
                      </button>
                    </div>
                  )}

                  {/* Add Direct L1 Downline under this Member */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setQuickAddSponsorId(editingOriginalId);
                      setShowQuickAddModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-purple-200 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Downline Here</span>
                  </button>

                  {/* Focus Tree on this Member */}
                  {focusedMemberId !== editingOriginalId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFocusedMemberId(editingOriginalId);
                        setShowEditModal(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Set as Root Head</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Update Member</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Downline Modal (with Photo Upload) */}
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
              {/* Photo Upload for New Member */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                <img
                  src={quickAddAvatar}
                  alt="New Member Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="text-[11px] font-bold text-amber-300">Member Profile Photo</div>
                  <input
                    ref={quickAddFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQuickAddPhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => quickAddFileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>

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
