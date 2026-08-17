import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  Radio, 
  Bell, 
  ChevronDown, 
  Handshake, 
  RefreshCw, 
  Layers, 
  LineChart, 
  UserCheck, 
  Shield, 
  Sparkles,
  Lock,
  Flame,
  Hammer,
  KeyRound,
  Compass,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { UserRole, User as UserType } from '../../types';

interface HeaderProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentUser: UserType;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigateTab: (tab: string) => void;
  onOpenFilterSheet: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenLiveFeed?: () => void;
  isLiveActive?: boolean;
  onOpenMoreMenu?: () => void;
}

interface RoleConfig {
  id: UserRole;
  title: string;
  shortTitle: string;
  desc: string;
  badge: string;
  icon: React.ElementType;
  gradient: string;
  badgeBg: string;
}

const roleConfigs: RoleConfig[] = [
  {
    id: 'buyer',
    title: 'خریدار / سرمایه‌گذار',
    shortTitle: 'خریدار',
    desc: 'جستجو، پیشنهاد قیمت هوشمند و خرید ملک، کوپ سنگ یا مصالح ساختمانی',
    badge: 'سرمایه‌گذاری',
    icon: UserCheck,
    gradient: 'from-amber-500 to-amber-600',
    badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  },
  {
    id: 'seller',
    title: 'مالک / فروشنده',
    shortTitle: 'فروشنده',
    desc: 'ثبت و واگذاری فایل‌های ملکی و صنعتی با تایید کارگزاری رسمی امین',
    badge: 'فروش قطعی',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
  },
  {
    id: 'tenant',
    title: 'مستأجر / رهن و اجاره',
    shortTitle: 'مستأجر',
    desc: 'استعلام قراردادهای اجاره، ودیعه و فایل‌های رهن معتبر با کد پیگیری',
    badge: 'رهن و اجاره',
    icon: KeyRound,
    gradient: 'from-teal-500 to-cyan-600',
    badgeBg: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
  },
  {
    id: 'agent',
    title: 'مشاور املاک امین',
    shortTitle: 'کارگزار امین',
    desc: 'واسطه‌گری امن، نظارت بر قرارداد، مدیریت فایل‌ها و کارمزد قانونی',
    badge: 'کارگزاری امین',
    icon: ShieldCheck,
    gradient: 'from-blue-500 to-indigo-600',
    badgeBg: 'bg-blue-400/20 text-blue-300 border-blue-400/40',
  },
  {
    id: 'builder',
    title: 'سازنده / مجری طرح',
    shortTitle: 'سازنده و مجری',
    desc: 'مدیریت ساخت، مشارکت در ساخت، تامین پروژه و تهاتر با مصالح',
    badge: 'پروژه‌محور',
    icon: Compass,
    gradient: 'from-purple-500 to-violet-600',
    badgeBg: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
  },
  {
    id: 'mine_owner',
    title: 'معدن‌دار / تأمین سنگ و کانی',
    shortTitle: 'معدن‌دار',
    desc: 'تأمین مستقیم کوپ سنگ، تراورتن، مرمریت، گرانیت و مواد معدنی',
    badge: 'معدن و سنگ',
    icon: Layers,
    gradient: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/40',
  },
  {
    id: 'factory',
    title: 'کارخانه و تولیدکننده مصالح',
    shortTitle: 'کارخانه مصالح',
    desc: 'تولید و عرضه عمده آهن‌آلات، میلگرد، سیمان، بتن و فرآورده‌های بتنی',
    badge: 'تولیدکننده',
    icon: Building2,
    gradient: 'from-cyan-600 to-blue-600',
    badgeBg: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/40',
  },
  {
    id: 'materials_seller',
    title: 'فروشنده محلی و انباردار',
    shortTitle: 'فروشنده مصالح',
    desc: 'توزیع خرد و انبارداری منطقه‌ای انواع مصالح ساختمانی با تحویل فوری',
    badge: 'توزیع‌کننده',
    icon: RefreshCw,
    gradient: 'from-teal-600 to-emerald-600',
    badgeBg: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
  },
  {
    id: 'craftsman',
    title: 'استادکار / پیمانکار تخصصی',
    shortTitle: 'استادکار',
    desc: 'اجرای نازک‌کاری، سنگ‌کاری، نما، تأسیسات، برق و خدمات فنی ساختمان',
    badge: 'خدمات فنی',
    icon: Hammer,
    gradient: 'from-rose-500 to-pink-600',
    badgeBg: 'bg-rose-400/20 text-rose-300 border-rose-400/40',
  },
  {
    id: 'admin',
    title: 'مدیریت ارشد سامانه (ادمین)',
    shortTitle: 'ادمین سیستم',
    desc: 'نظارت عالی بر تراکنش‌ها، مانیتورینگ امنیتی و اعتبارسنجی اسناد',
    badge: 'دسترسی ویژه',
    icon: Shield,
    gradient: 'from-red-600 to-rose-700',
    badgeBg: 'bg-red-400/20 text-red-300 border-red-400/40',
  },
];

// Android Mobile Quick Services List with 3D Gradients and Icons
const quickServices = [
  {
    id: 'market',
    title: 'بازار املاک',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-[0_4px_14px_rgba(16,185,129,0.35)]',
    border: 'border-emerald-400/40',
    badge: null,
  },
  {
    id: 'deal_room',
    title: 'اتاق معامله',
    icon: Lock,
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-[0_4px_14px_rgba(245,158,11,0.4)]',
    border: 'border-amber-400/50',
    badge: 'VIP',
    badgeBg: 'bg-amber-400 text-slate-950',
  },
  {
    id: 'rate_cutter',
    title: 'نرخ‌شکن',
    icon: Flame,
    gradient: 'from-rose-500 to-red-600',
    shadow: 'shadow-[0_4px_14px_rgba(244,63,94,0.35)]',
    border: 'border-rose-400/40',
    badge: 'فوری',
    badgeBg: 'bg-rose-500 text-white',
  },
  {
    id: 'barter',
    title: 'تهاتر',
    icon: RefreshCw,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-[0_4px_14px_rgba(59,130,246,0.35)]',
    border: 'border-blue-400/40',
    badge: null,
  },
  {
    id: 'partnership',
    title: 'مشارکت',
    icon: Handshake,
    gradient: 'from-purple-500 to-violet-600',
    shadow: 'shadow-[0_4px_14px_rgba(168,85,247,0.35)]',
    border: 'border-purple-400/40',
    badge: null,
  },
  {
    id: 'materials',
    title: 'معادن و مصالح',
    icon: Layers,
    gradient: 'from-amber-600 to-yellow-600',
    shadow: 'shadow-[0_4px_14px_rgba(217,119,6,0.35)]',
    border: 'border-amber-400/40',
    badge: 'قیمت روز',
    badgeBg: 'bg-amber-500 text-slate-950 font-bold',
  },
  {
    id: 'craftsmen',
    title: 'استادکاران',
    icon: Hammer,
    gradient: 'from-teal-500 to-emerald-600',
    shadow: 'shadow-[0_4px_14px_rgba(20,184,166,0.35)]',
    border: 'border-teal-400/40',
    badge: null,
  },
  {
    id: 'price_data',
    title: 'دیتاسنتر',
    icon: LineChart,
    gradient: 'from-cyan-500 to-sky-600',
    shadow: 'shadow-[0_4px_14px_rgba(6,182,212,0.35)]',
    border: 'border-cyan-400/40',
    badge: null,
  },
];

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  currentUser,
  onOpenNotifications,
  unreadCount,
  onNavigateTab,
  onOpenFilterSheet,
  searchQuery,
  setSearchQuery,
  onOpenLiveFeed,
  isLiveActive = true,
  onOpenMoreMenu,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

  const activeRoleConfig = roleConfigs.find(r => r.id === activeRole) || roleConfigs[0];
  const ActiveRoleIcon = activeRoleConfig.icon;

  const handleScroll = (direction: 'left' | 'right') => {
    if (navScrollRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      navScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        
        {/* =========================================================================
            TOP ROW: Android App Bar (Logo + Title & Role + Live Pulse + Notifications)
           ========================================================================= */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo with Android 3D Squircle Icon */}
          <motion.div 
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-base sm:text-xl shadow-[0_8px_20px_rgba(245,158,11,0.35)] border border-white/40 group-hover:rotate-3 transition-transform duration-300">
              <span className="drop-shadow-sm">پ</span>
              <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-lg text-white tracking-tight drop-shadow-sm">
                  پیــوند سـاخت
                </span>
                <span className="glass-emerald text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold hidden sm:inline-flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  سامانه هوشمند
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-slate-400 font-light truncate max-w-[140px] sm:max-w-none">
                پورتفولیو املاک و زنجیره ساخت
              </p>
            </div>
          </motion.div>

          {/* Desktop Minimalist Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => onNavigateTab('home')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              داشبورد
            </button>
            <button 
              onClick={() => onNavigateTab('market')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              بازار املاک
            </button>
            <button 
              onClick={() => onNavigateTab('deal_room')} 
              className="px-3 py-1.5 rounded-xl glass-amber text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 font-extrabold shadow-sm border border-amber-400/40 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              اتاق معامله
            </button>
            
            {onOpenMoreMenu && (
              <button 
                onClick={onOpenMoreMenu}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-200 hover:text-amber-300 transition-all flex items-center gap-1.5 font-bold border border-white/10 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>همه بخش‌ها</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons & Role Pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            
            {/* Live Feed Stream Trigger Pill */}
            {onOpenLiveFeed && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onOpenLiveFeed}
                className="relative p-1.5 sm:p-2 text-amber-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl transition-all border border-amber-400/30 active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
                title="پالس و رویدادهای زنده بازار"
                aria-label="پالس زنده"
              >
                <Radio className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 ${isLiveActive ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline text-[11px] font-black text-amber-300">زنده</span>
                {isLiveActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </motion.button>
            )}

            {/* Notification Bell */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-xl transition-all border border-white/15 shadow-sm cursor-pointer"
              aria-label="اعلان‌ها"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              )}
            </motion.button>

            {/* Role Switcher Android Pill Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsRoleDropdownOpen(true)}
              className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 hover:to-amber-600/20 text-[11px] sm:text-xs px-2 sm:px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all text-amber-200 border border-amber-400/30 shadow-sm cursor-pointer select-none"
              title="تغییر نقش کاربری"
            >
              <ActiveRoleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-[10px] sm:text-xs truncate max-w-[70px] sm:max-w-none">
                {activeRoleConfig.shortTitle}
              </span>
              <ChevronDown className={`w-3 h-3 text-amber-300/70 transition-transform shrink-0 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>

          </div>

        </div>

        {/* =========================================================================
            MIDDLE ROW: Android Material 3 Search Bar with Quick Filter Button
           ========================================================================= */}
        <div className="mt-2 sm:mt-2.5 flex items-center gap-2">
          <div className="relative flex-1 group">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-amber-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کد فایل (PYS-9021)، شهر، رهن، کوپ معدن، یا مصالح..."
              className="w-full bg-slate-900/90 border border-white/15 text-white placeholder-slate-400 text-xs rounded-2xl pl-8 pr-10 py-2 sm:py-2.5 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 backdrop-blur-md transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full bg-white/10"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Trigger Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onOpenFilterSheet}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl flex items-center gap-1.5 font-bold transition-all shrink-0 border border-amber-400/40 shadow-sm cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>فیلترها</span>
          </motion.button>
        </div>

        {/* =========================================================================
            BOTTOM ROW: Android Native 3D Iconic Quick-Action Carousel
           ========================================================================= */}
        <div className="relative mt-2.5 flex items-center group/nav">
          {/* Scroll Right Trigger (Desktop) */}
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 z-10 w-6 h-10 items-center justify-center bg-slate-900/90 text-slate-300 hover:text-amber-400 rounded-r-xl border border-white/10 shadow-md backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity"
            title="پیمایش به راست"
            aria-label="پیمایش راست"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={navScrollRef}
            className="w-full flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-1 pt-0.5 touch-pan-x cursor-grab active:cursor-grabbing px-0.5"
          >
            {quickServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.id}
                  onClick={() => onNavigateTab(service.id)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-white/10 hover:border-amber-400/40 transition-all shrink-0 cursor-pointer shadow-sm group select-none"
                >
                  {/* Android 3D Icon Squircle */}
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr ${service.gradient} ${service.shadow} ${service.border} border flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-105`}>
                    <Icon className="w-3.5 h-3.5 drop-shadow-sm stroke-[2.2]" />
                  </div>

                  {/* Title & Badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-200 group-hover:text-white whitespace-nowrap">
                      {service.title}
                    </span>
                    {service.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${service.badgeBg}`}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}

            {/* "All Services" Android Action Pill */}
            {onOpenMoreMenu && (
              <motion.button
                onClick={onOpenMoreMenu}
                whileTap={{ scale: 0.9 }}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/25 to-amber-600/15 hover:from-amber-500/35 hover:to-amber-600/25 border border-amber-400/40 text-amber-300 transition-all shrink-0 cursor-pointer shadow-sm select-none"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.4)] flex items-center justify-center text-slate-950 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-black whitespace-nowrap">
                  همه خدمات
                </span>
              </motion.button>
            )}
          </div>

          {/* Scroll Left Trigger (Desktop) */}
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 z-10 w-6 h-10 items-center justify-center bg-slate-900/90 text-slate-300 hover:text-amber-400 rounded-l-xl border border-white/10 shadow-md backdrop-blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity"
            title="پیمایش به چپ"
            aria-label="پیمایش چپ"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* =========================================================================
          ROLE SELECTION: Mobile Top-to-Center Dropdown & Desktop Dropdown Menu
         ========================================================================= */}
      <AnimatePresence>
        {isRoleDropdownOpen && (
          <>
            {/* Backdrop for both mobile and desktop */}
            <div 
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" 
              onClick={() => setIsRoleDropdownOpen(false)} 
            />

            {/* Mobile View: Dropdown Animating from Top */}
            <div className="md:hidden fixed inset-0 z-50 flex items-start justify-center pt-16 px-3 pointer-events-none">
              <motion.div 
                initial={{ y: -40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -30, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="pointer-events-auto w-full max-w-sm bg-slate-900/98 border border-white/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 text-right overflow-hidden max-h-[72vh] flex flex-col backdrop-blur-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-white">انتخاب نقش و سطح دسترسی</h3>
                      <p className="text-[10px] text-slate-400 font-light">
                        تغییر نقش کاربری در سامانه
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsRoleDropdownOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* Roles List */}
                <div 
                  className="p-2.5 space-y-1.5 overflow-y-auto no-scrollbar max-h-[50vh] overscroll-contain touch-pan-y"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  {roleConfigs.map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = activeRole === role.id;

                    return (
                      <motion.div
                        key={role.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onRoleChange(role.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected 
                            ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-400/60 shadow-[0_4px_15px_rgba(245,158,11,0.2)]'
                            : 'bg-slate-950/40 hover:bg-slate-800/60 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${role.gradient} flex items-center justify-center text-white shadow-md border border-white/20 shrink-0`}>
                            <RoleIcon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[11px] sm:text-xs font-black ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                                {role.title}
                              </span>
                              <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold border ${role.badgeBg}`}>
                                {role.badge}
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                              {role.desc}
                            </p>
                          </div>
                        </div>

                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected 
                            ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(245,158,11,0.6)]' 
                            : 'border-slate-600 bg-transparent'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-2.5 bg-slate-950/60 border-t border-white/5 text-center shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">
                    نقش فعلی: <strong className="text-amber-300 font-bold">{activeRoleConfig.title}</strong>
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Desktop View: Anchored Dropdown Menu */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="hidden md:block absolute left-4 sm:left-6 top-16 w-80 bg-slate-900/95 border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 z-50 text-right backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                <p className="text-[11px] font-bold text-amber-300">تغییر نقش کاربری:</p>
                <span className="text-[10px] text-slate-400 font-mono">۱۰ نقش فعال</span>
              </div>
              <div className="max-h-72 overflow-y-auto no-scrollbar py-1">
                {roleConfigs.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = activeRole === role.id;

                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        onRoleChange(role.id);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer ${
                        isSelected ? 'text-amber-400 font-extrabold bg-amber-500/20 border-r-2 border-amber-400' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <RoleIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{role.title}</span>
                      </div>
                      {role.id === 'admin' && (
                        <span className="glass-rose text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-bold">ویژه</span>
                      )}
                      {role.id === 'mine_owner' && (
                        <span className="glass-amber text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">معدن</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
};

