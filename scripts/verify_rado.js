import { FALLBACK_WATCHES as frontendWatches } from '../frontend/src/data/fallbackWatches.js';
import { FALLBACK_WATCHES as adminWatches } from '../admin/src/data/fallbackWatches.js';
import fs from 'fs';

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

console.log('--- Brand Counts in Frontend Dataset ---');
const brands = ['titan', 'titan-raga', 'omega', 'rado'];
brands.forEach(b => {
  const count = frontendWatches.filter(w => isWatchInBrand(w, b)).length;
  console.log(`Frontend ${b}: ${count} watches`);
});

console.log('\n--- Brand Counts in Admin Dataset ---');
brands.forEach(b => {
  const count = adminWatches.filter(w => isWatchInBrand(w, b)).length;
  console.log(`Admin ${b}: ${count} watches`);
});

console.log('\n--- Checking 20 Rado Timepieces ---');
const frontendRado = frontendWatches.filter(w => isWatchInBrand(w, 'rado'));
frontendRado.forEach((w, idx) => {
  const expectedImg = `/images/watches/rado/${String(idx + 1).padStart(2, '0')}.webp`;
  const imgMatch = w.image === expectedImg;
  const diskPath = `frontend/public${w.image}`;
  const diskExists = fs.existsSync(diskPath);
  const hasPrice = w.price !== null && w.price !== undefined;
  console.log(`[#${idx + 1}] ID: ${w.id} | Name: ${w.name.padEnd(45)} | ImgMatch: ${imgMatch} | Exists: ${diskExists} | HasPrice: ${hasPrice}`);
});
