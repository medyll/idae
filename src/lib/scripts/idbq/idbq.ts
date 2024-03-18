import { Collection } from "../collection/collection.js";
import { Schema } from "./schema.js";

export type IdbqModel = {
  [key: string]: {
    keyPath: string | any | Record<string, any> | undefined;
    model: any;
  };
};

type ExtractModelTypes<
  T = Record<string, { keyPath: string | any; model: any }>
> = {
  [P in keyof T]: T[P] extends { model: infer M } ? M : never;
};
type ReadonlyDynMethod<T> = {
  readonly [K in keyof T]: Collection<T[K]>;
};

type MyReadonlyCollections<T> = ReadonlyDynMethod<ExtractModelTypes<T>>;

/**
 * Represents the IndexedDB wrapper for managing database operations.
 * @template T - The type of data stored in the IndexedDB.
 */
export class IdbqlCore<T = any> {
  public dbConnection?: IDBOpenDBRequest;
  private databaseName: string;
  dbVersion!: number;
  public idbDatabase?: IDBDatabase;
  public schema: Record<string, any> = {};
  /**
   * Creates an instance of Idbq.
   * @param {string} databaseName - The name of the database.
   */
  constructor(databaseName: string, idbqModel: IdbqModel, version: number = 1) {
    this.databaseName = databaseName;
    this.idbDatabase = undefined;

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

    this.version(version).stores(stores);
  }

  /**
   * Sets the version of the database.
   * @param {number} version - The version number of the database.
   * @returns {object} - An object with a `stores` method to define the object stores.
   */
  version(version: number) {
    this.dbVersion = version;
    return {
      stores: async (args: Record<string, string>) => {
        if (typeof indexedDB !== "undefined") {
          return new Promise((resolve, reject) => {
            this.schema = args;

            const dbConnection = indexedDB.open(
              this.databaseName,
              this.dbVersion
            );
            if (dbConnection != undefined) {
              this.createCollections(args);

              dbConnection.onsuccess = () => {
                this.idbDatabase = this.dbConnection?.result;
              };
              dbConnection.onupgradeneeded = async (event: Event) => {
                if (this.dbConnection) {
                  const m = new Schema();
                  this.idbDatabase = this.dbConnection?.result;

                  m.createSchema(this.dbConnection.result, args);
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
      },
    };
  }

  private createCollections(args: any) {
    Object.keys(this.schema).map(async (storeName) => {
      Object.defineProperty(this, storeName, {
        value: new Collection(
          storeName,
          this.databaseName,
          this.dbVersion
        ) as unknown as Collection<T>,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
  }

  /**
   * Closes the database connection.
   * @private
   */
  public closeDatabase(): void {
    if (this.idbDatabase) this.idbDatabase.close();
  }
}

export const idbqBase = <T>(
  model: IdbqModel,
  version: number
): ((name: string) => MyReadonlyCollections<T>) => {
  return (name: string) => {
    const idb_ = new IdbqlCore(name, model, version);
    return idb_ as MyReadonlyCollections<T> & typeof idb_;
  };
};
