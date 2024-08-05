// packages\idae-api\src\lib\engine\DBaseService.ts
import mongoose, { type Document } from 'mongoose';
import { type ApiServerRequestParams } from '../engine/types';
import { MongoDBAdapter } from '$lib/server/adapters/MongoDBAdapter';
import type { DatabaseAdapter } from '$lib/server/adapters/types';

class DBaseService<T extends Document> {
	private adapter: DatabaseAdapter<T>;

	constructor(
		collection: string,
		connection: mongoose.Connection,
		dbType: 'mongodb' | 'mysql' | 'mariadb' | 'postgres' = 'mongodb'
	) {
		switch (dbType) {
			case 'mongodb':
				this.adapter = new MongoDBAdapter<T>(collection, connection);
				break;
			case 'mysql':
			case 'mariadb':
				// TODO: Implement MySQL adapter
				throw new Error('MySQL adapter not implemented yet');
			case 'postgres':
				// TODO: Implement postgres adapter
				throw new Error('Postgres adapter not implemented yet');
			default:
				console.log('dbType', dbType);
				throw new Error(`Unsupported database type: ${dbType}`);
		}
	}

	async create(document: Partial<T>): Promise<T> {
		return this.adapter.create(document);
	}

	async where(params: ApiServerRequestParams): Promise<T[]> {
		console.log('where', params);
		return this.adapter.where(params);
	}

	async findById(id: string): Promise<T | null> {
		return this.adapter.findById(id);
	}

	async findOne(params: ApiServerRequestParams): Promise<T | null> {
		return this.adapter.findOne(params);
	}

	async update(id: string, updateData: Partial<T>): Promise<T | null> {
		return this.adapter.update(id, updateData);
	}

	async deleteById(id: string): Promise<T | null> {
		return this.adapter.deleteById(id);
	}

	async deleteManyByQuery(params: ApiServerRequestParams): Promise<{ deletedCount?: number }> {
		return this.adapter.deleteManyByQuery(params);
	}

	decodeUrlParams(urlParams: string): ApiServerRequestParams {
		const params: ApiServerRequestParams = {};
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
