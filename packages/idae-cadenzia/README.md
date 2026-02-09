# idae-cadenzia

Svelte component library and demo for Cadenzia UI elements used by the Idae project.

## What this package is

`@medyll/idae-cadenzia` bundles a small set of Svelte v5 components and a demo route that showcase musical cadence UI primitives used across Idae projects. Components are implemented in TypeScript and kept intentionally small so logic can be unit-tested separately from UI.

## Quick start

Install and run the dev server:

```bash
npm install
npm run dev
```

Build for distribution:

```bash
npm run build
npm run prepackage   # run before publishing
```

Run unit tests:

```bash
npm run test
```

Formatting & linting:

```bash
npm run format
npm run lint
npm run check      # svelte type checking
```

## Architecture & conventions

- Svelte v5 + TypeScript components live under `src/lib/components/` (examples: `App.svelte`, `CadencePanel.svelte`, `ChordTable.svelte`, `ChordVisualization.svelte`).
- Non-UI logic and helpers are placed in `src/lib/functions/` (`functions.svelte.ts`, `rules.ts`) to keep components thin and testable.
- Shared types and constants: `src/lib/types/types.ts` and `src/lib/constants/constants.ts`.
- Public exports are controlled from `src/lib/index.ts` — add new components there to expose them to consumers.

Import example (consumer):

```js
import { CadencePanel } from '@medyll/idae-cadenzia';

// or import default component
import CadencePanel from '@medyll/idae-cadenzia/dist/index.mjs';
```

Design notes:
- Prefer moving computation out of `.svelte` files into `functions/*.svelte.ts` so behavior is easy to unit-test.
- Keep component props strictly typed using the central types file.

## Testing

- Tests use Vitest. Example test: `src/demo.spec.ts`.
- Write tests against pure logic in `src/lib/functions/` where feasible; mock Svelte-specific behavior only when necessary.

## Files to review when changing behavior

- `src/lib/components/` — UI components
- `src/lib/functions/functions.svelte.ts` — helpers
- `src/lib/functions/rules.ts` — domain rules
- `src/lib/index.ts` — public API
- `src/routes/+page.svelte` — local demo page used by `vite dev`

## Packaging & publishing notes

- This package is ESM (`type: module`) and built with Vite. `npm run prepackage` runs `scripts/package-pre.js` to prepare package outputs.
- Keep exports compatible with Svelte packaging expectations when changing `src/lib/index.ts`.

## Contributing

Open a branch from `dev`, add focused commits, and submit a PR with a short description of behavior changes and any required demo steps to verify locally.

---

If you want, I can also add a short PR checklist and a sample unit test for `functions.svelte.ts` — which would you prefer next?
