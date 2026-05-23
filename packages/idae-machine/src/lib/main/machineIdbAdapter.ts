/**
 * machineIdbAdapter.ts
 * IndexedDB introspection and upgrade utilities.
 *
 * Core principle: MongoDB appscheme_* = source of truth.
 * IDB = cache/replica that auto-adapts when server schema changes.
 */

import type { MachineModel } from '$lib/types/machine-model.js';

const INTERNAL_STORES = new Set(['__outbox__', '__schema_meta__', '__migrations__']);

export interface PendingIdbUpgrade {
	toCreate:     string[];
	toDelete:     string[];
	expectedHash: string;
	newVersion:   number;
}

/** True for internal stores that must never be deleted. */
export function isProtectedStore(name: string): boolean {
	return name.startsWith('__') && name.endsWith('__');
}

/**
 * Detect drift between expected schema and actual IDB stores.
 * Returns PendingIdbUpgrade (with bumped version) if drift found, null if schema is current.
 */
export async function detectSchemaDrift(
	dbName: string,
	version: number,
	effectiveModel: MachineModel,
): Promise<PendingIdbUpgrade | null> {
	if (!dbName || !version) return null;

	const expectedStores = Object.keys(effectiveModel);
	const expectedHash   = computeSchemaHash(expectedStores);

	let storedHash: string | null;
	try { storedHash = await getStoredSchemaHash(dbName); }
	catch { storedHash = null; }

	if (storedHash === expectedHash) return null;

	let actualStores: Set<string>;
	try { actualStores = await getCurrentIdbStores(dbName); }
	catch { return null; }

	const toCreate = expectedStores.filter((s) => !actualStores.has(s));
	const toDelete = [...actualStores].filter((s) => !expectedStores.includes(s));

	if (toCreate.length === 0 && toDelete.length === 0) {
		// Stores match but hash differs — just persist hash, no version bump needed
		try { await storeSchemaHash(dbName, expectedHash); } catch { /* retry on next start */ }
		return null;
	}

	return { toCreate, toDelete, expectedHash, newVersion: version + 1 };
}

/**
 * Detect potential store renames: deleted store keyPath matches created store.
 */
function detectStoreRenames(
	db: IDBDatabase,
	upgrade: PendingIdbUpgrade,
	effectiveModel: MachineModel,
): Array<{ from: string; to: string; keyPath: string | null }> {
	const renames: Array<{ from: string; to: string; keyPath: string | null }> = [];
	for (const deletedName of upgrade.toDelete) {
		if (isProtectedStore(deletedName)) continue;
		if (!db.objectStoreNames.contains(deletedName)) continue;

		const deletedStore   = (db as unknown as IDBDatabase & { objectStore(name: string): IDBObjectStore }).objectStore(deletedName);
		const deletedKeyPath = deletedStore.keyPath;

		for (const createdName of upgrade.toCreate) {
			const colDef        = effectiveModel[createdName];
			const createdKeyPath = colDef?.keyPath ?? '++id';
			if (deletedKeyPath === createdKeyPath || (deletedKeyPath === null && createdKeyPath === '++id')) {
				renames.push({ from: deletedName, to: createdName, keyPath: createdKeyPath });
				break;
			}
		}
	}
	return renames;
}

/**
 * Perform IDB schema upgrade: create missing stores, delete orphans, persist hash.
 * Called after detectSchemaDrift() returned a pending upgrade.
 *
 * Edge cases handled:
 * - Fresh install: skips if no stores to delete (only creates)
 * - __outbox__ / internal stores: never deleted
 * - Rename detection: copies data from old → new store when keyPath matches
 */
export async function performIdbUpgrade(
	dbName: string,
	version: number,
	upgrade: PendingIdbUpgrade,
	effectiveModel: MachineModel,
): Promise<void> {
	// Fresh install: no orphans to delete — qoolie handles creation via normal open
	if (upgrade.toCreate.length > 0 && upgrade.toDelete.length === 0) return;

	await new Promise<void>((resolve, reject) => {
		if (typeof indexedDB === 'undefined') { resolve(); return; }
		const req = indexedDB.open(dbName, version);
		req.onupgradeneeded = (e) => {
			const db      = (e.target as IDBOpenDBRequest).result;
			const renames = detectStoreRenames(db, upgrade, effectiveModel);

			for (const { from, to, keyPath } of renames) {
				if (!db.objectStoreNames.contains(from)) continue;
				const oldStore = (db as unknown as IDBDatabase & { objectStore(name: string): IDBObjectStore }).objectStore(from);
				const newStore = db.createObjectStore(to, { keyPath });
				const cursor   = oldStore.openCursor();
				cursor.onsuccess = () => {
					const c = cursor.result;
					if (c) { newStore.add(c.value); c.continue(); }
				};
				db.deleteObjectStore(from);
			}

			const renamedFrom = new Set(renames.map((r) => r.from));
			for (const name of upgrade.toDelete) {
				if (renamedFrom.has(name) || isProtectedStore(name)) continue;
				if (db.objectStoreNames.contains(name)) db.deleteObjectStore(name);
			}

			const renamedTo = new Set(renames.map((r) => r.to));
			for (const name of upgrade.toCreate) {
				if (renamedTo.has(name) || db.objectStoreNames.contains(name)) continue;
				const keyPath = effectiveModel[name]?.keyPath ?? '++id';
				db.createObjectStore(name, { keyPath });
			}

			if (!db.objectStoreNames.contains('__schema_meta__')) {
				db.createObjectStore('__schema_meta__', { keyPath: 'id' });
			}
		};
		req.onsuccess = () => { req.result.close(); resolve(); };
		req.onerror   = () => reject(req.error);
	});

	try { await storeSchemaHash(dbName, upgrade.expectedHash); }
	catch { /* non-critical — retry on next start */ }
}

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

/**
 * Delete an IDB database entirely — dev tool, irreversible.
 * Does NOT reload the page — caller decides.
 */
export function deleteIdbDatabase(dbName: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') { resolve(); return; }
		const req = indexedDB.deleteDatabase(dbName);
		req.onsuccess = () => resolve();
		req.onerror   = () => reject(req.error);
		req.onblocked = () => reject(new Error('IDB delete blocked — close other tabs'));
	});
}
