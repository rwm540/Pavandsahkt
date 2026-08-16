import React, { useState } from 'react';
import { BottomSheetModal } from '../common/BottomSheetModal';
import { Property, DealType, PropertyType } from '../../types';
import { Building2, ShieldCheck, Check, Send, Sparkles } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'property' | 'material_quote' | 'barter' | 'partnership';
  onSubmitProperty?: (newProp: Partial<Property>) => void;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmitProperty,
}) => {
  const [step, setStep] = useState(1);

  // Form states for Property
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('تهران');
  const [district, setDistrict] = useState('سعادت‌آباد');
  const [price, setPrice] = useState('34000000000');
  const [area, setArea] = useState('180');
  const [rooms, setRooms] = useState('3');
  const [dealType, setDealType] = useState<DealType>('sale');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitProperty) {
      onSubmitProperty({
        title: title || 'آپارتمان نوساز اعتبارسنجی‌شده',
        city,
        district,
        price: Number(price),
        pricePerMeter: Math.round(Number(price) / (Number(area) || 1)),
        area: Number(area),
        rooms: Number(rooms),
        dealType,
        propertyType: 'apartment',
        verifiedStatus: 'pending',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
        features: ['مستر‌روم', 'پارکینگ سندی', 'انباری'],
        description: 'توضیحات ملک ثبت‌شده توسط کاربر جهت اعتبارسنجی حقوقی.',
        ownerName: 'کاربر جاری',
        ownerPhone: '09121112233',
        documentType: 'سند تک‌برگ شش‌دانگ',
        createdAt: 'امروز',
        rating: 5,
        viewsCount: 12,
      });
    }
    alert('ثبت موفقیت‌آمیز انجام شد. اطلاعات پس از بررسی کارشناس ثبتی آکان منتشر خواهد شد.');
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'property':
        return 'ثبت فایل ملک جهت اعتبارسنجی';
      case 'material_quote':
        return 'درخواست پیش‌فاکتور و استعلام مصالح';
      case 'barter':
        return 'ثبت پیشنهاد تهاتر تخصصی';
      case 'partnership':
        return 'ثبت پروژه زمین جهت مشارکت در ساخت';
    }
  };

  return (
    <BottomSheetModal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {type === 'property' && (
          <>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">عنوان فایل ملک:</label>
              <input
                type="text"
                required
                placeholder="مثلاً: آپارتمان ۱۸۰ متری نوساز کلید‌نخورده"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">شهر:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">منطقه / محله:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">متراژ (م‌م):</label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">اتاق خواب:</label>
                <input
                  type="number"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">نوع معامله:</label>
                <select
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value as DealType)}
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="sale" className="bg-slate-900 text-white">فروش نقدی</option>
                  <option value="barter" className="bg-slate-900 text-white">تهاتر</option>
                  <option value="partnership" className="bg-slate-900 text-white">مشارکت</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">قیمت پیشنهادی کل (تومان):</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </>
        )}

        {type !== 'property' && (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">توضیحات درخواست / مشخصات کامل:</label>
              <textarea
                rows={4}
                required
                placeholder="لطفاً جزییات دقیق (مقدار، تحویل، استعلام‌های مورد نیاز) را وارد نمایید..."
                className="w-full bg-slate-950/80 border border-white/15 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full btn-3d-amber text-slate-950 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50"
          >
            <Send className="w-4 h-4" />
            <span>ثبت نهایی و ارسال جهت اعتبارسنجی حقوقی</span>
          </button>
        </div>

      </form>
    </BottomSheetModal>
  );
};
