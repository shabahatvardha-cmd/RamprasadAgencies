import { FALLBACK_WATCHES as frontendWatches } from '../frontend/src/data/fallbackWatches.js';
import { FALLBACK_WATCHES as adminWatches } from '../admin/src/data/fallbackWatches.js';

const isWatchInBrand = (w, slug) => {
  if (!w) return false;
  const b = (w.brand || '').toLowerCase().trim();
  const clean = (slug || '').toLowerCase().trim();
  return b === clean || b.replace(/\s+/g, '-') === clean;
};

const frontendBreitling = frontendWatches.filter(w => isWatchInBrand(w, 'breitling'));
const adminBreitling = adminWatches.filter(w => isWatchInBrand(w, 'breitling'));

console.log(`Frontend Breitling count: ${frontendBreitling.length}`);
frontendBreitling.forEach((w, i) => console.log(`  ${i+1}. id=${w.id}, name=${w.name}`));

console.log(`\nAdmin Breitling count: ${adminBreitling.length}`);
adminBreitling.forEach((w, i) => console.log(`  ${i+1}. id=${w.id}, name=${w.name}`));
