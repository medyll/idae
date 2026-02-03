# GitHub Copilot Instructions for idae-idbql

**Package Manager**: This package is part of the Idae monorepo, which uses **pnpm** for dependency and script management. Use `pnpm install`, `pnpm run`, etc. to ensure consistency.

## Overview

`idae-idbql` is a MongoDB-like query wrapper for IndexedDB in the browser. It provides a reactive, chainable API for CRUD operations, filtering, sorting, and pagination, and uses `idae-query` internally for result processing.

### Critical Patterns
- Use `createIdbqlState()` to wrap a reactive proxy around the database.
- Listen to `idbqlEvent` (global event bus using `$state`) for DB change subscriptions.
- Access collections via `idbql.collectionName`; use `.where()` for queries.
- Do not access `IDBObjectStore` directly; always use `CollectionCore` methods for transactions.
- Supports chainable queries: `.where()`, `.sortBy()`, `.getPage()`, etc.

### Build & Test
- Build: `pnpm run build`
- Test: `pnpm run test`
- Lint/format: `pnpm run lint && pnpm run format`

### Best Practices
- Use for browser-side persistence with reactive updates.
- For in-memory queries, use idae-query instead.
- See [README.md](README.md) for usage examples and API details.

---

For more, see the package [README.md](README.md) or monorepo documentation.
