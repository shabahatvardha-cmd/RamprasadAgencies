import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Save,
  Loader2,
  Check,
  Sparkles,
  Trash2,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../../utils/api';
import { getVerifiedBrandImage, BRAND_VERIFIED_WATCH_IMAGE } from '../../utils/defaults';
import { PRISTINE_BASELINE_WATCHES } from '../../data/pristineBaselineWatches';

const POPULAR_BRANDS = [
  'Titan',
  'Titan Raga',
  'Omega',
  'Rado',
  'HMT',
  'Tissot',
  'Seiko',
  'Breitling',
  'Fossil',
  'Fastrack',
  'Sonata',
  'Citizen',
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
  brands = [],
  isOpen,
  onClose,
  onSave,
  isSaving,
  showToast,
}) {
  const isEditing = Boolean(watch && (watch.id || watch._id));

  const availableBrands = useMemo(() => {
    const list = [...POPULAR_BRANDS];
    if (brands && Array.isArray(brands)) {
      brands.forEach((b) => {
        const name = typeof b === 'string' ? b : b?.name;
        if (name && !list.some((existing) => existing.toLowerCase() === name.toLowerCase())) {
          list.push(name);
        }
      });
    }
    return list;
  }, [brands]);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'Titan',
    category: 'Automatic',
    collectionName: 'newArrivals',
    price: '',
    originalPrice: '',
    hidePrice: true,
    badge: 'In Stock',
    movement: 'Japanese 21-Jewel Automatic',
    caseDiameter: '42mm',
    strapType: 'Top-Grain Vintage Saddle Leather',
    waterResistance: '50m / 5 Bar',
    inStock: true,
    gender: 'Unisex',
    featured: false,
    image: BRAND_VERIFIED_WATCH_IMAGE.titan,
    description: 'Precision mechanical craftsmanship encased in solid satin-finished stainless steel with sapphire crystal.',
    storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
  });

  const [additionalImage1, setAdditionalImage1] = useState('');
  const [additionalImage2, setAdditionalImage2] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingAdd1, setIsUploadingAdd1] = useState(false);
  const [isUploadingAdd2, setIsUploadingAdd2] = useState(false);

  useEffect(() => {
    if (watch) {
      const extraImgs = Array.isArray(watch.images) ? watch.images : [];
      const isPriceHidden = !watch.price || Number(watch.price) <= 0 || Boolean(watch.hidePrice);
      setFormData({
        name: watch.name || '',
        brand: watch.brand || 'Titan',
        category: watch.category || 'Automatic',
        collectionName: watch.collectionName || 'newArrivals',
        price: isPriceHidden ? '' : watch.price,
        originalPrice: isPriceHidden ? '' : (watch.originalPrice || ''),
        hidePrice: isPriceHidden,
        badge: watch.badge || (watch.featured ? 'Featured Drop' : 'In Stock'),
        movement: watch.movement || 'Japanese 21-Jewel Automatic',
        caseDiameter: watch.caseDiameter || watch.caseSize || '42mm',
        strapType: watch.strapType || watch.strap || 'Top-Grain Vintage Saddle Leather',
        waterResistance: watch.waterResistance || '50m / 5 Bar',
        inStock: watch.inStock !== false,
        gender: watch.gender || 'Unisex',
        featured: Boolean(watch.featured),
        image: watch.image || getVerifiedBrandImage(watch.brand || 'Titan', BRAND_VERIFIED_WATCH_IMAGE.titan),
        description: watch.description || '',
        storeLocation: watch.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      });
      setAdditionalImage1(extraImgs[0] || '');
      setAdditionalImage2(extraImgs[1] || '');
    } else {
      setFormData({
        name: '',
        brand: 'Titan',
        category: 'Automatic',
        collectionName: 'newArrivals',
        price: '',
        originalPrice: '',
        hidePrice: true,
        badge: 'In Stock',
        movement: 'Japanese 21-Jewel Automatic',
        caseDiameter: '42mm',
        strapType: 'Top-Grain Vintage Saddle Leather',
        waterResistance: '50m / 5 Bar',
        inStock: true,
        gender: 'Unisex',
        featured: false,
        image: BRAND_VERIFIED_WATCH_IMAGE.titan,
        description: 'Precision mechanical craftsmanship encased in solid satin-finished stainless steel with sapphire crystal.',
        storeLocation: 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
      });
      setAdditionalImage1('');
      setAdditionalImage2('');
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

  const handleAdditionalImageUpload = async (e, slotIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setLoader = slotIndex === 1 ? setIsUploadingAdd1 : setIsUploadingAdd2;
    const setTarget = slotIndex === 1 ? setAdditionalImage1 : setAdditionalImage2;

    try {
      setLoader(true);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        setTarget(res.imageUrl);
        showToast && showToast({
          type: 'success',
          title: `Additional Photo #${slotIndex} Uploaded`,
          message: 'Extra timepiece angle saved successfully.',
        });
      }
    } catch (err) {
      showToast && showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload additional photo.',
      });
    } finally {
      setLoader(false);
    }
  };

  const handleResetDefaults = () => {
    const id = watch?._id || watch?.id;
    const original = PRISTINE_BASELINE_WATCHES.find(
      (orig) => (orig._id && orig._id === id) || (orig.id && orig.id === id) || (orig.name && watch?.name && orig.name.toLowerCase() === watch.name.toLowerCase())
    );

    if (original) {
      const restored = {
        name: original.name || '',
        brand: original.brand || 'Titan',
        category: original.category || 'Automatic',
        collectionName: original.collectionName || 'newArrivals',
        price: null,
        originalPrice: null,
        hidePrice: true,
        badge: original.badge || (original.featured ? 'Featured Drop' : 'In Stock'),
        movement: original.movement || 'Automatic Movement',
        caseDiameter: original.caseDiameter || original.caseSize || '42mm',
        strapType: original.strapType || original.strap || 'Stainless Steel Bracelet',
        waterResistance: original.waterResistance || '50m / 5 Bar',
        inStock: true,
        gender: original.gender || 'Unisex',
        featured: Boolean(original.featured),
        image: original.image || BRAND_VERIFIED_WATCH_IMAGE.titan,
        description: original.description || '',
        storeLocation: original.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur',
        images: [],
      };
      setFormData(restored);
      setAdditionalImage1('');
      setAdditionalImage2('');

      if (id) {
        onSave(restored, id);
      }
      showToast && showToast({
        type: 'success',
        title: 'Original Timepiece Restored',
        message: `${original.name} has been reset to original factory specifications.`,
      });
    } else {
      showToast && showToast({
        type: 'info',
        title: 'Reset to Defaults',
        message: 'Timepiece fields have been reverted to baseline defaults.',
      });
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
    const extraImages = [additionalImage1, additionalImage2].filter((url) => Boolean(url && url.trim()));
    const finalPrice = formData.hidePrice || !formData.price || Number(formData.price) <= 0 ? null : Number(formData.price);
    const finalOriginalPrice = formData.hidePrice || !formData.originalPrice || Number(formData.originalPrice) <= 0 ? null : Number(formData.originalPrice);

    onSave({
      ...formData,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      hidePrice: Boolean(formData.hidePrice || finalPrice === null),
      images: extraImages,
    }, watch?._id || watch?.id);
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
            type="button"
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
                {availableBrands.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>

              {/* Quick Brand Selector Chips */}
              <div className="flex flex-wrap gap-1 mt-1.5 max-h-24 overflow-y-auto">
                {availableBrands.map((b) => (
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
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${formData.brand?.toLowerCase() === b.toLowerCase()
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
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E8E1D5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                Pricing & Showroom Consultation Mode
              </span>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-[#DDD5C7] shadow-2xs hover:border-brass-600 transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(formData.hidePrice)}
                  onChange={(e) => {
                    const hide = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      hidePrice: hide,
                      price: hide ? '' : (prev.price || 14995),
                      originalPrice: hide ? '' : prev.originalPrice,
                    }));
                  }}
                  className="w-4 h-4 rounded text-brass-600 focus:ring-brass-500 accent-brass-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-[#1A1A1A] select-none">
                  🔒 Hide Price (Display "Price Upon Request")
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Offer Price (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={formData.hidePrice}
                  value={formData.hidePrice ? '' : formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder={formData.hidePrice ? 'Price Upon Request' : 'e.g. 14995'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    formData.hidePrice
                      ? 'bg-stone-100 border-stone-200 text-stone-500 italic cursor-not-allowed'
                      : 'border-[#DDD5C7] bg-white text-[#1A1A1A] focus:outline-none focus:border-brass-600'
                  }`}
                />
                {formData.hidePrice && (
                  <p className="text-[10px] text-brass-800 font-semibold mt-1">
                    ✓ Price is hidden. Customers will see "Price Upon Request".
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Original MRP (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={formData.hidePrice}
                  value={formData.hidePrice ? '' : formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder={formData.hidePrice ? 'Hidden' : 'e.g. 17995'}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs transition-all ${
                    formData.hidePrice
                      ? 'bg-stone-100 border-stone-200 text-stone-400 italic cursor-not-allowed'
                      : 'border-[#DDD5C7] bg-white text-[#1A1A1A] focus:outline-none focus:border-brass-600'
                  }`}
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD5C7] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>
            </div>
          </div>

          {/* Row 2C: Demographic Category & Stock Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Target Demographic / Category *
              </label>
              <div className="flex rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] p-1 gap-1">
                {['Men', 'Women', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gender: g }))}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      formData.gender === g
                        ? 'bg-brass-600 text-white shadow-sm'
                        : 'text-[#5A524A] hover:text-[#1A1A1A] hover:bg-white/60'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                Stock Availability *
              </label>
              <div className="flex rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, inStock: true }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    formData.inStock
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-[#5A524A] hover:text-[#1A1A1A] hover:bg-white/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${formData.inStock ? 'bg-white' : 'bg-emerald-500'}`}></span>
                  <span>In Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, inStock: false }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    !formData.inStock
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-[#5A524A] hover:text-[#1A1A1A] hover:bg-white/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${!formData.inStock ? 'bg-white' : 'bg-rose-500'}`}></span>
                  <span>Out of Stock</span>
                </button>
              </div>
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
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium shrink-0 transition-all ${formData.image === bImg
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
            {/* Additional Watch Photos (Up to 2 extra angles/details) */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] block">
                    Additional Watch Photos (Up to 2 Extra Angles)
                  </span>
                  <span className="text-[10px] text-[#6B635B]">
                    Shown in the customer product gallery switcher / carousel.
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brass-100 text-brass-800 font-bold">
                  Multi-Photo Gallery
                </span>
              </div>

              {/* Additional Photo #1 */}
              <div className="space-y-1.5 pt-1 border-t border-[#E8E1D5]">
                <span className="text-[11px] font-semibold text-[#3D3731] block">
                  Additional Photo #1 (Caseback / Side Profile / Wrist Shot)
                </span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={additionalImage1}
                    onChange={(e) => setAdditionalImage1(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#DDD5C7] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                  <label className="px-3 py-2 rounded-xl border border-[#DDD5C7] bg-white hover:bg-[#F5F2EB] text-xs font-semibold text-[#1A1A1A] cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    {isUploadingAdd1 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brass-700" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-brass-700" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAdditionalImageUpload(e, 1)}
                      className="hidden"
                      disabled={isUploadingAdd1}
                    />
                  </label>
                  {additionalImage1 && (
                    <button
                      type="button"
                      onClick={() => setAdditionalImage1('')}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {additionalImage1 && (
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#DDD5C7]">
                    <img
                      src={getFullImageUrl(additionalImage1)}
                      alt="Additional 1"
                      className="w-10 h-10 rounded object-contain bg-[#FAF7F2]"
                      onError={(e) => { e.currentTarget.src = '/images/brands/default.webp'; }}
                    />
                    <span className="text-[10px] text-[#5A524A] truncate flex-1">{additionalImage1}</span>
                  </div>
                )}
              </div>

              {/* Additional Photo #2 */}
              <div className="space-y-1.5 pt-2 border-t border-[#E8E1D5]">
                <span className="text-[11px] font-semibold text-[#3D3731] block">
                  Additional Photo #2 (Clasp / Movement / Presentation Box)
                </span>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={additionalImage2}
                    onChange={(e) => setAdditionalImage2(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    className="flex-1 px-3 py-2 rounded-xl border border-[#DDD5C7] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                  <label className="px-3 py-2 rounded-xl border border-[#DDD5C7] bg-white hover:bg-[#F5F2EB] text-xs font-semibold text-[#1A1A1A] cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    {isUploadingAdd2 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-brass-700" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-brass-700" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleAdditionalImageUpload(e, 2)}
                      className="hidden"
                      disabled={isUploadingAdd2}
                    />
                  </label>
                  {additionalImage2 && (
                    <button
                      type="button"
                      onClick={() => setAdditionalImage2('')}
                      className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {additionalImage2 && (
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white border border-[#DDD5C7]">
                    <img
                      src={getFullImageUrl(additionalImage2)}
                      alt="Additional 2"
                      className="w-10 h-10 rounded object-contain bg-[#FAF7F2]"
                      onError={(e) => { e.currentTarget.src = '/images/brands/default.webp'; }}
                    />
                    <span className="text-[10px] text-[#5A524A] truncate flex-1">{additionalImage2}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 6: Toggles (Featured) */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
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
          <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/50 hover:bg-amber-100/70 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset this watch back to original factory specifications"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Reset to Original Timepiece</span>
            </button>

            <div className="flex items-center gap-3">
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
          </div>
        </form>
      </div>
    </div>
  );
}
