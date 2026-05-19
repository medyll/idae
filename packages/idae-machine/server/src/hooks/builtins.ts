import { registerHook } from './HooksRegistry.js';
import { logAudit } from '../services/AuditService.js';
import { broadcastToTable } from '../socket/index.js';
import { getDomainActions } from '../models/domainActions.js';
import * as ImagePresetRegistry from '../services/ImagePresetRegistry.js';

export function registerBuiltinHooks(): void {
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
