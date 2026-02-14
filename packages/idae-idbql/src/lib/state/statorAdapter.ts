import { stator } from "@medyll/idae-stator";

export type StatorAdapterOptions = {
  // future options: dedupe, timing, keyPath detection, ...
};

export type IdbqlEventPayload = {
  collection: string;
  op:
    | "set"
    | "add"
    | "put"
    | "update"
    | "updateWhere"
    | "delete"
    | "deleteWhere";
  data?: any;
  keyPath?: string;
};

export type StatorAdapter = {
  getCollectionState(name: string): any;
  applyEvent(event: IdbqlEventPayload): void;
  dispose(): void;
};

export function createStatorAdapter(opts?: StatorAdapterOptions): StatorAdapter {
  const collections = new Map<string, any>();

  function ensureCollection(name: string) {
    if (collections.has(name)) return collections.get(name);
    const s = stator<any[]>([]);
    collections.set(name, s);
    return s;
  }

  function getCollectionState(name: string) {
    const s = ensureCollection(name);
    return s;
  }

  function applyEvent(event: IdbqlEventPayload) {
    if (!event || !event.collection) return;
    const { collection, op, data, keyPath } = event;
    const s = ensureCollection(collection);

    switch (op) {
      case "set":
        if (Array.isArray(data)) {
          s.value = data;
        } else {
          s.value = data ? [data] : [];
        }
        break;

      case "add":
        if (data) {
          s.stator.push(data);
        }
        break;

      case "put":
      case "update":
        if (data && keyPath) {
          let found = false;
          for (let i = 0; i < s.stator.length; i++) {
            const item = s.stator[i];
            if (item && item[keyPath] === data[keyPath]) {
              s.stator[i] = { ...item, ...data };
              found = true;
              break;
            }
          }
          if (!found) {
            s.stator.push(data);
          }
        }
        break;

      case "updateWhere":
        if (data && typeof data === "object") {
          for (let i = 0; i < s.stator.length; i++) {
            const item = s.stator[i];
            if (
              Object.entries(data).every(([k, v]) => item && item[k] === v)
            ) {
              s.stator[i] = { ...item, ...data };
            }
          }
        }
        break;

      case "delete":
        if (data && keyPath) {
          for (let i = s.stator.length - 1; i >= 0; i--) {
            const item = s.stator[i];
            if (item && item[keyPath] === data[keyPath]) {
              s.stator.splice(i, 1);
            }
          }
        }
        break;

      case "deleteWhere":
        if (data && typeof data === "object") {
          for (let i = s.stator.length - 1; i >= 0; i--) {
            const item = s.stator[i];
            if (
              item &&
              Object.entries(data).every(([k, v]) => item[k] === v)
            ) {
              s.stator.splice(i, 1);
            }
          }
        }
        break;

      default:
        // noop
        break;
    }
  }

  function dispose() {
    collections.clear();
  }

  return {
    getCollectionState,
    applyEvent,
    dispose,
  };
}
