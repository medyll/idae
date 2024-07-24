import { describe, it, expect } from 'vitest';
import { Query } from './query.js';

describe('Query.where', () => {
	const data = [
		{ id: 1, value: 10 },
		{ id: 2, value: 20 },
		{ id: 3, value: 30 }
	];

	it('filters data based on "eq" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { eq: 20 } });
		expect([...result]).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters data based on "gt" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { gt: 10 } });
		expect([...result]).toEqual([
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters data based on "gte" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { gte: 20 } });
		expect([...result]).toEqual([
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters data based on "in" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { in: [10, 30] } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters data based on "nin" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { nin: [10, 30] } });
		expect([...result]).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters data based on "lt" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { lt: 30 } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 }
		]);
	});

	it('filters data based on "lte" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { lte: 20 } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 }
		]);
	});

	it('filters data based on "ne" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { ne: 20 } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters data based on "contains" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { contains: '0' } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});

	it('filters data based on "startsWith" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { startsWith: '2' } });
		expect([...result]).toEqual([{ id: 2, value: 20 }]);
	});

	it('filters data based on "endsWith" operator', () => {
		const query = new Query(data);
		const result = query.where({ value: { endsWith: '0' } });
		expect([...result]).toEqual([
			{ id: 1, value: 10 },
			{ id: 2, value: 20 },
			{ id: 3, value: 30 }
		]);
	});
});
