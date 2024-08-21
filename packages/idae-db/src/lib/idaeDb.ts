// packages\idae-db\lib\idaeDb.ts
import { DbType } from './types.js';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import type { IdaeModelOptions } from './IdaeDBModel.js';
import type { Document } from 'mongodb';
import { IdaeDbAdapter } from './IdaeDbAdapter.js';
import type { EventListeners } from './IdaeEventEmitter.js';

type Uri = string;
type IdaeDbInstanceKey = `${DbType}:${Uri}`;
type Options = {
	dbType: DbType;
	dbScope: string | undefined;
	dbScopeSeparator?: string;
	idaeModelOptions?: IdaeModelOptions;
};

export class IdaeDb {
	private globalEvents?: EventListeners<any>;
	private static instances: Map<IdaeDbInstanceKey, IdaeDb> = new Map();
	#connections: Map<IdaeDbInstanceKey, IdaeDbConnection> = new Map();

	#connection: IdaeDbConnection | undefined = undefined;
	#options: Options = {
		dbType: DbType.MONGODB,
		dbScope: undefined,
		idaeModelOptions: {}
	} as Options;

	private constructor(
		private _uri: Uri,
		options: Partial<Options> = {} as Options
	) {
		this.#options = { ...this.#options, ...options };
	}

	/**
	 * Initializes or retrieves an IdaeDb instance.
	 * @param dbType The type of database.
	 * @param uri The URI of the database.
	 * @returns An IdaeDb instance.
	 */
	public static init(uri: Uri, options?: Partial<Options>): IdaeDb {
		const dbType = options?.dbType ?? DbType.MONGODB;
		const instanceKey: IdaeDbInstanceKey = `${dbType}:${uri}`;

		if (!IdaeDb.instances.has(instanceKey)) {
			IdaeDb.instances.set(instanceKey, new IdaeDb(uri, options));
		}
		return IdaeDb.instances.get(instanceKey)!;
	}

	/**
	 * Registers event listeners for all collections.
	 * @param events An object containing event listeners for different operations.
	 */
	registerEvents<T extends Document>(events: EventListeners<T>) {
		this.globalEvents = events;
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

		if (this.globalEvents) {
			this.applyEvents(adapter, this.globalEvents);
		}

		return adapter;
	}

	private applyEvents<T>(adapter: IdaeDbAdapter<T>, events: EventListeners<T>) {
		for (const [method, listeners] of Object.entries(events)) {
			if (listeners.pre) {
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
	async closeConnection(): Promise<void> {
		if (this.#connection) {
			await this.#connection.close();
			this.#connections.delete(this.connectionKey);
		}
	}

	async closeAllConnections(): Promise<void> {
		for (const [connectionName, connection] of this.#connections) {
			await connection.close();
		}
		this.#connections.clear();
	}

	get connectionKey(): IdaeDbInstanceKey {
		return `${this.options.dbType}:${this._uri}`;
	}

	get uri() {
		return this._uri;
	}

	get options() {
		return this.#options;
	}
}
