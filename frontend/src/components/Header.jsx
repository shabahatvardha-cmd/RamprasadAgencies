import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LiveWatchSearch from './LiveWatchSearch';

export default function Header({
  wishlistCount = 0,
  onOpenWishlist,
  allWatches = [],
  onSelectWatch,
  onSearch,
  searchQuery,
  onSelectCategory,
}) {
  const { storeData } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll to enhance contrast, border and elevation over underlying sections
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch {
          window.scrollTo(0, 0);
        }
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
          el.scrollIntoView({ behavior: 'smooth' });
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
          ? 'bg-[#FAF8F5] border-b border-[#D8CEBC] shadow-[0_8px_30px_-4px_rgba(20,15,10,0.18)]'
          : 'bg-[#FAF8F5] border-b border-[#E8E1D5] shadow-sm'
      }`}
      style={{ backgroundColor: '#FAF8F5' }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Brand Logo & Name */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-1"
          >
            <BrandLogo customSrc={storeData?.logo} className="w-9 h-9 sm:w-11 sm:h-11" />
            <div className="flex flex-col justify-center">
              <span className="font-serif text-sm sm:text-base md:text-lg font-black tracking-wider text-[#111111] block leading-tight group-hover:text-brass-700 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                {storeData?.brandName || 'RAM PRASAD AGENCIES'}
              </span>
              <p className="text-[8.5px] sm:text-[10px] uppercase tracking-widest text-brass-700 font-extrabold truncate mt-0.5">
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
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs lg:text-[13px] font-bold tracking-wider uppercase text-[#2B2621] hover:text-brass-700 relative py-2 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-brass-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Header Search Bar & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop Live Search Bar */}
            <LiveWatchSearch
              allWatches={allWatches}
              onSelectWatch={onSelectWatch}
              className="hidden md:block w-48 lg:w-64 xl:w-80"
              placeholder="Search watch, brand, caliber..."
            />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#3A3530] hover:text-[#1A1A1A] rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row with Live Results */}
        <div className="md:hidden pb-3 pt-0.5">
          <LiveWatchSearch
            allWatches={allWatches}
            onSelectWatch={onSelectWatch}
            className="w-full"
            isMobile={true}
            placeholder="Search PRX, Tsuyosa, Speedmaster..."
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Luxury Antique Gold Divider Line at Bottom of Header */}
      <div
        className={`h-[1.5px] w-full bg-gradient-to-r from-brass-600/10 via-brass-500/70 to-brass-600/10 transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-40'
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
