import { Model, Document, type FilterQuery, type UpdateQuery } from 'mongoose';
import { getModel } from './tools';
import { type RequestParams, type SortOptions } from './types';

// Interface for database adapters
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
class MongoDBAdapter<T extends Document> implements DatabaseAdapter<T> {
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

// Main DBaseService class
class DBaseService<T extends Document> {
	private adapter: DatabaseAdapter<T>;

	constructor(collection: string, dbType: 'mongodb' | 'mysql' = 'mongodb') {
		switch (dbType) {
			case 'mongodb':
				this.adapter = new MongoDBAdapter<T>(collection);
				break;
			case 'mysql':
				// TODO: Implement MySQL adapter
				throw new Error('MySQL adapter not implemented yet');
			default:
				throw new Error(`Unsupported database type: ${dbType}`);
		}
	}

	async create(document: Partial<T>): Promise<T> {
		return this.adapter.create(document);
	}

	async findAll(params: RequestParams): Promise<T[]> {
		return this.adapter.findAll(params);
	}

	async findById(id: string): Promise<T | null> {
		return this.adapter.findById(id);
	}

	async findOne(params: RequestParams): Promise<T | null> {
		return this.adapter.findOne(params);
	}

	async update(id: string, updateData: Partial<T>): Promise<T | null> {
		return this.adapter.update(id, updateData);
	}

	async deleteById(id: string): Promise<T | null> {
		return this.adapter.deleteById(id);
	}

	async deleteManyByQuery(params: RequestParams): Promise<{ deletedCount?: number }> {
		return this.adapter.deleteManyByQuery(params);
	}

	decodeUrlParams(urlParams: string): RequestParams {
		const params: RequestParams = {};
		const urlParamsArray = urlParams.split('&');
		urlParamsArray.forEach((param) => {
			const [key, value] = param.split('=');
			if (key && value) {
				try {
					params[key] = JSON.parse(decodeURIComponent(value));
				} catch (error) {
					params[key] = decodeURIComponent(value);
				}
			}
		});
		return params;
	}
}

export { DBaseService };
