import { describe, it, expect, beforeEach } from 'vitest';
import { createQoolie } from './Qoolie.js';

describe('Qoolie', () => {
  beforeEach(() => {
    // Clean up any existing instances
  });

  it('should create qoolie instance with basic config', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    });

    expect(qoolie).toBeDefined();
    expect(qoolie.collection).toBeDefined();
  });

  it('should create collection accessor', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
        tasks: { keyPath: 'id' },
      },
    });

    expect(qoolie.collection.users).toBeDefined();
    expect(qoolie.collection.tasks).toBeDefined();
  });

  it('should throw error for non-existent collection', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    });

    expect(() => (qoolie.collection as any).nonexistent).toThrow('Collection "nonexistent" not found');
  });

  it('should destroy instance cleanly', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    });

    qoolie.destroy();
    expect(qoolie.isDestroyed()).toBe(true);
  });

  it('should throw error after destroy', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    });

    qoolie.destroy();
    expect(() => qoolie.collection.users).toThrow('Qoolie instance has been destroyed');
  });

  it('should disable sync globally', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      sync: false,
      collections: {
        users: { keyPath: 'id' },
      },
    });

    expect(qoolie.collection.users.isSyncEnabled()).toBe(false);
  });

  it('should enable sync by default', () => {
    const qoolie = createQoolie({
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    });

    expect(qoolie.collection.users.isSyncEnabled()).toBe(true);
  });
});
