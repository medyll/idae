const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Replace "}\n\n}" with "}\n" (remove the double closing brace)
const fixed = content.replace(
  /}\n\n}/,
  '}\n'
);

fs.writeFileSync(filePath, fixed, 'utf8');

console.log('Double brace fixed!');
