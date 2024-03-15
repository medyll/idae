class idbqlStateCore {
  #dataState = $state<Record<string, any>>({});

  constructor() {}

  get dataState() {
    return this.#dataState;
  }
  addCollection(collection: string) {
    if (!this.dataState[collection]) this.dataState[collection] = [];
    return this.dataState[collection];
  }
  registerEvent(
    event: "add" | "put" | "delete" | "set" | string,
    more: {
      collection?: string;
      data?: any;
      keyPath?: any;
    }
  ) {
    switch (event) {
      case "set":
        if (more?.collection && more?.data)
          this.dataState[more.collection] = more.data;
        /* if (more?.collection && more?.data && more?.keyPath)
          this.dataState[more.collection].findIndex(
            (d) => d[more.keyPath] === more.data[more.keyPath]
          ); */
        break;
      case "delete":
        break;
      case "put":
      case "update":
        if (more?.collection && more?.data)
          this.dataState[more.collection] = more.data;
        break;
      case "add":
        if (more?.collection && more?.data)
          this.dataState[more.collection].push(more.data);
        break;
    }
  }
}

export const idbqlState = new idbqlStateCore();
