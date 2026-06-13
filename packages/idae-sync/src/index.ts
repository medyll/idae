// Core types
export type { OutboxEntry, OutboxMetrics } from './lib/outbox/OutboxStore.js';
export type { IDeliverer, DeliverResult, DeliverStatus } from './lib/deliverer/IDeliverer.js';
export type { IdbqlEventPayload } from './lib/SyncAdapter.js';
export type { OnConflictHook, OnConflictResult } from './lib/ConflictResolver.js';
export type { InitSyncOptions } from './lib/initSync.js';
export type { DeliverFunction, Deliverer } from './lib/Deliverer.js';

// Phase 2 — Sync modes
export type { SyncMode, SyncModeConfig, SyncEvent, SyncEventHandler } from './lib/SyncMode.js';
export { SyncModeManager } from './lib/SyncModeManager.js';
export { RollbackManager } from './lib/RollbackManager.js';
export { ServerFirstHandler } from './lib/ServerFirstHandler.js';
export type { CanonicalApplyFn } from './lib/ServerFirstHandler.js';

// Phase 3 — Hooks, debug
export type { SyncHooks, DebugFn } from './lib/SyncHooks.js';
export type { SyncAdapterOptions } from './lib/SyncAdapter.js';

// Phase 4 — Circuit breaker, server push, field-level merge
export { CircuitBreaker } from './lib/CircuitBreaker.js';
export type { CircuitBreakerOptions, CircuitBreakerState } from './lib/CircuitBreaker.js';
export { EventSourcePushListener, WebSocketPushListener } from './lib/ServerPush.js';
export type { IServerPushListener, ServerPushEvent, ServerPushHandler } from './lib/ServerPush.js';
export { mergeFieldLevel } from './lib/ConflictResolver.js';
export type { SyncModePersistence } from './lib/SyncModeManager.js';

// Classes
export { OutboxStore } from './lib/outbox/OutboxStore.js';
export { InMemoryOutboxStore } from './lib/outbox/InMemoryOutboxStore.js';
export { SyncAdapter, createSyncAdapter } from './lib/SyncAdapter.js';
export { OutboxDeliverer } from './lib/Deliverer.js';
export { IdaeApiDeliverer, createIdaeApiDeliverer } from './lib/deliverer/IdaeApiDeliverer.js';
export { WhereSerializer } from './lib/WhereSerializer.js';
export { ConflictResolver } from './lib/ConflictResolver.js';

// Helpers
export { defaultOnConflict, mergeObjects } from './lib/ConflictResolver.js';
export { ensureUpdatedAt } from './lib/ensureUpdatedAt.js';
export { serializeWhere, deserializeWhere, isDeterministic } from './lib/WhereSerializer.js';
export { incCounter, getCounter, resetCounters } from './lib/observability/metrics.js';

// Entry point
export { initSync } from './lib/initSync.js';
