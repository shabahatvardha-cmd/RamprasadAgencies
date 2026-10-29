const fs = require('fs');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the block starting from titan-edge-zen-mechanical down to the end of titan-octane-aerobatic-chrono-45
  const extraTitanPattern = /,\s*\{\s*["']id["']:\s*["']titan-edge-zen-mechanical["'][\s\S]*?titan-octane-aerobatic-chrono-45["'][\s\S]*?description["']:\s*["'][^"']*?["']\s*\}/;

  if (extraTitanPattern.test(content)) {
    content = content.replace(extraTitanPattern, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned extra Titan entries from ${filePath}`);
  } else {
    console.log(`Pattern not found in ${filePath}`);
  }
}

cleanFile('frontend/src/data/fallbackWatches.js');
cleanFile('admin/src/data/fallbackWatches.js');
