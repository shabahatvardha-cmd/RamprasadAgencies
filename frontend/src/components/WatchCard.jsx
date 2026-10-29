import React from 'react';
import { Heart } from 'lucide-react';
import { getFullImageUrl } from '../utils/api';
import { getWatchGender } from '../data/fallbackWatches';

export default function WatchCard({
  watch,
  onQuickView,
  contactPhone,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const fullImage = getFullImageUrl(watch.image);
  const rawGender = watch?.gender || getWatchGender(watch);
  // Display Men, Women, or Unisex cleanly
  const gender = rawGender === 'Woman' ? 'Women' : rawGender;

  return (
    <div
      onClick={() => onQuickView && onQuickView(watch)}
      className="group relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-[#141312] border border-[#DDD5C7]/70 hover:border-brass-600 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-end"
    >
      {/* 1. Full-Bleed High-Definition Watch Photography (Covers Max Part of Card) */}
      <img
        src={fullImage}
        alt={`${watch.brand || ''} ${watch.name}`}
        className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/brands/default.webp';
        }}
      />

      {/* 2. Top Controls Overlay: Gender Badge ('Men' | 'Women' | 'Unisex') & Wishlist Heart */}
      <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Gender Badge */}
        <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-white/20 shadow-md pointer-events-auto">
          {gender}
        </span>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(watch);
          }}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center transition-all pointer-events-auto ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105'
              : 'bg-black/60 hover:bg-black/85 text-stone-300 hover:text-white border border-white/20 backdrop-blur-md'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* 3. Gradient Overlay for Clean Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none group-hover:from-black group-hover:via-black/50 transition-all duration-300" />

      {/* 4. Bottom Details: ONLY Model Name (No Specifications) */}
      <div className="relative z-10 w-full p-3 sm:p-4 flex flex-col justify-end pointer-events-none">
        <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-amber-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-2 leading-snug">
          {watch.name}
        </h3>
      </div>
    </div>
  );
}

