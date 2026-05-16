import { MachineDb } from '$lib/main/machineDb.js';
import { createIdbqDb } from '@medyll/idae-idbql';
import { SchemaRouter, type SchemaRouterConfig } from '$lib/main/router/SchemaRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import type { AppUser, AppUserGrant, PermissionCode } from '$lib/types/schema-types.js';
import { readSchemaCache, writeSchemaCache } from '$lib/main/machineSchemaCache.js';
import { type MachineModel, toIdbqModel } from '$lib/types/machine-model.js';

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
	 * IDBQL (readonly collections instance)
	 */
	_idbql!:
		| ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbql']
		| undefined;

	/**
	 * IDBQL (stateful collections instance)
	 */
	_idbqlState!:             ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbqlState'];

	/**
	 * Direct access to IndexedDB (core)
	 */
	_idbDatabase!:
		| ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbDatabase']
		| undefined;

	/**
	 * IDBQL data model
	 */
	_idbqModel!:
		| ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbqModel']
		| undefined;

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
	init(options?: { dbName?: string; version?: number; model: MachineModel; org?: string; domain?: string }) {
		if (options?.org)    this._org    = options.org;
		if (options?.domain) this._domain = options.domain;

		// Derive dbName from org+domain if not explicitly provided
		const derived = (this._org && this._domain) ? `${this._org}_${this._domain}` : undefined;
		this._dbName  = options?.dbName ?? derived ?? this._dbName;

		this._version = options?.version ?? this._version;
		this._model   = options?.model   ?? this._model;
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
		const idbqStore = createIdbqDb(toIdbqModel(this._model) as any, this._version);
		const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create(this._dbName);
		this._idbql = idbql;
		this._idbqlState = idbqlState;
		this._idbDatabase = idbDatabase;
		this._idbqModel = idbqModel;

		console.log('Machine started with DB:', this._dbName, 'Version:', this._version);
		console.log('IDBQL State Instance:', this._idbqlState);
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
	 * Get the IDBQL (readonly) instance.
	 * Use for read-only access to collections.
	 * @role Accessor
	 * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined} The readonly IDBQL instance.
	 */
	get idbql(): ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbql'] | undefined {
		return this._idbql;
	}

	/**
	 * Get the IDBQL (stateful) instance.
	 * Previously called idbqlState; use for stateful operations.
	 * @role Accessor
	 * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]} The stateful IDBQL instance.
	 */
	get store(): ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbqlState'] {
		return this._idbqlState;
	}

	/**
	 * Direct getter for idbqlState (for test compatibility).
	 * Returns the stateful IDBQL instance.
	 * @role Accessor
	 * @deprecated Use store instead.
	 * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]} The stateful IDBQL instance.
	 */
	get idbqlState(): ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbqlState'] {
		return this._idbqlState;
	}

	/**
	 * Get the IndexedDB (core) instance.
	 * @role Accessor
	 * @deprecated Use IDBQL accessors instead.
	 * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined} The IndexedDB instance.
	 */
	get indexedb(): ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbDatabase'] | undefined {
		return this._idbDatabase;
	}

	/**
	 * Get the IDBQL data model instance.
	 * Returns the current IDBQL model used by the machine.
	 * @role Accessor
	 * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined} The IDBQL model instance.
	 */
	get idbqModel(): ReturnType<ReturnType<typeof createIdbqDb>['create']>['idbqModel'] | undefined {
		return this._idbqModel;
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
