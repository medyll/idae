#!/usr/bin/env node
// CommonJS version to run under "type":"module" projects
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const registryPath = path.join(root, 'registry', 'registry.json');
const outDir = path.join(root, 'registry');
const outFile = path.join(outDir, 'pmpx-components.json');

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

if (!fs.existsSync(registryPath)) {
  fail(`registry.json not found at ${registryPath}`);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const components = (registry.components || []).map((c) => ({
  name: c.name,
  files: c.files || [],
  dependencies: c.dependencies || [],
  registryDependencies: c.registryDependencies || [],
  publicMetadata: `public/r/${c.name}.json`
}));

const out = {
  generated_at: new Date().toISOString(),
  source: 'registry/registry.json',
  components
};

fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');
console.log(`Wrote ${outFile} (${components.length} components)`);
