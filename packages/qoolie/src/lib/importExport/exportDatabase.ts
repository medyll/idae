/**
 * Export Database
 */

import type { ExportData } from './types.js';

/**
 * Export database or specific collections to JSON
 */
export async function exportDatabase(
  qoolie: any,
  options: { collections?: string[] } = {}
): Promise<ExportData> {
  const db = await openDatabase(qoolie.dbName);
  if (!db) {
    throw new Error(`Database ${qoolie.dbName} not found`);
  }

  const collectionsToExport = options.collections ?? Array.from(db.objectStoreNames);
  const exportedCollections: Record<string, any[]> = {};

  for (const collectionName of collectionsToExport) {
    if (db.objectStoreNames.contains(collectionName)) {
      const tx = db.transaction(collectionName, 'readonly');
      const store = tx.objectStore(collectionName);
      exportedCollections[collectionName] = await getAll(store);
    }
  }

  db.close();

  return {
    database: qoolie.dbName,
    version: db.version,
    collections: exportedCollections,
    exportedAt: Date.now(),
  };
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

/**
 * Download export as JSON file
 */
export function downloadExport(data: ExportData, filename?: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename ?? `${data.database}-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
