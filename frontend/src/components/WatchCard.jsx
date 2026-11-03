import React from 'react';
import { getFullImageUrl } from '../utils/api';
import { getWatchGender } from '../data/fallbackWatches';

export default function WatchCard({
  watch,
  onQuickView,
  contactPhone,
  isDark = false,
}) {
  const fullImage = getFullImageUrl(watch.image);
  const rawGender = watch?.gender || getWatchGender(watch);
  // Display Men, Women, or Unisex cleanly
  const gender = rawGender === 'Woman' ? 'Women' : (rawGender || 'Unisex');
  const isOutOfStock = watch.inStock === false;

  return (
    <div
      onClick={() => onQuickView && onQuickView(watch)}
      className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl p-2.5 sm:p-3 md:p-3.5 border shadow-2xs hover:shadow-md ${
        isDark
          ? 'bg-[#1C1815] border-white/10 hover:border-amber-400/50'
          : 'bg-white border-[#E5DFD3] hover:border-brass-600/70 hover:shadow-[0_8px_20px_rgba(197,160,89,0.12)]'
      }`}
    >
      {/* 1. Watch Photography Canvas with Equal 1:1 Aspect Ratio & Fine Inner Stage */}
      <div
        className={`relative aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center p-2 sm:p-2.5 transition-all duration-500 ease-out border ${
          isDark
            ? 'bg-[#25201C] border-white/5 group-hover:bg-[#2C2621]'
            : 'bg-[#FAF8F5] border-[#F0EBE1] group-hover:bg-[#F5F0E6]/80'
        }`}
      >
        <img
          src={fullImage}
          alt={`${watch.brand || ''} ${watch.name}`}
          className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] ${
            isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/brands/default.webp';
          }}
        />

        {/* Out of Stock Subtle Pill Badge */}
        {isOutOfStock && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white shadow-sm pointer-events-auto">
            Out of Stock
          </span>
        )}
      </div>

      {/* 2. Details close below the image */}
      <div className="mt-2.5 sm:mt-3 flex flex-col flex-1 justify-between px-0.5">
        {/* Watch Model Name */}
        <h3
          className={`font-serif text-xs sm:text-sm font-bold line-clamp-2 leading-snug transition-colors ${
            isDark
              ? 'text-white group-hover:text-amber-300'
              : 'text-[#1A1A1A] group-hover:text-brass-700'
          }`}
        >
          {watch.name}
        </h3>

        {/* Portion like Men, Women, or Unisex under the watch name */}
        <p
          className={`mt-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${
            isDark ? 'text-amber-400/80' : 'text-[#7A7269]'
          }`}
        >
          {gender}
        </p>
      </div>
    </div>
  );
}

