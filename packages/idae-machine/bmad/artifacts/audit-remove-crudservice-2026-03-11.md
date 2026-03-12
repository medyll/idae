Audit update: remove CrudService

Date: 2026-03-11

## Summary

The in-memory helper src/lib/db/CrudService.ts and its public export from src/lib/index.ts were removed from the @medyll/idae-machine package. This file was a small mock/service that duplicated functionality already implemented by the Machine store (machine.store / idbql). A repo-wide search showed no runtime imports; only documentation and changelog references existed.

## What changed

- Deleted: src/lib/db/CrudService.ts
- Removed export from: src/lib/index.ts
- Commit: chore(idae-machine): remove CrudService and its export (see recent commit on HEAD)

## Why

- Core CRUD behavior is implemented via machine.store and idbql; CrudService was unused, type-unsafe (many `any`), and intended only as a demo/mock.
- Removing it reduces surface area, avoids confusion, and encourages consumers to use the canonical Machine API in src/lib/main.

## Verification

- Repo search for "CrudService" found only docs (CHANGELOG, bmad artifacts) and the package export; no runtime imports in code.
- Unit tests were run after the change: majority passed; 3 tests failed in Machine validation suite (see test run output in CI logs). These failures appear unrelated to removing CrudService.

## Recommendations / Next steps

1. Update documentation references (CHANGELOG, bmad artifacts) to reflect removal where appropriate.
2. Investigate & fix the 3 failing unit tests in Machine validation (appeared during the test run after the change).
3. Consider adding a small note in README/demo indicating removal and pointing to machine.store usage examples.

Created by: Copilot automation
