/**
 * Import Database
 */

import type { ExportData, ImportOptions, ImportResult } from './types.js';

/**
 * Import data from export object
 */
export async function importDatabase(
  qoolie: any,
  data: ExportData,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const { strategy = 'merge', onProgress } = options;
  const result: ImportResult = { imported: 0, skipped: 0, errors: 0 };

  const db = await openDatabase(qoolie.dbName);
  if (!db) {
    throw new Error(`Database ${qoolie.dbName} not found`);
  }

  const collections = Object.keys(data.collections);
  const total = collections.length;

  for (let i = 0; i < collections.length; i++) {
    const collectionName = collections[i];
    const items = data.collections[collectionName];

    if (!db.objectStoreNames.contains(collectionName)) {
      console.warn(`Collection ${collectionName} not found, skipping`);
      result.errors++;
      continue;
    }

    const tx = db.transaction(collectionName, 'readwrite');
    const store = tx.objectStore(collectionName);

    for (const item of items) {
      try {
        if (strategy === 'skip-existing') {
          const existing = await get(store, item.id);
          if (existing) {
            result.skipped++;
            continue;
          }
        }

        await put(store, item);
        result.imported++;
      } catch (error) {
        console.error(`Error importing item ${item.id}:`, error);
        result.errors++;
      }
    }

    if (onProgress) {
      onProgress({
        percent: Math.round(((i + 1) / total) * 100),
        current: collectionName,
        total,
      });
    }
  }

  db.close();
  return result;
}

/**
 * Get from object store
 */
function get(store: IDBObjectStore, id: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = reject;
  });
}

/**
 * Put to object store
 */
function put(store: IDBObjectStore, item: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.put(item);
    request.onsuccess = () => resolve();
    request.onerror = reject;
  });
}

/**
 * Open IndexedDB database
 */
function openDatabase(dbName: string): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
    request.onblocked = () => resolve(null);
  });
}
