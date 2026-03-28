import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { autoDetectBaseUrl } from './utils/autoDetectBaseUrl.js';
import { normalizeConfig } from './utils/normalizeConfig.js';
import type { QoolieOptions } from './types.js';

describe('autoDetectBaseUrl', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // @ts-expect-error - test cleanup
    delete global.window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should return undefined when no environment is available', () => {
    expect(autoDetectBaseUrl()).toBeUndefined();
  });

  it('should return window.location.origin in browser', () => {
    global.window = { location: { origin: 'https://app.example.com' } } as any;
    expect(autoDetectBaseUrl()).toBe('https://app.example.com');
  });

  it('should return undefined for file:// protocol', () => {
    global.window = { location: { origin: 'file:///path/to/file.html' } } as any;
    expect(autoDetectBaseUrl()).toBeUndefined();
  });

  it('should return undefined for null origin', () => {
    global.window = { location: { origin: 'null' } } as any;
    expect(autoDetectBaseUrl()).toBeUndefined();
  });
});

describe('normalizeConfig', () => {
  it('should normalize basic config', () => {
    const options: QoolieOptions<any> = {
      dbName: 'test-db',
      collections: {
        users: { keyPath: 'id' },
      },
    };

    const normalized = normalizeConfig(options);

    expect(normalized.dbName).toBe('test-db');
    expect(normalized.dbVersion).toBe(1);
    expect(normalized.syncEnabled).toBe(true);
    expect(normalized.collections).toHaveLength(1);
    expect(normalized.collections[0].name).toBe('users');
    expect(normalized.collections[0].syncEnabled).toBe(true);
  });

  it('should throw error if dbName is missing', () => {
    const options = { collections: { users: { keyPath: 'id' } } } as any;
    expect(() => normalizeConfig(options)).toThrow('dbName is required');
  });

  it('should throw error if collections is missing', () => {
    const options = { dbName: 'test' } as any;
    expect(() => normalizeConfig(options)).toThrow('collections is required');
  });

  it('should throw error if keyPath is invalid', () => {
    const options = {
      dbName: 'test',
      collections: { users: { keyPath: '' } },
    } as any;
    expect(() => normalizeConfig(options)).toThrow('keyPath must be a non-empty string');
  });

  it('should disable sync globally when sync: false', () => {
    const options: QoolieOptions<any> = {
      dbName: 'test-db',
      sync: false,
      collections: {
        users: { keyPath: 'id', sync: true },
      },
    };

    const normalized = normalizeConfig(options);

    expect(normalized.syncEnabled).toBe(false);
    expect(normalized.syncConfig).toBeNull();
    expect(normalized.collections[0].syncEnabled).toBe(false);
  });

  it('should disable sync per collection', () => {
    const options: QoolieOptions<any> = {
      dbName: 'test-db',
      sync: { mode: 'mobile-first' },
      collections: {
        users: { keyPath: 'id', sync: true },
        drafts: { keyPath: 'id', sync: false },
      },
    };

    const normalized = normalizeConfig(options);

    expect(normalized.collections[0].syncEnabled).toBe(true);
    expect(normalized.collections[1].syncEnabled).toBe(false);
  });

  it('should merge per-collection sync config with global', () => {
    const options: QoolieOptions<any> = {
      dbName: 'test-db',
      sync: { mode: 'mobile-first', intervalMs: 5000 },
      collections: {
        users: { keyPath: 'id' },
        orders: { keyPath: 'id', sync: { mode: 'server-first' } },
      },
    };

    const normalized = normalizeConfig(options);

    expect(normalized.collections[0].syncConfig?.mode).toBe('mobile-first');
    expect(normalized.collections[1].syncConfig?.mode).toBe('server-first');
    expect(normalized.collections[1].syncConfig?.intervalMs).toBe(5000);
  });

  it('should set default sync config values', () => {
    const options: QoolieOptions<any> = {
      dbName: 'test-db',
      sync: {},
      collections: {
        users: { keyPath: 'id' },
      },
    };

    const normalized = normalizeConfig(options);

    expect(normalized.syncConfig?.mode).toBe('mobile-first');
    expect(normalized.syncConfig?.intervalMs).toBe(5000);
    expect(normalized.syncConfig?.maxRetries).toBe(10);
    expect(normalized.syncConfig?.circuitBreaker).toEqual({
      failureThreshold: 5,
      resetTimeoutMs: 30000,
    });
  });

  it('should throw error if no collections defined', () => {
    const options = { dbName: 'test', collections: {} } as any;
    expect(() => normalizeConfig(options)).toThrow('At least one collection must be defined');
  });
});
