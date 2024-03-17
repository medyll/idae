import { Operators } from "$lib/scripts/operators/operators.js";
import {
  type ResultsetOptions,
  type ResultSet,
  getResultset,
} from "../../resultSet/resultset.js";
import type { Where } from "../../types.js";
import { idbqlState } from "./idbqlState.svelte.js";

class CollectionState<T = any> {
  state: ResultSetWithWhere<any>;
  constructor(collection: string) {
    this.state = getWhere(collection);
  }
}

export interface ResultSetWithWhere<T = any> extends ResultSet<T> {
  where: (y: Where<T>, options?: ResultsetOptions) => ResultSet<T>;
}

export function getWhere<T = any>(collection: string): ResultSetWithWhere<T> {
  let data = idbqlState.addCollection(collection);
  return Object.defineProperties(data ?? [], {
    where: {
      value: function (y: Where<T>, options?: ResultsetOptions) {
        let resultSet = Operators.parse(data, y);

        return getResultset(resultSet);
      },
      enumerable: false,
      configurable: true,
    },
  }) as ResultSetWithWhere<T>;
}
