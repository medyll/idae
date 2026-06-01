/**
 * Stress test for transaction deadlock fix (S1-01)
 * 
 * This test verifies that rapid write operations do not cause transaction deadlocks.
 * Run with: npx vitest run src/lib/collection/collection.stress.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CollectionCore } from './collection.svelte.js';
import { createIdbqDb } from '../idbqlCore/idbqlCore.js';

// Mock IndexedDB for Node environment - auto-registers globals
import 'fake-indexeddb/auto';

const idbqModel = {
  stress: {
    keyPath: '++id',
    model: {} as any,
  },
} as const;

describe('CollectionCore - Stress Test (S1-01)', () => {
  let idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 1);
  const { idbql, idbDatabase } = idbqStore.create('stress-test-db');
  let collection: CollectionCore;

  beforeEach(async () => {
    collection = idbql.stress;
    // Clear the store before each test
    const allItems = await collection.getAll();
    for (const item of allItems as any[]) {
      await collection.delete(item.id);
    }
  });

  it('should handle 100 rapid writes without deadlock', async () => {
    const writeCount = 100;
    const promises: Promise<any>[] = [];

    // Fire off 100 write operations simultaneously
    for (let i = 0; i < writeCount; i++) {
      promises.push(
        collection.add({ name: `item-${i}`, value: Math.random() })
      );
    }

    // All writes should complete without deadlock
    const results = await Promise.all(promises);
    
    expect(results).toHaveLength(writeCount);
    expect(results.every(r => r !== undefined)).toBe(true);

    // Verify all items were written
    const allItems = await collection.getAll();
    expect(allItems).toHaveLength(writeCount);
  }, 30000); // 30s timeout for stress test

  it('should handle 50 rapid updates without deadlock', async () => {
    // First, add some items
    const initialItems = await collection.batchAdd(
      Array.from({ length: 10 }, (_, i) => ({ name: `item-${i}`, value: i }))
    );

    expect(initialItems).toHaveLength(10);

    // Now fire off 50 update operations simultaneously
    const updatePromises: Promise<any>[] = [];
    for (let i = 0; i < 50; i++) {
      const item = initialItems[i % initialItems.length];
      updatePromises.push(
        collection.update((item as any).id, { value: Math.random() })
      );
    }

    // All updates should complete without deadlock
    const results = await Promise.all(updatePromises);
    
    expect(results).toHaveLength(50);
    expect(results.every(r => r !== undefined)).toBe(true);
  }, 30000);

  it('should handle 30 rapid deletes without deadlock', async () => {
    // First, add some items
    const initialItems = await collection.batchAdd(
      Array.from({ length: 20 }, (_, i) => ({ name: `item-${i}`, value: i }))
    );

    expect(initialItems).toHaveLength(20);

    // Fire off delete operations simultaneously
    const deletePromises: Promise<boolean>[] = [];
    for (let i = 0; i < 30; i++) {
      const item = initialItems[i % initialItems.length];
      deletePromises.push(
        collection.delete((item as any).id)
      );
    }

    // All deletes should complete without deadlock
    const results = await Promise.all(deletePromises);
    
    expect(results).toHaveLength(30);
    expect(results.every(r => typeof r === 'boolean')).toBe(true);
  }, 30000);

  it('should handle mixed operations (add/update/delete) without deadlock', async () => {
    const operations: Promise<any>[] = [];

    // Fire off mixed operations simultaneously
    for (let i = 0; i < 50; i++) {
      if (i % 3 === 0) {
        operations.push(collection.add({ name: `item-${i}`, value: i }));
      } else if (i % 3 === 1 && i > 10) {
        operations.push(collection.update(i - 10, { value: Math.random() }));
      } else {
        operations.push(collection.delete(i - 5));
      }
    }

    // All operations should complete without deadlock
    const results = await Promise.all(operations);
    
    expect(results).toHaveLength(50);
    
    // Verify database is in a consistent state
    const allItems = await collection.getAll();
    expect(Array.isArray(allItems)).toBe(true);
  }, 30000);

  it('should handle batchAdd with 100 items in single transaction', async () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      name: `batch-item-${i}`,
      value: i * 10,
    }));

    const startTime = Date.now();
    const results = await collection.batchAdd(items);
    const endTime = Date.now();

    expect(results).toHaveLength(100);
    expect(endTime - startTime).toBeLessThan(5000); // Should complete in < 5s

    // Verify all items were written
    const allItems = await collection.getAll();
    expect(allItems).toHaveLength(100);
  }, 30000);

  it('should handle batchPut with 100 items in single transaction', async () => {
    // First add some items
    const initialItems = await collection.batchAdd(
      Array.from({ length: 50 }, (_, i) => ({ name: `item-${i}`, value: i }))
    );

    // Now batch update them with new values
    const updates = initialItems.map((item: any, i) => ({
      id: item.id,
      name: `updated-${i}`,
      value: i * 100,
    }));

    const startTime = Date.now();
    const results = await collection.batchPut(updates);
    const endTime = Date.now();

    expect(results).toHaveLength(50);
    expect(endTime - startTime).toBeLessThan(5000);

    // Verify updates were applied
    const allItems = await collection.getAll();
    expect(allItems).toHaveLength(50);
    expect((allItems[0] as any).name).toMatch(/^updated-/);
  }, 30000);

  it('should handle updateWhere on multiple items without deadlock', async () => {
    // Add items with a common property
    await collection.batchAdd(
      Array.from({ length: 20 }, (_, i) => ({
        name: `item-${i}`,
        category: i % 3 === 0 ? 'A' : 'B',
        value: i,
      }))
    );

    // Update all items in category 'A' simultaneously
    const updatePromises: Promise<any>[] = [];
    for (let i = 0; i < 10; i++) {
      updatePromises.push(
        collection.updateWhere({ category: 'A' }, { value: Math.random() })
      );
    }

    // All updates should complete without deadlock
    const results = await Promise.all(updatePromises);
    
    expect(results).toHaveLength(10);
    expect(results.every(r => r === true)).toBe(true);

    // Verify all category A items were updated
    const categoryAItems = await collection.where({ category: 'A' });
    expect(categoryAItems.length).toBeGreaterThan(0);
  }, 30000);

  it('should handle deleteWhere on multiple items without deadlock', async () => {
    // Add items with a common property
    await collection.batchAdd(
      Array.from({ length: 30 }, (_, i) => ({
        name: `item-${i}`,
        category: i % 2 === 0 ? 'delete-me' : 'keep',
        value: i,
      }))
    );

    // Delete all items in category 'delete-me' simultaneously
    const deletePromises: Promise<boolean>[] = [];
    for (let i = 0; i < 5; i++) {
      deletePromises.push(
        collection.deleteWhere({ category: 'delete-me' })
      );
    }

    // All deletes should complete without deadlock
    const results = await Promise.all(deletePromises);
    
    expect(results).toHaveLength(5);
    expect(results.every(r => r === true)).toBe(true);

    // Verify all delete-me items were removed
    const remaining = await collection.getAll();
    const deleteMeItems = remaining.filter((item: any) => item.category === 'delete-me');
    expect(deleteMeItems).toHaveLength(0);
    expect(remaining.filter((item: any) => item.category === 'keep').length).toBe(15);
  }, 30000);

  it('should maintain data consistency under concurrent stress', async () => {
    const operations = 200;
    const errors: any[] = [];

    // Fire off many operations
    const promises = Array.from({ length: operations }, (_, i) => {
      return (async () => {
        try {
          if (i % 4 === 0) {
            await collection.add({ name: `stress-${i}`, value: i });
          } else if (i % 4 === 1) {
            await collection.put({ name: `stress-${i}`, value: i * 2 });
          } else if (i % 4 === 2) {
            await collection.count();
          } else {
            await collection.getAll();
          }
        } catch (error) {
          errors.push(error);
        }
      })();
    });

    await Promise.all(promises);

    // No errors should have occurred
    expect(errors).toHaveLength(0);

    // Database should be in a consistent state
    const allItems = await collection.getAll();
    expect(Array.isArray(allItems)).toBe(true);
    
    const count = await collection.count();
    expect(count).toBe(allItems.length);
  }, 60000);
});
