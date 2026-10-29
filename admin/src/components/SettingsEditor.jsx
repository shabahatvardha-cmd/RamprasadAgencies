import React, { useState, useEffect } from 'react';
import {
  Palette,
  Save,
  Loader2,
  Phone,
  Megaphone,
  Type,
  Eye,
  Sparkles,
  MapPin,
  RefreshCw,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  ShieldCheck,
  Building2,
  Plus,
  Trash2,
  Upload,
  Clock,
  Compass,
  FileText,
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { getSettings, updateSettings, resetSettings, uploadImageFile, getFullImageUrl } from '../utils/api';

const THEME_OPTIONS = [
  {
    id: 'obsidian-gold',
    name: 'Obsidian & Gold (Haute Horlogerie)',
    badge: 'Luxury Dark',
    bgClass: 'bg-[#090d14]',
    accentColor: '#d4af37',
    textColor: 'text-amber-200',
    description: 'Deep noir obsidian background with opulent gold brushed accents.',
  },
  {
    id: 'editorial-cream',
    name: 'Editorial Cream & Noir',
    badge: 'Heritage Classic',
    bgClass: 'bg-[#f7f5f0]',
    accentColor: '#1c1917',
    textColor: 'text-stone-900',
    description: 'Swiss editorial aesthetics inspired by vintage horology catalogs.',
  },
  {
    id: 'midnight-emerald',
    name: 'Midnight Emerald & Rose Gold',
    badge: 'Prestigious',
    bgClass: 'bg-[#061412]',
    accentColor: '#e0a96d',
    textColor: 'text-emerald-200',
    description: 'Imperial deep emerald canvas complemented by warm rose-gold tones.',
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire & Platinum',
    badge: 'Maritime Elegance',
    bgClass: 'bg-[#0a1224]',
    accentColor: '#60a5fa',
    textColor: 'text-blue-200',
    description: 'Geneva deep maritime navy paired with polished platinum hues.',
  },
];

export default function SettingsEditor({ showToast }) {
  // Navigation sub-tab inside settings
  const [activeSection, setActiveSection] = useState('general'); // 'general' | 'hero' | 'showrooms' | 'trust' | 'about'

  // General & Theme
  const [theme, setTheme] = useState('obsidian-gold');
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementHours, setAnnouncementHours] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Hero Section
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroSlides, setHeroSlides] = useState([]);

  // Trust Badges
  const [trustBadges, setTrustBadges] = useState([]);

  // Showrooms
  const [showrooms, setShowrooms] = useState([]);

  // About & Footer
  const [aboutText, setAboutText] = useState('');
  const [certificateImage, setCertificateImage] = useState('/images/about/heritage-certificate.webp');
  const [footerCopyright, setFooterCopyright] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquirySubtitle, setInquirySubtitle] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch initial settings from backend
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await getSettings();
      if (data) {
        setTheme(data.theme || 'obsidian-gold');
        setAnnouncementText(data.announcementText || '');
        setAnnouncementHours(data.announcementHours || '10:30 AM – 9:00 PM (All 7 Days)');
        setContactPhone(data.contactPhone || '+91 98765 43210');

        setHeroTitle(data.heroTitle || 'Timeless Precision & Imported Horology');
        setHeroSubtitle(data.heroSubtitle || 'Gorakhpur’s premier destination for genuine imported timepieces.');
        setHeroSlides(data.heroSlides || []);

        setTrustBadges(data.trustBadges || []);
        setShowrooms(data.showrooms || []);

        setAboutText(data.aboutText || '');
        setCertificateImage(data.certificateImage || '/images/about/heritage-certificate.webp');
        setFooterCopyright(data.footerCopyright || '');
        setInquiryTitle(data.inquiryTitle || '');
        setInquirySubtitle(data.inquirySubtitle || '');
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Settings Load Error',
        message: 'Could not load settings from server. Check MongoDB connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Submit all settings update to PUT /api/settings
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsSaving(true);
      await updateSettings({
        theme,
        announcementText,
        announcementHours,
        contactPhone,
        heroTitle,
        heroSubtitle,
        heroSlides,
        trustBadges,
        showrooms,
        aboutText,
        certificateImage,
        footerCopyright,
        inquiryTitle,
        inquirySubtitle,
      });

      showToast({
        type: 'success',
        title: 'Settings Updated',
        message: 'All website sections updated. The customer storefront will sync within 5 seconds.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Could not update settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload helper for hero slides or showrooms
  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    try {
      setIsUploading(true);
      const result = await uploadImageFile(file);
      callback(result.imageUrl);
      showToast({
        type: 'success',
        title: 'Image Uploaded',
        message: 'Photo uploaded to server.',
      });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Image upload failed.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
        <p className="text-sm">Fetching store settings from backend...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Banner & Save Action */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 p-5 sm:p-6 rounded-2xl border border-gold-500/20 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full Storefront CMS Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Website Content & Section Editor
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize every visible section: theme, announcement bar, hero slides, showrooms, trust badges, and footer without touching code.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={loadSettings}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Reload latest from database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-lg shadow-gold-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {[
          { id: 'general', label: 'Theme & Announcement', icon: Palette },
          { id: 'hero', label: 'Hero Carousel Slides', icon: Layers },
          { id: 'showrooms', label: 'Dual Showrooms', icon: Building2 },
          { id: 'trust', label: 'Trust Badges', icon: ShieldCheck },
          { id: 'about', label: 'About & Footer Copy', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-gold-400 text-gold-300 bg-obsidian-900/60'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Settings Editor + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Section Editor Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="luxury-card p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6">
            {/* 1. GENERAL / THEME / ANNOUNCEMENT */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-gold-300 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gold-400" />
                    <span>Visual Palette & Atmosphere</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Select the overarching color palette used across the customer storefront.
                  </p>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Website Theme Selector *
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors mb-3"
                  >
                    {THEME_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} ({opt.badge})
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {THEME_OPTIONS.map((opt) => {
                      const isSelected = theme === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setTheme(opt.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-gold-500/80 bg-gold-500/10 shadow-md shadow-gold-500/5'
                              : 'border-white/5 bg-obsidian-950/40 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{opt.name.split('(')[0]}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{opt.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gold-300">
                    Header & Top Announcement Strip
                  </h4>

                  {/* Announcement Banner */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Megaphone className="w-3.5 h-3.5 text-gold-400" />
                      <span>Announcement Ribbon Text</span>
                    </label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="e.g. Complimentary watch inspection & battery health checks available this week at both Golghar showrooms."
                      className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Showroom Hours Ribbon */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      <span>Showroom Hours Ribbon Text</span>
                    </label>
                    <input
                      type="text"
                      value={announcementHours}
                      onChange={(e) => setAnnouncementHours(e.target.value)}
                      placeholder="e.g. 10:30 AM – 9:00 PM (All 7 Days)"
                      className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gold-400" />
                      <span>Concierge & WhatsApp Contact Phone</span>
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO CAROUSEL SLIDES */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-serif font-bold text-gold-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gold-400" />
                      <span>Hero Section Carousel Slides ({heroSlides.length})</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Add, edit, or remove slides in the high-energy full-page hero carousel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlide = {
                        badge: 'New Exclusive Drop • 2026',
                        headline: 'Masterpieces in Swiss & Japanese Horology',
                        subheadline: 'Exclusive imported editions available for fitting at Baldev Plaza & JalKal Building.',
                        ctaPrimary: 'Explore Drops',
                        ctaSecondary: 'Visit Showrooms',
                        image: '/images/watches/tissot-prx-powermatic-80.webp',
                        tag: 'Authorized Imports',
                      };
                      setHeroSlides([...heroSlides, newSlide]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/40 hover:bg-gold-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {heroSlides.map((slide, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-gold-400 uppercase">
                          Slide #{idx + 1}
                        </span>
                        {heroSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = heroSlides.filter((_, i) => i !== idx);
                              setHeroSlides(updated);
                            }}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Slide Badge */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Pill Badge Text
                          </label>
                          <input
                            type="text"
                            value={slide.badge || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].badge = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {/* Slide Tag / Brand list */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Brand Tag / Sub-badge
                          </label>
                          <input
                            type="text"
                            value={slide.tag || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].tag = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Headline */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Main Headline (H1)
                        </label>
                        <input
                          type="text"
                          value={slide.headline || ''}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].headline = e.target.value;
                            if (idx === 0) setHeroTitle(e.target.value);
                            setHeroSlides(updated);
                          }}
                          className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-serif font-bold"
                        />
                      </div>

                      {/* Subheadline */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Subheadline Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={slide.subheadline || ''}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].subheadline = e.target.value;
                            if (idx === 0) setHeroSubtitle(e.target.value);
                            setHeroSlides(updated);
                          }}
                          className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Primary CTA */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Primary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={slide.ctaPrimary || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].ctaPrimary = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {/* Secondary CTA */}
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Secondary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={slide.ctaSecondary || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].ctaSecondary = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Slide Image Upload & URL */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Slide Background Image URL or Upload
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={slide.image || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].image = e.target.value;
                              setHeroSlides(updated);
                            }}
                            placeholder="https://... or upload local file"
                            className="flex-1 bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/15 border border-gold-400 text-gold-300 hover:text-white text-xs font-semibold">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    const updated = [...heroSlides];
                                    updated[idx].image = url;
                                    setHeroSlides(updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. DUAL SHOWROOMS */}
            {activeSection === 'showrooms' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-gold-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gold-400" />
                    <span>Dual Flagship Showrooms (Golghar, Gorakhpur)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit names, addresses, landmarks, visiting hours, and highlights for both showrooms.
                  </p>
                </div>

                <div className="space-y-6">
                  {showrooms.map((store, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-5 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-gold-400 uppercase">
                          Showroom #{sIdx + 1} • {store.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Showroom Name
                          </label>
                          <input
                            type="text"
                            value={store.name || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].name = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-serif font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Sub-heading / Tagline
                          </label>
                          <input
                            type="text"
                            value={store.tagline || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].tagline = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Address & Landmark */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Physical Address
                          </label>
                          <input
                            type="text"
                            value={store.address || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].address = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Landmark
                          </label>
                          <input
                            type="text"
                            value={store.landmark || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].landmark = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Hours & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Visiting Hours
                          </label>
                          <input
                            type="text"
                            value={store.hours || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].hours = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                            Showroom Phone / WhatsApp
                          </label>
                          <input
                            type="text"
                            value={store.phone || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].phone = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Store Photo Upload / URL */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Showroom Exterior / Interior Photo
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={store.image || ''}
                            onChange={(e) => {
                              const updated = [...showrooms];
                              updated[sIdx].image = e.target.value;
                              setShowrooms(updated);
                            }}
                            className="flex-1 bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold-500/15 border border-gold-400 text-gold-300 hover:text-white text-xs font-semibold">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    const updated = [...showrooms];
                                    updated[sIdx].image = url;
                                    setShowrooms(updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                          Showroom Highlights / Specialties (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={(store.specialties || []).join('\n')}
                          onChange={(e) => {
                            const updated = [...showrooms];
                            updated[sIdx].specialties = e.target.value.split('\n').filter(Boolean);
                            setShowrooms(updated);
                          }}
                          className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TRUST BADGES */}
            {activeSection === 'trust' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-gold-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gold-400" />
                    <span>Brand Guarantee & Trust Strip (4 Points)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit the 4 authenticity and service guarantees displayed right under the category rail.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trustBadges.map((badge, bIdx) => (
                    <div
                      key={bIdx}
                      className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-3"
                    >
                      <span className="text-[10px] font-mono text-gold-400 uppercase font-bold">
                        Badge #{bIdx + 1}
                      </span>
                      <div>
                        <label className="block text-[10px] uppercase text-slate-400 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={badge.title || ''}
                          onChange={(e) => {
                            const updated = [...trustBadges];
                            updated[bIdx].title = e.target.value;
                            setTrustBadges(updated);
                          }}
                          className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-slate-400 mb-1">
                          Subtitle Description
                        </label>
                        <input
                          type="text"
                          value={badge.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...trustBadges];
                            updated[bIdx].subtitle = e.target.value;
                            setTrustBadges(updated);
                          }}
                          className="w-full bg-obsidian-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. ABOUT STORY & FOOTER */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-serif font-bold text-gold-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-400" />
                    <span>About Brand Story & Footer Details</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit the brand overview description in the footer, copyright lines, and concierge sourcing header.
                  </p>
                </div>

                {/* About Paragraph */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Brand Overview Paragraph (Footer)
                  </label>
                  <textarea
                    rows={3}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="e.g. Gorakhpur’s trusted destination for genuine imported luxury watches..."
                    className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Heritage Dealership Certificate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Heritage Dealership Certificate Image (Our Heritage Tab)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={certificateImage}
                      onChange={(e) => setCertificateImage(e.target.value)}
                      placeholder="/images/about/heritage-certificate.webp"
                      className="flex-1 bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                    {certificateImage && (
                      <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-700 bg-black/60 shrink-0">
                        <img
                          src={certificateImage}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Default dummy certificate is active at <code className="text-amber-400">/images/about/heritage-certificate.webp</code>. Replace this path or update the image anytime with your official scanned certificate.
                  </p>
                </div>

                {/* Footer Copyright */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Copyright Line
                  </label>
                  <input
                    type="text"
                    value={footerCopyright}
                    onChange={(e) => setFooterCopyright(e.target.value)}
                    placeholder="Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved."
                    className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div className="border-t border-white/10 pt-5 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-gold-300">
                    Bespoke Sourcing Inquiry Form Header
                  </h4>

                  {/* Inquiry Title */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Inquiry Section Headline
                    </label>
                    <input
                      type="text"
                      value={inquiryTitle}
                      onChange={(e) => setInquiryTitle(e.target.value)}
                      placeholder="e.g. Custom Sourcing & Horology Inquiries"
                      className="w-full bg-obsidian-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-serif font-bold"
                    />
                  </div>

                  {/* Inquiry Subtitle */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                      Inquiry Section Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={inquirySubtitle}
                      onChange={(e) => setInquirySubtitle(e.target.value)}
                      placeholder="Seeking a specific imported reference number..."
                      className="w-full bg-obsidian-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions: Save & Factory Reset */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={async () => {
                  const conf = window.prompt('Type "RESET" to confirm restoring factory defaults for all texts, slides, and showrooms:');
                  if (conf === 'RESET') {
                    try {
                      setIsSaving(true);
                      await resetSettings();
                      await loadSettings();
                      showToast({
                        type: 'success',
                        title: 'Settings Reset',
                        message: 'Factory defaults restored successfully.',
                      });
                    } catch (err) {
                      showToast({
                        type: 'error',
                        title: 'Reset Error',
                        message: err.message || 'Failed to reset settings.',
                      });
                    } finally {
                      setIsSaving(false);
                    }
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-lg shadow-gold-500/20 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Site Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Storefront Simulated Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
            <Eye className="w-4 h-4" />
            <span>Storefront Live Synchronized Preview</span>
          </div>

          <div className="rounded-2xl border border-gold-500/30 overflow-hidden shadow-2xl bg-obsidian-950 sticky top-28">
            {/* Simulated Browser Address Bar */}
            <div className="bg-obsidian-900 border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex-1 text-center">
                <span className="text-[11px] text-slate-400 bg-obsidian-950 px-3 py-1 rounded-full border border-white/5 font-mono">
                  ramprasadagencies.com
                </span>
              </div>
            </div>

            {/* Simulated Announcement Ribbon */}
            <div className="bg-gold-500 text-obsidian-950 text-xs font-semibold py-1.5 px-4 text-center truncate">
              {announcementText || 'Visit our flagship showrooms at Golghar, Gorakhpur.'}
            </div>

            {/* Simulated Hero */}
            <div
              className={`p-6 sm:p-8 min-h-[360px] flex flex-col justify-between transition-colors duration-500 relative ${
                theme === 'editorial-cream'
                  ? 'bg-stone-100 text-stone-900'
                  : theme === 'midnight-emerald'
                  ? 'bg-[#061814] text-emerald-50'
                  : theme === 'royal-sapphire'
                  ? 'bg-[#091429] text-blue-50'
                  : 'bg-[#0a0e17] text-white'
              }`}
            >
              {/* Header inside preview */}
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <div className="flex items-center gap-2">
                  <BrandLogo className="w-6 h-6" />
                  <span className="font-serif font-bold text-sm tracking-wider">
                    RAM PRASAD AGENCIES
                  </span>
                </div>
                <span className="text-[11px] font-mono opacity-80 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {contactPhone || '+91 98765 43210'}
                </span>
              </div>

              {/* Center Hero Copy */}
              <div className="my-auto py-6 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-current/10">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>{heroSlides[0]?.badge || 'Exclusive Drops • 2026'}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {heroSlides[0]?.headline || heroTitle || 'Timeless Precision & Imported Horology'}
                </h3>

                <p className="text-xs opacity-75 line-clamp-3 leading-relaxed">
                  {heroSlides[0]?.subheadline || heroSubtitle || 'Gorakhpur’s premier destination for genuine imported timepieces.'}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gold-500 text-obsidian-950 shadow-md">
                    {heroSlides[0]?.ctaPrimary || 'Explore Drops'}
                  </span>
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium border border-current/20">
                    {heroSlides[0]?.ctaSecondary || 'Visit Showrooms'}
                  </span>
                </div>
              </div>

              {/* Showroom Footer inside preview */}
              <div className="border-t border-current/10 pt-3 text-[10px] opacity-70 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{showrooms[0]?.name || 'Baldev Plaza & JalKal Building'}</span>
                </div>
                <span className="shrink-0">{announcementHours || '10:30 AM – 9:00 PM'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5 text-xs text-slate-400 space-y-1.5">
            <p className="font-medium text-slate-300">💡 Zero-Disruption Architecture:</p>
            <p>
              Changes saved in this panel write directly to MongoDB. The frontend continuously checks for updates via polling and focus synchronization without interrupting active shoppers or requiring server restarts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
