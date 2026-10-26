import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Eye,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';
import { formatINR } from '../../utils/formatters';

export default function VisualCarouselSection({
  id,
  title,
  subtitle,
  badge = 'FEATURED CAPSULE',
  badgeColor = 'brass',
  items = [],
  isEditMode,
  onEditWatch,
  onDeleteWatch,
  onAddWatch,
  onQuickView,
  initialVisible = 4,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const watchList = Array.isArray(items) ? items : [];
  const hasMore = watchList.length > initialVisible;
  // If in edit mode, show all so admin can edit everything easily; otherwise respect isExpanded
  const visibleItems = isEditMode || isExpanded || !hasMore ? watchList : watchList.slice(0, initialVisible);
  const remainingCount = watchList.length - initialVisible;

  return (
    <section id={id} className="relative w-full py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#E8E1D5] overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Header Row: Title, Subtitle, Add Watch button & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E8E1D5]/70">
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest ${getBadgeClass()}`}>
              <Sparkles className="w-3 h-3 text-brass-700" />
              <span>{badge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A]">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#6B635B] font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#DDD5C7] text-xs font-semibold text-[#5A524A] shadow-sm">
              Showing {visibleItems.length} of {watchList.length}
            </span>

            {/* Visual Admin Add Watch Trigger */}
            {isEditMode && (
              <button
                onClick={() => onAddWatch && onAddWatch({ category: badgeColor === 'rust' ? 'Limited Edition' : 'Automatic' })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-md transition-all active:scale-95"
                title={`Add a new timepiece into ${title}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Timepiece</span>
              </button>
            )}
          </div>
        </div>

        {/* Downward Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {visibleItems.map((watch, index) => {
            const watchImg = getFullImageUrl(watch.image);
            const originalPrice = watch.originalPrice || (watch.price ? Math.round(watch.price * 1.15) : 0);

            return (
              <div
                key={watch.id || watch._id || index}
                className="w-full rounded-2xl bg-white border border-[#DDD5C7] hover:border-brass-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Watch Image Canvas */}
                <div className="relative aspect-square bg-[#F7F4EE] p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={watchImg}
                    alt={watch.name}
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Top Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      watch.inStock ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${watch.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {watch.inStock ? 'In Stock' : 'Special Order'}
                    </span>
                  </div>

                  {/* Visual In-Context Action Overlays for Admin */}
                  {isEditMode && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                      <button
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

                {/* Card Body Details */}
                <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brass-800 font-bold block">
                      {watch.brand || 'Luxury Horology'}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm lg:text-base font-bold text-[#1A1A1A] line-clamp-1 mt-0.5">
                      {watch.name}
                    </h3>
                    <p className="text-xs text-[#6B635B] line-clamp-2 mt-1 leading-relaxed">
                      {watch.description || `${watch.movement || 'Automatic Movement'} • ${watch.strap || 'Leather Strap'}`}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-xs sm:text-sm font-bold text-brass-900 block leading-tight">
                        Price Upon Request
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold block mt-0.5">
                        ✓ In Stock • Showroom
                      </span>
                    </div>

                    {isEditMode ? (
                      <button
                        onClick={() => onEditWatch && onEditWatch(watch)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-brass-700 bg-brass-500/10 hover:bg-brass-500/20 border border-brass-600/30 transition-all flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onQuickView && onQuickView(watch)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1A1A1A] bg-[#F5F2EB] hover:bg-[#EAE4D7] border border-[#DDD5C7] transition-all"
                      >
                        Quick View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final "Add Another Watch" card in edit mode */}
          {isEditMode && (
            <div
              onClick={() => onAddWatch && onAddWatch({ category: badgeColor === 'rust' ? 'Limited Edition' : 'Automatic' })}
              className="w-full min-h-[300px] rounded-2xl border-2 border-dashed border-[#DDD5C7] hover:border-brass-600 bg-white/40 hover:bg-brass-500/5 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-brass-500/10 group-hover:bg-brass-600 group-hover:text-white text-brass-700 flex items-center justify-center mb-3 transition-colors shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-serif text-sm font-bold text-[#1A1A1A] group-hover:text-brass-800 transition-colors">
                Add Timepiece
              </span>
              <p className="text-[11px] text-[#7A7268] mt-1">
                Insert a new watch into {title}
              </p>
            </div>
          )}
        </div>

        {/* Downward Expand Button for non-edit mode */}
        {!isEditMode && hasMore && (
          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#F2ECE1] text-[#1A1A1A] border-2 border-brass-600/30 hover:border-brass-600 font-bold text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 group"
            >
              {isExpanded ? (
                <>
                  <span>Show Fewer Timepieces</span>
                  <ChevronUp className="w-4 h-4 text-brass-700 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>See More Options ({remainingCount} More Watches)</span>
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
