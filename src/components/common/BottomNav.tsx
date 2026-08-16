import React from 'react';
import { Home, Store, Lock, Bell, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeDealRoomsCount: number;
  unreadNotificationsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeDealRoomsCount,
  unreadNotificationsCount,
}) => {
  const tabs = [
    {
      id: 'home',
      label: 'خانه',
      icon: Home,
      badge: 0,
    },
    {
      id: 'market',
      label: 'بازار',
      icon: Store,
      badge: 0,
    },
    {
      id: 'deal_room',
      label: 'اتاق معامله',
      icon: Lock,
      badge: activeDealRoomsCount,
      badgeColor: 'glass-amber text-amber-300 font-black border border-amber-400/50 shadow-sm',
    },
    {
      id: 'notifications',
      label: 'پیام‌ها',
      icon: Bell,
      badge: unreadNotificationsCount,
      badgeColor: 'glass-rose text-rose-200 font-bold border border-rose-400/50 shadow-sm',
    },
    {
      id: 'profile',
      label: 'پروفایل من',
      icon: User,
      badge: 0,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass-panel-dark rounded-2xl border border-white/20 shadow-glass-3d pb-safe backdrop-blur-2xl">
      <div className="flex items-center justify-around h-15 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 ${
                isActive ? 'text-amber-400 font-extrabold -translate-y-1 scale-105' : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'stroke-2'}`} />
                {tab.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-3 min-w-4 h-4 px-1 rounded-full text-[9px] flex items-center justify-center ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-0.5 shadow-[0_0_6px_rgba(245,158,11,1)] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
