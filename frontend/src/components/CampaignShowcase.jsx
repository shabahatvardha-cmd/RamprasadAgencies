import React, { useState } from 'react';
import { Sparkles, MessageCircle, ArrowRight, ShieldCheck, Tag, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink } from '../utils/api';

export default function CampaignShowcase({ ads = [], contactPhone }) {
  const activeAds = ads.filter((ad) => ad.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!activeAds || activeAds.length === 0) {
    return null; // Don't render empty space if admin hides all ads
  }

  const currentAd = activeAds[currentIndex] || activeAds[0];
  const fullImage = getFullImageUrl(currentAd.image);
  const waUrl = getWhatsAppLink(
    contactPhone,
    { name: currentAd.watchModel || currentAd.title, brand: currentAd.brand },
    currentAd.storeLocation || 'Golghar showrooms'
  );

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-obsidian-950 via-[#0e0e11] to-obsidian-950 border-t border-gold-500/15 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] pointer-events-none opacity-30">
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-gold-500/10 blur-[130px]"></div>
      </div>

      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-6 sm:space-y-10 relative">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] sm:text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Global Maison Endorsements & Campaigns</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
              Ambassadors & Cinematic Campaigns
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Official imported timepiece editions worn by international brand ambassadors, models, and icons of cinema and sport.
            </p>
          </div>

          {/* Carousel Navigation Buttons */}
          {activeAds.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handlePrev}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-obsidian-900 border border-white/10 hover:border-gold-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Previous Campaign"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-xs font-mono text-gold-400 px-2">
                {currentIndex + 1} / {activeAds.length}
              </span>
              <button
                onClick={handleNext}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-obsidian-900 border border-white/10 hover:border-gold-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Next Campaign"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Featured Campaign Banner Card (Editorial Split Display) */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-obsidian-900 border border-gold-500/30 overflow-hidden shadow-2xl luxury-card-shadow grid grid-cols-1 lg:grid-cols-12 min-h-0 sm:min-h-[460px]">
          {/* Left Column: Ambassador Photography */}
          <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[380px] lg:min-h-full overflow-hidden bg-obsidian-950 group">
            <img
              src={fullImage}
              alt={currentAd.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-obsidian-900"></div>

            {/* Brand Watermark Badge */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2">
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-obsidian-950/90 text-gold-300 border border-gold-500/40 backdrop-blur-md">
                {currentAd.brand}
              </span>
            </div>

            {/* Bottom Caption on Photo */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 lg:hidden">
              <span className="text-[10px] sm:text-xs font-mono text-gold-400 uppercase tracking-widest">
                {currentAd.celebrity}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-0.5">
                {currentAd.title}
              </h3>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Sourcing Concierge */}
          <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="hidden lg:block">
                <span className="text-xs font-mono font-semibold tracking-widest uppercase text-gold-400">
                  {currentAd.celebrity}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 leading-snug">
                  {currentAd.title}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {currentAd.tagline}
              </p>

              {/* Timepiece Highlight */}
              {currentAd.watchModel && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-obsidian-950/80 border border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Featured Edition
                  </span>
                  <p className="font-serif text-xs sm:text-sm font-semibold text-gold-200">
                    {currentAd.watchModel}
                  </p>
                </div>
              )}

              {/* Availability at Gorakhpur Showrooms */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 shrink-0" />
                <span className="truncate">
                  {currentAd.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 border-t border-white/10">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-xl shadow-gold-500/20 transition-all active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire Availability at Golghar</span>
              </a>

              <a
                href="#catalog"
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-gold-500/30 transition-colors"
              >
                <span>Browse All {currentAd.brand} Timepieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
