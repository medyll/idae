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
    // Simple filter: only supports equality and AND logic for now
    let query = `SELECT * FROM ${this.collection}`;
    let values: any[] = [];
    if (filter && Object.keys(filter).length > 0) {
      const clauses = Object.keys(filter).map((k, i) => {
        values.push(filter[k]);
        return `${k} = $${i + 1}`;
      });
      query += ' WHERE ' + clauses.join(' AND ');
    }
    try {
      const result = await this.client.query(query, values);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.collection} WHERE id = $1 LIMIT 1`;
    try {
      const result = await this.client.query(query, [id]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) throw new Error('No fields to update');
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const query = `UPDATE ${this.collection} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    try {
      const result = await this.client.query(query, [...values, id]);
      if (!result.rows[0]) throw new Error('Not found');
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }
  async deleteById(id: string): Promise<void> {
    const query = `DELETE FROM ${this.collection} WHERE id = $1`;
    try {
      await this.client.query(query, [id]);
    } catch (err) {
      throw err;
    }
  }
  async deleteWhere(filter: any): Promise<number> {
    let query = `DELETE FROM ${this.collection}`;
    let values: any[] = [];
    if (filter && Object.keys(filter).length > 0) {
      const clauses = Object.keys(filter).map((k, i) => {
        values.push(filter[k]);
        return `${k} = $${i + 1}`;
      });
      query += ' WHERE ' + clauses.join(' AND ');
    }
    try {
      const result = await this.client.query(query, values);
      return result.rowCount;
    } catch (err) {
      throw err;
    }
  }
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.collection}`;
    try {
      const result = await this.client.query(query);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    try {
      await this.client.query('BEGIN');
      const result = await fn();
      await this.client.query('COMMIT');
      return result;
    } catch (err) {
      await this.client.query('ROLLBACK');
      throw err;
    }
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
  private collection: string;
  private db: any;
  constructor(collection: string, db: any) {
    this.collection = collection;
    this.db = db;
  }
  async create(data: T): Promise<T> {
    // Insert data into the table named by this.collection
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const query = `INSERT INTO ${this.collection} (${keys.join(', ')}) VALUES (${placeholders})`;
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (this: any, err: any) {
        if (err) return reject(err);
        // Return the inserted row with lastID if possible
        resolve({ ...data, id: this.lastID });
      });
    });
  }
  async find(filter?: any): Promise<T[]> {
    let query = `SELECT * FROM ${this.collection}`;
    let values: any[] = [];
    if (filter && Object.keys(filter).length > 0) {
      const clauses = Object.keys(filter).map((k, i) => {
        values.push(filter[k]);
        return `${k} = ?`;
      });
      query += ' WHERE ' + clauses.join(' AND ');
    }
    return new Promise((resolve, reject) => {
      this.db.all(query, values, (err: any, rows: T[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.collection} WHERE id = ? LIMIT 1`;
    return new Promise((resolve, reject) => {
      this.db.get(query, [id], (err: any, row: T) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    if (keys.length === 0) throw new Error('No fields to update');
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const query = `UPDATE ${this.collection} SET ${setClause} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, [...values, id], function (this: any, err: any) {
        if (err) return reject(err);
        // Return the updated row
        // Need to fetch the updated row
        const selectQuery = `SELECT * FROM ${this.collection} WHERE id = ?`;
        this.db.get(selectQuery, [id], (err2: any, row: T) => {
          if (err2) return reject(err2);
          resolve(row);
        });
      }.bind(this));
    });
  }
  async deleteById(id: string): Promise<void> {
    const query = `DELETE FROM ${this.collection} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(query, [id], function (err: any) {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  async deleteWhere(filter: any): Promise<number> {
    let query = `DELETE FROM ${this.collection}`;
    let values: any[] = [];
    if (filter && Object.keys(filter).length > 0) {
      const clauses = Object.keys(filter).map((k) => {
        values.push(filter[k]);
        return `${k} = ?`;
      });
      query += ' WHERE ' + clauses.join(' AND ');
    }
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (this: any, err: any) {
        if (err) return reject(err);
        resolve(this.changes || 0);
      });
    });
  }
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.collection}`;
    return new Promise((resolve, reject) => {
      this.db.all(query, [], (err: any, rows: T[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.serialize(async () => {
        this.db.run('BEGIN TRANSACTION');
        try {
          const result = await fn();
          this.db.run('COMMIT');
          resolve(result);
        } catch (err) {
          this.db.run('ROLLBACK');
          reject(err);
        }
      });
    });
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
  private db: any;
  constructor(collection: string, db: any) {
    // PouchDB n'a pas de notion de collection, mais on peut utiliser un champ type ou prefix
    this.db = db;
  }
  async create(data: T): Promise<T> {
    // Insert document in PouchDB
    const result = await this.db.post(data);
    return { ...data, _id: result.id, _rev: result.rev };
  }
  async find(filter?: any): Promise<T[]> {
    // Simple Mango query for filter (equality only)
    const selector = filter || {};
    try {
      const result = await this.db.find ? this.db.find({ selector }) : await this.db.allDocs({ include_docs: true });
      if (result.rows) {
        // allDocs fallback
        return result.rows.map((r: any) => r.doc);
      }
      return result.docs;
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string): Promise<T | null> {
    try {
      const doc = await this.db.get(id);
      return doc || null;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const doc = await this.db.get(id);
      const updated = { ...doc, ...data };
      const result = await this.db.put(updated);
      return { ...updated, _rev: result.rev };
    } catch (err) {
      throw err;
    }
  }
  async deleteById(id: string): Promise<void> {
    try {
      const doc = await this.db.get(id);
      await this.db.remove(doc);
    } catch (err) {
      throw err;
    }
  }
  async deleteWhere(filter: any): Promise<number> {
    // Find docs, then bulk delete
    try {
      const result = await this.find(filter);
      if (!result.length) return 0;
      const docsToDelete = result.map((doc: any) => ({ ...doc, _deleted: true }));
      const res = await this.db.bulkDocs(docsToDelete);
      return res.length;
    } catch (err) {
      throw err;
    }
  }
  async findAll(): Promise<T[]> {
    try {
      const result = await this.db.allDocs({ include_docs: true });
      return result.rows.map((r: any) => r.doc);
    } catch (err) {
      throw err;
    }
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    // PouchDB does not support transactions; blank method
    return fn();
  }
  async transaction(fn: () => Promise<any>): Promise<any> {
    // PouchDB does not support transactions; blank method
    return fn();
  }
}
