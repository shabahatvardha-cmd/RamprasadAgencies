const fs = require('fs');
const path = require('path');

const dstFrontend = 'frontend/public/images/watches/omega';
const dstAdmin = 'admin/public/images/watches/omega';
const srcDir = 'frontend/public/images/watches';

fs.mkdirSync(dstFrontend, { recursive: true });
fs.mkdirSync(dstAdmin, { recursive: true });

const mapping = {
  '01.webp': 'omega-speedmaster-moonwatch.webp',
  '02.webp': 'omega-seamaster-diver-300m.webp',
  '03.webp': 'omega-aqua-terra-shades-atlantic-blue.webp',
  '04.webp': 'omega-constellation-women.webp',
  '05.webp': 'omega-planet-ocean-600m-black.webp',
  '06.webp': 'omega-deville-prestige-blue.webp',
  '07.webp': 'omega-speedmaster-chronoscope-silver.webp',
  '08.webp': 'omega-seamaster-300-heritage-black.webp',
  '09.webp': 'omega-speedmaster-heritage.webp',
  '10.webp': 'omega-seamaster-aqua-terra.webp',
  '11.webp': 'omega-constellation-globemaster-pie-pan.webp',
  '12.webp': 'omega-speedmaster-dark-side-moon.webp',
  '13.webp': 'omega-aqua-terra-gmt-worldtimer.webp',
  '14.webp': 'omega-deville-tresor-power-reserve.webp',
  '15.webp': 'omega-speedmaster-racing-white-panda.webp',
  '16.webp': 'omega-seamaster-007-titanium-edition.webp',
  '17.webp': 'omega-constellation-diamond-bezel-36.webp',
  '18.webp': 'omega-speedmaster-57-burgundy.webp',
  '19.webp': 'omega-planet-ocean-deep-black-gmt.webp',
  '20.webp': 'omega-railmaster-black-brushed.webp'
};

for (const [targetName, sourceFile] of Object.entries(mapping)) {
  const srcPath = path.join(srcDir, sourceFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(dstFrontend, targetName));
    fs.copyFileSync(srcPath, path.join(dstAdmin, targetName));
    console.log(`Copied ${sourceFile} -> ${targetName}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
console.log('Omega 01..20 images successfully initialized!');
