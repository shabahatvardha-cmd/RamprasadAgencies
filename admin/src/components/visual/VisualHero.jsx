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
    <section id="hero" className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#1A1A1A] border-b border-[#E8E1D5] min-h-[500px] lg:min-h-[580px] flex items-center">
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
          const imgUrl = getFullImageUrl(s.image);
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
                className="w-full h-full object-cover object-center sm:object-right transform scale-105 transition-transform duration-10000 ease-out brightness-[0.88] contrast-[1.05]"
              />
            </div>
          );
        })}

        {/* Warm organic light overlays for seamless magazine blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 sm:via-[#FAF7F2]/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/80 via-transparent to-[#FAF7F2]/40 z-10 pointer-events-none"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-24">
        <div className="max-w-2xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest badge-brass shadow-sm">
            <Sparkles className="w-3 h-3 text-brass-700" />
            <span>{currentSlide.badge || 'EST. 1984 • VINTAGE HERITAGE'}</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.12]">
            {currentSlide.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-[#4A423A] font-normal leading-relaxed max-w-xl">
            {currentSlide.subheadline}
          </p>

          {/* Specs Pill */}
          {currentSlide.specsTag && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 border border-[#DDD5C7] text-xs font-medium text-[#1A1A1A] shadow-sm">
              <Award className="w-4 h-4 text-brass-700" />
              <span>{currentSlide.specsTag}</span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={currentSlide.ctaPrimaryLink || '#new-arrivals'}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white flex items-center gap-2 shadow-lg hover:shadow-brass-500/25 transition-all"
            >
              <span>{currentSlide.ctaPrimary || 'Shop The Capsule'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={currentSlide.ctaSecondaryLink || '#showrooms'}
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/90 hover:bg-white text-[#1A1A1A] border border-[#DDD5C7] hover:border-brass-600 transition-all shadow-sm"
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
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] border border-[#DDD5C7] shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] border border-[#DDD5C7] shadow-xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
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
                  ? 'w-8 bg-[#1A1A1A] shadow-sm'
                  : 'w-2 bg-[#1A1A1A]/30 hover:bg-[#1A1A1A]/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
