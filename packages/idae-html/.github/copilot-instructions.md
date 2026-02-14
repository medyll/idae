<!-- Copilot / AI agent instructions for contributors and assistants -->

# Copilot Instructions for idae-html

Purpose: give AI coding agents the exact, actionable context needed to make safe, small, and correct changes in this package.

Quick start
- Install: `pnpm install`
- Common scripts: check `package.json` for exact names. Typical commands used by maintainers:
	- `pnpm run build` — package build (packaging scripts may invoke `scripts/*.js`)
	- `pnpm run test` — run tests
	- `pnpm run lint` / `pnpm run format` — code quality
	- Look in `scripts/` for repository-specific build helpers: `build-html-all.js`, `build-html-component.js`, `build-resizePanel.js`.

Big picture (what/where/why)
- Core runtime and exports live in `src/lib/` — see `src/lib/index.ts` and `src/lib/main.ts` for entry points.
- `src/lib/core-engine.ts` contains runtime helpers for rendering/manipulating HTML fragments.
- Components are raw HTML snippets under `src/lib/components/` (each example is a plain `.html` file used as both documentation and a runtime fragment).
- `src/lib/moduleLib/` contains TypeScript modules that implement component logic (examples: `moduleInline.ts`, `resizePanel.ts`). Modules are small, functional, and return or mutate HTML/state rather than using a framework lifecycle.
- The package is intentionally framework-agnostic: templates are plain HTML/strings and can be used server-side or client-side. Use `escapeHtml` for user-supplied content and `parseHtml` when converting strings to DOM structures.

Data flow and integration
- Template → string (via helpers in `src/lib/*`) → inserted into DOM or served over HTTP. Keep changes local to the string/DOM boundary.
- Event wiring is often delegated to `@medyll/idae-dom-events` (see `main.ts`) and small per-component modules in `moduleLib`.
- Persistent or advanced behaviors may integrate with `idae-idbql` and `@medyll/idae-stator` elsewhere in the monorepo — prefer small, explicit imports rather than implicit globals.

Project conventions (explicit, observable rules)
- Prefer functional, composable helpers over classes. New features should be small exported functions.
- Safe escaping: always use `escapeHtml` for any value that may contain user data.
- Examples and demos are plain `.html` files under `src/lib/components/*` and `src/source/*`. Update both when changing component markup.
- TypeScript: follow the existing patterns in `src/lib/moduleLib/*.ts` for types and exports. Keep public exports minimal and documented in `src/lib/index.ts`.

How to add/update a component (concrete steps)
1. Add component markup under `src/lib/components/<name>/index.html`.
2. If behavior is required, add `src/lib/moduleLib/<name>.ts` exporting focused functions.
3. Export any public APIs in `src/lib/index.ts` so other packages in the monorepo can import them.
4. Add or update example pages in `src/source/` and the Svelte route if present (`src/routes/+page.svelte`).
5. Run `pnpm run build` and `pnpm run test` (or the specific script in `package.json`) to validate.

Build & debug notes (repo-specific)
- Several JS build helpers live in `scripts/` and are used by packaging steps — inspect them before changing build behaviour.
- This package is used directly in Svelte examples — to validate changes, open `src/routes/+page.svelte` or `src/source/example.html` and test the integration.
- There may not be a dedicated dev server script in this package; check the monorepo root or `package.json` for `dev`/`start` scripts.

What not to change without confirmation
- Global monorepo conventions (lint rules, commit format). If your change touches config at repo root, confirm with maintainers.

References (examples to inspect)
- Core runtime: `src/lib/core-engine.ts` and `src/lib/index.ts`
- Examples/components: `src/lib/components/resizePanel/index.html`, `src/lib/components/exampleInline/index.html`
- Module implementations: `src/lib/moduleLib/resizePanel.ts`, `src/lib/moduleLib/moduleInline.ts`
- Packaging helpers: `scripts/build-html-all.js`, `scripts/build-html-component.js`

If anything is ambiguous, ask: "Where is the intended consumer of this change — examples, packaged artifact, or another monorepo package?" That determines whether to update `components/`, `moduleLib/`, or `index.ts` exports.

---
If you want, I can (1) run tests/build locally, (2) open a PR with a small example change, or (3) expand these notes into a CONTRIBUTING.md section. Which would you prefer?
