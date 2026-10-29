import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getWhatsAppLink } from '../utils/api';

/**
 * Authentic Official WhatsApp Brand Vector Icon
 * Uses official WhatsApp brand colors: #25D366 (WhatsApp Green) and #FFFFFF (White)
 */
export function OriginalWhatsAppIcon({ className = "w-6 h-6", size = 24 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 4.5C7.88 4.5 4.5 7.88 4.5 12.04c0 1.33.35 2.62 1.01 3.76L4.5 19.5l3.8-1c1.1.6 2.34.92 3.74.92 4.16 0 7.54-3.38 7.54-7.54 0-2.02-.79-3.91-2.21-5.33A7.48 7.48 0 0 0 12.04 4.5zm4.41 10.37c-.18.51-.71.93-1.2.99-.32.05-.74.1-2.16-.49-1.81-.75-2.98-2.58-3.07-2.7-.09-.12-.73-.97-.73-1.84 0-.87.45-1.3.62-1.48.18-.19.39-.23.51-.23.13 0 .25 0 .36.01.14.01.25-.02.36.24.12.3.42 1.03.46 1.11.04.08.07.17.01.28-.06.11-.1.17-.18.26-.08.09-.16.16-.23.25-.08.09-.17.18-.08.35.1.17.44.73.95 1.18.65.58 1.19.78 1.37.86.18.08.28.07.39-.05.11-.12.45-.53.58-.7.12-.17.25-.15.41-.09.17.06 1.08.51 1.27.6.18.09.31.14.35.22.05.08.05.48-.14.99z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export default function FloatingWhatsApp({ contactPhone }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const waLink = getWhatsAppLink(contactPhone, null);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-end gap-3 animate-fade-in">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden md:flex items-center gap-3 p-3 rounded-2xl bg-white/95 hover:bg-white border border-[#DDD5C7] text-xs text-[#1A1A1A] shadow-2xl backdrop-blur-md max-w-sm group transition-all duration-200 hover:shadow-[#25D366]/15">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            {/* Original WhatsApp Icon */}
            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-md shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
              <OriginalWhatsAppIcon className="w-10 h-10" size={40} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0"></span>
                <p className="font-semibold text-brass-800 text-sm leading-tight">Live Showroom Concierge</p>
              </div>
              <p className="text-[11px] text-[#6B635B] mt-0.5 leading-snug">
                Inquire about watch stock at Baldev Plaza & JalKal Building
              </p>
            </div>
          </a>

          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#8C847A] hover:text-[#1A1A1A] p-1.5 rounded-full hover:bg-neutral-100 transition-colors self-start shrink-0 ml-1"
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
        className="relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/35 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/40"
        aria-label="Chat on WhatsApp with Ram Prasad Agencies"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#25D366] border-2 border-white shadow-sm"></span>
        <OriginalWhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9" size={36} />
      </a>
    </div>
  );
}
