import { Collection, CollectionCore } from "../collection/collection.js";
import { createIdbqlState } from "../state/idbstate.svelte.js";
import { Schema } from "./schema.js";

export type IdbqModel = {
  [key: string]: {
    keyPath: string | undefined;
    model: any;
  };
};

type ModelTypes<T = Record<string, { keyPath: string | any; model: any }>> = {
  [P in keyof T]: T[P] extends { model: infer M } ? M : never;
};
type Method<T> = {
  // @ts-ignore
  readonly [K in keyof T]: CollectionCore<T[K]>;
};

type ReadonlyCollections<T> = Method<ModelTypes<T>>;

/**
 * Represents the IndexedDB wrapper for managing database operations.
 * @template T - The type of data stored in the IndexedDB.
 */
export class IdbqlIndexedCore<T = any> {
  private databaseName: string;
  dbVersion!: number;
  public idbDatabase?: IDBDatabase;

  #schema: Record<string, any> = {};
  #idbqModel: IdbqModel = {};
  /**
   * Creates an instance of Idbq.
   * @param {string} databaseName - The name of the database.
   */
  constructor(databaseName: string, idbqModel: IdbqModel, version: number) {
    this.databaseName = databaseName;
    this.idbDatabase = undefined;
    this.#idbqModel = idbqModel;
    this.dbVersion = version;

    const stores: { [key: string]: string } = {};

    Object.keys(idbqModel).forEach((modelName) => {
      const modelInfo = idbqModel[modelName];
      stores[modelName] = modelInfo.keyPath || "";

      Object.defineProperty(this, modelName, {
        // @ts-ignore
        value: undefined as unknown as Collection<typeof modelInfo.model>,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    this.stores(stores);
  }

  get schema() {
    return this.#schema;
  }
  get idbqModel() {
    return this.#idbqModel;
  }

  proxifies<T>(obj: T) {}

  /**
   * Sets the version of the database.
   * @param {number} version - The version number of the database.
   * @returns {object} - An object with a `stores` method to define the object stores.
   */
  async stores(args: Record<string, string>) {
    if (typeof indexedDB !== "undefined") {
      return new Promise((resolve, reject) => {
        this.#schema = args;

        const dbConnection = indexedDB.open(this.databaseName, this.dbVersion);
        if (dbConnection != undefined) {
          this.createCollections(args, this.dbVersion);

          dbConnection.onsuccess = (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            this.idbDatabase = db;
          };
          dbConnection.onupgradeneeded = async (event: Event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (db) {
              const m = new Schema();
              m.createSchema(db, args);
            } else {
              reject(true);
            }
          };
          resolve(true);
        } else {
          reject(true);
        }
      });
    } else {
    }
  }

  // @ts-ignore
  private createCollections(args: any, version: number) {
    Object.keys(this.#schema).map(async (storeName) => {
      Object.defineProperty(this, storeName, {
        // @ts-ignore
        value: new Collection(storeName, this.#schema[storeName], {
          dbName: this.databaseName,
          version, // @ts-ignore
        }) as unknown as Collection<T>,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  }
}

/**
 * Creates an IndexedDB database store schema for the given model and version.
 *
 * @param model - The IdbqModel representing the structure of the store.
 * @param version - The version number of the store.
 * @returns A function that creates a readonly collection for the given name.
 * The returned function returns an instance of ReadonlyCollections<T> & typeof idb_.
 *
 * @typeparam T - The type of data stored in the collections.
 */
export const createIdbqDb = <T>(model: IdbqModel, version: number) => {
  return {
    /**
     * Creates an IndexedDB database store based on the pre-declared model, with a given name.
     * @param name - The name of the store.
     * @returns An object containing the database, model, and idbqlState.
     */
    create: (name: string) => {
      const idb_ = new IdbqlIndexedCore(name, model, version);
      return {
        idbDatabase: idb_ as typeof idb_,
        idbql: idb_ as ReadonlyCollections<T>,
        idbqlState: createIdbqlState(idb_) as ReadonlyCollections<T>,
      };
    },
  };
};

export const idbqBase = createIdbqDb;

// Query
