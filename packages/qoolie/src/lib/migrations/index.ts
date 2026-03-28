/**
 * Migration function type
 */
export type MigrationFn = (db: IDBDatabase, tx: IDBTransaction) => Promise<void> | void;

/**
 * Define a database migration
 * 
 * @param version - Target database version
 * @param migrate - Migration function
 * @returns Migration definition
 * 
 * @example
 * ```typescript
 * const migration = defineMigration(2, (db, tx) => {
 *   // Add new object store
 *   const store = db.createObjectStore('posts', { keyPath: 'id' });
 *   store.createIndex('byDate', 'createdAt');
 * });
 * ```
 */
export function defineMigration(version: number, migrate: MigrationFn): MigrationDefinition {
  return {
    version,
    migrate,
  };
}

/**
 * Migration definition
 */
export interface MigrationDefinition {
  version: number;
  migrate: MigrationFn;
}

/**
 * Migration result
 */
export interface MigrationResult {
  /** Migrations that ran successfully */
  executed: MigrationDefinition[];
  /** Migrations that were already applied */
  skipped: MigrationDefinition[];
  /** Migration that failed (if any) */
  failed?: {
    migration: MigrationDefinition;
    error: Error;
  };
}

/**
 * Get applied migrations from IndexedDB
 */
async function getAppliedMigrations(dbName: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      
      // Check if migrations store exists
      if (!db.objectStoreNames.contains('__migrations__')) {
        resolve([]);
        db.close();
        return;
      }
      
      const tx = db.transaction('__migrations__', 'readonly');
      const store = tx.objectStore('__migrations__');
      const getAll = store.getAll();
      
      getAll.onsuccess = () => {
        const versions = getAll.result.map((r: any) => r.version);
        resolve(versions);
        db.close();
      };
      
      getAll.onerror = () => reject(getAll.error);
    };
  });
}

/**
 * Mark a migration as applied
 */
async function markMigrationApplied(dbName: string, version: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains('__migrations__')) {
        db.close();
        resolve();
        return;
      }
      
      const tx = db.transaction('__migrations__', 'readwrite');
      const store = tx.objectStore('__migrations__');
      store.add({ version, appliedAt: Date.now() });
      
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      
      tx.onerror = () => reject(tx.error);
    };
  });
}

/**
 * Run pending migrations
 * 
 * @param dbName - Database name
 * @param migrations - Array of migration definitions
 * @returns Migration result
 * 
 * @example
 * ```typescript
 * const migrations = [
 *   defineMigration(2, (db) => {
 *     db.createObjectStore('posts', { keyPath: 'id' });
 *   }),
 *   defineMigration(3, async (db, tx) => {
 *     // Migrate data
 *   }),
 * ];
 * 
 * const result = await runMigrations('my-app', migrations);
 * console.log(`Applied ${result.executed.length} migrations`);
 * ```
 */
export async function runMigrations(
  dbName: string,
  migrations: MigrationDefinition[]
): Promise<MigrationResult> {
  const result: MigrationResult = {
    executed: [],
    skipped: [],
  };

  // Sort migrations by version
  const sortedMigrations = [...migrations].sort((a, b) => a.version - b.version);

  // Get applied migrations
  const appliedVersions = await getAppliedMigrations(dbName);

  // Run pending migrations
  for (const migration of sortedMigrations) {
    if (appliedVersions.includes(migration.version)) {
      result.skipped.push(migration);
      continue;
    }

    try {
      // Run migration
      await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(dbName, migration.version);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const tx = request.transaction!;
          
          try {
            const migrateResult = migration.migrate(db, tx);
            
            if (migrateResult instanceof Promise) {
              migrateResult
                .then(() => resolve())
                .catch(reject);
            } else {
              resolve();
            }
          } catch (error) {
            reject(error);
          }
        };
        
        request.onsuccess = () => {
          request.result.close();
          resolve();
        };
        
        request.onerror = () => reject(request.error);
      });

      // Mark as applied
      await markMigrationApplied(dbName, migration.version);
      result.executed.push(migration);
    } catch (error) {
      result.failed = {
        migration,
        error: error as Error,
      };
      break;
    }
  }

  return result;
}

/**
 * Reset migrations (clear applied migrations tracking)
 * 
 * @param dbName - Database name
 */
export async function resetMigrations(dbName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains('__migrations__')) {
        db.close();
        resolve();
        return;
      }
      
      const tx = db.transaction('__migrations__', 'readwrite');
      tx.objectStore('__migrations__').clear();
      
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      
      tx.onerror = () => reject(tx.error);
    };
  });
}
