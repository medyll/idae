/**
 * Health Check & Status API for Qoolie
 */

import type { SyncStatus } from './types.js';

/**
 * Health status for Qoolie instance
 */
export interface HealthStatus {
  /** IndexedDB connection status */
  indexeddb: 'connected' | 'disconnected' | 'error';
  /** Sync status */
  sync: 'running' | 'paused' | 'disabled' | 'error';
  /** Sync queue length */
  queueLength: number;
  /** Dead letter queue length */
  dlqLength: number;
  /** Collections stats */
  collections: Record<string, CollectionStats>;
  /** Timestamp */
  timestamp: number;
}

/**
 * Statistics for a single collection
 */
export interface CollectionStats {
  /** Number of documents */
  count: number;
  /** Estimated size in bytes */
  size?: number;
  /** Last modified timestamp */
  lastModified?: number;
}

/**
 * Get health status for a Qoolie instance
 * 
 * @param qoolie - Qoolie instance
 * @returns Health status
 */
export async function getHealthStatus(qoolie: any): Promise<HealthStatus> {
  const status: HealthStatus = {
    indexeddb: 'connected',
    sync: 'disabled',
    queueLength: 0,
    dlqLength: 0,
    collections: {},
    timestamp: Date.now(),
  };

  // Check IndexedDB connection
  try {
    const db = await openDatabase(qoolie.dbName);
    if (db) {
      status.indexeddb = 'connected';
      
      // Get collection stats
      const collections = Array.from(db.objectStoreNames);
      for (const collectionName of collections) {
        try {
          const tx = db.transaction(collectionName, 'readonly');
          const store = tx.objectStore(collectionName);
          const count = await getCount(store);
          
          status.collections[collectionName] = {
            count,
          };
        } catch (error) {
          console.warn(`Failed to get stats for collection ${collectionName}:`, error);
        }
      }
      
      db.close();
    } else {
      status.indexeddb = 'disconnected';
    }
  } catch (error) {
    status.indexeddb = 'error';
    console.error('Failed to check IndexedDB connection:', error);
  }

  // Check sync status
  try {
    if (qoolie.sync) {
      const syncStatus = await qoolie.sync.getStatus();
      status.sync = syncStatus.running ? 'running' : 'paused';
      status.queueLength = syncStatus.queueLength;
      status.dlqLength = syncStatus.dlqLength;
    }
  } catch (error) {
    status.sync = 'error';
    console.error('Failed to get sync status:', error);
  }

  return status;
}

/**
 * Get statistics for a single collection
 * 
 * @param qoolie - Qoolie instance
 * @param collectionName - Collection name
 * @returns Collection statistics
 */
export async function getCollectionStats(
  qoolie: any,
  collectionName: string
): Promise<CollectionStats> {
  const stats: CollectionStats = {
    count: 0,
  };

  try {
    const db = await openDatabase(qoolie.dbName);
    if (!db) {
      throw new Error('Database not found');
    }

    if (!db.objectStoreNames.contains(collectionName)) {
      throw new Error(`Collection ${collectionName} not found`);
    }

    const tx = db.transaction(collectionName, 'readonly');
    const store = tx.objectStore(collectionName);
    
    // Get count
    stats.count = await getCount(store);
    
    // Get last modified (if available)
    try {
      const all = await getAll(store);
      if (all.length > 0) {
        const lastItem = all[all.length - 1];
        stats.lastModified = lastItem.updatedAt || lastItem.createdAt || Date.now();
        
        // Estimate size
        stats.size = new TextEncoder().encode(JSON.stringify(all)).length;
      }
    } catch (error) {
      console.warn('Failed to estimate collection size:', error);
    }

    db.close();
  } catch (error) {
    console.error('Failed to get collection stats:', error);
  }

  return stats;
}

/**
 * Open IndexedDB database
 */
function openDatabase(dbName: string): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      resolve(null);
    };
    
    request.onblocked = () => {
      resolve(null);
    };
  });
}

/**
 * Get count from object store
 */
function getCount(store: IDBObjectStore): Promise<number> {
  return new Promise((resolve, reject) => {
    const request = store.count();
    request.onsuccess = () => resolve(request.result as number);
    request.onerror = reject;
  });
}

/**
 * Get all from object store
 */
function getAll(store: IDBObjectStore): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as any[]);
    request.onerror = reject;
  });
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
