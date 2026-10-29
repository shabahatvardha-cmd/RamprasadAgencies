const fs = require('fs');
const content = fs.readFileSync('frontend/src/data/fallbackWatches.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  const match = l.match(/['"]?brand['"]?:\s*['"]Titan['"]/);
  if (match) {
    console.log(i + 1, l.trim());
  }
});
