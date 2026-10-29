import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Clock,
} from 'lucide-react';
import { getWhatsAppLink, getFullImageUrl } from '../utils/api';

const HERO_SLIDES = [
  {
    badge: 'Trending Drop • 2026 Season',
    headline: 'Timeless Precision & Imported Horology',
    subheadline: 'Gorakhpur’s premier authorized specialists in imported luxury watches. Authentic Swiss precision, Japanese automatic craft, and certified showroom service at Baldev Plaza & JalKal Building, Golghar.',
    ctaPrimary: 'Shop The Drops',
    ctaSecondary: 'Visit Showrooms',
    image: '/images/watches/tissot-prx-powermatic-80.webp',
    tag: 'Seiko • Tissot • Citizen',
  },
  {
    badge: 'Maison Ambassadors Series',
    headline: 'As Seen on Global Icons & Racers',
    subheadline: 'Explore iconic timepieces worn by legends of sport and cinema. Featuring TAG Heuer Carrera Chronographs, Omega Moonwatch, and Rado Captain Cook ceramics.',
    ctaPrimary: 'View Ambassador Series',
    ctaSecondary: 'Inquire on WhatsApp',
    image: '/images/hero-cartier-santos.webp',
    tag: 'TAG Heuer • Omega • Rado',
  },
  {
    badge: 'Showroom Fitting Experience',
    headline: 'Baldev Plaza & JalKal Building Stores',
    subheadline: 'Step into our dual experience stores in Golghar for private timepiece consultations, certified bracelet sizing, and instant battery replacement.',
    ctaPrimary: 'Locate Showrooms',
    ctaSecondary: 'Book Viewing',
    image: '/images/showrooms/baldev-plaza.webp',
    tag: 'Golghar Flagships • Gorakhpur',
  },
];

export default function HeroSection({ heroTitle, heroSubtitle, contactPhone, heroSlides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const waLink = getWhatsAppLink(contactPhone, null);

  const slides = (heroSlides && Array.isArray(heroSlides) && heroSlides.length > 0)
    ? heroSlides
    : HERO_SLIDES;

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide] || slides[0] || HERO_SLIDES[0];
  const displayTitle = currentSlide === 0 && heroTitle ? heroTitle : slide.headline;
  const displaySubtitle = currentSlide === 0 && heroSubtitle ? heroSubtitle : slide.subheadline;
  const slideImage = getFullImageUrl(slide.image);

  return (
    <section className="relative overflow-hidden bg-[#0c0d11] border-b border-white/5">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      {/* Slide Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={slideImage}
          alt={displayTitle}
          className="w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out brightness-[0.45]"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-20 lg:py-24 min-h-[88vh] sm:min-h-[90vh] lg:min-h-[92vh] flex flex-col justify-between">
        <div className="max-w-2xl sm:max-w-3xl space-y-4 sm:space-y-6 pt-4 sm:pt-6">
          {/* High Energy Fastrack-style Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-gold-500/20 border border-gold-400/40 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-gold-300">
              {slide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
            {displayTitle}
          </h1>

          {/* Subheadline */}
          <p className="text-xs sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            {displaySubtitle}
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="#catalog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm uppercase tracking-widest font-extrabold bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-2xl shadow-gold-500/25 transition-all active:scale-[0.98]"
            >
              <span>{slide.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm uppercase tracking-widest font-bold text-white bg-obsidian-900/90 hover:bg-obsidian-850 border border-white/20 hover:border-gold-500/40 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>{slide.ctaSecondary}</span>
            </a>
          </div>
        </div>

        {/* Bottom Carousel Controls & Pagination */}
        <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === i ? 'w-8 sm:w-10 bg-gold-400' : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Micro-Features */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-slate-400">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 shrink-0" />
              <span>Official Stamped Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 shrink-0" />
              <span>Baldev Plaza & JalKal Building</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
