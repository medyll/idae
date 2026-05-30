import { describe, it, expect } from 'vitest';
import { parseFkGroupKey, fkObjectLabel, groupItemsResolved } from './data-utils.js';

describe('parseFkGroupKey', () => {
	const fks = { appscheme_type: { code: 'appscheme_type' }, category: { code: 'category' } };

	it('extracts the relation key from the fks.<key> convention', () => {
		expect(parseFkGroupKey('fks.appscheme_type', fks)).toBe('appscheme_type');
	});

	it('handles a nested presentation path (fks.<key>.<field>)', () => {
		expect(parseFkGroupKey('fks.appscheme_type.code', fks)).toBe('appscheme_type');
	});

	it('accepts a bare key when it matches a declared FK', () => {
		expect(parseFkGroupKey('category', fks)).toBe('category');
	});

	it('returns null for a non-FK field', () => {
		expect(parseFkGroupKey('status', fks)).toBeNull();
		expect(parseFkGroupKey('name', {})).toBeNull();
	});
});

describe('fkObjectLabel', () => {
	it('reads a nested gridFks relation object (name preferred)', () => {
		const rec = { id: 1, gridFks: { appscheme_type: { id: 3, code: 'standard', name: 'Standard' } } };
		expect(fkObjectLabel(rec, 'appscheme_type')).toBe('Standard');
	});

	it('falls back code → id when name is absent', () => {
		expect(fkObjectLabel({ gridFks: { t: { code: 'c1' } } }, 't')).toBe('c1');
		expect(fkObjectLabel({ gridFks: { t: { id: 9 } } }, 't')).toBe('9');
	});

	it('accepts fks as an alias for gridFks', () => {
		expect(fkObjectLabel({ fks: { t: { name: 'X' } } }, 't')).toBe('X');
	});

	it('returns undefined for flat-stored FK values (no nested object)', () => {
		expect(fkObjectLabel({ category: 'sedan' }, 'category')).toBeUndefined();
		expect(fkObjectLabel({}, 'category')).toBeUndefined();
	});
});

describe('grouping appscheme by fks.appscheme_type (Explorer case)', () => {
	it('groups records by their embedded relation label', () => {
		const items = [
			{ id: 1, code: 'vehicle',  gridFks: { appscheme_type: { id: 1, code: 'standard', name: 'Standard' } } },
			{ id: 2, code: 'rental',   gridFks: { appscheme_type: { id: 1, code: 'standard', name: 'Standard' } } },
			{ id: 3, code: 'category', gridFks: { appscheme_type: { id: 2, code: 'type',     name: 'Type' } } },
		];
		const fkKey = parseFkGroupKey('fks.appscheme_type', { appscheme_type: { code: 'appscheme_type' } })!;
		const groups = groupItemsResolved(items, fkKey, (item) => fkObjectLabel(item, fkKey) ?? '—');

		expect([...groups.keys()]).toEqual(['Standard', 'Type']);
		expect(groups.get('Standard')!.map((r) => r.code)).toEqual(['vehicle', 'rental']);
		expect(groups.get('Type')!.map((r) => r.code)).toEqual(['category']);
	});
});
