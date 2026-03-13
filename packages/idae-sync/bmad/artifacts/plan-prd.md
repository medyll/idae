# idae-sync Product Requirements Document (PRD)

## Objectives
- Provide an offline-first, resilient sync layer between local IndexedDB (idae-idbql) and remote API.
- Ensure immediate local UX while guaranteeing eventual consistency via an Outbox and pluggable delivery pipeline.
- Default deterministic conflict resolution (LWW via `updated_at`) and extensible onConflict hook.

## Scope (MVP)
- Outbox store (`__outbox__`) in same DB and same-transaction writes where possible.
- SyncAdapter that enqueues local write intents and attempts immediate delivery with in-package retry/backoff.
- Pluggable deliverer interface (example: IdaeApiDeliverer).
- Silent/source semantics to avoid re-emitting server-applied writes.
- Tests and docs; Service Worker background sync out of scope (planned follow-up).

## User Stories
- As an app user, my local writes are immediately visible and are reliably delivered to the server.
- As a developer, I can provide a deliverer that maps OutboxEntry → HTTP calls and observe retry/telemetry.
- As an integrator, server-applied changes are applied locally without re-triggering sync loops (silent writes).

## Success Criteria
- Local writes persist and create Outbox entries in the same transaction when using provided tx helpers.
- Successful delivery removes entries and applies server canonical response locally with `silent=true` and `source='remote'`.
- Transient failures trigger exponential backoff retries; permanent 4xx errors are surfaced to telemetry/UI.
- Conflict resolution respects `updated_at` by default; onConflict hook is available and exercised in tests.

## Acceptance Tests
- Local write → Outbox enqueue → deliverer success → Outbox removed and silent remote write applied.
- Simulated network failure: Outbox entries persist across reloads and succeed after network restoration; retryCount increments.
- Permanent 4xx: Outbox entry marked failed and telemetry event emitted.
- Conflict (server newer `updated_at`): onConflict invoked; default behavior accepts remote.
- Atomic transaction: data + outbox committed together when using `tx`.

## Rollout Plan
1. Merge idae-idbql API changes (multi-adapter, silent/source, WhereSerializer).
2. Implement OutboxStore and SyncAdapter in idae-sync, with example IdaeApiDeliverer.
3. Add unit and integration tests; stage in canary channels for apps using initSync.
4. Monitor telemetry (see below); watch Outbox failure and retry metrics before broad rollout.

## Migration Notes (`updated_at`)
- Require `updated_at` ISO timestamp on writeable records; if absent, code treats it as epoch 0.
- Provide read-time compatibility and optional bulk backfill scripts to populate `updated_at` where feasible.
- Update client models and any server mappings to emit canonical `updated_at` on successful writes.

## Monitoring & Telemetry
- Emit metrics/events for: Outbox enqueue rate, delivery success rate, transient retry counts, permanent failure counts, average backoff duration.
- Surface per-entry error details for 4xx failures to enable triage.
- Track onConflict invocations and resolutions for debugging conflict patterns.

## Open Questions
- Which server endpoints and exact HTTP mappings will IdaeApiDeliverer use? (Implementation task: map op→endpoint.)
- Ownership of Service Worker migration and cross-tab coordination timeline.
- UX surface for permanent Outbox failures: inline user notification vs. centralized error dashboard.

---

Generated from ARCHITECTURE.md and README.md (idae-sync package).
