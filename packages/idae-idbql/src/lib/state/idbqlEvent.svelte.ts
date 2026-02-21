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
  dataState: Record<string, any[]>;
  private _adapter: {
    applyEvent?: (event: IdbqlEventPayload) => void;
  } | null = null;

  constructor() {
    // Initialize dataState with Svelte runes when available, otherwise use plain object
    // `typeof $state` is safe even if `$state` is not defined in this environment.
    // In Svelte compile context `$state` exists and returns a reactive store proxy.
    if (typeof $state !== "undefined") {
      // use the Svelte rune to create reactive state
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.dataState = $state<Record<string, any[]>>({});
    } else {
      // fallback for non-Svelte environments: plain object
      this.dataState = {} as Record<string, any[]>;
    }
  }

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
          const dataKeys = Object.keys(data);
          this.dataState[collection].forEach((item, index) => {
            let match = true;
            for (const k of dataKeys) {
              if (Object.prototype.hasOwnProperty.call(item, k)) {
                if (item[k] !== (data as any)[k]) {
                  match = false;
                  break;
                }
              }
            }
            if (match) {
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

export function createIdbqlEvent() {
  return new IdbqlStateEvent();
}

let _idbqlEventSingleton: IdbqlStateEvent | null = null;

export function getIdbqlEvent() {
  if (!_idbqlEventSingleton) {
    _idbqlEventSingleton = createIdbqlEvent();
  }
  return _idbqlEventSingleton;
}

// Backwards-compatible lazy proxy: accessing properties will instantiate the singleton.
export const idbqlEvent = new Proxy({} as any, {
  get(_, prop) {
    const inst = getIdbqlEvent() as any;
    return inst[prop];
  },
  set(_, prop, value) {
    const inst = getIdbqlEvent() as any;
    inst[prop] = value;
    return true;
  },
}) as unknown as IdbqlStateEvent;
