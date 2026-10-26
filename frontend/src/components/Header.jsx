import React, { useState } from 'react';
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
  Zap,
} from 'lucide-react';
import { getWhatsAppLink } from '../utils/api';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';

export default function Header({
  wishlistCount = 0,
  onOpenWishlist,
  onSearch,
  searchQuery,
  onSelectCategory,
}) {
  const { storeData } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const waLink = getWhatsAppLink(contactPhone, null);
  const flashSale = storeData.flashSale?.flashSale || storeData.flashSale || {};

  const navLinks = [
    { label: 'New Arrivals', href: '#new-arrivals' },
    { label: '🇮🇳 Indian Brands', href: '#indian-brands', isHighlight: true },
    { label: 'Collector Capsule', href: '#collector-capsule' },
    { label: 'Categories', href: '#categories' },
    { label: 'All Watches', href: '#catalog' },
    { label: 'Our Icons', href: '#our-icons' },
    ...(flashSale.isActive ? [{ label: '⚡ Flash Deals', href: '#flash-deals', isHighlight: true }] : []),
    { label: 'Showrooms', href: '#showrooms' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/98 backdrop-blur-2xl border-b border-[#E8E1D5] shadow-md transition-all font-sans text-[#1A1A1A]">
      {/* Primary Brand & Search Row */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <BrandLogo customSrc={storeData?.logo} className="w-9 h-9 sm:w-11 sm:h-11" />
            <div>
              <span className="font-serif text-xs sm:text-base md:text-lg font-bold tracking-wider text-[#1A1A1A] block leading-tight">
                {storeData?.brandName || 'RAM PRASAD AGENCIES'}
              </span>
              <p className="text-[8px] sm:text-[9.5px] uppercase tracking-widest text-brass-600 font-bold truncate">
                {storeData?.tagline &&
                !storeData.tagline.includes('Vintage Horology') &&
                !storeData.tagline.includes('Authorized & Imported') &&
                !storeData.tagline.includes('TheWatchStore.in')
                  ? storeData.tagline
                  : 'ramprasadWatchstore.in • Golghar'}
              </p>
            </div>
          </a>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#7D756C]" />
              <input
                type="text"
                placeholder="Search Townsend, Shelby, Automatics, Chronos, Leather..."
                value={searchQuery || ''}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                className="w-full bg-[#F0EBE1] border border-[#DDD5C7] focus:border-brass-500 rounded-full pl-10 pr-4 py-2 text-xs text-[#1A1A1A] placeholder-[#8A8277] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch && onSearch('')}
                  className="absolute right-3.5 top-2.5 text-xs text-[#7D756C] hover:text-[#1A1A1A]"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Showroom Locator Pill */}
            <a
              href="#showrooms"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0EBE1] hover:bg-[#EAE4D8] border border-[#DDD5C7] text-xs text-[#3A3530] hover:text-[#1A1A1A] transition-all"
            >
              <MapPin className="w-3.5 h-3.5 text-brass-600" />
              <span>Baldev & JalKal</span>
            </a>

            {/* Wishlist Button with Badge Counter */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-full bg-[#F0EBE1] hover:bg-[#EAE4D8] text-[#3A3530] hover:text-[#1A1A1A] border border-[#DDD5C7] transition-colors"
              title="Saved Timepieces"
              aria-label="Wishlist drawer"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* WhatsApp Concierge Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs uppercase tracking-wider font-extrabold bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Store</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#3A3530] hover:text-[#1A1A1A] rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="md:hidden pb-3 pt-0.5">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7D756C]" />
            <input
              type="text"
              placeholder="Search Townsend, Automatics, Chronos..."
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-full bg-[#F0EBE1] border border-[#DDD5C7] focus:border-brass-500 rounded-full pl-9 pr-8 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8A8277] focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row (Desktop) */}
      <div className="hidden md:block bg-[#F4EFE6] border-t border-[#E8E1D5] py-2.5">
        <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-7">
            {navLinks.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className={`font-semibold tracking-wide transition-colors ${
                  item.isHighlight
                    ? 'text-rust-600 hover:text-rust-700 font-extrabold flex items-center gap-1'
                    : 'text-[#4A443E] hover:text-brass-700'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-[#736B63] text-[11px]">
            <span>100% Genuine Stamped Horology</span>
            <span>•</span>
            <span>Baldev Plaza & JalKal Building</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-t border-[#E8E1D5] px-4 py-4 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item, i) => (
              <a
                key={i}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  item.isHighlight
                    ? 'bg-rust-500/15 text-rust-700'
                    : 'text-[#2D2825] hover:bg-[#F0EBE1] hover:text-brass-700'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E1D5] flex flex-col gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
