import React, { useMemo, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import WatchCard from './WatchCard';
import { FALLBACK_WATCHES } from '../data/fallbackWatches';

const IMPORTED_BRANDS = [
  { name: 'Titan', country: 'India', desc: 'Edge, Octane & Regalia Flagships' },
  { name: 'HMT', country: 'India', desc: 'Kohinoor & Janata Mechanical Heritage' },
  { name: 'Fastrack', country: 'India', desc: 'Youth Sport & Street Chronographs' },
  { name: 'Sonata', country: 'India', desc: 'Everyday Reliable Indian Horology' },
  { name: 'Tissot', country: 'Swiss', desc: 'PRX & Heritage Swiss Precision' },
  { name: 'Rolex', country: 'Swiss', desc: 'Certified Swiss Luxury Imports' },
  { name: 'Omega', country: 'Swiss', desc: 'Moonwatch & Co-Axial Chronometers' },
  { name: 'Seiko', country: 'Japan', desc: 'Automatic & Presage Craft' },
  { name: 'Citizen', country: 'Japan', desc: 'Tsuyosa & Eco-Drive Calibers' },
  { name: 'Casio', country: 'Japan', desc: 'Edifice Solar & Vintage Steel' },
  { name: 'Breitling', country: 'Swiss', desc: 'Navitimer Aviation Chronographs' },
  { name: 'Rado', country: 'Swiss', desc: 'Master of High-Tech Ceramic' },
  { name: 'Fossil', country: 'USA', desc: 'Heritage Automatics & Vintage Styling' },
];

export default function BrandMarquee({
  selectedBrand,
  onSelectBrand,
  brands,
  watches = [],
  contactPhone = '+91 98765 43210',
  searchQuery = '',
  onClearSearch,
  wishlist = [],
  onToggleWishlist,
  onSelectWatch,
}) {
  const brandList = brands && Array.isArray(brands) && brands.length > 0 ? brands : IMPORTED_BRANDS;
  const showcaseRef = useRef(null);

  // Combine store watches with comprehensive fallback data so every brand has rich watches
  const displayWatches = useMemo(() => {
    if (!watches || watches.length === 0) return FALLBACK_WATCHES;
    const existingNames = new Set(watches.map((w) => (w.name || '').toLowerCase().trim()));
    const missingFallbacks = FALLBACK_WATCHES.filter(
      (fw) => !existingNames.has((fw.name || '').toLowerCase().trim())
    );
    return [...watches, ...missingFallbacks];
  }, [watches]);

  // Filter watches strictly for the active brand or active search
  const isBrandActive = Boolean(selectedBrand && selectedBrand !== 'ALL');
  const isSearchActive = Boolean(searchQuery && searchQuery.trim() !== '');
  const isExpanded = isBrandActive || isSearchActive;

  const filteredWatches = useMemo(() => {
    if (isSearchActive) {
      const q = searchQuery.toLowerCase().trim();
      return displayWatches.filter((w) => {
        const name = (w.name || '').toLowerCase();
        const brand = (w.brand || '').toLowerCase();
        const movement = (w.movement || '').toLowerCase();
        return name.includes(q) || brand.includes(q) || movement.includes(q);
      });
    }

    if (!isBrandActive) {
      return [];
    }

    const sel = selectedBrand.toLowerCase().trim();
    return displayWatches.filter((w) => {
      const brandLower = (w.brand || '').toLowerCase().trim();
      return (
        brandLower.includes(sel) ||
        sel.includes(brandLower) ||
        (w.name || '').toLowerCase().includes(sel)
      );
    });
  }, [displayWatches, selectedBrand, isBrandActive, isSearchActive, searchQuery]);

  // Smooth scroll into showcase when a brand is selected
  useEffect(() => {
    if (isExpanded && showcaseRef.current) {
      const timer = setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedBrand, isExpanded]);

  return (
    <section id="brands" className="py-8 sm:py-12 border-y border-[#E8E1D5] bg-[#F6F2EB] overflow-hidden">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brass-800 font-mono">
              The Maison Portfolio
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-0.5 sm:mt-1">
              Indian Heritage & Global Watch Maisons
            </h3>
          </div>
          <p className="text-xs text-[#6B635B] max-w-md">
            Click any brand to filter timepieces currently in stock across our Baldev Plaza and JalKal Building showrooms.
          </p>
        </div>
      </div>

      {/* Interactive Brand Grid */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {brandList.map((b) => {
            const isSelected = selectedBrand?.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                key={b.name}
                data-brand-btn="true"
                onClick={() => onSelectBrand && onSelectBrand(isSelected ? 'ALL' : b.name)}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-300 focus:outline-none cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                  isSelected
                    ? 'bg-gradient-to-br from-brass-600 via-amber-600 to-brass-700 text-white border-brass-700 shadow-xl scale-[1.03]'
                    : 'bg-white border-[#DDD5C7] hover:border-brass-600 hover:bg-[#FAF8F5] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] sm:text-xs font-mono tracking-widest uppercase font-bold ${
                      isSelected ? 'text-amber-200' : 'text-brass-800'
                    }`}
                  >
                    {b.country}
                  </span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></span>}
                </div>
                <h4
                  className={`font-serif text-base sm:text-lg lg:text-xl font-bold mt-1 sm:mt-1.5 tracking-wide truncate ${
                    isSelected ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                >
                  {b.name}
                </h4>
                <p
                  className={`text-xs sm:text-[13px] line-clamp-1 mt-1 ${
                    isSelected ? 'text-amber-100' : 'text-[#6B635B]'
                  }`}
                >
                  {b.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* On-Demand Showcase: Appears ONLY when a brand is clicked or search is active */}
      {isExpanded && (
        <div
          ref={showcaseRef}
          id="brand-showcase"
          className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-6 sm:mt-8 animate-fade-in"
        >
          <div className="rounded-2xl sm:rounded-3xl bg-[#141312] border border-[#302B24] p-4 sm:p-7 text-white shadow-2xl">
            {/* Showcase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSearchActive ? 'Search Results' : 'Showroom Collection'}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                  {isSearchActive ? `Timepieces matching "${searchQuery}"` : `${selectedBrand} Timepieces`}
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  {filteredWatches.length} authentic models currently available at Baldev Plaza & JalKal Building, Golghar
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                data-brand-btn="true"
                onClick={() => {
                  onSelectBrand && onSelectBrand('ALL');
                  onClearSearch && onClearSearch();
                }}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all border border-white/15 cursor-pointer focus:outline-none"
                title="Close showcase"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Watches Grid */}
            {filteredWatches.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <p className="font-serif text-lg text-stone-300">No timepieces currently listed for this selection</p>
                <p className="text-xs">We source private collector references upon request at our Gorakhpur showrooms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
                {filteredWatches.map((watch) => (
                  <WatchCard
                    key={watch._id || watch.id}
                    watch={watch}
                    onQuickView={onSelectWatch}
                    contactPhone={contactPhone}
                    isWishlisted={wishlist.some(
                      (w) => (w._id || w.id) === (watch._id || watch.id)
                    )}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}

            {/* Bottom Dismiss Note */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
              <span>Tap any watch card to inspect specifications & showroom location</span>
              <span className="text-amber-400/80 font-medium">Click outside or press Close to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
