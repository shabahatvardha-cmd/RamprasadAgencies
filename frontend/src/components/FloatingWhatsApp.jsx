import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getWhatsAppLink } from '../utils/api';

export default function FloatingWhatsApp({ contactPhone }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const waLink = getWhatsAppLink(contactPhone, null);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 animate-fade-in">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden md:flex items-center gap-2 p-3 rounded-2xl bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] shadow-xl backdrop-blur-md max-w-xs">
          <div>
            <p className="font-semibold text-brass-800">Live Showroom Concierge</p>
            <p className="text-[11px] text-[#6B635B]">Inquire about watch stock at Baldev Plaza & JalKal Building</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#8C847A] hover:text-[#1A1A1A] p-1"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-700/30 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-emerald-400/40"
        aria-label="Chat on WhatsApp with Ram Prasad Agencies"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-400 border-2 border-white"></span>
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </div>
  );
}
