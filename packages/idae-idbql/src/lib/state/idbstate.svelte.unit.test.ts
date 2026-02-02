import { describe, it, expect, beforeEach } from 'vitest';
import { createIdbqlState, CollectionState } from './idbstate.svelte';
import { createIdbqDb } from '../idbqlCore/idbqlCore.js';
import 'fake-indexeddb/auto';

describe('createIdbqlState', () => {
  it('should be a function', () => {
    expect(typeof createIdbqlState).toBe('function');
  });
  it('should create a state object with collectionState', () => {
    const fakeDb = { users: {} } as any;
    const state = createIdbqlState(fakeDb);
    expect(state).toHaveProperty('collectionState');
  });
});

describe('CollectionState', () => {
  const idbqModel = {
    users: {
      keyPath: '++id',
      model: {} as any,
    },
    chat: {
      keyPath: '&chatId',
      model: {} as any,
    }
  } as const;

  let idbqStore: ReturnType<ReturnType<typeof createIdbqDb<typeof idbqModel>>['create']>;
  let collectionState: CollectionState<any>;

  beforeEach(async () => {
    idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 1).create('testDb');
    
    // Pre-populate data
    await idbqStore.idbql.users.put({ id: 1, name: 'John', age: 30 });
    await idbqStore.idbql.users.put({ id: 2, name: 'Jane', age: 25 });
    await idbqStore.idbql.users.put({ id: 3, name: 'Alice', age: 35 });
    
    collectionState = idbqStore.idbqlState.users;
  });

  it('should count all documents in the collection', async () => {
    const count = await collectionState.count();
    expect(count).toBe(3);
  });

  it('should count documents matching a query', async () => {
    const count = await collectionState.count({ name: 'John' });
    expect(count).toBe(1);
  });

  it('should return 0 for query with no matches', async () => {
    const count = await collectionState.count({ name: 'NonExistent' });
    expect(count).toBe(0);
  });

  it('should count documents with complex query', async () => {
    const count = await collectionState.count({ age: { $gte: 30 } });
    expect(count).toBe(2); // John (30) and Alice (35)
  });

  it('should return undefined if collection does not exist', async () => {
    const fakeDb = { schema: {} } as any;
    const fakeState = new CollectionState('nonexistent', fakeDb);
    const count = await fakeState.count();
    expect(count).toBeUndefined();
  });
});
