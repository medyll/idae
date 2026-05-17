const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Remove the extra quote-character at the end
const fixed = content.replace(/\}");\s*$/, '}\n');

fs.writeFileSync(filePath, fixed, 'utf8');

console.log('Fixed!');
