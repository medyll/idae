const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// Remove line 475 (0-indexed 474) which is the extra } 
const newLines = [...lines.slice(0, 474), ...lines.slice(475)];

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('Line 475 removed!');
