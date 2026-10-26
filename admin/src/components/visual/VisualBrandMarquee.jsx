import React from 'react';
import { Award, Edit2 } from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../../utils/defaults';

export default function VisualBrandMarquee({ brands, isEditMode, onOpenEdit }) {
  const brandList = (brands && Array.isArray(brands) && brands.length > 0)
    ? brands
    : DEFAULT_VINTAGE_STORE_DATA.brands;

  return (
    <div className="relative group/brands w-full bg-[#EDE7DE] py-7 border-b border-[#DDD5C7] overflow-hidden">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && onOpenEdit && (
        <div className="absolute top-2.5 right-4 z-40">
          <button
            onClick={() => onOpenEdit('branding')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-lg hover:scale-105 transition-all border border-white/30"
            title="Edit Authorized Brands Portfolio"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Brand Portfolio</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-3.5 flex items-center justify-center gap-2">
        <Award className="w-3.5 h-3.5 text-brass-700" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5A524A]">
          Authorized Horological Portfolios • 100% Genuine Stamped Warranty
        </span>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-8 gap-y-3 px-4 max-w-6xl mx-auto">
        {brandList.map((brand, idx) => {
          const brandName = typeof brand === 'string' ? brand : brand.name;
          const country = typeof brand === 'object' ? brand.country : null;
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 font-serif text-sm sm:text-base font-bold tracking-widest text-[#6B635B] hover:text-[#1A1A1A] transition-colors cursor-default"
            >
              <span>{brandName.toUpperCase()}</span>
              {country && (
                <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#E4DDD1] text-brass-800">
                  {country}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
