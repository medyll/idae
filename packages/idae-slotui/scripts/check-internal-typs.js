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
 * Extended: adds checks for <style> usage:
 *  - postcss: if the component has a <style> tag, one of them must include lang="postcss"
 *  - reference: the style content must include @reference "tailwindcss"
 *  - css: detect explicit external CSS imports in the style content (presence considered BAD)
 *
 * Notes about the style checks:
 *  - Assumption: There is at most one <style> per component in this codebase.
 *    If multiple style blocks are present, the code treats the file as passing a given
 *    check when at least one style block satisfies the condition (this matches Option A).
 *  - The css import detection is intentionally conservative: it looks for `.css` references
 *    in `@import` / `@use` and for `url(...)` usage. It does NOT attempt to resolve Sass imports
 *    that omit extensions.
 *
 * The script remains side-effecting (console + file write).
 */
async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const start = path.join(repoRoot, 'src', 'lib');
  /* @type {Record<string, Array<{ file: string, internal: boolean, externalError: boolean, typeError: boolean, hasFile: boolean, isSnippet: boolean, hasDemoValues: boolean, demoName: string, hasStyle: boolean, postcssOk: boolean, referenceOk: boolean, cssImportPresent: boolean }>>>} */
  const groups = {};
  let totalChecks = 0;
  let totalSuccess = 0;

  // Walk the directory tree and process each file asynchronously.
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

    // -------------------------------------------------------------------------
    // NEW: Style parsing and checks
    // -------------------------------------------------------------------------
    // We use a global regex to find <style ...>...</style> blocks.
    // - capture group 1: attributes string of the <style> tag
    // - capture group 2: inner content of the style block
    //
    // The regex is intentionally permissive about whitespace and attributes.
    const styleRe = /<style\b([^>]*)>([\s\S]*?)<\/style>/ig;

    // Gather all style blocks (most components have only one).
    // Using matchAll to get both attributes and content.
    const styleMatches = [...content.matchAll(styleRe)];

    // Boolean: does the component contain at least one <style> block?
    const hasStyle = styleMatches.length > 0;

    // postcss check:
    // - Requirement: if a style block exists, at least one style tag must include lang="postcss"
    // - Regex explanation: look for lang="postcss" or lang='postcss' in the attributes string.
    //   We test against the attributes capture group (m[1]).
    const postcssLangRe = /\blang\s*=\s*(['"])postcss\1/i;
    const postcssOk = hasStyle && styleMatches.some((m) => postcssLangRe.test(m[1] || ''));

    // reference check:
    // - Requirement: the style content must include @reference "tailwindcss" (single or double quotes).
    // - Regex explanation: allow optional whitespace inside quotes, case-insensitive.
    const referenceRe = /@reference\s*(['"])\s*tailwindcss\s*\1/i;
    const referenceOk = hasStyle && styleMatches.some((m) => referenceRe.test(m[2] || ''));

    // css import detection:
    // - Requirement: external CSS imports (explicit .css imports or url(...) patterns) are BAD.
    // - We flag presence of:
    //    - @import url(...)
    //    - @import 'something.css' or @import "something.css"
    //    - @use 'something.css' or @use "something.css"
    // - Note: this is a conservative check and focuses on `.css` extension and url(...) usage.
    const cssImportRe = /@import\s+url\([^)]*\)|@import\s+['"][^'"]+\.css['"]|@use\s+['"][^'"]+\.css['"]/i;
    const cssImportPresent = hasStyle && styleMatches.some((m) => cssImportRe.test(m[2] || ''));

    // -------------------------------------------------------------------------
    // End of style parsing
    // -------------------------------------------------------------------------

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
      demoName: dCamel,
      // new style-related flags:
      hasStyle,
      postcssOk,
      referenceOk,
      cssImportPresent
    });
  }

  let md = '# Component Map\n\n';
  md += '### Legend\n- ✅ : Requirement met / No error\n- ❌ : Requirement not met / Error detected\n- ─ : Not applicable (Snippet or no style)\n\n';
  md += '### Columns\n- **Int.** (Internal): The `Props` type must be used within the Svelte component body.\n- **Ext.** (External): The `Props` type must **not** be imported from `./types.ts`.\n- **Type**: The `Props` type must **not** be declared in the `types.ts` file.\n- **File**: The `types.ts` file must exist in the component folder.\n- **Demo**: `[component]DemoValues` must be exported from `types.ts`.\n- **PostCss**: Component must use `lang="postcss"` on at least one `<style>` tag when a style is present.\n- **Ref**: The `<style>` content must include `@reference "tailwindcss"` when a style is present.\n- **Css**: The `<style>` must NOT import external `.css` files or use `url(...)` (presence = ❌).\n- **Sc.**: Snippet component.\n\n';
  md += '| File | Int. | Ext. | Type | File | Demo | PostCss | Ref | Css | Sc. |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n';

  const report = { internal: [], external: [], type: [], file: [], demo: [], postcss: [], reference: [], css: [] };

  /* drawing of the table */
  for (const [groupName, files] of Object.entries(groups)) {
    let gChecks = 0, gSuccess = 0;
    console.log(`\n=== FOLDER: ${groupName.toUpperCase()} ===`);
    // Console header: we add three new short columns PostCss / Ref / Css
    // Note: padEnd(50) keeps the file column width; the rest are short flags.
    console.log(`${'File'.padEnd(50)} | Int. | Ext. | Type | File | Demo | PostCss | Ref | Css | Sc.`);
    console.log('-'.repeat(140));
    md += `| **${groupName.toUpperCase()}** | | | | | | | | | |\n`;
    /* drawing of the rows */
    for (const r of files) {
      // compute column values using same emoji convention as other columns.
      const col_internal = r.internal ? '✅' : '❌';
      const col_external = r.externalError ? '✅' : '❌';
      const col_type = r.isSnippet ? '─' : (!r.typeError ? '✅' : '❌');
      const col_file = r.hasFile ? '✅' : '❌';
      const col_demo = r.hasDemoValues ? '✅' : '❌';
      const col_sc = r.isSnippet ? '[snippet]' : '';
      const col_post = r.hasStyle ? (r.postcssOk ? '✅' : '❌') : '─';
      const col_ref = r.hasStyle ? (r.referenceOk ? '✅' : '❌') : '─';
      const col_css = r.hasStyle ? (r.cssImportPresent ? '❌' : '✅') : '─';

      // - PostCss: requires lang="postcss"
      // - Ref: requires @reference "tailwindcss" in style content
      // - Css: success when NO external css import present
      
      // Aggregate failing files into report arrays for summary later.
      if (!r.internal) report.internal.push(r.file);
      if (!r.externalError) report.external.push(r.file);
      if (!r.isSnippet && r.typeError) report.type.push(r.file);
      if (!r.hasFile) report.file.push(r.file);
      if (!r.hasDemoValues) report.demo.push(`${r.file} (Expected: ${r.demoName})`);
      // New reports for style-related failures, only if a style exists:
      if (r.hasStyle && !r.postcssOk) report.postcss.push(r.file);
      if (r.hasStyle && !r.referenceOk) report.reference.push(r.file);
      if (r.hasStyle && r.cssImportPresent) report.css.push(`${r.file} (contains external CSS import)`);

      // rowChecks calculation:
      // - baseChecks: previous script used 4 (snippet) or 5 (normal)
      // - styleRelatedChecks: only applicable if a <style> exists (3 checks)
      const baseChecks = r.isSnippet ? 4 : 5;
      const styleChecks = r.hasStyle ? 3 : 0;
      const rowChecks = baseChecks + styleChecks;

      // rowSuccess counts passing checks: reuse previous logic and add style check results.
      // For css, success is !cssImportPresent.
      const rowSuccess =
        (r.internal ? 1 : 0)
        + (r.externalError ? 1 : 0)
        + (r.hasFile ? 1 : 0)
        + (r.hasDemoValues ? 1 : 0)
        + (!r.isSnippet && !r.typeError ? 1 : 0)
        + (r.hasStyle ? (r.postcssOk ? 1 : 0) : 0)
        + (r.hasStyle ? (r.referenceOk ? 1 : 0) : 0)
        + (r.hasStyle ? (!r.cssImportPresent ? 1 : 0) : 0);

      gChecks += rowChecks; gSuccess += rowSuccess;
      /* log of the rows */
      console.log(`${r.file.padEnd(50)} |  ${col_internal.padEnd(3)} |  ${col_external.padEnd(3)} |  ${col_type.padEnd(3)} |  ${col_file.padEnd(3)} |  ${col_demo.padEnd(3)} |  ${col_post.padEnd(3)} |  ${col_ref.padEnd(3)} |  ${col_css.padEnd(3)} | ${col_sc}`);
      /* writing of the row line in the markdown table */
      md += `| \`${r.file}\` | ${col_internal} | ${col_external} | ${col_type} | ${col_file} | ${col_demo} | ${col_post} | ${col_ref} | ${col_css} | ${col_sc} |\n`;
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
  // New log sections for style checks:
  logSection("Missing postcss lang on <style>", report.postcss, "Add lang=\"postcss\" to the <style> tag");
  logSection("Missing @reference tailwindcss", report.reference, "Add @reference \"tailwindcss\" to the style content");
  logSection("External CSS import present", report.css, "Remove @import of external .css or replace with postcss workflow");

  md += `\n\n## Global Compliance Index\n**Score: ${globalScore}%**\n\`${progressBar}\` (${totalSuccess}/${totalChecks} passed)\n\n---\n\n## Error Report (❌ Items)\n\n`;
  const mdSec = (t, l, f) => {
    md += `### ${t}\n**Fix:** ${f}\n\n${l.length ? l.map(f => `- \`${f}\``).join('\n') : '_None_'}\n\n`;
  };
  mdSec("Missing Internal Usage (Int.)", report.internal, "Add the component Props definition inside a `<script module>` tag.");
  mdSec("Incorrectly Imported (Ext.)", report.external, "Remove the import from `./types`.");
  mdSec("Redundant Declaration (Type)", report.type, "Delete the `ComponentProps` from `types.ts`.");
  mdSec("Missing types.ts File (File)", report.file, "Create the `types.ts` file with `export {};`.");
  mdSec("Missing Demo Values (Demo)", report.demo, "Export the missing `componentDemoValues` from `types.ts`.");
  // New markdown sections for the style checks:
  mdSec("Missing lang=\"postcss\" on <style>", report.postcss, "Add `lang=\"postcss\"` to the component's <style> tag.");
  mdSec("Missing @reference \"tailwindcss\" in style", report.reference, "Add `@reference \"tailwindcss\"` to the style content.");
  mdSec("External CSS import present (Css)", report.css, "Remove external `.css` imports from the component style.");

  /* writing the markdown file  COMPONENT_MAP.md*/
  await fs.writeFile(path.join(repoRoot, 'COMPONENT_MAP.md'), md);
  console.log(`\n📄 COMPONENT_MAP.md updated.`);
}

main().catch(console.error);