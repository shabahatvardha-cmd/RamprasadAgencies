import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider, useStore, DEFAULT_VINTAGE_STORE_DATA } from './context/StoreContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WishlistDrawer from './components/WishlistDrawer';
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
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 120);
        return;
      }
    }
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {}
    }
  }, [pathname, hash]);
  return null;
}

function StorefrontContent() {
  const { storeData } = useStore();
  const currentData = storeData || DEFAULT_VINTAGE_STORE_DATA;
  const carousels = currentData.carousels || DEFAULT_VINTAGE_STORE_DATA.carousels;
  const contactPhone = currentData.contactPhone || '+91 98765 43210';

  // Modal & Wishlist state
  const [selectedWatchForModal, setSelectedWatchForModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('rpa_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Wishlist handlers
  const handleToggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id || w._id === item.id);
      let updated;
      if (exists) {
        updated = prev.filter((w) => w.id !== item.id && w._id !== item.id);
      } else {
        updated = [...prev, item];
      }
      try {
        localStorage.setItem('rpa_wishlist', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      return updated;
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => {
      const updated = prev.filter((w) => w.id !== id && w._id !== id);
      try {
        localStorage.setItem('rpa_wishlist', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
      return updated;
    });
  };

  // Combine all watches from store carousels and full fallback catalog into a unified collection
  const allStoreWatches = useMemo(() => {
    const rawList = [
      ...(carousels.newArrivals || []),
      ...(carousels.indianIcons || []),
      ...(carousels.collectorCapsule || []),
      ...(carousels.ourIcons || []),
      ...(carousels.flashDeals || []),
      ...FALLBACK_WATCHES,
    ];

    const seenNames = new Set();
    const seenImages = new Set();
    const unique = [];
    for (const item of rawList) {
      if (!item || !item.name) continue;
      const nameKey = item.name.toLowerCase().trim();
      const imgKey = (item.image || '').trim();
      if (seenNames.has(nameKey) || (imgKey && seenImages.has(imgKey))) continue;
      seenNames.add(nameKey);
      if (imgKey) seenImages.add(imgKey);
      unique.push(item);
    }
    return unique;
  }, [carousels]);

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
          wishlistCount={wishlist.length}
          onOpenWishlist={() => setIsWishlistOpen(true)}
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
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
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

        {/* 3. Wishlist Sliding Drawer */}
        <WishlistDrawer
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlist={wishlist}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          contactPhone={contactPhone}
          onSelectWatch={(item) => {
            setSelectedWatchForModal(item);
            setIsWishlistOpen(false);
          }}
        />

        {/* 4. Quick View Watch Specifications Modal */}
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
    } catch {}
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
