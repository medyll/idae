/**
 * MCP periphery tools — files (read/delete, no upload), templated mail,
 * health, and DB stats.
 *
 * File access is gated by the permission on the file's OWNING collection
 * (R to read metadata, D to delete) — files inherit their record's RBAC.
 */

import { config } from '../../config.js';
import { getCurrentOrg } from '../../middleware/orgContext.js';
import { getDbForCollection } from '../../middleware/dbRouter.js';
import * as FileService from '../../services/FileService.js';
import { sendTemplate } from '../../services/MailService.js';
import { logAudit } from '../../services/AuditService.js';
import * as SchemeTools from '../SchemeTools.js';
import { type McpToolDef, requirePerm, requireAdmin, collectionArg } from '../types.js';

export const peripheryTools: McpToolDef[] = [
	{
		name: 'file_list',
		description: 'List files attached to a record (metadata only — no upload/download via MCP).',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, recordId: { type: 'string', description: 'Owning record id' } },
			required: ['collection', 'recordId'],
		},
		run: async ({ collection, recordId }, auth) => {
			await requirePerm(auth, collection, 'R');
			return FileService.listFiles(getCurrentOrg(), collection, recordId);
		},
	},
	{
		name: 'file_meta',
		description: 'Get the metadata of one file by fileId. Requires R on the file\'s owning collection.',
		inputSchema: {
			type: 'object',
			properties: { fileId: { type: 'string', description: 'File id' } },
			required: ['fileId'],
		},
		run: async ({ fileId }, auth) => {
			const meta = await FileService.getFileMeta(getCurrentOrg(), fileId);
			if (!meta) throw new Error(`File '${fileId}' not found`);
			await requirePerm(auth, meta.collection, 'R');
			return meta;
		},
	},
	{
		name: 'file_delete',
		description: 'Delete a file (soft by default, permanent:true to remove from disk). Requires D on the file\'s owning collection.',
		inputSchema: {
			type: 'object',
			properties: {
				fileId: { type: 'string', description: 'File id' },
				permanent: { type: 'boolean', description: 'Hard-delete file + disk content (default false)' },
			},
			required: ['fileId'],
		},
		run: async ({ fileId, permanent }, auth) => {
			const meta = await FileService.getFileMeta(getCurrentOrg(), fileId);
			if (!meta) throw new Error(`File '${fileId}' not found`);
			await requirePerm(auth, meta.collection, 'D');

			const deleted = await FileService.deleteFile(getCurrentOrg(), fileId, permanent === true);
			logAudit({
				action: 'delete', userId: auth.user?.userId, login: auth.user?.login,
				resourceType: 'appfile', resourceId: fileId,
				status: deleted ? 'success' : 'failure',
				details: { collection: meta.collection, recordId: meta.recordId, permanent: permanent === true, via: 'mcp' },
				...auth.audit,
			});
			return { deleted, fileId, permanent: permanent === true };
		},
	},
	{
		name: 'mail_send_template',
		description: 'Send a templated mail (server-side template + vars). Admin only. No-op with a reason when MAIL_ENABLED is off.',
		inputSchema: {
			type: 'object',
			properties: {
				to: { type: 'string', description: 'Recipient address (or comma-separated list)' },
				template: { type: 'string', description: 'Template name (server templates dir)' },
				vars: { type: 'object', description: 'Template variables' },
				subject: { type: 'string', description: 'Optional subject override' },
			},
			required: ['to', 'template'],
		},
		run: async ({ to, template, vars, subject }, auth) => {
			const admin = requireAdmin(auth);
			const recipients = typeof to === 'string' && to.includes(',') ? to.split(',').map((s: string) => s.trim()) : to;
			const result = await sendTemplate({ to: recipients, template, vars: vars ?? {}, subject });
			logAudit({
				action: 'execute', userId: admin.userId, login: admin.login,
				resourceType: 'mail', resourceId: template,
				status: 'success', details: { to: recipients, template, via: 'mcp' },
				...auth.audit,
			});
			return result;
		},
	},
	{
		name: 'health',
		description: 'Server health: status, version, environment, current org, mail/auth/schema-write flags.',
		inputSchema: { type: 'object', properties: {} },
		run: async () => ({
			status: 'ok',
			version: config.version,
			environment: config.nodeEnv,
			org: getCurrentOrg(),
			timestamp: new Date().toISOString(),
			flags: {
				authDisabled: config.authDisabled,
				mailEnabled: config.mail.enabled,
				mcpSchemaWrite: config.mcpSchemaWrite,
			},
		}),
	},
	{
		name: 'db_stats',
		description: 'Document counts per collection of the current org model (soft-deleted included). Admin only.',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => {
			requireAdmin(auth);
			const collections = await SchemeTools.listCollections();
			const counts: Record<string, number> = {};
			for (const code of collections) {
				try {
					const db = await getDbForCollection(code);
					counts[code] = await db.collection(code).countDocuments();
				} catch {
					counts[code] = -1; // unreachable collection — surfaced, not fatal
				}
			}
			return { org: getCurrentOrg(), collections: counts };
		},
	},
];
