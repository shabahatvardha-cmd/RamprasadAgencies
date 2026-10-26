import React, { useEffect } from 'react';
import { X, MessageCircle, Phone, MapPin, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink } from '../utils/api';

export default function WatchModal({ watch, onClose, contactPhone }) {
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
  const waUrl = getWhatsAppLink(contactPhone, watch, watch.storeLocation || 'Golghar showrooms');
  const cleanPhone = (contactPhone || '9876543210').replace(/[^0-9]/g, '');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in cursor-pointer"
    >
      <div
        className="relative w-full max-w-3xl mx-auto rounded-2xl sm:rounded-3xl bg-[#FAF7F2] border border-[#DDD5C7] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-y-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-[#3D3731] hover:text-[#1A1A1A] border border-[#DDD5C7] shadow-sm transition-colors"
          title="Close"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#F8F5EE] border-b md:border-b-0 md:border-r border-[#EBE4D8] p-4 sm:p-8 flex items-center justify-center relative shrink-0">
          <img
            src={fullImage}
            alt={watch.name}
            className="max-h-48 sm:max-h-80 md:max-h-96 w-auto object-contain drop-shadow-xl"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1670404160620-a3a86428560e?auto=format&fit=crop&w=600&q=80';
            }}
          />
          {watch.inStock !== false ? (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              In Stock at Gorakhpur
            </span>
          ) : (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 shadow-sm">
              Special Order
            </span>
          )}
        </div>

        {/* Right: Specifications & Inquiries */}
        <div className="md:w-1/2 p-4 sm:p-8 flex flex-col justify-between space-y-4 sm:space-y-6 bg-[#FAF7F2]">
          <div className="space-y-3">
            <span className="text-xs uppercase font-serif tracking-widest font-bold text-brass-800">
              {watch.brand}
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] leading-snug">
              {watch.name}
            </h2>

            <div className="flex items-center justify-between pt-1 pb-1 border-b border-[#E8E1D5]">
              <div>
                <span className="text-2xl font-serif font-bold text-brass-900 block">
                  Price Upon Request
                </span>
                <span className="text-xs text-[#6B635B]">Official Agency Stamped Papers & Full Warranty</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Inquire Agency
              </span>
            </div>

            {/* Horology Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-white border border-[#E5DFD5] shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B635B]">Movement</span>
                <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{watch.movement || watch.category || 'Mechanical / Quartz'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E5DFD5] shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B635B]">Case Diameter</span>
                <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{watch.caseDiameter || watch.caseSize || '40mm'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E5DFD5] shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B635B]">Water Resistance</span>
                <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{watch.waterResistance || '50m / 5 Bar'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#E5DFD5] shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B635B]">Bracelet / Strap</span>
                <p className="text-xs font-semibold text-[#1A1A1A] mt-0.5">{watch.strapType || watch.strap || 'Stainless Steel / Leather'}</p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B635B]">
                Overview & Heritage
              </span>
              <p className="text-xs text-[#3D3731] mt-1 leading-relaxed">
                {watch.description ||
                  'Authentic imported timepiece with official international manufacturer warranty. Available for in-person inspection and complimentary sizing at Ram Prasad Agencies.'}
              </p>
            </div>

            {/* Location Notice */}
            <div className="p-3.5 rounded-xl bg-white border border-brass-600/30 text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-brass-800 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-brass-700 shrink-0" />
                <span>Showroom Location</span>
              </div>
              <p className="text-[#3D3731]">
                {watch.storeLocation || 'Baldev Plaza & JalKal Building, Golghar, Gorakhpur'}
              </p>
              <p className="text-[11px] text-[#6B635B] flex items-center gap-1">
                <Clock className="w-3 h-3 text-brass-700" />
                Timings: 10:30 AM – 9:00 PM (All 7 Days)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#E8E1D5]">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-lg transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire Price & Book Private Fitting</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#2C2723] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] hover:border-brass-600/40 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-brass-700" />
              <span>Call Showroom Concierge ({contactPhone || '+91 98765 43210'})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

