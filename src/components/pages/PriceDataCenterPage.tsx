import React, { useState } from 'react';
import { TrendingUp, LineChart as LineChartIcon, Calculator, MapPin, Search, ArrowUpRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceIndex } from '../../types';
import { mockPriceIndices } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

export const PriceDataCenterPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<PriceIndex>(mockPriceIndices[0]);
  
  // Price Estimator state
  const [area, setArea] = useState<number>(120);
  const [year, setYear] = useState<number>(1402);
  const [floor, setFloor] = useState<number>(3);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const basePerMeter = selectedIndex.avgPricePerMeter;
    const yearFactor = 1 - (1403 - year) * 0.015;
    const floorFactor = 1 + (floor - 1) * 0.01;
    const calculatedPerMeter = Math.round(basePerMeter * Math.max(0.7, yearFactor) * floorFactor);
    const total = calculatedPerMeter * area;
    setEstimatedPrice(total);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 glass-emerald text-emerald-200 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>دیتاسنتر و شاخص رسمی قیمت مسکن</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">نمودار روند قیمت و تخمین هوشمند ارزش ملک</h1>
          <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
            داده‌های ثبت‌شده بر اساس معاملات قطعی اعتبارسنجی‌شده آکان و اتصال به دیتابیس ثبت اسناد و املاک کشور.
          </p>
        </div>
      </div>

      {/* Region Selector Tabs */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {mockPriceIndices.map((idx) => (
          <button
            key={idx.id}
            onClick={() => {
              setSelectedIndex(idx);
              setEstimatedPrice(null);
            }}
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt ${
              selectedIndex.id === idx.id
                ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-glass-3d'
                : 'glass-card text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            {idx.city} - {idx.district}
          </button>
        ))}
      </div>

      {/* Main Chart 3D Glass Card */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3.5">
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-emerald-400" />
              <span>روند ۵ ماهه قیمت هر متر (تومان) - {selectedIndex.city} ({selectedIndex.district})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedIndex.propertyType}</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="glass-emerald text-emerald-300 font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-400/40 shadow-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪ تغییر ۳۰ روزه</span>
            </span>
          </div>
        </div>

        {/* Recharts Chart with Glass Glow Style */}
        <div className="h-68 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedIndex.historicalChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)} م`}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: any) => [`${formatTomanShort(Number(val))}`, 'قیمت هر متر']}
                labelStyle={{ fontWeight: 'bold', color: '#ffffff' }}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#34d399"
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#34d399', strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 8, fill: '#fbbf24', stroke: '#0f172a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Estimator Form with 3D Glass Inputs */}
      <div className="glass-panel-dark text-white p-6 rounded-3xl border border-white/20 space-y-4 shadow-glass-3d">
        <h3 className="font-extrabold text-sm flex items-center gap-2 text-amber-300 border-b border-white/10 pb-3">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>تخمین‌گر هوشمند قیمت ملک در منطقه انتخاب‌شده</span>
        </h3>

        <form onSubmit={handleEstimate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">متراژ ملک (مترمربع):</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">سال ساخت (شمسی):</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">طبقه:</label>
            <input
              type="number"
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="w-full btn-3d-amber text-slate-950 font-black py-3.5 rounded-2xl text-xs transition-all cursor-pointer border border-amber-300/50 shadow-lg"
            >
              محاسبه و ارزیابی تخمینی قیمت کارشناسی
            </button>
          </div>
        </form>

        {estimatedPrice !== null && (
          <div className="p-4.5 glass-card rounded-2xl border border-emerald-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">قیمت کل تخمینی بر اساس داده‌های کارشناسی:</span>
              <span className="text-lg font-black text-emerald-300">{formatTomanShort(estimatedPrice)}</span>
            </div>
            <button
              onClick={() => alert('درخواست کارشناسی حضوری ثبتی ثبت گردید.')}
              className="btn-3d-emerald text-white font-black px-4.5 py-2.5 rounded-xl text-xs cursor-pointer border border-emerald-300/40"
            >
              درخواست کارشناسی حضوری اسناد
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
