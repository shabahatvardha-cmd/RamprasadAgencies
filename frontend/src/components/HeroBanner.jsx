import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Clock,
  MapPin,
  Watch,
  Compass,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppLink, getFullImageUrl } from '../utils/api';

export default function HeroBanner() {
  const { storeData } = useStore();
  const heroData = storeData.hero || {};
  const slides = (heroData.slides && heroData.slides.length > 0) ? heroData.slides : [];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);

  // Auto-advance slides every 6.5 seconds unless hovered/paused
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const fullImageUrl = getFullImageUrl(currentSlide.image);
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const waLink = getWhatsAppLink(contactPhone, null);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartXRef.current) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // swipe left -> next
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
      } else {
        // swipe right -> prev
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      aria-label="Hero watch advertisement showcase"
      className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#1A1A1A] border-b border-[#E8E1D5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Watch Advertisement Photography Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => {
          const bgImg = getFullImageUrl(s.image);
          const isActive = idx === currentSlideIndex;
          return (
            <div
              key={s.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
              }`}
            >
              <img
                src={bgImg}
                alt={s.headline}
                className="w-full h-full object-cover object-center sm:object-right transform scale-105 transition-transform duration-10000 ease-out brightness-[0.88] contrast-[1.05]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Multi-layer warm organic light overlays for seamless magazine blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/90 sm:via-[#FAF7F2]/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/80 via-transparent to-[#FAF7F2]/40 z-10 pointer-events-none"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-24 lg:py-28 min-h-[550px] lg:min-h-[640px] flex items-center">
        {/* Top Content Block: Luxury Editorial Showcase Card */}
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <div className="p-7 sm:p-10 lg:p-12 xl:p-14 rounded-3xl bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#DDD5C7] shadow-2xl relative vintage-shadow">
            <div key={currentSlide.id || currentSlideIndex} className="space-y-4 sm:space-y-5 lg:space-y-6 animate-editorial-fade">
              {/* Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-brass-500/15 border border-brass-600/30 shadow-sm">
                  <Sparkles className="w-4 h-4 text-brass-700" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brass-800 font-mono">
                    {(currentSlide.badge || 'SWISS LUXURY')
                      .replace(' • EST. 1853', '')
                      .replace('CERTIFIED SWISS LUXURY IMPORTS', 'SWISS LUXURY IMPORTS')
                      .replace('JAPANESE AUTOMATIC MASTERY', 'JAPANESE AUTOMATICS')}
                  </span>
                </div>
              </div>

              {/* Bold Clean Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-[1.12]">
                {(currentSlide.headline || '')
                  .replace('Rolex Submariner & Omega Speedmaster Showcase', 'Rolex & Omega Showcase')
                  .replace('Tissot PRX Powermatic 80 & Swiss Automatics', 'Tissot PRX & Swiss Automatics')
                  .replace('Seiko Presage Cocktail Time & Automatic Calibers', 'Seiko Presage Automatics')}
              </h1>

              {/* Concise Subheadline */}
              <p className="text-sm sm:text-base lg:text-lg text-[#4A433D] font-normal leading-relaxed max-w-xl">
                {(currentSlide.subheadline || '').includes('discerning collectors in Eastern UP')
                  ? 'Certified authentic Swiss chronometers with international warranty and stamped papers in Gorakhpur.'
                  : currentSlide.subheadline}
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <a
                  href="#brands"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-extrabold bg-gradient-to-r from-brass-600 via-amber-600 to-brass-700 hover:from-brass-500 hover:to-amber-500 text-white shadow-xl shadow-brass-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Maisons</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href={currentSlide.ctaSecondaryLink || waLink}
                  target={currentSlide.ctaSecondaryLink?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-bold text-[#1A1A1A] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] hover:border-brass-600/60 shadow-md transition-all active:scale-[0.98]"
                >
                  <Compass className="w-4 h-4 text-brass-700" />
                  <span>{currentSlide.ctaSecondary || 'View Showrooms'}</span>
                </a>
              </div>
            </div>
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
