import React, { useState } from 'react';
import {
  Zap,
  Clock,
  Tag,
  Save,
  RotateCcw,
  Loader2,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flame,
  Check,
  AlertCircle,
} from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

export default function FlashSaleEditor({ flashSaleData, onSaveFlashSale, showToast, isSaving }) {
  const [flashSale, setFlashSale] = useState(() => {
    const raw = flashSaleData?.flashSale || flashSaleData;
    return raw && typeof raw === 'object'
      ? { ...DEFAULT_VINTAGE_STORE_DATA.flashSale, ...raw }
      : DEFAULT_VINTAGE_STORE_DATA.flashSale;
  });

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleChange = (field, val) => {
    setFlashSale((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handlePresetTime = (hoursToAdd) => {
    const targetDate = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    handleChange('endsAt', targetDate.toISOString());
    showToast({
      type: 'info',
      title: 'Timer Adjusted',
      message: `Countdown set to expire in ${hoursToAdd >= 24 ? `${Math.round(hoursToAdd / 24)} day(s)` : `${hoursToAdd} hour(s)`}. Remember to click Save.`,
    });
  };

  const handleRestoreDefaults = () => {
    setFlashSale(DEFAULT_VINTAGE_STORE_DATA.flashSale);
    showToast({
      type: 'info',
      title: 'Flash Sale Defaults Restored',
      message: 'Reset flash sale promotion to VINTAGE15 default. Remember to click Save.',
    });
  };

  const handleSave = () => {
    // Pass clean flashSale object directly
    onSaveFlashSale(flashSale);
  };

  // Human readable date string for helper display
  const formattedEndDate = (() => {
    try {
      if (!flashSale.endsAt) return 'No date set';
      const d = new Date(flashSale.endsAt);
      if (isNaN(d.getTime())) return 'Invalid date';
      return d.toLocaleString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    } catch {
      return 'Invalid date';
    }
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rust-500/15 text-rust-700 border border-rust-600/30">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Urgency & Promotions Engine</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Flash Sale Ribbon & Vault Carousel
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Turn the flash sale on/off, edit the discount coupon, headline, and configure the countdown timer.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowRestoreModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5A524A] hover:bg-[#F0EBE1] border border-[#DDD5C7] transition-all"
            title="Reset this section to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restore Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Flash Sale</span>
          </button>
        </div>
      </div>

      {/* 1. MASTER ON/OFF SWITCH - Prominent & Unmistakable */}
      <div className={`p-5 rounded-2xl border transition-all ${
        flashSale.isActive
          ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
          : 'bg-[#FAF7F2] border-[#DDD5C7]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              flashSale.isActive ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
            }`}>
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1A1A1A]">
                  Flash Sale Visibility Status:
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  flashSale.isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {flashSale.isActive ? '● ACTIVE & LIVE' : '○ PAUSED & HIDDEN'}
                </span>
              </div>
              <p className="text-xs text-[#5A524A] mt-0.5">
                {flashSale.isActive
                  ? 'The countdown ribbon and Flash Sale Vault watch carousel are currently VISIBLE to all customers on the homepage.'
                  : 'The flash sale is currently PAUSED. The ribbon and special discount section are hidden from customers.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleChange('isActive', !flashSale.isActive)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0 ${
              flashSale.isActive
                ? 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {flashSale.isActive ? (
              <>
                <span>Pause Flash Sale</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Turn Sale ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. LIVE STOREFRONT RIBBON PREVIEW */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A524A] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-brass-700" />
            <span>Storefront Ribbon Live Preview</span>
          </span>
          <span className="text-[11px] text-[#7C746B]">
            Updates automatically as you type below
          </span>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          flashSale.isActive
            ? 'bg-gradient-to-r from-[#F6ECE2] via-[#FAF3EC] to-[#F6ECE2] border-[#E5D7C7] text-[#2A241E] shadow-sm'
            : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rust-500 text-white shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>{flashSale.badgeText || 'FESTIVE HOROLOGY EVENT'}</span>
              </span>
              <div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
                  {flashSale.headline || 'THE BIG BRAND WATCH SALE'}
                </h4>
                <p className="text-xs text-[#5A524A]">
                  {flashSale.subheadline || 'Up to 35% Off Curated Swiss & Japanese Mechanical Timepieces'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-xs shadow-sm">
                <Tag className="w-3.5 h-3.5 text-brass-700" />
                <span className="font-mono font-bold text-brass-800">
                  {flashSale.couponCode || 'VINTAGE15'}
                </span>
                <span className="text-[#A3998C] text-[10px]">
                  ({flashSale.discountAmount || '15% Extra Off'})
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#1A1A1A] bg-white px-2.5 py-1 rounded-lg border border-[#DDD5C7]">
                <Clock className="w-3 h-3 text-brass-700" />
                <span>{flashSale.countdownLabel || 'Ends In:'}</span>
                <span className="text-brass-800">23h:59m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CAMPAIGN DETAILS FORM */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
        <h3 className="font-serif text-base font-bold text-[#1A1A1A] pb-3 border-b border-[#E8E1D5]">
          1. Campaign Headline & Promotional Text
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Badge Label *
            </label>
            <input
              type="text"
              value={flashSale.badgeText || ''}
              onChange={(e) => handleChange('badgeText', e.target.value)}
              placeholder="e.g. FESTIVE HOROLOGY EVENT"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Campaign Main Headline *
            </label>
            <input
              type="text"
              value={flashSale.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="e.g. THE BIG BRAND WATCH SALE"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-serif font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
            Offer Description / Subheadline
          </label>
          <input
            type="text"
            value={flashSale.subheadline || ''}
            onChange={(e) => handleChange('subheadline', e.target.value)}
            placeholder="e.g. Up to 35% Off Curated Swiss & Japanese Mechanical Automatics, Precision Chronographs & Divers"
            className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
          />
        </div>
      </div>

      {/* 4. COUPON CODE & DISCOUNT SETTINGS */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
        <h3 className="font-serif text-base font-bold text-[#1A1A1A] pb-3 border-b border-[#E8E1D5]">
          2. Discount Code & Savings Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Coupon Code (Auto-Uppercase)
            </label>
            <input
              type="text"
              value={flashSale.couponCode || ''}
              onChange={(e) => handleChange('couponCode', e.target.value.toUpperCase())}
              placeholder="VINTAGE15"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600 uppercase"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Discount Amount / Tag
            </label>
            <input
              type="text"
              value={flashSale.discountAmount || ''}
              onChange={(e) => handleChange('discountAmount', e.target.value)}
              placeholder="15% Extra Off"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Countdown Prefix Label
            </label>
            <input
              type="text"
              value={flashSale.countdownLabel || ''}
              onChange={(e) => handleChange('countdownLabel', e.target.value)}
              placeholder="Sale Ends In:"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
            />
          </div>
        </div>
      </div>

      {/* 5. COUNTDOWN TIMER & EXPIRATION - Super Easy & Clear */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              3. Countdown Expiration Date & Time
            </h3>
            <p className="text-xs text-[#6B635B]">
              Currently configured to end on: <strong className="text-brass-800">{formattedEndDate}</strong>
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#7C746B] font-semibold mr-1">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handlePresetTime(24)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] hover:bg-brass-600 hover:text-white border border-[#DDD5C7] transition-all text-[#1A1A1A]"
            >
              +24 Hours
            </button>
            <button
              type="button"
              onClick={() => handlePresetTime(72)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] hover:bg-brass-600 hover:text-white border border-[#DDD5C7] transition-all text-[#1A1A1A]"
            >
              +3 Days
            </button>
            <button
              type="button"
              onClick={() => handlePresetTime(168)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] hover:bg-brass-600 hover:text-white border border-[#DDD5C7] transition-all text-[#1A1A1A]"
            >
              +7 Days
            </button>
            <button
              type="button"
              onClick={() => handlePresetTime(720)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] hover:bg-brass-600 hover:text-white border border-[#DDD5C7] transition-all text-[#1A1A1A]"
            >
              +30 Days
            </button>
          </div>
        </div>

        {/* Date & Time Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Select Expiration Date & Time (Local Time)
            </label>
            <input
              type="datetime-local"
              value={flashSale.endsAt ? flashSale.endsAt.slice(0, 16) : ''}
              onChange={(e) => {
                if (e.target.value) {
                  handleChange('endsAt', new Date(e.target.value).toISOString());
                }
              }}
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Active End Timestamp (ISO format)
            </label>
            <input
              type="text"
              value={flashSale.endsAt || ''}
              onChange={(e) => handleChange('endsAt', e.target.value)}
              placeholder="2026-11-15T23:59:59.000Z"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
            />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Default Flash Sale?"
        message="This will reset the flash sale configuration to code VINTAGE15 and the curated Big Brand Watch Sale text."
        confirmText="Yes, Restore Flash Sale"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
