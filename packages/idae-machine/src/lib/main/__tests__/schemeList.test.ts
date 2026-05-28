import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme } from '../../demo/demoScheme.js';
import { machine } from '../machine.js';

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

describe('SchemeList logic', () => {
	let m: Machine;

	beforeEach(async () => {
		resetIndexedDB();
		m = await createStartedMachine(uniqueDbName('schemelist'));
	});

	afterEach(() => {
		_dbCounter = 0;
	});

	describe('collections()', () => {
		it('returns all collections from the schema', () => {
			const cols = m.logic.collections();
			expect(cols.length).toBeGreaterThan(0);
			const names = cols.map(c => c.collection ?? c.name);
			expect(names).toContain('vehicle');
			expect(names).toContain('category');
		});
	});

	describe('grouping by type', () => {
		it('groups collections by isType/isGroup/standard', () => {
			const schemes = m.logic.collections();
			const grouped: Record<string, string[]> = {};

			for (const scheme of schemes) {
				const colName = scheme.collection ?? scheme.name;
				if (!colName) continue;
				const type = (scheme as any).model?.isType ? 'type'
					: (scheme as any).model?.isGroup ? 'group'
					: 'standard';
				if (!grouped[type]) grouped[type] = [];
				grouped[type].push(colName);
			}

			expect(grouped).toHaveProperty('standard');
			expect(grouped.standard.length).toBeGreaterThan(0);
		});
	});

	describe('RBAC filtering', () => {
		it('checkAccess returns boolean for collections', () => {
			const hasAccess = machine.rights.checkAccess('vehicle', 'R');
			expect(typeof hasAccess).toBe('boolean');
		});
	});

	describe('search filtering', () => {
		it('filters collections by query string', () => {
			const schemes = m.logic.collections();
			const query = 'veh';
			const filtered = schemes.filter(s => {
				const name = s.collection ?? s.name;
				return name && name.toLowerCase().includes(query.toLowerCase());
			});
			expect(filtered.length).toBeGreaterThan(0);
			expect(filtered[0].collection).toBe('vehicle');
		});
	});
});
