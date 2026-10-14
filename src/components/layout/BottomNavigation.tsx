/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * COLORFUL BOTTOM NAVIGATION (Matching Mobile Spec Screenshot)
 * 01 Home (Red) • 02 Academy (Blue) • 03 Music Hub (Sky Blue) • 04 Wallet (Teal) • 05 Network (Purple) • 06 AI DMC (Cobalt)
 */

import React from 'react';
import { useDmc } from '../../context/DmcContext';
import { 
  Home, 
  BookOpen, 
  Music, 
  Wallet, 
  Share2, 
  Sparkles,
} from 'lucide-react';

export type MainNavTab = 'home' | 'academy' | 'musichub' | 'wallet' | 'network' | 'aidmc';

interface BottomNavigationProps {
  currentTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  isInsideFrame?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  currentTab, 
  onSelectTab,
  isInsideFrame = false
}) => {
  const { language } = useDmc();

  const labels = {
    en: {
      home: 'Home',
      academy: 'Academy',
      musichub: 'Music Hub',
      wallet: 'Wallet',
      network: 'Network',
      aidmc: 'AI DMC',
    },
    lo: {
      home: 'ໜ້າຫຼັກ',
      academy: 'ອາຄາເດມີ',
      musichub: 'ສູນເພງ',
      wallet: 'ກະເປົາເງິນ',
      network: 'ສາຍງານ',
      aidmc: 'AI DMC',
    },
    th: {
      home: 'หน้าหลัก',
      academy: 'อะคาเดมี่',
      musichub: 'ศูนย์เพลง',
      wallet: 'กระเป๋าเงิน',
      network: 'สายงาน',
      aidmc: 'AI DMC',
    },
    vi: {
      home: 'Trang chủ',
      academy: 'Học viện',
      musichub: 'Nhạc số',
      wallet: 'Ví tiền',
      network: 'Mạng lưới',
      aidmc: 'AI DMC',
    },
    zh: {
      home: '首页',
      academy: '音乐学院',
      musichub: '音乐中心',
      wallet: '财务钱包',
      network: '团队网络',
      aidmc: 'AI 音乐',
    },
    ko: {
      home: '홈',
      academy: '아카데미',
      musichub: '뮤직 허브',
      wallet: '지갑',
      network: '네트워크',
      aidmc: 'AI DMC',
    },
  }[language];

  const navItems: { 
    id: MainNavTab; 
    label: string; 
    icon: any; 
    color: string;
    activeBg: string;
    textColor: string;
  }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: Home,
      color: '#df1c2d',
      activeBg: 'bg-red-50',
      textColor: 'text-[#df1c2d]',
    },
    {
      id: 'academy',
      label: labels.academy,
      icon: BookOpen,
      color: '#1268e8',
      activeBg: 'bg-blue-50',
      textColor: 'text-[#1268e8]',
    },
    {
      id: 'musichub',
      label: labels.musichub,
      icon: Music,
      color: '#0088ff',
      activeBg: 'bg-sky-50',
      textColor: 'text-[#0088ff]',
    },
    {
      id: 'wallet',
      label: labels.wallet,
      icon: Wallet,
      color: '#13a8c7',
      activeBg: 'bg-cyan-50',
      textColor: 'text-[#13a8c7]',
    },
    {
      id: 'network',
      label: labels.network,
      icon: Share2,
      color: '#582ab8',
      activeBg: 'bg-purple-50',
      textColor: 'text-[#582ab8]',
    },
    {
      id: 'aidmc',
      label: labels.aidmc,
      icon: Sparkles,
      color: '#0c4bb2',
      activeBg: 'bg-indigo-50',
      textColor: 'text-[#0c4bb2]',
    },
  ];

  const containerClasses = isInsideFrame 
    ? 'sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]' 
    : 'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]';

  return (
    <nav className={containerClasses}>
      <div className="max-w-md mx-auto px-1.5 py-1.5 flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? `${item.textColor} font-bold scale-[1.02]`
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div 
                className={`p-1 rounded-xl transition-all relative ${
                  isActive ? item.activeBg : ''
                }`}
                style={isActive ? { color: item.color } : undefined}
              >
                <Icon 
                  className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`}
                  style={{ color: isActive ? item.color : undefined }}
                />
                {item.id === 'aidmc' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </div>
              <span 
                className={`text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[56px] ${
                  isActive ? 'font-bold' : ''
                }`}
                style={{ color: isActive ? item.color : undefined }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
