

# Always refer to MIGRATION.md at the project root for up-to-date migration rules, requirements, and conventions during any migration or refactor task.

# Copilot/AI Agent Instructions for @medyll/idae-slotui-svelte

This repo is a Svelte 5 component library (`src/lib/`) and a SvelteKit demo/docs site (`src/routes/`). It is part of a monorepo and shares tooling with other `idae` packages.

## Architecture & Structure
- **Component Library:** All UI components are in `src/lib/base/` (atomic) and `src/lib/controls/` (form/interactive). Utilities are in `src/lib/utils/`.
- **Docs/Demos:** SvelteKit app in `src/routes/` showcases and documents all components.
- **Styling:** Each component has a `.scss` file, imported via `<style global lang="scss"> @use './component-name.scss'; </style>`. SCSS is canonical; compiled CSS is output to `src/lib/slotui-css/` (never edit generated CSS directly).
- **Exports:** All public components and CSS are re-exported from `src/lib/index.ts`.
- **Build:** Uses Vite, SvelteKit, UnoCSS, and `@medyll/cssfabric` for styling.

## Key Patterns & Conventions
- **Svelte 5 runes only:** Use `$props`, `$state`, `$derived`, `$bindable`, `$effect` for all reactivity and props. *Legacy Svelte syntax is forbidden.*
  - Example: `const { label, disabled } = $props()`
- **Slot/fallback logic:** Always use the `Slotted` component (`$lib/utils/slotted/Slotted.svelte`) for slot rendering and fallback content.
  - Example: `<Slotted child={children}>{value ?? ''}</Slotted>`
- **Props typing:** Use TypeScript `type` or `interface` for all props, inline or in a `types.ts` file per component.
- **Icons:** Use the `Icon` component (`$lib/base/icon/Icon.svelte`, wraps Iconify).
- **SCSS mixins/presets:** Use mixins from `src/lib/styles/slotui-mixins.scss` and variables from `slotui-presets.scss` for consistent sizing, spacing, and variants.
- **Aliases:** Use `$lib`, `$components`, `$utils`, `$styles` as defined in `tsconfig.json`.

## Developer Workflows
- **Dev server:** `npm run dev`
- **Build/package:** `npm run build` (Vite + svelte-package), `npm run package`
- **Test:** `npm run test` (Vitest + Playwright)
  - Unit: `npm run test:unit`
  - Integration: `npm run test:integration`
- **CSS build:** `npm run release-css` (compiles all SCSS to distributable CSS)
- **Lint/format:** `npm run lint`, `npm run format`

## Project-Specific Notes
- **Never edit files in `src/lib/slotui-css/` directly**; always update SCSS and re-run the CSS build.
- **Tests:** Place in `src/tests/` or alongside components.
- **Component creation:** Add new folders/files in `src/lib/base` or `src/lib/controls`, import SCSS, and export from `src/lib/index.ts`.
- **Docs generation:** See `src/tests/docs.test.js` and `src/lib/docs/docs.js` for automated docs extraction from Svelte components.
- **Monorepo:** Shares scripts/config with other `idae` packages; see root for shared scripts.

## Integration & Dependencies
- **Depends on:** `@medyll/idae-engine`, `@medyll/cssfabric`, UnoCSS, Iconify
- **Build tools:** Vite, SvelteKit, custom scripts in `scripts/`

## References
- [README.md](../../README.md): Usage, examples, and more details
- [src/lib/index.ts](../../src/lib/index.ts): Export surface
- [scripts/release-css.js](../../scripts/release-css.js): SCSS build logic
- [tsconfig.json](../../tsconfig.json): Aliases and strictness

---
**Last updated:** January 2026
