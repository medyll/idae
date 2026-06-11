/**
 * MCP org tools — org discovery, view descriptors, and (flag-gated) schema
 * mutation. schema_publish and seed_org require admin AND MCP_SCHEMA_WRITE=true:
 * schema is code-owned by default; the flag opts a deployment into agent-driven
 * schema work.
 */

import { config } from '../../config.js';
import * as OrgAdmin from '../../services/OrgAdminService.js';
import * as SchemeTools from '../SchemeTools.js';
import { logAudit } from '../../services/AuditService.js';
import { type McpToolDef, type McpAuth, requirePerm, requireAdmin, collectionArg } from '../types.js';

/** Throw unless the deployment opted into MCP schema mutation. */
function requireSchemaWrite(auth: McpAuth): ReturnType<typeof requireAdmin> {
	const admin = requireAdmin(auth);
	if (!config.mcpSchemaWrite) {
		throw new Error('FORBIDDEN: schema mutation via MCP is disabled (set MCP_SCHEMA_WRITE=true to enable)');
	}
	return admin;
}

export const orgTools: McpToolDef[] = [
	{
		name: 'list_orgs',
		description: 'List orgs present on the Mongo server (every <org>_machine_app database). Admin only.',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => {
			requireAdmin(auth);
			return OrgAdmin.listOrgs();
		},
	},
	{
		name: 'get_views',
		description: 'Get the view descriptors (full/flat/fk/focus field partitions) for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			const schema = await SchemeTools.getSchema(collection);
			return (schema as any)?.views ?? {};
		},
	},
	{
		name: 'schema_publish',
		description:
			'Publish a (full or partial) MachineModel into the current org schema — upsert per collection, collections absent from the model are untouched. Invalidates schema caches. Admin only, requires MCP_SCHEMA_WRITE=true.',
		inputSchema: {
			type: 'object',
			properties: {
				model: { type: 'object', description: 'MachineModel: { [collectionCode]: { base?, fields, fks?, views? } }' },
			},
			required: ['model'],
		},
		run: async ({ model }, auth) => {
			const admin = requireSchemaWrite(auth);
			const result = await OrgAdmin.publishScheme(model ?? {});
			logAudit({
				action: 'execute', userId: admin.userId, login: admin.login,
				resourceType: 'appscheme', resourceId: result.collections.join(','),
				status: 'success', details: { tool: 'schema_publish', org: result.org, collections: result.collections },
				...auth.audit,
			});
			return result;
		},
	},
	{
		name: 'seed_org',
		description:
			'DESTRUCTIVE full org bootstrap: clears the org engine collections, republishes the engine + <org>Scheme model (from server/src/models/<org>/), reseeds image presets, demo users, and business data when <org>Seed exists. Admin only, requires MCP_SCHEMA_WRITE=true.',
		inputSchema: {
			type: 'object',
			properties: { org: { type: 'string', description: 'Org code (must have a model under server/src/models/<org>/)' } },
			required: ['org'],
		},
		run: async ({ org }, auth) => {
			const admin = requireSchemaWrite(auth);
			const result = await OrgAdmin.seedOrg(org);
			logAudit({
				action: 'execute', userId: admin.userId, login: admin.login,
				resourceType: 'org', resourceId: result.org,
				status: 'success', details: { tool: 'seed_org', ...result },
				...auth.audit,
			});
			return result;
		},
	},
];
