// packages\idae-api\src\lib\adapters\MongoDBAdapter.ts

import type { ApiServerRequestParams, SortOptions } from '$lib/server/engine/types';
import type { Model, FilterQuery, UpdateQuery, Document } from 'mongoose';
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';

// Load environment variables
dotenv.config();

// MongoDB Adapter
export class MongoDBAdapter<T extends Document> implements DatabaseAdapter<T> {
	private model: Model<T>;
	private connection: mongoose.Connection;

	constructor(collection: string, connection: mongoose.Connection) {
		// just in case
		collection = collection.split('.')[1] ?? collection.split('.')[0];

		this.connection = connection;
		this.model = this.getModel<T>(collection);
	}

	async create(document: Partial<T>): Promise<T> {
		const newDocument = new this.model(document);
		return newDocument.save();
	}

	async where(params: ApiServerRequestParams): Promise<T[]> {
		const { query = {}, sortBy, limit, skip } = params;
		const sortOptions: SortOptions = this.parseSortOptions(sortBy);

		return this.model
			.find(query as FilterQuery<T>)
			.sort(sortOptions)
			.limit(Number(limit) || 0)
			.skip(Number(skip) || 0);
	}

	async findById(id: string): Promise<T | null> {
		return this.model.findById(id);
	}

	async findOne(params: ApiServerRequestParams): Promise<T | null> {
		return this.model.findOne(params.query as FilterQuery<T>);
	}

	async update(id: string, updateData: Partial<T>): Promise<T | null> {
		return this.model.findByIdAndUpdate(id, updateData as UpdateQuery<T>, { new: true });
	}

	async deleteById(id: string): Promise<T | null> {
		return this.model.findByIdAndDelete(id);
	}

	async deleteManyByQuery(params: ApiServerRequestParams): Promise<{ deletedCount?: number }> {
		const result = await this.model.deleteMany(params.query as FilterQuery<T>);
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

	setModel(collection: string) {
		const schema = new Schema({}, { strict: false });
		return this.connection.model<T>(collection, schema, collection);
	}

	getModel = <T extends Document>(collectionName: string): Model<T> => {
		if (this.connection.models[collectionName]) {
			return this.connection.model(collectionName) as Model<T>;
		} else {
			return this.setModel(collectionName) as unknown as Model<T>;
		}
	};
}
