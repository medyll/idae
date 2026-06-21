import { idaeApi, mongooseConnectionManager } from '@medyll/idae-api';
import { DbType } from '@medyll/idae-db';
import type { Connection } from 'mongoose';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerSchemeRoutes } from './routes/scheme.js';
import { registerDataRoutes } from './routes/data.js';
import { registerFileRoutes } from './routes/files.js';
import { registerMailRoutes } from './routes/mail.js';
import { registerPermissionRoutes } from './middleware/permission.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerBootstrapRoutes } from './routes/bootstrap.js';
import { AiRouter } from './ai/AiRouter.js';
import { AgentRouter } from './ai/AgentRouter.js';
import { initializeSocketIO, getSocketServer, type SocketServerOptions } from './socket/index.js';
import { setupConflictHandling } from './socket/conflictHandler.js';
import type { SocketIoServer } from '@medyll/idae-socket/server';
import { publishModel as runPublishModel, seedIdaeRegistries } from './bootstrap/publishModel.js';
import { buildIdaeModel } from './bootstrap/seed/idaeModel.js';
import { invalidateBaseCache } from './middleware/dbRouter.js';
import { orgContextMiddleware, getCurrentOrg } from './middleware/orgContext.js';
import type { MachineModel } from '../../src/lib/types/machine-model.js';
import type { ViewFields, ViewFieldDef } from '../../src/lib/types/entity-types.js';
import { mcpServer } from './mcp/index.js';

// Load domain actions — registers hooks for demo collections
import './models/demo/actions.js';
import { registerBuiltinHooks } from './hooks/builtins.js';

class MachineServerClass {
	static #instance: MachineServerClass | null = null;

	private constructor() {}

	static getInstance(): MachineServerClass {
		if (!MachineServerClass.#instance) {
			MachineServerClass.#instance = new MachineServerClass();
		}
		return MachineServerClass.#instance;
	}

	// ── DB helpers ────────────────────────────────────────────────────────────

	async #getMetaDb(): Promise<Connection> {
		const dbName = `${getCurrentOrg()}_machine_app`;
		return mongooseConnectionManager.getConnection(dbName)
			?? await mongooseConnectionManager.createConnection(config.mongodbUri, dbName, { dbName });
	}

	// ── getModel — reads appscheme_* → MachineModel ───────────────────────────

	/** Map appscheme_view_type.code to ViewFields key name. */
	private _viewTypeToKey(code: string): string | null {
		switch (code) {
			case 'full': return 'full';
			case 'flat': return 'flat';
			case 'fk':   return 'fk';
			case 'focus': return 'focus';
			default:     return null; // unknown view types ignored
		}
	}

	async getModel(collectionCode?: string): Promise<MachineModel> {
		const db = await this.#getMetaDb();

		const schemeFilter = collectionCode ? { code: collectionCode } : {};
		const schemes = await db.collection('appscheme').find(schemeFilter).toArray();

		const fieldDocs = await db.collection('appscheme_field').find().toArray();
		const fieldByCode = new Map(fieldDocs.map((f: any) => [f.code as string, f]));

		// Load appscheme_view rows for _views construction
		const viewDocs = await db.collection('appscheme_view').find().toArray();

		const hasFieldDocs  = await db.collection('appscheme_has_field').find().toArray();

		// group has_field by collection, sorted by order
		const hasFieldByScheme: Record<string, any[]> = {};
		for (const hf of hasFieldDocs) {
			const code = hf.fks?.appscheme?.code as string;
			if (!code) continue;
			(hasFieldByScheme[code] ??= []).push(hf);
		}
		for (const list of Object.values(hasFieldByScheme)) {
			list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
		}

		const model: MachineModel = {};

		for (const scheme of schemes) {
			const code      = scheme.code as string;
			const hasFields = hasFieldByScheme[code] ?? [];

			const fields: MachineModel[string]['fields'] = {};
			for (const hf of hasFields) {
				const fieldCode = hf.fks?.appscheme_field?.code as string;
				if (!fieldCode) continue;

				const fieldDoc = fieldByCode.get(fieldCode);
				const rawType  = (fieldDoc?.fks?.appscheme_field_type?.code as string) ?? 'text';

				const finalType = (fieldDoc?.fieldType as string) ?? rawType;

				fields[fieldCode] = {
					type:     finalType,
					required: !!(fieldDoc?.required),
					readonly: !!(fieldDoc?.readonly),
					private:  !!(fieldDoc?.private),
					group:    (fieldDoc?.fks?.appscheme_field_group?.code as string) ?? undefined,
				};
			}

			// Note: code/name fields are now guaranteed at publish time by ensureCodeField()
			// in publishModel.ts. No runtime mirroring needed.

			// Relation descriptors live in `fkRelations` (split from the record's own
			// `fks` value-bag of base/type pointers — RATIONALIZE #1). The in-memory
			// model keeps the `fks` name; only the stored appscheme record was split.
			const fks: MachineModel[string]['fks'] = {};
			const schemeRels = (scheme.fkRelations ?? {}) as Record<string, any>;
			for (const [key, fkItem] of Object.entries(schemeRels)) {
				fks[key] = {
					code:     fkItem.code ?? key,
					multiple: fkItem.multiple ?? false,
					required: !!(fkItem.required),
				};
			}

			// Build _views from appscheme_view rows
			const _views: Partial<ViewFields> = {};
			const schemeViews = viewDocs.filter((v: any) =>
				v.fks?.appscheme?.code === code
			);
			for (const v of schemeViews) {
				const viewTypeCode = v.fks?.appscheme_view_type?.code as string;
				const fieldCode = v.fks?.appscheme_field?.code as string;
				if (!viewTypeCode || !fieldCode) continue;

				// Map view_type.code to ViewFields key
				const viewKey = this._viewTypeToKey(viewTypeCode);
				if (!viewKey) continue;

				if (!_views[viewKey]) _views[viewKey] = [];
				(_views[viewKey] as ViewFieldDef[]).push({
					name:  fieldCode,
					code:  fieldCode,
					order: v.order ?? 0,
				});
			}

			// Sort each view by order
			for (const key of Object.keys(_views)) {
				(_views[key] as ViewFieldDef[]).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			}

			model[code] = {
				keyPath:  (scheme.keyPath as string) ?? '++id',
				base:     (scheme.base as string) ?? 'machine_user',
				model:    {},
				fields,
				fks,
				...(scheme.rights ? { rights: scheme.rights } : {}),
				template: (scheme.template as Record<string, any>) ?? {},
				_views,
			};
		}

		return model;
	}

	// ── publishModel ─ writes MachineModel into appscheme_* (destructive, voluntary) ──

	async publishModel(model: MachineModel, opts?: { org?: string; mongoUri?: string }): Promise<void> {
		const org      = opts?.org ?? config.org;
		const mongoUri = opts?.mongoUri ?? config.mongodbUri;
		await seedIdaeRegistries({ org, mongoUri });
		await runPublishModel(buildIdaeModel(), { org, mongoUri });
		await runPublishModel(model, { org, mongoUri });
		invalidateBaseCache(undefined, org);
		logger.info(`Model published for org="${org}"`);
	}

	// ── socket ────────────────────────────────────────────────────────────────

	/** Live SocketIoServer instance — available after start(). */
	get socket(): SocketIoServer | null {
		return getSocketServer();
	}

	// ── start ─────────────────────────────────────────────────────────────────

	async start(opts: { socket?: SocketServerOptions } = {}): Promise<void> {
		// Connect to meta DB — validates credentials at startup
		const metaDbName = `${config.org}_machine_app`;
		await mongooseConnectionManager.createConnection(config.mongodbUri, metaDbName, { dbName: metaDbName });
		logger.info('Connected to MongoDB');

		registerBuiltinHooks();

		// Per-request org context — must precede ALL routes (incl. RouteManager-flushed
		// ones below) so handlers (and the deep call chain: dbRouter, hooks, getModel,
		// Grant/Audit, AuthService.login) read the request's org via getCurrentOrg()
		// instead of the static config.org. Registering it after start() (where it lived
		// before) put it AFTER the already-flushed scheme/auth routes — login always
		// resolved to config.org regardless of the `?org=` query param.
		idaeApi.app.use(orgContextMiddleware);

		// Org-authoritative data routing: idae-api's data middleware resolves the target
		// database via this hook instead of the URL, pinning every data request to the
		// current org's database (`${org}_machine_app`). The URL can no longer select a
		// different tenant's data, and there is no legacy default to fall back to.
		idaeApi.app.locals.resolveDbName = () => `${getCurrentOrg()}_machine_app`;

		// v3 RouteManager routes — must be added BEFORE start() so they're flushed to Express
		// (cors/helmet/json get installed first inside start, then RouteManager flush appends routes after middleware)
		registerSchemeRoutes();
		registerAuthRoutes();

		const allowedOrigins = config.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
		const corsOrigin = (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
			// No origin = same-origin request, curl, server-to-server — allow.
			if (!origin) return cb(null, true);
			if (allowedOrigins.includes(origin)) return cb(null, true);
			// Dev: localhost + LAN (192.168/172.16/10.x.x) + Tailscale (100.x.x) ranges.
			if (config.nodeEnv !== 'production' && /^https?:\/\/(localhost|127\.0\.0\.1|(?:192\.168|172\.(?:1[6-9]|2\d|3[01])|10\.\d{1,3}|100\.\d{1,3})\.\d{1,3}\.\d{1,3}):\d+$/.test(origin)) return cb(null, true);
			cb(new Error(`CORS: origin not allowed: ${origin}`));
		};

		idaeApi.setOptions({
			port: config.port,
			cors: { origin: corsOrigin, credentials: true },
			enableCompression: true,
			payloadLimit: '1mb',
			idaeDbOptions: {
				dbType:           DbType.MONGODB,
				// No dbScope — the per-request db is resolved in full via app.locals.resolveDbName
				// (`${org}_machine_app`). A static scope here can't express per-request org and
				// would double-prefix the resolved name.
				idaeModelOptions: {
					autoIncrementFormat:       (_collection: string) => 'id',
					autoIncrementDbCollection: 'auto_increment',
				},
			},
		});

		await idaeApi.start();

		// Start MCP server
		await mcpServer.start();

		// Direct Express routes (idaeApi.app.METHOD) — AFTER start() so cors/helmet are already on the stack
		registerHealthRoutes();
		registerFileRoutes();
		registerMailRoutes();
		registerPermissionRoutes();
		registerDataRoutes();
		if (config.nodeEnv === 'development') registerBootstrapRoutes();
        
        // AI routes
        idaeApi.app.use('/api/ai', AiRouter);
        idaeApi.app.use('/api/ai/agent', AgentRouter);

		const httpServer = (idaeApi as any).server;
		if (httpServer) {
			initializeSocketIO(httpServer, opts.socket ?? {});
			setupConflictHandling();
		}

		logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
	}

	// ── stop ──────────────────────────────────────────────────────────────────

	async stop(): Promise<void> {
		await mcpServer.stop();
		await idaeApi.stop();
		logger.info('Server stopped');
	}
}

export const machineServer = MachineServerClass.getInstance();
