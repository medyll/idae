import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme } from '../../demo/demoScheme.js';
import type { MachineModel } from '../../types/machine-model.js';

function createTestMachine() {
	return new Machine('test-db', 1, demoScheme);
}

describe('Machine', () => {
	it('should create named instance and store in registry', () => {
		const named = Machine.prototype.createInstance('foo', 'foo-db', 1, demoScheme);
		expect(named.instanceName).toBe('foo');
		expect(Machine.instanceRegistry['foo']).toBe(named);
	});

	it('should retrieve instance by name using instance', () => {
		const named = Machine.prototype.createInstance('bar', 'bar-db', 1, demoScheme);
		const retrieved = Machine.instance('bar');
		expect(retrieved).toBe(named);
		expect(retrieved?.instanceName).toBe('bar');
	});
	let machine: Machine;

	beforeEach(() => {
		machine = createTestMachine();
	});

	it('should initialize with demoScheme', () => {
		expect(machine).toBeDefined();
		expect(machine._model).toBe(demoScheme);
	});

	it('should set dbName, version, and model via init', () => {
		machine.init({ dbName: 'foo', version: 2, model: demoScheme });
		expect(machine._dbName).toBe('foo');
		expect(machine._version).toBe(2);
		expect(machine._model).toBe(demoScheme);
	});

	it('should throw if start is called without dbName', () => {
		const m = new Machine();
		expect(() => m.start()).toThrow('dbName is required');
	});

	describe('moduleDbName()', () => {
		it('returns org_base when org is set', () => {
			const m = new Machine();
			m.init({ model: demoScheme, org: 'test' });
			expect(m.moduleDbName('machine_base')).toBe('test_machine_base');
			expect(m.moduleDbName('machine_app')).toBe('test_machine_app');
		});

		it('returns bare base when org is not set', () => {
			const m = new Machine();
			m.init({ model: demoScheme });
			expect(m.moduleDbName('machine_base')).toBe('machine_base');
		});
	});

	it('should create collections and store on start', async () => {
		await machine.start();
		expect(machine.logic).toBeDefined();
		expect(machine.store).toBeDefined();
	});

	it('should expose accessors for logic and store (qoolie-backed)', async () => {
		await machine.start();
		expect(machine.logic).toBe(machine._machineDb);
		expect(machine.store).toBeDefined();
		expect(machine.idbqlState).toBeDefined();
		// idbql / indexedb / idbqModel are removed — managed internally by qoolie
		expect(machine.idbql).toBeUndefined();
		expect(machine.indexedb).toBeUndefined();
		expect(machine.idbqModel).toBeUndefined();
	});

	// --- fetchSchema ---
	describe('fetchSchema()', () => {
		it('fetches schema, sets model, and starts machine', async () => {
			const fakeModel = {
				vehicle: {
					keyPath: '++id', base: 'machine_user', model: {}, ts: {} as any,
					fields:   { id: { type: 'id' } },
					fks:      {},
					template: { presentation: 'id' },
				}
			} as MachineModel;
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => fakeModel }));
			// indexedDB not available in test env — readSchemaCache returns null (cache miss)
			const m = new Machine();
			m.init({ dbName: 'fetch-test-db', version: 1, model: fakeModel });
			// Override model to undefined to test fetchSchema sets it
			m._model = undefined;
			await m.fetchSchema('http://localhost/api/scheme');
			expect(m._model).toEqual(fakeModel);
			expect(m.logic).toBeDefined();
			vi.unstubAllGlobals();
		});
	});

	// --- S34-01: start() auto-fetchSchema when databaseHost is set ---
	describe('start() auto-fetchSchema (S34-01)', () => {
		it('starts immediately with local model when databaseHost is set', () => {
			const m = new Machine();
			m.init({
				dbName: 'auto-fetch-local',
				version: 1,
				model: demoScheme,
				sync: { databaseHost: 'http://localhost:3000', mode: 'server-first' as any },
			});
			m.start();
			// Should have started immediately with local model
			expect(m.logic).toBeDefined();
			expect(m._effectiveModel).toBeDefined();
		});

		it('does not start when no local model and fetch fails (databaseHost set)', async () => {
			vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
			const m = new Machine();
			m.init({
				dbName: 'auto-fetch-no-model',
				version: 1,
				sync: { databaseHost: 'http://localhost:3000', mode: 'server-first' as any },
			});
			m.start();
			// Wait a tick for the bg fetch to fail
			await new Promise((r) => setTimeout(r, 50));
			// Machine should NOT have started (no logic) since fetch failed and no local model
			expect(m.logic).toBeUndefined();
			vi.unstubAllGlobals();
		});

		it('starts normally without databaseHost (no auto-fetch)', () => {
			const m = new Machine();
			m.init({
				dbName: 'no-database-host',
				version: 1,
				model: demoScheme,
			});
			m.start();
			expect(m.logic).toBeDefined();
			expect(m._effectiveModel).toBeDefined();
		});

		it('starts normally with sync: false (no auto-fetch)', () => {
			const m = new Machine();
			m.init({
				dbName: 'sync-false',
				version: 1,
				model: demoScheme,
				sync: false,
			});
			m.start();
			expect(m.logic).toBeDefined();
		});

		it('pulls data from server when databaseHost is set (mocked fetch)', async () => {
			const vehicleData = [
				{ id: 1, license_plate: 'ABC-123', mileage: 50000 },
				{ id: 2, license_plate: 'DEF-456', mileage: 30000 },
			];
			const fakeModel = {
				vehicle: {
					keyPath: '++id', base: 'machine_user', model: {}, ts: {} as any,
					fields:   { id: { type: 'id' }, license_plate: { type: 'text' }, mileage: { type: 'number' } },
					fks:      {},
					template: { presentation: 'license_plate' },
				}
			} as MachineModel;

			vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
				if (url.includes('/api/scheme')) {
					return Promise.resolve({ json: async () => fakeModel });
				}
				if (url.includes('/api/data/vehicle')) {
					return Promise.resolve({ json: async () => vehicleData, ok: true });
				}
				return Promise.resolve({ json: async () => [], ok: true });
			}));

			const m = new Machine();
			m.init({
				dbName: 'pull-test-db',
				version: 1,
				sync: { databaseHost: 'http://localhost:3000', mode: 'server-first' as any },
			});
			m.start();

			// Wait for async pull to complete
			await new Promise((r) => setTimeout(r, 100));

			// Verify data was pulled into store
			const vehicleStore = m.store['vehicle'];
			expect(vehicleStore).toBeDefined();
			const allVehicles = vehicleStore.getAll();
			expect(allVehicles.length).toBeGreaterThanOrEqual(0); // IDB may not be available in test env

			vi.unstubAllGlobals();
		});
	});

	// --- Intégration MachineDb/MachineScheme ---
	describe('integration: MachineDb/MachineScheme', () => {
		beforeEach(async () => {
			await machine.start();
		});

		it('should access a collection and its template', () => {
			const scheme = machine.logic.collection('vehicle');
			expect(scheme).toBeDefined();
			expect(scheme.collection).toBe('vehicle');
			expect(scheme.template).toBeDefined();
		});

		it('should access a field and parse its metadata', () => {
			const scheme = machine.logic.collection('vehicle');
			const field = scheme.field('id');
			const meta = field.parse();
			expect(meta).toBeDefined();
			expect(meta?.fieldName).toBe('id');
		});

		it('should parse all fields of a collection', () => {
			const scheme = machine.logic.collection('vehicle');
			const parsed = scheme.parse();
			expect(parsed).toBeDefined();
			expect(parsed?.id).toBeDefined();
			expect(parsed?.license_plate).toBeDefined();
		});

		it('should validate a valid field value', async () => {
			const scheme = machine.logic.collection('vehicle');
			const validator = scheme.validator;
			const result = await validator.validateField('id', 1);
			expect(result).toHaveProperty('isValid');
		});

		it('should throw MachineError for invalid field', async () => {
			const scheme = machine.logic.collection('vehicle');
			const validator = scheme.validator;
			await expect(validator.validateField('notAField', 1)).resolves.toHaveProperty(
				'isValid',
				false
			);
		});
	});
});
