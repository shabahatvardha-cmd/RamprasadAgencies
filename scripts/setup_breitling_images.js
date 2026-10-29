const fs = require('fs');
const path = require('path');

const breitlingImages = [
  'breitling-navitimer-b01-chronograph.webp',
  'breitling-superocean-heritage-b20-42.webp',
  'breitling-chronomat-b01-42-anthracite.webp',
  'breitling-avenger-b01-chronograph.webp',
  'breitling-superocean-automatic-diver.webp',
  'breitling-premier-b01-chronograph.webp',
  'breitling-navitimer-automatic-41-ice-blue.webp',
  'breitling-top-time-b01-chronograph.webp',
  'breitling-chronomat-gmt-40-white.webp',
  'breitling-super-chronomat-b01-44-black.webp',
  'breitling-endurance-pro-yellow-44.webp',
  'breitling-navitimer-b01-46-green.webp',
  'breitling-superocean-44-diver-black.webp',
  'breitling-avenger-automatic-42-night-mission.webp',
  'breitling-classic-avi-corsair-42.webp',
  'breitling-top-time-deus-chronograph.webp',
  'breitling-chronomat-36-mint-green.webp',
  'breitling-aerospace-b70-orbiter-titanium.webp',
  'breitling-premier-b09-pistachio-green.webp',
  'breitling-navitimer-35-mop-women.webp'
];

const sourceDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'watches');

const targets = [
  path.join(__dirname, '..', 'frontend', 'public', 'images', 'watches', 'breitling'),
  path.join(__dirname, '..', 'admin', 'public', 'images', 'watches', 'breitling')
];

targets.forEach(targetDir => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  breitlingImages.forEach((srcName, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const srcFile = path.join(sourceDir, srcName);
    const destFile = path.join(targetDir, `${num}.webp`);

    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${srcName} -> ${targetDir}/${num}.webp`);
    } else {
      console.error(`Source file not found: ${srcFile}`);
    }
  });
});

console.log('Breitling image setup complete.');
