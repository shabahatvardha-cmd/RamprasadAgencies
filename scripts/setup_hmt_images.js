const fs = require('fs');
const path = require('path');

const hmtImages = [
  'hmt-janata-devnagari.webp',                     // 01: HMT Janata Mechanical White (Janata-W)
  'hmt-kohinoor-ice-blue-mechanical.webp',          // 02: HMT Sangam Mechanical (Sangam-01)
  'hmt-kanchan-automatic-gold-textured.webp',       // 03: HMT Kanchan Gold Automatic (Kanchan-G)
  'hmt-pilot-black-dial.webp',                      // 04: HMT Pilot Mechanical Black (Pilot-BLK)
  'hmt-kohinoor-mechanical.webp',                   // 05: HMT Kohinoor Maroon (Kohinoor-MR)
  'hmt-kedarnath-himalayan-devnagari.webp',          // 06: HMT Himadri Automatic (Himadri-01)
  'hmt-tareeq-sunray-blue-quartz.webp',             // 07: HMT Tareeq Automatic (Tareeq-BL)
  'hmt-bahadur-military-handwound.webp',            // 08: HMT Chronograph FGSS 12 (FGSS12)
  'hmt-pilot-luminous-green-mechanical.webp',       // 09: HMT Commando Tactical (Commando-01)
  'hmt-vijay-cream-dial-handwind.webp',             // 10: HMT Vijay Mechanical (Vijay-01)
  'hmt-rajat-automatic-cushion-case.webp',          // 11: HMT Rajat Automatic (Rajat-01)
  'hmt-sona-gold-plated-mechanical.webp',           // 12: HMT Chetak Gold (Chetak-G)
  'hmt-stellar-open-heart-auto.webp',               // 13: HMT Jhalak Skeleton (Jhalak-01)
  'hmt-sujata-vintage-women.webp',                  // 14: HMT Abhilasha Gold (Abhilasha-G)
  'hmt-rohini-vintage-ladies-handwind.webp',        // 15: HMT Amber Ladies Mechanical (Amber-01)
  'hmt-janata-art-deco-silver.webp',                // 16: HMT Himalaya Quartz IPS (Himalaya-Q)
  'hmt-chinar-antique-gold-34.webp',                // 17: HMT Inox Gold IGSS 05 Yellow (IGSS05)
  'hmt-sourabh-vintage-champagne-36.webp',          // 18: HMT Nandan Quartz (Nandan-01)
  'hmt-kohinoor-saffron-yellow.webp',               // 19: HMT Sweekar Quartz (Sweekar-01)
  'hmt-prateek-white-enamel-handwound.webp',        // 20: HMT ADSL 04 Couple Watch (ADSL04)
];

const targets = [
  'frontend/public/images/watches/hmt',
  'admin/public/images/watches/hmt'
];

targets.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory ${dir}`);
  }
});

hmtImages.forEach((srcFile, index) => {
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

console.log('All 20 HMT images setup completed.');
