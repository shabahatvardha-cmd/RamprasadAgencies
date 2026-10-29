const fs = require('fs');

['frontend', 'admin'].forEach(dir => {
  const filePath = `${dir}/src/data/fallbackWatches.js`;
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/export const fallbackWatches = (\[[\s\S]*?\]);/);
  if (!match) {
    console.log(`Could not parse ${filePath}`);
    return;
  }
  const watches = eval(match[1]);
  const breitling = watches.filter(w => w.brand && w.brand.toLowerCase() === 'breitling');
  console.log(`${dir} total Breitling count: ${breitling.length}`);
  breitling.forEach((w, i) => console.log(`  ${i+1}. id=${w.id}, name=${w.name}`));
});
