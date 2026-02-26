#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC_LIB = path.join(ROOT, 'src', 'lib');
// Include 'base' so components under src/lib/base are also scanned
const TARGET_DIRS = ['base', 'controls', 'data', 'navigation', 'ui', 'utils'];

// Regex to capture snippet props (ignoring 'children')
// Accepts optional generics (Snippet<...>), unions (Snippet | undefined),
// trailing commas/semicolons and typical TypeScript formatting.
const SNIPPET_REGEX = /^\s*(?:readonly\s+)?(?<prop>[\w$]+)\s*\??\s*:\s*Snippet\b(?:\s*<[^>]*>)?(?:\s*\|[^;\n]*)?\s*[;,]/gm;

function pascalCase(name) {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

async function fileExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

/**
 * Recovers only .svelte files
 */
async function walk(dir) {
  let results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results = results.concat(await walk(full));
    } else if (e.name.endsWith('.svelte')) {
      results.push(full);
    }
  }
  return results;
}

async function processDirectory(dirName) {
  const dirPath = path.join(SRC_LIB, dirName);
  try {
    const st = await fs.stat(dirPath);
    if (!st.isDirectory()) return { dir: dirName, files: [], missing: [] };
  } catch {
    return { dir: dirName, files: [], missing: [] };
  }

  const files = await walk(dirPath);
  const found = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8').catch(() => '');
    let match;

    // Reset regex index for global search
    SNIPPET_REGEX.lastIndex = 0;

    while ((match = SNIPPET_REGEX.exec(content)) !== null) {
      const prop = match.groups.prop;
      if (prop === 'children') continue;

      const pascal = pascalCase(prop);
      // Expected component in the same directory as the .svelte file
      const expected = path.join(path.dirname(file), `${pascal}.svelte`);
      const exists = await fileExists(expected);

      found.push({
        sourceFile: path.relative(ROOT, file).replace(/\\/g, '/'),
        prop,
        expectedComponent: path.relative(ROOT, expected).replace(/\\/g, '/'),
        exists,
      });
    }
  }

  return { 
    dir: dirName, 
    files: found, 
    missing: found.filter(f => !f.exists) 
  };
}

async function main() {
  const report = [];
  let totalFound = 0;
  let totalMissing = 0;

  for (const d of TARGET_DIRS) {
    const res = await processDirectory(d);
    report.push(res);
    totalFound += res.files.length;
    totalMissing += res.missing.length;
  }

  console.log('\nSnippet props audit report (.svelte files only)');
  console.log('Root:', ROOT);
  console.log('----------------------------------------');

  for (const r of report) {
    if (r.files.length === 0) continue;

    console.log(`\nDirectory: ${r.dir}`);
    for (const f of r.files) {
      const status = f.exists ? '✅ [FOUND]' : '❌ [MISSING]';
      console.log(`  - ${f.sourceFile}: prop '${f.prop}' -> ${f.expectedComponent} ${status}`);
    }
  }

  console.log('\nSummary:');
  console.log(`  - snippet props found : ${totalFound}`);
  console.log(`  - missing components  : ${totalMissing}`);

  if (totalMissing > 0) {
    console.error('\nERROR: Some snippet components are missing.');
    process.exit(1);
  } else {
    console.log('\nAll snippet props have corresponding components. 👍');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(2);
});