class idbqlStateEvent {
  #dataState = $state<Record<string, any>>({});

  constructor() {}

  get dataState() {
    return this.#dataState;
  }

  registerEvent(
    event: "add" | "put" | "delete" | "set",
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
