// CrudService.ts - Basic CRUD operations for collections
// Migré depuis _work, adapté pour /lib/db
// Utilisé pour manipuler les collections en mémoire (exemple/demo)

import { schemeModelDb } from './dbSchema.js';

export class CrudService {
  private db: Record<string, any[]> = {};

  constructor() {
    // Initialise les tableaux pour chaque collection
    Object.keys(schemeModelDb).forEach(col => {
      this.db[col] = [];
    });
  }

  list(collection: string): any[] {
    return this.db[collection] || [];
  }

  get(collection: string, id: any): any | undefined {
    return this.db[collection]?.find(item => item.id === id);
  }

  create(collection: string, data: any): any {
    if (!this.db[collection]) this.db[collection] = [];
    this.db[collection].push(data);
    return data;
  }

  update(collection: string, id: any, data: any): any {
    if (!this.db[collection]) return undefined;
    const idx = this.db[collection].findIndex(item => item.id === id);
    if (idx >= 0) {
      this.db[collection][idx] = { ...this.db[collection][idx], ...data };
      return this.db[collection][idx];
    }
    return undefined;
  }

  delete(collection: string, id: any): boolean {
    if (!this.db[collection]) return false;
    const idx = this.db[collection].findIndex(item => item.id === id);
    if (idx >= 0) {
      this.db[collection].splice(idx, 1);
      return true;
    }
    return false;
  }
}
