# Changelog

## [1.0.1] - 2026-07-29
**Features:**
- update ExplorerTableInline to use $derived for store items
- S35-01/02/04/05 HydrationController, revalidate, autoHydrate
- complete idae-sync S-fix-04 to S-fix-06
- add 'add-skill' command to multiple packages and enhance skill management
- enhance slider functionality and improve touch event handling
- add author information to README files and create collection context
- update package names and improve documentation for idae-slotui, idae-socket, idae-stator, and idae-sync
- phase 4 — circuit breaker, flush, priority, queue limit, field merge, server push, persistence
- phase 3 — DLQ, network awareness, compaction, batch, hooks, debug
- add permissions configuration for Bash commands in settings.json
- add server-first sync mode with optimistic write + rollback
- update README files with comprehensive documentation for idae-sync
- update status phase to production-ready and include test results
- update permissions in settings and finalize implementation phase in status.yaml
- add CLAUDE.md for package guidance and sync outbox API design documents
- add context-mode hooks for vscode-copilot integration
- add deliverer observability (metrics) and mark bmad complete
- add onConflict strategies (bmad-next-auto)
- add deliverer core (bmad-next-auto)
- implement outbox-backed SyncAdapter (bmad-next-auto)
- add transactional outbox writes (bmad-next-auto)
- add OutboxStore interface & in-memory impl (bmad-next-auto)
- add WhereSerializer (bmad-next-auto)
- implement window styles and remove outdated PRD document
- design public outbox API (bmad-next-auto)
- add Copilot instructions and Product Requirements Document for idae-sync package
- add outbox telemetry metrics and subscription API; update example to subscribe\n\nExpose getMetrics() and subscribe() on OutboxStore to report queue metrics (length, oldestAge, retry histogram).\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
- enhance DataForm component with detailed documentation and clean up unused code
- initSync helper to register SyncAdapter with idbql and start background processing
- implement IdaeApiDeliverer and background processing loop in SyncAdapter; add OutboxStore.update
- SyncAdapter uses OutboxStore, attempts immediate delivery via optional deliverer
- implement IndexedDB Outbox store and ensure __outbox__ schema
- add canonical where() to adapter types and add idae-sync README

**Bug Fixes:**
- update import paths to include file extensions for consistency
- update import path for IdaeApiClient to use client submodule
- hydrate full collection by forwarding limit=0 through encoded params
- fix IDB schema init + align all tests to new API
- propagate updated_at (bmad-next-auto)

**Documentation:**
- update usage instructions and enhance clarity on sync features
- update README for phases 2-4 + remove dead idempotencyKey
- add ARCH-SPEC (bmad-plan-arch)
- add README.PROD.md (bmad-readme)
- add PRD (bmad-plan)
- improve bootstrap example to show adapter ordering and atomic writes\n\nDemonstrate initSync preserving existing adapters and performing atomic data+outbox transaction.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
- add examples\n\nAdd bootstrap example and examples README\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
- note implemented idbql changes and Outbox scaffolding

**Refactoring:**
- update package READMEs for clarity and consistency
- unify deliverer interface and fix sync outbox API

**Tests:**
- add outbox deliverer integration tests (bmad-next-auto)
- add integration tests and CI workflow\n\nAdd vitest tests for OutboxStore and SyncAdapter using fake-indexeddb and CI workflow to run package tests.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>

**Chores:**
- update dependencies and remove deprecated packages
- scaffold OutboxStore and SyncAdapter

**Other:**
- Refactor context-mode hooks to include VS Code environment guard; remove unused QwenAdapter; add BOM restoration scripts and PowerShell utilities for branch management.
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- bmad: update status (next)
- bmad: add next todos (bmad-next)


