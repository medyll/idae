/* path:  src\lib\scripts\collection\collection.ts */

import { Query, getResultset } from "@medyll/idae-query";

import {
  type Where,
  type ResultsetOptions,
  type ResultSet,
} from "@medyll/idae-query";

import { getIdbqlEvent } from "$lib/state/idbqlEvent.svelte.js";

export class CollectionCore<T = any> {
  protected _store: string;
  private version?: number;
  private dbName;

  private dBOpenRequest!: IDBOpenDBRequest;

  private keyPath: string;
  
  // Write queue to serialize operations and prevent transaction deadlocks
  private writeQueue: Promise<any> = Promise.resolve();

  constructor(
    store: string,
    keyPath: string,
    args: { dbName: string; version?: number },
  ) {
    this._store = store;
    this.version = args.version;
    this.dbName = args.dbName;
    this.keyPath = keyPath.split(",")[0].replace(/[\s+]/g, "").replace(/&/, "");
  }

  get name() {
    return this._store;
  }

  private async getDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /** get the collection */
  private async getCollection(): Promise<IDBObjectStore> {
    const db = await this.getDatabase();
    if (!db.objectStoreNames.contains(this._store)) {
      throw new Error(`Collection ${this._store} not found`);
    }
    return db.transaction(this._store, "readwrite").objectStore(this._store);
  }

  /**
   * Enqueue a write operation to serialize access and prevent transaction deadlocks.
   * All write operations (add, put, delete, update, updateWhere, deleteWhere) go through this queue.
   */
  private async enqueueWrite<T>(operation: () => Promise<T>): Promise<T> {
    // Add operation to queue, chained after previous operations
    const result = this.writeQueue.then(operation);
    this.writeQueue = result.catch(() => {}); // Continue queue even on error
    return result;
  }

  /**
   * Retrieves the data from the collection based on the provided query.
   * @param qy - The query object specifying the conditions for filtering the data.
   * @param options - The options object specifying additional operations to be applied on the result set.
   * @returns A promise that resolves to the filtered result set.
   * @throws If an error occurs while retrieving the data.
   */
  async where(qy: Where<T>, options?: ResultsetOptions): Promise<ResultSet<T>> {
    const data = await this.getAll();
    const query = new Query<T>(data);
    const resultSet = getResultset(query.where(qy));
    if (options) {
      resultSet.setOptions(options);
    }
    return resultSet;
  }

  /**
   * Counts the number of documents in the collection.
   * When called without a query parameter, it uses the native IndexedDB count() method for optimal performance.
   * When called with a query parameter, it retrieves all matching documents to return the count.
   */
  async count(qy?: Where<T>): Promise<number> {
    if (qy) {
      const resultSet = await this.where(qy);
      return resultSet.length;
    }

    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const countRequest = storeObj.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });
  }

  get<T>(value: Partial<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const get = storeObj.get(value);
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject("not found");
    });
  }

  getAll(): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const getAll = storeObj.getAll();
      getAll.onsuccess = function () {
        resolve(getAll.result);
      };
      getAll.onerror = function () {
        reject("not found");
      };
    });
  }

  async update(keyPathValue: string | number, data: Partial<T>, opts?: { silent?: boolean; tx?: IDBTransaction }) {
    const dta = await this.get(keyPathValue);
    return this.put(
      {
        [this.keyPath as keyof T]: keyPathValue,
        ...dta,
        ...data,
      },
      opts,
    );
  }

  async updateWhere(where: Where<T>, data: Partial<T>, opts?: { silent?: boolean; tx?: IDBTransaction }) {
    const rs = await this.where(where);
    
    // Use a single transaction for all updates to prevent deadlocks
    if (opts?.tx) {
      const updates = (rs as T[])
        .filter((dta: T) => this.keyPath && dta[this.keyPath])
        .map((dta: T) => {
          const newData = {
            [this.keyPath as keyof T]: dta[this.keyPath],
            ...dta,
            ...data,
          };
          return this.put(newData, { ...opts, tx: opts.tx! });
        });
      await Promise.all(updates);
      return true;
    }
    
    return this.enqueueWrite(async () => {
      const db = await this.getDatabase();
      const tx = db.transaction(this._store, "readwrite");
      const store = tx.objectStore(this._store);
      
      const updates = (rs as T[])
        .filter((dta: T) => this.keyPath && dta[this.keyPath])
        .map((dta: T) => {
          const newData = {
            [this.keyPath as keyof T]: dta[this.keyPath],
            ...dta,
            ...data,
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
            getIdbqlEvent().registerEvent("updateWhere", {
              collection: this._store,
              whereClause: where,
              data,
              keyPath: this.keyPath,
            });
          }
          resolve(true);
        };
        tx.onerror = () => reject(tx.error);
      });
    });
  }

  async put<T>(value: Partial<T>, opts?: { silent?: boolean; tx?: IDBTransaction }): Promise<T> {
    const doPut = async (): Promise<T> => {
      return new Promise(async (resolve, reject) => {
        const storeObj = opts?.tx ? opts.tx.objectStore(this._store) : await this.getCollection();

        const putReq = storeObj.put(value as any);
        putReq.onsuccess = async (event) => {
          const id = (event.target as IDBRequest).result;
          const updatedData = await this.get(id as any);
          if (!opts?.silent) {
            getIdbqlEvent().registerEvent("put", {
              collection: this._store,
              data: updatedData,
              keyPath: this.keyPath,
            });
          }
          resolve(updatedData);
        };
        putReq.onerror = function () {
          reject("data not put");
        };
      });
    };
    
    if (!opts?.tx) {
      return this.enqueueWrite(doPut);
    }
    return doPut();
  }

  async add<T>(data: Partial<T>, opts?: { silent?: boolean; tx?: IDBTransaction }): Promise<T | boolean> {
    const doAdd = async (): Promise<T | boolean> => {
      return new Promise(async (resolve, reject) => {
        const storeObj = opts?.tx ? opts.tx.objectStore(this._store) : await this.getCollection();
        const addReq = storeObj.add(data as any);
        addReq.onsuccess = async (event) => {
          const id = (event.target as IDBRequest).result;
          const updatedData = await this.get(id as any);
          if (!opts?.silent) {
            getIdbqlEvent().registerEvent("add", {
              collection: this._store,
              data: updatedData,
              keyPath: this.keyPath,
            });
          }
          resolve(updatedData);
        };
        addReq.onerror = function (e) {
          console.log(e);
          reject(e);
        };
      });
    };
    
    if (!opts?.tx) {
      return this.enqueueWrite(doAdd);
    }
    return doAdd();
  }

  async delete(keyPathValue: string | number, opts?: { silent?: boolean; tx?: IDBTransaction }): Promise<boolean> {
    const doDelete = async (): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        const storeObj = opts?.tx ? opts.tx.objectStore(this._store) : await this.getCollection();
        let objectStoreRequest = storeObj.delete(keyPathValue as any);

        objectStoreRequest.onsuccess = () => {
          if (!opts?.silent) {
            getIdbqlEvent().registerEvent("delete", {
              collection: this._store,
              data: { [this.keyPath]: keyPathValue },
              keyPath: this.keyPath,
            });
          }
          resolve(true);
        };
        objectStoreRequest.onerror = function () {
          reject(false);
        };
      });
    };
    
    if (!opts?.tx) {
      return this.enqueueWrite(doDelete);
    }
    return doDelete();
  }

  async deleteWhere(where: Where<T>, opts?: { silent?: boolean; tx?: IDBTransaction }): Promise<boolean> {
    const data = await this.where(where);
    
    if (opts?.tx) {
      const deletes = data
        .filter((item: T) => this.keyPath && item[this.keyPath])
        .map((item: T) => this.delete(item[this.keyPath], { ...opts, tx: opts.tx! }));
      await Promise.all(deletes);
      return true;
    }
    
    return this.enqueueWrite(async () => {
      const db = await this.getDatabase();
      const tx = db.transaction(this._store, "readwrite");
      const store = tx.objectStore(this._store);
      
      const deletes = data
        .filter((item: T) => this.keyPath && item[this.keyPath])
        .map((item: T) => {
          return new Promise<void>((resolve, reject) => {
            const req = store.delete(item[this.keyPath]);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
          });
        });
      
      await Promise.all(deletes);
      
      return new Promise<boolean>((resolve, reject) => {
        tx.oncomplete = () => {
          if (!opts?.silent) {
            getIdbqlEvent().registerEvent("deleteWhere", {
              collection: this._store,
              whereClause: where,
              keyPath: this.keyPath,
            });
          }
          resolve(true);
        };
        tx.onerror = () => reject(tx.error);
      });
    });
  }

  async batchAdd<T>(items: Partial<T>[], opts?: { silent?: boolean }): Promise<T[]> {
    return this.enqueueWrite(async () => {
      const db = await this.getDatabase();
      const tx = db.transaction(this._store, "readwrite");
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
            getIdbqlEvent().registerEvent("batchAdd", {
              collection: this._store,
              data: results,
              count: items.length,
              keyPath: this.keyPath,
            });
          }
          resolve(results);
        };
        tx.onerror = () => reject(tx.error);
      });
    });
  }

  async batchPut<T>(items: Partial<T>[], opts?: { silent?: boolean }): Promise<T[]> {
    return this.enqueueWrite(async () => {
      const db = await this.getDatabase();
      const tx = db.transaction(this._store, "readwrite");
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
            getIdbqlEvent().registerEvent("batchPut", {
              collection: this._store,
              data: results,
              count: items.length,
              keyPath: this.keyPath,
            });
          }
          resolve(results);
        };
        tx.onerror = () => reject(tx.error);
      });
    });
  }
}
export const Collection: CollectionCore = createIDBStoreProxy(CollectionCore);

/**
 * Proxy wrapper for CollectionCore - passthrough only.
 * Event emission is handled directly within each method to prevent duplicate events.
 */
function createIDBStoreProxy(store: any) {
  return new Proxy(store, {
    construct(target: any, args: any[]) {
      const instance = new target(...args);
      return new Proxy(instance, {
        get(target: any, prop: string | symbol, receiver: any) {
          return Reflect.get(target, prop, receiver);
        },
      });
    },
  });
}
