import { ResolverPathType } from "./types";

type Data = Record<string, object>;

export type GroupResult<T> = {
  [key: string]: {
    title: string;
    code?: string;
    data: T[];
  };
};

/** data manipulation class */
export class dataOp {
  /** sorting  */
  static sortBy<T extends Data>(
    arr: T[],
    by: ResolverPathType<T>,
    sortDir: "asc" | "desc" = "asc"
  ): T[] {
    const sortD = sortDir === "asc" ? 1 : -1;
    return [...arr].sort((a, b) => {
      const aValue = this.resolveDotPath(a, by);
      const bValue = this.resolveDotPath(b, by);
      return typeof aValue === "string" && typeof bValue === "string"
        ? sortD * aValue.localeCompare(bValue)
        : sortD * (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
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
  static find<T extends object = Record<string, unknown>>(options: {
    kw: number | string;
    arr: T[];
    field?: ResolverPathType<T> | "*";
    caseSensitive?: boolean;
  }): T[] {
    const {
      arr: arrayBuffer,
      kw: kew,
      field: fieldName = "*",
      caseSensitive = false,
    } = options;

    return arrayBuffer?.filter((item: T) => {
      if (fieldName !== "*") {
        const itemValue = this.resolveDotPath(
          item,
          fieldName as ResolverPathType<T>
        );
        return caseSensitive
          ? String(itemValue) === String(kew)
          : String(itemValue).toLowerCase() === String(kew).toLowerCase();
      }

      if (fieldName === "*") {
        return Object.entries(item).some(([, value]) => {
          if (typeof value !== "string" && typeof value !== "number") {
            return false;
          }
          const strValue = String(value);
          const strKew = String(kew);
          return caseSensitive
            ? strValue === strKew
            : strValue.toLowerCase() === strKew.toLowerCase();
        });
      }
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
  static findOne<T extends Data>(options: {
    arr: T[];
    kw: number | string;
    field?: ResolverPathType<T> | "*";
    caseSensitive?: boolean;
  }): T | undefined {
    const { arr, kw, field = "*", caseSensitive = false } = options;

    return arr.find((item) => {
      if (field !== "*") {
        const itemValue = this.resolveDotPath(
          item,
          field as ResolverPathType<T>
        );
        return caseSensitive
          ? String(itemValue) === String(kw)
          : String(itemValue).toLowerCase() === String(kw).toLowerCase();
      }

      if (field === "*") {
        return Object.entries(item).some(([, value]) => {
          if (typeof value !== "string" && typeof value !== "number") {
            return false;
          }
          const strValue = String(value);
          const strKw = String(kw);
          return caseSensitive
            ? strValue === strKw
            : strValue.toLowerCase() === strKw.toLowerCase();
        });
      }
    });
  }

  static searchList<T extends Record<string, any>>(
    arr: T[],
    kw: number | string,
    field: keyof T | ResolverPathType<T> | "*"
  ): T[] {
    const escapedKw = String(kw).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(escapedKw, "i");

    return arr.filter((item: T) => {
      if (field !== "*") {
        const value = this.resolveDotPath(item, field as ResolverPathType<T>);
        return typeof value === "string" && reg.test(value);
      }
      return Object.entries(item).some(
        ([, value]) =>
          (typeof value === "string" || typeof value === "number") &&
          reg.test(String(value))
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
   * @returns {GroupResult<T>} An object where keys are group codes and values are objects containing title, code, and data array.
   */
  static groupBy<T = Data>(options: {
    dataList: T[];
    groupBy:
      | ((item: T) => { title: string; code: string })
      | ResolverPathType<T>
      | ResolverPathType<T>[];
    keepUngroupedData?: boolean;
  }): GroupResult<T> {
    const {
      dataList,
      groupBy: groupField,
      keepUngroupedData = false,
    } = options;

    return dataList.reduce((result: GroupResult<T>, currentItem: T) => {
      let groupInfo: { title: string; code: string };

      if (typeof groupField === "function") {
        groupInfo = groupField(currentItem);
      } else {
        const fields = Array.isArray(groupField) ? groupField : [groupField];
        const groupValue = fields
          .map((field) =>
            this.resolveDotPath(currentItem, field as ResolverPathType<T>)
          )
          .join(".");
        groupInfo = { title: groupValue, code: groupValue };
      }

      if (groupInfo.code === undefined && !keepUngroupedData) {
        return result;
      }

      const groupKey = groupInfo.code ?? "- ungrouped";

      if (!result[groupKey]) {
        result[groupKey] = {
          title: groupInfo.title ?? groupInfo.code ?? "- Ungrouped",
          code: groupInfo.code,
          data: [],
        };
      }

      result[groupKey].data.push(currentItem);

      return result;
    }, {});
  }

  static resolveDotPath<T = Data>(
    object: T,
    path: ResolverPathType<T>,
    defaultValue?: any
  ) {
    return (
      path
        .split(".")
        .reduce(
          (r: Record<string, any>, s: any) => (r ? r[s] : defaultValue),
          object
        ) ?? undefined
    );
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
    key: keyof T | ResolverPathType<T> = "id" as keyof T
  ): number {
    return arr.findIndex((obj: T) => {
      return this.resolveDotPath(obj, key as ResolverPathType<T>) === value;
    });
  }
}
