# Changelog

All notable changes to `@medyll/idae-router` are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [0.1.0] – 2026-03-02

First public release. Baseline router with security fixes, error handling, and route-level HTTP data-fetching.

### Added

- **Route-level HTTP data-fetching** (`Route.http` / `Route.http_source`)
  - `http`: same-origin fetch — `window.location.origin` prepended automatically
  - `http_source`: external HTTPS fetch — `https://` prepended; plain HTTP rejected
  - `:param` token interpolation from matched route params before fetching
  - Fetch result stored in `ctx.data`; fetch errors stored in `ctx.error` (navigation always continues)
  - `args?: RequestInit` on both options for headers, method, body, signal
  - `http` + `http_source` mutually exclusive per route (`http` wins, `console.warn` emitted)
- `onError` callback on `RouterOptions` and `RouterInstance` for structured error handling
- `notFound` callback on `RouterOptions` for custom 404 pages
- `notFound` supports cleanup functions (returned function invoked on next navigation)
- Test coverage infrastructure (`@vitest/coverage-v8`, thresholds: 75% lines/functions/statements)
- Hash mode routing tests (path parsing, query params, dynamic params, before hooks)
- 404 fallback tests (callback invocation, context shape, cleanup ordering, after hooks)
- `jsdom` devDependency for DOM-environment unit tests

### Fixed

- **XSS vulnerability**: HTML string content now routed through DOMPurify when available; falls back to `textContent` for unsafe strings (prevents arbitrary HTML injection via `action` return values)
- **Silent error swallowing**: Navigation errors now surface via `onError` callback or `console.error` instead of being silently swallowed
- **Build script**: Changed `npm run prepack` → `pnpm run prepack` to work correctly in the pnpm monorepo
- **Test script**: Changed `npm run` → `pnpm run` in the composite `test` script

### Changed

- `package.json` `main` field added (`./dist/index.js`) for CommonJS-compatible consumers
- Added `keywords`: `router`, `spa`, `history`, `hash`, `client-side-routing`

---

## [0.0.1] – 2026-02-28 (pre-release, unpublished)

Initial internal version. Basic history/hash router, link interception, nested routes, before/after/onLeave hooks.
