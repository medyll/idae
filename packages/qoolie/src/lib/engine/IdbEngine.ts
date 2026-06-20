/**
 * IdbEngine — IndexedDB database engine
 * Adapted from @medyll/idae-idbql idbqlCore.ts
 * Pure TypeScript — zero Svelte imports.
 *
 * Usage:
 *   const { idbDatabase, idbql, idbqModel } = createDb(model, version).create('myDb');
 */
import { IdbSchema } from './IdbSchema.js';

/**
 * Simple model format for engine — just collection name → keyPath mapping.
 * Compatible with both full IdbqModel and simplified CollectionConfigMap.
 */
export type SimpleModel = Record<string, { keyPath: string; [key: string]: any }>;

/**
 * Map of collection names to their keyPath configuration.
 */
type StoreConfig = Record<string, string>;

/**
 * Extract collection type info from an IdbqModel.
 */
type CollectionInfo<T> = T extends { ts: infer Ts } ? Ts : never;

/**
 * Readonly collection accessor — provides access to IDBObjectStore by name.
 * Will be wired to full CollectionCore instances in S6-03.
 */
export type IdbqlCollections<T extends SimpleModel> = {
	[K in keyof T]: {
		name: string;
		keyPath: string;
		getDb: () => IDBDatabase | undefined;
	};
};

/**
 * Result of createDb().create()
 */
export interface CreateDbResult<T extends SimpleModel> {
	/** The IndexedDB engine instance */
	idbDatabase: IdbEngine<T>;
	/** Collection accessors (wired to full CollectionCore in S6-03) */
	idbql: IdbqlCollections<T>;
	/** The original model definition */
	idbqModel: T;
}

/**
 * IndexedDB engine wrapper — manages database lifecycle, schema creation, and transactions.
 */
export class IdbEngine<T extends SimpleModel = any> {
	private databaseName: string;
	dbVersion: number;
	public idbDatabase: IDBDatabase | undefined;

	#schema: StoreConfig = {};
	#idbqModel: T;
	#collectionInfo: Record<string, { keyPath: string }> = {};

	constructor(databaseName: string, idbqModel: T, version: number) {
		this.databaseName = databaseName;
		this.#idbqModel = idbqModel;
		this.dbVersion = version;

		const stores: StoreConfig = {};

		Object.keys(idbqModel).forEach((modelName) => {
			const modelInfo = (idbqModel as Record<string, any>)[modelName];
			stores[modelName] = modelInfo.keyPath || '';
			this.#collectionInfo[modelName] = { keyPath: modelInfo.keyPath || '' };
		});

		this.#schema = stores;
	}

	get schema() {
		return this.#schema;
	}

	get idbqModel() {
		return this.#idbqModel;
	}

	/**
	 * Open the IndexedDB database and create schema via onupgradeneeded.
	 */
	async open(): Promise<void> {
		if (typeof indexedDB === 'undefined') {
			throw new Error('IndexedDB is not available in this environment');
		}

		return new Promise((resolve, reject) => {
			const dbConnection = indexedDB.open(this.databaseName, this.dbVersion);

			dbConnection.onupgradeneeded = (event: Event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (db) {
					const schema = new IdbSchema();
					schema.createSchema(db, this.#schema);
				} else {
					reject(new Error('Failed to open database'));
				}
			};

			dbConnection.onsuccess = (event: Event) => {
				this.idbDatabase = (event.target as IDBOpenDBRequest).result;
				resolve();
			};

			dbConnection.onerror = () => {
				reject(dbConnection.error);
			};
		});
	}

	/**
	 * Execute a transaction on the database.
	 * @param storeNames - Store name(s) to include in the transaction.
	 * @param mode - Transaction mode ('readonly' or 'readwrite').
	 * @param callback - Function receiving the transaction object.
	 */
	async transaction<R>(
		storeNames: string | string[],
		mode: IDBTransactionMode,
		callback: (tx: IDBTransaction) => Promise<R>
	): Promise<R> {
		if (!this.idbDatabase) {
			throw new Error('Database not initialized. Call open() first.');
		}

		const db = this.idbDatabase;
		return new Promise((resolve, reject) => {
			const tx = db.transaction(storeNames, mode);
			tx.onerror = () => reject(tx.error);

			let result: R;
			Promise.resolve(callback(tx)).then(
				(value) => {
					result = value;
				},
				(error) => {
					tx.abort();
					reject(error);
				}
			);

			tx.oncomplete = () => resolve(result);
		});
	}

	/**
	 * Close the database connection.
	 */
	close(): void {
		if (this.idbDatabase) {
			this.idbDatabase.close();
			this.idbDatabase = undefined;
		}
	}

	/**
	 * Get collection info by name.
	 */
	getCollectionInfo(name: string) {
		return this.#collectionInfo[name];
	}

	/**
	 * Get the IDBDatabase instance.
	 */
	getDb(): IDBDatabase | undefined {
		return this.idbDatabase;
	}
}

/**
 * Main factory function to create an IndexedDB database.
 *
 * @param model - The model representing the structure of the database (collection name → { keyPath }).
 * @param version - The version number of the database.
 * @returns An object with a `create` method to instantiate the database.
 *
 * @example
 *   const model = { users: { keyPath: 'id' }, tasks: { keyPath: 'id' } };
 *   const { idbDatabase, idbql, idbqModel } = createDb(model, 1).create('myApp');
 *   await idbDatabase.open();
 */
export function createDb<T extends SimpleModel>(model: T, version: number) {
	return {
		create(name: string): CreateDbResult<T> {
			const engine = new IdbEngine<T>(name, model, version);

			// Build collection accessors
			const idbql = {} as IdbqlCollections<T>;
			for (const collectionName of Object.keys(model)) {
				const info = (model as Record<string, any>)[collectionName];
				(idbql as Record<string, any>)[collectionName] = {
					name: collectionName,
					keyPath: info.keyPath || '',
					getDb: () => engine.getDb()
				};
			}

			return {
				idbDatabase: engine,
				idbql,
				idbqModel: model
			};
		}
	};
}

/** @deprecated use createDb instead */
export const createIdbqDb = createDb;
