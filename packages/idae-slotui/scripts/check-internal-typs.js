#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pascalize = (name) => name
  .replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, ch) => ch.toUpperCase())
  .replace(/[^a-zA-Z0-9]/g, '');

async function* walk(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const res = path.resolve(dir, ent.name);
      if (ent.isDirectory()) yield* walk(res);
      else yield res;
    }
  } catch (e) {}
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const start = path.join(repoRoot, 'src', 'lib');
  const groups = {};

  for await (const file of walk(start)) {
    const filename = path.basename(file);
    if (!file.endsWith('.svelte') || filename.includes('.demo.') || filename.includes('preview')) continue;

    const content = await fs.readFile(file, 'utf8');
    
    // Detects snippet component even in JSDoc/comments
    const isSnippet = /snippet[\s\S]*?component|component[\s\S]*?snippet/i.test(content);

    const relPath = path.relative(start, file);
    const rootDir = relPath.split(path.sep)[0] || '.';
    
    const typeName = pascalize(path.basename(file, '.svelte')) + 'Props';
    const typesPath = path.join(path.dirname(file), 'types.ts');
    
    let typesFileExists = false;
    let presentInTypes = false;

    try {
      const typesContent = await fs.readFile(typesPath, 'utf8');
      typesFileExists = true;
      presentInTypes = new RegExp(`(?:export\\s+)?(?:type|interface)\\s+${typeName}\\b`).test(typesContent);
    } catch (e) {}

    const externalUse = new RegExp(`import\\s+[^>]*?\\b${typeName}\\b[^>]*?from\\s+['"]\\./types['"]`).test(content);
    const bodyOnly = content.replace(/import\s+[\s\S]*?from\s+.*?/g, '');
    const internalUse = new RegExp(`\\b${typeName}\\b`).test(bodyOnly);

    if (!groups[rootDir]) groups[rootDir] = [];
    groups[rootDir].push({
      file: path.relative(repoRoot, file),
      internal: internalUse,
      external: externalUse,
      inTypes: presentInTypes,
      hasFile: typesFileExists,
      isSnippet
    });
  }

  
    console.log();
    console.log(`- Int : Internal usage | Ext. : Imported from ./types | Type : Declared in types.ts | File : types.ts exists | Sc. : Snippet Component`);
    console.log();
    console.log();

  for (const [groupName, files] of Object.entries(groups)) {
    console.log(`\n=== FOLDER: ${groupName.toUpperCase()} ===`);
    console.log(`${'File'.padEnd(50)} | Int. | Ext. | Type | File | Sc.`);
    console.log('-'.repeat(110));

    for (const r of files) {
      const col1 = (r.internal ? '✅' : '❌').padEnd(4);
      const col2 = (r.external ? '❌' : '✅').padEnd(4);
      
      // If snippet, show horizontal bar instead of status
      const col3 = (r.isSnippet ? ' ─ ' : (r.inTypes ? '✅' : '❌')).padEnd(4);
      
      const col4 = (r.hasFile ? '✅' : '❌').padEnd(4);
      const colSc = r.isSnippet ? '[snippet]' : ''.padEnd(9);
      
      console.log(`${r.file.padEnd(50)} |  ${col1} |  ${col2} |  ${col3} |  ${col4} | ${colSc}`);
      console.log();
    }
  }
}

main().catch(console.error);