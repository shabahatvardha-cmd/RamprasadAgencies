import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Award, Edit2, Sparkles, X, Plus, Trash2, Eye } from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../../utils/defaults';
import { FALLBACK_WATCHES } from '../../data/fallbackWatches';
import { getFullImageUrl } from '../../utils/api';

const DEFAULT_BRANDS = [
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

export default function VisualBrandMarquee({
  brands,
  watches = [],
  isEditMode = true,
  onOpenEdit,
  onEditWatch,
  onDeleteWatch,
  onAddWatch,
  onQuickView,
}) {
  const brandList = (brands && Array.isArray(brands) && brands.length > 0)
    ? brands
    : DEFAULT_BRANDS;

  const [selectedBrand, setSelectedBrand] = useState('ALL');
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

  const isBrandActive = Boolean(selectedBrand && selectedBrand !== 'ALL');

  // Filter watches strictly for the active brand
  const filteredWatches = useMemo(() => {
    if (!isBrandActive) return [];
    const sel = selectedBrand.toLowerCase().trim();
    return displayWatches.filter((w) => {
      const brandLower = (w.brand || '').toLowerCase().trim();
      return (
        brandLower.includes(sel) ||
        sel.includes(brandLower) ||
        (w.name || '').toLowerCase().includes(sel)
      );
    });
  }, [displayWatches, selectedBrand, isBrandActive]);

  // Click-outside listener to deselect brand back to 'ALL'
  useEffect(() => {
    if (!isBrandActive) return;

    const handleGlobalClick = (e) => {
      if (e.target.closest('[data-brand-btn]')) return;
      if (e.target.closest('[data-watch-card]')) return;
      if (e.target.closest('input, select, textarea, button')) return;
      setSelectedBrand('ALL');
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 120);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isBrandActive]);

  // Smooth scroll into showcase when brand selected
  useEffect(() => {
    if (isBrandActive && showcaseRef.current) {
      const timer = setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedBrand, isBrandActive]);

  return (
    <section id="brands" className="relative group/brands w-full py-8 sm:py-12 border-y border-[#E8E1D5] bg-[#F6F2EB] overflow-hidden">
      {/* Top Header Row */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brass-800 font-mono">
                The Maison Portfolio
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
                Live Storefront Showcase
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1">
              Indian Heritage & Global Watch Maisons
            </h3>
            <p className="text-xs text-[#6B635B] max-w-md mt-0.5">
              Click any brand to filter timepieces currently in stock across our Baldev Plaza and JalKal Building showrooms.
            </p>
          </div>

          {/* Visual Admin Edit Trigger Badge */}
          {isEditMode && onOpenEdit && (
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => onOpenEdit('branding')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-md hover:scale-105 transition-all border border-white/30"
                title="Edit Authorized Brands Portfolio"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Brand Portfolio</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Brand Grid */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {brandList.map((b) => {
            const bName = typeof b === 'string' ? b : b.name;
            const bCountry = typeof b === 'object' ? b.country : 'Import';
            const bDesc = typeof b === 'object' ? b.desc : 'Showroom Collection';
            const isSelected = selectedBrand?.toLowerCase() === bName.toLowerCase();

            return (
              <button
                key={bName}
                data-brand-btn="true"
                onClick={() => setSelectedBrand(isSelected ? 'ALL' : bName)}
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
                    {bCountry}
                  </span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm"></span>}
                </div>
                <h4
                  className={`font-serif text-base sm:text-lg lg:text-xl font-bold mt-1 sm:mt-1.5 tracking-wide truncate ${
                    isSelected ? 'text-white' : 'text-[#1A1A1A]'
                  }`}
                >
                  {bName}
                </h4>
                <p
                  className={`text-xs sm:text-[13px] line-clamp-1 mt-1 ${
                    isSelected ? 'text-amber-100' : 'text-[#6B635B]'
                  }`}
                >
                  {bDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* On-Demand Showcase: Appears ONLY when a brand is clicked */}
      {isBrandActive && (
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
                  <span>Gorakhpur Showroom Collection</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-0.5">
                  {selectedBrand} Timepieces ({filteredWatches.length} Models)
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Timepieces in stock at Baldev Plaza & JalKal Building showrooms
                </p>
              </div>

              {/* Action Buttons: Add Watch + Close */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => onAddWatch && onAddWatch({ brand: selectedBrand, category: 'Automatic' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    title={`Add new ${selectedBrand} timepiece`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {selectedBrand} Watch</span>
                  </button>
                )}

                <button
                  type="button"
                  data-brand-btn="true"
                  onClick={() => setSelectedBrand('ALL')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all border border-white/15 cursor-pointer focus:outline-none"
                  title="Close showcase"
                >
                  <span>Close</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Watches Grid */}
            {filteredWatches.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-3">
                <p className="font-serif text-lg text-stone-300">No timepieces currently listed for {selectedBrand}</p>
                <p className="text-xs">Add a timepiece using the button above or browse other brands.</p>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => onAddWatch && onAddWatch({ brand: selectedBrand, category: 'Automatic' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First {selectedBrand} Watch</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 mt-6">
                {filteredWatches.map((watch) => (
                  <div
                    key={watch._id || watch.id}
                    data-watch-card="true"
                    className="group relative flex flex-col rounded-2xl bg-white border border-[#DDD5C7] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 text-[#1A1A1A]"
                  >
                    {/* Watch Photography */}
                    <div className="relative aspect-square bg-[#FAF7F2] p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={getFullImageUrl(watch.image)}
                        alt={watch.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1610006329898-2a4f12019450?auto=format&fit=crop&w=600&q=80';
                        }}
                      />

                      {/* In Stock Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          watch.inStock !== false ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${watch.inStock !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {watch.inStock !== false ? 'In Stock' : 'Special Order'}
                        </span>
                      </div>

                      {/* Admin Action Buttons */}
                      {isEditMode && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditWatch && onEditWatch(watch);
                            }}
                            className="p-1.5 rounded-lg bg-brass-600 hover:bg-brass-500 text-white shadow-md hover:scale-110 transition-transform"
                            title="Edit this watch details, price & photo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteWatch && onDeleteWatch(watch);
                            }}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
                            title="Delete this watch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Details */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 bg-white">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-brass-800 font-bold block">
                          {watch.brand}
                        </span>
                        <h4 className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A] line-clamp-1 mt-0.5">
                          {watch.name}
                        </h4>
                        <p className="text-[11px] text-[#6B635B] line-clamp-2 mt-1 leading-relaxed">
                          {watch.description || `${watch.movement || 'Automatic Movement'} • ${watch.strapType || watch.strap || 'Leather Strap'}`}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
                        <div>
                          <span className="font-serif text-xs sm:text-sm font-bold text-[#1A1A1A] block">
                            ₹{watch.price?.toLocaleString('en-IN') || 'Price On Request'}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold block">
                            ✓ Golghar Showrooms
                          </span>
                        </div>

                        {isEditMode ? (
                          <button
                            type="button"
                            onClick={() => onEditWatch && onEditWatch(watch)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-brass-700 bg-brass-500/10 hover:bg-brass-500/20 border border-brass-600/30 transition-all flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onQuickView && onQuickView(watch)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#1A1A1A] bg-[#F5F2EB] hover:bg-[#EAE4D7] border border-[#DDD5C7] transition-all"
                          >
                            Specs
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Watch Card at end of grid */}
                {isEditMode && (
                  <div
                    onClick={() => onAddWatch && onAddWatch({ brand: selectedBrand, category: 'Automatic' })}
                    className="min-h-[260px] rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400 bg-white/5 hover:bg-white/10 transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-400/20 group-hover:bg-amber-400 group-hover:text-stone-950 text-amber-300 flex items-center justify-center mb-2 transition-colors shadow-sm">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Add {selectedBrand} Watch
                    </span>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Add a new timepiece to this showroom collection
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Helper Bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
              <span>{isEditMode ? 'Hover over any card to Edit or Delete • Changes save instantly' : 'Tap any watch card to inspect specifications & showroom location'}</span>
              <span className="text-amber-400/80 font-medium">Click outside or press Close to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
