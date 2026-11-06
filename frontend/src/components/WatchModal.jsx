import React, { useState, useEffect } from 'react';
import { X, Phone, MapPin, Clock, AlertCircle, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink, getStoredCustomerProfile } from '../utils/api';
import { getWatchGender } from '../data/fallbackWatches';
import { OriginalWhatsAppIcon } from './FloatingWhatsApp';
import { useWhatsApp } from '../context/WhatsAppContext';

export default function WatchModal({ watch, onClose, contactPhone }) {
  const { openWhatsApp } = useWhatsApp();
  const [userName] = useState(() => getStoredCustomerProfile()?.name || '');
  const [userPhone] = useState(() => getStoredCustomerProfile()?.phone || '');
  const [userEmail] = useState(() => getStoredCustomerProfile()?.email || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const rawExtra = Array.isArray(watch?.images) ? watch.images : [];
  const allImages = watch ? [watch.image, ...rawExtra].filter(Boolean) : [];
  const currentImage = allImages[selectedImageIndex] || watch?.image;
  const fullImage = getFullImageUrl(currentImage);

  useEffect(() => {
    setSelectedImageIndex(0);
    setIsLightboxOpen(false);
    setIsZoomedIn(false);
    if (watch?.brand) {
      try {
        const brandSlug = watch.brand.toLowerCase().trim().replace(/\s+/g, '-');
        sessionStorage.setItem('rpa_last_viewed_brand', brandSlug);
      } catch {}
    }
  }, [watch]);

  // Lock background body scroll completely while modal is open (Bulletproof for iOS & Desktop)
  useEffect(() => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyLeft = document.body.style.left;
    const originalBodyRight = document.body.style.right;
    const originalBodyWidth = document.body.style.width;
    const originalBodyPaddingRight = document.body.style.paddingRight;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Prevent horizontal content shift on desktop by preserving scrollbar width
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.left = originalBodyLeft;
      document.body.style.right = originalBodyRight;
      document.body.style.width = originalBodyWidth;
      document.body.style.paddingRight = originalBodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Keyboard navigation & escape handling (Without disturbance to modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
          setIsZoomedIn(false);
        } else if (onClose) {
          onClose();
        }
      } else if (isLightboxOpen && allImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
          setIsZoomedIn(false);
        } else if (e.key === 'ArrowRight') {
          setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
          setIsZoomedIn(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, onClose, allImages.length]);

  const handleMouseMove = (e) => {
    if (!isZoomedIn) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPosition({ x, y });
  };

  const rawGender = watch?.gender || getWatchGender(watch);
  const gender = rawGender === 'Woman' ? 'Women' : (rawGender || 'Unisex');
  const isOutOfStock = watch.inStock === false;

  const outOfStockWaMessage = `Hello Ram Prasad Agencies,

My name is ${userName || '[Your Name]'}. I am inquiring about the ${watch.brand || ''} "${watch.name}" which is currently listed as Out of Stock.

Could you please confirm if this timepiece can be specially sourced or when a new unit will arrive at your Gorakhpur showrooms?

Phone: ${userPhone || '[Your Phone]'}
Email: ${userEmail || '[Your Email]'}
Thank you!`;

  const waUrl = isOutOfStock
    ? getWhatsAppLink(contactPhone, outOfStockWaMessage)
    : getWhatsAppLink(
        contactPhone,
        watch,
        watch.storeLocation || 'Golghar showrooms',
        { name: userName, phone: userPhone, email: userEmail }
      );

  const cleanPhone = (contactPhone || '9876543210').replace(/[^0-9]/g, '');

  const formattedPrice =
    watch.price && Number(watch.price) > 0 && !watch.hidePrice
      ? `₹${Number(watch.price).toLocaleString('en-IN')}`
      : 'Price Upon Request';
  const formattedOriginalPrice =
    !watch.hidePrice && watch.originalPrice && watch.originalPrice > watch.price
      ? `₹${Number(watch.originalPrice).toLocaleString('en-IN')}`
      : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in cursor-pointer overscroll-contain select-none"
      style={{ touchAction: 'none' }}
    >
      <div
        className="relative w-full max-w-2xl lg:max-w-3xl mx-auto rounded-2xl bg-[#FAF7F2] border border-[#DDD5C7] shadow-2xl flex flex-col sm:flex-row overflow-hidden max-h-[92vh] sm:max-h-[500px] md:max-h-[540px] cursor-default overscroll-contain"
        onClick={(e) => e.stopPropagation()}
        style={{ touchAction: 'auto' }}
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

        {/* Left: Product Image Stage & Multi-Image Gallery */}
        <div className="w-full sm:w-[42%] md:w-[40%] bg-gradient-to-b from-[#F7F2E9] to-[#EFE7D8] border-b sm:border-b-0 sm:border-r border-[#E5DEC9] p-3 sm:p-4 flex flex-col items-center justify-between relative shrink-0 min-h-[220px] sm:min-h-0 overflow-hidden">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-radial from-white/80 via-transparent to-transparent pointer-events-none" />

          {/* Top Badges (Gender & Stock) */}
          <div className="relative z-10 w-full flex items-center justify-between gap-1.5 pointer-events-none pr-9 sm:pr-0">
            {/* Gender Badge */}
            <span className="px-2 py-0.5 rounded-md text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-white/20 shadow-2xs pointer-events-auto">
              {gender}
            </span>

            {/* Stock Availability Pill */}
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider border shadow-2xs pointer-events-auto ${
                !isOutOfStock
                  ? 'bg-white/95 text-emerald-800 border-emerald-300'
                  : 'bg-rose-900/90 text-rose-100 border-rose-400'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  !isOutOfStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                }`}
              ></span>
              <span>{!isOutOfStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>

          {/* Center Image Display with Click to Zoom */}
          <div
            onClick={() => setIsLightboxOpen(true)}
            className="relative z-0 flex-1 w-full flex flex-col items-center justify-center p-1 min-h-[140px] sm:min-h-[160px] cursor-zoom-in group/zoomstage"
            title="Click to Zoom & Inspect All Photos"
          >
            <div className="relative">
              <img
                src={fullImage}
                alt={watch.name}
                className={`w-auto h-full max-h-[160px] sm:max-h-[200px] md:max-h-[250px] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover/zoomstage:scale-105 ${
                  isOutOfStock ? 'opacity-85' : ''
                }`}
                onError={(e) => {
                  e.target.src = '/images/brands/default.webp';
                }}
              />
              <span className="absolute bottom-1 right-1 p-1 rounded-md bg-white/90 text-stone-700 opacity-70 group-hover/zoomstage:opacity-100 group-hover/zoomstage:bg-brass-700 group-hover/zoomstage:text-white transition-all shadow-xs backdrop-blur-xs">
                <ZoomIn className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="text-[8.5px] text-[#7C746B] mt-1 opacity-80 group-hover/zoomstage:text-brass-800 flex items-center gap-1">
              <span>Click to inspect & zoom</span>
            </span>
          </div>

          {/* Multi-Image Switcher Gallery (Additional Photos) */}
          {allImages.length > 1 && (
            <div className="relative z-10 w-full flex items-center justify-center gap-1.5 pt-1.5 border-t border-[#E5DEC9]/80 overflow-x-auto pb-0.5">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border p-0.5 bg-white transition-all overflow-hidden shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-brass-600 ring-2 ring-brass-600/30 scale-105 shadow-sm'
                      : 'border-[#DDD5C7] opacity-60 hover:opacity-100'
                  }`}
                  title={`View Angle #${idx + 1}`}
                >
                  <img
                    src={getFullImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/images/brands/default.webp';
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Bottom Collection Ribbon Badge */}
          {watch.badge && (
            <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-[#1A1A1A]/85 text-amber-300 backdrop-blur-sm border border-white/10 pointer-events-none">
              {watch.badge}
            </div>
          )}
        </div>

        {/* Right: Specifications & Direct Concierge */}
        <div
          className="w-full sm:w-[58%] md:w-[60%] p-3.5 sm:p-4 md:p-5 flex flex-col justify-between overflow-y-auto space-y-2.5 sm:space-y-3 overscroll-contain"
          style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
        >
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

            <h2 className="font-serif text-sm sm:text-base md:text-lg font-bold text-[#111111] leading-snug mt-0.5 line-clamp-2">
              {watch.name}
            </h2>

            {/* Price Display Row */}
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-base sm:text-lg font-extrabold text-stone-900">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-xs font-serif text-stone-400 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Showroom Status & Warranty Row */}
            <div className="flex items-center justify-between gap-2 mt-1 pb-1.5 border-b border-[#E8E1D5]">
              <span className="text-xs sm:text-sm font-serif font-bold text-brass-900 tracking-tight flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    !isOutOfStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                ></span>
                {!isOutOfStock ? 'Official Authorized Stock' : 'Showroom Sourcing Reference'}
              </span>
              <span className="text-[8.5px] sm:text-[9px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Official Warranty
              </span>
            </div>
          </div>

          {/* Out of Stock Notice Banner */}
          {isOutOfStock && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] sm:text-[10.5px] font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Currently Out of Stock • Direct Showroom Sourcing Available on Request</span>
            </div>
          )}

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

          {/* 3. Description */}
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
            <button
              type="button"
              onClick={() => {
                openWhatsApp({
                  phone: contactPhone,
                  message: isOutOfStock ? outOfStockWaMessage : null,
                  watch: isOutOfStock ? null : watch,
                  storeName: watch.storeLocation || 'Golghar showrooms',
                  purpose: 'watch_inquiry',
                  title: `Inquire about ${watch.brand ? watch.brand + ' ' : ''}${watch.name}`,
                  subtitle: `Enter your name to connect with our horologists regarding this ${watch.brand || 'luxury'} timepiece`,
                });
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-2.5 px-3 rounded-lg text-[10.5px] sm:text-xs uppercase tracking-wider font-bold text-white shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                !isOutOfStock
                  ? 'bg-[#25D366] hover:bg-[#20ba59] shadow-[#25D366]/20'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/20'
              }`}
            >
              <OriginalWhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" size={16} />
              <span>{!isOutOfStock ? 'Inquire WhatsApp' : 'Inquire Restock / Waitlist'}</span>
            </button>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-1 py-2.5 sm:py-2.5 px-3 rounded-lg text-[10.5px] sm:text-xs font-bold text-[#1A1A1A] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] shadow-2xs transition-all active:scale-[0.98] shrink-0"
              title="Call Showroom"
            >
              <Phone className="w-3 h-3 text-brass-700" />
              <span>Call Store</span>
            </a>
          </div>
        </div>
      </div>

      {/* High-Resolution Macro Zoom Lightbox (Zero Disturbance to Specification Modal) */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex flex-col justify-between p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fade-in text-white select-none cursor-default overscroll-contain"
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(false);
            setIsZoomedIn(false);
          }}
        >
          {/* Top Bar: Brand, Model, Multi-Photo Counter & Actions */}
          <div
            className="flex items-center justify-between gap-3 w-full max-w-5xl mx-auto pb-3 border-b border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 truncate">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full shrink-0">
                {watch.brand || 'Horology'}
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-white truncate">
                {watch.name}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {allImages.length > 1 && (
                <span className="text-xs font-mono text-stone-300 px-2.5 py-1 rounded bg-white/10 border border-white/10">
                  Photo {selectedImageIndex + 1} of {allImages.length}
                </span>
              )}

              {/* Zoom In/Out Toggle Button */}
              <button
                type="button"
                onClick={() => setIsZoomedIn((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                  isZoomedIn
                    ? 'bg-amber-400 text-stone-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title={isZoomedIn ? 'Zoom Out (Click to toggle)' : 'Zoom In 2.4x (Click to toggle)'}
              >
                {isZoomedIn ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isZoomedIn ? 'Zoom Out' : 'Zoom 2.4x'}</span>
              </button>

              {/* Close Zoom Viewer (Returns straight to specs) */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setIsZoomedIn(false);
                }}
                className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-all cursor-pointer border border-white/15"
                title="Back to Specifications (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage: Interactive Panning Loupe & Navigation Arrows */}
          <div
            className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden my-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Nav Arrow (If multiple images) */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                  setIsZoomedIn(false);
                }}
                className="absolute left-2 sm:left-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Previous Image (← Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Interactive Image Container with Mouse-Track Zoom Pan */}
            <div
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomedIn((prev) => !prev)}
              className={`relative max-w-full max-h-[66vh] sm:max-h-[72vh] flex items-center justify-center overflow-hidden rounded-2xl ${
                isZoomedIn ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
            >
              <img
                src={fullImage}
                alt={watch.name}
                style={
                  isZoomedIn
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        transform: 'scale(2.4)',
                      }
                    : { transform: 'scale(1)' }
                }
                className="w-auto h-auto max-w-full max-h-[66vh] sm:max-h-[72vh] object-contain transition-transform duration-200 ease-out select-none"
                onError={(e) => {
                  e.target.src = '/images/brands/default.webp';
                }}
              />
            </div>

            {/* Right Nav Arrow (If multiple images) */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                  setIsZoomedIn(false);
                }}
                className="absolute right-2 sm:right-4 z-20 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
                title="Next Image (→ Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Instructions & Multi-Photo Thumbnails */}
          <div
            className="w-full max-w-5xl mx-auto pt-3 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Help Hint */}
            <p className="text-stone-400 text-[11px] sm:text-xs text-center sm:text-left flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>
                {isZoomedIn
                  ? 'Move cursor to pan across dial, hands & bezel • Click to zoom out'
                  : 'Click anywhere on photo to zoom in for high-definition macro inspection (2.4x)'}
              </span>
            </p>

            {/* Thumbnail Strip (If multiple pictures exist for this watch) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setIsZoomedIn(false);
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg p-0.5 bg-stone-900 border transition-all overflow-hidden shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                    title={`View Angle #${idx + 1}`}
                  >
                    <img
                      src={getFullImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = '/images/brands/default.webp';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
