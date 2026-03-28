/**
 * QoolieCollection - wrapper around idae-idbql Collection with CRUD operations
 */
export class QoolieCollection<T extends { keyPath: string }> {
  private name: string;
  private keyPath: string;
  private idbql: any;
  private syncEnabled: boolean;
  private stateEngine: 'svelte5' | 'stator';

  constructor(
    name: string,
    keyPath: string,
    idbql: any,
    syncEnabled: boolean,
    stateEngine: 'svelte5' | 'stator' = 'svelte5'
  ) {
    this.name = name;
    this.keyPath = keyPath;
    this.idbql = idbql;
    this.syncEnabled = syncEnabled;
    this.stateEngine = stateEngine;
  }

  /**
   * Get collection name
   */
  get collectionName(): string {
    return this.name;
  }

  /**
   * Check if sync is enabled for this collection
   */
  isSyncEnabled(): boolean {
    return this.syncEnabled;
  }

  /**
   * Query with filters
   * Returns a reactive result set
   */
  where(query: any): any {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.where(query);
  }

  /**
   * Get document by ID
   */
  async get(id: any): Promise<any> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.get(id);
  }

  /**
   * Get all documents
   */
  async getAll(): Promise<any[]> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.getAll();
  }

  /**
   * Create document
   */
  async create(data: any): Promise<any> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.add(data);
  }

  /**
   * Update document by ID
   */
  async update(id: any, data: any): Promise<any> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.update(id, data);
  }

  /**
   * Delete document by ID
   */
  async delete(id: any): Promise<boolean> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.delete(id);
  }

  /**
   * Bulk update by query
   */
  async updateWhere(query: any, data: any): Promise<boolean> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.updateWhere(query, data);
  }

  /**
   * Bulk delete by query
   */
  async deleteWhere(query: any): Promise<boolean> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.deleteWhere(query);
  }

  /**
   * Count documents matching query
   */
  async count(query?: any): Promise<number> {
    const collection = (this.idbql as any)[this.name];
    if (!collection) {
      throw new Error(`Collection "${this.name}" not found in idbql`);
    }
    return collection.count(query);
  }
}
