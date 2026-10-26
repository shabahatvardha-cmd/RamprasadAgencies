import React from 'react';
import { Sparkles } from 'lucide-react';

const IMPORTED_BRANDS = [
  { name: 'Titan', country: 'India', desc: 'Edge, Octane & Regalia Flagships' },
  { name: 'HMT', country: 'India', desc: 'Kohinoor & Janata Mechanical Heritage' },
  { name: 'Fastrack', country: 'India', desc: 'Youth Sport & Street Chronographs' },
  { name: 'Sonata', country: 'India', desc: 'Everyday Reliable Indian Horology' },
  { name: 'Tissot', country: 'Swiss', desc: 'PRX & Heritage Swiss Precision' },
  { name: 'Rolex', country: 'Swiss', desc: 'Certified Swiss Luxury Imports' },
  { name: 'Omega', country: 'Swiss', desc: 'Moonwatch & Co-Axial Chronometers' },
  { name: 'Seiko', country: 'Japan', desc: 'Automatic & Presage Craft' },
  { name: 'Citizen', country: 'Japan', desc: 'Tsuyosa & Eco-Drive Calibers' },
  { name: 'Breitling', country: 'Swiss', desc: 'Navitimer Aviation Chronographs' },
  { name: 'Fossil', country: 'USA', desc: 'Heritage Automatics & Vintage Styling' },
  { name: 'Rado', country: 'Swiss', desc: 'Master of High-Tech Ceramic' },
];

export default function BrandMarquee({ selectedBrand, onSelectBrand, brands }) {
  const brandList = (brands && Array.isArray(brands) && brands.length > 0) ? brands : IMPORTED_BRANDS;

  return (
    <section id="brands" className="py-8 sm:py-12 border-y border-[#E8E1D5] bg-[#F6F2EB] overflow-hidden">
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-brass-800 font-mono">
              The Maison Portfolio
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-0.5 sm:mt-1">
              Indian Heritage & Global Watch Maisons
            </h3>
          </div>
          <p className="text-xs text-[#6B635B] max-w-md">
            Click any brand to filter timepieces currently in stock across our Baldev Plaza and JalKal Building showrooms.
          </p>
        </div>
      </div>

      {/* Interactive Brand Grid / Pills */}
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {brandList.map((b) => {
            const isSelected = selectedBrand?.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                key={b.name}
                onClick={() => onSelectBrand && onSelectBrand(isSelected ? 'ALL' : b.name)}
                className={`p-3 sm:p-4 rounded-xl text-left border transition-all duration-300 ${
                  isSelected
                    ? 'bg-brass-500/15 border-brass-600 shadow-md'
                    : 'bg-white border-[#DDD5C7] hover:border-brass-600 hover:bg-[#FAF8F5] shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-brass-800 uppercase font-bold">
                    {b.country}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brass-700"></span>
                  )}
                </div>
                <h4 className="font-serif text-sm sm:text-lg font-bold text-[#1A1A1A] mt-0.5 sm:mt-1 tracking-wide truncate">
                  {b.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#6B635B] line-clamp-1 mt-0.5">
                  {b.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
