const fs = require('fs');
const path = require('path');

const seikoImages = [
  'seiko-5-sports-diver.webp',                  // 01: Seiko 5 Sports "SRPD55K1" (SKX Style)
  'seiko-prospex-king-turtle.webp',             // 02: Seiko Prospex "Turtle" (SRPF03K1)
  'seiko-presage-cocktail-time.webp',           // 03: Seiko Presage Cocktail Time "Skydiving" (SRPB43J1)
  'seiko-prospex-alpinist.webp',                // 04: Seiko Prospex Alpinist (SPB121J1)
  'seiko-prospex-sumo-green.webp',              // 05: Seiko Prospex "Sumo" (SBDC031 / SPB103J1)
  'seiko-5-sports-field-khaki.webp',            // 06: Seiko 5 Sports Field Watch (SRPG27K1)
  'seiko-prospex-speedtimer.webp',              // 07: Seiko Prospex Speedtimer Solar Chronograph (SSC813P1)
  'seiko-presage-cocktail-mockingbird.webp',    // 08: Seiko Presage "Mockingbird" Cocktail Time (SRPD37J1)
  'king-seiko-ksk-spb279.webp',                 // 09: Seiko King Seiko Vanac (SLA083J1)
  'seiko-prospex-monster-padi.webp',            // 10: Seiko Prospex "Monster" (SRPD25K1)
  'seiko-prospex-arnie-solar.webp',             // 11: Seiko Astron GPS Solar (SSJ012J1)
  'seiko-5-gmt-ssk005-orange.webp',             // 12: Seiko 5 Sports GMT "Orange Field" (SSK005K1)
  'seiko-presage-style-60s-cream.webp',         // 13: Seiko Premier Kinetic Perpetual (SNP143P1)
  'seiko-presage-sharp-edged-blue.webp',        // 14: Seiko Presage Sharp Edged Series (SPB167J1)
  'seiko-prospex-king-samurai.webp',            // 15: Seiko Prospex 1965 Modern Re-interpretation (SPB143J1)
  'seiko-5-gmt-ssk003-blueberry.webp',          // 16: Seiko 5 Sports GMT "Batman" (SSK003K1)
  'seiko-presage-urushi-lacquer.webp',          // 17: Seiko Presage Cocktail Time "Old Fashioned" (SRPB46J1)
  'seiko-5-gmt-ssk001-black.webp',              // 18: Seiko Prospex Solar Diver (SNE573P1)
  'seiko-5-dresskx-charcoal.webp',              // 19: Seiko 5 Sports SNXS Vintage Series (SRPL57K1)
  'seiko-presage-arita-porcelain.webp',         // 20: Seiko Prospex Marinemaster 300m (SLA021J1)
];

const targets = [
  'frontend/public/images/watches/seiko',
  'admin/public/images/watches/seiko'
];

targets.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory ${dir}`);
  }
});

seikoImages.forEach((srcFile, index) => {
  const num = String(index + 1).padStart(2, '0');
  const destName = `${num}.webp`;
  const srcPath = path.join('frontend/public/images/watches', srcFile);

  targets.forEach(dir => {
    const destPath = path.join(dir, destName);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcFile} -> ${destPath}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  });
});

console.log('All 20 Seiko images setup completed.');
