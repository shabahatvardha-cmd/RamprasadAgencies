import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  MapPin,
  Sparkles,
  Clock,
  Wrench,
  ChevronRight,
  MessageCircle,
  Edit2,
  ZoomIn,
  X,
  Store,
} from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';

export default function VisualAbout({ storeData, isEditMode, onOpenEdit }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const contactPhone = storeData?.contactPhone || '+91 98765 43210';
  const cleanPhone = contactPhone.replace(/[^0-9+]/g, '');
  const aboutText = storeData?.aboutText;
  const rawCert = storeData?.certificateImage || '/images/about/heritage-certificate.webp';
  const resolvedCertificate = String(rawCert).trim().replace(/\.jpg$/i, '.webp');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsCertModalOpen(false);
    };
    if (isCertModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCertModalOpen]);

  const tabs = [
    {
      id: 'heritage',
      label: 'Our Heritage',
      icon: Sparkles,
      badge: 'Swiss & Japanese Horology',
      title: 'Authentic Heritage & Certified Dealership',
      description:
        aboutText ||
        'Serving Gorakhpur since the 1960s with genuine Swiss automatics, Japanese mechanical calibres, and classic Indian timepieces—every watch delivered with an official international stamped warranty.',
      image: resolvedCertificate,
      imageAlt: 'Ram Prasad Agencies Official Authorized Dealer Certificate',
      tagBadge: 'Official Dealership Credential',
      tags: ['Official Maison Warranty', 'Master Horologist Inspected', '100% Genuine Imports'],
      featureItems: [
        {
          icon: ShieldCheck,
          title: 'Official Maison Warranty',
          subtitle: 'Certified stamped manufacturer cards',
        },
        {
          icon: Award,
          title: 'Master Horologist Inspected',
          subtitle: 'Precision bench tested for timing',
        },
        {
          icon: Sparkles,
          title: '100% Genuine Imports',
          subtitle: 'Sealed direct factory allocations',
        },
      ],
      ctaLabel: 'Explore Brand Collections',
      ctaHref: '#brands',
    },
    {
      id: 'showrooms',
      label: 'Dual Showrooms',
      icon: MapPin,
      badge: 'Golghar Twin Flagships',
      title: 'Two Premier Destinations in Golghar',
      description:
        'Experience our twin flagship showrooms in the commercial heart of Gorakhpur: Baldev Plaza for Swiss luxury and automatic timepieces, and JalKal Building for contemporary chronographs and everyday classics.',
      image: '/images/showrooms/baldev-plaza.webp',
      imageAlt: 'Ram Prasad Agencies Dual Showrooms in Golghar',
      tagBadge: 'Baldev Plaza & JalKal Building',
      tags: ['Swiss & Automatics Pavilion', 'Youth & Lifestyle Boutique', 'Open All 7 Days'],
      featureItems: [
        {
          icon: Store,
          title: 'Store 1: Baldev Plaza Flagship',
          subtitle: 'Swiss luxury & automatic pavilion (Opp. Town Hall)',
        },
        {
          icon: MapPin,
          title: 'Store 2: JalKal Building Boutique',
          subtitle: 'Contemporary, sports & everyday classics',
        },
        {
          icon: Clock,
          title: 'Open All 7 Days • 10:30 AM – 9 PM',
          subtitle: 'Just 200m apart in Golghar (2 min walk)',
        },
      ],
      ctaLabel: 'View Showroom Locations',
      ctaHref: '#showrooms',
    },
    {
      id: 'clinic',
      label: 'Diagnostics & Care',
      icon: Wrench,
      badge: 'Certified Service Bench',
      title: 'Master Diagnostics & Ultrasonic Care',
      description:
        'In-store battery replacement with leak-proof silver-oxide cells, Swiss pressure chamber testing, ultrasonic bracelet restoration, and complimentary link sizing while you wait.',
      image: '/images/about/watchmaker-bench.webp',
      imageAlt: 'Swiss luxury watch on watchmaker workbench with precision tools',
      tagBadge: 'Certified In-Store Clinic',
      tags: ['Silver-Oxide Battery Cells', 'Ultrasonic Bracelet Bath', 'Complimentary Sizing'],
      featureItems: [
        {
          icon: Wrench,
          title: 'Silver-Oxide Battery Cells',
          subtitle: 'Zero-leak guaranteed power',
        },
        {
          icon: ShieldCheck,
          title: 'Swiss Pressure Testing',
          subtitle: 'Vacuum chamber water-resistance',
        },
        {
          icon: Sparkles,
          title: 'Ultrasonic Bath & Sizing',
          subtitle: 'Complimentary while you wait',
        },
      ],
      ctaLabel: 'Book Consultation',
      ctaHref: '#inquiry',
    },
  ];

  const currentTab = tabs[activeTab];

  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-[#FAF7F2] via-[#F3EDE2] to-[#FAF7F2] text-[#1A1A1A] border-b border-[#E8E1D5] overflow-hidden"
    >
      {/* Admin Visual Edit Trigger */}
      {isEditMode && onOpenEdit && (
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={() => onOpenEdit('general')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-700 hover:bg-brass-800 text-white shadow-lg hover:scale-105 transition-all border border-white/30 backdrop-blur-md cursor-pointer"
            title="Edit About & Heritage Story"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit About Story</span>
          </button>
        </div>
      )}

      {/* 1. KINETIC MECHANICAL HOROLOGY GEAR WATERMARK */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.05]">
        <svg
          className="absolute -top-32 -right-32 w-[600px] h-[600px] text-amber-900 animate-[spin_90s_linear_infinite]"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100 25a75 75 0 1 0 75 75 75.08 75.08 0 0 0-75-75zm0 130a55 55 0 1 1 55-55 55.06 55.06 0 0 1-55 55z" />
          <path d="M95 0h10v26H95zm0 174h10v26H95zM0 95h26v10H0zm174 0h26v10h-26zM26.8 33.9l7.1-7.1 18.4 18.4-7.1 7.1zm114.6 114.6l7.1-7.1 18.4 18.4-7.1 7.1zM33.9 173.2l-7.1-7.1 18.4-18.4 7.1 7.1zm114.6-114.6l-7.1-7.1 18.4-18.4 7.1 7.1z" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. SECTION HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-brass-600/25 text-brass-800 text-[11px] font-mono font-bold uppercase tracking-widest mb-3 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brass-600" />
            <span>Generational Horology Since 1960s</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
            Over Six Decades of Certified <br className="hidden sm:inline" />
            <span className="text-[#845E1E] font-black">Watchmaking Pedigree</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#5C544D] leading-relaxed">
            Established in Golghar, <strong>Ram Prasad Agencies</strong> is Eastern UP’s trusted destination for genuine Indian, Swiss, and Japanese horology.
          </p>
        </div>

        {/* 3. TABS PILL SWITCHER */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-brass-700 text-white shadow-md shadow-brass-700/20 font-bold scale-102'
                    : 'bg-white/50 backdrop-blur-md text-[#5C544D] border border-[#DDD5C7]/80 hover:bg-white/80 hover:text-[#1A1A1A]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brass-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. LUXURY FROSTED GLASS HOROLOGY SHOWCASE */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white/95 via-[#FCF9F2]/90 to-[#F5ECE0]/85 backdrop-blur-xl border border-[#DECDB8] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(132,94,30,0.08)] overflow-hidden transition-all duration-500 group text-[#1A1A1A]">
          {/* Ambient Warm Golden Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brass-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Horology Register Crosshair Corner Accents */}
          <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C2A578]/50 pointer-events-none" />
          <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C2A578]/50 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C2A578]/50 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C2A578]/50 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column Story */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-brass-600/30 text-brass-800 text-[10.5px] font-mono font-bold uppercase tracking-widest shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentTab.badge}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-snug">
                {currentTab.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#5C544D] leading-relaxed font-normal">
                {currentTab.description}
              </p>

              {/* Feature Crest Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {currentTab.featureItems.map((item, fIdx) => {
                  const FIcon = item.icon;
                  return (
                    <div
                      key={fIdx}
                      className="p-3 rounded-xl bg-white/80 hover:bg-white border border-[#DDD5C7] hover:border-brass-600/50 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-2.5 backdrop-blur-sm group/feat"
                    >
                      <div className="w-7 h-7 rounded-lg bg-brass-100/90 border border-brass-600/25 flex items-center justify-center shrink-0 mt-0.5 text-brass-800 group-hover/feat:scale-105 transition-transform">
                        <FIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11.5px] font-bold text-[#1A1A1A] leading-tight">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#7A7167] leading-tight mt-0.5">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={currentTab.ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brass-700 via-amber-700 to-brass-800 hover:from-brass-800 hover:to-brass-900 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-brass-700/20 hover:shadow-brass-700/35 hover:scale-[1.02] active:scale-[0.98] transition-all no-underline cursor-pointer"
                >
                  <span>{currentTab.ctaLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column Stage */}
            <div className="lg:col-span-5">
              {/* ======================================================== */}
              {/* TAB 1: OUR HERITAGE - ONLY ONE HEADING & WEBP CERTIFICATE */}
              {/* ======================================================== */}
              {currentTab.id === 'heritage' && (
                <div className="space-y-3">
                  {/* Single Clean Prestige Heading */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/85 border border-[#DECDB8] text-[#1A1A1A] shadow-xs backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-brass-700" />
                      <span className="font-serif text-xs sm:text-sm font-bold tracking-wide text-[#2C2416]">
                        Official Authorized Retailer Certificate
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-brass-800 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brass-100/80 border border-brass-600/25">
                      Estd. 1960
                    </span>
                  </div>

                  {/* Main Heritage Stage Card: Converted WebP Certificate */}
                  <div className="relative rounded-2xl overflow-hidden border border-[#D5C2A8] bg-[#F4EFE6] shadow-xl group/stage aspect-[4/3]">
                    <img
                      src={getFullImageUrl(resolvedCertificate)}
                      alt="Ram Prasad Agencies Official Authorized Dealer Certificate"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/stage:scale-105 cursor-pointer"
                      onClick={() => setIsCertModalOpen(true)}
                      loading="lazy"
                    />

                    {/* Luxury Warm Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

                    {/* Top Live Badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-brass-600/30 backdrop-blur-md shadow-xs text-[10.5px] font-mono font-bold text-brass-900">
                      <Award className="w-3.5 h-3.5 text-brass-700" />
                      <span>Official Dealer Credential</span>
                    </div>

                    {/* Top Right Zoom Button */}
                    <button
                      type="button"
                      onClick={() => setIsCertModalOpen(true)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/90 hover:bg-brass-700 hover:text-white text-brass-900 border border-brass-600/30 backdrop-blur-md transition-all shadow-xs cursor-pointer group/zoom"
                      title="Click to view full certificate"
                    >
                      <ZoomIn className="w-4 h-4 transition-transform group-hover/zoom:scale-110" />
                    </button>

                    {/* Bottom Museum Spec Strip */}
                    <div
                      onClick={() => setIsCertModalOpen(true)}
                      className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5C2A8] flex items-center justify-between text-xs text-[#1A1A1A] cursor-pointer hover:border-brass-600 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                        <span className="text-[11px] text-[#4A4036] font-medium truncate">
                          Serial: RPA-8924 • Stamped & Sealed
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-brass-800 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        View Fullscreen
                      </span>
                    </div>
                  </div>

                  {/* Subtle Helper Note */}
                  <div className="text-center">
                    <p className="text-[10.5px] text-[#7A7167] italic">
                      * Official stamped authorized dealer certificate. International manufacturer warranty provided with all timepieces.
                    </p>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: DUAL SHOWROOMS STAGE                              */}
              {/* ======================================================== */}
              {currentTab.id === 'showrooms' && (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-[#D5C2A8] bg-[#F4EFE6] shadow-xl group/stage aspect-[4/3]">
                    <img
                      src={currentTab.image}
                      alt={currentTab.imageAlt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/stage:scale-106"
                      loading="lazy"
                    />

                    {/* Luxury Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />

                    {/* Top Glass Badge */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-brass-600/30 backdrop-blur-md shadow-xs text-[10.5px] font-mono font-bold text-brass-900">
                      <Store className="w-3.5 h-3.5 text-brass-700" />
                      <span>Golghar Twin Flagships</span>
                    </div>

                    {/* Bottom Museum Spec Strip */}
                    <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5C2A8] flex items-center justify-between text-xs text-[#1A1A1A] shadow-sm">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                        <span className="text-[11px] text-[#4A4036] font-medium truncate">
                          Baldev Plaza & JalKal Building
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        200m Apart • 2 Min Walk
                      </span>
                    </div>
                  </div>

                  {/* Highlights Strip */}
                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#DDD5C7] flex items-center justify-between text-[11px] text-[#5C544D] shadow-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brass-700" />
                      Both Open: 10:30 AM – 9:00 PM (All 7 Days)
                    </span>
                    <a
                      href="#store-locator"
                      className="text-brass-800 hover:text-brass-900 font-bold flex items-center gap-0.5 no-underline"
                    >
                      <span>Showroom Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: DIAGNOSTICS & CARE STAGE                          */}
              {/* ======================================================== */}
              {currentTab.id === 'clinic' && (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-[#D5C2A8] bg-[#F4EFE6] shadow-xl group/stage aspect-[4/3]">
                    <img
                      src="/images/about/watchmaker-bench.webp"
                      alt="Diagnostics Bench"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/stage:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-brass-600/30 backdrop-blur-md shadow-xs text-[10.5px] font-mono font-bold text-brass-900">
                      <Wrench className="w-3.5 h-3.5 text-brass-700" />
                      <span>Certified In-Store Clinic</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#D5C2A8] flex items-center justify-between text-xs text-[#1A1A1A] shadow-sm">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                        <span className="text-[11px] text-[#4A4036] font-medium truncate">
                          Diagnostics Bench at Both Showrooms
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Quick Turnaround
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/80 border border-[#DDD5C7] flex items-center justify-between text-[11px] text-[#5C544D] shadow-xs">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-brass-700" />
                      Complimentary Ultrasonic Bath While You Browse
                    </span>
                    <a
                      href="#inquiry"
                      className="text-brass-800 hover:text-brass-900 font-bold flex items-center gap-0.5 no-underline"
                    >
                      <span>Inquire</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {isCertModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-lg animate-fadeIn"
          onClick={() => setIsCertModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#1A1815] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-amber-200">
                    Official Authorized Retailer Certificate
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Conferred to Ram Prasad Agencies • Estd. 1960 • Golghar, Gorakhpur
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-stone-950 text-stone-300 transition-colors cursor-pointer"
                title="Close Certificate Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Certificate Display */}
            <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-black/70 shadow-inner max-h-[70vh] flex items-center justify-center p-2">
              <img
                src={getFullImageUrl(resolvedCertificate)}
                alt="Ram Prasad Agencies Official Authorized Dealer Certificate"
                className="w-full h-auto max-h-[68vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal Footer Spec Strip */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-[11px] text-stone-300">
                <span className="font-bold text-amber-300">Credential ID:</span> ESTD. 1960 - AUTH NO. RPA-8924 • Stamped & Certified by Horology Maisons
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-sm transition-transform active:scale-95"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
