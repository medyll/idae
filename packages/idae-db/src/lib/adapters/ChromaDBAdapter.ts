import {
	Collection,
	type ChromaClient,
	type AddParams,
	type Metadata,
	type UpdateParams,
	type Documents,
	type Embeddings,
	type ID
} from 'chromadb';
import type { IdaeDbParams, AbstractIdaeDbAdapter } from '../@types/types.js';
import { IdaeDbConnection } from '../IdaeDbConnection.js';

type ChromaDBAdapterContent = {
	id: ID;
	embeddings: Embeddings;
	metadatas: Metadata;
	documents: Documents;
};
export class ChromaDBAdapter<T extends ChromaDBAdapterContent> implements AbstractIdaeDbAdapter<T> {
	private collection!: Collection;
	private client: ChromaClient;

	constructor(
		private collectionName: string,
		private connection: IdaeDbConnection
	) {
		this.client = this.connection.getDb() as ChromaClient;
		this._init();
	}

	private async _init() {
		this.collection = await this.client.getOrCreateCollection({ name: this.collectionName });
	}

	async create(data: AddParams): Promise<T> {
		const { embeddings, metadatas, documents } = data;
		const itemId = data.ids || crypto.randomUUID();
		await this.collection.add({
			ids: [itemId],
			embeddings: [embeddings],
			metadatas: [metadatas],
			documents: [documents]
		});
		return { ...data, id: itemId } as T;
	}

	async findById(id: string): Promise<T[]> {
		const result = await this.collection.get([id]);
		return result as unknown as T[];
	}

	async find(params: IdaeDbParams<T>): Promise<T[]> {
		const { query = {}, limit } = params;
		const results = await this.collection.query(query.vector || [], limit);
		return results as unknown as T[];
	}

	async findOne(params: IdaeDbParams<T>): Promise<T | null> {
		const results = await this.find({ ...params, limit: 1 });
		return results.length > 0 ? results[0] : null;
	}

	async update(id: string, updateData: UpdateParams): Promise<T> {
		await this.collection.update(updateData);
		return updateData as T;
	}

	async updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>): Promise<T[]> {
		throw new Error('updateWhere not supported in ChromaDB');
	}

	async createIndex(field: unknown, opt: unknown): Promise<T[]> {
		throw new Error(`updateWhere not supported in ChromaDB ${field} ${opt}`);
	}

	async deleteById(id: string | string[]): Promise<boolean> {
		if (typeof id === 'string') {
			await this.collection.delete({ ids: [id] });
		} else {
			await this.collection.delete({ ids: id });
		}
		return true;
	}

	async deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount: number }> {
		throw new Error('deleteWhere not supported in ChromaDB');
	}

	// Specific methods for ChromaDB
	/* 	async addItem(ids: string, vector: number[], metadata?: object): Promise<void> {
		await this.collection.add({ ids, vector, metadata });
	} */

	async similaritySearch(vector: number[], k: number = 10): Promise<T[]> {
		const results = await this.collection.query(vector, k);
		return results as unknown as T[];
	}
}
