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
      className="group relative flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-transparent border-0 shadow-none"
    >
      {/* 1. Frameless / Invisible Watch Photography Canvas with Equal 1:1 Aspect Ratio */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center p-1 sm:p-2 transition-transform duration-500 ease-out group-hover:scale-105 bg-transparent">
        <img
          src={fullImage}
          alt={`${watch.brand || ''} ${watch.name}`}
          className={`w-full h-full object-contain ${
            isOutOfStock ? 'opacity-70 grayscale-[25%]' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/brands/default.webp';
          }}
        />

        {/* Out of Stock Subtle Pill Badge */}
        {isOutOfStock && (
          <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-rose-600/90 text-white shadow-sm pointer-events-auto">
            Out of Stock
          </span>
        )}
      </div>

      {/* 2. Details close below the image */}
      <div className="mt-1 sm:mt-1.5 flex flex-col px-0.5">
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
          className={`mt-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider ${
            isDark ? 'text-amber-400/80' : 'text-[#6B635B]'
          }`}
        >
          {gender}
        </p>
      </div>
    </div>
  );
}

