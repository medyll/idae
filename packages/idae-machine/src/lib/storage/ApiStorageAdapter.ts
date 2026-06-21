/**
 * API Storage Adapter for Qoolie
 * 
 * Online-only storage implementation that uses a remote API for all operations.
 * Includes local memory cache for reactivity and performance.
 */

import type { StorageAdapter } from './StorageAdapter.js';

/**
 * Minimal API client interface required by ApiStorageAdapter
 */
export interface ApiClient {
  get: (collection: string, id: string) => Promise<any>;
  create: (collection: string, data: any) => Promise<any>;
  update: (collection: string, id: string, data: any) => Promise<any>;
  delete: (collection: string, id: string) => Promise<any>;
  query: (collection: string, query: any) => Promise<any[]>;
}

export class ApiStorageAdapter<T = any> implements StorageAdapter<T> {
  private _state: Map<string, T> = new Map();
  private _listeners: Map<string, ((data: any) => void)[]> = new Map();
  private _collectionName: string;

  constructor(private _apiClient: ApiClient, collectionName: string) {
    this._collectionName = collectionName;
    this._state = new Map();
    this._listeners = new Map();
  }

  getMode(): string {
    return 'online-only';
  }

  async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
    const result = await this._apiClient.create(this._collectionName, data);
    this._state.set(result.id, result);
    this._emit('create', result);
    this._emit('change', { type: 'change' });
    return result;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const result = await this._apiClient.update(this._collectionName, id, data);
    this._state.set(id, result);
    this._emit('update', result);
    this._emit('change', { type: 'change' });
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const success = await this._apiClient.delete(this._collectionName, id);
    if (success) {
      this._state.delete(id);
      this._emit('delete', { id });
      this._emit('change', { type: 'change' });
    }
    return success;
  }

  async get(id: string): Promise<T | undefined> {
    // Try cache first
    const cached = this._state.get(id);
    if (cached) return cached;
    
    // Fetch from API if not in cache
    const result = await this._apiClient.get(this._collectionName, id);
    if (result) {
      this._state.set(id, result);
    }
    return result;
  }

  getAll(): T[] {
    // Return cached values only
    // For full sync, use query({}) 
    return Array.from(this._state.values());
  }

  where(query: Record<string, any>): T[] {
    // For simple queries, check cache first
    const cachedResults = this._filterCache(query);
    if (cachedResults.length > 0) {
      return cachedResults;
    }
    
    // If no cached results, query the API
    // Note: This is a simplified approach - real implementation would need
    // to handle pagination, caching strategies, etc.
    return []; // Placeholder - would call API in full implementation
  }

  on(event: string, listener: (data: any) => void): void {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event)?.push(listener);
  }

  off(event: string, listener: (data: any) => void): void {
    const listeners = this._listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Clear local cache
   */
  clearCache(): void {
    this._state.clear();
    this._emit('cache-cleared', {});
  }

  private _filterCache(query: Record<string, any>): T[] {
    return Array.from(this._state.values()).filter(record => {
      return Object.entries(query).every(([key, value]) => {
        return (record as any)[key] === value;
      });
    });
  }

  private _emit(event: string, data: any): void {
    this._listeners.get(event)?.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`[ApiStorageAdapter] Error in ${event} listener:`, error);
      }
    });
  }
}