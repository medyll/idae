import type { Schema } from './validation/types.js';
import { validateOrThrow } from './validation/validate.js';

/**
 * QoolieCollection - wrapper around idae-idbql Collection with CRUD operations.
 * When idbqlState is provided and stateEngine==='svelte5', reactive methods
 * (where, getAll) and mutations (add/update/delete) use CollectionState.
 */
export class QoolieCollection<T extends { keyPath: string }> {
  private name: string;
  private keyPath: string;
  private idbql: any;
  /** CollectionState<T> for this collection — reactive Svelte 5 layer */
  private idbqlState?: any;
  private syncEnabled: boolean;
  private stateEngine: 'svelte5' | 'stator';
  private schema?: Schema;

  constructor(
    name: string,
    keyPath: string,
    idbql: any,
    syncEnabled: boolean,
    stateEngine: 'svelte5' | 'stator' = 'svelte5',
    schema?: Schema,
    idbqlState?: any
  ) {
    this.name = name;
    this.keyPath = keyPath;
    this.idbql = idbql;
    this.syncEnabled = syncEnabled;
    this.stateEngine = stateEngine;
    this.schema = schema;
    this.idbqlState = idbqlState;
  }

  /** True when reactive state layer is wired and active */
  private get useState(): boolean {
    return this.stateEngine === 'svelte5' && !!this.idbqlState;
  }

  private get col(): any {
    const c = (this.idbql as any)[this.name];
    if (!c) throw new Error(`Collection "${this.name}" not found in idbql`);
    return c;
  }

  get collectionName(): string {
    return this.name;
  }

  isSyncEnabled(): boolean {
    return this.syncEnabled;
  }

  /** Reactive where query — uses CollectionState when svelte5, idbql otherwise */
  where(query: any): any {
    if (this.useState) return this.idbqlState.where(query);
    return this.col.where(query);
  }

  /** Get by ID — always idbql (CollectionState.get is a parameterless getter) */
  async get(id: any): Promise<any> {
    return this.col.get(id);
  }

  /** Reactive getAll — uses CollectionState when svelte5 */
  getAll(): any {
    if (this.useState) return this.idbqlState.getAll();
    return this.col.getAll();
  }

  async create(data: any): Promise<any> {
    if (this.schema) await validateOrThrow(this.schema, data);
    if (this.useState) return this.idbqlState.add(data);
    return this.col.add(data);
  }

  async update(id: any, data: any): Promise<any> {
    if (this.schema) {
      const partialSchema = {
        ...this.schema.definition,
        fields: Object.fromEntries(
          Object.entries(this.schema.definition.fields).filter(([key]) => key in data)
        ),
      };
      await validateOrThrow({ ...this.schema, definition: partialSchema, compiled: new Map() }, data);
    }
    if (this.useState) return this.idbqlState.update(id, data);
    return this.col.update(id, data);
  }

  async delete(id: any): Promise<boolean> {
    if (this.useState) return this.idbqlState.delete(id);
    return this.col.delete(id);
  }

  async updateWhere(query: any, data: any): Promise<boolean> {
    if (this.useState) return this.idbqlState.updateWhere(query, data);
    return this.col.updateWhere(query, data);
  }

  async deleteWhere(query: any): Promise<boolean> {
    if (this.useState) return this.idbqlState.deleteWhere(query);
    return this.col.deleteWhere(query);
  }

  async count(query?: any): Promise<number> {
    if (this.useState) return this.idbqlState.count(query);
    return this.col.count(query);
  }
}
