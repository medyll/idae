/**
  src\lib\scripts\idbqlCore\idbqlSchema.ts
 * Represents a schema for IndexedDB.
 */
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
	 * @returns The created object store or null if creation fails.
	 */
	createStore(
		db: IDBDatabase,
		storeName: string,
		keyPath: string,
		autoIncrement: boolean = false
	): IDBObjectStore | null {
		/* if (db.objectStoreNames.contains(storeName)) {
			console.warn(`Store ${storeName} already exists, skipping creation.`);
			return db.transaction(storeName, 'readwrite').objectStore(storeName);
		} */
		try {
			return db.createObjectStore(storeName, { keyPath, autoIncrement });
		} catch (error) {
			console.error(`Failed to create store ${storeName}:`, error);
			return null;
		}
	}

	/**
	 * Creates the schema in the database.
	 * @param db - The IDBDatabase instance.
	 * @param storeListFields - An object containing the store names and their field configurations.
	 * @returns A promise that resolves to an array of store names and their key paths.
	 */
	async createSchema(
		db: IDBDatabase,
		storeListFields: Record<string, string>
	): Promise<Array<{ storeName: string; keyPath: string }>> {
		const results: Array<{ storeName: string; keyPath: string }> = [];

		for (const [storeName, storeConfig] of Object.entries(storeListFields)) {
			const fields = storeConfig.split(',').map((field) => field.trim());
			const incrementField = fields.find((field) => field.startsWith('++'))?.replace('++', '');
			const declaredIndex = fields.find((field) => field.startsWith('&'))?.replace('&', '');
			const keyPath = incrementField || declaredIndex || fields[0];
			const increment = Boolean(incrementField);

			const store = this.createStore(db, storeName, keyPath, increment);

			if (store) {
				for (const field of fields) {
					await this.createIndexes(store, field, field);
				}
				results.push({ storeName, keyPath });
			}
		}

		return results;
	}

	/**
	 * Cleans the index name by removing special characters.
	 * @param indexName - The index name to clean.
	 * @returns The cleaned index name.
	 */
	private cleanIndexName(indexName: string): string {
		return indexName.replace(/[&+]/g, '').trim();
	}

	/**
	 * Creates an index in the object store.
	 * @param store - The IDBObjectStore instance.
	 * @param indexName - The name of the index.
	 * @param keyPath - The key path for the index.
	 */
	private async createIndexes(
		store: IDBObjectStore,
		indexName: string,
		keyPath: string
	): Promise<void> {
		try {
			const cleanedIndexName = this.cleanIndexName(indexName);
			const cleanedKeyPath = this.cleanIndexName(keyPath);
			store.createIndex(cleanedIndexName, cleanedKeyPath);
		} catch (error) {
			console.error(`Failed to create index ${indexName} for store ${store.name}:`, error);
		}
	}
}
