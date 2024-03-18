import { Collection } from "$lib/scripts/collection/collection.js";
import type { IdbqlCore } from "$lib/scripts/idbq/idbq.js";
import { Operators } from "$lib/scripts/operators/operators.js";
import {
  getResultset,
  type ResultsetOptions,
} from "$lib/scripts/resultSet/Resultset.js";
import type { Where } from "$lib/scripts/types.js";

let dataState = $state<Record<string, any>>({});

class idbqlStateCore {
  #dataState = dataState;

  constructor() {}

  get dataState() {
    return this.#dataState;
  }
  addCollection(collection: string) {
    if (!this.#dataState[collection]) this.#dataState[collection] = [];
    return this.#dataState[collection];
  }
  feedStateFromCollection(collection: Collection) {
    collection.getAll().then((data) => {
      this.#dataState[collection.name] = data;
    });
  }
  registerEvent(
    event: "add" | "put" | "delete" | "set" | string,
    more: {
      collection?: string;
      data?: any;
      keyPath?: any;
    }
  ) {
    switch (event) {
      case "set":
        if (more?.collection && more?.data)
          this.#dataState[more.collection] = more.data;
        break;
      case "delete":
        if (more?.collection && more?.data && more?.keyPath)
          while (true) {
            const index = this.#dataState[more.collection].findIndex(
              (item) => item[more.keyPath] === more.data
            );
            if (index === -1) {
              break;
            }
            this.#dataState[more.collection].splice(index, 1);
          }
        break;
      case "put":
      case "update":
        if (more?.collection && more?.data)
          this.#dataState[more.collection] = more.data;
        break;
      case "add":
        if (this.#dataState[more.collection]) {
          if (more?.collection && more?.data)
            this.#dataState[more.collection].push(more.data);
        }
        break;
    }
  }
}

export const idbqlState = new idbqlStateCore();

export function createState(model = {}, idbBase?: IdbqlCore) {
  let state = dataState;

  /**
   * Adds a collection to the state.
   *
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
      if (testIdbql(collection)) {
        idbBase[collection].getAll().then((data) => {
          state[collection] = data;
        });
      }
    }
    function _where(qy: Where<T>, options?: ResultsetOptions) {
      return {
        get rs() {
          return getResultset(Operators.parse(collectionState.rs, qy));
        },
      };
    }

    /**
     * Filters the resultset based on the provided query.
     * @param qy - The query to filter the resultset.
     * @param options ResultsetOptions - Optional resultset options.
     * @returns The filtered resultset.
     */
    function where(qy: Where<T>, options?: ResultsetOptions) {
      return _where(qy, options);
    }

    async function update(keyPathValue: string | number, data: Partial<T>) {
      if (testIdbql(collection)) {
        await idbBase[collection].update(keyPathValue, data);
      }
    }
    async function updateWhere(where: Where<T>, data: Partial<T>) {
      if (testIdbql(collection)) {
        await idbBase[collection].updateWhere(where, data);
      }
    }

    // put data to indexedDB, replace collection content
    async function put(value: Partial<T>) {
      if (testIdbql(collection)) {
        await idbBase[collection].put(value);
      }
    }

    /** add data to the store */
    async function add(data: T) {
      if (testIdbql(collection)) {
        await idbBase[collection].add(data);
      }
    }

    function _get(value: any, pathKey: string = "id") {
      return {
        get rs() {
          return collectionState.rs.filter((d) => d[pathKey] === value);
        },
      };
    }

    function get(value: any, pathKey: string = "id"): T[] {
      return _get(value, pathKey).rs;
    }

    function getOne(value: any, pathKey: string = "id"): T {
      return _get(value, pathKey).rs[0];
    }

    function _getAll() {
      return {
        get rs() {
          return collectionState.rs.filter((d) => d);
        },
      };
    }
    function getAll(): T[] {
      return _getAll().rs;
    }

    async function del(
      keyPathValue: string | number
    ): Promise<boolean | undefined> {
      if (testIdbql(collection)) {
        return await idbBase[collection].delete(keyPathValue);
      }
    }

    async function deleteWhere(where: Where<T>): Promise<boolean | undefined> {
      if (testIdbql(collection)) {
        return await idbBase[collection].deleteWhere(keyPathValue);
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
            return _getAll(...args).rs;
          };
        }
        /* if (prop === "where") {
          return function (...args) {
            return _where(...args).rs;
          };
        } */
        return obj?.[prop];
      },
    };

    let proxy = new Proxy(ret, handler);

    return proxy;
  }

  return {
    get state() {
      return state;
    },
    addCollection,
  };
}
