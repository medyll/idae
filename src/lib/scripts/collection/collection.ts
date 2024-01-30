import { ResultSet, type OptionsType } from "../resultSet/resultset.js";
import { type Where } from "../types.js";
import { Query } from "../query/query.js";

export class Collection<T = any> {
  private store: string;
  private version: number;
  private dbName;
  private dbCollection!: IDBObjectStore;

  constructor(dbName: string, store: string, version: number) {
    this.store = store;
    this.version = version;
    this.dbName = dbName;
  }

  public observe() {
    return this;
  }

  /** get the collection */
  private async getCollection(): Promise<{
    request: IDBRequest;
    store: IDBObjectStore;
  }> {
    return new Promise((resolve, reject) => {
      var DBOpenRequest = indexedDB.open(this.dbName, this.version);
      DBOpenRequest.onsuccess = (event) => {
        const db = event?.target?.result;
        if (!db.objectStoreNames.contains(this.store)) {
          reject("collection not found");
          return false;
        }
        const store = DBOpenRequest.result
          .transaction(this.store, "readwrite")
          .objectStore(this.store);
        //
        this.dbCollection = store;

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

  /**
   * Retrieves the data from the collection based on the provided query.
   * @param qy - The query object specifying the conditions for filtering the data.
   * @param options - The options object specifying additional operations to be applied on the result set.
   * @returns A promise that resolves to the filtered result set.
   * @throws If an error occurs while retrieving the data.
   */
  async where(qy: Where<T>, options?: OptionsType) {
    return this.getData()
      .then((data: T[]) => {
        const query = new Query<T>(data);
        let resultSet = query.where(qy);

        if (options) {
          resultSet = ResultSet.applyOptions(options, resultSet);
        }

        return resultSet;
      })
      .catch((err) => {
        throw err;
      });
  }

  /** add data to the store */
  async add(data: T): Promise<T> {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const add = storeObj.store.add(data);
      add.onsuccess = function (yes) {
        //
        // console.log(data);
        resolve(data);
        //resolve(storeObj.request.result);
      };
      add.onerror = function () {
        resolve(data);
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
        resolve(put.result);
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
        resolve(get.result);
      };
      get.onerror = function () {
        // reject("not found");
      };
    });
  }

  // get all data from indexedDB
  async getAll(): Promise<T[]> {
    const storeObj = await this.getCollection();
    return new Promise((resolve, reject) => {
      const getAll = storeObj.store.getAll();
      getAll.onsuccess = function () {
        resolve(getAll.result);
      };
      getAll.onerror = function () {
        reject("not found");
      };
    });
  }

  private delete(where: Where<T>): Promise<T> {
    this.where(where).then((data) => {
      console.log(data);
    });
  }

  private deleteAll<T>(): Promise<T> {}
}
