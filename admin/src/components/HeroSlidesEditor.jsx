import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Loader2,
  Eye,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../utils/api';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

export default function HeroSlidesEditor({ heroData, onSaveHero, showToast, isSaving }) {
  const [slides, setSlides] = useState(() => {
    return heroData?.slides && Array.isArray(heroData.slides) && heroData.slides.length > 0
      ? heroData.slides
      : DEFAULT_VINTAGE_STORE_DATA.hero.slides;
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const currentSlide = slides[activeSlideIndex] || slides[0] || {};

  // Slide field updater
  const handleFieldChange = (field, value) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[activeSlideIndex] = {
        ...copy[activeSlideIndex],
        [field]: value,
      };
      return copy;
    });
  };

  // Upload image for active slide
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        handleFieldChange('image', res.imageUrl);
        showToast({
          type: 'success',
          title: 'Slide Image Uploaded',
          message: 'The new watch showcase photograph has been uploaded.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload image.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide = {
      id: `hero-${Date.now()}`,
      badge: 'NEW CAPSULE • LIMITED DROP',
      headline: 'New Luxury Horology Showcase',
      subheadline: 'Crafted with precision mechanics, exhibition dials, and authentic calfskin straps.',
      ctaPrimary: 'Shop Capsule',
      ctaPrimaryLink: '#new-arrivals',
      ctaSecondary: 'View Showrooms',
      ctaSecondaryLink: '#showrooms',
      image: '/images/watches/tissot-prx-powermatic-80.webp',
      specsTag: 'Automatic Caliber • 316L Surgical Steel',
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIndex(updated.length - 1);
    showToast({
      type: 'info',
      title: 'Slide Added',
      message: `Created Slide #${updated.length}. Fill in its details and click Save.`,
    });
  };

  // Delete slide
  const handleDeleteSlide = (indexToDelete) => {
    if (slides.length <= 1) {
      showToast({
        type: 'error',
        title: 'Cannot Delete Only Slide',
        message: 'The hero section requires at least one active slide.',
      });
      return;
    }
    const updated = slides.filter((_, idx) => idx !== indexToDelete);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, indexToDelete - 1));
    showToast({
      type: 'info',
      title: 'Slide Removed',
      message: 'Slide removed. Remember to click Save to persist.',
    });
  };

  // Restore Hero defaults
  const handleRestoreDefaults = () => {
    const defaults = DEFAULT_VINTAGE_STORE_DATA.hero.slides;
    setSlides(defaults);
    setActiveSlideIndex(0);
    showToast({
      type: 'info',
      title: 'Hero Defaults Restored',
      message: 'Reset hero slides to Fossil-inspired curated defaults. Click Save to persist.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Sparkles className="w-3.5 h-3.5 text-brass-700" />
            <span>Hero Advertisement Showcase</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Top Watch Advertisement Slides ({slides.length})
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Edit text, calibers, CTA buttons, and background photography. Changes will reflect in real time inside the customer hero carousel.
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
            onClick={() => onSaveHero({ hero: { slides } })}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Slides</span>
          </button>
        </div>
      </div>

      {/* Slide Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {slides.map((s, idx) => (
          <button
            key={s.id || idx}
            onClick={() => setActiveSlideIndex(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              idx === activeSlideIndex
                ? 'bg-brass-500 text-white shadow-sm font-bold'
                : 'bg-white hover:bg-[#F2ECE1] text-[#3D3731] border border-[#DDD5C7]'
            }`}
          >
            <span>Slide 0{idx + 1}</span>
            <span className="text-[10px] opacity-80 max-w-[120px] truncate">
              {s.headline || 'Untitled'}
            </span>
          </button>
        ))}

        <button
          onClick={handleAddSlide}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-brass-800 bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-dashed border-brass-600/50 transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs (Left) & Real-Time Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Slide Detail Inputs */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">
              Slide #{activeSlideIndex + 1} Configuration
            </h3>

            {slides.length > 1 && (
              <button
                onClick={() => handleDeleteSlide(activeSlideIndex)}
                className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Slide</span>
              </button>
            )}
          </div>

          {/* Badge & Specs Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Top Tag Badge
              </label>
              <input
                type="text"
                value={currentSlide.badge || ''}
                onChange={(e) => handleFieldChange('badge', e.target.value)}
                placeholder="e.g. EST. 1984 • VINTAGE HERITAGE"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Caliber / Specs Pill
              </label>
              <input
                type="text"
                value={currentSlide.specsTag || ''}
                onChange={(e) => handleFieldChange('specsTag', e.target.value)}
                placeholder="e.g. Automatic 42-Hr Reserve • 316L Steel"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={currentSlide.headline || ''}
              onChange={(e) => handleFieldChange('headline', e.target.value)}
              placeholder="e.g. Shelby GT Tachymeter Racing Series"
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-sm font-serif font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Descriptive Subheadline
            </label>
            <textarea
              rows={3}
              value={currentSlide.subheadline || ''}
              onChange={(e) => handleFieldChange('subheadline', e.target.value)}
              placeholder="Describe the movement, dials, and leather craft..."
              className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 leading-relaxed"
            />
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={currentSlide.ctaPrimary || ''}
                onChange={(e) => handleFieldChange('ctaPrimary', e.target.value)}
                placeholder="Shop The Capsule"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={currentSlide.ctaPrimaryLink || ''}
                onChange={(e) => handleFieldChange('ctaPrimaryLink', e.target.value)}
                placeholder="#new-arrivals"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={currentSlide.ctaSecondary || ''}
                onChange={(e) => handleFieldChange('ctaSecondary', e.target.value)}
                placeholder="View Showrooms"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Secondary CTA Link
              </label>
              <input
                type="text"
                value={currentSlide.ctaSecondaryLink || ''}
                onChange={(e) => handleFieldChange('ctaSecondaryLink', e.target.value)}
                placeholder="#showrooms"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
              />
            </div>
          </div>

          {/* Background Image Upload & URL */}
          <div className="pt-2 border-t border-[#E8E1D5]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
              Background Showcase Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={currentSlide.image || ''}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="https://... or /uploads/..."
                className="w-full flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
              />

              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brass-800 bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30 cursor-pointer transition-all shrink-0">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Editorial Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A524A] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brass-700" />
              <span>Live Visual Card Preview</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ● Dynamic Preview
            </span>
          </div>

          {/* Card Preview Box */}
          <div className="relative rounded-3xl overflow-hidden border border-[#DDD5C7] shadow-xl min-h-[380px] bg-[#1A1A1A] flex flex-col justify-end p-5">
            {/* Background Image */}
            <img
              src={getFullImageUrl(currentSlide.image)}
              alt="Slide Preview"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
              onError={(e) => {
                e.target.src = '/images/watches/tissot-prx-powermatic-80.webp';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Frosted Luxury Card Overlay (Exact Match with Storefront) */}
            <div className="relative z-10 p-5 rounded-2xl bg-[#FAF7F2]/96 backdrop-blur-xl border border-[#DDD5C7] shadow-2xl space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/40">
                  {currentSlide.badge || 'EST. 1984 • VINTAGE HERITAGE'}
                </span>
                {currentSlide.specsTag && (
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#DDD5C7] text-[9px] font-mono text-[#5A524A] font-semibold">
                    {currentSlide.specsTag}
                  </span>
                )}
              </div>

              <h4 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug">
                {currentSlide.headline || 'Headline Title'}
              </h4>

              <p className="text-[11px] text-[#4A433D] line-clamp-2 leading-relaxed">
                {currentSlide.subheadline || 'Subheadline description will appear here...'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brass-600 text-white shadow-sm">
                  <span>{currentSlide.ctaPrimary || 'Shop Capsule'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white text-[#1A1A1A] border border-[#DDD5C7]">
                  <Compass className="w-3 h-3 text-brass-700" />
                  <span>{currentSlide.ctaSecondary || 'Showrooms'}</span>
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[#7C746B] italic text-center">
            This card represents how customers view this slide on the homepage.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Default Hero Slides?"
        message="This will reset all 3 hero carousel slides back to the curated Fossil vintage showcase (Shelby GT, Exposed Mechanical Heart, and Heritage Capsule)."
        confirmText="Yes, Restore Slides"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
