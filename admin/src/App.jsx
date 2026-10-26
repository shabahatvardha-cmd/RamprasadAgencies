import React, { useState, useEffect, useCallback } from 'react';
import AdminTopBar from './components/visual/AdminTopBar';
import VisualHeader from './components/visual/VisualHeader';
import VisualFlashSale from './components/visual/VisualFlashSale';
import VisualHero from './components/visual/VisualHero';
import VisualCarouselSection from './components/visual/VisualCarouselSection';
import VisualCategoryGrid from './components/visual/VisualCategoryGrid';
import VisualEditorialAd from './components/visual/VisualEditorialAd';
import VisualBrandMarquee from './components/visual/VisualBrandMarquee';
import VisualShowrooms from './components/visual/VisualShowrooms';
import VisualInquiry from './components/visual/VisualInquiry';
import VisualFooter from './components/visual/VisualFooter';
import ActiveEditorModal from './components/visual/ActiveEditorModal';
import WatchEditModal from './components/visual/WatchEditModal';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import LeadsManagerModal from './components/LeadsManagerModal';
import AdminLogin from './components/AdminLogin';
import {
  getWatches,
  getSettings,
  updateSettings,
  createWatch,
  updateWatch,
  deleteWatch,
  getLeads,
} from './utils/api';
import { DEFAULT_VINTAGE_STORE_DATA, sanitizeStoreData } from './utils/defaults';
import { Loader2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'fossil_storefront_state_v2';
const BROADCAST_CHANNEL_NAME = 'fossil_store_realtime_sync';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return (
        localStorage.getItem('rpa_admin_auth') === 'true' ||
        sessionStorage.getItem('rpa_admin_auth') === 'true'
      );
    } catch {
      return false;
    }
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('rpa_admin_auth');
      sessionStorage.removeItem('rpa_admin_auth');
    } catch {}
    setIsAuthenticated(false);
  };

  const [isEditMode, setIsEditMode] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'hero' | 'flashSale' | 'categories' | 'editorial' | 'showrooms' | 'branding' | 'appearance' | null
  const [selectedWatchForEdit, setSelectedWatchForEdit] = useState(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [watchDeleteCandidate, setWatchDeleteCandidate] = useState(null);
  const [showMasterRestoreModal, setShowMasterRestoreModal] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  const [settings, setSettings] = useState(null);
  const [backendWatches, setBackendWatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ type = 'info', title = '', message = '' }) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  // Broadcast helper
  const broadcastUpdate = (payload) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({
          type: 'STORE_UPDATED',
          payload,
          timestamp: Date.now(),
        });
        channel.close();
      }
    } catch {
      // ignore
    }
  };

  // Fetch initial leads count for badge
  const refreshLeadsCount = useCallback(async () => {
    try {
      const newLeads = await getLeads({ status: 'New' });
      setNewLeadsCount(newLeads?.length || 0);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshLeadsCount();
  }, [refreshLeadsCount]);

  // Real-time broadcast listener for store updates and live incoming leads
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === 'NEW_LEAD') {
        setNewLeadsCount((prev) => prev + 1);
        showToast({
          type: 'info',
          title: 'New Customer Lead!',
          message: `${event.data.lead?.name || 'A customer'} submitted an inquiry for ${event.data.lead?.storeLocation || 'Showroom'}.`,
        });
      }
    };
    return () => channel.close();
  }, [showToast]);

  // Fetch settings from GET /api/settings
  const loadSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Could not load settings:', err);
    }
  }, []);

  // Fetch watches from GET /api/watches
  const loadWatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getWatches();
      setBackendWatches(data || []);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Watches Error',
        message: 'Could not load watches catalog from server.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadWatches();
    loadSettings();
  }, [loadWatches, loadSettings]);

  // Active Storefront Data with Fallbacks
  const currentStoreData = sanitizeStoreData(settings?.vintageStoreData);
  const appearance = currentStoreData.appearance || {};
  const primaryColor = appearance.primaryColor || '#C5A059';
  const backgroundColor = appearance.backgroundColor || '#FAF7F2';
  const charcoalColor = appearance.charcoalColor || '#1A1A1A';
  const headingFont = (appearance.headingFont && appearance.headingFont !== 'Playfair Display') ? appearance.headingFont : 'Plus Jakarta Sans';
  const bodyFont = appearance.bodyFont || 'Plus Jakarta Sans';
  const fontSizeBase = appearance.fontSizeScale === 'large' ? '17px' : appearance.fontSizeScale === 'small' ? '15px' : '16px';

  // Format backend watches for carousels
  const formattedWatches = (backendWatches || []).map((w) => ({
    id: w._id || w.id,
    _id: w._id || w.id,
    name: w.name,
    brand: w.brand,
    price: w.price,
    originalPrice: w.originalPrice || (w.price ? Math.round(w.price * 1.15) : 0),
    badge: w.badge || (w.featured ? 'Featured Drop' : 'In Stock'),
    badgeColor: 'brass',
    image: w.image,
    movement: w.movement || w.category || 'Automatic Movement',
    caseDiameter: w.caseDiameter || '42mm',
    caseSize: w.caseDiameter || '42mm',
    strapType: w.strapType || 'Top-Grain Leather',
    strap: w.strapType || 'Top-Grain Leather',
    inStock: w.inStock !== false,
    featured: Boolean(w.featured),
    description: w.description || '',
    storeLocation: w.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
    category: w.category || 'Automatic',
    collectionName: w.collectionName || 'newArrivals',
  }));

  // Distribute live backend watches into target carousels
  const newArrivalsBackend = formattedWatches.filter((w) => !w.collectionName || w.collectionName === 'newArrivals');
  const collectorBackend = formattedWatches.filter((w) => w.collectionName === 'collectorCapsule');
  const ourIconsBackend = formattedWatches.filter((w) => w.collectionName === 'ourIcons');
  const flashDealsBackend = formattedWatches.filter((w) => w.collectionName === 'flashDeals');
  const indianBackend = formattedWatches.filter((w) =>
    w.collectionName === 'indianIcons' ||
    ['titan', 'hmt', 'fastrack', 'sonata'].some((b) => (w.brand || '').toLowerCase().includes(b))
  );

  const newArrivalsList = newArrivalsBackend.length > 0
    ? [...newArrivalsBackend, ...(currentStoreData.carousels?.newArrivals || []).filter((d) => !newArrivalsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()))]
    : (currentStoreData.carousels?.newArrivals || DEFAULT_VINTAGE_STORE_DATA.carousels?.newArrivals || []);

  const collectorCapsuleList = collectorBackend.length > 0
    ? [...collectorBackend, ...(currentStoreData.carousels?.collectorCapsule || []).filter((d) => !collectorBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()))]
    : (currentStoreData.carousels?.collectorCapsule || DEFAULT_VINTAGE_STORE_DATA.carousels?.collectorCapsule || []);

  const ourIconsList = ourIconsBackend.length > 0
    ? [...ourIconsBackend, ...(currentStoreData.carousels?.ourIcons || []).filter((d) => !ourIconsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()))]
    : (currentStoreData.carousels?.ourIcons || DEFAULT_VINTAGE_STORE_DATA.carousels?.ourIcons || []);

  const flashDealsList = flashDealsBackend.length > 0
    ? [...flashDealsBackend, ...(currentStoreData.carousels?.flashDeals || []).filter((d) => !flashDealsBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()))]
    : (currentStoreData.carousels?.flashDeals || DEFAULT_VINTAGE_STORE_DATA.carousels?.flashDeals || []);

  const indianIconsList = indianBackend.length > 0
    ? [...indianBackend, ...(currentStoreData.carousels?.indianIcons || []).filter((d) => !indianBackend.some((bw) => bw.name.toLowerCase() === d.name.toLowerCase()))]
    : (currentStoreData.carousels?.indianIcons || DEFAULT_VINTAGE_STORE_DATA.carousels?.indianIcons || []);

  // Save Section Handler (Called from active editor modal)
  const handleSaveSection = async (updatedFields, sectionName) => {
    try {
      setIsSaving(true);
      const newVintageStoreData = {
        ...currentStoreData,
        ...updatedFields,
      };

      const payload = {
        vintageStoreData: newVintageStoreData,
        ...updatedFields,
      };

      if (updatedFields.contactPhone) {
        payload.contactPhone = updatedFields.contactPhone;
      }
      if (updatedFields.hero?.slides) {
        payload.heroSlides = updatedFields.hero.slides;
      }
      if (updatedFields.showrooms) {
        payload.showrooms = updatedFields.showrooms;
      }
      if (updatedFields.flashSale) {
        payload.flashSale = updatedFields.flashSale;
      }
      if (updatedFields.logo) {
        payload.logo = updatedFields.logo;
      }
      if (updatedFields.brands) {
        payload.brands = updatedFields.brands;
      }
      if (updatedFields.trustBadges) {
        payload.trustBadges = updatedFields.trustBadges;
      }
      if (updatedFields.announcements) {
        payload.announcements = updatedFields.announcements;
      }
      if (updatedFields.inquiryTitle) {
        payload.inquiryTitle = updatedFields.inquiryTitle;
      }
      if (updatedFields.inquirySubtitle) {
        payload.inquirySubtitle = updatedFields.inquirySubtitle;
      }
      if (updatedFields.footerCopyright) {
        payload.footerCopyright = updatedFields.footerCopyright;
      }

      // Persist locally
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newVintageStoreData));
      } catch {}

      // Broadcast to other tabs immediately
      broadcastUpdate(newVintageStoreData);

      // Persist to MongoDB backend
      await updateSettings(payload);

      showToast({
        type: 'success',
        title: `${sectionName} Updated`,
        message: 'Saved successfully. Live storefront updated in real time.',
      });

      await loadSettings();
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Save Error',
        message: err.message || 'Could not save changes to backend.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Watch Save Handler (Create or Update)
  const handleSaveWatch = async (watchFormData, watchId) => {
    try {
      setIsSaving(true);
      if (watchId) {
        await updateWatch(watchId, watchFormData);
        showToast({
          type: 'success',
          title: 'Watch Updated',
          message: `${watchFormData.name} has been updated.`,
        });
      } else {
        await createWatch(watchFormData);
        showToast({
          type: 'success',
          title: 'Watch Added',
          message: `${watchFormData.name} has been added to the catalog.`,
        });
      }
      await loadWatches();
      setIsWatchModalOpen(false);
      setSelectedWatchForEdit(null);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Watch Save Error',
        message: err.message || 'Could not save timepiece to backend.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Watch Delete Handler
  const handleConfirmDeleteWatch = async () => {
    if (!watchDeleteCandidate) return;
    try {
      setIsSaving(true);
      const id = watchDeleteCandidate._id || watchDeleteCandidate.id;
      if (id) {
        await deleteWatch(id);
      }
      showToast({
        type: 'success',
        title: 'Watch Removed',
        message: `${watchDeleteCandidate.name} has been deleted.`,
      });
      await loadWatches();
      setWatchDeleteCandidate(null);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Delete Error',
        message: err.message || 'Could not delete timepiece.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Master Restore Handler (All Website to Defaults)
  const handleMasterRestore = async () => {
    try {
      setIsSaving(true);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_VINTAGE_STORE_DATA));
      } catch {}

      broadcastUpdate(DEFAULT_VINTAGE_STORE_DATA);

      await updateSettings({
        vintageStoreData: DEFAULT_VINTAGE_STORE_DATA,
        heroTitle: DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].headline,
        heroSubtitle: DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].subheadline,
        contactPhone: DEFAULT_VINTAGE_STORE_DATA.contactPhone,
        announcementText: DEFAULT_VINTAGE_STORE_DATA.announcements.messages[0],
        heroSlides: DEFAULT_VINTAGE_STORE_DATA.hero.slides,
        showrooms: DEFAULT_VINTAGE_STORE_DATA.showrooms,
      });

      showToast({
        type: 'success',
        title: 'Master Website Reset',
        message: 'The entire website has been restored to factory vintage defaults.',
      });

      await loadSettings();
      setShowMasterRestoreModal(false);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Restore Failed',
        message: err.message || 'Could not restore defaults.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div
      style={{
        backgroundColor,
        color: charcoalColor,
        fontFamily: `'${bodyFont}', sans-serif`,
        fontSize: fontSizeBase,
      }}
      className="w-full min-h-screen overflow-x-clip selection:bg-brass-500 selection:text-white"
    >
      {/* Dynamic Font and Color Rules */}
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

      {/* 1. Sticky Luxury Visual Admin Control Bar */}
      <AdminTopBar
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onOpenModal={(modalType) => {
          if (modalType === 'watch-add') {
            setSelectedWatchForEdit(null);
            setIsWatchModalOpen(true);
          } else {
            setActiveModal(modalType);
          }
        }}
        onOpenMasterRestore={() => setShowMasterRestoreModal(true)}
        onOpenLeads={() => setIsLeadsModalOpen(true)}
        onLogout={handleLogout}
        newLeadsCount={newLeadsCount}
        isSaving={isSaving}
      />

      {/* 2. Top Announcement Ticker & Main Sticky Header */}
      <VisualHeader
        storeData={currentStoreData}
        isEditMode={isEditMode}
        onOpenEdit={(type) => setActiveModal(type)}
        wishlistCount={2}
      />

      {/* 3. Flash Sale Promotion Ribbon */}
      <VisualFlashSale
        flashSale={currentStoreData.flashSale}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('flashSale')}
        onQuickUpdateFlashSale={(updates) =>
          handleSaveSection(
            {
              flashSale: {
                ...currentStoreData.flashSale,
                ...updates,
              },
            },
            'Flash Sale'
          )
        }
      />

      {/* 4. Hero Watch Advertisement Photography Showcase */}
      <VisualHero
        heroData={currentStoreData.hero}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('hero')}
      />

      {/* 5. Carousel 1: Shop New Arrivals */}
      <VisualCarouselSection
        id="new-arrivals"
        badge="CURATED SEASON DROP"
        badgeColor="brass"
        title="Shop New Arrivals"
        subtitle="The latest horological references: open-heart mechanicals, aviator chronographs, and vegetable-tanned leather straps."
        items={newArrivalsList}
        isEditMode={isEditMode}
        onEditWatch={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
        onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
        onAddWatch={() => {
          setSelectedWatchForEdit(null);
          setIsWatchModalOpen(true);
        }}
        onQuickView={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
      />

      {/* 6. Shop By Category Grid (4 Horology Pillars) */}
      <VisualCategoryGrid
        categories={currentStoreData.categories}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('categories')}
      />

      {/* 6B. Carousel: Indian Watch Heritage & Icons */}
      <VisualCarouselSection
        id="indian-brands"
        badge="🇮🇳 PROUD INDIAN HOROLOGY"
        badgeColor="brass"
        title="Indian Watch Heritage & Icons"
        subtitle="From Titan's ultra-slim Edge and Octane chronographs to historic HMT Kohinoor mechanical legends and Fastrack street styles."
        items={indianIconsList}
        isEditMode={isEditMode}
        onEditWatch={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
        onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
        onAddWatch={() => {
          setSelectedWatchForEdit(null);
          setIsWatchModalOpen(true);
        }}
        onQuickView={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
      />

      {/* 7. Carousel 2: The Collector Capsule */}
      <VisualCarouselSection
        id="collector-capsule"
        badge="LIMITED COLLECTOR CAPSULE"
        badgeColor="rust"
        title="The Collector Capsule"
        subtitle="Exclusive numbered releases, racing motorsport chronographs, and skeletonized mechanical movements built in limited quantities."
        items={collectorCapsuleList}
        isEditMode={isEditMode}
        onEditWatch={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
        onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
        onAddWatch={() => {
          setSelectedWatchForEdit(null);
          setIsWatchModalOpen(true);
        }}
        onQuickView={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
      />

      {/* 8. Signature Craftsmanship Editorial Spotlight (Ref 84-MKII) */}
      <VisualEditorialAd
        editorialAd={currentStoreData.editorialAd}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('editorial')}
      />

      {/* 9. Carousel 3: Our Timeless Icons */}
      <VisualCarouselSection
        id="our-icons"
        badge="HERITAGE ICONS • EST. 1984"
        badgeColor="brass"
        title="Our Timeless Icons"
        subtitle="The timepieces that define our identity: classic Roman dials, rich saddle luggage leather, and everyday minimalist silhouettes."
        items={ourIconsList}
        isEditMode={isEditMode}
        onEditWatch={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
        onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
        onAddWatch={() => {
          setSelectedWatchForEdit(null);
          setIsWatchModalOpen(true);
        }}
        onQuickView={(watch) => {
          setSelectedWatchForEdit(watch);
          setIsWatchModalOpen(true);
        }}
      />

      {/* 10. Carousel 4: Flash Deals Vault (visible if active or in admin edit mode) */}
      {((currentStoreData.flashSale?.flashSale?.isActive ?? currentStoreData.flashSale?.isActive) || isEditMode) && (
        <VisualCarouselSection
          id="flash-deals"
          badge="FLASH SALE SPOTLIGHT"
          badgeColor="rust"
          title="Flash Sale Vault"
          subtitle="Special limited-time discounts up to 35% off. Use coupon code VINTAGE15 for extra savings."
          items={flashDealsList}
          isEditMode={isEditMode}
          onEditWatch={(watch) => {
            setSelectedWatchForEdit(watch);
            setIsWatchModalOpen(true);
          }}
          onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
          onAddWatch={() => {
            setSelectedWatchForEdit(null);
            setIsWatchModalOpen(true);
          }}
          onQuickView={(watch) => {
            setSelectedWatchForEdit(watch);
            setIsWatchModalOpen(true);
          }}
        />
      )}

      {/* 11. Authorized Brand Portfolios */}
      <VisualBrandMarquee
        brands={currentStoreData.brands}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('brands')}
      />

      {/* 12. Dual Showroom Experience Stores */}
      <VisualShowrooms
        showrooms={currentStoreData.showrooms}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('showrooms')}
      />

      {/* 13. Bespoke Inquiries & Consultation */}
      <VisualInquiry
        storeData={currentStoreData}
        isEditMode={isEditMode}
        onOpenEdit={(modal = 'inquiry') => setActiveModal(modal)}
        onOpenLeads={() => setIsLeadsModalOpen(true)}
      />

      {/* 14. Brand Lifestyle Footer */}
      <VisualFooter
        storeData={currentStoreData}
        isEditMode={isEditMode}
        onOpenEdit={() => setActiveModal('branding')}
      />

      {/* ===================================================================== */}
      {/* MODAL DIALOGS */}
      {/* ===================================================================== */}

      {/* Section Sub-Editor Modal (Hero, Flash Sale, Categories, Showrooms, Branding, Appearance) */}
      <ActiveEditorModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        storeData={currentStoreData}
        onSaveSection={handleSaveSection}
        showToast={showToast}
        isSaving={isSaving}
      />

      {/* Watch Create / Edit Modal */}
      <WatchEditModal
        watch={selectedWatchForEdit}
        isOpen={isWatchModalOpen}
        onClose={() => {
          setIsWatchModalOpen(false);
          setSelectedWatchForEdit(null);
        }}
        onSave={handleSaveWatch}
        isSaving={isSaving}
        showToast={showToast}
      />

      {/* Watch Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(watchDeleteCandidate)}
        title="Delete Timepiece"
        message={`Are you sure you want to permanently remove "${watchDeleteCandidate?.name}" from your catalog?`}
        confirmText="Yes, Delete Timepiece"
        isDanger={true}
        onConfirm={handleConfirmDeleteWatch}
        onCancel={() => setWatchDeleteCandidate(null)}
      />

      {/* Master Restore All Defaults Modal */}
      <ConfirmationModal
        isOpen={showMasterRestoreModal}
        title="Restore Entire Website to Curated Defaults"
        message="This will reset all headlines, hero slides, flash sale settings, category pillars, editorial showcases, showroom descriptions, colors, and typography back to the factory vintage luxury defaults. Are you sure you wish to proceed?"
        confirmText="Yes, Restore Entire Website"
        isDanger={true}
        onConfirm={handleMasterRestore}
        onCancel={() => setShowMasterRestoreModal(false)}
      />

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Agency Customer Inquiries & Leads Desk Modal */}
      <LeadsManagerModal
        isOpen={isLeadsModalOpen}
        onClose={() => {
          setIsLeadsModalOpen(false);
          refreshLeadsCount();
        }}
        showToast={showToast}
        onOpenFormEditor={() => setActiveModal('inquiry')}
      />
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
    console.error('Visual Admin ErrorBoundary caught:', error, errorInfo);
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
        <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-8 rounded-3xl bg-white border border-brass-500/30 space-y-4 shadow-2xl">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Visual Editor Safe Recovery
            </h2>
            <p className="text-xs text-[#6B635B] leading-relaxed">
              {this.state.error?.message || 'Recovering state cache.'}
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 text-white hover:bg-brass-500 transition-all shadow-md"
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

export default function AdminAppWithBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
