import { idaeApi, mongooseConnectionManager } from '@medyll/idae-api';
import type { Connection } from 'mongoose';
import type { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

async function getMetaDb(): Promise<Connection> {
	const dbName = `${config.org}_machine_app`;
	return mongooseConnectionManager.getConnection(dbName)
		?? await mongooseConnectionManager.createConnection(config.mongodbUri, dbName);
}

/**
 * Reconstruct IdbqModel-compatible JSON from appscheme_* collections.
 * - Fields come from appscheme_has_field (ordered) → appscheme_field
 * - FKs come from appscheme.gridFks (entries that are not appscheme_base/appscheme_type)
 * - FK field types come from appscheme_has_table_field
 */
async function buildModel(db: Connection, collectionCode?: string): Promise<Record<string, unknown>> {
	const schemeFilter = collectionCode ? { code: collectionCode } : {};
	const schemes = await db.collection('appscheme').find(schemeFilter).toArray();

	// Load all field docs for lookup
	const fieldDocs = await db.collection('appscheme_field').find().toArray();
	const fieldByCode = new Map(fieldDocs.map((f: any) => [f.code as string, f]));

	// Load has_field links
	const hasFieldDocs = await db.collection('appscheme_has_field').find().toArray();

	// Load FK field→collection links
	const hasTFieldDocs = await db.collection('appscheme_has_table_field').find().toArray();

	// Group has_field by collection code, sorted by order
	const hasFieldByScheme: Record<string, any[]> = {};
	for (const hf of hasFieldDocs) {
		const schemeCode = hf.gridFks?.appscheme?.code as string;
		if (!schemeCode) continue;
		if (!hasFieldByScheme[schemeCode]) hasFieldByScheme[schemeCode] = [];
		hasFieldByScheme[schemeCode].push(hf);
	}
	for (const list of Object.values(hasFieldByScheme)) {
		list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
	}

	// Group has_table_field by scheme+field for FK type resolution
	// key: `{schemeCode}::{fieldCode}` → target collection code
	const fkTargetMap = new Map<string, { targetCol: string; targetField: string }>();
	for (const htf of hasTFieldDocs) {
		const schemeCode = htf.gridFks?.appscheme?.code as string;
		const fieldCode  = htf.gridFks?.appscheme_field?.code as string;
		const linkCode   = htf.gridFks?.appscheme_link?.code as string;
		const targetFld  = htf.targetField as string ?? 'id';
		if (schemeCode && fieldCode && linkCode) {
			fkTargetMap.set(`${schemeCode}::${fieldCode}`, { targetCol: linkCode, targetField: targetFld });
		}
	}

	const model: Record<string, unknown> = {};

	for (const scheme of schemes) {
		const code = scheme.code as string;
		const hasFields = hasFieldByScheme[code] ?? [];

		// Build fields map
		const fields: Record<string, unknown> = {};
		for (const hf of hasFields) {
			const fieldCode = hf.gridFks?.appscheme_field?.code as string;
			if (!fieldCode) continue;

			const fieldDoc = fieldByCode.get(fieldCode);
			const rawType  = fieldDoc?.field_type as string ?? 'text';

			// If FK field, reconstruct fk- type from has_table_field
			let finalType = rawType;
			if (rawType === 'fk') {
				const fkTarget = fkTargetMap.get(`${code}::${fieldCode}`);
				if (fkTarget) {
					finalType = `fk-${fkTarget.targetCol}.${fkTarget.targetField}`;
				}
			}

			fields[fieldCode] = {
				type:     finalType,
				required: !!(fieldDoc?.required),
				readonly: !!(fieldDoc?.readonly),
				private:  !!(fieldDoc?.private),
			};
		}

		// Build fks from appscheme.gridFks (exclude meta keys appscheme_base/appscheme_type)
		const META_FK_KEYS = new Set(['appscheme_base', 'appscheme_type']);
		const fks: Record<string, unknown> = {};
		const gridFks = (scheme.gridFks ?? {}) as Record<string, any>;
		for (const [key, fkItem] of Object.entries(gridFks)) {
			if (META_FK_KEYS.has(key)) continue;
			fks[key] = {
				code:     fkItem.code ?? key,
				multiple: fkItem.multiple ?? false,
				rules:    fkItem.required ? 'required' : '',
			};
		}

		model[code] = {
			keyPath:  scheme.keyPath ?? '++id',
			base:     scheme.base,
			model:    {},
			template: {
				index:        scheme.index,
				presentation: scheme.presentation,
				fields,
				fks,
			},
		};
	}

	return model;
}

export async function getAllSchemes(_req: Request, res: Response): Promise<void> {
	try {
		const db    = await getMetaDb();
		const model = await buildModel(db);
		res.json(model);
	} catch (error) {
		logger.error('Error fetching schemes:', error);
		res.status(500).json({ error: 'Failed to fetch schemes' });
	}
}

export async function getScheme(req: Request, res: Response): Promise<void> {
	try {
		const { table } = req.params;
		const db    = await getMetaDb();

		const exists = await db.collection('appscheme').findOne({ code: table });
		if (!exists) {
			res.status(404).json({ error: `Scheme '${table}' not found` });
			return;
		}

		const model = await buildModel(db, table);
		res.json(model);
	} catch (error) {
		logger.error('Error fetching scheme:', error);
		res.status(500).json({ error: 'Failed to fetch scheme' });
	}
}

export function registerSchemeRoutes(): void {
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme',        handler: getAllSchemes });
	idaeApi.router.addRoute({ method: 'get', path: '/api/scheme/:table', handler: getScheme });
	logger.info('Scheme routes registered: /api/scheme, /api/scheme/:table');
}
