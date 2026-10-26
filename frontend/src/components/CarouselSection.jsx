import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getFullImageUrl } from '../utils/api';

export default function CarouselSection({
  id,
  title,
  subtitle,
  badge = 'FEATURED CAPSULE',
  badgeColor = 'brass',
  items = [],
  onQuickView,
  wishlist = [],
  onToggleWishlist,
  contactPhone,
  initialVisible = 4,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  // Downward grid display: show initial 4 watches, expand to show remaining on demand
  const hasMore = items.length > initialVisible;
  const visibleItems = isExpanded || !hasMore ? items : items.slice(0, initialVisible);

  // Badge class helper
  const getBadgeClass = (color = badgeColor) => {
    switch (color) {
      case 'rust':
        return 'badge-rust';
      case 'forest':
        return 'badge-forest';
      default:
        return 'badge-brass';
    }
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      // Smooth scroll back to section top when collapsing
      const sectionEl = document.getElementById(id);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <section id={id} className="relative w-full py-12 sm:py-16 lg:py-20 bg-[#FAF7F2] border-b border-[#E8E1D5] overflow-hidden">
      {/* Ambient warm background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brass-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header Row: Title, Subtitle, Counter & Catalog Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-5 border-b border-[#E8E1D5]/70">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest ${getBadgeClass(badgeColor)}`}>
              <Sparkles className="w-3 h-3 text-brass-700" />
              <span>{badge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-xs sm:text-sm text-[#6B635B] font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Header Status: In-Stock Availability Badge */}
          <div className="flex items-center shrink-0 self-start sm:self-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DDD5C7] text-xs font-semibold text-[#5A524A] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>In-Store Collection</span>
            </span>
          </div>
        </div>

        {/* Downward Responsive Grid (2 cols mobile, 3 tablet, 4 desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {visibleItems.map((item, index) => {
            const isWishlisted = wishlist.some((w) => w.id === item.id || w._id === item.id);
            const fullImage = getFullImageUrl(item.image);

            return (
              <div
                key={item.id || item._id || index}
                onClick={() => onQuickView && onQuickView(item)}
                className="group relative w-full rounded-2xl bg-white border border-[#E8E1D5] hover:border-brass-600/60 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Watch Canvas & Photography */}
                <div className="relative aspect-square bg-[#FBF9F5] border-b border-[#EFE9DF] p-5 sm:p-7 flex items-center justify-center overflow-hidden">
                  {/* Subtle inner parchment radial tone */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.06),transparent_70%)] pointer-events-none"></div>

                  <img
                    src={fullImage}
                    alt={`${item.brand || ''} ${item.name}`}
                    className="w-full h-full object-contain group-hover:scale-106 transition-transform duration-500 ease-out"
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
                      onToggleWishlist && onToggleWishlist(item);
                    }}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                        : 'bg-white/90 text-[#7C746B] hover:text-rose-600 hover:bg-white border border-[#DDD5C7]/70 shadow-sm opacity-80 group-hover:opacity-100'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Body Details - Brand Name and Model Name ONLY */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-1.5">
                    {/* Brand Name */}
                    <span className="block font-mono text-[11px] sm:text-xs uppercase tracking-[0.18em] font-extrabold text-brass-700 truncate">
                      {item.brand || 'Luxury Horology'}
                    </span>

                    {/* Model Name */}
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] group-hover:text-brass-800 transition-colors line-clamp-1 leading-snug">
                      {item.name}
                    </h3>
                  </div>

                  {/* Subtle Luxury Action */}
                  <div className="pt-3 mt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#8C847A] group-hover:text-brass-800 transition-colors flex items-center gap-1.5">
                      <span>View Specs & Inquire</span>
                      <span className="text-brass-700 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Downward "See More" Action Button */}
        {hasMore && (
          <div className="mt-8 sm:mt-12 flex items-center justify-center">
            <button
              onClick={handleToggleExpand}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#F2ECE1] text-[#1A1A1A] border-2 border-brass-600/40 hover:border-brass-600 font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 group"
            >
              {isExpanded ? (
                <>
                  <span>See Less</span>
                  <ChevronUp className="w-4 h-4 text-brass-700 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>See More</span>
                  <ChevronDown className="w-4 h-4 text-brass-700 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
