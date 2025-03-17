import { dotPath, type DotPath } from "../path/pathResolver.js";
import { dataOp, type DataOpGroupByOptions } from "@medyll/idae-engine";
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
};

/**
 * Generates a ResultSet based on the provided data array and defines additional properties like setOptions, sortBy, groupBy, and getPage for customization and manipulation.
 *
 * @param {T[]} data - The array of data to generate the ResultSet from.
 * @return {ResultSet<T>} The generated ResultSet with additional properties for customization.
 */
export function getResultset<T = (typeof arguments)[0]>(data: T[]) {
  // : ResultSet<T>
  Object.defineProperties(data, {
    setOptions: {
      value: function (options: ResultsetOptions = {}) {
        if (options.sort ?? options.sortBy) {
          this.sortBy(options.sort);
        }
        if (options.groupBy) {
          this.groupBy(options.groupBy);
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
        // delete this?.sortBy;

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
  }) as ResultSet<T>;

  return data as ResultSet<T>;
}
