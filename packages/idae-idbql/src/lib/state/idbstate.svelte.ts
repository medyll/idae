/* path: D:\boulot\app-node\idbql\src\lib\scripts\state\idbstate.svelte.ts */
import type { IdbqlIndexedCore } from "$lib/idbqlCore/idbqlCore.js";

// Add an index signature to IdbqlIndexedCore
interface IdbqlIndexedCore {
  [key: string]: CollectionCore<any>;
}
import type { CollectionCore } from "$lib/collection/collection.svelte.js";
import { idbqlEvent } from "./idbqlEvent.svelte.js";
//
import {
  Operators,
  getResultset,
  type Where,
  type ResultSet,
  type ResultsetOptions,
} from "@medyll/idae-query";
//

type IDBCollections<T> = {
  [K in keyof T]: CollectionState<T[K]>;
};
/**
 * Main entry point.
 * Creates a state object with indexedDB synchronization.
 * @param {IdbqlIndexedCore} [idbBase] - The IdbqlCore instance.
 * @returns {object} - The state object.
 */
export const createIdbqlState = (idbBase: IdbqlIndexedCore) => {
  let collections: Record<string, CollectionState<any>> = {};

  if (idbBase.schema) {
    addCollections(idbBase.schema);
  }

  let qolie = function dbQuery(collection: keyof typeof collections) {
    if (!collections[collection])
      throw new Error(`Collection ${collection} not found`);
    return {
      get: collections[collection].get,
      getBy: collections[collection].getBy,
      getOne: collections[collection].getOne,
      getAll: collections[collection].getAll,
      create: collections[collection].put,
      delete: collections[collection].delete,
      deleteWhere: collections[collection].deleteWhere,
      update: collections[collection].update,
      where: collections[collection].where,
      updateWhere: collections[collection].updateWhere,
    };
  };

  function addCollection<T>(collectionName: string) {
    return new CollectionState<T>(collectionName, idbBase);
  }

  function addCollections<T = typeof idbBase.schema>(args: T) {
    Object.keys(args).map((collection) => {
      const t = args[collection];
      collections[collection] = addCollection<typeof t>(collection);
    });
  }

  return {
    get collectionState() {
      return collections;
    },
    get qolie() {
      return qolie;
    },
    onCollection: addCollection,
    addCollection: addCollection,
  };
};

/**
 * Represents a dynamic state collection that interacts with an IndexedDB base.
 * Provides methods for performing CRUD operations and querying the collection.
 *
 * @template T - The type of items in the collection.
 */
export class CollectionState<T> {
  private collectionName: string;
  private idbBase: IdbqlIndexedCore;

  /**
   * Creates an instance of StateCollectionDyn.
   * @param {string} collectionName - The name of the collection.
   * @param {IdbqlIndexedCore} idbBase - The instance of the IndexedDB base.
   */
  constructor(collectionName: string, idbBase: IdbqlIndexedCore) {
    if (!idbqlEvent.dataState?.[collectionName]) {
      idbqlEvent.dataState[collectionName] = [];
    }
    this.collectionName = collectionName;
    this.idbBase = idbBase;

    this.feed();

    return this;
  }

  /**
   * Gets the current state of the collection.
   * @returns {ResultSet<T>} The state of the collection.
   */
  get collectionState(): ResultSet<T> {
    return idbqlEvent?.dataState?.[this.collectionName] as ResultSet<T>;
  }

  /**
   * Tests if the collection exists in the IndexedDB base.
   * @param {string} collection - The name of the collection.
   * @returns {boolean} True if the collection exists, otherwise false.
   */
  private testIdbql(collection: string): boolean {
    return this.idbBase && Boolean(this.idbBase?.[collection]);
  }

  /**
   * Feeds the collection with data from the IndexedDB base.
   */
  private feed(): void {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      this.idbBase[this.collectionName].getAll().then((data) => {
        idbqlEvent.dataState[this.collectionName] = getResultset(data);
      });
    }
  }

  /* READ OPERATIONS */

  /**
   * Performs a "where" query on the collection.
   * @param {Where<T>} qy - The "where" query.
   * @param {ResultsetOptions} [options] - Optional result set options.
   * @returns {ResultSet<T>} The result set of the query.
   */
  _where(qy: Where<T>, options?: ResultsetOptions): ResultSet<T> {
    let dts = this.collectionState;
    let c = Operators.parse(dts ?? getResultset([]), qy);
    const r = getResultset<T>(c);
    if (options) r.setOptions(options);
    return r;
  }

  /**
   * Gets a function to perform a "where" query on the collection.
   * @returns {(qy: Where<T>, options?: ResultsetOptions) => ResultSet<T>} The function to perform the query.
   */
  get where() {
    return (qy: Where<T>, options?: ResultsetOptions) =>
      this._where(qy, options);
  }

  /**
   * Gets items from the collection by a specific value and key.
   * @param {any} value - The value to search for.
   * @param {string} [pathKey="id"] - The key to search by.
   * @returns {ResultSet<T>} The result set of the query.
   */
  get(value: any, pathKey: string = "id"): ResultSet<T> {
    return this.collectionState?.filter(
      (d) => d[pathKey] === value,
    ) as ResultSet<T>;
  }

  /**
   * Gets items from the collection by a specific value and key using a "where" query.
   * @param {any} value - The value to search for.
   * @param {string} [pathKey="id"] - The key to search by.
   * @returns {ResultSet<T>} The result set of the query.
   */
  getBy(value: any, pathKey: string = "id"): ResultSet<T> {
    return this.where({ [pathKey]: value });
  }

  /**
   * Gets a single item from the collection by a specific value and key.
   * @deprecated Use getBy instead.
   * @param {any} value - The value to search for.
   * @param {string} [pathKey="id"] - The key to search by.
   * @returns {T | undefined} The item found, or undefined if not found.
   */
  getOne(value: any, pathKey: string = "id"): T | undefined {
    return this.where({ [pathKey]: value })?.[0] as T | undefined;
  }

  /**
   * Gets all items from the collection.
   * @returns {ResultSet<T>} The result set of all items.
   */
  getAll = (): ResultSet<T> => {
    return this.collectionState;
  };

  /* WRITE OPERATIONS */

  /**
   * Updates an item in the collection by a specific key path value.
   * @param {string | number} keyPathValue - The key path value of the item to update.
   * @param {Partial<T>} data - The data to update.
   * @returns {Promise<boolean | undefined>} True if the update was successful, otherwise undefined.
   */
  async update(
    keyPathValue: string | number,
    data: Partial<T>,
  ): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return (await (
        this.idbBase[this.collectionName] as CollectionCore
      ).update(keyPathValue, data)) as unknown as boolean | undefined;
    }
    return undefined;
  }

  /**
   * Updates items in the collection that match a "where" query.
   * @param {Where<T>} where - The "where" query to match items.
   * @param {Partial<T>} data - The data to update.
   * @returns {Promise<boolean | undefined>} True if the update was successful, otherwise undefined.
   */
  async updateWhere(
    where: Where<T>,
    data: Partial<T>,
  ): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return (await this.idbBase[this.collectionName].updateWhere(
        where,
        data,
      )) as Promise<boolean | undefined>;
    }
    return undefined;
  }

  /**
   * Puts an item into the collection.
   * @param {Partial<T>} value - The item to put.
   * @returns {Promise<T | undefined>} The item put, or undefined if the operation failed.
   */
  async put(value: Partial<T>): Promise<T | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return this.idbBase[this.collectionName].put<T>(value).then((data) => {
        return data;
      });
    }
    return undefined;
  }

  /**
   * Adds an item to the collection.
   * @param {T} data - The item to add.
   * @returns {Promise<T | undefined>} The item added, or undefined if the operation failed.
   */
  async add(data: T): Promise<T | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return (await this.idbBase[this.collectionName].add<T>(data)) as Promise<
        T | undefined
      >;
    }
    return undefined;
  }

  /**
   * Deletes an item from the collection by a specific key path value.
   * @param {string | number} keyPathValue - The key path value of the item to delete.
   * @returns {Promise<boolean | undefined>} True if the deletion was successful, otherwise undefined.
   */
  async delete(keyPathValue: string | number): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].delete(keyPathValue);
    }
    return undefined;
  }

  /**
   * Deletes an item from the collection by a specific key path value.
   * @deprecated Use delete instead.
   * @param {string | number} keyPathValue - The key path value of the item to delete.
   * @returns {Promise<boolean | undefined>} True if the deletion was successful, otherwise undefined.
   */
  async del(keyPathValue: string | number): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].delete(keyPathValue);
    }
  }

  /**
   * Deletes items from the collection that match a "where" query.
   * @param {Where<T>} where - The "where" query to match items.
   * @returns {Promise<boolean | undefined>} True if the deletion was successful, otherwise undefined.
   */
  async deleteWhere(where: Where<T>): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].deleteWhere(where);
    }
  }
}
