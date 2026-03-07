# Architecture – @medyll/idae-slotui-svelte

> **Version:** 1.0 | **Date:** 2026-03-01 | **Status:** Accepted
> **Derived from:** PRD v1.0 · source analysis · MIGRATION.md · SNIPPET_COMPONENT.md

---

## Chosen Approach

**Layered library + shadcn-compatible registry.**
A compiled npm package (`dist/`) is the primary distribution channel; a shadcn-style JSON registry (`registry/`) is the secondary, enabling consumers to copy individual components into their own projects. Both outputs are produced from a single source tree under `src/lib/`.

---

## System Context Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Source (src/lib/)                                      │
│                                                         │
│  base/ ─┐                                               │
│  controls/ ─┤                                           │
│  data/ ─┤──► index.ts ──► svelte-package ──► dist/     │
│  navigation/ ─┤                                         │
│  ui/ ─┘                   └──► npm publish             │
│                                                         │
│  scripts/generate-registry-from-lib.cjs                 │
│          │                                              │
│          └──► registry/registry.json                    │
│              public/r/{component}.json  ──► hosted URL  │
└─────────────────────────────────────────────────────────┘

Consumer A (npm):
  npm install @medyll/idae-slotui-svelte
  import { Button } from '@medyll/idae-slotui-svelte'

Consumer B (registry):
  npx shadcn add https://<host>/r/button
  → copies Button.svelte + types.ts into consumer's src/lib/
```

---

## Component Architecture

### Anatomy of a component

Every component lives in a self-contained directory:

```
src/lib/{category}/{componentName}/
  ComponentName.svelte      ← main component
  ComponentNameSnippet.svelte  ← snippet sub-component (one per Snippet<[...]> prop)
  types.ts                  ← exports componentNameDemoValues + supplementary types
  index.ts                  ← re-exports all .svelte files in the directory
```

### Component internal structure

```
ComponentName.svelte
  <script module lang="ts">
    export interface ComponentNameProps { ... }   ← MUST be here, not in types.ts
  </script>

  <script lang="ts">
    let { prop1, children, snippetProp }: ComponentNameProps = $props();
    let state = $state(...);
    let derived = $derived(...);
  </script>

  <style lang="postcss">
    @reference "tailwindcss";
    /* component-scoped styles */
  </style>

  {markup using Svelte 5 runes and snippets}
```

### Snippet component pattern

For each `Snippet<[T]>` prop declared on a parent (excluding `children`), a companion file exists in the same directory:

```
SnippetComponentName.svelte
  <!-- @component snippet component ButtonStart — for Button -->
  <script lang="ts">
    export type ButtonStartProps = any; // inherits from parent snippet type
  </script>
  <script lang="ts">
    const { children } = $props();
  </script>
  {#snippet buttonStart()}
    {@render children?.()}
  {/snippet}
```

Rules: no `<script module>`, no `<style>` block, placed alongside the parent (not in a `snippets/` subdirectory).

### Slotted utility (`src/lib/utils/slotted/Slotted.svelte`)

Core rendering primitive used internally. Accepts `child` or `children` snippet + `slotArgs`, re-renders the snippet with `{#key slotArgs}` when args change. Enables reactive slot injection without prop drilling.

---

## Build Pipeline Architecture

```
npm run build
  └── vite build          → dist/ (ESM, SSR-safe)
  └── svelte-package      → dist/ (types, .svelte preserved)
  └── publint             → validates package.json exports

npm run prepackage
  └── scripts/package-pre.js
  └── scripts/generate-registry-from-lib.cjs  → registry/registry.json + public/r/*.json
  └── scripts/make-pnpx.cjs                   → pnpx/npx CLI metadata

npm run check
  └── svelte-kit sync
  └── svelte-check --tsconfig ./tsconfig.json
```

### Package exports

```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "svelte": "./dist/index.js",
    "default": "./dist/index.js"
  }
}
```

Single entry point. Tree-shaking is delegated to the consumer's bundler.

---

## Styling Architecture

```
Source styles:
  src/lib/{component}/ComponentName.svelte
    <style lang="postcss">
      @reference "tailwindcss";
      .my-class { @apply ... }
    </style>

Build-time processing:
  vite + @tailwindcss/vite plugin
    → PostCSS processes all <style> blocks
    → Tailwind v4 utilities resolved at build time
    → No runtime CSS injection

Output:
  dist/ contains pre-processed CSS embedded in .js/.svelte files
  No separate stylesheet required by consumers
```

**Rule:** No external `.css` file imports inside `<style>` blocks. All styles must be self-contained or expressed via Tailwind utilities.

---

## Registry Architecture

```
registry/
  registry.json          ← index of all components (shadcn v2 schema)

public/r/
  {component-name}.json  ← per-component metadata (files, deps, registryDeps)

scripts/generate-registry-from-lib.cjs
  → scans src/lib/
  → produces registry.json + public/r/*.json
  → run via npm run prepackage
```

### Registry entry schema (shadcn v2)

```json
{
  "name": "button",
  "type": "registry:ui",
  "files": [
    { "path": "registry/ui/button.svelte", "type": "registry:ui" }
  ],
  "dependencies": [],
  "registryDependencies": []
}
```

Snippet components of a parent are bundled as additional `files` entries in the parent's registry entry — they are not standalone registry entries.

---

## Architecture Decision Records

### ADR-01 – Svelte 5 runes over Svelte 4 options/stores API
- **Status:** Accepted
- **Context:** Svelte 5 introduced a new reactivity model (runes) that is SSR-safe, type-friendly, and composable without the `$:` magic.
- **Decision:** All components use `$props()`, `$state()`, `$derived()`. No `export let`, no reactive statements.
- **Consequences:** Breaking change for consumers on Svelte 4. Minimum peer dependency is `svelte ^5.0.0-next`.

### ADR-02 – Tailwind CSS v4 over SCSS
- **Status:** Accepted
- **Context:** SCSS required a separate build step, global import management, and was difficult to scope. Tailwind v4 integrates natively with Vite and eliminates the SCSS layer.
- **Decision:** All styles use Tailwind utilities inside `<style lang="postcss">` blocks with `@reference "tailwindcss"`. SCSS files are removed.
- **Consequences:** Consumers must have `@tailwindcss/postcss` available if they extend styles. No SCSS fallback.

### ADR-03 – shadcn-style registry alongside npm package
- **Status:** Accepted
- **Context:** The shadcn model lets consumers own the component code, enabling unrestricted customization without waiting for library updates.
- **Decision:** Maintain both `dist/` (npm) and `registry/` + `public/r/` (shadcn registry). Both generated from the same source.
- **Consequences:** Component code must be self-contained (no opaque internal imports) to be safely copyable. Registry must be hosted externally to be usable.

### ADR-04 – Snippet components as separate files, co-located with parent
- **Status:** Accepted
- **Context:** Svelte 5 snippets replace slots. To give consumers a typed, discoverable API for sub-component customization, each snippet prop gets a dedicated `.svelte` file.
- **Decision:** One file per `Snippet<[...]>` prop (excluding `children`), placed in the same directory as the parent. No `snippets/` subdirectory. No `<script module>`, no `<style>`.
- **Consequences:** Directory size grows. Enforced by COMPONENT_MAP.md `Int.` column + `make-component-maps.js` checker.

### ADR-05 – Props type declared in `<script module>`, not in `types.ts`
- **Status:** Accepted
- **Context:** Placing the props interface in `<script module lang="ts">` makes it co-located with the component, exported automatically by `svelte-package`, and accessible to `svelte-check`.
- **Decision:** `[Component]Props` lives in `<script module>`. `types.ts` holds only demo values and supplementary (non-props) types.
- **Consequences:** `types.ts` must NOT re-declare or re-export `[Component]Props`. Enforced by COMPONENT_MAP.md `Ext.` and `Type` columns.

### ADR-06 – Single `index.ts` export entry point
- **Status:** Accepted
- **Context:** A single `src/lib/index.ts` re-exports all category `index.ts` files, which in turn re-export each component. This is the only entry that maps to `package.json` exports.
- **Decision:** `src/lib/index.ts → src/lib/{category}/index.ts → src/lib/{category}/{component}/index.ts → *.svelte`.
- **Consequences:** Adding a component requires updating the directory `index.ts`. Automatable via `scripts/make-export.js`.

---

## Data Flow

### Flow: Consumer uses a component (npm path)
1. Consumer imports `Button` from `@medyll/idae-slotui-svelte`
2. Bundler resolves to `dist/index.js → Button.svelte`
3. Svelte compiler processes at consumer's build time (SSR or CSR)
4. `$props()` receives consumer-provided props; Tailwind classes applied
5. Optional snippet override: consumer passes `{#snippet buttonStart()}...{/snippet}`

### Flow: Consumer installs via registry
1. `npx shadcn add https://<host>/r/button`
2. CLI fetches `public/r/button.json` → reads file list + dependencies
3. `.svelte` + `types.ts` files copied into consumer's project
4. Consumer modifies freely — no version lock

### Flow: Maintainer adds a new component
1. Create directory + files under `src/lib/{category}/{name}/`
2. Run `node ./scripts/make-component-maps.js` → verify all columns ✅
3. Run `npm run build` + `npm run test:unit` → green
4. Run `npm run prepackage` → registry updated
5. Commit + publish via `npm run publish`

---

## Compliance Enforcement Architecture

```
scripts/make-component-maps.js
  → scans src/lib/**/*.svelte
  → checks 9 rules per component (Int, Ext, Type, File, Demo, PostCss, Ref, Css, Sc)
  → writes COMPONENT_MAP.md

Rules enforced:
  Int.    ComponentProps declared in <script module>
  Ext.    ComponentProps NOT imported from ./types
  Type    ComponentProps NOT in types.ts
  File    types.ts exists
  Demo    [component]DemoValues exported from types.ts
  PostCss <style lang="postcss"> present when style block exists
  Ref     @reference "tailwindcss" present in style content
  Css     No external .css imports in style block
  Sc.     Snippet component marker (informational)
```

Must be run after every component change. CI should gate on zero ❌ violations.

---

## Deployment / Distribution

| Channel | Artifact | Command | Notes |
|---|---|---|---|
| npm registry | `dist/` | `npm publish` (via `prepublishOnly`) | Standard npm flow |
| shadcn registry | `public/r/*.json` + `registry/registry.json` | `npm run prepackage` then host static files | URL must be set in `config.yaml` |
| SvelteKit dev server | full `src/` | `npm run dev` | For component development and docs |

---

## Cross-Cutting Concerns

### SSR Safety
All components must be free of direct DOM access at module level. Svelte 5 runes are SSR-safe. `@iconify/svelte` is excluded from SSR via `vite.config.js` (`ssr.noExternal` / `optimizeDeps.exclude`).

### Bundle size
`publint` runs on every `npm run package` to catch mis-declared exports or bundled dependencies. Components must not bundle peer dependencies.

### Observability (dev time)
- TypeScript errors: `npm run check` (svelte-check)
- Convention violations: `node ./scripts/make-component-maps.js`
- Test results: `npm run test:unit` (vitest) + `npm run test:integration` (playwright)

---

## Open Architectural Questions

- [ ] Should the registry be hosted on GitHub Pages or a dedicated CDN? (resolves the `https://example.org` placeholder in `config.yaml`)
- [ ] Should snippet components appear as separate registry entries or always bundled with the parent?
- [ ] Is `@medyll/idae-engine` a runtime dependency? Currently in devDependencies but imported by components — needs audit.
- [ ] Should `make-component-maps.js` be integrated into CI (pre-push hook or CI step) to gate on zero ❌?
- [ ] Is `tailwind-merge` (in dependencies) intentional as a runtime dep, or should it be peer/dev?
