const fs = require('fs');
const content = fs.readFileSync('frontend/src/data/fallbackWatches.js', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.match(/['"]?brand['"]?:\s*['"]Omega['"]/i)) {
    console.log(i + 1, l.trim());
  }
});
