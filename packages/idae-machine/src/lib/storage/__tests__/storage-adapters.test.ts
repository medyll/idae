import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryStorageAdapter } from '../MemoryStorageAdapter.js';
import { ApiStorageAdapter } from '../ApiStorageAdapter.js';

describe('Storage Adapters', () => {
  describe('MemoryStorageAdapter', () => {
    let adapter: MemoryStorageAdapter<{ id: string; name: string; age: number }>;

    beforeEach(() => {
      adapter = new MemoryStorageAdapter();
    });

    it('should create and retrieve records', async () => {
      const record = await adapter.create({ name: 'Test', age: 25 });
      expect(record).toHaveProperty('id');
      expect(record.name).toBe('Test');
      expect(record.age).toBe(25);

      const retrieved = await adapter.get(record.id);
      expect(retrieved).toEqual(record);
    });

    it('should update records', async () => {
      const record = await adapter.create({ name: 'Test', age: 25 });
      const updated = await adapter.update(record.id, { age: 26 });
      expect(updated.age).toBe(26);
      expect(updated.name).toBe('Test'); // Name should remain unchanged
    });

    it('should delete records', async () => {
      const record = await adapter.create({ name: 'Test', age: 25 });
      const success = await adapter.delete(record.id);
      expect(success).toBe(true);
      expect(await adapter.get(record.id)).toBeUndefined();
    });

    it('should return all records', async () => {
      await adapter.create({ name: 'Test1', age: 25 });
      await adapter.create({ name: 'Test2', age: 30 });
      
      const all = adapter.getAll();
      expect(all.length).toBe(2);
    });

    it('should filter records with where', async () => {
      await adapter.create({ name: 'Test1', age: 25 });
      await adapter.create({ name: 'Test2', age: 30 });
      await adapter.create({ name: 'Test3', age: 25 });

      const results = adapter.where({ age: 25 });
      expect(results.length).toBe(2);
      expect(results.every(r => r.age === 25)).toBe(true);
    });

    it('should support query operators', async () => {
      await adapter.create({ name: 'Test1', age: 25 });
      await adapter.create({ name: 'Test2', age: 30 });
      await adapter.create({ name: 'Test3', age: 35 });

      const results = adapter.where({ age: { $gt: 28 } });
      expect(results.length).toBe(2);
      expect(results.every(r => r.age > 28)).toBe(true);
    });

    it('should emit events on changes', async () => {
      const events: string[] = [];
      adapter.on('create', () => events.push('create'));
      adapter.on('update', () => events.push('update'));
      adapter.on('delete', () => events.push('delete'));
      adapter.on('change', () => events.push('change'));

      const record = await adapter.create({ name: 'Test', age: 25 });
      expect(events).toContain('create');
      expect(events).toContain('change');

      await adapter.update(record.id, { age: 26 });
      expect(events).toContain('update');

      await adapter.delete(record.id);
      expect(events).toContain('delete');
    });

    it('should allow unsubscribing from events', async () => {
      const listener = () => {};
      adapter.on('create', listener);
      adapter.off('create', listener);
      
      // Should not throw error
      expect(() => adapter.off('create', listener)).not.toThrow();
    });
  });

  describe('ApiStorageAdapter', () => {
    let adapter: ApiStorageAdapter<{ id: string; name: string }>;
    let mockApiClient: any;

    beforeEach(() => {
      mockApiClient = {
        get: vi.fn().mockImplementation((collection, id) => 
          Promise.resolve({ id, name: `Fetched-${id}` })
        ),
        create: vi.fn().mockImplementation((collection, data) => 
          Promise.resolve({ id: 'new-id', ...data })
        ),
        update: vi.fn().mockImplementation((collection, id, data) => 
          Promise.resolve({ id, ...data })
        ),
        delete: vi.fn().mockImplementation((collection, id) => 
          Promise.resolve(true)
        ),
        query: vi.fn().mockImplementation((collection, query) => 
          Promise.resolve([])
        )
      };

      adapter = new ApiStorageAdapter(mockApiClient, 'test-collection');
    });

    it('should create records via API', async () => {
      const record = await adapter.create({ name: 'Test' });
      expect(record).toHaveProperty('id', 'new-id');
      expect(record.name).toBe('Test');
      expect(mockApiClient.create).toHaveBeenCalledWith('test-collection', { name: 'Test' });
    });

    it('should cache fetched records', async () => {
      // First call should hit API
      const record1 = await adapter.get('test-id');
      expect(mockApiClient.get).toHaveBeenCalledWith('test-collection', 'test-id');
      expect(record1).toEqual({ id: 'test-id', name: 'Fetched-test-id' });

      // Second call should use cache
      mockApiClient.get.mockClear();
      const record2 = await adapter.get('test-id');
      expect(record2).toEqual(record1);
      expect(mockApiClient.get).not.toHaveBeenCalled();
    });

    it('should emit events on API operations', async () => {
      const events: string[] = [];
      adapter.on('create', () => events.push('create'));
      adapter.on('change', () => events.push('change'));

      await adapter.create({ name: 'Test' });
      expect(events).toContain('create');
      expect(events).toContain('change');
    });

    it('should return mode correctly', () => {
      expect(adapter.getMode()).toBe('online-only');
    });
  });
});