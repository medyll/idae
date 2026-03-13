Prioritized actionable todos for Outbox-backed SyncAdapter & deliverer
(Aligned to ARCHITECTURE.md and docs/PRD.md: silent/source semantics, WhereSerializer, OutboxStore, deliverer, onConflict, updated_at, transactions)

1) id: design-sync-outbox-api
   title: Design public API for Outbox-backed SyncAdapter
   description: Define the high-level public interfaces and types for SyncAdapter, OutboxStore, Deliverer, WhereSerializer, and transaction hooks, including silent/source semantics and onConflict signatures. Produce a concise RFC doc for implementers and tests.
   suggested branch name: design/sync-outbox-api
   suggested commit message prefix: feat(sync): design public outbox API

2) id: implement-where-serializer
   title: Implement WhereSerializer for Outbox queries
   description: Build WhereSerializer used to convert adapter query filters into a stable, serializable form stored in Outbox items and used by the deliverer to scope deliveries. Include tests for equality and deterministic output.
   suggested branch name: feat/where-serializer
   suggested commit message prefix: feat(sync): add WhereSerializer

3) id: create-outboxstore-interface
   title: Create OutboxStore interface & in-memory implementation
   description: Define OutboxStore methods (append, list/poll, ack/remove, peek, transactional write) and provide a simple in-memory implementation for local development and tests. Ensure updated_at and metadata fields are supported.
   suggested branch name: feat/outboxstore-interface
   suggested commit message prefix: feat(sync): add OutboxStore interface

4) id: add-transactional-outbox-write-hooks
   title: Add transaction support for writing Outbox entries
   description: Implement transactional hooks so local model writes can atomically append Outbox entries (or rollback) within a transaction boundary on supported stores. Provide no-op fallback for non-transactional stores.
   suggested branch name: feat/outbox-transactions
   suggested commit message prefix: feat(sync): add transactional outbox writes

5) id: implement-outbox-backed-syncadapter-core
   title: Implement Outbox-backed SyncAdapter core
   description: Build the SyncAdapter that writes Outbox entries (source vs silent semantics), surfaces WhereSerializer use, and exposes methods for local create/update/delete that update updated_at and produce Outbox items with metadata and onConflict hints.
   suggested branch name: feat/outbox-syncadapter
   suggested commit message prefix: feat(sync): implement outbox-backed SyncAdapter

6) id: implement-deliverer-core
   title: Implement deliverer to process Outbox entries
   description: Implement a deliverer service that polls OutboxStore, deserializes WhereSerializer filters, invokes remote delivery, handles transient failure retry/backoff, and acks/cleans delivered entries. Support concurrency limits and idempotency hooks.
   suggested branch name: feat/deliverer-core
   suggested commit message prefix: feat(sync): add deliverer core

7) id: add-onconflict-resolution
   title: Add onConflict resolution strategies & hooks
   description: Implement onConflict behavior options (merge, skip, replace) in the SyncAdapter and deliverer, and wire conflict metadata in Outbox items; include tests exercising different server responses and merge callbacks.
   suggested branch name: feat/onconflict-strategies
   suggested commit message prefix: feat(sync): add onConflict strategies

8) id: ensure-updated-at-propagation
   title: Ensure updated_at and causal timestamps propagation
   description: Add consistent updated_at handling into model writes, Outbox entries, and delivery payloads so remote changes can be reconciled and last-writer-wins semantics applied where PRD specifies.
   suggested branch name: fix/updated-at-propagation
   suggested commit message prefix: fix(sync): propagate updated_at

9) id: add-integration-tests
   title: Add integration tests for Outbox + deliverer end-to-end
   description: Create tests simulating source/silent operations, transactional writes, delivery success/failures, onConflict cases, and updated_at-based reconciliation using the in-memory OutboxStore and a mock remote.
   suggested branch name: test/outbox-deliverer-e2e
   suggested commit message prefix: test(sync): add outbox deliverer integration tests

10) id: add-production-outbox-adapter
    title: Provide production OutboxStore bindings (e.g., SQL)
    description: Implement a production OutboxStore backed by the project's primary persistence (e.g., SQL) supporting durable append and transactional semantics as defined in the interface; include migration notes.
    suggested branch name: feat/outboxstore-sql
    suggested commit message prefix: feat(sync): add SQL OutboxStore

11) id: add-examples-and-docs
    title: Add example usage and README updates
    description: Add short examples showing source vs silent writes, wiring WhereSerializer, configuring deliverer, and onConflict usage; update README/ARCHITECTURE references to reflect implemented semantics.
    suggested branch name: docs/outbox-examples
    suggested commit message prefix: docs(sync): add outbox usage examples

12) id: add-operational-metrics-and-health
    title: Add basic observability for deliverer
    description: Instrument deliverer with counters for queued/processed/failures, last-run timestamp, and a health endpoint or status API to aid production operations.
    suggested branch name: feat/deliverer-observability
    suggested commit message prefix: feat(sync): add deliverer observability

Dependencies (by id)
- design-sync-outbox-api -> (root; no dependencies)
- implement-where-serializer -> design-sync-outbox-api
- create-outboxstore-interface -> design-sync-outbox-api
- add-transactional-outbox-write-hooks -> create-outboxstore-interface
- implement-outbox-backed-syncadapter-core -> implement-where-serializer, create-outboxstore-interface, add-transactional-outbox-write-hooks
- implement-deliverer-core -> implement-where-serializer, create-outboxstore-interface
- add-onconflict-resolution -> implement-outbox-backed-syncadapter-core, implement-deliverer-core
- ensure-updated-at-propagation -> implement-outbox-backed-syncadapter-core
- add-integration-tests -> implement-outbox-backed-syncadapter-core, implement-deliverer-core, implement-where-serializer, create-outboxstore-interface
- add-production-outbox-adapter -> create-outboxstore-interface, add-transactional-outbox-write-hooks
- add-examples-and-docs -> implement-outbox-backed-syncadapter-core, implement-deliverer-core
- add-operational-metrics-and-health -> implement-deliverer-core

Save this file to:
packages/idae-sync/bmad/artifacts/next.md
2026-03-13T23:57:57.7974846+01:00: Ran 'bmad next' to update status.yaml
