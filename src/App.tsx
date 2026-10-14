/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DmcProvider, useDmc } from './context/DmcContext';
import { Header } from './components/layout/Header';
import { BottomNavigation, MainNavTab } from './components/layout/BottomNavigation';
import { HomeScreen } from './components/screens/HomeScreen';
import { MembershipScreen } from './components/screens/MembershipScreen';
import { CatalogScreen } from './components/screens/CatalogScreen';
import { NetworkScreen } from './components/screens/NetworkScreen';
import { WalletScreen } from './components/screens/WalletScreen';
import { AcademyScreen } from './components/screens/AcademyScreen';
import { AiDmcScreen } from './components/screens/AiDmcScreen';
import { AdminPortal } from './components/admin/AdminPortal';
import { SpecSlidesViewer } from './components/common/SpecSlidesViewer';
import { UserControlPanelModal } from './components/common/UserControlPanelModal';
import { AuthPortalModal } from './components/common/AuthPortalModal';
import { Smartphone, Monitor, ShieldCheck, User, Presentation, Sparkles, LogIn, LogOut, UserPlus } from 'lucide-react';
import { formatLak } from './utils/i18n';

function AppContent() {
  const { currentMember, getMemberBalances, isAdminMode, setIsAdminMode, isLoggedOut, setIsLoggedOut } = useDmc();
  const [activeTab, setActiveTab] = useState<MainNavTab | 'membership' | 'catalog'>('home');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'desktop'>('mobile');
  const [showSpecDeck, setShowSpecDeck] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  const balances = getMemberBalances(currentMember.memberId);
  const isActive = currentMember.membershipState === 'ACTIVE_LIFETIME_MEMBER';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Main Navigation Header */}
      <Header />

      {/* Evaluator Quick Action Strip */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isLoggedOut ? (
                <strong className="text-red-400">Logged Out (No Active Session)</strong>
              ) : isAdminMode ? (
                <strong className="text-emerald-400">Super Admin Active ({currentMember.name})</strong>
              ) : (
                <>Active User: <strong className="text-white">{currentMember.name}</strong> <span className="text-slate-400 font-mono">({currentMember.memberId})</span></>
              )}
            </span>
          </div>

          {!isLoggedOut && (
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isActive 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isActive ? 'ACTIVE LIFETIME' : `FREE (${formatLak(balances.heldForQualification)} Held)`}
            </span>
          )}
        </div>

        {/* Viewport Frame Switcher & Authentication Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* 1. Log In / Switch User Button */}
          <button
            onClick={() => {
              setAuthModalMode('MEMBER');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In User</span>
          </button>

          {/* 1b. Register New Member Form Button */}
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('membership');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow"
            title="Open New Member Registration Form"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Member Form</span>
          </button>

          {/* 2. Log Out Button */}
          {!isLoggedOut && (
            <button
              onClick={() => {
                setIsAdminMode(false);
                setIsLoggedOut(true);
                setAuthModalMode('MEMBER');
                setShowAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span>Log Out</span>
            </button>
          )}

          {/* 3. Super Admin Login / Exit Button */}
          <button
            onClick={() => {
              if (isAdminMode) {
                setIsAdminMode(false);
              } else {
                setAuthModalMode('ADMIN');
                setShowAuthModal(true);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
              isAdminMode
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAdminMode ? 'Exit Super Admin' : 'Administrator Login'}</span>
          </button>

          {/* 3b. Profile, Password & SMS Recovery Button */}
          <button
            onClick={() => {
              setAuthModalMode('RECOVERY');
              setShowAuthModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs transition-colors cursor-pointer"
            title="Update Member or Super Admin Profile & Password or Recover by Phone SMS (+856)"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Profile & SMS Recovery (+856)</span>
          </button>

          {/* 4. User Control Panel */}
          <button
            onClick={() => setShowUserPanel(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Profile & Settings</span>
          </button>

          {!isAdminMode && (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setDeviceFrame('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  deviceFrame === 'mobile'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDeviceFrame('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                  deviceFrame === 'desktop'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Expanded</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {isAdminMode ? (
          <AdminPortal />
        ) : deviceFrame === 'mobile' ? (
          /* Mobile Frame Mockup (Matching Phone Screen Spec) */
          <div className="flex justify-center py-2">
            <div className="w-full max-w-[400px] sm:max-w-[416px] bg-[#69030e] border-[8px] border-slate-800 rounded-[3rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] ring-1 ring-slate-600/40 relative min-h-[820px] overflow-hidden flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
                {activeTab === 'academy' && <div className="p-4"><AcademyScreen /></div>}
                {activeTab === 'musichub' && <div className="p-4"><CatalogScreen onNavigate={setActiveTab} /></div>}
                {activeTab === 'wallet' && <div className="p-4"><WalletScreen onNavigate={setActiveTab} /></div>}
                {activeTab === 'network' && <div className="p-4"><NetworkScreen onNavigate={setActiveTab} /></div>}
                {activeTab === 'aidmc' && <div className="p-4"><AiDmcScreen /></div>}
                {activeTab === 'membership' && <div className="p-4"><MembershipScreen onNavigate={setActiveTab} /></div>}
                {activeTab === 'catalog' && <div className="p-4"><CatalogScreen onNavigate={setActiveTab} /></div>}
              </div>

              {/* Bottom Nav docked cleanly inside the phone frame */}
              <BottomNavigation 
                currentTab={activeTab === 'membership' || activeTab === 'catalog' ? 'musichub' : activeTab} 
                onSelectTab={setActiveTab} 
                isInsideFrame={true}
              />
            </div>
          </div>
        ) : (
          /* Full Responsive Screen View */
          <div className="pb-24">
            {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
            {activeTab === 'academy' && <AcademyScreen />}
            {activeTab === 'musichub' && <CatalogScreen onNavigate={setActiveTab} />}
            {activeTab === 'wallet' && <WalletScreen onNavigate={setActiveTab} />}
            {activeTab === 'network' && <NetworkScreen onNavigate={setActiveTab} />}
            {activeTab === 'aidmc' && <AiDmcScreen />}
            {activeTab === 'membership' && <MembershipScreen onNavigate={setActiveTab} />}
            {activeTab === 'catalog' && <CatalogScreen onNavigate={setActiveTab} />}

            {/* Bottom Nav */}
            <BottomNavigation 
              currentTab={activeTab === 'membership' || activeTab === 'catalog' ? 'musichub' : activeTab} 
              onSelectTab={setActiveTab} 
            />
          </div>
        )}
      </main>

      {/* Interactive UI Spec Slide Deck Modal */}
      <SpecSlidesViewer isOpen={showSpecDeck} onClose={() => setShowSpecDeck(false)} />

      {/* User Control Panel & Authentication Hub Modal */}
      <UserControlPanelModal isOpen={showUserPanel} onClose={() => setShowUserPanel(false)} />

      {/* Dedicated User & Super Admin Log In / Log Out Portal Modal */}
      <AuthPortalModal
        isOpen={showAuthModal || isLoggedOut}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Footer / Authority Attribution */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-[11px] text-slate-400">
        <p>Digital Music Center (DMC Xayraxa) • Rev 2.6 Consolidated Specification</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Vientiane Capital, Lao PDR • Integer LAK Authoritative Double-Entry Ledger • 3-Level Unilevel
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DmcProvider>
      <AppContent />
    </DmcProvider>
  );
}
