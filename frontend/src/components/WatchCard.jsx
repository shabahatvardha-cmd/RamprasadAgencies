import React from 'react';
import { Heart } from 'lucide-react';
import { getFullImageUrl } from '../utils/api';

export default function WatchCard({
  watch,
  onQuickView,
  contactPhone,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const fullImage = getFullImageUrl(watch.image);

  return (
    <div
      onClick={() => onQuickView && onQuickView(watch)}
      className="group relative rounded-2xl bg-stone-900 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Top Image Canvas */}
      <div className="relative aspect-square bg-[#0e0e0d] p-5 sm:p-7 flex items-center justify-center overflow-hidden">
        {/* Subtle radial sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.06),transparent_70%)] pointer-events-none"></div>

        <img
          src={fullImage}
          alt={`${watch.brand} ${watch.name}`}
          className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Wishlist Heart Button - Minimalist & elegant */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(watch);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-stone-900/80 text-stone-400 hover:text-white hover:bg-stone-800 border border-white/10 opacity-80 group-hover:opacity-100'
            }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body Details - Brand Name and Model Name ONLY */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-stone-900">
        <div className="space-y-1.5">
          {/* Brand Name */}
          <span className="block font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-amber-400 truncate">
            {watch.brand}
          </span>

          {/* Model Name */}
          <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
            {watch.name}
          </h3>
        </div>

        {/* Subtle Luxury Action */}
        <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-stone-400 group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
            <span>View Specs & Inquire</span>
            <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

