
import type { IdaiDbAdapterInterface, IdaeDbParams } from '../@types/types';
import PouchDB from 'pouchdb';

export class PouchDBAdapter<T extends object> implements IdaiDbAdapterInterface<T> {
  private db: PouchDB.Database<T>;

  constructor(collection: string, connection: any) {
    this.db = connection;
  }

  static async connect(uri: string, options?: any): Promise<any> {
    // uri: pouchdb://./folder or pouchdb://memory
    let dbPath = uri.replace(/^pouchdb:\/\//, '');
    if (!dbPath) dbPath = 'idae-pouchdb';
    return new PouchDB<T>(dbPath, options);
  }

  static async getDb(connection: any, dbName: string): Promise<any> {
    // PouchDB does not use dbName, just return the connection
    return connection;
  }

  static async close(connection: any): Promise<void> {
    await connection.close();
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = { ...data } as T;
    const result = await this.db.post(doc);
    return { ...doc, _id: result.id, _rev: result.rev } as T;
  }

  async find(params?: IdaeDbParams<T>): Promise<T[]> {
    // Only supports simple query for now
    const { query = {}, limit, sortBy } = params || {};
    const result = await this.db.find({ selector: query, limit });
    return result.docs as T[];
  }

  async findOne(params: IdaeDbParams<T>): Promise<T | null> {
    const docs = await this.find({ ...params, limit: 1 });
    return docs[0] || null;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const doc = await this.db.get(id);
      const updated = { ...doc, ...data };
      const result = await this.db.put(updated);
      return { ...updated, _rev: result.rev } as T;
    } catch (e) {
      return null;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const doc = await this.db.get(id);
      await this.db.remove(doc);
      return true;
    } catch (e) {
      return false;
    }
  }

  async transaction(fn: () => Promise<any>): Promise<any> {
    // PouchDB natively does not support transactions
    return fn();
  }
}
