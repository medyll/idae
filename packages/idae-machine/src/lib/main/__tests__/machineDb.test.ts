import { describe, it, expect, beforeEach } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import { MachineDb } from '../machineDb.js';

function createTestDb() {
	return new MachineDb(demoScheme);
}

describe('MachineDb', () => {
	let db: MachineDb;

	beforeEach(() => {
		db = createTestDb();
	});

	it('should initialize with demoScheme', () => {
		expect(db).toBeDefined();
		expect(db.model).toBe(demoScheme);
	});

	it('should return a MachineScheme for a collection', () => {
		const scheme = db.collection('vehicle');
		expect(scheme).toBeDefined();
		expect(scheme.collection).toBe('vehicle');
		expect(scheme.template).toBeDefined();
	});

	it('should cache MachineScheme instances per collection', () => {
		const scheme1 = db.collection('vehicle');
		const scheme2 = db.collection('vehicle');
		expect(scheme1).toBe(scheme2);
	});
});
