import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Sparkles, MessageCircle, Send, ArrowRight } from 'lucide-react';
import { PREVIEW_CONFIG } from '../utils/previewConfig';
import { LaptopPreview, PhonePreview } from './DevicePreview';
import { OriginalWhatsAppIcon } from './FloatingWhatsApp';

export default function WebsitePreviewModal() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Scroll & trigger refs
  const isArmed = useRef(true);
  const lastScrollY = useRef(0);
  const hasUserScrolledDown = useRef(false);
  const modalOpenRef = useRef(false);

  // Sync ref with state
  modalOpenRef.current = isOpen;

  // Determine if this instance is inside an iframe preview
  const isInsidePreviewFrame =
    (typeof window !== 'undefined' && window.self !== window.top) ||
    new URLSearchParams(location.search).get('preview') === '1';

  // Construct current preview URL for the mockups
  const previewUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '/';
    const params = new URLSearchParams(location.search);
    params.set('preview', '1');
    return `${location.pathname}?${params.toString()}${location.hash || ''}`;
  }, [location.pathname, location.search, location.hash]);

  // Close handler: disarms until visitor scrolls up away from the footer
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Keep isArmed false so it doesn't immediately reopen while still at the footer
    isArmed.current = false;
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock background page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Route change reset: on route change, close modal and re-arm trigger for new page
  useEffect(() => {
    setIsOpen(false);
    isArmed.current = true;
    hasUserScrolledDown.current = false;
    lastScrollY.current = window.scrollY || window.pageYOffset || 0;
  }, [location.pathname]);

  // Footer scroll trigger observer & direction tracking
  useEffect(() => {
    if (isInsidePreviewFrame) return;

    let ticking = false;

    const checkFooterTrigger = () => {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingDown) {
        hasUserScrolledDown.current = true;
      }

      // Find the footer element
      const footer =
        document.getElementById('website-footer') ||
        document.querySelector('footer');

      if (footer) {
        const rect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // Footer is completely out of view below the viewport
        const isFooterBelowViewport = rect.top > viewportHeight;

        // Visitor has scrolled upward enough that footer completely leaves the trigger area -> re-arm!
        if (isFooterBelowViewport) {
          isArmed.current = true;
        }

        // Footer starts entering the visible screen
        const isFooterEntering = rect.top <= viewportHeight && rect.bottom > 0;

        // Trigger condition:
        // 1. Footer is entering the viewport
        // 2. Visitor is scrolling downwards (and has moved down)
        // 3. Trigger is armed
        // 4. Modal is not currently open
        if (
          isFooterEntering &&
          isScrollingDown &&
          hasUserScrolledDown.current &&
          isArmed.current &&
          !modalOpenRef.current
        ) {
          setIsOpen(true);
          isArmed.current = false;
        }
      }

      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkFooterTrigger);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isInsidePreviewFrame]);

  // If inside preview iframe, suppress rendering
  if (isInsidePreviewFrame || !isOpen) {
    return null;
  }

  const primaryMessage = PREVIEW_CONFIG.getProceedingMessage(PREVIEW_CONFIG.projectName);
  const secondaryMessage = PREVIEW_CONFIG.getChangesMessage(PREVIEW_CONFIG.projectName);
  const primaryWhatsAppUrl = PREVIEW_CONFIG.getWhatsAppUrl(primaryMessage);
  const secondaryWhatsAppUrl = PREVIEW_CONFIG.getWhatsAppUrl(secondaryMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="website-preview-title"
      aria-describedby="website-preview-desc"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
    >
      {/* Modal Dialog Content Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] md:max-w-4xl lg:max-w-5xl max-h-[96dvh] md:max-h-[90vh] bg-[#FAF7F2] border border-[#DDD5C7] rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col text-[#1A1A1A]"
      >
        {/* ========================================================================= */}
        {/* MOBILE LAYOUT (< 768px): All elements visible together without scrolling  */}
        {/* ========================================================================= */}
        <div className="flex md:hidden flex-col p-3 space-y-2 text-left">
          {/* 1. Compact Header & Close Button */}
          <div className="flex items-center justify-between pb-1 border-b border-[#E7DFD3]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-600 animate-ping" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-brass-700">
                WEBSITE PREVIEW
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close website preview modal"
              className="w-6 h-6 rounded-full bg-white border border-[#DDD5C7] text-[#5A524A] hover:text-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Device Previews Side-by-Side (Directly Below Header) */}
          <div className="w-full bg-gradient-to-b from-[#F2ECE1] to-[#E9E1D2] border border-[#D5C9B7] rounded-xl p-2 shadow-inner">
            <div className="flex items-end justify-center gap-2 max-w-[340px] mx-auto">
              {/* Laptop Preview (Landscape) */}
              <div className="w-[62%]">
                <LaptopPreview url={previewUrl} />
              </div>
              {/* Generic Notch-Free Phone Preview (Portrait) */}
              <div className="w-[28%] -mb-0.5">
                <PhonePreview url={previewUrl} />
              </div>
            </div>
          </div>

          {/* 3. Concise Headline & Supporting Text */}
          <div className="space-y-0.5">
            <h2
              id="website-preview-title"
              className="font-serif text-sm sm:text-base font-bold text-[#1A1A1A] leading-tight"
            >
              Your Website Is Ready for the Next Step
            </h2>
            <p
              id="website-preview-desc"
              className="text-[11px] text-[#5A524A] leading-tight"
            >
              You’ve reviewed the frontend preview. Let’s discuss the next phase of development.
            </p>
          </div>

          {/* 4. Booking Deposit Information Card */}
          <div className="bg-gradient-to-br from-[#FDFBF7] via-[#F4ECE0] to-[#E8DCB8]/50 border border-[#D5C4AA] rounded-xl p-2 shadow-xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-brass-800">
                RESERVE YOUR PROJECT
              </span>
              <span className="text-[9px] font-bold text-brass-700 bg-brass-100/80 px-1.5 py-0.5 rounded">
                Kickoff Deposit
              </span>
            </div>
            <div className="text-xs font-bold text-[#1A1A1A] pt-0.5">
              50% of the agreed project fee
            </div>
            <p className="text-[10px] text-[#6A6158] leading-tight pt-0.5">
              Applied toward the total project cost; the remaining balance follows the agreed proposal.
            </p>
          </div>

          {/* 5. Two WhatsApp Action Buttons */}
          <div className="space-y-1.5 pt-0.5">
            {/* Primary Action */}
            <a
              href={primaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#25D366]/25 transition-all duration-200 active:scale-95"
            >
              <OriginalWhatsAppIcon className="w-4 h-4 shrink-0" size={16} />
              <span>Discuss on WhatsApp</span>
            </a>

            {/* Secondary Action */}
            <a
              href={secondaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#DDD5C7] text-[#4A423B] hover:text-[#1A1A1A] text-[11px] font-semibold transition-all duration-200 active:scale-95"
            >
              <span>I’d like to request a few changes</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (>= 768px): Balanced 2-Column Grid                        */}
        {/* ========================================================================= */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 items-center p-6 lg:p-8">
          {/* Close Button Top Right */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close website preview modal"
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white border border-[#DDD5C7] text-[#5A524A] hover:text-[#1A1A1A] hover:bg-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Column: Device Mockups Showcase */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center">
            <div className="bg-gradient-to-b from-[#F2ECE1] to-[#E9E1D2] border border-[#D5C9B7] rounded-2xl p-4 lg:p-6 shadow-inner relative flex items-end justify-center min-h-[340px]">
              {/* Laptop Mockup (Landscape) */}
              <div className="w-[78%] max-w-[420px] transition-transform duration-300 hover:scale-[1.01]">
                <LaptopPreview url={previewUrl} />
              </div>

              {/* Phone Mockup (Portrait, generic notch-free) */}
              <div className="w-[30%] max-w-[130px] lg:max-w-[145px] -ml-8 lg:-ml-10 z-10 -mb-1 shadow-2xl transition-transform duration-300 hover:scale-105">
                <PhonePreview url={previewUrl} />
              </div>
            </div>
            <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-[#7A7167]">
              <span>Real-time Interactive Desktop & Mobile Previews</span>
              <span className="font-semibold">{PREVIEW_CONFIG.projectName}</span>
            </div>
          </div>

          {/* Right Column: Copy, Payment Terms & WhatsApp Actions */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-between space-y-4 text-left">
            {/* Header Badge & Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brass-500/15 border border-brass-600/30 text-brass-800 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-brass-600" />
                <span>WEBSITE PREVIEW</span>
              </div>
              <h2
                className="font-serif text-2xl lg:text-3xl font-bold text-[#1A1A1A] leading-tight"
              >
                Your Website Is Ready for the Next Step
              </h2>
              <p className="text-xs lg:text-[13px] text-[#5A524A] leading-relaxed">
                You’ve reviewed the frontend preview. Let’s discuss the next phase of development.
              </p>
            </div>

            {/* Booking Payment Card */}
            <div className="p-4 lg:p-4.5 rounded-2xl bg-gradient-to-br from-[#FDFBF7] via-[#F4ECE0] to-[#E8DCB8]/50 border border-[#D5C4AA] shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b border-[#D5C4AA]/50 pb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brass-800">
                  RESERVE YOUR PROJECT
                </span>
                <span className="text-[10px] font-bold text-brass-700">
                  Kickoff Booking Deposit
                </span>
              </div>

              <div className="text-base lg:text-lg font-bold text-[#1A1A1A] tracking-tight">
                50% of the agreed project fee
              </div>

              <p className="text-[11px] text-[#6A6158] leading-relaxed">
                Applied toward the total project cost; the remaining balance follows the agreed proposal.
              </p>
            </div>

            {/* Actions Grid */}
            <div className="space-y-2.5 pt-1">
              {/* Primary WhatsApp Action */}
              <a
                href={primaryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#25D366]/25 hover:shadow-xl transition-all duration-300 active:scale-95 group/btn"
              >
                <OriginalWhatsAppIcon className="w-4 h-4 shrink-0" size={18} />
                <span>Discuss on WhatsApp</span>
              </a>

              {/* Secondary WhatsApp Action */}
              <a
                href={secondaryWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#DDD5C7] hover:border-brass-600/50 text-[#4A423B] hover:text-[#1A1A1A] text-xs font-semibold transition-all duration-300 active:scale-95"
              >
                <span>I’d like to request a few changes</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
