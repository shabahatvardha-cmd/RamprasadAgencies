const fs = require('fs');

const files = [
  'frontend/src/data/fallbackWatches.js',
  'admin/src/data/fallbackWatches.js'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const startStr = '  // Rado Centrix Diamonds (Women)\n  {';
  const endStr = '  // Fossil Jacqueline (Women)\n  {';
  
  const startIdx = content.indexOf(startStr);
  const endIdx = content.indexOf(endStr);
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const toRemove = content.substring(startIdx, endIdx);
    content = content.replace(toRemove, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${filePath}] Successfully removed legacy Rado pair!`);
  } else {
    console.error(`[${filePath}] Could not find legacy Rado pair bounds: startIdx=${startIdx}, endIdx=${endIdx}`);
  }
});
