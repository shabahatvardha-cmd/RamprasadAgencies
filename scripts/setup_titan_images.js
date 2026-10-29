const fs = require('fs');
const path = require('path');

const srcDir = 'frontend/public/images/watches';
const dstFrontend = 'frontend/public/images/watches/titan';
const dstAdmin = 'admin/public/images/watches/titan';

const mapping = {
  '01.webp': 'titan-edge-ceramic.webp',
  '02.webp': 'titan-neo-splash-gunmetal-sport.webp',
  '03.webp': 'titan-minimalist-classique-silver-38.webp',
  '04.webp': 'titan-regalia-two-tone.webp',
  '05.webp': 'titan-grandmaster-automatic-skeleton.webp',
  '06.webp': 'titan-maritime-regatta-chronograph.webp',
  '07.webp': 'titan-raga-viva-mop.webp',
  '08.webp': 'titan-automatics-multifunction-skeleton-43.webp',
  '09.webp': 'titan-edge-ceramic.webp',
  '10.webp': 'titan-bandhan-heritage-gold-pair.webp',
  '11.webp': 'titan-karishma-classic-gold-champagne.webp',
  '12.webp': 'titan-octane-aerobatic-chrono-45.webp',
  '13.webp': 'titan-stellar-meteorite-dial.webp',
  '14.webp': 'titan-neo-ivory-dial-leather-40.webp',
  '15.webp': 'titan-minimalist-classique-silver-38.webp',
  '16.webp': 'titan-workwear-chrono-forest-green.webp',
  '17.webp': 'titan-octane-hyperlume-navy-blue.webp',
  '18.webp': 'titan-edge-zen-mechanical.webp',
  '19.webp': 'titan-regalia-sovereign-dual-time.webp',
  '20.webp': 'titan-minimalist-classique-silver-38.webp'
};

for (const [targetName, sourceFile] of Object.entries(mapping)) {
  const srcPath = path.join(srcDir, sourceFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(dstFrontend, targetName));
    fs.copyFileSync(srcPath, path.join(dstAdmin, targetName));
    console.log(`Copied ${sourceFile} -> ${targetName}`);
  } else {
    // fallback to edge ceramic
    fs.copyFileSync(path.join(srcDir, 'titan-edge-ceramic.webp'), path.join(dstFrontend, targetName));
    fs.copyFileSync(path.join(srcDir, 'titan-edge-ceramic.webp'), path.join(dstAdmin, targetName));
    console.log(`Fallback copied to ${targetName}`);
  }
}
console.log('Titan 01..20 image slots successfully initialized!');
