import React, { useState, useEffect, useMemo } from 'react';
import { StoreProvider, useStore, DEFAULT_VINTAGE_STORE_DATA } from './context/StoreContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import BrandMarquee from './components/BrandMarquee';
import DualStorefront from './components/DualStorefront';
import CustomerInquiry from './components/CustomerInquiry';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WishlistDrawer from './components/WishlistDrawer';
import WatchModal from './components/WatchModal';
import Footer from './components/Footer';

function StorefrontContent() {
  const { storeData } = useStore();
  const currentData = storeData || DEFAULT_VINTAGE_STORE_DATA;
  const carousels = currentData.carousels || DEFAULT_VINTAGE_STORE_DATA.carousels;
  const flashSale = currentData.flashSale?.flashSale || currentData.flashSale || DEFAULT_VINTAGE_STORE_DATA.flashSale;
  const contactPhone = currentData.contactPhone || '+91 98765 43210';



  // Modal & Wishlist state
  const [selectedWatchForModal, setSelectedWatchForModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('rpa_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Global click-outside listener: if user clicked outside brand buttons/cards, deselect brand to 'ALL'
  useEffect(() => {
    if (!selectedBrand || selectedBrand === 'ALL') return;

    const handleGlobalClick = (e) => {
      // Don't deselect if clicking inside a brand button/card
      if (e.target.closest('[data-brand-btn]')) {
        return;
      }
      // Don't deselect if clicking inside a watch card (user wants to open the watch modal)
      if (e.target.closest('[data-watch-card]')) {
        return;
      }
      // Don't deselect if clicking inside the watch modal
      if (e.target.closest('[data-watch-modal]')) {
        return;
      }
      // Don't deselect if interacting with form inputs, selects
      if (e.target.closest('input, select')) {
        return;
      }
      // Don't deselect if clicking on wishlist button or drawer
      if (e.target.closest('[data-wishlist-trigger]') || e.target.closest('[data-wishlist-drawer]')) {
        return;
      }

      // Any click on background, margins, text, outside the brand button -> deselect to 'ALL'
      setSelectedBrand('ALL');
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleGlobalClick);
    }, 120);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [selectedBrand]);

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const targetEl = document.getElementById('catalog');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Combine all watches from store carousels into a unified collection
  const allStoreWatches = useMemo(() => {
    const rawList = [
      ...(carousels.newArrivals || []),
      ...(carousels.indianIcons || []),
      ...(carousels.collectorCapsule || []),
      ...(carousels.ourIcons || []),
      ...(carousels.flashDeals || []),
    ];

    const seen = new Set();
    const unique = [];
    for (const item of rawList) {
      if (!item) continue;
      const key = (item.name || item.id || item._id || '').toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }
    return unique;
  }, [carousels]);

  // Dynamic appearance variables from Admin Appearance Studio
  const appearance = currentData.appearance || {};
  const primaryColor = appearance.primaryColor || '#C5A059';
  const backgroundColor = appearance.backgroundColor || '#FAF7F2';
  const charcoalColor = appearance.charcoalColor || '#1A1A1A';
  const headingFont = (appearance.headingFont && appearance.headingFont !== 'Playfair Display') ? appearance.headingFont : 'Plus Jakarta Sans';
  const bodyFont = appearance.bodyFont || 'Plus Jakarta Sans';
  const fontSizeBase = appearance.fontSizeScale === 'large' ? '17px' : appearance.fontSizeScale === 'small' ? '15px' : '16px';

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: charcoalColor,
        fontFamily: `'${bodyFont}', sans-serif`,
        fontSize: fontSizeBase,
      }}
      className="w-full min-h-screen overflow-x-clip font-sans selection:bg-brass-500 selection:text-white"
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
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* 2. Hero Watch Photography Showcase */}
      <HeroBanner />

      {/* 3. The Maison Portfolio & On-Demand Timepiece Showcase */}
      <BrandMarquee
        brands={currentData.brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        watches={allStoreWatches}
        contactPhone={contactPhone}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onSelectWatch={setSelectedWatchForModal}
      />

      {/* 5. Dual Showroom Experience Stores (Baldev Plaza & JalKal Building, Golghar) */}
      <div id="showrooms">
        <DualStorefront
          contactPhone={contactPhone}
          showrooms={currentData.showrooms}
        />
      </div>

      {/* 6. Bespoke Inquiries & Consultation Form */}
      <div id="inquiry">
        <CustomerInquiry
          contactPhone={contactPhone}
          inquiryTitle={currentData.inquiryTitle || "Showroom Consultation & Inquiries"}
          inquirySubtitle={currentData.inquirySubtitle || "Looking for a specific vintage reference, limited edition release, or looking to schedule a private fitting at Baldev Plaza or JalKal Building? Connect with our horology team."}
        />
      </div>

      {/* 14. Wishlist Sliding Drawer */}
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

      {/* 15. Quick View Watch Specifications Modal */}
      {selectedWatchForModal && (
        <WatchModal
          watch={selectedWatchForModal}
          onClose={() => setSelectedWatchForModal(null)}
          contactPhone={contactPhone}
        />
      )}

      {/* 16. Floating WhatsApp Concierge */}
      <FloatingWhatsApp contactPhone={contactPhone} />

      {/* 17. Vintage Lifestyle Brand Footer */}
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
        <StorefrontContent />
      </StoreProvider>
    </ErrorBoundary>
  );
}
