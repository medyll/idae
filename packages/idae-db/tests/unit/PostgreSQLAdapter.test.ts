
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PostgreSQLAdapter } from '../../src/lib/adapters/PostgreSQLAdapter.js';

interface User {
  id?: number;
  name: string;
  email: string;
  age: number;
}

describe('PostgreSQLAdapter (mock)', () => {
  let mockClient: any;
  let adapter: PostgreSQLAdapter<User>;

  beforeEach(() => {
    mockClient = {
      query: vi.fn()
    };
    const mockConn = { getDb: () => mockClient };
    adapter = new PostgreSQLAdapter<User>('user', mockConn);
  });

  it('should create a user', async () => {
    mockClient.query.mockResolvedValue({ rows: [{ id: 1, name: 'Alice', email: 'alice@example.com', age: 25 }] });
    const user = await adapter.create({ name: 'Alice', email: 'alice@example.com', age: 25 });
    expect(user).toHaveProperty('id', 1);
    expect(user.name).toBe('Alice');
  });

  it('should find users', async () => {
    mockClient.query.mockResolvedValue({ rows: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 }
    ] });
    const users = await adapter.find({ query: {} });
    expect(users.length).toBe(2);
  });

  it('should findOne user', async () => {
    mockClient.query.mockResolvedValue({ rows: [ { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 } ] });
    const user = await adapter.findOne({ query: { name: 'Alice' } });
    expect(user?.name).toBe('Alice');
  });

  it('should update a user', async () => {
    mockClient.query.mockResolvedValue({ rows: [ { id: 1, name: 'Alice', email: 'alice@example.com', age: 26 } ] });
    const updated = await adapter.update('1', { age: 26 });
    expect(updated?.age).toBe(26);
  });

  it('should delete a user', async () => {
    mockClient.query.mockResolvedValue({ rowCount: 1 });
    const deleted = await adapter.deleteById('1');
    expect(deleted).toBe(true);
  });
});
