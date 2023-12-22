import { Operators } from "./operators.js";
import { Options, type OptionsType } from "./options.js";
import { type Operator, type Where } from "./types.js";

export class Collection<T = any> {
  private store: string;
  private version: number;
  private dbName;

  constructor(dbName: string, store: string, version: number) {
    this.store = store;
    this.version = version;
    this.dbName = dbName;
  }

  /** get the collection */
  private async getCollection(): Promise<{
    request: IDBRequest;
    store: IDBObjectStore;
  }> {
    return new Promise((resolve, reject) => {
      var DBOpenRequest = window.indexedDB.open(this.dbName, this.version);
      DBOpenRequest.onsuccess = (event) => {
        const db = event?.target?.result;
        if (!db.objectStoreNames.contains(this.store)) {
          reject("collection not found");
          return false;
        }
        const store = DBOpenRequest.result
          .transaction(this.store, "readwrite")
          .objectStore(this.store);

        resolve({ request: DBOpenRequest, store });
      };
      DBOpenRequest.onerror = () => reject(DBOpenRequest.error);
    });
  }

  /* get all data from the store */
  private async getData() {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const getAll = storeObj.store.getAll();
      getAll.onsuccess = function (event: Event) {
        resolve(event?.target?.result);
      };
      getAll.onerror = function () {
        reject(storeObj.request.error);
      };
    });
  }

  async set(value: T): Promise<T> {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const getAll = storeObj.store.put(value);
      getAll.onsuccess = function () {
        resolve(storeObj.request.result);
      };
      getAll.onerror = function () {
        reject(storeObj.request.error ?? "error");
      };
    });
  }

  async where(qy: Where<T>, options?: OptionsType) {
    return this.getData()
      .then((data: T[]) => {
        let resultSet: any[] = [...data];

        for (const fieldName in qy) {
          const query = qy[fieldName];

          for (const key in query) {
            // if operator
            if (Operators.operators.includes(key as Operator)) {
              const operator = key as Operator;
              const value = query[key as Operator];

              resultSet = Operators.filters(
                fieldName,
                operator,
                value,
                resultSet
              );
            }
          }
        }

        if (options) {
          resultSet = Options.applyOptions(options, resultSet);
        }

        return resultSet;
      })
      .catch((err) => {
        throw err;
      });
  }

  /** add data to the store */
  async add(data: T): Promise<IDBDatabase> {
    const storeObj = await this.getCollection();

    return new Promise((resolve, reject) => {
      const add = storeObj.store.add(data);
      add.onsuccess = function () {
        resolve(storeObj.request.result);
      };
      add.onerror = function () {
        // reject("data not added");
      };
    });
  }

  // put data to indexedDB
  async put(value: Partial<T>) {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const put = storeObj.store.put(value);
      put.onsuccess = function () {
        resolve(storeObj.request.result);
      };
      put.onerror = function () {
        reject("data not put");
      };
    });
  }

  // get data from indexedDB
  async get(value: any): Promise<T> {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const get = storeObj.store.get(value);
      get.onsuccess = function () {
        resolve(storeObj.request.result);
      };
      get.onerror = function () {
        reject("not found");
      };
    });
  }

  // get all data from indexedDB
  async getAll(): Promise<T[]> {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const getAll = storeObj.store.getAll();
      getAll.onsuccess = function () {
        resolve(storeObj.request.result);
      };
      getAll.onerror = function () {
        reject("not found");
      };
    });
  }

  private delete(key: string): Promise<T> {}
}
