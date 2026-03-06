// CrudService.ts - Basic CRUD operations for collections
// Migré depuis _work, adapté pour /lib/db
// Utilisé pour manipuler les collections en mémoire (exemple/demo)

import { schemeModelDb } from './dbSchema.js';

export class CrudService {
  private db: Record<string, unknown[]> = {};

  constructor() {
    // Initialise les tableaux pour chaque collection
    Object.keys(schemeModelDb).forEach(col => {
      this.db[col] = [];
    });
  }

  list(collection: string): unknown[] {
    return (this.db[collection] as unknown[]) || [];
  }

  get(collection: string, id: unknown): unknown | undefined {
    return this.db[collection]?.find(item => (item as any).id === id);
  }

  create(collection: string, data: unknown): unknown {
    if (!this.db[collection]) this.db[collection] = [];
    (this.db[collection] as unknown[]).push(data as any);
    return data as unknown;
  }

  update(collection: string, id: unknown, data: unknown): unknown {
    if (!this.db[collection]) return undefined;
    const idx = (this.db[collection] as any[]).findIndex(item => (item as any).id === id);
    if (idx >= 0) {
      (this.db[collection] as any[])[idx] = { ...(this.db[collection] as any[])[idx], ...(data as any) };
      return (this.db[collection] as any[])[idx];
    }
    return undefined;
  }

  delete(collection: string, id: unknown): boolean {
    if (!this.db[collection]) return false;
    const idx = (this.db[collection] as any[]).findIndex(item => (item as any).id === id);
    if (idx >= 0) {
      (this.db[collection] as any[]).splice(idx, 1);
      return true;
    }
    return false;
  }
}
