export type SyncMode = 'mobile-first' | 'server-first';

export type SyncModeConfig = {
  mode?: SyncMode;
  collectionModes?: Record<string, SyncMode>;
};

export type SyncEvent = {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback' | 'dead-letter' | 'network-online' | 'network-offline' | 'conflict-resolved';
  collection?: string;
  entryId?: string;
  reason?: unknown;
  fallbackMode?: SyncMode;
  resolution?: 'local' | 'remote' | 'merge';
};

export type SyncEventHandler = (event: SyncEvent) => void;
