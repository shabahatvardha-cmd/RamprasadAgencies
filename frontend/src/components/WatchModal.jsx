import React, { useState, useEffect } from 'react';
import { X, Phone, MapPin, Clock } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink, getStoredCustomerProfile } from '../utils/api';
import { OriginalWhatsAppIcon } from './FloatingWhatsApp';

export default function WatchModal({ watch, onClose, contactPhone }) {
  const [userName] = useState(() => getStoredCustomerProfile()?.name || '');
  const [userPhone] = useState(() => getStoredCustomerProfile()?.phone || '');
  const [userEmail] = useState(() => getStoredCustomerProfile()?.email || '');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!watch) return null;

  const fullImage = getFullImageUrl(watch.image);
  const waUrl = getWhatsAppLink(
    contactPhone,
    watch,
    watch.storeLocation || 'Golghar showrooms',
    { name: userName, phone: userPhone, email: userEmail }
  );
  const cleanPhone = (contactPhone || '9876543210').replace(/[^0-9]/g, '');

  const formattedPrice = watch.price
    ? `₹${Number(watch.price).toLocaleString('en-IN')}`
    : 'Price Upon Request';
  const formattedOriginalPrice = watch.originalPrice && watch.originalPrice > watch.price
    ? `₹${Number(watch.originalPrice).toLocaleString('en-IN')}`
    : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in cursor-pointer"
    >
      <div
        className="relative w-full max-w-2xl lg:max-w-3xl mx-auto rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-2xl flex flex-row overflow-hidden max-h-[92vh] sm:max-h-[460px] cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-20 p-1.5 sm:p-2 rounded-full bg-white/95 text-[#3D3731] hover:text-[#1A1A1A] hover:bg-white border border-[#DDD5C7] shadow-sm transition-all hover:scale-105 cursor-pointer"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Left: Product Image Stage (Directly facing details side-by-side, no scrolling) */}
        <div className="w-[38%] sm:w-[40%] bg-gradient-to-b from-[#F7F2E9] to-[#EFE7D8] border-r border-[#E5DEC9] p-2.5 sm:p-4 flex items-center justify-center relative shrink-0 overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-radial from-white/80 via-transparent to-transparent pointer-events-none" />

          <img
            src={fullImage}
            alt={watch.name}
            className="w-auto h-full max-h-[160px] sm:max-h-[220px] md:max-h-[290px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = '/images/brands/default.webp';
            }}
          />

          {/* Stock Availability Pill */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider bg-white/95 text-emerald-800 border border-emerald-300 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{watch.inStock !== false ? 'In Stock' : 'Sourcing'}</span>
          </div>

          {/* Bottom Badge */}
          {watch.badge && (
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-[#1A1A1A]/85 text-amber-300 backdrop-blur-sm border border-white/10">
              {watch.badge}
            </div>
          )}
        </div>

        {/* Right: Specifications & Direct Concierge (Directly in front of watch pic, zero scrolling) */}
        <div className="w-[62%] sm:w-[60%] p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden space-y-2 sm:space-y-2.5">
          {/* 1. Header: Brand, Title, Price & Warranty */}
          <div>
            <div className="flex items-center justify-between gap-2 pr-6">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest font-extrabold text-brass-700 truncate">
                {watch.brand || 'Luxury Horology'}
              </span>
              <span className="text-[9px] text-[#7C746B] font-medium hidden md:inline shrink-0">
                Ref: {watch._id || watch.id || 'Showroom'}
              </span>
            </div>

            <h2 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#111111] leading-snug mt-0.5 line-clamp-1">
              {watch.name}
            </h2>

            {/* Showroom Status & Warranty Row (No Price Displayed) */}
            <div className="flex items-center justify-between gap-2 mt-1 pb-1.5 border-b border-[#E8E1D5]">
              <span className="text-xs sm:text-sm font-serif font-bold text-brass-900 tracking-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Official Authorized Stock
              </span>
              <span className="text-[8.5px] sm:text-[9px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Official Warranty
              </span>
            </div>
          </div>

          {/* 2. Compact Horology Specifications (4 Neat Mini-Pills) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
            <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-[#E5DFD5] shadow-2xs">
              <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#7C746B] block leading-none">
                Movement
              </span>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#1A1A1A] truncate mt-0.5" title={watch.movement}>
                {watch.movement || watch.category || 'Precision Automatic'}
              </p>
            </div>

            <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-[#E5DFD5] shadow-2xs">
              <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#7C746B] block leading-none">
                Case Size
              </span>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#1A1A1A] truncate mt-0.5">
                {watch.caseDiameter || watch.caseSize || '40mm'}
              </p>
            </div>

            <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-[#E5DFD5] shadow-2xs">
              <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#7C746B] block leading-none">
                Strap / Bracelet
              </span>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#1A1A1A] truncate mt-0.5" title={watch.strapType}>
                {watch.strapType || watch.strap || 'Stainless Steel'}
              </p>
            </div>

            <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-[#E5DFD5] shadow-2xs">
              <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#7C746B] block leading-none">
                Water Resistance
              </span>
              <p className="text-[10.5px] sm:text-[11px] font-semibold text-[#1A1A1A] truncate mt-0.5">
                {watch.waterResistance || '100M / 10 ATM'}
              </p>
            </div>
          </div>

          {/* 3. Description (Seen cleanly directly in front of watch pic, no scrolling) */}
          <div className="bg-white/85 rounded-lg p-2 sm:p-2.5 border border-[#E8E1D5] shadow-2xs">
            <span className="text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#7C746B] block leading-none mb-1">
              Description & Heritage
            </span>
            <p className="text-[10.5px] sm:text-[11px] text-[#3D3731] leading-relaxed line-clamp-2 sm:line-clamp-3">
              {watch.description ||
                'Authentic timepiece with official manufacturer warranty. Available for in-person inspection and complimentary sizing at Ram Prasad Agencies Gorakhpur.'}
            </p>
          </div>

          {/* 4. Showroom Location Strip (Compact one-liner) */}
          <div className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#F4EFE6] border border-[#DDD5C7] text-[10px] sm:text-[10.5px]">
            <MapPin className="w-3 h-3 text-brass-700 shrink-0" />
            <span className="text-[#3D3731] font-medium truncate flex-1">
              Available at: <strong className="text-stone-900">{watch.storeLocation || 'Baldev Plaza & JalKal Building'}</strong>
            </span>
            <span className="text-[9.5px] text-[#6B635B] hidden md:flex items-center gap-1 shrink-0 font-medium">
              <Clock className="w-2.5 h-2.5 text-brass-700" />
              10:30 AM – 9 PM
            </span>
          </div>

          {/* 5. Direct Action Buttons */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 rounded-lg text-[10.5px] sm:text-xs uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-md shadow-[#25D366]/20 transition-all active:scale-[0.98]"
            >
              <OriginalWhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" size={16} />
              <span>Inquire WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-1 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-lg text-[10.5px] sm:text-xs font-bold text-[#1A1A1A] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] shadow-2xs transition-all active:scale-[0.98]"
              title="Call Showroom"
            >
              <Phone className="w-3 h-3 text-brass-700" />
              <span className="hidden sm:inline">Call Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
