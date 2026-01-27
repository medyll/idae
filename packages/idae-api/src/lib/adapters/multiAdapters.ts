import { IdaeDbAdapterInterface } from '@medyll/idae-db';
import { Client as PgClient } from 'pg';

// PostgreSQL Adapter skeleton
  static async connect(uri: string, options?: any): Promise<any> {
    // Connexion PostgreSQL via 'pg'
    const client = new PgClient({ connectionString: uri, ...options });
    await client.connect();
    return client;
  }
  static async getDb(): Promise<any> {
    // TODO: Return DB instance
    throw new Error('Not implemented');
  }
  static async close(): Promise<void> {
    // TODO: Close connection
  }
  async create(data: T): Promise<T> {
    throw new Error('Not implemented');
  }
  async find(filter?: any): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async findById(id: string): Promise<T | null> {
    throw new Error('Not implemented');
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    throw new Error('Not implemented');
  }
  async deleteById(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
  async deleteWhere(filter: any): Promise<number> {
    throw new Error('Not implemented');
  }
  async findAll(): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    // If not supported, provide blank method
    return fn();
  }
}

// SQLite Adapter skeleton
export class SQLiteAdapter<T> implements IdaeDbAdapterInterface<T> {
  static async connect(uri: string, options?: any): Promise<any> {
    throw new Error('Not implemented');
  }
  static async getDb(): Promise<any> {
    throw new Error('Not implemented');
  }
  static async close(): Promise<void> {
  }
  async create(data: T): Promise<T> {
    throw new Error('Not implemented');
  }
  async find(filter?: any): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async findById(id: string): Promise<T | null> {
    throw new Error('Not implemented');
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    throw new Error('Not implemented');
  }
  async deleteById(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
  async deleteWhere(filter: any): Promise<number> {
    throw new Error('Not implemented');
  }
  async findAll(): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    return fn();
  }
}

// PouchDB Adapter skeleton
export class PouchDBAdapter<T> implements IdaeDbAdapterInterface<T> {
  static async connect(uri: string, options?: any): Promise<any> {
    throw new Error('Not implemented');
  }
  static async getDb(): Promise<any> {
    throw new Error('Not implemented');
  }
  static async close(): Promise<void> {
  }
  async create(data: T): Promise<T> {
    throw new Error('Not implemented');
  }
  async find(filter?: any): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async findById(id: string): Promise<T | null> {
    throw new Error('Not implemented');
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    throw new Error('Not implemented');
  }
  async deleteById(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
  async deleteWhere(filter: any): Promise<number> {
    throw new Error('Not implemented');
  }
  async findAll(): Promise<T[]> {
    throw new Error('Not implemented');
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    // PouchDB does not support transactions; blank method
    return fn();
  }
}
