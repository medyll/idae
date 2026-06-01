const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// Find the first occurrence of the factory function end (line with just "}")
// Then find the next line that starts with "  deliverer?" which is the duplicate
let factoryEnd = -1;
let duplicateStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '}' && factoryEnd === -1 && i > 470) {
    factoryEnd = i;
  }
  if (factoryEnd !== -1 && duplicateStart === -1 && lines[i].trim().startsWith('deliverer?:')) {
    duplicateStart = i - 1; // Start removing from the line before (empty line)
  }
}

console.log('Factory ends at line:', factoryEnd + 1);
console.log('Duplicate starts at line:', duplicateStart + 1);

if (duplicateStart === -1) {
  console.error('Could not find duplicate');
  // Maybe it's already clean?
  console.log('File might already be clean');
  process.exit(0);
}

// Remove everything from duplicateStart onwards
const newLines = lines.slice(0, duplicateStart);

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('Duplicate removed successfully!');
