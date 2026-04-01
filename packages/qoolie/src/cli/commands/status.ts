/**
 * Status command
 */

import { openDB } from 'idb';

/**
 * Show database status
 */
export async function showStatus(options: { db: string }): Promise<void> {
  console.log(`Database: ${options.db}`);

  try {
    // Try to open database and get info
    const db = await openDB(options.db, 1);

    console.log(`Version: ${db.version}`);
    console.log('Object Stores:');

    const stores = db.objectStoreNames;
    for (let i = 0; i < stores.length; i++) {
      const storeName = stores.item(i);
      if (storeName) {
        const store = db.transaction(storeName, 'readonly').objectStore(storeName);
        console.log(`  - ${storeName}`);
        console.log(`    Key Path: ${store.keyPath}`);
        console.log(`    Indexes: ${Array.from(store.indexNames).join(', ') || 'none'}`);
      }
    }

    db.close();
    console.log('✓ Status retrieved');
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.log('Database does not exist yet');
    } else {
      console.error('Error getting status:', error.message);
      process.exit(1);
    }
  }
}
