/**
 * machineIdbAdapter.ts
 * IndexedDB introspection utilities for schema drift detection.
 *
 * Core principle: MongoDB appscheme_* = source of truth.
 * IDB = cache/replica that auto-adapts when server schema changes.
 */

const INTERNAL_STORES = new Set(['__outbox__', '__schema_meta__', '__migrations__']);

/**
 * Deterministic hash of expected store names — sorted join, order-independent.
 */
export function computeSchemaHash(storeNames: string[]): string {
	return [...storeNames].sort().join(',');
}

/**
 * Opens IDB briefly to read actual object store names.
 * Excludes internal stores (__outbox__, __schema_meta__, __migrations__).
 */
export function getCurrentIdbStores(dbName: string): Promise<Set<string>> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') {
			resolve(new Set());
			return;
		}
		const req = indexedDB.open(dbName);
		req.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			const stores = new Set<string>();
			for (let i = 0; i < db.objectStoreNames.length; i++) {
				const name = db.objectStoreNames.item(i);
				if (name && !INTERNAL_STORES.has(name)) stores.add(name);
			}
			db.close();
			resolve(stores);
		};
		req.onerror = () => reject(req.error);
	});
}

/**
 * Read the persisted schema hash from __schema_meta__ store.
 * Returns null if the store doesn't exist or no hash is stored.
 */
export function getStoredSchemaHash(dbName: string): Promise<string | null> {
	return new Promise((resolve) => {
		if (typeof indexedDB === 'undefined') {
			resolve(null);
			return;
		}
		const req = indexedDB.open(dbName);
		req.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains('__schema_meta__')) {
				db.close();
				resolve(null);
				return;
			}
			const tx = db.transaction('__schema_meta__', 'readonly');
			const store = tx.objectStore('__schema_meta__');
			const getReq = store.get('schema_hash');
			getReq.onsuccess = () => {
				db.close();
				resolve(getReq.result?.hash ?? null);
			};
			getReq.onerror = () => {
				db.close();
				resolve(null);
			};
		};
		req.onerror = () => resolve(null);
	});
}

/**
 * Persist the schema hash into __schema_meta__ store.
 * Auto-creates the store if it doesn't exist (requires version bump via upgradeIdb).
 */
export function storeSchemaHash(dbName: string, hash: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') {
			resolve();
			return;
		}
		const req = indexedDB.open(dbName);
		req.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains('__schema_meta__')) {
				db.close();
				// Need version bump to create store — caller should handle via upgradeIdb
				reject(new Error('__schema_meta__ store not found — call upgradeIdb first'));
				return;
			}
			const tx = db.transaction('__schema_meta__', 'readwrite');
			const store = tx.objectStore('__schema_meta__');
			store.put({ id: 'schema_hash', hash });
			tx.oncomplete = () => {
				db.close();
				resolve();
			};
			tx.onerror = () => {
				db.close();
				reject(tx.error);
			};
		};
		req.onerror = () => reject(req.error);
	});
}
