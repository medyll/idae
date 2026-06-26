/**
 * machineBootDrift.test.ts
 * Non-regression for boot() onDrift path — previously 0 coverage.
 * Exercises the duplicated block now extracted into _applyModel(true).
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import 'fake-indexeddb/auto';
import type { MachineModel } from '$lib/types/index.js';

vi.mock('$lib/main/machineSchemaLoader.js', () => ({
	loadSchema: vi.fn()
}));

import { Machine } from '$lib/main/machine.js';
import { loadSchema } from '$lib/main/machineSchemaLoader.js';

const minimalModel: MachineModel = {
	vehicle: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as any,
		fields:  { id: { type: 'id' } },
		fks:     {},
		template: { presentation: 'id' },
	}
};

const extendedModel: MachineModel = {
	...minimalModel,
	booking: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as any,
		fields:  { id: { type: 'id' } },
		fks:     {},
		template: {},
	}
};

let dbCounter = 0;
function uniqueDb() { return `boot-drift-${Date.now()}-${++dbCounter}`; }

function bootWithDrift(m: Machine) {
	vi.mocked(loadSchema).mockImplementation(async (_url: string, cbs: any) => {
		cbs.onModel?.(minimalModel);
		await cbs.onDrift?.();
		return new EventTarget();
	});
	return m.boot();
}

describe('boot() onDrift path', () => {
	afterEach(() => {
		indexedDB = new IDBFactory();
		vi.clearAllMocks();
	});

	it('completes without error when onDrift is triggered', async () => {
		const m = new Machine();
		m.init({ dbName: uniqueDb(), version: 1, business: minimalModel, sync: { databaseHost: 'http://localhost:3000' } });
		await expect(bootWithDrift(m)).resolves.not.toThrow();
	});

	it('sets _effectiveModel and _machineDb after onDrift', async () => {
		const m = new Machine();
		m.init({ dbName: uniqueDb(), version: 1, business: minimalModel, sync: { databaseHost: 'http://localhost:3000' } });
		await bootWithDrift(m);
		expect(m._effectiveModel).toBeDefined();
		expect(m._machineDb).toBeDefined();
		expect(m.logic).toBeDefined();
	});

	it('picks up model update from onModel before onDrift', async () => {
		vi.mocked(loadSchema).mockImplementation(async (_url: string, cbs: any) => {
			cbs.onModel?.(extendedModel);
			await cbs.onDrift?.();
			return new EventTarget();
		});
		const m = new Machine();
		m.init({ dbName: uniqueDb(), version: 1, business: minimalModel, sync: { databaseHost: 'http://localhost:3000' } });
		await m.boot();
		expect(m._business).toEqual(extendedModel);
		expect(m._effectiveModel).toHaveProperty('booking');
	});

	it('main path still works (no onDrift) after loadSchema mock returns normally', async () => {
		vi.mocked(loadSchema).mockResolvedValue(undefined as any);
		const m = new Machine();
		m.init({ dbName: uniqueDb(), version: 1, business: minimalModel, sync: { databaseHost: 'http://localhost:3000' } });
		await m.boot();
		expect(m._effectiveModel).toBeDefined();
		expect(m._machineDb).toBeDefined();
	});

	it('machine.store and machine.logic accessible after onDrift boot', async () => {
		const m = new Machine();
		m.init({ dbName: uniqueDb(), version: 1, business: minimalModel, sync: { databaseHost: 'http://localhost:3000' } });
		await bootWithDrift(m);
		const { records } = m.store('vehicle');
		expect(Array.isArray(records)).toBe(true);
		expect(m.logic.collection('vehicle')).toBeDefined();
	});
});
