const fs = require('fs');

const filePath = 'test/integration/outbox-deliverer.e2e.spec.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Replace the old createSyncAdapter calls with the new API
// Old: createSyncAdapter({ outbox, serializer, ensureUpdatedAt, conflictResolver: new ConflictResolver() })
// New: createSyncAdapter(outbox, undefined, {})

const oldPattern = /createSyncAdapter\s*\{\s*outbox,\s*serializer,\s*ensureUpdatedAt,\s*conflictResolver:\s*new ConflictResolver\(\)\s*\}/g;
const newPattern = 'createSyncAdapter(outbox)';

const newContent = content.replace(oldPattern, newPattern);

fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Tests updated!');
