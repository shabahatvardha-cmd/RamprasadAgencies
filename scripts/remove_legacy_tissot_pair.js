const fs = require('fs');

const files = [
  'frontend/src/data/fallbackWatches.js',
  'admin/src/data/fallbackWatches.js'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const startPair = '  // Tissot Bellissima Small Lady (Women)\n  {';
  const endPair = '  // Seiko Presage Cocktail Time Diamond Ladies (Women)\n  {';
  const startPairIdx = content.indexOf(startPair);
  const endPairIdx = content.indexOf(endPair);
  if (startPairIdx !== -1 && endPairIdx !== -1 && endPairIdx > startPairIdx) {
    const toRemovePair = content.substring(startPairIdx, endPairIdx);
    content = content.replace(toRemovePair, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${filePath}] Removed legacy pair: bellissima-women / prx-35-unisex`);
  } else {
    console.log(`[${filePath}] Could not find legacy Tissot pair: start=${startPairIdx}, end=${endPairIdx}`);
  }
});
