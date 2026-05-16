import { idaeApi, mongooseConnectionManager } from '@medyll/idae-api';
import { DbType } from '@medyll/idae-db';
import type { Connection } from 'mongoose';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerSchemeRoutes } from './routes/scheme.js';
import { registerDataRoutes } from './routes/data.js';
import { registerPermissionRoutes } from './middleware/permission.js';
import { registerBootstrapRoutes } from './routes/bootstrap.js';
import { initializeSocketIO } from './socket/index.js';
import { setupConflictHandling } from './socket/conflictHandler.js';
import { deployModel as runDeployModel, seedEngineRegistries } from './bootstrap/deployModel.js';
import { buildEngineModel } from '../../src/lib/types/engineModel.js';
import { invalidateBaseCache } from './middleware/dbRouter.js';
import type { MachineModel } from '../../src/lib/types/machine-model.js';

const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type', 'appscheme_field_type', 'appscheme_field_group', 'appscheme_view_type']);

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

	async getModel(collectionCode?: string): Promise<MachineModel> {
		const db = await this.#getMetaDb();

		const schemeFilter = collectionCode ? { code: collectionCode } : {};
		const schemes = await db.collection('appscheme').find(schemeFilter).toArray();

		const fieldDocs = await db.collection('appscheme_field').find().toArray();
		const fieldByCode = new Map(fieldDocs.map((f: any) => [f.code as string, f]));

		const hasFieldDocs  = await db.collection('appscheme_has_field').find().toArray();

		// group has_field by collection, sorted by order
		const hasFieldByScheme: Record<string, any[]> = {};
		for (const hf of hasFieldDocs) {
			const code = hf.gridFks?.appscheme?.code as string;
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

			const fields: MachineModel[string]['template']['fields'] = {};
			for (const hf of hasFields) {
				const fieldCode = hf.gridFks?.appscheme_field?.code as string;
				if (!fieldCode) continue;

				const fieldDoc = fieldByCode.get(fieldCode);
				const rawType  = (fieldDoc?.gridFks?.appscheme_field_type?.code as string) ?? 'text';

				let finalType = rawType;
				if (rawType === 'fk' && fieldDoc?.fkTargetCol) {
					const tf = (fieldDoc.fkTargetField as string) ?? 'id';
					finalType = `fk-${fieldDoc.fkTargetCol}.${tf}`;
				}

				fields[fieldCode] = {
					type:     finalType,
					required: !!(fieldDoc?.required),
					readonly: !!(fieldDoc?.readonly),
					private:  !!(fieldDoc?.private),
				};
			}

			const fks: MachineModel[string]['template']['fks'] = {};
			const gridFks = (scheme.gridFks ?? {}) as Record<string, any>;
			for (const [key, fkItem] of Object.entries(gridFks)) {
				if (META_FK_KEYS.has(key)) continue;
				fks[key] = {
					code:     fkItem.code ?? key,
					multiple: fkItem.multiple ?? false,
					required: !!(fkItem.required),
				};
			}

			model[code] = {
				keyPath:  (scheme.keyPath as string) ?? '++id',
				base:     (scheme.gridFks?.appscheme_base?.code as string) ?? 'machine_user',
				model:    {},
				fields,
				fks,
				template: (scheme.template as Record<string, any>) ?? {},
			};
		}

		return model;
	}

	// ── deployModel — writes MachineModel into appscheme_* (destructive, voluntary) ──

	async deployModel(model: MachineModel, opts?: { org?: string; mongoUri?: string }): Promise<void> {
		const org      = opts?.org ?? config.org;
		const mongoUri = opts?.mongoUri ?? config.mongodbUri;
		await seedEngineRegistries({ org, mongoUri });
		await runDeployModel(buildEngineModel(), { org, mongoUri });
		await runDeployModel(model, { org, mongoUri });
		invalidateBaseCache();
		logger.info(`Model deployed for org="${org}"`);
	}

	// ── start ─────────────────────────────────────────────────────────────────

	async start(): Promise<void> {
		// Connect to meta DB — validates credentials at startup
		const metaDbName = `${config.org}_machine_app`;
		await mongooseConnectionManager.createConnection(config.mongodbUri, metaDbName, { dbName: metaDbName });
		logger.info('Connected to MongoDB');

		// Register routes
		registerHealthRoutes();
		registerSchemeRoutes();
		registerDataRoutes();
		registerPermissionRoutes();
		if (config.nodeEnv === 'development') registerBootstrapRoutes();

		idaeApi.setOptions({
			port: config.port,
			cors: { origin: config.corsOrigin, credentials: true },
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

		const httpServer = (idaeApi as any).server;
		if (httpServer) {
			initializeSocketIO(httpServer);
			setupConflictHandling();
		}

		logger.info(`Server running on port ${config.port} [${config.nodeEnv}]`);
	}

	// ── stop ──────────────────────────────────────────────────────────────────

	async stop(): Promise<void> {
		await idaeApi.stop();
		logger.info('Server stopped');
	}
}

export const machineServer = MachineServerClass.getInstance();
