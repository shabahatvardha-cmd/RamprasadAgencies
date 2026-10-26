import React from 'react';
import { Sparkles, ArrowRight, Watch, Award, Compass, Edit2 } from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';

export default function VisualCategoryGrid({ categories, isEditMode, onOpenEdit }) {
  const categoryList = Array.isArray(categories) ? categories : [];

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'cat-swiss':
        return <Award className="w-5 h-5 text-brass-400" />;
      case 'cat-japanese':
        return <Sparkles className="w-5 h-5 text-brass-400" />;
      case 'cat-chronos':
        return <Compass className="w-5 h-5 text-brass-400" />;
      case 'cat-skeletons':
        return <Watch className="w-5 h-5 text-brass-400" />;
      default:
        return <Watch className="w-5 h-5 text-brass-400" />;
    }
  };

  return (
    <section id="categories" className="relative w-full py-14 sm:py-20 bg-[#F5F2EB] border-b border-[#E8E1D5] overflow-hidden">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => onOpenEdit('categories')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Edit Category Photos, Subtitles, Titles, and Counts"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit 4 Horology Pillars</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest badge-brass">
            <Sparkles className="w-3 h-3 text-brass-700" />
            <span>Curated Horology Pillars</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A]">
            Shop By Horological Movement & Style
          </h2>

          <p className="text-xs sm:text-sm text-[#6B635B] font-normal leading-relaxed">
            From certified Swiss chronometers and Japanese Presage automatics to split-second racing tachymeters and skeletonized open-heart calibers.
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categoryList.map((cat) => {
            const catImage = getFullImageUrl(cat.image);
            return (
              <div
                key={cat.id}
                className="group relative h-[360px] sm:h-[420px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl border border-[#DDD5C7] hover:border-brass-600 transition-all duration-500"
              >
                {/* Background Lifestyle Image */}
                <img
                  src={catImage}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.60] group-hover:brightness-[0.50]"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>

                {/* Top Pillar Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-white/95 text-brass-800 border border-brass-600/30 shadow-sm backdrop-blur-md">
                    {cat.tag || 'Handcrafted'}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white/95 border border-brass-600/30 flex items-center justify-center shadow-sm backdrop-blur-md text-brass-700">
                    {getCategoryIcon(cat.id)}
                  </div>
                </div>

                {/* Bottom Content Card */}
                <div className="absolute bottom-3 left-3 right-3 p-4 sm:p-5 z-10 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 shadow-xl flex flex-col justify-end space-y-1.5 transition-all group-hover:bg-black/85">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brass-300 font-bold">
                    {cat.itemCount || 'Curated Collection'}
                  </span>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-brass-200 transition-colors drop-shadow-sm">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-cream-200/90 line-clamp-2 leading-relaxed font-normal">
                    {cat.subtitle}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brass-300 group-hover:text-brass-200 group-hover:translate-x-1 transition-all">
                    <span>Explore Pillar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
