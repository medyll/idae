<!-- Copilot instructions for contributors and AI coding agents -->
# Project-specific guidance — pseudo-html-template

This file contains concise, actionable guidance for AI coding agents working inside this package.

1) Big picture
- Purpose: an ESM library that turns semantic "pseudo-HTML" mockups into Svelte component scaffolds and provides a small template engine. See [packages/pseudo-html-template/README.md](packages/pseudo-html-template/README.md).
- Build output: library is built by `vite build` and published from `dist/index.js` (see [packages/pseudo-html-template/package.json](packages/pseudo-html-template/package.json)).

2) Key files and where to look
- CLI / main conversion logic: [packages/pseudo-html-template/lib/convert-mockup.js](packages/pseudo-html-template/lib/convert-mockup.js)
- Template source (preferred): [packages/pseudo-html-template/lib/convert-mockup-template.md](packages/pseudo-html-template/lib/convert-mockup-template.md)
- Human reference for pseudo-tags: [packages/pseudo-html-template/mockup-example.md](packages/pseudo-html-template/mockup-example.md) and [packages/pseudo-html-template/lib/mockup-master-reference.html](packages/pseudo-html-template/lib/mockup-master-reference.html)
- Prepackage indexing script (run before publish): [packages/pseudo-html-template/scripts/package-pre.js](packages/pseudo-html-template/scripts/package-pre.js)

3) Developer workflows (commands to run)
- Build: `npm run build` (runs `vite build`) from the package root.
- Test: `npm test` (runs `vitest`) if tests are added.
- Lint/format: `npm run lint` and `npm run format`.
- Prepackage: `npm run prepackage` runs `node scripts/package-pre.js` (this calls shared utilities in the monorepo). Run this before publishing.

4) How convert-mockup works (practical notes for codegen)
- The converter scans input mockup HTML-like content and only generates components for the allowed pseudo-tags set (see `allowed` inside convert-mockup.js). Do not assume it processes arbitrary HTML.
- Template lookup: the converter prefers a markdown file containing an HTML fenced block at `src/lib/tools/mockup/convert-mockup-template.md` (or an HTML file at the same path). When changing templates, preserve placeholders: `{{COMPONENT_NAME}}`, `{{TAG}}`, `{{ID}}`, `{{ATTRS_JSON}}`, `{{INNER}}`.
- Output defaults to `./src/lib/elements` (relative to where the CLI is run). Generated filenames follow `mockup-{tag[-id]}.svelte` and are overwritten by the tool.
- The template content targets Svelte 5 patterns (example: uses `$props()` and `{@render children?.()}` and may include `<script lang="ts">` and `postcss` style blocks). Follow those conventions when editing templates or scaffolds.

5) Project conventions and patterns
- Package is ESM (`type: "module"` in package.json). Keep imports/exports ESM-compatible.
- Templates and generated components use Svelte 5 idioms and TypeScript snippets — prefer preserving the existing markup and placeholders.
- Attribute parsing: `convert-mockup.js` treats bare attributes (no value) as boolean `true`. IDs may be inferred from `id` or `name` attributes.

6) Integration points and external expectations
- `scripts/package-pre.js` references shared tooling at `../../shared/scripts/indexIfy.js`. When running `prepackage` ensure you execute from the package root inside the monorepo so relative paths resolve.
- Publishing expects `dist` to contain the packaged entry (see `files` in package.json). The repo-level CI may run `prepackage` and `build` in sequence.

7) Quick examples
- Generate components from the bundled mockup file (run from package root):

  node lib/convert-mockup.js mockup-example.md ./src/lib/elements

- Run the full local build and prepackage steps:

  npm run prepackage
  npm run build

8) Guidance for AI edits
- When producing code changes, prefer minimal, focused edits. If you modify `convert-mockup-template.md`, keep placeholder names unchanged and validate by running the converter locally.
- Do not widen the allowed pseudo-tag set silently — add tags only when you update both `convert-mockup.js` and the reference docs (`mockup-example.md` / `mockup-master-reference.html`).
- Preserve Svelte-specific idioms in templates; avoid changing render patterns (`{@render ...}`) unless the whole template design is intentionally revised.

If any part of this file is unclear or you want more detail (CI steps, shared scripts, or the monorepo layout), say which area and I will expand the instructions.
