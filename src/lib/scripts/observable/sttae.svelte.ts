import { Collection } from "../collection/collection.js";
import { Query } from "../query/query.js";
import {
  type ResultsetOptions,
  type ResultSet,
  getResultset,
} from "../resultSet/resultset.js";
import type { OperatorType, Where } from "../types.js";
import { svelteState } from "./svelteState.svelte.js";

export function idbState<T>(col: string) {
  return new CollectionState<T>(col, "oneDatabase", "id").properties();
}

/* idbState("chat")
  .where({ chatId: { $eq: 1 } })
  .setOptions({ sort: { id: "asc" } }); */

export class CollectionState<T = any> {
  store: string;
  dbName: string;
  #keyPath!: string;
  #collectionClass!: Collection<T>;
  #svelteState = svelteState;

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
    return Object.defineProperties(svelteState.dataState[this.store], {
      where: {
        value: (qy: Where<T>, options?: ResultsetOptions): ResultSet<T> => {
          return this.where(qy, options);
        },
        enumerable: false,
      },
    });
  }
  async where(qy: Where<T>, options?: ResultsetOptions): ResultSet<T> {
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
    console.log(svelteState.dataState[this.store]);
    let st = this.#svelteState?.dataState?.[this.store];
    return getResultset(svelteState.dataState[this.store]);
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
