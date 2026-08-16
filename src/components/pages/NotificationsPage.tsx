import React from 'react';
import { Bell, Lock, ShieldCheck, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between glass-card text-white p-6 rounded-3xl border border-white/20 shadow-glass-3d">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2 text-white">
            <Bell className="w-5 h-5 text-amber-400" />
            <span>پیام‌ها و اعلان‌های سیستم</span>
          </h1>
          <p className="text-xs text-slate-300 font-light mt-1">اطلاعیه‌های اتاق معامله، اعتبارسنجی اسناد و هشدارهای جدید</p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors underline cursor-pointer"
        >
          علامت‌گذاری همه به عنوان خوانده‌شده
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => n.linkTab && onNavigateTab(n.linkTab)}
            className={`p-4.5 rounded-3xl border transition-all cursor-pointer card-3d-tilt ${
              n.read
                ? 'glass-card border-white/10 text-slate-300 hover:border-white/25'
                : 'glass-amber border-amber-400/50 text-white font-medium shadow-glass-3d ring-1 ring-amber-400/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-xs text-white flex items-center gap-2">
                {!n.read && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                <span>{n.title}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">{n.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
