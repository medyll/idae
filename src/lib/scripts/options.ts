export type OptionsType = {
  sort?: [field: string, order: "asc" | "desc"];
  page?: [size: number, page: number];
  groupBy?: string;
};

export class Options {

  static applyOptions(options: OptionsType, data: any[]) {
    if (options?.sort) {
      const [fieldName, order] = options.sort;
      data = this.sortData(fieldName, order, data);
    }
    if (options?.page) {
      const [size, page] = options.page;
      data = this.getPage(size, page, data);
    }
    if (options?.groupBy) {
      data = this.groupBy(options.groupBy, data);
    }
    return data;
  }

  static sortData(fieldName: string, order: "asc" | "desc", data: any[]) {
    return data.sort((a, b) => {
      if (order === "asc") {
        return a[fieldName] > b[fieldName] ? 1 : -1;
      } else {
        return a[fieldName] < b[fieldName] ? 1 : -1;
      }
    });
  }

  static getPage(size: number, page: number, data: any[]) {
    let start = (page - 1) * size;
    let end = start + size;
    let pages = Math.ceil(data.length / size);
    let pageData = data.slice(start, end);
    return pageData;
  }

  static groupBy(fieldName: string | string[], data: any[]) {
    if (typeof fieldName === "string") {
      return data.reduce((acc, curr) => {
        if (!acc[curr[fieldName]]) {
          acc[curr[fieldName]] = [];
        }
        acc[curr[fieldName]].push(curr);
        return acc;
      }, {});
    } else {
      return data.reduce((acc, curr) => {
        let key = "";
        for (let i = 0; i < fieldName.length; i++) {
          key += curr[fieldName[i]];
        }
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr);
        return acc;
      }, {});
    }
  }
}
