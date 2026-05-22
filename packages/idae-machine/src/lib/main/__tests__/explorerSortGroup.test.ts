import { describe, it, expect } from 'vitest';
import { sortItems, groupItems } from '../../shell/frame/explorerUtils.js';

describe('sortItems', () => {
	const data = [
		{ id: '1', name: 'Zara', age: 30 },
		{ id: '2', name: 'Alice', age: null },
		{ id: '3', name: 'Bob', age: 25 },
	];

	it('sorts strings asc', () => {
		const result = sortItems(data, { field: 'name', direction: 'asc' });
		expect(result.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Zara']);
	});

	it('sorts strings desc', () => {
		const result = sortItems(data, { field: 'name', direction: 'desc' });
		expect(result.map((r) => r.name)).toEqual(['Zara', 'Bob', 'Alice']);
	});

	it('sorts numbers asc', () => {
		const result = sortItems(data, { field: 'age', direction: 'asc' });
		expect(result.map((r) => r.id)).toEqual(['3', '1', '2']);
	});

	it('sorts numbers desc', () => {
		const result = sortItems(data, { field: 'age', direction: 'desc' });
		expect(result.map((r) => r.id)).toEqual(['1', '3', '2']);
	});

	it('nulls last regardless of direction', () => {
		const asc = sortItems(data, { field: 'age', direction: 'asc' });
		expect(asc[asc.length - 1].id).toBe('2');

		const desc = sortItems(data, { field: 'age', direction: 'desc' });
		expect(desc[desc.length - 1].id).toBe('2');
	});

	it('does not mutate input', () => {
		const input = [
			{ id: '1', name: 'Zara' },
			{ id: '2', name: 'Alice' },
		];
		const original = [...input];
		sortItems(input, { field: 'name', direction: 'asc' });
		expect(input).toEqual(original);
	});

	it('returns new array', () => {
		const result = sortItems(data, { field: 'name', direction: 'asc' });
		expect(result).not.toBe(data);
	});

	it('empty array returns empty array', () => {
		const result = sortItems([], { field: 'name', direction: 'asc' });
		expect(result).toEqual([]);
	});
});

describe('groupItems', () => {
	const data = [
		{ id: '1', name: 'Zara', status: 'active' },
		{ id: '2', name: 'Alice', status: 'inactive' },
		{ id: '3', name: 'Bob', status: 'active' },
		{ id: '4', name: 'Eve', status: null },
	];

	it('groups by string field', () => {
		const result = groupItems(data, 'status');
		expect(result.size).toBe(3);
		expect(result.get('active')?.map((r) => r.id)).toEqual(['1', '3']);
		expect(result.get('inactive')?.map((r) => r.id)).toEqual(['2']);
	});

	it('null/undefined → group em dash', () => {
		const result = groupItems(data, 'status');
		const emDash = '\u2014';
		expect(result.has(emDash)).toBe(true);
		expect(result.get(emDash)?.map((r) => r.id)).toEqual(['4']);
	});

	it('preserves insertion order of groups', () => {
		const result = groupItems(data, 'status');
		const keys = Array.from(result.keys());
		expect(keys).toEqual(['active', 'inactive', '\u2014']);
	});

	it('preserves item order within group', () => {
		const result = groupItems(data, 'status');
		const active = result.get('active');
		expect(active?.map((r) => r.id)).toEqual(['1', '3']);
	});

	it('empty array returns empty Map', () => {
		const result = groupItems([], 'status');
		expect(result.size).toBe(0);
	});
});
