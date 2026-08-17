import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Calculator, 
  Send, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  User, 
  Phone,
  Scale,
  Sparkles,
  Layers,
  KeyRound
} from 'lucide-react';
import { DealRoom, DealRoomDocument } from '../../types';
import { formatToman, formatTomanShort, maskPhoneNumber, toPersianDigits } from '../../utils/formatters';

interface DealRoomPageProps {
  dealRooms: DealRoom[];
  onAdvanceStep?: (roomId: string) => void;
  onSendToAgent?: (roomId: string) => void;
}

export const DealRoomPage: React.FC<DealRoomPageProps> = ({
  dealRooms,
  onAdvanceStep,
  onSendToAgent,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(dealRooms[0]?.id || '');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<string[]>(dealRooms[0]?.confidentialNotes || []);
  const [showSentSuccess, setShowSentSuccess] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidSuccessMsg, setBidSuccessMsg] = useState<string | null>(null);

  const activeRoom = dealRooms.find((r) => r.id === selectedRoomId) || dealRooms[0];

  if (!activeRoom) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center space-y-4 border border-white/20 shadow-glass-3d">
        <div className="w-16 h-16 rounded-2xl glass-amber text-amber-400 mx-auto flex items-center justify-center border border-amber-400/40 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-base font-extrabold text-white">اتاق معامله فعال یافت نشد</h2>
        <p className="text-xs text-slate-400">از طریق بازار ملک می‌توانید وارد اتاق معامله محرمانه شوید.</p>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([`امروز - ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}: ${newNote}`, ...notes]);
    setNewNote('');
  };

  const handleSendToAgentClick = () => {
    if (onSendToAgent) onSendToAgent(activeRoom.id);
    setShowSentSuccess(true);
    setTimeout(() => setShowSentSuccess(false), 5000);
  };

  const handleSendInstantBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount.trim()) return;
    const bidMsg = `پیشنهاد مالی جدید (${bidAmount} تومان) به صورت رمزنگاری‌شده در جریان زنده اتاق معامله ثبت و به اطلاع طرفین رسید.`;
    setNotes([`لحظاتی پیش: ${bidMsg}`, ...notes]);
    setBidSuccessMsg(`پیشنهاد رسمی ${bidAmount} با موفقیت ثبت شد.`);
    setBidAmount('');
    setTimeout(() => setBidSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner with High-Tech Glass & 3D Lighting */}
      <div className="glass-card text-white p-6 sm:p-7 rounded-3xl border border-white/20 space-y-3 relative overflow-hidden shadow-glass-3d">
        <div className="absolute top-0 -left-10 w-72 h-72 ambient-glow-amber rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-72 h-72 ambient-glow-emerald rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 glass-amber text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-bold mb-2 shadow-sm">
              <KeyRound className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>محیط محرمانه رمزنگاری‌شده ۲۵۶ بیتی (E2EE)</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
              اتاق معامله تخصصی و امن (Deal Room)
            </h1>
            <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
              مدیریت مرحله‌ای اسناد، کارشناسی قیمت، توافق‌نامه و ارجاع حقوقی به دفاتر املاک امین با ضمانت سلامت معامله
            </p>
          </div>

          <div className="glass-panel-dark p-3.5 rounded-2xl border border-white/15 text-xs space-y-1 shrink-0 card-3d-tilt">
            <p className="text-slate-400">شناسه امنیتی پرونده:</p>
            <p className="font-mono font-black text-amber-400 text-sm tracking-wider">{activeRoom.propertyCode}</p>
          </div>
        </div>
      </div>

      {/* Select active deal room tabs if multiple */}
      {dealRooms.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {dealRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoomId(room.id);
                setNotes(room.confidentialNotes);
              }}
              className={`px-4.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all card-3d-tilt ${
                selectedRoomId === room.id
                  ? 'glass-amber text-amber-300 border border-amber-400/50 shadow-glass-3d'
                  : 'glass-card text-slate-300 hover:text-white border border-white/15'
              }`}
            >
              {room.propertyTitle} ({room.propertyCode})
            </button>
          ))}
        </div>
      )}

      {/* 5-Step Pipeline Stepper with 3D Glass Cards */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>مراحل گام به گام معامله تا تنظیم سند رسمی</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {activeRoom.steps.map((step) => {
            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-2xl border transition-all card-3d-tilt flex flex-col justify-between ${
                  step.completed
                    ? 'glass-emerald border-emerald-400/50 text-emerald-100'
                    : step.active
                    ? 'glass-amber border-amber-400/70 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                    : 'glass-panel-dark border-white/10 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shadow-md ${
                      step.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : step.active
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                        : 'bg-white/10 text-slate-400'
                    }`}>
                      {step.completed ? <Check className="w-4 h-4 stroke-[3]" /> : toPersianDigits(step.stepNumber)}
                    </span>
                    
                    {step.active && (
                      <span className="text-[10px] glass-amber text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-400/50 animate-pulse">
                        گام جاری
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-xs mb-1 text-white">{step.title}</h3>
                  <p className="text-[10px] leading-relaxed opacity-85 text-slate-300">{step.description}</p>
                </div>
                
                {step.date && (
                  <span className="text-[9px] block mt-2.5 opacity-70 font-mono text-slate-400">{step.date}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Document Checklist & Price/Commission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Document Verification & Confidential Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Document Verification Checklist with Frosted Glass */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                  <span>اسناد، مدارک و استعلام‌های ثبتی</span>
                </h3>
                <p className="text-xs text-slate-400">مدارک احراز هویت، کاداستر و اسناد ثبتی طرفین</p>
              </div>

              <span className="text-xs glass-emerald text-emerald-300 font-bold px-3 py-1 rounded-xl border border-emerald-400/30">
                {toPersianDigits(activeRoom.documents.filter(d => d.verified).length)} از {toPersianDigits(activeRoom.documents.length)} تأیید شده
              </span>
            </div>

            <div className="space-y-2.5">
              {activeRoom.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-2xl glass-panel-dark border border-white/10 flex items-center justify-between gap-3 card-3d-tilt"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-card text-amber-400 flex items-center justify-center shrink-0 border border-white/15">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{doc.title}</h4>
                      <span className="text-[10px] text-slate-400">{doc.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.verified ? (
                      <span className="glass-emerald text-emerald-300 text-[11px] px-3 py-1 rounded-xl font-bold flex items-center gap-1 border border-emerald-400/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تأیید ثبتی شش‌دانگ</span>
                      </span>
                    ) : (
                      <span className="glass-amber text-amber-300 text-[11px] px-3 py-1 rounded-xl font-bold flex items-center gap-1 border border-amber-400/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>در حال استعلام</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidential Notes & Live Negotiations Log */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-4 shadow-glass-3d">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm flex items-center gap-2 text-white">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>مذاکرات و توافقات زنده طرفین (Live Negotiation)</span>
              </h3>
              <span className="text-[10px] glass-emerald text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                جریان زنده فعال
              </span>
            </div>

            {/* Instant Bid Submission Form */}
            <form onSubmit={handleSendInstantBid} className="p-3.5 rounded-2xl glass-panel-dark border border-amber-400/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  ارسال پیشنهاد قیمت یا شرط توافق جدید:
                </span>
                <span className="text-[10px] text-slate-400">ثبت آنی در کانال امن</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="مثال: ۴۹.۵ میلیارد تومان یا شروط پرداخت سه مرحله‌ای..."
                  className="flex-1 bg-slate-950/90 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="btn-3d-amber text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ارسال زنده</span>
                </button>
              </div>
              {bidSuccessMsg && (
                <div className="glass-emerald border border-emerald-400/50 p-2 rounded-xl text-[11px] text-emerald-200 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{bidSuccessMsg}</span>
                </div>
              )}
            </form>

            <div className="space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
              {notes.map((note, idx) => (
                <div key={idx} className="glass-panel-dark p-3.5 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed">
                  {note}
                </div>
              ))}
            </div>

            {/* Form to add note */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="ثبت یادداشت محرمانه تکمیلی..."
                className="flex-1 bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 backdrop-blur-md"
              />
              <button
                type="submit"
                className="glass-card hover:bg-white/20 text-white font-bold px-4.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (1 col): Parties, Valuation, Agency Referral & Commission */}
        <div className="space-y-6">
          
          {/* Parties Overview Box */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-3.5 shadow-glass-3d">
            <h3 className="font-extrabold text-xs text-white border-b border-white/10 pb-2.5">
              طرفین معامله و دفتر املاک امین
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl glass-panel-dark border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">خریدار / سرمایه‌گذار:</span>
                  <span className="font-bold text-white">{activeRoom.buyerName}</span>
                </div>
                <span className="font-mono text-slate-400 dir-ltr">{maskPhoneNumber(activeRoom.buyerPhone)}</span>
              </div>

              <div className="p-3 rounded-2xl glass-panel-dark border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">فروشنده / مالک:</span>
                  <span className="font-bold text-white">{activeRoom.sellerName}</span>
                </div>
                <span className="font-mono text-slate-400 dir-ltr">{maskPhoneNumber(activeRoom.sellerPhone)}</span>
              </div>

              <div className="p-3 rounded-2xl glass-amber border border-amber-400/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-300 block">دفتر املاک امین حقوقی:</span>
                  <span className="font-extrabold text-white">{activeRoom.assignedAgentAgency}</span>
                </div>
                <UserCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Valuation & Commission 3D Breakdown */}
          <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/15 space-y-3.5 shadow-glass-3d">
            <h3 className="font-extrabold text-xs text-white flex items-center gap-1.5 border-b border-white/10 pb-2.5">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>ارزیابی کارشناسی و برآورد کمیسیون</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">قیمت پیشنهادی مالک:</span>
                <span className="font-bold text-white">{formatTomanShort(activeRoom.propertyPrice)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">قیمت ارزیابی کارشناس:</span>
                <span className="font-black text-emerald-400">{formatTomanShort(activeRoom.expertAppraisalPrice)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-400">مبنای محاسبه کمیسیون (۰.۵٪):</span>
                <span className="font-black text-amber-400">{formatTomanShort(activeRoom.commissionEstimate)}</span>
              </div>
            </div>

            {/* Action Referral Button with 3D Emerald */}
            <button
              onClick={handleSendToAgentClick}
              className="w-full mt-3 btn-3d-emerald text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
            >
              <Send className="w-4 h-4" />
              <span>ارسال پیش‌نویس به دفتر املاک امین</span>
            </button>

            {showSentSuccess && (
              <div className="mt-3 p-3 glass-emerald border border-emerald-400/50 rounded-2xl text-xs text-emerald-200 font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>پیش‌نویس و مدارک اعتبارسنجی با موفقیت به کارگزاری املاک امین ارسال گردید.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
