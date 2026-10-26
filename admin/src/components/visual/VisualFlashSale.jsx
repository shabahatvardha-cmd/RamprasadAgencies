import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Tag,
  Edit2,
  EyeOff,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export default function VisualFlashSale({
  flashSale = {},
  isEditMode,
  onOpenEdit,
  onQuickUpdateFlashSale,
}) {
  const current = flashSale?.flashSale || flashSale || {};
  const {
    isActive = true,
    badgeText = 'FESTIVE HOROLOGY EVENT',
    headline = 'THE BIG BRAND WATCH SALE',
    subheadline = 'Up to 35% Off Curated Swiss & Japanese Mechanical Automatics, Precision Chronographs & Divers',
    couponCode = 'VINTAGE15',
    discountAmount = '15% Extra Off',
    countdownLabel = 'Sale Ends In:',
    endsAt = '2026-11-15T23:59:59.000Z',
  } = current;

  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(endsAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const handleResetTimerHours = (hoursToAdd) => {
    const targetDate = new Date(Date.now() + hoursToAdd * 60 * 60 * 1000);
    const newEndsAt = targetDate.toISOString();
    if (onQuickUpdateFlashSale) {
      onQuickUpdateFlashSale({ endsAt: newEndsAt, isActive: true });
    } else {
      onOpenEdit('flashSale');
    }
  };

  const handleToggleActive = () => {
    if (onQuickUpdateFlashSale) {
      onQuickUpdateFlashSale({ isActive: !isActive });
    } else {
      onOpenEdit('flashSale');
    }
  };

  // Paused / Inactive State Banner
  if (!isActive) {
    if (!isEditMode) return null;
    return (
      <div id="flash-sale" className="relative w-full py-4 px-4 sm:px-6 md:px-8 bg-[#2A241F] border-b border-brass-600/40 text-[#F5EFE6] flex flex-wrap items-center justify-between gap-4 font-sans shadow-md">
        <div className="flex items-center gap-3 text-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <EyeOff className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block">
              Flash Sale is Currently PAUSED
            </span>
            <span className="text-[#C4BCB0] text-[11px]">
              The countdown ribbon and Flash Sale Vault watch carousel are hidden from customers.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleToggleActive}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Turn Sale ON</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenEdit('flashSale')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-md transition-all active:scale-95"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Flash Sale</span>
          </button>
        </div>
      </div>
    );
  }

  // Active Live State - Exactly matches Customer Storefront styling with prominent Admin Edit Bar
  return (
    <section id="flash-sale" className="relative w-full border-b border-[#E5D7C7] text-[#2A241E] overflow-hidden shadow-sm font-sans">
      {/* Top Admin Quick Control Toolbar */}
      {isEditMode && (
        <div className="w-full bg-[#1A1A1A] text-white px-3 sm:px-6 md:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-brass-400 uppercase tracking-wider text-[10.5px]">
              Flash Sale Live:
            </span>
            <span className="text-white/80 text-[11px] hidden sm:inline">
              Coupon: <strong className="text-brass-300 font-mono">{couponCode}</strong> ({discountAmount})
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Timer Presets */}
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg text-[10.5px]">
              <Clock className="w-3 h-3 text-brass-400" />
              <span className="text-white/70 mr-1 hidden sm:inline">Reset Timer:</span>
              <button
                type="button"
                onClick={() => handleResetTimerHours(24)}
                className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-brass-500 hover:text-black font-mono font-bold transition-colors"
                title="Reset countdown to 24 hours"
              >
                +24h
              </button>
              <button
                type="button"
                onClick={() => handleResetTimerHours(72)}
                className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-brass-500 hover:text-black font-mono font-bold transition-colors"
                title="Reset countdown to 3 days"
              >
                +3d
              </button>
              <button
                type="button"
                onClick={() => handleResetTimerHours(168)}
                className="px-1.5 py-0.5 rounded bg-white/15 hover:bg-brass-500 hover:text-black font-mono font-bold transition-colors"
                title="Reset countdown to 7 days"
              >
                +7d
              </button>
            </div>

            <button
              type="button"
              onClick={handleToggleActive}
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 transition-colors"
              title="Pause flash sale on storefront"
            >
              Pause Sale
            </button>

            <button
              type="button"
              onClick={() => onOpenEdit('flashSale')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-md hover:scale-105 transition-all"
              title="Open full editor modal"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Flash Sale</span>
            </button>
          </div>
        </div>
      )}

      {/* Actual Customer Ribbon (Exact Match with Storefront) */}
      <div className="relative w-full bg-gradient-to-r from-[#F6ECE2] via-[#FAF3EC] to-[#F6ECE2] px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Headline & Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-rust-500 text-white shadow-sm animate-pulse">
            <Flame className="w-3 h-3 fill-current" />
            <span>{badgeText}</span>
          </span>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] tracking-wide">
              {headline}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5A524A] font-normal line-clamp-1 max-w-xl">
              {subheadline}
            </p>
          </div>
        </div>

        {/* Center/Right: Live Countdown & Coupon */}
        <div className="flex items-center gap-3 sm:gap-4 text-center">
          <div className="flex items-center gap-1.5 text-xs text-[#5A524A] font-medium">
            <Clock className="w-3.5 h-3.5 text-brass-700" />
            <span className="text-[11px] uppercase tracking-wider text-[#6B635B]">
              {countdownLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs font-bold">
            {timeLeft.days > 0 && (
              <>
                <div className="px-2 py-1 rounded-lg bg-white border border-[#DDD5C7] text-[#1A1A1A] min-w-[30px] shadow-sm">
                  {String(timeLeft.days).padStart(2, '0')}
                  <span className="block text-[8px] font-sans font-medium text-[#7C746B]">DAYS</span>
                </div>
                <span className="text-brass-700 font-bold">:</span>
              </>
            )}
            <div className="px-2 py-1 rounded-lg bg-white border border-[#DDD5C7] text-[#1A1A1A] min-w-[30px] shadow-sm">
              {String(timeLeft.hours).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-medium text-[#7C746B]">HRS</span>
            </div>
            <span className="text-brass-700 font-bold">:</span>
            <div className="px-2 py-1 rounded-lg bg-white border border-[#DDD5C7] text-[#1A1A1A] min-w-[30px] shadow-sm">
              {String(timeLeft.minutes).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-medium text-[#7C746B]">MIN</span>
            </div>
            <span className="text-brass-700 font-bold">:</span>
            <div className="px-2 py-1 rounded-lg bg-white border border-[#DDD5C7] text-rust-700 min-w-[30px] shadow-sm">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-medium text-[#7C746B]">SEC</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-xs font-semibold shadow-sm">
            <Tag className="w-3.5 h-3.5 text-brass-700" />
            <span className="font-mono font-bold text-brass-800">{couponCode}</span>
            <span className="text-[10px] text-[#7C746B]">({discountAmount})</span>
          </div>
        </div>
      </div>
    </section>
  );
}
