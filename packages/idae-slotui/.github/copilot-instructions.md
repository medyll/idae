# Copilot / AI agent instructions — @medyll/idae-slotui-svelte

Always read the repository root `MIGRATION.md` before making changes that touch component runtime, public APIs, or styling conventions.

Purpose: give an AI agent the minimal, project-specific knowledge to be productive quickly — architecture, key files, conventions, commands and examples.

1) Big picture
- Library + demo app: component library in `src/lib/` (atomic controls in `src/lib/base/` and interactive controls in `src/lib/controls/`) and a SvelteKit demo/docs site under `src/routes/`.
- Styling: SCSS is source of truth; compiled CSS lives in `src/lib/slotui-css/` (do not edit generated files).

When a maintainer asks "what should I work on next?", check the migration guidance and the central component status map:

- Primary source: [MIGRATION.md](MIGRATION.md) (root). See the section that points to `COMPONENT_MAP` for per-component next-steps.
- Component status: [COMPONENT_MAP.md](COMPONENT_MAP.md) — contains the current migration/issue notes and the "error report" section describing recommended actions.

To regenerate `COMPONENT_MAP.md` from project heuristics and type checks run:

```bash
node scripts/check-internal-typs.js
```


2) Key files & scripts to know
- `src/lib/index.ts` — public export surface (used by packaging). Update when adding public components.
- `scripts/make-export.js` — regenerates `index.ts` files per component folder. 
- `src/tests/docs.test.js` + `src/lib/docs/docs.js` — automated docs extraction used in CI/docs.
- `scripts/check-internal-typs.js` — get component map from project heuristics.

3) Developer workflows & commands (exact)
- Package: `npm run package` 
- Dev server: `npm run dev`
- Build library/site: `npm run build`
- Lint/format: `npm run lint`, `npm run format`
- Tests: `npm run test` (uses Vitest + Playwright)

4) Project-specific patterns and constraints
- Svelte 5 'runes' only: use `$props()`, `$state()`, `$derived()`, `$bindable()`, `$effect()` for reactivity and props. Legacy `export let` or `$:` reactive labels are forbidden. Example:

  const { label, disabled } = $props()

- Slot rendering: always use the `Slotted` helper located at `src/lib/utils/slotted/Slotted.svelte` for fallback content. Example:

  <Slotted child={children}>{value ?? ''}</Slotted>

- SCSS pattern: each component imports its SCSS via a global style tag:

  <style global lang="scss"> @use './component-name.scss'; </style>

- Icons: use `src/lib/base/icon/Icon.svelte` (Iconify wrapper) rather than inlining SVGs.

5) Packaging & exports
- New public components must be exported from `src/lib/index.ts`. Use `scripts/make-export.js` to regenerate export indexes after adding files.
- Do not hand-edit `src/lib/slotui-css/`.

6) Tests & docs
- Place tests in `src/tests/` or next to the component. The docs extractor (`src/lib/docs/docs.js`) is exercised by `src/tests/docs.test.js` — keep component JSDoc and props typing up-to-date.

7) Monorepo & aliases
- This package is part of a monorepo; imports use tsconfig path aliases: `$lib`, `$components`, `$utils`, `$styles`. Check `tsconfig.json` when resolving paths.

8) What agents MUST do before changing API/behavior
- Run `npm run test`   locally.
- Verify `src/tests/docs.test.js` still passes (docs extraction) when editing public components.
- Update `MIGRATION.md` if changing surface-breaking behavior and reference it in your PR.

9) Quick troubleshooting pointers
- If exports are missing after adding files, run `node scripts/make-export.js`.

References
- Export surface: [src/lib/index.ts](src/lib/index.ts)
- Slotted helper: [src/lib/utils/slotted/Slotted.svelte](src/lib/utils/slotted/Slotted.svelte)
- Export generator: [scripts/make-export.js](scripts/make-export.js)
- Migration rules: [MIGRATION.md](MIGRATION.md)

Last updated: February 2026
