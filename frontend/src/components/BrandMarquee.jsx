import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Zap, Award } from 'lucide-react';

export const BRAND_REFERENCE_IMAGES = {
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
  cartier: '/images/brands/cartier.webp',
  'tag heuer': '/images/brands/tag-heuer.webp',
  'tag-heuer': '/images/brands/tag-heuer.webp',
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

  // 2. Trending Brands (5 brands - Breitling moved here, nothing interchanged)
  { name: 'Tissot', country: 'Swiss', category: 'trending' },
  { name: 'Breitling', country: 'Swiss', category: 'trending' },
  { name: 'Seiko', country: 'Japan', category: 'trending' },
  { name: 'Casio', country: 'Japan', category: 'trending' },
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

export default function BrandMarquee({
  brands,
  onSelectBrand,
}) {
  const brandList = useMemo(() => {
    return brands && Array.isArray(brands) && brands.length > 0
      ? brands.map((b) => {
        if (typeof b === 'object' && b.category) return b;
        const bName = typeof b === 'string' ? b : b.name;
        const match = IMPORTED_BRANDS.find(
          (item) => item.name.toLowerCase() === (bName || '').toLowerCase()
        );
        return match || { name: bName, country: 'Import', category: 'featured' };
      })
      : IMPORTED_BRANDS;
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

  // Render a small, compact, sleek brand card
  const renderCard = (b, index, totalInGroup) => {
    const bName = typeof b === 'string' ? b : b.name;
    const bCountry = typeof b === 'object' ? b.country : null;
    const bImage = typeof b === 'object' ? b.image : null;
    const brandImg = getBrandReferenceImage(bName, bImage);
    const slug = bName.toLowerCase().trim().replace(/\s+/g, '-');

    // On mobile (2-column grid), if count is odd (like 5), the last card spans 2 columns
    const isOddLast = totalInGroup % 2 === 1 && index === totalInGroup - 1;
    const spanClass = isOddLast ? 'col-span-2 sm:col-span-1' : '';

    return (
      <Link
        key={bName}
        to={`/brand/${slug}`}
        onClick={() => onSelectBrand && onSelectBrand(bName)}
        className={`group relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[130px] sm:min-h-[145px] md:min-h-[160px] max-h-[185px] rounded-xl overflow-hidden bg-[#141312] border border-[#DDD5C7]/80 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between p-3 sm:p-4 text-left no-underline block cursor-pointer ${spanClass}`}
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

        {/* 3. Top Row: Origin Flag Pill Badge */}
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
          <span className="text-[10px] font-bold text-amber-300/0 group-hover:text-amber-300 transition-colors duration-300 hidden sm:inline-block">
            View →
          </span>
        </div>

        {/* 4. Bottom Row: Brand Name Displayed Elegantly */}
        <div className="relative z-10 w-full pointer-events-none">
          <h4 className="font-serif text-base sm:text-lg md:text-xl font-black tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all duration-300 truncate">
            {bName}
          </h4>
        </div>
      </Link>
    );
  };

  return (
    <section id="brands" className="py-10 sm:py-14 border-b border-[#E8E1D5] bg-[#F6F2EB]">
      {/* 1. Main Header */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD5C7] pb-4">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Brands
            </h3>
            <p className="text-xs sm:text-sm text-[#6B635B] mt-0.5">
              Select any brand to view Men's, Women's, and Unisex collections in Gorakhpur showrooms.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Equal Divided Sections Grid: No blank spaces left */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-8 sm:space-y-10">
        {SECTIONS_CONFIG.map((sec) => {
          const list = groupedBrands[sec.id] || [];
          if (list.length === 0) return null;

          const Icon = sec.icon;

          return (
            <div key={sec.id} className="space-y-4 sm:space-y-5">
              {/* Attractive Section Title */}
              <div className="relative pb-2.5 border-b border-[#E2DBD0]">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {/* Luxury Metallic Crest */}
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${sec.iconBg} p-[1.5px] shadow-sm flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                  >
                    <div className="w-full h-full bg-[#181614] rounded-[6.5px] flex items-center justify-center">
                      <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${sec.iconColor}`} />
                    </div>
                  </div>

                  {/* Section Title */}
                  <h4 className="font-serif text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {sec.label}
                  </h4>
                </div>

                {/* Accent underline */}
                <div
                  className={`absolute -bottom-[1px] left-0 h-[2px] w-28 sm:w-40 bg-gradient-to-r ${sec.borderGradient} rounded-full`}
                />
              </div>

              {/* Compact Small Brand Cards Grid - 100% full, no blank spaces */}
              <div className={getGridClass(list.length)}>
                {list.map((b, idx) => renderCard(b, idx, list.length))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
