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

/**
 * Main entry point.
 * Creates a state object with indexedDB synchronization.
 * @param {IdbqlIndexedCore} [idbBase] - The IdbqlCore instance.
 * @returns {object} - The state object.
 */
export const createIdbqlState = (idbBase: IdbqlIndexedCore) => {
  let collections: Record<string, any> = {};

  if (idbBase.schema) {
    addCollections(idbBase.schema);
  }
  /**
   * Adds a collection to the svelte 5 state and synchronize with indexedDB if it exists.
   * @template T - The type of data in the collection.
   * @param {string} collectionName - The name of the collection.
   * @param {string} [keyPath="id"] - The key path for the collection.
   * @returns {Proxy} - A proxy object with methods to interact with the collection.
   */
  function addCollection<T>(collectionName: string) {
    return new StateCollectionDyn<T>(collectionName, idbBase);
  }

  function addCollections<T = typeof idbBase.schema>(args: T) {
    Object.keys(args).map((collection) => {
      const t = args[collection];
      collections[collection] = addCollection<typeof t>(collection);
    });
  }

  return {
    get state() {
      return collections;
    },
    onCollection: addCollection,
    addCollection: addCollection,
  };
};

/**
 * Adds a collection to the svelte 5 state and synchronize with indexedDB if it exists.
 * @template T - The type of data in the collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} [keyPath="id"] - The key path for the collection.
 * @returns {Proxy} - A proxy object with methods to interact with the collection.
 */
export class StateCollectionDyn<T> {
  private collectionName: string;
  private idbBase: IdbqlIndexedCore;

  constructor(collectionName: string, idbBase: IdbqlIndexedCore) {
    if (!idbqlEvent.dataState?.[collectionName]) {
      idbqlEvent.dataState[collectionName] = [];
    }
    this.collectionName = collectionName;
    this.idbBase = idbBase;

    this.feed();

    return this;
  }

  get collectionState() {
    return idbqlEvent?.dataState?.[this.collectionName];
  }

  private testIdbql(collection: string) {
    return this.idbBase && Boolean(this.idbBase?.[collection]);
  }

  private feed() {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      this.idbBase[this.collectionName].getAll().then((data) => {
        idbqlEvent.dataState = {
          ...idbqlEvent.dataState,
          [this.collectionName]: data,
        };
      });
    }
  }

  _where(qy: Where<T>, options?: ResultsetOptions) {
    let dts = this.collectionState;
    let c = Operators.parse(dts ?? [], qy);
    const r = getResultset<T>(c);
    if (options) r.setOptions(options);
    return r;
  }

  get where() {
    return (qy: Where<T>, options?: ResultsetOptions) =>
      this._where(qy, options);
  }

  async update(
    keyPathValue: string | number,
    data: Partial<T>,
  ): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return (await (
        this.idbBase[this.collectionName] as CollectionCore
      ).update(keyPathValue, data)) as boolean | undefined;
    }
  }

  get(value: any, pathKey: string = "id"): T[] {
    return this.collectionState.filter((d) => d[pathKey] === value) as T[];
  }

  getOne(value: any, pathKey: string = "id"): T {
    return this.collectionState.filter((d) => d[pathKey] === value)?.[0] as T;
  }

  getAll = (): T[] => {
    //return this.collectionState;
    return this.collectionState;
    getResultset(this.collectionState);
  };

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

  async put(value: Partial<T>): Promise<T | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return this.idbBase[this.collectionName].put<T>(value).then((data) => {
        return data;
      });
    }
    return undefined;
  }

  async add(data: T): Promise<T | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return (await this.idbBase[this.collectionName].add<T>(data)) as Promise<
        T | undefined
      >;
    }
    return undefined;
  }

  async delete(keyPathValue: string | number): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].delete(keyPathValue);
    }
    return undefined;
  }
  /** @deprecated */
  async del(keyPathValue: string | number): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].delete(keyPathValue);
    }
  }

  async deleteWhere(where: Where<T>): Promise<boolean | undefined> {
    if (this.idbBase && this.testIdbql(this.collectionName)) {
      return await this.idbBase[this.collectionName].deleteWhere(where);
    }
  }
}
