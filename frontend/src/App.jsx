import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore, DEFAULT_VINTAGE_STORE_DATA } from './context/StoreContext';
import FlashSaleRibbon from './components/FlashSaleRibbon';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CarouselSection from './components/CarouselSection';
import CategoryGrid from './components/CategoryGrid';
import VintageWatchAdShowcase from './components/VintageWatchAdShowcase';
import BrandMarquee from './components/BrandMarquee';
import CatalogSection from './components/CatalogSection';
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
    if (category === 'Indian Brands') {
      const targetEl = document.getElementById('indian-brands');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setSelectedCategory(category);
    const targetEl = document.getElementById('catalog');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter items by search query if provided
  const filterBySearch = (items = []) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.strap?.toLowerCase().includes(q) ||
        item.movement?.toLowerCase().includes(q)
    );
  };

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
        onSelectCategory={handleCategorySelect}
      />

      {/* 2. Flash Sale Promotion Ribbon (when active) */}
      <FlashSaleRibbon />

      {/* 3. Hero Watch Advertisement Photography Showcase */}
      <HeroBanner />

      {/* 5. Carousel 1: Shop New Arrivals */}
      <CarouselSection
        id="new-arrivals"
        badge="CURATED SEASON DROP"
        badgeColor="brass"
        title="Shop New Arrivals"
        subtitle="The latest horological references: open-heart mechanicals, aviator chronographs, and genuine calfskin leather straps."
        items={filterBySearch(carousels.newArrivals || [])}
        onQuickView={(watch) => setSelectedWatchForModal(watch)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        contactPhone={contactPhone}
      />

      {/* 6. Shop By Horology Category Grid (Swiss, Japanese, Chronographs, Skeletons, Indian) */}
      <CategoryGrid onSelectCategory={handleCategorySelect} />

      {/* 6B. Dedicated Indian Brands Carousel (Titan, HMT, Fastrack, Sonata) */}
      <CarouselSection
        id="indian-brands"
        badge="🇮🇳 PROUD INDIAN HOROLOGY"
        badgeColor="brass"
        title="Indian Watch Heritage & Icons"
        subtitle="From Titan's ultra-slim Edge and Octane chronographs to historic HMT Kohinoor mechanical legends and Fastrack street styles. Curated showroom collections."
        items={filterBySearch(carousels.indianIcons || [])}
        onQuickView={(watch) => setSelectedWatchForModal(watch)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        contactPhone={contactPhone}
      />

      {/* 7. Carousel 2: The Collector Capsule */}
      <CarouselSection
        id="collector-capsule"
        badge="LIMITED COLLECTOR CAPSULE"
        badgeColor="rust"
        title="The Collector Capsule"
        subtitle="Exclusive numbered releases, racing motorsport chronographs, and skeletonized mechanical movements built in limited quantities."
        items={filterBySearch(carousels.collectorCapsule || [])}
        onQuickView={(watch) => setSelectedWatchForModal(watch)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        contactPhone={contactPhone}
      />

      {/* 8. Signature Background Watch Advertisement & Craftsmanship Showcase */}
      <VintageWatchAdShowcase />

      {/* 9. Carousel 3: Our Icons */}
      <CarouselSection
        id="our-icons"
        badge="HERITAGE ICONS • EST. 1984"
        badgeColor="brass"
        title="Our Timeless Icons"
        subtitle="The timepieces that define our identity: classic Roman dials, rich saddle luggage leather, and everyday minimalist silhouettes."
        items={filterBySearch(carousels.ourIcons || [])}
        onQuickView={(watch) => setSelectedWatchForModal(watch)}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
        contactPhone={contactPhone}
      />

      {/* 10. Carousel 4: Flash Deals Vault (Rendered when Flash Sale is active) */}
      {flashSale.isActive && (
        <CarouselSection
          id="flash-deals"
          badge="FLASH SALE SPOTLIGHT"
          badgeColor="rust"
          title="Flash Sale Vault"
          subtitle="Special limited-time discounts up to 35% off. Use coupon code VINTAGE15 for extra savings."
          items={filterBySearch(carousels.flashDeals || [])}
          onQuickView={(watch) => setSelectedWatchForModal(watch)}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          contactPhone={contactPhone}
        />
      )}

      {/* 11. Authorized Brand Portfolios & Heritage Maisons */}
      <BrandMarquee
        brands={currentData.brands}
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          const targetEl = document.getElementById('catalog');
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 11B. Complete Horology Catalog with Origin Tabs & Direct WhatsApp Inquiry */}
      <CatalogSection
        watches={carousels.newArrivals || []}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        contactPhone={contactPhone}
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 12. Dual Showroom Experience Stores (Baldev Plaza & JalKal Building, Golghar) */}
      <div id="showrooms">
        <DualStorefront
          contactPhone={contactPhone}
          showrooms={currentData.showrooms}
        />
      </div>

      {/* 13. Bespoke Inquiries & Consultation Form */}
      <div id="inquiry">
        <CustomerInquiry
          contactPhone={contactPhone}
          inquiryTitle={currentData.inquiryTitle || "Custom Sourcing & Showroom Consultation"}
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
