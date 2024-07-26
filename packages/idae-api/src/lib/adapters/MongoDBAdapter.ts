// packages\idae-api\src\lib\adapters\MongoDBAdapter.ts
import { getModel } from '$lib/engine/tools';
import type { RequestParams, SortOptions } from '$lib/engine/types';
import type { Model, FilterQuery, UpdateQuery, Document } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface DatabaseAdapter<T extends Document> {
	create(document: Partial<T>): Promise<T>;
	findAll(params: RequestParams): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	findOne(params: RequestParams): Promise<T | null>;
	update(id: string, updateData: Partial<T>): Promise<T | null>;
	deleteById(id: string): Promise<T | null>;
	deleteManyByQuery(params: RequestParams): Promise<{ deletedCount?: number }>;
}

// MongoDB Adapter
export class MongoDBAdapter<T extends Document> implements DatabaseAdapter<T> {
	private model: Model<T>;

	constructor(collection: string) {
		this.model = getModel<T>(collection);
	}

	async create(document: Partial<T>): Promise<T> {
		const newDocument = new this.model(document);
		return newDocument.save();
	}

	async findAll(params: RequestParams): Promise<T[]> {
		const { query = {}, sortBy, limit, skip } = params;
		const sortOptions: SortOptions = this.parseSortOptions(sortBy);

		return this.model
			.find(query as FilterQuery<T>)
			.sort(sortOptions)
			.limit(Number(limit) || 0)
			.skip(Number(skip) || 0)
			.exec();
	}

	async findById(id: string): Promise<T | null> {
		return this.model.findById(id).exec();
	}

	async findOne(params: RequestParams): Promise<T | null> {
		return this.model.findOne(params.query as FilterQuery<T>).exec();
	}

	async update(id: string, updateData: Partial<T>): Promise<T | null> {
		return this.model.findByIdAndUpdate(id, updateData as UpdateQuery<T>, { new: true }).exec();
	}

	async deleteById(id: string): Promise<T | null> {
		return this.model.findByIdAndDelete(id).exec();
	}

	async deleteManyByQuery(params: RequestParams): Promise<{ deletedCount?: number }> {
		const result = await this.model.deleteMany(params.query as FilterQuery<T>).exec();
		return { deletedCount: result.deletedCount };
	}

	private parseSortOptions(sortBy?: string): SortOptions {
		const sortOptions: SortOptions = {};
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

// MongoDB configuration
const MONGODB_DEFAULT_DB = process.env.MONGODB_DEFAULT_DB || 'default_database';
const MONGODB_DEFAULT_PORT = process.env.MONGODB_DEFAULT_PORT || '27017';
const MONGODB_DEFAULT_HOST = process.env.MONGODB_DEFAULT_HOST || 'localhost';
const MONGODB_DEFAULT_CONNECTION_PREFIX =
	process.env.MONGODB_DEFAULT_CONNECTION_PREFIX || 'mongodb://';

// Construct MongoDB URI
const MONGODB_URI = `${MONGODB_DEFAULT_CONNECTION_PREFIX}${MONGODB_DEFAULT_HOST}:${MONGODB_DEFAULT_PORT}/${MONGODB_DEFAULT_DB}`;

const MONGODB_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true
	// Add other MongoDB connection options if needed
};

// Export configurations for use elsewhere in the application
export {
	MONGODB_URI,
	MONGODB_OPTIONS,
	MONGODB_DEFAULT_DB,
	MONGODB_DEFAULT_PORT,
	MONGODB_DEFAULT_HOST,
	MONGODB_DEFAULT_CONNECTION_PREFIX
};
