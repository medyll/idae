class idbqlStateEvent {
  #dataState = $state<Record<string, any>>({});

  constructor() {}

  get dataState() {
    return this.#dataState;
  }

  registerEvent(
    event:
      | "add"
      | "put"
      | "update"
      | "updateWhere"
      | "delete"
      | "deleteWhere"
      | "set",
    more: {
      collection: string;
      data: any;
      keyPath: any;
    }
  ) {
    switch (event) {
      case "set":
        if (more?.collection && more?.data)
          this.dataState[more.collection] = more.data;
        break;
      case "deleteWhere":
        if (more?.collection && more?.data) {
          const data = this.dataState[more.collection];
          const keys = Object.keys(more.data);
          const result = data.filter((item) => {
            let isMatch = true;
            keys.forEach((key) => {
              if (item[key] !== more.data[key]) {
                isMatch = false;
              }
            });
            return isMatch;
          });
          this.dataState[more.collection] = result;
        }
        break;
      case "del":
      case "delete":
        if (more?.collection && more?.data && more?.keyPath) {
          let keyPathValue = more?.data[more.keyPath];
          while (true) {
            const index = this.dataState[more.collection].findIndex(
              (item) => item[more.keyPath] === keyPathValue
            );
            if (index === -1) {
              break;
            }
            this.dataState[more.collection].splice(index, 1);
          }
        }
        break;
      case "updateWhere":
        if (more?.collection && more?.data) {
          const data = this.dataState[more.collection];
          const keys = Object.keys(more.data);
          const result = data.map((item) => {
            let isMatch = true;
            keys.forEach((key) => {
              if (item[key] !== more.data[key]) {
                isMatch = false;
              }
            });
            if (isMatch) {
              return { ...item, ...more.data };
            } else {
              return item;
            }
          });
          this.dataState[more.collection] = result;
        }
        break;
      case "update":
      case "put": // always got id
        if (more?.collection && more?.data && more?.keyPath) {
          let keyPathValue = more.data[more.keyPath];

          const index = this.dataState[more.collection].findIndex(
            (item) => item[more.keyPath] === keyPathValue
          );

          this.dataState[more.collection][index] = more.data;
        }

        break;
      case "add":
        if (more.collection && this.dataState[more.collection]) {
          if (more?.collection && more?.data)
            this.dataState[more.collection].push(more.data);
        }
        break;
    }
  }
}

export const idbqlEvent = new idbqlStateEvent();
