import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  Search, 
  UserCheck, 
  ChevronDown, 
  Sparkles,
  SlidersHorizontal,
  Lock,
  LineChart,
  User,
  Shield,
  Layers
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
  setSearchQuery: (q: string) => void;
}

const roleTitles: Record<UserRole, string> = {
  buyer: 'خریدار / سرمایه‌گذار',
  seller: 'مالک / فروشنده',
  agent: 'مشاور املاک امین',
  builder: 'سازنده / مجری',
  factory: 'کارخانه مصالح',
  materials_seller: 'فروشنده محلی',
  craftsman: 'استادکار / پیمانکار',
  admin: 'مدیریت ارشد (ادمین)',
};

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
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass-panel-dark border-b border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Line: Brand Logo, Role Switcher, Notification & Quick Actions */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo with 3D Bevel and Glow */}
          <div 
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_8px_20px_rgba(245,158,11,0.35)] group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 border border-white/40">
              <span className="drop-shadow-sm">آ</span>
              <span className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight drop-shadow-sm">آکــان</span>
                <span className="glass-emerald text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  اعتبارسنجی
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-light">اکوسیستم شیشه‌ای و ۳ بعدی ملک و مصالح</p>
            </div>
          </div>

          {/* Desktop Navigation Links with Glass Hover Pill */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <button 
              onClick={() => onNavigateTab('home')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all"
            >
              داشبورد
            </button>
            <button 
              onClick={() => onNavigateTab('market')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all"
            >
              بازار معاملات
            </button>
            <button 
              onClick={() => onNavigateTab('deal_room')} 
              className="px-3 py-1.5 rounded-xl glass-amber text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 font-bold shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              اتاق معامله
            </button>
            <button 
              onClick={() => onNavigateTab('rate_cutter')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-rose-300 transition-all"
            >
              نرخ‌شکن
            </button>
            <button 
              onClick={() => onNavigateTab('barter')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-blue-300 transition-all"
            >
              تهاتر تخصصی
            </button>
            <button 
              onClick={() => onNavigateTab('partnership')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-purple-300 transition-all"
            >
              مشارکت در ساخت
            </button>
            <button 
              onClick={() => onNavigateTab('materials')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-emerald-300 transition-all"
            >
              بازار مصالح
            </button>
            <button 
              onClick={() => onNavigateTab('craftsmen')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-white transition-all"
            >
              استادکاران
            </button>
            <button 
              onClick={() => onNavigateTab('price_data')} 
              className="px-3 py-1.5 rounded-xl hover:bg-white/10 hover:text-emerald-400 transition-all flex items-center gap-1"
            >
              <LineChart className="w-3.5 h-3.5 text-emerald-400" />
              دیتاسنتر قیمت
            </button>
          </nav>

          {/* Right Controls: Role Selector Pill & Notifications */}
          <div className="flex items-center gap-2">
            
            {/* Role Switcher Glass Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="glass-card hover:bg-white/15 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all text-slate-200 shadow-sm border border-white/20 active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-bold">{roleTitles[activeRole]}</span>
                <span className="sm:hidden font-bold">{roleTitles[activeRole].split('/')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown Glass Menu with 3D Depth */}
              {isRoleDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-60 glass-panel-dark border border-white/20 rounded-2xl shadow-glass-3d py-2 z-50 text-right animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl"
                  onClick={() => setIsRoleDropdownOpen(false)}
                >
                  <div className="px-3.5 py-1.5 border-b border-white/10 mb-1">
                    <p className="text-[11px] text-slate-400">تغییر نقش کاربری جهت تست پنل:</p>
                  </div>
                  {(Object.keys(roleTitles) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-all ${
                        activeRole === r ? 'text-amber-400 font-bold bg-amber-500/15' : 'text-slate-300'
                      }`}
                    >
                      <span>{roleTitles[r]}</span>
                      {r === 'admin' && (
                        <span className="glass-rose text-rose-300 text-[10px] px-1.5 py-0.5 rounded font-bold">ویژه</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Panel Direct Button (if Admin Role) */}
            {activeRole === 'admin' && (
              <button
                onClick={() => onNavigateTab('admin_panel')}
                className="glass-rose hover:brightness-110 text-white text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">پنل ادمین</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-300 hover:text-white glass-card hover:bg-white/15 rounded-xl transition-all border border-white/15 active:scale-95"
              aria-label="اعلان‌ها"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              )}
            </button>

          </div>

        </div>

        {/* Second Line: Search Bar with Glass Filter Pill */}
        <div className="mt-2.5 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی کد فایل (مثلاً AKN-9021)، شهر، منطقه، یا نوع مصالح..."
              className="w-full bg-slate-950/60 border border-white/15 text-white placeholder-slate-400 text-xs rounded-xl pl-3 pr-9 py-2.5 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 backdrop-blur-md transition-all shadow-inner"
            />
          </div>

          <button
            onClick={onOpenFilterSheet}
            className="glass-amber hover:brightness-110 text-amber-300 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 font-bold transition-all shrink-0 active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>فیلترها</span>
          </button>
        </div>

      </div>
    </header>
  );
};
