import React, { useState } from 'react';

/**
 * BrandLogo component for Ram Prasad Agencies
 * Tries customSrc, then /logo.png, then /logo.jpg, then graceful initials fallback.
 */
export default function BrandLogo({
  className = 'w-9 h-9 sm:w-11 sm:h-11',
  customSrc,
  alt = 'Ram Prasad Agencies Logo',
}) {
  const [attemptIndex, setAttemptIndex] = useState(0);

  // Candidate sources in order of priority
  const candidates = [
    customSrc,
    '/logo.png',
    '/logo.jpg',
  ].filter(Boolean);

  const handleError = () => {
    setAttemptIndex((prev) => prev + 1);
  };

  // If all image candidates failed, render the luxury RPA initials block
  if (attemptIndex >= candidates.length) {
    return (
      <div
        className={`${className} rounded-xl bg-gradient-to-br from-brass-500 via-amber-600 to-amber-800 flex items-center justify-center shadow-md shadow-brass-500/20 border border-brass-400/40 shrink-0 select-none`}
        title="Ram Prasad Agencies"
      >
        <span className="font-serif text-white font-extrabold text-xs sm:text-sm tracking-wider">
          RPA
        </span>
      </div>
    );
  }

  const currentSrc = candidates[attemptIndex];

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={`${className} rounded-xl object-contain shadow-md border border-brass-400/40 bg-white p-0.5 shrink-0 transition-transform group-hover:scale-105`}
    />
  );
}
