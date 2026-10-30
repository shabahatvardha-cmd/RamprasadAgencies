import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Award, Edit2, Sparkles, X, Plus, Trash2, Eye, Flame, Zap, Check } from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../../utils/defaults';
import { FALLBACK_WATCHES } from '../../data/fallbackWatches';
import { getFullImageUrl } from '../../utils/api';

export const BRAND_REFERENCE_IMAGES = {
  titan: '/images/brands/titan.webp',
  hmt: '/images/brands/hmt.webp',
  fastrack: '/images/brands/fastrack.webp',
  sonata: '/images/brands/sonata.webp',
  tissot: '/images/brands/tissot.webp',
  omega: '/images/brands/omega.webp',
  seiko: '/images/brands/seiko.webp',
  citizen: '/images/brands/citizen.webp',
  breitling: '/images/brands/breitling.webp',
  rado: '/images/brands/rado.webp',
  fossil: '/images/brands/fossil.webp',
  raga: '/images/brands/raga.webp',
  'titan raga': '/images/brands/raga.webp',
};

export const getBrandReferenceImage = (brandName, customImage) => {
  if (customImage && typeof customImage === 'string' && customImage.trim() !== '') {
    return customImage;
  }
  const key = (brandName || '').toLowerCase().trim();
  if (BRAND_REFERENCE_IMAGES[key]) {
    return BRAND_REFERENCE_IMAGES[key];
  }
  for (const [k, localPath] of Object.entries(BRAND_REFERENCE_IMAGES)) {
    if (key.includes(k) || k.includes(key)) {
      return localPath;
    }
  }
  return '/images/brands/default.webp';
};

export const IMPORTED_BRANDS = [
  // 1. Featured Brands (4 brands)
  { name: 'Titan', country: 'India', category: 'featured' },
  { name: 'Titan Raga', country: 'India', category: 'featured' },
  { name: 'Omega', country: 'Swiss', category: 'featured' },
  { name: 'Rado', country: 'Swiss', category: 'featured' },

  // 2. Trending Brands (4 brands)
  { name: 'Tissot', country: 'Swiss', category: 'trending' },
  { name: 'Breitling', country: 'Swiss', category: 'trending' },
  { name: 'Seiko', country: 'Japan', category: 'trending' },
  { name: 'Fossil', country: 'USA', category: 'trending' },

  // 3. Fresh Drop Brands (4 brands)
  { name: 'Citizen', country: 'Japan', category: 'fresh_drop' },
  { name: 'HMT', country: 'India', category: 'fresh_drop' },
  { name: 'Fastrack', country: 'India', category: 'fresh_drop' },
  { name: 'Sonata', country: 'India', category: 'fresh_drop' },
];

export const SECTIONS_CONFIG = [
  {
    id: 'featured',
    label: 'Featured',
    icon: Award,
    gradient: 'from-[#8C6627] via-[#D4AF37] to-[#694B1B]',
    borderGradient: 'from-[#D4AF37] via-[#E2B755]/50 to-transparent',
    iconBg: 'from-[#E2B755] via-[#D4AF37] to-[#8C6627]',
    iconColor: 'text-[#FDE68A]',
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: Flame,
    gradient: 'from-[#9A3412] via-[#EA580C] to-[#C2410C]',
    borderGradient: 'from-[#EA580C] via-[#FB923C]/50 to-transparent',
    iconBg: 'from-[#FB923C] via-[#EA580C] to-[#9A3412]',
    iconColor: 'text-[#FED7AA]',
  },
  {
    id: 'fresh_drop',
    label: 'Fresh Drops',
    icon: Zap,
    gradient: 'from-[#115E59] via-[#0D9488] to-[#059669]',
    borderGradient: 'from-[#0D9488] via-[#2DD4BF]/50 to-transparent',
    iconBg: 'from-[#2DD4BF] via-[#0D9488] to-[#115E59]',
    iconColor: 'text-[#99F6E4]',
  },
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
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const showcaseRef = useRef(null);

  const brandList = useMemo(() => {
    if (brands && Array.isArray(brands) && brands.length > 0) {
      const result = [];
      const seen = new Set();
      brands.forEach((b) => {
        const bName = typeof b === 'string' ? b : b?.name;
        if (!bName) return;
        const norm = bName.toLowerCase().trim();
        if (seen.has(norm)) return;
        seen.add(norm);

        const match = IMPORTED_BRANDS.find(
          (item) => item.name.toLowerCase() === norm
        );

        if (match) {
          result.push({
            ...match,
            ...(typeof b === 'object' ? b : {}),
          });
        } else if (typeof b === 'object') {
          result.push({
            name: b.name,
            country: b.country || 'Global',
            category: b.category || 'featured',
            desc: b.desc || '',
            image: b.image || null,
            ...b,
          });
        } else {
          result.push({
            name: bName,
            country: 'Global',
            category: 'featured',
          });
        }
      });
      if (result.length > 0) {
        return result;
      }
    }
    return IMPORTED_BRANDS;
  }, [brands]);

  // Group brands into the three parts
  const groupedBrands = useMemo(() => {
    const groups = {
      featured: [],
      trending: [],
      fresh_drop: [],
    };

    brandList.forEach((b) => {
      const cat = b.category || 'featured';
      if (groups[cat]) {
        groups[cat].push(b);
      } else {
        groups.featured.push(b);
      }
    });

    return groups;
  }, [brandList]);

  // Dynamic grid column class based on item count so NO blank spaces are ever left
  const getGridClass = (count) => {
    if (count === 5) {
      return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5';
    }
    if (count === 4) {
      return 'grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4.5';
    }
    if (count === 6) {
      return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4.5';
    }
    if (count === 3) {
      return 'grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4.5';
    }
    return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4.5';
  };

  // Combine store watches with comprehensive fallback data so every brand has rich watches
  const displayWatches = useMemo(() => {
    if (!watches || watches.length === 0) return FALLBACK_WATCHES;
    const existingIds = new Set();
    const existingNames = new Set();
    const merged = [];

    // Prioritize watches from props (includes live edits from backend)
    watches.forEach((w) => {
      if (w.id) existingIds.add(w.id);
      if (w._id) existingIds.add(w._id);
      if (w.name) existingNames.add(w.name.toLowerCase().trim());
      merged.push(w);
    });

    // Supplement with fallbackWatches
    FALLBACK_WATCHES.forEach((fw) => {
      const idMatch = (fw.id && existingIds.has(fw.id)) || (fw._id && existingIds.has(fw._id));
      const nameMatch = fw.name && existingNames.has(fw.name.toLowerCase().trim());
      if (!idMatch && !nameMatch) {
        merged.push(fw);
      }
    });

    return merged;
  }, [watches]);

  const isBrandActive = Boolean(selectedBrand && selectedBrand !== 'ALL');

  // Filter watches strictly for the active brand
  const filteredWatches = useMemo(() => {
    if (!isBrandActive) return [];
    const sel = selectedBrand.toLowerCase().trim();
    return displayWatches.filter((w) => {
      const b = (w.brand || '').toLowerCase().trim();
      if (sel === 'titan') return b === 'titan';
      if (sel === 'titan raga' || sel === 'raga') return b === 'titan raga' || b === 'raga';
      if (sel === 'tag heuer' || sel === 'tag-heuer') return b === 'tag heuer' || b === 'tag-heuer';
      return b === sel || b.replace(/\s+/g, '-') === sel || (w.name || '').toLowerCase().includes(sel);
    });
  }, [displayWatches, selectedBrand, isBrandActive]);

  // Smooth scroll into showcase when brand selected
  useEffect(() => {
    if (isBrandActive && showcaseRef.current) {
      const timer = setTimeout(() => {
        showcaseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedBrand, isBrandActive]);

  // Render a small, compact, sleek brand card (IDENTICAL TO FRONTEND STOREFRONT)
  const renderCard = (b, index, totalInGroup) => {
    const bName = typeof b === 'string' ? b : b.name;
    const bCountry = typeof b === 'object' ? b.country : null;
    const bImage = typeof b === 'object' ? b.image : null;
    const isSelected = selectedBrand?.toLowerCase() === bName.toLowerCase();
    const brandImg = getBrandReferenceImage(bName, bImage);
    const slug = bName.toLowerCase().trim().replace(/\s+/g, '-');

    // On mobile (2-column grid), if count is odd (like 5), the last card spans 2 columns
    const isOddLast = totalInGroup % 2 === 1 && index === totalInGroup - 1;
    const spanClass = isOddLast ? 'col-span-2 sm:col-span-1' : '';

    return (
      <div
        key={bName}
        onClick={() => setSelectedBrand(isSelected ? 'ALL' : bName)}
        className={`group relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[130px] sm:min-h-[145px] md:min-h-[160px] max-h-[185px] rounded-xl overflow-hidden bg-[#141312] border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between p-3 sm:p-4 text-left cursor-pointer ${spanClass} ${isSelected
          ? 'ring-4 ring-amber-400 border-amber-400 shadow-2xl scale-[1.02]'
          : 'border-[#DDD5C7]/80 hover:border-amber-400 shadow-md hover:shadow-xl'
          }`}
      >
        {/* 1. Full-Bleed Reference Watch Image with Smooth Zoom */}
        <img
          src={brandImg}
          alt={`${bName} watch`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-108"
          onError={(e) => {
            e.target.src = '/images/brands/default.webp';
          }}
        />

        {/* 2. Gradient Overlay for Clean Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none group-hover:from-black/95 transition-all duration-300" />

        {/* 3. Top Row: Origin Flag Pill Badge + Manage/Select Pill */}
        <div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
          {bCountry && (
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-black/55 backdrop-blur-xs text-amber-200/90 border border-white/15 shadow-xs">
              {bCountry === 'India'
                ? '🇮🇳 India'
                : bCountry === 'Swiss'
                  ? '🇨🇭 Swiss'
                  : bCountry === 'Japan'
                    ? '🇯🇵 Japan'
                    : bCountry === 'USA'
                      ? '🇺🇸 USA'
                      : bCountry}
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${isSelected
              ? 'bg-amber-400 text-stone-950 font-black'
              : 'text-amber-300/80 bg-black/40 border border-white/15 group-hover:bg-amber-400 group-hover:text-stone-950'
              }`}
          >
            {isSelected ? 'Selected ✓' : 'Manage 20 Watches →'}
          </span>
        </div>

        {/* 4. Bottom Row: Brand Name Displayed Elegantly */}
        <div className="relative z-10 w-full pointer-events-none">
          <h4 className="font-serif text-base sm:text-lg md:text-xl font-black tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all duration-300 truncate">
            {bName}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <section id="brands" className="py-10 sm:py-14 border-b border-[#E8E1D5] bg-[#F6F2EB]">
      {/* 1. Main Header */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD5C7] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Brands
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-900 border border-amber-400/40">
                Live Studio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5">
              Click any brand to manage its flagship models, edit prices, descriptions, and view live storefront pages.
            </p>
          </div>

          {/* Action & Filter Cluster */}
          <div className="flex items-center gap-2.5">
            {isEditMode && onOpenEdit && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenEdit('brands')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md hover:scale-105 transition-all border border-amber-300/40 cursor-pointer"
                  title="Add a new brand to the store portfolio"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add New Brand</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEdit('branding')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold bg-[#2A2622] hover:bg-[#3D3731] text-amber-200 shadow-md hover:scale-105 transition-all border border-amber-400/30 cursor-pointer"
                  title="Edit Authorized Brands Portfolio"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Manage Brands</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Three Divided Sections Grid (MATCHES FRONTEND EXACTLY) */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8 sm:space-y-10">
        {SECTIONS_CONFIG.map((sec) => {
          const list = groupedBrands[sec.id] || [];
          if (list.length === 0) return null;

          const Icon = sec.icon;

          return (
            <div key={sec.id} className="space-y-3.5 sm:space-y-4">
              {/* Stylish & Attractive Section Title */}
              <div className="relative pb-2.5 border-b border-[#E2DBD0]">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Luxury Metallic Crest */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${sec.iconBg} p-[1px] shadow-2xs flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="w-full h-full bg-[#181614] rounded-[7px] flex items-center justify-center">
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${sec.iconColor}`} />
                    </div>
                  </div>

                  {/* The Stylish Word */}
                  <h4 className="font-serif text-lg sm:text-xl lg:text-2xl font-black text-stone-900 tracking-tight">
                    {sec.label}
                  </h4>
                </div>

                {/* Luminous accent underline directly anchored beneath the title */}
                <div
                  className={`absolute -bottom-[1px] left-0 h-[2px] w-28 sm:w-40 bg-gradient-to-r ${sec.borderGradient} rounded-full`}
                />
              </div>

              {/* Dynamic Grid: Auto-fills columns so NO blank space is ever left */}
              <div className={getGridClass(list.length)}>
                {list.map((b, idx) => renderCard(b, idx, list.length))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. On-Demand Showcase: Appears when a brand is clicked */}
      {isBrandActive && (
        <div
          ref={showcaseRef}
          id="brand-showcase"
          className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-10 sm:mt-14 animate-fade-in"
        >
          <div className="rounded-2xl bg-[#141312] border border-[#302B24] p-5 sm:p-8 text-white shadow-2xl">
            {/* Showcase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gorakhpur Showroom Flagship Collection</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {selectedBrand} ({filteredWatches.length} Official Models)
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Click on any timepiece to edit specifications, change strap/calibre, update stock, or view live storefront.
                </p>
              </div>

              {/* Action Buttons: Open Page + Add Watch + Close */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
                <a
                  href={`http://localhost:5173/brand/${selectedBrand.toLowerCase().trim().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer no-underline"
                  title={`View dedicated ${selectedBrand} page in storefront`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View on Main Storefront ↗</span>
                </a>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => onAddWatch && onAddWatch({ brand: selectedBrand, category: 'Automatic' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    title={`Add new ${selectedBrand} timepiece`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {selectedBrand} Model</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedBrand('ALL')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-bold transition-all border border-white/15 cursor-pointer focus:outline-none"
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
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-6">
                {filteredWatches.map((w, idx) => {
                  const watchImg = getFullImageUrl(w.image);
                  return (
                    <div
                      key={w._id || w.id || idx}
                      className="group relative rounded-xl overflow-hidden bg-[#1E1C1A] border border-[#3E3830] hover:border-amber-400 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 border border-white/10">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {w.inStock !== false ? 'In Stock' : 'Sourcing'}
                        </span>
                      </div>

                      {/* Watch Image */}
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black/40 flex items-center justify-center p-2 mb-3">
                        <img
                          src={watchImg}
                          alt={w.name}
                          className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = '/images/brands/default.webp';
                          }}
                        />
                      </div>

                      {/* Watch Details */}
                      <div className="space-y-1 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-brass-400 block truncate">
                          {w.movement || w.category || 'Luxury Movement'}
                        </span>
                        <h5 className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-200">
                          {w.name}
                        </h5>
                        {w.sku && (
                          <span className="text-[10px] font-mono text-stone-400 block truncate">
                            Ref: {w.sku}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => onEditWatch && onEditWatch(w)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brass-600 hover:bg-brass-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        {onDeleteWatch && (
                          <button
                            type="button"
                            onClick={() => onDeleteWatch(w)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-800 text-red-300 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                            title="Delete watch"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
