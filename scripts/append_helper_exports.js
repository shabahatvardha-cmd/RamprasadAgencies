const fs = require('fs');

const helperCode = `
export const getWatchGender = (w) => {
  if (!w) return 'Unisex';
  if (w.gender) {
    const g = String(w.gender).toLowerCase().trim();
    if (g === 'men' || g === 'man') return 'Men';
    if (g === 'women' || g === 'woman') return 'Women';
    if (g === 'unisex') return 'Unisex';
  }
  const text = \`\${w.name || ''} \${w.description || ''} \${w.appeal || ''} \${w.category || ''} \${w.badge || ''} \${w.collection || ''}\`.toLowerCase();
  if (text.includes('women') || text.includes('woman') || text.includes('ladies') || text.includes('lady') || text.includes('female') || text.includes('raga')) {
    return 'Women';
  }
  if (text.includes('men') || text.includes('gent') || text.includes('gents') || text.includes('male') || text.includes('him')) {
    return 'Men';
  }
  return 'Unisex';
};
`;

['frontend/src/data/fallbackWatches.js', 'admin/src/data/fallbackWatches.js'].forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('export const getWatchGender')) {
    content += '\n' + helperCode;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Appended getWatchGender to ${filePath}`);
  } else {
    console.log(`getWatchGender already exists in ${filePath}`);
  }
});
