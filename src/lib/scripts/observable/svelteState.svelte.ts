const obj: Record<string, any> = {};
Object.defineProperty(obj, "addCollection", {
  value: (collection: string) => {},
  enumerable: false,
});
Object.defineProperty(obj, "addEvent", {
  value: (
    event: "add" | "put" | "delete" | "set" | string,
    more: {
      collection?: string;
      data?: any;
      keyPath?: any;
    }
  ) => {},
});

let dataState = $state<Record<string, any>>({});

class svelteMainState {
  dataState = dataState;

  constructor() {}

  addCollection(collection: string) {
    if (!this.dataState[collection]) this.dataState[collection] = [];
  }
  deleteCollection() {}
  addEvent(
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
        /* console.log(this.dataState);
        console.log(more); */
        if (more?.collection && more?.data)
          this.dataState[more.collection].push(more.data);
        break;
    }
  }
}

export const svelteState = new svelteMainState();
