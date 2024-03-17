import { Collection } from "$lib/scripts/collection/collection.js";
import type { Idbq } from "$lib/scripts/idbq/idbq.js";
import { Query } from "$lib/scripts/query/query.js";
import {
  getResultset,
  type ResultsetOptions,
} from "$lib/scripts/resultSet/resultset.js";
import type { Where } from "$lib/scripts/types.js";
import { getWhere } from "./sttae.svelte.js";

export let dataState = $state<Record<string, any>>({});

class idbqlStateCore {
  #dataState = dataState;

  constructor() {}

  get dataState() {
    return this.#dataState;
  }
  addCollection(collection: string) {
    if (!this.#dataState[collection])
      this.#dataState[collection] = Object.defineProperty([], "where", {
        value: getWhere(collection),
      });
    return this.#dataState[collection];
  }
  feedStateFromCollection(collection: Collection) {
    collection.getAll().then((data) => {
      this.#dataState[collection.store] = Object.defineProperty(data, "state", {
        value: getWhere(collection.store),
      });
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
        /* if (more?.collection && more?.data && more?.keyPath)
          this.#dataState[more.collection].findIndex(
            (d) => d[more.keyPath] === more.data[more.keyPath]
          ); */
        break;
      case "delete":
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

export function createState(model = {}, idbBase?: Idbq) {
  let state = dataState;

  function addCollection<T>(collection: string, keyPath?: string) {
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
    function where(qy: Where<T>, options?: ResultsetOptions) {
      return {
        get rs() {
          return getResultset(
            state[collection].filter((d) => d.chatId == "24")
          );
        },
      };
    }

    function update(keyPathValue: string | number, data: Partial<T>) {}
    function updateWhere(where: Where<T>, data: Partial<T>) {}

    // put data to indexedDB, replace collection content
    function put(value: Partial<T>) {}

    /** add data to the store */
    function add(data: T) {
      state?.[collection]?.push(data);
    }

    // get data from indexedDB
    function get(value: any): T {}

    // get all data from indexedDB
    function getAll(): T[] {
      return state?.[collection];
    }

    function del(keyPathValue: string | number): boolean {}

    function deleteWhere(where: Where<T>): boolean {}
    return {
      get state() {
        return state?.[collection];
      },
      where,
      update,
      updateWhere,
      put,
      add,
      get,
      getAll,
      delete: del,
      deleteWhere,
    };
  }

  return {
    get state() {
      return state;
    },
    addCollection,
  };
}

let modd = {
  chat: {
    keyPath: "++id",
    model: {},
  },
};
