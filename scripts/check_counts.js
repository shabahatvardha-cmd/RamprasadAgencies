const fs = require('fs');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const brandCounts = {};
  for (const line of content.split('\n')) {
    const brandMatch = line.match(/['"]?brand['"]?:\s*['"]([^'"]+)['"]/);
    if (brandMatch) {
      const b = brandMatch[1];
      brandCounts[b] = (brandCounts[b] || 0) + 1;
    }
  }
  console.log(`Counts for ${filePath}:`);
  for (const b in brandCounts) {
    console.log(`  - ${b}: ${brandCounts[b]} watches`);
  }
  console.log(`  Total: ${Object.values(brandCounts).reduce((a, b) => a + b, 0)}\n`);
}

checkFile('frontend/src/data/fallbackWatches.js');
checkFile('admin/src/data/fallbackWatches.js');
