import React from 'react';
import { MessageCircle, Eye, MapPin, Heart, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink } from '../utils/api';

export default function WatchCard({
  watch,
  onQuickView,
  contactPhone,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const fullImage = getFullImageUrl(watch.image);
  const waUrl = getWhatsAppLink(contactPhone, watch, watch.storeLocation || 'Golghar showrooms');

  return (
    <div className="group relative rounded-2xl bg-obsidian-900 border border-white/10 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden luxury-card-shadow hover:-translate-y-1">
      {/* Top Image Canvas */}
      <div
        onClick={() => onQuickView && onQuickView(watch)}
        className="relative aspect-square bg-[#0b0c10] p-2.5 sm:p-6 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* Watch Media */}
        <img
          src={fullImage}
          alt={`${watch.brand} ${watch.name}`}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2 sm:top-3.5 left-2 sm:left-3.5 flex flex-col gap-1 z-10 pointer-events-none">
          {watch.inStock ? (
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7.5px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7.5px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-rose-950/90 text-rose-400 border border-rose-500/40 backdrop-blur-md shadow-lg">
              Special Order
            </span>
          )}

          {watch.featured && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold-500 text-obsidian-950 shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              Hot Drop
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Fastrack hallmark) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist && onToggleWishlist(watch);
          }}
          className={`absolute top-2 sm:top-3.5 right-2 sm:right-3.5 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105'
              : 'bg-obsidian-900/80 text-slate-400 hover:text-white hover:bg-obsidian-850 border border-white/10'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Button (Desktop) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-end justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(watch);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-obsidian-900/95 text-white hover:text-gold-300 border border-gold-500/40 shadow-2xl backdrop-blur-md transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-2.5 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4 bg-obsidian-900">
        <div>
          {/* Brand & Rating Bar */}
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[8.5px] sm:text-[11px] uppercase tracking-widest font-extrabold text-gold-400 truncate">
              {watch.brand}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] text-amber-400 font-semibold shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Model Name */}
          <h3
            onClick={() => onQuickView && onQuickView(watch)}
            className="font-serif text-xs sm:text-sm lg:text-base font-bold text-white mt-0.5 group-hover:text-gold-200 transition-colors line-clamp-1 cursor-pointer"
          >
            {watch.name}
          </h3>

          {/* Movement & Specs Tag */}
          <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5 flex-wrap">
            <span className="text-[7.5px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300">
              {watch.movement || watch.category || 'Automatic'}
            </span>
            <span className="text-[7.5px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300">
              {watch.caseDiameter || '40mm'}
            </span>
          </div>
        </div>

        {/* Availability & Location Section */}
        <div className="space-y-2 sm:space-y-2.5 pt-2 sm:pt-3 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-serif font-bold text-gold-300 tracking-wide">
              Price Upon Request
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded">
              Inquire Agency
            </span>
          </div>

          <p className="text-[8px] sm:text-[9.5px] text-slate-400 truncate">
            {watch.storeLocation || 'Baldev Plaza & JalKal Showrooms'}
          </p>

          {/* WhatsApp Direct Action Button */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[10px] sm:text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all active:scale-[0.98] group/btn"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0 group-hover/btn:scale-110 transition-transform" />
            <span className="truncate">Inquire Price & Availability</span>
          </a>
        </div>
      </div>
    </div>
  );
}
