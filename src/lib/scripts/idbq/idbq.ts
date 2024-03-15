import { Collection } from "../collection/collection.js";
import { getWhere } from "../state/svelte/sttae.svelte.js";
import { Schema } from "./schema.js";

/**
 * Represents the IndexedDB wrapper for managing database operations.
 * @template T - The type of data stored in the IndexedDB.
 */
export class Idbq<T = any> {
  public dbConnection?: IDBOpenDBRequest;
  private databaseName: string;
  private dbVersion!: number;
  public idbDatabase?: IDBDatabase;
  public schema: Record<string, any> = {};
  /**
   * Creates an instance of Idbq.
   * @param {string} databaseName - The name of the database.
   */
  constructor(databaseName: string) {
    this.databaseName = databaseName;
    this.idbDatabase = undefined;
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
            // store the schema
            this.schema = args;
            // create or open the database
            this.openDatabase(version);

            if (this.dbConnection != undefined) {
              // create tables
              this.createCollections(args);
              this.dbConnection.onupgradeneeded = async (event: Event) => {
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

  /**
   * Creates the object stores based on the provided schema.
   * @param {Record<string, string>} args - The schema defining the object stores.
   * @private
   */
  private createCollections(args: any) {
    Object.keys(this.schema).map(async (storeName) => {
      const col = new Collection(storeName, this.databaseName, this.dbVersion);
      this[storeName] = Object.defineProperty(col, "state", {
        value: getWhere,
      });
    });
  }

  /**
   * Opens the database connection.
   * @param {number} version - The version number of the database.
   * @private
   */
  private async openDatabase(version: number) {
    return new Promise((resolve, reject) => {
      // open the database
      this.dbConnection = indexedDB.open(
        this.databaseName,
        version ?? this.dbVersion
      );

      this.dbConnection.onerror = (event) => {};

      this.dbConnection.onsuccess = (event: Event) => {
        this.idbDatabase = this.dbConnection?.result;
        resolve(true);
      };
    });
  }

  /**
   * Closes the database connection.
   * @private
   */
  public closeDatabase(): void {
    if (this.idbDatabase) {
      this.idbDatabase.close();
      this.idbDatabase = undefined;
    }
  }
}
