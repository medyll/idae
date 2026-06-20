/**
 * machineIdbAdapter.ts
 * IndexedDB introspection and upgrade utilities.
 *
 * Core principle: MongoDB appscheme_* = source of truth.
 * IDB = cache/replica that auto-adapts when server schema changes.
 *
 * Architecture note: Qoolie is now the sole IDB opener/creator (see IDB.md §5b).
 * This module provides read-only introspection and drift detection.
 * Never calls indexedDB.open() with a version - that's Qoolie's responsibility.
 *
 * Constraint: Machine supports only one live Qoolie instance at a time due to
 * shared idbEventBus in Qoolie. Multiple concurrent instances would cause
 * reactive-read collisions. boot() destroys old instance before creating new one.
 */

import type { MachineModel } from '$lib/types/index.js';

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
 * Translate a Dexie-style keyPath config ('++id', 'id', '&code', 'a, b, ++id')
 * into native createObjectStore options. Mirrors qoolie's IdbSchema.createSchema:
 * native IDB rejects '++id' ("keyPath is not a valid key path") — the '++' prefix
 * means autoIncrement on the bare field name.
 */
export function nativeStoreOptions(config: string | null | undefined): IDBObjectStoreParameters {
	const fields = (config ?? '++id').split(',').map((f) => f.trim());
	const incrementField = fields.find((f) => f.startsWith('++'))?.replace('++', '');
	const declaredIndex  = fields.find((f) => f.startsWith('&'))?.replace('&', '');
	const keyPath = incrementField || declaredIndex || fields[0];
	return { keyPath, autoIncrement: Boolean(incrementField) };
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
	catch (err) { console.warn('[idae-machine] Could not read stored schema hash:', err); storedHash = null; }

	if (storedHash === expectedHash) return null;

	let actualStores: Set<string>;
	try { actualStores = await getCurrentIdbStores(dbName); }
	catch (err) { console.warn('[idae-machine] Could not read IDB stores for drift detection:', err); return null; }

	const toCreate = expectedStores.filter((s) => !actualStores.has(s));
	const toDelete = [...actualStores].filter((s) => !expectedStores.includes(s));

	if (toCreate.length === 0 && toDelete.length === 0) {
		// Stores match but hash differs — just persist hash, no version bump needed
		try { await storeSchemaHash(dbName, expectedHash); }
	catch (err) { console.warn('[idae-machine] Could not persist schema hash (will retry on next start):', err); }
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
 * Perform IDB schema upgrade: handle store renames and deletions.
 * Called after detectSchemaDrift() returned a pending upgrade.
 *
 * Qoolie now handles all store creation (including __schema_meta__) in its onupgradeneeded handler.
 * This method only handles:
 * - Store renames: copies data from old → new store when keyPath matches
 * - Store deletions: removes orphaned stores (excluding protected stores)
 * - Store creation: only for stores not created by Qoolie (fallback)
 *
 * Edge cases handled:
 * - __outbox__ / internal stores: never deleted
 * - Rename detection: copies data from old → new store when keyPath matches
 */
export async function performIdbUpgrade(
	dbName: string,
	version: number,
	upgrade: PendingIdbUpgrade,
	effectiveModel: MachineModel,
): Promise<void> {
	// Qoolie now handles all store creation in its onupgradeneeded handler,
	// including __schema_meta__. This method only handles renames and deletions.
	// Pure-creation case (toDelete empty): skip — qoolie's single open creates
	// everything (business stores + __schema_meta__ + __outbox__ + indexes).
	// Doing our own versioned open here would consume the version bump and
	// starve qoolie's onupgradeneeded (same-version reopen never fires it).
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
				const newStore = db.createObjectStore(to, nativeStoreOptions(keyPath));
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
				db.createObjectStore(name, nativeStoreOptions(effectiveModel[name]?.keyPath));
			}
		};
		req.onsuccess = () => { req.result.close(); resolve(); };
		req.onerror   = () => reject(req.error);
	});

	// NOTE: schema-hash persistence is intentionally NOT done here. __schema_meta__ is
	// created by qoolie's versioned open, which runs AFTER this function in createStore().
	// The caller (machine.createStore) persists the hash once qoolie is ready.
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
 * Returns empty Set if database doesn't exist (to avoid creating it with no-version open).
 */
export function getCurrentIdbStores(dbName: string): Promise<Set<string>> {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === 'undefined') {
			resolve(new Set());
			return;
		}
		
		// Fix for D1: Avoid creating DB with no-version open.
		// Check if database exists. If not, return empty Set.
		// This prevents interfering with Qoolie's proper versioned creation.
		const req = indexedDB.open(dbName);
		req.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			// Fix for D1: If version is 0, DB was just created by this no-version open.
			// Return empty Set to avoid interfering with Qoolie's proper versioned creation.
			if (db.version === 0) {
				db.close();
				resolve(new Set());
				return;
			}
			
			const stores = new Set<string>();
			for (let i = 0; i < db.objectStoreNames.length; i++) {
				const name = db.objectStoreNames.item(i);
				if (name && !INTERNAL_STORES.has(name)) stores.add(name);
			}
			db.close();
			resolve(stores);
		};
		req.onerror = () => {
			// If we can't open the database, it likely doesn't exist
			// Return empty Set instead of rejecting to avoid creating it
			resolve(new Set());
		};
	});
}

/**
 * Returns the actual current version of the IDB database, or 0 if it doesn't exist.
 * Used to prevent version downgrade when re-opening after a drift-triggered increment.
 * Returns 0 if database doesn't exist (to avoid creating it with no-version open).
 */
export function getActualIdbVersion(dbName: string): Promise<number> {
	return new Promise((resolve) => {
		if (typeof indexedDB === 'undefined') { resolve(0); return; }
		const req = indexedDB.open(dbName);
		req.onsuccess = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			// If version is 0, the database was just created by this open call
			// In this case, return 0 to avoid interfering with proper creation
			if (db.version === 0) {
				db.close();
				resolve(0);
				return;
			}
			const version = db.version;
			db.close();
			resolve(version);
		};
		req.onerror = () => {
			// If we can't open the database, it likely doesn't exist
			// Return 0 instead of rejecting to avoid creating it
			resolve(0);
		};
	});
}

/**
 * Read the persisted schema hash from __schema_meta__ store.
 * Returns null if the store doesn't exist or no hash is stored.
 * Returns null if database doesn't exist (to avoid creating it with no-version open).
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
			// If version is 0, the database was just created by this open call
			// In this case, return null to avoid interfering with proper creation
			if (db.version === 0) {
				db.close();
				resolve(null);
				return;
			}
			
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
		req.onerror = () => {
			// If we can't open the database, it likely doesn't exist
			// Return null instead of rejecting to avoid creating it
			resolve(null);
		};
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
