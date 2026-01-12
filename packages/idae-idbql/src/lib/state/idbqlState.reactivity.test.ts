import { describe, it, expect, beforeEach } from 'vitest';
import { createIdbqDb } from '../idbqlCore/idbqlCore.js';
import { createIdbqlState } from './idbstate.svelte.js';
import 'fake-indexeddb/auto';

const idbqModel = {
  users: {
    keyPath: 'id',
    model: {} as any,
    ts: {} as any,
  },
};

describe('Svelte 5 reactivity with idbqlState', () => {
  let idbql, idbqlState;

  beforeEach(async () => {
    const db = createIdbqDb<typeof idbqModel>(idbqModel, 1);
    const { idbql: _idbql, idbqlState: _idbqlState } = db.create('testdb');
    idbql = _idbql;
    idbqlState = _idbqlState;
    await idbql.users.put({ id: 1, name: 'Alice', isActive: true });
    await idbql.users.put({ id: 2, name: 'Bob', isActive: false });
    await idbql.users.put({ id: 3, name: 'Charlie', isActive: true });
  });

  it('should update idbqlState.users.where({ isActive: true }) when data changes', async () => {
    // Initial state
    let result = idbqlState.users.where({ isActive: true });
    expect(result.length).toBe(2);
    // Add a new active user
    await idbql.users.put({ id: 4, name: 'Diana', isActive: true });
    // Vérifie après mutation
    result = idbqlState.users.where({ isActive: true });
    expect(result.length).toBe(3);
    // Deactivate a user
    await idbql.users.put({ id: 1, name: 'Alice', isActive: false });
    result = idbqlState.users.where({ isActive: true });
    expect(result.length).toBe(2);
  });
});
