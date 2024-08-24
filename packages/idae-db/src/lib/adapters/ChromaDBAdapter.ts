// packages/idae-db/lib/adapters/ChromaDBAdapter.ts

import { Collection, type Document, type ChromaClient } from 'chromadb';
import type { IdaeDbParams, IdaeDbAdapterInterfaceNext } from '../@types/types.js';
import { IdaeDbConnection } from '../IdaeDbConnection.js';

export class ChromaDBAdapter<T extends Document = Document>
	implements IdaeDbAdapterInterfaceNext<T>
{
	private collection!: Collection;
	private client: ChromaClient;

	constructor(
		private collectionName: string,
		private connection: IdaeDbConnection
	) {
		this.client = this.connection.getDb() as ChromaClient; // Assuming getDb() returns ChromaClient
		return this._init();
	}

	private _init() {
		this.collection = this.client
			.getOrCreateCollection({ name: this.collectionName })
			.then((collection) => {
				return collection;
			});
		return this;
	}

	async create(data: Partial<T>) {
		const { id, vector, metadata } = data;
		return this.collection.add(id, vector, metadata);
	}

	async findById(id: string) {
		return this.collection.get([id]);
	}

	async find(params: IdaeDbParams<T>) {
		const { query = {}, limit } = params;
		// ChromaDB uses vector similarity search, so we need to adapt the query
		// This is a simplified example and may need to be adjusted based on your specific use case
		return this.collection.query(query.vector || [], limit);
	}

	async findOne(params: IdaeDbParams<T>) {
		const results = await this.find({ ...params, limit: 1 });
		return results.length > 0 ? results[0] : null;
	}

	async update(id: string, updateData: Partial<T>) {
		// ChromaDB doesn't have a direct update method, so we need to delete and re-add
		await this.deleteById(id);
		return this.collection.add(id, updateData.vector, updateData.metadata);
	}

	async updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>) {
		throw new Error('updateWhere not supported in ChromaDB');
	}

	async deleteById(id: string) {
		return this.collection.delete([id]);
	}

	async deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }> {
		throw new Error('deleteWhere not supported in ChromaDB');
	}

	// Additional ChromaDB specific methods
	async addItem(id: string, vector: number[], metadata?: object) {
		return this.collection.add(id, vector, metadata);
	}

	async similaritySearch(vector: number[], k: number = 10) {
		return this.collection.query(vector, k);
	}
}
