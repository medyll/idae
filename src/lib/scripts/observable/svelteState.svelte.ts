import { Query } from "../query/query.js";

let dataState = $state<Record<string, any>>({});

class svelteMainState {
  dataState = $state<Record<string, any>>({});

  constructor() {}

  addCollection(collection: string) {
    if (!this.dataState[collection]) this.dataState[collection] = [];
  }
  deleteCollection() {}
}

export const svelteState = new svelteMainState();

class svelteCollectionsState {
  collection = "tre";
  derived = $derived(this.collection ? {} : dataState?.[this.collection] ?? []);

  constructor(collection: string) {
    if (!svelteState.dataState?.[collection])
      svelteState.dataState[collection] = {};
    this.collection = collection;
  }

  where(qy: any, options: any) {
    const query = new Query<any>(this.derived);
    let resultSet = query.where(qy);

    if (options) {
      resultSet.setOptions(options);
    }

    return resultSet;
  }
}

function collectionState(collection: string) {
  let derived = $derived(collection ? {} : dataState?.[collection] ?? []);
  return derived;
}
