import { describe, it, expect } from 'vitest';
import { createIdbqlState } from './idbstate.svelte';

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
