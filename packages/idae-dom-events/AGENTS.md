# GitHub Copilot Instructions for idae-dom-events

**Package Manager**: This package is part of the Idae monorepo, which uses **pnpm** for dependency and script management. Use `pnpm install`, `pnpm run`, etc. to ensure consistency.

## Overview

`idae-dom-events` provides utilities for DOM manipulation and event observation, with a callback-chaining API.

### Critical Patterns
- All methods must return the root object to allow chaining:
  ```typescript
  be('#container').append(toBe('<div>'), ({ be }) => be.addClass('highlight').on('click', handler))
  ```
- Never break the callback chain.
- Follow monorepo structure for imports and dependencies (`@medyll/idae-dom-events`).

### Build & Test
- Use `pnpm run build` to build (Vite).
- Run tests with `pnpm run test`.
- Lint and format: `pnpm run lint && pnpm run format`.

### Specific Rules
- Do not modify the DOM directly; always use the provided utilities.
- Prefer reactive patterns and chaining for all DOM manipulation or event listening.

---

For more information, see the package [README.md](README.md) or the monorepo documentation.
