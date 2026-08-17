import React from 'react';
import { User, UserRole } from '../../types';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Award, 
  Phone, 
  MapPin, 
  Download, 
  ChevronLeft, 
  LogOut,
  UserCheck,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { toPersianDigits } from '../../utils/formatters';

interface ProfilePageProps {
  currentUser: User;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNavigateTab: (tab: string) => void;
}

const roleTitles: Record<UserRole, string> = {
  buyer: 'خریدار / سرمایه‌گذار',
  seller: 'مالک / فروشنده',
  tenant: 'مستأجر / رهن و اجاره',
  agent: 'مشاور املاک امین',
  builder: 'سازنده / مجری',
  mine_owner: 'معدن‌دار / تأمین سنگ و کانی',
  factory: 'کارخانه مصالح',
  materials_seller: 'فروشنده محلی',
  craftsman: 'استادکار / پیمانکار',
  admin: 'مدیریت ارشد (ادمین)',
};

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Profile Header */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-white/20 space-y-4 shadow-glass-3d relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-80 h-80 ambient-glow-amber rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shrink-0 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">{currentUser.name}</h1>
              {currentUser.verified && (
                <span className="glass-emerald text-emerald-300 text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-black flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>احراز هویت شده</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-mono dir-ltr text-right">{currentUser.phone}</p>
            <p className="text-xs text-slate-300 font-light mt-1">{currentUser.bio}</p>
          </div>
        </div>

        <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-medium">امتیاز اعتباری معاملات:</span>
            <span className="font-black text-amber-400 text-base">{toPersianDigits(currentUser.creditScore)} از ۱۰،۰۰۰</span>
          </div>
          <span className="glass-amber text-amber-300 px-3.5 py-1 rounded-xl border border-amber-400/40 font-black shadow-sm">
            {currentUser.badgeTitle}
          </span>
        </div>
      </div>

      {/* Role Switcher Section with 3D Tactile Buttons */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 shadow-glass-3d space-y-3.5">
        <h2 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>تغییر نقش کاربری فعال (محیط تست دمو)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {(Object.keys(roleTitles) as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`p-3 rounded-2xl border font-black transition-all text-center card-3d-tilt cursor-pointer ${
                activeRole === r
                  ? 'btn-3d-amber text-slate-950 border-amber-300/50 shadow-lg scale-105'
                  : 'glass-panel-dark text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {roleTitles[r]}
            </button>
          ))}
        </div>
      </div>

      {/* PWA Mobile App Download Prompt with 3D Visual */}
      <div className="glass-amber text-white p-5 rounded-3xl border border-amber-400/50 shadow-glass-3d flex items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-300" />
            <h3 className="font-black text-sm text-white">نصب اپلیکیشن وب آکان (PWA)</h3>
          </div>
          <p className="text-xs font-light text-slate-200">دسترسی فوق‌العاده سریع، آفلاین و بدون واسطه با رابط اندرویدی</p>
        </div>

        <button
          onClick={() => alert('اپلیکیشن آکان آماده افزودن به صفحه اصلی (Home Screen) می‌باشد.')}
          className="btn-3d-amber text-slate-950 font-black px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shrink-0 cursor-pointer border border-amber-300/40"
        >
          <Download className="w-4 h-4" />
          <span>نصب برنامه</span>
        </button>
      </div>

      {/* Navigation Quick Links */}
      <div className="glass-card rounded-3xl border border-white/15 divide-y divide-white/10 shadow-glass-3d overflow-hidden text-xs">
        <button
          onClick={() => onNavigateTab('role_dashboard')}
          className="w-full p-4.5 flex items-center justify-between hover:bg-white/10 transition-colors text-white font-extrabold cursor-pointer"
        >
          <span>داشبورد اختصاصی نقش ({roleTitles[activeRole]})</span>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigateTab('deal_room')}
          className="w-full p-4.5 flex items-center justify-between hover:bg-white/10 transition-colors text-white font-extrabold cursor-pointer"
        >
          <span>اتاق معامله‌های محرمانه من</span>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onNavigateTab('price_data')}
          className="w-full p-4.5 flex items-center justify-between hover:bg-white/10 transition-colors text-white font-extrabold cursor-pointer"
        >
          <span>استعلام قیمت‌های منطقه‌ای</span>
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>
      </div>

    </div>
  );
};
