import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { StoreProvider, useStore, DEFAULT_VINTAGE_STORE_DATA } from './context/StoreContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WatchModal from './components/WatchModal';
import Footer from './components/Footer';
import BrandLogo from './components/BrandLogo';
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import RetailerApplicationPage from './pages/RetailerApplicationPage';
import SalesSupportPage from './pages/SalesSupportPage';
import { FALLBACK_WATCHES } from './data/fallbackWatches';
import { Phone, ArrowLeft } from 'lucide-react';

// Scroll to top or anchor on route/hash change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let targetId = hash ? hash.replace('#', '') : null;
    if (!targetId && pathname === '/') {
      try {
        const savedAnchor = sessionStorage.getItem('rpa_return_anchor');
        if (savedAnchor) {
          targetId = savedAnchor;
          sessionStorage.removeItem('rpa_return_anchor');
        }
      } catch {}
    }

    if (targetId) {
      let attempts = 0;
      const checkAndScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          const headerOffset = 80;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo(0, Math.max(0, offsetPosition));
        } else if (attempts < 25) {
          attempts++;
          setTimeout(checkAndScroll, 50);
        }
      };
      setTimeout(checkAndScroll, 15);
      return;
    }
    try {
      window.scrollTo(0, 0);
    } catch { }
  }, [pathname, hash]);
  return null;
}

// Dedicated Dynamic Header for B2B Form Pages
// Features a dynamic scroll-triggered shrinking transition and refined compact contact bar
function FormPageHeader({ brandName, tagline, logo, contactPhone }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const cleanPhone = String(contactPhone || '919876543210').replace(/[^0-9]/g, '');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 font-sans text-[#1A1A1A] ${
        isScrolled
          ? 'bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#D8CEBC]/90 shadow-[0_8px_30px_-4px_rgba(20,15,10,0.14)]'
          : 'bg-[#FAF8F5] border-b border-[#E8E1D5] shadow-xs'
      }`}
      style={{ backgroundColor: isScrolled ? 'rgba(250, 248, 245, 0.94)' : '#FAF8F5' }}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 transition-all duration-300">
        <div
          className={`flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-13 sm:h-14' : 'h-16 sm:h-20'
          }`}
        >
          {/* Brand Logo & Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group py-1 transition-all duration-300 select-none"
          >
            <BrandLogo
              customSrc={logo}
              className={`transition-all duration-300 object-contain shrink-0 ${
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
                {brandName}
              </span>
              <div
                className={`flex items-center gap-2 transition-all duration-300 ${
                  isScrolled
                    ? 'opacity-0 max-h-0 text-[0px] mt-0 overflow-hidden pointer-events-none'
                    : 'opacity-100 max-h-5 text-[8.5px] sm:text-[10px] mt-0.5'
                }`}
              >
                <p className="uppercase tracking-widest text-brass-700 font-extrabold truncate">
                  {tagline && !tagline.toLowerCase().includes('ramprasadwatchstore')
                    ? tagline
                    : 'AUTHORIZED HOROLOGY DISTRIBUTION'}
                </p>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-brass-400 shrink-0" />
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-stone-600 bg-stone-200/60 px-2 py-0.5 rounded-full border border-stone-300/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Trade Portal</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Minimalist Compact Utility Capsule */}
          <div className="flex items-center shrink-0">
            <div
              className={`inline-flex items-center rounded-full bg-white/90 hover:bg-white border border-[#DDD5C7] hover:border-brass-600/50 shadow-2xs hover:shadow-xs transition-all duration-300 ${
                isScrolled
                  ? 'px-2.5 py-1 gap-2 text-[10px]'
                  : 'px-3 py-1.5 gap-2.5 sm:gap-3 text-[11px]'
              }`}
            >
              {/* 1. Desk Contact Info */}
              <a
                href={`tel:${cleanPhone}`}
                title="Call Authorized Distribution Desk"
                className="inline-flex items-center gap-1.5 text-stone-600 hover:text-stone-950 transition-colors group/tel select-none"
              >
                <span className="w-4 h-4 rounded-full bg-brass-500/15 text-brass-700 flex items-center justify-center shrink-0 group-hover/tel:scale-110 transition-transform">
                  <Phone className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                </span>
                <span className="tracking-tight whitespace-nowrap">
                  <span className="hidden md:inline text-stone-400 font-normal">Desk: </span>
                  <span className="hidden sm:inline font-semibold text-stone-800 group-hover/tel:text-stone-950">{contactPhone}</span>
                  <span className="sm:hidden font-bold text-stone-800 text-[10px]">Desk</span>
                </span>
              </a>

              {/* Delicate Vertical Divider */}
              <span className="w-px h-3 bg-stone-300/80 shrink-0" />

              {/* 2. Return to Store Action (Navigates directly back to the B2B cards area) */}
              <Link
                to="/#retailer-support"
                title="Return to Retailer & Sales Support Area"
                className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-stone-800 hover:text-brass-700 transition-colors group/back whitespace-nowrap text-[10px] sm:text-[10.5px]"
              >
                <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brass-700 transition-transform group-hover/back:-translate-x-0.5" />
                <span className="hidden sm:inline">Return to Store</span>
                <span className="sm:hidden">Store</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Clean Minimal Footer for Form Pages matching the Website's Footer Palette (#EDE7DE)
function FormPageFooter({ brandName }) {
  return (
    <footer className="w-full bg-[#EDE7DE] border-t border-[#DDD5C7] text-[#5A524A] text-xs py-8">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-serif text-sm font-bold text-[#1A1A1A] tracking-wide">
            {brandName} • B2B & Wholesale Operations Desk
          </p>
          <p className="text-[11px] text-[#7A7268]">
            Golghar, Gorakhpur, Uttar Pradesh — 273001 | Authorized Horology Distribution
          </p>
        </div>

        <div className="text-xs text-[#7A7268]">
          © {new Date().getFullYear()} All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

function StorefrontContent() {
  const { storeData, liveWatches } = useStore();
  const currentData = storeData || DEFAULT_VINTAGE_STORE_DATA;
  const contactPhone = currentData.contactPhone || '+91 98765 43210';
  const location = useLocation();

  // Check if current route is a dedicated B2B / Support form page
  const isFormPage =
    location.pathname.startsWith('/retailer-application') ||
    location.pathname.startsWith('/sales-support');

  // Modal & Search state
  const [selectedWatchForModal, setSelectedWatchForModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  // Single source of truth for watches: backend live updates, falling back to clean catalog
  const allStoreWatches = useMemo(() => {
    if (Array.isArray(liveWatches) && liveWatches.length > 0) {
      return liveWatches;
    }
    return FALLBACK_WATCHES;
  }, [liveWatches]);

  // Dynamic appearance variables from Admin Appearance Studio
  const appearance = currentData.appearance || {};
  const primaryColor = appearance.primaryColor || '#C5A059';
  const backgroundColor = appearance.backgroundColor || '#FAF7F2';
  const charcoalColor = appearance.charcoalColor || '#1A1A1A';
  const headingFont =
    appearance.headingFont && appearance.headingFont !== 'Playfair Display'
      ? appearance.headingFont
      : 'Plus Jakarta Sans';
  const bodyFont = appearance.bodyFont || 'Plus Jakarta Sans';
  const fontSizeBase =
    appearance.fontSizeScale === 'large'
      ? '17px'
      : appearance.fontSizeScale === 'small'
        ? '15px'
        : '16px';

  // --- 1. DEDICATED B2B FORM PAGES (NO FLASH DEALS, NO RETAIL SHOPPING NAV LINKS) ---
  if (isFormPage) {
    return (
      <div
        style={{
          backgroundColor: '#FAF7F2',
          fontFamily: `'${bodyFont}', sans-serif`,
          fontSize: fontSizeBase,
        }}
        className="w-full min-h-screen overflow-x-clip font-sans selection:bg-brass-500 selection:text-white flex flex-col justify-between"
      >
        <ScrollToTop />
        <FormPageHeader
          brandName={currentData.brandName || 'RAM PRASAD AGENCIES'}
          tagline={currentData.tagline}
          logo={currentData.logo}
          contactPhone={contactPhone}
        />
        <main className="flex-1">
          <Routes>
            <Route
              path="/retailer-application"
              element={<RetailerApplicationPage contactPhone={contactPhone} />}
            />
            <Route
              path="/sales-support"
              element={<SalesSupportPage contactPhone={contactPhone} />}
            />
          </Routes>
        </main>
        <FormPageFooter brandName={currentData.brandName || 'RAM PRASAD AGENCIES'} />
      </div>
    );
  }

  // --- 2. REGULAR STOREFRONT (HOMEPAGE, BRAND PAGES, CATALOG) ---
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: charcoalColor,
        fontFamily: `'${bodyFont}', sans-serif`,
        fontSize: fontSizeBase,
      }}
      className="w-full min-h-screen overflow-x-clip font-sans selection:bg-brass-500 selection:text-white flex flex-col justify-between"
    >
      <ScrollToTop />
      <style>{`
        :root {
          --color-primary: ${primaryColor};
          --color-bg: ${backgroundColor};
          --color-charcoal: ${charcoalColor};
          --font-heading: '${headingFont}', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --font-body: '${bodyFont}', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .font-serif {
          font-family: '${headingFont}', 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          letter-spacing: -0.025em;
        }
        .font-sans {
          font-family: '${bodyFont}', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
      `}</style>

      {/* 0. Top Scrolling Marquee Announcement Ticker */}
      <AnnouncementBar />

      {/* 1. Vintage Luxury Sticky Navigation Header with Search & Nav Menu */}
      <Header
        allWatches={allStoreWatches}
        onSelectWatch={setSelectedWatchForModal}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* 2. Page Routes */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                storeData={currentData}
                contactPhone={contactPhone}
                onSelectBrand={setSelectedBrand}
              />
            }
          />
          <Route
            path="/brand/:brandSlug"
            element={
              <BrandPage
                watches={allStoreWatches}
                contactPhone={contactPhone}
                onSelectWatch={setSelectedWatchForModal}
              />
            }
          />
          <Route
            path="*"
            element={
              <HomePage
                storeData={currentData}
                contactPhone={contactPhone}
                onSelectBrand={setSelectedBrand}
              />
            }
          />
        </Routes>
      </div>

      {/* 3. Quick View Watch Specifications Modal */}
      {selectedWatchForModal && (
        <WatchModal
          watch={selectedWatchForModal}
          onClose={() => setSelectedWatchForModal(null)}
          contactPhone={contactPhone}
        />
      )}

      {/* 4. Floating WhatsApp Concierge */}
      <FloatingWhatsApp contactPhone={contactPhone} />

      {/* 5. Vintage Lifestyle Brand Footer */}
      <Footer />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Storefront ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('fossil_storefront_state_v2');
    } catch { }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#100F0E] text-cream-100 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-[#1A1A1A] border border-brass-500/30 space-y-4 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-cream-50">
              Storefront Safe Recovery
            </h2>
            <p className="text-xs text-cream-300 leading-relaxed">
              {this.state.error?.message || 'Recovering state cache.'}
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-500 text-charcoal-950 hover:bg-brass-400 transition-all shadow-md"
              >
                Reset To Curated Defaults & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <StorefrontContent />
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
}
