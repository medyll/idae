import type { SyncMode, SyncModeConfig } from './SyncMode';

export class SyncModeManager {
  private globalMode: SyncMode = 'mobile-first';
  private collectionModes = new Map<string, SyncMode>();

  constructor(config?: SyncModeConfig) {
    if (config?.mode) this.globalMode = config.mode;
    if (config?.collectionModes) {
      for (const [col, mode] of Object.entries(config.collectionModes)) {
        this.collectionModes.set(col, mode);
      }
    }
  }

  resolve(collection: string): SyncMode {
    return this.collectionModes.get(collection) ?? this.globalMode;
  }

  setGlobal(mode: SyncMode): void {
    this.globalMode = mode;
  }

  setCollection(collection: string, mode: SyncMode): void {
    this.collectionModes.set(collection, mode);
  }

  getGlobal(): SyncMode {
    return this.globalMode;
  }

  getCollection(collection: string): SyncMode {
    return this.resolve(collection);
  }
}
