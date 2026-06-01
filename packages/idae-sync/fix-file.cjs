const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// Find the line where the duplicate starts
// It starts with "  deliverer?: IDeliverer," after the factory function
let duplicateStart = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '  deliverer?: IDeliverer,' && i > 480) {
    duplicateStart = i - 1; // Include the line before
    break;
  }
}

console.log('Duplicate starts at line:', duplicateStart + 1);

if (duplicateStart === -1) {
  console.error('Could not find duplicate');
  process.exit(1);
}

// Remove everything from duplicateStart onwards
const newLines = lines.slice(0, duplicateStart);

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('Duplicate removed successfully!');
