import React, { useState, useRef, useEffect } from 'react';
import BrandLogo from './BrandLogo';

/**
 * Custom hook to measure container dimensions accurately across resizing.
 */
function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateWidth = () => {
      if (ref.current) {
        const measured = ref.current.getBoundingClientRect().width;
        if (measured > 0) {
          setWidth(measured);
        }
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(ref.current);
    window.addEventListener('resize', updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return [ref, width];
}

/**
 * Laptop Device Mockup (Landscape Desktop View)
 * Logical Desktop Viewport: 1280 × 800 (16:10 aspect ratio)
 */
export function LaptopPreview({ url, className = '' }) {
  const [containerRef, width] = useElementWidth();
  const [loaded, setLoaded] = useState(false);

  // Logical desktop viewport dimensions
  const LOGICAL_WIDTH = 1280;
  const LOGICAL_HEIGHT = 800;
  const scale = width > 0 ? width / LOGICAL_WIDTH : 0.25;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Laptop Screen Lid */}
      <div className="w-full bg-[#181A1E] border-[2px] sm:border-[3px] border-[#2B3038] rounded-t-xl sm:rounded-t-2xl p-[3px] sm:p-1.5 shadow-2xl relative">
        {/* Inner Screen Bezel with 16:10 aspect ratio */}
        <div
          ref={containerRef}
          className="w-full aspect-[16/10] bg-[#FAF7F2] rounded-t-md sm:rounded-t-lg overflow-hidden relative shadow-inner"
        >
          {/* Subtle loading placeholder */}
          {!loaded && (
            <div className="absolute inset-0 bg-[#F4EDE2] flex flex-col items-center justify-center p-2 z-10 animate-pulse">
              <BrandLogo className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
              <span className="text-[9px] sm:text-[10px] font-serif font-bold text-[#6A6158] uppercase tracking-wider">
                Loading Desktop View...
              </span>
            </div>
          )}

          {/* Scaled Iframe Container */}
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              width: `${LOGICAL_WIDTH}px`,
              height: `${LOGICAL_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            <iframe
              src={url}
              title="Ram Prasad Agencies — Desktop Preview"
              aria-hidden="true"
              tabIndex="-1"
              onLoad={() => setLoaded(true)}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Laptop Keyboard Base / Aluminum Deck */}
      <div className="w-[108%] h-2 sm:h-3 bg-gradient-to-b from-[#343840] via-[#24272D] to-[#16181B] rounded-b-md sm:rounded-b-lg shadow-lg relative flex items-center justify-center -mt-[1px]">
        {/* Opening Thumb Notch */}
        <div className="w-8 sm:w-14 h-0.5 sm:h-1 bg-[#101214] rounded-b-sm border-t border-[#464B55]/40" />
      </div>
      {/* Table Shadow */}
      <div className="w-[96%] h-1 sm:h-1.5 bg-black/20 rounded-full blur-[2px] -mt-0.5" />
    </div>
  );
}

/**
 * Phone Device Mockup (Portrait Mobile View)
 * Generic, Notch-Free Design:
 * - NO notch, NO dynamic island, NO camera cutouts covering the website.
 * Logical Mobile Viewport: 375 × 667 (9:16 standard mobile viewport)
 */
export function PhonePreview({ url, className = '' }) {
  const [containerRef, width] = useElementWidth();
  const [loaded, setLoaded] = useState(false);

  // Logical mobile viewport dimensions
  const LOGICAL_WIDTH = 375;
  const LOGICAL_HEIGHT = 667;
  const scale = width > 0 ? width / LOGICAL_WIDTH : 0.25;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Generic Notch-Free Phone Frame */}
      <div className="w-full bg-[#16181C] border-[2.5px] sm:border-[3.5px] border-[#2E333C] rounded-[18px] sm:rounded-[24px] p-[2px] sm:p-[3px] shadow-2xl relative">
        {/* Inner Screen with 375:667 aspect ratio */}
        <div
          ref={containerRef}
          className="w-full aspect-[375/667] bg-[#FAF7F2] rounded-[14px] sm:rounded-[20px] overflow-hidden relative shadow-inner"
        >
          {/* Subtle loading placeholder */}
          {!loaded && (
            <div className="absolute inset-0 bg-[#F4EDE2] flex flex-col items-center justify-center p-2 z-10 animate-pulse">
              <BrandLogo className="w-5 h-5 sm:w-7 sm:h-7 mb-1" />
              <span className="text-[8px] sm:text-[9px] font-serif font-bold text-[#6A6158] uppercase tracking-wider">
                Mobile View
              </span>
            </div>
          )}

          {/* Scaled Iframe Container */}
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{
              width: `${LOGICAL_WIDTH}px`,
              height: `${LOGICAL_HEIGHT}px`,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          >
            <iframe
              src={url}
              title="Ram Prasad Agencies — Mobile Preview"
              aria-hidden="true"
              tabIndex="-1"
              onLoad={() => setLoaded(true)}
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
      {/* Table Shadow */}
      <div className="w-[85%] h-1 sm:h-1.5 bg-black/25 rounded-full blur-[2px] mt-1" />
    </div>
  );
}
