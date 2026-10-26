import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Check, Compass, Award, ExternalLink, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getFullImageUrl, getWhatsAppLink } from '../utils/api';

export default function VintageWatchAdShowcase() {
  const { storeData } = useStore();
  const ad = storeData.editorialAd || {};
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const waUrl = getWhatsAppLink(contactPhone, { name: ad.title || 'Townsend Skeleton Automatic', brand: 'Fossil Heritage' }, 'Baldev Plaza & JalKal showrooms');
  const adImage = getFullImageUrl(ad.image);

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E8E1D5] overflow-hidden">
      {/* Background warm vintage spotlight */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brass-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column: Full Editorial Background Photography & Specs Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[#DDD5C7] shadow-lg group">
              <img
                src={adImage}
                alt={ad.title || 'Vintage Watch Advertisement Showcase'}
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
                    {ad.watchModel || ad.title || 'Townsend Automatic Skeleton'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-xs sm:text-sm font-bold text-brass-900 block">
                    {ad.price ? `₹${Number(ad.price).toLocaleString('en-IN')}` : 'Price Upon Request'}
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
                <span>{ad.badge || 'CRAFTSMANSHIP SPOTLIGHT'}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
                {ad.title || 'The Art of Natural Patina & Raw Saddle Leather'}
              </h2>

              <blockquote className="font-serif italic text-base sm:text-lg text-brass-800 border-l-2 border-brass-600 pl-4 py-1">
                {ad.quote || '“A great timepiece shouldn’t just tell time. It should tell where you’ve been.”'}
              </blockquote>

              <p className="text-xs sm:text-sm text-[#5A524A] leading-relaxed font-normal">
                {ad.description ||
                  'Each leather strap in our vintage collection is steeped in natural vegetable oils for 30 days, creating a warm, organic sheen that softens and personalizes with every month on your wrist.'}
              </p>
            </div>

            {/* Horology Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Movement Caliber
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {ad.caliber || 'Japanese 21-Jewel Automatic (21,600 vph)'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Case Finishing
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {ad.material || '316L Brushed Steel with Antique Brass Accents'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Strap Horween Leather
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {ad.strapLeather || 'Full-Grain Italian Saddle Leather, 22mm'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#DDD5C7] space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-mono text-brass-800 font-bold tracking-wider block">
                  Water Resistance & Glass
                </span>
                <span className="text-[#1A1A1A] font-medium">
                  {ad.waterResistance || '100M Water Resistant • Sapphire Crystal'}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-widest font-extrabold bg-gradient-to-r from-brass-600 to-amber-600 hover:from-brass-500 hover:to-amber-500 text-white shadow-lg shadow-brass-600/25 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire Private Viewing</span>
              </a>

              <a
                href="#showrooms"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-widest font-bold text-[#1A1A1A] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] shadow-sm transition-all active:scale-95"
              >
                <Compass className="w-4 h-4 text-brass-700" />
                <span>Visit Golghar Showrooms</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
