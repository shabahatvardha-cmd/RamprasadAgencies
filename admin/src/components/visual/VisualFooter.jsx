import React from 'react';
import { Gift, Phone, MapPin, Edit2, ShieldCheck, Heart } from 'lucide-react';
import BrandLogo from '../BrandLogo';

export default function VisualFooter({ storeData = {}, isEditMode, onOpenEdit }) {
  const brandName = storeData.brandName || 'RAM PRASAD AGENCIES';
  const contactPhone = storeData.contactPhone || '+91 98765 43210';
  const footerCopyright =
    storeData.footerCopyright ||
    'Ram Prasad Agencies. Baldev Plaza & JalKal Building, Golghar, Gorakhpur. All rights reserved.';
  const footerVipBadge = storeData.footerVipBadge || 'Vintage Collectors Circle';
  const footerVipTitle = storeData.footerVipTitle || 'Receive 10% Off Your First Automatic Timepiece';
  const footerVipSubtitle =
    storeData.footerVipSubtitle ||
    'Preview limited-edition capsule drops and private showroom fittings in Gorakhpur.';

  return (
    <footer id="footer" className="relative bg-[#EDE7DE] border-t border-[#DDD5C7] pt-14 pb-10 text-[#5A524A] text-xs font-sans">
      {/* Visual Admin Edit Trigger Badge */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => onOpenEdit('branding')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-brass-600 hover:bg-brass-500 text-white shadow-2xl hover:scale-105 transition-all border border-white/30 backdrop-blur-md"
            title="Edit Vintage Collectors Circle, Brand Name, Contact Phone, and Footer Copyright"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Footer & Helpline</span>
          </button>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 space-y-10">
        {/* Top Newsletter Teaser */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDD5C7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-brass-800">
              <Gift className="w-3.5 h-3.5" />
              <span>{footerVipBadge}</span>
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
              {footerVipTitle}
            </h3>
            <p className="text-xs text-[#6B635B]">
              {footerVipSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <BrandLogo customSrc={storeData?.logo} className="w-8 h-8" />
            <span className="font-serif text-sm font-bold text-[#1A1A1A]">{brandName}</span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF7F2] border border-[#DDD5C7]">
              {contactPhone}
            </span>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-6 border-t border-[#DDD5C7] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7D756C]">
          <p>{footerCopyright}</p>
          <div className="flex items-center gap-4">
            <span>Official Swiss & Japanese Horology</span>
            <span>•</span>
            <span>Golghar Showrooms, Gorakhpur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
