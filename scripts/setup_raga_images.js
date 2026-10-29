const fs = require('fs');
const path = require('path');

const dstFrontend = 'frontend/public/images/watches/titan-raga';
const dstAdmin = 'admin/public/images/watches/titan-raga';
const srcDir = 'frontend/public/images/watches';

fs.mkdirSync(dstFrontend, { recursive: true });
fs.mkdirSync(dstAdmin, { recursive: true });

const mapping = {
  '01.webp': 'titan-raga-viva-mop.webp',
  '02.webp': 'titan-raga-facets-emerald.webp',
  '03.webp': 'raga-moments-of-joy-filigree.webp',
  '04.webp': 'titan-raga-aurora.webp',
  '05.webp': 'raga-flora-petal-silhouette-rosegold.webp',
  '06.webp': 'raga-power-pearls-rosegold-mesh.webp',
  '07.webp': 'raga-cocktails-midnight-blue-crystal.webp',
  '08.webp': 'raga-delight-asymmetric-mop-bangle.webp',
  '09.webp': 'raga-glitz-faceted-crystal-bezel.webp',
  '10.webp': 'raga-masaba-tribal-charm-bangle.webp',
  '11.webp': 'raga-mystique-peacock-feather-enamel.webp',
  '12.webp': 'raga-celeste-ceramic-rosegold-32.webp',
  '13.webp': 'raga-reflections-swarovski-crystal-29.webp',
  '14.webp': 'raga-symphony-polished-gold-open-cuff.webp',
  '15.webp': 'raga-chic-enamel-bangle-champagne.webp',
  '16.webp': 'raga-garden-of-eden-leaf-golden.webp',
  '17.webp': 'raga-elegance-curved-bangle-champagne.webp',
  '18.webp': 'raga-moonlight-crescent-bangle.webp',
  '19.webp': 'raga-viva-diamond-sunray-silver.webp',
  '20.webp': 'raga-i-am-pearl-drops-rosegold.webp'
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
console.log('Titan Raga 01..20 images successfully initialized!');
