/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * DMC SUPPORT — HOW NEW USER MEMBER REGISTER STEP-BY-STEP WITH VIDEO SHOW
 * Features:
 * - Interactive Animated Video Show Player (6-Chapter Step-by-Step Visual Walkthrough with Play/Pause, Scrubber & Captions)
 * - Custom Video Upload (.mp4 / WebM from device) & YouTube / Video URL Embed support (saved in localStorage)
 * - Complete 6-Step Visual Registration Guide (English & Lao ພາສາລາວ)
 * - 1-Click "Start New Member Registration Now" action button
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Video,
  Upload,
  CheckCircle2,
  UserPlus,
  Smartphone,
  Camera,
  Landmark,
  QrCode,
  Music,
  Award,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  ExternalLink,
  ChevronRight,
  Check,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { DmcOfficialLogo } from './DmcLogo';

export interface RegistrationTutorialStep {
  stepNumber: number;
  badge: string;
  titleEn: string;
  titleLao: string;
  durationSec: number;
  descriptionEn: string;
  descriptionLao: string;
  keyAction: string;
  highlightTip: string;
  accentColor: string;
  screenMockupType: 'SPONSOR_FORM' | 'PHONE_OTP' | 'PROFILE_PHOTO' | 'LAO_BANK_QR' | 'ACTIVATE_1600K' | 'SONG_AND_TREE';
}

export const DEFAULT_REGISTRATION_STEPS: RegistrationTutorialStep[] = [
  {
    stepNumber: 1,
    badge: 'STEP 01 • SPONSOR & REGISTER',
    titleEn: 'Tap "Join / Register" & Enter Sponsor ID',
    titleLao: 'ຂັ້ນຕອນທີ 1: ກົດສະໝັກສະມາຊິກໃໝ່ ແລະ ປ້ອນລະຫັດຜູ້ແນະນຳ (Sponsor ID)',
    durationSec: 6,
    descriptionEn:
      'Open the Membership tab or scan your inviter’s Referral QR Code. Enter your Sponsor Member ID (e.g., DMC-LA-00404) so your account is permanently linked in the 3-Level Unilevel Organize Tree.',
    descriptionLao:
      'ເປີດໜ້າ Membership ຫຼື ສະແກນ QR ຜູ້ແນະນຳ. ປ້ອນລະຫັດຜູ້ແນະນຳ (ເຊັ່ນ: DMC-LA-00404) ເພື່ອເຊື່ອມຕໍ່ສາຍງານ 3 ຊັ້ນ.',
    keyAction: 'Select Upline Sponsor ID (e.g. DMC-LA-00404)',
    highlightTip: 'Starts as FREE_MEMBER (0 LAK registration fee)',
    accentColor: 'from-blue-600 to-indigo-700',
    screenMockupType: 'SPONSOR_FORM',
  },
  {
    stepNumber: 2,
    badge: 'STEP 02 • LAO PHONE & SMS OTP',
    titleEn: 'Enter Full Name, Lao Phone (+856 20) & Verify SMS OTP',
    titleLao: 'ຂັ້ນຕອນທີ 2: ປ້ອນຊື່ແທ້, ເບີໂທລະສັບລາວ (+856 20) ແລະ ຢືນຢັນລະຫັດ SMS OTP',
    durationSec: 6,
    descriptionEn:
      'Fill in your full legal name, Lao mobile number (+856 20 5xxx xxxx / 9xxx xxxx), and 6-digit security PIN. Confirm your phone number with the 6-digit SMS OTP code.',
    descriptionLao:
      'ປ້ອນຊື່ ແລະ ນາມສະກຸນແທ້, ເບີໂທລະສັບ (+856 20) ແລະ ຕັ້ງລະຫັດຜ່ານ 6 ຕົວເລກ ພ້ອມຢືນຢັນ SMS OTP.',
    keyAction: 'Enter +856 20 Phone & 6-Digit Password PIN',
    highlightTip: 'Supports Lao Telecom, Unitel, ETL & TPlus',
    accentColor: 'from-emerald-600 to-teal-700',
    screenMockupType: 'PHONE_OTP',
  },
  {
    stepNumber: 3,
    badge: 'STEP 03 • PROFILE PHOTO & KYC',
    titleEn: 'Upload Your Member Profile Photo & Verify KYC',
    titleLao: 'ຂັ້ນຕອນທີ 3: ອັບໂຫຼດຮູບໂປຣໄຟລ໌ສ່ວນຕົວ ແລະ ຢືນຢັນຕົວຕົນ (KYC)',
    durationSec: 6,
    descriptionEn:
      'Tap the Camera icon on your Member Card or User Control Panel to upload your own profile photo from your phone or computer and complete Lao National ID / Passport KYC.',
    descriptionLao:
      'ກົດปຸ່ມຮູບກ້ອງຢູ່ບັດສະມາຊິກ ເພື່ອອັບໂຫຼດຮູບໂປຣໄຟລ໌ຂອງທ່ານເອງ ແລະ ຢືນຢັນຂໍ້ມູນ KYC.',
    keyAction: 'Upload Personal Profile Image & Shipping Address',
    highlightTip: 'Instant self-service profile photo update',
    accentColor: 'from-purple-600 to-fuchsia-700',
    screenMockupType: 'PROFILE_PHOTO',
  },
  {
    stepNumber: 4,
    badge: 'STEP 04 • LAO BANK & QR UPLOAD',
    titleEn: 'Link Your Lao Bank Account & Upload Your QR Code',
    titleLao: 'ຂັ້ນຕອນທີ 4: ຜູກບັນຊີທະນາຄານລາວ ແລະ ອັບໂຫຼດຮູບ QR ຮັບເງິນຂອງທ່ານ',
    durationSec: 6,
    descriptionEn:
      'Choose your Lao bank (1/ BCEL One, 2/ LDB, 3/ JDB, 4/ VietinBank Lao, or 5/ Phongsavanh Bank Laos PSVB), enter your account number, and upload your personal QR code image.',
    descriptionLao:
      'ເລືອກທະນາຄານລາວ (BCEL One, LDB, JDB, VietinBank ຫຼື ທະນາຄານພົງສະຫວັນ PSVB) ພ້ອມອັບໂຫຼດຮູບ QR ຂອງທ່ານ.',
    keyAction: 'Link BCEL / LDB / JDB / VIETIN / Phongsavanh Bank',
    highlightTip: 'Upload your own QR Code image for fast payouts',
    accentColor: 'from-amber-500 to-orange-600',
    screenMockupType: 'LAO_BANK_QR',
  },
  {
    stepNumber: 5,
    badge: 'STEP 05 • 1,600,000 LAK ACTIVATION',
    titleEn: 'Activate Lifetime Membership (1,600,000 LAK Music Package)',
    titleLao: 'ຂັ້ນຕອນທີ 5: ເປີດໃຊ້ງານສະມາຊິກຕະຫຼອດຊີບ 1,600,000 ກີບ (ຊຸດຜະລິດເພງ)',
    durationSec: 6,
    descriptionEn:
      'Purchase the Core Music Production Package (MUSIC_SINGLE_1600 = 1,600,000 LAK) via Lao Bank QR Payment or redeem your accumulated Held for Qualification balance.',
    descriptionLao:
      'ຊຳລະຄ່າຊຸດຜະລິດເພງ 1,600,000 ກີບ ຜ່ານ LAO QR ຫຼື ໃຊ້ຍອດເງິນສະສົມ Held for Qualification ເພື່ອເລື່ອນຂັ້ນເປັນສະມາຊິກຕະຫຼອດຊີບ.',
    keyAction: 'Scan Lao Bank QR (1,600,000 LAK) or Redeem Held Balance',
    highlightTip: 'Upgrades status to ACTIVE_LIFETIME_MEMBER forever',
    accentColor: 'from-rose-600 to-red-700',
    screenMockupType: 'ACTIVATE_1600K',
  },
  {
    stepNumber: 6,
    badge: 'STEP 06 • STUDIO SONG & 3-TIER REWARDS',
    titleEn: 'Receive Custom Song, Copyright Certificate & 3-Level Commissions',
    titleLao: 'ຂັ້ນຕອນທີ 6: ຮັບເພງລິຂະສິດສ່ວນຕົວ, ໃບຢັ້ງຢືນລິຂະສິດ ແລະ ຄອມມິດຊັ່ນ 3 ຊັ້ນ',
    durationSec: 6,
    descriptionEn:
      'Your custom studio song enters production (900,000 LAK budget) with an Official Copyright Certificate, and you unlock withdrawable 3-Tier Unilevel commissions (L1: 400k • L2: 200k • L3: 100k LAK)!',
    descriptionLao:
      'ຮັບສິດຜະລິດເພງໃໝ່ 1 ເພງ ພ້ອມໃບຢັ້ງຢືນລິຂະສິດແທ້ 100% ແລະ ຮັບລາຍໄດ້ຄອມມິດຊັ່ນ 3 ຊັ້ນ (L1: 400,000 • L2: 200,000 • L3: 100,000 ກີບ)!',
    keyAction: 'Download Copyright Certificate & Withdraw LAK Commissions',
    highlightTip: 'L1: 400k LAK • L2: 200k LAK • L3: 100k LAK',
    accentColor: 'from-emerald-500 to-amber-500',
    screenMockupType: 'SONG_AND_TREE',
  },
];

const CUSTOM_VIDEO_STORAGE_KEY = 'dmc_support_registration_video_v26';

interface CustomVideoConfig {
  videoMode: 'INTERACTIVE_SHOW' | 'CUSTOM_VIDEO';
  customVideoUrl: string;
  customVideoTitle: string;
}

interface MemberRegistrationTutorialGuideProps {
  onStartRegistration?: () => void;
}

export const MemberRegistrationTutorialGuide: React.FC<MemberRegistrationTutorialGuideProps> = ({
  onStartRegistration,
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepProgress, setStepProgress] = useState(0); // 0 to 100 within current step
  const [showCustomVideoEditor, setShowCustomVideoEditor] = useState(false);
  const [videoNotice, setVideoNotice] = useState<string | null>(null);

  const [videoConfig, setVideoConfig] = useState<CustomVideoConfig>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_VIDEO_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    return {
      videoMode: 'INTERACTIVE_SHOW',
      customVideoUrl: '',
      customVideoTitle: 'Official DMC New Member Registration Tutorial Video',
    };
  });

  const [videoUrlInput, setVideoUrlInput] = useState(videoConfig.customVideoUrl);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_VIDEO_STORAGE_KEY, JSON.stringify(videoConfig));
    } catch {
      // ignore
    }
  }, [videoConfig]);

  // Timer for the Interactive Animated Video Show
  useEffect(() => {
    if (!isPlaying || videoConfig.videoMode !== 'INTERACTIVE_SHOW') return;

    const intervalMs = 100;
    const currentStep = DEFAULT_REGISTRATION_STEPS[activeStepIdx];
    const increment = 100 / ((currentStep.durationSec * 1000) / intervalMs);

    const timer = setInterval(() => {
      setStepProgress((prev) => {
        if (prev + increment >= 100) {
          setActiveStepIdx((idx) => (idx + 1) % DEFAULT_REGISTRATION_STEPS.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, activeStepIdx, videoConfig.videoMode]);

  const currentStep = DEFAULT_REGISTRATION_STEPS[activeStepIdx];
  const overallProgressPercent = Math.round(
    ((activeStepIdx * 100 + stepProgress) / (DEFAULT_REGISTRATION_STEPS.length * 100)) * 100
  );

  const handleSelectStep = (index: number) => {
    setActiveStepIdx(index);
    setStepProgress(0);
  };

  const handleNextStep = () => {
    setActiveStepIdx((prev) => (prev + 1) % DEFAULT_REGISTRATION_STEPS.length);
    setStepProgress(0);
  };

  const handlePrevStep = () => {
    setActiveStepIdx(
      (prev) => (prev - 1 + DEFAULT_REGISTRATION_STEPS.length) % DEFAULT_REGISTRATION_STEPS.length
    );
    setStepProgress(0);
  };

  const handleUploadCustomVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated: CustomVideoConfig = {
          videoMode: 'CUSTOM_VIDEO',
          customVideoUrl: reader.result,
          customVideoTitle: file.name,
        };
        setVideoConfig(updated);
        setVideoUrlInput(reader.result);
        setShowCustomVideoEditor(false);
        setVideoNotice(`Uploaded custom registration tutorial video: ${file.name}`);
        setTimeout(() => setVideoNotice(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper to convert standard YouTube watch URL to embed URL if needed
  const getEmbedUrl = (url: string): { isYoutube: boolean; src: string } => {
    const trimmed = url.trim();
    if (trimmed.includes('youtube.com/watch?v=')) {
      const videoId = trimmed.split('v=')[1]?.split('&')[0];
      if (videoId) return { isYoutube: true, src: `https://www.youtube.com/embed/${videoId}` };
    }
    if (trimmed.includes('youtu.be/')) {
      const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return { isYoutube: true, src: `https://www.youtube.com/embed/${videoId}` };
    }
    return { isYoutube: false, src: trimmed };
  };

  return (
    <div className="space-y-3.5 text-slate-900">
      {/* Top Banner Header */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#2e1d87] via-[#1c2356] to-[#df1c2d] text-white shadow-md">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shrink-0 shadow">
              <Video className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                  VIDEO TUTORIAL & GUIDE
                </span>
                <span className="text-[10px] text-amber-200 font-mono font-bold">
                  6 EASY STEPS
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                How New User Member Register Step-by-Step
              </h4>
              <p className="text-[10px] text-slate-200 truncate">
                ວິທີສະໝັກສະມາຊິກໃໝ່ DMC Xayraxa ແບບລະອຽດເທື່ອລະຂັ້ນຕອນ ພ້ອມວິດີໂອສາທິດ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomVideoEditor(!showCustomVideoEditor)}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
            title="Upload or change tutorial video file / URL"
          >
            <Upload className="w-3 h-3 text-amber-300" />
            <span>{showCustomVideoEditor ? 'Close Video Setup' : 'Upload Video'}</span>
          </button>
        </div>
      </div>

      {videoNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{videoNotice}</span>
        </div>
      )}

      {/* Administrator / User Custom Video Upload & URL Panel */}
      {showCustomVideoEditor && (
        <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 space-y-2.5 text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-800 text-[11px] flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#df1c2d]" />
              <span>Upload Custom Registration Video (.MP4) or Paste Video URL</span>
            </span>
            {videoConfig.customVideoUrl && (
              <button
                type="button"
                onClick={() => {
                  setVideoConfig({
                    videoMode: 'INTERACTIVE_SHOW',
                    customVideoUrl: '',
                    customVideoTitle: 'Official DMC New Member Registration Tutorial Video',
                  });
                  setVideoUrlInput('');
                  setVideoNotice('Switched back to built-in Interactive 6-Step Video Show.');
                  setTimeout(() => setVideoNotice(null), 3000);
                }}
                className="text-[10px] text-red-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset to Default Video Show</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="py-2 px-3 rounded-xl bg-[#df1c2d] hover:bg-red-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Video File (MP4/WebM)</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleUploadCustomVideo}
                className="hidden"
              />
            </label>

            <div className="flex gap-1.5">
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Paste YouTube or MP4 URL..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-900"
              />
              <button
                type="button"
                onClick={() => {
                  if (!videoUrlInput.trim()) return;
                  setVideoConfig({
                    videoMode: 'CUSTOM_VIDEO',
                    customVideoUrl: videoUrlInput.trim(),
                    customVideoTitle: 'Custom DMC Registration Video',
                  });
                  setShowCustomVideoEditor(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#2e1d87] text-white font-bold text-[11px] cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setVideoConfig((prev) => ({ ...prev, videoMode: 'INTERACTIVE_SHOW' }))}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                videoConfig.videoMode === 'INTERACTIVE_SHOW'
                  ? 'bg-[#2e1d87] text-white'
                  : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              Built-in 6-Step Animated Video Show
            </button>
            {videoConfig.customVideoUrl && (
              <button
                type="button"
                onClick={() => setVideoConfig((prev) => ({ ...prev, videoMode: 'CUSTOM_VIDEO' }))}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                  videoConfig.videoMode === 'CUSTOM_VIDEO'
                    ? 'bg-[#df1c2d] text-white'
                    : 'bg-white text-slate-700 border border-slate-300'
                }`}
              >
                Play Uploaded Custom Video
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIDEO PLAYER SHOWCASE (INTERACTIVE STEP-BY-STEP VIDEO OR CUSTOM UPLOAD)
         ========================================================================= */}
      <div className="rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-xl text-white">
        {videoConfig.videoMode === 'CUSTOM_VIDEO' && videoConfig.customVideoUrl ? (
          <div className="space-y-2 p-2">
            {(() => {
              const parsed = getEmbedUrl(videoConfig.customVideoUrl);
              if (parsed.isYoutube) {
                return (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                    <iframe
                      title="DMC Member Registration Video"
                      src={parsed.src}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return (
                <video
                  ref={videoRef}
                  src={parsed.src}
                  controls
                  autoPlay
                  className="w-full aspect-video rounded-xl bg-black object-contain"
                />
              );
            })()}
            <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-300">
              <span className="font-bold truncate">{videoConfig.customVideoTitle}</span>
              <button
                type="button"
                onClick={() =>
                  setVideoConfig((prev) => ({ ...prev, videoMode: 'INTERACTIVE_SHOW' }))
                }
                className="text-amber-400 hover:underline font-bold cursor-pointer"
              >
                Switch to Interactive 6-Step Video Show →
              </button>
            </div>
          </div>
        ) : (
          /* BUILT-IN INTERACTIVE ANIMATED 6-STEP REGISTRATION VIDEO SHOW */
          <div>
            {/* Top Video Status Bar */}
            <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>VIDEO SHOW</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {currentStep.badge}
                </span>
              </div>
              <span className="font-mono text-slate-400">
                Step {currentStep.stepNumber} / {DEFAULT_REGISTRATION_STEPS.length} ({overallProgressPercent}%)
              </span>
            </div>

            {/* Animated Visual Stage for Current Step */}
            <div
              className={`p-4 bg-gradient-to-br ${currentStep.accentColor} relative overflow-hidden min-h-[225px] flex flex-col justify-between`}
            >
              {/* Decorative watermark */}
              <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                <DmcOfficialLogo size={140} rounded="full" withGoldRing={false} />
              </div>

              {/* Step Title & Live Visual Mockup Card */}
              <div className="space-y-2.5 relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-sm sm:text-base font-black text-white leading-snug">
                      {currentStep.titleEn}
                    </h5>
                    <p className="text-[11px] font-bold text-amber-200 mt-0.5">
                      {currentStep.titleLao}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-black/35 border border-white/25 flex items-center justify-center font-black text-sm text-amber-300 shrink-0">
                    0{currentStep.stepNumber}
                  </div>
                </div>

                {/* Simulated Screen Visual inside the Video Frame */}
                <div className="p-3 rounded-xl bg-slate-950/85 border border-white/20 backdrop-blur-xs space-y-2 shadow-lg">
                  {currentStep.screenMockupType === 'SPONSOR_FORM' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1">
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>New Member Registration Form</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                          FREE_MEMBER
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                        <div className="p-1.5 rounded bg-slate-900 border border-amber-400/50 text-white">
                          <span className="text-[8px] text-slate-400 block">Sponsor Upline ID *</span>
                          <strong className="text-amber-300">DMC-LA-00404 ✓</strong>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-700 text-white">
                          <span className="text-[8px] text-slate-400 block">Assign Method</span>
                          <strong className="text-emerald-300">QR Code / Referral Link</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.screenMockupType === 'PHONE_OTP' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-emerald-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Lao Phone (+856) & SMS OTP Verification</span>
                        </span>
                        <span className="font-mono text-[10px] text-amber-300">OTP: 123456</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                        <div className="p-1.5 rounded bg-slate-900 border border-slate-700">
                          <span className="text-[8px] text-slate-400 block">Full Name</span>
                          <strong className="text-white">SOMCHAI PHOMVIHANE</strong>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-emerald-500/50 font-mono">
                          <span className="text-[8px] text-slate-400 block">Lao Phone</span>
                          <strong className="text-emerald-300">+856 20 5588 9900</strong>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900 border border-amber-500/50 font-mono">
                          <span className="text-[8px] text-slate-400 block">6-Digit PIN</span>
                          <strong className="text-amber-300">● ● ● ● ● ●</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep.screenMockupType === 'PROFILE_PHOTO' && (
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center border-2 border-white">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Upload Member Profile Image</div>
                          <div className="text-[10px] text-slate-300">
                            Self-service photo upload + Lao National ID KYCVerified
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px]">
                        KYC VERIFIED ✓
                      </span>
                    </div>
                  )}

                  {currentStep.screenMockupType === 'LAO_BANK_QR' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Select Lao Bank & Upload Personal QR Code</span>
                        </span>
                        <span className="text-[9px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">
                          5 LAO BANKS
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 font-mono text-[9px]">
                        {['1/ BCEL One', '2/ LDB Trust', '3/ JDB YesPay', '4/ VietinBank', '5/ Phongsavanh PSVB'].map(
                          (b) => (
                            <span
                              key={b}
                              className="px-2 py-0.5 rounded bg-slate-900 border border-amber-400/40 text-amber-200 font-bold"
                            >
                              {b}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep.screenMockupType === 'ACTIVATE_1600K' && (
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <div>
                        <span className="text-[9px] font-mono text-amber-300 uppercase block">
                          CORE PACKAGE • MUSIC_SINGLE_1600
                        </span>
                        <div className="font-black text-white text-xs sm:text-sm font-mono">
                          1,600,000 LAK (₭) — Lifetime Activation
                        </div>
                        <span className="text-[10px] text-emerald-300">
                          Pay via Lao Bank QR or Redeem Held Commission Balance
                        </span>
                      </div>
                      <QrCode className="w-9 h-9 text-amber-400 shrink-0" />
                    </div>
                  )}

                  {currentStep.screenMockupType === 'SONG_AND_TREE' && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>1 Custom Studio Song + 3-Tier Unilevel Split</span>
                        </span>
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                          ACTIVE LIFETIME
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
                        <div className="p-1 rounded bg-slate-900 border border-slate-700">
                          <span className="text-slate-400 block">Studio</span>
                          <strong className="text-white">900k ₭</strong>
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-amber-500/40">
                          <span className="text-amber-300 block">L1 Direct</span>
                          <strong className="text-emerald-300">400k ₭</strong>
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-amber-500/40">
                          <span className="text-amber-300 block">L2 Tier</span>
                          <strong className="text-emerald-300">200k ₭</strong>
                        </div>
                        <div className="p-1 rounded bg-slate-900 border border-amber-500/40">
                          <span className="text-amber-300 block">L3 Tier</span>
                          <strong className="text-emerald-300">100k ₭</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtitle / Voiceover Caption Box inside Video Frame */}
              <div className="mt-3 p-2.5 rounded-xl bg-black/75 border border-white/15 text-[11px] leading-snug relative z-10">
                <p className="text-white font-medium">{currentStep.descriptionEn}</p>
                <p className="text-amber-300 text-[10px] mt-1">{currentStep.descriptionLao}</p>
              </div>
            </div>

            {/* Video Progress Scrubber & Playback Controls */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
              {/* 6-Segment Chapter Progress Bar */}
              <div className="grid grid-cols-6 gap-1">
                {DEFAULT_REGISTRATION_STEPS.map((st, idx) => {
                  const fillWidth =
                    idx < activeStepIdx ? 100 : idx === activeStepIdx ? stepProgress : 0;
                  return (
                    <button
                      key={st.stepNumber}
                      type="button"
                      onClick={() => handleSelectStep(idx)}
                      className="h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer relative"
                      title={`Jump to Step ${st.stepNumber}: ${st.titleEn}`}
                    >
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[#df1c2d] transition-all duration-100"
                        style={{ width: `${fillWidth}%` }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Previous Step"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause Video</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Video Show</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    title="Next Step"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStepIdx(0);
                      setStepProgress(0);
                      setIsPlaying(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                    title="Replay from Step 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[10px] font-mono text-amber-300 font-bold">
                  {currentStep.highlightTip}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          INTERACTIVE 6-STEP REGISTRATION CHECKLIST CARDS (CLICK ANY STEP TO WATCH)
         ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            Step-by-Step New Member Registration Checklist (Tap Step to Preview):
          </span>
          <span className="text-[10px] font-bold text-[#2e1d87]">Step 1 → Step 6</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {DEFAULT_REGISTRATION_STEPS.map((step, idx) => {
            const isSelected = idx === activeStepIdx;
            return (
              <div
                key={step.stepNumber}
                onClick={() => handleSelectStep(idx)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/90 border-amber-400 shadow-sm ring-1 ring-amber-400/50'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#df1c2d] text-white shadow'
                        : 'bg-[#2e1d87] text-white'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-black text-slate-900 truncate">
                        {step.titleEn}
                      </h5>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                        {isSelected ? '▶ Playing' : `Step ${step.stepNumber}`}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#2e1d87] mt-0.5">
                      {step.titleLao}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                      {step.descriptionEn}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[9px]">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                        ✓ {step.keyAction}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold">
                        ★ {step.highlightTip}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Action CTA to Open Registration Immediately */}
      {onStartRegistration && (
        <button
          type="button"
          onClick={onStartRegistration}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#df1c2d] via-red-600 to-[#2e1d87] hover:opacity-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Start New Member Registration Now (ສະໝັກສະມາຊິກໃໝ່ທັນທີ)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
