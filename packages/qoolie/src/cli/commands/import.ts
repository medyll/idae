/**
 * Import command
 */

import { openDB } from 'idb';
import { readFileSync } from 'fs';

/**
 * Import collection data from JSON
 */
export async function importData(
  collection: string,
  options: {
    input: string;
    db: string;
    merge: boolean;
  }
): Promise<void> {
  console.log(`Importing collection: ${collection}`);
  console.log(`Input file: ${options.input}`);
  console.log(`Database: ${options.db}`);

  try {
    // Read input file
    const data = JSON.parse(readFileSync(options.input, 'utf-8'));

    if (!Array.isArray(data)) {
      console.error('Error: Input file must contain a JSON array');
      process.exit(1);
    }

    const db = await openDB(options.db, 1);

    if (!db.objectStoreNames.contains(collection)) {
      console.error(`Error: Collection "${collection}" does not exist`);
      db.close();
      process.exit(1);
    }

    const tx = db.transaction(collection, 'readwrite');
    const store = tx.objectStore(collection);

    let imported = 0;
    let skipped = 0;

    for (const item of data) {
      try {
        if (options.merge) {
          // Check if item exists
          const existing = await store.get(item.id);
          if (existing) {
            skipped++;
            continue;
          }
        }
        await store.put(item);
        imported++;
      } catch (error: any) {
        console.error(`Error importing item ${item.id}:`, error.message);
      }
    }

    await tx.done;
    db.close();

    console.log(`✓ Imported ${imported} records`);
    if (skipped > 0) {
      console.log(`  Skipped ${skipped} existing records (merge mode)`);
    }
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      console.error('Error: Database does not exist');
    } else if (error instanceof SyntaxError) {
      console.error('Error: Invalid JSON in input file');
    } else {
      console.error('Error importing data:', error.message);
    }
    process.exit(1);
  }
}
