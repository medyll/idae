#!/usr/bin/env node
// Scan src/lib for .svelte components and generate a shadcn-style registry
const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');

const root = path.resolve(__dirname, '..');

// CLI arg parsing (supports --key=value or --key value)
const rawArgs = process.argv.slice(2);
const args = {};
for (let i = 0; i < rawArgs.length; i++) {
  const a = rawArgs[i];
  if (a.startsWith('--')) {
    const eq = a.indexOf('=');
    if (eq !== -1) {
      const k = a.slice(2, eq);
      const v = a.slice(eq + 1);
      args[k] = v;
    } else {
      const k = a.slice(2);
      const next = rawArgs[i + 1];
      if (next && !next.startsWith('--')) {
        args[k] = next;
        i++;
      } else {
        args[k] = true;
      }
    }
  }
}

const srcLib = path.resolve(args['src-lib'] || path.join(root, 'src', 'lib'));
const outDir = path.resolve(args['out-dir'] || path.join(root, 'registry'));
const publicDir = path.resolve(args['public-dir'] || path.join(root, 'public', 'r'));
const registryOut = path.join(outDir, args['registry-out'] || 'registry-from-lib.json');
const canonicalRegistry = path.join(outDir, args['canonical-registry'] || 'registry.json');
const pmpxOut = path.join(outDir, args['pmpx-out'] || 'pmpx-components.json');

const defaultExcludes = ['**/*.demo.svelte', '**/*.preview.svelte', '**/_*', '**/*.spec.svelte', '**/*.test.svelte'];
const userExcludes = (args['exclude'] || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const excludePatterns = [...defaultExcludes, ...userExcludes];

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

const allFiles = walk(srcLib);
const svelteFiles = allFiles.filter((f) => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (micromatch.isMatch(rel, excludePatterns)) return false;
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
console.log(`Options: src-lib=${srcLib}, out-dir=${outDir}, public-dir=${publicDir}`);
if (userExcludes.length) console.log(`User excludes: ${userExcludes.join(',')}`);
