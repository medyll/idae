export type SyncMode = 'mobile-first' | 'server-first';

export type SyncModeConfig = {
  mode?: SyncMode;
  collectionModes?: Record<string, SyncMode>;
};

export type SyncEvent = {
  type: 'delivered' | 'fallback' | 'rejected' | 'rollback';
  collection: string;
  entryId: string;
  reason?: unknown;
  fallbackMode?: SyncMode;
};

export type SyncEventHandler = (event: SyncEvent) => void;
