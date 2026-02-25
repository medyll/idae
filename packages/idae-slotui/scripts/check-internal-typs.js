#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Standard PascalCase conversion
 */
const pascalize = (name) => name
  .replace(/(^|[^a-zA-Z0-9]+)([a-zA-Z0-9])/g, (_, __, ch) => ch.toUpperCase())
  .replace(/[^a-zA-Z0-9]/g, '');

/**
 * Standard camelCase conversion
 */
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

/**
 * Main entrypoint that scans the component library and generates
 * a compliance report about internal/external type usage and demo values.
 *
 * This function performs a recursive walk of `src/lib` and examines
 * each `.svelte` component (excluding demo/preview files). For each
 * component it computes a small checklist:
 *  - whether the `<ComponentName>Props` type is referenced internally
 *  - whether that type is incorrectly imported from `./types`
 *  - whether a `types.ts` file exists in the component folder
 *  - whether the `componentDemoValues` export exists in `types.ts`
 *
 * It prints a formatted table to the console and writes a markdown
 * file `COMPONENT_MAP.md` summarizing the findings.
 *
 * Note: this function is intentionally side-effecting (console + file write).
 * It does not return a value but throws on unexpected filesystem errors.
 *
 * @returns {Promise<void>} Resolves when scanning and file write complete.
 */
async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const start = path.join(repoRoot, 'src', 'lib');
  /* @type {Record<string, Array<{ file: string, internal: boolean, externalError: boolean, typeError: boolean, hasFile: boolean, isSnippet: boolean, hasDemoValues: boolean, demoName: string }>>>} */
  const groups = {};
  let totalChecks = 0;
  let totalSuccess = 0;

  // Walk the directory tree and process each file asynchronously.
  // We use the `walk` async generator defined above.
  for await (const file of walk(start)) {
    // Only analyze Svelte components; skip demos/previews used by docs.
    const filename = path.basename(file);
    if (!file.endsWith('.svelte') || filename.includes('.demo.') || filename.includes('preview')) continue;

    // Read component source to run a few regex-based checks.
    const content = await fs.readFile(file, 'utf8');

    // Determine whether this is a snippet-style component (special handling).
    // The pattern searches for the words "snippet" and "component" near each other.
    const isSnippet = /snippet[\s\S]*?component|component[\s\S]*?snippet/i.test(content);

    // Compute grouping path and common derived names used for type checks.
    const relPath = path.relative(start, file);
    const rootDir = relPath.split(path.sep)[0] || '.';

    // Base filename (without extension) and derived type/demo names.
    const baseName = path.basename(file, '.svelte');
    const typeName = pascalize(baseName) + 'Props';
    const dPascal = pascalize(baseName) + 'DemoValues';
    const dCamel = camelize(baseName) + 'DemoValues';

    // Path to an adjacent `types.ts` file that may exist for the component.
    const typesPath = path.join(path.dirname(file), 'types.ts');

    // Flags we will compute below
    let typesFileExists = false;
    let presentInTypes = false; // whether the Props type is declared in types.ts
    let hasDemoValues = false; // whether the DemoValues export exists in types.ts

    // Attempt to read `types.ts` if present and evaluate a couple of checks.
    try {
      const typesContent = await fs.readFile(typesPath, 'utf8');
      typesFileExists = true;

      // Check if the Props type is still declared inside types.ts (it shouldn't be).
      presentInTypes = new RegExp(`(?:export\\s+)?(?:type|interface)\\s+${typeName}\\b`).test(typesContent);

      // Check whether either Pascal or camel DemoValues export exists.
      hasDemoValues = new RegExp(`export\\s+(?:const|let|var)\\s+(${dPascal}|${dCamel})\\b`).test(typesContent);
    } catch (e) {
      // Missing file is expected for many components; swallow errors here.
    }

    // Check whether the Svelte file imports the Props type from ./types
    // (we flag that as an external-error if it does import it).
    const isImported = new RegExp(`import\\s+[^>]*?\\b${typeName}\\b[^>]*?from\\s+['"]\\./types['"]`).test(content);

    // To test internal usage we remove import lines then search the remaining
    // body for occurrences of the Props type name (avoids false positives).
    const bodyOnly = content.replace(/import\s+[\s\S]*?from\s+.*?/g, '');
    const internalUse = new RegExp(`\\b${typeName}\\b`).test(bodyOnly);

    // Group results by the top-level folder and store a concise result object.
    if (!groups[rootDir]) groups[rootDir] = [];
    groups[rootDir].push({
      file: path.relative(repoRoot, file),
      internal: internalUse,
      externalError: !isImported,
      typeError: presentInTypes,
      hasFile: typesFileExists,
      isSnippet,
      hasDemoValues,
      demoName: dCamel
    });
  }

  let md = '# Component Map\n\n';
  md += '### Legend\n- ✅ : Requirement met / No error\n- ❌ : Requirement not met / Error detected\n- ─ : Not applicable (Snippet)\n\n';
  md += '### Columns\n- **Int.** (Internal): The `Props` type must be used within the Svelte component body.\n- **Ext.** (External): The `Props` type must **not** be imported from `./types.ts`.\n- **Type**: The `Props` type must **not** be declared in the `types.ts` file.\n- **File**: The `types.ts` file must exist in the component folder.\n- **Demo**: `[component]DemoValues` must be exported from `types.ts`.\n- **Sc.**: Snippet component.\n\n';
  md += '### Fixes\n- **If Int. is ❌**: Add the component Props definition inside a `<script module>` tag.\n- **If Type is ❌**: Delete the `ComponentProps` from `types.ts`.\n- **If File is ❌**: Create the `types.ts` file with `export {};`.\n- **If Demo is ❌**: Export `[component]DemoValues` from `types.ts`.\n\n';
  md += '| File | Int. | Ext. | Type | File | Demo | Sc. |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n';

  const report = { internal: [], external: [], type: [], file: [], demo: [] };

  /* drawing of the table */
  for (const [groupName, files] of Object.entries(groups)) {
    let gChecks = 0, gSuccess = 0;
    console.log(`\n=== FOLDER: ${groupName.toUpperCase()} ===`);
    console.log(`${'File'.padEnd(50)} | Int. | Ext. | Type | File | Demo | Sc.`);
    console.log('-'.repeat(115));
    md += `| **${groupName.toUpperCase()}** | | | | | | |\n`;
    /* drawing of the rows */
    for (const r of files) {
      const col_internal = r.internal ? '✅' : '❌';
      const col_external = r.externalError ? '✅' : '❌';
      const col_type = r.isSnippet ? '─' : (!r.typeError ? '✅' : '❌');
      const col_file = r.hasFile ? '✅' : '❌';
      const col_demo = r.hasDemoValues ? '✅' : '❌';
      const col_sc = r.isSnippet ? '[snippet]' : '';

      if (!r.internal) report.internal.push(r.file);
      if (!r.externalError) report.external.push(r.file);
      if (!r.isSnippet && r.typeError) report.type.push(r.file);
      if (!r.hasFile) report.file.push(r.file);
      if (!r.hasDemoValues) report.demo.push(`${r.file} (Expected: ${r.demoName})`);

      const rowChecks = r.isSnippet ? 4 : 5;
      const rowSuccess = (r.internal ? 1 : 0) + (r.externalError ? 1 : 0) + (r.hasFile ? 1 : 0) + (r.hasDemoValues ? 1 : 0) + (!r.isSnippet && !r.typeError ? 1 : 0);
      gChecks += rowChecks; gSuccess += rowSuccess;
      /* log of the rows */
      console.log(`${r.file.padEnd(50)} |  ${col_internal.padEnd(3)} |  ${col_external.padEnd(3)} |  ${col_type.padEnd(3)} |  ${col_file.padEnd(3)} |  ${col_demo.padEnd(3)} | ${col_sc}`);
      /* writing of the row line */
      md += `| \`${r.file}\` | ${col_internal} | ${col_external} | ${col_type} | ${col_file} | ${col_demo} | ${col_sc} |\n`;
    }
    const gScore = ((gSuccess / gChecks) * 100).toFixed(1);
    console.log(`\n> Folder Score: ${gScore}% (${gSuccess}/${gChecks})\n`);
    totalChecks += gChecks; totalSuccess += gSuccess;
  }

  const globalScore = ((totalSuccess / totalChecks) * 100).toFixed(1);
  const progressBar = '█'.repeat(Math.floor(globalScore / 5)) + '░'.repeat(20 - Math.floor(globalScore / 5));

  console.log(`\n${'='.repeat(30)}\nGLOBAL SCORE: ${globalScore}% [${progressBar}]\n${totalSuccess}/${totalChecks} passed\n${'='.repeat(30)}`);
  
  const logSection = (title, list, fix) => {
    if (list.length > 0) {
      console.log(`\n[!] ${title.toUpperCase()} (Fix: ${fix}):`);
      list.forEach(f => console.log(`  - ${f}`));
    }
  };

  logSection("Missing Internal Props", report.internal, "Add Props to <script module>");
  logSection("Incorrectly Imported", report.external, "Remove import from ./types");
  logSection("Redundant Declaration", report.type, "Delete Props from types.ts");
  logSection("Missing types.ts", report.file, "Create types.ts with 'export {}'");
  logSection("Missing Demo Values", report.demo, "Export componentDemoValues from types.ts");

  md += `\n\n## Global Compliance Index\n**Score: ${globalScore}%**\n\`${progressBar}\` (${totalSuccess}/${totalChecks} passed)\n\n---\n\n## Error Report (❌ Items)\n\n`;
  const mdSec = (t, l, f) => {
    md += `### ${t}\n**Fix:** ${f}\n\n${l.length ? l.map(f => `- \`${f}\``).join('\n') : '_None_'}\n\n`;
  };
  mdSec("Missing Internal Usage (Int.)", report.internal, "Add the component Props definition inside a `<script module>` tag.");
  mdSec("Incorrectly Imported (Ext.)", report.external, "Remove the import from `./types`.");
  mdSec("Redundant Declaration (Type)", report.type, "Delete the `ComponentProps` from `types.ts`.");
  mdSec("Missing types.ts File (File)", report.file, "Create the `types.ts` file with `export {};`.");
  mdSec("Missing Demo Values (Demo)", report.demo, "Export the missing `componentDemoValues` from `types.ts`.");

  /* writing the markdown file  COMPONENT_MAP.md*/
  await fs.writeFile(path.join(repoRoot, 'COMPONENT_MAP.md'), md);
  console.log(`\n📄 COMPONENT_MAP.md updated.`);
}

main().catch(console.error);