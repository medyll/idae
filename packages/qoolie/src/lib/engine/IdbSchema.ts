/**
 * IdbSchema — IndexedDB schema manager
 * Adapted from @medyll/idae-idbql idbqlSchema.ts
 * Creates object stores and indexes based on model configuration.
 */
export class IdbSchema {
	/**
	 * Creates an object store in the database.
	 * @param db - The IDBDatabase instance.
	 * @param storeName - The name of the object store.
	 * @param keyPath - The key path for the object store.
	 * @param autoIncrement - Whether the object store should auto-increment keys.
	 * @returns The created object store or null if creation fails.
	 */
	createStore(
		db: IDBDatabase,
		storeName: string,
		keyPath: string,
		autoIncrement = false
	): IDBObjectStore | null {
		try {
			return db.createObjectStore(storeName, { keyPath, autoIncrement });
		} catch {
			return null;
		}
	}

	/**
	 * Creates the schema in the database — object stores + indexes.
	 * @param db - The IDBDatabase instance.
	 * @param storeListFields - Store names mapped to their field configurations.
	 *   Format: "keyPath" or "++autoIncrement" or "&indexedField" or "field1, field2, ++id"
	 * @returns Array of created store names and their key paths.
	 */
	createSchema(
		db: IDBDatabase,
		storeListFields: Record<string, string>
	): Array<{ storeName: string; keyPath: string }> {
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
					this.createIndexes(store, field, field);
				}
				results.push({ storeName, keyPath });
			}
		}

		// Ensure Outbox store exists for sync functionality
		try {
			if (!db.objectStoreNames.contains('__outbox__')) {
				this.createStore(db, '__outbox__', 'id');
			}
		} catch {
			// ignore if environment doesn't support objectStoreNames checks
		}

		return results;
	}

	/**
	 * Cleans the index name by removing special characters.
	 */
	private cleanIndexName(indexName: string): string {
		return indexName.replace(/[&+]/g, '').trim();
	}

	/**
	 * Creates an index in the object store.
	 */
	private createIndexes(
		store: IDBObjectStore,
		indexName: string,
		keyPath: string
	): void {
		try {
			const cleanedIndexName = this.cleanIndexName(indexName);
			const cleanedKeyPath = this.cleanIndexName(keyPath);
			store.createIndex(cleanedIndexName, cleanedKeyPath);
		} catch (error) {
			// Index may already exist — silent
		}
	}
}
