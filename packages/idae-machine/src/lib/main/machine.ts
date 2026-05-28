import { MachineDb } from '$lib/main/machineDb.js';
import { createQoolie, type SyncConfig, type SyncErrorContext } from '@medyll/qoolie';
import { useQoolieCollection, useQoolieQuery } from '@medyll/qoolie/svelte';
import type { EventDataClientInstance } from '@medyll/idae-socket';
import { be as _be } from '@medyll/idae-be';
import { MachineRouter, type MachineRouterConfig } from '$lib/main/machine/MachineRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import { machineAction, machineActionCallable, type ActionCollection } from '$lib/main/machine/MachineAction.js';
import { buildEffectiveModel } from '$lib/main/machineModelBuilder.js';
import { createSocketClient } from '$lib/main/machine/MachineSocket.js';
import { detectSchemaDrift, performIdbUpgrade, deleteIdbDatabase, getActualIdbVersion, type PendingIdbUpgrade } from '$lib/main/machineIdbAdapter.js';
import { componentRegistry, type ComponentRegistry } from '$lib/main/router/componentRegistry.js';
import { machineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import type { MachineModel } from '$lib/types/index.js';

type SyncEvent = { type: string; collection?: string; entryId?: string; reason?: unknown };

export type { MachineSocketOptions } from '$lib/main/machine/MachineSocket.js';
import type { MachineSocketOptions } from '$lib/main/machine/MachineSocket.js';

export type MachineComponentRegistry = Readonly<Pick<ComponentRegistry, 'register' | 'registerMany' | 'unregister' | 'resolve' | 'has' | 'keys'>>;

const machineComponentRegistry: MachineComponentRegistry = Object.freeze({
	register:     componentRegistry.register.bind(componentRegistry),
	registerMany: componentRegistry.registerMany.bind(componentRegistry),
	unregister:   componentRegistry.unregister.bind(componentRegistry),
	resolve:      componentRegistry.resolve.bind(componentRegistry),
	has:          componentRegistry.has.bind(componentRegistry),
	keys:         componentRegistry.keys.bind(componentRegistry),
});

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
	_dbName = '';

	/**
	 * Schema version
	 */
	_version = 1;

	/** System/framework collections (appscheme, appuser_*, …). Usually omitted — schema is fetched during boot(). */
	_core?:                   MachineModel;

	/** Application business collections (vehicle, reservation, …). */
	_business?:               MachineModel;

	/**
	 * Effective model = system collections + business model. Built once at boot().
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

	/** Seed data for mobile-first mode — auto-called with onlyIfEmpty on boot if mode === 'mobile-first' */
	_seed?: Record<string, unknown[]>;

	/** Frame manager — handles dynamic frame registration and content loading */
	private readonly _frameManager = machineFrameManager;

	/**
	 * Promise that resolves when boot() has completed.
	 * Use `await machine.ready` after createInstance() to ensure the machine is fully initialized.
	 */
	ready: Promise<void> = Promise.resolve();

	/**
	 * Main constructor
	 * @role Constructor
	 * @param {string=} dbName The name of the database.
	 * @param {number=} version The schema version number.
	 * @param {MachineModel=} business The business data model.
	 */
	constructor(dbName?: string, version?: number, business?: MachineModel) {
		this.init({ dbName, version, business });
	}

	/**
	 * Initialize the machine with configuration parameters.
	 * dbName is derived from org+domain when both are provided and no explicit dbName is given.
	 * @role Initializer
	 */
	init(options?: {
		dbName?:      string;
		version?:     number;
		/** System/framework collections. Usually omitted — schema is fetched from the server during boot(). */
		core?:        MachineModel;
		/** Application business collections (vehicle, reservation, …). */
		business?:    MachineModel;
		org?:         string;
		domain?:      string;
		sync?:        SyncConfig | false;
		stateEngine?: 'svelte5' | 'stator';
		hooks?: {
			onSyncEvent?: (event: SyncEvent) => void;
			onError?:     (error: Error, context: SyncErrorContext) => void;
		};
		socket?:      MachineSocketOptions;
		/** Seed data for mobile-first mode. When sync.mode === 'mobile-first', boot() auto-calls seed(seed, { onlyIfEmpty: true }). */
		seed?:        Record<string, unknown[]>;
	}) {
		if (options?.org)    this._org    = options.org;
		if (options?.domain) this._domain = options.domain;

		const derived    = (this._org && this._domain) ? `${this._org}_${this._domain}` : undefined;
		this._dbName     = options?.dbName    ?? derived ?? this._dbName;
		this._version    = options?.version   ?? this._version;
		this._core       = options?.core      ?? this._core;
		this._business   = options?.business  ?? this._business;
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

	private async createStore(replaceExisting = false): Promise<void> {
		if (this._pendingIdbUpgrade) {
			await performIdbUpgrade(this._dbName, this._version, this._pendingIdbUpgrade, this._effectiveModel);
			this._pendingIdbUpgrade = null;
		}
		if (replaceExisting) {
			this._qoolie?.destroy();
			this._qoolie = undefined;
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
	 * @framework-bootstrap — called automatically during boot().
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
		if (this._qoolie) {
			this._qoolie.destroy();
			this._qoolie = undefined;
		}

		const dbHost = (this._syncOptions && typeof this._syncOptions === 'object')
			? (this._syncOptions as Record<string, unknown>).databaseHost as string | undefined
			: undefined;

		// Resolve schema: server (cache-first SWR) or local fallback
		if (dbHost) {
			const url = dbHost.replace(/\/+$/, '') + '/api/scheme';
			const { loadSchema } = await import('$lib/main/machineSchemaLoader.js');
			await loadSchema(url, {
				onModel: (model) => {
					this._business = model;
				},
				onStart: () => {},
				onDrift: async () => {
					this._effectiveModel = buildEffectiveModel(this._core, this._business);
					this._machineDb = new MachineDb(this._effectiveModel);
					machineRights.loadPoliciesFromModel(this._effectiveModel);
					await this._scheduleDrift();
					await this.createStore(true);
				}
			}).catch((err) => {
				if (!this._business) throw err;
				// Server unreachable but local model available — continue with local
				console.warn('[idae-machine] Schema fetch failed, continuing with local model:', err);
			});
		}

		this._effectiveModel = buildEffectiveModel(this._core, this._business);
		this._machineDb      = new MachineDb(this._effectiveModel);
		machineRights.loadPoliciesFromModel(this._effectiveModel);

		await this._scheduleDrift();
		// Never downgrade IDB — if actual version > declared (drift incremented on prior run), use actual
		const actualVersion = await getActualIdbVersion(this._dbName).catch((err) => {
			console.warn('[idae-machine] Could not read actual IDB version, defaulting to 0:', err);
			return 0;
		});
		if (actualVersion > this._version) this._version = actualVersion;
		await this.createStore();

		// Mobile-first auto-seed: run seedIfEmpty if mode='mobile-first' and seed data provided
		const syncMode = (this._syncOptions && typeof this._syncOptions === 'object')
			? (this._syncOptions as SyncConfig).mode
			: undefined;
		if (syncMode === 'mobile-first' && this._seed) {
			const { seed } = await import('$lib/main/machineSeed.js');
			await seed(this._seed, { onlyIfEmpty: true });
		}

		if (this._socketOptions?.autoConnect) this.connectSocket();
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
		if (!col) throw new Error(`Collection "${name}" not found. Did you call boot()?`);
		return col;
	}

	/** Access rights manager — checkAccess, setCurrentUser, setPolicies, etc. */
	get rights() { return machineRights; }

	/**
	 * Generic write dispatcher — `machine.action(collection, vars, opts?)`.
	 * One imperative entry point for every user-scoped write (prefs, history, activity, …).
	 * Auto-injects `userId` + `id`. Use opts for upsert / bump / touch / code-template behavior.
	 */
	get action() { return machineActionCallable; }

	/**
	 * Sync controller — pause/resume/status/flush/dlq.
	 * Only available when sync is enabled in init() options.
	 */
	get sync() {
		if (!this._qoolie) throw new Error('Machine not started. Call boot() first.');
		return this._qoolie.sync;
	}

	/**
	 * Socket client — EventDataClientInstance from idae-socket.
	 * Available after boot() when socket options are provided.
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
		this._pendingIdbUpgrade = null;

		this._socketClient?.socket?.disconnect?.();
		this._socketClient = undefined;
	}

	/**
	 * Pre-fetch specific collections into IDB before UI renders.
	 * Use for schema-critical collections (e.g. 'appscheme') that must be present
	 * before component mount. Data collections remain on-demand.
	 */
	async warmup(collections?: string[]): Promise<void> {
		if (!this._qoolie) return;
		await (this._qoolie as any).hydrateAll?.(collections);
	}

	async resetClientData(): Promise<void> {
		this.destroy();
		await deleteIdbDatabase(this._dbName);
		const { clearSchemaCache } = await import('$lib/main/machineSchemaCache.js');
		await clearSchemaCache();
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
		this._frameManager.setRouter((url) => r.push(url));
		this._frameManager.setNavigationHook(({ collection, collectionId, vars }) => {
			void machineActionCallable('appuser_activity', {
				code:             'VIEW',
				collection,
				collection_value: collectionId ?? '',
				collection_vars:  vars
			}, { touch: 'timestamp' });

			if (collectionId !== undefined && collectionId !== '') {
				void this._renderLabel(collection, collectionId).then((label) => {
					void machineActionCallable('appuser_history', {
						collection,
						collection_value: collectionId,
						label
					}, {
						upsertOn: ['collection', 'collection_value'],
						bump:     'count',
						touch:    'lastSeen'
					});
				});
			}
		});
		return r;
	}

	/** Compute a record label from `template.presentation`. Used by navigation history writes and dialog titles. @internal */
	async _renderLabel(collection: string, collectionId: string): Promise<string | undefined> {
		try {
			const scheme = this._machineDb?.collection(collection);
			const presentation = (scheme as { template?: { presentation?: string } } | null | undefined)
				?.template?.presentation;
			if (!presentation) return undefined;
			const id = isNaN(Number(collectionId)) ? collectionId : Number(collectionId);
			const rec = await this.collection(collection).get(id) as Record<string, unknown> | undefined;
			if (!rec) return undefined;
			const label = presentation.split(/\s+/).filter(Boolean)
				.map((tok) => {
					let cur: unknown = rec;
					for (const seg of tok.split('.')) {
						if (cur == null) return '';
						cur = (cur as Record<string, unknown>)[seg];
					}
					return cur == null ? '' : String(cur);
				})
				.filter(Boolean).join(' ');
			return label || undefined;
		} catch (err) {
			console.warn('[machine] label render failed:', err);
			return undefined;
		}
	}

	/** Access to the frame manager singleton. */
	get framer() {
		return this._frameManager;
	}

	/** Access to the component registry singleton. */
	get componentRegistry() {
		return machineComponentRegistry;
	}

	/** DOM manipulation utility — wraps @medyll/idae-be. Usage: machine.be('#el').addClass('active') */
	get be(): typeof _be {
		return _be;
	}

	/**
	 * Create and register a new Machine instance.
	 * Registers the instance in the static registry for later retrieval.
	 * @role Factory method
	 * @param {string} [instanceName] Optional name to register the instance under.
	 * @param {string} [dbName] Database name for the new instance.
	 * @param {number} [version] Schema version for the new instance.
	 * @param {MachineModel} [business] Business data model for the new instance.
	 * @returns {Machine} The newly created and started Machine instance.
	 */
	createInstance(
		instanceName?: string,
		dbName?: string,
		version?: number,
		business?: MachineModel
	): Machine {
		const instance = new Machine();
		instance.init({ dbName, version, business });
		if (instanceName) {
			instance.instanceName = instanceName;
			Machine.instanceRegistry[instanceName] = instance;
		}
		instance.ready = instance.boot();
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

export { buildLoadInUrl } from '$lib/main/frame/frameUrl.js';

const _g = globalThis as unknown as { __idae_machine?: Machine };
export const machine: Machine = _g.__idae_machine ?? (_g.__idae_machine = new Machine());

// Wire MachineAction with a host that resolves the current user + collections lazily.
// Avoids importing `machine` from inside MachineAction.ts (which would create a cycle).
machineAction.setHost({
	currentUserId: () => (machine.rights.currentUser ? String(machine.rights.currentUser.id) : null),
	collection:    (name) => {
		try { return machine.collection(name) as unknown as ActionCollection; }
		catch { return null; }
	}
});

// Wire dialog/frame titles to record presentation labels (lazy — avoids init ordering).
machineFrameManager.setLabelResolver((col, id) => (id ? machine._renderLabel(col, id) : Promise.resolve(undefined)));

if (import.meta.hot) import.meta.hot.accept();
