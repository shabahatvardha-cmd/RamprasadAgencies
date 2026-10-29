import { FALLBACK_WATCHES as frontendWatches } from '../frontend/src/data/fallbackWatches.js';
import { FALLBACK_WATCHES as adminWatches } from '../admin/src/data/fallbackWatches.js';
import fs from 'fs';

console.log('--- Checking Frontend Watches ---');
const frontendOmega = frontendWatches.filter(w => (w.brand || '').toLowerCase().trim() === 'omega');
console.log(`Frontend Omega count: ${frontendOmega.length}`);

const frontendTitan = frontendWatches.filter(w => (w.brand || '').toLowerCase().trim() === 'titan');
console.log(`Frontend Titan count: ${frontendTitan.length}`);

const frontendRaga = frontendWatches.filter(w => (w.brand || '').toLowerCase().trim() === 'titan raga');
console.log(`Frontend Titan Raga count: ${frontendRaga.length}`);

console.log('\n--- Checking Admin Watches ---');
const adminOmega = adminWatches.filter(w => (w.brand || '').toLowerCase().trim() === 'omega');
console.log(`Admin Omega count: ${adminOmega.length}`);

console.log('\n--- Checking Omega Items & Images ---');
frontendOmega.forEach((w, idx) => {
  const expectedImg = `/images/watches/omega/${String(idx + 1).padStart(2, '0')}.webp`;
  const imgMatch = w.image === expectedImg;
  const hasPrice = w.price !== null && w.price !== undefined;
  const diskPath = `frontend/public${w.image}`;
  const diskExists = fs.existsSync(diskPath);
  console.log(`[#${idx + 1}] ID: ${w.id} | Name: ${w.name.padEnd(45)} | ImgMatch: ${imgMatch} | Exists: ${diskExists} | HasPrice: ${hasPrice}`);
});
