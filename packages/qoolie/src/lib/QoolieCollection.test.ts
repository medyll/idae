import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { QoolieCollection } from './QoolieCollection.js';

describe('QoolieCollection', () => {
  const mockIdbql = {
    users: {
      where: () => ({ toArray: () => [] }),
      get: async (id: any) => ({ id, name: 'Test' }),
      getAll: async () => [{ id: 1, name: 'User1' }],
      add: async (data: any) => ({ id: 1, ...data }),
      update: async (id: any, data: any) => ({ id, ...data }),
      delete: async () => true,
      updateWhere: async () => true,
      deleteWhere: async () => true,
      count: async () => 1,
    },
  };

  let collection: QoolieCollection<any>;

  beforeEach(() => {
    collection = new QoolieCollection('users', 'id', mockIdbql, true, 'svelte5');
  });

  it('should create collection with correct name', () => {
    expect(collection.collectionName).toBe('users');
  });

  it('should return sync enabled status', () => {
    expect(collection.isSyncEnabled()).toBe(true);
  });

  it('should create document', async () => {
    const data = { name: 'Alice' };
    const result = await collection.create(data);
    expect(result).toEqual({ id: 1, name: 'Alice' });
  });

  it('should get document by id', async () => {
    const result = await collection.get(1);
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should get all documents', async () => {
    const result = await collection.getAll();
    expect(result).toEqual([{ id: 1, name: 'User1' }]);
  });

  it('should update document', async () => {
    const result = await collection.update(1, { name: 'Updated' });
    expect(result).toEqual({ id: 1, name: 'Updated' });
  });

  it('should delete document', async () => {
    const result = await collection.delete(1);
    expect(result).toBe(true);
  });

  it('should count documents', async () => {
    const result = await collection.count();
    expect(result).toBe(1);
  });

  it('should throw error for non-existent collection', () => {
    const badCollection = new QoolieCollection('nonexistent', 'id', {}, true, 'svelte5');
    expect(() => badCollection.where({})).toThrow('Collection "nonexistent" not found');
  });
});
