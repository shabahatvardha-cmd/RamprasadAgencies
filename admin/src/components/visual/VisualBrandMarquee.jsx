import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Award, Edit2, Sparkles, X, Plus, Trash2, Eye, Flame, Zap } from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../../utils/defaults';
import { FALLBACK_WATCHES } from '../../data/fallbackWatches';
import { getFullImageUrl } from '../../utils/api';

const DEFAULT_BRANDS = [
  // 1. Featured Brands
  {
    name: 'Titan',
    country: 'India',
    desc: 'Edge Ceramic, Octane & Regalia Flagships',
    category: 'featured',
  },
  {
    name: 'Titan Raga',
    country: 'India',
    desc: 'Jewelry & Floral Designer Horology',
    category: 'featured',
  },
  {
    name: 'Omega',
    country: 'Swiss',
    desc: 'Moonwatch & Co-Axial Master Chronometers',
    category: 'featured',
  },
  {
    name: 'Rado',
    country: 'Swiss',
    desc: 'Master of High-Tech Ceramic & Captain Cook',
    category: 'featured',
  },

  // 2. Trending Brands (5 brands - Breitling moved here)
  {
    name: 'Tissot',
    country: 'Swiss',
    desc: 'PRX & Heritage Swiss Precision',
    category: 'trending',
  },
  {
    name: 'Breitling',
    country: 'Swiss',
    desc: 'Navitimer Aviation Chronographs & Superocean',
    category: 'trending',
  },
  {
    name: 'Seiko',
    country: 'Japan',
    desc: 'Automatic & Presage Craft',
    category: 'trending',
  },
  {
    name: 'Casio',
    country: 'Japan',
    desc: 'Edifice Solar & Vintage Steel Chronos',
    category: 'trending',
  },
  {
    name: 'Fossil',
    country: 'USA',
    desc: 'Heritage Automatics & Vintage Styling',
    category: 'trending',
  },

  // 3. Fresh Drop Brands (4 brands)
  {
    name: 'Citizen',
    country: 'Japan',
    desc: 'Tsuyosa Automatics & Eco-Drive Calibers',
    category: 'fresh_drop',
  },
  {
    name: 'HMT',
    country: 'India',
    desc: 'Kohinoor & Janata Mechanical Heritage',
    category: 'fresh_drop',
  },
  {
    name: 'Fastrack',
    country: 'India',
    desc: 'Youth Sport & Street Chronographs',
    category: 'fresh_drop',
  },
  {
    name: 'Sonata',
    country: 'India',
    desc: 'Everyday Reliable Indian Horology',
    category: 'fresh_drop',
  },
];

const BRAND_REFERENCE_IMAGES = {
  titan: '/images/brands/titan.webp',
  hmt: '/images/brands/hmt.webp',
  fastrack: '/images/brands/fastrack.webp',
  sonata: '/images/brands/sonata.webp',
  tissot: '/images/brands/tissot.webp',
  omega: '/images/brands/omega.webp',
  seiko: '/images/brands/seiko.webp',
  citizen: '/images/brands/citizen.webp',
  casio: '/images/brands/casio.webp',
  breitling: '/images/brands/breitling.webp',
  rado: '/images/brands/rado.webp',
  fossil: '/images/brands/fossil.webp',
  raga: '/images/brands/raga.webp',
  'titan raga': '/images/brands/raga.webp',
};

const getBrandReferenceImage = (brandName, customImage) => {
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

const SECTIONS_CONFIG = [
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
    return brands && Array.isArray(brands) && brands.length > 0
      ? brands.map((b) => {
        if (typeof b === 'object' && b.category) return b;
        const bName = typeof b === 'string' ? b : b.name;
        const match = DEFAULT_BRANDS.find(
          (item) => item.name.toLowerCase() === (bName || '').toLowerCase()
        );
        return match || { name: bName, country: 'Import', desc: 'Showroom Collection', category: 'featured' };
      })
      : DEFAULT_BRANDS;
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

  // Render a single large, clean watch card with ONLY the brand name
  const renderCard = (b) => {
    const bName = typeof b === 'string' ? b : b.name;
    const bImage = typeof b === 'object' ? b.image : null;
    const isSelected = selectedBrand?.toLowerCase() === bName.toLowerCase();
    const brandImg = getBrandReferenceImage(bName, bImage);

    return (
      <button
        key={bName}
        data-brand-btn="true"
        type="button"
        onClick={() => setSelectedBrand(isSelected ? 'ALL' : bName)}
        className={`group relative w-full aspect-[3/4] sm:min-h-[460px] lg:min-h-[500px] rounded-lg overflow-hidden bg-[#141312] border transition-all duration-500 hover:-translate-y-2 flex flex-col justify-end text-center cursor-pointer focus:outline-none ${isSelected
            ? 'ring-4 ring-amber-400 border-amber-400 shadow-2xl scale-[1.02]'
            : 'border-[#DDD5C7]/80 hover:border-brass-600 shadow-lg hover:shadow-2xl'
          }`}
      >
        {/* 1. Full-Bleed Reference Watch Image with Smooth Zoom */}
        <img
          src={brandImg}
          alt={`${bName} reference watch`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.style.opacity = '0.6';
          }}
        />

        {/* 2. Gradient Overlay for Clean Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none group-hover:from-black/90 group-hover:via-black/35 transition-all duration-500" />

        {/* 3. Selected Badge (Admin visual indicator only) */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-20">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-stone-950 text-xs font-bold shadow-lg ring-2 ring-white">
              ✓
            </span>
          </div>
        )}

        {/* 4. ONLY Brand Name Displayed Downward on the Image */}
        <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col items-center justify-end pointer-events-none">
          <h4 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] group-hover:text-amber-300 group-hover:scale-105 transition-all duration-300">
            {bName}
          </h4>
        </div>
      </button>
    );
  };

  return (
    <section id="brands" className="relative group/brands w-full py-10 sm:py-16 border-y border-[#E8E1D5] bg-[#F6F2EB] overflow-hidden">
      {/* 1. Top Header Row */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD5C7] pb-5">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Brands
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5">
              Select any brand to preview models or manage watches in your showrooms.
            </p>
          </div>

          {/* Action & Filter Cluster */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {isEditMode && onOpenEdit && (
              <button
                type="button"
                onClick={() => onOpenEdit('branding')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-md hover:scale-105 transition-all border border-white/30 cursor-pointer"
                title="Edit Authorized Brands Portfolio"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Brands</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Three Divided Sections Grid */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-10 sm:space-y-12">
        {SECTIONS_CONFIG.map((sec) => {
          const list = groupedBrands[sec.id] || [];
          if (list.length === 0) return null;

          const Icon = sec.icon;

          return (
            <div key={sec.id} className="space-y-6 sm:space-y-8">
              {/* Stylish & Attractive Section Title */}
              <div className="relative pb-3.5 border-b border-[#E2DBD0]">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Luxury Metallic Crest */}
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${sec.iconBg} p-[1.5px] shadow-sm flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="w-full h-full bg-[#181614] rounded-[9.5px] flex items-center justify-center">
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${sec.iconColor}`} />
                    </div>
                  </div>

                  {/* The Stylish Word */}
                  <h4 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight">
                    {sec.label}
                  </h4>
                </div>

                {/* Luminous accent underline directly anchored beneath the title */}
                <div
                  className={`absolute -bottom-[1px] left-0 h-[2.5px] w-36 sm:w-52 bg-gradient-to-r ${sec.borderGradient} rounded-full`}
                />
              </div>

              {/* Responsive Large 3-Column Watch Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {list.map((b) => renderCard(b))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. On-Demand Showcase: Appears ONLY when a brand is clicked */}
      {isBrandActive && (
        <div
          ref={showcaseRef}
          id="brand-showcase"
          className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mt-10 sm:mt-14 animate-fade-in"
        >
          <div className="rounded-xl bg-[#141312] border border-[#302B24] p-5 sm:p-8 text-white shadow-2xl">
            {/* Showcase Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gorakhpur Showroom Collection</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {selectedBrand} Timepieces ({filteredWatches.length} Models)
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Timepieces in stock at Baldev Plaza & JalKal Building showrooms
                </p>
              </div>

              {/* Action Buttons: Open Page + Add Watch + Close */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <a
                  href={`http://localhost:5173/brand/${selectedBrand.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer no-underline"
                  title={`View dedicated ${selectedBrand} page in storefront`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Dedicated Page ↗</span>
                </a>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => onAddWatch && onAddWatch({ brand: selectedBrand, category: 'Automatic' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all border border-white/15 cursor-pointer focus:outline-none"
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First {selectedBrand} Watch</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
                {filteredWatches.map((watch) => (
                  <div
                    key={watch._id || watch.id}
                    data-watch-card="true"
                    className="group relative flex flex-col rounded-lg bg-white border border-[#DDD5C7] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1 text-[#1A1A1A]"
                  >
                    {/* Watch Photography */}
                    <div className="relative aspect-square bg-[#FAF7F2] p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={getFullImageUrl(watch.image)}
                        alt={watch.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = '/images/watches/default-watch.webp';
                        }}
                      />

                      {/* In Stock Badge */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider ${watch.inStock !== false ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
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
                            className="p-1.5 rounded-sm bg-brass-600 hover:bg-brass-500 text-white shadow-md hover:scale-110 transition-transform"
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
                            className="p-1.5 rounded-sm bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
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
                            className="px-2.5 py-1 rounded-sm text-xs font-bold text-brass-700 bg-brass-500/10 hover:bg-brass-500/20 border border-brass-600/30 transition-all flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onQuickView && onQuickView(watch)}
                            className="px-2.5 py-1 rounded-sm text-xs font-semibold text-[#1A1A1A] bg-[#F5F2EB] hover:bg-[#EAE4D7] border border-[#DDD5C7] transition-all"
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
                    className="min-h-[260px] rounded-lg border-2 border-dashed border-white/20 hover:border-amber-400 bg-white/5 hover:bg-white/10 transition-all p-5 flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-sm bg-amber-400/20 group-hover:bg-amber-400 group-hover:text-stone-950 text-amber-300 flex items-center justify-center mb-2 transition-colors shadow-sm">
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
