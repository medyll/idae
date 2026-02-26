#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pascalize = (name) => name
  .replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, ch) => ch.toUpperCase())
  .replace(/[^a-zA-Z0-9]/g, '');

const camelize = (name) => {
  const p = pascalize(name);
  return p.charAt(0).toLowerCase() + p.slice(1);
};

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

// ---------------------------------------------------------------------------
// SCRIPT DESCRIPTION
// Shown at the top of the generated COMPONENT_MAP.md and in the console.
// ---------------------------------------------------------------------------
const DESCRIPTION = `
This file is auto-generated and intended for AI consumption.
It provides a full compliance snapshot of the Svelte component library,
helping the AI identify which components need attention and prioritize the next task to work on.
Each row represents a component. Each column indicates whether a specific convention is met.
A ❌ cell flags a violation to fix. A ─ cell means the rule does not apply to that component.
The global score at the bottom reflects the overall compliance level of the library.

Conventions checked:
- Props type must be defined inline in the component (not imported from ./types)
- types.ts must exist and export DemoValues
- Style blocks must use lang="postcss" and @reference "tailwindcss"
- No external .css file imports are allowed
`.trim();

// ---------------------------------------------------------------------------
// COLUMN DEFINITIONS
// Each column describes:
//   - key        : unique identifier, used as report key
//   - label      : header label shown in table and console
//   - legend     : description shown in the legend section
//   - fix        : fix instruction shown in the error report (markdown)
//   - consoleFix : short fix hint shown in the console error report
//   - validator  : (r) => '✅' | '❌' | '─'
//                  Receives the raw parsed data from analyzeComponent.
//                  Contains the actual test logic (regex, boolean check, etc.).
//                  Single source of truth: drives cell display, error detection, and scoring.
//                  '─' means not applicable (excluded from score).
//   - errorLabel : optional (r) => string to customise the error list item
// ---------------------------------------------------------------------------
const COLUMNS = [
  {
    key: 'internal',
    label: 'Int.',
    legend: '**Int.** (Internal): The `Props` type must be used within the Svelte component body.',
    fix: 'Add the component Props definition inside a `<script module>` tag.',
    consoleFix: 'Add Props to <script module>',
    validator: ({ bodyOnly, typeName }) =>
      new RegExp(`\\b${typeName}\\b`).test(bodyOnly) ? '✅' : '❌',
  },
  {
    key: 'external',
    label: 'Ext.',
    legend: '**Ext.** (External): The `Props` type must **not** be imported from `./types.ts`.',
    fix: 'Remove the import from `./types`.',
    consoleFix: 'Remove import from ./types',
    validator: ({ content, typeName }) =>
      new RegExp(`import\\s+[^>]*?\\b${typeName}\\b[^>]*?from\\s+['"]\\./types['"]`).test(content) ? '❌' : '✅',
  },
  {
    key: 'type',
    label: 'Type',
    legend: '**Type**: The `Props` type must **not** be declared in the `types.ts` file.',
    fix: 'Delete the `ComponentProps` from `types.ts`.',
    consoleFix: 'Delete Props from types.ts',
    validator: ({ isSnippet, typesContent, typeName }) => {
      if (isSnippet) return '─';
      if (!typesContent) return '✅';
      return new RegExp(`(?:export\\s+)?(?:type|interface)\\s+${typeName}\\b`).test(typesContent) ? '❌' : '✅';
    },
  },
  {
    key: 'file',
    label: 'File',
    legend: '**File**: The `types.ts` file must exist in the component folder.',
    fix: 'Create the `types.ts` file with `export {};`.',
    consoleFix: "Create types.ts with 'export {}'",
    validator: ({ typesContent }) => typesContent !== null ? '✅' : '❌',
  },
  {
    key: 'demo',
    label: 'Demo',
    legend: '**Demo**: `[component]DemoValues` must be exported from `types.ts`.',
    fix: 'Export the missing `componentDemoValues` from `types.ts`.',
    consoleFix: 'Export componentDemoValues from types.ts',
    validator: ({ typesContent, dPascal, dCamel }) => {
      if (!typesContent) return '❌';
      return new RegExp(`export\\s+(?:const|let|var)\\s+(${dPascal}|${dCamel})\\b`).test(typesContent) ? '✅' : '❌';
    },
    errorLabel: (r) => `${r.file} (Expected: ${r.dCamel})`,
  },
  {
    key: 'postcss',
    label: 'PostCss',
    legend: '**PostCss**: Component must use `lang="postcss"` on at least one `<style>` tag when a style is present.',
    fix: 'Add `lang="postcss"` to the component\'s `<style>` tag.',
    consoleFix: 'Add lang="postcss" to the <style> tag',
    validator: ({ styleMatches }) => {
      if (!styleMatches.length) return '─';
      return styleMatches.some(m => /\blang\s*=\s*(['"])postcss\1/i.test(m[1] || '')) ? '✅' : '❌';
    },
  },
  {
    key: 'reference',
    label: 'Ref',
    legend: '**Ref**: The `<style>` content must include `@reference "tailwindcss"` when a style is present.',
    fix: 'Add `@reference "tailwindcss"` to the style content.',
    consoleFix: 'Add @reference "tailwindcss" to the style content',
    validator: ({ styleMatches }) => {
      if (!styleMatches.length) return '─';
      return styleMatches.some(m => /@reference\s*(['"])\s*tailwindcss\s*\1/i.test(m[2] || '')) ? '✅' : '❌';
    },
  },
  {
    key: 'css',
    label: 'Css',
    legend: '**Css**: The `<style>` must NOT import external `.css` files or use `url(...)` (presence = ❌).',
    fix: 'Remove external `.css` imports from the component style.',
    consoleFix: 'Remove @import of external .css or replace with postcss workflow',
    validator: ({ styleMatches }) => {
      if (!styleMatches.length) return '─';
      return styleMatches.some(m => /@import\s+url\([^)]*\)|@import\s+['"][^'"]+\.css['"]|@use\s+['"][^'"]+\.css['"]/i.test(m[2] || '')) ? '❌' : '✅';
    },
    errorLabel: (r) => `${r.file} (contains external CSS import)`,
  },
];

// Count passing checks for a result row (─ = not applicable = excluded from total)
function countChecks(r) {
  let total = 0, success = 0;
  for (const col of COLUMNS) {
    const val = col.validator(r);
    if (val === '─') continue;
    total++;
    if (val === '✅') success++;
  }
  return { total, success };
}

async function analyzeComponent(file, repoRoot, start) {
  const content = await fs.readFile(file, 'utf8');
  const isSnippet = /snippet[\s\S]*?component|component[\s\S]*?snippet/i.test(content);
  const relPath = path.relative(start, file);
  const rootDir = relPath.split(path.sep)[0] || '.';
  const baseName = path.basename(file, '.svelte');
  const typeName = pascalize(baseName) + 'Props';
  const dPascal = pascalize(baseName) + 'DemoValues';
  const dCamel = camelize(baseName) + 'DemoValues';
  const typesPath = path.join(path.dirname(file), 'types.ts');
  const bodyOnly = content.replace(/import\s+[\s\S]*?from\s+.*?/g, '');
  const styleMatches = [...content.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/ig)];

  let typesContent = null;
  try { typesContent = await fs.readFile(typesPath, 'utf8'); } catch (e) {}

  return {
    file: path.relative(repoRoot, file),
    rootDir,
    isSnippet,
    content,
    bodyOnly,
    typeName,
    dPascal,
    dCamel,
    typesContent,
    styleMatches,
  };
}

function buildMarkdown(groups, totalSuccess, totalChecks) {
  const globalScore = ((totalSuccess / totalChecks) * 100).toFixed(1);
  const progressBar = '█'.repeat(Math.floor(globalScore / 5)) + '░'.repeat(20 - Math.floor(globalScore / 5));

  const colHeaders = COLUMNS.map(c => c.label).join(' | ');
  const colSep = COLUMNS.map(() => ':---:').join(' | ');

  let md = '# Component Map\n\n';
  md += `> ${DESCRIPTION.split('\n').join('\n> ')}\n\n`;
  md += 'you can update this files status by running the code\n\n```powershell\nnode ./scripts/make-component-maps.js\n```\n\n';
  md += '### Legend\n- ✅ : Requirement met / No error\n- ❌ : Requirement not met / Error detected\n- ─ : Not applicable (Snippet or no style)\n\n';
  md += '### Columns\n' + COLUMNS.map(c => `- ${c.legend}`).join('\n') + '\n- **Sc.**: Snippet component.\n\n';
  md += '### Fixes\n' + COLUMNS.map(c => `- **${c.label}:** ${c.fix}`).join('\n') + '\n\n';
  md += `| File | ${colHeaders} | Sc. |\n| :--- | ${colSep} | :---: |\n`;

  for (const [groupName, files] of Object.entries(groups)) {
    md += `| **${groupName.toUpperCase()}** | ${COLUMNS.map(() => '').join(' | ')} | |\n`;
    for (const r of files) {
      const cols = COLUMNS.map(col => col.validator(r)).join(' | ');
      const sc = r.isSnippet ? '[snippet]' : '';
      md += `| \`${r.file}\` | ${cols} | ${sc} |\n`;
    }
  }

  md += `\n\n## Global Compliance Index\n**Score: ${globalScore}%**\n\`${progressBar}\` (${totalSuccess}/${totalChecks} passed)\n\n---\n\n## Error Report (❌ Items)\n\n`;

  for (const col of COLUMNS) {
    const errors = Object.values(groups).flat().filter(r => col.validator(r) === '❌');
    const items = errors.map(r => col.errorLabel ? col.errorLabel(r) : r.file);
    md += `### ${col.label}\n**Fix:** ${col.fix}\n\n${items.length ? items.map(f => `- \`${f}\``).join('\n') : '_None_'}\n\n`;
  }

  return { md, globalScore, progressBar, totalSuccess, totalChecks };
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const start = path.join(repoRoot, 'src', 'lib');
  const groups = {};

  for await (const file of walk(start)) {
    const filename = path.basename(file);
    if (!file.endsWith('.svelte') || filename.includes('.demo.') || filename.includes('preview')) continue;

    const r = await analyzeComponent(file, repoRoot, start);
    if (!groups[r.rootDir]) groups[r.rootDir] = [];
    groups[r.rootDir].push(r);
  }

  // --- Console output ---
  console.log(`\n${'='.repeat(60)}`);
  console.log(DESCRIPTION);
  console.log(`${'='.repeat(60)}\n`);
  let totalChecks = 0, totalSuccess = 0;
  const colWidth = COLUMNS.map(c => Math.max(c.label.length, 3));
  const headerLine = COLUMNS.map((c, i) => c.label.padEnd(colWidth[i])).join(' | ');

  for (const [groupName, files] of Object.entries(groups)) {
    let gChecks = 0, gSuccess = 0;
    console.log(`\n=== FOLDER: ${groupName.toUpperCase()} ===`);
    console.log(`${'File'.padEnd(50)} | ${headerLine} | Sc.`);
    console.log('-'.repeat(140));

    for (const r of files) {
      const cols = COLUMNS.map((c, i) => c.validator(r).padEnd(colWidth[i])).join(' | ');
      const sc = r.isSnippet ? '[snippet]' : '';
      console.log(`${r.file.padEnd(50)} | ${cols} | ${sc}`);

      const { total, success } = countChecks(r);
      gChecks += total; gSuccess += success;
    }

    const gScore = ((gSuccess / gChecks) * 100).toFixed(1);
    console.log(`\n> Folder Score: ${gScore}% (${gSuccess}/${gChecks})\n`);
    totalChecks += gChecks; totalSuccess += gSuccess;
  }

  const globalScore = ((totalSuccess / totalChecks) * 100).toFixed(1);
  const progressBar = '█'.repeat(Math.floor(globalScore / 5)) + '░'.repeat(20 - Math.floor(globalScore / 5));
  console.log(`\n${'='.repeat(30)}\nGLOBAL SCORE: ${globalScore}% [${progressBar}]\n${totalSuccess}/${totalChecks} passed\n${'='.repeat(30)}`);

  for (const col of COLUMNS) {
    const errors = Object.values(groups).flat().filter(r => col.validator(r) === '❌');
    if (errors.length > 0) {
      console.log(`\n[!] ${col.label.toUpperCase()} (Fix: ${col.consoleFix}):`);
      errors.forEach(r => console.log(`  - ${col.errorLabel ? col.errorLabel(r) : r.file}`));
    }
  }

  // --- Markdown output ---
  const { md } = buildMarkdown(groups, totalSuccess, totalChecks);
  await fs.writeFile(path.join(repoRoot, 'COMPONENT_MAP.md'), md);
  console.log(`\n📄 COMPONENT_MAP.md updated.`);
}

main().catch(console.error);