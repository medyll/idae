import { MachineDb } from '$lib/main/machineDb.js';
import { createQoolie, type QoolieCollection, type SyncConfig, type SyncErrorContext } from '@medyll/qoolie';

type SyncEvent = { type: string; collection?: string; entryId?: string; reason?: unknown };
import { SchemaRouter, type SchemaRouterConfig } from '$lib/main/router/SchemaRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import { MachinePrefs } from '$lib/main/machine/MachinePrefs.js';
import { MachineActivity } from '$lib/main/machine/MachineActivity.js';
import type { AppUser, AppUserGrant, PermissionCode } from '$lib/types/schema-types.js';
import { readSchemaCache, writeSchemaCache } from '$lib/main/machineSchemaCache.js';
import { type MachineModel } from '$lib/types/machine-model.js';

/**
 * @class Machine
 * @role Main entry point for managing the IDBQL connection and centralized data access.
 */
export class Machine {
	/**
	 * Static registry of named Machine instances
	 */
	static instanceRegistry: Record<string, Machine> = {};

	/**
	 * Instance name (optional)
	 */
	instanceName?:           string;

	/**
	 * Qoolie instance — data layer (IndexedDB + optional sync)
	 */
	_qoolie!: ReturnType<typeof createQoolie> | undefined;

	/**
	 * Centralized access to schema and collection logic
	 */
	_machineDb!:              MachineDb;

	/**
	 * Database name (IDB). Derived from org+domain if not explicit.
	 */
	_dbName!:                 string;

	/**
	 * Schema version
	 */
	_version!:                number;

	/**
	 * Data model
	 */
	_model!:                  MachineModel | undefined;

	/** Organisation identifier — prefixes all DB names. e.g. 'test', 'crfr' */
	_org?:                    string;

	/** Domain/site name. e.g. 'machine', 'sitebase' */
	_domain?:                 string;

	/**
	 * Schema router instance (lazy-initialized)
	 */
	_router?:                 SchemaRouter;

	/** Global sync config forwarded to createQoolie(). false = sync disabled. */
	_syncOptions?:            SyncConfig | false;

	/** Reactive state engine: 'svelte5' (default) | 'stator' */
	_stateEngine?:            'svelte5' | 'stator';

	/** Qoolie lifecycle hooks */
	_hooks?: {
		onSyncEvent?: (event: SyncEvent) => void;
		onError?:     (error: Error, context: SyncErrorContext) => void;
	};

	/**
	 * Main constructor
	 * @role Constructor
	 * @param {string=} dbName The name of the database.
	 * @param {number=} version The schema version number.
	 * @param {IdbqModel=} model The IDBQL data model.
	 */
	constructor(dbName?: string, version?: number, model?: MachineModel) {
		this._dbName = dbName ?? '';
		this._version = version ?? 1;
		this._model = model ?? undefined;
	}

	/**
	 * Initialize the machine with configuration parameters.
	 * dbName is derived from org+domain when both are provided and no explicit dbName is given.
	 * @role Initializer
	 */
	init(options?: {
		dbName?:      string;
		version?:     number;
		model:        MachineModel;
		org?:         string;
		domain?:      string;
		sync?:        SyncConfig | false;
		stateEngine?: 'svelte5' | 'stator';
		hooks?: {
			onSyncEvent?: (event: SyncEvent) => void;
			onError?:     (error: Error, context: SyncErrorContext) => void;
		};
	}) {
		if (options?.org)    this._org    = options.org;
		if (options?.domain) this._domain = options.domain;

		// Derive dbName from org+domain if not explicitly provided
		const derived = (this._org && this._domain) ? `${this._org}_${this._domain}` : undefined;
		this._dbName  = options?.dbName ?? derived ?? this._dbName;

		this._version     = options?.version     ?? this._version;
		this._model       = options?.model       ?? this._model;
		this._syncOptions = options?.sync        !== undefined ? options.sync : this._syncOptions;
		this._stateEngine = options?.stateEngine ?? this._stateEngine;
		this._hooks       = options?.hooks       ?? this._hooks;
	}

	/** Fully qualified DB name for a given base: {org}_{base} */
	moduleDbName(base: string): string {
		return this._org ? `${this._org}_${base}` : base;
	}

	/**
	 * Fetch schema from server URL, cache in IDB, and start the machine.
	 * Stale-while-revalidate: if cache exists, starts immediately then refreshes in background.
	 *
	 * @param url - Full URL to GET /api/scheme (returns IdbqModel JSON)
	 * @emits 'schema:updated' on the returned EventTarget when background refresh brings new data
	 */
	async fetchSchema(url: string): Promise<EventTarget> {
		const emitter = new EventTarget();
		const cached  = await readSchemaCache(url);

		if (cached) {
			this._model = cached as MachineModel;
			this.start();
			// Background refresh
			fetch(url)
				.then((r) => r.json())
				.then(async (fresh) => {
					const freshJson = JSON.stringify(fresh);
					if (freshJson !== JSON.stringify(cached)) {
						await writeSchemaCache(url, fresh);
						emitter.dispatchEvent(new CustomEvent('schema:updated', { detail: fresh }));
					}
				})
				.catch(() => { /* network failure during bg refresh — ignore */ });
		} else {
			const res   = await fetch(url);
			const model = await res.json() as MachineModel;
			await writeSchemaCache(url, model);
			this._model = model;
			this.start();
		}

		return emitter;
	}

	/**
	 * Start the machine: initializes collections and the IDBQL connection.
	 * Call this after constructing the Machine to set up the database and collections.
	 * @role Initializer
	 * @return {void}
	 */
	start(): void {
		this.createCollections();
		this.createStore();
		this.loadPolicies();
	}

	/**
	 * Internal: Creates the collections logic using the provided data model.
	 * Throws an error if the model is not defined.
	 * @role Internal
	 * @private
	 * @return {void}
	 */
	private createCollections(): void {
		if (!this._model) {
			throw new Error('Data model is not defined');
		}
		this._machineDb = new MachineDb(this._model);
	}

	private loadPolicies(): void {
		if (!this._model) return;
		const policies: Record<string, any> = {};
		for (const [name, col] of Object.entries(this._model)) {
			if ((col as any).rights) policies[name] = (col as any).rights;
		}
		machineRights.setPolicies(policies);
	}

	/**
	 * Internal: Creates the IDBQL store and initializes database connections.
	 * Throws an error if model, dbName, or version is missing.
	 * @role Internal
	 * @private
	 * @return {void}
	 */
	private createStore(): void {
		if (!this._model || !this._dbName || !this._version) {
			throw new Error('Model, dbName, or version is not defined');
		}
		const collections = Object.fromEntries(
			Object.entries(this._model).map(([name, col]) => [name, { keyPath: col.keyPath }])
		);
		this._qoolie = createQoolie({
			dbName:      this._dbName,
			dbVersion:   this._version,
			collections,
			...(this._syncOptions !== undefined && { sync: this._syncOptions }),
			...(this._stateEngine  !== undefined && { stateEngine: this._stateEngine }),
			...(this._hooks        !== undefined && { hooks: this._hooks }),
		});
	}

	/**
	 * Get the MachineDb (schema logic) instance.
	 * @role Accessor
	 * @deprecated Use logic instead.
	 * @return {MachineDb} The schema and collection logic instance.
	 */
	get collections(): MachineDb {
		return this._machineDb;
	}

	/**
	 * Get the IDbBase (schema logic) instance.
	 * Recommended accessor for schema and collection logic.
	 * @role Accessor
	 * @return {MachineDb} The schema and collection logic instance.
	 */
	get logic(): MachineDb {
		return this._machineDb;
	}

	/**
	 * Collection accessor — reactive (Svelte 5 runes) CRUD per collection.
	 * Usage: machine.store['users'].where({...}) / .getAll() / .create(data) / .update(id, data) / .delete(id)
	 */
	get store(): Record<string, QoolieCollection<any>> {
		return this._qoolie?.collection as Record<string, QoolieCollection<any>>;
	}

	/**
	 * Direct collection accessor — shorthand for machine.store[name].
	 * Returns the QoolieCollection (CRUD layer) for the given collection name.
	 * Note: machine.logic.collection(name) returns the MachineScheme (schema layer).
	 */
	collection(name: string) {
		const col = this._qoolie?.collection?.[name];
		if (!col) throw new Error(`Collection "${name}" not found. Did you call start()?`);
		return col;
	}

	/** @deprecated Use store instead. */
	get idbqlState(): Record<string, QoolieCollection<any>> {
		return this.store;
	}

	/** @deprecated Qoolie manages the IDB instance internally. */
	get idbql(): undefined { return undefined; }

	/** @deprecated Qoolie manages the IDB instance internally. */
	get indexedb(): undefined { return undefined; }

	/** @deprecated Qoolie manages the IDB instance internally. */
	get idbqModel(): undefined { return undefined; }

	/** Access rights manager — checkAccess, setCurrentUser, setPolicies, etc. */
	get rights() { return machineRights; }

	/** User preferences service — backed by IDB `_prefs` collection. */
	get prefs() {
		if (!this._qoolie) throw new Error('Machine not started. Call start() first.');
		return new MachinePrefs(() => this._qoolie!.collection['_prefs'] as QoolieCollection<any>);
	}

	/** Activity log service — insert-only event log backed by `_activity` collection. */
	get activity() {
		if (!this._qoolie) throw new Error('Machine not started. Call start() first.');
		return new MachineActivity(() => this._qoolie!.collection['_activity'] as QoolieCollection<any>);
	}

	/**
	 * Sync controller — pause/resume/status/flush/dlq.
	 * Only available when sync is enabled in init() options.
	 */
	get sync() {
		if (!this._qoolie) throw new Error('Machine not started. Call start() first.');
		return this._qoolie.sync;
	}

	/**
	 * Release all Qoolie resources (stops sync adapter, clears collections).
	 * Call when the Machine instance is no longer needed.
	 */
	destroy(): void {
		this._qoolie?.destroy();
		this._qoolie = undefined;
	}

	/**
	 * Get or create the SchemaRouter instance.
	 * Lazily initializes the router with schemas from MachineDb.
	 * @role Accessor
	 * @return {SchemaRouter} The schema router instance.
	 */
	get router(): SchemaRouter {
		if (!this._router) {
			this._router = new SchemaRouter();
			
			// Set up permission check using MachineDb
			this._router.setPermissionCheck((permission, table) => {
				if (!table) return true;
				
				const scheme = this.logic.collection(table);
				if (!scheme) return false;
				return machineRights.checkAccess(table, permission as PermissionCode);
			});
			
			// Initialize with schemas from MachineDb
			const schemes = this.logic.collections();
			this._router.init(schemes);
		}
		return this._router;
	}

	/**
	 * Initialize the router with custom configuration.
	 * Must be called before accessing router getter if custom config is needed.
	 * @role Initializer
	 * @param {SchemaRouterConfig} config Router configuration
	 * @return {SchemaRouter} The initialized router instance
	 */
	initRouter(config: SchemaRouterConfig): SchemaRouter {
		this._router = new SchemaRouter(config);
		
		// Set up permission check
		this._router.setPermissionCheck((permission, table) => {
			if (!table) return true;
			const scheme = this.logic.collection(table);
			if (!scheme) return false;
			return true;
		});
		
		// Initialize with schemas
		const schemes = this.logic.collections();
		this._router.init(schemes);
		
		return this._router;
	}

	/**
	 * Set the current authenticated user and their grants.
	 * Enables access control — all #checkAccess() calls will use this user.
	 * Pass null to deny all non-admin access.
	 */
	setCurrentUser(user: AppUser | null, grants: AppUserGrant[] = []): void {
		machineRights.setCurrentUser(user, grants);
	}

	/**
	 * Clear the current user and return to open mode (all access allowed).
	 */
	clearCurrentUser(): void {
		machineRights.clearCurrentUser();
	}

	/**
	 * Create and register a new Machine instance.
	 * Registers the instance in the static registry for later retrieval.
	 * @role Factory method
	 * @param {string} [instanceName] Optional name to register the instance under.
	 * @param {string} [dbName] Database name for the new instance.
	 * @param {number} [version] Schema version for the new instance.
	 * @param {IdbqModel} [model] IDBQL data model for the new instance.
	 * @returns {Machine} The newly created and started Machine instance.
	 */
	createInstance(
		instanceName?: string,
		dbName?: string,
		version?: number,
		model?: MachineModel
	): Machine {
		const instance = new Machine(dbName, version, model);
		if (instanceName) {
			instance.instanceName = instanceName;
			Machine.instanceRegistry[instanceName] = instance;
		}
		instance.start();
		return instance;
	}

	/**
	 * Get a Machine instance by name from the registry.
	 * @role Accessor
	 * @param {string} instanceName The name of the instance.
	 * @return {Machine | undefined} The Machine instance, or undefined if not found.
	 */
	static instance(instanceName: string): Machine | undefined {
		return Machine.instanceRegistry[instanceName];
	}
}

export const machine = new Machine();
