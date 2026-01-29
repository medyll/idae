
# Copilot/AI Agent Instructions for @medyll/idae-slotui-svelte


This repository contains:
- A Svelte 5 component library (`@medyll/idae-slotui-svelte`) in `src/lib/`
- A SvelteKit-powered website (in `src/routes/`) for live demos, documentation, and showcasing all components

This guide enables AI agents to work productively in both the component library and the demo/documentation website.

## Project Architecture
- **Type:** Svelte 5 component library, built with SvelteKit and Vite
- **Structure:**
  - Components: `src/lib/base/` (atomic UI), `src/lib/controls/` (form/interactive)
  - Utilities: `src/lib/utils/` (slot handling, helpers)
  - Styles: SCSS per component, compiled to `src/lib/slotui-css/` via `scripts/release-css.js`
  - Demos/docs: `src/routes/`
- **Styling:** SCSS (custom build), UnoCSS, `@medyll/cssfabric`
- **Exports:** All public components and generated CSS are re-exported from `src/lib/index.ts`

## Key Patterns & Conventions
- **Svelte 5 runes only:** Use `$props`, `$state`, `$derived`, `$bindable`, `$effect` exclusively for reactivity and props
  - Example: `const { label, disabled } = $props()`
- **Slot management:** Use the `Slotted` component (`$lib/utils/slotted/Slotted.svelte`) for all slot/fallback logic
  - Example: `<Slotted child={children}>{value ?? ''}</Slotted>`
- **SCSS import:** Each component imports its SCSS with `<style global lang="scss"> @use './component-name.scss'; </style>`
- **Component creation:**
  1. Add folder in `src/lib/base` or `src/lib/controls`
  2. Create `.svelte` and `.scss` files
  3. Import SCSS as above
  4. Export from `src/lib/index.ts` (or ensure build script includes it)
- **Props typing:** Use TypeScript `interface` or `type` for props, inline or in `types.ts` per component
- **Icons:** Use `Icon` (`$lib/base/icon/Icon.svelte`, wraps Iconify)
- **Aliases:** `$lib`, `$components`, `$utils`, `$styles` (see `tsconfig.json`)

## Developer Workflows
- **Dev server:** `npm run dev` (Vite + SvelteKit)
- **Build/package:** `npm run build` (Vite + svelte-package), `npm run package`
- **Test:** `npm run test` (Vitest + Playwright)
  - Unit: `npm run test:unit` (Vitest)
  - Integration: `npm run test:integration` (Playwright)
- **CSS build:** `npm run release-css` (compiles all SCSS to distributable CSS)

## Project-Specific Notes
- **Do not edit files in `src/lib/slotui-css/` directly**; these are generated
- **All Svelte code must use runes, not legacy syntax**
- **SCSS is the canonical source for styles; always update `.scss` and re-run CSS build**
- **Tests:** Place unit/integration tests in `src/tests/` or alongside components
- **Monorepo:** Shares tooling/config with other `idae` packages; see root for shared scripts

## Integration & Dependencies
- **Depends on:** `@medyll/idae-engine`, `@medyll/cssfabric`, UnoCSS
- **Build tools:** Vite, SvelteKit, custom scripts in `scripts/`

## References
- [README.md](../../README.md): Usage, examples, and more details
- [src/lib/index.ts](../../src/lib/index.ts): Export surface
- [scripts/release-css.js](../../scripts/release-css.js): SCSS build logic
- [tsconfig.json](../../tsconfig.json): Aliases and strictness

---
**Last updated:** January 2026
