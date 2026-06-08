import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme } from '../../__fixtures__/demoModel.js';
import { sortItems, groupItems } from '../../data-ui/utils/data-utils.js';

let _dbCounter = 0;

function resetIndexedDB() {
	(globalThis as any).indexedDB = new IDBFactory();
}

function uniqueDbName(base: string) {
	return `${base}-${++_dbCounter}`;
}

async function createStartedMachine(dbName: string) {
	const m = new Machine(dbName, 1, demoScheme);
	await m.boot();
	return m;
}

describe('DataList data operations', () => {
	let m: Machine;

	beforeEach(async () => {
		resetIndexedDB();
		m = await createStartedMachine(uniqueDbName('datalist'));
	});

	describe('getAll', () => {
		it('returns all records for a valid collection', async () => {
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'Civic', brand: 'Honda', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'B2', model: 'Corolla', brand: 'Toyota', status: 'available' });
			const items = m.collection('vehicle').getAll();
			expect(items.length).toBe(2);
		});

		it('returns empty array when no records exist', () => {
			const items = m.collection('vehicle').getAll();
			expect(Array.isArray(items)).toBe(true);
		});
	});

	describe('where', () => {
		it('filters records by field value', async () => {
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'Civic', brand: 'Honda', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'B2', model: 'Focus', brand: 'Ford', status: 'rented' });
			const filtered = m.collection('vehicle').where({ status: 'available' });
			expect(filtered.length).toBe(1);
			expect(filtered[0].model).toBe('Civic');
		});
	});

	describe('sort', () => {
		it('sorts items ascending', async () => {
			await m.collection('vehicle').create({ license_plate: 'C3', model: 'Zebra', brand: 'Z', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'Alpha', brand: 'A', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'B2', model: 'Middle', brand: 'M', status: 'available' });

			const items = m.collection('vehicle').getAll();
			const sorted = sortItems(items, { field: 'model', direction: 'asc' });
			expect(sorted[0].model).toBe('Alpha');
			expect(sorted[2].model).toBe('Zebra');
		});

		it('sorts items descending', async () => {
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'Alpha', brand: 'A', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'C3', model: 'Zebra', brand: 'Z', status: 'available' });

			const items = m.collection('vehicle').getAll();
			const sorted = sortItems(items, { field: 'model', direction: 'desc' });
			expect(sorted[0].model).toBe('Zebra');
			expect(sorted[sorted.length - 1].model).toBe('Alpha');
		});

		it('supports multi-sort chain', async () => {
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'B', brand: 'X', status: 'car' });
			await m.collection('vehicle').create({ license_plate: 'B2', model: 'A', brand: 'Y', status: 'car' });
			await m.collection('vehicle').create({ license_plate: 'C3', model: 'C', brand: 'Z', status: 'truck' });

			const items = m.collection('vehicle').getAll();
			const sorted = sortItems(items, [
				{ field: 'status', direction: 'asc' },
				{ field: 'model', direction: 'asc' }
			]);
			expect(sorted[0].status).toBe('car');
			expect(sorted[0].model).toBe('A');
			expect(sorted[2].status).toBe('truck');
		});
	});

	describe('group', () => {
		it('groups items by field value', async () => {
			await m.collection('vehicle').create({ license_plate: 'A1', model: 'Civic', brand: 'Honda', status: 'available' });
			await m.collection('vehicle').create({ license_plate: 'B2', model: 'Accord', brand: 'Honda', status: 'rented' });
			await m.collection('vehicle').create({ license_plate: 'C3', model: 'F-150', brand: 'Ford', status: 'available' });

			const items = m.collection('vehicle').getAll();
			const groups = groupItems(items, 'brand');
			expect(groups.size).toBe(2);
			expect(groups.get('Honda')?.length).toBe(2);
			expect(groups.get('Ford')?.length).toBe(1);
		});
	});

	describe('pagination', () => {
		it('slices items by page size', async () => {
			for (let i = 0; i < 10; i++) {
				await m.collection('vehicle').create({ license_plate: `P${i}`, model: `Model ${i}`, brand: 'Test', status: 'available' });
			}
			const all = m.collection('vehicle').getAll();
			const page1 = all.slice(0, 3);
			const page2 = all.slice(3, 6);
			expect(page1.length).toBe(3);
			expect(page2.length).toBe(3);
		});
	});

	describe('error handling', () => {
		it('throws for unknown collection', () => {
			expect(() => m.logic.collection('nonexistent')).toThrow();
		});

		it('safeCollection returns null for unknown collection', () => {
			function safeCollection(name: string) {
				try { return m.logic.collection(name); } catch { return null; }
			}
			expect(safeCollection('nonexistent')).toBeNull();
			expect(safeCollection('vehicle')).not.toBeNull();
		});
	});

	describe('defaultSort', () => {
		it('infers defaultSort from schema', () => {
			const collLogic = m.logic.collection('vehicle');
			const ds = collLogic.defaultSort;
			expect(Array.isArray(ds)).toBe(true);
			expect(ds.length).toBeGreaterThan(0);
			expect(ds[0]).toHaveProperty('field');
			expect(ds[0]).toHaveProperty('direction');
		});
	});
});
