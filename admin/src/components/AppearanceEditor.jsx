import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Sparkles,
  Eye,
} from 'lucide-react';
import { DEFAULT_VINTAGE_STORE_DATA } from '../utils/defaults';
import ConfirmationModal from './ConfirmationModal';

const CURATED_PALETTES = [
  {
    id: 'antique-brass',
    name: 'Antique Brass & Warm Ivory (Fossil Signature)',
    hex: '#C5A059',
    badge: 'Curated Heritage',
    description: 'Brushed brass gold accents over warm ivory linen canvas.',
  },
  {
    id: 'burnt-sienna',
    name: 'Burnt Sienna & Autumn Rust',
    hex: '#B85A38',
    badge: 'Earthy Warmth',
    description: 'Tuscan saddle leather tones and rich terra cotta highlights.',
  },
  {
    id: 'forest-green',
    name: 'Deep Forest Green & Alpine Horology',
    hex: '#1B382B',
    badge: 'Prestigious Field',
    description: 'British racing green & vintage outdoor compass aesthetic.',
  },
  {
    id: 'imperial-gold',
    name: 'Imperial Swiss Gold',
    hex: '#D4AF37',
    badge: 'Haute Horlogerie',
    description: 'Classic Geneva yellow gold and brushed champagne accents.',
  },
  {
    id: 'royal-noir',
    name: 'Royal Charcoal Noir & Platinum',
    hex: '#1A1A1A',
    badge: 'Monochrome Minimal',
    description: 'High-contrast timeless charcoal indexes and clean borders.',
  },
];

export default function AppearanceEditor({ appearanceData, onSaveAppearance, showToast, isSaving }) {
  const [appearance, setAppearance] = useState(() => {
    return appearanceData && typeof appearanceData === 'object'
      ? { ...DEFAULT_VINTAGE_STORE_DATA.appearance, ...appearanceData }
      : DEFAULT_VINTAGE_STORE_DATA.appearance;
  });

  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const handleSelectPalette = (hex) => {
    setAppearance((prev) => ({ ...prev, accentColor: hex }));
  };

  const handleRestoreDefaults = () => {
    setAppearance(DEFAULT_VINTAGE_STORE_DATA.appearance);
    showToast({
      type: 'info',
      title: 'Styling Defaults Restored',
      message: 'Reset accent colors and typography back to Antique Brass signature.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brass-500/15 text-brass-800 border border-brass-600/30">
            <Palette className="w-3.5 h-3.5 text-brass-700" />
            <span>Theme & Styling Studio</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-2">
            Colors, Typography & Visual Polish
          </h2>
          <p className="text-xs text-[#6B635B] mt-0.5 max-w-xl">
            Choose brand accent tones, card corner radius styles, and typography scaling for the storefront.
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
            onClick={() => onSaveAppearance({ appearance })}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-md shadow-brass-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Styling</span>
          </button>
        </div>
      </div>

      {/* Grid: Color Selection & Live Swatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Curated Palettes */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-5">
          <h3 className="font-serif text-base font-bold text-[#1A1A1A] pb-3 border-b border-[#E8E1D5]">
            1. Curated Luxury Accent Palettes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CURATED_PALETTES.map((pal) => {
              const isSelected = appearance.accentColor?.toLowerCase() === pal.hex.toLowerCase();
              return (
                <div
                  key={pal.id}
                  onClick={() => handleSelectPalette(pal.hex)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brass-600 bg-brass-500/5 shadow-md ring-1 ring-brass-600/40'
                      : 'border-[#DDD5C7] hover:border-brass-500/60 bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full shadow-sm border border-black/10 shrink-0"
                        style={{ backgroundColor: pal.hex }}
                      />
                      <span className="text-xs font-bold text-[#1A1A1A]">
                        {pal.name}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brass-700 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-[#6B635B] mt-2 leading-relaxed">
                    {pal.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Custom Hex Color Picker */}
          <div className="pt-3 border-t border-[#E8E1D5]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A524A] mb-1.5">
              Or Specify Custom Accent Hex Code
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.accentColor || '#C5A059'}
                onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                className="w-10 h-10 rounded-xl cursor-pointer border border-[#DDD5C7] bg-white p-1"
              />
              <input
                type="text"
                value={appearance.accentColor || '#C5A059'}
                onChange={(e) => setAppearance({ ...appearance, accentColor: e.target.value })}
                placeholder="#C5A059"
                className="w-40 bg-[#FAF7F2] border border-[#DDD5C7] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#1A1A1A] uppercase focus:outline-none"
              />
              <span className="text-xs text-[#7C746B]">
                Updates CTAs, icons, price tags, and guarantee badges across the store.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Swatch & Typography */}
        <div className="lg:col-span-4 space-y-5">
          {/* Live Preview Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A524A] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-brass-700" />
              <span>Accent Color Preview</span>
            </span>

            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] space-y-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: appearance.accentColor || '#C5A059' }}
              >
                Sample Button CTA
              </span>

              <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">
                Townsend Skeleton Automatic 44mm
              </h4>

              <p className="text-xs font-bold" style={{ color: appearance.accentColor || '#C5A059' }}>
                ₹18,995 <span className="text-slate-400 font-normal line-through">₹22,995</span>
              </p>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="p-5 rounded-2xl bg-white border border-[#DDD5C7] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">
              Typography Scale
            </h4>
            <div className="space-y-2">
              {[
                { id: 'compact', label: 'Compact (Modern High-Density)' },
                { id: 'normal', label: 'Balanced (Recommended)' },
                { id: 'relaxed', label: 'Editorial (Spacious & Large)' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    appearance.fontScale === opt.id
                      ? 'border-brass-600 bg-brass-500/10 font-bold text-brass-800'
                      : 'border-[#DDD5C7] bg-[#FAF7F2] text-[#4A433D]'
                  }`}
                >
                  <input
                    type="radio"
                    name="fontScale"
                    checked={appearance.fontScale === opt.id}
                    onChange={() => setAppearance({ ...appearance, fontScale: opt.id })}
                    className="accent-brass-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showRestoreModal}
        title="Restore Appearance Defaults?"
        message="This will reset brand colors back to the signature Antique Brass (#C5A059) and balanced typography scale."
        confirmText="Yes, Restore Styling"
        onConfirm={handleRestoreDefaults}
        onClose={() => setShowRestoreModal(false)}
      />
    </div>
  );
}
