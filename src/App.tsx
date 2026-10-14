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

function AppContent() {
  const { isAdminMode, isLoggedOut } = useDmc();
  const [activeTab, setActiveTab] = useState<MainNavTab | 'membership' | 'catalog'>('home');
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'desktop'>('mobile');
  const [showSpecDeck, setShowSpecDeck] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode] = useState<'MEMBER' | 'ADMIN' | 'RECOVERY' | 'REGISTER'>('MEMBER');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Main Navigation Header (Hidden on mobile when on Home screen since HomeScreen has its own full mobile header) */}
      <div className={!isAdminMode && activeTab === 'home' ? 'hidden md:block' : 'block'}>
        <Header deviceFrame={deviceFrame} setDeviceFrame={setDeviceFrame} />
      </div>

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-6xl w-full mx-auto ${
          !isAdminMode && deviceFrame === 'mobile'
            ? 'px-0 py-0 sm:px-4 sm:py-6'
            : 'px-4 py-6'
        }`}
      >
        {isAdminMode ? (
          <AdminPortal />
        ) : deviceFrame === 'mobile' ? (
          /* Mobile View (Full screen on mobile devices, Phone Frame Mockup on Desktop) */
          <div className="flex justify-center sm:py-2">
            <div className="w-full sm:max-w-[416px] bg-[#69030e] border-0 sm:border-[8px] sm:border-slate-800 rounded-none sm:rounded-[3rem] shadow-none sm:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] sm:ring-1 sm:ring-slate-600/40 relative min-h-screen sm:min-h-[820px] overflow-hidden flex flex-col justify-between">
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

              {/* Bottom Nav docked cleanly */}
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
