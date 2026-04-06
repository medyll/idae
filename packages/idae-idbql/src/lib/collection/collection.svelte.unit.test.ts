/**
 * Comprehensive unit tests for CollectionCore CRUD operations (S1-03)
 * 
 * Run with: npx vitest run src/lib/collection/collection.svelte.unit.test.ts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CollectionCore } from './collection.svelte.js';
import { createIdbqDb } from '../idbqlCore/idbqlCore.js';
import 'fake-indexeddb/auto';

const idbqModel = {
  items: {
    keyPath: '++id',
    model: {} as any,
  },
  users: {
    keyPath: '++id',
    model: {} as any,
  },
} as const;

describe('CollectionCore - CRUD Operations (S1-03)', () => {
  let idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 1);
  const { idbql } = idbqStore.create('crud-test-db');
  let collection: CollectionCore;

  beforeEach(async () => {
    collection = idbql.items;
    // Clear the store before each test
    const allItems = await collection.getAll();
    for (const item of allItems as any[]) {
      await collection.delete(item.id);
    }
  });

  describe('add()', () => {
    it('should add a new item to the store', async () => {
      const item = { name: 'Test Item', value: 42 };
      const result = await collection.add(item);
      
      expect(result).toBeDefined();
      expect((result as any).name).toBe('Test Item');
      expect((result as any).value).toBe(42);
      expect((result as any).id).toBeDefined();
    });

    it('should add multiple items with auto-increment ids', async () => {
      const items = [
        { name: 'Item 1', value: 1 },
        { name: 'Item 2', value: 2 },
        { name: 'Item 3', value: 3 },
      ];

      const results = await Promise.all(items.map(item => collection.add(item)));
      
      expect(results).toHaveLength(3);
      const ids = results.map(r => (r as any).id);
      expect(ids[0]).toBeLessThan(ids[1]);
      expect(ids[1]).toBeLessThan(ids[2]);
    });

    it('should handle empty object', async () => {
      const result = await collection.add({});
      expect(result).toBeDefined();
      expect((result as any).id).toBeDefined();
    });

    it('should handle nested objects', async () => {
      const item = {
        name: 'Complex Item',
        metadata: {
          tags: ['tag1', 'tag2'],
          created: '2026-04-06',
        },
        settings: {
          enabled: true,
          priority: 5,
        },
      };
      
      const result = await collection.add(item);
      expect(result).toBeDefined();
      expect((result as any).metadata.tags).toHaveLength(2);
      expect((result as any).settings.enabled).toBe(true);
    });
  });

  describe('put()', () => {
    it('should add a new item when id does not exist', async () => {
      const item = { id: 100, name: 'New Item' };
      const result = await collection.put(item);
      
      expect(result).toBeDefined();
      expect((result as any).id).toBe(100);
      expect((result as any).name).toBe('New Item');
    });

    it('should update an existing item', async () => {
      const added = await collection.add({ name: 'Original', value: 1 });
      const id = (added as any).id;
      
      const updated = await collection.put({ id, name: 'Updated', value: 2 });
      
      expect((updated as any).id).toBe(id);
      expect((updated as any).name).toBe('Updated');
      expect((updated as any).value).toBe(2);
      
      const retrieved = await collection.get(id);
      expect((retrieved as any).name).toBe('Updated');
    });

    it('should replace item with put (not merge)', async () => {
      const added = await collection.put({ 
        id: 200, 
        name: 'Test', 
        extra: 'exists',
        count: 10 
      });
      
      // put() replaces the entire item, not merges
      const updated = await collection.put({ id: 200, name: 'OnlyName' });
      
      expect((updated as any).id).toBe(200);
      expect((updated as any).name).toBe('OnlyName');
      // Fields not in put are lost (this is IndexedDB behavior)
      expect((updated as any).extra).toBeUndefined();
      expect((updated as any).count).toBeUndefined();
    });
  });

  describe('get()', () => {
    it('should retrieve an item by id', async () => {
      const added = await collection.add({ name: 'Find Me', value: 999 });
      const id = (added as any).id;
      
      const result = await collection.get(id);
      
      expect(result).toBeDefined();
      expect((result as any).name).toBe('Find Me');
      expect((result as any).value).toBe(999);
    });

    it('should return undefined for non-existent id', async () => {
      const result = await collection.get(99999);
      expect(result).toBeUndefined();
    });

    it('should handle string ids', async () => {
      const added = await collection.put({ id: 'custom-id-123', name: 'String ID Test' });
      
      const result = await collection.get('custom-id-123');
      
      expect(result).toBeDefined();
      expect((result as any).id).toBe('custom-id-123');
    });
  });

  describe('getAll()', () => {
    it('should return all items in the store', async () => {
      await collection.add({ name: 'Item 1' });
      await collection.add({ name: 'Item 2' });
      await collection.add({ name: 'Item 3' });
      
      const all = await collection.getAll();
      
      expect(all).toHaveLength(3);
      expect(all.map((i: any) => i.name)).toEqual(
        expect.arrayContaining(['Item 1', 'Item 2', 'Item 3'])
      );
    });

    it('should return empty array for empty store', async () => {
      const all = await collection.getAll();
      expect(all).toEqual([]);
    });

    it('should return all fields for each item', async () => {
      await collection.add({ name: 'Complete', value: 42, active: true, tags: ['a', 'b'] });
      
      const all = await collection.getAll();
      
      expect(all).toHaveLength(1);
      expect(all[0]).toHaveProperty('id');
      expect(all[0]).toHaveProperty('name', 'Complete');
      expect(all[0]).toHaveProperty('value', 42);
      expect(all[0]).toHaveProperty('active', true);
      expect(all[0]).toHaveProperty('tags', ['a', 'b']);
    });
  });

  describe('delete()', () => {
    it('should delete an item by id', async () => {
      const added = await collection.add({ name: 'To Delete' });
      const id = (added as any).id;
      
      const deleted = await collection.delete(id);
      expect(deleted).toBe(true);
      
      const result = await collection.get(id);
      expect(result).toBeUndefined();
    });

    it('should return true for non-existent id (IndexedDB behavior)', async () => {
      // IndexedDB delete() succeeds even if key doesn't exist
      const deleted = await collection.delete(99999);
      expect(deleted).toBe(true);
    });

    it('should delete multiple items sequentially', async () => {
      const added = await Promise.all([
        collection.add({ name: 'Delete 1' }),
        collection.add({ name: 'Delete 2' }),
        collection.add({ name: 'Delete 3' }),
      ]);
      
      const ids = added.map(a => (a as any).id);
      
      await collection.delete(ids[0]);
      await collection.delete(ids[1]);
      await collection.delete(ids[2]);
      
      const all = await collection.getAll();
      expect(all).toHaveLength(0);
    });
  });

  describe('update()', () => {
    it('should update an existing item by id', async () => {
      const added = await collection.add({ name: 'Original', value: 1 });
      const id = (added as any).id;
      
      const updated = await collection.update(id, { name: 'Modified', value: 2 });
      
      expect((updated as any).id).toBe(id);
      expect((updated as any).name).toBe('Modified');
      expect((updated as any).value).toBe(2);
    });

    it('should merge update data with existing data', async () => {
      const added = await collection.put({ 
        id: 300, 
        name: 'Test', 
        extra: 'kept',
        count: 5 
      });
      
      const updated = await collection.update(300, { name: 'New Name' });
      
      expect((updated as any).extra).toBe('kept');
      expect((updated as any).count).toBe(5);
      expect((updated as any).name).toBe('New Name');
    });

    it('should handle partial updates', async () => {
      const added = await collection.add({ 
        a: 1, b: 2, c: 3, d: 4 
      });
      const id = (added as any).id;
      
      const updated = await collection.update(id, { b: 20, d: 40 });
      
      expect((updated as any).a).toBe(1);
      expect((updated as any).b).toBe(20);
      expect((updated as any).c).toBe(3);
      expect((updated as any).d).toBe(40);
    });
  });

  describe('where()', () => {
    beforeEach(async () => {
      await collection.add({ name: 'Alice', age: 25, city: 'Paris' });
      await collection.add({ name: 'Bob', age: 30, city: 'London' });
      await collection.add({ name: 'Charlie', age: 35, city: 'Paris' });
      await collection.add({ name: 'Diana', age: 28, city: 'Berlin' });
    });

    it('should filter by exact match', async () => {
      const result = await collection.where({ name: 'Bob' });
      expect(result).toHaveLength(1);
      expect((result[0] as any).name).toBe('Bob');
    });

    it('should filter with $gt operator', async () => {
      const result = await collection.where({ age: { $gt: 30 } });
      expect(result).toHaveLength(1);
      expect((result[0] as any).name).toBe('Charlie');
    });

    it('should filter with $lt operator', async () => {
      const result = await collection.where({ age: { $lt: 28 } });
      expect(result).toHaveLength(1);
      expect((result[0] as any).name).toBe('Alice');
    });

    it('should filter with $gte and $lte operators', async () => {
      const result = await collection.where({ age: { $gte: 28, $lte: 30 } });
      expect(result).toHaveLength(2);
      expect(result.map((r: any) => r.name)).toEqual(
        expect.arrayContaining(['Bob', 'Diana'])
      );
    });

    it('should filter with $in operator', async () => {
      const result = await collection.where({ city: { $in: ['Paris', 'Berlin'] } });
      expect(result).toHaveLength(3);
      expect(result.map((r: any) => r.name)).toEqual(
        expect.arrayContaining(['Alice', 'Charlie', 'Diana'])
      );
    });

    it('should filter with $eq operator', async () => {
      const result = await collection.where({ age: { $eq: 30 } });
      expect(result).toHaveLength(1);
      expect((result[0] as any).name).toBe('Bob');
    });

    it('should handle multiple conditions (AND)', async () => {
      const result = await collection.where({ 
        age: { $gt: 25 }, 
        city: 'Paris' 
      });
      expect(result).toHaveLength(1);
      expect((result[0] as any).name).toBe('Charlie');
    });

    it('should return empty array for no matches', async () => {
      const result = await collection.where({ name: 'NonExistent' });
      expect(result).toHaveLength(0);
    });
  });

  describe('count()', () => {
    beforeEach(async () => {
      await collection.add({ name: 'A', active: true });
      await collection.add({ name: 'B', active: true });
      await collection.add({ name: 'C', active: false });
      await collection.add({ name: 'D', active: true });
    });

    it('should count all items without query', async () => {
      const count = await collection.count();
      expect(count).toBe(4);
    });

    it('should count items matching query', async () => {
      const count = await collection.count({ active: true });
      expect(count).toBe(3);
    });

    it('should return 0 for no matches', async () => {
      const count = await collection.count({ active: 'maybe' });
      expect(count).toBe(0);
    });
  });

  describe('updateWhere()', () => {
    beforeEach(async () => {
      await collection.add({ name: 'User1', status: 'pending', score: 10 });
      await collection.add({ name: 'User2', status: 'pending', score: 20 });
      await collection.add({ name: 'User3', status: 'approved', score: 30 });
    });

    it('should update all items matching the where clause', async () => {
      await collection.updateWhere({ status: 'pending' }, { status: 'approved' });
      
      const all = await collection.getAll();
      const approved = all.filter((i: any) => i.status === 'approved');
      
      expect(approved).toHaveLength(3);
    });

    it('should preserve fields not in update data', async () => {
      await collection.updateWhere({ status: 'pending' }, { status: 'approved' });
      
      const all = await collection.getAll();
      const user1 = all.find((i: any) => i.name === 'User1');
      
      expect(user1?.status).toBe('approved');
      expect(user1?.score).toBe(10);
      expect(user1?.name).toBe('User1');
    });

    it('should handle multiple field updates', async () => {
      await collection.updateWhere(
        { status: 'pending' }, 
        { status: 'reviewed', reviewed: true, reviewedAt: '2026-04-06' }
      );
      
      const pending = await collection.where({ status: 'pending' });
      expect(pending).toHaveLength(0);
      
      const reviewed = await collection.where({ status: 'reviewed' });
      expect(reviewed).toHaveLength(2);
      expect((reviewed[0] as any).reviewed).toBe(true);
    });
  });

  describe('deleteWhere()', () => {
    beforeEach(async () => {
      await collection.add({ name: 'Temp1', temp: true });
      await collection.add({ name: 'Temp2', temp: true });
      await collection.add({ name: 'Keep1', temp: false });
      await collection.add({ name: 'Keep2', temp: false });
    });

    it('should delete all items matching the where clause', async () => {
      const deleted = await collection.deleteWhere({ temp: true });
      expect(deleted).toBe(true);
      
      const all = await collection.getAll();
      expect(all).toHaveLength(2);
      expect(all.every((i: any) => i.temp === false)).toBe(true);
    });

    it('should return true even if no items match', async () => {
      const deleted = await collection.deleteWhere({ temp: 'nonexistent' });
      expect(deleted).toBe(true);
    });

    it('should delete all items when condition matches all', async () => {
      await collection.deleteWhere({});
      const all = await collection.getAll();
      expect(all).toHaveLength(0);
    });
  });

  describe('batchAdd()', () => {
    it('should add multiple items in a single transaction', async () => {
      const items = [
        { name: 'Batch1', value: 1 },
        { name: 'Batch2', value: 2 },
        { name: 'Batch3', value: 3 },
      ];
      
      const results = await collection.batchAdd(items);
      
      expect(results).toHaveLength(3);
      expect(results.map((r: any) => r.name)).toEqual(
        expect.arrayContaining(['Batch1', 'Batch2', 'Batch3'])
      );
      
      const all = await collection.getAll();
      expect(all).toHaveLength(3);
    });

    it('should assign auto-increment ids to batch items', async () => {
      const items = [
        { name: 'Item1' },
        { name: 'Item2' },
        { name: 'Item3' },
      ];
      
      const results = await collection.batchAdd(items);
      const ids = results.map((r: any) => r.id);
      
      expect(ids[0]).toBeLessThan(ids[1]);
      expect(ids[1]).toBeLessThan(ids[2]);
    });

    it('should handle empty array', async () => {
      const results = await collection.batchAdd([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('batchPut()', () => {
    it('should add new items when ids do not exist', async () => {
      const items = [
        { id: 101, name: 'New1' },
        { id: 102, name: 'New2' },
      ];
      
      const results = await collection.batchPut(items);
      expect(results).toHaveLength(2);
      
      const all = await collection.getAll();
      expect(all).toHaveLength(2);
    });

    it('should update existing items with matching ids', async () => {
      await collection.add({ id: 201, name: 'Original1', value: 1 });
      await collection.add({ id: 202, name: 'Original2', value: 2 });
      
      const items = [
        { id: 201, name: 'Updated1', value: 10 },
        { id: 202, name: 'Updated2', value: 20 },
      ];
      
      await collection.batchPut(items);
      
      const all = await collection.getAll();
      const item1 = all.find((i: any) => i.id === 201);
      const item2 = all.find((i: any) => i.id === 202);
      
      expect(item1?.name).toBe('Updated1');
      expect(item1?.value).toBe(10);
      expect(item2?.name).toBe('Updated2');
      expect(item2?.value).toBe(20);
    });

    it('should handle mixed add and update', async () => {
      await collection.add({ id: 301, name: 'Existing' });
      
      const items = [
        { id: 301, name: 'Updated' },
        { id: 302, name: 'New' },
      ];
      
      await collection.batchPut(items);
      
      const all = await collection.getAll();
      expect(all).toHaveLength(2);
      
      const existing = all.find((i: any) => i.id === 301);
      const newItem = all.find((i: any) => i.id === 302);
      
      expect(existing?.name).toBe('Updated');
      expect(newItem?.name).toBe('New');
    });
  });
});
