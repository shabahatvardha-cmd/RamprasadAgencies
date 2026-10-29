const fs = require('fs');

const files = [
  'frontend/src/data/fallbackWatches.js',
  'admin/src/data/fallbackWatches.js'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\}\s*\{\s*["']id["']:\s*["']citizen-tsuyosa-ice-blue-sunray["']/g, '},\n  {\n    "id": "citizen-tsuyosa-ice-blue-sunray"');
  content = content.replace(/\}\s*\{\s*["']id["']:\s*["']citizen-promaster-navihawk-gps-solar["']/g, '},\n  {\n    "id": "citizen-promaster-navihawk-gps-solar"');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[${filePath}] Fixed commas before Citizen blocks.`);
});
