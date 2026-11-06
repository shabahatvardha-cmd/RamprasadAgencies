import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Award,
  Store,
  Megaphone,
  Instagram,
  Facebook,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';
import { OriginalWhatsAppIcon } from './FloatingWhatsApp';
import { getWhatsAppLink } from '../utils/api';
import { useWhatsApp } from '../context/WhatsAppContext';

export default function Footer() {
  const { storeData, getOverride } = useStore();
  const { openWhatsApp } = useWhatsApp();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const rawContactPhone = storeData.contactPhone || '+91 98765 43210';
  const contactPhone = getOverride ? getOverride('contact_phone', rawContactPhone) : rawContactPhone;
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
  const brandName = storeData.brandName || 'RAM PRASAD AGENCIES';
  const facebookUrl = storeData.facebookUrl || 'https://www.facebook.com/share/18ih1rWwd6/';
  const instagramUrl = storeData.instagramUrl || 'https://www.instagram.com/ramprasadagencies?rpxt=ZTdmdGQybncwOXBr';

  // Pre-composed direct WhatsApp inquiries for B2B Retailer & Advertising Support
  const retailerWaMsg = `Hello Ram Prasad Agencies, I am interested in partnering with you as an authorized retailer for official watch distribution and wholesale allocations across Eastern Uttar Pradesh. Please share details and wholesale catalog.`;
  const retailerWaLink = getWhatsAppLink(contactPhone, retailerWaMsg);

  const salesSupportWaMsg = `Hello Ram Prasad Agencies, I would like to request advertising materials, certified brand digital assets, and POS showcase displays. Please share the available marketing collateral.`;
  const salesSupportWaLink = getWhatsAppLink(contactPhone, salesSupportWaMsg);

  return (
    <footer className="bg-[#EDE7DE] border-t border-[#DDD5C7] pt-16 pb-0 text-[#5A524A] text-xs font-sans">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-12 pb-12">
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
                  <button
                    type="button"
                    onClick={() => openWhatsApp({
                      phone: contactPhone,
                      message: retailerWaMsg,
                      purpose: 'retailer',
                      title: 'Retailer Partnership Inquiry',
                      subtitle: 'Enter your name or store name to personalize your authorized retailer inquiry',
                    })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/25 hover:shadow-xl transition-all duration-300 active:scale-95 group/btn cursor-pointer"
                    title="Connect on WhatsApp regarding Retailer Partnership"
                  >
                    <OriginalWhatsAppIcon className="w-4 h-4 shrink-0" size={16} />
                    <span>Apply via WhatsApp</span>
                  </button>
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
                  <button
                    type="button"
                    onClick={() => openWhatsApp({
                      phone: contactPhone,
                      message: salesSupportWaMsg,
                      purpose: 'sales_support',
                      title: 'Advertising & Sales Support',
                      subtitle: 'Enter your name or store name to request advertising collateral and POS displays',
                    })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/25 hover:shadow-xl transition-all duration-300 active:scale-95 group/btn cursor-pointer"
                    title="Connect on WhatsApp regarding Advertising & Sales Support"
                  >
                    <OriginalWhatsAppIcon className="w-4 h-4 shrink-0" size={16} />
                    <span>Request on WhatsApp</span>
                  </button>
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

            <div className="flex items-center gap-2 text-brass-800 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-brass-700 shrink-0" />
              <span>Official Stamped 2-Year International Warranty</span>
            </div>
          </div>

          {/* Col 2: Showroom 1 - Baldev Plaza */}
          <div className="space-y-3">
            <a
              href="https://www.google.com/maps/place/Ram+Prasad+Agencies/@26.7540195,83.3709465,19.34z/data=!4m6!3m5!1s0x399144642a773705:0x3bad10d5aa6adb42!8m2!3d26.754034!4d83.371134!16s%2Fg%2F11cjpcj5f7?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/fstore"
              title="Get GPS Directions to Ram Prasad Agencies - Baldev Plaza on Google Maps"
            >
              <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] group-hover/fstore:text-brass-800 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <MapPin className="w-4 h-4 text-brass-700 group-hover/fstore:scale-110 transition-transform" />
                <span className="group-hover/fstore:underline underline-offset-2">Ram Prasad Agencies — Baldev Plaza</span>
              </h5>
            </a>
            <a
              href="https://www.google.com/maps/place/Ram+Prasad+Agencies/@26.7540195,83.3709465,19.34z/data=!4m6!3m5!1s0x399144642a773705:0x3bad10d5aa6adb42!8m2!3d26.754034!4d83.371134!16s%2Fg%2F11cjpcj5f7?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="block leading-relaxed text-[#5A524A] hover:text-[#1A1A1A] hover:underline underline-offset-2 transition-colors"
              title="Get GPS Directions to Ram Prasad Agencies - Baldev Plaza on Google Maps"
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
              href="https://www.google.com/maps/place/Ram+Prasad+Agencies/@26.7518984,83.3699537,19.16z/data=!4m6!3m5!1s0x39914560a023e6ab:0x2198675743c2615c!8m2!3d26.7516951!4d83.3704248!16s%2Fg%2F11krs2yzqt?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group/fstore"
              title="Get GPS Directions to Ram Prasad Agencies - JalKal Building on Google Maps"
            >
              <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] group-hover/fstore:text-brass-800 uppercase tracking-wider flex items-center gap-2 transition-colors">
                <MapPin className="w-4 h-4 text-brass-700 group-hover/fstore:scale-110 transition-transform" />
                <span className="group-hover/fstore:underline underline-offset-2">Ram Prasad Agencies — JalKal Building</span>
              </h5>
            </a>
            <a
              href="https://www.google.com/maps/place/Ram+Prasad+Agencies/@26.7518984,83.3699537,19.16z/data=!4m6!3m5!1s0x39914560a023e6ab:0x2198675743c2615c!8m2!3d26.7516951!4d83.3704248!16s%2Fg%2F11krs2yzqt?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="block leading-relaxed text-[#5A524A] hover:text-[#1A1A1A] hover:underline underline-offset-2 transition-colors"
              title="Get GPS Directions to Ram Prasad Agencies - JalKal Building on Google Maps"
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
      </div>

      {/* Dark Luxury Sub-Footer Bar (Circular Social Media Style: Instagram & Facebook Only) */}
      <div className="w-full bg-[#0D0C0A] border-t border-[#23201C] py-8 sm:py-10 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          {/* Circular Social Buttons: Facebook & Instagram Only */}
          <div className="flex items-center justify-center gap-3.5">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#262320] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 group/fb"
              title="Follow Ram Prasad Agencies on Facebook"
              aria-label="Ram Prasad Agencies on Facebook"
            >
              <Facebook className="w-4 h-4 fill-white text-white transition-transform group-hover/fb:scale-105" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#262320] hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 group/ig"
              title="Follow Ram Prasad Agencies on Instagram (@ramprasadagencies)"
              aria-label="Ram Prasad Agencies on Instagram"
            >
              <Instagram className="w-4 h-4 text-white transition-transform group-hover/ig:scale-105" />
            </a>
          </div>

          {/* Centered Legal / Policy / Assurance Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#9E968D]">
            <span className="hover:text-white transition-colors cursor-pointer">Authenticity Guarantee</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-white transition-colors cursor-pointer">Showroom Visit Terms</span>
          </div>

          {/* Centered Copyright & Horological Disclaimer */}
          <div className="text-[10.5px] sm:text-[11px] text-[#6C655D] flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 leading-relaxed">
            <span>
              {storeData.footerCopyright || `© ${new Date().getFullYear()} ${brandName}`}
            </span>
            <span className="text-[#3A3530] hidden sm:inline">|</span>
            <span>
              *Official Authorized Watch Retailer & Horology Service Center, Gorakhpur. All timepieces carry official stamped manufacturer warranties.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
