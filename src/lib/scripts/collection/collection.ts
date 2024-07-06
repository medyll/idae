import { type Where } from "../types.js";
import { Query } from "../query/query.js";

import {
  type ResultsetOptions,
  type ResultSet,
  getResultset,
} from "../resultSet/Resultset.js";
import { idbqlEvent } from "../state/idbqlEvent.svelte.js";

export class CollectionCore<T = any> {
  protected _store: string;
  private version?: number;
  private dbName;

  private dBOpenRequest!: IDBOpenDBRequest;

  private keyPath: string;

  constructor(
    store: string,
    keyPath: string,
    args: { dbName: string; version?: number }
  ) {
    this._store = store;
    this.version = args.version;
    this.dbName = args.dbName;
    this.keyPath = keyPath.split(",")[0].replace(/[\s+]/g, "").replace(/&/, "");
  }

  get name() {
    return this._store;
  }

  /** get the collection */
  private async getCollection(): Promise<IDBObjectStore> {
    return new Promise((resolve, reject) => {
      this.dBOpenRequest = indexedDB.open(
        this.dbName,
        this.version ?? undefined
      );
      this.dBOpenRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest)?.result;
        if (!db.objectStoreNames.contains(this._store)) {
          reject("collection not found");
          return false;
        }
        const dBTransaction = db.transaction(this._store, "readwrite");

        const dbCollection = dBTransaction.objectStore(this._store);

        dBTransaction.oncomplete = function (event) {};

        resolve(dbCollection);
      };
      this.dBOpenRequest.onerror = () => reject(this.dBOpenRequest.error);
    });
  }

  /**
   * Retrieves the data from the collection based on the provided query.
   * @param qy - The query object specifying the conditions for filtering the data.
   * @param options - The options object specifying additional operations to be applied on the result set.
   * @returns A promise that resolves to the filtered result set.
   * @throws If an error occurs while retrieving the data.
   */
  async where(qy: Where<T>, options?: ResultsetOptions) {
    return new Promise(async (resolve, reject) => {
      const data = await this.getAll();
      const query = new Query<T>(data);
      let resultSet = getResultset(query.where(qy));

      if (options) {
        resultSet.setOptions(options);
      }

      resolve(resultSet);
    });
  }

  get(value: any): Promise<T> {
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
          })
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
  async put(value: Partial<T>) {
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
  async add(data: T): Promise<T | boolean> {
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
          data: keyPathValue,
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
    return this.where(where).then((data) => {
      return new Promise(async (resolve, reject) => {
        Promise.all(
          (data as T[]).map((data: T | Record<string, any>) => {
            if (this.keyPath && data[this.keyPath]) {
              return this.delete(data[this.keyPath]);
            }
          })
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
