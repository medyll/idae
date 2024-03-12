import { ObservableStore } from "../observable/observableStore.js";
import { dotPath, type DotPath } from "../path/pathResolver.js";

/**
 * Represents the options for a result set.
 * @template T - The type of the result set.
 */
export type OptionsType<T = any> = {
  /** Can receive a dot path for sorting. */
  sort?: Record<DotPath<T>, "asc" | "desc">;
  /** Specifies the page size and page number. */
  page?: [size: number, page: number];
  /** Specifies the property to group the result set by. */
  groupBy?: DotPath<T>;
  /** Specifies the limit of the result set. */
  limit?: number;
};

/**
 * Represents a chainable and iterable result set of data.
 * @template T The type of data in the result set.
 */
export class ResultSet<T = Record<string, any>> {
  private data: T[];
  private state!: ObservableStore<T[]>;

  constructor(data: T[]) {
    this.data = data;
    this.state = new ObservableStore(this.data);
  }

  /**
   * Sets the options in one pass for the result set.
   *
   * @template T - The type of the result set.
   * @param {OptionsType} options - The options to set.
   * @returns {this} - The updated result set.
   */
  public setOptions<T>(options: OptionsType) {
    if (options?.sort) {
      this.sortBy(options.sort);
    }
    if (options?.page) {
      const [size, page] = options.page;
      this.getPage(size, page);
    }
    if (options?.groupBy) {
      this.groupBy(options.groupBy);
    }
    return this;
  }

  observe() {
    return this.state;
  }

  /**
   * Sorts the data in the result set based on the provided sorting criteria.
   *
   * @param args - An object containing the sorting criteria. The keys represent the properties to sort by, and the values represent the sort order ("asc" for ascending, "desc" for descending). Can receive a dot path
   * @returns The sorted result set.
   */
  sortBy(args: Record<string, "asc" | "desc">) {
    const keys = Object.keys(args);
    const values = Object.values(args);

    this.data.sort((a, b) => {
      let i = 0;
      let result = 0;

      while (i < keys.length && result === 0) {
        let value = keys[i];
        result =
          values[i] === "asc"
            ? dotPath<T>(a, value) - dotPath<T>(b, value)
            : dotPath<T>(b, value) - dotPath<T>(a, value);
        i++;
      }
      return result;
    });

    // @ts-ignore
    delete this?.sortBy;

    return this;
  }

  /**
   * Retrieves a specific page of data from the result set.
   * @param size The number of items per page.
   * @param page The page number to retrieve.
   * @returns a new result set containing the specified page of data.
   */
  getPage(size: number, page: number) {
    const start = (page - 1) * size;
    const end = start + size;
    this.data = this.data.slice(start, end);
    // @ts-ignore
    delete this?.getPage;
    return this;
  }

  /**
   * Groups the result set by the specified field name(s).
   * @param fieldName The field name(s) to group by.
   * @param transform An optional transformation function to apply to each grouped value.
   * @returns An object representing the grouped result set.
   */
  groupBy(fieldName: string | string[], transform?: (value: any) => void) {
    const finalFieldName =
      typeof fieldName === "string" ? [fieldName] : fieldName;
    return this.data.reduce((acc, curr) => {
      let key = "";
      for (let i = 0; i < finalFieldName.length; i++) {
        key += dotPath<typeof curr>(curr, finalFieldName[i]);
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
    }, {});
  }

  [Symbol.iterator]() {
    let index = 0;
    let data = this.data;

    return {
      next: () => {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}
