// packages\idae-db\src\lib\adapters\types.ts

import { type Filter } from 'mongodb';

/**
 * Type for database query filters, compatible with MongoDB Filter type.
 * @typeParam T - The document type to filter.
 */
export type IdaeDbQueryFilter<T> = Filter<T>;

/**
 * Constructor type for database adapters.
 * @typeParam CON - The connection type.
 * @param collection - The collection or table name.
 * @param connection - The database connection instance.
 * @param _constructor - Factory function for the adapter interface.
 * @returns An adapter instance without connection management methods.
 */
export type AdapterConstructor<CON> = new <T extends object>(
	collection: string,
	connection: CON,
	_constructor: () => IdaeDbAdapterInterface<T>
) => Omit<IdaeDbAdapterInterface<T>, 'connect' | 'getDb' | 'close' | 'registerEvents'>;

/**
 * Interface defining the contract for all database adapters.
 * Provides a unified API for CRUD operations across different database types.
 * @typeParam T - The document/record type.
 */
export interface IdaeDbAdapterInterface<T extends object> {
	/**
	 * Creates an index on the specified field or with the given specification.
	 * @param fieldOrSpec - The field name or index specification.
	 * @param options - Optional index creation options.
	 * @returns A promise resolving to the index name or creation result.
	 */
	createIndex<F, O>(fieldOrSpec: F, options?: O): Promise<unknown>;
	
	/**
	 * Creates a new document/record in the collection.
	 * @param data - The data to insert.
	 * @returns A promise resolving to the created document.
	 */
	create(data: Partial<T>): Promise<T>;
	
	/**
	 * Finds documents by their ID.
	 * @param id - The document ID to search for.
	 * @returns A promise resolving to an array of matching documents.
	 */
	findById(id: string): Promise<T[]>;
	
	/**
	 * Preferred name for querying the collection. Use `where` going forward.
	 * @param params - Query parameters including filter, sort, and pagination.
	 * @returns A promise resolving to an array of matching documents.
	 */
	where(params: IdaeDbParams<T>): Promise<T[]>;

	/**
	 * Deprecated alias for `where()` kept for backwards compatibility.
	 * @param params - Query parameters including filter, sort, and pagination.
	 * @returns A promise resolving to an array of matching documents.
	 * @deprecated Use {@link where} instead.
	 */
	find(params: IdaeDbParams<T>): Promise<T[]>;
	
	/**
	 * Finds a single document matching the query parameters.
	 * @param params - Query parameters including filter and sort options.
	 * @returns A promise resolving to the first matching document, or null if none found.
	 */
	findOne(params: IdaeDbParams<T>): Promise<T | null>;
	
	/**
	 * Updates an existing document by ID.
	 * @param id - The document ID to update.
	 * @param updateData - The partial data to update.
	 * @returns A promise resolving to the update result.
	 */
	update(id: string, updateData: Partial<T>): Promise<unknown>;
	
	/**
	 * Updates multiple documents matching the query parameters.
	 * @typeParam OPT - Optional adapter-specific options type.
	 * @param params - Query parameters to match documents.
	 * @param updateData - The partial data to update.
	 * @param options - Optional adapter-specific options.
	 * @returns A promise resolving to the update result.
	 */
	updateWhere<OPT = never>(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options?: OPT
	): Promise<unknown>;
	
	/**
	 * Deletes a document by ID.
	 * @param id - The document ID to delete.
	 * @returns A promise resolving to the delete result.
	 */
	deleteById(id: string): Promise<unknown>;
	
	/**
	 * Deletes multiple documents matching the query parameters.
	 * @param params - Query parameters to match documents for deletion.
	 * @returns A promise resolving to an object with deletedCount.
	 */
	deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	
	/**
	 * Executes a transaction with the provided callback.
	 * @typeParam TResult - The return type of the transaction result.
	 * @param callback - Async function to execute within the transaction.
	 * @param callback.session - The database session for the transaction.
	 * @returns A promise resolving to the transaction result.
	 */
	transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult>;
}

/**
 * Static methods interface for database adapter classes.
 * Handles connection lifecycle management.
 */
export interface IdaeDbAdapterStaticMethods {
	/**
	 * Establishes a connection to the database.
	 * @param uri - The database connection URI.
	 * @returns A promise resolving to the connection.
	 */
	connect(uri: string): Promise<unknown>;
	
	/**
	 * Gets the database instance from a client connection.
	 * @param client - The client connection.
	 * @param dbName - The database name.
	 * @returns The database instance.
	 */
	getDb(client: unknown, dbName: string): unknown;
	
	/**
	 * Closes a database connection.
	 * @param client - The client connection to close.
	 * @returns A promise that resolves when the connection is closed.
	 */
	close(client: unknown): Promise<void>;
}

/**
 * Parameters for database query operations.
 * @typeParam T - The document type being queried.
 */
export interface IdaeDbParams<T extends object = Record<string, unknown>> {
	/** Optional document ID for findById operations. */
	id?: string;
	/** Query filter criteria. */
	query: IdaeDbQueryFilter<T>;
	/** Sort specification as a string (e.g., "name:asc", "age:desc"). */
	sortBy?: string;
	/** Maximum number of documents to return. */
	limit?: number;
	/** Number of documents to skip. */
	skip?: number;
}

/**
 * Sort options interface for query operations.
 * Keys are field names, values are sort directions (1 for ascending, -1 for descending).
 */
export interface IdaeDbParamsSortOptions {
	[key: string]: 1 | -1;
}

/**
 * Enumeration of supported database types.
 */
export enum DbType {
	/** MongoDB database. */
	MONGODB = 'mongodb',
	/** MySQL database. */
	MYSQL = 'mysql',
	/** ChromaDB vector database. */
	CHROMADB = 'chromaDb',
	/** PouchDB embedded database. */
	POUCHDB = 'pouchdb',
	/** SQLite embedded database. */
	SQLITE = 'sqlite',
	/** PostgreSQL database. */
	POSTGRESQL = 'postgresql'
}

/**
 * Abstract base class for all database adapters.
 * Implements the IdaeDbAdapterInterface with common functionality.
 * @typeParam T - The document/record type.
 */
export abstract class AbstractIdaeDbAdapter<T extends object> implements IdaeDbAdapterInterface<T> {
	/**
	 * Creates an index on the specified field or with the given specification.
	 * @param fieldOrSpec - The field name or index specification.
	 * @param options - Optional index creation options.
	 * @returns A promise resolving to the index name.
	 */
	abstract createIndex(fieldOrSpec: unknown, options?: unknown): Promise<string>;
	
	/**
	 * Creates a new document/record in the collection.
	 * @param data - The data to insert.
	 * @returns A promise resolving to the created document.
	 */
	abstract create(data: Partial<T>): Promise<T>;
	
	/**
	 * Finds documents by their ID.
	 * @param id - The document ID to search for.
	 * @returns A promise resolving to an array of matching documents.
	 */
	abstract findById(id: string): Promise<T[]>;
	
	/**
	 * Preferred method name for collection queries. `where()` defaults to calling
	 * `find()` for backwards compatibility so existing adapters only need to
	 * implement `find()`.
	 * @param params - Query parameters including filter, sort, and pagination.
	 * @returns A promise resolving to an array of matching documents.
	 */
	where(params: IdaeDbParams<T>): Promise<T[]> {
		return this.find(params as any) as Promise<T[]>;
	}

	/**
	 * Deprecated alias retained for compatibility. Adapters may still implement
	 * `find()` and `where()` will forward to it by default.
	 * @param params - Query parameters including filter, sort, and pagination.
	 * @returns A promise resolving to an array of matching documents.
	 * @deprecated Use {@link where} instead.
	 */
	abstract find(params: IdaeDbParams<T>): Promise<T[]>;
	
	/**
	 * Finds a single document matching the query parameters.
	 * @param params - Query parameters including filter and sort options.
	 * @returns A promise resolving to the first matching document, or null if none found.
	 */
	abstract findOne(params: IdaeDbParams<T>): Promise<T | null>;
	
	/**
	 * Updates an existing document by ID.
	 * @param id - The document ID to update.
	 * @param updateData - The partial data to update.
	 * @returns A promise resolving to the update result.
	 */
	abstract update(id: string, updateData: Partial<T>): Promise<unknown>;
	
	/**
	 * Updates multiple documents matching the query parameters.
	 * @typeParam OPT - Optional adapter-specific options type.
	 * @param params - Query parameters to match documents.
	 * @param updateData - The partial data to update.
	 * @param options - Optional adapter-specific options.
	 * @returns A promise resolving to the update result.
	 */
	abstract updateWhere<OPT = never>(
		params: IdaeDbParams<T>,
		updateData: Partial<T>,
		options?: OPT
	): Promise<unknown>;
	
	/**
	 * Deletes a document by ID.
	 * @param id - The document ID to delete.
	 * @returns A promise resolving to the delete result.
	 */
	abstract deleteById(id: string): Promise<unknown>;
	
	/**
	 * Deletes multiple documents matching the query parameters.
	 * @param params - Query parameters to match documents for deletion.
	 * @returns A promise resolving to an object with deletedCount.
	 */
	abstract deleteWhere(params: IdaeDbParams<T>): Promise<{ deletedCount?: number }>;
	
	/**
	 * Executes a transaction with the provided callback.
	 * @typeParam TResult - The return type of the transaction result.
	 * @param callback - Async function to execute within the transaction.
	 * @param callback.session - The database session for the transaction.
	 * @returns A promise resolving to the transaction result.
	 */
	abstract transaction<TResult>(callback: (session: unknown) => Promise<TResult>): Promise<TResult>;

	/**
	 * Establishes a connection to the database.
	 * @param uri - The database connection URI.
	 * @returns A promise resolving to the connection.
	 * @throws Error - Method not implemented, must be overridden by subclasses.
	 */
	static connect(uri: string): Promise<unknown> {
		throw new Error('Method not implemented.');
	}

	/**
	 * Gets the database instance from a client connection.
	 * @param client - The client connection.
	 * @param dbName - The database name.
	 * @returns The database instance.
	 * @throws Error - Method not implemented, must be overridden by subclasses.
	 */
	static getDb(client: any, dbName: string): unknown {
		throw new Error('Method not implemented.');
	}

	/**
	 * Closes a database connection.
	 * @param client - The client connection to close.
	 * @returns A promise that resolves when the connection is closed.
	 * @throws Error - Method not implemented, must be overridden by subclasses.
	 */
	static close(client: unknown): Promise<void> {
		throw new Error('Method not implemented.');
	}
}

/**
 * Interface alias for IdaeDbApi methods compatibility.
 * Extends AbstractIdaeDbAdapter for API method definitions.
 * @typeParam T - The document/record type.
 */
export interface IdaeDbApiMethods<T extends object> extends AbstractIdaeDbAdapter<T> {}
