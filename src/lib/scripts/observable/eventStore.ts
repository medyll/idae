class EventStore {
  events: Record<string, Function[]>;
  constructor() {
    this.events = {};
  }
  fireEvent({ collection, operation, data: {} }) {
    const customEvent = new CustomEvent("collection", {
      detail: {
        collection,
        operation,
        data: {},
      },
    });
    window.dispatchEvent(customEvent);
  }

  registerEvent(
    keyPath: Record<string, any>,
    type: string,
    callback: Function
  ) {
    const keyPathString = Object.entries(keyPath)
      .map(([key, value]) => `${key}-${value}`)
      .join("_");

    console.log("keyPathString", keyPathString);

    // event observe replay resultset
    window.addEventListener(type, (event) => callback);
    /* if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback); */
  }
}

export const eventStore = new EventStore();
