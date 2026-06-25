import { MachineDb } from '$lib/main/machineDb.js';
import { createQoolie, type SyncConfig, type SyncErrorContext, type ResultSet } from '@medyll/qoolie';
import { useQoolieCollection, useQoolieQuery } from '@medyll/qoolie/svelte';
import type { EventDataClientInstance } from '@medyll/idae-socket';
import { be as _be } from '@medyll/idae-be';
import { MachineRouter, type MachineRouterConfig } from '$lib/main/machine/MachineRouter.js';
import { machineRights } from '$lib/main/machine/MachineRights.js';
import { machineAction, machineActionCallable, type ActionCollection } from '$lib/main/machine/MachineAction.js';
import { buildEffectiveModel } from '$lib/main/machineModelBuilder.js';
import { detectSchemaDrift, performIdbUpgrade, deleteIdbDatabase, getActualIdbVersion, storeSchemaHash, type PendingIdbUpgrade } from '$lib/main/machineIdbAdapter.js';
import { componentRegistry, type ComponentRegistry } from '$lib/main/router/componentRegistry.js';
import { machineFrameManager } from '$lib/main/frame/MachineFrameManager.js';
import { IdaeMenuManager } from '$lib/idae/menu/IdaeMenuManager.js';
import type { AppschemeMenuEntry, AppschemeBaseMenuEntry } from '$lib/idae/menu/IdaeMenuStore.js';
import { readMenuPrefsFromRecords } from '$lib/data-ui/utils/menuPrefs.js';
import { foldFksIntoRecord } from '$lib/main/machine/MachineFkFold.js';
import { initializeDomainPoliciesWithMachine, initializeDomainPoliciesWithModel, frameCatalog } from '$lib/idae/boot.js';
import type { MachineModel } from '$lib/types/index.js';

type SyncEvent = { type: string; collection?: string; entryId?: string; reason?: unknown };

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

	/** Seed data for mobile-first mode — auto-called with onlyIfEmpty on boot if mode === 'mobile-first' */
	_seed?: Record<string, unknown[]>;

	/** Frame manager — handles dynamic frame registration and content loading */
	private readonly _frameManager = machineFrameManager;

	/** Menu manager — created during boot to avoid module-level machine dependency. */
	private _menuManager?: IdaeMenuManager;

	/** Bound contextmenu listener — kept for removal in destroy(). */
	private _contextMenuHandler?: (e: MouseEvent) => void;

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
		this._seed          = options?.seed        ?? this._seed;
	}

	/** Fully qualified DB name for a given base: {org}_{base} */
	moduleDbName(base: string): string {
		return this._org ? `${this._org}_${base}` : base;
	}

	/** Pending IDB upgrade scheduled by drift detection — consumed by next createStore(). */
	private _pendingIdbUpgrade: PendingIdbUpgrade | null = null;

	private async createStore(replaceExisting = false): Promise<void> {
		// Capture pending upgrade: performIdbUpgrade handles renames/deletions only
		// (pure-creation is skipped — qoolie's versioned open creates those stores).
		const pending = this._pendingIdbUpgrade;
		if (pending) {
			await performIdbUpgrade(this._dbName, this._version, pending, this._effectiveModel);
			this._pendingIdbUpgrade = null;
		}
		if (replaceExisting) {
			this._qoolie?.destroy();
			this._qoolie = undefined;
		}
		const collections = Object.fromEntries([
			...Object.entries(this._effectiveModel).map(([name, col]) => [name, { keyPath: col.keyPath ?? '++id' }]),
			['__schema_meta__', { keyPath: 'id' }]
		]);
		this._qoolie = createQoolie({
			dbName:    this._dbName,
			dbVersion: this._version,
			collections,
			...(this._syncOptions !== undefined && { sync: this._syncOptions }),
			...(this._stateEngine  !== undefined && { stateEngine: this._stateEngine }),
			...(this._hooks        !== undefined && { hooks: this._hooks }),
		});

		// Persist the schema hash AFTER qoolie's open created __schema_meta__.
		// Doing this inside performIdbUpgrade (which runs before createQoolie) fails
		// with "__schema_meta__ store not found" — the store does not exist yet.
		if (pending) {
			await this._qoolie.ready();
			await storeSchemaHash(this._dbName, pending.expectedHash).catch((err) => {
				console.warn('[idae-machine] Could not persist schema hash after store creation (will retry next boot):', err);
			});
		}
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
			const orgQs = this._org ? `?org=${encodeURIComponent(this._org)}` : '';
			const url = dbHost.replace(/\/+$/, '') + '/api/scheme' + orgQs;
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
					initializeDomainPoliciesWithModel(this._effectiveModel);
					await this._scheduleDrift();
					await this.createStore(true);
					initializeDomainPoliciesWithMachine(this);
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
		initializeDomainPoliciesWithModel(this._effectiveModel);

		// Never downgrade IDB — adopt the actual on-disk version BEFORE drift detection
		// so a drift-triggered bump lands ABOVE the existing version. Reading it after
		// drift would clobber the bump (this._version = actual >= newVersion) and qoolie
		// would reopen at the same version → onupgradeneeded never fires → stores from a
		// corrupt/partial prior boot are never (re)created.
		const actualVersion = await getActualIdbVersion(this._dbName).catch((err) => {
			console.warn('[idae-machine] Could not read actual IDB version, defaulting to 0:', err);
			return 0;
		});
		if (actualVersion > this._version) this._version = actualVersion;
		await this._scheduleDrift();
		await this.createStore();
		initializeDomainPoliciesWithMachine(this);
		frameCatalog.registerFrames(componentRegistry as ComponentRegistry);

		// Mobile-first auto-seed: run seed(..., { onlyIfEmpty: true }) when seed data is provided
		const syncMode = (this._syncOptions && typeof this._syncOptions === 'object')
			? (this._syncOptions as SyncConfig).mode
			: undefined;
		if (syncMode === 'mobile-first' && this._seed) {
			const { seed } = await import('$lib/main/machineSeed.js');
			await seed(this._seed, { onlyIfEmpty: true });
		}

		// Initialize context menu global event listener
		this.#setupContextMenu();
	}

	/**
	 * Setup global context menu event listener
	 */
	#setupContextMenu(): void {
		if (typeof document !== 'undefined') {
			const handleContextMenu = (e: MouseEvent) => {
				const target = (e.target as HTMLElement).closest('[data-contextual]');
				if (!target) return;

				e.preventDefault();

				const contextualData = (target as HTMLElement).dataset.contextual;
				if (!contextualData) return;

				// Parse the data-contextual attribute
				const parts: string[] = contextualData.split('&');
				const params: Record<string, string> = {};

				parts.forEach((part: string) => {
					const [key, value] = part.split('=');
					if (key && value) {
						params[key] = decodeURIComponent(value);
					}
				});

				const collection = params.collection || params.table;
				const collectionId = params.collectionId || params.table_value;
				const vars: Record<string, string> = {};

				// Extract additional vars
				Object.entries(params).forEach(([key, value]: [string, string]) => {
					if (key !== 'collection' && key !== 'table' && key !== 'collectionId' && key !== 'table_value') {
						vars[key] = value;
					}
				});

				if (collection && collectionId !== undefined) {
					this._frameManager.openContextMenu(collection, collectionId, vars, e.pageX, e.pageY);
				}
			};

		this._contextMenuHandler = handleContextMenu;
		document.addEventListener('contextmenu', handleContextMenu);
	}
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
	 * Reactive collection reader — returns live-updating { records } via Svelte 5 runes.
	 * `records` is a ResultSet<T> (array + .sortBy/.groupBy/.getPage/.distinct/…).
	 * Usage: const { records } = machine.store('users');
	 *        const { records } = machine.store('users', { status: 'active' });
	 *
	 * Must be called from within a Svelte component or .svelte.ts context.
	 * For imperative CRUD use machine.collection(name) instead.
	 */
	store<T = any>(name: string, query?: Parameters<typeof useQoolieQuery>[2]): { records: ResultSet<T> } {
		if (!this._qoolie || !name) return { records: [] as unknown as ResultSet<T> };
		const src = query
			? useQoolieQuery<T>(this._qoolie, name, query)
			: useQoolieCollection<T>(this._qoolie, name);
		// ⚠️ Return a getter, never `{ records: src.items }`. Reading `src.items`
		// eagerly here snapshots it OUTSIDE any reactive frame → no dependency is
		// tracked → consumers never update. The getter defers the read to the
		// consumer's $derived/$effect, where Svelte can track it. Likewise do not
		// "flatten" store() to return the array directly: the underlying $state
		// binding in the qoolie adapter is reassigned, so only a getter sees fresh
		// values. This indirection looks redundant but is load-bearing.
		return { get records() { return src.items as ResultSet<T>; } };
	}

	/**
	 * Direct collection accessor — returns the QoolieCollection for CRUD ops, with
	 * create/update/updateWhere wrapped to denormalize FK target snapshots into
	 * `record.fks.<field>` before persisting (single write choke-point — see
	 * MachineFkFold). Every other method forwards untouched.
	 * Usage: await machine.collection('users').create(data)
	 *        await machine.collection('users').get(id)
	 * Note: machine.logic.collection(name) returns the MachineScheme (schema layer).
	 */
	collection(name: string) {
		const col = this._qoolie?.collection?.[name];
		if (!col) throw new Error(`Collection "${name}" not found. Did you call boot()?`);
		return this.#wrapCollectionFkFold(name, col);
	}

	/** Resolve an FK target record by its index field, via the underlying qoolie collection. */
	async #resolveFkTarget(fkCollection: string, fkIndexField: string, value: unknown): Promise<Record<string, unknown> | undefined> {
		const targetCol = this._qoolie?.collection?.[fkCollection];
		if (!targetCol) return undefined;
		try {
			const docs = await Promise.resolve(targetCol.where({ [fkIndexField]: value }));
			return (docs as Record<string, unknown>[] | undefined)?.[0];
		} catch {
			return undefined;
		}
	}

	#wrapCollectionFkFold<C extends object>(name: string, col: C): C {
		const fks = this._machineDb?.collection(name)?.fks ?? {};
		if (!Object.keys(fks).length) return col;

		const fold = (data: Record<string, unknown>) =>
			foldFksIntoRecord(fks, data, this.#resolveFkTarget.bind(this));

		const overrides: Record<string, unknown> = {
			create: async (data: Record<string, unknown>) =>
				(col as Record<string, (...args: unknown[]) => unknown>).create(await fold(data)),
			update: async (id: unknown, data: Record<string, unknown>) =>
				(col as Record<string, (...args: unknown[]) => unknown>).update(id, await fold(data)),
			updateWhere: async (query: unknown, data: Record<string, unknown>) =>
				(col as Record<string, (...args: unknown[]) => unknown>).updateWhere(query, await fold(data)),
		};

		// Proxy forwards every other method (where/get/getAll/...) to the real
		// instance with correct `this` binding — `{...col}` would silently drop
		// prototype methods (qoolie's QoolieCollection is a class, not a plain object).
		return new Proxy(col, {
			get(target, prop, receiver) {
				if (typeof prop === 'string' && prop in overrides) return overrides[prop];
				const value = Reflect.get(target, prop, receiver);
				return typeof value === 'function' ? value.bind(target) : value;
			},
		});
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
	 * Socket client — EventDataClientInstance from idae-socket, owned by qoolie's
	 * push listener (single connection). Available when `sync.push.protocol === 'socketio'`
	 * and the listener has connected. Configure via `init({ sync: { push: { protocol: 'socketio', ... } } })`.
	 */
	get socket(): EventDataClientInstance | undefined {
		if (!this._qoolie) return undefined;
		let pushListener;
		try {
			pushListener = this._qoolie.sync.getPushListener?.();
		} catch {
			return undefined;
		}
		const inner = (pushListener as { getListener?: () => unknown } | undefined)?.getListener?.() ?? pushListener;
		return (inner as { getClient?: () => EventDataClientInstance } | undefined)?.getClient?.();
	}

	/**
	 * Release all Qoolie resources (stops sync adapter, clears collections).
	 * Call when the Machine instance is no longer needed.
	 */
	destroy(): void {
		this._qoolie?.destroy();
		this._qoolie = undefined;
		this._pendingIdbUpgrade = null;
		if (this._contextMenuHandler && typeof document !== 'undefined') {
			document.removeEventListener('contextmenu', this._contextMenuHandler);
			this._contextMenuHandler = undefined;
		}
	}

	/**
	 * Pre-fetch specific collections into IDB before UI renders.
	 * Use for schema-critical collections (e.g. 'appscheme') that must be present
	 * before component mount. Data collections remain on-demand.
	 * 
	 * @param collections - Optional explicit list of collections to warm up.
	 *                      If not provided, derives the list from the model (collections with base='machine_app').
	 */
	async warmup(collections?: string[]): Promise<void> {
		if (!this._qoolie) return;
		
		// If no explicit collections provided, derive from model
		let collectionsToWarm = collections;
		if (!collectionsToWarm || collectionsToWarm.length === 0) {
			const { getSchemaCriticalCollections } = await import('$lib/main/warmupUtils.js');
			collectionsToWarm = getSchemaCriticalCollections(this._effectiveModel);
		}
		
		await (this._qoolie as any).hydrateAll?.(collectionsToWarm);
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
	async _renderLabel(collection: string, collectionId: string | number): Promise<string | undefined> {
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

	/**
	 * Access to the menu manager. Created lazily. Snapshot reader wired on first
	 * access so `getTree`/`getFlatItems`/`isVisible` read live appuser_prefs/
	 * appscheme/appscheme_type via machine.store (reactive read layer) instead of
	 * staying empty forever. Component-level reactivity belongs in
	 * useMenuTree.svelte.ts, not here — this getter only guarantees the manager
	 * is never wired to stale/empty data.
	 */
	get menu() {
		if (!this._menuManager) {
			this._menuManager = new IdaeMenuManager(this._frameManager, this.rights);
			this._menuManager.setSnapshotReader(() => {
				const userId = this.rights.currentUser?.id;
				const prefsRecords = this.store('appuser_prefs').records as Array<{ code?: unknown; value?: unknown }>;
				return {
					prefs: userId != null ? readMenuPrefsFromRecords(prefsRecords, userId) : {},
					baseline: this.rights.menuBaseline,
					appscheme: this.store('appscheme').records as AppschemeMenuEntry[],
					appscheme_base: this.store('appscheme_base').records as AppschemeBaseMenuEntry[],
					isDev: import.meta.env.DEV
				};
			});
		}
		return this._menuManager;
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
