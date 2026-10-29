import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Edit2,
  Watch,
  Award,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';

export default function VisualHero({ heroData = {}, isEditMode, onOpenEdit }) {
  const slides = heroData?.slides && heroData.slides.length > 0 ? heroData.slides : [];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const bgImg = getFullImageUrl(currentSlide.image);

  return (
    <section id="hero" className="relative w-full overflow-hidden bg-[#0B0B0D] text-white border-b border-black/30 min-h-[500px] lg:min-h-[580px] flex items-center">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-40">
          <button
            onClick={() => onOpenEdit('hero')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Add, remove, reorder slides, change headlines, background photos, or buttons"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Hero Showcase ({slides.length} Slides)</span>
          </button>
        </div>
      )}

      {/* Background Watch Advertisement Photography Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => {
          const rawImg = getFullImageUrl(s.image);
          const isOffendingRolex =
            rawImg.includes('photo-1587925358603') ||
            rawImg.includes('photo-1670404160620') ||
            rawImg.includes('photo-1639006570490') ||
            rawImg.includes('photo-1620625515032') ||
            rawImg.includes('photo-1526045431048') ||
            rawImg.includes('photo-1547996160') ||
            rawImg.toLowerCase().includes('rolex');
          const isFastrackSlide = s.id === 'hero-6' || (s.headline && s.headline.toLowerCase().includes('fastrack'));
          const isHmtSlide = s.id === 'hero-5' || (s.headline && s.headline.toLowerCase().includes('hmt'));
          const isOmegaSlide = s.id === 'hero-2' || (s.headline && s.headline.toLowerCase().includes('omega'));
          const imgUrl = isFastrackSlide
            ? '/images/fastrack-banner.webp'
            : isHmtSlide
              ? '/images/hero-hmt-kohinoor-vintage.webp'
              : isOmegaSlide
                ? '/images/hero-omega-showcase.webp'
                : isOffendingRolex
                  ? '/images/watches/cartier-santos-dumont.webp'
                  : rawImg;
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={s.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={imgUrl}
                alt={s.headline}
                className="w-full h-full object-cover object-center sm:object-right transform scale-105 transition-transform duration-10000 ease-out brightness-[0.92] contrast-[1.05]"
              />
            </div>
          );
        })}

        {/* Clear transparent vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10 sm:to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none"></div>
      </div>

      {/* Main Content Container (Invisible Card Border & Frame) */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-24 flex items-center">
        <div className="max-w-2xl lg:max-w-3xl p-0 sm:p-2 lg:p-4 bg-transparent border-0 border-transparent shadow-none space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-brass-500/20 border border-brass-400/40 text-brass-200 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-brass-300" />
            <span>{currentSlide.badge || 'EST. 1984 • VINTAGE HERITAGE'}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {currentSlide.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-[#F5F2EB] font-normal leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {currentSlide.subheadline}
          </p>

          {/* Specs Pill */}
          {currentSlide.specsTag && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-medium text-white shadow-sm backdrop-blur-md">
              <Award className="w-4 h-4 text-brass-300" />
              <span>{currentSlide.specsTag}</span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={currentSlide.ctaPrimaryLink || '#new-arrivals'}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-500 via-amber-500 to-brass-600 hover:from-brass-400 hover:to-amber-400 text-stone-950 flex items-center gap-2 shadow-lg shadow-brass-500/25 transition-all font-extrabold"
            >
              <span>{currentSlide.ctaPrimary || 'Shop The Capsule'}</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </a>

            <a
              href={currentSlide.ctaSecondaryLink || '#showrooms'}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-brass-400/60 transition-all shadow-sm backdrop-blur-md"
            >
              <span>{currentSlide.ctaSecondary || 'View Showrooms'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Side Arrow Navigation (Left & Right of Background Image Area) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/25 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/25 shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Clean Bottom Pagination Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlideIndex
                  ? 'w-8 bg-brass-400 shadow-sm'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
