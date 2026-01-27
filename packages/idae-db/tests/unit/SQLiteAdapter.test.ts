import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SQLiteAdapter } from '../../src/lib/adapters/SQLiteAdapter';
import sqlite3 from 'sqlite3';

interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
}

describe('SQLiteAdapter', () => {
  let db: sqlite3.Database;
  let adapter: SQLiteAdapter<User>;

  beforeAll(async () => {
    db = await SQLiteAdapter.connect('sqlite://:memory:');
    await new Promise<void>((resolve, reject) => {
      db.run(
        'CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, age INTEGER)',
        (err) => (err ? reject(err) : resolve())
      );
    });
    adapter = new SQLiteAdapter<User>('user', db);
  });

  afterAll(async () => {
    if (db && typeof db.close === 'function') {
      await SQLiteAdapter.close(db);
    }
  });

  it('should create a user', async () => {
    const user = await adapter.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Alice');
  });

  it('should find users', async () => {
    await adapter.create({ name: 'Bob', email: 'bob@example.com', age: 30 });
    const users = await adapter.find({ query: {} });
    expect(users.length).toBeGreaterThanOrEqual(2);
  });

  it('should findOne user', async () => {
    const user = await adapter.findOne({ query: { name: 'Alice' } });
    expect(user?.name).toBe('Alice');
  });

  it('should update a user', async () => {
    const user = await adapter.findOne({ query: { name: 'Alice' } });
    expect(user).toBeTruthy();
    const updated = await adapter.update(user!.id!.toString(), { age: 26 });
    expect(updated?.age).toBe(26);
  });

  it('should delete a user', async () => {
    const user = await adapter.findOne({ query: { name: 'Bob' } });
    expect(user).toBeTruthy();
    const deleted = await adapter.deleteById(user!.id!.toString());
    expect(deleted).toBe(true);
    const after = await adapter.findOne({ query: { name: 'Bob' } });
    expect(after).toBeNull();
  });
});
