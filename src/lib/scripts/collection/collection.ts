import { type Where } from "../types.js";
import { Query } from "../query/query.js";
import { idbqlState } from "../state/idbstate.svelte.js";
import type { ResultsetOptions, ResultSet } from "../resultSet/Resultset.js";

export class Collection<T = any> {
  #store: string;
  private version?: number;
  private dbName;

  private dBOpenRequest!: IDBOpenDBRequest;
  private dBTransaction!: IDBTransaction;

  public dbCollection?: IDBObjectStore;

  private command!: string;
  private keyPath!: string;

  constructor(store: string, dbName: string, version?: number) {
    this.#store = store;
    this.version = version;
    this.dbName = dbName;
  }

  get name() {
    return this.#store;
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
        if (!db.objectStoreNames.contains(this.#store)) {
          reject("collection not found");
          return false;
        }
        this.dBTransaction = db.transaction(this.#store, "readwrite");

        this.dbCollection = this.dBTransaction.objectStore(this.#store);

        const command = this.command;
        this.dBTransaction.oncomplete = function (event) {};

        resolve(this.dbCollection);
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
    const data = await this.getAll();
    const query = new Query<T>(data);
    let resultSet = query.where(qy);

    if (options) {
      resultSet.setOptions(options);
    }

    return resultSet;
  }

  async update(keyPathValue: string | number, data: Partial<T>) {
    const storeObj = await this.getCollection();
    const keyPath = storeObj?.keyPath;
    this.put({ [keyPath as keyof T]: keyPathValue, ...data });
  }
  async updateWhere(where: Where<T>, data: Partial<T>) {
    return this.where(where).then(
      (rs: ResultSet<Record<string, any>> | ResultSet<T>) => {
        return new Promise(async (resolve, reject) => {
          const storeObj = await this.getCollection();
          const keyPath = this.dbCollection?.keyPath;
          const id: string | undefined =
            typeof keyPath === "string" ? keyPath : keyPath?.[0];

          [...rs].forEach((dta: T | Record<string, any>) => {
            if (id && dta[id]) {
              const newData = {
                [keyPath as keyof T]: dta[id],
                ...dta,
                ...data,
              };
              const put = storeObj.put(newData);

              put.onsuccess = () => {
                idbqlState.registerEvent("update", {
                  collection: this.#store,
                  data: newData,
                });
                resolve(true);
              };
            }
          });
        });
      }
    );
  }

  // put data to indexedDB, replace collection content
  async put(value: Partial<T>) {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const put = storeObj.put(value);
      put.onsuccess = async () => {
        const dt = await this.getAll();
        idbqlState.registerEvent("put", {
          collection: this.#store,
          data: dt,
        });
        resolve(put.result);
      };
      put.onerror = function () {
        reject("data not put");
      };
    });
  }

  /** add data to the store */
  async add(data: T): Promise<T | boolean> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      const add = storeObj.add(data);
      add.onsuccess = async (event) => {
        const updatedData = await this.get((event.target as IDBRequest).result);
        // write to state
        idbqlState.registerEvent("add", {
          collection: this.#store,
          data: updatedData,
        });
        resolve(updatedData);
      };
      add.onerror = function (e) {
        console.log(e);
        resolve(false);
      };
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

  async getAll(): Promise<T[]> {
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

  async delete(keyPathValue: string | number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const storeObj = await this.getCollection();
      let objectStoreRequest = storeObj.delete(keyPathValue);
      const keyPath = storeObj.keyPath;
      const id: string | undefined =
        typeof keyPath === "string" ? keyPath : keyPath?.[0];
      objectStoreRequest.onsuccess = () => {
        // write to state
        idbqlState.registerEvent("delete", {
          collection: this.#store,
          data: keyPathValue,
          keyPath: id,
        });
        resolve(true);
      };
      objectStoreRequest.onerror = function () {
        resolve(false);
      };
    });
  }

  async deleteWhere(where: Where<T>): Promise<boolean> {
    this.command = "deleteWhere";
    return this.where(where).then(
      (data: ResultSet<Record<string, any>> | ResultSet<T>) => {
        return new Promise(async (resolve, reject) => {
          const storeObj = this.dbCollection ?? (await this.getCollection());
          const keyPath = this.dbCollection?.keyPath;
          const id: string | undefined =
            typeof keyPath === "string" ? keyPath : keyPath?.[0];
          [...data].forEach((data: T | Record<string, any>) => {
            if (id && data[id]) {
              let objectStoreRequest = storeObj.delete(data[id]);
              objectStoreRequest.onsuccess = () => {
                idbqlState.registerEvent("deleteWhere", {
                  collection: this.#store,
                  data: [],
                });
                resolve(true);
              };
            }
          });
        });
      }
    );
  }
}
