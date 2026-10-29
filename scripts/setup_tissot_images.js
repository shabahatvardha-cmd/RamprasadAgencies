const fs = require('fs');
const path = require('path');

const tissotImages = [
  'tissot-prx-powermatic-80.webp',        // 01: Tissot PRX Powermatic 80 (T137.407.11.041.00)
  'tissot-prx-35-ice-blue.webp',           // 02: Tissot PRX Quartz 40mm (T137.410.11.051.00)
  'tissot-seastar-1000-40mm.webp',         // 03: Tissot Seastar 1000 Powermatic 80 (T120.407.11.041.00)
  'tissot-gentleman-silicium.webp',        // 04: Tissot Gentleman Powermatic 80 Silicium (T127.407.11.041.00)
  'tissot-le-locle-automatic.webp',        // 05: Tissot Le Locle Powermatic 80 (T006.407.16.033.00)
  'tissot-prx-chrono-panda.webp',          // 06: Tissot PRX Powermatic 80 Carbon (T137.907.97.201.00)
  'tissot-heritage-visodate.webp',         // 07: Tissot Heritage Visodate Automatic (T019.430.16.031.01)
  'tissot-supersport-chrono.webp',         // 08: Tissot Supersport Chrono (T125.617.36.051.00)
  'tissot-pr100-chronograph.webp',         // 09: Tissot PR 100 Sport Chic (T101.910.11.031.00)
  'tissot-chemin-des-tourelles.webp',      // 10: Tissot Chemin des Tourelles Powermatic 80 (T139.807.11.031.00)
  'tissot-prx-mint-green.webp',            // 11: Tissot PRX 35mm Mint Green (T137.210.11.351.00)
  'tissot-bellissima-women.webp',          // 12: Tissot Bellissima Automatic (T126.207.22.013.00)
  'tissot-seastar-2000-diver.webp',        // 13: Tissot Seastar 2000 Professional (T120.607.11.041.01)
  'tissot-pr516-mechanical-chrono.webp',    // 14: Tissot Heritage 1973 Chronograph (T124.427.16.041.00)
  'tissot-classic-dream-roman.webp',       // 15: Tissot Everytime Swissmatic (T109.410.16.033.01)
  'tissot-t-touch-connect-solar.webp',     // 16: Tissot T-Touch Connect Solar (T121.420.47.051.00)
  'tissot-heritage-1938-cosc.webp',        // 17: Tissot Tradition Powermatic 80 Open Heart (T063.907.36.068.00)
  'tissot-carson-premium-auto.webp',       // 18: Tissot Carson Premium Powermatic 80 (T122.407.16.033.00)
  'tissot-prx-gold-pvd.webp',              // 19: Tissot PRX Powermatic 80 Gold (T137.407.33.021.00)
  'tissot-telemeter-1938.webp',            // 20: Tissot Lovely Square (T058.109.36.031.00)
];

const targets = [
  'frontend/public/images/watches/tissot',
  'admin/public/images/watches/tissot'
];

targets.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory ${dir}`);
  }
});

tissotImages.forEach((srcFile, index) => {
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

console.log('All 20 Tissot images setup completed.');
