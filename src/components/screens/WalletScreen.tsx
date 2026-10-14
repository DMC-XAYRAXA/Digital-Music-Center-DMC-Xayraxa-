/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 05 - WALLET, WITHDRAWAL & IMMUTABLE FINANCIAL LEDGER
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, formatLak, formatLakSymbol, formatLakCompact, parseAmountWithK } from '../../utils/i18n';
import { BeautifulNumberInput } from '../common/BeautifulNumberInput';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpRight, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Building2, 
  KeyRound, 
  ShieldCheck, 
  FileSpreadsheet, 
  Sparkles,
  Info,
  X,
  QrCode,
  Plus
} from 'lucide-react';
import { WithdrawalRequest } from '../../types/dmc';

interface WalletScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onNavigate }) => {
  const { 
    currentMember, 
    getMemberBalances, 
    getMemberLedger, 
    requestWithdrawal, 
    verifyWithdrawalOtp, 
    withdrawals, 
    redeemHeldCreditForQualification,
    language,
    updateMemberBankAccount,
    laoBanks,
    adminAdjustMemberBalance
  } = useDmc();

  const t = translations[language];
  const balances = getMemberBalances(currentMember.memberId);
  const ledgerEntries = getMemberLedger(currentMember.memberId);

  const isActive = currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER';

  // Withdrawal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState(
    currentMember.bankAccount?.bankName || 'BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC'
  );
  const [customBankInput, setCustomBankInput] = useState('');
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [accountNumber, setAccountNumber] = useState(currentMember.bankAccount?.accountNumber || '160-12-00049281-001');
  const [accountName, setAccountName] = useState(currentMember.bankAccount?.accountName || currentMember.name.toUpperCase());
  const [withdrawError, setWithdrawError] = useState('');
  const [createdWithdrawalId, setCreatedWithdrawalId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [redemptionNotice, setRedemptionNotice] = useState<string | null>(null);
  const [calculatorAmount, setCalculatorAmount] = useState<number | string>('500k');
  const [copiedCalcNotice, setCopiedCalcNotice] = useState(false);

  // Deposit via Lao Bank QR state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmountInput, setDepositAmountInput] = useState('500k');
  const [isDepositQrOpen, setIsDepositQrOpen] = useState(false);
  const [depositSuccessNotice, setDepositSuccessNotice] = useState<string | null>(null);
  const numDepositAmount = Math.max(10000, parseAmountWithK(depositAmountInput));

  const bankFeeLak = 5000;
  const numAmount = parseAmountWithK(withdrawAmount);
  const netPayout = Math.max(0, numAmount - bankFeeLak);

  const handleStartWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');

    if (numAmount < 100000) {
      setWithdrawError('Minimum withdrawal amount is 100,000 LAK.');
      return;
    }
    if (isActive && numAmount > balances.available) {
      setWithdrawError(`Cannot withdraw more than Available balance (${formatLak(balances.available)}).`);
      return;
    }

    if (!isActive && numAmount > 1600000) {
      setWithdrawError('Simulation limit is 1,600,000 LAK for Free members.');
      return;
    }

    const finalBank = bankName === 'CUSTOM' ? customBankInput.trim() : bankName;
    if (!finalBank) {
      setWithdrawError('Please specify a valid Lao bank institution.');
      return;
    }

    if (saveToProfile) {
      const matched = laoBanks.find(b => b.name === finalBank);
      updateMemberBankAccount(currentMember.memberId, {
        bankName: finalBank,
        bankCode: matched?.code || 'CUSTOM',
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim().toUpperCase(),
        branch: matched?.branchDefault || 'Head Office Vientiane',
        isDefault: true,
      });
    }

    if (!isActive) {
      setCreatedWithdrawalId('SIM-' + Math.floor(100000 + Math.random() * 900000));
      return;
    }

    const res = requestWithdrawal(currentMember.memberId, numAmount, {
      bankName: finalBank,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim().toUpperCase(),
    });

    if (res.success && res.withdrawalId) {
      setCreatedWithdrawalId(res.withdrawalId);
    } else {
      setWithdrawError(res.error || 'Failed to submit withdrawal');
    }
  };

  const handleVerifyOtp = () => {
    if (!createdWithdrawalId) return;

    if (createdWithdrawalId.startsWith('SIM-')) {
      setIsWithdrawModalOpen(false);
      setCreatedWithdrawalId(null);
      setWithdrawAmount('');
      setOtpCode('');
      setRedemptionNotice(`Simulated Payout: Request for ${formatLak(numAmount)} verified successfully with OTP!`);
      setTimeout(() => setRedemptionNotice(null), 5000);
      return;
    }

    const ok = verifyWithdrawalOtp(createdWithdrawalId, otpCode);
    if (ok) {
      setIsWithdrawModalOpen(false);
      setCreatedWithdrawalId(null);
      setWithdrawAmount('');
      setOtpCode('');
    } else {
      setOtpError('Invalid OTP code. Enter 6 digits (e.g. 123456).');
    }
  };

  const handleRedeemQualification = () => {
    const res = redeemHeldCreditForQualification(currentMember.memberId);
    setRedemptionNotice(res.message);
    setTimeout(() => setRedemptionNotice(null), 6000);
  };

  // Export Ledger to CSV
  const handleExportCsv = () => {
    const headers = ['Tx ID', 'Timestamp', 'Type', 'Source Ref', 'Debit (LAK)', 'Credit (LAK)', 'Target Account', 'Description'];
    const rows = ledgerEntries.map(e => [
      e.txRef,
      e.timestamp,
      e.type,
      e.sourceRef,
      e.debit,
      e.credit,
      e.targetBalance,
      `"${e.description.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DMC_Ledger_${currentMember.memberId}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active member withdrawals
  const myWithdrawals = withdrawals.filter(w => w.memberId === currentMember.memberId);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Title & Currency Standards */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <span>{t.walletTitle}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.walletDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{t.downloadStatement}</span>
          </button>
        </div>
      </div>

      {redemptionNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{redemptionNotice}</span>
        </div>
      )}

      {depositSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">{depositSuccessNotice}</span>
          </div>
          <button
            onClick={() => setDepositSuccessNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5-BALANCE ACCOUNT CARDS (Strict Rev 2.6 Invariants) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Account 1: PENDING */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.pendingBalance}
            </span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-slate-200">
              {formatLak(balances.pending)}
            </div>
            {balances.pending > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-bold border border-slate-700/60">
                {formatLakCompact(balances.pending)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.pendingDesc}
          </p>
        </div>

        {/* Account 2: HELD_FOR_QUALIFICATION */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
              {t.heldForQualification}
            </span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-amber-300">
              {formatLak(balances.heldForQualification)}
            </div>
            {balances.heldForQualification > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                {formatLakCompact(balances.heldForQualification)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.heldDesc}
          </p>
        </div>

        {/* Account 3: AVAILABLE */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 bg-gradient-to-b from-emerald-500/5 to-transparent space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              {t.availableBalance}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-black text-emerald-300">
              {formatLak(balances.available)}
            </div>
            {balances.available > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                {formatLakCompact(balances.available)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.availableDesc}
          </p>
        </div>

        {/* Account 4: HELD_FOR_WITHDRAWAL */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.heldForWithdrawal}
            </span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-black text-slate-300">
              {formatLak(balances.heldForWithdrawal)}
            </div>
            {balances.heldForWithdrawal > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-bold border border-slate-700/60">
                {formatLakCompact(balances.heldForWithdrawal)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.heldWithdrawalDesc}
          </p>
        </div>

        {/* Account 5: RECOVERY_DUE */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.recoveryDue}
            </span>
            <AlertTriangle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-xl font-black text-slate-300">
              {formatLak(balances.recoveryDue)}
            </div>
            {balances.recoveryDue > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-mono font-bold">
                {formatLakCompact(balances.recoveryDue)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {t.recoveryDueDesc}
          </p>
        </div>

        {/* Action Tile: Payout or Qualification Trigger */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
              {t.financialActions}
            </span>
            <span className="text-xs text-slate-300 mt-1 block">
              {isActive ? t.requestWithdrawal : t.redeemQualificationBtn}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-red-950/30 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>{t.depositTopUpQr}</span>
            </button>

            {isActive ? (
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{t.requestWithdrawal}</span>
              </button>
            ) : balances.heldForQualification >= 1600000 ? (
              <button
                onClick={handleRedeemQualification}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.redeemQualificationBtn}</span>
              </button>
            ) : (
              <div className="space-y-1.5">
                <button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.requestWithdrawal} ("Use K")</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POLICY REMINDER CARD */}
      {!isActive && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Policy Invariant: Free Member Earnings Protection</div>
            <p className="text-slate-300 leading-relaxed">
              {t.withdrawalPolicyFree} Cleared earnings are lawfully safeguarded in your Held for Qualification account. Once you accumulate 1,600,000 LAK or directly purchase the Music Package, you unlock Active Lifetime Member status, 1 Studio Song entitlement, and direct withdrawal access.
            </p>
          </div>
        </div>
      )}

      {/* ================= SMART "USE K" NUMBER INBOX SANDBOX & CONVERTER ================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Smart "Use K" Number Inbox (Lao Kip Converter)</span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-slate-950">Rev 2.6</span>
              </h3>
              <p className="text-xs text-slate-400">
                Type shortcuts like <strong>500k</strong>, <strong>100k</strong>, or <strong>1.6m</strong>, or use one-tap "K" chips to format instantly.
              </p>
            </div>
          </div>

          {copiedCalcNotice && (
            <span className="text-[11px] font-bold text-emerald-400 animate-in fade-in">
              Copied to clipboard!
            </span>
          )}
        </div>

        {/* The BeautifulNumberInput component instance */}
        <div className="space-y-3">
          <BeautifulNumberInput
            label="Interactive Lao Kip Number Inbox"
            helperLabel="Auto-parses k, m, commas, and integer Kip"
            placeholder="e.g. 500k or 1,600k or 1.6m"
            value={calculatorAmount}
            onChange={(_num, text) => setCalculatorAmount(text)}
            presetChips={[100000, 200000, 500000, 1000000, 1600000]}
            showMaxButton={true}
            max={balances.available > 0 ? balances.available : 1600000}
            theme="amber"
          />

          {/* Real-time Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Integer Kip</span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {parseAmountWithK(calculatorAmount).toLocaleString('en-US')} LAK
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-amber-500/20">
              <span className="text-[10px] text-amber-400/80 block uppercase font-sans">Compact "K" Badge</span>
              <span className="text-xs font-black text-amber-300 block mt-0.5">
                {formatLakCompact(parseAmountWithK(calculatorAmount))}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Currency Symbol</span>
              <span className="text-xs font-bold text-slate-300 block mt-0.5">
                {formatLakSymbol(parseAmountWithK(calculatorAmount))}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <span className="text-[10px] text-emerald-400/80 block uppercase font-sans">Fast Transfer</span>
              <button
                type="button"
                onClick={() => {
                  setWithdrawAmount(String(parseAmountWithK(calculatorAmount)));
                  setIsWithdrawModalOpen(true);
                }}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline block mt-0.5 cursor-pointer"
              >
                Apply to Payout →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT WITHDRAWAL REQUESTS */}
      {myWithdrawals.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Bank Withdrawal Requests</span>
          </h3>

          <div className="space-y-2">
            {myWithdrawals.map(w => (
              <div
                key={w.id}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="font-mono text-amber-300">{w.id}</span>
                    <span>•</span>
                    <span>{w.bankName}</span>
                    <span className="font-mono text-slate-400">({w.accountNumber})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Requested: {new Date(w.requestedAt).toLocaleString()} • Net: {formatLak(w.netPayoutLak)} (Fee: {formatLak(w.bankFeeLak)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    w.status === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : w.status === 'APPROVED'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : w.status === 'ADMIN_REVIEW'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOUBLE-ENTRY TRANSACTION JOURNAL (IMMUTABLE LEDGER) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>{t.transactionLedger}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Balanced double-entry journal. Every change is an append-only audit event.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {ledgerEntries.length} immutable records
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {ledgerEntries.map(entry => (
            <div
              key={entry.id}
              className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs hover:bg-slate-800/70 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="font-mono text-[11px] text-amber-300">{entry.txRef}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{entry.type}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {entry.description}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  {new Date(entry.timestamp).toLocaleString()} • Target Account: {entry.targetBalance}
                </div>
              </div>

              <div className="text-right">
                {entry.credit > 0 && (
                  <div className="font-mono font-bold text-emerald-400">
                    +{formatLak(entry.credit)}
                  </div>
                )}
                {entry.debit > 0 && (
                  <div className="font-mono font-bold text-red-400">
                    -{formatLak(entry.debit)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WITHDRAWAL REQUEST MODAL (ACTIVE MEMBERS ONLY) */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-amber-400" />
                <span>Bank Payout Request</span>
              </h3>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            {!createdWithdrawalId ? (
              <form onSubmit={handleStartWithdrawal} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Available Balance
                  </label>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {formatLak(balances.available)}
                  </div>
                </div>

                <BeautifulNumberInput
                  label="Withdrawal Amount (Integer LAK)"
                  helperLabel={`Available: ${formatLak(balances.available)}`}
                  placeholder="e.g. 500,000 or 500k"
                  min={100000}
                  max={balances.available}
                  value={withdrawAmount}
                  onChange={(_num, text) => setWithdrawAmount(text)}
                  required
                  theme="amber"
                  presetChips={[100000, 200000, 500000, 1000000, 1600000]}
                  showMaxButton={true}
                  showKBadge={true}
                  showPresets={true}
                />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium text-xs">
                      Lao Bank Institution *
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">Lao PDR Banking</span>
                  </div>

                  {/* 4 Official Lao Bank Quick Chips */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {laoBanks.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setBankName(b.name);
                          if (currentMember.bankAccount?.bankName === b.name) {
                            setAccountNumber(currentMember.bankAccount.accountNumber);
                            setAccountName(currentMember.bankAccount.accountName);
                          }
                        }}
                        className={`p-2 rounded-xl text-left border text-[11px] transition-all flex items-center justify-between gap-1.5 ${
                          bankName === b.name
                            ? 'bg-amber-500/20 border-amber-500/60 text-white font-bold ring-1 ring-amber-500/40'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="truncate">{b.code}</span>
                        <span className="text-[9px] font-mono text-slate-400">{b.swiftCode}</span>
                      </button>
                    ))}
                  </div>

                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <optgroup label="Official Core Lao Banks">
                      <option value="BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC">
                        1/ BANQUE POUR LE COMMERCE EXTERIEUR LAO PUBLIC (BCEL One)
                      </option>
                      <option value="Development Bank CO LTD (LDB)">
                        2/ Development Bank CO LTD (LDB)
                      </option>
                      <option value="Joint Development Bank (JDB)">
                        3/ Joint Development Bank (JDB)
                      </option>
                      <option value="VietinBank Lao | Vientiane">
                        4/ VietinBank Lao | Vientiane
                      </option>
                    </optgroup>
                    <optgroup label="Other Options">
                      <option value="CUSTOM">+ Add / Use Other Bank</option>
                    </optgroup>
                  </select>

                  {bankName === 'CUSTOM' && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom bank name (e.g. APB, LaoVietBank)"
                      value={customBankInput}
                      onChange={e => setCustomBankInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium text-xs">Account Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="160-12-00049281-001"
                      value={accountNumber}
                      onChange={e => setAccountNumber(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium text-xs">Beneficiary Name *</label>
                    <input
                      type="text"
                      required
                      placeholder={currentMember.name.toUpperCase()}
                      value={accountName}
                      onChange={e => setAccountName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:border-amber-500 focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <input
                    type="checkbox"
                    id="saveToProfileChk"
                    checked={saveToProfile}
                    onChange={e => setSaveToProfile(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-amber-500"
                  />
                  <label htmlFor="saveToProfileChk" className="text-slate-300 text-[11px] cursor-pointer">
                    Save this Lao bank account to my profile for future settlements
                  </label>
                </div>

                {/* Fee Preview */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Transfer Processing Fee:</span>
                    <span className="font-mono text-slate-300">{formatLak(bankFeeLak)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
                    <span>Net External Payout:</span>
                    <span className="font-mono text-amber-300">{formatLak(netPayout)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Send SMS OTP
                  </button>
                </div>
              </form>
            ) : (
              /* OTP Step for Withdrawal */
              <div className="space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-400 mb-1">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Security OTP Verification</h4>
                  <p className="text-slate-400">
                    Enter OTP sent to your registered phone to confirm atomic hold for payout {createdWithdrawalId}. (Simulator: enter <strong>123456</strong>)
                  </p>
                </div>

                {otpError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-300 text-center">
                    {otpError}
                  </div>
                )}

                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full text-center text-xl font-mono tracking-widest bg-slate-800 border border-slate-700 rounded-xl py-3 text-white focus:outline-none focus:border-amber-500"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Confirm Payout Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEPOSIT VIA LAO BANK QR MODAL */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-red-500" />
                <span>Deposit via Lao Bank QR</span>
              </h3>
              <button
                onClick={() => setIsDepositModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Deposit funds directly into your Available account using BCEL One, LDB Trust, or any compatible Lao mobile banking app.
              </p>

              <BeautifulNumberInput
                label="Deposit Amount (Integer LAK)"
                helperLabel={`Current Available: ${formatLak(balances.available)}`}
                placeholder="e.g. 500,000 or 500k"
                min={10000}
                value={depositAmountInput}
                onChange={(_num, text) => setDepositAmountInput(text)}
                required
                theme="emerald"
                presetChips={[100000, 200000, 500000, 1000000, 1600000]}
                showMaxButton={false}
                showKBadge={true}
                showPresets={true}
              />

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400 text-xs">
                  <span>Selected Amount:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatLak(numDepositAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Gateway Fee:</span>
                  <span className="font-mono text-slate-300">0 LAK (Free LAPNet Promotion)</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDepositModalOpen(false);
                    setIsDepositQrOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950/30 cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-white" />
                  <span>Generate Lao Bank QR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAO BANK QR MODAL FOR DEPOSIT */}
      <BankQrPaymentModal
        isOpen={isDepositQrOpen}
        onClose={() => setIsDepositQrOpen(false)}
        amountLak={numDepositAmount}
        purpose="WALLET_DEPOSIT"
        title="Lao Bank QR Deposit"
        description={`Scan using BCEL One, LDB Trust, or any Lao mobile banking app to deposit ${formatLak(numDepositAmount)}.`}
        onPaymentSuccess={details => {
          adminAdjustMemberBalance(
            currentMember.memberId,
            'AVAILABLE',
            numDepositAmount,
            `Lao Bank QR Deposit via ${details.bankName} (Ref: ${details.reference})`
          );
          setDepositSuccessNotice(`Deposit of ${formatLak(numDepositAmount)} settled via ${details.bankName} (Ref: ${details.reference})!`);
          setIsDepositQrOpen(false);
        }}
      />
    </div>
  );
};
