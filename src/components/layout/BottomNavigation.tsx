/**
 * DMC XAYRAXA SUPER APP - REVISION 2.6
 * OFFICIAL 5-TAB BOTTOM NAVIGATION (Matching 01 HOME · 02 STORE · 03 ACADEMY · 04 NETWORK · 05 WALLET)
 */

import React from 'react';
import { useDmc } from '../../context/DmcContext';
import {
  Home,
  Store,
  GraduationCap,
  Users,
  Wallet,
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
  isInsideFrame = false,
}) => {
  const { language } = useDmc();

  const labels = {
    en: {
      home: 'Home',
      musichub: 'Store',
      academy: 'Academy',
      network: 'Network',
      wallet: 'Wallet',
    },
    lo: {
      home: 'ໜ້າຫຼັກ',
      musichub: 'ຮ້ານຄ້າ',
      academy: 'ອາຄາເດມີ',
      network: 'ສາຍງານ',
      wallet: 'ກະເປົາເງິນ',
    },
    th: {
      home: 'หน้าหลัก',
      musichub: 'ร้านค้า',
      academy: 'อะคาเดมี่',
      network: 'สายงาน',
      wallet: 'กระเป๋าเงิน',
    },
    vi: {
      home: 'Trang chủ',
      musichub: 'Cửa hàng',
      academy: 'Học viện',
      network: 'Mạng lưới',
      wallet: 'Ví tiền',
    },
    zh: {
      home: '首页',
      musichub: '音乐商城',
      academy: '音乐学院',
      network: '团队网络',
      wallet: '财务钱包',
    },
    ko: {
      home: '홈',
      musichub: '스토어',
      academy: '아카데미',
      network: '네트워크',
      wallet: '지갑',
    },
  }[language];

  const navItems: {
    id: MainNavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'home',
      label: labels.home,
      icon: Home,
    },
    {
      id: 'musichub',
      label: labels.musichub,
      icon: Store,
    },
    {
      id: 'academy',
      label: labels.academy,
      icon: GraduationCap,
    },
    {
      id: 'network',
      label: labels.network,
      icon: Users,
    },
    {
      id: 'wallet',
      label: labels.wallet,
      icon: Wallet,
    },
  ];

  const containerClasses = isInsideFrame
    ? 'sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
    : 'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]';

  return (
    <nav className={containerClasses}>
      <div className="max-w-md mx-auto px-2 py-1.5 grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[44px] ${
                isActive
                  ? 'text-[#850818] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive
                    ? 'text-[#850818] stroke-[2.4] scale-105'
                    : 'text-slate-500 stroke-[1.9]'
                }`}
              />
              <span
                className={`text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] whitespace-nowrap ${
                  isActive
                    ? 'font-extrabold text-[#850818]'
                    : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`h-0.5 rounded-full transition-all mt-0.5 ${
                  isActive ? 'w-5 bg-[#850818]' : 'w-0 bg-transparent'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

