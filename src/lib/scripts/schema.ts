export class Schema {

  createStore(
    db: IDBDatabase | null,
    storeName: string,
    keyPath: string,
    autoIncrement: boolean = false
  ) {
    const objectStore = db?.createObjectStore(storeName, {
      keyPath,
      autoIncrement,
    });
    return objectStore;
  }

  async createSchema(db: IDBDatabase, storeListFields: any) { 
    Object.keys(storeListFields).map(async (storeName) => {
      const storeConfig = storeListFields[storeName];
      const fields = storeConfig.split(",").map((field: string) => {
        return field.trim();
      });
      // the field starting with ++ is the keyPath
      const incrementField = fields
        .find((field: string) => field.startsWith("++"))
        ?.replace("++", "");
      const declaredIndex = fields
        .find((field: string) => field.startsWith("&"))
        ?.replace("&", "");
      // set default path
      const keyPath = incrementField || declaredIndex || fields[0];
      // set autoIncrement
      const increment = Boolean(incrementField);
      // create the store
      const store = this.createStore(db, storeName, keyPath, increment);

      // create the indexes
      for (const field of fields) {
        await this.createIndexes(store, field, field);
      }
      //await this.createIndexes(store)
      return { storeName, keyPath };
    });
  }
  cleanIndexes(index: string) {
    return index.replace("&", "").replace("++", "").trim();
  }
  async createIndexes(
    store: IDBObjectStore,
    indexName: string,
    keyPath: string
  ) {
    // create the index
    store.createIndex(this.cleanIndexes(indexName), this.cleanIndexes(keyPath));
    this[keyPath] = 100;
  }
}
