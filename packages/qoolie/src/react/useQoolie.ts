import { useState, useEffect, useCallback } from 'react';
import type { QoolieInstance, CollectionConfigMap, QoolieOptions } from './types.js';
import { createQoolie } from '../lib/Qoolie.js';

// Global qoolie instance for singleton pattern
let globalQoolieInstance: QoolieInstance<any> | null = null;

/**
 * React hook to get or create a Qoolie instance
 * 
 * @param options - Qoolie configuration (only used on first call)
 * @returns Qoolie instance
 * 
 * @example
 * ```tsx
 * function App() {
 *   const qoolie = useQoolie({
 *     dbName: 'my-app',
 *     sync: { enabled: true, token: '...' },
 *     collections: { users: { keyPath: 'id' } },
 *   });
 * 
 *   return <UsersList qoolie={qoolie} />;
 * }
 * ```
 */
export function useQoolie<T extends CollectionConfigMap>(
  options?: QoolieOptions<T>
): QoolieInstance<T> {
  // Initialize qoolie instance once
  if (!globalQoolieInstance && options) {
    globalQoolieInstance = createQoolie(options);
  }

  if (!globalQoolieInstance) {
    throw new Error(
      'Qoolie instance not initialized. Call useQoolie() with options first, or initialize qoolie elsewhere in your app.'
    );
  }

  const qoolie = globalQoolieInstance as QoolieInstance<T>;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: uncomment to auto-destroy on unmount
      // qoolie.destroy();
      // globalQoolieInstance = null;
    };
  }, []);

  return qoolie;
}

/**
 * Get the current qoolie instance without initializing
 * @returns Qoolie instance or null if not initialized
 */
export function getQoolie<T extends CollectionConfigMap>(): QoolieInstance<T> | null {
  return globalQoolieInstance as QoolieInstance<T> | null;
}

/**
 * Destroy the global qoolie instance
 */
export function destroyQoolie(): void {
  if (globalQoolieInstance) {
    globalQoolieInstance.destroy();
    globalQoolieInstance = null;
  }
}
