/**
 * machineIdbUpgrade.test.ts
 * Tests for S28-02 to S28-05: upgradeIdb() integration and edge cases.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import 'fake-indexeddb/auto';
import { Machine } from '$lib/main/machine.js';
import { computeSchemaHash, getCurrentIdbStores, getStoredSchemaHash, storeSchemaHash } from '$lib/main/machineIdbAdapter.js';

let uniqueId = 0;
function uniqueDbName(suffix: string) {
	return `test_${suffix}_${Date.now()}_${++uniqueId}`;
}

const minimalModel = {
	categories: { keyPath: '++id', model: {}, fields: { id: { type: 'id', readonly: true }, name: { type: 'text' } }, fks: {}, template: {} },
	vehicles:   { keyPath: '++id', model: {}, fields: { id: { type: 'id', readonly: true }, brand: { type: 'text' } }, fks: {}, template: {} },
};

describe('S28-02: upgradeIdb()', () => {
	beforeEach(() => { uniqueId = 0; });
	afterEach(() => { indexedDB = new IDBFactory(); });

	it('throws if called before init', async () => {
		const m = new Machine();
		await expect(m.upgradeIdb()).rejects.toThrow(/not initialized/);
	});

	it('handles fresh install without error', async () => {
		const m = new Machine();
		m.init({ dbName: uniqueDbName('upgrade-fresh'), version: 1, business: minimalModel });
		await m.boot();
		await expect(m.upgradeIdb()).resolves.not.toThrow();
	});

	it('exposes upgradeIdb method on Machine instance', () => {
		const m = new Machine();
		expect(typeof m.upgradeIdb).toBe('function');
	});
});

describe('S28-03: upgradeIdb() public surface', () => {
	beforeEach(() => { uniqueId = 0; });
	afterEach(() => {
		indexedDB = new IDBFactory();
		vi.unstubAllGlobals();
	});

	it('exposes upgradeIdb on the public API', async () => {
		const m = new Machine();
		m.init({ dbName: uniqueDbName('fetch-integration'), version: 1, business: minimalModel });
		await m.boot();

		expect(typeof m.upgradeIdb).toBe('function');
	});
});

describe('S28-05: Edge cases', () => {
	beforeEach(() => { uniqueId = 0; });
	afterEach(() => { indexedDB = new IDBFactory(); });

	it('computeSchemaHash is order-independent', () => {
		const hash1 = computeSchemaHash(['vehicles', 'categories']);
		const hash2 = computeSchemaHash(['categories', 'vehicles']);
		expect(hash1).toBe(hash2);
	});

	it('computeSchemaHash handles empty array', () => {
		expect(computeSchemaHash([])).toBe('');
	});

	it('getCurrentIdbStores excludes internal stores', async () => {
		const dbName = uniqueDbName('stores-exclude');
		// Create DB with internal stores
		await new Promise<void>((resolve, reject) => {
			const req = indexedDB.open(dbName, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				db.createObjectStore('categories', { keyPath: 'id' });
				db.createObjectStore('__outbox__', { keyPath: 'id' });
				db.createObjectStore('__schema_meta__', { keyPath: 'id' });
			};
			req.onsuccess = () => { req.result.close(); resolve(); };
			req.onerror = () => reject(req.error);
		});

		const stores = await getCurrentIdbStores(dbName);
		expect(stores).toContain('categories');
		expect(stores).not.toContain('__outbox__');
		expect(stores).not.toContain('__schema_meta__');
	});

	it('getStoredSchemaHash returns null on fresh DB', async () => {
		const dbName = uniqueDbName('hash-null');
		await new Promise<void>((resolve, reject) => {
			const req = indexedDB.open(dbName, 1);
			req.onsuccess = () => { req.result.close(); resolve(); };
			req.onerror = () => reject(req.error);
		});

		const hash = await getStoredSchemaHash(dbName);
		expect(hash).toBeNull();
	});

	it('storeSchemaHash persists and retrieves correctly', async () => {
		const dbName = uniqueDbName('hash-persist');
		// Create __schema_meta__ store
		await new Promise<void>((resolve, reject) => {
			const req = indexedDB.open(dbName, 1);
			req.onupgradeneeded = () => {
				const db = req.result;
				db.createObjectStore('__schema_meta__', { keyPath: 'id' });
			};
			req.onsuccess = () => { req.result.close(); resolve(); };
			req.onerror = () => reject(req.error);
		});

		const testHash = 'categories,vehicles';
		await storeSchemaHash(dbName, testHash);
		const retrieved = await getStoredSchemaHash(dbName);
		expect(retrieved).toBe(testHash);
	});

	it('isProtectedStore protects __outbox__, __schema_meta__, __migrations__', async () => {
		const { isProtectedStore } = await import('$lib/main/machineIdbAdapter.js');
		expect(isProtectedStore('__outbox__')).toBe(true);
		expect(isProtectedStore('__schema_meta__')).toBe(true);
		expect(isProtectedStore('__migrations__')).toBe(true);
		expect(isProtectedStore('categories')).toBe(false);
		expect(isProtectedStore('vehicles')).toBe(false);
	});
});
