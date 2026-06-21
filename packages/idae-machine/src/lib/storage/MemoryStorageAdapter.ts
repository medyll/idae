/**
 * Memory Storage Adapter for Qoolie
 * 
 * In-memory storage implementation for online-only mode.
 * Provides a simple key-value store with event system for reactivity.
 */

import type { StorageAdapter } from './StorageAdapter.js';

export class MemoryStorageAdapter<T = any> implements StorageAdapter<T> {
  private _state: Map<string, T> = new Map();
  private _listeners: Map<string, ((data: any) => void)[]> = new Map();
  private _nextId = 1;

  constructor() {
    // Initialize with empty state
    this._state = new Map();
    this._listeners = new Map();
  }

  getMode(): string {
    return 'memory';
  }

  async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
    // Generate ID if not provided
    const id = data.id ?? String(this._nextId++);
    const record = { ...data, id } as T;
    
    this._state.set(id, record);
    this._emit('create', record);
    this._emit('change', { type: 'change' });
    
    return record;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const existing = this._state.get(id);
    if (!existing) {
      throw new Error(`Record with id ${id} not found`);
    }

    const updated = { ...existing, ...data };
    this._state.set(id, updated);
    this._emit('update', updated);
    this._emit('change', { type: 'change' });
    
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const hadRecord = this._state.has(id);
    if (hadRecord) {
      this._state.delete(id);
      this._emit('delete', { id });
      this._emit('change', { type: 'change' });
    }
    return hadRecord;
  }

  async get(id: string): Promise<T | undefined> {
    return this._state.get(id);
  }

  getAll(): T[] {
    return Array.from(this._state.values());
  }

  where(query: Record<string, any>): T[] {
    const records = this.getAll();
    
    return records.filter(record => {
      return Object.entries(query).every(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle query operators like { age: { $gt: 18 } }
          const [operator, operand] = Object.entries(value)[0] || [];
          const fieldValue = (record as any)[key];
          
          switch (operator) {
            case '$eq': return fieldValue === operand;
            case '$ne': return fieldValue !== operand;
            case '$gt': return fieldValue > (operand as any);
            case '$gte': return fieldValue >= (operand as any);
            case '$lt': return fieldValue < (operand as any);
            case '$lte': return fieldValue <= (operand as any);
            case '$in': return Array.isArray(operand) && operand.includes(fieldValue as any);
            case '$nin': return !Array.isArray(operand) || !operand.includes(fieldValue as any);
            case '$like': 
              if (typeof fieldValue === 'string' && typeof operand === 'string') {
                const regex = new RegExp(operand.replace(/%/g, '.*'), 'i');
                return regex.test(fieldValue);
              }
              return false;
            case '$regex':
              if (typeof fieldValue === 'string' && operand instanceof RegExp) {
                return operand.test(fieldValue);
              }
              return false;
            default: return fieldValue === value;
          }
        } else {
          // Simple equality check
          return (record as any)[key] === value;
        }
      });
    });
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
   * Clear all data from memory storage
   */
  clear(): void {
    this._state.clear();
    this._nextId = 1;
    this._emit('clear', {});
    this._emit('change', { type: 'change' });
  }

  /**
   * Get current record count
   */
  get size(): number {
    return this._state.size;
  }

  private _emit(event: string, data: any): void {
    this._listeners.get(event)?.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`[MemoryStorageAdapter] Error in ${event} listener:`, error);
      }
    });
  }
}