import type { IdbqlIndexedCore } from "$lib/scripts/idbqlCore/idbqlCore.js";
import { Operators } from "$lib/scripts/operators/operators.js";
import {
  getResultset,
  type ResultsetOptions,
} from "$lib/scripts/resultSet/Resultset.js";
import type { Where } from "$lib/scripts/types.js";
import { idbqlEvent } from "./idbqlEvent.svelte.js";

/**
 * Main entry point.
 * Creates a state object with indexedDB synchronization.
 * @param {IdbqlIndexedCore} [idbBase] - The IdbqlCore instance.
 * @returns {object} - The state object.
 */
export const createIdbqlState = (idbBase?: IdbqlIndexedCore) => {
  let state = idbqlEvent.dataState;
  let collections: Record<string, any> = {};

  if (idbBase?.schema) {
    addCollections(idbBase.schema);
  }
  /**
   * Adds a collection to the svelte 5 state and synchronize with indexedDB if it exists.
   * @template T - The type of data in the collection.
   * @param {string} collection - The name of the collection.
   * @param {string} [keyPath="id"] - The key path for the collection.
   * @returns {Proxy} - A proxy object with methods to interact with the collection.
   */
  function addCollection<T>(collection: string, keyPath: string = "id") {
    const collectionState = {
      get rs() {
        return state[collection];
      },
    };

    if (!state?.[collection]) state[collection] = [];
    feed();
    function testIdbql(collection: string) {
      return idbBase && Boolean(idbBase?.[collection]);
    }
    function feed() {
      if (idbBase && testIdbql(collection)) {
        idbBase[collection].getAll().then((data) => {
          state[collection] = data;
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
      return {
        get rs() {
          let c = Operators.parse(collectionState.rs, qy);
          const r = getResultset<T>(c);
          if (options) r.setOptions(options);
          return r;
        },
      };
    }

    async function update(keyPathValue: string | number, data: Partial<T>) {
      if (idbBase && testIdbql(collection)) {
        await idbBase[collection].update(keyPathValue, data);
      }
    }
    async function updateWhere(where: Where<T>, data: Partial<T>) {
      if (idbBase && testIdbql(collection)) {
        await idbBase[collection].updateWhere(where, data);
      }
    }

    // put data to indexedDB, replace collection content
    async function put(value: Partial<T>) {
      if (idbBase && testIdbql(collection)) {
        await idbBase[collection].put(value);
      }
    }

    /** add data to the store */
    async function add(data: T) {
      if (idbBase && testIdbql(collection)) {
        await idbBase[collection].add(data);
      }
    }

    function get(value: any, pathKey: string = "id"): T[] {
      return {
        get rs() {
          return collectionState.rs.filter((d) => d[pathKey] === value);
        },
      } as unknown as T[];
    }

    function getOne(value: any, pathKey: string = "id"): T {
      return get(value, pathKey)?.[0];
    }

    function getAll(): { rs: T[] } {
      return {
        get rs() {
          return getResultset<T>(collectionState.rs);
        },
      };
    }

    async function del(
      keyPathValue: string | number
    ): Promise<boolean | undefined> {
      if (idbBase && testIdbql(collection)) {
        return await idbBase[collection].delete(keyPathValue);
      }
    }

    async function deleteWhere(where: Where<T>): Promise<boolean | undefined> {
      if (idbBase && testIdbql(collection)) {
        return await idbBase[collection].deleteWhere(where);
      }
    }

    let ret = {
      where,
      update,
      updateWhere,
      put,
      add,
      get,
      getOne,
      getAll,
      delete: del,
      deleteWhere,
    };

    let handler = {
      get: function (obj, prop, args) {
        if (prop === "getAll") {
          return function (...args) {
            return getAll().rs as T[];
          };
        }
        if (prop === "where") {
          return function (...args) {
            // @ts-ignore
            return where(...args).rs;
          };
        }
        if (prop === "get") {
          return function (...args) {
            // @ts-ignore
            return get(...args).rs;
          };
        }
        if (prop === "getOne") {
          return function (...args) {
            // @ts-ignore
            return get(...args).rs?.[0];
          };
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
