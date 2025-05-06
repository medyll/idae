// packages\idae-db\lib\idaeDb.ts
import { DbType } from './@types/types.js';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import type { IdaeModelOptions } from './IdaeDBModel.js';
import type { Document } from 'mongodb';
import { IdaeDbAdapter } from './IdaeDbAdapter.js';
import type { EventListeners } from './IdaeEventEmitter.js';

type Uri = string;
type IdaeDbInstanceKey = `${DbType}:${Uri}`;
export type IdaeDbOptions = {
	dbType: DbType;
	dbScope: string | undefined;
	dbScopeSeparator?: string;
	idaeModelOptions?: IdaeModelOptions;
	dbEvents?: EventListeners<object, object>;
};

/**
 * Represents the IdaeDb class.
 */
export class IdaeDb {
	#globalEvents?: EventListeners<object, object>;
	static #instances: Map<IdaeDbInstanceKey, IdaeDb> = new Map();
	#adapterClass;
	#connections: Map<IdaeDbInstanceKey, IdaeDbConnection> = new Map();

	#connection: IdaeDbConnection | undefined = undefined;
	#options: IdaeDbOptions = {
		dbType: DbType.MONGODB,
		dbScope: undefined,
		idaeModelOptions: {},
		dbEvents: {} as EventListeners<object, object>
	} as IdaeDbOptions;

	/**
	 * Creates an instance of IdaeDb.
	 * @param _uri The URI of the database.
	 * @param options The options for the database.
	 */
	private constructor(
		private _uri: Uri,
		options: Partial<IdaeDbOptions> = {} as IdaeDbOptions
	) {
		this.#options = { ...this.#options, ...options };
		this.#adapterClass = IdaeDbAdapter.getAdapterForDbType(this.options.dbType);
		if (this.#options.dbEvents) {
			this.registerEvents(this.#options.dbEvents);
		}
	}

	/**
	 * Initializes or retrieves an IdaeDb instance.
	 * @param uri The URI of the database.
	 * @param options options.
	 * @param options.dbType The type of database.
	 * @param options.dbScope The scope of the database.
	 * @param options.dbScopeSeparator The separator of the database scope.
	 * @param options.idaeModelOptions The options of the IdaeDBModel.
	 * @returns An IdaeDb instance.
	 */
	public static init(uri: Uri, options?: Partial<IdaeDbOptions>): IdaeDb {
		const dbType = options?.dbType ?? DbType.MONGODB;
		const instanceKey: IdaeDbInstanceKey = `${dbType}:${uri}`;

		if (!IdaeDb.#instances.has(instanceKey)) {
			IdaeDb.#instances.set(instanceKey, new IdaeDb(uri, options));
		}
		return IdaeDb.#instances.get(instanceKey)!;
	}

	/**
	 * Registers event listeners for all collections.
	 * @param events An object containing event listeners for different operations.
	 */
	registerEvents<T extends object, R extends object>(events: EventListeners<T, R>) {
		this.#globalEvents = events;
	}

	/**
	 * Creates a new database connection.
	 * @param dbName The name of the database.
	 * @returns A Promise resolving to an IdaeDbConnection.
	 * @throws Error if the connection already exists.
	 */
	async db(dbName: string): Promise<IdaeDbConnection> {
		if (this.#connections.has(this.connectionKey)) {
			return this.#connections.get(this.connectionKey)!;
		}

		this.#connection = await new IdaeDbConnection(this, dbName).connect();
		this.#connections.set(this.connectionKey, this.#connection);

		return this.#connection;
	}

	/**
	 * Gets an adapter for the current database type.
	 * @param collectionName The name of the collection or table.
	 * @returns An appropriate adapter for the database type.
	 * @throws Error if the connection is not found or the database type is unsupported.
	 */
	// renamed from getAdapter to collection
	collection<T extends Document>(collectionName: string): IdaeDbAdapter<T> {
		if (!this.#connection) {
			throw new Error(`Connection for '${this.options.dbType}:${this._uri}' not found.`);
		}

		const adapter = new IdaeDbAdapter<T>(collectionName, this.#connection, this.options.dbType);

		if (this.#globalEvents) {
			this.#applyEvents(adapter, this.#globalEvents);
		}

		return adapter;
	}

	/**
	 * Applies event listeners to the adapter.
	 * @param adapter The adapter to apply events to.
	 * @param events The event listeners to apply.
	 */
	#applyEvents<T extends object = object, R extends object = object>(
		adapter: IdaeDbAdapter<T>,
		events: EventListeners<T, R>
	) {
		for (const [method, listeners] of Object.entries(events) as [
			string,
			NonNullable<EventListeners<T, R>[keyof EventListeners<T, R>]>
		][]) {
			if (listeners?.pre) {
				adapter.on(`pre:${String(method)}`, listeners.pre);
			}
			if (listeners.post) {
				adapter.on(`post:${String(method)}`, listeners.post);
			}
			if (listeners.error) {
				adapter.on(`error:${String(method)}`, listeners.error);
			}
		}
	}

	/**
	 * Closes the current database connection.
	 * @returns A Promise that resolves when the connection is closed.
	 */
	async closeConnection(): Promise<void> {
		if (this.#connection) {
			await this.#connection.close();
			this.#connections.delete(this.connectionKey);
		}
	}

	/**
	 * Closes all database connections.
	 * @returns A Promise that resolves when all connections are closed.
	 */
	async closeAllConnections(): Promise<void> {
		for (const [, connection] of this.#connections) {
			await connection.close();
		}
		this.#connections.clear();
	}

	/**
	 * Gets the adapter class for the current database type.
	 * @returns The adapter class.
	 */
	get adapterClass() {
		return this.#adapterClass;
	}

	/**
	 * Gets the connection key for the current database instance.
	 * @returns The connection key.
	 */
	get connectionKey(): IdaeDbInstanceKey {
		return `${this.options.dbType}:${this._uri}`;
	}

	/**
	 * Gets the URI of the database.
	 * @returns The URI of the database.
	 */
	get uri() {
		return this._uri;
	}

	/**
	 * Gets the options for the database.
	 * @returns The options for the database.
	 */
	get options() {
		return this.#options;
	}
}
