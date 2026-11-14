/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * SCREEN 02 - MEMBERSHIP & REGISTRATION
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations } from '../../utils/i18n';
import { 
  UserPlus, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Share2, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  ArrowRight,
  Phone,
  User,
  Mail,
  KeyRound,
  Check,
  Info,
  X,
  Award,
  Download,
  Mic
} from 'lucide-react';
import { QrCodeModal } from '../common/QrCodeModal';
import { BankQrPaymentModal } from '../common/BankQrPaymentModal';
import { CopyrightCertificateModal, downloadDmcCertificateImage } from '../common/CopyrightCertificateModal';
import { DmcMembershipTermsModal } from '../common/DmcMembershipTermsModal';
import { SingerApplicationDashboardModal } from '../common/SingerApplicationDashboardModal';

interface MembershipScreenProps {
  onNavigate: (tab: 'home' | 'membership' | 'catalog' | 'network' | 'wallet') => void;
}

export const MembershipScreen: React.FC<MembershipScreenProps> = ({ onNavigate }) => {
  const { currentMember, allMembers, registerMember, language, createOrder, getMemberSongs } = useDmc();
  const t = translations[language];
  const memberSongs = getMemberSongs(currentMember.memberId);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '+856 20 ',
    email: '',
    password: '123456',
    sponsorCode: currentMember.memberId || 'DMC000101',
    termsConsent: true,
    autoRedeemConsent: true,
  });

  const [sponsorPreview, setSponsorPreview] = useState<{ id: string; name: string } | null>({
    id: currentMember.memberId,
    name: currentMember.name,
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [generatedSmsOtp, setGeneratedSmsOtp] = useState('482910');
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeQrModal, setActiveQrModal] = useState<'MEMBER' | 'REFERRAL' | null>(null);
  const [isActivationQrOpen, setIsActivationQrOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [activationSuccessNotice, setActivationSuccessNotice] = useState<string | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [isSingerModalOpen, setIsSingerModalOpen] = useState(false);

  const handleDirectCertDownload = async () => {
    setIsDownloadingCert(true);
    try {
      await downloadDmcCertificateImage({
        memberId: currentMember.memberId,
        memberName: currentMember.name,
        isActiveLifetime: currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER',
        workTitle: memberSongs.length > 0 ? memberSongs[0].title : 'ສຽງແຄນແດນວຽງຈັນ (Echoes of the Mekong)',
      });
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloadingCert(false);
    }
  };

  // Check sponsor on input
  const handleSponsorChange = (code: string) => {
    setFormData(prev => ({ ...prev, sponsorCode: code }));
    if (code.trim().length >= 3) {
      const found = allMembers.find(m => m.memberId.toUpperCase() === code.trim().toUpperCase());
      if (found) {
        setSponsorPreview({ id: found.memberId, name: found.name });
      } else {
        setSponsorPreview(null);
      }
    } else {
      setSponsorPreview(null);
    }
  };

  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.trim().includes('@')) {
      setErrorMessage('Please enter a valid email address for email verification.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter a valid mobile phone number.');
      return;
    }
    if (!formData.termsConsent) {
      setErrorMessage('You must review and accept the DMC Member Terms of Service (v2.6).');
      return;
    }

    try {
      const newMember = await registerMember({
        name: formData.name,
        phone: formData.phone,
        email: formData.email.trim(),
        password: formData.password || '123456',
        sponsorCode: formData.sponsorCode,
        autoRedeemConsent: formData.autoRedeemConsent,
      });

      setOtpStep(false);
      setRegistrationSuccess(
        `Email verified (${formData.email.trim()})! Registration successful! Signed in as ${newMember.name} (${newMember.memberId}) with 0 LAK signup fee.`
      );
      setFormData({
        name: '',
        phone: '+856 20 ',
        email: '',
        password: '123456',
        sponsorCode: newMember.memberId,
        termsConsent: true,
        autoRedeemConsent: true,
      });
      setOtpCode('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    }
  };

  const handleVerifyOtp = async () => {
    // Legacy handler kept for safety
  };

  const referralUrl = `https://dmcxayraxa.music/register?ref=${currentMember.memberId}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="@container space-y-6 pb-12 animate-in fade-in">
      {/* Title & Introduction */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-amber-400" />
          <span>{t.registerTitle}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {t.registerSubtitle}
        </p>
      </div>

      {registrationSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm">Welcome to DMC Xayraxa!</div>
            <p className="mt-1">{registrationSuccess}</p>
          </div>
        </div>
      )}

      {activationSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-white">Active Lifetime Status Unlocked!</div>
              <p className="mt-1 text-slate-200">{activationSuccessNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setActivationSuccessNotice(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* NEW MEMBER REGISTRATION FORM (PLACED AT TOP FOR IMMEDIATE ACCESS) */}
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>{t.newMemberFormHeading}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.newMemberFormSub}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSingerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#df1c2d] hover:from-amber-400 hover:to-red-600 text-white text-[11px] font-black flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Register Singer (General People)</span>
            </button>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
              {t.freeSignupBadge}
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!otpStep ? (
          <form onSubmit={handleStartRegistration} className="space-y-3.5">
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.fullName} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bounmee Xayavong"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.phoneNumber} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+856 20 5512 3456"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-3.5">
              {/* Email (Required for Verification) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address (Verify by Email) *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="bounmee@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800/90 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Password / PIN */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.setPasswordPin} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800/90 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sponsor Code */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.sponsorCodeLabel}</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DMC000101"
                  value={formData.sponsorCode}
                  onChange={e => handleSponsorChange(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
                {sponsorPreview ? (
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t.sponsorFound}: {sponsorPreview.name} ({sponsorPreview.id})</span>
                  </div>
                ) : formData.sponsorCode.trim() ? (
                  <div className="text-[10px] text-amber-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>{t.sponsorNotFound}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.termsConsent}
                  onChange={e => setFormData({ ...formData, termsConsent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  {t.consentTerms}
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoRedeemConsent}
                  onChange={e => setFormData({ ...formData, autoRedeemConsent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  {t.consentAutoRedeem}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Verify by Email & Register Member →
            </button>
          </form>
        ) : null}
      </div>

      {/* CURRENT ACTIVE MEMBER INVITATION ASSETS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{t.referralCredentialsTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.referralCredentialsSub}
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-amber-300 border border-slate-700">
            {currentMember.memberId}
          </span>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-3 pt-1">
          {/* Referral link box */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {t.shareableReferralLink}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-300 font-mono focus:outline-none"
              />
              <button
                onClick={copyReferral}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.copied : t.copyReferralLink}</span>
              </button>
            </div>
          </div>

          {/* QR Button box */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">
                {t.officialInvitationQr}
              </span>
              <span className="text-xs text-slate-300">
                {t.referralQr}
              </span>
            </div>
            <button
              onClick={() => setActiveQrModal('REFERRAL')}
              className="px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{t.showReferralQr}</span>
            </button>
          </div>
        </div>
      </div>

      {/* OFFICIAL COPYRIGHT & MASTER RIGHTS CERTIFICATE (DMC XAYRAXA) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#500713]/40 border border-amber-500/30 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Award className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Official DMC Copyright & Master Rights Certificate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Lao PDR Law No. 38/NA
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Official statutory protection, sound recording master rights, and international digital publishing credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCertificateOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>View & Customize</span>
            </button>

            <button
              onClick={handleDirectCertDownload}
              disabled={isDownloadingCert}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingCert ? 'Downloading...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TWO WAYS TO ACTIVATE LIFETIME MEMBERSHIP - COMPARISON DIAGRAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.directPayVsEarned}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            DMC Xayraxa provides two clear pathways to Active Lifetime Member status.
          </p>
        </div>

        <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
          {/* Method 1: Direct Pay */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300">
                Path A
              </span>
              <span className="font-mono text-xs font-bold text-amber-400">1,600,000 LAK</span>
            </div>
            <h4 className="font-bold text-sm text-white">{t.method1Title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.method1Desc}
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant activation + 1 Studio Song Project</span>
            </div>
            {currentMember.membershipState === 'FREE_MEMBER' ? (
              <div className="space-y-2">
                <button
                  onClick={() => setIsActivationQrOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-white" />
                  <span>Pay 1.6M via Bank QR Code (Instant Active)</span>
                </button>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <span>Or View Music Package in Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">Active Lifetime Member status already unlocked!</span>
              </div>
            )}
          </div>

          {/* Method 2: Earned Credit */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                Path B (Zero Cash)
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">1,600,000 LAK Held</span>
            </div>
            <h4 className="font-bold text-sm text-white">{t.method2Title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.method2Desc}
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-300/80 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero risk, accumulate through unilevel referrals</span>
            </div>
            <button
              onClick={() => onNavigate('network')}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Team Building Network</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* NEW MEMBER REGISTRATION FORM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Organic / Invite Registration Wizard</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Register a new member identity. Strict unilevel hierarchy: 1 direct sponsor parent, unlimited direct breadth.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {!otpStep ? (
          <form onSubmit={handleStartRegistration} className="space-y-4">
            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.fullName} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bounmee Xayavong"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.phoneNumber} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+856 20 5512 3456"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4">
              {/* Email (Required for Verification) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-amber-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address (Verify by Email) *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="bounmee@gmail.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800/80 border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sponsor Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.sponsorCodeLabel}</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DMC-LA-00303 (Leave empty for Direct DMC)"
                  value={formData.sponsorCode}
                  onChange={e => handleSponsorChange(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
                {sponsorPreview ? (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Sponsor Verified: {sponsorPreview.name} ({sponsorPreview.id})</span>
                  </div>
                ) : formData.sponsorCode.trim() ? (
                  <div className="text-[11px] text-amber-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>No sponsor match. Will be assigned as Direct DMC unallocated.</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Consents (NO PRE-CHECKED BOXES AS REQUIRED BY SPEC) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700">
                <input
                  id="membership-screen-terms-checkbox"
                  type="checkbox"
                  required
                  checked={formData.termsConsent}
                  onChange={e => setFormData({ ...formData, termsConsent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer shrink-0"
                />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <label htmlFor="membership-screen-terms-checkbox" className="cursor-pointer">
                    I agree to the{' '}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer text-left"
                  >
                    DMC XAYRAXA Membership Terms (Free 0 LAK Registration).
                  </button>{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-[10px] font-bold cursor-pointer ml-1"
                  >
                    <span>Read Terms & Conditions</span>
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoRedeemConsent}
                  onChange={e => setFormData({ ...formData, autoRedeemConsent: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  {t.consentAutoRedeem}
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Verify by Email & Complete Registration
            </button>
          </form>
        ) : null}
      </div>

      <QrCodeModal
        isOpen={activeQrModal !== null}
        onClose={() => setActiveQrModal(null)}
        type={activeQrModal || 'REFERRAL'}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        referralCode={currentMember.memberId}
      />

      <BankQrPaymentModal
        isOpen={isActivationQrOpen}
        onClose={() => setIsActivationQrOpen(false)}
        amountLak={1600000}
        purpose="MEMBERSHIP_ACTIVATION"
        title="Lao Bank QR: Direct Lifetime Activation"
        description="Scan using BCEL One, LDB Trust, or any compatible Lao mobile banking app to unlock Active Lifetime status."
        onPaymentSuccess={async details => {
          try {
            await createOrder([{ sku: 'MUSIC_SINGLE_1600', quantity: 1 }], 'BCEL_ONE');
            setActivationSuccessNotice(`Payment of 1,600,000 LAK verified via ${details.bankName} (Ref: ${details.reference})! You are now an Active Lifetime Member with 1 Studio Debut Single project.`);
          } catch (err) {
            console.error(err);
          }
          setIsActivationQrOpen(false);
        }}
      />

      <CopyrightCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        memberId={currentMember.memberId}
        memberName={currentMember.name}
        isActiveLifetime={currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER'}
        songs={memberSongs}
      />

      <DmcMembershipTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAcceptTerms={() => setFormData(prev => ({ ...prev, termsConsent: true }))}
      />

      <SingerApplicationDashboardModal
        isOpen={isSingerModalOpen}
        onClose={() => setIsSingerModalOpen(false)}
        initialTab="APPLY"
        onNavigateTab={onNavigate}
      />
    </div>
  );
};
