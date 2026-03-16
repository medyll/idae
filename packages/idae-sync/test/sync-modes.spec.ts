import { describe, it, expect } from 'vitest';
import { SyncModeManager } from '../src/lib/SyncModeManager';

describe('SyncModeManager', () => {
  it('defaults to mobile-first', () => {
    const mgr = new SyncModeManager();
    expect(mgr.getGlobal()).toBe('mobile-first');
    expect(mgr.resolve('anything')).toBe('mobile-first');
  });

  it('respects global mode from config', () => {
    const mgr = new SyncModeManager({ mode: 'server-first' });
    expect(mgr.getGlobal()).toBe('server-first');
    expect(mgr.resolve('users')).toBe('server-first');
  });

  it('respects per-collection overrides', () => {
    const mgr = new SyncModeManager({
      mode: 'server-first',
      collectionModes: { drafts: 'mobile-first' },
    });
    expect(mgr.resolve('drafts')).toBe('mobile-first');
    expect(mgr.resolve('orders')).toBe('server-first');
  });

  it('setGlobal changes the global mode', () => {
    const mgr = new SyncModeManager();
    mgr.setGlobal('server-first');
    expect(mgr.getGlobal()).toBe('server-first');
    expect(mgr.resolve('any')).toBe('server-first');
  });

  it('setCollection adds per-collection override', () => {
    const mgr = new SyncModeManager({ mode: 'mobile-first' });
    mgr.setCollection('orders', 'server-first');
    expect(mgr.resolve('orders')).toBe('server-first');
    expect(mgr.resolve('drafts')).toBe('mobile-first');
  });

  it('getCollection returns resolved mode (inherits global)', () => {
    const mgr = new SyncModeManager({ mode: 'server-first' });
    expect(mgr.getCollection('users')).toBe('server-first');
    mgr.setCollection('users', 'mobile-first');
    expect(mgr.getCollection('users')).toBe('mobile-first');
  });
});
