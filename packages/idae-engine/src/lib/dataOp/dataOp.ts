import { type ResolverPathType } from "./types.js";

type Data = Record<string, any>;

export type DataOpGroupResult<T> = {
  [key: string]: {
    title: string;
    code?: string;
    data: T[];
  };
};

export type DataOpSortBy<T> =
  | {
      arr: T[];
      by: Partial<
        Record<ResolverPathType<T>, "asc" | "desc" | 1 | -1 | undefined>
      >;
      options?: { keepRef: true };
    }
  | {
      arr: T[];
      by: ResolverPathType<T> | ResolverPathType<T>[];
      sort?: "asc" | "desc" | 1 | -1 | undefined;
      options?: { keepRef: true };
    };

/**
 * Represents the parameters for a data operation find function.
 *
 * @template T - The type of elements in the array.
 *
 * @property {number | string} kw - The keyword to search for in the array.
 * @property {T[]} arr - The array of elements to search within.
 * @property {ResolverPathType<T> | "*"} [field] - The field or path to search within each element. If not provided, the entire element is searched.
 * @property {boolean} [caseSensitive] - Whether the search should be case-sensitive. Defaults to false.
 * @property {false} [strict] - Whether the search should be strict. Defaults to false.
 */
export type DataOpFind<T> = {
  /** keyword */
  kw: number | string;
  arr: T[];
  field?: ResolverPathType<T> | "*";
  caseSensitive?: boolean;
  strict?: false;
};

/**
 * Represents a data operation that groups a list of data items.
 *
 * @template T - The type of the data items in the list.
 *
 * @property {T[]} dataList - The list of data items to be grouped.
 * @property {DataOpGroupByOptions<T>} groupBy - The options for grouping the data items.
 * @property {boolean} [keepUngroupedData] - Optional flag indicating whether to keep ungrouped data items.
 */
export type DataOpGroupBy<T> = {
  dataList: T[];
  groupBy: DataOpGroupByOptions<T>;
  keepUngroupedData?: boolean;
};

/**
 * Represents the options for grouping data operations.
 *
 * @template T - The type of the items being grouped.
 *
 * This type can be one of the following:
 * - A function that takes an item of type `T` and returns an object with `title` and `code` properties.
 * - A `ResolverPathType` of type `T`.
 * - An array of `ResolverPathType` of type `T`.
 */
export type DataOpGroupByOptions<T> =
  | ((item: T) => { title: string; code: string })
  | ResolverPathType<T>
  | ResolverPathType<T>[];

/**
 * A class that provides various data operations such as getting keys, sorting, finding, and grouping objects in an array.
 */
export class dataOp {
  /**
   * Get all keys of the objects in an array of objects.
   * Keys are delimited by a dot.
   *
   * @template T - The type of objects in the array.
   * @param {T[]} arr - The array of objects.
   * @returns {string[]} An array of all keys.
   */
  static getDataKeys(arr: T[]): string[] {
    const keys = new Set<string>();

    function addKeys(obj: any, prefix = "") {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          keys.add(fullKey);
          if (typeof obj[key] === "object" && obj[key] !== null) {
            addKeys(obj[key], fullKey);
          }
        }
      }
    }

    const limit = Math.min(arr.length, 100);

    for (let i = 0; i < limit; i++) {
      addKeys(arr[i]);
    }

    return Array.from(keys);
  }

  /**
   * Performs a combination of sort, find, and group operations on data.
   *
   * @template T - The type of objects in the array, extends Data.
   * @param {Object} options - The options for data operations.
   * @param {DataOpSortBy<T>} [options.sort] - Sorting options.
   * @param {DataOpFind<T>} [options.find] - Finding options.
   * @param {DataOpGroupBy<T>} [options.group] - Grouping options.
   * @returns {T[] | GroupResult<T>} The resulting array or grouped data.
   */
  static do<T extends object>(options: {
    sort?: DataOpSortBy<T>;
    find?: DataOpFind<T>;
    group?: DataOpGroupBy<T>;
  }): T[] | DataOpGroupResult<T> {
    let result: T[] =
      options.sort?.arr || options.find?.arr || options.group?.dataList || [];

    if (options.sort) {
      result = this.sortBy(options.sort);
    }

    if (options.find) {
      result = this.find({ ...options.find, arr: result });
    }

    if (options.group) {
      return this.groupBy({ ...options.group, dataList: result });
    }

    return result;
  }
  /**
   * Sorts an array of objects based on one or more specified fields with individual sort directions.
   *
   * @template T - The type of objects in the array, extends Data.
   * @param {DataOpSortBy<T>} sortOptions - The sorting options.
   * @returns {T[]} The sorted array.
   */
  static sortBy<T extends object>(sortOptions: DataOpSortBy<T>): T[] {
    const { arr, options } = sortOptions;
    const sortArray = options?.keepRef ? arr : [...arr];

    if (
      !sortOptions.by ||
      (Array.isArray(sortOptions.by) && sortOptions.by.length === 0)
    ) {
      return sortArray;
    }

    return sortArray.sort((a, b) => {
      if ("sort" in sortOptions) {
        const { by, sort = "asc" } = sortOptions;
        const sortD = sort === "asc" || sort === 1 ? 1 : -1;
        const fields = Array.isArray(by) ? by : [by];

        for (const field of fields) {
          const comparison = this.compareValues(a, b, field, sortD);
          if (comparison !== 0) return comparison;
        }
      } else {
        for (const [field, direction] of Object.entries(sortOptions.by)) {
          const sortD = direction === "asc" || Number(direction) === 1 ? 1 : -1;
          const comparison = this.compareValues(
            a,
            b,
            field as ResolverPathType<T>,
            sortD,
          );
          if (comparison !== 0) return comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Searches for objects in an array based on specified criteria.
   *
   * @template T - The type of objects in the array, defaults to Record<string, unknown>.
   * @param {Object} options - The search options.
   * @param {number|string} options.kw - The keyword to search for.
   * @param {T[]} options.in - The array to search in.
   * @param {(keyof T | ResolverPathType<T> | "*")} [options.field="*"] - The field to search in. Use "*" to search in all fields.
   * @param {boolean} [options.caseSensitive=false] - Whether the search should be case-sensitive.
   * @returns {T[]} An array of objects that match the search criteria.
   */
  static find<T extends object = Record<string, unknown>>(
    options: DataOpFind<T>,
  ): T[] {
    const {
      arr,
      kw,
      field = "*",
      caseSensitive = false,
      strict = false,
    } = options;

    return arr.filter((item: T) => {
      if (field !== "*") {
        const itemValue = this.resolveDotPath(
          item,
          field as ResolverPathType<T>,
        );
        return this.compareSearchValues(itemValue, kw, caseSensitive, strict);
      }

      return Object.values(item).some((value) =>
        this.compareSearchValues(value, kw, caseSensitive, strict),
      );
    });
  }

  /**
   * Searches for the first object in an array that matches the specified criteria.
   *
   * @template T - The type of objects in the array, defaults to Record<string, unknown>.
   * @param {Object} options - The search options.
   * @param {T[]} options.arr - The array to search in.
   * @param {number|string} options.kw - The keyword to search for.
   * @param {(ResolverPathType<T> | "*")} [options.field="*"] - The field to search in. Use "*" to search in all fields.
   * @param {boolean} [options.caseSensitive=false] - Whether the search should be case-sensitive.
   * @returns {T | undefined} The first object that matches the search criteria, or undefined if no match is found.
   */
  static findOne<T extends object>(options: DataOpFind<T>): T | undefined {
    const {
      arr,
      kw,
      field = "*",
      caseSensitive = false,
      strict = false,
    } = options;

    return arr.find((item) => {
      if (field !== "*") {
        const itemValue = this.resolveDotPath(
          item,
          field as ResolverPathType<T>,
        );
        return this.compareSearchValues(itemValue, kw, caseSensitive, strict);
      }

      return Object.values(item).some((value) =>
        this.compareSearchValues(value, kw, caseSensitive, strict),
      );
    });
  }

  /**
   * Groups objects in an array based on specified fields or a custom grouping function.
   *
   * @template T - The type of objects in the array, defaults to Data.
   * @param {Object} options - The grouping options.
   * @param {T[]} options.dataList - The array to group.
   * @param {((item: T) => { title: string; code: string }) | ResolverPathType<T> | ResolverPathType<T>[]} options.groupBy - The field(s) to group by or a function to determine the group.
   * @param {boolean} [options.keepUngroupedData=false] - Whether to keep ungrouped data.
   * @returns {DataOpGroupResult<T>} An object where keys are group codes and values are objects containing title, code, and data array.
   */
  static groupBy<T>(options: DataOpGroupBy<T>): DataOpGroupResult<T> {
    const {
      dataList,
      groupBy: groupField,
      keepUngroupedData = false,
    } = options;

    return dataList.reduce((result: DataOpGroupResult<T>, currentItem: T) => {
      let groupInfo: { title: string; code: string } | undefined;

      if (typeof groupField === "function") {
        groupInfo = groupField(currentItem);
      } else {
        const fields = Array.isArray(groupField) ? groupField : [groupField];
        const groupValue = fields
          .map((field) =>
            this.resolveDotPath(currentItem, field as ResolverPathType<T>),
          )
          .filter((value) => value !== undefined)
          .join(".");

        if (groupValue) {
          groupInfo = { title: groupValue, code: groupValue };
        }
      }

      if (!groupInfo) {
        if (!keepUngroupedData) return result;
        groupInfo = { title: "- Ungrouped", code: "- ungrouped" };
      }

      const groupKey = groupInfo.code;
      if (!result[groupKey]) {
        result[groupKey] = {
          title: groupInfo.title,
          code: groupInfo.code,
          data: [],
        };
      }
      result[groupKey].data.push(currentItem);

      return result;
    }, {});
  }

  /**
   *
   * @param arr array to find in
   * @param value value to seek for
   * @param key  object key to match with
   * @returns number
   */
  static findByIndex<T = Record<string, any>>(
    arr: T[],
    value: any,
    key: keyof T | ResolverPathType<T> = "id" as keyof T,
  ): number {
    return arr.findIndex(
      (obj: T) =>
        this.resolveDotPath(obj, key as ResolverPathType<T>) === value,
    );
  }

  static resolveDotPath<T>(
    object: T,
    path: ResolverPathType<T>,
    defaultValue?: any,
  ): any {
    return path
      .split(".")
      .reduce<any>(
        (r, s) => (r && typeof r === "object" && s in r ? r[s] : defaultValue),
        object as any,
      );
  }

  /**
   * Compares two values for sorting.
   *
   * @private
   * @template T - The type of objects being compared.
   * @param {T} a - The first object to compare.
   * @param {T} b - The second object to compare.
   * @param {ResolverPathType<T>} field - The field to compare.
   * @param {number} sortD - The sort direction (1 for ascending, -1 for descending).
   * @returns {number} The comparison result.
   */
  private static compareValues<T>(
    a: T,
    b: T,
    field: ResolverPathType<T>,
    sortD: number,
  ): number {
    const aValue = this.resolveDotPath(a, field);
    const bValue = this.resolveDotPath(b, field);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortD * aValue.localeCompare(bValue);
    }
    return sortD * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
  }

  private static compareSearchValues(
    itemValue: any,
    searchValue: number | string,
    caseSensitive: boolean,
    strict: boolean,
  ): boolean {
    const strItemValue = String(itemValue);
    const strSearchValue = String(searchValue);

    if (strict) {
      return caseSensitive
        ? strItemValue === strSearchValue
        : strItemValue.toLowerCase() === strSearchValue.toLowerCase();
    }
    return caseSensitive
      ? strItemValue.includes(strSearchValue)
      : strItemValue.toLowerCase().includes(strSearchValue.toLowerCase());
  }
}
