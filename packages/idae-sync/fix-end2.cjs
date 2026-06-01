const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Find the last occurrence of "return new SyncAdapter(" in the factory function
const lastReturnIdx = content.lastIndexOf('return new SyncAdapter(');

if (lastReturnIdx === -1) {
  console.error('Could not find return statement');
  process.exit(1);
}

// Find the end of the return statement (the line with });)
const afterReturn = content.substring(lastReturnIdx);
const endOfReturnIdx = lastReturnIdx + afterReturn.indexOf(');') + 2;

console.log('End of return index:', endOfReturnIdx);
console.log('Content after return:', afterReturn.substring(0, 200));

// The correct ending
const correctEnding = `
  );
}
`;

const newContent = content.substring(0, endOfReturnIdx) + correctEnding;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('File end fixed correctly!');
