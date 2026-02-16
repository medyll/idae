# Copilot instructions — `idae-router`

Purpose: Help AI coding agents get productive quickly in this SvelteKit-based library package.

Big picture

- This package is a Svelte component/library (not an app). Source lives in `src/` and public exports must be re-exported from `src/lib/index.ts`. The build creates a distributable in `dist/` (Svelte package output) which is what gets published to npm.

Key files to read (quick scan order)

- `package.json` — scripts, `files`, `exports`, peerDeps (`svelte`), and packaging hooks.
- `vite.config.ts` — Vitest test projects and include/exclude patterns for component vs server tests.
- `playwright.config.ts` — E2E test server command and port (preview runs on port `4173`).
- `scripts/package-pre.js` — project-specific prepack/per-package generator used by the mono-repo.
- `src/lib/index.ts` — canonical public export surface (edit here to add/remove exports).
- `src/routes/` and `static/` — useful for visual preview pages and assets used by E2E tests.

Important workflows (exact commands)

- Dev: `npm run dev` (starts `vite dev`).
- Build: `npm run build` (runs `vite build && npm run prepack`).
- Prepack (packaging step): `npm run prepack` → `svelte-kit sync && svelte-package && publint` (publint failures block publishing).
- Prepare (sync svelte entries): `npm run prepare` (`svelte-kit sync`). Run after changing `exports`/`svelte` fields.
- Prepackage task: `npm run prepackage` runs `node scripts/package-pre.js` — this script generates/updates index files used by packaging.
- Unit tests: `npm run test:unit` (Vitest).
- Full test: `npm test` (runs unit tests and then E2E).
- E2E: `npm run test:e2e` (Playwright). Playwright's config runs `npm run build && npm run preview` on port `4173`.
- Lint / format: `npm run lint` and `npm run format` (Prettier + ESLint).

Testing conventions and gotchas

- Unit test glob: `src/**/*.{test,spec}.{js,ts}` (see `vite.config.ts`). Svelte-file tests are excluded from the `server` project via `src/**/*.svelte.{test,spec}.{js,ts}` exclusion.
- E2E tests live in `e2e/` and expect a built preview server on port `4173`.
- Typical verification sequence when changing exports or packaging:
  1. `npm install`
  2. `npm run format`
  3. `npm run lint`
  4. `npm run test:unit`
  5. `npm run build` && `npm run preview` (then optionally `npm run test:e2e`)

Packaging & module rules (must-follow)

- `package.json` declares `svelte: ./dist/index.js` and `types: ./dist/index.d.ts` — ensure `svelte-package` produces these files.
- `files` only includes `dist/` and explicitly excludes `*.test.*` / `*.spec.*` under `dist`.
- `sideEffects` lists CSS (`**/*.css`) so bundlers keep CSS imports.
- Project is ESM: keep `type: "module"`. Do not convert outputs to CommonJS.
- Peer dependency: `svelte` (v5+). Do not bundle Svelte into `dist`.

Project-specific conventions & examples

- Add/modify public exports in `src/lib/index.ts`. After changing exports run `npm run prepare` and `npm run prepackage` before `npm run build` when verifying packaging.
- `scripts/package-pre.js` calls a shared generator (`../../shared/scripts/indexIfy.js`) — if you change export shape, re-run the prepackage generator so `dist` indexes match expectations.
- Tests: keep unit tests next to implementation using `.test`/`.spec` suffixes; component demos can live in `src/routes/` for preview and manual QA.

Where to make changes

- Public API: `src/lib/index.ts`
- Package/index generation: `scripts/package-pre.js` (invoked via `npm run prepackage`)
- Test adjustments: `vite.config.ts` and files under `src/` and `e2e/`.

If you want me to merge additional conventions from other repo-wide AI guideline files (AGENT.md, AGENTS.md, CLAUDE.md, or rules under `.cursor`/`.windsurf`), point me to them and I will incorporate their content.

If anything here is missing or unclear, tell me which area (tests, packaging, exports, or E2E) and I will expand with exact file-level examples.
