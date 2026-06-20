import { registerHook } from './HooksRegistry.js';
import { logAudit } from '../services/AuditService.js';
import { broadcastToTable } from '../socket/index.js';
import { getDomainActions } from '../models/domainActions.js';
import * as ImagePresetRegistry from '../services/ImagePresetRegistry.js';
import { findReverseFkHolders, makeMongoFkResolver, parseFkKey } from '../validation/FkValidator.js';
import { foldFks } from '../validation/FkFolder.js';
import { getDbForCollection } from '../middleware/dbRouter.js';
import { machineServer } from '../MachineServer.js';
import { Schema } from 'mongoose';

async function foldAndMutate(ctx: { collection: string; data?: unknown }): Promise<Array<{ fkName: string; message: string }>> {
	if (!ctx.data || typeof ctx.data !== 'object') return [];
	const model = await machineServer.getModel(ctx.collection);
	const { data: folded, errors } = await foldFks(
		model, ctx.collection, ctx.data as Record<string, unknown>, makeMongoFkResolver(),
	);
	Object.assign(ctx.data as Record<string, unknown>, folded);
	return errors;
}

export function registerBuiltinHooks(): void {
	// FK FOLD + VALIDATE — priority 20, blocking, pre:create + pre:update
	registerHook('pre:create', async (ctx) => {
		const errors = await foldAndMutate(ctx);
		if (errors.length) {
			throw Object.assign(new Error('FK fold failed'), { fkErrors: errors, statusCode: 422 });
		}
	}, { priority: 20, blocking: true });

	registerHook('pre:update', async (ctx) => {
		const errors = await foldAndMutate(ctx);
		if (errors.length) {
			throw Object.assign(new Error('FK fold failed'), { fkErrors: errors, statusCode: 422 });
		}
	}, { priority: 20, blocking: true });

	// FK CASCADE NULLIFY — non-blocking, post:delete
	// When a record is deleted, unset all fks.{fkName}_{deletedId} entries in referencing collections.
	registerHook('post:delete', async (ctx) => {
		if (!ctx.recordId) return;
		const holders = await findReverseFkHolders(ctx.collection);
		if (!Object.keys(holders).length) return;

		for (const [sourceCollection, fkNames] of Object.entries(holders)) {
			try {
				const db = await getDbForCollection(sourceCollection);
				const schema = new Schema({}, { strict: false, collection: sourceCollection.toLowerCase() });
				const modelName = `${db.name}__${sourceCollection}`;
				const Model = db.models[modelName] ?? db.model(modelName, schema, sourceCollection.toLowerCase());

				for (const fkName of fkNames) {
					const fkKey = `fks.${fkName}_${ctx.recordId}`;
					await (Model as any).updateMany(
						{ [fkKey]: { $exists: true } },
						{ $unset: { [fkKey]: '' } },
					);
				}
			} catch (err) {
				// Non-blocking — log and continue
				console.warn(`FK cascade nullify failed for ${sourceCollection}:`, err);
			}
		}
	}, { priority: 95 });

	// IMAGE PRESET CACHE INVALIDATION — priority 10 (earliest)
	registerHook('post:create', (ctx) => {
		if (ctx.collection === 'appimage_preset') ImagePresetRegistry.invalidate();
	}, { priority: 10 });

	registerHook('post:update', (ctx) => {
		if (ctx.collection === 'appimage_preset') ImagePresetRegistry.invalidate();
	}, { priority: 10 });

	registerHook('post:delete', (ctx) => {
		if (ctx.collection === 'appimage_preset') ImagePresetRegistry.invalidate();
	}, { priority: 10 });

	// AUDIT — priority 50, all events
	registerHook('post:create', (ctx) => {
		logAudit({
			action: 'create',
			userId: ctx.user?.userId,
			login:  ctx.user?.login,
			resourceType: ctx.collection,
			resourceId:   String((ctx.data as any)?._id ?? ctx.recordId),
			status: 'success',
			ipAddress: ctx.req?.ipAddress,
			userAgent: ctx.req?.userAgent,
		});
	}, { priority: 50 });

	registerHook('post:update', (ctx) => {
		logAudit({
			action: 'update',
			userId: ctx.user?.userId,
			login:  ctx.user?.login,
			resourceType: ctx.collection,
			resourceId:   ctx.recordId,
			status: 'success',
			details: { fields: Object.keys((ctx.data as any) ?? {}) },
			ipAddress: ctx.req?.ipAddress,
			userAgent: ctx.req?.userAgent,
		});
	}, { priority: 50 });

	registerHook('post:delete', (ctx) => {
		logAudit({
			action: 'delete',
			userId: ctx.user?.userId,
			login:  ctx.user?.login,
			resourceType: ctx.collection,
			resourceId:   ctx.recordId,
			status: 'success',
			details: ctx.details ?? (ctx.data as Record<string, unknown>),
		});
	}, { priority: 50 });

	// BROADCAST — priority 80
	registerHook('post:create',  (ctx) => broadcastToTable(ctx.collection, 'data:created',  ctx.data));
	registerHook('post:update',  (ctx) => broadcastToTable(ctx.collection, 'data:updated',  { id: ctx.recordId, record: ctx.data }));
	registerHook('post:delete',  (ctx) => broadcastToTable(ctx.collection, 'data:deleted',  { id: ctx.recordId }));
	registerHook('post:restore', (ctx) => broadcastToTable(ctx.collection, 'data:restored', { id: ctx.recordId }));

	// DOMAIN ACTIONS — priority 90 (after audit/broadcast)
	registerHook('post:create', async (ctx) => {
		const da = getDomainActions(ctx.collection);
		if (da?.afterCreate) await da.afterCreate(ctx.data, ctx.collection);
	}, { priority: 90 });

	registerHook('post:update', async (ctx) => {
		const da = getDomainActions(ctx.collection);
		if (da?.afterUpdate) await da.afterUpdate(ctx.data, ctx.collection);
	}, { priority: 90 });

	registerHook('pre:delete', async (ctx) => {
		const da = getDomainActions(ctx.collection);
		if (da?.beforeDelete) await da.beforeDelete(ctx.recordId!, ctx.collection);
	}, { priority: 90, blocking: true });
}
