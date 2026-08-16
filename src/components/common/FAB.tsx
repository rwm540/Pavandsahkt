import React, { useState } from 'react';
import { Plus, Building2, Package, RefreshCw, Handshake, X, Sparkles } from 'lucide-react';

interface FABProps {
  onOpenRegisterProperty: () => void;
  onOpenMaterialQuote: () => void;
  onOpenBarterOffer: () => void;
  onOpenPartnership: () => void;
}

export const FAB: React.FC<FABProps> = ({
  onOpenRegisterProperty,
  onOpenMaterialQuote,
  onOpenBarterOffer,
  onOpenPartnership,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-22 left-4 md:bottom-8 md:left-8 z-40 flex flex-col items-start gap-2">
      {/* Expanded Quick Action Items with Glassmorphism */}
      {isOpen && (
        <div className="flex flex-col items-start gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenRegisterProperty();
            }}
            className="glass-panel-dark text-white hover:bg-white/20 text-xs py-2.5 px-4 rounded-2xl shadow-glass-3d border border-amber-500/40 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>ثبت فایل ملک جدید</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenMaterialQuote();
            }}
            className="glass-panel-dark text-white hover:bg-white/20 text-xs py-2.5 px-4 rounded-2xl shadow-glass-3d border border-emerald-500/40 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Package className="w-4 h-4 text-emerald-400" />
            <span>درخواست قیمت مصالح</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenBarterOffer();
            }}
            className="glass-panel-dark text-white hover:bg-white/20 text-xs py-2.5 px-4 rounded-2xl shadow-glass-3d border border-blue-500/40 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>ثبت پیشنهاد تهاتر</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenPartnership();
            }}
            className="glass-panel-dark text-white hover:bg-white/20 text-xs py-2.5 px-4 rounded-2xl shadow-glass-3d border border-purple-500/40 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Handshake className="w-4 h-4 text-purple-400" />
            <span>ثبت پروژه مشارکت</span>
          </button>

        </div>
      )}

      {/* Main Floating Trigger Button with 3D tactile feel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl btn-3d-amber text-slate-950 font-black shadow-[0_10px_25px_rgba(245,158,11,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-amber-300/60"
        aria-label="افزودن اقدام جدید"
      >
        {isOpen ? (
          <X className="w-7 h-7 stroke-[2.5]" />
        ) : (
          <Plus className="w-7 h-7 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
};
