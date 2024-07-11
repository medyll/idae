/* D:\boulot\app-node\idbql\src\lib\scripts\operators\operators.ts */
import { type Operator, type OperatorType, type Where } from '$lib/types.js';

export class Operators {
	static operators: (keyof OperatorType)[] = [
		'eq',
		'gt',
		'gte',
		'lt',
		'lte',
		'ne',
		'in',
		'nin',
		'contains',
		'startsWith',
		'endsWith',
		'btw'
	];

	static #operatorsFunctions: Record<
		keyof OperatorType,
		(fieldName: any, value: any, data: any) => boolean
	> = {
		eq: this.#equalityComparison,
		gt: this.#greaterThanComparison,
		gte: this.#greaterThanOrEqualComparison,
		in: this.#inclusionComparison,
		nin: this.#exclusionComparison,
		lt: this.#lessThanComparison,
		lte: this.#lessThanOrEqualComparison,
		ne: this.#notEqualComparison,
		contains: this.#containsComparison,
		startsWith: this.#startsWithComparison,
		endsWith: this.#endsWithComparison,
		btw: this.#betweenComparison
	};

	static parse<T extends object>(data: T[], qy: Where<T>) {
		return data.filter((dt) => {
			for (const fieldName in qy) {
				const query = qy[fieldName];
				if (
					typeof query === 'object' &&
					Operators.operators.includes(Object.keys(query)[0] as Operator)
				) {
					for (const key in query) {
						if (Operators.operators.includes(key as Operator)) {
							const operator = key as Operator;
							let value = query[key as Operator];

							// Convertir en Set pour 'in' et 'nin'
							if (operator === 'in' || operator === 'nin') {
								value = new Set(value);
							}

							return this.#operatorsFunctions[operator](fieldName, value, dt);
						}
					}
				} else {
					return dt[fieldName] == query;
				}
			}
		});
	}

	static filters<F extends object>(
		fieldName: keyof F | Operator,
		operator: keyof OperatorType,
		value: OperatorType[typeof operator],
		data: F[]
	) {
		// Utilisation de Set pour 'in' et 'nin'
		if (operator === 'in' || operator === 'nin') {
			value = new Set(value as any[]);
		}

		// Gestion des cas où fieldName est un opérateur (pour les nouvelles formes de requête)
		if (this.operators.includes(fieldName as Operator)) {
			return data.filter((item) =>
				this.#applyOperatorToObject(fieldName as Operator, value as any, item)
			);
		}

		return data.filter((dta) => this.#operatorsFunctions[operator](fieldName, value, dta));
	}

	static #applyOperatorToObject<F extends object>(
		operator: Operator,
		conditions: Partial<F>,
		item: F
	): boolean {
		for (const field in conditions) {
			if (!this.#operatorsFunctions[operator](field as keyof F, conditions[field], item)) {
				return false;
			}
		}
		return true;
	}
	static #equalityComparison<T extends object>(fieldName: keyof T, value: any, data: T): boolean {
		if (!(fieldName in data)) {
			console.warn(`Field "${String(fieldName)}" not found in data`);
			return false;
		}

		const dataValue = data[fieldName];
		if (typeof dataValue === 'string' && typeof value === 'string') {
			const valueStr = value.toString();
			const startsWith = valueStr.startsWith('*');
			const endsWith = valueStr.endsWith('*');

			if (startsWith && endsWith) {
				return dataValue.includes(valueStr.slice(1, -1));
			} else if (startsWith) {
				return dataValue.endsWith(valueStr.slice(1));
			} else if (endsWith) {
				return dataValue.startsWith(valueStr.slice(0, -1));
			}
		}

		return dataValue === value;
	}

	static addCustomOperator(
		operatorName: string,
		operatorFunction: <T extends object>(fieldName: keyof T, value: any, data: T) => boolean
	) {
		if (this.operators.includes(operatorName as Operator)) {
			console.warn(`Operator "${operatorName}" already exists. It will be overwritten.`);
		}
		this.operators.push(operatorName as Operator);
		this.#operatorsFunctions[operatorName] = operatorFunction;
	}

	static #greaterThanComparison<T>(fieldName: keyof T, value: any, data: T) {
		return value < data[fieldName];
	}

	static #greaterThanOrEqualComparison<T>(fieldName: keyof T, value: any, data: T) {
		return value <= data[fieldName];
	}
	/**
	 * Checks if the field value is in the given set.
	 * @param fieldName - The name of the field to check
	 * @param value - A Set of values to check against
	 * @param data - The object containing the field
	 * @returns {boolean} - True if the field value is in the set, false otherwise
	 */
	static #inclusionComparison<T extends object>(fieldName: keyof T, value: Set<any>, data: T) {
		return value.has(data[fieldName]);
	}

	/**
	 * Checks if the field value is not in the given set.
	 * @param fieldName - The name of the field to check
	 * @param value - A Set of values to check against
	 * @param data - The object containing the field
	 * @returns {boolean} - True if the field value is not in the set, false otherwise
	 */
	static #exclusionComparison<T extends object>(fieldName: keyof T, value: Set<any>, data: T) {
		return !value.has(data[fieldName]);
	}

	static #lessThanComparison<T>(fieldName: keyof T, value: any, data: T) {
		return value > data[fieldName];
	}

	static #lessThanOrEqualComparison<T>(fieldName: keyof T, value: any[], data: T) {
		return value >= data[fieldName];
	}

	static #notEqualComparison<T>(fieldName: keyof T, value: any[], data: T) {
		return value !== data[fieldName];
	}

	static #containsComparison<T>(fieldName: keyof T, value: any, data: T) {
		return `${data[fieldName]}`.includes(value);
	}

	static #startsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
		return `${data[fieldName]}`.startsWith(value);
	}

	static #endsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
		return `${data[fieldName]}`.endsWith(value);
	}

	static #betweenComparison<T extends object>(
		fieldName: keyof T,
		value: [number, number],
		data: T
	): boolean {
		if (!(fieldName in data)) {
			console.warn(`Field "${String(fieldName)}" not found in data`);
			return false;
		}

		const fieldValue = data[fieldName] as unknown as number;
		if (typeof fieldValue !== 'number') {
			console.warn(`Field "${String(fieldName)}" is not a number`);
			return false;
		}

		const [min, max] = value;
		return fieldValue >= min && fieldValue <= max;
	}
}
