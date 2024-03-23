import type { IdbqlIndexedCore } from "$lib/scripts/idbqlCore/idbqlCore.js";
import { Operators } from "$lib/scripts/operators/operators.js";
import {
  getResultset,
  type ResultsetOptions,
} from "$lib/scripts/resultSet/Resultset.js";
import type { Where } from "$lib/scripts/types.js";
import type { CollectionCore } from "../collection/collection.js";
import { idbqlEvent } from "./idbqlEvent.svelte.js";

/**
 * Main entry point.
 * Creates a state object with indexedDB synchronization.
 * @param {IdbqlIndexedCore} [idbBase] - The IdbqlCore instance.
 * @returns {object} - The state object.
 */
export const createIdbqlState = (idbBase: IdbqlIndexedCore) => {
  let state = idbqlEvent.dataState;
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
  function addCollection<T>(collectionName: string, keyPath: string = "id") {
    const collectionState = {
      get rs() {
        return state[collectionName];
      },
    };

    if (!state?.[collectionName]) state[collectionName] = [];
    feed();
    function testIdbql(collection: string) {
      return idbBase && Boolean(idbBase?.[collection]);
    }
    function feed() {
      if (idbBase && testIdbql(collectionName)) {
        idbBase[collectionName].getAll().then((data) => {
          state[collectionName] = data;
        });
      }
    }

    /**
     * Filters the resultset based on the provided query.
     * @param qy - The query to filter the resultset.
     * @param options {ResultsetOptions} - Optional resultset options.
     * @returns  {Resultset} The filtered resultset.
     */
    function where(qy: Where<T>, options?: ResultsetOptions) {
      let c = Operators.parse(collectionState.rs, qy);
      const r = getResultset<T>(c);
      if (options) r.setOptions(options);
      return r;
    }

    async function update(keyPathValue: string | number, data: Partial<T>) {
      if (idbBase && testIdbql(collectionName)) {
        await (idbBase[collectionName] as CollectionCore).update(
          keyPathValue,
          data
        );
      }
    }
    async function updateWhere(where: Where<T>, data: Partial<T>) {
      if (idbBase && testIdbql(collectionName)) {
        await idbBase[collectionName].updateWhere(where, data);
      }
    }

    // put data to indexedDB, replace collection content
    async function put(value: Partial<T>) {
      if (idbBase && testIdbql(collectionName)) {
        await idbBase[collectionName].put(value);
      }
    }

    /** add data to the store */
    async function add(data: T) {
      if (idbBase && testIdbql(collectionName)) {
        await idbBase[collectionName].add(data);
      }
    }

    function get(value: any, pathKey: string = "id"): T[] {
      return collectionState.rs.filter((d) => d[pathKey] === value) as T[];
    }

    function getOne(value: any, pathKey: string = "id"): T {
      return collectionState.rs.filter((d) => d[pathKey] === value)[0] as T;
    }

    function getAll(): T[] {
      return getResultset<T>(collectionState.rs);
    }

    async function del(
      keyPathValue: string | number
    ): Promise<boolean | undefined> {
      if (idbBase && testIdbql(collectionName)) {
        return await idbBase[collectionName].delete(keyPathValue);
      }
    }

    async function deleteWhere(where: Where<T>): Promise<boolean | undefined> {
      if (idbBase && testIdbql(collectionName)) {
        return await idbBase[collectionName].deleteWhere(where);
      }
    }

    let ret = {
      where,
      get,
      getOne,
      getAll,
      update,
      updateWhere,
      put,
      add,
      delete: del,
      deleteWhere,
    };

    let handler = {
      get: function (obj, prop, args) {
        if (prop === "where") {
          console.log("get", prop);
        }
        return obj?.[prop];
      },
    };

    let proxy = new Proxy(ret, handler);

    return proxy;
  }

  function addCollections(args: Record<string, string>) {
    Object.keys(args).map((collection) => {
      collections[collection] = addCollection(collection, args[collection]);
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
 * @deprecated
 * use idbqState
 */
export const stateIdbql = createIdbqlState;
