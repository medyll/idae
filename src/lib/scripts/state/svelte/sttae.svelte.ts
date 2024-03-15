import { Operators } from "$lib/scripts/operators/operators.js";
import { Collection } from "../../collection/collection.js";
import { Query } from "../../query/query.js";
import {
  type ResultsetOptions,
  type ResultSet,
  getResultset,
} from "../../resultSet/resultset.js";
import type { Where } from "../../types.js";
import { idbqlState } from "./idbqlState.svelte.js";

export class CollectionState<T = any> {
  store: string;
  dbName: string;
  #keyPath!: string;
  #collectionClass!: Collection<T>;
  #svelteState = idbqlState;

  constructor(store: string, dbName: string, keyPath: string) {
    this.store = store;
    this.dbName = dbName;
    this.#keyPath = keyPath;
    this.initData();
    this.#svelteState.addCollection(this.store);
  }

  initData() {
    if (this.#getCollectionClass()) {
      console.log("999", this.#collectionClass);
      this.#collectionClass?.getAll().then((data) => {
        console.log("999", data);
        // this.#svelteState.dataState[this.store] = data;
      });
    }
  }
  #all() {
    return this.#svelteState?.dataState?.[this.store];
  }

  #getCollectionClass() {
    this.#collectionClass =
      this.#collectionClass ?? new Collection(this.store, this.dbName, 1);
    return typeof indexedDB !== "undefined" ? true : false;
  }

  properties() {
    return Object.defineProperties(idbqlState.dataState[this.store], {
      where: {
        value: (qy: Where<T>, options?: ResultsetOptions): ResultSet<T> => {
          return this.where(qy, options);
        },
        enumerable: false,
      },
    });
  }
  where(qy: Where<T>, options?: ResultsetOptions): ResultSet<T> {
    if (this.#getCollectionClass()) {
      // await this.#collectionClass?.where(qy, options);
    }
    const data = this.#svelteState?.dataState?.[this.store];
    const query = new Query<T>(data);
    let resultSet = query.where(qy, this.store);

    if (options) {
      resultSet.setOptions(options);
    }

    return resultSet;
  }
  get(value: any) {
    return this.where({ [this.#keyPath]: { eq: value } });
  }
  getAll() {
    console.log(idbqlState.dataState[this.store]);
    let st = this.#svelteState?.dataState?.[this.store];
    return getResultset(idbqlState.dataState[this.store]);
    return this.where({ [this.#keyPath]: { eq: 5 } });
  }
  update(keyPathValue: string | number, data: Partial<T>) {
    if (this.#getCollectionClass()) {
      this.#collectionClass.update(keyPathValue, data);
    } else {
    }
  }
  updateWhere(where: Where<T>, data: Partial<T>) {
    if (this.#getCollectionClass()) {
      return this.#collectionClass.updateWhere(where, data);
    } else {
    }
  }
  put(value: Partial<any>) {
    if (this.#getCollectionClass()) {
      return this.#collectionClass.put(value);
    } else {
    }
  }
  add(data: any) {
    if (this.#getCollectionClass()) {
      this.#collectionClass.add(data);
    } else {
    }
  }

  delete(keyPathValue: string | number) {
    if (this.#getCollectionClass()) {
      this.#collectionClass.delete(keyPathValue);
    } else {
    }
  }
  deleteWhere(where: Where<T>) {
    if (this.#getCollectionClass()) {
      this.#collectionClass.deleteWhere(where);
    } else {
    }
  }
}

export interface ResultSetWithWhere<T = any> extends ResultSet<T> {
  where: (y: Where<T>, options?: ResultsetOptions) => ResultSet<T>;
}

export function getWhere<T = any>(
  collection: keyof typeof idbqlState
): ResultSetWithWhere<T> {
  let data = idbqlState.addCollection(collection);
  return Object.defineProperties(data, {
    where: {
      value: function (y: Where<T>, options?: ResultsetOptions) {
        let resultSet = Operators.parse(this, y);

        return getResultset(resultSet);
      },
      enumerable: false,
      configurable: true,
    },
    add: {
      value: function (data: any) {
        //this.#collectionClass.add(data);
      },
      enumerable: false,
      configurable: true,
    },
  }) as ResultSetWithWhere<T>;
}
