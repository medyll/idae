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
