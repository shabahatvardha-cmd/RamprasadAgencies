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

const brands = [
  'titan',
  'titan-raga',
  'omega',
  'rado',
  'hmt',
  'tissot',
  'seiko',
  'breitling',
  'fossil',
  'fastrack',
  'sonata',
  'citizen'
];

console.log('--- Brand Counts in Frontend Dataset ---');
let frontendAll20 = true;
brands.forEach(b => {
  const count = frontendWatches.filter(w => isWatchInBrand(w, b)).length;
  const ok = count === 20;
  if (!ok) frontendAll20 = false;
  console.log(`Frontend ${b}: ${count} watches ${ok ? '✅' : '❌'}`);
});

console.log('\n--- Brand Counts in Admin Dataset ---');
let adminAll20 = true;
brands.forEach(b => {
  const count = adminWatches.filter(w => isWatchInBrand(w, b)).length;
  const ok = count === 20;
  if (!ok) adminAll20 = false;
  console.log(`Admin ${b}: ${count} watches ${ok ? '✅' : '❌'}`);
});

console.log('\n--- Checking 20 Citizen Timepieces (Frontend) ---');
const frontendCitizen = frontendWatches.filter(w => isWatchInBrand(w, 'citizen'));
let allValid = true;

frontendCitizen.forEach((w, idx) => {
  const expectedImg = `/images/watches/citizen/${String(idx + 1).padStart(2, '0')}.webp`;
  const imgMatch = w.image === expectedImg;
  const diskPathFrontend = `frontend/public${w.image}`;
  const diskPathAdmin = `admin/public${w.image}`;
  const diskFrontend = fs.existsSync(diskPathFrontend);
  const diskAdmin = fs.existsSync(diskPathAdmin);
  const hasPrice = w.price !== null || w.originalPrice !== null;

  if (!imgMatch || !diskFrontend || !diskAdmin || hasPrice) {
    allValid = false;
    console.error(`Watch ${idx + 1} (${w.name}): FAILED -> imgMatch=${imgMatch}, diskFrontend=${diskFrontend}, diskAdmin=${diskAdmin}, hasPrice=${hasPrice}`);
  } else {
    console.log(`Watch ${idx + 1}: ${w.name} | img=${w.image} | diskFrontend=${diskFrontend} | diskAdmin=${diskAdmin} | price=${w.price}`);
  }
});

console.log('\n--- Checking 20 Citizen Timepieces (Admin) ---');
const adminCitizen = adminWatches.filter(w => isWatchInBrand(w, 'citizen'));
let adminValid = true;

adminCitizen.forEach((w, idx) => {
  const expectedImg = `/images/watches/citizen/${String(idx + 1).padStart(2, '0')}.webp`;
  const imgMatch = w.image === expectedImg;
  const diskPathFrontend = `frontend/public${w.image}`;
  const diskPathAdmin = `admin/public${w.image}`;
  const diskFrontend = fs.existsSync(diskPathFrontend);
  const diskAdmin = fs.existsSync(diskPathAdmin);
  const hasPrice = w.price !== null || w.originalPrice !== null;

  if (!imgMatch || !diskFrontend || !diskAdmin || hasPrice) {
    adminValid = false;
    console.error(`Admin Watch ${idx + 1} (${w.name}): FAILED`);
  }
});

if (frontendAll20 && adminAll20 && allValid && adminValid) {
  console.log('\n🎉 ALL 12 BRANDS (INCLUDING CITIZEN) VERIFIED WITH 100% INTEGRITY!');
  console.log(`Total Frontend Catalog Watches: ${frontendWatches.length}`);
  console.log(`Total Admin Catalog Watches: ${adminWatches.length}`);
} else {
  console.error('\n❌ Verification Failed!');
  process.exit(1);
}
