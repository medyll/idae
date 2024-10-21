// packages\idae-db\lib\IdaeDbConnection.ts

import { DbType, type IdaeDbAdapterInterfaceNext } from './@types/types.js';
import { IdaeDBModel } from './IdaeDBModel.js';
import { IdaeDb } from './idaeDb.js';

export class IdaeDbConnection {
	#models = new Map<string, IdaeDBModel<any>>();
	#uri: string;
	#dbType: DbType;

	#Db: any;
	#client: any;
	#adapterClass: IdaeDbAdapterInterfaceNext<any>;

	#connected: boolean = false;

	constructor(
		private _idaeDb: IdaeDb,
		private _dbName: string
	) {
		this.#uri = _idaeDb.uri;
		this.#dbType = _idaeDb.options.dbType;
		this.#adapterClass = _idaeDb.adapterClass as unknown as IdaeDbAdapterInterfaceNext<any>;
		// add prefix if requested
		this._dbName = this.getFullDbName();
	}

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

	getDb() {
		if (!this.#Db) {
			throw new Error('Db not connected. Call connect() first.');
		}
		return this.#Db;
	}

	getModel = <T extends Document>(collectionName: string): IdaeDBModel<T> => {
		if (!this.#models.has(collectionName)) {
			const model = new IdaeDBModel<T>(
				this,
				collectionName,
				this._idaeDb?.options?.idaeModelOptions
			);
			this.#models.set(collectionName, model);
		}
		return this.#models.get(collectionName) as IdaeDBModel<T>;
	};

	getClient<T>(): T {
		if (!this.#client) {
			throw new Error('Client not initialized. Call connect() first.');
		}
		return this.#client;
	}

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

	private getFullDbName = () => [this.idaeDb.options.dbScope, this._dbName].join('_');
}
