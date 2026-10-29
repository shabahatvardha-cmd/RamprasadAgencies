import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Upload,
  Save,
  RotateCcw,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Building2,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../utils/api';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

export default function ShowroomsEditor({ showroomsData, onSaveShowrooms, showToast, isSaving }) {
  const [showrooms, setShowrooms] = useState(() => {
    return showroomsData && Array.isArray(showroomsData) && showroomsData.length > 0
      ? showroomsData
      : DEFAULT_VINTAGE_STORE_DATA.showrooms;
  });

  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // Field change
  const handleFieldChange = (idx, field, value) => {
    setShowrooms((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Specialties change (bullet points)
  const handleSpecialtyChange = (storeIdx, specIdx, value) => {
    setShowrooms((prev) => {
      const copy = [...prev];
      const specs = [...(copy[storeIdx].specialties || [])];
      specs[specIdx] = value;
      copy[storeIdx] = { ...copy[storeIdx], specialties: specs };
      return copy;
    });
  };

  const handleAddSpecialty = (storeIdx) => {
    setShowrooms((prev) => {
      const copy = [...prev];
      const specs = [...(copy[storeIdx].specialties || []), 'Official Horology Care & Fitting'];
      copy[storeIdx] = { ...copy[storeIdx], specialties: specs };
      return copy;
    });
  };

  const handleDeleteSpecialty = (storeIdx, specIdx) => {
    setShowrooms((prev) => {
      const copy = [...prev];
      const specs = copy[storeIdx].specialties.filter((_, i) => i !== specIdx);
      copy[storeIdx] = { ...copy[storeIdx], specialties: specs };
      return copy;
    });
  };

  // Image upload
  const handleImageUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(idx);
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        handleFieldChange(idx, 'image', res.imageUrl);
        showToast({
          type: 'success',
          title: 'Showroom Photo Uploaded',
          message: 'Showroom storefront image has been updated.',
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

  const handleRestoreDefaults = () => {
    setShowrooms(DEFAULT_VINTAGE_STORE_DATA.showrooms);
    showToast({
      type: 'info',
      title: 'Showrooms Restored',
      message: 'Reset Baldev Plaza & JalKal Building back to curated showroom defaults.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Building2 className="w-3.5 h-3.5 text-brass-700" />
            <span>Dual Showroom Experience</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Baldev Plaza & JalKal Building Flagships
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Update store addresses, landmarks, operating hours, phone numbers, and showroom specialty highlights.
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
            onClick={() => onSaveShowrooms({ showrooms })}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Showrooms</span>
          </button>
        </div>
      </div>

      {/* Showroom Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showrooms.map((store, idx) => (
          <div
            key={store.id || idx}
            className="p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Store Title Bar & Image Preview */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#DDD5C7] group">
                <img
                  src={getFullImageUrl(store.image)}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/showrooms/baldev-plaza.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-brass-800 border border-brass-600/30">
                    Store #{idx + 1} Flagship
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-white">
                  <h4 className="font-serif text-sm sm:text-base font-bold leading-tight">
                    {store.name}
                  </h4>
                  <p className="text-[11px] text-brass-300 font-medium mt-0.5">
                    {store.tagline}
                  </p>
                </div>
              </div>

              {/* Showroom Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Showroom Name
                  </label>
                  <input
                    type="text"
                    value={store.name || ''}
                    onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] font-bold focus:outline-none focus:border-brass-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={store.tagline || ''}
                    onChange={(e) => handleFieldChange(idx, 'tagline', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                  />
                </div>
              </div>

              {/* Address & Landmark */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Full Postal Address
                </label>
                <input
                  type="text"
                  value={store.address || ''}
                  onChange={(e) => handleFieldChange(idx, 'address', e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={store.landmark || ''}
                    onChange={(e) => handleFieldChange(idx, 'landmark', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={store.hours || ''}
                    onChange={(e) => handleFieldChange(idx, 'hours', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Google Map Query */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Direct Phone / Concierge
                  </label>
                  <input
                    type="text"
                    value={store.phone || ''}
                    onChange={(e) => handleFieldChange(idx, 'phone', e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                    Google Maps Search Query
                  </label>
                  <input
                    type="text"
                    value={store.mapQuery || ''}
                    onChange={(e) => handleFieldChange(idx, 'mapQuery', e.target.value)}
                    placeholder="Baldev+Plaza+Golghar+Gorakhpur"
                    className="w-full bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-xs text-[#1A1A1A] font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Store Photo Upload / URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1">
                  Storefront Photo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={store.image || ''}
                    onChange={(e) => handleFieldChange(idx, 'image', e.target.value)}
                    placeholder="https://... or /uploads/..."
                    className="w-full flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3 py-1.5 text-[11px] text-[#1A1A1A] font-mono"
                  />
                  <label className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-brass-800 bg-brass-500/15 hover:bg-brass-500/25 border border-brass-600/30 cursor-pointer shrink-0">
                    {uploadingIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingIdx === idx ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(idx, e)}
                      disabled={uploadingIdx === idx}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Showroom Specialties (Bullet Points) */}
              <div className="pt-2 border-t border-[#E8E1D5] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A524A]">
                    Showroom Highlights & Collections ({store.specialties?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddSpecialty(idx)}
                    className="text-[10px] font-bold text-brass-800 hover:text-brass-900 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {(store.specialties || []).map((spec, specIdx) => (
                    <div key={specIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleSpecialtyChange(idx, specIdx, e.target.value)}
                        className="w-full flex-1 bg-[#FAF7F2] border border-[#DDD5C7] rounded-lg px-2.5 py-1 text-xs text-[#1A1A1A] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSpecialty(idx, specIdx)}
                        className="p-1 text-rose-500 hover:text-rose-700 rounded transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Default Showrooms?"
        message="This will reset both Baldev Plaza and JalKal Building showrooms to their curated addresses, hours, and horology highlights."
        confirmText="Yes, Restore Showrooms"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
