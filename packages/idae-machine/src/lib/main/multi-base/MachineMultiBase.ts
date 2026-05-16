/**
 * MachineMultiBase - Multi-database manager for idae-machine
 * 
 * Wraps qoolie.MultiDbManager to provide unified database access.
 * Base is deduced from naming convention: `<base>.<collection>`
 * 
 * @role Core Infrastructure - Multi-base database access
 * @rule NO duplicate table names across bases (enforced)
 */

import { createMultiDbQoolie, type MultiDbManager } from '@medyll/qoolie';
import type { QoolieCollection } from '@medyll/qoolie';
import type { AppScheme } from '../../types/schema-types.js';

export interface MachineMultiBaseConfig {
	/** Database name prefix (e.g., 'idae', 'appblog') */
	dbPrefix: string;
	/** API base URL for fetching scheme metadata */
	apiBaseUrl: string;
	/** 
	 * Shared collection schemas for all bases.
	 * All collections are defined here, filtered per base at runtime.
	 */
	collections: Record<string, { keyPath: string }>;
	/** Enable real-time sync with server */
	syncEnabled?: boolean;
	/** Sync configuration (when syncEnabled is true) */
	syncConfig?: {
		databaseHost: string;
		/** Sync mode: 'mobile-first' (default) or 'server-first' */
		mode?: 'mobile-first' | 'server-first';
	};
}

/**
 * Parse base.collection notation
 * @throws Error if format is invalid
 */
function parseTableRef(tableRef: string): { base: string; collection: string } {
	const parts = tableRef.split('.');
	if (parts.length !== 2) {
		throw new Error(
			`Invalid table reference '${tableRef}'. ` +
			`Expected format: '<base>.<collection>' (e.g., 'sitebase_app.produit')`
		);
	}
	return { base: parts[0], collection: parts[1] };
}

/**
 * MachineMultiBase - Multi-database manager for idae-machine
 * 
 * Unified API for multi-base access using `<base>.<collection>` notation.
 * Machine is the single entry point - it exposes integrated packages (qoolie, etc.)
 * 
 * @rule NO DUPLICATE TABLE NAMES - Each table name must be unique across all bases.
 *       This is enforced to avoid ambiguity in auto-resolution.
 * 
 * @example
 * ```typescript
 * const machine = new MachineMultiBase({
 *   dbPrefix: 'appblog',
 *   apiBaseUrl: 'http://localhost:3000/api',
 *   collections: {
 *     produit: { keyPath: 'id' },
 *     client: { keyPath: 'id' },
 *     appuser: { keyPath: 'id' },
 *     appuser_type: { keyPath: 'id' },
 *   },
 *   syncEnabled: true
 * });
 * 
 * // Direct access with base.collection notation
 * const produits = await machine.table('sitebase_app.produit').getAll();
 * const users = await machine.table('sitebase_base.appuser').getAll();
 * 
 * // The qoolie instance for a specific base
 * const appDb = machine.base('sitebase_app');
 * const produits = await appDb.collection.produit.getAll();
 * ```
 */
export class MachineMultiBase {
	private multiDb: MultiDbManager<any>;
	private schemeCache: Map<string, AppScheme> = new Map();
	/** Track which base each collection belongs to (enforces unique names) */
	private collectionRegistry: Map<string, string> = new Map();
	
	constructor(private config: MachineMultiBaseConfig) {
		this.multiDb = createMultiDbQoolie({
			dbNamePattern: `${config.dbPrefix}_{id}`,
			collections: config.collections,
			sync: config.syncEnabled && config.syncConfig ? {
				databaseHost: config.syncConfig.databaseHost,
				mode: config.syncConfig.mode ?? 'mobile-first'
			} : undefined
		});
	}
	
	/**
	 * Get a collection using `<base>.<collection>` notation.
	 * 
	 * @param tableRef - Table reference in format 'base.collection' (e.g., 'sitebase_app.produit')
	 * @returns Qoolie collection instance
	 * @throws Error if format is invalid
	 * 
	 * @example
	 * ```typescript
	 * const produits = await machine.table('sitebase_app.produit').getAll();
	 * const produit = await machine.table('sitebase_app.produit').getById(123);
	 * ```
	 */
	table(tableRef: string): QoolieCollection<any> {
		const { base, collection } = parseTableRef(tableRef);

		// Track collection registration (enforces unique names across bases)
		const existingBase = this.collectionRegistry.get(collection);
		if (existingBase && existingBase !== base) {
			throw new Error(
				`Collection name collision: '${collection}' exists in both ` +
				`'${existingBase}' and '${base}'. Table names must be unique across all bases.`
			);
		}
		this.collectionRegistry.set(collection, base);

		return this.multiDb.get(base).collection[collection] as QoolieCollection<any>;
	}
	
	/**
	 * Get the qoolie instance for a specific base.
	 * Exposes all collections in that base via the collection proxy.
	 * 
	 * @param baseCode - Base identifier (e.g., 'sitebase_app')
	 * @returns Qoolie instance for the base
	 * 
	 * @example
	 * ```typescript
	 * const appDb = machine.base('sitebase_app');
	 * const produits = await appDb.collection.produit.getAll();
	 * const clients = await appDb.collection.client.getAll();
	 * ```
	 */
	base(baseCode: string) {
		return this.multiDb.get(baseCode);
	}
	
	/**
	 * Get scheme metadata for a table, with caching.
	 * 
	 * @param tableCode - Table/collection name (without base prefix)
	 * @returns Promise resolving to AppScheme
	 * @throws Error if API request fails
	 */
	async getScheme(tableCode: string): Promise<AppScheme> {
		// Return cached scheme if available
		if (this.schemeCache.has(tableCode)) {
			return this.schemeCache.get(tableCode)!;
		}
		
		// Fetch from API
		try {
			const response = await fetch(`${this.config.apiBaseUrl}/scheme/${tableCode}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch scheme for '${tableCode}': ${response.status} ${response.statusText}`);
			}
			const scheme = await response.json() as AppScheme;
			this.schemeCache.set(tableCode, scheme);
			return scheme;
		} catch (error) {
			throw new Error(`Failed to fetch scheme for '${tableCode}': ${error instanceof Error ? error.message : String(error)}`);
		}
	}
	
	/**
	 * List all available base IDs that have been accessed.
	 * Note: This only returns bases that have been initialized.
	 * 
	 * @returns Array of base codes
	 */
	listBases(): string[] {
		return this.multiDb.list();
	}
	
	/**
	 * Switch to a specific base and return its qoolie instance.
	 * 
	 * @param baseCode - Base identifier
	 * @returns Qoolie instance for the base
	 */
	switchTo(baseCode: string) {
		return this.multiDb.switchTo(baseCode);
	}
	
	/**
	 * Execute queries across multiple bases and combine results.
	 * 
	 * @param tableRefs - Array of table references in format 'base.collection'
	 * @returns Combined results from all queries
	 * 
	 * @example
	 * ```typescript
	 * const results = await machine.queryAcross([
	 *   'sitebase_app.produit',
	 *   'sitebase_app.client',
	 *   'sitebase_base.appuser_type'
	 * ]);
	 * ```
	 */
	async queryAcross<T = any>(tableRefs: string[]): Promise<T[]> {
		const results = await Promise.all(
			tableRefs.map(async (ref) => {
				return this.table(ref).getAll();
			})
		);
		return results.flat();
	}
	
	/**
	 * Clear the scheme cache for a specific table or all tables.
	 * 
	 * @param tableCode - Optional table code to clear. If omitted, clears entire cache.
	 */
	clearSchemeCache(tableCode?: string): void {
		if (tableCode) {
			this.schemeCache.delete(tableCode);
		} else {
			this.schemeCache.clear();
		}
	}
	
	/**
	 * Get underlying MultiDbManager instance.
	 * Use for advanced operations not covered by this wrapper.
	 * @internal
	 */
	getMultiDbManager(): MultiDbManager<any> {
		return this.multiDb;
	}
	
	/**
	 * Destroy all database instances and clear caches.
	 */
	destroy(): void {
		this.multiDb.destroy();
		this.schemeCache.clear();
		this.collectionRegistry.clear();
	}
}

export default MachineMultiBase;
