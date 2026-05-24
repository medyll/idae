/**
 * S11-04: machine.sync + machine.destroy() — tests
 *
 * Validates the Machine API surface for sync config, sync accessor,
 * and destroy cleanup. Uses fake-indexeddb — no real sync server required.
 */
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme } from '../../demo/demoScheme.js';

let _dbCounter = 0;

function resetIndexedDB() {
	(globalThis as any).indexedDB = new IDBFactory();
}

function uniqueDbName(base: string) {
	return `${base}-${++_dbCounter}`;
}

describe('S11-04: machine.sync + machine.destroy()', () => {
	beforeEach(() => {
		resetIndexedDB();
	});

	afterEach(() => {
		_dbCounter = 0;
		vi.restoreAllMocks();
	});

	// ── sync:false ───────────────────────────────────────────────────────────

	describe('machine.init({sync:false})', () => {
		it('starts without error', async () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-sync-false'), version: 1, model: demoScheme, sync: false });
			await expect(m.start()).resolves.not.toThrow();
		});

		it('machine.sync throws "not enabled"', async () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-sync-disabled'), version: 1, model: demoScheme, sync: false });
			await m.start();
			expect(() => m.sync).toThrow(/not enabled/);
		});
	});

	// ── sync config forwarded ────────────────────────────────────────────────

	describe('machine.init({sync: {...}})', () => {
		it('forwards sync config to createQoolie', async () => {
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => demoScheme }));
			const m = new Machine();
			m.init({
				dbName:  uniqueDbName('s11-sync-config'),
				version: 1,
				model:   demoScheme,
				sync:    { databaseHost: 'http://localhost', mode: 'mobile-first' as any },
			});
			expect(m._syncOptions).toEqual({ databaseHost: 'http://localhost', mode: 'mobile-first' });
			await expect(m.start()).resolves.not.toThrow();
			vi.unstubAllGlobals();
		});
	});

	describe('machine.init({stateEngine})', () => {
		it('forwards stateEngine:stator without error', async () => {
			const m = new Machine();
			m.init({
				dbName:     uniqueDbName('s11-state-engine'),
				version:    1,
				model:      demoScheme,
				stateEngine: 'stator',
			});
			await expect(m.start()).resolves.not.toThrow();
		});
	});

	describe('machine.destroy()', () => {
		it('after start() → machine._qoolie === undefined', async () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-destroy-after'), version: 1, model: demoScheme });
			await m.start();
			expect(m._qoolie).toBeDefined();
			m.destroy();
			expect(m._qoolie).toBeUndefined();
		});

		it('before start() → no-op, no throw', () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-destroy-before'), version: 1, model: demoScheme });
			expect(() => m.destroy()).not.toThrow();
			expect(m._qoolie).toBeUndefined();
		});
	});

	// ── machine.sync before start ────────────────────────────────────────────

	describe('machine.sync before start()', () => {
		it('throws "Machine not started"', () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-sync-before-start'), version: 1, model: demoScheme });
			expect(() => m.sync).toThrow(/Machine not started/);
		});
	});

	// ── machine.collection() before/after start ──────────────────────────────

	describe('machine.collection(name)', () => {
		it('before start() throws', () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-col-before'), version: 1, model: demoScheme });
			expect(() => m.collection('vehicle')).toThrow();
		});

		it('after start() returns QoolieCollection with CRUD verbs', async () => {
			const m = new Machine();
			m.init({ dbName: uniqueDbName('s11-col-after'), version: 1, model: demoScheme });
			await m.start();

			const col = m.collection('category');
			expect(col).toBeDefined();
			expect(typeof col.create).toBe('function');
			expect(typeof col.getAll).toBe('function');
			expect(typeof col.where).toBe('function');
			expect(typeof col.update).toBe('function');
			expect(typeof col.delete).toBe('function');
			expect(typeof col.count).toBe('function');
		});
	});

	// ── hooks forwarded ──────────────────────────────────────────────────────

	describe('machine.init({hooks})', () => {
		it('forwards hooks without error', async () => {
			const m = new Machine();
			m.init({
				dbName:  uniqueDbName('s11-hooks'),
				version: 1,
				model:   demoScheme,
				hooks:   {
					onSyncEvent: vi.fn(),
					onError:     vi.fn(),
				},
			});
			await expect(m.start()).resolves.not.toThrow();
		});
	});
});
