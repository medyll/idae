/**
 * Represents a schema for IndexedDB.
 */
export class Schema {
  /**
   * Creates an object store in the database.
   * @param db - The IDBDatabase instance.
   * @param storeName - The name of the object store.
   * @param keyPath - The key path for the object store.
   * @param autoIncrement - Indicates whether the object store should have auto-incrementing keys. Default is false.
   * @returns The created object store.
   */
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

  /**
   * Creates the schema in the database.
   * @param db - The IDBDatabase instance.
   * @param storeListFields - An object containing the store names and their field configurations.
   * @returns A promise that resolves to an array of store names and their key paths.
   */
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
      if (store) {
        for (const field of fields) {
          await this.createIndexes(store, field, field);
        }
      }
      return { storeName, keyPath };
    });
  }

  /**
   * Cleans the index name by removing special characters.
   * @param index - The index name.
   * @returns The cleaned index name.
   */
  cleanIndexes(index: string) {
    return index.replace("&", "").replace("++", "").trim();
  }

  /**
   * Creates an index in the object store.
   * @param store - The IDBObjectStore instance.
   * @param indexName - The name of the index.
   * @param keyPath - The key path for the index.
   */
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
