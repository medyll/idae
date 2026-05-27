/**
 * Client integration test: machine.init → machine.start → store/logic accessible
 * and machine.fetchSchema (mocked fetch) → machine.start → same guarantees.
 *
 * fake-indexeddb polyfills IDB in node environment.
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Machine } from '../machine.js';
import type { MachineModel } from '$lib/types/index.js';

const model: MachineModel = {
	vehicle: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:            { type: 'id',   readonly: true },
			license_plate: { type: 'text', required: true },
			brand:         { type: 'text' },
			categoryId:    { type: 'fk-category.id' },
		},
		fks: {
			category: { code: 'category', multiple: false },
		},
		template: { presentation: 'license_plate brand' },
	},
	category: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:   { type: 'id',   readonly: true },
			name: { type: 'text', required: true },
		},
		fks:      {},
		template: { presentation: 'name' },
	},
};

describe('Machine — init + start (fake-indexeddb)', () => {
	it('starts without error and exposes logic', async () => {
		const m = new Machine('test_machine_client', 1, model);
		await expect(m.start()).resolves.not.toThrow();
		expect(m.logic).toBeDefined();
	});

	it('machine.store is a function after start', async () => {
		const m = new Machine('test_machine_store', 1, model);
		await m.start();
		expect(typeof m.store).toBe('function');
	});

	it('machine.collection(vehicle) exposes where() and getAll()', async () => {
		const m = new Machine('test_machine_store2', 1, model);
		await m.start();
		const vehicleCol = m.collection('vehicle');
		expect(vehicleCol).toBeDefined();
		expect(typeof vehicleCol.where).toBe('function');
		expect(typeof vehicleCol.getAll).toBe('function');
	});

	it('machine.logic.collection(vehicle) resolves schema', async () => {
		const m = new Machine('test_machine_logic', 1, model);
		await m.start();
		const scheme = m.logic.collection('vehicle');
		expect(scheme).toBeDefined();
		expect(scheme.index).toBe('id');
		expect(scheme.template.presentation).toBe('license_plate brand');
	});

	it('machine.logic.collection(vehicle).field(license_plate) parses type', async () => {
		const m = new Machine('test_machine_field', 1, model);
		await m.start();
		const f = m.logic.collection('vehicle').field('license_plate').parse();
		expect(f?.fieldType).toBe('text');
	});

	it('machine.logic.collection(vehicle).parseFks() returns category', async () => {
		const m = new Machine('test_machine_fks', 1, model);
		await m.start();
		const fks = m.logic.collection('vehicle').parseFks();
		expect(fks).toHaveProperty('category');
	});

	it('unknown collection throws MachineError', async () => {
		const m = new Machine('test_machine_err', 1, model);
		await m.start();
		expect(() => m.logic.collection('nonexistent')).toThrow();
	});
});

describe('Machine — fetchSchema (mocked fetch)', () => {
	let fetchSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		fetchSpy = vi.fn().mockResolvedValue({
			json: () => Promise.resolve(model),
		});
		vi.stubGlobal('fetch', fetchSpy);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('fetchSchema fetches model and starts machine', async () => {
		const m = new Machine();
		m.init({ org: 'test', domain: 'fetchschema', version: 1, model, sync: { databaseHost: 'http://localhost:3000' } });
		await m.fetchSchema('http://localhost:3000/api/scheme');

		expect(fetchSpy).toHaveBeenCalledWith('http://localhost:3000/api/scheme');
		expect(m.logic).toBeDefined();
		expect(m.store).toBeDefined();
	});

	it('fetchSchema → collection(vehicle) accessible', async () => {
		const m = new Machine();
		m.init({ org: 'test', domain: 'fetchschema2', version: 1, model, sync: { databaseHost: 'http://localhost:3000' } });
		await m.fetchSchema('http://localhost:3000/api/scheme');

		const vehicleCol = m.collection('vehicle');
		expect(vehicleCol).toBeDefined();
		expect(typeof vehicleCol.getAll).toBe('function');
	});

	it('fetchSchema → logic.collection(vehicle) resolves', async () => {
		const m = new Machine();
		m.init({ org: 'test', domain: 'fetchschema3', version: 1, model, sync: { databaseHost: 'http://localhost:3000' } });
		await m.fetchSchema('http://localhost:3000/api/scheme');

		const scheme = m.logic.collection('vehicle');
		expect(scheme.index).toBe('id');
		expect(scheme.template.presentation).toBe('license_plate brand');
	});

	it('fetchSchema resolves without error on subsequent calls', async () => {
		const updatedModel = { ...model, extra: { keyPath: '++id', model: {}, fields: { id: { type: 'id', readonly: true } }, fks: {}, template: {} } };

		// First call: cache miss → stores model
		fetchSpy.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(model) });
		const m = new Machine();
		m.init({ org: 'test', domain: 'fetchschema4', version: 1, model, sync: { databaseHost: 'http://localhost:3000' } });
		await m.fetchSchema('http://localhost:3000/api/scheme');

		// Second fetchSchema: uses cached model, boot succeeds
		fetchSpy.mockResolvedValue({ ok: true, json: () => Promise.resolve(updatedModel) });
		await expect(m.fetchSchema('http://localhost:3000/api/scheme')).resolves.toBeDefined();
	});
});
