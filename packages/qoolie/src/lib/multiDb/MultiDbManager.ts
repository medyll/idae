/**
 * Multi-Database Manager
 */

import { createQoolie } from '../Qoolie.js';
import type { MultiDbConfig, DbInfo } from './types.js';

/**
 * MultiDbManager - manages multiple qoolie databases
 */
export class MultiDbManager<T extends Record<string, any>> {
  private config: MultiDbConfig<T>;
  private instances: Map<string, ReturnType<typeof createQoolie<T>>> = new Map();
  private currentId: string | null = null;
  private metadata: Map<string, DbInfo> = new Map();

  constructor(config: MultiDbConfig<T>) {
    this.config = config;
  }

  /**
   * Get or create a qoolie instance for a specific ID
   */
  get(id: string): ReturnType<typeof createQoolie<T>> {
    if (!this.instances.has(id)) {
      const dbName = this.config.dbNamePattern.replace('{id}', id);
      const instance = createQoolie({
        dbName,
        collections: this.config.collections,
        sync: this.config.sync,
      });

      this.instances.set(id, instance);
      this.metadata.set(id, {
        name: dbName,
        version: 1,
        createdAt: Date.now(),
      });

      if (!this.currentId) {
        this.currentId = id;
      }
    }

    return this.instances.get(id)!;
  }

  /**
   * Switch to a specific database
   */
  switchTo(id: string): ReturnType<typeof createQoolie<T>> {
    this.currentId = id;
    return this.get(id);
  }

  /**
   * Get the current qoolie instance
   */
  getCurrent(): ReturnType<typeof createQoolie<T>> | null {
    if (!this.currentId) {
      return null;
    }
    return this.get(this.currentId);
  }

  /**
   * List all database IDs
   */
  list(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * Get database info
   */
  getInfo(id: string): DbInfo | undefined {
    return this.metadata.get(id);
  }

  /**
   * Delete a database
   */
  async delete(id: string): Promise<void> {
    const instance = this.instances.get(id);
    if (instance) {
      instance.destroy();
      this.instances.delete(id);
      this.metadata.delete(id);

      if (this.currentId === id) {
        this.currentId = this.instances.keys().next().value ?? null;
      }
    }

    // Delete IndexedDB
    const dbName = this.config.dbNamePattern.replace('{id}', id);
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete all databases
   */
  async deleteAll(): Promise<void> {
    const ids = this.list();
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  /**
   * Destroy all instances
   */
  destroy(): void {
    this.instances.forEach((instance) => instance.destroy());
    this.instances.clear();
    this.metadata.clear();
    this.currentId = null;
  }
}

/**
 * Create a multi-database qoolie manager
 */
export function createMultiDbQoolie<T extends Record<string, any>>(
  config: MultiDbConfig<T>
): MultiDbManager<T> {
  return new MultiDbManager<T>(config);
}
