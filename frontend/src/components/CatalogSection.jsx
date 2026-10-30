import React, { useState, useMemo, useEffect } from 'react';
import WatchCard from './WatchCard';
import WatchModal from './WatchModal';
import { Search, Sparkles, RefreshCcw, ArrowUpDown, Filter, Award, Compass, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = [
  'ALL',
  'Automatic',
  'Chronograph',
  'Dress',
  'Skeleton',
  'Diver',
];

const ORIGINS = [
  { id: 'ALL', label: 'All Collections', countLabel: 'All Watches' },
  { id: 'INDIAN', label: '🇮🇳 Indian Brands', sub: 'Titan, HMT, Fastrack, Sonata' },
  { id: 'SWISS', label: '🇨🇭 Swiss Luxury', sub: 'Omega, Tissot, Rado, Breitling' },
  { id: 'JAPANESE', label: '🇯🇵 Japanese Precision', sub: 'Seiko Presage, Citizen' },
];

const INDIAN_BRAND_NAMES = ['titan', 'titan raga', 'titan-raga', 'raga', 'hmt', 'fastrack', 'sonata'];
const SWISS_BRAND_NAMES = ['omega', 'tissot', 'breitling', 'rado'];
const JAPANESE_BRAND_NAMES = ['seiko', 'citizen'];

import { FALLBACK_WATCHES } from '../data/fallbackWatches';


export default function CatalogSection({
  watches = [],
  selectedBrand,
  onSelectBrand,
  contactPhone = '+91 98765 43210',
  selectedCategory = 'ALL',
  onSelectCategory,
  searchQuery = '',
  onSearchQuery,
  wishlist = [],
  onToggleWishlist,
}) {
  const [selectedOrigin, setSelectedOrigin] = useState('ALL'); // 'ALL' | 'INDIAN' | 'SWISS' | 'JAPANESE'
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'name_asc' | 'brand_asc'
  const [activeModalWatch, setActiveModalWatch] = useState(null);

  // If backend catalog has watches, merge them with defaults so user gets full Indian & Swiss selection
  const displayWatches = useMemo(() => {
    if (!watches || watches.length === 0) return FALLBACK_WATCHES;
    const existingNames = new Set(watches.map((w) => (w.name || '').toLowerCase().trim()));
    const existingImages = new Set(watches.map((w) => (w.image || '').trim()).filter(Boolean));
    const nonDups = FALLBACK_WATCHES.filter(
      (fw) =>
        !existingNames.has((fw.name || '').toLowerCase().trim()) &&
        !existingImages.has((fw.image || '').trim())
    );
    return [...watches, ...nonDups];
  }, [watches]);

  // Filter & sort pipeline
  const filteredWatches = useMemo(() => {
    let result = displayWatches.filter((w) => {
      const brandLower = (w.brand || '').toLowerCase();

      // Origin filter
      if (selectedOrigin === 'INDIAN') {
        const isIndian = INDIAN_BRAND_NAMES.some((b) => brandLower.includes(b));
        if (!isIndian) return false;
      } else if (selectedOrigin === 'SWISS') {
        const isSwiss = SWISS_BRAND_NAMES.some((b) => brandLower.includes(b));
        if (!isSwiss) return false;
      } else if (selectedOrigin === 'JAPANESE') {
        const isJapanese = JAPANESE_BRAND_NAMES.some((b) => brandLower.includes(b));
        if (!isJapanese) return false;
      }

      // Category filter
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'ALL' ||
        (w.category && w.category.toLowerCase() === selectedCategory.toLowerCase());

      // Brand filter
      const matchesBrand =
        !selectedBrand ||
        selectedBrand === 'ALL' ||
        (w.brand && w.brand.toLowerCase() === selectedBrand.toLowerCase());

      // In stock filter
      const matchesStock = !inStockOnly || w.inStock;

      // Multi-token keyword search across all watch metadata
      const rawQuery = (searchQuery || '').toLowerCase().trim();
      let matchesSearch = true;
      if (rawQuery) {
        const tokens = rawQuery.split(/\s+/).filter(Boolean);
        const searchableFields = [
          w.name,
          w.brand,
          w.category,
          w.movement,
          w.description,
          w.strapType,
          w.caseDiameter,
          w.showroomLocation,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());

        matchesSearch = tokens.every((token) =>
          searchableFields.some((field) => field.includes(token))
        );
      }

      return matchesCategory && matchesBrand && matchesStock && matchesSearch;
    });

    if (sortBy === 'name_asc') {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'brand_asc') {
      result = [...result].sort((a, b) => (a.brand || '').localeCompare(b.brand || ''));
    }

    return result;
  }, [displayWatches, selectedOrigin, selectedCategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  // Downward pagination: show 8 initially (2 rows on desktop, 4 on mobile)
  const [visibleCount, setVisibleCount] = useState(8);

  // Reset pagination whenever user changes filters
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedOrigin, selectedCategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  const displayedWatches = filteredWatches.slice(0, visibleCount);
  const hasMore = filteredWatches.length > visibleCount;

  return (
    <section id="catalog" className="py-14 sm:py-20 bg-[#141312] border-t border-[#302B24] text-white">
      {/* Modal Quick View */}
      {activeModalWatch && (
        <WatchModal
          watch={activeModalWatch}
          onClose={() => setActiveModalWatch(null)}
          contactPhone={contactPhone}
        />
      )}

      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-5 sm:pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Timepiece Catalog • Gorakhpur Showrooms</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              Explore By Brand & Heritage Sections
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Carefully organized collections for easy customer browsing: Indian pride (Titan, HMT, Fastrack, Sonata), certified Swiss chronometers, and Japanese automatics. Tap any watch to view specs or inquire directly on WhatsApp.
            </p>
          </div>

          {/* Quick Active Filters & Count */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-stone-400">
              Curated Timepiece Showcase
            </span>
            {selectedBrand && selectedBrand !== 'ALL' && (
              <button
                onClick={() => onSelectBrand && onSelectBrand('ALL')}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 hover:text-white"
              >
                <span>Brand: {selectedBrand}</span>
                <span className="font-bold">×</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. ORIGIN & SECTION PILL TABS (Indian, Swiss, Japanese, All) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {ORIGINS.map((origin) => {
            const active = selectedOrigin === origin.id;
            return (
              <button
                key={origin.id}
                onClick={() => setSelectedOrigin(origin.id)}
                className={`flex flex-col text-left px-4 py-2.5 rounded-2xl border transition-all shrink-0 ${active
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 border-amber-300 scale-[1.02]'
                    : 'bg-stone-900/90 text-stone-300 hover:text-white border-white/10 hover:border-amber-500/40'
                  }`}
              >
                <span className="text-xs sm:text-sm font-extrabold tracking-wide">
                  {origin.label}
                </span>
                {origin.sub && (
                  <span className={`text-[10px] ${active ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                    {origin.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. Secondary Filter Controls: Horology Category & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 pt-1">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory && onSelectCategory(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold whitespace-nowrap transition-all ${active
                      ? 'bg-white text-stone-950 shadow-md font-bold'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-white/5 hover:border-amber-500/40'
                    }`}
                >
                  {cat === 'ALL' ? 'All Movements' : cat}
                </button>
              );
            })}
          </div>

          {/* Search, Stock, & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search Titan, HMT, Tissot, Seiko..."
                value={searchQuery || ''}
                onChange={(e) => onSearchQuery && onSearchQuery(e.target.value)}
                className="w-full bg-stone-900 border border-white/15 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchQuery && onSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-stone-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </div>

            {/* In-Stock and Sort side-by-side */}
            <div className="flex items-center gap-2">
              {/* In-Stock Toggle */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${inStockOnly
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-stone-900 text-stone-400 hover:text-white border-white/10'
                  }`}
              >
                <span className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-emerald-400' : 'bg-stone-500'}`}></span>
                <span>In-Stock</span>
              </button>

              {/* Sort Select */}
              <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-stone-900 border border-white/15 rounded-xl px-3 py-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-stone-200 focus:outline-none cursor-pointer w-full"
                >
                  <option value="featured" className="bg-stone-950">Recommended</option>
                  <option value="name_asc" className="bg-stone-950">Model Name (A–Z)</option>
                  <option value="brand_asc" className="bg-stone-950">Brand (A–Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Grid */}
        {filteredWatches.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl p-8 space-y-4">
            <p className="font-serif text-xl font-bold text-stone-300">No timepieces match your active selection</p>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Try choosing "All Collections" or clearing your search. We also source specific references on request.
            </p>
            <button
              onClick={() => {
                setSelectedOrigin('ALL');
                onSelectCategory && onSelectCategory('ALL');
                onSelectBrand && onSelectBrand('ALL');
                onSearchQuery && onSearchQuery('');
                setInStockOnly(false);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-extrabold bg-amber-500 text-stone-950 hover:bg-amber-400"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-5 lg:gap-6">
              {displayedWatches.map((watch) => (
                <WatchCard
                  key={watch._id || watch.id}
                  watch={watch}
                  onQuickView={setActiveModalWatch}
                  contactPhone={contactPhone}
                  isWishlisted={wishlist.some((w) => w._id === watch._id || w.id === watch._id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>

            {/* Downward "See More" Action */}
            {hasMore && (
              <div className="pt-4 flex items-center justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all group"
                >
                  <span>See More</span>
                  <ChevronDown className="w-4 h-4 text-stone-950 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            )}

            {!hasMore && filteredWatches.length > 8 && (
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    setVisibleCount(8);
                    const el = document.getElementById('catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900 border border-white/10 text-stone-300 hover:text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-all"
                >
                  <span>See Less</span>
                  <ChevronUp className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
