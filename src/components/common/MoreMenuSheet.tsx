import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Handshake, 
  Layers, 
  Hammer, 
  Flame, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  Radio, 
  Bell, 
  Compass, 
  Lock,
  Headphones
} from 'lucide-react';
import { UserRole } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenLiveFeed: () => void;
  activeRole: UserRole;
  activeTab: string;
  unreadNotificationsCount: number;
}

export const MoreMenuSheet: React.FC<MoreMenuSheetProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenLiveFeed,
  activeRole,
  activeTab,
  unreadNotificationsCount,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'specialized' | 'tools'>('all');

  // Pure 3D Iconic App Grid Items
  const allIcons = [
    {
      id: 'barter',
      category: 'specialized',
      title: 'تهاتر هوشمند',
      subtitle: 'ملک و مصالح',
      icon: RefreshCw,
      gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      glow: 'shadow-[0_10px_25px_rgba(37,99,235,0.45)]',
      border: 'border-blue-400/60',
      badge: 'تخصصی',
      badgeBg: 'bg-blue-500 text-white',
    },
    {
      id: 'partnership',
      category: 'specialized',
      title: 'مشارکت ساخت',
      subtitle: 'قرارداد تیپ',
      icon: Handshake,
      gradient: 'from-purple-600 via-violet-600 to-indigo-500',
      glow: 'shadow-[0_10px_25px_rgba(147,51,234,0.45)]',
      border: 'border-purple-400/60',
      badge: 'تضمینی',
      badgeBg: 'bg-purple-500 text-white',
    },
    {
      id: 'materials',
      category: 'specialized',
      title: 'معادن و مصالح',
      subtitle: 'سنگ، آهن و بتن',
      icon: Layers,
      gradient: 'from-amber-500 via-orange-600 to-amber-700',
      glow: 'shadow-[0_10px_25px_rgba(245,158,11,0.45)]',
      border: 'border-amber-400/60',
      badge: 'قیمت روز',
      badgeBg: 'bg-amber-500 text-slate-950 font-black',
    },
    {
      id: 'rate_cutter',
      category: 'specialized',
      title: 'نرخ‌شکن فوری',
      subtitle: 'املاک زیر قیمت',
      icon: Flame,
      gradient: 'from-rose-600 via-red-600 to-pink-600',
      glow: 'shadow-[0_10px_25px_rgba(225,29,72,0.5)]',
      border: 'border-rose-400/60',
      badge: 'ویژه',
      badgeBg: 'bg-rose-500 text-white animate-pulse',
    },
    {
      id: 'craftsmen',
      category: 'specialized',
      title: 'استادکاران',
      subtitle: 'شبکه مجریان',
      icon: Hammer,
      gradient: 'from-emerald-600 via-teal-600 to-green-600',
      glow: 'shadow-[0_10px_25px_rgba(16,185,129,0.45)]',
      border: 'border-emerald-400/60',
      badge: 'سنجش مهارت',
      badgeBg: 'bg-emerald-500 text-white',
    },
    {
      id: 'price_data',
      category: 'specialized',
      title: 'دیتاسنتر قیمت',
      subtitle: 'روند رسمی معاملات',
      icon: TrendingUp,
      gradient: 'from-cyan-600 via-sky-600 to-blue-600',
      glow: 'shadow-[0_10px_25px_rgba(6,182,212,0.45)]',
      border: 'border-cyan-400/60',
      badge: 'اسناد قطعی',
      badgeBg: 'bg-cyan-500 text-slate-950',
    },
    {
      id: 'role_dashboard',
      category: 'tools',
      title: 'میز کار نقش',
      subtitle: 'داشبورد اختصاصی',
      icon: Compass,
      gradient: 'from-indigo-600 via-blue-700 to-slate-800',
      glow: 'shadow-[0_10px_25px_rgba(79,70,229,0.45)]',
      border: 'border-indigo-400/60',
      badge: 'داشبورد',
      badgeBg: 'bg-indigo-500 text-white',
    },
    {
      id: 'admin_panel',
      category: 'tools',
      title: 'استعلام تک‌برگ',
      subtitle: 'اعتبارسنجی سند',
      icon: ShieldCheck,
      gradient: 'from-amber-600 via-yellow-600 to-orange-700',
      glow: 'shadow-[0_10px_25px_rgba(217,119,6,0.45)]',
      border: 'border-yellow-400/60',
      badge: 'اصالت فایل',
      badgeBg: 'bg-yellow-500 text-slate-950 font-bold',
    },
    {
      id: 'live_feed_action',
      category: 'tools',
      title: 'استریم زنده',
      subtitle: 'پالس تالار معاملات',
      icon: Radio,
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      glow: 'shadow-[0_10px_25px_rgba(16,185,129,0.45)]',
      border: 'border-emerald-300/70',
      badge: 'LIVE',
      badgeBg: 'bg-emerald-500 text-slate-950 font-mono font-black',
    },
    {
      id: 'deal_room',
      category: 'tools',
      title: 'اتاق معامله',
      subtitle: 'جلسه محرمانه',
      icon: Lock,
      gradient: 'from-slate-700 via-slate-800 to-slate-950',
      glow: 'shadow-[0_10px_25px_rgba(15,23,42,0.7)]',
      border: 'border-amber-400/70',
      badge: 'رمزنگاری',
      badgeBg: 'bg-amber-400 text-slate-950 font-black',
    },
    {
      id: 'audio_analysis',
      category: 'tools',
      title: 'آنالیز صوتی هوشمند',
      subtitle: 'پیاده‌سازی فایل صوتی',
      icon: Headphones,
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      glow: 'shadow-[0_10px_25px_rgba(245,158,11,0.5)]',
      border: 'border-amber-400/80',
      badge: 'هوش مصنوعی',
      badgeBg: 'bg-amber-400 text-slate-950 font-black animate-pulse',
    },
    {
      id: 'notifications',
      category: 'tools',
      title: 'پیام‌ها و اعلان',
      subtitle: 'هشدارهای لحظه‌ای',
      icon: Bell,
      gradient: 'from-violet-600 via-purple-700 to-fuchsia-700',
      glow: 'shadow-[0_10px_25px_rgba(139,92,246,0.45)]',
      border: 'border-violet-400/60',
      badge: unreadNotificationsCount > 0 ? toPersianDigits(unreadNotificationsCount) : undefined,
      badgeBg: 'bg-rose-500 text-white font-mono font-bold',
    },
    {
      id: 'profile',
      category: 'tools',
      title: 'پروفایل من',
      subtitle: 'فایل‌ها و حساب',
      icon: User,
      gradient: 'from-slate-700 via-zinc-800 to-neutral-900',
      glow: 'shadow-[0_10px_25px_rgba(39,39,42,0.6)]',
      border: 'border-white/50',
      badge: 'کاربری',
      badgeBg: 'bg-slate-300 text-slate-950',
    },
  ];

  const displayedIcons = allIcons.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handleItemClick = (id: string) => {
    onClose();
    if (id === 'live_feed_action') {
      onOpenLiveFeed();
    } else {
      onNavigateTab(id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-auto">
          {/* Backdrop Dimmer with Smooth Liquid Blur */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Floating 3D Animated Card with Fluid Spring Physics */}
          <motion.div
            key="modal-card"
            initial={{ opacity: 0, y: 140, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0, 
              y: 110, 
              scale: 0.94, 
              transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } 
            }}
            transition={{ 
              type: "spring", 
              damping: 28, 
              stiffness: 340, 
              mass: 0.85 
            }}
            className="fixed bottom-20 left-3 right-3 max-w-lg mx-auto z-40 bg-slate-900/95 border border-white/20 ring-1 ring-white/10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col text-white overflow-hidden backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Amber Ambient Glow Line */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

            {/* Android Drag / Pull Handle */}
            <div 
              className="w-full flex justify-center pt-2.5 pb-1 cursor-pointer group" 
              onClick={onClose}
            >
              <motion.div 
                whileHover={{ scale: 1.15, backgroundColor: "rgba(245,158,11,0.8)" }}
                className="w-12 h-1.5 bg-white/30 rounded-full transition-all duration-200" 
              />
            </div>

            {/* Header with Title & Filter Chips */}
            <div className="px-4.5 pt-1.5 pb-2.5 border-b border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <motion.div 
                    initial={{ rotate: -30, scale: 0.7 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 450, damping: 20, delay: 0.05 }}
                    className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 font-black" />
                  </motion.div>
                  <div>
                    <h3 className="font-black text-white text-sm drop-shadow-sm">
                      منوی آیکونی سامانه‌ها و خدمات
                    </h3>
                    <p className="text-[10px] text-slate-400">انتخاب مستقیم بخش مورد نظر</p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.35)] font-extrabold scale-102'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  همه ({toPersianDigits(allIcons.length)})
                </button>
                <button
                  onClick={() => setFilterCategory('specialized')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === 'specialized'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.35)] font-extrabold scale-102'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  بازار و خدمات تخصصی
                </button>
                <button
                  onClick={() => setFilterCategory('tools')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterCategory === 'tools'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.35)] font-extrabold scale-102'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  پنل‌ها و ابزارها
                </button>
              </div>
            </div>

            {/* Pure 3D App Icon Launcher Grid with Smooth Stagger Transitions */}
            <div className="px-3.5 py-3.5 max-h-[58vh] overflow-y-auto no-scrollbar">
              <motion.div 
                layout 
                className="grid grid-cols-4 gap-x-2 gap-y-3.5"
              >
                {displayedIcons.map((item, index) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.65, y: 22 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        damping: 22, 
                        stiffness: 350, 
                        delay: 0.03 + index * 0.02 
                      }}
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.86 }}
                      onClick={() => handleItemClick(item.id)}
                      className="flex flex-col items-center group cursor-pointer select-none focus:outline-none"
                    >
                      {/* 3D Glass Squircle Icon Container */}
                      <div className="relative">
                        <div 
                          className={`w-13 h-13 sm:w-15 sm:h-15 rounded-[20px] bg-gradient-to-br ${item.gradient} border ${item.border} ${item.glow} flex items-center justify-center transition-all duration-200 group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)] ${
                            isCurrent ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105' : ''
                          }`}
                        >
                          {/* Glass glare highlight */}
                          <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/35 via-transparent to-black/25 pointer-events-none" />
                          
                          <Icon className="w-6 h-6 text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.6)] stroke-[2.2]" />
                        </div>

                        {/* Corner badge if present */}
                        {item.badge && (
                          <span className={`absolute -top-1.5 -right-1 text-[8px] px-1.5 py-0.2 rounded-full font-black shadow-md border border-white/30 scale-90 ${item.badgeBg}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <span className={`text-[10.5px] font-extrabold mt-1.5 text-center transition-colors line-clamp-1 ${
                        isCurrent ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {item.title}
                      </span>
                      <span className="text-[8px] text-slate-400 text-center font-light line-clamp-1">
                        {item.subtitle}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
