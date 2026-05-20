/**
 * IdbState — Reactive collection state backed by IdbEventBus.dataState
 * Adapted from @medyll/idae-idbql idbstate.svelte.ts
 * Pure TS — no $state, no statorAdapter. Read operations use dataState mirror.
 * Write operations delegate to IdbCollection (which emits events to update dataState).
 */
import { IdbCollection } from './IdbCollection';
import { idbEventBus, type IdbEventBus } from './IdbEventBus';
import { getResultSet, applyWhere } from './IdbCollection';
import type { Where, ResultsetOptions, ResultSet } from './types';

/**
 * Map of collection names to their CollectionState instances.
 */
type StateCollections<T extends Record<string, any>> = {
	[K in keyof T]: CollectionState<T[K]>;
};

/**
 * Factory to create collection state instances.
 * @param collections - Map of collection names to IdbCollection instances.
 * @param eventBus - Optional event bus (defaults to singleton).
 * @returns Object with collectionState map and qolie query helper.
 */
export function createIdbState<T extends Record<string, any>>(
	collections: Record<string, IdbCollection<any>>,
	eventBus?: IdbEventBus
): {
	collectionState: StateCollections<T>;
	qolie: (collection: string) => CollectionState<any>;
} {
	const bus = eventBus || idbEventBus;
	const stateMap: Record<string, CollectionState<any>> = {};

	for (const [name, col] of Object.entries(collections)) {
		stateMap[name] = new CollectionState(name, col, bus);
	}

	const qolie = (collection: string) => {
		if (!stateMap[collection]) {
			throw new Error(`Collection ${collection} not found`);
		}
		return stateMap[collection];
	};

	return {
		collectionState: stateMap as StateCollections<T>,
		qolie
	};
}

/**
 * CollectionState — read/write interface for a single collection.
 * Reads from IdbEventBus.dataState (plain object, no $state).
 * Writes delegate to IdbCollection, which emits events to update dataState.
 */
export class CollectionState<T = any> {
	private collectionName: string;
	private collection: IdbCollection<T>;
	private eventBus: IdbEventBus;

	constructor(
		collectionName: string,
		collection: IdbCollection<T>,
		eventBus?: IdbEventBus
	) {
		this.collectionName = collectionName;
		this.collection = collection;
		this.eventBus = eventBus || idbEventBus;

		// Initialize dataState for this collection
		if (!this.eventBus.dataState[collectionName]) {
			this.eventBus.dataState[collectionName] = [];
		}

		// Feed initial data from IndexedDB
		this.feed();
	}

	/**
	 * Gets the current state of the collection from dataState.
	 */
	get collectionState(): ResultSet<T> {
		return (this.eventBus.dataState[this.collectionName] || []) as ResultSet<T>;
	}

	/**
	 * Loads initial data from IndexedDB into dataState.
	 */
	private async feed(): Promise<void> {
		try {
			const data = await this.collection.getAll();
			this.eventBus.dataState[this.collectionName] = getResultSet(data);
		} catch {
			// Collection may not be initialized yet
		}
	}

	// ─── Read Operations (from dataState) ──────────────────────────────────

	/** Get all items from the collection state. */
	getAll(): ResultSet<T> {
		return this.collectionState;
	}

	/** Query the collection state with filters. */
	where(qy: Where<T>, options?: ResultsetOptions): ResultSet<T> {
		const data = this.collectionState;
		const filtered = applyWhere(data as T[], qy);
		const resultSet = getResultSet(filtered);
		if (options) {
			resultSet.setOptions(options);
		}
		return resultSet;
	}

	/** Get a single item by key value. */
	get(value: any, pathKey: string = 'id'): T | undefined {
		return this.where({ [pathKey]: value } as Where<T>)?.[0] as T | undefined;
	}

	/** Get items by value and key as a ResultSet. */
	getBy(value: any, pathKey: string = 'id'): ResultSet<T> {
		return this.where({ [pathKey]: value } as Where<T>);
	}

	/** @deprecated Use get instead. */
	getOne(value: any, pathKey: string = 'id'): T | undefined {
		return this.get(value, pathKey);
	}

	// ─── Write Operations (delegate to IdbCollection) ──────────────────────

	/** Add an item to the collection. */
	async add(data: T): Promise<T | undefined> {
		return this.collection.add(data) as Promise<T | undefined>;
	}

	/** Put (upsert) an item in the collection. */
	async put(value: Partial<T>): Promise<T | undefined> {
		return this.collection.put(value) as Promise<T | undefined>;
	}

	/** Update an item by key. */
	async update(keyPathValue: string | number, data: Partial<T>): Promise<boolean | undefined> {
		await this.collection.update(keyPathValue, data);
		return true;
	}

	/** Update items matching a where clause. */
	async updateWhere(where: Where<T>, data: Partial<T>): Promise<boolean | undefined> {
		return this.collection.updateWhere(where, data);
	}

	/** Delete an item by key. */
	async delete(keyPathValue: string | number): Promise<boolean | undefined> {
		return this.collection.delete(keyPathValue);
	}

	/** @deprecated Use delete instead. */
	async del(keyPathValue: string | number): Promise<boolean | undefined> {
		return this.delete(keyPathValue);
	}

	/** Delete items matching a where clause. */
	async deleteWhere(where: Where<T>): Promise<boolean | undefined> {
		return this.collection.deleteWhere(where);
	}

	/** Count items, optionally with a filter. */
	async count(qy?: Where<T>): Promise<number | undefined> {
		return this.collection.count(qy);
	}
}
