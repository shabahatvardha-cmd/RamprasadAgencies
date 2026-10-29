import { FALLBACK_WATCHES } from '../frontend/src/data/fallbackWatches.js';

const isWatchInBrand = (w, slug) => {
  if (!w) return false;
  const b = (w.brand || '').toLowerCase().trim();
  const clean = (slug || '').toLowerCase().trim();

  if (clean === 'titan') {
    return b === 'titan';
  }
  if (clean === 'titan-raga' || clean === 'raga' || clean === 'titan raga') {
    return b === 'titan raga' || b === 'raga';
  }
  if (clean === 'tag-heuer' || clean === 'tag heuer') {
    return b === 'tag heuer' || b === 'tag-heuer';
  }
  return b === clean || b.replace(/\s+/g, '-') === clean;
};

console.log('Titan matching count:', FALLBACK_WATCHES.filter(w => isWatchInBrand(w, 'titan')).length);
console.log('Titan Raga matching count:', FALLBACK_WATCHES.filter(w => isWatchInBrand(w, 'titan-raga')).length);
console.log('Omega matching count:', FALLBACK_WATCHES.filter(w => isWatchInBrand(w, 'omega')).length);
