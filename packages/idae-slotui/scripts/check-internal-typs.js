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

    const isImported = new RegExp(`import\\s+[^>]*?\\b${typeName}\\b[^>]*?from\\s+['"]\\./types['"]`).test(content);
    const bodyOnly = content.replace(/import\s+[\s\S]*?from\s+.*?/g, '');
    const internalUse = new RegExp(`\\b${typeName}\\b`).test(bodyOnly);

    if (!groups[rootDir]) groups[rootDir] = [];
    groups[rootDir].push({
      file: path.relative(repoRoot, file),
      internal: internalUse,
      externalError: !isImported,
      inTypes: presentInTypes,
      hasFile: typesFileExists,
      isSnippet
    });
  }

  let md = '# Component Map\n\n';
  md += '### Legend\n';
  md += '- ✅ : Requirement met / No error\n';
  md += '- ❌ : Requirement not met / Error detected\n';
  md += '- ─ : Not applicable (Snippet)\n\n';
  md += '### Columns\n';
  md += '- **Int.** (Internal): The `Props` type is used within the Svelte component body.\n';
  md += '- **Ext.** (External): The `Props` type is **not** imported from `./types.ts`.\n';
  md += '- **Type**: The `Props` type is declared in the `types.ts` file.\n';
  md += '- **File**: The `types.ts` file exists in the component folder.\n';
  md += '- **Sc.**: Snippet component (contains "snippet component" in its documentation).\n\n';

  md += '| File | Int. | Ext. | Type | File | Sc. |\n';
  md += '| :--- | :---: | :---: | :---: | :---: | :---: |\n';

  for (const [groupName, files] of Object.entries(groups)) {
    // Console Header
    console.log(`\n=== FOLDER: ${groupName.toUpperCase()} ===`);
    console.log(`${'File'.padEnd(50)} | Int. | Ext. | Type | File | Sc.`);
    console.log(`- Int : Internal usage | Ext. : Not imported | Type : In types.ts | File : types.ts exists | Sc. : Snippet`);
    console.log('-'.repeat(105));

    md += `| **${groupName.toUpperCase()}** | | | | | |\n`;

    for (const r of files) {
      const col1 = r.internal ? '✅' : '❌';
      const col2 = r.externalError ? '✅' : '❌';
      const col3 = r.isSnippet ? '─' : (r.inTypes ? '✅' : '❌');
      const col4 = r.hasFile ? '✅' : '❌';
      const colSc = r.isSnippet ? '[snippet]' : ''.padEnd(9);
      
      console.log(`${r.file.padEnd(50)} |  ${col1.padEnd(3)} |  ${col2.padEnd(3)} |  ${col3.padEnd(3)} |  ${col4.padEnd(3)} | ${colSc}`);
      console.log();

      md += `| \`${r.file}\` | ${col1} | ${col2} | ${col3} | ${col4} | ${colSc} |\n`;
    }
  }

  await fs.writeFile(path.join(repoRoot, 'COMPONENT_MAP.md'), md);
  console.log(`\n📄 COMPONENT_MAP.md updated.`);
}

main().catch(console.error);