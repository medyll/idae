// lib/IdaeDbAdapter.ts

import { DbType, type IdaeDbParams } from './types.js';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import { MongoDBAdapter } from './adapters/MongoDBAdapter.js';
import { MySQLAdapter } from './adapters/MySQLAdapter.js';
import { ChromaDBAdapter } from './adapters/ChromaDBAdapter.js';
import { IdaeEventEmitter, withEmitter, type EventListeners } from './IdaeEventEmitter.js';

export class IdaeDbAdapter<T extends Document> extends IdaeEventEmitter {
	private adapter: MongoDBAdapter<T> | MySQLAdapter<T> | ChromaDBAdapter<T> | any;

	constructor(
		collection: string,
		connection: IdaeDbConnection,
		private dbType: DbType
	) {
		super();
		switch (dbType) {
			case DbType.MONGODB:
				this.adapter = new MongoDBAdapter<T>(collection, connection);
				break;
			case DbType.MYSQL:
				this.adapter = new MySQLAdapter<T>(collection, connection);
				break;
			case DbType.CHROMADB:
				this.adapter = new ChromaDBAdapter<T>(collection, connection);
				break;
			default:
				throw new Error(`Unsupported database type: ${this.dbType}`);
		}
	}

	/**
	 * Registers event listeners specific to this collection.
	 * @param events An object containing event listeners for different operations.
	 */
	registerEvents(events: EventListeners<T>) {
		for (const [method, listeners] of Object.entries(events)) {
			if (listeners.pre) {
				this.on(`pre:${String(method)}`, listeners.pre);
			}
			if (listeners.post) {
				this.on(`post:${String(method)}`, listeners.post);
			}
			if (listeners.error) {
				this.on(`error:${String(method)}`, listeners.error);
			}
		}
	}

	@withEmitter()
	async create(data: Partial<T>) {
		return this.adapter.create(data);
	}

	@withEmitter()
	async findById(id: string) {
		return this.adapter.findById(id);
	}

	@withEmitter()
	async find(params: IdaeDbParams<T>) {
		return this.adapter.find(params);
	}

	@withEmitter()
	async findOne(params: IdaeDbParams<T>) {
		return this.adapter.findOne(params);
	}

	@withEmitter()
	async update(id: string, updateData: Partial<T>) {
		return this.adapter.update(id, updateData);
	}

	@withEmitter()
	async updateWhere(params: IdaeDbParams<T>, updateData: Partial<T>) {
		return this.adapter.updateWhere(params, updateData);
	}

	@withEmitter()
	async deleteById(id: string) {
		return this.adapter.deleteById(id);
	}

	@withEmitter()
	async deleteWhere(params: IdaeDbParams<T>) {
		return this.adapter.deleteWhere(params);
	}
}
