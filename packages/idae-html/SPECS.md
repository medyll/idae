STATUS — idae-html package
=================================

**Purpose**
- Provide a short snapshot of the current state, detected intentions and possible next steps for the `idae-html` package (HTML components library).

**Current state**
- Package scaffold exists with Svelte/Vite toolchain files: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`.
- Source code lives under `src/lib` (notably `src/lib/index.ts` and `src/lib/moduleLib/resizePanel.ts`).
- Demo / example pages exist under `src/routes` and `src/source` (`+page.svelte`, `content.html`, `example.html`, `module.html`).
- A CLI entry `cli.cjs` and `scripts/package-pre.js` are present — packaging script fragments exist.
- There are build artifacts and a `__package__` output in `.svelte-kit`, indicating prior packaging or local builds were run and compiled outputs were committed or left in tree.
- Static assets available in `static/`.

**Recent runtime additions (detected)**
- Added a central runtime module at `src/lib/core-engine.ts` which re-exports DOM helpers and hosts a global application registry on `window`.
- The module exposes a single `core` object: `{ app, be, toBe, createBe }` intended as the canonical import surface for `idae-html` components (components should not import `@medyll/idae-be` directly).
- The global `app` registry implements resource tracking and loaders: `loadScript(url, key?)`, `loadStyle(url, key?)`, and `loadResources(urls[])`. It records loaded resources to avoid double-loading.

**Detected intentions & leads**
- Build a library of HTML components (the user's stated goal). The repo mixes Svelte tooling and plain HTML examples, indicating two parallel aims:
  - produce reusable HTML fragments / modules (vanilla HTML usage), and
  - use Svelte/Vite to author, preview, and package components.
- `moduleLib/resizePanel` shows a concrete component implementation and a pattern for future components (a small JS module exposing behavior).
- Example/demo pages (`example.html`, `module.html`, `src/source/+page.svelte`) suggest the author wants easy local previews and embedable examples.
- `cli.cjs` + `package-pre.js` show intent for an automated packaging flow (prepackage / build hooks).

**Source files analysis (src/source)**
- `+page.svelte` ([packages/idae-html/src/source/+page.svelte](packages/idae-html/src/source/+page.svelte)):
  - Svelte test/preview page that imports `$lib/htmluModules.js` and uses `cssDom`/`htmlDom` helpers.
  - Demonstrates runtime behaviors: periodic DOM updates (`playIt()`), conditional module mounting (`data-htmlu-module-id`, `data-auto-track`) and custom data attributes (`data-cssDom`, `data-htmlu-*`).
  - Signals: author uses Svelte for interactive preview and relies on library runtime APIs to wire behavior to DOM attributes.

- `content.html` ([packages/idae-html/src/source/content.html](packages/idae-html/src/source/content.html)):
  - Shows a declarative content syntax (custom elements/templating tags like `<loop>`, `<if>`, `<bind>`) and usage of `ResizeObserver` and `data binding` placeholders.
  - Signals: there is either a custom runtime that parses these tags or they are examples for a templating layer; indicates ambition for higher-level HTML DSL or micro-templates.

- `example.html` ([packages/idae-html/src/source/example.html](packages/idae-html/src/source/example.html)):
  - Small demo that runs `cssDom(...).each(...)` and an inline `<script data-attr="htmludom">` block which binds `window.der`, etc.
  - Signals: examples include inline behavior scripts that expect to be executed in the page context and rely on `data-attr` attributes to attach behavior.

- `module.html` ([packages/idae-html/src/source/module.html](packages/idae-html/src/source/module.html)):
  - Another demo with Svelte-like `PageData` typing at top and inline `data-attr="htmludom"` script. Intended as a module preview page.
  - Signals: mixing of Svelte typing with vanilla HTML demo—used for previewing modules inside Svelte routing.

Implications & recommended small fixes from the source files:
- Inline scripts using `data-attr="htmludom"` should be refactored into separate modules under `src/lib/moduleLib/` and imported by preview pages—this clarifies packaging vs runtime responsibilities.
- The custom templating tags in `content.html` need explicit documentation or a parser implementation; decide whether to keep them as examples for a future templating layer or remove them to avoid confusion.
- Preserve `+page.svelte` as a development preview harness, but move stable examples to `examples/` and make them import the same modules that `dist/` will ship.
- Add a short `EXAMPLES.md` or README in `src/source` describing how each file is intended to be used (preview, docs, or example embed), plus the runtime attributes (`data-auto-track`, `data-htmlu-module-id`, `data-cssDom`, `data-attr="htmludom"`).

- Ensure all examples and components follow the new `core` import convention and stop importing `@medyll/idae-be` directly. Consider adding a lint rule or CI check that flags direct `idae-be` imports inside `packages/idae-html`.

**Immediate issues & observations**
- Build outputs in `.svelte-kit/__package__` appear committed — these should usually be generated and ignored (`.gitignore`) or moved to `dist/`.
- The repository mixes source and generated artifacts; needs cleanup to make the source-of-truth clear.
- Missing or incomplete documentation in `README.md` about how to build, preview, and publish the library.

- `core-engine.ts` now provides the canonical runtime API; document its usage in `README.md` (example import, `core.app.loadResources([...])`, and the `core` object shape).

**Open questions (to decide next)**
- What is the target consumer API? (vanilla HTML snippets, ES modules, web components, or Svelte-specific wrappers?)
- Desired distribution formats: ESM only, UMD for browser direct use, or web components (custom elements)?
- Publishing strategy: npm package (source + types), CDN bundle, or git-hosted examples?

**Recommended short-term next steps**
- Clean repository: remove or gitignore generated artifacts in `.svelte-kit/__package__` and keep only `src/` as source.
- Explicitly define target formats and export surface in `src/lib/index.ts` (decide whether to export web components, plain JS modules, or Svelte wrappers).
- Consolidate packaging scripts: make `package.json` scripts predictable (`build`, `prepackage`, `preview`, `clean`, `pack`) and document them in `README.md`.
- Create `examples/` or `docs/` that reuse `example.html` and `module.html` as static demos; provide a Vite dev preview for live editing.
- Add a minimal CI check: `pnpm build` and a linter step to avoid committing built outputs.
- Add a small test or validation harness for `resizePanel` behaviour (unit test or Playwright smoke demo) to anchor component API.

- Run a verification sweep to ensure no files in `packages/idae-html` import `@medyll/idae-be` directly and update remaining files to import `core` instead. This is recommended before publishing.

**Longer-term suggestions**
- Choose a publishing format and implement the build pipeline to output `dist/` artifacts (ESM + types, optional UMD), update `package.json` `main`/`module`/`types` fields.
- Add documentation for component authoring guidelines (CSS strategy, class naming, accessibility checklist).
- Consider a lightweight storybook-like preview (Vite pages) so designers/devs can explore components.

**References / quick file pointers**
- Source: [packages/idae-html/src/lib/index.ts](packages/idae-html/src/lib/index.ts)
- Example pages: [packages/idae-html/src/source/+page.svelte](packages/idae-html/src/source/+page.svelte)
- CLI & scripts: [packages/idae-html/cli.cjs](packages/idae-html/cli.cjs)  [packages/idae-html/scripts/package-pre.js](packages/idae-html/scripts/package-pre.js)
- Existing compiled package artifacts: [packages/idae-html/.svelte-kit/__package__/index.js](packages/idae-html/.svelte-kit/__package__/index.js)

