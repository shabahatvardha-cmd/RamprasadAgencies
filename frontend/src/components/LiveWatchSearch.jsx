import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  ArrowRight,
  ArrowUpLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { getFullImageUrl } from '../utils/api';

const KNOWN_BRANDS = [
  { name: 'Titan', slug: 'titan' },
  { name: 'Titan Raga', slug: 'titan-raga' },
  { name: 'HMT', slug: 'hmt' },
  { name: 'Fastrack', slug: 'fastrack' },
  { name: 'Sonata', slug: 'sonata' },
  { name: 'Tissot', slug: 'tissot' },
  { name: 'Omega', slug: 'omega' },
  { name: 'Rado', slug: 'rado' },
  { name: 'Seiko', slug: 'seiko' },
  { name: 'Citizen', slug: 'citizen' },
  { name: 'Breitling', slug: 'breitling' },
  { name: 'Casio', slug: 'casio' },
  { name: 'Fossil', slug: 'fossil' },
  { name: 'Cartier', slug: 'cartier' },
  { name: 'TAG Heuer', slug: 'tag-heuer' },
];

export default function LiveWatchSearch({
  allWatches = [],
  onSelectWatch,
  placeholder = 'Search watches, brands, models (e.g. PRX, Speedmaster, Titan)...',
  className = '',
  isMobile = false,
  onCloseMobile,
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = useMemo(
    () => cleanQuery.split(/\s+/).filter(Boolean),
    [cleanQuery]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Check if query matches a known brand
  const matchedBrand = useMemo(() => {
    if (!cleanQuery || cleanQuery.length < 2) return null;
    return KNOWN_BRANDS.find(
      (b) =>
        b.name.toLowerCase() === cleanQuery ||
        cleanQuery.includes(b.name.toLowerCase()) ||
        b.name.toLowerCase().includes(cleanQuery)
    );
  }, [cleanQuery]);

  // 1. Smart Query Auto-Complete Suggestions (like Google / Amazon search bars)
  const querySuggestions = useMemo(() => {
    if (!cleanQuery) return [];

    const suggestions = [];
    const seen = new Set();

    // Check brand matches
    for (const b of KNOWN_BRANDS) {
      const bLower = b.name.toLowerCase();
      if (bLower.includes(cleanQuery) && !seen.has(bLower)) {
        suggestions.push({ text: b.name, type: 'brand', slug: b.slug });
        seen.add(bLower);
      }
    }

    // Check watch model names
    for (const w of allWatches) {
      if (!w || !w.name) continue;
      const name = w.name;
      const nameLower = name.toLowerCase();
      if (nameLower.includes(cleanQuery) && !seen.has(nameLower)) {
        suggestions.push({ text: name, type: 'watch', watch: w });
        seen.add(nameLower);
      }
    }

    // Sort: items starting with query come first, then shorter phrases
    suggestions.sort((a, b) => {
      const aStarts = a.text.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
      const bStarts = b.text.toLowerCase().startsWith(cleanQuery) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      return a.text.length - b.text.length;
    });

    return suggestions.slice(0, 4);
  }, [cleanQuery, allWatches]);

  // 2. Intelligent Multi-Keyword Matching & Relevance Scoring for Direct Timepieces
  const matchedWatches = useMemo(() => {
    if (!cleanQuery) return [];

    const scored = [];
    for (const watch of allWatches) {
      if (!watch || !watch.name) continue;

      const name = (watch.name || '').toLowerCase();
      const brand = (watch.brand || '').toLowerCase();
      const category = (watch.category || '').toLowerCase();
      const movement = (watch.movement || '').toLowerCase();
      const desc = (watch.description || '').toLowerCase();
      const strap = (watch.strapType || watch.strap || '').toLowerCase();
      const caseSize = (watch.caseDiameter || watch.caseSize || '').toLowerCase();
      const location = (watch.storeLocation || '').toLowerCase();
      const gender = (watch.gender || '').toLowerCase();

      const combinedText = `${name} ${brand} ${category} ${movement} ${desc} ${strap} ${caseSize} ${location} ${gender}`;

      // Every word token must match somewhere in the watch metadata
      const matchesAll = queryTokens.every((token) => combinedText.includes(token));
      if (!matchesAll) continue;

      let score = 0;
      // Exact name match bonus
      if (name === cleanQuery) score += 1000;
      else if (name.startsWith(cleanQuery)) score += 500;
      else if (name.includes(cleanQuery)) score += 300;

      // Brand match bonus
      if (brand === cleanQuery) score += 400;
      else if (brand.startsWith(cleanQuery)) score += 200;
      else if (brand.includes(cleanQuery)) score += 100;

      // Model tokens in watch name
      const nameTokensCount = queryTokens.filter((t) => name.includes(t)).length;
      score += nameTokensCount * 60;

      // Category and movement matches
      if (category.includes(cleanQuery)) score += 120;
      if (movement.includes(cleanQuery)) score += 80;
      if (desc.includes(cleanQuery)) score += 40;

      // Prioritize in-stock watches
      if (watch.inStock !== false) score += 15;

      scored.push({ watch, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map((item) => item.watch);
  }, [cleanQuery, queryTokens, allWatches]);

  // Total navigable items in dropdown
  const totalNavItems = querySuggestions.length + matchedWatches.length;

  // Reset highlighted item when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [cleanQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.search-nav-item');
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex]);

  const handleSelectWatch = (watch) => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
    if (onSelectWatch) {
      onSelectWatch(watch);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSelectSuggestion = (sugg) => {
    if (sugg.watch) {
      handleSelectWatch(sugg.watch);
    } else if (sugg.type === 'brand' && sugg.slug) {
      setIsOpen(false);
      setQuery('');
      setActiveIndex(-1);
      navigate(`/brand/${sugg.slug}`);
      if (onCloseMobile) onCloseMobile();
    } else {
      setQuery(sugg.text);
      setActiveIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleNavigateBrand = (slug) => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(-1);
    navigate(`/brand/${slug}`);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  // Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
  const handleKeyDown = (e) => {
    if (!isOpen || totalNavItems === 0) {
      if (e.key === 'ArrowDown' && cleanQuery) {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalNavItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalNavItems - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < querySuggestions.length) {
        handleSelectSuggestion(querySuggestions[activeIndex]);
      } else if (activeIndex >= querySuggestions.length) {
        const watchIdx = activeIndex - querySuggestions.length;
        if (matchedWatches[watchIdx]) {
          handleSelectWatch(matchedWatches[watchIdx]);
        }
      } else if (matchedWatches.length > 0) {
        // Direct enter without selecting opens the top watch
        handleSelectWatch(matchedWatches[0]);
      } else if (querySuggestions.length > 0) {
        handleSelectSuggestion(querySuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Helper to highlight matching keyword letters
  const renderHighlightedText = (text, terms) => {
    if (!terms || terms.length === 0 || !text) return text;
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escaped) return text;
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-brass-900 font-extrabold underline decoration-brass-600/40 bg-brass-500/15 rounded-xs px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const hasAnyResults = querySuggestions.length > 0 || matchedWatches.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Bar Input Container */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brass-700 pointer-events-none transition-colors" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (val.trim()) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            // ONLY open if there is an active search query (standard behavior)
            if (cleanQuery) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck="false"
          className="w-full bg-[#F4EFE6] hover:bg-[#EFE9DD] focus:bg-white border border-[#D8CEBF] focus:border-brass-600 rounded-full pl-9 pr-9 py-2 text-xs md:text-[13px] text-[#111111] placeholder-[#7D756C] focus:outline-none transition-all shadow-inner focus:shadow-md"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#E5DDCF] hover:bg-[#D5CBBC] text-[#4A433B] text-xs font-bold transition-all"
            title="Clear search"
            aria-label="Clear search input"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Live Dropdown: ONLY rendered when a user searches (standard search bar behavior) */}
      {isOpen && cleanQuery && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 top-full mt-2 bg-[#FAF7F2] border border-[#DDD5C7] rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in ${
            isMobile
              ? 'w-full max-h-[75vh] overflow-y-auto'
              : 'min-w-[340px] md:min-w-[440px] lg:min-w-[480px] max-h-[75vh] overflow-y-auto'
          }`}
          style={{
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(197, 160, 89, 0.15)',
          }}
        >
          {/* Brand Boutique Shortcut (If Query Matches a Known Brand) */}
          {matchedBrand && (
            <div
              onClick={() => handleNavigateBrand(matchedBrand.slug)}
              className="p-3 bg-gradient-to-r from-brass-600/15 via-brass-500/10 to-transparent border-b border-[#E8E1D5] flex items-center justify-between cursor-pointer hover:bg-brass-500/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-brass-700 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                  🏛️
                </span>
                <div>
                  <p className="text-xs font-bold text-brass-900">
                    Visit Official {matchedBrand.name} Boutique
                  </p>
                  <p className="text-[10px] text-stone-600">
                    View collection, warranty & Gorakhpur inventory
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-brass-700 shrink-0" />
            </div>
          )}

          {/* 1. Auto-Complete Search Suggestions Section */}
          {querySuggestions.length > 0 && (
            <div className="border-b border-[#EBE4D8]">
              <div className="px-3.5 py-1.5 bg-[#F2ECE1] text-[10px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                <span>Suggestions</span>
              </div>
              <div className="divide-y divide-[#F0E9DE]">
                {querySuggestions.map((sugg, idx) => {
                  const isHighlighted = activeIndex === idx;
                  return (
                    <div
                      key={sugg.text}
                      onClick={() => handleSelectSuggestion(sugg)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`search-nav-item px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-[#EFE7D8] text-brass-950 font-bold'
                          : 'hover:bg-[#F5EFE4] text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="text-xs sm:text-[13px] truncate">
                          {renderHighlightedText(sugg.text, queryTokens)}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 group-hover:text-stone-600 shrink-0 pl-2">
                        {sugg.type === 'watch' ? (
                          <span className="text-brass-700 font-semibold">Direct View</span>
                        ) : sugg.type === 'brand' ? (
                          <span className="text-brass-700 font-semibold">Boutique</span>
                        ) : (
                          <ArrowUpLeft className="w-3 h-3 text-stone-400" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Direct Matching Timepieces (Click to open directly) */}
          {matchedWatches.length > 0 && (
            <div>
              <div className="px-3.5 py-1.5 bg-[#F2ECE1] text-[10px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Timepieces</span>
                <span className="text-[9.5px] font-normal text-stone-500">
                  Tap watch to view specs
                </span>
              </div>

              <div className="divide-y divide-[#EBE4D8]">
                {matchedWatches.map((watch, idx) => {
                  const itemIndex = querySuggestions.length + idx;
                  const isHighlighted = activeIndex === itemIndex;
                  const watchImage = getFullImageUrl(watch.image);

                  return (
                    <div
                      key={watch.id || watch._id || idx}
                      onClick={() => handleSelectWatch(watch)}
                      onMouseEnter={() => setActiveIndex(itemIndex)}
                      className={`search-nav-item px-3.5 py-3 flex items-center gap-3.5 cursor-pointer transition-all ${
                        isHighlighted
                          ? 'bg-[#EFE7D8] text-charcoal-900 shadow-inner'
                          : 'hover:bg-[#F5EFE4] text-stone-800'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#F4EFE6] border border-[#DDD5C7] p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={watchImage}
                          alt={watch.name}
                          className="w-full h-full object-contain drop-shadow-sm"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/images/watches/default-watch.webp';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-extrabold uppercase tracking-wider bg-brass-700/10 text-brass-900 border border-brass-600/30">
                            {watch.brand}
                          </span>
                          {watch.category && (
                            <span className="text-[9.5px] text-stone-500">
                              • {watch.category}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs sm:text-[13px] font-bold leading-snug truncate text-[#1A1A1A]">
                          {renderHighlightedText(watch.name, queryTokens)}
                        </h4>

                        <div className="flex items-center gap-2 text-[10px] text-stone-500 truncate mt-0.5">
                          {watch.movement && (
                            <span className="truncate">
                              {watch.movement}
                            </span>
                          )}
                          {watch.caseDiameter && (
                            <span className="shrink-0">• {watch.caseDiameter}</span>
                          )}
                        </div>
                      </div>

                      {/* Movement & Direct View */}
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-bold text-stone-700">
                          {watch.movement || watch.category || 'Showroom Stock'}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-brass-700 mt-0.5">
                          View <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Empty State: No suggestions or timepieces found */}
          {!hasAnyResults && (
            <div className="p-6 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
                <Search className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-800">
                No suggestions found for "{query}"
              </p>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                Try searching by watch model (PRX, Tsuyosa, Speedmaster), brand, or movement.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
