import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminTopBar from './components/visual/AdminTopBar';
import VisualHeader from './components/visual/VisualHeader';
import VisualHero from './components/visual/VisualHero';
import VisualAbout from './components/visual/VisualAbout';
import VisualBrandMarquee from './components/visual/VisualBrandMarquee';
import VisualShowrooms from './components/visual/VisualShowrooms';
import VisualInquiry from './components/visual/VisualInquiry';
import VisualFooter from './components/visual/VisualFooter';
import ActiveEditorModal from './components/visual/ActiveEditorModal';
import WatchEditModal from './components/visual/WatchEditModal';
import WatchManager from './components/WatchManager';
import ConfirmationModal from './components/ConfirmationModal';
import Toast from './components/Toast';
import LeadsManagerModal from './components/LeadsManagerModal';
import AdminLogin from './components/AdminLogin';
import {
  getWatches,
  getSettings,
  updateSettings,
  resetSettings,
  resetWatches,
  createWatch,
  updateWatch,
  deleteWatch,
  getLeads,
} from './utils/api';
import { DEFAULT_VINTAGE_STORE_DATA, sanitizeStoreData } from './utils/defaults';
import { FALLBACK_WATCHES } from './data/fallbackWatches';
import { PRISTINE_BASELINE_WATCHES } from './data/pristineBaselineWatches';
import { Loader2, X } from 'lucide-react';

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
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  const [marqueeBrand, setMarqueeBrand] = useState(() => {
    try {
      return sessionStorage.getItem('rp_admin_marquee_brand') || 'ALL';
    } catch {
      return 'ALL';
    }
  });

  const handleSelectMarqueeBrand = (brand) => {
    setMarqueeBrand(brand);
    try {
      sessionStorage.setItem('rp_admin_marquee_brand', brand);
    } catch {
      // ignore
    }
  };

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

  const broadcastWatchChange = () => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        channel.postMessage({
          type: 'WATCHES_UPDATED',
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

  // Fetch watches from GET /api/watches with fallback to synchronized FALLBACK_WATCHES
  const loadWatches = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getWatches();
      if (Array.isArray(data) && data.length > 0) {
        setBackendWatches(data);
      } else {
        setBackendWatches(FALLBACK_WATCHES);
      }
    } catch (err) {
      console.warn('Backend unavailable, using synchronized fallback catalog:', err.message);
      setBackendWatches(FALLBACK_WATCHES);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  // Unified single source of truth for all watches: backend live updates with synchronized fallback
  const allStoreWatches = useMemo(() => {
    if (Array.isArray(formattedWatches) && formattedWatches.length > 0) {
      return formattedWatches;
    }
    return FALLBACK_WATCHES;
  }, [formattedWatches]);

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
      if (updatedFields.contentOverrides) {
        payload.contentOverrides = updatedFields.contentOverrides;
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

  // Watch Save Handler (Create or Update) with resilient instant local reactivity
  const handleSaveWatch = async (watchFormData, watchId) => {
    try {
      setIsSaving(true);
      if (watchFormData?.brand) {
        handleSelectMarqueeBrand(watchFormData.brand);
      }
      let savedWatch = null;
      if (watchId) {
        try {
          savedWatch = await updateWatch(watchId, watchFormData);
        } catch (apiErr) {
          console.warn('Backend update failed, applying local update:', apiErr.message);
          savedWatch = { ...watchFormData, id: watchId, _id: watchId };
        }
        // Update local React state immediately so UI refreshes without wait
        setBackendWatches((prev) =>
          prev.map((w) => ((w._id === watchId || w.id === watchId) ? { ...w, ...watchFormData } : w))
        );
        showToast({
          type: 'success',
          title: 'Watch Updated',
          message: `${watchFormData.name} has been updated.`,
        });
      } else {
        try {
          savedWatch = await createWatch(watchFormData);
        } catch (apiErr) {
          console.warn('Backend create failed, applying local create:', apiErr.message);
          const newId = `watch-${Date.now()}`;
          savedWatch = { ...watchFormData, id: newId, _id: newId };
        }
        setBackendWatches((prev) => [savedWatch, ...prev]);
        showToast({
          type: 'success',
          title: 'Watch Added',
          message: `${watchFormData.name} has been added to the catalog.`,
        });
      }
      broadcastWatchChange();
      setIsWatchModalOpen(false);
      setSelectedWatchForEdit(null);

      // Keep user smoothly positioned right at the edited watch card
      const targetId = watchId || savedWatch?._id || savedWatch?.id;
      if (targetId) {
        setTimeout(() => {
          const cardEl = document.getElementById(`watch-card-${targetId}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 80);
      }
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

  // Watch Delete Handler with resilient instant local reactivity
  const handleConfirmDeleteWatch = async () => {
    if (!watchDeleteCandidate) return;
    try {
      setIsSaving(true);
      const id = watchDeleteCandidate._id || watchDeleteCandidate.id;
      if (id) {
        try {
          await deleteWatch(id);
        } catch (apiErr) {
          console.warn('Backend delete failed, applying local delete:', apiErr.message);
        }
        // Immediately remove from local React state
        setBackendWatches((prev) => prev.filter((w) => w._id !== id && w.id !== id));
      }
      showToast({
        type: 'success',
        title: 'Watch Removed',
        message: `${watchDeleteCandidate.name} has been deleted.`,
      });
      broadcastWatchChange();
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
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_VINTAGE_STORE_DATA));
      } catch {}

      broadcastUpdate(DEFAULT_VINTAGE_STORE_DATA);

      // 1. Call backend reset settings endpoint
      try {
        await resetSettings();
      } catch (resetErr) {
        console.warn('Backend reset settings endpoint fallback:', resetErr.message);
      }

      // 2. Overwrite settings with full pristine factory defaults
      await updateSettings({
        vintageStoreData: DEFAULT_VINTAGE_STORE_DATA,
        heroTitle: DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].headline,
        heroSubtitle: DEFAULT_VINTAGE_STORE_DATA.hero.slides[0].subheadline,
        contactPhone: DEFAULT_VINTAGE_STORE_DATA.contactPhone,
        announcementText: DEFAULT_VINTAGE_STORE_DATA.announcements.messages[0],
        heroSlides: DEFAULT_VINTAGE_STORE_DATA.hero.slides,
        showrooms: DEFAULT_VINTAGE_STORE_DATA.showrooms,
        flashSale: DEFAULT_VINTAGE_STORE_DATA.flashSale,
        logo: DEFAULT_VINTAGE_STORE_DATA.logo,
        brands: DEFAULT_VINTAGE_STORE_DATA.brands,
        trustBadges: DEFAULT_VINTAGE_STORE_DATA.trustBadges,
        announcements: DEFAULT_VINTAGE_STORE_DATA.announcements,
        inquiryTitle: DEFAULT_VINTAGE_STORE_DATA.inquiryTitle,
        footerCopyright: DEFAULT_VINTAGE_STORE_DATA.footerCopyright,
        footerVipBadge: DEFAULT_VINTAGE_STORE_DATA.footerVipBadge,
        footerVipTitle: DEFAULT_VINTAGE_STORE_DATA.footerVipTitle,
        footerVipSubtitle: DEFAULT_VINTAGE_STORE_DATA.footerVipSubtitle,
        appearance: DEFAULT_VINTAGE_STORE_DATA.appearance,
        contentOverrides: {},
      });

      // 3. Reset watch catalog back to pristine factory baseline (all 240 models in stock, prices unrevealed)
      let restored = PRISTINE_BASELINE_WATCHES.map((w) => ({
        ...w,
        inStock: true,
        price: null,
        originalPrice: null,
        hidePrice: true,
      }));

      try {
        const apiWatches = await resetWatches();
        if (Array.isArray(apiWatches) && apiWatches.length > 0) {
          restored = apiWatches;
        }
      } catch (watchResetErr) {
        console.warn('Backend reset watches endpoint fallback:', watchResetErr.message);
      }

      // 4. Update local watches state so UI immediately shows all in stock and clean
      setBackendWatches(restored);
      broadcastWatchChange();

      // 5. Broadcast master reset to all open browser windows and tabs
      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const ch = new BroadcastChannel('fossil_store_realtime_sync');
          ch.postMessage({ type: 'MASTER_FACTORY_RESET', timestamp: Date.now() });
          ch.close();
        }
      } catch {}

      showToast({
        type: 'success',
        title: 'Master Website Reset',
        message: 'The entire website and timepiece catalog have been restored to factory baseline condition.',
      });

      setShowMasterRestoreModal(false);

      // Clean browser refresh after 650ms to ensure 100% clean memory and DOM state
      setTimeout(() => {
        window.location.reload();
      }, 650);
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
          } else if (modalType === 'inventory') {
            setIsInventoryModalOpen(true);
          } else {
            setActiveModal(modalType);
          }
        }}
        onOpenMasterRestore={() => setShowMasterRestoreModal(true)}
        onOpenLeads={() => setIsLeadsModalOpen(true)}
        onOpenInventory={() => setIsInventoryModalOpen(true)}
        onLogout={handleLogout}
        newLeadsCount={newLeadsCount}
        isSaving={isSaving}
      />

      {/* 2. Top Announcement Ticker & Main Sticky Header */}
      <VisualHeader
        storeData={currentStoreData}
        isEditMode={isEditMode}
        onOpenEdit={(type) => setActiveModal(type)}
      />

      {/* 3. Hero Watch Advertisement Photography Showcase */}
      <div id="hero">
        <VisualHero
          heroData={currentStoreData.hero}
          isEditMode={isEditMode}
          onOpenEdit={() => setActiveModal('hero')}
        />
      </div>

      {/* 4. About - Certified Watchmaking Pedigree */}
      <div id="about">
        <VisualAbout
          storeData={currentStoreData}
          isEditMode={isEditMode}
          onOpenEdit={() => setActiveModal('general')}
        />
      </div>

      {/* 5. The Maison Portfolio & Interactive Brand Timepiece Showcase */}
      <div id="brands">
        <VisualBrandMarquee
          brands={currentStoreData.brands}
          watches={allStoreWatches}
          isEditMode={isEditMode}
          selectedBrand={marqueeBrand}
          onSelectBrand={handleSelectMarqueeBrand}
          onOpenEdit={(type = 'branding') => setActiveModal(type)}
          onEditWatch={(watch) => {
            if (watch?.brand) {
              handleSelectMarqueeBrand(watch.brand);
            }
            setSelectedWatchForEdit(watch);
            setIsWatchModalOpen(true);
          }}
          onDeleteWatch={(watch) => setWatchDeleteCandidate(watch)}
          onAddWatch={(defaults) => {
            if (defaults?.brand) {
              handleSelectMarqueeBrand(defaults.brand);
            }
            setSelectedWatchForEdit(defaults || null);
            setIsWatchModalOpen(true);
          }}
          onQuickView={(watch) => {
            if (watch?.brand) {
              handleSelectMarqueeBrand(watch.brand);
            }
            setSelectedWatchForEdit(watch);
            setIsWatchModalOpen(true);
          }}
        />
      </div>

      {/* 5. Dual Showroom Experience Stores (Baldev Plaza & JalKal Building) */}
      <div id="showrooms">
        <VisualShowrooms
          showrooms={currentStoreData.showrooms}
          isEditMode={isEditMode}
          onOpenEdit={() => setActiveModal('showrooms')}
        />
      </div>

      {/* 6. Bespoke Inquiries & Consultation Form */}
      <div id="contact">
        <div id="inquiry">
          <VisualInquiry
            storeData={currentStoreData}
            isEditMode={isEditMode}
            onOpenEdit={(modal = 'inquiry') => setActiveModal(modal)}
            onOpenLeads={() => setIsLeadsModalOpen(true)}
          />
        </div>
      </div>

      {/* 7. Brand Lifestyle Footer */}
      <div id="footer">
        <VisualFooter
          storeData={currentStoreData}
          isEditMode={isEditMode}
          onOpenEdit={() => setActiveModal('branding')}
        />
      </div>

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
        brands={currentStoreData.brands}
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
        isDangerous={true}
        onConfirm={handleConfirmDeleteWatch}
        onClose={() => setWatchDeleteCandidate(null)}
        onCancel={() => setWatchDeleteCandidate(null)}
      />

      {/* Master Restore All Defaults Modal */}
      <ConfirmationModal
        isOpen={showMasterRestoreModal}
        title="Restore Entire Website to Curated Defaults"
        message="This will reset all headlines, hero slides, flash sale settings, category pillars, editorial showcases, showroom descriptions, colors, and typography back to the factory vintage luxury defaults. Are you sure you wish to proceed?"
        confirmText="Yes, Restore Entire Website"
        isDangerous={true}
        onConfirm={handleMasterRestore}
        onClose={() => setShowMasterRestoreModal(false)}
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

      {/* Showcase Inventory & Database Desk Modal */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-6xl bg-[#FAF7F2] rounded-3xl border border-[#DDD5C7] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E8E1D5] shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brass-600"></span>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brass-800 font-bold block">
                    Showcase Inventory & Database Desk
                  </span>
                  <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                    All Timepiece Models ({backendWatches.length} Saved)
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setIsInventoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DDD5C7] flex items-center justify-center text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#F0EBE1] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <WatchManager
                watches={formattedWatches}
                onRefresh={loadWatches}
                showToast={showToast}
              />
            </div>
          </div>
        </div>
      )}
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
