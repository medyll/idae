type EventType =
  | "add"
  | "put"
  | "update"
  | "updateWhere"
  | "delete"
  | "deleteWhere"
  | "set";

interface EventData<T = any> {
  collection: string;
  data: T;
  keyPath: string;
}
class IdbqlStateEvent {
  // main application shared state
  dataState = $state<Record<string, any[]>>({});
  private _adapter: {
    applyEvent?: (event: IdbqlEventPayload) => void;
  } | null = null;

  registerAdapter(adapter: { applyEvent?: (event: IdbqlEventPayload) => void } | null) {
    this._adapter = adapter;
  }

  registerEvent(event: EventType, eventData: EventData) {
    const { collection, data, keyPath } = eventData;

    if (!collection) {
      console.error(`Collection is mandatory`);
      return;
    }

    if (!this.dataState[collection]) {
      this.dataState[collection] = [];
    }

    switch (event) {
      case "set":
        if (data) {
          this.dataState[collection] = Array.isArray(data) ? data : [data];
        }
        break;

      case "add":
        if (data) {
          this.dataState[collection].push(data);
        }
        break;

      case "put":
      case "update":
        if (data && keyPath) {
          let itemFound = false;
          this.dataState[collection].forEach((item, index) => {
            if (item[keyPath] === data[keyPath]) {
              this.dataState[collection][index] = {
                ...item,
                ...data,
              };
              itemFound = true;
            }
          });
          if (!itemFound) {
            this.dataState[collection].push(data);
          }
        }
        /*         if (data && keyPath) {
          const index = this.dataState[collection].findIndex(
            (item) => item[keyPath] === data[keyPath],
          );
          if (index !== -1) {
            this.dataState[collection][index] = {
              ...this.dataState[collection][index],
              ...data,
            };
          } else {
            this.dataState[collection].push(data);
          }
        } */
        break;

      case "updateWhere":
        if (data && typeof data === "object") {
          this.dataState[collection].forEach((item, index) => {
            if (
              Object.entries(data).every(([key, value]) => item[key] === value)
            ) {
              this.dataState[collection][index] = { ...item, ...data };
            }
          });
        }
        /* if (data && typeof data === "object") {
          this.dataState[collection] = this.dataState[collection].map((item) =>
            Object.entries(data).every(([key, value]) => item[key] === value)
              ? { ...item, ...data }
              : item,
          );
        } */
        break;

      case "delete":
        if (data && keyPath) {
          const indicesToRemove: number[] = [];
          this.dataState[collection].forEach((item, index) => {
            if (item[keyPath] === data[keyPath]) {
              indicesToRemove.push(index);
            }
          });
          for (let i = indicesToRemove.length - 1; i >= 0; i--) {
            this.dataState[collection][indicesToRemove[i]] = undefined;
            this.dataState[collection].splice(indicesToRemove[i], 1);
          }
        }
        /*         if (data && keyPath) {
          this.dataState[collection] = this.dataState[collection].filter(
            (item) => item[keyPath] !== data[keyPath],
          );
        } */
        break;

      case "deleteWhere":
        if (data && typeof data === "object") {
          const indicesToRemove: number[] = [];
          this.dataState[collection].forEach((item, index) => {
            if (
              Object.entries(data).every(([key, value]) => item[key] === value)
            ) {
              indicesToRemove.push(index);
            }
          });
          for (let i = indicesToRemove.length - 1; i >= 0; i--) {
            this.dataState[collection].splice(indicesToRemove[i], 1);
          }
        }
        /*         if (data && typeof data === "object") {
          this.dataState[collection] = this.dataState[collection].filter(
            (item) =>
              !Object.entries(data).every(
                ([key, value]) => item[key] === value,
              ),
          );
        } */
        break;

      default:
        console.error(`Unhandled event type: ${event}`);
    }

    // Delegate to adapter if present (non-breaking: adapter mirrors changes)
    if (this._adapter && typeof this._adapter.applyEvent === "function") {
      try {
        this._adapter.applyEvent({
          collection,
          op: event,
          data,
          keyPath,
        });
      } catch (e) {
        // adapter errors should not break the main flow
      }
    }
  }
}

export const idbqlEvent = new IdbqlStateEvent();
