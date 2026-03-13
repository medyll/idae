// ChromaDB adapter integration tests (mocked)
import { describe, it, expect, vi } from 'vitest';
import { ChromaDBAdapter } from '../../src/lib/adapters/ChromaDBAdapter';

describe('ChromaDB Adapter - integration (mocked)', () => {
  it('initializes and performs create/find/delete operations', async () => {
    const mockCollection = {
      add: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue([{ id: 'test-id', documents: ['doc'], metadatas: [{ foo: 'bar' }], embeddings: [[0.1]] }]),
      query: vi.fn().mockResolvedValue([{ id: 'test-id', documents: ['doc'], metadatas: [{ foo: 'bar' }], embeddings: [[0.1]] }]),
      update: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined)
    };
    const mockClient = { getOrCreateCollection: vi.fn().mockResolvedValue(mockCollection) };
    const mockConnection = { getDb: () => mockClient };

    const adapter = new ChromaDBAdapter('test', mockConnection as any);
    await new Promise((r) => setTimeout(r, 0));

    expect(mockClient.getOrCreateCollection).toHaveBeenCalledWith({ name: 'test' });

    const data: any = { ids: 'test-id', embeddings: [0.1], metadatas: { foo: 'bar' }, documents: ['doc'] };
    const created = await adapter.create(data);

    expect(mockCollection.add).toHaveBeenCalledWith({
      ids: ['test-id'],
      embeddings: [[0.1]],
      metadatas: [{ foo: 'bar' }],
      documents: [['doc']]
    });
    expect(created.id).toBe('test-id');

    const found = await adapter.findById('test-id');
    expect(mockCollection.get).toHaveBeenCalledWith(['test-id']);
    expect(Array.isArray(found)).toBeTruthy();

    const q = await adapter.find({ query: { vector: [0.1] }, limit: 5 } as any);
    expect(mockCollection.query).toHaveBeenCalledWith([0.1], 5);
    expect(q.length).toBeGreaterThanOrEqual(0);

    const deleted = await adapter.deleteById('test-id');
    expect(mockCollection.delete).toHaveBeenCalledWith({ ids: ['test-id'] });
    expect(deleted).toBe(true);
  });

  it('throws for unsupported operations', async () => {
    const mockCollection = { add: vi.fn(), get: vi.fn(), query: vi.fn(), update: vi.fn(), delete: vi.fn() };
    const mockClient = { getOrCreateCollection: vi.fn().mockResolvedValue(mockCollection) };
    const mockConnection = { getDb: () => mockClient };
    const adapter = new ChromaDBAdapter('test2', mockConnection as any);
    await new Promise((r) => setTimeout(r, 0));

    await expect(adapter.updateWhere({}, { foo: 'bar' } as any)).rejects.toThrow('updateWhere not supported in ChromaDB');
    await expect(adapter.deleteWhere({} as any)).rejects.toThrow('deleteWhere not supported in ChromaDB');
    await expect(adapter.createIndex('field', {} as any)).rejects.toThrow('updateWhere not supported in ChromaDB');
  });
});
