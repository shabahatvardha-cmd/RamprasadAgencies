import React, { useState, useEffect } from 'react';
import { Zap, Clock, Copy, Check, Gift, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FlashSaleRibbon() {
  const { storeData } = useStore();
  const flashSale = storeData.flashSale?.flashSale || storeData.flashSale || {};
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 48 });

  // Countdown timer calculation
  useEffect(() => {
    if (!flashSale.isActive) return;

    const calculateTimeLeft = () => {
      // Default to 28h from now if endsAt is in past or invalid
      const targetTime = flashSale.endsAt ? new Date(flashSale.endsAt).getTime() : Date.now() + 86400000;
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        return { days: 0, hours: 14, minutes: 35, seconds: 20 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [flashSale.isActive, flashSale.endsAt]);

  if (!flashSale.isActive) {
    return null;
  }

  const handleCopyCode = () => {
    const code = flashSale.couponCode || 'VINTAGE15';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-[#F6ECE2] via-[#FAF3EC] to-[#F6ECE2] border-b border-[#E5D7C7] text-[#2A241E] overflow-hidden shadow-sm">
      {/* Subtle organic light reflections */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(184,90,56,0.08),transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(197,160,89,0.08),transparent_60%)] pointer-events-none"></div>

      <div className="relative z-10 w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Headline & Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest bg-rust-500 text-white shadow-sm animate-pulse">
            <Zap className="w-3 h-3 fill-current" />
            {flashSale.badgeText || 'FESTIVE HOROLOGY EVENT'}
          </span>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] tracking-wide">
              {flashSale.headline || 'THE BIG BRAND WATCH SALE'}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#5A524A] font-normal line-clamp-1 max-w-xl">
              {flashSale.subheadline || 'Up to 35% Off Curated Swiss & Japanese Automatic Timepieces & Divers'}
            </p>
          </div>
        </div>

        {/* Center: Live Countdown Clocks */}
        <div className="flex items-center gap-2 sm:gap-3 text-center">
          <div className="flex items-center gap-1.5 text-xs text-[#5A524A] font-medium">
            <Clock className="w-3.5 h-3.5 text-brass-700 animate-spin-slow" />
            <span className="text-[11px] uppercase tracking-wider text-[#6B635B]">
              {flashSale.countdownLabel || 'Ends In:'}
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
            <div className="px-2 py-1 rounded-lg bg-white border border-[#DDD5C7] text-rust-600 min-w-[30px] shadow-sm">
              {String(timeLeft.seconds).padStart(2, '0')}
              <span className="block text-[8px] font-sans font-medium text-rust-500">SEC</span>
            </div>
          </div>
        </div>

        {/* Right: Coupon Copy Code & Direct CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleCopyCode}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF7F2] border border-brass-600/40 text-xs shadow-sm transition-all active:scale-95"
            title="Click to copy coupon code"
          >
            <Tag className="w-3 h-3 text-brass-700" />
            <span className="font-mono font-bold tracking-wider text-brass-800">
              {flashSale.couponCode || 'VINTAGE15'}
            </span>
            <span className="text-[#C4BCB0]">|</span>
            {copied ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                <Check className="w-3 h-3" /> Copied!
              </span>
            ) : (
              <span className="text-[10px] text-[#6B635B] group-hover:text-[#1A1A1A]">
                Copy
              </span>
            )}
          </button>

          <a
            href="#flash-deals"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 shrink-0"
          >
            <span>Shop Flash Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
