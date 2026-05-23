import { describe, it, expect, beforeEach } from 'vitest';
import { MachineDb } from '../machineDb.js';
import { MachineScheme } from '../machine/MachineScheme.js';
import { sortItems } from '../../data-ui/utils/explorerUtils.js';

function makeDb(model: Record<string, any>): MachineDb {
	return new MachineDb(model as any);
}

describe('MachineScheme.defaultSort', () => {
	it('priority 1: returns template.sort when set', () => {
		const db = makeDb({
			vehicles: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, name: { type: 'text' } },
				fks: {},
				template: {
					sort: [
						{ field: 'status', direction: 'asc' },
						{ field: 'name', direction: 'asc' },
					],
				},
			},
		});
		const scheme = db.collection('vehicles');
		expect(scheme.defaultSort).toEqual([
			{ field: 'status', direction: 'asc' },
			{ field: 'name', direction: 'asc' },
		]);
	});

	it('priority 2: field named ordre wins over name', () => {
		const db = makeDb({
			items: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, ordre: { type: 'number' }, name: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('items');
		expect(scheme.defaultSort).toEqual([{ field: 'ordre', direction: 'asc' }]);
	});

	it('priority 2: field named order wins over name', () => {
		const db = makeDb({
			items: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, order: { type: 'number' }, name: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('items');
		expect(scheme.defaultSort).toEqual([{ field: 'order', direction: 'asc' }]);
	});

	it('priority 3: field named name wins', () => {
		const db = makeDb({
			users: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, name: { type: 'text' }, createdAt: { type: 'date' } },
				fks: {},
			},
		});
		const scheme = db.collection('users');
		expect(scheme.defaultSort).toEqual([{ field: 'name', direction: 'asc' }]);
	});

	it('priority 3: field named code wins over createdAt', () => {
		const db = makeDb({
			products: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, code: { type: 'text' }, createdAt: { type: 'date' } },
				fks: {},
			},
		});
		const scheme = db.collection('products');
		expect(scheme.defaultSort).toEqual([{ field: 'code', direction: 'asc' }]);
	});

	it('priority 3: field named nom wins over dateModification', () => {
		const db = makeDb({
			clients: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, nom: { type: 'text' }, dateModification: { type: 'date' } },
				fks: {},
			},
		});
		const scheme = db.collection('clients');
		expect(scheme.defaultSort).toEqual([{ field: 'nom', direction: 'asc' }]);
	});

	it('priority 4: updatedAt when no name/label/code field', () => {
		const db = makeDb({
			logs: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, updatedAt: { type: 'date' }, message: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('logs');
		expect(scheme.defaultSort).toEqual([{ field: 'updatedAt', direction: 'desc' }]);
	});

	it('priority 4: dateModification when no name/label/code field', () => {
		const db = makeDb({
			entries: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, dateModification: { type: 'date' } },
				fks: {},
			},
		});
		const scheme = db.collection('entries');
		expect(scheme.defaultSort).toEqual([{ field: 'dateModification', direction: 'desc' }]);
	});

	it('priority 5: createdAt when no updatedAt or name field', () => {
		const db = makeDb({
			events: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, createdAt: { type: 'date' }, description: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('events');
		expect(scheme.defaultSort).toEqual([{ field: 'createdAt', direction: 'desc' }]);
	});

	it('priority 5: dateCreation when no updatedAt or name field', () => {
		const db = makeDb({
			records: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, dateCreation: { type: 'date' } },
				fks: {},
			},
		});
		const scheme = db.collection('records');
		expect(scheme.defaultSort).toEqual([{ field: 'dateCreation', direction: 'desc' }]);
	});

	it('priority 6: first date-type field when no timestamp or name field', () => {
		const db = makeDb({
			schedules: {
				keyPath: '++id',
				fields: {
					id: { type: 'text' },
					startDate: { type: 'date' },
					endDate: { type: 'date' },
				},
				fks: {},
			},
		});
		const scheme = db.collection('schedules');
		expect(scheme.defaultSort).toEqual([{ field: 'startDate', direction: 'desc' }]);
	});

	it('priority 7: fallback to index field', () => {
		const db = makeDb({
			misc: {
				keyPath: '++id',
				fields: { id: { type: 'text' }, value: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('misc');
		expect(scheme.defaultSort).toEqual([{ field: 'id', direction: 'asc' }]);
	});

	it('priority 7: fallback respects custom keyPath', () => {
		const db = makeDb({
			tags: {
				keyPath: 'tagId',
				fields: { tagId: { type: 'text' }, value: { type: 'text' } },
				fks: {},
			},
		});
		const scheme = db.collection('tags');
		expect(scheme.defaultSort).toEqual([{ field: 'tagId', direction: 'asc' }]);
	});
});

describe('sortItems multi-sort chain', () => {

	const data = [
		{ id: '1', status: 'active', name: 'Zara' },
		{ id: '2', status: 'inactive', name: 'Alice' },
		{ id: '3', status: 'active', name: 'Bob' },
		{ id: '4', status: 'inactive', name: 'Eve' },
		{ id: '5', status: 'active', name: 'Alice' },
	];

	it('sorts by primary then secondary field', () => {
		const result = sortItems(data, [
			{ field: 'status', direction: 'asc' },
			{ field: 'name', direction: 'asc' },
		]);
		expect(result.map(r => r.id)).toEqual(['5', '3', '1', '2', '4']);
	});

	it('sorts by primary desc then secondary asc', () => {
		const result = sortItems(data, [
			{ field: 'status', direction: 'desc' },
			{ field: 'name', direction: 'asc' },
		]);
		expect(result.map(r => r.id)).toEqual(['2', '4', '5', '3', '1']);
	});

	it('single SortBy still works (backward compat)', () => {
		const result = sortItems(data, { field: 'name', direction: 'asc' });
		expect(result.map(r => r.name)).toEqual(['Alice', 'Alice', 'Bob', 'Eve', 'Zara']);
	});

	it('nulls last in multi-sort', () => {
		const withNulls = [
			{ id: '1', status: 'active', name: 'Zara' },
			{ id: '2', status: 'active', name: null },
			{ id: '3', status: 'active', name: 'Bob' },
		];
		const result = sortItems(withNulls, [
			{ field: 'status', direction: 'asc' },
			{ field: 'name', direction: 'asc' },
		]);
		expect(result.map(r => r.id)).toEqual(['3', '1', '2']);
	});

	it('does not mutate input', () => {
		const input = [
			{ id: '1', status: 'b' },
			{ id: '2', status: 'a' },
		];
		const original = [...input];
		sortItems(input, [{ field: 'status', direction: 'asc' }]);
		expect(input).toEqual(original);
	});
});
