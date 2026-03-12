Fix: AUDIT-DB-001 — ChromaDB Adapter Tests (mocked)

Date: 2026-03-12

Summary:
- Implemented integration-style tests for the ChromaDB adapter using a mocked Chroma client to keep tests CI-friendly and fast.
- Tests cover: adapter initialization, create/add behavior, findById, find (query), deleteById, update() wiring, and expected failures for unsupported operations (updateWhere/deleteWhere/createIndex).

Files changed:
- packages/idae-db/tests/integration/chroma.integration.test.ts — added mocked integration tests
- bmad/status.yaml — marked AUDIT-DB-001 as done
- bmad/dashboard.md — reflected test completion

Test run:
- Command: pnpm --filter @medyll/idae-db run test -- --run tests/integration/chroma.integration.test.ts
- Result: 2 tests passed (0 failed)

Notes:
- Chosen strategy: Mock the Chroma client (fast, reliable in CI). If later desired, add an integration job that spins up a ChromaDB service in CI and re-run against a live instance.
- Next steps: Add unit tests for adapter edge cases (error handling, retry logic) and consider CI integration job if end-to-end coverage is required.

Generated-by: bmad-master next --auto
