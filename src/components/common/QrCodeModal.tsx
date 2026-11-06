/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * QR Code Display Modal (Differentiates Member QR from Referral QR on dmcxayraxa.music)
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, X, ShieldAlert, RefreshCw, Globe } from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'MEMBER' | 'REFERRAL';
  memberId: string;
  memberName: string;
  referralCode: string;
  customReferralUrl?: string;
  roleLabel?: string;
}

export const QrCodeModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  type,
  memberId,
  memberName,
  referralCode,
  customReferralUrl,
  roleLabel,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const referralUrl =
    customReferralUrl || `https://dmcxayraxa.music/register?ref=${encodeURIComponent(referralCode)}`;
  const memberToken = `https://dmcxayraxa.music/verify-member?id=${encodeURIComponent(memberId)}&token=${Date.now().toString().slice(0, 8)}`;

  useEffect(() => {
    if (type === 'MEMBER' && isOpen) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 60));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [type, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const payload = type === 'REFERRAL' ? referralUrl : memberToken;
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(''));
  }, [isOpen, type, referralUrl, memberToken]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(type === 'REFERRAL' ? referralUrl : memberToken);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-400/60 rounded-2xl max-w-sm w-full p-5 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-1">
            <Globe className="w-3 h-3" />
            <span>dmcxayraxa.music {roleLabel ? `• ${roleLabel}` : ''}</span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-white">
            {type === 'MEMBER'
              ? `Digital Member QR (${roleLabel || 'Member'})`
              : `Official Referral QR (${roleLabel || 'Member'})`}
          </h3>
          <p className="text-[11px] text-slate-300 font-semibold truncate">
            {memberName} ({memberId})
          </p>
          <p className="text-[11px] text-slate-400">
            {type === 'MEMBER'
              ? 'Purpose-specific dynamic QR code for in-person studio check-in & event verification on dmcxayraxa.music.'
              : 'Permanent official referral QR code on dmcxayraxa.music for recruiting direct L1 downlines into your 3-Level Unilevel network.'}
          </p>
        </div>

        {/* Scannable QR Visual Canvas */}
        <div className="bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center shadow-inner mx-auto w-56 h-56 relative group border-2 border-amber-400">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={type === 'REFERRAL' ? 'Official Referral QR' : 'Digital Member QR'}
              className="w-48 h-48 object-contain rounded-lg"
            />
          ) : (
            <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg grid grid-cols-6 gap-1 border-2 border-slate-900">
              {Array.from({ length: 36 }).map((_, idx) => {
                const isCorner = idx === 0 || idx === 5 || idx === 30 || idx === 35;
                const isFilled =
                  (idx * 7 + (type === 'MEMBER' ? countdown : 13)) % 3 !== 0 || isCorner;
                return (
                  <div
                    key={idx}
                    className={`rounded-sm transition-all duration-300 ${
                      isFilled ? 'bg-amber-400' : 'bg-slate-800/40'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Central Official DMC Logo Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-1 rounded-xl shadow-md">
              <DmcOfficialLogo size={38} rounded="xl" withGoldRing={true} className="shadow-lg" />
            </div>
          </div>
        </div>

        {type === 'MEMBER' ? (
          <div className="mt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Token refreshes in {countdown}s</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-[10px] font-mono text-slate-300 truncate">
              {memberToken}
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Member Verification Link!' : 'Copy Member QR Link'}</span>
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {/* Referral Link Box (dmcxayraxa.music) */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-400/50 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-black uppercase text-amber-300">
                  Official Referral Link (dmcxayraxa.music)
                </span>
                <span className="font-mono font-bold text-emerald-400">Ref: {referralCode}</span>
              </div>
              <div className="font-mono text-[11px] text-white break-all bg-slate-900 p-2 rounded-lg border border-slate-800">
                {referralUrl}
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied Link!' : 'Copy Referral Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2 px-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied ID!' : `Copy ID (${referralCode})`}</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Direct signups via <strong className="text-amber-300">dmcxayraxa.music</strong> automatically lock into your L1 tier.
            </p>
          </div>
        )}

        <div className="mt-4 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-amber-400" />
          <span>Official Domain: https://dmcxayraxa.music • Member QR ≠ Referral QR</span>
        </div>
      </div>
    </div>
  );
};

