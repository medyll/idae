# PRD – @medyll/idae-slotui-svelte

> **Version:** 1.0 | **Date:** 2026-03-01 | **Status:** Draft
> **Source context:** MIGRATION.md · COMPONENT_MAP.md · config.yaml · SNIPPET_COMPONENT.md

---

## Overview

`@medyll/idae-slotui-svelte` is a Svelte 5 component library and shadcn-compatible component registry. It provides ~50+ reusable UI components (base primitives, form controls, data display, navigation, app-shell) that developers can consume either as an npm package or by copying individual components directly into their projects via a registry CLI.

The current delivery goal is to complete the migration to Svelte 5 runes + Tailwind CSS v4, achieve full convention compliance across all components, and publish a functional shadcn-style registry.

---

## Goals & Success Metrics

| Goal | Metric | Target |
|---|---|---|
| Full Svelte 5 compliance | % of components using `$props()` / `$state()` runes | 100% |
| Convention compliance | COMPONENT_MAP.md global score (Int/Ext/Type/Demo/PostCss/Ref/Css) | 100% ✅ on all columns |
| Tailwind v4 adoption | No remaining SCSS imports; all styles use `lang="postcss"` + `@reference "tailwindcss"` | 0 violations |
| Registry functional | `registry/registry.json` generated and each component has a `/public/r/{name}.json` | All components covered |
| Test coverage | Unit tests pass (`vitest`); integration tests pass (`playwright`) | Green CI |
| Snippet component coverage | All Snippet props in parent components have a corresponding snippet component file | 0 missing (Int. ✅) |

---

## User Personas

### Persona 1 – App Developer (consumer)
- **Role:** Svelte 5 application developer integrating UI components
- **Needs:** Drop-in, composable, well-typed components with predictable slot/snippet API
- **Pain points:** Breaking changes between Svelte versions; inconsistent styling layers; opaque abstractions

### Persona 2 – Maintainer (Meddy)
- **Role:** Library author adding, migrating, and publishing components
- **Needs:** Clear conventions enforced by tooling; automated compliance checks; streamlined publish pipeline
- **Pain points:** Manual tracking of compliance across 50+ components; inconsistent style block patterns

### Persona 3 – Registry Consumer
- **Role:** Developer using `npx shadcn add <url>` to copy a component into their project
- **Needs:** Self-contained, copyable components with explicit dependencies and types
- **Pain points:** Components with hidden internal imports that break after copy

---

## Use Cases

### UC-01 – Install component via npm
**Actor:** App Developer
**Trigger:** Needs a UI component (e.g., `Button`)
**Flow:**
1. `npm install @medyll/idae-slotui-svelte`
2. Import: `import { Button } from '@medyll/idae-slotui-svelte'`
3. Use in Svelte template with typed props and snippet overrides

**Expected outcome:** Component renders correctly, props are typed, snippets are discoverable.
**Edge cases:** SSR context — `@iconify/svelte` must be excluded from SSR (already handled in `vite.config.js`).

---

### UC-02 – Copy component via shadcn CLI
**Actor:** Registry Consumer
**Trigger:** Wants to own and customize a component locally
**Flow:**
1. `npx shadcn add https://<registry-url>/r/button`
2. Component files land in the consumer's `src/lib/` (or configured path)
3. Consumer modifies the component freely

**Expected outcome:** All necessary files (`.svelte` + `types.ts`) are included; no broken internal imports.
**Edge cases:** Component has snippet sub-components — all must be included in the registry entry.

---

### UC-03 – Add a new component (Maintainer)
**Actor:** Maintainer
**Trigger:** New UI requirement identified
**Flow:**
1. Create `src/lib/{category}/{componentName}/` directory
2. Author `ComponentName.svelte` with `<script module lang="ts">` declaring `ComponentNameProps`
3. Create `types.ts` exporting `componentNameDemoValues`
4. Create `index.ts` re-exporting the component
5. Add snippet components for each `Snippet<[...]>` prop (see SNIPPET_COMPONENT.md)
6. Run `node ./scripts/make-component-maps.js` → verify all columns show ✅
7. Run `npm run prepackage` to update the registry

**Expected outcome:** Component is compliant, exported, and appears in `registry/registry.json`.

---

### UC-04 – Migrate an existing component (Maintainer)
**Actor:** Maintainer
**Trigger:** Component shows ❌ in COMPONENT_MAP.md
**Flow:**
1. Open COMPONENT_MAP.md, identify failing columns
2. Apply targeted fix per column (see Fixes section in COMPONENT_MAP.md)
3. Re-run `node ./scripts/make-component-maps.js`
4. Run `npm run build` + `npm run test:unit` to validate

**Expected outcome:** Component moves to full ✅; no regressions.

---

## Functional Requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-01 | Every component must declare `[Component]Props` in `<script module lang="ts">` | Must | Enforced by COMPONENT_MAP Int. column |
| FR-02 | `[Component]Props` must NOT be imported from `./types` | Must | Enforced by COMPONENT_MAP Ext. column |
| FR-03 | `types.ts` must exist in each component folder and export `[component]DemoValues` | Must | Enforced by COMPONENT_MAP Demo column |
| FR-04 | All `<style>` blocks must use `lang="postcss"` and contain `@reference "tailwindcss"` | Must | Enforced by PostCss/Ref columns |
| FR-05 | No external `.css` file imports inside `<style>` blocks | Must | Enforced by Css column |
| FR-06 | Each `Snippet<[...]>` prop (except `children`) must have a corresponding snippet component file in the same directory | Must | See SNIPPET_COMPONENT.md |
| FR-07 | Each component directory must have an `index.ts` re-exporting all `.svelte` files | Must | Required for tree-shaking and registry |
| FR-08 | `registry/registry.json` must be auto-generated by `npm run prepackage` | Must | Via `scripts/generate-registry-from-lib.cjs` |
| FR-09 | Components must be SSR-safe (no direct DOM access at module level) | Must | Svelte 5 runes are SSR-safe by default |
| FR-10 | All component props must be typed (no `any` in public interfaces) | Should | Snippet components may use `any` transitionally |
| FR-11 | `dist/` must be publishable via `npm run package` without manual steps | Must | `prepublishOnly` hook enforces this |
| FR-12 | Each component must have a `@component` JSDoc comment describing its purpose | Should | Required for auto-generated docs |

---

## Non-Functional Requirements

| Category | Requirement | Acceptance Criteria |
|---|---|---|
| Build | Library builds without TypeScript errors | `npm run check` exits 0 |
| Bundle size | No unnecessary runtime dependencies bundled | `publint` passes on `dist/` |
| Type safety | All exported types resolve correctly for consumers | `svelte-check` exits 0 |
| Compatibility | Peer dependency: Svelte ≥ 5.0.0-next, @sveltejs/kit ≥ 2.53.0 | Validated in `package.json` |
| Registry format | Registry JSON conforms to shadcn v2 schema | Compatible with `npx shadcn add <url>` |
| Style isolation | No global CSS leakage from component styles | PostCSS + Tailwind scoping |

---

## Out of Scope

- React / Vue / Angular versions of components
- Server-side state management (components are UI-only)
- Authentication or authorization features
- Custom icon set (uses `@iconify/svelte`)
- Design token system beyond Tailwind v4 theme variables

---

## Dependencies

| Dependency | Type | Notes |
|---|---|---|
| Svelte 5 | Runtime/peer | Runes API (`$props`, `$state`, `$derived`) |
| Tailwind CSS v4 | Build/styling | Via `@tailwindcss/vite` plugin |
| `@iconify/svelte` | Runtime | Icon rendering; excluded from SSR |
| `@sveltejs/kit` | Build/peer | SvelteKit adapter + packaging |
| `scripts/make-component-maps.js` | Tooling | Compliance checker — must be run after component changes |
| `scripts/generate-registry-from-lib.cjs` | Tooling | Registry generator — run via `prepackage` |
| `@medyll/idae-engine` | Workspace | Internal engine package (workspace dep) |
| `@medyll/idae-dom-events` | Workspace | DOM event utilities (workspace dep) |

---

## Open Questions

- [ ] What is the target public URL for the hosted registry? (`config.yaml` placeholder: `https://example.org/registry.json`)
- [ ] Should snippet components appear as standalone entries in the registry, or only bundled with their parent?
- [ ] Is `@medyll/idae-engine` a hard runtime dependency or optional? (currently in devDependencies)
- [ ] What is the release cadence after migration completes — semver minor per component batch?

---

## Revision History

| Date | Author | Change |
|---|---|---|
| 2026-03-01 | PM Agent (bmad-master) | Initial draft — synthesized from MIGRATION.md, COMPONENT_MAP.md, config.yaml |
