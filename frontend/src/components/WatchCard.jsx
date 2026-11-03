import React from 'react';
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
  const fullImage = getFullImageUrl(watch?.image);
  const rawGender = watch?.gender || getWatchGender(watch);
  // Display Men, Women, or Unisex cleanly
  const gender = rawGender === 'Woman' ? 'Women' : (rawGender || 'Unisex');
  const isOutOfStock = watch?.inStock === false;

  const brand = watch?.brand || 'Luxury Horology';
  const category = watch?.category || watch?.movement || 'Automatic';
  const strapSpec = watch?.strapType || watch?.strap || watch?.movement || 'Automatic Movement';
  const priceDisplay =
    watch?.price && Number(watch.price) > 0
      ? formatINR(watch.price)
      : 'Price Upon Request';

  return (
    <div
      onClick={() => onQuickView && onQuickView(watch)}
      className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl p-2.5 sm:p-3 md:p-3.5 border shadow-2xs hover:shadow-md ${
        isDark
          ? 'bg-[#1C1815] border-white/10 hover:border-amber-400/50 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)]'
          : 'bg-white border-[#E5DFD3] hover:border-brass-600/70 hover:shadow-[0_8px_20px_rgba(197,160,89,0.12)]'
      }`}
    >
      <div>
        {/* 1. Watch Photography Canvas with Equal 1:1 Aspect Ratio & Badges Overlay */}
        <div
          className={`relative aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center p-2.5 sm:p-3 transition-all duration-500 ease-out border ${
            isDark
              ? 'bg-[#25201C] border-white/5 group-hover:bg-[#2C2621]'
              : 'bg-[#FAF8F5] border-[#F0EBE1] group-hover:bg-[#F5F0E6]/80'
          }`}
        >
          <img
            src={fullImage}
            alt={`${brand} ${watch?.name || 'Watch'}`}
            className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] ${
              isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              e.target.src = '/images/brands/default.webp';
            }}
          />

          {/* Badges Overlay */}
          {/* Top Left: In Stock / Out of Stock */}
          <div className="absolute top-2 left-2 pointer-events-none">
            {isOutOfStock ? (
              <span className="px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white shadow-2xs">
                Out of Stock
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wider shadow-2xs border ${
                  isDark
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                ● In Stock
              </span>
            )}
          </div>

          {/* Top Right: Gender Badge */}
          <div className="absolute top-2 right-2 pointer-events-none">
            <span
              className={`px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider shadow-2xs border ${
                isDark
                  ? 'bg-black/80 text-amber-300 border-white/20'
                  : 'bg-black/75 text-amber-300 border-white/20'
              }`}
            >
              {gender}
            </span>
          </div>
        </div>

        {/* 2. Watch Details (matching the Inventory card format) */}
        <div className="mt-3 space-y-1 px-0.5">
          {/* Line 1: Brand • Category */}
          <span
            className={`text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-widest font-bold block truncate ${
              isDark ? 'text-amber-400' : 'text-brass-800'
            }`}
          >
            {brand} • {category}
          </span>

          {/* Line 2: Watch Model Name */}
          <h3
            className={`font-serif text-xs sm:text-sm font-bold line-clamp-1 leading-snug transition-colors ${
              isDark
                ? 'text-white group-hover:text-amber-300'
                : 'text-[#1A1A1A] group-hover:text-brass-700'
            }`}
          >
            {watch?.name}
          </h3>

          {/* Line 3: Strap Type / Spec */}
          <p
            className={`text-[10px] sm:text-[11px] line-clamp-1 ${
              isDark ? 'text-stone-400' : 'text-[#6B635B]'
            }`}
          >
            {strapSpec}
          </p>
        </div>
      </div>

      {/* 3. Bottom Row: Price & Consultation Indicator */}
      <div
        className={`pt-2.5 mt-2.5 border-t flex items-center justify-between px-0.5 ${
          isDark ? 'border-white/10' : 'border-[#E8E1D5]'
        }`}
      >
        <span
          className={`font-serif text-xs sm:text-sm font-bold ${
            isDark ? 'text-amber-200' : 'text-[#1A1A1A]'
          }`}
        >
          {priceDisplay}
        </span>

        <span
          className={`text-[10px] sm:text-[11px] font-semibold flex items-center gap-0.5 transition-transform group-hover:translate-x-0.5 ${
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

