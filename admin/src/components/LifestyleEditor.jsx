import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Loader2,
  Eye,
  CheckCircle2,
  Award,
  BookOpen,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../utils/api';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

export default function LifestyleEditor({
  categoriesData,
  editorialData,
  onSaveLifestyle,
  showToast,
  isSaving,
}) {
  const [categories, setCategories] = useState(() => {
    return categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0
      ? categoriesData
      : DEFAULT_VINTAGE_STORE_DATA.categories;
  });

  const [editorialAd, setEditorialAd] = useState(() => {
    return editorialData && typeof editorialData === 'object'
      ? { ...DEFAULT_VINTAGE_STORE_DATA.editorialAd, ...editorialData }
      : DEFAULT_VINTAGE_STORE_DATA.editorialAd;
  });

  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [isUploadingEditorial, setIsUploadingEditorial] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Category change handler
  const handleCategoryChange = (idx, field, value) => {
    setCategories((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Upload photo for specific category pillar
  const handleCategoryUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(idx);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        handleCategoryChange(idx, 'image', res.imageUrl);
        showToast({
          type: 'success',
          title: 'Category Image Uploaded',
          message: 'Pillar lifestyle photo updated.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload image.',
      });
    } finally {
      setUploadingIdx(null);
    }
  };

  // Upload photo for editorial showcase
  const handleEditorialUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingEditorial(true);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        setEditorialAd((prev) => ({ ...prev, image: res.imageUrl }));
        showToast({
          type: 'success',
          title: 'Editorial Photo Uploaded',
          message: 'Craftsmanship spotlight watch image updated.',
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload image.',
      });
    } finally {
      setIsUploadingEditorial(false);
    }
  };

  const handleRestoreDefaults = () => {
    setCategories(DEFAULT_VINTAGE_STORE_DATA.categories);
    setEditorialAd(DEFAULT_VINTAGE_STORE_DATA.editorialAd);
    showToast({
      type: 'info',
      title: 'Categories & Editorial Restored',
      message: 'Reset pillars and story back to curated vintage defaults. Click Save to persist.',
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Sparkles className="w-3.5 h-3.5 text-brass-700" />
            <span>4 Horology Pillars & Caliber Spotlight</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Horology Categories & Craftsmanship Calibers
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Customize the 4 Shop by Category cards and the signature editorial advertisement on the homepage.
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
            onClick={() => onSaveLifestyle({ categories, editorialAd })}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Horology Pillars</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 4 Category Pillars */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
          <span>1. Shop By Category (4 Pillars)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Live Card Image Preview */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#DDD5C7] group">
                  <img
                    src={getFullImageUrl(cat.image)}
                    alt={cat.title}
                    className="w-full h-full object-cover brightness-[0.70] group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/95 text-brass-800 border border-brass-600/30">
                      {cat.tag || 'Handcrafted'}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 p-2.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white">
                    <p className="text-[10px] font-mono text-brass-300 font-bold">
                      {cat.itemCount || '48 Pieces'}
                    </p>
                    <h5 className="font-serif text-xs font-bold leading-tight truncate">
                      {cat.title}
                    </h5>
                  </div>
                </div>

                {/* Form Inputs */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Pillar Title
                  </label>
                  <input
                    type="text"
                    value={cat.title || ''}
                    onChange={(e) => handleCategoryChange(idx, 'title', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] font-semibold focus:outline-none focus:border-brass-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Subtitle Description
                  </label>
                  <input
                    type="text"
                    value={cat.subtitle || ''}
                    onChange={(e) => handleCategoryChange(idx, 'subtitle', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Item Count
                    </label>
                    <input
                      type="text"
                      value={cat.itemCount || ''}
                      onChange={(e) => handleCategoryChange(idx, 'itemCount', e.target.value)}
                      placeholder="48 Timepieces"
                      className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                      Pillar Tag
                    </label>
                    <input
                      type="text"
                      value={cat.tag || ''}
                      onChange={(e) => handleCategoryChange(idx, 'tag', e.target.value)}
                      placeholder="Core Horology"
                      className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                    />
                  </div>
                </div>

                {/* Image upload / URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Image Source
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cat.image || ''}
                      onChange={(e) => handleCategoryChange(idx, 'image', e.target.value)}
                      placeholder="https://..."
                      className="w-full flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2 py-1 text-[11px] text-[#1A1A1A] focus:outline-none font-mono"
                    />
                    <label className="p-1.5 rounded-lg bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30 text-brass-800 cursor-pointer transition-colors shrink-0">
                      {uploadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCategoryUpload(idx, e)}
                        disabled={uploadingIdx === idx}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Signature Editorial Showcase */}
      <div className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D5]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              2. Signature Watch Advertisement (Craftsmanship Spotlight)
            </h3>
            <p className="text-xs text-[#6B635B]">
              This full-width magazine section highlights master caliber movements, Italian leather, and handcraft pedigree.
            </p>
          </div>
          <span className="text-xs font-bold text-brass-800 bg-brass-50 px-3 py-1 rounded-full border border-brass-200">
            Reference 84-MKII
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Detail Inputs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  value={editorialAd.badge || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, badge: e.target.value })}
                  placeholder="CRAFTSMANSHIP SPOTLIGHT"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Featured Price (₹)
                </label>
                <input
                  type="number"
                  value={editorialAd.price || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, price: Number(e.target.value) })}
                  placeholder="18995"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Story Title
              </label>
              <input
                type="text"
                value={editorialAd.title || ''}
                onChange={(e) => setEditorialAd({ ...editorialAd, title: e.target.value })}
                placeholder="The Art of Natural Patina & Raw Leather"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-sm font-serif font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Philosophical Quote
              </label>
              <input
                type="text"
                value={editorialAd.quote || ''}
                onChange={(e) => setEditorialAd({ ...editorialAd, quote: e.target.value })}
                placeholder="“A great timepiece shouldn’t just tell time. It should tell where you’ve been.”"
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-serif italic text-brass-800 focus:outline-none focus:border-brass-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Story Paragraph
              </label>
              <textarea
                rows={3}
                value={editorialAd.description || ''}
                onChange={(e) => setEditorialAd({ ...editorialAd, description: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 leading-relaxed"
              />
            </div>

            {/* Horology Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Movement Caliber
                </label>
                <input
                  type="text"
                  value={editorialAd.caliber || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, caliber: e.target.value })}
                  placeholder="Japanese 21-Jewel Automatic (21,600 vph)"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Case Finishing
                </label>
                <input
                  type="text"
                  value={editorialAd.material || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, material: e.target.value })}
                  placeholder="316L Brushed Steel with Antique Brass Accents"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Strap Leather
                </label>
                <input
                  type="text"
                  value={editorialAd.strapLeather || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, strapLeather: e.target.value })}
                  placeholder="Full-Grain Italian Saddle Leather, 22mm"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Water Resistance & Glass
                </label>
                <input
                  type="text"
                  value={editorialAd.waterResistance || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, waterResistance: e.target.value })}
                  placeholder="100 Meters / 10 Bar • Domed Sapphire"
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                />
              </div>
            </div>

            {/* Photo Uploader */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                Showcase Masterpiece Photo
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={editorialAd.image || ''}
                  onChange={(e) => setEditorialAd({ ...editorialAd, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs text-[#1A1A1A] font-mono"
                />
                <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brass-800 bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30 cursor-pointer shrink-0">
                  {isUploadingEditorial ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isUploadingEditorial ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditorialUpload}
                    disabled={isUploadingEditorial}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Live Preview Card */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A524A] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brass-700" />
              <span>Showcase Card Preview</span>
            </span>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#DDD5C7] shadow-md group">
              <img
                src={getFullImageUrl(editorialAd.image)}
                alt="Editorial Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brass-500 text-white shadow-sm">
                  Artisan Caliber Showcase
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 border border-[#DDD5C7] backdrop-blur-md flex items-center justify-between gap-3 shadow-md">
                <div>
                  <span className="text-[9px] font-mono text-brass-800 uppercase tracking-widest font-bold block">
                    Featured Masterpiece
                  </span>
                  <span className="font-serif text-xs font-bold text-[#1A1A1A]">
                    {editorialAd.watchModel || 'Swiss Powermatic 80'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-sm font-bold text-[#1A1A1A] block">
                    ₹{editorialAd.price?.toLocaleString('en-IN') || '62,000'}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold">
                    ✓ Available in Gorakhpur
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Horology Pillars & Caliber Spotlight?"
        message="This will restore the 4 Horology Pillars (Swiss Luxury, Japanese Automatics, Racing Chronographs, Heritage Skeletons) and the Swiss & Japanese caliber craftsmanship story."
        confirmText="Yes, Restore Pillars"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
