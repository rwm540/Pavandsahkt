import React, { useState, useEffect } from 'react';
import { TrendingUp, LineChart as LineChartIcon, Calculator, MapPin, Search, ArrowUpRight, Sparkles, Activity, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PriceIndex } from '../../types';
import { mockPriceIndices } from '../../data/mockData';
import { formatToman, formatTomanShort, toPersianDigits } from '../../utils/formatters';

interface ChartPoint {
  month: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  isGreen?: boolean;
}

export const PriceDataCenterPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<PriceIndex>(mockPriceIndices[0]);
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  
  // Live real-time chart data state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [lastTickPrice, setLastTickPrice] = useState<number>(0);
  const [tickDirection, setTickDirection] = useState<'up' | 'down' | 'same'>('same');

  // Initialize and update chart data when selectedIndex changes
  useEffect(() => {
    const initial = selectedIndex.historicalChart.map((item, idx, arr) => {
      const base = item.price;
      const open = idx === 0 ? base * 0.98 : arr[idx - 1].price;
      const close = base;
      const high = Math.max(open, close) * 1.012;
      const low = Math.min(open, close) * 0.988;
      return {
        month: item.month,
        price: base,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        isGreen: close >= open,
      };
    });
    setChartData(initial);
    setLastTickPrice(initial[initial.length - 1].price);
  }, [selectedIndex]);

  // Live Real-Time Ticking Effect (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        if (prev.length === 0) return prev;
        const lastIdx = prev.length - 1;
        const currentLast = prev[lastIdx];
        
        // Random fluctuation between -0.25% and +0.3%
        const pct = (Math.random() * 0.55 - 0.23) / 100;
        const newPrice = Math.round(currentLast.price * (1 + pct));
        
        const direction = newPrice > currentLast.price ? 'up' : newPrice < currentLast.price ? 'down' : 'same';
        setTickDirection(direction);
        setLastTickPrice(newPrice);

        const updated = [...prev];
        updated[lastIdx] = {
          ...currentLast,
          price: newPrice,
          close: newPrice,
          high: Math.max(currentLast.high || newPrice, newPrice * 1.004),
          low: Math.min(currentLast.low || newPrice, newPrice * 0.996),
          isGreen: newPrice >= (currentLast.open || newPrice),
        };
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Price Estimator state
  const [area, setArea] = useState<number>(120);
  const [year, setYear] = useState<number>(1402);
  const [floor, setFloor] = useState<number>(3);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const handleEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const basePerMeter = lastTickPrice || selectedIndex.avgPricePerMeter;
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

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-emerald text-emerald-200 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-black mb-2 shadow-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>دیتاسنتر و شاخص رسمی قیمت مسکن</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">نمودار روند قیمت و تخمین هوشمند ارزش ملک</h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              داده‌های ثبت‌شده بر اساس معاملات قطعی اعتبارسنجی‌شده آکان و اتصال به دیتابیس ثبت اسناد و املاک کشور.
            </p>
          </div>

          {/* Live Real-Time Badge */}
          <div className="glass-panel-dark px-4 py-2.5 rounded-2xl border border-emerald-400/40 flex items-center gap-2.5 shrink-0 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">فید زنده معاملات (Websocket)</span>
              <span className="text-xs font-bold text-emerald-300 font-mono">
                {formatTomanShort(lastTickPrice)} / متر
              </span>
            </div>
          </div>
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
            className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt cursor-pointer ${
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>روند ۱۲ ماهه قیمت هر متر (تومان) - {selectedIndex.city} ({selectedIndex.district})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedIndex.propertyType} • آپدیت زنده آنی</p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Chart Type Switcher: Line vs Candlestick */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-white/15 flex items-center gap-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span>نمودار خطی</span>
              </button>

              <button
                onClick={() => setChartType('candlestick')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  chartType === 'candlestick'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>کندل‌استیک زنده</span>
              </button>
            </div>

            <span className={`glass-emerald text-emerald-300 font-black px-3 py-1.5 rounded-xl flex items-center gap-1 border border-emerald-400/40 shadow-sm transition-all ${
              tickDirection === 'up' ? 'ring-2 ring-emerald-400 scale-105' : tickDirection === 'down' ? 'ring-2 ring-rose-400 scale-105' : ''
            }`}>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              <span>+{toPersianDigits(selectedIndex.change30dPercent)}٪</span>
            </span>
          </div>
        </div>

        {/* Chart View Area */}
        <div className="h-72 w-full pt-2">
          {chartType === 'line' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)} م`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`${formatTomanShort(Number(val))}`, 'قیمت لحظه‌ای']}
                  labelStyle={{ fontWeight: 'bold', color: '#ffffff' }}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#34d399"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#34d399', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 8, fill: '#fbbf24', stroke: '#0f172a' }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            /* Custom Interactive Candlestick Chart View */
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 pb-1 border-b border-white/10">
                <span>ماه / دوره</span>
                <span className="flex items-center gap-4">
                  <span className="text-emerald-400 font-bold">■ صعودی (Bullish)</span>
                  <span className="text-rose-400 font-bold">■ نزولی (Bearish)</span>
                  <span className="text-amber-400 font-bold">● آخرین قیمت لحظه‌ای</span>
                </span>
              </div>

              <div className="grid grid-cols-5 gap-3 h-52 items-end pt-4 px-2">
                {chartData.map((item, index) => {
                  const isGreen = item.isGreen;
                  const colorClass = isGreen ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
                  const wickColor = isGreen ? 'bg-emerald-400' : 'bg-rose-400';
                  
                  // Calculate relative height percentage for visual representation
                  const minP = Math.min(...chartData.map(d => d.low || d.price)) * 0.95;
                  const maxP = Math.max(...chartData.map(d => d.high || d.price)) * 1.02;
                  const range = maxP - minP || 1;
                  
                  const bodyTop = Math.max(item.open || item.price, item.close || item.price);
                  const bodyBottom = Math.min(item.open || item.price, item.close || item.price);
                  
                  const heightPercent = Math.max(15, Math.min(85, ((bodyTop - bodyBottom) / range) * 100));
                  const bottomPercent = Math.max(5, Math.min(80, ((bodyBottom - minP) / range) * 100));

                  return (
                    <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 border border-white/20 px-3 py-1.5 rounded-xl shadow-2xl z-30 pointer-events-none text-right whitespace-nowrap">
                        <p className="text-[10px] font-bold text-amber-300">{item.month} ۱۴۰۳</p>
                        <p className="text-[10px] text-white">بسته: {formatTomanShort(item.close || item.price)}</p>
                        <p className="text-[9px] text-slate-400">بالا: {formatTomanShort(item.high || item.price)} | پایین: {formatTomanShort(item.low || item.price)}</p>
                      </div>

                      {/* Wick (High-Low Line) */}
                      <div className={`w-0.5 h-full absolute ${wickColor} opacity-70`} />

                      {/* Candlestick Body (Open-Close) */}
                      <div 
                        style={{ height: `${heightPercent}%`, bottom: `${bottomPercent}%` }}
                        className={`w-10 sm:w-14 rounded-lg absolute ${colorClass} border border-white/30 flex flex-col items-center justify-center transition-all group-hover:scale-105`}
                      >
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-950 font-mono drop-shadow-sm">
                          {(selectedIndex.avgPricePerMeter / 1000000).toFixed(0)}م
                        </span>
                      </div>

                      {/* Month Label */}
                      <span className="text-[11px] font-bold text-slate-300 mt-2 z-10 bg-slate-900/80 px-2 py-0.5 rounded-md border border-white/10">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="text-center pt-2 text-[10px] text-emerald-400 font-mono">
                ⚡ ریل‌تایم: قیمت‌ها به صورت زنده از بازار مسکن آپدیت می‌شوند.
              </div>
            </div>
          )}
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
