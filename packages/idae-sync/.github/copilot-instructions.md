# Copilot instructions for @medyll/idae-sync

Important: you are in a monorepo with multiple packages. Each package may have its own AGENTS.md and CLAUDE.md that could contain package-specific guidance for Copilot and Claude sessions : You don't need to read these other files. 

Package: you must work in this directory src\packages\idae-sync
Purpose
- Provide concise, actionable guidance for future Copilot CLI sessions editing or extending this package.

Build / Test / Lint (package-specific)
- Run tests (from package):
  - cd packages\idae-sync && pnpm test
  - From monorepo root: pnpm --filter "@medyll/idae-sync" test
- Test runner: Vitest (devDependency). The package test script runs: `vitest run --reporter=dot`.
- Run a single test by name (example):
  - pnpm test -- -t "should enqueue outbox"
  - Or run a single file: pnpm test -- tests\outbox.spec.ts
- There is no package-local build or lint script; repo-level tooling (pnpm workspace scripts) may provide workspace-wide commands. Copilot should prefer package.json scripts first, then root scripts.

High-level architecture (big picture)
- Purpose: Provides an offline-first sync layer implementing an Outbox pattern on top of idae-idbql (IndexedDB) and a pluggable delivery pipeline.
- Core components:
  - OutboxStore (IndexedDB object store `__outbox__`) — persistent queue of write intents (id, collection, op, data, whereClause, meta).
  - SyncAdapter — listens to idae-idbql events and enqueues Outbox entries; runs immediate delivery attempts and background retry with exponential backoff.
  - Deliverer (pluggable) — maps OutboxEntry → HTTP request using idae-api or a custom client; responsible for success/failure semantics.
  - idae-idbql integration — events carry `silent?: boolean` and `source?: 'local'|'remote'|'system'` to avoid re-emitting server-applied changes.
- Important runtime flows:
  - Local write → idae-idbql emits event (source: 'local') → SyncAdapter enqueues OutboxEntry → deliverer attempts delivery → on success apply server response locally with { source: 'remote', silent: true }.
  - Atomic writes: data + outbox should be committed using an IDB transaction; many APIs accept an `opts.tx` to pass a transaction.
- Conflict resolution: default Last-Write-Wins (LWW) using `updated_at` ISO timestamps; an `onConflict(local, remote)` hook is provided for custom strategies.

Key conventions and package-specific patterns
- Event payloads: IdbqlEventPayload includes { collection, op, data?, key?, keyPath?, whereClause?, silent?, source? }.
  - `silent: true` prevents SyncAdapter from re-enqueuing or re-emitting sync triggers when applying remote changes.
  - `source` indicates origin and is used to avoid loops.
- OutboxEntry shape (canonical): { id, collection, op, key?, data?, whereClause?, meta: { retryCount, lastAttempt?, createdAt } }.
- `__outbox__` store: lives in the same IndexedDB database as application data to enable same-transaction writes.
- Where-based ops: updateWhere/deleteWhere capture a serialized `whereClause` (use WhereSerializer) so clause-ops can be deterministically replayed.
- Transaction-friendly API: callers should pass `opts.tx` when they need atomic commits across collections and the outbox.
- Adapter registry: idae-idbql.registerAdapter accepts multiple adapters (ordered). Implementations must be resilient to exceptions in one adapter so others still run.
- Deliverer contract: deliverer should return a value indicating permanent success vs transient failure; SyncAdapter uses this to remove or backoff entries.
- Tests: use SyncAdapter.processOnce() or process a single delivery pass for deterministic integration tests.

Where to consult other assistant configs and design docs
- Repository root AGENTS.md exists (D:\boulot\dev\node\idae\AGENTS.md) and many package-level AGENTS.md files under packages/* — consult them for package-specific agent guidance.
- CLAUDE.md found at packages\idae-slotui\CLAUDE.md — consult if a Copilot session should honor Claude-specific rules in that package.
- ARCHITECTURE.md in this package contains the decision record and important implementation notes; prefer it for design rationale.

Notes for Copilot editing sessions
- Prefer package.json scripts; if missing, prefer workspace-level pnpm filters to run package tasks from the repo root.
- When adding features that touch idae-idbql events, update ARCHITECTURE.md and tests to capture new semantics (silent/source, whereClause serialization).
- Keep Outbox and data writes atomic where applicable by using existing transaction support (opts.tx).

If you want this file extended or tailored (for example to include workspace-level build/test commands, CI job names, or examples for running tests in CI), say which area to expand.
