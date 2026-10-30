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

const brands = ['titan', 'titan-raga', 'omega', 'rado', 'hmt', 'tissot', 'seiko', 'breitling', 'fossil', 'fastrack'];

console.log('--- Brand Counts in Frontend Dataset ---');
brands.forEach(b => {
  const count = frontendWatches.filter(w => isWatchInBrand(w, b)).length;
  console.log(`Frontend ${b}: ${count} watches`);
});

console.log('\n--- Brand Counts in Admin Dataset ---');
brands.forEach(b => {
  const count = adminWatches.filter(w => isWatchInBrand(w, b)).length;
  console.log(`Admin ${b}: ${count} watches`);
});

console.log('\n--- Checking 20 Fastrack Timepieces ---');
const frontendFastrack = frontendWatches.filter(w => isWatchInBrand(w, 'fastrack'));
let allValid = true;

frontendFastrack.forEach((w, idx) => {
  const expectedImg = `/images/watches/fastrack/${String(idx + 1).padStart(2, '0')}.webp`;
  const imgMatch = w.image === expectedImg;
  const diskPathFrontend = `frontend/public${w.image}`;
  const diskPathAdmin = `admin/public${w.image}`;
  const diskFrontend = fs.existsSync(diskPathFrontend);
  const diskAdmin = fs.existsSync(diskPathAdmin);
  const hasPrice = w.price !== null || w.originalPrice !== null;

  if (!imgMatch || !diskFrontend || !diskAdmin || hasPrice) {
    allValid = false;
    console.error(`Mismatch on watch ${idx + 1} (${w.name}):`, {
      imgMatch,
      diskFrontend,
      diskAdmin,
      hasPrice,
      price: w.price,
      originalPrice: w.originalPrice,
      image: w.image,
    });
  }
});

if (allValid && frontendFastrack.length === 20) {
  console.log('ALL 20 FASTRACK WATCHES PERFECTLY VERIFIED ACROSS FRONTEND AND ADMIN!');
} else {
  console.error('VERIFICATION FAILED!');
}

