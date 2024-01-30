import { ResultSet, type OptionsType } from "../resultSet/resultset.js";
import { type Where } from "../types.js";
import { Query } from "../query/query.js";

export class Collection<T = any> {
  private store: string;
  private version: number;
  private dbName;

  private dBOpenRequest!: IDBOpenDBRequest;

  public dbCollection?: IDBObjectStore;

  constructor(dbName: string, store: string, version: number) {
    this.store = store;
    this.version = version;
    this.dbName = dbName;
  }

  public observe() {
    return this;
  }

  /** get the collection */
  private async getCollection(): Promise<IDBObjectStore> {
    return new Promise((resolve, reject) => {
      this.dBOpenRequest = indexedDB.open(this.dbName, this.version);
      this.dBOpenRequest.onsuccess = (event) => {
        const db = this.dBOpenRequest.result;
        if (!db.objectStoreNames.contains(this.store)) {
          reject("collection not found");
          return false;
        }
        this.dbCollection = this.dBOpenRequest.result
          .transaction(this.store, "readwrite")
          .objectStore(this.store);

        console.log(this.dBOpenRequest);
        resolve(this.dbCollection);
        //resolve({ request: DBOpenRequest, store });
      };
      this.dBOpenRequest.onerror = () => reject(this.dBOpenRequest.error);
    });
  }

  /* get all data from the store */
  private async getData() {
    const storeObj = this.dbCollection ?? (await this.getCollection());
    return new Promise((resolve, reject) => {
      const getAll = storeObj.getAll();
      getAll.onsuccess = function (event: Event) {
        resolve(getAll.result);
      };
      getAll.onerror = function () {
        reject(getAll.error);
      };
    });
  }

  async set(value: T): Promise<T> {
    const storeObj = this.dbCollection ?? (await this.getCollection());
    return new Promise((resolve, reject) => {
      const getAll = storeObj.put(value);
      getAll.onsuccess = function () {
        resolve(getAll.result);
      };
      getAll.onerror = function () {
        reject(getAll.error ?? "error");
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
  async add(data: T): Promise<IDBDatabase> {
    const storeObj = this.dbCollection ?? (await this.getCollection());

    return new Promise((resolve, reject) => {
      const add = storeObj.add(data);
      add.onsuccess = () => {
        // publish event
        resolve(add?.result);
      };
      add.onerror = function () {
        // reject("data not added");
      };
    });
  }

  // put data to indexedDB
  async put(value: Partial<T>) {
    const storeObj = this.dbCollection ?? (await this.getCollection());
    return new Promise((resolve, reject) => {
      const put = storeObj.put(value);
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
    const storeObj = this.dbCollection ?? (await this.getCollection());
    return new Promise((resolve, reject) => {
      const get = storeObj.get(value);
      get.onsuccess = function () {
        resolve(get.result);
      };
      get.onerror = function () {
        reject("not found");
      };
    });
  }

  // get all data from indexedDB
  async getAll(): Promise<T[]> {
    const storeObj = this.dbCollection ?? (await this.getCollection());
    return new Promise((resolve, reject) => {
      const getAll = storeObj.getAll();
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
}
