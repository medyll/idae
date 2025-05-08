// packages\idae-db\lib\IdaeDbConnection.ts

import { DbType, IdaeDbAdapterStaticMethods, type IdaeDbAdapterInterface } from './@types/types.js';
import { IdaeDBModel } from './IdaeDBModel.js';
import { IdaeDb } from './idaeDb.js';
import { type Document } from 'mongodb';
/**
 * Represents a database connection.
 */
export class IdaeDbConnection {
	#models = new Map<string, IdaeDBModel<object>>();
	#uri: string;
	#dbType: DbType;

	#Db: unknown;
	#client: unknown;
	#adapterClass: IdaeDbAdapterInterface<object> & IdaeDbAdapterStaticMethods;

	#connected: boolean = false;

	/**
	 * Creates an instance of IdaeDbConnection.
	 * @param _idaeDb The IdaeDb instance.
	 * @param _dbName The name of the database.
	 */
	constructor(
		private _idaeDb: IdaeDb,
		private _dbName: string
	) {
		this.#uri = _idaeDb.uri;
		this.#dbType = _idaeDb.options.dbType;
		this.#adapterClass = _idaeDb.adapterClass as unknown as IdaeDbAdapterInterface<object> &
			IdaeDbAdapterStaticMethods;
		// add prefix if requested
		this._dbName = this.getFullDbName();
	}

	/**
	 * Connects to the database.
	 * @returns A promise that resolves to the IdaeDbConnection instance.
	 */
	async connect(): Promise<IdaeDbConnection> {
		if (!this.#adapterClass?.connect) throw new Error('Adapter does not have a connect method');
		try {
			this.#client = await this.#adapterClass.connect(this.#uri);
			this.#Db = this.#adapterClass.getDb(this.#client, this._dbName);

			this.#connected = true;
			return this;
		} catch (error) {
			console.error(`Error connecting to ${this.#dbType}:`, error);
			this.#connected = false;
			throw error;
		}
	}

	/**
	 * Gets the database instance.
	 * @returns The database instance.
	 * @throws Error if the database is not connected.
	 */
	getDb() {
		if (!this.#Db) {
			throw new Error('Db not connected. Call connect() first.');
		}
		return this.#Db;
	}

	/**
	 * Gets the model for a collection.
	 * @param collectionName The name of the collection.
	 * @returns The model for the collection.
	 */
	getModel = <T extends Document>(collectionName: string): IdaeDBModel<T> => {
		if (!this.#models.has(collectionName)) {
			const model = new IdaeDBModel<T>(
				this,
				collectionName,
				this._idaeDb?.options?.idaeModelOptions
			);
			this.#models.set(collectionName, model as unknown as IdaeDBModel<object>);
		}
		return this.#models.get(collectionName) as unknown as IdaeDBModel<T>;
	};

	/**
	 * Gets the client instance.
	 * @returns The client instance.
	 * @throws Error if the client is not initialized.
	 */
	getClient<T>(): T {
		if (!this.#client) {
			throw new Error('Client not initialized. Call connect() first.');
		}
		return this.#client as T;
	}

	/**
	 * Closes the database connection.
	 * @returns A promise that resolves when the connection is closed.
	 */
	async close(): Promise<void> {
		if (!this.#adapterClass?.close) throw new Error('Adapter does not have a close method');
		await this.#adapterClass?.close(this.#client);
	}

	get dbName() {
		return this._dbName;
	}

	get connected() {
		return this.#connected;
	}

	get idaeDb() {
		return this._idaeDb;
	}

	/**
	 * Gets the full database name with scope.
	 * @returns The full database name.
	 */
	private getFullDbName = () => [this.idaeDb.options.dbScope, this._dbName].join('_');
}
