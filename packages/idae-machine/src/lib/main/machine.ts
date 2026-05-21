import { MachineDb } from '$lib/main/machineDb.js';
import { createQoolie, type QoolieCollection, type SyncConfig, type SyncErrorContext } from '@medyll/qoolie';
import { createReactiveStore } from '$lib/main/reactiveStore.svelte.js';
import { EventDataClientInstance } from '@medyll/idae-socket';
import { SchemaRouter, type SchemaRouterConfig } from '$lib/main/router/SchemaRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import { buildEffectiveModel } from '$lib/main/machineModelBuilder.js';
import { loadSchema } from '$lib/main/machineSchemaLoader.js';
import { createSocketClient } from '$lib/main/machine/MachineSocket.js';
import { detectSchemaDrift, performIdbUpgrade, deleteIdbDatabase, type PendingIdbUpgrade } from '$lib/main/machineIdbAdapter.js';
import { componentRegistry } from '$lib/main/router/componentRegistry.js';
import { machineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { PermissionCode } from '$lib/types/schema-types.js';
import { type MachineModel } from '$lib/types/machine-model.js';

type SyncEvent = { type: string; collection?: string; entryId?: string; reason?: unknown };

export type { MachineSocketOptions } from '$lib/main/machine/MachineSocket.js';
import type { MachineSocketOptions } from '$lib/main/machine/MachineSocket.js';

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
	 * Reactive store proxy — wraps qoolie collections with Svelte 5 $state.
	 * Lazily created on first store access after start().
	 */
	_reactiveStore?: Record<string, QoolieCollection<any>>;

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
	 * User-provided data model
	 */
	_model!:                  MachineModel | undefined;

	/**
	 * Effective model = system collections + user model. Built once at start().
	 */
	_effectiveModel!:         MachineModel;

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

	/** Socket client options — set via init() */
	_socketOptions?: MachineSocketOptions;

	/** Socket client instance — created at start() if socketOptions provided */
	_socketClient?: EventDataClientInstance;

	/** Frame manager — handles dynamic frame registration and content loading */
	_frameManager = machineFrameManager;

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
		model?:       MachineModel;
		org?:         string;
		domain?:      string;
		sync?:        SyncConfig | false;
		stateEngine?: 'svelte5' | 'stator';
		hooks?: {
			onSyncEvent?: (event: SyncEvent) => void;
			onError?:     (error: Error, context: SyncErrorContext) => void;
		};
		socket?:      MachineSocketOptions;
	}) {
		if (options?.org)    this._org    = options.org;
		if (options?.domain) this._domain = options.domain;

		// Derive dbName from org+domain if not explicitly provided
		const derived = (this._org && this._domain) ? `${this._org}_${this._domain}` : undefined;
		this._dbName  = options?.dbName ?? derived ?? this._dbName;

		this._version     = options?.version     ?? this._version;
		this._model       = options?.model       ?? this._model;
		this._syncOptions    = options?.sync        !== undefined ? options.sync : this._syncOptions;
		this._stateEngine    = options?.stateEngine ?? this._stateEngine;
		this._hooks          = options?.hooks       ?? this._hooks;
		this._socketOptions  = options?.socket      ?? this._socketOptions;
	}

	/** Fully qualified DB name for a given base: {org}_{base} */
	moduleDbName(base: string): string {
		return this._org ? `${this._org}_${base}` : base;
	}

	/**
	 * @framework-bootstrap — called once by the app shell (+layout.svelte), NOT by application code.
	 *
	 * Fetches schema from server, caches in IDB, starts the machine.
	 * Stale-while-revalidate: if cache exists → starts immediately, refreshes in background.
	 * On schema change → triggers drift detection to adapt IDB stores automatically.
	 *
	 * Dev usage: use machine.init() + machine.start() with a local model instead.
	 *
	 * @param url - Full URL to GET /api/scheme (returns IdbqModel JSON)
	 * @emits 'schema:updated' on the returned EventTarget when background refresh brings new data
	 */
	async fetchSchema(url: string): Promise<EventTarget> {
		return loadSchema(url, {
			onModel: (m) => { this._model = m; },
			onStart: () => this.start(),
			onDrift: () => this._scheduleDrift(),
		});
	}

	/**
	 * Start the machine with a local model.
	 * Call after machine.init() when the schema is defined locally (dev/offline mode).
	 * When schema comes from the server, use machine.fetchSchema(url) instead — it calls start() internally.
	 * @role Initializer
	 */
	start(): void {
		if (!this._dbName) throw new Error('dbName is required — call machine.init({ dbName }) or machine.init({ org, domain }) first');
		this._effectiveModel = buildEffectiveModel(this._model);
		this._machineDb      = new MachineDb(this._effectiveModel);
		machineRights.loadPoliciesFromModel(this._model);
		this.createStore();
		if (this._socketOptions?.autoConnect) this.connectSocket();
		this._scheduleDrift().catch(() => { /* non-critical — retry on next start */ });
	}

	/** Pending IDB upgrade scheduled by drift detection — consumed by next createStore(). */
	private _pendingIdbUpgrade: PendingIdbUpgrade | null = null;

	private async createStore(): Promise<void> {
		if (this._pendingIdbUpgrade) {
			await performIdbUpgrade(this._dbName, this._version, this._pendingIdbUpgrade, this._effectiveModel);
			this._pendingIdbUpgrade = null;
		}
		const collections = Object.fromEntries(
			Object.entries(this._effectiveModel).map(([name, col]) => [name, { keyPath: col.keyPath }])
		);
		this._qoolie = createQoolie({
			dbName:    this._dbName,
			dbVersion: this._version,
			collections,
			...(this._syncOptions !== undefined && { sync: this._syncOptions }),
			...(this._stateEngine  !== undefined && { stateEngine: this._stateEngine }),
			...(this._hooks        !== undefined && { hooks: this._hooks }),
		});
	}

	private async _scheduleDrift(): Promise<void> {
		const drift = await detectSchemaDrift(this._dbName, this._version, this._effectiveModel);
		if (drift) {
			this._version = drift.newVersion;
			this._pendingIdbUpgrade = drift;
		}
	}

	/**
	 * @framework-bootstrap — called automatically by fetchSchema() and start().
	 * Not for application code. Detects IDB drift and upgrades stores immediately.
	 */
	async upgradeIdb(): Promise<void> {
		if (!this._dbName || !this._effectiveModel) {
			throw new Error('Machine not initialized — call init() and start() first');
		}
		const drift = await detectSchemaDrift(this._dbName, this._version, this._effectiveModel);
		if (drift) {
			this._version = drift.newVersion;
			await performIdbUpgrade(this._dbName, this._version, drift, this._effectiveModel);
		}
	}

	/** @deprecated Use upgradeIdb(). */
	async adaptIdbToSchema(): Promise<void> {
		return this.upgradeIdb();
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
		if (!this._qoolie) return {} as Record<string, QoolieCollection<any>>;
		if (!this._reactiveStore) {
			this._reactiveStore = createReactiveStore(
				this._qoolie.collection as Record<string, QoolieCollection<any>>
			);
		}
		return this._reactiveStore;
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

	/**
	 * Sync controller — pause/resume/status/flush/dlq.
	 * Only available when sync is enabled in init() options.
	 */
	get sync() {
		if (!this._qoolie) throw new Error('Machine not started. Call start() first.');
		return this._qoolie.sync;
	}

	/**
	 * Socket client — EventDataClientInstance from idae-socket.
	 * Available after start() when socket options are provided.
	 * Call machine.socket.connect() manually unless autoConnect: true.
	 */
	get socket(): EventDataClientInstance | undefined {
		return this._socketClient;
	}

	private connectSocket(): void {
		if (!this._socketOptions) return;
		this._socketClient = createSocketClient(this._socketOptions);
	}

	/**
	 * Release all Qoolie resources (stops sync adapter, clears collections).
	 * Call when the Machine instance is no longer needed.
	 */
	destroy(): void {
		this._qoolie?.destroy();
		this._qoolie = undefined;
		this._reactiveStore = undefined;
		this._socketClient?.socket?.disconnect?.();
		this._socketClient = undefined;
	}

	/**
	 * Delete the client-side IndexedDB database and reload the page.
	 * Use with DevResetPanel — irreversible.
	 */
	async resetClientData(): Promise<void> {
		this.destroy();
		await deleteIdbDatabase(this._dbName);
		window.location.reload();
	}

	/**
	 * Get or create the SchemaRouter instance.
	 * Lazily initializes the router with schemas from MachineDb.
	 * @role Accessor
	 * @return {SchemaRouter} The schema router instance.
	 */
	get router(): SchemaRouter {
		if (!this._router) this._router = this._buildRouter();
		return this._router;
	}

	initRouter(config: SchemaRouterConfig): SchemaRouter {
		this._router = this._buildRouter(config);
		return this._router;
	}

	private _buildRouter(config: SchemaRouterConfig = {}): SchemaRouter {
		const r = new SchemaRouter(config);
		r.setPermissionCheck((permission, table) => {
			if (!table) return true;
			const scheme = this.logic.collection(table);
			if (!scheme) return false;
			return machineRights.checkAccess(table, permission as PermissionCode);
		});
		r.init(this.logic.collections());
		return r;
	}

	/**
	 * @deprecated Use machine.framer.load() with explicit frameId.
	 * Navigate to a module within a target zone.
	 */
	async loadIn(
		modulePath: string,
		targetId: string,
		collection: string,
		collectionId?: string,
		vars?: string
	): Promise<void> {
		const varsObj = vars ? Object.fromEntries(new URLSearchParams(vars).entries()) : undefined;
		await this._frameManager.load(targetId, modulePath, collection, collectionId, varsObj);
		// Update URL for browser history/bookmarking
		const url = buildLoadInUrl(modulePath, targetId, collection, collectionId, vars);
		if (typeof history !== 'undefined') {
			history.pushState({ loadIn: { modulePath, targetId, collection, collectionId, vars } }, '', url);
		}
	}

	/**
	 * Load content into a zone. Zone defaults to 'main'.
	 * If no <Frame> is registered for the zone, mounts one dynamically inside [data-target-zone="${zone}"].
	 */
	async loadFrame(
		modulePath: string,
		collection: string,
		collectionId?: string,
		vars?: Record<string, string>,
		zone = 'main'
	): Promise<void> {
		await this._frameManager.load(zone, modulePath, collection, collectionId, vars,
			async (frameId) => {
				if (typeof document === 'undefined') return;
				const target = document.querySelector(`[data-target-zone="${frameId}"]`);
				if (!target) return;
				// Dynamic import breaks circular dependency machine ↔ Frame
				const { mount } = await import('svelte');
				const { default: Frame } = await import('$lib/shell/frame/Frame.svelte');
				mount(Frame as any, { target, props: { id: frameId } });
			}
		);
	}

	/** Access to the frame manager singleton. */
	get framer() {
		return this._frameManager;
	}

	/** @deprecated Use machine.framer */
	get frameManager() {
		return this._frameManager;
	}

	/** Access to the component registry singleton. */
	get componentRegistry() {
		return componentRegistry;
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

export function buildLoadInUrl(
	modulePath: string,
	targetId: string,
	collection: string,
	collectionId?: string,
	vars?: string
): string {
	let url = `/+${targetId}/${modulePath}/${collection}`;
	if (collectionId) url += `/${collectionId}`;
	if (vars) url += `?${vars}`;
	return url;
}

export const machine = new Machine();
