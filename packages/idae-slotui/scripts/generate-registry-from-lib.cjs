#!/usr/bin/env node
// Scan src/lib for .svelte components and generate a shadcn-style registry
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcLib = path.join(root, 'src', 'lib');
const outDir = path.join(root, 'registry');
const publicDir = path.join(root, 'public', 'r');
const registryOut = path.join(outDir, 'registry-from-lib.json');
const pmpxOut = path.join(outDir, 'pmpx-components.json');

function camelToKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      // skip compiled/style folders
      if (['slotui-css', 'css', 'styles', 'test', 'docs'].includes(name)) continue;
      files.push(...walk(p));
    } else if (stat.isFile() && name.endsWith('.svelte')) {
      files.push(p);
    }
  }
  return files;
}

if (!fs.existsSync(srcLib)) {
  console.error('src/lib not found, aborting');
  process.exit(1);
}

// Exclude demo/preview files
const svelteFiles = walk(srcLib).filter(f => {
  const base = path.basename(f).toLowerCase();
  if (base.endsWith('.demo.svelte') || base.endsWith('.preview.svelte')) return false;
  if (base.startsWith('_')) return false;
  return true;
});
const components = svelteFiles.map((fullPath) => {
  const rel = path.relative(root, fullPath).replace(/\\/g, '/');
  const base = path.basename(fullPath, '.svelte');
  const name = camelToKebab(base);
  return {
    name,
    source: rel,
    files: [{ path: rel, type: 'registry:ui' }],
    dependencies: [],
    registryDependencies: []
  };
});

const registry = {
  name: 'idae-slotui-svelte-lib-registry',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  components
};

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(registryOut, JSON.stringify(registry, null, 2), 'utf8');

// Also write canonical registry/registry.json so downstream scripts (make-pnpx) can use it
const canonicalRegistry = path.join(outDir, 'registry.json');
fs.writeFileSync(canonicalRegistry, JSON.stringify(registry, null, 2), 'utf8');

// generate per-component public metadata and pmpx summary
const pmpx = { generated_at: registry.generated_at, source: 'src/lib', components: [] };
for (const c of components) {
  const meta = {
    name: c.name,
    title: c.name,
    description: `Component generated from ${c.source}`,
    files: c.files.map(f => f.path),
    dependencies: c.dependencies,
    keywords: ['svelte', 'component']
  };
  const metaPath = path.join(publicDir, `${c.name}.json`);
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
  pmpx.components.push({ name: c.name, files: c.files, dependencies: c.dependencies, publicMetadata: `public/r/${c.name}.json` });
}

fs.writeFileSync(pmpxOut, JSON.stringify(pmpx, null, 2), 'utf8');
console.log(`Generated registry with ${components.length} components at ${registryOut}`);
