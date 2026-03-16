import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SyncModeManager } from '../src/lib/SyncModeManager';

describe('SyncModeManager persistence', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    // Mock localStorage
    (global as any).window = {
      localStorage: {
        getItem: (k: string) => store[k] ?? null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
      },
      sessionStorage: {
        getItem: (k: string) => store[`ss:${k}`] ?? null,
        setItem: (k: string, v: string) => { store[`ss:${k}`] = v; },
        removeItem: (k: string) => { delete store[`ss:${k}`]; },
      },
    };
  });

  afterEach(() => {
    delete (global as any).window;
  });

  it('persist: none — does not write to storage', () => {
    const mgr = new SyncModeManager({ mode: 'server-first', persist: 'none' });
    mgr.setGlobal('mobile-first');
    expect(Object.keys(store).length).toBe(0);
  });

  it('persist: localStorage — saves and reloads mode', () => {
    const mgr1 = new SyncModeManager({ persist: 'localStorage' });
    mgr1.setGlobal('server-first');
    mgr1.setCollection('drafts', 'mobile-first');

    // New instance reads from storage
    const mgr2 = new SyncModeManager({ persist: 'localStorage' });
    expect(mgr2.getGlobal()).toBe('server-first');
    expect(mgr2.getCollection('drafts')).toBe('mobile-first');
  });

  it('config overrides persisted state', () => {
    const mgr1 = new SyncModeManager({ persist: 'localStorage' });
    mgr1.setGlobal('server-first');

    // New instance with explicit config overrides persisted
    const mgr2 = new SyncModeManager({ mode: 'mobile-first', persist: 'localStorage' });
    expect(mgr2.getGlobal()).toBe('mobile-first');
  });

  it('clearPersisted() removes storage entry', () => {
    const mgr = new SyncModeManager({ persist: 'localStorage' });
    mgr.setGlobal('server-first');
    expect(Object.keys(store).length).toBeGreaterThan(0);
    mgr.clearPersisted();
    expect(Object.keys(store).length).toBe(0);
  });

  it('works without window (Node/SSR) — no crash', () => {
    // window not defined
    delete (global as any).window;
    const mgr = new SyncModeManager({ mode: 'server-first', persist: 'localStorage' });
    mgr.setGlobal('mobile-first');
    expect(mgr.getGlobal()).toBe('mobile-first'); // works, just no persistence
  });
});
