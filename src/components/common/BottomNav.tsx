import React from 'react';
import { motion } from 'motion/react';
import { Home, Store, Lock, Bell, MoreHorizontal } from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeDealRoomsCount: number;
  unreadNotificationsCount: number;
  onOpenMoreMenu: () => void;
  isMoreMenuOpen?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeDealRoomsCount,
  unreadNotificationsCount,
  onOpenMoreMenu,
  isMoreMenuOpen = false,
}) => {
  const isCustomSectionActive = [
    'barter',
    'partnership',
    'materials',
    'craftsmen',
    'rate_cutter',
    'price_data',
    'role_dashboard',
    'admin_panel',
    'profile',
  ].includes(activeTab);

  const tabs = [
    {
      id: 'home',
      label: 'خانه',
      icon: Home,
      badge: 0,
      onClick: () => onTabChange('home'),
      isActive: activeTab === 'home' && !isMoreMenuOpen,
    },
    {
      id: 'market',
      label: 'بازار',
      icon: Store,
      badge: 0,
      onClick: () => onTabChange('market'),
      isActive: activeTab === 'market' && !isMoreMenuOpen,
    },
    {
      id: 'deal_room',
      label: 'اتاق معامله',
      icon: Lock,
      badge: activeDealRoomsCount,
      badgeColor: 'bg-amber-500 text-slate-950 font-black border border-amber-300 shadow-md',
      onClick: () => onTabChange('deal_room'),
      isActive: activeTab === 'deal_room' && !isMoreMenuOpen,
    },
    {
      id: 'notifications',
      label: 'پیام‌ها',
      icon: Bell,
      badge: unreadNotificationsCount,
      badgeColor: 'bg-rose-500 text-white font-bold border border-rose-300 shadow-md',
      onClick: () => onNavigateNotifications(),
      isActive: activeTab === 'notifications' && !isMoreMenuOpen,
    },
    {
      id: 'more',
      label: 'بیشتر',
      icon: MoreHorizontal,
      badge: 0,
      onClick: onOpenMoreMenu,
      isActive: isMoreMenuOpen || isCustomSectionActive,
    },
  ];

  const onNavigateNotifications = () => {
    onTabChange('notifications');
  };

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 max-w-lg mx-auto z-50 bg-slate-950/90 border border-white/20 ring-1 ring-white/10 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl px-2 py-1.5 transition-all duration-200">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <motion.button
              key={tab.id}
              onClick={tab.onClick}
              whileTap={{ scale: 0.88 }}
              className="relative flex-1 flex flex-col items-center justify-center py-1 group cursor-pointer select-none"
            >
              {/* Android M3 Active Rounded Pill Indicator with Motion Layout Physics */}
              <div className="relative px-4 py-1.5 rounded-full flex items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="activeAndroidBottomTabPill"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="absolute inset-0 bg-amber-400/25 border border-amber-400/50 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  />
                )}
                
                <Icon 
                  className={`w-5 h-5 relative z-10 transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-300 stroke-[2.5] scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]' 
                      : 'text-slate-400 group-hover:text-slate-200 stroke-2'
                  }`} 
                />
                
                {tab.badge > 0 && (
                  <span className={`absolute -top-1 -right-1 z-20 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center font-mono ${tab.badgeColor}`}>
                    {toPersianDigits(tab.badge)}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] sm:text-[11px] mt-0.5 font-bold tracking-tight transition-colors duration-200 ${
                isActive ? 'text-amber-300 font-black' : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

