import type { QooliePlugin, PluginManager as PluginManagerInterface } from './types.js';

/**
 * PluginManager - manages plugin lifecycle
 */
export class PluginManager implements PluginManagerInterface {
  private plugins: Map<string, QooliePlugin> = new Map();

  /**
   * Register a plugin
   */
  register(plugin: QooliePlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered`);
    }
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Get registered plugin by name
   */
  get(name: string): QooliePlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins
   */
  getAll(): QooliePlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Unregister a plugin
   */
  unregister(name: string): void {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.destroy?.();
      this.plugins.delete(name);
    }
  }

  /**
   * Initialize all plugins
   */
  async init(qoolie: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.init?.(qoolie);
        console.log(`[Plugin] Initialized: ${plugin.name}`);
      } catch (error) {
        console.error(`[Plugin] Failed to initialize ${plugin.name}:`, error);
      }
    }
  }

  /**
   * Destroy all plugins
   */
  async destroy(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.destroy?.();
        console.log(`[Plugin] Destroyed: ${plugin.name}`);
      } catch (error) {
        console.error(`[Plugin] Failed to destroy ${plugin.name}:`, error);
      }
    }
    this.plugins.clear();
  }

  /**
   * Get custom deliverer from first plugin that provides one
   */
  getCustomDeliverer(): any {
    for (const plugin of this.plugins.values()) {
      if (plugin.deliverer) {
        return plugin.deliverer;
      }
    }
    return null;
  }

  /**
   * Run beforeSync hooks from all plugins
   */
  async runBeforeSync(entry: any): Promise<any> {
    let result = entry;
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.beforeSync) {
        try {
          result = await plugin.hooks.beforeSync(result);
        } catch (error) {
          console.error(`[Plugin] beforeSync hook error in ${plugin.name}:`, error);
        }
      }
    }
    return result;
  }

  /**
   * Run afterSync hooks from all plugins
   */
  async runAfterSync(result: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.afterSync) {
        try {
          await plugin.hooks.afterSync(result);
        } catch (error) {
          console.error(`[Plugin] afterSync hook error in ${plugin.name}:`, error);
        }
      }
    }
  }

  /**
   * Run onError hooks from all plugins
   */
  async runOnError(error: unknown, entry: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.onError) {
        try {
          await plugin.hooks.onError(error, entry);
        } catch (hookError) {
          console.error(`[Plugin] onError hook error in ${plugin.name}:`, hookError);
        }
      }
    }
  }

  /**
   * Run onServerChange hooks from all plugins
   */
  async runOnServerChange(change: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.onServerChange) {
        try {
          await plugin.hooks.onServerChange(change);
        } catch (error) {
          console.error(`[Plugin] onServerChange hook error in ${plugin.name}:`, error);
        }
      }
    }
  }

  /**
   * Run onSyncEvent hooks from all plugins
   */
  async runOnSyncEvent(event: any): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.onSyncEvent) {
        try {
          await plugin.hooks.onSyncEvent(event);
        } catch (error) {
          console.error(`[Plugin] onSyncEvent hook error in ${plugin.name}:`, error);
        }
      }
    }
  }
}
