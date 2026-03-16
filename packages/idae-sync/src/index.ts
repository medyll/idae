// Core types
export type { OutboxEntry, OutboxMetrics } from './lib/outbox/OutboxStore';
export type { IDeliverer, DeliverResult, DeliverStatus } from './lib/deliverer/IDeliverer';
export type { IdbqlEventPayload } from './lib/SyncAdapter';
export type { OnConflictHook, OnConflictResult } from './lib/ConflictResolver';
export type { InitSyncOptions } from './lib/initSync';
export type { DeliverFunction, Deliverer } from './lib/Deliverer';

// Phase 2 — Sync modes
export type { SyncMode, SyncModeConfig, SyncEvent, SyncEventHandler } from './lib/SyncMode';
export { SyncModeManager } from './lib/SyncModeManager';
export { RollbackManager } from './lib/RollbackManager';
export { ServerFirstHandler } from './lib/ServerFirstHandler';

// Classes
export { OutboxStore } from './lib/outbox/OutboxStore';
export { InMemoryOutboxStore } from './lib/outbox/InMemoryOutboxStore';
export { SyncAdapter, createSyncAdapter } from './lib/SyncAdapter';
export { OutboxDeliverer } from './lib/Deliverer';
export { IdaeApiDeliverer, createIdaeApiDeliverer } from './lib/deliverer/IdaeApiDeliverer';
export { WhereSerializer } from './lib/WhereSerializer';
export { ConflictResolver } from './lib/ConflictResolver';

// Helpers
export { defaultOnConflict, mergeObjects } from './lib/ConflictResolver';
export { ensureUpdatedAt } from './lib/ensureUpdatedAt';
export { serializeWhere, deserializeWhere, isDeterministic } from './lib/WhereSerializer';
export { incCounter, getCounter, resetCounters } from './lib/observability/metrics';

// Entry point
export { initSync } from './lib/initSync';
