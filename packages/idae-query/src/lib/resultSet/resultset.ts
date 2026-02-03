import { dotPath, type DotPath } from "../path/pathResolver.js";
import { dataOp, type DataOpGroupByOptions } from "@medyll/idae-engine";
import type { Where } from "../types.js";
import { Query } from "../query/query.js";
/**
 * Represents the options for a result set.
 * @template T - The type of the result set.
 */
export type ResultsetOptions<T = any> = {
  /** @deprecated use sortByCan receive a dot path for sorting. */
  sort?: Record<DotPath<T>, "asc" | "desc">;
  /** Can receive a dot path for sorting. */
  sortBy?: Record<DotPath<T>, "asc" | "desc">;
  /** Specifies the property to group the result set by. */
  groupBy?: DotPath<T>;
  /** Specifies the page size of the result set. */
  pageSize?: number;
};

/**
 * Represents a chainable and iterable result set of data.
 * @template T The type of data in the result set.
 */

export type ResultSet<T> = T[] & {
  setOptions: (options: ResultsetOptions) => ResultSet<T>;
  /** Accepts a dot path */
  sortBy: (args: Record<string, "asc" | "desc">) => ResultSet<T>;
  /** Accepts a dot path as fieldName */
  groupBy: (
    fieldName: DataOpGroupByOptions<T>,
    /** Whether to keep ungrouped data */
    keepUngroupedData?: boolean,
  ) => Record<string, T[]>;
  getPage: (page: number, size: number) => ResultSet<T>;
  toObject: (dotPath: DotPath<T>) => T[];
  /** Filter items by predicate function */
  filter: (predicate: (item: T) => boolean) => ResultSet<T>;
  /** Transform items using mapper function */
  map: <U>(mapper: (item: T) => U) => ResultSet<U>;
  /** Remove duplicate items, optionally by key */
  distinct: (key?: DotPath<T>) => ResultSet<T>;
  /** Reverse the order of items */
  reverse: () => ResultSet<T>;
  /** Sum numeric values of a field (dot-path supported) */
  sum: (field: DotPath<T>) => number;
  /** Calculate average of numeric values (dot-path supported) */
  avg: (field: DotPath<T>) => number;
  /** Get minimum numeric value (dot-path supported) */
  min: (field: DotPath<T>) => number;
  /** Get maximum numeric value (dot-path supported) */
  max: (field: DotPath<T>) => number;
  /** Count items, optionally filtered by criteria */
  count: (criteria?: any) => number;
  /** Extract values of a field (dot-path supported) */
  pluck: (field: DotPath<T>) => any[];
  /** Reduce items to a single value */
  reduce: <U>(reducer: (acc: U, item: T) => U, initialValue: U) => U;
  /** Get first item or undefined */
  first: () => T | undefined;
  /** Get last item or undefined */
  last: () => T | undefined;
};


/**
 * @deprecated Use getResultSet instead. Will be removed in future versions.
 */
export function getResultset<T = (typeof arguments)[0]>(data: T[]) {
  return getResultSet(data);
}

/**
 * Generates a ResultSet based on the provided data array and defines additional properties like setOptions, sortBy, groupBy, and getPage for customization and manipulation.
 *
 * @param {T[]} data - The array of data to generate the ResultSet from.
 * @return {ResultSet<T>} The generated ResultSet with additional properties for customization.
 */
export function getResultSet<T = (typeof arguments)[0]>(data: T[]) {
  Object.defineProperties(data, {
    setOptions: {
      value: function (options: ResultsetOptions = {}) {
        if (options.sort ?? options.sortBy) {
          this.sortBy(options.sort ?? options.sortBy);
        }
        if (options.groupBy) {
          return this.groupBy(options.groupBy);
        }
        return this;
      },
      enumerable: true,
      configurable: true,
    },
    sortBy: {
      value: function (args: Record<string, "asc" | "desc">) {
        const keys = Object.keys(args);
        const values = Object.values(args);

        this.sort((a, b) => {
          let i = 0;
          let result = 0;

          while (i < keys.length && result === 0) {
            let value = keys[i];
            result =
              values[i] === "asc"
                ? Number(dotPath<T>(a, value)) - Number(dotPath<T>(b, value))
                : Number(dotPath<T>(b, value)) - Number(dotPath<T>(a, value));
            i++;
          }
          return result;
        });

        return this;
      },
      enumerable: true,
      configurable: true,
    },
    groupBy: {
      value: function (
        fieldName: DataOpGroupByOptions<T>,
        keepUngroupedData = true,
      ) {
        return dataOp.groupBy({
          dataList: this,
          groupBy: fieldName,
          keepUngroupedData,
        });
      },
      enumerable: true,
      configurable: true,
    },
    getPage: {
      value: function (page: number, size: number) {
        const dta = this.slice((size - 1) * page, (size - 1) * page + page);
        delete this?.getPage;
        return dta;
      },
      enumerable: true,
      configurable: true,
    },
    filter: {
      value: function (predicate: (item: T) => boolean) {
        const filtered = Array.prototype.filter.call(this, predicate);
        return getResultSet(filtered);
      },
      enumerable: true,
      configurable: true,
    },
    map: {
      value: function <U>(mapper: (item: T) => U) {
        const mapped = Array.prototype.map.call(this, mapper);
        return getResultSet(mapped);
      },
      enumerable: true,
      configurable: true,
    },
    distinct: {
      value: function (key?: DotPath<T>) {
        const seen = new Set<any>();
        const distinct: T[] = [];

        for (const item of this) {
          const identifier = key ? dotPath<any>(item, key) : item;
          if (!seen.has(identifier)) {
            seen.add(identifier);
            distinct.push(item);
          }
        }

        return getResultSet(distinct);
      },
      enumerable: true,
      configurable: true,
    },
    reverse: {
      value: function () {
        Array.prototype.reverse.call(this);
        return this;
      },
      enumerable: true,
      configurable: true,
    },
    sum: {
      value: function (field: DotPath<T>): number {
        return this.reduce((sum, item) => {
          const value = dotPath<number>(item, field);
          if (typeof value !== 'number') {
            throw new TypeError(`Field "${field}" value is not a number: ${value}`);
          }
          return sum + value;
        }, 0);
      },
      enumerable: true,
      configurable: true,
    },
    avg: {
      value: function (field: DotPath<T>): number {
        if (this.length === 0) return 0;
        const sum = this.sum(field);
        return sum / this.length;
      },
      enumerable: true,
      configurable: true,
    },
    min: {
      value: function (field: DotPath<T>): number {
        if (this.length === 0) return Infinity;
        return this.reduce((min, item) => {
          const value = dotPath<number>(item, field);
          if (typeof value !== 'number') {
            throw new TypeError(`Field "${field}" value is not a number: ${value}`);
          }
          return value < min ? value : min;
        }, Infinity);
      },
      enumerable: true,
      configurable: true,
    },
    max: {
      value: function (field: DotPath<T>): number {
        if (this.length === 0) return -Infinity;
        return this.reduce((max, item) => {
          const value = dotPath<number>(item, field);
          if (typeof value !== 'number') {
            throw new TypeError(`Field "${field}" value is not a number: ${value}`);
          }
          return value > max ? value : max;
        }, -Infinity);
      },
      enumerable: true,
      configurable: true,
    },
    count: {
      value: function (criteria?: Where<T>): number {
        if (!criteria) {
          return this.length;
        }
        // Use Query to filter if criteria provided
        const query = new Query(this);
        const filtered = query.where(criteria);
        return filtered.length;
      },
      enumerable: true,
      configurable: true,
    },
    pluck: {
      value: function (field: DotPath<T>): any[] {
        return this.map((item) => dotPath<any>(item, field));
      },
      enumerable: true,
      configurable: true,
    },
    reduce: {
      value: function <U>(reducer: (acc: U, item: T) => U, initialValue: U): U {
        return Array.prototype.reduce.call(this, reducer, initialValue);
      },
      enumerable: true,
      configurable: true,
    },
    first: {
      value: function (): T | undefined {
        return this[0];
      },
      enumerable: true,
      configurable: true,
    },
    last: {
      value: function (): T | undefined {
        return this[this.length - 1];
      },
      enumerable: true,
      configurable: true,
    },
  }) as ResultSet<T>;

  return data as ResultSet<T>;
}
