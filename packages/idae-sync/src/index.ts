// Core types
export type { OutboxEntry, OutboxMetrics } from './lib/outbox/OutboxStore';
export type { IDeliverer, DeliverResult, DeliverStatus } from './lib/deliverer/IDeliverer';
export type { IdbqlEventPayload } from './lib/SyncAdapter';
export type { OnConflictHook, OnConflictResult } from './lib/ConflictResolver';
export type { InitSyncOptions } from './lib/initSync';
export type { DeliverFunction, Deliverer } from './lib/Deliverer';

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
