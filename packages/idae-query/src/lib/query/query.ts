/* src\lib\scripts\query\query.ts */
import { Operators } from '$lib/operators/operators.js';

import { getResultset } from '$lib/resultset/resultset.js';

import type { Operator, Where } from '$lib/types.js';

export class Query<T extends object> {
	data: T[];
	constructor(data: T[]) {
		this.data = data;
		getResultSet(this.data ?? []);
	}

	where(qy: Where<T>) {
		this.data = this.data.filter((item) => this.matchesQuery(item, qy));
		return getResultSet(this.data);
	}

	private matchesQuery(item: T, query: Where<T>): boolean {
		if (typeof query !== 'object' || query === null) {
			return false;
		}

		return Object.entries(query).every(([key, value]) => {
			if (Operators.operators.includes(key as Operator)) {
				return Operators.filters(key as Operator, 'eq', value, [item]).length > 0;
			} else {
				return this.matchesField(item, key as keyof T, value);
			}
		});
	}

	private matchesField(item: T, field: keyof T, condition: any): boolean {
		if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {
			return Object.entries(condition).every(
				([op, val]) => Operators.filters(field, op as Operator, val, [item]).length > 0
			);
		}
		return Operators.filters(field, 'eq', condition, [item]).length > 0;
	}
}
