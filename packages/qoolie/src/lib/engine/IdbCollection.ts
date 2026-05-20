/**
 * IdbCollection — CRUD operations on an IndexedDB object store
 * Adapted from @medyll/idae-idbql collection.svelte.ts → pure .ts
 * Zero Svelte imports. Event emission via injected IdbEventBus.
 */
import { dotPath } from './pathResolver.js';
import { IdbEventBus, idbEventBus } from './IdbEventBus.js';
import type { Where, ResultsetOptions, ResultSet, IdbEventOp } from './types.js';

/**
 * Options for mutation methods.
 */
export interface MutationOptions {
	/** Skip event emission */
	silent?: boolean;
	/** Use an existing transaction */
	tx?: IDBTransaction;
}

/**
 * CollectionCore — CRUD operations on a single IndexedDB object store.
 * All write operations go through a writeQueue to prevent transaction deadlocks.
 * On each mutation, emits an event via the injected IdbEventBus.
 */
export class IdbCollection<T = any> {
	protected _store: string;
	private version?: number;
	private dbName: string;
	private keyPath: string;
	private eventBus: IdbEventBus;

	// Write queue to serialize operations and prevent transaction deadlocks
	private writeQueue: Promise<any> = Promise.resolve();

	constructor(
		store: string,
		keyPath: string,
		args: { dbName: string; version?: number },
		eventBus?: IdbEventBus
	) {
		this._store = store;
		this.version = args.version;
		this.dbName = args.dbName;
		this.keyPath = keyPath.split(',')[0].replace(/[\s+]/g, '').replace(/&/, '');
		this.eventBus = eventBus || idbEventBus;
	}

	get name(): string {
		return this._store;
	}

	private async getDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, this.version);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private async getCollection(): Promise<IDBObjectStore> {
		const db = await this.getDatabase();
		if (!db.objectStoreNames.contains(this._store)) {
			throw new Error(`Collection ${this._store} not found`);
		}
		return db.transaction(this._store, 'readwrite').objectStore(this._store);
	}

	private async enqueueWrite<R>(operation: () => Promise<R>): Promise<R> {
		const result = this.writeQueue.then(operation);
		this.writeQueue = result.catch(() => {});
		return result;
	}

	// ─── Read Operations ───────────────────────────────────────────────────

	/** Get all records from the collection. */
	getAll(): Promise<T[]> {
		return new Promise(async (resolve, reject) => {
			const storeObj = await this.getCollection();
			const request = storeObj.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/** Query the collection with filters. Returns a ResultSet. */
	async where(qy: Where<T>, options?: ResultsetOptions): Promise<ResultSet<T>> {
		const data = await this.getAll();
		const filtered = applyWhere(data, qy);
		const resultSet = getResultSet(filtered);
		if (options) {
			resultSet.setOptions(options);
		}
		return resultSet;
	}

	/** Get a single record by its key value. */
	get(value: any): Promise<T> {
		return new Promise(async (resolve, reject) => {
			const storeObj = await this.getCollection();
			const request = storeObj.get(value);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(new Error('not found'));
		});
	}

	/** Count records, optionally with a filter. */
	async count(qy?: Where<T>): Promise<number> {
		if (qy) {
			const resultSet = await this.where(qy);
			return resultSet.length;
		}
		return new Promise(async (resolve, reject) => {
			const storeObj = await this.getCollection();
			const request = storeObj.count();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	// ─── Write Operations ──────────────────────────────────────────────────

	/** Add a new record. */
	async add(data: Partial<T>, opts?: MutationOptions): Promise<T> {
		const doAdd = async (): Promise<T> => {
			return new Promise(async (resolve, reject) => {
				const storeObj = opts?.tx
					? opts.tx.objectStore(this._store)
					: await this.getCollection();
				const request = storeObj.add(data as any);
				request.onsuccess = async () => {
					const id = request.result;
					const created = await this.get(id);
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'add', created);
					}
					resolve(created);
				};
				request.onerror = () => reject(request.error);
			});
		};

		if (!opts?.tx) {
			return this.enqueueWrite(doAdd);
		}
		return doAdd();
	}

	/** Put (upsert) a record. */
	async put(data: Partial<T>, opts?: MutationOptions): Promise<T> {
		const doPut = async (): Promise<T> => {
			return new Promise(async (resolve, reject) => {
				const storeObj = opts?.tx
					? opts.tx.objectStore(this._store)
					: await this.getCollection();
				const request = storeObj.put(data as any);
				request.onsuccess = async () => {
					const id = request.result;
					const updated = await this.get(id as any);
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'put', updated);
					}
					resolve(updated);
				};
				request.onerror = () => reject(request.error);
			});
		};

		if (!opts?.tx) {
			return this.enqueueWrite(doPut);
		}
		return doPut();
	}

	/** Update a record by key — merges existing data with new data. */
	async update(keyPathValue: string | number, data: Partial<T>, opts?: MutationOptions): Promise<T> {
		const existing = await this.get(keyPathValue);
		return this.put(
			{
				[this.keyPath as keyof T]: keyPathValue,
				...existing,
				...data
			},
			opts
		);
	}

	/** Delete a record by key. */
	async delete(keyPathValue: string | number, opts?: MutationOptions): Promise<boolean> {
		const doDelete = async (): Promise<boolean> => {
			return new Promise(async (resolve, reject) => {
				const storeObj = opts?.tx
					? opts.tx.objectStore(this._store)
					: await this.getCollection();
				const request = storeObj.delete(keyPathValue as any);
				request.onsuccess = () => {
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'delete', { [this.keyPath]: keyPathValue });
					}
					resolve(true);
				};
				request.onerror = () => reject(request.error);
			});
		};

		if (!opts?.tx) {
			return this.enqueueWrite(doDelete);
		}
		return doDelete();
	}

	/** Update all records matching a where clause. */
	async updateWhere(where: Where<T>, data: Partial<T>, opts?: MutationOptions): Promise<boolean> {
		const rs = await this.where(where);

		return this.enqueueWrite(async () => {
			const db = await this.getDatabase();
			const tx = db.transaction(this._store, 'readwrite');
			const store = tx.objectStore(this._store);

			const updates = (rs as T[])
				.filter((item: T) => this.keyPath && (item as any)[this.keyPath])
				.map((item: T) => {
					const newData = {
						[this.keyPath as keyof T]: (item as any)[this.keyPath],
						...item,
						...data
					};
					return new Promise<void>((resolve, reject) => {
						const req = store.put(newData as any);
						req.onsuccess = () => resolve();
						req.onerror = () => reject(req.error);
					});
				});

			await Promise.all(updates);

			return new Promise<boolean>((resolve, reject) => {
				tx.oncomplete = () => {
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'update', data);
					}
					resolve(true);
				};
				tx.onerror = () => reject(tx.error);
			});
		});
	}

	/** Delete all records matching a where clause. */
	async deleteWhere(where: Where<T>, opts?: MutationOptions): Promise<boolean> {
		const data = await this.where(where);

		return this.enqueueWrite(async () => {
			const db = await this.getDatabase();
			const tx = db.transaction(this._store, 'readwrite');
			const store = tx.objectStore(this._store);

			const deletes = data
				.filter((item: T) => this.keyPath && (item as any)[this.keyPath])
				.map((item: T) => {
					return new Promise<void>((resolve, reject) => {
						const req = store.delete((item as any)[this.keyPath]);
						req.onsuccess = () => resolve();
						req.onerror = () => reject(req.error);
					});
				});

			await Promise.all(deletes);

			return new Promise<boolean>((resolve, reject) => {
				tx.oncomplete = () => {
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'delete', where);
					}
					resolve(true);
				};
				tx.onerror = () => reject(tx.error);
			});
		});
	}

	/** Batch add multiple records in a single transaction. */
	async batchAdd(items: Partial<T>[], opts?: MutationOptions): Promise<T[]> {
		return this.enqueueWrite(async () => {
			const db = await this.getDatabase();
			const tx = db.transaction(this._store, 'readwrite');
			const store = tx.objectStore(this._store);

			const results: T[] = [];
			const pendingOps: Promise<void>[] = [];

			for (const item of items) {
				const promise = new Promise<void>((resolve, reject) => {
					const req = store.add(item as any);
					req.onsuccess = () => {
						const id = req.result;
						results.push({ ...item, [this.keyPath]: id } as T);
						resolve();
					};
					req.onerror = () => reject(req.error);
				});
				pendingOps.push(promise);
			}

			await Promise.all(pendingOps);

			return new Promise<T[]>((resolve, reject) => {
				tx.oncomplete = () => {
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'add', results);
					}
					resolve(results);
				};
				tx.onerror = () => reject(tx.error);
			});
		});
	}

	/** Batch put (upsert) multiple records in a single transaction. */
	async batchPut(items: Partial<T>[], opts?: MutationOptions): Promise<T[]> {
		return this.enqueueWrite(async () => {
			const db = await this.getDatabase();
			const tx = db.transaction(this._store, 'readwrite');
			const store = tx.objectStore(this._store);

			const results: T[] = [];
			const pendingOps: Promise<void>[] = [];

			for (const item of items) {
				const promise = new Promise<void>((resolve, reject) => {
					const req = store.put(item as any);
					req.onsuccess = () => {
						const id = req.result;
						results.push({ ...item, [this.keyPath]: id } as T);
						resolve();
					};
					req.onerror = () => reject(req.error);
				});
				pendingOps.push(promise);
			}

			await Promise.all(pendingOps);

			return new Promise<T[]>((resolve, reject) => {
				tx.oncomplete = () => {
					if (!opts?.silent) {
						this.eventBus.emit(this._store, 'put', results);
					}
					resolve(results);
				};
				tx.onerror = () => reject(tx.error);
			});
		});
	}
}

// ─── In-Memory Where Filter ──────────────────────────────────────────────────

/** Compare two values for sorting — handles strings, numbers, and dates. */
function compareValues(a: any, b: any): number {
	if (a == null && b == null) return 0;
	if (a == null) return -1;
	if (b == null) return 1;
	if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
	return Number(a) - Number(b);
}

/**
 * Applies a Where clause to an array of items.
 * Handles: direct value match, operator objects (eq, gt, gte, lt, lte, ne, in, nin, contains, startsWith, endsWith, btw).
 * @internal — exported for IdbState use.
 */
export function applyWhere<T>(items: T[], where: Where<T>): T[] {
	return items.filter((item) => {
		for (const [key, condition] of Object.entries(where as Record<string, any>)) {
			const value = dotPath(item as any, key);

			if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
				// Operator-based condition
				if (!matchOperators(value, condition)) return false;
			} else {
				// Direct equality match
				if (value !== condition) return false;
			}
		}
		return true;
	});
}

function matchOperators(value: any, operators: Record<string, any>): boolean {
	for (const [op, operand] of Object.entries(operators)) {
		switch (op) {
			case 'eq':
				if (value !== operand) return false;
				break;
			case 'ne':
				if (value === operand) return false;
				break;
			case 'gt':
				if (!(value > operand)) return false;
				break;
			case 'gte':
				if (!(value >= operand)) return false;
				break;
			case 'lt':
				if (!(value < operand)) return false;
				break;
			case 'lte':
				if (!(value <= operand)) return false;
				break;
			case 'in':
				if (!Array.isArray(operand) || !operand.includes(value)) return false;
				break;
			case 'nin':
				if (Array.isArray(operand) && operand.includes(value)) return false;
				break;
			case 'contains':
				if (typeof value !== 'string' || !value.includes(operand as string)) return false;
				break;
			case 'startsWith':
				if (typeof value !== 'string' || !value.startsWith(operand as string)) return false;
				break;
			case 'endsWith':
				if (typeof value !== 'string' || !value.endsWith(operand as string)) return false;
				break;
			case 'btw':
				if (
					!Array.isArray(operand) ||
					value < operand[0] ||
					value > operand[1]
				)
					return false;
				break;
		}
	}
	return true;
}

// ─── ResultSet Builder ───────────────────────────────────────────────────────

/**
 * Wraps an array with ResultSet methods for chaining.
 * @internal — exported for IdbState use.
 */
export function getResultSet<T>(data: T[]): ResultSet<T> {
	Object.defineProperties(data, {
		setOptions: {
			value: function (options: ResultsetOptions = {}) {
				if (options.sort ?? options.sortBy) {
					this.sortBy(options.sort ?? options.sortBy);
				}
				if (options.groupBy) {
					return this.groupBy(options.groupBy);
				}
				return this;
			},
			enumerable: true,
			configurable: true
		},
		sortBy: {
			value: function (args: Record<string, 'asc' | 'desc'>) {
				const keys = Object.keys(args);
				const values = Object.values(args);
				this.sort((a: any, b: any) => {
					let i = 0;
					let result = 0;
					while (i < keys.length && result === 0) {
						const av = dotPath(a, keys[i]);
						const bv = dotPath(b, keys[i]);
						result =
							values[i] === 'asc'
								? compareValues(av, bv)
								: compareValues(bv, av);
						i++;
					}
					return result;
				});
				return this;
			},
			enumerable: true,
			configurable: true
		},
		groupBy: {
			value: function (fieldName: string, keepUngroupedData = true) {
				const groups: Record<string, T[]> = {};
				const ungrouped: T[] = [];
				for (const item of this as T[]) {
					const key = dotPath(item as any, fieldName) as string;
					if (key) {
						if (!groups[key]) groups[key] = [];
						groups[key].push(item);
					} else if (keepUngroupedData) {
						ungrouped.push(item);
					}
				}
				if (keepUngroupedData && ungrouped.length) {
					groups['_ungrouped'] = ungrouped;
				}
				return groups;
			},
			enumerable: true,
			configurable: true
		},
		getPage: {
			value: function (page: number, size: number) {
				return this.slice((size - 1) * page, (size - 1) * page + page);
			},
			enumerable: true,
			configurable: true
		},
		toObject: {
			value: function (path: string) {
				return this.map((item: any) => dotPath(item, path));
			},
			enumerable: true,
			configurable: true
		},
		filter: {
			value: function (predicate: (item: T) => boolean) {
				return getResultSet(Array.prototype.filter.call(this, predicate));
			},
			enumerable: true,
			configurable: true
		},
		map: {
			value: function <U>(mapper: (item: T) => U) {
				return getResultSet(Array.prototype.map.call(this, mapper));
			},
			enumerable: true,
			configurable: true
		},
		distinct: {
			value: function (key?: string) {
				const seen = new Set<unknown>();
				const distinct: T[] = [];
				for (const item of this as T[]) {
					const identifier = key ? dotPath(item as any, key) : item;
					if (!seen.has(identifier)) {
						seen.add(identifier);
						distinct.push(item);
					}
				}
				return getResultSet(distinct);
			},
			enumerable: true,
			configurable: true
		},
		reverse: {
			value: function () {
				Array.prototype.reverse.call(this);
				return this;
			},
			enumerable: true,
			configurable: true
		},
		sum: {
			value: function (field: string): number {
				return this.reduce((s: number, item: any) => s + Number(dotPath(item, field)), 0);
			},
			enumerable: true,
			configurable: true
		},
		avg: {
			value: function (field: string): number {
				if (this.length === 0) return 0;
				return this.sum(field) / this.length;
			},
			enumerable: true,
			configurable: true
		},
		min: {
			value: function (field: string): number {
				if (this.length === 0) return Infinity;
				return this.reduce((min: number, item: any) => {
					const v = Number(dotPath(item, field));
					return v < min ? v : min;
				}, Infinity);
			},
			enumerable: true,
			configurable: true
		},
		max: {
			value: function (field: string): number {
				if (this.length === 0) return -Infinity;
				return this.reduce((max: number, item: any) => {
					const v = Number(dotPath(item, field));
					return v > max ? v : max;
				}, -Infinity);
			},
			enumerable: true,
			configurable: true
		},
		count: {
			value: function (): number {
				return this.length;
			},
			enumerable: true,
			configurable: true
		},
		pluck: {
			value: function (field: string): unknown[] {
				return this.map((item: any) => dotPath(item, field));
			},
			enumerable: true,
			configurable: true
		},
		reduce: {
			value: function <U>(reducer: (acc: U, item: T) => U, initial: U): U {
				// @ts-expect-error — Object.defineProperties loses generic type info
				return Array.prototype.reduce.call(this, reducer, initial);
			},
			enumerable: true,
			configurable: true
		},
		first: {
			value: function (): T | undefined {
				return this[0];
			},
			enumerable: true,
			configurable: true
		},
		last: {
			value: function (): T | undefined {
				return this[this.length - 1];
			},
			enumerable: true,
			configurable: true
		}
	});

	return data as ResultSet<T>;
}
