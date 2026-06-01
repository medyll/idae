/**
 * Shared test helper — generic in-memory collection mock.
 * Each test file can extend the base with collection-specific methods.
 */

export interface BaseMockCollection<T extends { id: string }> {
	docs: T[];
	getAll: () => T[];
	create: (doc: T) => Promise<T>;
	update: (id: string, data: Partial<T>) => Promise<void>;
	delete: (id: string) => Promise<void>;
}

/**
 * Create a minimal in-memory mock of a QoolieCollection.
 * Returns `{ docs, getAll, create, update, delete }`.
 * Extend with collection-specific methods (e.g. `where`) as needed.
 */
export function createMockCollection<T extends { id: string }>(): BaseMockCollection<T> {
	const docs: T[] = [];
	return {
		docs,
		getAll: () => [...docs],
		create: async (doc: T) => { docs.push(doc); return doc; },
		update: async (id: string, data: Partial<T>) => {
			const i = docs.findIndex((d) => d.id === id);
			if (i !== -1) Object.assign(docs[i], data);
		},
		delete: async (id: string) => {
			const i = docs.findIndex((d) => d.id === id);
			if (i !== -1) docs.splice(i, 1);
		},
	};
}
