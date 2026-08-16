import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = 'max-h-[85vh]',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet panel with frosted glass */}
      <div 
        className={`relative w-full max-w-2xl glass-panel-dark rounded-t-3xl shadow-glass-3d border-t border-white/20 ${maxHeight} flex flex-col z-10 animate-in slide-in-from-bottom duration-300 pb-safe text-white`}
      >
        {/* Android drag handle indicator */}
        <div className="w-full flex justify-center py-2.5 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-white/30 rounded-full shadow-inner" />
        </div>

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-extrabold text-white text-base drop-shadow-sm">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 font-light mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-card hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors border border-white/20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sheet Content Scrollable */}
        <div className="p-5 overflow-y-auto space-y-4 no-scrollbar flex-1 text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};
