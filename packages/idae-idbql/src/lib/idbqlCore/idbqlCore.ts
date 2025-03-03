/* src\lib\scripts\idbqlCore\idbqlCore.ts */

import { Collection, CollectionCore } from "../collection/collection.svelte.js";
import {
  createIdbqlState,
  type StateCollectionDyn,
} from "../state/idbstate.svelte.js";
import { Schema } from "./idbqlSchema.js";

type ExpandProps<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export enum enumPrimitive {
  id = "id",
  any = "any",
  date = "date",
  text = "text",
  number = "number", // IdbqModelCollectionTemplate
  boolean = "boolean",
  datetime = "datetime",
  url = "url",
  email = "email",
  phone = "phone",
  time = "time",
  password = "password",
}

export enum TplProperties {
  private = "private",
  readonly = "readonly",
  required = "required",
}

type CombineElements<T extends string, U extends string = T> = T extends any
  ? T | `${T} ${CombineElements<Exclude<U, T>>}`
  : never;
type CombinedArgs = CombineElements<TplProperties>;

type IdbObjectify<T extends string> = `array-of-${T}` | `object-${T}`;

export type TplCollectionFields = Record<string, string>;
// make a method parse primitive types
export type TplFieldPrimitive<T = {}> =
  | keyof typeof enumPrimitive
  | `text-${"tiny" | "short" | "medium" | "long" | "area"}`
  | `${string}.${string}`
  | `fk-${string}.${string}`;

export type TplObjectFieldPrimitive = IdbObjectify<TplFieldPrimitive>;
export type TplFieldFk = `fk-${string}.${string}`;
export type TplFkObject = IdbObjectify<TplFieldFk>;
export type TplTypes =
  | TplFieldPrimitive
  | TplObjectFieldPrimitive
  | TplFieldFk
  | TplFkObject;

export type TplFieldArgs = `${TplTypes} (${CombinedArgs})`;
const a: TplFieldArgs = "object-any (readonly private)";
/** rules */
export type TplFieldRules = TplFieldArgs | TplTypes;
export type TplFieldType = TplFieldArgs | TplTypes;

export type IDbForge = {
  collection?: TplCollectionName;
  fieldName?: keyof TplFields;
  fieldType?: TplFieldType;
  fieldRule?: TplFieldRules;
  fieldArgs?: [keyof typeof TplProperties] | undefined;
  is: any;
};

export type IdbqModel<T = Record<string, Record<string, any>>> = {
  readonly [K in keyof T]: CollectionModel<T[K]>;
};
export type TplCollectionName<T = TplCollectionFields> = keyof IdbqModel<T>;
export type Tpl<T = TplCollectionFields> = CollectionModel<T>["template"];
export type TplFields<T = TplCollectionFields> =
  CollectionModel<T>["template"]["fields"];

//
export type CollectionModel<T = TplCollectionFields> = {
  keyPath: string | any;
  /** @deprecated use ts instead */
  model: any;
  ts: any;
  template: {
    index: string;
    presentation: CombineElements<keyof CollectionModel<T>["ts"]>;
    fields: {
      [K in keyof T]: TplFieldRules;
    };
    fks: {
      [K in TplCollectionName]?: {
        code: K;
        multiple: boolean;
        rules: CombinedArgs;
      };
    };
  };
};

type ModelTypes<T = Record<string, any>> = {
  [P in keyof T]: T[P] extends { ts: infer M }
    ? M
    : T[P] extends { model: infer M }
      ? M
      : never;
};
type Method<T> = {
  // @ts-ignore
  readonly [K in keyof T]: CollectionCore<T[K]>;
};
type MethodState<T> = {
  // @ts-ignore
  [K in keyof T]: StateCollectionDyn<T[K]>;
};

type ReadonlyCollections<T extends IdbqModel> = {
  [K in keyof T]: CollectionCore<T[K]["ts"]>;
};

type StateCollections<T extends IdbqModel> = {
  [K in keyof T]: StateCollectionDyn<T[K]["ts"]>;
};
/**
 * Represents the IndexedDB wrapper for managing database operations.
 * @template T - The type of data stored in the IndexedDB.
 */
export class IdbqlIndexedCore<T = any> {
  private databaseName: string;
  dbVersion!: number;
  public idbDatabase!: IDBDatabase;

  #schema: Record<string, any> = {};
  #idbqModel: IdbqModel = {};
  /**
   * Creates an instance of Idbq.
   * @param {string} databaseName - The name of the database.
   */
  constructor(databaseName: string, idbqModel: IdbqModel, version: number) {
    this.databaseName = databaseName;
    this.#idbqModel = idbqModel;
    this.dbVersion = version;

    const stores: { [key: string]: string } = {};

    Object.keys(idbqModel).forEach((modelName) => {
      const modelInfo = idbqModel[modelName];
      stores[modelName] = modelInfo.keyPath || "";

      Object.defineProperty(this, modelName, {
        // @ts-ignore
        value: undefined as unknown as Collection<(typeof modelInfo)["ts"]>,
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
    }
  }

  async transaction<R>(
    storeNames: string | string[],
    mode: IDBTransactionMode,
    callback: (tx: IDBTransaction) => Promise<R>,
  ): Promise<R> {
    if (!this.idbDatabase) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const tx = this.idbDatabase.transaction(storeNames, mode);
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve(result);

      let result: R;
      Promise.resolve(callback(tx)).then(
        (value) => {
          result = value;
        },
        (error) => {
          tx.abort();
          reject(error);
        },
      );
    });
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
export const createIdbqDb = <T extends IdbqModel>(
  model: T,
  version: number,
) => {
  return {
    create: (
      name: string,
    ): {
      idbDatabase: IdbqlIndexedCore<T>;
      idbql: ReadonlyCollections<T>;
      idbqlState: StateCollections<T>;
      idbqModel: T;
    } => {
      const idb_ = new IdbqlIndexedCore<T>(name, model, version);
      return {
        idbDatabase: idb_,
        idbql: idb_ as unknown as ReadonlyCollections<T>,
        idbqlState: createIdbqlState(idb_).state as StateCollections<T>,
        idbqModel: model,
      };
    },
  };
};

// main export is here ?
export const idbqBase = createIdbqDb;
