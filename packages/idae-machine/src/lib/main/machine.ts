import { MachineDb } from '$lib/main/machineDb.js';
import { createQoolie, type QoolieCollection, type SyncConfig, type SyncErrorContext } from '@medyll/qoolie';
import { useQoolieCollection, useQoolieQuery } from '@medyll/qoolie/svelte';
import { EventDataClientInstance } from '@medyll/idae-socket';
import { MachineRouter, type MachineRouterConfig } from '$lib/main/machine/MachineRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import { buildEffectiveModel } from '$lib/main/machineModelBuilder.js';
import { createSocketClient } from '$lib/main/machine/MachineSocket.js';
import { detectSchemaDrift, performIdbUpgrade, deleteIdbDatabase, getActualIdbVersion, type PendingIdbUpgrade } from '$lib/main/machineIdbAdapter.js';
import { componentRegistry } from '$lib/main/router/componentRegistry.js';
import { machineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
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

	/** System/framework collections (appscheme, appuser_*, …). Usually omitted — schema is fetched from the server via fetchSchema. */
	_core?:                   MachineModel;

	/** Application business collections (vehicle, reservation, …). */
	_business?:               MachineModel;

	/** @deprecated Use _core + _business. */
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
	_router?:                 MachineRouter;

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

	/** Seed data for mobile-first mode — auto-called seedIfEmpty on boot if mode === 'mobile-first' */
	_seed?: Record<string, unknown[]>;

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
		this._dbName    = dbName ?? '';
		this._version   = version ?? 1;
		this._business  = model;
		this._model     = model;
	}

	/**
	 * Initialize the machine with configuration parameters.
	 * dbName is derived from org+domain when both are provided and no explicit dbName is given.
	 * @role Initializer
	 */
	init(options?: {
		dbName?:      string;
		version?:     number;
		/** System/framework collections. Usually omitted — schema is fetched from the server via fetchSchema. */
		core?:        MachineModel;
		/** Application business collections (vehicle, reservation, …). */
		business?:    MachineModel;
		/** @deprecated Use business instead. */
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
		/** Seed data for mobile-first mode. When sync.mode === 'mobile-first', boot() auto-calls seedIfEmpty(seed). */
		seed?:        Record<string, unknown[]>;
	}) {
		if (options?.org)    this._org    = options.org;
		if (options?.domain) this._domain = options.domain;

		const derived    = (this._org && this._domain) ? `${this._org}_${this._domain}` : undefined;
		this._dbName     = options?.dbName    ?? derived ?? this._dbName;
		this._version    = options?.version   ?? this._version;
		this._core       = options?.core      ?? this._core;
		this._business   = options?.business  ?? options?.model ?? this._business;
		// legacy shim
		this._model      = this._business;
		this._syncOptions   = options?.sync        !== undefined ? options.sync : this._syncOptions;
		this._stateEngine   = options?.stateEngine ?? this._stateEngine;
		this._hooks         = options?.hooks       ?? this._hooks;
		this._socketOptions = options?.socket      ?? this._socketOptions;
		this._seed          = options?.seed        ?? this._seed;
	}

	/** Fully qualified DB name for a given base: {org}_{base} */
	moduleDbName(base: string): string {
		return this._org ? `${this._org}_${base}` : base;
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
	 * Atomic boot — single async entry point for the app shell.
	 *
	 * Resolves the schema (server or local), builds MachineDb, adapts IDB drift,
	 * creates the qoolie store. Returns only once `machine.logic` + `machine.store`
	 * are ready. UI must `await machine.boot(...)` before mounting machine-aware
	 * components — no partial render, no reactivity races.
	 *
	 * Data hydration (IDB ← server) is owned by qoolie's sync layer, not by boot.
	 *
	 * @param options - Same shape as init(); typically { org, domain, version, sync }.
	 * @throws If sync is enabled but schema is unavailable (no cache, no network, no local model).
	 */
	async boot(options?: Parameters<Machine['init']>[0]): Promise<void> {
		if (options) this.init(options);
		if (!this._dbName) throw new Error('dbName is required — call machine.boot({ org, domain }) or machine.init({ dbName }) first');

		const dbHost = (this._syncOptions && typeof this._syncOptions === 'object')
			? (this._syncOptions as Record<string, unknown>).databaseHost as string | undefined
			: undefined;

		// Resolve schema: server (cache-first SWR) or local fallback
		if (dbHost) {
			const url = dbHost.replace(/\/+$/, '') + '/api/scheme';
			const { readSchemaCache, writeSchemaCache } = await import('$lib/main/machineSchemaCache.js');
			const cached = await readSchemaCache(url).catch(() => null) as MachineModel | null;

			if (cached) {
				this._business = cached;
				this._model    = cached;
				// Background revalidate (non-blocking) — updates schema in-place
				this._revalidateSchema(url, cached, writeSchemaCache).catch(() => {});
			} else {
				try {
					const res = await fetch(url);
					if (res.ok) {
						const fresh = await res.json() as MachineModel;
						await writeSchemaCache(url, fresh).catch(() => {});
						this._business = fresh;
						this._model    = fresh;
					} else if (!this._business) {
						throw new Error(`[machine] Schema fetch failed (${res.status}) and no local model available`);
					}
				} catch (err) {
					if (!this._business) throw err;
					// Server unreachable but local model available — continue with local
				}
			}
		}

		this._effectiveModel = buildEffectiveModel(this._core, this._business);
		this._machineDb      = new MachineDb(this._effectiveModel);
		machineRights.loadPoliciesFromModel(this._model);

		await this._scheduleDrift();
		// Never downgrade IDB — if actual version > declared (drift incremented on prior run), use actual
		const actualVersion = await getActualIdbVersion(this._dbName).catch(() => 0);
		if (actualVersion > this._version) this._version = actualVersion;
		await this.createStore();

		// Mobile-first auto-seed: run seedIfEmpty if mode='mobile-first' and seed data provided
		const syncMode = (this._syncOptions && typeof this._syncOptions === 'object')
			? (this._syncOptions as SyncConfig).mode
			: undefined;
		if (syncMode === 'mobile-first' && this._seed) {
			const { seedIfEmpty } = await import('$lib/main/machineSeed.js');
			await seedIfEmpty(this._seed);
		}

		if (this._socketOptions?.autoConnect) this.connectSocket();
	}

	/** Internal: revalidate cached schema vs server. Updates in-place on change. */
	private async _revalidateSchema(
		url: string,
		cached: MachineModel,
		writeSchemaCache: (u: string, m: unknown) => Promise<void>
	): Promise<void> {
		try {
			const res = await fetch(url);
			if (!res.ok) return;
			const fresh = await res.json() as MachineModel;
			if (JSON.stringify(fresh) === JSON.stringify(cached)) return;

			await writeSchemaCache(url, fresh).catch(() => {});
			this._business = fresh;
			this._model    = fresh;
			this._effectiveModel = buildEffectiveModel(this._core, this._business);
			this._machineDb      = new MachineDb(this._effectiveModel);
			machineRights.loadPoliciesFromModel(this._model);
			await this._scheduleDrift();

		} catch {
			/* revalidate failed — keep cached schema */
		}
	}

	/** @deprecated Use boot() — single async entry point. */
	async start(): Promise<void> {
		return this.boot();
	}

	/** @deprecated Schema fetch is internal to boot(). Use machine.boot({ sync: { databaseHost } }). */
	async fetchSchema(_url: string): Promise<EventTarget> {
		await this.boot();
		return new EventTarget();
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
	 * Reactive collection reader — returns live-updating { items } via Svelte 5 runes.
	 * Usage: const { items } = machine.store('users');
	 *        const { items } = machine.store('users', { status: 'active' });
	 *
	 * Must be called from within a Svelte component or .svelte.ts context.
	 * For imperative CRUD use machine.collection(name) instead.
	 */
	store<T = any>(name: string, query?: Parameters<typeof useQoolieQuery>[2]): { items: T[] } {
		if (!this._qoolie || !name) return { items: [] };
		if (query) {
			return useQoolieQuery<T>(this._qoolie, name, query);
		}
		return useQoolieCollection<T>(this._qoolie, name);
	}

	/**
	 * Direct collection accessor — returns the raw QoolieCollection for CRUD ops.
	 * Usage: await machine.collection('users').create(data)
	 *        await machine.collection('users').get(id)
	 * Note: machine.logic.collection(name) returns the MachineScheme (schema layer).
	 */
	collection(name: string) {
		const col = this._qoolie?.collection?.[name];
		if (!col) throw new Error(`Collection "${name}" not found. Did you call start()?`);
		return col;
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
	 * Get or create the MachineRouter instance (lazy).
	 * @role Accessor
	 * @return {MachineRouter} The machine router instance.
	 */
	get router(): MachineRouter {
		if (!this._router) this._router = this._buildRouter();
		return this._router;
	}

	initRouter(config: MachineRouterConfig): MachineRouter {
		this._router = this._buildRouter(config);
		return this._router;
	}

	private _buildRouter(config: MachineRouterConfig = {}): MachineRouter {
		const r = new MachineRouter(config);
		r.init();
		return r;
	}

	/**
	 * Navigate to load content into a zone. Zone defaults to 'main'.
	 * Pushes a hash URL — idae-router catches it, parses, and delegates to
	 * machineFrameManager which loads into an existing Frame or mounts a new one.
	 *
	 * URL is the single source of truth: back/forward, refresh, deep links all work by construction.
	 */
	loadFrame(
		modulePath: string,
		collection: string,
		collectionId?: string,
		vars?: Record<string, string>,
		zone = 'main'
	): void {
		const varsStr = vars && Object.keys(vars).length > 0
			? new URLSearchParams(vars).toString()
			: undefined;
		const url = buildLoadInUrl(modulePath, zone, collection, collectionId, varsStr);
		this.router.push(url);
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
		void instance.boot();
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
