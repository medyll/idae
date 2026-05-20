// Type declarations for workspace dependencies
declare module '@medyll/idae-sync' {
  export type { OutboxEntry, OutboxMetrics } from './lib/outbox/OutboxStore';
  export type { IDeliverer, DeliverResult, DeliverStatus } from './lib/deliverer/IDeliverer';
  export type { IdbqlEventPayload } from './lib/SyncAdapter';
  export type { InitSyncOptions } from './lib/initSync';
  export type { SyncMode, SyncEvent, SyncEventHandler } from './lib/SyncMode';
  export type { SyncAdapterOptions } from './lib/SyncAdapter';
  export type { CircuitBreakerOptions, CircuitBreakerState } from './lib/CircuitBreaker';
  
  export class SyncAdapter {
    start(): void;
    stop(): void;
    getStatus(): Promise<any>;
    flush(): Promise<void>;
    onSyncEvent(handler: (event: SyncEvent) => void): () => void;
  }
  
  export class OutboxStore {
    size(): Promise<number>;
    listDlq(): Promise<any[]>;
    replayDlq(id: string): Promise<void>;
    clearDlq(): Promise<void>;
  }
  
  export class IdaeApiDeliverer {}
  
  export function initSync<T extends string = string>(opts?: InitSyncOptions<T>): {
    stop(): void;
    flush(): Promise<void>;
    getStatus(): Promise<any>;
    outbox: OutboxStore;
    syncAdapter: SyncAdapter;
    deliverer: IdaeApiDeliverer;
    setMode(mode: SyncMode): void;
    onSyncEvent(handler: SyncEventHandler): () => void;
  };
}
