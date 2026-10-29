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
      className="relative w-full overflow-hidden bg-[#0B0B0D] text-white border-b border-black/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Watch Advertisement Photography Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((s, idx) => {
          const rawImg = getFullImageUrl(s.image);
          const headlineLower = (s.headline || '').toLowerCase();

          let bgImg = rawImg;
          if (s.id === 'hero-2' || headlineLower.includes('omega')) {
            bgImg = '/images/hero-omega-showcase.webp';
          } else if (s.id === 'hero-5' || headlineLower.includes('hmt')) {
            bgImg = '/images/hero-hmt-kohinoor-vintage.webp';
          } else if (s.id === 'hero-4' || headlineLower.includes('titan')) {
            bgImg = '/images/hero-titan-regalia.webp';
          } else if (s.id === 'hero-1' || headlineLower.includes('tissot')) {
            bgImg = '/images/watches/tissot-prx-powermatic-80.webp';
          } else if (s.id === 'hero-3' || headlineLower.includes('seiko')) {
            bgImg = '/images/watches/seiko-presage-cocktail-time.webp';
          } else if (s.id === 'hero-6' || headlineLower.includes('fastrack')) {
            bgImg = '/images/fastrack-banner.webp';
          }
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
                className="w-full h-full object-cover object-center sm:object-right transform scale-105 transition-transform duration-10000 ease-out brightness-[0.92] contrast-[1.05]"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Clear transparent vignette overlays - gives high contrast text while keeping watch photography crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10 sm:to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10 pointer-events-none"></div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-24 lg:py-28 min-h-[550px] lg:min-h-[640px] flex items-center">
        {/* Top Content Block: Luxury Editorial Showcase Card (Invisible Card Border & Frame) */}
        <div className="max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <div className="p-0 sm:p-2 lg:p-4 bg-transparent border-0 border-transparent shadow-none relative">
            <div key={currentSlide.id || currentSlideIndex} className="space-y-4 sm:space-y-5 lg:space-y-6 animate-editorial-fade">
              {/* Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-brass-500/20 border border-brass-400/40 shadow-sm backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-brass-300" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brass-200 font-mono">
                    {(currentSlide.badge || 'SWISS LUXURY')
                      .replace('INDIAN HOROLOGY FLAGSHIP', 'TITAN COLLECTION')
                      .replace('EVERYDAY INDIAN HOROLOGY', 'FASTRACK & SONATA')
                      .replace('INDIAN MECHANICAL LEGEND', 'HMT MECHANICAL')
                      .replace(' • EST. 1853', '')
                      .replace('CERTIFIED SWISS LUXURY IMPORTS', 'SWISS LUXURY')
                      .replace('SWISS LUXURY IMPORTS', 'SWISS LUXURY')
                      .replace('JAPANESE AUTOMATIC MASTERY', 'JAPANESE AUTOMATICS')
                      .replace('HOROLOGY FLAGSHIP', 'COLLECTION')
                      .replace('HOROLOGY', '')}
                  </span>
                </div>
              </div>

              {/* Bold Clean Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {(currentSlide.headline || '')
                  .replace(/rolex/gi, 'Omega')
                  .replace('Tissot PRX Powermatic 80 & Swiss Automatics', 'Tissot PRX & Swiss Automatics')
                  .replace('Seiko Presage Cocktail Time & Automatic Calibers', 'Seiko Presage Automatics')}
              </h1>

              {/* Concise Subheadline */}
              <p className="text-sm sm:text-base lg:text-lg text-[#F5F2EB] font-normal leading-relaxed max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {(currentSlide.subheadline || '').includes('discerning collectors in Eastern UP')
                  ? 'Certified authentic Swiss chronometers with international warranty and stamped papers in Gorakhpur.'
                  : currentSlide.subheadline}
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
                <a
                  href={currentSlide.ctaPrimaryLink || '#brands'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-extrabold bg-gradient-to-r from-brass-500 via-amber-500 to-brass-600 hover:from-brass-400 hover:to-amber-400 text-stone-950 shadow-xl shadow-brass-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{currentSlide.ctaPrimary ? currentSlide.ctaPrimary.replace('Maisons', 'Brands') : 'Explore Brands'}</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </a>

                <a
                  href={currentSlide.ctaSecondaryLink || waLink}
                  target={currentSlide.ctaSecondaryLink?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 hover:border-brass-400/60 shadow-lg backdrop-blur-md transition-all active:scale-[0.98]"
                >
                  <Compass className="w-4 h-4 text-brass-300" />
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
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/25 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/25 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
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
                  ? 'w-8 bg-brass-400 shadow-md'
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
