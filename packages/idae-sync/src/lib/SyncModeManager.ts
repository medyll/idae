import type { SyncMode, SyncModeConfig } from './SyncMode';

export type SyncModePersistence = 'none' | 'localStorage' | 'sessionStorage';

export class SyncModeManager {
  private globalMode: SyncMode = 'mobile-first';
  private collectionModes = new Map<string, SyncMode>();
  private storageKey: string;
  private persistence: SyncModePersistence;

  constructor(config?: SyncModeConfig & { persist?: SyncModePersistence; persistKey?: string }) {
    this.persistence = config?.persist ?? 'none';
    this.storageKey = config?.persistKey ?? '__idae_sync_mode__';

    // Load persisted state first
    if (this.persistence !== 'none') {
      this.loadFromStorage();
    }

    // Then apply config (config overrides persisted state)
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
    this.persist();
  }

  setCollection(collection: string, mode: SyncMode): void {
    this.collectionModes.set(collection, mode);
    this.persist();
  }

  getGlobal(): SyncMode {
    return this.globalMode;
  }

  getCollection(collection: string): SyncMode {
    return this.resolve(collection);
  }

  private persist(): void {
    if (this.persistence === 'none') return;
    const storage = this.getStorage();
    if (!storage) return;
    try {
      storage.setItem(this.storageKey, JSON.stringify({
        mode: this.globalMode,
        collectionModes: Object.fromEntries(this.collectionModes),
      }));
    } catch { /* quota exceeded or unavailable */ }
  }

  private loadFromStorage(): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const raw = storage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { mode?: SyncMode; collectionModes?: Record<string, SyncMode> };
      if (parsed.mode) this.globalMode = parsed.mode;
      if (parsed.collectionModes) {
        for (const [col, mode] of Object.entries(parsed.collectionModes)) {
          this.collectionModes.set(col, mode);
        }
      }
    } catch { /* corrupted storage */ }
  }

  clearPersisted(): void {
    const storage = this.getStorage();
    if (!storage) return;
    try { storage.removeItem(this.storageKey); } catch { /* ignore */ }
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
      if (this.persistence === 'localStorage') return window.localStorage;
      if (this.persistence === 'sessionStorage') return window.sessionStorage;
    } catch { /* unavailable */ }
    return null;
  }
}
