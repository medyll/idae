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
    private collection: string;
    private client: any;
    constructor(collection: string, client: any) {
      this.collection = collection;
      this.client = client;
    }
    async create(data: T): Promise<T> {
      // Insert data into the table named by this.collection
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${this.collection} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.client.query(query, values);
      return result.rows[0];
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
  static async connect(uri: string, options?: any): Promise<any> {
    // Connexion SQLite via 'sqlite3'
    const sqlite3 = await import('sqlite3');
    const { Database } = sqlite3;
    return new Promise((resolve, reject) => {
      const db = new Database(uri, options, (err: any) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
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
  static async connect(uri: string, options?: any): Promise<any> {
    // Connexion PouchDB (locale ou distante)
    const PouchDB = (await import('pouchdb')).default;
    return new PouchDB(uri, options);
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
