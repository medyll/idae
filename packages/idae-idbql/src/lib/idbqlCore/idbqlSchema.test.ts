import { describe, it, expect } from 'vitest';
import { Schema } from './idbqlSchema.js';

describe('Schema', () => {
  it('should create a store without error', () => {
    const db = {
      createObjectStore: (name: string, opts: any) => ({ name, ...opts })
    } as any;
    const schema = new Schema();
    const store = schema.createStore(db, 'test', 'id');
    expect(store).toBeDefined();
    expect(store.name).toBe('test');
  });

  it('should handle autoIncrement', () => {
    const db = {
      createObjectStore: (name: string, opts: any) => opts.autoIncrement
    } as any;
    const schema = new Schema();
    const store = schema.createStore(db, 'auto', 'id', true);
    expect(store).toBe(true);
  });

  it('should handle createStore error', () => {
    const db = {
      createObjectStore: () => { throw new Error('fail'); }
    } as any;
    const schema = new Schema();
    const store = schema.createStore(db, 'fail', 'id');
    expect(store).toBeNull();
  });

  it('should clean index names', () => {
    const schema = new Schema();
    expect((schema as any).cleanIndexName('&foo+')).toBe('foo');
  });

  it('should create indexes (no error)', async () => {
    const store = {
      createIndex: (name: string, key: string) => ({ name, key })
    } as any;
    const schema = new Schema();
    await (schema as any).createIndexes(store, '&foo', '+foo');
  });

  it('should handle createIndexes error', async () => {
    const store = {
      createIndex: () => { throw new Error('fail'); }
    } as any;
    const schema = new Schema();
    await (schema as any).createIndexes(store, 'bad', 'bad');
  });

  it('should create schema for multiple stores', async () => {
    const db = {
      createObjectStore: (name: string, opts: any) => ({ name, ...opts })
    } as any;
    const schema = new Schema();
    const result = await schema.createSchema(db, { foo: '++id,&bar', bar: 'id' });
    expect(result.length).toBe(2);
    expect(result[0].storeName).toBe('foo');
  });
});
