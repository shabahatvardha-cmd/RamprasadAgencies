import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore, DEFAULT_VINTAGE_STORE_DATA } from './context/StoreContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WatchModal from './components/WatchModal';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BrandPage from './pages/BrandPage';
import { FALLBACK_WATCHES } from './data/fallbackWatches';

// Scroll to top or anchor on route/hash change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      let attempts = 0;
      const checkAndScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (attempts < 10) {
          attempts++;
          setTimeout(checkAndScroll, 70);
        }
      };
      setTimeout(checkAndScroll, 50);
      return;
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch { }
    }
  }, [pathname, hash]);
  return null;
}

function StorefrontContent() {
  const { storeData, liveWatches } = useStore();
  const currentData = storeData || DEFAULT_VINTAGE_STORE_DATA;
  const carousels = currentData.carousels || DEFAULT_VINTAGE_STORE_DATA.carousels;
  const contactPhone = currentData.contactPhone || '+91 98765 43210';

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

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div
        style={{
          backgroundColor: backgroundColor,
          color: charcoalColor,
          fontFamily: `'${bodyFont}', sans-serif`,
          fontSize: fontSizeBase,
        }}
        className="w-full min-h-screen overflow-x-clip font-sans selection:bg-brass-500 selection:text-white flex flex-col justify-between"
      >
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

        {/* 1. Vintage Luxury Sticky Navigation Header */}
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

        {/* 5. Floating WhatsApp Concierge */}
        <FloatingWhatsApp contactPhone={contactPhone} />

        {/* 6. Vintage Lifestyle Brand Footer */}
        <Footer />
      </div>
    </BrowserRouter>
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
        <StorefrontContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
