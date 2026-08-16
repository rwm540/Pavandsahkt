// Utility helpers for Persian numbers, Tomans formatting, and Jalali dates

export function toPersianDigits(num: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

export function formatToman(amount: number, usePersianDigits = true): string {
  if (isNaN(amount) || amount === 0) return usePersianDigits ? '۰ تومان' : '0 تومان';
  
  const formatted = amount.toLocaleString('en-US');
  if (usePersianDigits) {
    return `${toPersianDigits(formatted)} تومان`;
  }
  return `${formatted} تومان`;
}

export function formatTomanShort(amount: number): string {
  if (amount >= 1_000_000_000) {
    const miliard = (amount / 1_000_000_000).toFixed(1);
    return `${toPersianDigits(miliard)} میلیارد تومان`;
  }
  if (amount >= 1_000_000) {
    const million = (amount / 1_000_000).toFixed(0);
    return `${toPersianDigits(million)} میلیون تومان`;
  }
  if (amount >= 1_000) {
    const hezar = (amount / 1_000).toFixed(0);
    return `${toPersianDigits(hezar)} هزار تومان`;
  }
  return `${toPersianDigits(amount)} تومان`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 11) return '۰۹***۰*';
  return `${toPersianDigits(phone.slice(0, 4))}****${toPersianDigits(phone.slice(8))}`;
}

export function getVerificationBadgeText(status: string): string {
  switch (status) {
    case 'verified':
      return 'تأییدشده و سالم';
    case 'pending':
      return 'در حال اعتبارسنجی';
    case 'need_inquiry':
      return 'نیازمند استعلام سند';
    case 'rejected':
      return 'ردشده / عدم مطابقت';
    default:
      return 'نامشخص';
  }
}

export function getVerificationBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status) {
    case 'verified':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'pending':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'need_inquiry':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'rejected':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}
