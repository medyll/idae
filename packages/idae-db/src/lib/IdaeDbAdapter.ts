// lib/IdaeDbAdapter.ts

import {
	AbstractIdaeDbAdapter,
	DbType,
	type AdapterConstructor,
	type IdaeDbAdapterInterface,
	type IdaeDbParams
} from './@types/types.js';

import { IdaeDbConnection } from './IdaeDbConnection.js';
import { MongoDBAdapter } from './adapters/MongoDBAdapter.js';
import { MySQLAdapter } from './adapters/MySQLAdapter.js';
import { ChromaDBAdapter } from './adapters/ChromaDBAdapter.js';
import {
	IdaeEventEmitter,
	withEmitter,
	type ErrorEventListener,
	type PostEventListener,
	type PreEventListener
} from './IdaeEventEmitter.js';

export type EventListeners<T extends object> = {
	[K in keyof IdaeDbAdapter<T> as IdaeDbAdapter<T>[K] extends (...args: unknown[]) => unknown
		? K
		: never]?: {
		pre?: PreEventListener<IdaeDbAdapter<T>[K] extends (...args: infer P) => unknown ? P : never>;
		post?: PostEventListener<
			IdaeDbAdapter<T>[K] extends (...args: infer P) => unknown ? P : never,
			IdaeDbAdapter<T>[K] extends (...args: unknown[]) => infer R ? R : never
		>;
		error?: ErrorEventListener;
	};
};

/**
 * IdaeDbAdapter class that extends IdaeEventEmitter and implements AbstractIdaeDbAdapter.
 */
export class IdaeDbAdapter<T extends object>
	extends IdaeEventEmitter
	implements AbstractIdaeDbAdapter<T>
{
	private adapter!: IdaeDbAdapterInterface<T>;
	private static adapters: Map<DbType, AdapterConstructor<IdaeDbConnection>> = new Map();

	static {
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MongoDBAdapter);
		IdaeDbAdapter.addAdapter(DbType.MYSQL, MySQLAdapter);
		IdaeDbAdapter.addAdapter(DbType.CHROMADB, ChromaDBAdapter);
		// Nouveaux adapters (ESM import)
		// @ts-expect-error: Adapter classes may not être fully implemented yet
		import('./adapters/PouchDBAdapter.js').then(m => IdaeDbAdapter.addAdapter(DbType.POUCHDB, m.PouchDBAdapter));
		// @ts-expect-error: Adapter classes may not être fully implemented yet
		import('./adapters/SQLiteAdapter.js').then(m => IdaeDbAdapter.addAdapter(DbType.SQLITE, m.SQLiteAdapter));
		// @ts-expect-error: Adapter classes may not être fully implemented yet
		import('./adapters/PostgreSQLAdapter.js').then(m => IdaeDbAdapter.addAdapter(DbType.POSTGRESQL, m.PostgreSQLAdapter));
	}

	/**
	 * Adds a new adapter for a specific database type.
	 * @param dbType The type of database for this adapter.
	 * @param adapterConstructor The constructor function for the adapter.
	 */
	static addAdapter<A>(
		dbType: DbType,
		adapterConstructor: new (collection: string, connection: IdaeDbConnection) => A
	) {
		IdaeDbAdapter.adapters.set(dbType, adapterConstructor as AdapterConstructor<IdaeDbConnection>);
	}

	/**
	 * Retrieves the adapter constructor for a specific database type.
	 * @param dbType The type of database for which to retrieve the adapter.
	 * @returns The adapter constructor for the specified database type, or undefined if not found.
	 */
	static getAdapterForDbType(dbType: DbType) {
		return IdaeDbAdapter.adapters.get(dbType);
	}

	/**
	 * Creates a new instance of IdaeDbAdapter.
	 * @param collection The name of the collection or table to operate on.
	 * @param connection The database connection object.
	 * @param dbType The type of database being used (e.g., MongoDB, MySQL, ChromaDB).
	 * @throws {Error} If no adapter is found for the specified database type.
	 */
	constructor(
		collection: string,
		connection: IdaeDbConnection,
		private dbType: DbType
	) {
		super();
		this.applyAdapter(collection, connection, this.dbType);
	}

	/**
	 * Register event listeners for different operations.
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

	@withEmitter()
	async createIndex<F, O>(fieldOrSpec: F, options?: O): Promise<string> {
		const result = await this.adapter.createIndex(fieldOrSpec, options);
		return String(result);
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
	async updateWhere<OPT = any>(params: IdaeDbParams<T>, updateData: Partial<T>, options: OPT) {
		return this.adapter.updateWhere<OPT>(params, updateData, options);
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
	async transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult> {
		return this.adapter.transaction(callback);
	}

	/**
	 * Applies the appropriate adapter for the specified database type.
	 * @param collection The name of the collection or table.
	 * @param connection The database connection object.
	 * @param dbType The type of database being used.
	 * @throws {Error} If no adapter is found for the specified database type.
	 */
	private applyAdapter(collection: string, connection: IdaeDbConnection, dbType: DbType) {
		const adapterConstructor = IdaeDbAdapter.adapters.get(dbType);
		if (!adapterConstructor) {
			throw new Error(`No adapter found for database type : ${dbType}`);
		}
		/** @ts-expect-error  ---  */
		this.adapter = new adapterConstructor<T>(collection, connection);
	}
}
