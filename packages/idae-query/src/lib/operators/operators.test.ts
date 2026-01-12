import { describe, it, expect } from 'vitest';
import { Operators } from './operators.js';

describe('Operators.filters', () => {
	const data = [
		{ id: 1, value: 10 },
		{ id: 2, value: 20 },
		{ id: 3, value: 30 }
	];

	it('filters with "eq" operator', () => {
		const result = Operators.filters('value', 'eq', 20, data);
		expect(result).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters with "gt" operator', () => {
		const result = Operators.filters('value', 'gt', 10, data);
		expect(result).toEqual([
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters with "gte" operator', () => {
		const result = Operators.filters('value', 'gte', 20, data);
		expect(result).toEqual([
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters with "in" operator', () => {
		const result = Operators.filters('value', 'in', [10, 30], data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters with "nin" operator', () => {
		const result = Operators.filters('value', 'nin', [10, 30], data);
		expect(result).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters with "lt" operator', () => {
		const result = Operators.filters('value', 'lt', 30, data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 }
		]);
	});

	it('filters with "lte" operator', () => {
		const result = Operators.filters('value', 'lte', 20, data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 }
		]);
	});

	it('filters with "ne" operator', () => {
		const result = Operators.filters('value', 'ne', 20, data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters with "contains" operator', () => {
		const result = Operators.filters('value', 'contains', '0', data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters with "startsWith" operator', () => {
		const result = Operators.filters('value', 'startsWith', '2', data);
		expect(result).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters with "endsWith" operator', () => {
		const result = Operators.filters('value', 'endsWith', '0', data);
		expect(result).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});
});

describe('Operators - branches et custom', () => {
	const data = [
		{ id: 1, name: 'alpha' },
		{ id: 2, name: 'beta' },
		{ id: 3, name: 'alphabet' },
	];

	it('equalityComparison with wildcards *abc*', () => {
		const result = Operators.filters('name', 'eq', '*alph*', data);
		expect(result).toEqual([
			{ id: 1, name: 'alpha' },
			{ id: 3, name: 'alphabet' },
		]);
	});

	it('equalityComparison with wildcards *abc', () => {
		const result = Operators.filters('name', 'eq', '*bet', data);
		expect(result).toEqual([{ id: 3, name: 'alphabet' }]);
	});

	it('equalityComparison with wildcards abc*', () => {
		const result = Operators.filters('name', 'eq', 'alph*', data);
		expect(result).toEqual([
			{ id: 1, name: 'alpha' },
			{ id: 3, name: 'alphabet' },
		]);
	});

	it('returns empty if field does not exist', () => {
		const result = Operators.filters('unknown', 'eq', 'test', data);
		expect(result).toEqual([]);
	});

	it('applyOperatorToObject with multiple fields', () => {
		const multi = [
			{ a: 1, b: 2 },
			{ a: 2, b: 2 },
			{ a: 1, b: 3 },
		];
		const result = Operators.filters('eq', 'eq', { a: 1, b: 2 }, multi);
		expect(result).toEqual([{ a: 1, b: 2 }]);
	});

	it('addCustomOperator and overwrite', () => {
		let called = false;
		Operators.addCustomOperator('custom', (field, value, data) => {
			called = true;
			return data[field] === value;
		});
		const result = Operators.filters('field', 'custom', 'x', [{ field: 'x' }, { field: 'y' }]);
		expect(result).toEqual([{ field: 'x' }]);
		expect(called).toBe(true);

		// Overwrite
		Operators.addCustomOperator('custom', () => false);
		const result2 = Operators.filters('field', 'custom', 'x', [{ field: 'x' }]);
		expect(result2).toEqual([]);
	});
});
