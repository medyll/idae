/**
 * Export command
 */

import { openDB } from 'idb';
import { writeFileSync } from 'fs';

/**
 * Export collection data to JSON
 */
export async function exportData(
  collection: string,
  options: {
    output: string;
    db: string;
  }
): Promise<void> {
  console.log(`Exporting collection: ${collection}`);
  console.log(`Database: ${options.db}`);

  try {
    const db = await openDB(options.db, 1);

    if (!db.objectStoreNames.contains(collection)) {
      console.error(`Error: Collection "${collection}" does not exist`);
      db.close();
      process.exit(1);
    }

    const tx = db.transaction(collection, 'readonly');
    const store = tx.objectStore(collection);
    const data = await store.getAll();

    db.close();

    // Write to file
    writeFileSync(options.output, JSON.stringify(data, null, 2));

    console.log(`✓ Exported ${data.length} records to: ${options.output}`);
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.error('Error: Database does not exist');
    } else {
      console.error('Error exporting data:', error.message);
    }
    process.exit(1);
  }
}
