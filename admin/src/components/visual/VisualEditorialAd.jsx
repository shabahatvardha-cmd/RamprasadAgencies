import React from 'react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Check,
  Compass,
  Edit2,
  Clock,
  Layers,
} from 'lucide-react';
import { getFullImageUrl } from '../../utils/api';
import { formatINR } from '../../utils/formatters';

export default function VisualEditorialAd({ editorialAd = {}, isEditMode, onOpenEdit }) {
  const {
    badge = 'CRAFTSMANSHIP SPOTLIGHT • SWISS & JAPANESE CALIBERS',
    title = 'The Mastery of Swiss & Japanese Automatic Calibers',
    quote = '“A true mechanical caliber doesn’t just record time. It lives and beats with every movement of your wrist.”',
    description = 'From the 80-hour Powermatic 80 Nivachron hairsprings of Le Locle, Switzerland to the hand-finished Takumi Presage calibers of Tokyo, Ram Prasad Agencies brings authentic world-class horology to Gorakhpur. Every timepiece is verified, sized to your wrist, and delivered with official stamped warranty papers.',
    caliber = 'Swiss Powermatic 80.111 / Japanese 4R35 Automatic',
    material = '316L Solid Surgical Steel & Scratch-Resistant High-Tech Ceramic',
    strapLeather = 'Top-Grain Alligator-Embossed Leather & Solid Steel Bracelet',
    glass = 'Domed Sapphire Crystal with Internal Anti-Reflective Coating',
    waterResistance = '100 Meters / 10 Bar (Certified Screw-Down Crown)',
    image = 'https://images.unsplash.com/photo-1639006570490-79c0c53f1080?auto=format&fit=crop&w=1200&q=85',
    price = 62000,
    watchModel = 'Tissot PRX Powermatic 80 / Seiko Presage',
  } = editorialAd;

  const adImage = getFullImageUrl(image);

  return (
    <section id="editorial-showcase" className="relative w-full py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8E1D5] overflow-hidden">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => onOpenEdit('editorial')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Edit Editorial Image, Story, Caliber Specifications, and Price"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Craftsmanship Showcase</span>
          </button>
        </div>
      )}

      {/* Ambient background glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brass-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Full Editorial Background Photography & Specs Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#DDD5C7] shadow-lg group">
              <img
                src={adImage}
                alt={title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.88]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

              {/* Floating Craftsmanship Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest badge-brass shadow-sm">
                  <Award className="w-3.5 h-3.5 text-brass-700" />
                  <span>Artisan Caliber Showcase</span>
                </span>
              </div>

              {/* Bottom Card Overlay Details */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-2xl bg-white/95 border border-[#DDD5C7] backdrop-blur-md flex items-center justify-between gap-4 shadow-md">
                <div>
                  <span className="text-[10px] font-mono text-brass-800 uppercase tracking-widest font-bold block">
                    Featured Masterpiece
                  </span>
                  <span className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A]">
                    {watchModel || 'Tissot PRX / Seiko Presage'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-xs sm:text-sm font-bold text-brass-900 block">
                    Price Upon Request
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    ✓ Available in Gorakhpur
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Storytelling & Horology Specifications */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest badge-rust">
                <Sparkles className="w-3 h-3 text-rust-600" />
                <span>{badge}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
                {title}
              </h2>

              <blockquote className="font-serif italic text-base sm:text-lg text-brass-800 border-l-2 border-brass-600 pl-4 py-1">
                {quote}
              </blockquote>

              <p className="text-xs sm:text-sm text-[#5A524A] leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Horology Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Movement Caliber
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {caliber}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Case Finishing
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {material}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Strap & Hardware
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {strapLeather}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Sapphire & Depth
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {glass} • {waterResistance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
