import { describe, it, expect, vi } from 'vitest';
import { ConflictResolver } from './ConflictResolver.js';
import type { ConflictEntry } from './types.js';

function createConflict(overrides?: Partial<ConflictEntry>): ConflictEntry {
  return {
    collection: 'users',
    id: 1,
    local: { id: 1, name: 'Local Name', version: 2 },
    server: { id: 1, name: 'Server Name', version: 1 },
    localTimestamp: Date.now(),
    serverTimestamp: Date.now() - 1000,
    ...overrides,
  };
}

describe('ConflictResolver', () => {
  describe('local-wins strategy', () => {
    it('should resolve with local data', async () => {
      const resolver = new ConflictResolver({ default: 'local-wins' });
      const conflict = createConflict();

      const resolution = await resolver.resolve(conflict);

      expect(resolution.strategy).toBe('local-wins');
      expect(resolution.resolved).toEqual(conflict.local);
      expect(resolution.manual).toBe(false);
    });
  });

  describe('server-wins strategy', () => {
    it('should resolve with server data', async () => {
      const resolver = new ConflictResolver({ default: 'server-wins' });
      const conflict = createConflict();

      const resolution = await resolver.resolve(conflict);

      expect(resolution.strategy).toBe('server-wins');
      expect(resolution.resolved).toEqual(conflict.server);
      expect(resolution.manual).toBe(false);
    });
  });

  describe('latest-timestamp strategy', () => {
    it('should resolve with newer local data', async () => {
      const resolver = new ConflictResolver({ default: 'latest-timestamp' });
      const conflict = createConflict({
        localTimestamp: Date.now(),
        serverTimestamp: Date.now() - 1000,
      });

      const resolution = await resolver.resolve(conflict);

      expect(resolution.resolved).toEqual(conflict.local);
    });

    it('should resolve with newer server data', async () => {
      const resolver = new ConflictResolver({ default: 'latest-timestamp' });
      const conflict = createConflict({
        localTimestamp: Date.now() - 1000,
        serverTimestamp: Date.now(),
      });

      const resolution = await resolver.resolve(conflict);

      expect(resolution.resolved).toEqual(conflict.server);
    });
  });

  describe('per-collection strategy', () => {
    it('should use collection-specific strategy', async () => {
      const resolver = new ConflictResolver({
        default: 'local-wins',
        perCollection: {
          users: 'server-wins',
        },
      });

      const usersConflict = createConflict({ collection: 'users' });
      const postsConflict = createConflict({ collection: 'posts' });

      const usersResolution = await resolver.resolve(usersConflict);
      const postsResolution = await resolver.resolve(postsConflict);

      expect(usersResolution.strategy).toBe('server-wins');
      expect(postsResolution.strategy).toBe('local-wins');
    });
  });

  describe('manual strategy', () => {
    it('should emit conflict event for manual resolution', async () => {
      const resolver = new ConflictResolver({ default: 'manual' });
      const conflict = createConflict();

      const handler = vi.fn();
      resolver.onConflict(handler);

      // Start resolution (will wait for manual choice)
      const resolutionPromise = resolver.resolve(conflict);

      // Handler should be called
      expect(handler).toHaveBeenCalledTimes(1);
      const event = handler.mock.calls[0][0];
      expect(event.conflict).toEqual(conflict);

      // Resolve manually with local
      event.resolve('local');

      const resolution = await resolutionPromise;
      expect(resolution.strategy).toBe('local-wins');
      expect(resolution.manual).toBe(true);
    });

    it('should resolve with custom data', async () => {
      const resolver = new ConflictResolver({ default: 'manual' });
      const conflict = createConflict();

      const handler = vi.fn();
      resolver.onConflict(handler);

      const resolutionPromise = resolver.resolve(conflict);
      const event = handler.mock.calls[0][0];

      // Resolve with custom merged data
      event.resolve({ id: 1, name: 'Merged', version: 3 });

      const resolution = await resolutionPromise;
      expect(resolution.strategy).toBe('custom');
      expect(resolution.resolved.name).toBe('Merged');
    });

    it('should reject conflict', async () => {
      const resolver = new ConflictResolver({ default: 'manual' });
      const conflict = createConflict();

      const handler = vi.fn();
      resolver.onConflict(handler);

      const resolutionPromise = resolver.resolve(conflict);
      const event = handler.mock.calls[0][0];

      event.reject();

      await expect(resolutionPromise).rejects.toThrow('Conflict rejected');
    });
  });

  describe('custom resolver', () => {
    it('should use custom resolver function', async () => {
      const customResolver = vi.fn((local, server) => ({
        ...local,
        ...server,
        merged: true,
      }));

      const resolver = new ConflictResolver({
        default: 'custom',
        customResolver,
      });

      const conflict = createConflict();
      const resolution = await resolver.resolve(conflict);

      expect(customResolver).toHaveBeenCalledWith(conflict.local, conflict.server);
      expect(resolution.strategy).toBe('custom');
      expect(resolution.resolved.merged).toBe(true);
    });
  });

  describe('pending conflicts', () => {
    it('should track pending conflicts', async () => {
      const resolver = new ConflictResolver({ default: 'manual' });
      const conflict = createConflict();

      const handler = vi.fn();
      resolver.onConflict(handler);

      resolver.resolve(conflict);

      const pending = resolver.getPendingConflicts();
      expect(pending).toHaveLength(1);
      expect(pending[0].id).toBe(1);
    });

    it('should clear pending conflicts after resolution', async () => {
      const resolver = new ConflictResolver({ default: 'manual' });
      const conflict = createConflict();

      const handler = vi.fn();
      resolver.onConflict(handler);

      const resolutionPromise = resolver.resolve(conflict);
      const event = handler.mock.calls[0][0];
      event.resolve('local');
      await resolutionPromise;

      const pending = resolver.getPendingConflicts();
      expect(pending).toHaveLength(0);
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const resolver = new ConflictResolver({ default: 'local-wins' });
      resolver.configure({ default: 'server-wins' });

      expect(resolver['config'].default).toBe('server-wins');
    });
  });
});
