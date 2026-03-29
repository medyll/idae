import { describe, it, expect, beforeEach } from 'vitest';
import { getHealthStatus, getCollectionStats, formatBytes } from './health.js';

// Mock qoolie instance
function createMockQoolie() {
  return {
    dbName: 'test-health-db',
    sync: {
      getStatus: async () => ({
        running: true,
        queueLength: 5,
        dlqLength: 2,
      }),
    },
    collection: {
      users: {
        getAll: async () => [{ id: 1, name: 'Alice' }],
      },
    },
  };
}

describe('Health Check API', () => {
  describe('formatBytes', () => {
    it('should format zero bytes', () => {
      expect(formatBytes(0)).toBe('0 B');
    });

    it('should format bytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
    });

    it('should format kilobytes', () => {
      expect(formatBytes(2048)).toBe('2 KB');
    });

    it('should format megabytes', () => {
      expect(formatBytes(1048576)).toBe('1 MB');
    });

    it('should format gigabytes', () => {
      expect(formatBytes(1073741824)).toBe('1 GB');
    });
  });

  describe('getHealthStatus', () => {
    it('should return health status object', async () => {
      const mockQoolie = createMockQoolie();
      const status = await getHealthStatus(mockQoolie);

      expect(status).toHaveProperty('indexeddb');
      expect(status).toHaveProperty('sync');
      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('dlqLength');
      expect(status).toHaveProperty('collections');
      expect(status).toHaveProperty('timestamp');
    });

    it('should report sync status correctly', async () => {
      const mockQoolie = createMockQoolie();
      const status = await getHealthStatus(mockQoolie);

      expect(status.sync).toBe('running');
      expect(status.queueLength).toBe(5);
      expect(status.dlqLength).toBe(2);
    });

    it('should handle missing sync', async () => {
      const mockQoolie = { dbName: 'test-db' };
      const status = await getHealthStatus(mockQoolie as any);

      expect(status.sync).toBe('disabled');
    });
  });

  describe('getCollectionStats', () => {
    it('should return collection stats', async () => {
      const mockQoolie = createMockQoolie();
      const stats = await getCollectionStats(mockQoolie, 'users');

      expect(stats).toHaveProperty('count');
    });

    it('should handle non-existent collection gracefully', async () => {
      const mockQoolie = createMockQoolie();
      const stats = await getCollectionStats(mockQoolie, 'nonexistent');

      expect(stats.count).toBe(0);
    });
  });
});
