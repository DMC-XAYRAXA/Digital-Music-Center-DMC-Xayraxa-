/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * QR Code Display Modal (Differentiates Member QR from Referral QR)
 */

import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, X, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { formatLak } from '../../utils/i18n';
import { DmcOfficialLogo } from './DmcLogo';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'MEMBER' | 'REFERRAL';
  memberId: string;
  memberName: string;
  referralCode: string;
}

export const QrCodeModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  type,
  memberId,
  memberName,
  referralCode,
}) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (type === 'MEMBER' && isOpen) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => (prev > 1 ? prev - 1 : 60));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [type, isOpen]);

  if (!isOpen) return null;

  const referralUrl = `https://dmcxayraxa.la/register?ref=${referralCode}`;
  const memberToken = `DMC_AUTH_TOKEN:${memberId}:${Date.now().toString().slice(0, 8)}:EXP60`;

  const handleCopy = () => {
    navigator.clipboard.writeText(type === 'REFERRAL' ? referralUrl : memberToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1 mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">
            {type === 'MEMBER' ? 'Digital Member QR' : 'Official Referral QR'}
          </h3>
          <p className="text-xs text-slate-400">
            {type === 'MEMBER'
              ? 'Purpose-specific dynamic QR code for in-person studio check-in & event verification.'
              : 'Permanent referral QR code for recruiting direct L1 downlines into your unilevel team.'}
          </p>
        </div>

        {/* QR Visual Canvas */}
        <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center shadow-inner mx-auto w-56 h-56 relative group">
          {/* Simulated High-Res QR Matrix */}
          <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg grid grid-cols-6 gap-1 border-2 border-slate-900">
            {Array.from({ length: 36 }).map((_, idx) => {
              // Create dynamic decorative QR pattern
              const isCorner = idx === 0 || idx === 5 || idx === 30 || idx === 35;
              const isFilled = (idx * 7 + (type === 'MEMBER' ? countdown : 13)) % 3 !== 0 || isCorner;
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

          {/* Central Official DMC Logo Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <DmcOfficialLogo size={42} rounded="xl" withGoldRing={true} className="shadow-lg" />
          </div>
        </div>

        {type === 'MEMBER' ? (
          <div className="mt-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Token refreshes in {countdown}s</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              ID: {memberId} • Single-purpose short-lived token
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700 text-xs flex items-center justify-between">
              <span className="font-mono text-amber-300 font-bold truncate max-w-[200px]">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Direct signups via this QR automatically lock into your L1 tier.
            </p>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
          <ShieldAlert className="w-3 h-3 text-slate-400" />
          <span>Rev 2.6 Security: Member QR ≠ Referral QR</span>
        </div>
      </div>
    </div>
  );
};
