# GitHub Copilot Instructions for idae-query

**Package Manager**: This package is part of the Idae monorepo, which uses **pnpm** for dependency and script management. Use `pnpm install`, `pnpm run`, etc. to ensure consistency.

## Overview

`idae-query` is a generic, in-memory query engine for JavaScript/TypeScript arrays. It provides a fluent, chainable API for filtering, sorting, grouping, and paginating data.

### Critical Patterns
- Use `getResultset(data)` to create a queryable result set from an array.
- Chain methods like `.where()`, `.sortBy()`, `.groupBy()`, `.getPage()` for data operations.
- Supports dot-path resolution for nested properties.
- Stateless: does not mutate the original array.
- Used internally by idae-idbql for result processing.

### Build & Test
- Build: `pnpm run build`
- Test: `pnpm run test`
- Lint/format: `pnpm run lint && pnpm run format`

### Best Practices
- Use for in-memory data only (API responses, local arrays).
- For persistent or reactive queries, use idae-idbql instead.
- See [README.md](README.md) for usage examples and API details.

---

For more, see the package [README.md](README.md) or monorepo documentation.
