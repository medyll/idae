// lib/IdaeDbAdapter.ts

import { DbType, type IdaeDbAdapterInterface, type IdaeDbParams } from './types.js';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import { MongoDBAdapter } from './adapters/MongoDBAdapter.js';
import { MySQLAdapter } from './adapters/MySQLAdapter.js';
import { ChromaDBAdapter } from './adapters/ChromaDBAdapter.js';
import { IdaeEventEmitter, withEmitter, type EventListeners } from './IdaeEventEmitter.js';

export type AdapterConstructor = new <T extends Document = Document>(
	collection: string,
	connection: IdaeDbConnection
) => IdaeDbAdapterInterface<T>;

export class IdaeDbAdapter<T extends Document> extends IdaeEventEmitter {
	private adapter!: MongoDBAdapter<T> | MySQLAdapter<T> | ChromaDBAdapter<T>;
	private static adapters: Map<DbType, AdapterConstructor> = new Map();

	static {
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MongoDBAdapter);
		IdaeDbAdapter.addAdapter(DbType.MYSQL, MySQLAdapter);
		IdaeDbAdapter.addAdapter(DbType.CHROMADB, ChromaDBAdapter);
	}

	/**
	 * Adds a new adapter for a specific database type.
	 * @param dbType The type of database for this adapter.
	 * @param adapterConstructor The constructor function for the adapter.
	 */
	static addAdapter<A>(dbType: DbType, adapterConstructor: AdapterConstructor) {
		IdaeDbAdapter.adapters.set(dbType, adapterConstructor);
	}

	constructor(
		collection: string,
		connection: IdaeDbConnection,
		private dbType: DbType
	) {
		super();
		this.applyAdapter(collection, connection, this.dbType);
	}

	private applyAdapter(collection: string, connection: IdaeDbConnection, dbType: DbType) {
		const AdapterConstructor = IdaeDbAdapter.adapters.get(dbType);
		if (!AdapterConstructor) {
			throw new Error(`No adapter found for database type: ${dbType}`);
		}
		this.adapter = new AdapterConstructor(collection, connection);
	}

	/**
	 * Registers event listeners specific to this collection.
	 * @param events An object containing event listeners for different operations.
	 */
	registerEvents(events: EventListeners<T>): void {
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

	static getAdapterForDbType(dbType: DbType) {
		return IdaeDbAdapter.adapters.get(dbType);
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

	@withEmitter()
	async transaction<TResult>(callback: (session: any) => Promise<TResult>): Promise<TResult> {
		return this.adapter.transaction(callback);
	}
}
