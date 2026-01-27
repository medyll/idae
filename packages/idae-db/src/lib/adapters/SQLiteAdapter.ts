
import type { IdaiDbAdapterInterface, IdaeDbParams } from '../@types/types';
import sqlite3 from 'sqlite3';

export class SQLiteAdapter<T extends object> implements IdaiDbAdapterInterface<T> {
  private db: sqlite3.Database;
  private table: string;
  private idField: string;

  constructor(collection: string, connection: sqlite3.Database) {
    this.db = connection;
    this.table = collection;
    this.idField = 'id';
  }

  static async connect(uri: string, options?: any): Promise<sqlite3.Database> {
    // uri: sqlite://./mydb.sqlite
    const dbPath = uri.replace(/^sqlite:\/\//, '');
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  }

  static async getDb(connection: sqlite3.Database, dbName: string): Promise<sqlite3.Database> {
    // SQLite: pas de notion de dbName, retourne la connexion
    return connection;
  }

  static async close(connection: sqlite3.Database): Promise<void> {
    return new Promise((resolve, reject) => {
      connection.close((err) => (err ? reject(err) : resolve()));
    });
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = keys.map((k) => (data as any)[k]);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${placeholders})`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, values, function (this: sqlite3.RunResult, err) {
        if (err) return reject(err);
        resolve({ ...data, id: this.lastID } as T);
      });
    });
  }

  async find(params?: IdaeDbParams<T>): Promise<T[]> {
    const { query = {}, limit, sortBy } = params || {};
    let sql = `SELECT * FROM ${this.table}`;
    const where: string[] = [];
    const values: any[] = [];
    for (const k in query) {
      where.push(`${k} = ?`);
      values.push((query as any)[k]);
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    if (sortBy) sql += ` ORDER BY ${sortBy}`;
    if (limit) sql += ` LIMIT ${limit}`;
    return new Promise((resolve, reject) => {
      this.db.all(sql, values, (err, rows) => {
        if (err) return reject(err);
        resolve(rows as T[]);
      });
    });
  }

  async findOne(params: IdaeDbParams<T>): Promise<T | null> {
    const results = await this.find({ ...params, limit: 1 });
    return results[0] || null;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = keys.map((k) => (data as any)[k]);
    const sql = `UPDATE ${this.table} SET ${keys.map((k) => `${k} = ?`).join(',')} WHERE ${this.idField} = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [...values, id], function (this: sqlite3.RunResult, err) {
        if (err) return reject(err);
        resolve({ ...data, id } as T);
      });
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.table} WHERE ${this.idField} = ?`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, [id], function (this: sqlite3.RunResult, err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }

  async transaction(fn: () => Promise<any>): Promise<any> {
    await new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => (err ? reject(err) : resolve(null)));
    });
    try {
      const result = await fn();
      await new Promise((resolve, reject) => {
        this.db.run('COMMIT', (err) => (err ? reject(err) : resolve(null)));
      });
      return result;
    } catch (e) {
      await new Promise((resolve, reject) => {
        this.db.run('ROLLBACK', (err) => (err ? reject(err) : resolve(null)));
      });
      throw e;
    }
  }
}
