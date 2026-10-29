const fs = require('fs');
const path = require('path');

const radoImages = [
  'rado-captain-cook-ceramic.webp',                      // 01: Captain Cook High-Tech Ceramic
  'rado-true-square-open-heart.webp',                    // 02: True Square Automatic Open Heart
  'rado-centrix-diamonds-women.webp',                    // 03: Centrix Automatic Diamonds
  'rado-true-round-open-heart-white-ceramic.webp',       // 04: True Round Automatic
  'rado-hyperchrome-chrono-ceramic-45.webp',              // 05: HyperChrome Classic Automatic
  'rado-integral-high-tech-ceramic-jubilee.webp',         // 06: Integral Jubile
  'rado-true-square-plasma-open-heart.webp',              // 07: DiaMaster Automatic
  'rado-captain-cook-over-pole-limited.webp',             // 08: Captain Cook Over-Pole Limited Edition
  'rado-ceramica-square-minimalist.webp',                 // 09: Ceramica Automatic
  'rado-true-thinline-ceramic-black-39.webp',             // 10: True Thinline Less
  'rado-centrix-open-heart.webp',                         // 11: Centrix Open Heart
  'rado-captain-cook-bronze-green.webp',                  // 12: Captain Cook Bronze Automatic
  'rado-true-square-ceramic.webp',                        // 13: True Square Thinline
  'rado-captain-cook-marina-edition-37.webp',             // 14: HyperChrome Captain Cook Chronograph
  'rado-coupole-classic-power-reserve-41.webp',           // 15: Coupole Classic Automatic
  'rado-centrix-automatic-jubile-black-diamonds.webp',    // 16: True Secret Automatic
  'rado-florence-classic-two-tone-38.webp',               // 17: Sintra Jubile
  'rado-diastar-original-60th-anniversary.webp',          // 18: DiaStar Original Automatic
  'rado-golden-horse-1957-limited-red.webp',              // 19: True Square Designer
  'rado-centrix-chrono-quartz-black-rose-gold.webp',      // 20: Centrix Automatic Chronograph
];

const targets = [
  'frontend/public/images/watches/rado',
  'admin/public/images/watches/rado'
];

targets.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory ${dir}`);
  }
});

radoImages.forEach((srcFile, index) => {
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

console.log('All 20 Rado images setup completed.');
