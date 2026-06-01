const fs = require('fs');

const filePath = 'src/lib/SyncAdapter.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Read the file line by line
const lines = content.split('\n');

// Find the start of the overload signatures
let overloadStart = -1;
let overloadEnd = -1;
let implStart = -1;
let implEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Overload signatures for createSyncAdapter')) {
    overloadStart = i;
  }
  if (overloadStart !== -1 && i > overloadStart && lines[i] === '' && overloadEnd === -1) {
    // Check if next line is '// Implementation'
    if (i + 1 < lines.length && lines[i + 1].includes('// Implementation')) {
      overloadEnd = i;
    }
  }
  if (lines[i].includes('// Implementation')) {
    implStart = i;
  }
}

// Find the end of the createSyncAdapter function (the closing })
if (implStart !== -1) {
  let braceCount = 0;
  let inFunction = false;
  for (let i = implStart; i < lines.length; i++) {
    if (lines[i].includes('export function createSyncAdapter')) {
      inFunction = true;
    }
    if (inFunction) {
      // Count braces
      const openBraces = (lines[i].match(/\{/g) || []).length;
      const closeBraces = (lines[i].match(/\}/g) || []).length;
      braceCount += openBraces - closeBraces;
      if (braceCount === 0 && openBraces === 0 && closeBraces > 0) {
        implEnd = i;
        break;
      }
    }
  }
}

console.log('Overload start:', overloadStart);
console.log('Overload end:', overloadEnd);
console.log('Impl start:', implStart);
console.log('Impl end:', implEnd);

if (overloadStart === -1 || implEnd === -1) {
  console.error('Could not find the sections to replace');
  process.exit(1);
}

// Build the new content
const beforeOverloads = lines.slice(0, overloadStart).join('\n');
const afterImpl = lines.slice(implEnd + 1).join('\n');

// The new simplified factory function
const newFactory = `// Factory function
export function createSyncAdapter(
  outbox: OutboxStore,
  deliverer?: IDeliverer,
  opts?: SyncAdapterOptions
): SyncAdapter {
  const modeConfig = opts?.mode || opts?.collectionModes
    ? { mode: opts?.mode, collectionModes: opts?.collectionModes }
    : undefined;
  return new SyncAdapter(
    outbox,
    deliverer,
    opts?.intervalMs ?? 5000,
    opts?.onConflict,
    modeConfig,
    opts ?? {}
  );
}`;

const newContent = beforeOverloads + '\n' + newFactory + '\n' + afterImpl;

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Overload signatures removed successfully!');
