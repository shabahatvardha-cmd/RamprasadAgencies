import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Eye,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink } from '../utils/api';

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
            const waUrl = getWhatsAppLink(contactPhone, item, 'Baldev Plaza & JalKal showrooms');

            return (
              <div
                key={item.id || item._id || index}
                className="group relative w-full rounded-2xl bg-white border border-[#E5DFD5] hover:border-brass-500/60 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Watch Canvas & Photography */}
                <div
                  onClick={() => onQuickView && onQuickView(item)}
                  className="relative aspect-square bg-[#F8F5EE] border-b border-[#EBE4D8] p-4 sm:p-6 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {/* Subtle inner parchment radial tone */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,160,89,0.06),transparent_70%)] pointer-events-none"></div>

                  <img
                    src={fullImage}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none">
                    {item.badge && (
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider ${getBadgeClass(item.badgeColor || badgeColor)} shadow-sm`}>
                        {item.badge}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/30 shadow-sm">
                      Inquire Agency
                    </span>
                  </div>

                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist && onToggleWishlist(item);
                    }}
                    className={`absolute top-2.5 sm:top-3.5 right-2.5 sm:right-3.5 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                      isWishlisted
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
                        : 'bg-white/90 text-[#6B635B] hover:text-rose-600 hover:bg-white border border-[#DDD5C7] shadow-sm'
                    }`}
                    title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick View Hover Button (Desktop) */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-end justify-center p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView && onQuickView(item);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#1A1A1A]/95 text-white hover:text-brass-300 border border-brass-500/40 shadow-xl backdrop-blur-md transition-transform active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-brass-400" />
                      <span>Quick Specs</span>
                    </button>
                  </div>
                </div>

                {/* Card Body Details */}
                <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 bg-white">
                  <div>
                    {/* Brand & Movement / Case Size */}
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-1">
                      <span className="font-mono uppercase tracking-widest font-bold text-brass-800 truncate">
                        {item.brand || 'Luxury Horology'}
                      </span>
                      {item.caseSize && (
                        <span className="text-[9px] sm:text-[10px] text-[#7C746B] font-mono font-medium truncate ml-1">
                          {item.caseSize}
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3
                      onClick={() => onQuickView && onQuickView(item)}
                      className="font-serif text-xs sm:text-sm lg:text-base font-bold text-[#1A1A1A] hover:text-brass-800 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {item.name}
                    </h3>

                    {/* Strap / Material subtitle */}
                    {(item.movement || item.strap) && (
                      <p className="text-[10px] sm:text-[11px] text-[#6B635B] truncate mt-1">
                        {item.movement || item.strap}
                      </p>
                    )}
                  </div>

                  {/* Pricing Row & WhatsApp Action */}
                  <div className="pt-2 sm:pt-3 border-t border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-serif text-xs sm:text-sm font-bold text-brass-900 block leading-tight">
                        Price Upon Request
                      </span>
                      <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-wider text-emerald-700 font-semibold block mt-0.5">
                        ✓ In Stock • Showroom
                      </span>
                    </div>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm"
                      title="Inquire price & availability on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-white shrink-0" />
                      <span>Inquire Price</span>
                    </a>
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
