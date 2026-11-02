import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Calendar,
  Image as ImageIcon,
  Type,
  Upload,
  Check,
  AlertCircle,
  RotateCcw,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { uploadImageFile, getFullImageUrl } from '../utils/api';

// Predefined global slots across the website
export const DEFAULT_OVERRIDE_SLOTS = [
  {
    key: 'hero_headline',
    section: 'Hero Showcase',
    label: 'Hero Main Headline',
    type: 'text',
    defaultValue: 'Tissot PRX & Swiss Automatics',
    description: 'Top primary headline displayed on the homepage showcase hero banner.',
  },
  {
    key: 'hero_subheadline',
    section: 'Hero Showcase',
    label: 'Hero Subheadline & Story',
    type: 'text',
    defaultValue: 'Gorakhpur’s premier authorized showroom for Swiss Powermatic 80 movements and retro-futuristic integrated bracelets.',
    description: 'Secondary narrative paragraph under the main hero headline.',
  },
  {
    key: 'hero_badge',
    section: 'Hero Showcase',
    label: 'Hero Top Pill Badge',
    type: 'text',
    defaultValue: 'SWISS PRECISION',
    description: 'Glowing pill badge above hero headline.',
  },
  {
    key: 'hero_image',
    section: 'Hero Showcase',
    label: 'Hero Showcase Main Photography',
    type: 'image',
    defaultValue: '/images/watches/tissot/01.webp',
    description: 'Hero backdrop & featured luxury watch photography on desktop and mobile.',
  },
  {
    key: 'announcement_ticker',
    section: 'Announcements',
    label: 'Top Announcement Bar Marquee Message',
    type: 'text',
    defaultValue: '🇮🇳 INDIAN WATCH HERITAGE: Complete Collections for Titan, Titan Raga, HMT, Fastrack & Sonata Available at Golghar • Free Insured Express Shipping',
    description: 'Top scrolling marquee banner visible at the absolute top of every page.',
  },
  {
    key: 'flash_sale_headline',
    section: 'Flash Sale & Events',
    label: 'Flash Sale Main Headline',
    type: 'text',
    defaultValue: 'THE BIG BRAND WATCH SALE',
    description: 'Promotional countdown ribbon headline.',
  },
  {
    key: 'flash_sale_badge',
    section: 'Flash Sale & Events',
    label: 'Flash Sale Top Ribbon Tag',
    type: 'text',
    defaultValue: 'FESTIVE HOROLOGY EVENT',
    description: 'Badge tag displayed on the countdown ribbon.',
  },
  {
    key: 'flash_sale_discount',
    section: 'Flash Sale & Events',
    label: 'Flash Sale Offer / Coupon Code',
    type: 'text',
    defaultValue: '15% Extra Off with Code: VINTAGE15',
    description: 'Special promotion code shown in the ribbon.',
  },
  {
    key: 'about_title',
    section: 'About & Heritage',
    label: 'About Section Title',
    type: 'text',
    defaultValue: 'Authentic Heritage & Certified Dealership',
    description: 'Header text for the 30-year heritage story section.',
  },
  {
    key: 'about_text',
    section: 'About & Heritage',
    label: 'About Section Story Text',
    type: 'text',
    defaultValue: 'Gorakhpur’s trusted destination for genuine imported luxury watches, automatic chronographs, and precision battery servicing for over three decades.',
    description: 'Primary narrative paragraph on the showroom heritage.',
  },
  {
    key: 'certificate_image',
    section: 'About & Heritage',
    label: 'Authorized Dealer Certificate Photo',
    type: 'image',
    defaultValue: '/images/about/heritage-certificate.webp',
    description: 'Showroom dealership certificate image displayed in the Heritage tab.',
  },
  {
    key: 'vip_title',
    section: 'Footer & VIP Circle',
    label: 'VIP Circle Teaser Headline',
    type: 'text',
    defaultValue: 'Receive 10% Off Your First Automatic Timepiece',
    description: 'Headline inside the VIP Collectors Circle footer card.',
  },
  {
    key: 'vip_subtitle',
    section: 'Footer & VIP Circle',
    label: 'VIP Circle Teaser Subtitle',
    type: 'text',
    defaultValue: 'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.',
    description: 'Supporting text inside the VIP card.',
  },
  {
    key: 'contact_phone',
    section: 'Contact & Helpline',
    label: 'Showroom Helpline & WhatsApp Number',
    type: 'text',
    defaultValue: '+91 98765 43210',
    description: 'Primary customer phone number used across the header, WhatsApp button, and contact form.',
  },
];

// Helper to evaluate live timer status
export function getOverrideStatus(override) {
  if (!override || !override.active || !override.value) {
    return { status: 'inactive', label: 'Disabled / Default', color: 'stone' };
  }
  if (!override.isScheduled) {
    return { status: 'active_now', label: 'Active Now (Live)', color: 'emerald' };
  }

  const now = Date.now();
  const start = override.scheduledStart ? new Date(override.scheduledStart).getTime() : 0;
  const end = override.scheduledEnd ? new Date(override.scheduledEnd).getTime() : Infinity;

  if (start && now < start) {
    const diffHours = Math.ceil((start - now) / (1000 * 60 * 60));
    return {
      status: 'scheduled',
      label: `Scheduled (Starts in ${diffHours > 24 ? Math.ceil(diffHours / 24) + 'd' : diffHours + 'h'})`,
      color: 'amber',
    };
  }
  if (end && now > end) {
    return { status: 'expired', label: 'Expired', color: 'rose' };
  }
  return { status: 'active_now', label: 'Active Now (Scheduled Window)', color: 'emerald' };
}

export default function DynamicOverridesEditor({
  contentOverrides = {},
  onSaveOverrides,
  showToast,
  isSaving = false,
}) {
  const [overrides, setOverrides] = useState(() => ({ ...(contentOverrides || {}) }));
  const [uploadingKeys, setUploadingKeys] = useState({});
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [customKeyName, setCustomKeyName] = useState('');
  const [customKeyType, setCustomKeyType] = useState('text');
  const [showAddCustom, setShowAddCustom] = useState(false);

  // Extract all sections
  const sections = ['ALL', 'Hero Showcase', 'Announcements', 'Flash Sale & Events', 'About & Heritage', 'Footer & VIP Circle', 'Contact & Helpline', 'Custom Overrides'];

  // Update specific field
  const handleUpdateField = (key, field, val) => {
    setOverrides((prev) => {
      const current = prev[key] || {};
      return {
        ...prev,
        [key]: {
          ...current,
          [field]: val,
        },
      };
    });
  };

  // Upload image handler
  const handleImageUpload = async (key, file) => {
    if (!file) return;
    try {
      setUploadingKeys((prev) => ({ ...prev, [key]: true }));
      const res = await uploadImageFile(file);
      if (res?.imageUrl) {
        handleUpdateField(key, 'value', res.imageUrl);
        showToast && showToast({
          type: 'success',
          title: 'Photo Uploaded',
          message: 'Image converted to WebP and set as active override.',
        });
      }
    } catch (err) {
      showToast && showToast({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Could not upload image.',
      });
    } finally {
      setUploadingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Reset single override to baseline
  const handleResetSingle = (key) => {
    setOverrides((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
    showToast && showToast({
      type: 'info',
      title: 'Reset to Default',
      message: `Reverted "${key}" to original baseline default.`,
    });
  };

  // Reset ALL overrides to defaults
  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all dynamic text and image overrides back to default? Original website content will be restored.')) {
      setOverrides({});
      onSaveOverrides && onSaveOverrides({});
      showToast && showToast({
        type: 'success',
        title: 'All Overrides Reset',
        message: 'All dynamic replacements cleared. Baseline content restored.',
      });
    }
  };

  // Add custom override key
  const handleAddCustom = (e) => {
    e.preventDefault();
    const cleanKey = customKeyName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!cleanKey) {
      showToast && showToast({ type: 'error', title: 'Invalid Key', message: 'Please enter a valid key name.' });
      return;
    }
    if (overrides[cleanKey] || DEFAULT_OVERRIDE_SLOTS.some((s) => s.key === cleanKey)) {
      showToast && showToast({ type: 'error', title: 'Key Exists', message: 'An override with this key already exists.' });
      return;
    }

    setOverrides((prev) => ({
      ...prev,
      [cleanKey]: {
        label: customKeyName.trim(),
        section: 'Custom Overrides',
        type: customKeyType,
        defaultValue: '',
        value: '',
        active: true,
        isScheduled: false,
        isCustom: true,
      },
    }));

    setCustomKeyName('');
    setShowAddCustom(false);
    showToast && showToast({
      type: 'success',
      title: 'Custom Override Added',
      message: `Created slot for "${cleanKey}". You can now configure its replacement value and timer.`,
    });
  };

  // Combined list of slots
  const allSlots = [
    ...DEFAULT_OVERRIDE_SLOTS,
    ...Object.entries(overrides)
      .filter(([k, val]) => val?.isCustom && !DEFAULT_OVERRIDE_SLOTS.some((s) => s.key === k))
      .map(([k, val]) => ({
        key: k,
        section: 'Custom Overrides',
        label: val.label || k,
        type: val.type || 'text',
        defaultValue: 'None',
        description: 'Administrator custom override hook.',
        isCustom: true,
      })),
  ];

  // Filter slots
  const filteredSlots = allSlots.filter((slot) => {
    const matchesSection = selectedSection === 'ALL' || slot.section === selectedSection;
    const matchesSearch =
      !searchQuery.trim() ||
      slot.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const handleSave = () => {
    onSaveOverrides && onSaveOverrides(overrides);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls & Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brass-600 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brass-800 font-bold">
              Dynamic CMS & Scheduled Campaigns
            </span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] mt-1">
            Global Content, Text & Image Overrides
          </h3>
          <p className="text-xs text-[#5A524A] max-w-2xl leading-relaxed mt-0.5">
            Replace any headline, paragraph, phone number, or photo across the main website without code redeployments. Set start/end timers for seasonal promotions, or apply immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
            title="Reset all overrides back to baseline website content"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddCustom(!showAddCustom)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brass-800 bg-brass-100/70 hover:bg-brass-200/70 border border-brass-300 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Custom Override</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save & Apply Overrides</span>
          </button>
        </div>
      </div>

      {/* Add Custom Override Panel */}
      {showAddCustom && (
        <form onSubmit={handleAddCustom} className="p-4 rounded-2xl bg-[#FAF7F2] border border-brass-600/40 shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-brass-700" />
              <span>Register New Custom Override Hook</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAddCustom(false)}
              className="text-xs text-[#5A524A] hover:text-[#1A1A1A]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-[#3D3731] mb-1">
                Custom Name / Key (e.g. "Special Announcement Header" or "promo_banner_url")
              </label>
              <input
                type="text"
                required
                value={customKeyName}
                onChange={(e) => setCustomKeyName(e.target.value)}
                placeholder="e.g. festive_banner_headline"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#3D3731] mb-1">
                Content Type
              </label>
              <select
                value={customKeyType}
                onChange={(e) => setCustomKeyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-bold"
              >
                <option value="text">Text / Copy Block</option>
                <option value="image">Image URL / File Upload</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-brass-600 hover:bg-brass-500 text-white text-xs font-bold shadow-sm"
            >
              Create Override Slot
            </button>
          </div>
        </form>
      )}

      {/* Filter and Section Selector */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search override slots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedSection === sec
                  ? 'bg-brass-600 text-white shadow-sm'
                  : 'bg-[#FAF7F2] text-[#5A524A] hover:bg-[#F0EBE1] border border-[#DDD5C7]'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Override Cards List */}
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white border border-[#DDD5C7] text-xs text-[#6B635B]">
            No matching override slots found. Try clearing your search query.
          </div>
        ) : (
          filteredSlots.map((slot) => {
            const data = overrides[slot.key] || {};
            const isConfigured = Boolean(data.value && data.value.trim());
            const isActive = data.active !== false && isConfigured;
            const isScheduled = Boolean(data.isScheduled);
            const statusInfo = getOverrideStatus({
              active: isActive,
              value: data.value,
              isScheduled,
              scheduledStart: data.scheduledStart,
              scheduledEnd: data.scheduledEnd,
            });

            return (
              <div
                key={slot.key}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all space-y-4 shadow-sm ${
                  isActive
                    ? 'border-brass-600/60 ring-1 ring-brass-600/20'
                    : 'border-[#DDD5C7]'
                }`}
              >
                {/* Header: Label, Section & Live Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E1D5]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-[#FAF7F2] text-[#5A524A] border border-[#DDD5C7]">
                        {slot.section}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C847A]">
                        Key: <strong className="text-brass-800">{slot.key}</strong>
                      </span>
                      {slot.isCustom && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] mt-1">
                      {slot.label}
                    </h4>
                    <p className="text-[11px] text-[#6B635B] mt-0.5">
                      {slot.description}
                    </p>
                  </div>

                  {/* Status & Toggle Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Live Timer Status Indicator */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${
                        statusInfo.color === 'emerald'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : statusInfo.color === 'amber'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : statusInfo.color === 'rose'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusInfo.color === 'emerald'
                            ? 'bg-emerald-500 animate-pulse'
                            : statusInfo.color === 'amber'
                            ? 'bg-amber-500'
                            : statusInfo.color === 'rose'
                            ? 'bg-rose-500'
                            : 'bg-stone-400'
                        }`}
                      ></span>
                      <span>{statusInfo.label}</span>
                    </span>

                    {/* Enable/Disable Toggle */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#1A1A1A] pl-1">
                      <input
                        type="checkbox"
                        checked={data.active !== false}
                        onChange={(e) => handleUpdateField(slot.key, 'active', e.target.checked)}
                        className="w-4 h-4 rounded text-brass-600 focus:ring-brass-500 accent-brass-600 cursor-pointer"
                      />
                      <span>Active</span>
                    </label>

                    {/* Reset single */}
                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => handleResetSingle(slot.key)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors ml-1"
                        title="Revert this override to default baseline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input Area (Text or Image) */}
                <div className="space-y-3">
                  {slot.type === 'image' ? (
                    /* Image Override Input */
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={data.value || ''}
                          onChange={(e) => handleUpdateField(slot.key, 'value', e.target.value)}
                          placeholder={`Enter image URL or upload replacement (default: ${slot.defaultValue})`}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 font-mono"
                        />
                        <label className="px-3 py-2 rounded-xl border border-[#DDD5C7] bg-white hover:bg-[#F5F2EB] text-xs font-semibold text-[#1A1A1A] cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                          {uploadingKeys[slot.key] ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brass-700" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-brass-700" />
                          )}
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(slot.key, e.target.files?.[0])}
                            className="hidden"
                            disabled={uploadingKeys[slot.key]}
                          />
                        </label>
                      </div>

                      {/* Image Preview & Default Comparison */}
                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        {data.value && (
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7]">
                            <img
                              src={getFullImageUrl(data.value)}
                              alt="Override preview"
                              className="w-12 h-12 rounded object-cover border border-[#DDD5C7] bg-white"
                              onError={(e) => { e.currentTarget.src = '/images/brands/default.webp'; }}
                            />
                            <div>
                              <span className="text-[10px] font-bold text-emerald-700 block">
                                Override Image Active
                              </span>
                              <span className="text-[10px] text-[#5A524A] font-mono truncate max-w-xs block">
                                {data.value}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="text-[11px] text-[#6B635B]">
                          Original Baseline: <code className="text-[#3D3731] font-mono bg-stone-100 px-1 py-0.5 rounded">{slot.defaultValue}</code>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Text Override Input */
                    <div className="space-y-1.5">
                      <textarea
                        rows={slot.key.includes('text') || slot.key.includes('subheadline') ? 3 : 2}
                        value={data.value || ''}
                        onChange={(e) => handleUpdateField(slot.key, 'value', e.target.value)}
                        placeholder={`Enter replacement text (Leave blank to use original baseline: "${slot.defaultValue}")`}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600 focus:bg-white resize-none leading-relaxed"
                      />
                      <div className="flex items-center justify-between text-[11px] text-[#6B635B] px-1">
                        <span className="truncate max-w-md">
                          Baseline: <strong className="text-[#3D3731]">{slot.defaultValue}</strong>
                        </span>
                        {isConfigured && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Custom text active
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timing & Scheduling Section */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-brass-700" />
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          Scheduling & Timing Controls
                        </span>
                      </div>

                      {/* Immediate vs Scheduled Radio/Switch */}
                      <div className="inline-flex rounded-lg bg-white border border-[#DDD5C7] p-0.5 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => handleUpdateField(slot.key, 'isScheduled', false)}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            !isScheduled
                              ? 'bg-brass-600 text-white shadow-2xs'
                              : 'text-[#5A524A] hover:text-[#1A1A1A]'
                          }`}
                        >
                          Apply Immediately
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateField(slot.key, 'isScheduled', true)}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            isScheduled
                              ? 'bg-brass-600 text-white shadow-2xs'
                              : 'text-[#5A524A] hover:text-[#1A1A1A]'
                          }`}
                        >
                          Schedule Time Window
                        </button>
                      </div>
                    </div>

                    {/* Datetime Pickers if Scheduled */}
                    {isScheduled && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#E8E1D5] animate-fade-in">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brass-700" />
                            <span>Start Date & Time (Override begins)</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={data.scheduledStart || ''}
                            onChange={(e) => handleUpdateField(slot.key, 'scheduledStart', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#5A524A] mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brass-700" />
                            <span>End Date & Time (Reverts to baseline)</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={data.scheduledEnd || ''}
                            onChange={(e) => handleUpdateField(slot.key, 'scheduledEnd', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] focus:outline-none focus:border-brass-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-2 z-20 p-4 rounded-2xl bg-[#141415]/95 text-white border border-brass-600/40 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-white block">
            {Object.keys(overrides).length} Dynamic Overrides Configured
          </span>
          <span className="text-[10px] text-[#A0988E]">
            All updates propagate instantly to storefront via real-time BroadcastChannel.
          </span>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
}

