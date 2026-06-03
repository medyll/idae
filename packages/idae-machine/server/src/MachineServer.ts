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
import { initializeSocketIO, getSocketServer, type SocketServerOptions } from './socket/index.js';
import { setupConflictHandling } from './socket/conflictHandler.js';
import type { SocketIoServer } from '@medyll/idae-socket';
import { deployModel as runDeployModel, seedEngineRegistries } from './bootstrap/deployModel.js';
import { buildEngineModel } from './bootstrap/seed/engineModel.js';
import { invalidateBaseCache } from './middleware/dbRouter.js';
import type { MachineModel } from '../../src/lib/types/machine-model.js';
import type { ViewFields, ViewFieldDef } from '../../src/lib/types/schema-types.js';
import { mcpServer } from './mcp/index.js';

// Load domain actions — registers hooks for demo collections
import './models/demo/actions.js';
import { registerBuiltinHooks } from './hooks/builtins.js';


const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type', 'appscheme_field_group', 'appscheme_view_type']);

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
		const dbName = `${config.org}_machine_app`;
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

			// Solidify code/name: every collection exposes both. Mirror the present
			// one onto the missing one so downstream (focus fallback, fk labels) can
			// always rely on code AND name.
			if (fields.code && !fields.name) fields.name = { ...fields.code };
			else if (fields.name && !fields.code) fields.code = { ...fields.name };

			const fks: MachineModel[string]['fks'] = {};
			const fks = (scheme.fks ?? {}) as Record<string, any>;
			for (const [key, fkItem] of Object.entries(fks)) {
				if (META_FK_KEYS.has(key)) continue;
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
				template: (scheme.template as Record<string, any>) ?? {},
				_views,
			};
		}

		return model;
	}

	// ── deployModel ─ writes MachineModel into appscheme_* (destructive, voluntary) ──

	async deployModel(model: MachineModel, opts?: { org?: string; mongoUri?: string }): Promise<void> {
		const org      = opts?.org ?? config.org;
		const mongoUri = opts?.mongoUri ?? config.mongodbUri;
		await seedEngineRegistries({ org, mongoUri });
		await runDeployModel(buildEngineModel(), { org, mongoUri });
		await runDeployModel(model, { org, mongoUri });
		invalidateBaseCache();
		logger.info(`Model deployed for org="${org}"`);
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

		// v3 RouteManager routes — must be added BEFORE start() so they're flushed to Express
		// (cors/helmet/json get installed first inside start, then RouteManager flush appends routes after middleware)
		registerSchemeRoutes();
		registerAuthRoutes();

		const allowedOrigins = config.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
		const corsOrigin = (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
			// No origin = same-origin request, curl, server-to-server — allow.
			if (!origin) return cb(null, true);
			if (allowedOrigins.includes(origin)) return cb(null, true);
			// Dev: any localhost port (Vite may pick 5174+ when 5173 is taken).
			if (config.nodeEnv !== 'production' && /^https?:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
			cb(new Error(`CORS: origin not allowed: ${origin}`));
		};

		idaeApi.setOptions({
			port: config.port,
			cors: { origin: corsOrigin, credentials: true },
			enableCompression: true,
			payloadLimit: '1mb',
			idaeDbOptions: {
				dbType:           DbType.MONGODB,
				dbScope:          config.org,
				dbScopeSeparator: '_',
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
