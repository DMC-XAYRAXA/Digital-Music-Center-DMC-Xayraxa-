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
import { AutoLanguageDomTranslator } from './components/common/AutoLanguageDomTranslator';

function AppContent() {
  const { isAdminMode, isLoggedOut } = useDmc();
  const [activeTab, setActiveTab] = useState<MainNavTab | 'membership' | 'catalog' | 'mymusic'>('home');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'desktop'>('mobile');
  const [showSpecDeck, setShowSpecDeck] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  // Default Startup Gate & 12-Hour Active Session Automatic Sign-Out Gate:
  // Users and Administrators stay signed in for 12 hours of active use and sign out automatically after 12 hours of inactivity.
  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center font-sans selection:bg-amber-500/30 selection:text-amber-900">
        <AutoLanguageDomTranslator />
        <AuthPortalModal isOpen={true} initialMode="MEMBER" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-500/30 ${
        isAdminMode ? 'bg-slate-950 text-slate-100 selection:text-amber-200' : 'bg-white text-slate-900 selection:text-amber-900'
      }`}
    >
      <AutoLanguageDomTranslator />
      {/* Top Main Navigation Header (Hidden on mobile when in mobile app view since each screen has its own Crimson App Header) */}
      <div className={!isAdminMode && deviceFrame === 'mobile' ? 'hidden md:block' : 'block'}>
        <Header
          deviceFrame={deviceFrame}
          setDeviceFrame={setDeviceFrame}
          onSelectTab={(tab) => {
            if (isAdminMode) {
              // If user selects an app tab from search while in Admin Mode, switch back to app view or stay
            }
            setActiveTab(tab);
          }}
        />
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-6xl w-full mx-auto ${
          !isAdminMode && deviceFrame === 'mobile'
            ? 'px-0 py-0 sm:px-4 sm:py-6 bg-white'
            : 'px-4 py-6'
        }`}
      >
        {isAdminMode ? (
          <AdminPortal />
        ) : deviceFrame === 'mobile' ? (
          /* Mobile View (Full screen on mobile devices, Phone Frame Mockup on Desktop) */
          <div className="flex justify-center sm:py-2 bg-white">
            <div className="w-full sm:max-w-[440px] bg-white border-0 sm:border-[8px] sm:border-slate-800 rounded-none sm:rounded-[3rem] shadow-none sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] sm:ring-1 sm:ring-slate-300 relative min-h-screen sm:min-h-[820px] overflow-hidden flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
                {activeTab === 'academy' && <AcademyScreen onNavigate={setActiveTab} />}
                {activeTab === 'musichub' && <CatalogScreen onNavigate={setActiveTab} viewMode="HUB" />}
                {activeTab === 'wallet' && <WalletScreen onNavigate={setActiveTab} />}
                {activeTab === 'network' && <NetworkScreen onNavigate={setActiveTab} />}
                {activeTab === 'aidmc' && <div className="p-4 bg-white min-h-full"><AiDmcScreen /></div>}
                {activeTab === 'membership' && <div className="p-4 bg-white min-h-full"><MembershipScreen onNavigate={setActiveTab} /></div>}
                {activeTab === 'catalog' && <CatalogScreen onNavigate={setActiveTab} viewMode="PACKAGE" />}
                {activeTab === 'mymusic' && <CatalogScreen onNavigate={setActiveTab} viewMode="MY_MUSIC" />}
              </div>

              {/* Bottom Nav docked cleanly */}
              <BottomNavigation 
                currentTab={activeTab === 'membership' || activeTab === 'catalog' || activeTab === 'mymusic' ? 'musichub' : activeTab} 
                onSelectTab={setActiveTab} 
                isInsideFrame={true}
              />
            </div>
          </div>
        ) : (
          /* Full Responsive Screen View */
          <div className="pb-24 bg-white">
            {activeTab === 'home' && <HomeScreen onNavigate={setActiveTab} />}
            {activeTab === 'academy' && <AcademyScreen onNavigate={setActiveTab} />}
            {activeTab === 'musichub' && <CatalogScreen onNavigate={setActiveTab} viewMode="HUB" />}
            {activeTab === 'wallet' && <WalletScreen onNavigate={setActiveTab} />}
            {activeTab === 'network' && <NetworkScreen onNavigate={setActiveTab} />}
            {activeTab === 'aidmc' && <AiDmcScreen />}
            {activeTab === 'membership' && <MembershipScreen onNavigate={setActiveTab} />}
            {activeTab === 'catalog' && <CatalogScreen onNavigate={setActiveTab} viewMode="PACKAGE" />}
            {activeTab === 'mymusic' && <CatalogScreen onNavigate={setActiveTab} viewMode="MY_MUSIC" />}

            {/* Bottom Nav */}
            <BottomNavigation 
              currentTab={activeTab === 'membership' || activeTab === 'catalog' || activeTab === 'mymusic' ? 'musichub' : activeTab} 
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
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Footer / Authority Attribution */}
      <footer
        className={`border-t py-4 px-4 text-center text-[11px] ${
          isAdminMode
            ? 'border-slate-900 bg-slate-950 text-slate-400'
            : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <p>Digital Music Center (DMC Xayraxa) • Rev 2.6 Consolidated Specification</p>
        <p className="text-[10px] mt-0.5">
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
