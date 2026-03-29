import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PluginManager } from './PluginManager';
import { definePlugin } from './definePlugin';

describe('PluginManager', () => {
  let manager: PluginManager;

  beforeEach(() => {
    manager = new PluginManager();
  });

  it('should create a PluginManager instance', () => {
    expect(manager).toBeInstanceOf(PluginManager);
  });

  it('should register a plugin', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
      version: '1.0.0',
    });

    manager.register(plugin);
    expect(manager.get('test-plugin')).toBe(plugin);
  });

  it('should throw error when registering duplicate plugin', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
    });

    manager.register(plugin);
    expect(() => manager.register(plugin)).toThrow('already registered');
  });

  it('should unregister a plugin', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
    });

    manager.register(plugin);
    manager.unregister('test-plugin');
    expect(manager.get('test-plugin')).toBeUndefined();
  });

  it('should get all plugins', () => {
    const plugin1 = definePlugin({ name: 'plugin-1' });
    const plugin2 = definePlugin({ name: 'plugin-2' });

    manager.register(plugin1);
    manager.register(plugin2);

    expect(manager.getAll()).toHaveLength(2);
  });

  it('should initialize plugins', async () => {
    const initFn = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      init: initFn,
    });

    manager.register(plugin);
    await manager.init({});

    expect(initFn).toHaveBeenCalledWith({});
  });

  it('should destroy plugins', async () => {
    const destroyFn = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      destroy: destroyFn,
    });

    manager.register(plugin);
    await manager.destroy();

    expect(destroyFn).toHaveBeenCalled();
    expect(manager.getAll()).toHaveLength(0);
  });

  it('should run beforeSync hooks', async () => {
    const beforeSync = vi.fn((entry) => ({ ...entry, modified: true }));
    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: { beforeSync },
    });

    manager.register(plugin);
    const result = await manager.runBeforeSync({ id: 1 });

    expect(result).toEqual({ id: 1, modified: true });
  });

  it('should run afterSync hooks', async () => {
    const afterSync = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: { afterSync },
    });

    manager.register(plugin);
    await manager.runAfterSync({ success: true });

    expect(afterSync).toHaveBeenCalledWith({ success: true });
  });

  it('should run onError hooks', async () => {
    const onError = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: { onError },
    });

    manager.register(plugin);
    const error = new Error('test error');
    await manager.runOnError(error, { id: 1 });

    expect(onError).toHaveBeenCalledWith(error, { id: 1 });
  });

  it('should run onServerChange hooks', async () => {
    const onServerChange = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: { onServerChange },
    });

    manager.register(plugin);
    await manager.runOnServerChange({ type: 'create', collection: 'users' });

    expect(onServerChange).toHaveBeenCalledWith({ type: 'create', collection: 'users' });
  });

  it('should run onSyncEvent hooks', async () => {
    const onSyncEvent = vi.fn();
    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: { onSyncEvent },
    });

    manager.register(plugin);
    await manager.runOnSyncEvent({ type: 'delivered' });

    expect(onSyncEvent).toHaveBeenCalledWith({ type: 'delivered' });
  });

  it('should get custom deliverer from plugin', () => {
    const deliverer = { deliver: vi.fn() };
    const plugin = definePlugin({
      name: 'test-plugin',
      deliverer,
    });

    manager.register(plugin);
    expect(manager.getCustomDeliverer()).toBe(deliverer);
  });

  it('should handle hook errors gracefully', async () => {
    const consoleError = console.error;
    console.error = vi.fn();

    const plugin = definePlugin({
      name: 'test-plugin',
      hooks: {
        beforeSync: () => {
          throw new Error('hook error');
        },
      },
    });

    manager.register(plugin);
    await manager.runBeforeSync({ id: 1 });

    expect(console.error).toHaveBeenCalled();
    console.error = consoleError;
  });
});
