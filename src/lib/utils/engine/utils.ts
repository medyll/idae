export type PropsProxyProps<T = any, B = any> = [
  string: keyof T,
  string: keyof B | (() => void)
][];

export const propsProxy = <T = any, B = any, C = any>(
  props: PropsProxyProps<T, B>,
  data: any[]
): Record<keyof B, any>[] => {
  let ret: any[] = [];
  for (const dta of data) {
    let out: any = {};

    for (const prop of props) {
      const keyListItem = prop[0] as string;
      const keyData: string | Function = prop[1] as any;

      out[keyListItem] =
        typeof keyData === "function" ? keyData(dta) : dta[keyData];
    }
    // keep original data
    out["data"] = dta;
    ret.push(out);
  }

  return ret;
};

/** data manipulation class */
export class dataOp {
  /** sorting  */
  static sortBy<T = Record<string, any>>(
    arr: T[],
    by: string,
    sortDir: string = "asc"
  ) {
    const sortD = sortDir === "asc" ? 1 : -1;
    return [...arr].sort((a: T, b: T) => {
      return this.resolveDotPath(a, by) > this.resolveDotPath(b, by)
        ? sortD
        : this.resolveDotPath(b, by) > this.resolveDotPath(a, by)
        ? -sortD
        : 0;
    });
  }

  /** search an object in an array */
  static filterList<T = any>(
    arr: T[],
    kw: number | string,
    fieldname: string | "*" = "id"
  ): T[] {
    return arr?.filter((item: Record<string, any>) => {
      if (fieldname && fieldname !== "*")
        return this.resolveDotPath(item, fieldname) === kw;
      if (!fieldname || fieldname === "*")
        return Object.keys(item).some((key: string) => {
          return ["string", "number"].includes(typeof item?.[key])
            ? item[key] == kw
            : false;
        });
    });
  }

  /** resolve first founded object in array */
  static filterListFirst<T = any>(
    arr: T[],
    kw: number | string,
    fieldname: string = "id"
  ): T {
    return this.filterList<T>(arr, kw, fieldname)?.[0];
  }

  static searchList<T = Record<string, any>>(
    arr: T[],
    kw: number | string,
    fieldname: string | "*"
  ): T[] {
    let reg: any;
    try {
      reg = new RegExp(`${kw}`, "i");
    } catch (e) {
      return [];
    }

    return arr.filter((item: Record<string, any>) => {
      if (fieldname !== "*")
        return this.resolveDotPath(item, fieldname).toString().search(reg) ===
          -1
          ? false
          : true;
      if (fieldname === "*")
        return Object.keys(item).some((key: string) => {
          if (typeof item?.[key] === "object" && !Array.isArray(item?.[key])) {
            return false;
          }
          return ["string", "number"].includes(typeof item?.[key])
            ? `${item?.[key]}`.search(reg) !== -1
            : false;
        });
    });
  }

  static groupBy(
    dataList: any[],
    groupField: string | string[],
    opt?: { keepUngroupedData: boolean; fieldTitle?: string }
  ) {
    const groupKey: string[] =
      typeof groupField === "string" ? [groupField] : groupField;

    return dataList.reduce((result, currentValue) => {
      if (
        typeof dataOp.resolveDotPath(currentValue, groupField) === "undefined"
      ) {
        const rootField = groupField.split(".")[0];
        const restField = groupField.split(".").slice(1).join(".");

        // check type of root, to be able to traverse arrays
        switch (typeof currentValue[rootField]) {
          case "object":
            if (Array.isArray(currentValue[rootField])) {
              for (const red of currentValue[rootField]) {
                const arrKey = opt?.keepUngroupedData
                  ? dataOp.resolveDotPath(red, restField) ?? "- ungrouped"
                  : dataOp.resolveDotPath(red, restField);
                if (arrKey)
                  (result[arrKey] = result[arrKey] || []).push(currentValue);
              }
            }
            break;
        }
      }

      const key = opt?.keepUngroupedData
        ? dataOp.resolveDotPath(currentValue, groupField) ?? "- ungrouped"
        : dataOp.resolveDotPath(currentValue, groupField);

      const tmpKey = groupKey
        .map((key) => dataOp.resolveDotPath(currentValue, key, undefined))
        .join(" ");

      if (key !== undefined)
        (result[key] = result[key] || []).push(currentValue);

      return result;
    }, {});
  }

  static resolveDotPath(
    object: Record<string, any>,
    path: string,
    defaultValue?: any
  ): any | undefined {
    return (
      path.split(".").reduce((r, s) => (r ? r[s] : defaultValue), object) ??
      undefined
    );
  }

  /**
   *
   * @param arr array to find in
   * @param value value to seek for
   * @param key  object key to match with
   * @returns number
   */
  static findObjectIndex<T = Record<string, any>>(
    arr: T[],
    value: any,
    key: string = "id"
  ): number {
    return arr.findIndex((obj: T) => {
      return this.resolveDotPath(obj, key) === value;
    });
  }
}
