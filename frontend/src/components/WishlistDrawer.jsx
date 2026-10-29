import React from 'react';
import { X, Heart, MessageCircle, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { getFullImageUrl, getWhatsAppLink, getStoredCustomerProfile } from '../utils/api';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  onRemoveFromWishlist,
  contactPhone,
  onSelectWatch,
}) {
  if (!isOpen) return null;

  // Build combined WhatsApp inquiry in polite paragraph format with Name, Phone, and Email
  const profile = getStoredCustomerProfile() || {};
  const customerName = profile.name?.trim() || '[Your Name]';
  const customerPhone = profile.phone?.trim() || '[Your Phone Number]';
  const customerEmail = profile.email?.trim() || '[Your Email ID]';

  const names = wishlist.map((w) => `• ${w.brand} ${w.name}`).join('\n');
  const multiWaMessage = `Hello Ram Prasad Agencies,

My name is ${customerName}. I have shortlisted the following timepieces and would like to inquire about their pricing and showroom availability at your Golghar showrooms:

${names}

You can reach me at ${customerPhone} or ${customerEmail}. Looking forward to your guidance on showroom pricing and private viewing. Thank you!`;

  const cleanPhone = (contactPhone || '9876543210').replace(/[^0-9]/g, '');
  const multiWaUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(multiWaMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#DDD5C7] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#E8E1D5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brass-500/15 text-brass-700 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-brass-600" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">Your Saved Timepieces</h3>
                <p className="text-[11px] sm:text-xs text-[#6B635B]">{wishlist.length} item(s) in wishlist</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#6B635B] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F2ECE1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Items */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3 sm:space-y-4">
            {wishlist.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#DDD5C7] flex items-center justify-center mx-auto text-[#8C847A] shadow-sm">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Your wishlist is empty</h4>
                <p className="text-xs text-[#6B635B] max-w-xs mx-auto">
                  Click the heart icon on any watch in our catalog to save it for immediate WhatsApp inquiry or showroom viewing.
                </p>
              </div>
            ) : (
              wishlist.map((watch) => {
                const img = getFullImageUrl(watch.image);
                const singleWa = getWhatsAppLink(contactPhone, watch, watch.storeLocation || 'Golghar stores');

                return (
                  <div
                    key={watch._id || watch.id}
                    onClick={() => onSelectWatch && onSelectWatch(watch)}
                    className="p-3.5 rounded-2xl bg-white border border-[#E5DFD5] hover:border-brass-600/40 flex items-center gap-4 group shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={watch.name}
                      className="w-16 h-16 object-contain rounded-xl bg-[#F8F5EE] p-2 shrink-0 border border-[#EBE4D8]"
                      onError={(e) => {
                        e.target.src = '/images/brands/default.webp';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-brass-800 font-mono tracking-wider">
                        {watch.brand}
                      </span>
                      <h4 className="text-xs font-bold text-[#1A1A1A] truncate mt-0.5 group-hover:text-brass-800 transition-colors">
                        {watch.name}
                      </h4>
                      <p className="text-[10px] text-brass-700 font-semibold mt-1">
                        View Specs & Inquire →
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => onRemoveFromWishlist(watch._id)}
                        className="p-1.5 text-[#8C847A] hover:text-red-600 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a
                        href={singleWa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                        title="Inquire on WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Multi-Inquiry Action */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#E8E1D5] bg-[#F5F2EB] space-y-3">
              <a
                href={multiWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire Shortlist ({wishlist.length}) on WhatsApp</span>
              </a>
              <button
                onClick={onClose}
                className="w-full text-center text-xs text-[#6B635B] hover:text-[#1A1A1A] transition-colors"
              >
                Continue Browsing Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
