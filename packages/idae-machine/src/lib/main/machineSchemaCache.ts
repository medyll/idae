/**
 * IDB-backed schema cache for remote schema loading during machine.boot().
 * Stores raw IdbqModel JSON keyed by URL in a dedicated _schema store.
 * Uses stale-while-revalidate: serve cache immediately, refresh in background.
 */

const DB_NAME    = '_machine_schema_cache';
const STORE_NAME = '_schema';
const DB_VERSION = 1;

function openCacheDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(STORE_NAME, { keyPath: 'url' });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror   = () => reject(req.error);
	});
}

export async function readSchemaCache(url: string): Promise<unknown | null> {
	try {
		const db    = await openCacheDb();
		const tx    = db.transaction(STORE_NAME, 'readonly');
		const store = tx.objectStore(STORE_NAME);
		return await new Promise((resolve, reject) => {
			const req     = store.get(url);
			req.onsuccess = () => resolve(req.result?.data ?? null);
			req.onerror   = () => reject(req.error);
		});
	} catch (err) {
		console.warn('[idae-machine] Schema cache read failed — will fetch fresh:', err);
		return null;
	}
}

export async function clearSchemaCache(): Promise<void> {
	await new Promise<void>((resolve) => {
		const req = indexedDB.deleteDatabase(DB_NAME);
		req.onsuccess = () => resolve();
		req.onerror   = () => resolve(); // non-fatal
		req.onblocked = () => resolve();
	});
}

export async function writeSchemaCache(url: string, data: unknown): Promise<void> {
	try {
		const db    = await openCacheDb();
		const tx    = db.transaction(STORE_NAME, 'readwrite');
		const store = tx.objectStore(STORE_NAME);
		await new Promise<void>((resolve, reject) => {
			const req     = store.put({ url, data, cachedAt: Date.now() });
			req.onsuccess = () => resolve();
			req.onerror   = () => reject(req.error);
		});
	} catch (err) {
		// Cache write failure is non-fatal — schema will be re-fetched on next boot
		console.warn('[idae-machine] Schema cache write failed:', err);
	}
}
