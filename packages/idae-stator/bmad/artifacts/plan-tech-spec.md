# Tech Spec (Draft) — idae-stator S1-02

## Objective
Create a dedicated types file for idae-stator and update Stator.ts to import types from it. Ensure AugmentedState gains subscribe() and batch() method signatures.

## Scope
- Add `src/lib/stator/types.ts` with exported types.
- Update `src/lib/stator/Stator.ts` to `import type` from './types.js'.
- Run type checks and tests.

## Design notes
- Use `import type` with `.js` extension for ESM compatibility in SvelteKit.
- Keep runtime behavior unchanged; only move type declarations.

## Acceptance
See S1-02 story. This is a draft tech-spec to iterate on in PR.
