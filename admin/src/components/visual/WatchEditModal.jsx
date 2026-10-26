import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Save,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../../utils/api';
import { getVerifiedBrandImage, BRAND_VERIFIED_WATCH_IMAGE } from '../../utils/defaults';

const POPULAR_BRANDS = [
  'Titan',
  'HMT',
  'Fastrack',
  'Sonata',
  'Tissot Swiss',
  'Rolex',
  'Omega',
  'Seiko Presage',
  'Citizen Automatics',
  'Casio Edifice',
  'Fossil Heritage',
  'Breitling',
  'Rado Swiss',
  'Cartier',
  'TAG Heuer',
  'Vintage Horology',
];

const CAROUSEL_OPTIONS = [
  { value: 'newArrivals', label: 'Shop New Arrivals (Curated Season Drop)' },
  { value: 'indianIcons', label: 'Indian Watch Heritage & Icons (Titan, HMT, Fastrack)' },
  { value: 'collectorCapsule', label: 'The Collector Capsule (Limited Editions)' },
  { value: 'ourIcons', label: 'Our Timeless Icons (Heritage Classics)' },
  { value: 'flashDeals', label: 'Flash Sale Vault (Discount Spotlight)' },
];

const CATEGORIES = [
  'Automatic',
  'Chronograph',
  'Dress',
  'Limited Edition',
  'Complication',
  'Field Watch',
  'Skeleton',
  'Vintage Aviator',
];

export default function WatchEditModal({
  watch = null,
  isOpen,
  onClose,
  onSave,
  isSaving,
  showToast,
}) {
  const isEditing = Boolean(watch && (watch.id || watch._id));

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Titan',
    category: 'Automatic',
    collectionName: 'newArrivals',
    price: 14995,
    originalPrice: 17995,
    badge: 'In Stock',
    movement: 'Japanese 21-Jewel Automatic',
    caseDiameter: '42mm',
    strapType: 'Top-Grain Vintage Saddle Leather',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    featured: false,
    image: BRAND_VERIFIED_WATCH_IMAGE.titan,
    description: 'Precision mechanical craftsmanship encased in solid satin-finished stainless steel with sapphire crystal.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (watch) {
      setFormData({
        name: watch.name || '',
        brand: watch.brand || 'Titan',
        category: watch.category || 'Automatic',
        collectionName: watch.collectionName || 'newArrivals',
        price: watch.price || 14995,
        originalPrice: watch.originalPrice || 0,
        badge: watch.badge || (watch.featured ? 'Featured Drop' : 'In Stock'),
        movement: watch.movement || 'Japanese 21-Jewel Automatic',
        caseDiameter: watch.caseDiameter || watch.caseSize || '42mm',
        strapType: watch.strapType || watch.strap || 'Top-Grain Vintage Saddle Leather',
        waterResistance: watch.waterResistance || '50m / 5 Bar',
        inStock: watch.inStock !== false,
        featured: Boolean(watch.featured),
        image: watch.image || getVerifiedBrandImage(watch.brand || 'Titan', BRAND_VERIFIED_WATCH_IMAGE.titan),
        description: watch.description || '',
        storeLocation: watch.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      });
    } else {
      setFormData({
        name: '',
        brand: 'Titan',
        category: 'Automatic',
        collectionName: 'newArrivals',
        price: 14995,
        originalPrice: 17995,
        badge: 'In Stock',
        movement: 'Japanese 21-Jewel Automatic',
        caseDiameter: '42mm',
        strapType: 'Top-Grain Vintage Saddle Leather',
        waterResistance: '50m / 5 Bar',
        inStock: true,
        featured: false,
        image: BRAND_VERIFIED_WATCH_IMAGE.titan,
        description: 'Precision mechanical craftsmanship encased in solid satin-finished stainless steel with sapphire crystal.',
        storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      });
    }
  }, [watch, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        setFormData((prev) => ({ ...prev, image: res.imageUrl }));
        showToast && showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Timepiece image uploaded successfully.',
        });
      }
    } catch (err) {
      showToast && showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload watch photograph.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast && showToast({
        type: 'error',
        title: 'Missing Name',
        message: 'Please provide a name for the watch.',
      });
      return;
    }
    onSave(formData, watch?._id || watch?.id);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#DDD5C7] shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F2] border-b border-[#E8E1D5]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brass-800 font-bold block">
              Timepiece Manager
            </span>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
              {isEditing ? `Edit: ${formData.name || 'Timepiece'}` : 'Add New Luxury Timepiece'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DDD5C7] flex items-center justify-center text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#F5F2EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name and Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Watch Model Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Townsend Automatic Skeleton 44mm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Brand / Maison
              </label>
              <input
                type="text"
                list="brands-list"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
              <datalist id="brands-list">
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>

              {/* Quick Brand Selector Chips */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['Titan', 'HMT', 'Fastrack', 'Sonata', 'Tissot', 'Rolex', 'Omega', 'Seiko', 'Citizen', 'Casio'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      const verifiedImg = getVerifiedBrandImage(b, formData.image);
                      setFormData((prev) => ({
                        ...prev,
                        brand: b,
                        image: verifiedImg,
                      }));
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                      formData.brand?.toLowerCase() === b.toLowerCase()
                        ? 'bg-brass-600 text-white border-brass-700 shadow-sm'
                        : 'bg-[#FAF7F2] text-[#5A524A] border-[#DDD5C7] hover:border-brass-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Target Carousel & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Target Showcase Carousel *
              </label>
              <select
                value={formData.collectionName}
                onChange={(e) => setFormData({ ...formData, collectionName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brass-600/50 bg-[#FAF7F2] text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              >
                {CAROUSEL_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2B: Retail Price, Original MRP & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Offer Price (INR ₹) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Original MRP (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                placeholder="e.g. 17995"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Badge / Ribbon Tag
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. In Stock, 20% Off, New Arrival"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 3: Movement & Case Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Movement
              </label>
              <input
                type="text"
                value={formData.movement}
                onChange={(e) => setFormData({ ...formData, movement: e.target.value })}
                placeholder="e.g. Japanese 21-Jewel Automatic"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Case Diameter
              </label>
              <input
                type="text"
                value={formData.caseDiameter}
                onChange={(e) => setFormData({ ...formData, caseDiameter: e.target.value })}
                placeholder="e.g. 42mm"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 4: Strap Material & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Strap Material
              </label>
              <input
                type="text"
                value={formData.strapType}
                onChange={(e) => setFormData({ ...formData, strapType: e.target.value })}
                placeholder="e.g. Italian Saddle Brown Leather"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Gorakhpur Store Location
              </label>
              <input
                type="text"
                value={formData.storeLocation}
                onChange={(e) => setFormData({ ...formData, storeLocation: e.target.value })}
                placeholder="e.g. Baldev Plaza & JalKal Building, Golghar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Row 5: Image URL & Upload */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Watch Photograph URL or Upload
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/... or /uploads/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white"
              />
              <label className="px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-white hover:bg-[#F5F2EB] text-xs font-semibold text-[#1A1A1A] cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brass-700" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-brass-700" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* Quick Brand Watch Imagery Presets */}
            <div className="mt-2.5 p-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7]">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brass-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brass-600" />
                  <span>Verified Brand Watch Imagery (Click To Apply)</span>
                </span>
                {formData.brand && (
                  <span className="text-[10px] text-[#6B635B]">
                    Active: <strong className="text-brass-800">{formData.brand}</strong>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {Object.entries(BRAND_VERIFIED_WATCH_IMAGE).map(([bKey, bImg]) => (
                  <button
                    key={bKey}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image: bImg,
                        brand: prev.brand || (bKey.charAt(0).toUpperCase() + bKey.slice(1)),
                      }));
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium shrink-0 transition-all ${
                      formData.image === bImg
                        ? 'bg-brass-600 text-white border-brass-700 shadow-sm'
                        : 'bg-white text-[#5A524A] border-[#DDD5C7] hover:border-brass-600'
                    }`}
                    title={`Select authentic ${bKey} watch photo`}
                  >
                    <img src={bImg} alt={bKey} className="w-3.5 h-3.5 rounded-full object-cover" />
                    <span className="capitalize">{bKey}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Preview */}
            {formData.image && (
              <div className="mt-2.5 flex items-center gap-3 p-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7]">
                <img
                  src={getFullImageUrl(formData.image)}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.src = getVerifiedBrandImage(formData.brand, BRAND_VERIFIED_WATCH_IMAGE.titan);
                  }}
                  className="w-12 h-12 rounded-lg object-contain bg-white border border-[#DDD5C7]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-[#5A524A] truncate block">
                    {formData.image}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3" /> Authentic Watch Imagery
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Toggles (In Stock & Featured) */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 text-brass-600 rounded border-[#DDD5C7] focus:ring-brass-500"
              />
              <span className="text-xs font-semibold text-[#1A1A1A]">
                In Stock (Ready for Same-Day Delivery / Fitting in Golghar)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-brass-600 rounded border-[#DDD5C7] focus:ring-brass-500"
              />
              <span className="text-xs font-semibold text-[#1A1A1A]">
                Featured / Hot Drop Badge
              </span>
            </label>
          </div>

          {/* Row 7: Description */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
              Description / Collector Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-[#FAF7F2] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DDD5C7] text-xs font-semibold text-[#5A524A] hover:bg-[#F5F2EB] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Update Timepiece' : 'Save Timepiece'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
