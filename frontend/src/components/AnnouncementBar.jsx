import React, { useState } from 'react';
import { Sparkles, Phone, Clock, MapPin, Zap, ExternalLink, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AnnouncementBar() {
  const { storeData } = useStore();
  const announcements = storeData.announcements || {};
  const flashSale = storeData.flashSale || {};
  const messages = announcements.messages && announcements.messages.length > 0
    ? announcements.messages
    : [
        '⚡ FLASH SALE: Extra 15% Off Curated Swiss & Japanese Big Brand Automatics • Use Code: VINTAGE15',
        'Authorized Specialists for Tissot, Seiko, Rado, Citizen, Fossil & Swiss Calibers in Gorakhpur',
      ];

  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

  if (announcements.isActive === false) {
    return null;
  }

  // Marquee speed class
  const speedClass = announcements.speed === 'fast'
    ? 'animate-marquee-fast'
    : announcements.speed === 'slow'
    ? 'animate-[marquee_45s_linear_infinite]'
    : 'animate-marquee';

  return (
    <aside
      aria-label="Promotional announcement and store hours"
      className="relative w-full bg-[#EDE7DE] border-b border-[#DDD5C7] text-[#2C2723] text-xs overflow-hidden z-30 transition-colors"
    >
      {/* Top Utility Ribbon */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-1.5 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-[#DDD5C7]/70">
        {/* Left: Authentic Showroom Status */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#3D3731]">
          <span className="flex items-center gap-1.5 font-semibold text-brass-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Gorakhpur Showrooms Open Today
          </span>
          <span className="text-[#C4BCB0]">|</span>
          <span className="flex items-center gap-1 text-[#5A524A]">
            <Clock className="w-3.5 h-3.5 text-brass-700" />
            <span>10:30 AM – 9:00 PM (All 7 Days)</span>
          </span>
          <span className="text-[#C4BCB0]">|</span>
          <span className="flex items-center gap-1 text-[#5A524A]">
            <ShieldCheck className="w-3.5 h-3.5 text-brass-700" />
            <span>Authorized Luxury Specialist</span>
          </span>
        </div>

        {/* Center: Dynamic Marquee Ticker */}
        <div className="flex-1 max-w-4xl mx-auto overflow-hidden marquee-wrapper py-0.5 relative group">
          {/* Subtle gradient fades on edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#EDE7DE] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#EDE7DE] to-transparent z-10 pointer-events-none"></div>

          <div className={`flex items-center gap-8 whitespace-nowrap marquee-content ${speedClass} group-hover:[animation-play-state:paused]`}>
            {/* Repeat list twice for seamless infinite marquee loop */}
            {[...messages, ...messages].map((msg, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 text-[11.5px] font-medium tracking-wide text-[#1A1A1A] hover:text-brass-800 transition-colors cursor-default"
              >
                {flashSale.isActive && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-rust-500/15 text-rust-700 border border-rust-600/30">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    Flash Deal
                  </span>
                )}
                <span>{msg}</span>
                <span className="text-brass-700 font-serif">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Phone, Showroom link & Admin launcher */}
        <div className="flex items-center gap-3 text-[11px] text-[#5A524A] shrink-0">
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-1.5 text-[#3D3731] hover:text-brass-800 transition-colors"
            title="Call Showrooms"
          >
            <Phone className="w-3 h-3 text-brass-700" />
            <span className="font-mono text-[11px] font-semibold">{contactPhone}</span>
          </a>

          <span className="hidden sm:inline text-[#C4BCB0]">|</span>

          <a
            href="#showrooms"
            className="hidden sm:flex items-center gap-1 text-[#5A524A] hover:text-brass-800 transition-colors"
          >
            <MapPin className="w-3 h-3 text-brass-700" />
            <span>Baldev Plaza & JalKal</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
