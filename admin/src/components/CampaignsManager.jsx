import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  Eye,
  Megaphone,
  RotateCcw,
  Star,
  Tag,
  MapPin,
  Save,
} from 'lucide-react';
import { uploadImageFile, updateSettings, resetSettings, getFullImageUrl } from '../utils/api';

export default function CampaignsManager({ settings, onRefresh, showToast }) {
  const [ads, setAds] = useState(settings?.ads || []);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New Ad Form State
  const [title, setTitle] = useState('');
  const [celebrity, setCelebrity] = useState('');
  const [tagline, setTagline] = useState('');
  const [brand, setBrand] = useState('Omega');
  const [watchModel, setWatchModel] = useState('');
  const [storeLocation, setStoreLocation] = useState('Baldev Plaza & JalKal Building, Golghar, Gorakhpur');
  const [isActive, setIsActive] = useState(true);

  // Image Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state if settings prop changes
  React.useEffect(() => {
    if (settings?.ads) {
      setAds(settings.ads);
    }
  }, [settings]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        type: 'error',
        title: 'Invalid File',
        message: 'Please choose an image file (JPG, PNG, WEBP).',
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle('');
    setCelebrity('');
    setTagline('');
    setBrand('Omega');
    setWatchModel('');
    setStoreLocation('Baldev Plaza & JalKal Building, Golghar, Gorakhpur');
    setIsActive(true);
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsFormOpen(false);
  };

  // Add new campaign ad
  const handleAddCampaign = async (e) => {
    e.preventDefault();

    if (!title.trim() || !celebrity.trim() || !tagline.trim()) {
      showToast({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please fill in campaign title, celebrity ambassador, and tagline.',
      });
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = previewUrl;

      // Upload file if selected
      if (selectedFile) {
        const uploadRes = await uploadImageFile(selectedFile);
        imageUrl = uploadRes.imageUrl;
      } else if (!previewUrl) {
        // High quality fallback horology campaign image
        imageUrl = '/images/editorial-baldev-flagship.webp';
      }

      const newAd = {
        title: title.trim(),
        celebrity: celebrity.trim(),
        tagline: tagline.trim(),
        brand: brand.trim(),
        watchModel: watchModel.trim(),
        storeLocation: storeLocation.trim(),
        image: imageUrl,
        isActive,
      };

      const updatedAds = [newAd, ...ads];
      setAds(updatedAds);

      // Persist to backend settings
      setIsSaving(true);
      await updateSettings({ ads: updatedAds });

      showToast({
        type: 'success',
        title: 'Campaign Published',
        message: `Celebrity ad "${title}" is now live on the customer website.`,
      });

      resetForm();
      onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not save advertisement campaign.',
      });
    } finally {
      setIsUploading(false);
      setIsSaving(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (index) => {
    try {
      const updated = [...ads];
      updated[index].isActive = !updated[index].isActive;
      setAds(updated);

      await updateSettings({ ads: updated });
      showToast({
        type: 'success',
        title: 'Ad Status Updated',
        message: `Campaign is now ${updated[index].isActive ? 'Visible' : 'Hidden'} on website.`,
      });
      onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update campaign status.',
      });
    }
  };

  // Delete an ad campaign
  const handleDeleteAd = async (index) => {
    if (!window.confirm('Are you sure you want to delete this celebrity campaign advertisement?')) {
      return;
    }

    try {
      const updated = ads.filter((_, i) => i !== index);
      setAds(updated);

      await updateSettings({ ads: updated });
      showToast({
        type: 'success',
        title: 'Campaign Removed',
        message: 'Advertisement was removed from the customer website.',
      });
      onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete advertisement.',
      });
    }
  };

  // Reset to Factory Defaults
  const handleResetDefaults = async () => {
    const confirmation = window.prompt(
      'Type "RESET" to confirm restoring all website copy, themes, and official celebrity campaigns to factory defaults:'
    );

    if (confirmation !== 'RESET') {
      if (confirmation !== null) {
        showToast({
          type: 'info',
          title: 'Action Cancelled',
          message: 'Reset was cancelled. No changes made.',
        });
      }
      return;
    }

    try {
      setIsResetting(true);
      const fresh = await resetSettings();
      setAds(fresh.ads || []);
      showToast({
        type: 'success',
        title: 'Settings Reset',
        message: 'Restored all original horology copy, themes, and campaigns.',
      });
      onRefresh();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Reset Failed',
        message: err.message || 'Could not reset settings.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 p-6 rounded-2xl border border-gold-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-serif font-bold text-white">
              Celebrity & Brand Ambassador Campaigns
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
              Live Showcase
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage luxury model & celebrity advertisements on the customer storefront (e.g. Ryan Gosling for TAG Heuer, Daniel Craig for Omega).
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-obsidian-950 shadow-lg shadow-gold-500/20 transition-all active:scale-[0.98]"
          >
            {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isFormOpen ? 'Close Form' : 'New Campaign Ad'}</span>
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={isResetting}
            title="Restore all default settings & campaigns"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all shrink-0"
          >
            {isResetting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Add New Campaign Form Modal / Collapsible */}
      {isFormOpen && (
        <div className="luxury-card p-6 sm:p-8 rounded-2xl border border-gold-500/30 shadow-2xl animate-slide-down">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-gold-300">
                Create Celebrity / Model Horology Campaign
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload ambassador photography or choose from official luxury maison campaigns.
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddCampaign} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Headline */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Carrera Chronograph Heritage"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Celebrity / Model Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Celebrity / Ambassador Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ryan Gosling • Official Maison Ambassador"
                  value={celebrity}
                  onChange={(e) => setCelebrity(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Maison / Brand */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Luxury Brand / Maison *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TAG Heuer, Omega, Seiko, Tissot, Rado"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Featured Watch Model */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Featured Timepiece Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Carrera Chronograph Glassbox 39mm"
                  value={watchModel}
                  onChange={(e) => setWatchModel(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Showroom Location */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Showroom Availability Tag
                </label>
                <input
                  type="text"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              {/* Tagline / Editorial Story */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Campaign Editorial Tagline *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Born on the racetrack, perfected in the Swiss valleys. The Carrera Glassbox features the in-house TH20-00 automatic caliber."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 focus:border-gold-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Campaign Image Uploader */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Ambassador / Celebrity Photograph *
                </label>

                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-gold-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-obsidian-950/40 hover:bg-gold-500/[0.02]"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      Upload Celebrity / Model Campaign Photo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, WEBP (Landscape or Editorial Portrait) up to 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-950 border border-gold-500/30">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-16 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white truncate">
                        {selectedFile?.name || 'Selected Campaign Photo'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Ready to attach to this campaign advertisement.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUploading || isSaving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 text-obsidian-950 shadow-lg shadow-gold-500/20 disabled:opacity-50 transition-all"
              >
                {isUploading || isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing Campaign...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Publish Ad Campaign</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Campaigns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <span>Active Storefront Campaigns ({ads.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Changes save directly to MongoDB and flash instantly on customer devices.
          </p>
        </div>

        {ads.length === 0 ? (
          <div className="luxury-card p-12 text-center rounded-2xl border border-dashed border-white/10 space-y-3">
            <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="font-serif text-base text-slate-300">No campaigns currently active</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click &quot;New Campaign Ad&quot; to feature brand ambassadors and models, or click &quot;Reset Defaults&quot; to restore original campaigns.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad, idx) => {
              const fullImage = getFullImageUrl(ad.image);

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    ad.isActive
                      ? 'bg-obsidian-900 border-gold-500/30 luxury-card-shadow'
                      : 'bg-obsidian-950/60 border-white/5 opacity-60'
                  }`}
                >
                  {/* Campaign Image */}
                  <div className="relative h-44 overflow-hidden bg-obsidian-950">
                    <img
                      src={fullImage}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/30 to-transparent"></div>

                    {/* Brand Pill */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-obsidian-950/90 text-gold-300 border border-gold-500/30 backdrop-blur-md">
                        {ad.brand}
                      </span>
                    </div>

                    {/* Status Beacon */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                          ad.isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-900/80 text-slate-400 border border-white/10'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ad.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                          }`}
                        ></span>
                        {ad.isActive ? 'Active on Web' : 'Hidden'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[11px] font-mono text-gold-400 uppercase tracking-widest truncate">
                        {ad.celebrity}
                      </p>
                      <h4 className="font-serif text-base font-bold text-white truncate">
                        {ad.title}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {ad.tagline}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                      {ad.watchModel && (
                        <p className="flex items-center gap-1.5 truncate">
                          <Tag className="w-3 h-3 text-gold-400 shrink-0" />
                          <span>{ad.watchModel}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                        <span>{ad.storeLocation}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleActive(idx)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                          ad.isActive
                            ? 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {ad.isActive ? 'Hide Ad' : 'Show on Site'}
                      </button>

                      <button
                        onClick={() => handleDeleteAd(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete this campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
