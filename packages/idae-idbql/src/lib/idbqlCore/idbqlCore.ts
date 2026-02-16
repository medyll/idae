/* src\lib\scripts\idbqlCore\idbqlCore.ts */

import { Collection, CollectionCore } from '../collection/collection.svelte.js';
import { CollectionState, createIdbqlState } from '../state/idbstate.svelte.js';
import { Schema } from './idbqlSchema.js';
import type { IdbqModel } from './types.js';

export type ReadonlyCollections<T extends IdbqModel> = {
	[K in keyof T]: CollectionCore<T[K]['ts']>;
};

export type StateCollections<T extends IdbqModel> = {
	[K in keyof T]: CollectionState<T[K]['ts']>;
};

/**
 * Represents the IndexedDB wrapper for managing database operations.
 * @template T - The type of data stored in the IndexedDB.
 */
export class IdbqlIndexedCore<T = any> {
	private databaseName: string;
	dbVersion!:            number;
	public idbDatabase!:   IDBDatabase;

	#schema:              Record<string, any> = {};
	#idbqModel:           IdbqModel = {};
	/**
	 * Creates an instance of Idbq.
	 * @param {string} databaseName - The name of the database.
	 */
	constructor(databaseName: string, idbqModel: IdbqModel, version: number) {
		this.databaseName = databaseName;
		this.#idbqModel = idbqModel;
		this.dbVersion = version;

		const stores: { [key: string]: string } = {};

		Object.keys(idbqModel).forEach((modelName) => {
			const modelInfo = idbqModel[modelName];
			stores[modelName] = modelInfo.keyPath || '';

			Object.defineProperty(this, modelName, {
				// @ts-ignore
				value:        undefined as unknown as Collection<(typeof modelInfo)['ts']>,
				writable:     true,
				enumerable:   true,
				configurable: true
			});
		});

		this.stores(stores);
	}

	get schema() {
		return this.#schema;
	}
	get idbqModel() {
		return this.#idbqModel;
	}

	/**
	 * return a database, with the version is provided
	 * @param {number} version - The version number of the database.
	 * @returns {object} - An object with a `stores` method to define the object stores.
	 */
	async stores(args: Record<string, string>) {
		if (typeof indexedDB !== 'undefined') {
			return new Promise((resolve, reject) => {
				this.#schema = args;

				const dbConnection = indexedDB.open(this.databaseName, this.dbVersion);
				if (dbConnection != undefined) {
					this.createCollections(args, this.dbVersion);

					dbConnection.onsuccess = (event: Event) => {
						const db = (event.target as IDBOpenDBRequest).result;
						this.idbDatabase = db;
					};
					dbConnection.onupgradeneeded = async (event: Event) => {
						const db = (event.target as IDBOpenDBRequest).result;
						
						if (db) {
							const m = new Schema();
							console.log('schema', m);
							await m.createSchema(db, args);
						} else {
							console.log('no db');
							reject(true);
						}
					};
					resolve(true);
				} else {
					reject(true);
				}
			});
		}
	}

	async transaction<R>(
		storeNames: string | string[],
		mode: IDBTransactionMode,
		callback: (tx: IDBTransaction) => Promise<R>
	): Promise<R> {
		if (!this.idbDatabase) {
			throw new Error('Database not initialized');
		}

		return new Promise((resolve, reject) => {
			const tx = this.idbDatabase.transaction(storeNames, mode);
			tx.onerror = () => reject(tx.error);
			tx.oncomplete = () => resolve(result);

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
		});
	}

	// @ts-ignore
	private createCollections(args: any, version: number) {
		Object.keys(this.#schema).map(async (storeName) => {
			Object.defineProperty(this, storeName, {
				// @ts-ignore
				value:        new Collection(storeName, this.#schema[storeName], {
					dbName: this.databaseName,
					version // @ts-ignore
				}) as unknown as Collection<T>,
				writable:     true,
				enumerable:   true,
				configurable: true
			});
		});
	}
}

/**
 * Main entrance function to create an IndexedDB database store schema.
 * Creates an IndexedDB database store schema for the given model and version.
 *
 * @param model - The IdbqModel representing the structure of the store.
 * @param version - The version number of the store.
 * @returns A function that creates a readonly collection for the given name.
 * The returned function returns an instance of ReadonlyCollections<T> & typeof idb_.
 *
 * @typeparam T - The type of data stored in the collections.
 */
export const createDb = <T extends IdbqModel>(model: T, version: number) => {
	return {
		create: (
			name: string
		): {
			idbDatabase: IdbqlIndexedCore<T>;
			idbql:       ReadonlyCollections<T>;
			idbqlState:  StateCollections<T>;
			qolie:       any;
			idbqModel:   T;
		} => {
			const idb_ = new IdbqlIndexedCore<T>(name, model, version);
			const idbqlState = createIdbqlState(idb_);
			return {
				idbDatabase: idb_,
				idbql:       idb_ as unknown as ReadonlyCollections<T>,
				idbqlState:  idbqlState.collectionState as StateCollections<T>,
				qolie:       idbqlState.qolie,
				idbqModel:   model
			};
		}
	};
};

/** @deprecated use createDb instead */
export const createIdbqDb = createDb

/** @deprecated use createDb instead */
export const idbqBase = createDb;
