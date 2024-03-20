import { Collection } from "../collection/collection.js";
import { idbqlState } from "../state/idbstate.svelte.js";
import { Schema } from "./schema.js";

export type IdbqModel = {
  [key: string]: {
    keyPath: string | any | Record<string, any> | undefined;
    model: any;
  };
};

type SchemaTypes<T = Record<string, { keyPath: string | any; model: any }>> = {
  [P in keyof T]: T[P] extends { model: infer M } ? M : never;
};

type ModelTypes<T = Record<string, { keyPath: string | any; model: any }>> = {
  [P in keyof T]: T[P] extends { model: infer M } ? M : never;
};
type Method<T> = {
  readonly [K in keyof T]: Collection<T[K]>;
};

type ReadonlyCollections<T> = Method<ModelTypes<T>>;

interface op {
  fr: string;
}

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
      stores[modelName] = modelInfo.keyPath;

      Object.defineProperty(this, modelName, {
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

  private createCollections(args: any, version: number) {
    Object.keys(this.#schema).map(async (storeName) => {
      Object.defineProperty(this, storeName, {
        value: new Collection(storeName, this.#schema[storeName], {
          dbName: this.databaseName,
          version,
        }) as unknown as Collection<T>,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  }
}

/**
 * Creates an IndexedDB store for the given model and version.
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
    create: (name: string) => {
      const idb_ = new IdbqlIndexedCore(name, model, version);
      return {
        db: idb_ as typeof idb_,
        model: idb_ as Method<ModelTypes<T>>,
        idbqlState: idbqlState(idb_) as Method<ModelTypes<T>>,
      };
    },
  };
};

export const idbqBase = createIdbqDb;
