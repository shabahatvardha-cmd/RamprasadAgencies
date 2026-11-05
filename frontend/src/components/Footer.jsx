import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  Store,
  Megaphone,
  ArrowRight,
  Instagram,
  Facebook,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { storeData, getOverride } = useStore();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const rawContactPhone = storeData.contactPhone || '+91 98765 43210';
  const contactPhone = getOverride ? getOverride('contact_phone', rawContactPhone) : rawContactPhone;
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
  const brandName = storeData.brandName || 'RAM PRASAD AGENCIES';
  const facebookUrl = storeData.facebookUrl || 'https://www.facebook.com/share/18ih1rWwd6/';
  const instagramUrl = storeData.instagramUrl || 'https://www.instagram.com/ramprasadagencies?rpxt=ZTdmdGQybncwOXBr';

  return (
    <footer className="bg-[#EDE7DE] border-t border-[#DDD5C7] pt-16 pb-12 text-[#5A524A] text-xs font-sans">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-12">
        {/* B2B Partnership & Retailer Support Grid (Only displayed on the Main Website / Homepage) */}
        {isHomePage && (
          <div id="retailer-support" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-24">
            {/* 1. Become Our Retailer */}
            <div className="bg-gradient-to-br from-[#FDFBF7] via-[#F4EDE2] to-[#E7D7C1] border border-[#D2C0A8] hover:border-brass-500/90 rounded-2xl p-5 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group h-full">
              {/* Full-Bleed Thematic Background with Cinematic Dark Horology Vignette on Hover */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100">
                <img
                  src="/images/editorial-baldev-flagship.webp"
                  alt=""
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 blur-[0.5px] brightness-[1.05] contrast-[1.05] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Dark Cinematic Vignette: provides 100% crystal contrast for white text on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-stone-950/80 to-black/60 transition-all duration-500" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/80 group-hover:bg-brass-500/25 border border-brass-600/30 group-hover:border-brass-400/50 text-brass-800 group-hover:text-brass-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Store className="w-6 h-6 transition-colors" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] group-hover:text-white tracking-wide transition-colors duration-300 drop-shadow-sm">
                    Become Our Retailer
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#4A423B] group-hover:text-stone-200 leading-relaxed max-w-lg transition-colors duration-300 font-medium">
                    Partner with Ram Prasad Agencies for authorized distribution, official horological brand allocations, and exclusive wholesale catalogs across Eastern Uttar Pradesh.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to="/retailer-application"
                    onClick={() => {
                      try {
                        sessionStorage.setItem('rpa_return_anchor', 'retailer-support');
                      } catch {}
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-900 group-hover:bg-brass-500 text-white group-hover:text-stone-950 transition-all duration-300 shadow-sm group-hover:shadow-xl active:scale-95 group/btn"
                  >
                    <span>Apply as Retailer</span>
                    <ArrowRight className="w-4 h-4 text-brass-400 group-hover:text-stone-950 transition-all duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Advertising and Sales Support */}
            <div className="bg-gradient-to-br from-[#FDFBF7] via-[#F4EDE2] to-[#E7D7C1] border border-[#D2C0A8] hover:border-brass-500/90 rounded-2xl p-5 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group h-full">
              {/* Full-Bleed Thematic Background with Cinematic Dark Horology Vignette on Hover */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-out opacity-0 group-hover:opacity-100">
                <img
                  src="/images/brand-ad-titan.webp"
                  alt=""
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 blur-[0.5px] brightness-[1.05] contrast-[1.05] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Dark Cinematic Vignette: provides 100% crystal contrast for white text on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-stone-950/80 to-black/60 transition-all duration-500" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-white/80 group-hover:bg-brass-500/25 border border-brass-600/30 group-hover:border-brass-400/50 text-brass-800 group-hover:text-brass-300 flex items-center justify-center mb-2 group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <Megaphone className="w-6 h-6 transition-colors" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] group-hover:text-white tracking-wide transition-colors duration-300 drop-shadow-sm">
                    Advertising and Sales Support
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#4A423B] group-hover:text-stone-200 leading-relaxed max-w-lg transition-colors duration-300 font-medium">
                    Access official brand promotional materials, certified digital assets, brand campaign collateral, and bespoke point-of-sale (POS) showcase displays.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    to="/sales-support"
                    onClick={() => {
                      try {
                        sessionStorage.setItem('rpa_return_anchor', 'retailer-support');
                      } catch {}
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-900 group-hover:bg-brass-500 text-white group-hover:text-stone-950 transition-all duration-300 shadow-sm group-hover:shadow-xl active:scale-95 group/btn"
                  >
                    <span>Explore Support</span>
                    <ArrowRight className="w-4 h-4 text-brass-400 group-hover:text-stone-950 transition-all duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4-Column Footer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Heritage & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo customSrc={storeData?.logo} className="w-10 h-10" />
              <div>
                <h4 className="font-serif text-base font-bold text-[#1A1A1A] tracking-wider">
                  {brandName}
                </h4>
                <p className="text-[9.5px] text-brass-800 uppercase tracking-widest font-semibold">
                  {storeData?.tagline &&
                  !storeData.tagline.includes('Vintage Horology') &&
                  !storeData.tagline.includes('Authorized & Imported') &&
                  !storeData.tagline.includes('TheWatchStore.in') &&
                  !storeData.tagline.toLowerCase().includes('ramprasadwatchstore')
                    ? storeData.tagline
                    : 'WATCHSTORE.IN'}
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-[#5A524A]">
              Gorakhpur's premier authorized specialists in imported luxury timepieces, Swiss automatic calibers, and certified horology servicing for over four decades.
            </p>

            <div className="flex items-center gap-2 text-brass-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-brass-700" />
              <span>Official Stamped 2-Year International Warranty</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-2 border-t border-[#DDD5C7]/70 space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#7C746B]">
                Official Channels
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C7] hover:border-[#E1306C]/50 text-[#5A524A] hover:text-[#E1306C] shadow-xs hover:shadow-md transition-all duration-300"
                  title="Follow Ram Prasad Agencies on Instagram (@ramprasadagencies)"
                  aria-label="Ram Prasad Agencies on Instagram"
                >
                  <Instagram className="w-4 h-4 text-[#7C746B] group-hover:text-[#E1306C] transition-colors group-hover:scale-110 duration-200" />
                  <span className="text-xs font-semibold tracking-tight">Instagram</span>
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C7] hover:border-[#1877F2]/50 text-[#5A524A] hover:text-[#1877F2] shadow-xs hover:shadow-md transition-all duration-300"
                  title="Follow Ram Prasad Agencies on Facebook"
                  aria-label="Ram Prasad Agencies on Facebook"
                >
                  <Facebook className="w-4 h-4 text-[#7C746B] group-hover:text-[#1877F2] transition-colors group-hover:scale-110 duration-200" />
                  <span className="text-xs font-semibold tracking-tight">Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Showroom 1 - Baldev Plaza */}
          <div className="space-y-3">
            <a
              href="https://www.google.com/maps?q=26.754034,83.371134&z=19"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/fstore"
              title="View Baldev Plaza Flagship on Google Maps"
            >
              <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] group-hover/fstore:text-brass-800 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <MapPin className="w-4 h-4 text-brass-700 group-hover/fstore:scale-110 transition-transform" />
                <span className="group-hover/fstore:underline underline-offset-2">Baldev Plaza Flagship</span>
              </h5>
            </a>
            <a
              href="https://www.google.com/maps?q=26.754034,83.371134&z=19"
              target="_blank"
              rel="noopener noreferrer"
              className="block leading-relaxed text-[#5A524A] hover:text-[#1A1A1A] hover:underline underline-offset-2 transition-colors"
              title="View Baldev Plaza Flagship on Google Maps"
            >
              Baldev Plaza, Main Commercial Market, Golghar, Gorakhpur, Uttar Pradesh - 273001.
            </a>
            <p className="text-[#2C2723] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brass-700" />
              <span>10:30 AM – 9:00 PM (All 7 Days)</span>
            </p>
            <p className="text-[#2C2723] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brass-700" />
              <a href={`tel:${cleanPhone}`} className="hover:text-brass-800 font-mono font-medium">
                {contactPhone}
              </a>
            </p>
          </div>

          {/* Col 3: Showroom 2 - JalKal Building */}
          <div className="space-y-3">
            <a
              href="https://www.google.com/maps?q=26.7516951,83.3704248&z=19"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/fstore"
              title="View JalKal Building Boutique on Google Maps"
            >
              <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] group-hover/fstore:text-brass-800 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <MapPin className="w-4 h-4 text-brass-700 group-hover/fstore:scale-110 transition-transform" />
                <span className="group-hover/fstore:underline underline-offset-2">JalKal Building Boutique</span>
              </h5>
            </a>
            <a
              href="https://www.google.com/maps?q=26.7516951,83.3704248&z=19"
              target="_blank"
              rel="noopener noreferrer"
              className="block leading-relaxed text-[#5A524A] hover:text-[#1A1A1A] hover:underline underline-offset-2 transition-colors"
              title="View JalKal Building Boutique on Google Maps"
            >
              Shop No. 1, JalKal Building, Main Road, Golghar, Gorakhpur, Uttar Pradesh - 273001.
            </a>
            <p className="text-[#2C2723] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brass-700" />
              <span>10:30 AM – 9:00 PM (All 7 Days)</span>
            </p>
            <p className="text-[#2C2723] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brass-700" />
              <a href={`tel:${cleanPhone}`} className="hover:text-brass-800 font-mono font-medium">
                {contactPhone}
              </a>
            </p>
          </div>

          {/* Col 4: Horology & Customer Care Pillars */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-brass-700" />
              <span>Artisan Care & Services</span>
            </h5>
            <ul className="space-y-2 text-[#5A524A]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-600"></span>
                <span>Free Bracelet Sizing & Ultrasonic Cleaning</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-600"></span>
                <span>Swiss Quartz Battery Replacement</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-600"></span>
                <span>Custom Sourcing for Imported References</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-600"></span>
                <span>Hand-Burnished Italian Leather Straps</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brass-600"></span>
                <span>Private VIP In-Store Timepiece Consultations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Social & Authenticity Seal */}
        <div className="pt-8 border-t border-[#DDD5C7] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#7C746B]">
          <p className="text-center md:text-left">
            {storeData.footerCopyright || `© ${new Date().getFullYear()} ${brandName} — Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 text-brass-800 font-medium">
            <div className="flex items-center gap-2 text-[#5A524A]">
              <span className="text-[10px] uppercase tracking-wider text-[#7C746B] font-semibold">Social:</span>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-white border border-[#DDD5C7] text-[#5A524A] hover:text-[#E1306C] hover:border-[#E1306C]/50 flex items-center justify-center shadow-xs hover:shadow transition-all group/soc"
                title="Instagram @ramprasadagencies"
                aria-label="Ram Prasad Agencies on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 transition-transform group-hover/soc:scale-110" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-white border border-[#DDD5C7] text-[#5A524A] hover:text-[#1877F2] hover:border-[#1877F2]/50 flex items-center justify-center shadow-xs hover:shadow transition-all group/soc"
                title="Facebook @ramprasadagencies"
                aria-label="Ram Prasad Agencies on Facebook"
              >
                <Facebook className="w-3.5 h-3.5 transition-transform group-hover/soc:scale-110" />
              </a>
            </div>
            <span className="hidden sm:inline text-[#DDD5C7]">|</span>
            <span>• 100% Genuine Stamped Stock</span>
            <span>• Free Insured Express Transit</span>
            <span>• Verified Horologists</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
