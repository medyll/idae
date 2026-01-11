import type { IdaeDbAdapterInterface, IdaeDbParams } from '../../src/lib/@types/types.js';
import { IdaeDbConnection } from '../../src/lib/IdaeDbConnection.js';

/**
 * Mock adapter for testing event system and adapter facade
 */
export class MockAdapter<T extends object = any> implements IdaeDbAdapterInterface<T> {
	private data: Map<string, T> = new Map();
	private idCounter: number = 1;

	constructor(
		private collection: string,
		private connection: IdaeDbConnection
	) {}

	static async connect(uri: string) {
		return { mock: true };
	}

	static getDb(client: any, dbName: string) {
		return { db: dbName };
	}

	static async close() {
		// no-op
	}

	async createIndex<F, O>(fieldOrSpec: F, options?: O) {
		return `index_${String(fieldOrSpec)}`;
	}

	async create(data: Partial<T>): Promise<T> {
		const id = String(this.idCounter++);
		const doc = { ...data, _id: id } as T;
		this.data.set(id, doc);
		return doc;
	}

	async findById(id: string): Promise<T | null> {
		return this.data.get(id) || null;
	}

	async find(params: IdaeDbParams<T>): Promise<T[]> {
		const results = Array.from(this.data.values());

		// Apply limit and skip if provided
		let filtered = results;
		if (params.skip) {
			filtered = filtered.slice(params.skip);
		}
		if (params.limit) {
			filtered = filtered.slice(0, params.limit);
		}

		return filtered;
	}

	async findOne(params: IdaeDbParams<T>): Promise<T | null> {
		const results = await this.find(params);
		return results.length > 0 ? results[0] : null;
	}

	async update(id: string, updateData: Partial<T>): Promise<any> {
		const existing = this.data.get(id);
		if (!existing) {
			throw new Error(`Document ${id} not found`);
		}
		const updated = { ...existing, ...updateData };
		this.data.set(id, updated);
		return { modifiedCount: 1 };
	}

	async updateWhere<OPT = any>(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options?: OPT
	): Promise<any> {
		const docs = await this.find(params);
		docs.forEach((doc: any) => {
			const id = doc._id || doc.id;
			const updated = { ...doc, ...updateData };
			this.data.set(String(id), updated);
		});
		return { modifiedCount: docs.length };
	}

	async deleteById(id: string): Promise<any> {
		if (!this.data.has(id)) {
			throw new Error(`Document ${id} not found`);
		}
		this.data.delete(id);
		return { deletedCount: 1 };
	}

	async deleteWhere(params: IdaeDbParams<T>): Promise<any> {
		const docs = await this.find(params);
		docs.forEach((doc: any) => {
			const id = doc._id || doc.id;
			this.data.delete(String(id));
		});
		return { deletedCount: docs.length };
	}

	async transaction<TResult>(callback: (session: any) => Promise<TResult>): Promise<TResult> {
		// Mock transaction - just execute callback
		return callback({ transactionId: 'mock-txn' });
	}

	// Test helper methods
	clear() {
		this.data.clear();
		this.idCounter = 1;
	}

	getAll() {
		return Array.from(this.data.values());
	}
}
