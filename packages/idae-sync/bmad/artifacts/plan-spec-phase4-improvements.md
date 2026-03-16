# Spec: Phase 4 — Advanced Features
**Date:** 2026-03-16
**Phase:** 4

## Items

1. `sync.flush()` — livraison immédiate de tout l'outbox
2. Idempotency keys — header X-Idempotency-Key dans IdaeApiDeliverer
3. Outbox size limit — maxQueueSize avec stratégie LRU/reject
4. Circuit breaker — suspend retries après N échecs consécutifs par collection
5. Priority queue — meta.priority, list() trié par priorité
6. Persistence du mode — localStorage/sessionStorage pour SyncModeManager
7. Field-level merge — ConflictResolver stratégie champ par champ
8. Server push listener — interface IServerPushListener + EventSource adapter
9. Devtools — sync.getStatus() retourne snapshot complet observable
10. Tests e2e IDB réels — OutboxStore avec fake-indexeddb
11. Benchmark — test/benchmark.ts mesure throughput batchSize 1/5/10/50
