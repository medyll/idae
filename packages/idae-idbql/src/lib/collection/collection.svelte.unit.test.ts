import { describe, it, expect } from 'vitest';
import { CollectionCore } from './collection.svelte';

describe('CollectionCore', () => {
  it('should be a class', () => {
    expect(typeof CollectionCore).toBe('function');
  });
  it('should throw if constructed without name', () => {
    expect(() => new (CollectionCore as any)()).toThrow();
  });
  it('should have CRUD methods', () => {
    const c = new CollectionCore('test', 'id', { dbName: 'db', version: 1 });
    ['add','put','get','getAll','delete','where'].forEach(m => {
      expect(typeof (c as any)[m]).toBe('function');
    });
  });
});
