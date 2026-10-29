const fs = require('fs');

const files = [
  'frontend/src/data/fallbackWatches.js',
  'admin/src/data/fallbackWatches.js'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const startStr = ',\n  {\n    "id": "omega-speedmaster-dark-side-moon"';
  const endStr = '  {\n    "id": "breitling-chronomat-b01-42-anthracite"';
  
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const toRemove = content.substring(startIdx, endIdx);
    content = content.replace(toRemove, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${filePath}] Removed remaining 7 legacy omega watches!`);
  } else {
    console.error(`[${filePath}] Could not find startStr or endStr: startIdx=${startIdx}, endIdx=${endIdx}`);
  }
});
