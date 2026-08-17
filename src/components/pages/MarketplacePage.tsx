import React, { useState, useRef } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Percent, 
  RefreshCw, 
  Handshake, 
  SlidersHorizontal,
  Search,
  Filter,
  Sparkles,
  KeyRound,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Property, DealType } from '../../types';
import { formatTomanShort, getVerificationBadgeColor, getVerificationBadgeText, toPersianDigits } from '../../utils/formatters';

interface MarketplacePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onEnterDealRoom: (propertyCode: string) => void;
  searchQuery: string;
  onOpenFilterSheet: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  properties,
  onSelectProperty,
  onEnterDealRoom,
  searchQuery,
  onOpenFilterSheet,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'rent' | 'sale' | 'rate_cutter' | 'barter' | 'partnership'>('all');
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const handleScrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      tabsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchDistrict = p.district.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchCity && !matchDistrict) return false;
    }

    if (activeTab === 'rent') return p.dealType === 'rent';
    if (activeTab === 'rate_cutter') return p.isRateCutter;
    if (activeTab === 'barter') return p.dealType === 'barter';
    if (activeTab === 'partnership') return p.dealType === 'partnership';
    if (activeTab === 'sale') return p.dealType === 'sale';

    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-white/20 space-y-2 shadow-glass-3d relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-64 h-64 ambient-glow-amber rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">بازار فایل‌های اعتبارسنجی‌شده پیوند ساخت</h1>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              فهرست املاک مسکونی، تجاری و رهن و اجاره سالم دارای استعلام ثبتی، کارشناسی قیمت و تضمین حقوقی معامله
            </p>
          </div>
        </div>
      </div>

      {/* 3D Frosted Filter Tabs Bar with Horizontal Scroll Navigation */}
      <div className="relative flex items-center group/tabs">
        {/* Right Scroll Arrow for Desktop (RTL) */}
        <button
          onClick={() => handleScrollTabs('right')}
          className="hidden md:flex absolute right-0 z-10 w-7 h-9 items-center justify-center bg-slate-900/90 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-r-2xl border border-white/15 shadow-md backdrop-blur-md opacity-0 group-hover/tabs:opacity-100 transition-opacity"
          title="پیمایش به راست"
          aria-label="پیمایش راست"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div 
          ref={tabsScrollRef}
          className="w-full flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x pb-1 px-0.5 cursor-grab active:cursor-grabbing"
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt ${
              activeTab === 'all'
                ? 'glass-panel-dark text-white border border-white/30 shadow-glass-3d'
                : 'glass-card text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            همه فایل‌ها ({toPersianDigits(properties.length)})
          </button>

          <button
            onClick={() => setActiveTab('rent')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all card-3d-tilt ${
              activeTab === 'rent'
                ? 'glass-emerald text-white border border-emerald-400/50 shadow-glass-3d'
                : 'glass-card text-emerald-300 hover:text-emerald-200 border border-white/10'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>رهن و اجاره ({toPersianDigits(properties.filter(p => p.dealType === 'rent').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('sale')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all card-3d-tilt ${
              activeTab === 'sale'
                ? 'glass-amber text-amber-200 border border-amber-400/50 shadow-glass-3d'
                : 'glass-card text-amber-300 hover:text-amber-200 border border-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>فروش قطعی ({toPersianDigits(properties.filter(p => p.dealType === 'sale').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('rate_cutter')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all card-3d-tilt ${
              activeTab === 'rate_cutter'
                ? 'glass-rose text-white border border-rose-400/50 shadow-glass-3d'
                : 'glass-card text-rose-300 hover:text-rose-200 border border-white/10'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>فروش فوری / نرخ‌شکن ({toPersianDigits(properties.filter(p => p.isRateCutter).length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('barter')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all card-3d-tilt ${
              activeTab === 'barter'
                ? 'glass-blue text-white border border-blue-400/50 shadow-glass-3d'
                : 'glass-card text-blue-300 hover:text-blue-200 border border-white/10'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تهاتر ملک و مصالح ({toPersianDigits(properties.filter(p => p.dealType === 'barter').length)})</span>
          </button>

          <button
            onClick={() => setActiveTab('partnership')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all card-3d-tilt ${
              activeTab === 'partnership'
                ? 'glass-purple text-white border border-purple-400/50 shadow-glass-3d'
                : 'glass-card text-purple-300 hover:text-purple-200 border border-white/10'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>مشارکت در ساخت ({toPersianDigits(properties.filter(p => p.dealType === 'partnership').length)})</span>
          </button>
        </div>

        {/* Left Scroll Arrow for Desktop (RTL) */}
        <button
          onClick={() => handleScrollTabs('left')}
          className="hidden md:flex absolute left-0 z-10 w-7 h-9 items-center justify-center bg-slate-900/90 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-l-2xl border border-white/15 shadow-md backdrop-blur-md opacity-0 group-hover/tabs:opacity-100 transition-opacity"
          title="پیمایش به چپ"
          aria-label="پیمایش چپ"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Property Cards */}
      {filteredProperties.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center space-y-3 border border-white/15 shadow-glass-3d">
          <p className="text-slate-300 text-sm font-bold">هیچ فایلی با این مشخصات یافت نشد.</p>
          <p className="text-xs text-slate-400">عبارت جستجو یا فیلترها را تغییر دهید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => {
            const isRental = property.dealType === 'rent';

            return (
              <div
                key={property.id}
                className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-glass-3d card-3d-tilt flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-50 bg-slate-900 group overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <span className="absolute top-3 right-3 glass-panel-dark text-white text-[10px] px-2.5 py-1 rounded-xl font-mono font-bold border border-white/20">
                    {property.code}
                  </span>

                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <div className="glass-emerald text-emerald-300 border border-emerald-400/40 text-[10px] px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تأیید اصالت ثبتی</span>
                    </div>
                    {isRental && (
                      <span className="glass-emerald text-white text-[10px] px-2.5 py-0.5 rounded-lg font-black border border-emerald-400/60 shadow">
                        رهن و اجاره
                      </span>
                    )}
                  </div>

                  {property.isRateCutter && property.discountPercent && (
                    <span className="absolute bottom-3 right-3 glass-rose text-white text-[11px] px-3 py-1 rounded-xl font-black shadow-lg border border-rose-400/50">
                      %{toPersianDigits(property.discountPercent)} تخفیف ویژه
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4.5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{property.city} | {property.district}</span>
                      </div>
                      <span className="glass-panel-dark text-slate-300 px-2 py-0.5 rounded-lg text-[10px] font-medium border border-white/10">
                        {property.documentType}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-white line-clamp-2 leading-snug">
                      {property.title}
                    </h3>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 glass-panel-dark rounded-2xl p-2.5 text-center text-xs text-slate-300 font-medium border border-white/10">
                    <div>
                      <span className="block text-[10px] text-slate-400">متراژ</span>
                      <span className="text-white font-black">{toPersianDigits(property.area)} م‌م</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">اتاق</span>
                      <span className="text-white font-black">{toPersianDigits(property.rooms)} خواب</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">سال ساخت</span>
                      <span className="text-white font-black">{toPersianDigits(property.year)}</span>
                    </div>
                  </div>

                  {/* Price Row (Adapted for Rentals vs Sale) */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    {isRental && property.rentalDetails ? (
                      <>
                        <div>
                          <span className="text-[10px] text-slate-400 block">ودیعه (رهن)</span>
                          <span className="text-sm font-black text-emerald-400">{formatTomanShort(property.rentalDetails.deposit)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">اجاره ماهیانه</span>
                          <span className="text-xs font-bold text-amber-300">{formatTomanShort(property.rentalDetails.monthlyRent)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] text-slate-400 block">قیمت کارشناسی</span>
                          <span className="text-sm font-black text-amber-400">{formatTomanShort(property.price)}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">متری</span>
                          <span className="text-xs font-bold text-slate-300">{formatTomanShort(property.pricePerMeter)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="flex-1 glass-card hover:bg-white/20 text-white text-xs font-bold py-2.5 rounded-xl transition-all text-center border border-white/20 active:scale-95 cursor-pointer"
                    >
                      مشاهده جزییات
                    </button>
                    <button
                      onClick={() => onEnterDealRoom(property.code)}
                      className="flex-1 glass-amber hover:brightness-110 text-amber-300 text-xs font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm border border-amber-400/40 active:scale-95 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>ورود به معامله</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
