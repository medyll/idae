# idae-html

**Package Manager**: This package is part of the Idae monorepo, which uses **pnpm** for dependency and script management. Use `pnpm install`, `pnpm run`, etc. to ensure consistency.

## Overview


`idae-html` provides utilities and helpers for HTML generation, parsing, and manipulation in JavaScript/TypeScript projects. It is designed to be used both in browser and Node.js environments.

### Monorepo Dependencies
- `@medyll/idae-dom-events`: DOM event helpers and advanced event-driven logic (see `src/lib/main.ts`).
- `idae-idbql`: IndexedDB query layer for client-side persistence (used in advanced scenarios; see monorepo for details).
- `@medyll/idae-stator`: state management and reactivity utilities (used for advanced stateful UI/data flows; see monorepo for usage patterns).

## Features
- HTML string generation and templating
- Safe escaping and sanitization helpers
- DOM parsing and manipulation utilities
- Integrates with other Idae packages for UI, data flow, and state management

## Usage
Import the required helpers from the package:
```js
import { html, escapeHtml, parseHtml } from '@medyll/idae-html';

const markup = html`<div>${escapeHtml(userInput)}</div>`;
const dom = parseHtml(markup);
```

## Build & Test
- Build: `pnpm run build`
- Test: `pnpm run test`
- Lint/format: `pnpm run lint && pnpm run format`

## Contributing
- Follow the monorepo conventions for code style and commit messages.
- Add tests for new features or bug fixes.
- See the monorepo root README for more details.

---

For more, see the monorepo documentation or contact the maintainers.
