/**
 * Storage Adapter Interface for Qoolie Multi-Mode Architecture
 * 
 * This interface defines the contract that all storage adapters must implement
 * to support different storage modes (online-only, local-only, offline-first).
 */

export interface StorageAdapter<T = any> {
  /**
   * Create a new record in the storage
   * @param data - The data to create
   * @returns Promise resolving to the created record (with generated ID)
   */
  create(data: Omit<T, 'id'> & { id?: string }): Promise<T>;

  /**
   * Update an existing record
   * @param id - The ID of the record to update
   * @param data - Partial data to update
   * @returns Promise resolving to the updated record
   */
  update(id: string, data: Partial<T>): Promise<T>;

  /**
   * Delete a record
   * @param id - The ID of the record to delete
   * @returns Promise resolving to true if successful, false otherwise
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get a single record by ID
   * @param id - The ID of the record to retrieve
   * @returns Promise resolving to the record or undefined if not found
   */
  get(id: string): Promise<T | undefined>;

  /**
   * Get all records
   * @returns Array of all records
   */
  getAll(): T[];

  /**
   * Query records with conditions
   * @param query - Query object (e.g., { status: 'active', age: { $gt: 18 } })
   * @returns Array of matching records
   */
  where(query: Record<string, any>): T[];

  /**
   * Subscribe to storage events
   * @param event - Event name ('create', 'update', 'delete', 'change')
   * @param listener - Callback function
   */
  on(event: string, listener: (data: any) => void): void;

  /**
   * Unsubscribe from storage events
   * @param event - Event name
   * @param listener - Callback function to remove
   */
  off(event: string, listener: (data: any) => void): void;

  /**
   * Get the current storage mode
   * @returns The storage mode identifier
   */
  getMode(): string;
}

/**
 * Query operators supported by the where method
 */
export type QueryOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte' | '$in' | '$nin' | '$like' | '$regex';

/**
 * Query condition type
 */
export type QueryCondition<T = any> = 
  | { [K in keyof T]?: T[K] | { [Op in QueryOperator]?: T[K] } }
  | Record<string, any>;