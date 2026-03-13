# idae-sync — Decisional Architecture (Reference)

This document is the decision record and operational reference for idae-sync. It consolidates proposed approaches, design decisions, constraints, verification points, and a developer checklist so implementations are reproducible and reviewable.

Goals
- Provide an offline-first, resilient sync layer between local IndexedDB (idae-idbql) and remote API.
- Keep local UX immediate (write-through) while ensuring eventual consistency with server.
- Make conflict behavior explicit and extensible.

Summary decision (high level)
- Pattern: Write-through local-first with an Outbox store for reliable background delivery.
- Event system: Reuse idae-idbql adapter hook (registerAdapter) — expand it to support multiple adapters.
- Conflict resolution: Default Last-Write-Wins (LWW) using an `updated_at` timestamp, with an overridable onConflict(local, remote) hook for custom strategies.
- Offline retry: Immediate retries + exponential backoff; integrate Service Worker background sync in a follow-up iteration.

Rationale
- Outbox in the same DB and transaction guarantees no loss of intent on failures and keeps local state consistent.
- Reusing the existing adapter hook minimizes surface area and aligns with current runtime event flow.
- LWW is simple, auditable, and acceptable as a default; custom strategies must be available for domain-specific needs.

Decisions and constraints (with required verification)

1) Adapter registry: multi-adapter support
- Decision: Change idae-idbql.registerAdapter to accept multiple adapters (ordered list). All adapters will receive the event in registration order.
- Reason: Multiple concerns (stator/machine, sync, analytics) must coexist without fragile chaining.
- Verification: Ensure existing consumers (stator adapter) are compatible; tests must verify order semantics and that adapter exceptions don't block others.

2) Event payload: silent/source semantics
- Decision: Add `silent?: boolean` and `source?: 'local' | 'remote' | 'system'` to IdbqlEventPayload. Default writes are { source: 'local', silent: false }.
- Reason: Server-origin writes must be applied locally without re-emitting sync-triggers and causing loops.
- Verification: Implement unit tests where server-applied changes set silent=true and assert SyncAdapter ignores them.

3) Outbox representation and clause-ops
- Decision: Outbox entries must capture: collection, op (add/put/update/delete/updateWhere/deleteWhere), key/keys, data (payload), whereClause (serialized Where<T> when applicable), meta (retryCount, lastAttempt, createdAt).
- Reason: Clause-based ops (updateWhere) must be replayable deterministically.
- Verification: Round-trip serialize/deserialize Where<T> for common query shapes and ensure API client's query language maps one-to-one.

4) Schema: updated_at timestamp
- Decision: Require an `updated_at` ISO timestamp on all writeable records. On writes where absent, generate `updated_at = now()` locally; server may overwrite with authoritative timestamp.
- Reason: LWW relies on monotonic time; explicit field makes resolution deterministic.
- Migration: Provide read-time compatibility (if missing, treat as epoch 0) and a migration script for bulk-population where feasible.
- Verification: Tests for conflict resolution with/without updated_at present.

5) Retry strategy and background delivery
- Decision: Implement in-package retry with exponential backoff. For robust background delivery across closed tabs, plan Service Worker Background Sync as follow-up.
- Reason: window.online is insufficient; SW sync is required for production reliability.
- Verification: Simulate network loss and closure scenarios; verify Outbox persists and is retried when possible.

Implementation specification (concrete)

A. idae-idbql changes (minimal and necessary)
- Change: registerAdapter(adapter | adapter[]) → registers multiple adapters; call sequence must be deterministic.
- Change: IdbqlEventPayload { collection, op, data?, key?, keyPath?, whereClause?, meta? } + { silent?: boolean, source?: 'local'|'remote'|'system' }
- Add: WhereSerializer to serialize/deserialize Where<T> objects used by updateWhere/deleteWhere.
- Backwards compatibility: Keep shorthand payloads accepted; normalize to the full shape in a central place before dispatch.

B. Outbox store (schema)
OutboxEntry {
  id: string (uuid),
  collection: string,
  op: 'add'|'put'|'update'|'delete'|'updateWhere'|'deleteWhere',
  key?: string | number | object,
  data?: any,
  whereClause?: any (serialized Where<T>),
  meta: {
    retryCount: number,
    lastAttempt?: string,
    createdAt: string
  }
}
- Implementation notes: new IndexedDB object store `__outbox__` in same DB; writes to data + outbox must happen in single transaction.

C. SyncAdapter behavior
- On adapter event hook, if event.source === 'local' && silent !== true, create an OutboxEntry and attempt immediate delivery.
- Delivery flow:
  1) Build HTTP request from OutboxEntry (map op → endpoint/method).
  2) Perform request; on success, mark entry removed and apply server response locally with { source: 'remote', silent: true }.
  3) On transient failure, increment retryCount and schedule retry with exponential backoff.
  4) On permanent failure (4xx), surface to UI/telemetry and mark OutboxEntry as failed.
- Conflict handling: if server returns conflict (409) or newer updated_at, call onConflict(local, remote) hook; default behavior: accept higher updated_at.

D. onConflict hook
- Signature: onConflict(local: any, remote: any, context: { collection, op, entry }) => { resolution: 'local'|'remote'|'merge', result?: any }
- Default: if remote.updated_at > local.updated_at => remote wins; otherwise keep local and retry.

Testing and acceptance criteria
- Unit tests for adapter registry (multiple adapters, error isolation).
- Integration tests: Outbox write + network success path + local application with silent flag.
- Simulated network failure: Outbox persists entries across reload, retries, and succeeds eventually.
- Conflict scenarios covered by tests demonstrating onConflict hook usage.

Operational concerns and docs
- Document migration plan for adding updated_at to existing collections.
- Provide metrics/telemetry hooks for Outbox failure rates and retry counts.
- Document recommended service worker migration path and constraints.

Developer checklist (actionable tasks)
- idae-idbql:
  - [ ] Support multi-adapter registry and ensure deterministic calling order.
  - [ ] Add silent/source to IdbqlEventPayload and normalize event emission.
  - [ ] Implement WhereSerializer and test round-trip.
- idae-sync:
  - [ ] Create OutboxStore and helper utilities (enqueue, dequeue, backoff scheduler).
  - [ ] Implement SyncAdapter with immediate delivery and retry logic.
  - [ ] Implement onConflict hook + default LWW resolver.
  - [ ] Add unit/integration tests and documentation.

Decisions logged
- Multi-adapter registry: REQUIRED change — approved.
- Event `silent`/`source` semantics: REQUIRED — approved.
- Outbox schema and same-DB transaction: REQUIRED — approved.
- LWW as default with onConflict hook: APPROVED as default strategy.
- Service Worker sync: PLANNED for follow-up (not in MVP).

Document author: Copilot CLI

---

Implemented changes (branch: idae-sync/outbox-store-sync-adapter)
- idae-idbql: events now carry whereClause for updateWhere/deleteWhere; stator adapter ignores events with silent=true; collection write methods support optional opts { silent?: boolean, tx?: IDBTransaction } so callers can perform silent writes or supply an external transaction.
- idae-idbql schema: ensures __outbox__ store is created on upgrade.
- idae-sync: IndexedDB-backed OutboxStore implemented; SyncAdapter scaffold updated to enqueue Outbox entries and attempt immediate delivery via an optional deliverer hook.

Notes / remaining work
- Atomic single-transaction writes (data + outbox) are supported when caller uses idbqlCore.transaction and passes the tx into collection methods; callers must be updated to take advantage of this (not yet wired into UI flows).
- Deliverer implementation (HTTP delivery, retry/backoff, conflict handling) still required. The SyncAdapter accepts a deliverer function to be provided by the runtime.

Next actionable steps
1. Implement deliverer using packages/idae-api IdaeApiClientCollection mapping (map op→HTTP request) and pass it to createSyncAdapter.
2. Add integration tests for: silent-write behavior, outbox enqueue+delivery, updateWhere serialization and replay.
3. Create PRs for review: (A) idae-idbql API changes, (B) idae-sync implementation.

---

Next step: create PRs for the branches and implement the deliverer (map out API endpoints and implement retry/backoff).