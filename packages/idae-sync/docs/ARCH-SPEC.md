# idae-sync Architecture Specification

## Purpose and scope

This document specifies the architecture, responsibilities, data model, runtime flows, operational considerations, and upgrade notes for the idae-sync package. It consolidates decisions from the package ARCHITECTURE, the Outbox RFC and production README: write-through local-first sync using an in-DB Outbox, Last-Write-Wins default conflict strategy, and an extensible adapter/deliverer surface.

Scope:
- Local IndexedDB-based Outbox and SyncAdapter integration with idae-idbql.
- Delivery semantics, retry/backoff, conflict resolution hooks, and transactional integration for atomic writes.
- Operational guidance (telemetry, metrics, failure modes) and migration notes for updated_at.

---

## System components and responsibilities

1) OutboxStore
- Responsibility: durable persistence of OutboxEntry objects in the same local DB as application data (object store: `__outbox__`).
- Core API (expected): append(entry), peek(limit), poll(limit), ack(id), markFailed(id, reason), update(entry), clear(), transactionalWrite?(tx, writeFn).
- Behavior: entries persist across reloads and are claimable for delivery attempts. Optional transactional helper allows a caller to write application data and enqueue OutboxEntry in same IDB transaction.

2) SyncAdapter
- Responsibility: integrate with idae-idbql event hooks, normalize events, enqueue Outbox entries for local writes, coordinate delivery attempts and application of server responses.
- Key behaviors:
  - Listen for idbql events. For events where event.source === 'local' && event.silent !== true, construct an OutboxEntry and append to OutboxStore.
  - Attempt immediate delivery via configured Deliverer; otherwise leave entry queued for background retry.
  - On delivery success: ack the entry and apply any server response locally with { source: 'remote', silent: true }.
  - On transient failure: increment retryCount, update lastAttempt, schedule retry per configured backoff policy.
  - On permanent failure (4xx): markFailed and surface telemetry/UI.

3) Deliverer
- Responsibility: map an OutboxEntry to a remote request and perform delivery. Returns a DeliverResult indicating success, transient failure, or permanent failure.
- Contract: deliver(entry) => { ok: true, response? } | { ok: false, transient?: boolean, status?: number, error?: string }.
- Implementations: HTTP-based mapping (op→endpoint/method) is expected in runtime (e.g., idae-api client mapping). Deliverer must surface server response (including authoritative updated_at) for conflict resolution.

4) WhereSerializer
- Responsibility: deterministic serialization/deserialization of Where<T> clause objects used by updateWhere/deleteWhere so clause ops are replayable.
- Contract: serialize(where): string; deserialize(serial: string): any.
- Requirements: stable ordering and canonical form so identical logical clauses produce identical serial strings.

5) ConflictResolver / onConflict hook
- Responsibility: resolve differences when server reports conflicting state (e.g., 409 or newer remote.updated_at).
- Hook signature (recommended): onConflict(local, remote, context: { collection, op, entry }) => { resolution: 'local'|'remote'|'merge', result?: any }.
- Default: Last-Write-Wins (LWW) using `updated_at` — remote wins if remote.updated_at > local.updated_at. Custom hooks can implement merge logic or domain rules.

6) Transaction integration
- Responsibility: ensure intent (data write + outbox enqueue) is atomic when caller requests it.
- Mechanism: Use the DB transaction provided by idae-idbql (pass tx into collection write and OutboxStore append), or use OutboxStore.transactionalWrite to run writeFn within same tx.
- Guarantee: callers that use the same transaction see the data and Outbox entry applied atomically; rollback aborts both.

---

## Data model

OutboxEntry (canonical)

- id: string (uuid)
- collection: string
- op: 'add' | 'put' | 'update' | 'delete' | 'updateWhere' | 'deleteWhere'
- key?: string | number | object
- data?: any | null
- whereClause?: any (serialized Where<T> for clause ops)
- meta: {
  - retryCount: number
  - lastAttempt?: string (ISO timestamp)
  - createdAt: string (ISO timestamp)
  - failed?: boolean
  - lastError?: string | null
}

Notes:
- The Outbox object store should be created on DB upgrade alongside application stores: `__outbox__` (same DB name by default).
- The OutboxEntry shape must be serializable as JSON and round-trip stable for replay.

updated_at rules
- All writeable application records MUST carry an `updated_at` ISO timestamp (string) to enable deterministic LWW resolution.
- On local writes, if `updated_at` is absent, callers MUST set `updated_at = now()` before persisting. SyncAdapter/outbox layer may also inject if caller omitted.
- Server responses may contain authoritative `updated_at`; when applying server results locally the adapter must use { source: 'remote', silent: true } to avoid loops.
- Migration compatibility: records lacking `updated_at` are treated as epoch (0) for conflict comparison unless a migration populates them.

---

## Runtime flows

1) Local write (happy path)
- App performs a write via idae-idbql (e.g., put/add/update). Default write metadata: { source: 'local', silent: false }.
- SyncAdapter receives the event (source: 'local', silent !== true), constructs OutboxEntry and calls OutboxStore.append(entry). If caller provided a transaction, SyncAdapter should use transactionalWrite to ensure atomicity.
- SyncAdapter attempts immediate delivery by invoking Deliverer.deliver(entry).
  - On success: SyncAdapter.ack(entry.id); apply server response locally with { source: 'remote', silent: true }.
  - On transient failure: increment retryCount, set lastAttempt, leave entry in store for scheduled retry.
  - On permanent failure: markFailed and surface telemetry/notification.

2) Delivery (background/flush)
- SyncAdapter runs worker(s) (concurrency configurable) to poll/poll-claim entries and call Deliverer.deliver.
- Delivery workers respect concurrency and backoff configuration; when transient failures occur they re-schedule delivery using exponential backoff with optional jitter.
- Successful deliveries remove entries and apply server state locally using silent remote writes.

3) Retry and backoff
- Configurable parameters (RFC defaults): maxRetries (default 5), backoffBaseMs (default 500ms), retryJitter (0..1), concurrency (default 2).
- On each transient failure: retryCount++, lastAttempt = now(). Next attempt scheduled at backoffBaseMs * 2^(retryCount-1) +/- jitter.
- After maxRetries reached, entry transitions to failed: markFailed, optionally surface UI action.

4) Conflict handling
- Deliverer may return a 409 or response containing a `remote` state with an updated_at newer than local.
- SyncAdapter calls onConflict(local, remote, context). Depending on resolution:
  - 'remote': accept remote state; apply it locally with silent=true; ack outbox entry.
  - 'local': retain local state; optionally re-enqueue or increment retry and attempt a forced update if server allows.
  - 'merge': apply merged result locally and deliver merged state to server if appropriate.
- Default: LWW — accept remote if remote.updated_at > local.updated_at.

5) Atomic transaction flow
- Caller begins idbql transaction (tx) and performs application writes and provides Outbox enqueue as part of same tx via transactionalWrite or passing tx into append helpers.
- Transaction commits only when both application data and OutboxEntry are persisted; if commit fails, neither change is visible.
- Note: ambient flows that do not pass tx may see outbox appended in a separate transaction; application should prefer transactional writes for atomic intent.

---

## Deployment and operational considerations

Telemetry & Metrics
- Expose counters and gauges (recommended):
  - outbox.queued_count
  - outbox.in_flight_count
  - outbox.delivered_total
  - outbox.failed_total
  - outbox.retry_count_histogram (distribution)
  - outbox.last_attempt_timestamp
- Emit events/tags for permanent failures (status codes, collection, op) and conflict occurrences.
- Provide hooks to integrate with the app's telemetry/analytics pipeline.

Backoff and retry configuration
- Provide runtime config for: maxRetries, backoffBaseMs, retryJitter, concurrency.
- Defaults defined in RFC: maxRetries=5, backoffBaseMs=500ms, concurrency=2.
- Exponential backoff with jitter reduces thundering herd; ensure maximum cap (e.g., base * 2^(n-1) capped at a reasonable max like several minutes) is documented in runtime config.

Failure modes and recommended handling
- Transient network outages: entries persist and are retried. Use exponential backoff and Service Worker background sync in follow-up for closed-tab reliability.
- Permanent server failures (4xx): mark entry failed, surface to UI or operator; allow user/action to resolve or provide a remediation path.
- Conflicts (409 or newer remote.updated_at): surface resolution events; default to LWW but provide onConflict for domain recovery.
- Local DB corruption or upgrade errors: document DB upgrade path and safe fallback; keep Outbox schema simple and versioned.

Operational notes
- Background delivery should be cancellable on shutdown and resume on start.
- Respect browser lifecycle: use page visibility and online/offline events to pause/resume workers; prefer Service Worker for reliable background delivery across closed tabs.
- Provide health endpoints / diagnostics in the host app exposing outbox queue size and last error for support troubleshooting.

---

## Upgrade & migration notes

updated_at migration
- Compatibility: treat missing `updated_at` as epoch (0) in conflict comparisons to avoid unintentionally losing newer records.
- Recommended migration strategy:
  1. Prefer incremental migration: when a record without updated_at is written/modified, inject updated_at = now().
  2. Optionally provide a one-time bulk migration script to scan collections and set updated_at where missing (choose a sensible baseline timestamp or use last-modified heuristics if available).
  3. In client code, ensure reads tolerate missing updated_at by using epoch fallback.

DB schema and Outbox store upgrades
- Versioning: bump DB version and create `__outbox__` store on upgrade if missing. Follow idb upgrade semantics and ensure migration code runs in onupgradeneeded handler.
- Keep OutboxEntry schema forward compatible: store unknown fields in entry payload and avoid breaking shape changes. Introduce new fields as optional with migration routines only if necessary.
- When changing Outbox semantics (e.g., serial format for whereClause), provide a migration path or support both old/new serialized forms in WhereSerializer.

Rollout and backward compatibility
- Ship SyncAdapter interfaces and WhereSerializer in a way that older clients can ignore new fields. Feature-gate server-side behavior when upgrading backend APIs that rely on new updated_at semantics.
- Test cross-version scenarios: older client writing without updated_at vs new server expecting updated_at; ensure server treats missing updated_at permissively or provide clear migration instructions.

---

## Testing & acceptance criteria (summary)

- Unit tests:
  - OutboxStore append/poll/ack/update behavior
  - WhereSerializer deterministic round-trip
  - Deliverer result handling (ok, transient, permanent)
  - onConflict default LWW and custom merge behaviors

- Integration tests:
  - Local write -> outbox append -> immediate delivery (happy path) and application of remote response with silent=true
  - Network loss simulation: entries persist across reload, are retried, and eventually succeed
  - Conflict scenarios: server returns 409 or newer updated_at; onConflict invoked and resolution applied
  - Transactional writes: application data + outbox entry persisted atomically when tx provided

---

## References

- ARCHITECTURE.md (package)
- docs/RFC-design-sync-outbox-api.md
- README.PROD.md


Document author: Copilot CLI (bmad-master plan arch)
