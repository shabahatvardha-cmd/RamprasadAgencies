import React, { useState } from 'react';
import {
  Tag,
  Phone,
  MessageCircle,
  FileText,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Building,
  Sparkles,
  Megaphone,
  Award,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Sliders,
  Layers,
  Gift,
} from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';
import BrandLogo from './BrandLogo';

export default function BrandingEditor({
  storeData,
  brandingData,
  initialTab,
  onSaveBranding,
  showToast,
  isSaving,
}) {
  const current = storeData || brandingData || {};

  // Active sub-tab: 'identity' | 'announcements' | 'brands' | 'trustBadges'
  const [activeTab, setActiveTab] = useState(initialTab || 'identity');

  // 1. Identity & Contact
  const [brandName, setBrandName] = useState(current.brandName || DEFAULT_VINTAGE_STORE_DATA.brandName);
  const [tagline, setTagline] = useState(current.tagline || DEFAULT_VINTAGE_STORE_DATA.tagline);
  const [logo, setLogo] = useState(current.logo || DEFAULT_VINTAGE_STORE_DATA.logo || '/logo.png');
  const [contactPhone, setContactPhone] = useState(current.contactPhone || DEFAULT_VINTAGE_STORE_DATA.contactPhone);
  const [footerCopyright, setFooterCopyright] = useState(current.footerCopyright || DEFAULT_VINTAGE_STORE_DATA.footerCopyright);
  const [announcementHours, setAnnouncementHours] = useState(current.announcementHours || '10:30 AM – 9:00 PM (All 7 Days)');

  // Footer VIP Invitation & Helpline Block (Vintage Collectors Circle)
  const [footerVipBadge, setFooterVipBadge] = useState(
    current.footerVipBadge || DEFAULT_VINTAGE_STORE_DATA.footerVipBadge || 'Vintage Collectors Circle'
  );
  const [footerVipTitle, setFooterVipTitle] = useState(
    current.footerVipTitle || DEFAULT_VINTAGE_STORE_DATA.footerVipTitle || 'Receive 10% Off Your First Automatic Timepiece'
  );
  const [footerVipSubtitle, setFooterVipSubtitle] = useState(
    current.footerVipSubtitle || DEFAULT_VINTAGE_STORE_DATA.footerVipSubtitle || 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.'
  );

  // 2. Announcements Marquee
  const initialAnnouncements = current.announcements || DEFAULT_VINTAGE_STORE_DATA.announcements;
  const [announcementsActive, setAnnouncementsActive] = useState(initialAnnouncements.isActive !== false);
  const [announcementsSpeed, setAnnouncementsSpeed] = useState(initialAnnouncements.speed || 'normal');
  const [messages, setMessages] = useState(
    initialAnnouncements.messages && initialAnnouncements.messages.length > 0
      ? initialAnnouncements.messages
      : DEFAULT_VINTAGE_STORE_DATA.announcements.messages
  );
  const [newMessage, setNewMessage] = useState('');

  // 3. Brands Portfolio & Maison Studio
  const [brands, setBrands] = useState(
    current.brands && Array.isArray(current.brands) && current.brands.length > 0
      ? current.brands
      : DEFAULT_VINTAGE_STORE_DATA.brands
  );
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCountry, setNewBrandCountry] = useState('India');
  const [newBrandCategory, setNewBrandCategory] = useState('featured');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [newBrandImage, setNewBrandImage] = useState('');
  const [newBrandStory, setNewBrandStory] = useState('');
  const [editingBrandIndex, setEditingBrandIndex] = useState(null);

  // 4. Trust Badges
  const [trustBadges, setTrustBadges] = useState(
    current.trustBadges && Array.isArray(current.trustBadges) && current.trustBadges.length > 0
      ? current.trustBadges
      : DEFAULT_VINTAGE_STORE_DATA.trustBadges
  );
  const [newBadgeTitle, setNewBadgeTitle] = useState('');
  const [newBadgeSubtitle, setNewBadgeSubtitle] = useState('');

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Ticker message helpers
  const handleAddMessage = (e) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;
    setMessages((prev) => [...prev, newMessage.trim()]);
    setNewMessage('');
  };

  const handleRemoveMessage = (index) => {
    setMessages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMessage = (index, value) => {
    setMessages((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Brand helpers
  const handleAddOrUpdateBrand = (e) => {
    e?.preventDefault();
    if (!newBrandName.trim()) {
      showToast && showToast({ type: 'error', title: 'Missing Name', message: 'Brand name is required.' });
      return;
    }

    const brandPayload = {
      name: newBrandName.trim(),
      country: newBrandCountry.trim() || 'Global',
      category: newBrandCategory || 'featured',
      desc: newBrandDesc.trim() || 'Curated Horological Maison',
      image: newBrandImage.trim() || undefined,
      story: newBrandStory.trim() || undefined,
    };

    if (editingBrandIndex !== null) {
      setBrands((prev) => {
        const copy = [...prev];
        copy[editingBrandIndex] = { ...copy[editingBrandIndex], ...brandPayload };
        return copy;
      });
      showToast && showToast({
        type: 'success',
        title: 'Brand Updated',
        message: `${brandPayload.name} updated. Click Save All Changes to apply.`,
      });
      setEditingBrandIndex(null);
    } else {
      const exists = brands.some(
        (b) => (b.name || '').toLowerCase().trim() === brandPayload.name.toLowerCase()
      );
      if (exists) {
        showToast && showToast({
          type: 'warning',
          title: 'Duplicate Brand',
          message: `A brand named "${brandPayload.name}" already exists in the portfolio.`,
        });
        return;
      }
      setBrands((prev) => [...prev, brandPayload]);
      showToast && showToast({
        type: 'success',
        title: 'Brand Added',
        message: `${brandPayload.name} added to portfolio. Click Save All Changes to publish.`,
      });
    }

    setNewBrandName('');
    setNewBrandCountry('India');
    setNewBrandCategory('featured');
    setNewBrandDesc('');
    setNewBrandImage('');
    setNewBrandStory('');
  };

  const startEditBrand = (index) => {
    const b = brands[index];
    if (!b) return;
    setEditingBrandIndex(index);
    setNewBrandName(b.name || '');
    setNewBrandCountry(b.country || 'India');
    setNewBrandCategory(b.category || 'featured');
    setNewBrandDesc(b.desc || '');
    setNewBrandImage(b.image || '');
    setNewBrandStory(b.story || b.history || '');
  };

  const cancelEditBrand = () => {
    setEditingBrandIndex(null);
    setNewBrandName('');
    setNewBrandCountry('India');
    setNewBrandCategory('featured');
    setNewBrandDesc('');
    setNewBrandImage('');
    setNewBrandStory('');
  };

  const handleRemoveBrand = (index) => {
    const b = brands[index];
    setBrands((prev) => prev.filter((_, idx) => idx !== index));
    if (editingBrandIndex === index) {
      cancelEditBrand();
    }
    showToast && showToast({
      type: 'info',
      title: 'Brand Removed',
      message: `${b?.name || 'Brand'} removed from list. Click Save All Changes to apply.`,
    });
  };

  // Trust badge helpers
  const handleAddTrustBadge = (e) => {
    e?.preventDefault();
    if (!newBadgeTitle.trim()) return;
    setTrustBadges((prev) => [
      ...prev,
      {
        title: newBadgeTitle.trim(),
        subtitle: newBadgeSubtitle.trim() || 'Official Guarantee',
      },
    ]);
    setNewBadgeTitle('');
    setNewBadgeSubtitle('');
  };

  const handleRemoveTrustBadge = (index) => {
    setTrustBadges((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    setBrandName(DEFAULT_VINTAGE_STORE_DATA.brandName);
    setTagline(DEFAULT_VINTAGE_STORE_DATA.tagline);
    setLogo(DEFAULT_VINTAGE_STORE_DATA.logo || '/logo.webp');
    setContactPhone(DEFAULT_VINTAGE_STORE_DATA.contactPhone);
    setFooterCopyright(DEFAULT_VINTAGE_STORE_DATA.footerCopyright);
    setFooterVipBadge(DEFAULT_VINTAGE_STORE_DATA.footerVipBadge || 'Vintage Collectors Circle');
    setFooterVipTitle(DEFAULT_VINTAGE_STORE_DATA.footerVipTitle || 'Receive 10% Off Your First Automatic Timepiece');
    setFooterVipSubtitle(DEFAULT_VINTAGE_STORE_DATA.footerVipSubtitle || 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.');
    setAnnouncementHours('10:30 AM – 9:00 PM (All 7 Days)');

    setAnnouncementsActive(DEFAULT_VINTAGE_STORE_DATA.announcements.isActive);
    setAnnouncementsSpeed(DEFAULT_VINTAGE_STORE_DATA.announcements.speed);
    setMessages(DEFAULT_VINTAGE_STORE_DATA.announcements.messages);

    setBrands(DEFAULT_VINTAGE_STORE_DATA.brands);
    setTrustBadges(DEFAULT_VINTAGE_STORE_DATA.trustBadges);

    showToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Reset branding, footer VIP invitation, helpline, ticker messages, brand portfolio, and trust badges to factory defaults.',
    });
  };

  // Save handler
  const handleSave = () => {
    onSaveBranding({
      brandName,
      tagline,
      logo,
      contactPhone,
      footerCopyright,
      footerVipBadge,
      footerVipTitle,
      footerVipSubtitle,
      announcementHours,
      announcements: {
        isActive: announcementsActive,
        speed: announcementsSpeed,
        messages,
      },
      brands,
      trustBadges,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Gift className="w-3.5 h-3.5 text-brass-700" />
            <span>Footer VIP & Brand Identity Hub</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Footer VIP Circle, Helpline & Branding
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Edit your Vintage Collectors Circle offer, brand logo, Ram Prasad Agencies name, helpline (+91 98765 43210), and marquee ticker.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setShowRestoreModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5A524A] hover:bg-[#F0EBE1] border border-[#DDD5C7] transition-all"
            title="Reset this section to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restore Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Footer & Identity</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#DDD5C7]">
        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'identity'
              ? 'border-brass-600 text-brass-800 bg-white font-extrabold shadow-sm'
              : 'border-transparent text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#F5EFE6]'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-brass-700" />
          <span>Footer VIP Circle & Helpline</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'announcements'
              ? 'border-brass-600 text-brass-800 bg-white font-extrabold shadow-sm'
              : 'border-transparent text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#F5EFE6]'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-brass-700" />
          <span>Announcement Ticker ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'brands'
              ? 'border-brass-600 text-brass-800 bg-white font-extrabold shadow-sm'
              : 'border-transparent text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#F5EFE6]'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-brass-700" />
          <span>Brand Portfolio ({brands.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trustBadges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'trustBadges'
              ? 'border-brass-600 text-brass-800 bg-white font-extrabold shadow-sm'
              : 'border-transparent text-[#6B635B] hover:text-[#1A1A1A] hover:bg-[#F5EFE6]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brass-700" />
          <span>Trust Badges ({trustBadges.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: FOOTER VIP CIRCLE, HELPLINE & IDENTITY */}
      {/* =================================================================== */}
      {activeTab === 'identity' && (
        <div className="space-y-6 animate-fade-in">
          {/* Live Interactive Footer VIP Preview Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Live Footer VIP Preview (Customer View)
                </span>
              </div>
              <span className="text-[10px] text-[#7C746B] italic">Updates in real time</span>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#EDE7DE] border border-[#DDD5C7]">
              <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brass-800">
                    <Gift className="w-3.5 h-3.5" />
                    <span>{footerVipBadge || 'Vintage Collectors Circle'}</span>
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                    {footerVipTitle || 'Receive 10% Off Your First Automatic Timepiece'}
                  </h3>
                  <p className="text-xs text-[#6B635B] max-w-xl">
                    {footerVipSubtitle || 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <BrandLogo customSrc={logo} className="w-8 h-8" />
                  <span className="font-serif text-sm font-bold text-[#1A1A1A]">{brandName}</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-[#FAF7F2] border border-[#DDD5C7]">
                    {contactPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Vintage Collectors Circle VIP Teaser */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E1D5]">
                <Gift className="w-4 h-4 text-brass-700" />
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Vintage Collectors Circle (VIP Teaser)
                </h3>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  VIP Badge Ribbon Text
                </label>
                <input
                  type="text"
                  value={footerVipBadge}
                  onChange={(e) => setFooterVipBadge(e.target.value)}
                  placeholder="Vintage Collectors Circle"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  VIP Offer Headline
                </label>
                <input
                  type="text"
                  value={footerVipTitle}
                  onChange={(e) => setFooterVipTitle(e.target.value)}
                  placeholder="Receive 10% Off Your First Automatic Timepiece"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  VIP Subtitle / Invitation Copy
                </label>
                <textarea
                  rows={3}
                  value={footerVipSubtitle}
                  onChange={(e) => setFooterVipSubtitle(e.target.value)}
                  placeholder="Preview limited-edition capsule drops and private showroom fittings in Gorakhpur."
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[11px] text-[#6B635B] space-y-1">
                <span className="font-bold text-[#2C2723] block">VIP Offer Note:</span>
                <span>
                  Displayed prominently above the footer to invite collectors to join private showroom fittings and view capsule drops.
                </span>
              </div>
            </div>

            {/* Right Card: Ram Prasad Agencies Logo, Name & Helpline */}
            <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E1D5]">
                <Building className="w-4 h-4 text-brass-700" />
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Logo, Brand Name & Helpline
                </h3>
              </div>

              {/* Active Brand Logo Preview & Path */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A]">
                    Ram Prasad Agencies Logo
                  </label>
                  <span className="text-[10px] text-[#7C746B]">
                    Located in public/ as logo.webp
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <BrandLogo customSrc={logo} className="w-12 h-12" />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="/logo.webp"
                      className="w-full bg-white border border-[#DDD5C7] rounded-lg px-3 py-1.5 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] text-[#7C746B]">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setLogo('/logo.png')}
                        className="px-2 py-0.5 rounded text-[10px] bg-white border border-brass-600 text-brass-800 font-bold hover:bg-brass-50"
                      >
                        /logo.png (HD PNG)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogo('/logo.webp')}
                        className="px-2 py-0.5 rounded text-[10px] bg-white border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50"
                      >
                        /logo.webp (Optimized WebP)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Brand / Business Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="RAM PRASAD AGENCIES"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Header Tagline / Domain Badge
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="WATCHSTORE.IN"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
                <p className="text-[10px] text-[#7C746B] mt-1">
                  Appears under the brand logo in the header (e.g. WATCHSTORE.IN).
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Direct Showroom Helpline & WhatsApp Concierge
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
                <p className="text-[10px] text-[#7C746B] mt-1">
                  Used across footer badges and WhatsApp quick chat links.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Footer Legal & Copyright Line
                </label>
                <textarea
                  rows={2}
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  placeholder="Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved."
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Showroom Visiting Hours
                </label>
                <input
                  type="text"
                  value={announcementHours}
                  onChange={(e) => setAnnouncementHours(e.target.value)}
                  placeholder="10:30 AM – 9:00 PM (All 7 Days)"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: ANNOUNCEMENTS MARQUEE TICKER */}
      {/* =================================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Header Marquee Ticker Controls
                </h3>
                <p className="text-xs text-[#6B635B]">
                  Manage the scrolling ribbon that appears at the top of the storefront with promotions and service alerts.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Active switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementsActive}
                    onChange={(e) => setAnnouncementsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brass-600 focus:ring-brass-500"
                  />
                  <span className="text-xs font-bold text-[#1A1A1A]">
                    {announcementsActive ? 'Ticker Enabled' : 'Ticker Disabled'}
                  </span>
                </label>

                {/* Speed selector */}
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#DDD5C7]">
                  <Sliders className="w-3.5 h-3.5 text-brass-700" />
                  <span className="text-[11px] font-semibold text-[#5A524A]">Speed:</span>
                  <select
                    value={announcementsSpeed}
                    onChange={(e) => setAnnouncementsSpeed(e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#1A1A1A] focus:outline-none cursor-pointer"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of current ticker messages */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A]">
                Current Ticker Messages ({messages.length})
              </label>

              {messages.length === 0 ? (
                <p className="text-xs text-[#8A8177] italic py-3 text-center">
                  No ticker messages currently configured. Add one below.
                </p>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] group"
                  >
                    <span className="w-6 h-6 rounded-full bg-brass-500/20 text-brass-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={msg}
                      onChange={(e) => handleUpdateMessage(idx, e.target.value)}
                      className="flex-1 bg-white border border-[#DDD5C7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMessage(idx)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete this message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new message input */}
            <form onSubmit={handleAddMessage} className="pt-2 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a new promotional announcement, discount code, or service update..."
                className="flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Message</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: BRAND PORTFOLIO & MAISON STUDIO */}
      {/* =================================================================== */}
      {activeTab === 'brands' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brass-700" />
                  <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                    Authorized Brand Portfolios & Maison Studio
                  </h3>
                </div>
                <p className="text-xs text-[#6B635B] mt-0.5">
                  Create new brands, assign them to storefront rows (Featured, Trending, Fresh Drops), and automatically generate dedicated showroom pages (<code className="text-[11px] font-mono bg-stone-100 px-1 py-0.5 rounded">/brand/:slug</code>).
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-brass-800 bg-brass-500/15 px-3 py-1 rounded-full border border-brass-600/30 shrink-0">
                {brands.length} Maisons Active
              </span>
            </div>

            {/* Brand Creator / Editor Form Card */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-inner space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    {editingBrandIndex !== null
                      ? `Edit Maison: ${brands[editingBrandIndex]?.name}`
                      : 'Create New Brand / Maison'}
                  </h4>
                </div>
                {editingBrandIndex !== null && (
                  <button
                    type="button"
                    onClick={cancelEditBrand}
                    className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <form onSubmit={handleAddOrUpdateBrand} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* 1. Brand Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="e.g. Casio, Cartier, Hublot"
                      className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:border-brass-600"
                    />
                  </div>

                  {/* 2. Origin Country */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Origin Country
                    </label>
                    <select
                      value={newBrandCountry}
                      onChange={(e) => setNewBrandCountry(e.target.value)}
                      className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-brass-600"
                    >
                      <option value="India">🇮🇳 India</option>
                      <option value="Swiss">🇨🇭 Switzerland</option>
                      <option value="Japan">🇯🇵 Japan</option>
                      <option value="USA">🇺🇸 United States</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="France">🇫🇷 France</option>
                      <option value="Italy">🇮🇹 Italy</option>
                      <option value="UK">🇬🇧 United Kingdom</option>
                      <option value="Global">🌐 Global / Import</option>
                    </select>
                  </div>

                  {/* 3. Placement Category (Row) */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Storefront Row Placement
                    </label>
                    <select
                      value={newBrandCategory}
                      onChange={(e) => setNewBrandCategory(e.target.value)}
                      className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-brass-600"
                    >
                      <option value="featured">⭐ Featured Brands (Row 1)</option>
                      <option value="trending">🔥 Trending Brands (Row 2)</option>
                      <option value="fresh_drop">⚡ Fresh Drops (Row 3)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* 4. Tagline */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Tagline / Specialization
                    </label>
                    <input
                      type="text"
                      value={newBrandDesc}
                      onChange={(e) => setNewBrandDesc(e.target.value)}
                      placeholder="e.g. G-Shock Tough Solar & Vintage Chronographs"
                      className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                    />
                  </div>

                  {/* 5. Reference Image */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Card / Reference Image Path or URL
                    </label>
                    <input
                      type="text"
                      value={newBrandImage}
                      onChange={(e) => setNewBrandImage(e.target.value)}
                      placeholder="e.g. /images/watches/casio/01.webp or /images/brands/casio.webp"
                      className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* 6. Heritage Story for Brand Page */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Heritage Story & Boutique Notes (Displayed on /brand/:slug)
                  </label>
                  <textarea
                    rows={2}
                    value={newBrandStory}
                    onChange={(e) => setNewBrandStory(e.target.value)}
                    placeholder="e.g. Founded in Tokyo in 1946, Casio revolutionized modern digital horology with G-Shock shock-resistance and iconic retro steel digital timepieces."
                    className="w-full bg-white border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-[#7C746B] italic">
                    {editingBrandIndex !== null
                      ? 'Updating this brand will update its position, details, and dedicated page.'
                      : 'After adding, remember to click "Save All Changes" below to publish.'}
                  </p>

                  <div className="flex items-center gap-2">
                    {editingBrandIndex !== null && (
                      <button
                        type="button"
                        onClick={cancelEditBrand}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{editingBrandIndex !== null ? 'Update Maison' : '+ Add Maison to Portfolio'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Current Brands Grid (Interactive Cards) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A]">
                  Configured Storefront Brands ({brands.length})
                </label>
                <span className="text-[10px] text-stone-500">
                  Tip: Click "Edit" on any brand to change its row or update details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {brands.map((b, idx) => {
                  const bName = typeof b === 'string' ? b : b.name;
                  const bCountry = typeof b === 'object' ? b.country : 'Global';
                  const bCat = typeof b === 'object' ? b.category : 'featured';
                  const bDesc = typeof b === 'object' ? b.desc : '';
                  const isCurrentEditing = editingBrandIndex === idx;

                  const catBadge =
                    bCat === 'trending'
                      ? { label: 'Trending', color: 'bg-orange-100 text-orange-800 border-orange-300' }
                      : bCat === 'fresh_drop'
                      ? { label: 'Fresh Drops', color: 'bg-teal-100 text-teal-800 border-teal-300' }
                      : { label: 'Featured', color: 'bg-amber-100 text-amber-900 border-amber-300' };

                  const countryFlag =
                    bCountry === 'India'
                      ? '🇮🇳 India'
                      : bCountry === 'Swiss'
                      ? '🇨🇭 Swiss'
                      : bCountry === 'Japan'
                      ? '🇯🇵 Japan'
                      : bCountry === 'USA'
                      ? '🇺🇸 USA'
                      : bCountry === 'Germany'
                      ? '🇩🇪 Germany'
                      : bCountry === 'France'
                      ? '🇫🇷 France'
                      : bCountry === 'Italy'
                      ? '🇮🇹 Italy'
                      : bCountry === 'UK'
                      ? '🇬🇧 UK'
                      : `🌐 ${bCountry || 'Global'}`;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl bg-[#FAF7F2] border transition-all flex flex-col justify-between gap-3 group ${
                        isCurrentEditing
                          ? 'border-brass-600 ring-2 ring-brass-400 bg-amber-50/40 shadow-md'
                          : 'border-[#DDD5C7] hover:border-brass-500 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif font-bold text-sm text-[#1A1A1A] truncate group-hover:text-brass-800">
                            {bName}
                          </span>
                          <span
                            className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${catBadge.color}`}
                          >
                            {catBadge.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-[#EAE3D6] text-stone-700 shrink-0">
                            {countryFlag}
                          </span>
                          {bDesc && (
                            <p className="text-[10px] text-[#6B635B] truncate flex-1" title={bDesc}>
                              {bDesc}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E1D5]">
                        <button
                          type="button"
                          onClick={() => startEditBrand(idx)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-brass-700 hover:bg-brass-100 hover:text-brass-900 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveBrand(idx)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 opacity-70 group-hover:opacity-100 cursor-pointer"
                          title={`Remove ${bName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: TRUST BADGES */}
      {/* =================================================================== */}
      {activeTab === 'trustBadges' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
            <div className="pb-4 border-b border-[#E8E1D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
                  Authenticity & Guarantee Badges
                </h3>
                <p className="text-xs text-[#6B635B]">
                  Highlight official warranties, Gorakhpur showroom credentials, and genuine import certification on the hero section.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-brass-800 bg-brass-500/15 px-3 py-1 rounded-full border border-brass-600/30">
                {trustBadges.length} Badges Configured
              </span>
            </div>

            {/* Add New Badge Form */}
            <form
              onSubmit={handleAddTrustBadge}
              className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Badge Title *
                </label>
                <input
                  type="text"
                  value={newBadgeTitle}
                  onChange={(e) => setNewBadgeTitle(e.target.value)}
                  placeholder="e.g. Official 2-Yr Stamped Warranty"
                  className="w-full bg-white border border-[#DDD5C7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Subtitle / Detail
                </label>
                <input
                  type="text"
                  value={newBadgeSubtitle}
                  onChange={(e) => setNewBadgeSubtitle(e.target.value)}
                  placeholder="e.g. Manufacturer Backed Across India"
                  className="w-full bg-white border border-[#DDD5C7] rounded-lg px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trust Badge</span>
              </button>
            </form>

            {/* Current Trust Badges */}
            <div className="space-y-2.5">
              {trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-brass-700 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A1A1A]">
                        {badge.title}
                      </h4>
                      {badge.subtitle && (
                        <p className="text-[10px] text-[#6B635B]">
                          {badge.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveTrustBadge(idx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove badge"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Branding Defaults?"
        message="This will reset brand identity, logo, ticker messages, brand portfolio, and trust badges to factory defaults."
        confirmText="Yes, Restore Defaults"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
