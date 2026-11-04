import React, { useRef } from 'react';
import { getFullImageUrl } from '../utils/api';
import { getWatchGender } from '../data/fallbackWatches';
import { formatINR } from '../utils/formatters';
import { ArrowUpRight } from 'lucide-react';

export default function WatchCard({
  watch,
  onQuickView,
  contactPhone,
  isDark = false,
}) {
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const wasDraggedRef = useRef(false);

  const fullImage = getFullImageUrl(watch?.image);
  const rawGender = watch?.gender || getWatchGender(watch);
  // Display Men, Women, or Unisex cleanly
  const gender = rawGender === 'Woman' ? 'Women' : (rawGender || 'Unisex');
  const isOutOfStock = watch?.inStock === false;

  const brand = watch?.brand || 'Luxury Horology';
  const category = watch?.category || watch?.movement || 'Automatic';
  const strapSpec = watch?.strapType || watch?.strap || watch?.movement || 'Automatic Movement';
  const isPriceHidden = !watch?.price || Number(watch.price) <= 0 || Boolean(watch?.hidePrice);
  const priceDisplay = isPriceHidden ? 'Price Upon Request' : formatINR(watch.price);

  const handleMouseDown = (e) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    wasDraggedRef.current = false;
  };

  const handleMouseUp = (e) => {
    if (dragStartRef.current.time > 0) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > 4 || dy > 4) {
        wasDraggedRef.current = true;
      }
    }
  };

  const handleCardClick = (e) => {
    // 1. If any text is selected in the window, do NOT open the description box
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      wasDraggedRef.current = false;
      return;
    }

    // 2. If the mouse was dragged (user dragged over text to highlight/copy), do NOT open
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }

    // 3. Movement delta check between mousedown and click
    if (dragStartRef.current.time > 0 && e.clientX !== undefined) {
      const dx = Math.abs(e.clientX - dragStartRef.current.x);
      const dy = Math.abs(e.clientY - dragStartRef.current.y);
      if (dx > 4 || dy > 4) {
        return;
      }
    }

    // 4. Double-click or multi-click
    if (e.detail && e.detail > 1) {
      return;
    }

    if (onQuickView) {
      onQuickView(watch);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl p-2 sm:p-3 md:p-3.5 border shadow-2xs hover:shadow-md ${
        isDark
          ? 'bg-[#1C1815] border-white/10 hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)]'
          : 'bg-white border-[#E5DFD3] hover:border-brass-600/70 hover:shadow-[0_8px_20px_rgba(197,160,89,0.12)]'
      }`}
    >
      <div>
        {/* 1. Watch Photography Canvas with Equal 1:1 Aspect Ratio & Badges Overlay */}
        <div
          onClick={(e) => {
            if (onQuickView) {
              e.stopPropagation();
              onQuickView(watch);
            }
          }}
          className={`relative aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center p-1 sm:p-2.5 transition-all duration-500 ease-out border ${
            isDark
              ? 'bg-[#25201C] border-white/5 group-hover:bg-[#2C2621]'
              : 'bg-[#FAF8F5] border-[#F0EBE1] group-hover:bg-[#F5F0E6]/80'
          }`}
        >
          <img
            src={fullImage}
            alt={`${brand} ${watch?.name || 'Watch'}`}
            draggable={false}
            className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] select-none ${
              isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/brands/default.webp';
            }}
          />

          {/* Badges Overlay */}
          {/* Top Left: In Stock / Out of Stock */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 pointer-events-none z-10 select-none">
            {isOutOfStock ? (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white shadow-2xs">
                Out of Stock
              </span>
            ) : (
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-2xs border ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                ● In Stock
              </span>
            )}
          </div>

          {/* Bottom Right: Gender Badge (Separated from Stock at top-left to eliminate overlap) */}
          <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 pointer-events-none z-10 select-none">
            <span
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-bold uppercase tracking-wider shadow-2xs border ${
                isDark
                  ? 'bg-black/80 text-amber-300 border-white/20'
                  : 'bg-black/75 text-amber-300 border-white/20'
              }`}
            >
              {gender}
            </span>
          </div>
        </div>

        {/* 2. Watch Details (Normal cursor, natural text selection without opening description box) */}
        <div className="mt-2 sm:mt-3 space-y-1 px-0.5">
          {/* Line 1: Brand • Category */}
          <span
            className={`text-[8.5px] sm:text-[10.5px] font-mono uppercase tracking-wider font-bold block truncate ${
              isDark ? 'text-amber-400' : 'text-brass-800'
            }`}
          >
            {brand} • {category}
          </span>

          {/* Line 2: Watch Model Name - Single line truncate matching inventory section */}
          <h3
            className={`font-serif text-[11.5px] sm:text-sm font-bold truncate leading-snug transition-colors ${
              isDark
                ? 'text-white group-hover:text-amber-300'
                : 'text-[#1A1A1A] group-hover:text-brass-700'
            }`}
            title={watch?.name}
          >
            {watch?.name}
          </h3>

          {/* Line 3: Strap Type / Spec */}
          <p
            className={`text-[9.5px] sm:text-[11px] truncate ${
              isDark ? 'text-stone-400' : 'text-[#6B635B]'
            }`}
          >
            {strapSpec}
          </p>
        </div>
      </div>

      {/* 3. Bottom Row: Price & Consultation Indicator */}
      <div
        className={`pt-2 sm:pt-2.5 mt-2 sm:mt-2.5 border-t flex items-center justify-between gap-1 px-0.5 select-none ${
          isDark ? 'border-white/10' : 'border-[#E8E1D5]'
        }`}
      >
        <span
          className={`font-serif text-[11px] sm:text-sm font-bold truncate ${
            isDark ? 'text-amber-200' : 'text-[#1A1A1A]'
          }`}
        >
          {priceDisplay}
        </span>

        <span
          onClick={(e) => {
            if (onQuickView) {
              e.stopPropagation();
              onQuickView(watch);
            }
          }}
          className={`text-[9.5px] sm:text-[11px] font-semibold flex items-center gap-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 cursor-pointer ${
            isDark ? 'text-amber-400/90' : 'text-brass-700'
          }`}
        >
          <span>View</span>
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}
