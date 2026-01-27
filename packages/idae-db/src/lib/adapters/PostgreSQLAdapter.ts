import type { IdaeDbAdapterInterface, IdaeDbParams } from '../@types/types';
import { Client } from 'pg';

export class PostgreSQLAdapter<T extends object> implements IdaeDbAdapterInterface<T> {
  private client: any;
  private table: string;
  private idField: string;

  constructor(collection: string, connection: any) {
    // connection est un IdaeDbConnection, on récupère la vraie connexion
    this.client = connection.getDb();
    this.table = collection;
    this.idField = 'id';
  }

  static async connect(uri: string, options?: any): Promise<any> {
    const client = new Client({ connectionString: uri, ...options });
    await client.connect();
    return client;
  }

  static async getDb(connection: any, dbName: string): Promise<any> {
    // PostgreSQL: pas de notion de dbName, retourne la connexion
    return connection;
  }

  static async close(connection: any): Promise<void> {
    await connection.end();
  }

  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = keys.map((k) => (data as any)[k]);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
    const sql = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.client.query(sql, values);
    return result.rows[0] as T;
  }

  async find(params?: IdaeDbParams<T>): Promise<T[]> {
    const { query = {}, limit, sortBy } = params || {};
    let sql = `SELECT * FROM ${this.table}`;
    const where: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const k in query) {
      where.push(`${k} = $${idx}`);
      values.push((query as any)[k]);
      idx++;
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    if (sortBy) sql += ` ORDER BY ${sortBy}`;
    if (limit) sql += ` LIMIT ${limit}`;
    const result = await this.client.query(sql, values);
    return result.rows as T[];
  }

  async findOne(params: IdaeDbParams<T>): Promise<T | null> {
    const results = await this.find({ ...params, limit: 1 });
    return results[0] || null;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = keys.map((k) => (data as any)[k]);
    const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const sql = `UPDATE ${this.table} SET ${set} WHERE ${this.idField} = $${keys.length + 1} RETURNING *`;
    const result = await this.client.query(sql, [...values, id]);
    return result.rows[0] as T;
  }

  async deleteById(id: string): Promise<boolean> {
    const sql = `DELETE FROM ${this.table} WHERE ${this.idField} = $1`;
    const result = await this.client.query(sql, [id]);
    return result.rowCount > 0;
  }

  async transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult> {
    await this.client.query('BEGIN');
    try {
      // PostgreSQL n'expose pas de session explicite, on passe undefined
      const result = await callback(undefined);
      await this.client.query('COMMIT');
      return result;
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e;
    }
  }

  async createIndex<F, O>(fieldOrSpec: F, options?: O): Promise<unknown> {
    // Not implemented for PostgreSQL (no-op)
    return Promise.resolve();
  }

  async findById(id: string): Promise<T[]> {
    const sql = `SELECT * FROM ${this.table} WHERE ${this.idField} = $1`;
    const result = await this.client.query(sql, [id]);
    return result.rows as T[];
  }

  async updateWhere<OPT = never>(params: IdaeDbParams<T>, updateData: Partial<T>, options?: OPT): Promise<unknown> {
    // Simple implementation: update all matching rows
    const { query = {} } = params;
    const keys = Object.keys(updateData);
    const values = keys.map((k) => (updateData as any)[k]);
    const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const where: string[] = [];
    const whereValues: any[] = [];
    let idx = keys.length + 1;
    for (const k in query) {
      where.push(`${k} = $${idx}`);
      whereValues.push((query as any)[k]);
      idx++;
    }
    let sql = `UPDATE ${this.table} SET ${set}`;
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    const result = await this.client.query(sql, [...values, ...whereValues]);
    return { rowCount: result.rowCount };
  }

  async deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }> {
    const { query = {} } = params;
    const where: string[] = [];
    const values: any[] = [];
    let idx = 1;
    for (const k in query) {
      where.push(`${k} = $${idx}`);
      values.push((query as any)[k]);
      idx++;
    }
    let sql = `DELETE FROM ${this.table}`;
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    const result = await this.client.query(sql, values);
    return { deletedCount: result.rowCount };
  }
}
