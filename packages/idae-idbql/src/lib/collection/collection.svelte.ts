/* path:  src\lib\scripts\collection\collection.ts */

import { Query, getResultset } from "@medyll/idae-query";

import {
  type Where,
  type ResultsetOptions,
  type ResultSet,
} from "@medyll/idae-query";

import { idbqlEvent } from "$lib/state/idbqlEvent.svelte.js";

export class CollectionCore<T = any> {
  protected _store: string;
  private version?: number;
  private dbName;

  private dBOpenRequest!: IDBOpenDBRequest;

  private keyPath: string;

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
   * 
   * @param qy - Optional query object specifying the conditions for filtering the data.
   * @returns A promise that resolves to the number of documents matching the query (or all documents if no query is provided).
   * @throws If an error occurs while counting the data.
   * 
   * @example
   * // Count all documents in the collection (fast, uses native count)
   * const totalCount = await collection.count();
   * 
   * @example
   * // Count documents matching a query (retrieves matching documents)
   * const activeCount = await collection.count({ status: 'active' });
   * 
   * @example
   * // Count with complex query
   * const count = await collection.count({ age: { $gt: 18 }, status: 'active' });
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
  async update(keyPathValue: string | number, data: Partial<T>) {
    const dta = await this.get(keyPathValue);
    return this.put({
      [this.keyPath as keyof T]: keyPathValue,
      ...dta,
      ...data,
    });
  }
  async updateWhere(where: Where<T>, data: Partial<T>) {
    return this.where(where).then((rs) => {
      return new Promise(async (resolve, reject) => {
        Promise.all(
          (rs as T[]).map((dta: T) => {
            if (this.keyPath && dta[this.keyPath]) {
              const newData = {
                [this.keyPath as keyof T]: dta[this.keyPath],
                ...dta,
                ...data,
              };
              return this.put(newData);
            }
          }),
        )
          .then(() => {
            resolve(true);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  }

  // put data to indexedDB, replace collection content if present
  async put<T>(value: Partial<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();

      const put = storeObj.put(value);
      put.onsuccess = async (event) => {
        const updatedData = await this.get((event.target as IDBRequest).result);
        resolve(updatedData);
      };
      put.onerror = function () {
        reject("data not put");
      };
    });
  }

  /** ok add data to the store */
  async add<T>(data: Partial<T>): Promise<T | boolean> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const add = storeObj.add(data);
      add.onsuccess = async (event) => {
        const updatedData = await this.get((event.target as IDBRequest).result);

        resolve(updatedData);
      };
      add.onerror = function (e) {
        console.log(e);
        reject(e);
      };
    });
  }

  async delete(keyPathValue: string | number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      let objectStoreRequest = storeObj.delete(keyPathValue);

      objectStoreRequest.onsuccess = () => {
        idbqlEvent.registerEvent("delete", {
          collection: this._store,
          data: { [this.keyPath]: keyPathValue },
          keyPath: this.keyPath,
        });
        resolve(true);
      };
      objectStoreRequest.onerror = function () {
        reject(false);
      };
    });
  }

  async deleteWhere(where: Where<T>): Promise<boolean> {
    return this.where(where).then((data: T[]) => {
      return Promise.all(
        data.map((item: T) => {
          if (this.keyPath && item[this.keyPath]) {
            return this.delete(item[this.keyPath]);
          }
        }),
      )
        .then(() => true)
        .catch(() => false);
    });
  }
}
export const Collection: CollectionCore = createIDBStoreProxy(CollectionCore);

function createIDBStoreProxy(store) {
  return new Proxy(store, {
    construct(target, args) {
      const instance = new target(...args);
      return new Proxy(instance, {
        get(target, prop, receiver) {
          const origMethod = target[prop];
          if (
            typeof origMethod === "function" &&
            (
              [
                "update",
                "updateWhere",
                "put",
                "add",
                "delete",
                "deleteWhere",
              ] as string[]
            ).includes(String(prop))
          ) {
            return function (...args) {
              return new Promise(async (resolve, reject) => {
                (origMethod as Function)
                  .apply(instance, args)
                  .then((res) => {
                    idbqlEvent.registerEvent(prop as any, {
                      collection: instance._store,
                      data: res,
                      keyPath: instance.keyPath,
                    });
                    resolve(res);
                  })
                  .catch((e) => {
                    reject(e);
                  });
              }).finally(() => {});
              // return origMethod.apply(this, args);
            };
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    },
  });
}
