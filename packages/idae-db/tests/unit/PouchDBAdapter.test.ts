
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PouchDBAdapter } from '../../src/lib/adapters/PouchDBAdapter.js';
import PouchDB from 'pouchdb';
import PouchMemory from 'pouchdb-adapter-memory';
PouchDB.plugin(PouchMemory);
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

interface User {
  name: string;
  email: string;
  age: number;
  _id?: string;
  _rev?: string;
}

describe('PouchDBAdapter', () => {
  let db: PouchDB.Database<User>;
  let adapter: PouchDBAdapter<User>;

  beforeAll(async () => {
    db = new PouchDB('idae-pouchdb-test', { adapter: 'memory' });
    adapter = new PouchDBAdapter<User>('user', db);
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create a user', async () => {
    const user = await adapter.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
    expect(user).toHaveProperty('_id');
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
    const updated = await adapter.update(user!._id!, { age: 26 });
    expect(updated?.age).toBe(26);
  });

  it('should delete a user', async () => {
    const user = await adapter.findOne({ query: { name: 'Bob' } });
    expect(user).toBeTruthy();
    const deleted = await adapter.deleteById(user!._id!);
    expect(deleted).toBe(true);
    const after = await adapter.findOne({ query: { name: 'Bob' } });
    expect(after).toBeNull();
  });
});
