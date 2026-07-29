# Changelog

## [0.1.1] - 2026-07-29
**Features:**
- add Playwright screenshot scripts and stubs for server-only packages
- add add-skill CLI entry point for @medyll packages
- add 'add-skill' command to multiple packages and enhance skill management
- enhance slider functionality and improve touch event handling
- add author information to README files and create collection context
- update package names and improve documentation for idae-slotui, idae-socket, idae-stator, and idae-sync
- add context-mode hooks for vscode-copilot integration
- Update README and status files for improved clarity and documentation
- Add implementation status and release artifacts for v0.1.0
- complete Sprint 04 with cache integration and generics
- add in-memory SWR cache engine and related utilities
- implement HTTP data-fetching for routes
- update PRD for idae-router to version 2.0.0; enhance title and add supersedes information
- update status and progress in status.yaml; enhance demo.html with new features and styling
- update dashboard and status files for Sprint 03 planning and progress tracking
- enhance router functionality with recursive route matching and outlet handling
- add support for nested routes with parent-child rendering and update demo files
- implement nested route handling with parent-child mounting and cleanup logic
- implement core router functionality with path matching, context handling, and lifecycle hooks

**Refactoring:**
- update package READMEs for clarity and consistency
- remove unused types and interfaces from types.ts

**Chores:**
- simplify package scripts and remove unused test runners
- update test script to run unit and coverage tests together
- update test scripts and configurations for consistency across packages
- update package.json to set idae-mono-expand-vitrine as public and modify test script for idae-router
- add esbuild to onlyBuiltDependencies in pnpm-workspace.yaml

**Other:**
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor context-mode hooks to include VS Code environment guard; remove unused QwenAdapter; add BOM restoration scripts and PowerShell utilities for branch management.
- Refactor code structure for improved readability and maintainability



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
