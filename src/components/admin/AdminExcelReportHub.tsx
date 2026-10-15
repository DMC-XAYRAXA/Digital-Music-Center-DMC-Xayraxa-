import React, { useState, useMemo } from 'react';
import { useDmc } from '../../context/DmcContext';
import { downloadExcelWorkbook, downloadCsvFile, ExcelSheetData } from '../../utils/excelExport';
import { formatLak } from '../../utils/i18n';
import {
  FileSpreadsheet,
  Download,
  Users,
  KeyRound,
  Package,
  Truck,
  Music,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Upload,
  Plus,
  Trash2,
  FileCheck2,
  Search,
  Layers,
} from 'lucide-react';
import { DmcOfficialLogo } from '../common/DmcLogo';

export type AdminReportId =
  | '1_MEMBERS'
  | '2_PASSWORDS'
  | '3_PRODUCTS'
  | '4_ORDERS'
  | '5_SONGS'
  | '6_PAYMENT_PROVED'
  | '7_ORGANIZE_TREE';

export interface CustomPaymentProofRecord {
  id: string;
  referenceNo: string;
  memberId: string;
  memberName: string;
  paymentType: 'ORDER_PAYMENT_PROOF' | 'MEMBERSHIP_1_6M_PROOF' | 'WITHDRAWAL_PAYOUT_PROOF';
  bankName: string;
  accountOrTxNo: string;
  amountLak: number;
  status: 'PAYMENT_PROVED' | 'VERIFIED_BY_ADMIN' | 'PENDING_CHECK';
  verifiedBy: string;
  proofImageUrl?: string;
  note: string;
  timestamp: string;
}

const PAYMENT_PROOF_STORAGE_KEY = 'dmc_rev26_payment_proved_records_v1';

export const AdminExcelReportHub: React.FC<{
  initialReport?: AdminReportId;
}> = ({ initialReport = '1_MEMBERS' }) => {
  const {
    allMembers,
    getMemberBalances,
    getDownlines,
    getSponsorChain,
    getMemberSongs,
    superAdminProfile,
    products,
    orders,
    withdrawals,
    corporateBankAccounts,
  } = useDmc();

  const [selectedReport, setSelectedReport] = useState<AdminReportId>(initialReport);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Additional Custom Payment Proof Records (persisted in localStorage)
  const [customProofs, setCustomProofs] = useState<CustomPaymentProofRecord[]>(() => {
    try {
      const saved = localStorage.getItem(PAYMENT_PROOF_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'PRF-20261015-001',
        referenceNo: 'BCEL-QR-99281744',
        memberId: 'DMC-LA-00101',
        memberName: 'Sengdao Vongsa (Root L3)',
        paymentType: 'MEMBERSHIP_1_6M_PROOF',
        bankName: 'BCEL One (160-12-00889911-001)',
        accountOrTxNo: 'TX-BCEL-20261014-8821',
        amountLak: 1600000,
        status: 'PAYMENT_PROVED',
        verifiedBy: 'SUPER-ADMIN-LAO',
        proofImageUrl:
          'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80',
        note: 'Verified 1,600,000 LAK Studio Song Activation Payment Slip',
        timestamp: '2026-10-14 09:30:00',
      },
      {
        id: 'PRF-20261015-002',
        referenceNo: 'LDB-QR-77412099',
        memberId: 'DMC-LA-00303',
        memberName: 'Somphone Xayraxa (Direct L1)',
        paymentType: 'ORDER_PAYMENT_PROOF',
        bankName: 'Lao Development Bank (LDB)',
        accountOrTxNo: 'TX-LDB-20261014-3319',
        amountLak: 2450000,
        status: 'PAYMENT_PROVED',
        verifiedBy: 'SUPER-ADMIN-LAO',
        proofImageUrl:
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80',
        note: 'Verified Acoustic Guitar & Studio Package Order Payment Slip',
        timestamp: '2026-10-14 14:15:00',
      },
    ];
  });

  // Add Payment Proof Modal State
  const [showAddProofModal, setShowAddProofModal] = useState(false);
  const [proofForm, setProofForm] = useState({
    referenceNo: `BCEL-QR-${Math.floor(10000000 + Math.random() * 90000000)}`,
    memberId: allMembers[0]?.memberId || 'DMC-LA-00404',
    paymentType: 'ORDER_PAYMENT_PROOF' as CustomPaymentProofRecord['paymentType'],
    bankName: corporateBankAccounts[0]?.bankName || 'BCEL One',
    accountOrTxNo: `TX-${Date.now().toString().slice(-8)}`,
    amountLak: 1600000,
    status: 'PAYMENT_PROVED' as CustomPaymentProofRecord['status'],
    proofImageUrl: '',
    note: 'Verified BCEL One / Lao QR Payment Slip',
  });

  const triggerNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // ============================================================================
  // BUILD ALL 6 OFFICIAL EXCEL SHEETS
  // ============================================================================
  const sheetsMap = useMemo(() => {
    // 1/ Register Member Crud file
    const sheet1Members: ExcelSheetData = {
      sheetName: '1_Register_Member_CRUD',
      title: '1/ REGISTER MEMBER CRUD REPORT — DMC XAYRAXA SUPER APP',
      subtitle: `Total Registered Members: ${allMembers.length} • Exported from Administrator Panel`,
      headers: [
        'No.',
        'Member ID',
        'Full Name',
        'Phone (+856)',
        'Email',
        'Membership Status',
        'Direct Sponsor ID (L1)',
        'L1 Downlines',
        'L2 Downlines',
        'L3 Downlines',
        'Held Qualification (LAK)',
        'Available Balance (LAK)',
        'Pending Balance (LAK)',
        'KYC Status',
        'Bank Name',
        'Bank Account Number',
        'Bank Account Holder',
        'Shipping Carrier',
        'Province',
        'Created At',
      ],
      rows: allMembers.map((m, idx) => {
        const bal = getMemberBalances(m.memberId);
        const dl = getDownlines(m.memberId);
        return [
          idx + 1,
          m.memberId,
          m.name,
          m.phone,
          m.email || '-',
          m.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE LIFETIME' : 'FREE MEMBER',
          m.sponsorId || 'ROOT (Direct)',
          dl.l1.length,
          dl.l2.length,
          dl.l3.length,
          bal.heldForQualification,
          bal.available,
          bal.pending,
          m.kycStatus,
          m.bankAccount?.bankName || 'BCEL One',
          m.bankAccount?.accountNumber || '-',
          m.bankAccount?.accountName || m.name.toUpperCase(),
          m.preferredCarrierId || 'ANOUSITH',
          m.deliveryAddress?.province || 'Vientiane Capital',
          m.createdAt ? m.createdAt.slice(0, 10) : '2026-10-01',
        ];
      }),
    };

    // 2/ Admin and user password File
    const sheet2Passwords: ExcelSheetData = {
      sheetName: '2_Admin_User_Password',
      title: '2/ ADMIN AND USER PASSWORD & SECURITY FILE — DMC XAYRAXA',
      subtitle: `Includes Master Super Administrator Credentials + ${allMembers.length} Member Login Credentials & SMS Recovery Status`,
      headers: [
        'No.',
        'Account Role',
        'User / Operator ID',
        'Full Name',
        'Phone Number (+856)',
        'Email Address',
        'Login Password / PIN',
        '2FA / KYC Security',
        'Telecom Carrier',
        'Membership / Role Status',
        'Last Password Updated',
        'Last SMS Recovery At',
      ],
      rows: [
        [
          1,
          'SUPER ADMINISTRATOR',
          superAdminProfile.operatorId,
          superAdminProfile.name,
          superAdminProfile.phone,
          superAdminProfile.email,
          superAdminProfile.passwordPin || '888888',
          superAdminProfile.twoFactorSmsEnabled ? '2FA SMS ENABLED' : 'STANDARD',
          superAdminProfile.telecomCarrier,
          superAdminProfile.roleTitle,
          superAdminProfile.lastPasswordUpdatedAt
            ? superAdminProfile.lastPasswordUpdatedAt.slice(0, 19).replace('T', ' ')
            : '2026-10-01 08:00:00',
          superAdminProfile.lastRecoverySmsAt
            ? superAdminProfile.lastRecoverySmsAt.slice(0, 19).replace('T', ' ')
            : '-',
        ],
        ...allMembers.map((m, idx) => [
          idx + 2,
          'REGISTERED MEMBER',
          m.memberId,
          m.name,
          m.phone,
          m.email || '-',
          m.password || '123456',
          m.kycStatus,
          m.phone.includes('20 9') ? 'Unitel (020 9)' : 'Lao Telecom (020 5)',
          m.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE LIFETIME' : 'FREE MEMBER',
          m.lastPasswordUpdatedAt
            ? m.lastPasswordUpdatedAt.slice(0, 19).replace('T', ' ')
            : 'Default (123456)',
          m.lastRecoverySmsAt
            ? m.lastRecoverySmsAt.slice(0, 19).replace('T', ' ')
            : '-',
        ]),
      ],
    };

    // 3/ Products & SKUs File
    const sheet3Products: ExcelSheetData = {
      sheetName: '3_Products_And_SKUs',
      title: '3/ PRODUCTS & SKUs INVENTORY & UNILEVEL COMMISSION REPORT',
      subtitle: `Total Catalog SKUs: ${products.length} • Retail Prices, Stock & L1/L2/L3 Unilevel Splits`,
      headers: [
        'No.',
        'SKU Code',
        'Category',
        'Product Name (English)',
        'Product Name (Lao)',
        'Product Name (Thai)',
        'Item Type',
        'Retail Price (LAK)',
        'Commission Pool (LAK)',
        'Split Rule Type',
        'L1 Direct Share',
        'L2 Share',
        'L3 Share',
        'DMC Retained Budget (LAK)',
        'Sellable Stock',
        'Reserved Stock',
        'Warehouse ID',
      ],
      rows: products.map((p, idx) => [
        idx + 1,
        p.sku,
        p.category,
        p.titleEn,
        p.titleLo,
        p.titleTh,
        p.itemType,
        p.priceLak,
        p.commissionPoolLak,
        p.splitRule.ruleType,
        p.splitRule.ruleType === 'FIXED_MUSIC'
          ? `${p.splitRule.l1Share.toLocaleString()} LAK`
          : `${(p.splitRule.l1Share / 100).toFixed(0)}% (${Math.round(
              (p.commissionPoolLak * p.splitRule.l1Share) / 10000
            ).toLocaleString()} LAK)`,
        p.splitRule.ruleType === 'FIXED_MUSIC'
          ? `${p.splitRule.l2Share.toLocaleString()} LAK`
          : `${(p.splitRule.l2Share / 100).toFixed(0)}% (${Math.round(
              (p.commissionPoolLak * p.splitRule.l2Share) / 10000
            ).toLocaleString()} LAK)`,
        p.splitRule.ruleType === 'FIXED_MUSIC'
          ? `${p.splitRule.l3Share.toLocaleString()} LAK`
          : `${(p.splitRule.l3Share / 100).toFixed(0)}% (${Math.round(
              (p.commissionPoolLak * p.splitRule.l3Share) / 10000
            ).toLocaleString()} LAK)`,
        p.splitRule.dmcBudget || p.priceLak - p.commissionPoolLak,
        p.stockSellable,
        p.stockReserved,
        p.warehouseId,
      ]),
    };

    // 4/ Orders and Shipping File
    const sheet4Orders: ExcelSheetData = {
      sheetName: '4_Orders_And_Shipping',
      title: '4/ ORDERS AND SHIPPING LOGISTICS REPORT (ANOUSITH / HAL / LOCAL)',
      subtitle: `Total Orders: ${orders.length} • Full Order Line Items, Carrier Tracking & Delivery Destinations`,
      headers: [
        'No.',
        'Order ID',
        'Order Date',
        'Buyer Member ID',
        'Buyer Name',
        'Ordered SKUs & Quantities',
        'Subtotal (LAK)',
        'Shipping Fee (LAK)',
        'Total Paid (LAK)',
        'Payment Method',
        'Order Status',
        'Shipping Carrier',
        'Tracking Number',
        'Recipient Name',
        'Recipient Phone (+856)',
        'Delivery Province',
        'District & Village',
        'Delivered Timestamp',
      ],
      rows: orders.map((o, idx) => {
        const buyer = allMembers.find((m) => m.memberId === o.buyerMemberId);
        const itemsSummary = o.items
          .map((it) => `${it.sku} (${it.title}) x${it.quantity}`)
          .join(' | ');
        return [
          idx + 1,
          o.id,
          o.createdAt ? o.createdAt.slice(0, 19).replace('T', ' ') : '-',
          o.buyerMemberId,
          buyer?.name || o.shippingAddress?.recipientName || o.buyerMemberId,
          itemsSummary,
          o.subtotalLak,
          o.shippingFeeLak,
          o.totalLak,
          o.paymentMethod,
          o.status,
          o.carrierName || o.carrierId || 'Anousith Logistics',
          o.trackingNumber || `ANS-LA-${o.id.slice(-4)}`,
          o.shippingAddress?.recipientName || buyer?.name || '-',
          o.shippingAddress?.phone || buyer?.phone || '-',
          o.shippingAddress?.province || 'Vientiane Capital',
          `${o.shippingAddress?.district || 'Chanthabouly'} ${
            o.shippingAddress?.village || ''
          }`.trim(),
          o.deliveredAt ? o.deliveredAt.slice(0, 19).replace('T', ' ') : 'In Transit / Pending',
        ];
      }),
    };

    // 5/ Studio Song File
    const allSongs = allMembers.flatMap((m) =>
      getMemberSongs(m.memberId).map((s) => ({ song: s, owner: m }))
    );
    const sheet5Songs: ExcelSheetData = {
      sheetName: '5_Studio_Song_File',
      title: '5/ STUDIO SONG PRODUCTION & ENTITLEMENT REPORT',
      subtitle: `Total Studio Song Projects: ${allSongs.length} • 1,600,000 LAK Single Song Production Entitlements`,
      headers: [
        'No.',
        'Song Project ID',
        'Member ID',
        'Artist / Member Name',
        'Member Phone (+856)',
        'Song Title',
        'Musical Genre',
        'Tempo (BPM)',
        'Studio Production Stage',
        'Completion Progress (%)',
        'Executive Producer',
        'Recording Studio Location',
        'Audio Preview URL',
        'Last Updated Date',
      ],
      rows: allSongs.map(({ song, owner }, idx) => [
        idx + 1,
        song.id,
        song.memberId,
        owner.name,
        owner.phone,
        song.title,
        song.genre,
        song.tempo,
        song.status,
        song.progressPercent,
        song.producer,
        song.studioLocation,
        song.previewAudioUrl || '-',
        song.updatedAt ? song.updatedAt.slice(0, 19).replace('T', ' ') : '-',
      ]),
    };

    // 6/ Payment proved (Combines Custom Payment Proofs + Order Payment Proofs + Withdrawal Payout Approvals)
    const orderProofRows = orders.map((o, idx) => {
      const buyer = allMembers.find((m) => m.memberId === o.buyerMemberId);
      return [
        customProofs.length + idx + 1,
        `ORD-PRF-${o.id.slice(-4)}`,
        o.paymentReference || `QR-${o.id}`,
        o.buyerMemberId,
        buyer?.name || o.buyerMemberId,
        'ORDER_PAYMENT_PROOF',
        o.paymentMethod === 'BCEL_ONE'
          ? 'BCEL One Corporate QR'
          : o.paymentMethod === 'LAO_QR'
          ? 'Lao National QR'
          : o.paymentMethod,
        o.id,
        o.totalLak,
        o.status === 'PAID' || o.status === 'DELIVERED' || o.status === 'SHIPPED'
          ? 'PAYMENT_PROVED'
          : o.status,
        'SUPER-ADMIN-LAO',
        `Order ${o.id} (${o.items.map((i) => i.sku).join(', ')})`,
        o.paidAt || o.createdAt ? (o.paidAt || o.createdAt).slice(0, 19).replace('T', ' ') : '-',
      ];
    });

    const withdrawalProofRows = withdrawals.map((w, idx) => {
      const mem = allMembers.find((m) => m.memberId === w.memberId);
      return [
        customProofs.length + orders.length + idx + 1,
        w.id,
        `PAYOUT-${w.id}`,
        w.memberId,
        mem?.name || w.accountName,
        'WITHDRAWAL_PAYOUT_PROOF',
        `${w.bankName} (${w.accountNumber})`,
        w.accountName,
        w.netPayoutLak,
        w.status === 'PAID' || w.status === 'APPROVED'
          ? `PAYMENT_PROVED (${w.status})`
          : w.status,
        w.checkerAdminId || w.makerAdminId || 'SUPER-ADMIN-LAO',
        `Gross: ${w.amountLak.toLocaleString()} LAK | Fee: ${w.bankFeeLak.toLocaleString()} LAK | Net: ${w.netPayoutLak.toLocaleString()} LAK`,
        (w.checkerPaidAt || w.makerApprovedAt || w.requestedAt)
          .slice(0, 19)
          .replace('T', ' '),
      ];
    });

    const customProofRows = customProofs.map((cp, idx) => [
      idx + 1,
      cp.id,
      cp.referenceNo,
      cp.memberId,
      cp.memberName,
      cp.paymentType,
      cp.bankName,
      cp.accountOrTxNo,
      cp.amountLak,
      cp.status,
      cp.verifiedBy,
      cp.note,
      cp.timestamp,
    ]);

    const sheet6PaymentProved: ExcelSheetData = {
      sheetName: '6_Payment_Proved',
      title: '6/ PAYMENT PROVED & BANK SETTLEMENT VERIFICATION REPORT',
      subtitle: `Verified Bank QR Slips, Order Payment Proofs & Maker-Checker Withdrawal Payout Proofs`,
      headers: [
        'No.',
        'Proof ID',
        'Bank Reference / Slip No.',
        'Member ID',
        'Member Name',
        'Payment Category',
        'Bank / Payment Channel',
        'Account / Order Ref',
        'Verified Amount (LAK)',
        'Proof Status',
        'Verified By Admin',
        'Verification Note / Items',
        'Timestamp',
      ],
      rows: [...customProofRows, ...orderProofRows, ...withdrawalProofRows],
    };

    // 7/ Report Down line Organize Tree File
    const organizeTreeRows: (string | number)[][] = [];
    const visitedIds = new Set<string>();

    const appendOrganizeSubtree = (memberId: string, depth: number) => {
      if (visitedIds.has(memberId)) return;
      const m = allMembers.find((item) => item.memberId === memberId);
      if (!m) return;
      visitedIds.add(memberId);

      const bal = getMemberBalances(m.memberId);
      const dl = getDownlines(m.memberId);
      const chain = getSponsorChain(m.memberId);
      const totalTeam = dl.l1.length + dl.l2.length + dl.l3.length;

      const levelLabel =
        depth === 0
          ? 'ROOT (Organize Head)'
          : depth === 1
          ? 'LEVEL 1 (Direct L1)'
          : depth === 2
          ? 'LEVEL 2 (L2)'
          : `LEVEL ${depth} (L${depth})`;

      const treePrefix =
        depth === 0
          ? '👑 ROOT: '
          : `${'   '.repeat(depth - 1)}└── L${depth}: `;

      const directL1Names =
        dl.l1.length > 0
          ? dl.l1.map((child) => `${child.name} (${child.memberId})`).join(', ')
          : 'None';

      organizeTreeRows.push([
        organizeTreeRows.length + 1,
        levelLabel,
        `${treePrefix}${m.name} (${m.memberId})`,
        m.memberId,
        m.name,
        m.phone,
        m.membershipState === 'ACTIVE_LIFETIME_MEMBER' ? 'ACTIVE LIFETIME' : 'FREE MEMBER',
        chain.l1 ? `${chain.l1.name} (${chain.l1.memberId})` : 'ROOT HEAD (No Upline)',
        chain.l2 ? `${chain.l2.name} (${chain.l2.memberId})` : '-',
        chain.l3 ? `${chain.l3.name} (${chain.l3.memberId})` : '-',
        dl.l1.length,
        directL1Names,
        dl.l2.length,
        dl.l3.length,
        totalTeam,
        bal.heldForQualification,
        bal.available,
        bal.pending,
        m.kycStatus,
        m.deliveryAddress?.province || 'Vientiane Capital',
      ]);

      const directChildren = allMembers.filter((child) => child.sponsorId === m.memberId);
      directChildren.forEach((child) => appendOrganizeSubtree(child.memberId, depth + 1));
    };

    // Start from Root members (no sponsorId or sponsorId not in allMembers)
    const rootMembers = allMembers.filter(
      (m) => !m.sponsorId || !allMembers.some((p) => p.memberId === m.sponsorId)
    );
    rootMembers.forEach((root) => appendOrganizeSubtree(root.memberId, 0));
    // Ensure any remaining unvisited members are also included
    allMembers.forEach((m) => {
      if (!visitedIds.has(m.memberId)) {
        appendOrganizeSubtree(m.memberId, 0);
      }
    });

    const sheet7OrganizeTree: ExcelSheetData = {
      sheetName: '7_Downline_Organize_Tree',
      title: '7/ REPORT DOWN LINE ORGANIZE TREE FILE — 3-LEVEL UNILEVEL HIERARCHY',
      subtitle: `Total Organize Nodes: ${organizeTreeRows.length} • Full Root → L1 → L2 → L3 Hierarchy, Upline Chain & Team Balances`,
      headers: [
        'No.',
        'Hierarchy Level',
        'Visual Organize Tree Path',
        'Member ID',
        'Full Name',
        'Phone (+856)',
        'Membership Status',
        'Direct Sponsor (L1 Upline)',
        'L2 Upline Ancestor',
        'L3 Upline Ancestor',
        'L1 Downline Count',
        'Direct L1 Downline Members',
        'L2 Downline Count',
        'L3 Downline Count',
        'Total 3-Level Team',
        'Held Qualification (LAK)',
        'Available Balance (LAK)',
        'Pending Balance (LAK)',
        'KYC Status',
        'Province / Location',
      ],
      rows: organizeTreeRows,
    };

    return {
      '1_MEMBERS': sheet1Members,
      '2_PASSWORDS': sheet2Passwords,
      '3_PRODUCTS': sheet3Products,
      '4_ORDERS': sheet4Orders,
      '5_SONGS': sheet5Songs,
      '6_PAYMENT_PROVED': sheet6PaymentProved,
      '7_ORGANIZE_TREE': sheet7OrganizeTree,
    };
  }, [
    allMembers,
    getMemberBalances,
    getDownlines,
    getSponsorChain,
    getMemberSongs,
    superAdminProfile,
    products,
    orders,
    withdrawals,
    customProofs,
  ]);

  const reportCards: {
    id: AdminReportId;
    numberLabel: string;
    title: string;
    subtitle: string;
    filenameBase: string;
    icon: React.FC<{ className?: string }>;
    colorClass: string;
    badgeCount: number;
  }[] = [
    {
      id: '1_MEMBERS',
      numberLabel: '1/',
      title: 'Register Member CRUD File',
      subtitle: 'All members, L1-L3 organize counts, Held/Available LAK balances, KYC & bank info',
      filenameBase: '1_DMC_Register_Member_CRUD_File',
      icon: Users,
      colorClass: 'from-purple-600/25 to-indigo-600/20 border-purple-500/40 text-purple-300',
      badgeCount: sheetsMap['1_MEMBERS'].rows.length,
    },
    {
      id: '2_PASSWORDS',
      numberLabel: '2/',
      title: 'Admin & User Password File',
      subtitle: 'Master Super Admin PIN/password + all registered Member login PINs & SMS recovery',
      filenameBase: '2_DMC_Admin_And_User_Password_File',
      icon: KeyRound,
      colorClass: 'from-sky-600/25 to-cyan-600/20 border-sky-500/40 text-sky-300',
      badgeCount: sheetsMap['2_PASSWORDS'].rows.length,
    },
    {
      id: '3_PRODUCTS',
      numberLabel: '3/',
      title: 'Products & SKUs File',
      subtitle: 'Full product catalog, prices, L1/L2/L3 commission splits, stock & warehouses',
      filenameBase: '3_DMC_Products_And_SKUs_File',
      icon: Package,
      colorClass: 'from-amber-600/25 to-orange-600/20 border-amber-500/40 text-amber-300',
      badgeCount: sheetsMap['3_PRODUCTS'].rows.length,
    },
    {
      id: '4_ORDERS',
      numberLabel: '4/',
      title: 'Orders and Shipping File',
      subtitle: 'Orders, SKUs, Anousith/HAL/Local carrier tracking numbers & recipient addresses',
      filenameBase: '4_DMC_Orders_And_Shipping_File',
      icon: Truck,
      colorClass: 'from-emerald-600/25 to-teal-600/20 border-emerald-500/40 text-emerald-300',
      badgeCount: sheetsMap['4_ORDERS'].rows.length,
    },
    {
      id: '5_SONGS',
      numberLabel: '5/',
      title: 'Studio Song File',
      subtitle: '1.6M LAK Studio Song projects, artist owners, genre, BPM, producer & progress %',
      filenameBase: '5_DMC_Studio_Song_File',
      icon: Music,
      colorClass: 'from-pink-600/25 to-rose-600/20 border-pink-500/40 text-pink-300',
      badgeCount: sheetsMap['5_SONGS'].rows.length,
    },
    {
      id: '6_PAYMENT_PROVED',
      numberLabel: '6/',
      title: 'Payment Proved File',
      subtitle: 'Verified BCEL One / Lao QR payment slips, order settlements & withdrawal payouts',
      filenameBase: '6_DMC_Payment_Proved_File',
      icon: FileCheck2,
      colorClass: 'from-yellow-500/25 to-amber-600/20 border-yellow-400/50 text-yellow-300',
      badgeCount: sheetsMap['6_PAYMENT_PROVED'].rows.length,
    },
    {
      id: '7_ORGANIZE_TREE',
      numberLabel: '7/',
      title: 'Report Down line Organize Tree File',
      subtitle:
        'Full 3-Level Unilevel Organize Tree hierarchy (Root → L1 → L2 → L3), uplines & team counts',
      filenameBase: '7_DMC_Report_Downline_Organize_Tree_File',
      icon: Layers,
      colorClass: 'from-violet-600/25 to-purple-600/20 border-violet-400/50 text-violet-300',
      badgeCount: sheetsMap['7_ORGANIZE_TREE'].rows.length,
    },
  ];

  const activeSheet = sheetsMap[selectedReport];
  const activeCard = reportCards.find((c) => c.id === selectedReport) || reportCards[0];

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return activeSheet.rows;
    const q = searchQuery.toLowerCase();
    return activeSheet.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
  }, [activeSheet, searchQuery]);

  const handleDownloadSingleExcel = (id: AdminReportId) => {
    const card = reportCards.find((c) => c.id === id)!;
    const sheet = sheetsMap[id];
    downloadExcelWorkbook(`${card.filenameBase}.xls`, [sheet]);
    triggerNotice(`Downloaded Excel File: ${card.filenameBase}.xls (${sheet.rows.length} rows)`);
  };

  const handleDownloadSingleCsv = (id: AdminReportId) => {
    const card = reportCards.find((c) => c.id === id)!;
    const sheet = sheetsMap[id];
    downloadCsvFile(`${card.filenameBase}.csv`, sheet);
    triggerNotice(`Downloaded CSV File: ${card.filenameBase}.csv (${sheet.rows.length} rows)`);
  };

  const handleDownloadMasterWorkbook = () => {
    const allSheets = [
      sheetsMap['1_MEMBERS'],
      sheetsMap['2_PASSWORDS'],
      sheetsMap['3_PRODUCTS'],
      sheetsMap['4_ORDERS'],
      sheetsMap['5_SONGS'],
      sheetsMap['6_PAYMENT_PROVED'],
      sheetsMap['7_ORGANIZE_TREE'],
    ];
    downloadExcelWorkbook('DMC_Master_All_7_Admin_Reports.xls', allSheets);
    triggerNotice(
      'Downloaded Master 7-Sheet Excel Workbook (DMC_Master_All_7_Admin_Reports.xls)!'
    );
  };

  const handleAddProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = allMembers.find((m) => m.memberId === proofForm.memberId);
    const newRecord: CustomPaymentProofRecord = {
      id: `PRF-${Date.now().toString().slice(-6)}`,
      referenceNo: proofForm.referenceNo.trim() || `BCEL-${Date.now().toString().slice(-6)}`,
      memberId: proofForm.memberId,
      memberName: member?.name || proofForm.memberId,
      paymentType: proofForm.paymentType,
      bankName: proofForm.bankName.trim() || 'BCEL One',
      accountOrTxNo: proofForm.accountOrTxNo.trim() || '-',
      amountLak: Number(proofForm.amountLak) || 0,
      status: proofForm.status,
      verifiedBy: superAdminProfile.operatorId,
      proofImageUrl: proofForm.proofImageUrl.trim() || undefined,
      note: proofForm.note.trim() || 'Verified by Administrator',
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    const next = [newRecord, ...customProofs];
    setCustomProofs(next);
    try {
      localStorage.setItem(PAYMENT_PROOF_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setShowAddProofModal(false);
    setSelectedReport('6_PAYMENT_PROVED');
    triggerNotice(`Added Payment Proved Record (${newRecord.referenceNo}) to Report #6!`);
  };

  const handleDeleteCustomProof = (id: string) => {
    const next = customProofs.filter((p) => p.id !== id);
    setCustomProofs(next);
    try {
      localStorage.setItem(PAYMENT_PROOF_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    triggerNotice(`Deleted Payment Proof record ${id}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner & Master All-6 Workbook Export */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DmcOfficialLogo size={46} rounded="xl" withGoldRing={true} className="shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Administrator Excel Report Center (Files 1 – 7)</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  OFFICIAL EXCEL (.XLS) & CSV
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Instant 1-click download for all 7 required Administrator Excel Reports (including 7/ Report Down line Organize Tree File) with full Lao, Thai & English Unicode formatting.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddProofModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Payment Proved Slip (Report #6)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMasterWorkbook}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download All 7 Reports in 1 Excel Workbook (.xls)</span>
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportNotice}</span>
            </span>
            <button
              type="button"
              onClick={() => setExportNotice(null)}
              className="text-emerald-300 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================
          6 EXCEL REPORT CARDS (1-CLICK DOWNLOAD EXCEL .XLS OR .CSV + PREVIEW)
         ======================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedReport === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setSelectedReport(card.id)}
              className={`rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)] scale-[1.01]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.colorClass} border flex items-center justify-center font-black text-sm`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <div>
                      <div className="text-[10px] font-mono uppercase font-black text-amber-400">
                        EXCEL REPORT {card.numberLabel}
                      </div>
                      <h4 className="text-sm font-black text-white leading-tight">
                        {card.numberLabel} {card.title}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                    {card.badgeCount} rows
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">{card.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSingleExcel(card.id);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download Excel (.xls)</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSingleCsv(card.id);
                  }}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  title="Download UTF-8 CSV file"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>.CSV</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(card.id);
                  }}
                  className={`p-2 rounded-xl border text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Preview Report Table Below"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================
          PAYMENT PROVED SLIP GALLERY (SHOWN WHEN REPORT 6 IS SELECTED)
         ======================================================================== */}
      {selectedReport === '6_PAYMENT_PROVED' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>6/ Verified Payment Proved Slips & Bank Settlement Records</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Administrator can upload or log new verified BCEL One / Lao QR payment proof slips here; all records are automatically included in the 6/ Payment Proved Excel file.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProofModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Upload / Add Payment Proved</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customProofs.map((cp) => (
              <div
                key={cp.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3 items-start justify-between"
              >
                <div className="flex gap-3 min-w-0">
                  {cp.proofImageUrl ? (
                    <img
                      src={cp.proofImageUrl}
                      alt={cp.referenceNo}
                      className="w-14 h-14 rounded-xl object-cover border border-amber-400/50 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0 space-y-0.5 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-black">
                        {cp.status}
                      </span>
                      <span className="font-mono text-[10px] text-amber-300 truncate">
                        {cp.referenceNo}
                      </span>
                    </div>
                    <div className="font-bold text-white truncate">{cp.memberName}</div>
                    <div className="text-[11px] font-mono font-black text-emerald-400">
                      {formatLak(cp.amountLak)}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{cp.bankName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{cp.note}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCustomProof(cp.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 cursor-pointer shrink-0"
                  title="Delete Payment Proof Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================
          LIVE INTERACTIVE EXCEL SPREADSHEET TABLE PREVIEW
         ======================================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                LIVE EXCEL PREVIEW
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                {activeCard.numberLabel} {activeCard.title} ({filteredRows.length} rows)
              </h4>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeSheet.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter rows in sheet..."
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
              />
            </div>

            <button
              type="button"
              onClick={() => handleDownloadSingleExcel(selectedReport)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download {activeCard.numberLabel} Excel (.xls)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDownloadSingleCsv(selectedReport)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export .CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-950 text-amber-300 border-b-2 border-amber-500/40">
              <tr>
                {activeSheet.headers.map((h, i) => (
                  <th
                    key={i}
                    className="py-2.5 px-3 font-black uppercase tracking-wider text-[10px] whitespace-nowrap border-r border-slate-800/80 last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={
                      rIdx % 2 === 0
                        ? 'bg-slate-900/60 hover:bg-slate-800/70'
                        : 'bg-slate-950/40 hover:bg-slate-800/70'
                    }
                  >
                    {row.map((cell, cIdx) => {
                      const isNum = typeof cell === 'number';
                      return (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 whitespace-nowrap border-r border-slate-800/40 last:border-r-0 ${
                            isNum
                              ? 'text-right font-mono font-bold text-emerald-300'
                              : cIdx === 1 || cIdx === 2
                              ? 'font-bold text-white'
                              : 'text-slate-300'
                          }`}
                        >
                          {isNum ? cell.toLocaleString() : cell}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeSheet.headers.length}
                    className="py-8 text-center text-slate-500 font-semibold"
                  >
                    No matching records found for "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================
          MODAL: ADD / UPLOAD PAYMENT PROVED RECORD (FOR REPORT #6)
         ======================================================================== */}
      {showAddProofModal && (
        <div className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-black text-white">
                  Add / Upload Payment Proved Record (Report #6)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProofModal(false)}
                className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProofSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Member Account *
                  </label>
                  <select
                    value={proofForm.memberId}
                    onChange={(e) => setProofForm({ ...proofForm, memberId: e.target.value })}
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
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Payment Proof Category *
                  </label>
                  <select
                    value={proofForm.paymentType}
                    onChange={(e) =>
                      setProofForm({
                        ...proofForm,
                        paymentType: e.target.value as CustomPaymentProofRecord['paymentType'],
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-bold"
                  >
                    <option value="ORDER_PAYMENT_PROOF">Order Payment Proof</option>
                    <option value="MEMBERSHIP_1_6M_PROOF">1.6M Membership Activation Proof</option>
                    <option value="WITHDRAWAL_PAYOUT_PROOF">Withdrawal Bank Payout Proof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Bank Reference / Slip No. *
                  </label>
                  <input
                    type="text"
                    required
                    value={proofForm.referenceNo}
                    onChange={(e) => setProofForm({ ...proofForm, referenceNo: e.target.value })}
                    placeholder="BCEL-QR-99281744"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Verified Amount (LAK) *
                  </label>
                  <input
                    type="number"
                    step={10000}
                    required
                    value={proofForm.amountLak}
                    onChange={(e) =>
                      setProofForm({ ...proofForm, amountLak: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Bank / Channel Name
                  </label>
                  <input
                    type="text"
                    value={proofForm.bankName}
                    onChange={(e) => setProofForm({ ...proofForm, bankName: e.target.value })}
                    placeholder="BCEL One / LDB / JDB"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    Verification Status
                  </label>
                  <select
                    value={proofForm.status}
                    onChange={(e) =>
                      setProofForm({
                        ...proofForm,
                        status: e.target.value as CustomPaymentProofRecord['status'],
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold"
                  >
                    <option value="PAYMENT_PROVED">PAYMENT PROVED (Verified)</option>
                    <option value="VERIFIED_BY_ADMIN">VERIFIED BY ADMIN</option>
                    <option value="PENDING_CHECK">PENDING CHECK</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Upload Payment Slip Image (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Slip Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setProofForm((prev) => ({
                              ...prev,
                              proofImageUrl: reader.result as string,
                            }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    value={proofForm.proofImageUrl}
                    onChange={(e) =>
                      setProofForm({ ...proofForm, proofImageUrl: e.target.value })
                    }
                    placeholder="Or paste slip image URL..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Verification Note / Order Details
                </label>
                <input
                  type="text"
                  value={proofForm.note}
                  onChange={(e) => setProofForm({ ...proofForm, note: e.target.value })}
                  placeholder="Verified BCEL One QR Payment Slip"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProofModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-400 text-slate-950 font-black cursor-pointer shadow"
                >
                  Save Payment Proved Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
