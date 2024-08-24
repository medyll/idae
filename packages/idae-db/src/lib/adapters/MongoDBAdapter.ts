// packages\idae-db\src\lib\adapters\MongoDBAdapter.ts

import dotenv from 'dotenv';
import {
	type IdaeDbParams,
	type IdaeDbParamsSortOptions,
	AbstractIdaeDbAdapter
} from '../@types/types.js';

import {
	type Filter,
	type UpdateOptions,
	type IndexSpecification,
	type CreateIndexesOptions,
	type Document,
	ClientSession,
	MongoClient,
	Db
} from 'mongodb';
import { IdaeDbConnection } from '../IdaeDbConnection.js';
import { IdaeDBModel } from '../IdaeDBModel.js';

// Load environment variables
dotenv.config();

// MongoDB Adapter
export class MongoDBAdapter<T extends Document> implements AbstractIdaeDbAdapter<T> {
	private model: IdaeDBModel<T>;
	private connection: IdaeDbConnection;
	private fieldId: string;

	constructor(collection: string, connection: IdaeDbConnection) {
		// just in case
		collection = collection.split('.')[1] ?? collection.split('.')[0];

		this.connection = connection;
		this.model = this.connection.getModel<T>(collection);
		this.fieldId = this.model.fieldId;
	}

	static async connect(uri: string): Promise<MongoClient> {
		const client = new MongoClient(uri);
		await client.connect();
		return client;
	}

	static getDb(client: MongoClient, dbName: string): Db {
		return client.db(dbName);
	}

	static async close(client: MongoClient): Promise<void> {
		return client.close();
	}

	async createIndex(
		fieldOrSpec: IndexSpecification,
		options?: CreateIndexesOptions
	): Promise<string> {
		return this.model.collection.createIndex(fieldOrSpec, options);
	}

	async findById(id: string) {
		return this.model.collection
			.find({ [this.fieldId]: id }, { hint: this.fieldId })
			.toArray() as unknown as T[];
	}

	async find(params: IdaeDbParams<T>): Promise<T[]> {
		const { query = {}, sortBy, limit, skip } = params;
		const sortOptions: IdaeDbParamsSortOptions = this.parseSortOptions(sortBy);

		return (await this.model.collection
			.find(query as Filter<T>)
			.sort(sortOptions)
			.limit(Number(limit) || 0)
			.skip(Number(skip) || 0)
			.toArray()) as T[];
	}

	async findOne(params: IdaeDbParams<T>): Promise<T | null> {
		const result = await this.model.collection.findOne(params.query);
		return result as T | null;
	}

	async create(data: Partial<T>): Promise<T> {
		const id = await this.model.getNextIncrement();
		const result = await this.model.collection.findOneAndUpdate(
			{ [this.fieldId]: id },
			{ $set: { ...data, [this.fieldId]: id } },
			{ upsert: true, returnDocument: 'after' }
		);
		return result.value as T;
	}

	async update(id: string, updateData: Partial<T>, options?: UpdateOptions) {
		return this.model.collection.updateMany(
			{ [this.fieldId]: id },
			{ $set: { ...updateData } },
			options
		);
	}

	async updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>, options: UpdateOptions = {}) {
		return this.model.collection.updateMany(params.query, updateData, options);
	}

	async deleteById(id: string | number) {
		return this.model.collection.deleteMany({ [this.fieldId]: id });
	}

	async deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }> {
		const result = await this.model.collection.deleteMany(params.query as Filter<T>);
		return { deletedCount: result.deletedCount };
	}

	async transaction<TResult>(
		callback: (session: ClientSession) => Promise<TResult>
	): Promise<TResult> {
		const session = this.connection.getClient<MongoClient>().startSession();
		try {
			session.startTransaction();
			const result = await callback(session);
			await session.commitTransaction();
			return result;
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			await session.endSession();
		}
	}

	private parseSortOptions(sortBy?: string): IdaeDbParamsSortOptions {
		const sortOptions: IdaeDbParamsSortOptions = {};
		if (sortBy) {
			const sortFields = sortBy.split(',');
			sortFields.forEach((field) => {
				const [key, order] = field.split(':');
				sortOptions[key] = order === 'desc' ? -1 : 1;
			});
		}
		return sortOptions;
	}
}
