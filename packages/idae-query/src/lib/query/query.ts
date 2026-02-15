/* src\lib\scripts\query\query.ts */
import { Operators } from '$lib/operators/operators.js';

import { getResultSet, type ResultSet } from '$lib/resultset/resultset.js';

import type { Operator, Where } from '$lib/types.js';

export class Query<T extends object> {
	data: T[];
	constructor(data: T[]) {
		this.data = data;
		getResultSet(this.data ?? []);
	}

	where(qy: Where<T>): ResultSet<T> {
		this.data = this.data.filter((item) => this.matchesQuery(item, qy));
		return getResultSet(this.data);
	}

	private matchesQuery(item: T, query: Where<T>): boolean {
		if (typeof query !== 'object' || query === null) {
			return false;
		}

		return Object.entries(query).every(([key, value]) => {
			const keyNorm = typeof key === 'string' && key.startsWith('$') ? (key.slice(1) as Operator) : (key as Operator);
			if (Operators.operators.includes(keyNorm)) {
				return Operators.filters(keyNorm, 'eq', value, [item]).length > 0;
			} else {
				return this.matchesField(item, key as keyof T, value);
			}
		});
	}

	private matchesField(item: T, field: keyof T, condition: any): boolean {
		if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
			return Object.entries(condition).every(([op, val]) => {
				const opNorm = typeof op === 'string' && op.startsWith('$') ? (op.slice(1) as Operator) : (op as Operator);
				return Operators.filters(field, opNorm, val, [item]).length > 0;
			});
		}
		return Operators.filters(field, 'eq', condition, [item]).length > 0;
	}
}
