
import type { IdaiDbAdapterInterface, IdaeDbParams } from '../@types/types';
import { Client } from 'pg';

export class PostgreSQLAdapter<T extends object> implements IdaiDbAdapterInterface<T> {
  private client: Client;
  private table: string;
  private idField: string;

  constructor(collection: string, connection: Client) {
    this.client = connection;
    this.table = collection;
    this.idField = 'id';
  }

  static async connect(uri: string, options?: any): Promise<Client> {
    const client = new Client({ connectionString: uri, ...options });
    await client.connect();
    return client;
  }

  static async getDb(connection: Client, dbName: string): Promise<Client> {
    // PostgreSQL: pas de notion de dbName, retourne la connexion
    return connection;
  }

  static async close(connection: Client): Promise<void> {
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

  async transaction(fn: () => Promise<any>): Promise<any> {
    await this.client.query('BEGIN');
    try {
      const result = await fn();
      await this.client.query('COMMIT');
      return result;
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e;
    }
  }
}
