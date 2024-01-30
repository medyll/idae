import { dotPath, type DotPath } from "../path/pathResolver.js";

export type OptionsType<T = any> = {
  /** can receive a dot path */ sort?: Record<DotPath<T>, "asc" | "desc">;
  page?: [size: number, page: number];
  groupBy?: DotPath<T>;
};

export class ResultSet<T = Record<string, any>> {
  private data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

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

  // can receive a dot path
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
   * @returns The data for the specified page.
   */
  getPage(size: number, page: number) {
    const start = (page - 1) * size;
    const end = start + size;
    this.data = this.data.slice(start, end);
    // @ts-ignore
    delete this?.getPage;
    return this;
  }

  // can receive a dot path
  // use dotPath function to get the value
  // use a transform function to transform the value if provided
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
