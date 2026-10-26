import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  ShieldCheck,
  Heart,
  Send,
  Check,
  Award,
  Sparkles,
  Watch,
  Gift,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const { storeData } = useStore();
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
  const brandName = storeData.brandName || 'RAM PRASAD AGENCIES';
  const footerVipBadge = storeData.footerVipBadge || 'Vintage Collectors Circle';
  const footerVipTitle = storeData.footerVipTitle || 'Receive 10% Off Your First Automatic Timepiece';
  const footerVipSubtitle =
    storeData.footerVipSubtitle ||
    'Be the first to preview limited-edition capsule drops, collector timepieces, and exclusive invitations to private showroom fittings in Gorakhpur.';

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#EDE7DE] border-t border-[#DDD5C7] pt-16 pb-12 text-[#5A524A] text-xs font-sans">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-12">
        {/* Top Newsletter & Brand VIP Invitation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brass-800">
              <Gift className="w-3.5 h-3.5" />
              <span>{footerVipBadge}</span>
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
              {footerVipTitle}
            </h3>
            <p className="text-xs text-[#5A524A] max-w-xl">
              {footerVipSubtitle}
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex-1 max-w-md flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#DDD5C7] text-xs text-[#1A1A1A] placeholder-[#8C847A] focus:outline-none focus:border-brass-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brass-600 hover:bg-brass-500 text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Joined!</span>
                </>
              ) : (
                <>
                  <span>Join VIP</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

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
                  !storeData.tagline.includes('TheWatchStore.in')
                    ? storeData.tagline
                    : 'ramprasadWatchstore.in • Golghar'}
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-[#5A524A]">
              Gorakhpur’s premier authorized specialists in imported luxury timepieces, Swiss automatic calibers, and certified horology servicing for over four decades.
            </p>

            <div className="flex items-center gap-2 text-brass-800 font-medium">
              <ShieldCheck className="w-4 h-4 text-brass-700" />
              <span>Official Stamped 2-Year International Warranty</span>
            </div>
          </div>

          {/* Col 2: Showroom 1 • Baldev Plaza */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brass-700" />
              <span>Baldev Plaza Flagship</span>
            </h5>
            <p className="leading-relaxed text-[#5A524A]">
              Baldev Plaza, Main Commercial Market, Golghar, Gorakhpur, Uttar Pradesh - 273001.
            </p>
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

          {/* Col 3: Showroom 2 • JalKal Building */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brass-700" />
              <span>JalKal Building Boutique</span>
            </h5>
            <p className="leading-relaxed text-[#5A524A]">
              Shop No. 1, JalKal Building, Main Road, Golghar, Gorakhpur, Uttar Pradesh - 273001.
            </p>
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

        {/* Bottom Bar: Copyright & Authenticity Seal */}
        <div className="pt-8 border-t border-[#DDD5C7] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7C746B]">
          <p>
            {storeData.footerCopyright || `© ${new Date().getFullYear()} ${brandName} — Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved.`}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-brass-800 font-medium">
            <span>• 100% Genuine Stamped Stock</span>
            <span>• Free Insured Express Transit</span>
            <span>• Verified Horologists</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
