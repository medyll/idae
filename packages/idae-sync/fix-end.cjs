const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

// Find the line with "opts ?? {}" inside the return statement
// Then add the closing braces
let lastGoodLine = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('opts ?? {}')) {
    lastGoodLine = i + 1; // The next line should be ");" but it's corrupted
    break;
  }
}

console.log('Last good line:', lastGoodLine);

// Build the correct ending
const ending = [
  '    opts ?? {}',
  '  );',
  '}',
  '',
];

const newLines = lines.slice(0, lastGoodLine).concat(ending);

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');

console.log('File end fixed!');
