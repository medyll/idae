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
    | "deleteWhere"
    | "batchAdd"
    | "batchPut";
  data?: any;
  keyPath?: string;
  // new fields for sync control
  silent?: boolean;
  source?: "local" | "remote" | "system";
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

    // If event is marked silent, do not modify state
    if (event.silent) return;

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
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          arr.push(data);
          s.value = arr;
        }
        break;

      case "put":
      case "update":
        if (data && keyPath) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          let found = false;
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item && item[keyPath] === data[keyPath]) {
              arr[i] = { ...item, ...data };
              found = true;
              break;
            }
          }
          if (!found) {
            arr.push(data);
          }
          s.value = arr;
        }
        break;

      case "updateWhere":
        // Use whereClause for matching if available
        const updateWhereClause = (event as any).whereClause || data;
        const updatePayload = (event as any).whereClause ? data : {};
        
        if (updateWhereClause && typeof updateWhereClause === "object") {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          const clauseKeys = Object.keys(updateWhereClause);
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            let match = true;
            for (const k of clauseKeys) {
              if (item && Object.prototype.hasOwnProperty.call(item, k)) {
                if (item[k] !== (updateWhereClause as any)[k]) {
                  match = false;
                  break;
                }
              }
            }
            if (match) {
              arr[i] = { ...item, ...updatePayload };
            }
          }
          s.value = arr;
        }
        break;

      case "delete":
        if (data && keyPath) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item && item[keyPath] === data[keyPath]) {
              arr.splice(i, 1);
            }
          }
          s.value = arr;
        }
        break;

      case "deleteWhere":
        // Use whereClause for matching if available
        const deleteWhereClause = (event as any).whereClause || data;
        
        if (deleteWhereClause && typeof deleteWhereClause === "object") {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          for (let i = arr.length - 1; i >= 0; i--) {
            const item = arr[i];
            if (item && Object.entries(deleteWhereClause).every(([k, v]) => item[k] === v)) {
              arr.splice(i, 1);
            }
          }
          s.value = arr;
        }
        break;

      case "batchAdd":
        if (Array.isArray(data)) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          arr.push(...data);
          s.value = arr;
        } else if (data) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          arr.push(data);
          s.value = arr;
        }
        break;

      case "batchPut":
        if (Array.isArray(data)) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          for (const item of data) {
            if (item && keyPath) {
              const existingIndex = arr.findIndex((existing: any) => existing[keyPath] === item[keyPath]);
              if (existingIndex !== -1) {
                arr[existingIndex] = { ...arr[existingIndex], ...item };
              } else {
                arr.push(item);
              }
            }
          }
          s.value = arr;
        } else if (data && keyPath) {
          const arr = Array.isArray(s.value) ? [...s.value] : [];
          const existingIndex = arr.findIndex((existing: any) => existing[keyPath] === data[keyPath]);
          if (existingIndex !== -1) {
            arr[existingIndex] = { ...arr[existingIndex], ...data };
          } else {
            arr.push(data);
          }
          s.value = arr;
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
