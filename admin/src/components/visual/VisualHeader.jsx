import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  MessageCircle,
  MapPin,
  Sparkles,
  Heart,
  Search,
  Phone,
  Flame,
  Watch,
  Sliders,
  Edit2,
  Clock,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function VisualHeader({
  storeData,
  isEditMode,
  onOpenEdit,
}) {
  const brandName = storeData.brandName || 'RAM PRASAD AGENCIES';
  const tagline = storeData.tagline || 'Authorized & Imported Luxury Watch Specialist • Gorakhpur';
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const announcements = storeData.announcements?.messages || [
    '⚡ FLASH SALE: Extra 15% Off Swiss & Japanese Automatics • Use Code: VINTAGE15',
    'Free Insured Express Shipping on All Orders Across India',
  ];
  const flashSale = storeData.flashSale?.flashSale || storeData.flashSale || {};

  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll to make header sleek and tuck away announcement bar smoothly
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#top' },
    { label: 'About', href: '#about' },
    { label: 'Brand', href: '#brands' },
    { label: 'Store Locator', href: '#showrooms' },
    { label: 'Contact Us', href: '#contact' },
  ];

  return (
    <div id="top" className="relative group/header border-b border-[#E8E1D5]">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-2 right-4 z-50">
          <button
            onClick={() => onOpenEdit('branding')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Edit Store Name, Tagline, Phone, and Announcements"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Header & Announcements</span>
          </button>
        </div>
      )}

      {/* 1. Top Announcement Marquee Ticker (smoothly tucks away when scrolling down) */}
      <div
        className={`w-full bg-[#1A1A1A] text-cream-100 text-center text-xs font-medium tracking-wide border-b border-brass-600/30 transition-all duration-300 ${
          isScrolled ? 'max-h-0 py-0 opacity-0 overflow-hidden border-b-0' : 'max-h-12 py-2 px-4 opacity-100'
        }`}
      >
        <div className="flex items-center justify-center gap-2 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-brass-400 shrink-0" />
          <span className="truncate">{announcements[0]}</span>
        </div>
      </div>

      {/* 2. Main Navigation Header (Clean, Elevated & Visible While Scrolling) */}
      <header
        className={`bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E8E1D5] transition-all duration-300 font-sans text-[#1A1A1A] ${
          isScrolled ? 'shadow-md py-0.5' : 'shadow-xs py-0'
        }`}
        style={{ backgroundColor: '#FAF8F5' }}
      >
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div
            className={`flex items-center justify-between gap-4 transition-all duration-300 ${
              isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
            }`}
          >
            {/* Brand Logo & Name */}
            <a href="#" className="flex items-center gap-3 shrink-0 group">
              <BrandLogo customSrc={storeData?.logo} className="w-9 h-9 sm:w-11 sm:h-11" />
              <div>
                <span className="font-serif text-xs sm:text-base md:text-lg font-black tracking-wider text-[#111111] block leading-tight">
                  {brandName}
                </span>
                <p className="text-[8.5px] sm:text-[10px] uppercase tracking-widest text-brass-700 font-extrabold truncate mt-0.5">
                  {tagline &&
                  !tagline.includes('Vintage Horology') &&
                  !tagline.includes('Authorized & Imported') &&
                  !tagline.includes('TheWatchStore.in') &&
                  !tagline.toLowerCase().includes('ramprasadwatchstore')
                    ? tagline
                    : 'WATCHSTORE.IN'}
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#5A524A]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`hover:text-brass-700 transition-colors ${
                    link.isHighlight ? 'text-rust-600 font-bold' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Quick Actions (Helpline) */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#1A1A1A]">
                <Clock className="w-4 h-4 text-brass-700" />
                <span>Golghar: 10:30 AM – 9:00 PM</span>
              </div>

              <a
                href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0EBE1] border border-[#DDD5C7] text-[#1A1A1A] hover:border-brass-600 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brass-700" />
                <span>{contactPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
