import { Operators } from "$lib/scripts/operators/operators.js";
import {
  type ResultsetOptions,
  type ResultSet,
} from "../../resultSet/Resultset.js";
import type { Where } from "../../types.js";

export interface ResultSetWithWhere<T = any> extends ResultSet<T> {
  where: (y: Where<T>, options?: ResultsetOptions) => ResultSet<T>;
}
/** @deprecated */
export function getWhere<T = any>(data: T[]): ResultSetWithWhere<T> {
  return Object.defineProperties(data ?? [], {
    where: {
      value: function (y: Where<T>, options?: ResultsetOptions) {
        let resultSet = Operators.parse(data, y);

        return resultSet;
      },
      enumerable: false,
      configurable: true,
    },
  }) as ResultSetWithWhere<T>;
}
