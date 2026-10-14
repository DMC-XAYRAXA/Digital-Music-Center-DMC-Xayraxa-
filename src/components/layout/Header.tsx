/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * App Header, Identity Switcher, Multi-Language Picker & User Control Panel
 */

import React, { useState } from 'react';
import { useDmc } from '../../context/DmcContext';
import { translations, SUPPORTED_LANGUAGES } from '../../utils/i18n';
import {
  ShieldCheck,
  Globe,
  Users,
  Bell,
  ChevronDown,
  CheckCircle2,
  LogIn,
  LogOut,
  Check,
} from 'lucide-react';
import { UserControlPanelModal } from '../common/UserControlPanelModal';
import { AuthPortalModal } from '../common/AuthPortalModal';
import { DmcOfficialLogo } from '../common/DmcLogo';

export const Header: React.FC = () => {
  const {
    currentMember,
    allMembers,
    setCurrentMemberId,
    language,
    setLanguage,
    isAdminMode,
    setIsAdminMode,
    isLoggedOut,
    setIsLoggedOut,
  } = useDmc();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  const t = translations[language];
  const currentLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner / Environment Strip */}
      <div className="bg-gradient-to-r from-amber-600/20 via-red-900/30 to-amber-600/20 px-4 py-1.5 border-b border-amber-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DMC XAYRAXA • REVISION 2.6 UNIFIED SYSTEM</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Unilevel 3-Level • No Binary • Integer LAK • Asia/Vientiane
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Member Login Form Button */}
          <button
            onClick={() => {
              setAuthMode('MEMBER');
              setShowAuthModal(true);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.memberLogin}</span>
          </button>

          {/* Administrator Login Form Button */}
          <button
            onClick={() => {
              setAuthMode('ADMIN');
              setShowAuthModal(true);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.adminLogin}</span>
          </button>

          {/* Quick User Log Out Access */}
          {!isLoggedOut && (
            <button
              onClick={() => {
                setIsAdminMode(false);
                setIsLoggedOut(true);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 border border-rose-500/30 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.signOut}</span>
            </button>
          )}

          {/* Super Admin Switcher Toggle */}
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              if (!isAdminMode) setIsLoggedOut(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAdminMode
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Exit Admin Console' : t.navAdmin}</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <DmcOfficialLogo size={38} rounded="xl" withGoldRing={true} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                DMC XAYRAXA
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Rev 2.6
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400">{t.subtitle}</p>
          </div>
        </div>

        {/* Controls: User Control Panel, Persona Switcher, Language & Notifications */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Main User Control Panel & Login Button */}
          <button
            onClick={() => setShowControlPanel(true)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-red-500/15 hover:from-amber-500/25 hover:to-red-500/25 border border-amber-500/40 text-xs transition-all cursor-pointer shadow-sm"
            title="Open User Control Panel & Authentication Hub"
          >
            <div className="relative w-7 h-7 min-w-[28px] min-h-[28px] shrink-0">
              <img
                src={
                  currentMember.avatarUrl ||
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80'
                }
                alt={currentMember.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-400"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[9px] text-amber-400 leading-none font-bold uppercase">
                {t.profileLabel}
              </div>
              <div className="font-bold text-white text-xs truncate max-w-[110px]">
                {currentMember.name.split(' ')[0]}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Quick Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPersonaMenu(!showPersonaMenu);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs transition-colors cursor-pointer"
              title="Quickly switch between test identities (A01 - E06)"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline text-[11px] font-mono text-slate-300">
                {currentMember.memberId}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPersonaMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPersonaMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs font-semibold text-slate-400 flex justify-between items-center">
                    <span>{t.switchPersona}</span>
                    <button
                      onClick={() => {
                        setShowPersonaMenu(false);
                        setShowControlPanel(true);
                      }}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Full Panel
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1 pt-1">
                    {allMembers.map((m) => {
                      const isSelected = m.memberId === currentMember.memberId;
                      return (
                        <button
                          key={m.memberId}
                          onClick={() => {
                            setCurrentMemberId(m.memberId);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200'
                              : 'hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-white flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>{m.memberId}</span>
                              <span>•</span>
                              <span
                                className={
                                  m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                    ? 'text-emerald-400'
                                    : 'text-amber-400'
                                }
                              >
                                {m.membershipState === 'ACTIVE_LIFETIME_MEMBER'
                                  ? t.activeMember
                                  : t.freeMember}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowPersonaMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-amber-500/40 text-xs text-slate-200 cursor-pointer shadow-sm"
              title="Select Language (English, ພາສາລາວ, ไทย, Tiếng Việt, 中文, 한국어)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-sm leading-none">{currentLangOption.flag}</span>
              <span className="font-bold text-amber-300 text-[11px]">
                {currentLangOption.nativeName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLangMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider border-b border-slate-800 mb-1 flex items-center justify-between">
                    <span>{t.selectLanguageLabel}</span>
                    <span className="font-mono text-slate-400">6 LANGS</span>
                  </div>
                  {SUPPORTED_LANGUAGES.map((langOpt) => {
                    const isSelected = language === langOpt.code;
                    return (
                      <button
                        key={langOpt.code}
                        onClick={() => {
                          setLanguage(langOpt.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow'
                            : 'text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{langOpt.flag}</span>
                          <span>
                            <span className="block leading-tight">{langOpt.nativeName}</span>
                            <span
                              className={`text-[9px] block leading-tight ${
                                isSelected ? 'text-slate-800 font-bold' : 'text-slate-400'
                              }`}
                            >
                              {langOpt.name}
                            </span>
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-[10px] uppercase font-mono opacity-80">
                            {langOpt.code}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowPersonaMenu(false);
                setShowLangMenu(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-300 relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
                  <div className="text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800 flex justify-between items-center">
                    <span>Authoritative Notifications</span>
                    <span className="text-[10px] text-amber-400">Live feed</span>
                  </div>
                  <div className="space-y-2 pt-2 max-h-60 overflow-y-auto">
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 text-xs">
                      <p className="font-medium text-slate-200">{t.qualificationProgress}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {t.qualifiedCongratulations}
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-800/60 border border-slate-700/50 text-xs">
                      <p className="font-medium text-slate-200">{t.networkTitle}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.networkDesc}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Control Panel Modal */}
      <UserControlPanelModal
        isOpen={showControlPanel}
        onClose={() => setShowControlPanel(false)}
      />

      {/* Dedicated Auth Portal Modal */}
      <AuthPortalModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </header>
  );
};
