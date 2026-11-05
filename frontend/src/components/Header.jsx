import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LiveWatchSearch from './LiveWatchSearch';

export default function Header({
  allWatches = [],
  onSelectWatch,
  onSearch,
  searchQuery,
  onSelectCategory,
}) {
  const { storeData } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Clean any stale legacy header height styles
  useEffect(() => {
    try {
      document.documentElement.style.removeProperty('--site-header-height');
    } catch {}
  }, []);

  // Detect scroll past 50px threshold to trigger smooth shrinking header effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      if (!scrolled) {
        setMobileSearchExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Brand', href: '/#brands' },
    { label: 'Store Locator', href: '/#showrooms' },
    { label: 'Contact Us', href: '/#contact' },
  ];

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);

    if (href === '/') {
      e.preventDefault();
      if (location.pathname === '/') {
        try {
          window.scrollTo(0, 0);
        } catch { }
      } else {
        navigate('/');
      }
      return;
    }

    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');

      if (location.pathname === '/') {
        const el = document.getElementById(targetId);
        if (el) {
          const headerOffset = 70;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: Math.max(0, offsetPosition), behavior: 'smooth' });
        }
      } else {
        navigate(href);
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-sans text-[#1A1A1A] ${
        isScrolled
          ? 'bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#D8CEBC]/90 shadow-[0_8px_30px_-4px_rgba(20,15,10,0.18)]'
          : 'bg-[#FAF8F5] border-b border-[#E8E1D5] shadow-sm'
      }`}
      style={{ backgroundColor: isScrolled ? 'rgba(250, 248, 245, 0.94)' : '#FAF8F5' }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 transition-all duration-300">
        <div
          className={`flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-12 sm:h-14' : 'h-16 sm:h-20'
          }`}
        >
          {/* Brand Logo & Name */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2 sm:gap-3 shrink-0 group py-1 transition-all duration-300"
          >
            <BrandLogo
              customSrc={storeData?.logo}
              className={`transition-all duration-300 object-contain ${
                isScrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-9 h-9 sm:w-11 sm:h-11'
              }`}
            />
            <div className="flex flex-col justify-center transition-all duration-300">
              <span
                className={`font-serif font-black tracking-wider text-[#111111] block leading-tight group-hover:text-brass-700 transition-all duration-300 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] ${
                  isScrolled
                    ? 'text-xs sm:text-sm md:text-base'
                    : 'text-sm sm:text-base md:text-lg'
                }`}
              >
                {storeData?.brandName || 'RAM PRASAD AGENCIES'}
              </span>
              <p
                className={`uppercase tracking-widest text-brass-700 font-extrabold truncate transition-all duration-300 ${
                  isScrolled
                    ? 'opacity-0 max-h-0 text-[0px] mt-0 overflow-hidden pointer-events-none'
                    : 'opacity-100 max-h-5 text-[8.5px] sm:text-[10px] mt-0.5'
                }`}
              >
                {storeData?.tagline &&
                  !storeData.tagline.includes('Vintage Horology') &&
                  !storeData.tagline.includes('Authorized & Imported') &&
                  !storeData.tagline.includes('TheWatchStore.in') &&
                  !storeData.tagline.toLowerCase().includes('ramprasadwatchstore')
                  ? storeData.tagline
                  : 'WATCHSTORE.IN'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-9 transition-all duration-300">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`font-bold tracking-wider uppercase text-[#2B2621] hover:text-brass-700 relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brass-600 hover:after:w-full after:transition-all after:duration-300 ${
                  isScrolled ? 'text-xs py-1' : 'text-xs lg:text-[13px] py-2'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Header Search Bar & Mobile Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 transition-all duration-300">
            {/* Desktop Live Search Bar */}
            <div
              className={`hidden md:block transition-all duration-300 ${
                isScrolled ? 'w-44 lg:w-56 focus-within:w-64' : 'w-48 lg:w-64 xl:w-80'
              }`}
            >
              <LiveWatchSearch
                allWatches={allWatches}
                onSelectWatch={onSelectWatch}
                className="w-full"
                placeholder={isScrolled ? 'Search watches...' : 'Search watch, brand, caliber...'}
              />
            </div>

            {/* Mobile Scrolled Search Toggle Icon */}
            {isScrolled && (
              <button
                onClick={() => setMobileSearchExpanded(!mobileSearchExpanded)}
                className={`md:hidden p-1.5 rounded-lg transition-colors focus:outline-none ${
                  mobileSearchExpanded
                    ? 'text-brass-700 bg-brass-100/60'
                    : 'text-[#3A3530] hover:text-[#1A1A1A]'
                }`}
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-[#3A3530] hover:text-[#1A1A1A] rounded-lg focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Row: Full at Top, Collapses into Compact State on Scroll */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            !isScrolled || mobileSearchExpanded
              ? 'max-h-20 opacity-100 pb-3 pt-0.5'
              : 'max-h-0 opacity-0 pb-0 pt-0 pointer-events-none'
          }`}
        >
          <LiveWatchSearch
            allWatches={allWatches}
            onSelectWatch={(watch) => {
              if (onSelectWatch) onSelectWatch(watch);
              setMobileSearchExpanded(false);
            }}
            className="w-full"
            isMobile={true}
            placeholder="Search PRX, Tsuyosa, Speedmaster..."
            onCloseMobile={() => {
              setMobileMenuOpen(false);
              setMobileSearchExpanded(false);
            }}
          />
        </div>
      </div>

      {/* Luxury Antique Gold Divider Line at Bottom of Header */}
      <div
        className={`h-[1.5px] w-full bg-gradient-to-r from-brass-600/10 via-brass-500/70 to-brass-600/10 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-40'
          }`}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-[#D8CEBC] px-4 py-4 space-y-1 shadow-2xl animate-fadeIn"
          style={{ backgroundColor: '#FAF8F5' }}
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block px-3 py-2.5 rounded-lg text-sm font-bold text-[#2D2825] hover:bg-[#F0EBE1] hover:text-brass-700 transition-colors uppercase tracking-wider"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
