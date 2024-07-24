/* path: D:\boulot\app-node\idbql\src\lib\scripts\state\idbstate.svelte.ts */
import type { IdbqlIndexedCore } from '$lib/idbqlCore/idbqlCore.js';
import type { CollectionCore } from '$lib/collection/collection.js';
import { idbqlEvent } from './idbqlEvent.svelte.js';
//
import {
	Operators,
	getResultset,
	type Where,
	type ResultSet,
	type ResultsetOptions
} from '@medyll/idae-query';
//

/**
 * Main entry point.
 * Creates a state object with indexedDB synchronization.
 * @param {IdbqlIndexedCore} [idbBase] - The IdbqlCore instance.
 * @returns {object} - The state object.
 */
export const createIdbqlState = (idbBase: IdbqlIndexedCore) => {
	let collections: Record<string, any> = {};

	if (idbBase.schema) {
		addCollections(idbBase.schema);
	}
	/**
	 * Adds a collection to the svelte 5 state and synchronize with indexedDB if it exists.
	 * @template T - The type of data in the collection.
	 * @param {string} collectionName - The name of the collection.
	 * @param {string} [keyPath="id"] - The key path for the collection.
	 * @returns {Proxy} - A proxy object with methods to interact with the collection.
	 */
	function addCollection<T>(collectionName: string) {
		return new StateCollectionDyn<T>(collectionName, idbBase);
	}

	function addCollections<T = typeof idbBase.schema>(args: T) {
		Object.keys(args).map((collection) => {
			const t = args[collection];
			collections[collection] = addCollection<typeof t>(collection);
		});
	}

	return {
		get state() {
			return collections;
		},
		onCollection: addCollection,
		addCollection: addCollection
	};
};

/**
 * Adds a collection to the svelte 5 state and synchronize with indexedDB if it exists.
 * @template T - The type of data in the collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} [keyPath="id"] - The key path for the collection.
 * @returns {Proxy} - A proxy object with methods to interact with the collection.
 */
export class StateCollectionDyn<T> {
	private collectionName: string;
	private state = idbqlEvent.dataState as StateCollectionDyn<T>; // svelte state ;)
	private idbBase: IdbqlIndexedCore;

	constructor(collectionName: string, idbBase: IdbqlIndexedCore) {
		if (!this.state?.[collectionName]) this.state[collectionName] = [];
		this.collectionName = collectionName;
		this.idbBase = idbBase;

		this.feed();

		return this;
	}

	get collectionState() {
		return this.state[this.collectionName];
	}

	private testIdbql(collection: string) {
		return this.idbBase && Boolean(this.idbBase?.[collection]);
	}

	private feed() {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			this.idbBase[this.collectionName].getAll().then((data) => {
				this.state[this.collectionName] = data;
			});
		}
	}

	where(qy: Where<T>, options?: ResultsetOptions) {
		let c = Operators.parse(this.collectionState ?? [], qy);
		const r = getResultset<T>(c);
		if (options) r.setOptions(options);
		return r;
	}

	update(keyPathValue: string | number, data: Partial<T>) {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			(this.idbBase[this.collectionName] as CollectionCore).update(keyPathValue, data);
		}
	}

	get(value: any, pathKey: string = 'id'): T[] {
		return this.collectionState.filter((d) => d[pathKey] === value) as T[];
	}

	getOne(value: any, pathKey: string = 'id'): T {
		return this.collectionState.filter((d) => d[pathKey] === value)?.[0] as T;
	}

	getAll(): ResultSet<T> {
		return getResultset<T>(this.collectionState);
	}

	updateWhere(where: Where<T>, data: Partial<T>) {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			this.idbBase[this.collectionName].updateWhere(where, data);
		}
	}

	put(value: Partial<T>) {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			this.idbBase[this.collectionName].put(value);
		}
	}

	add(data: T) {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			this.idbBase[this.collectionName].add(data);
		}
	}

	delete(keyPathValue: string | number): boolean | undefined {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			return this.idbBase[this.collectionName].delete(keyPathValue);
		}
	}
	/** @deprecated */
	del(keyPathValue: string | number): boolean | undefined {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			return this.idbBase[this.collectionName].delete(keyPathValue);
		}
	}

	deleteWhere(where: Where<T>): boolean | undefined {
		if (this.idbBase && this.testIdbql(this.collectionName)) {
			return this.idbBase[this.collectionName].deleteWhere(where);
		}
	}
}
