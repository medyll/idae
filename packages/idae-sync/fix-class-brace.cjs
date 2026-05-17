const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Replace "// Factory function" with "}\n\n// Factory function"
const fixed = content.replace(
  '// Factory function',
  '}\n\n// Factory function'
);

fs.writeFileSync(filePath, fixed, 'utf8');

console.log('Class brace added!');
