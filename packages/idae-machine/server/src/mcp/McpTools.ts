/**
 * McpTools — the MCP tool registry, auth context, and dispatch.
 *
 * Pure-ish wiring: depends only on services (auth/rbac) and the CRUD/scheme
 * primitives, never on the HTTP transport. McpServer.ts consumes this to register
 * handlers on the SDK Server. Kept transport-free so it is unit-testable.
 *
 * RBAC reuses AuthService.resolveUser (JWT Bearer) + GrantService.checkGrant —
 * no logic duplication. appuser_* is blocked unless admin; appscheme read is public.
 */

import type { Request } from 'express';
import { config } from '../config.js';
import { resolveUser } from '../services/AuthService.js';
import { grantService } from '../services/GrantService.js';
import type { Permission, UserContext } from '../middleware/permission.js';
import { logAudit, extractAuditContext } from '../services/AuditService.js';
import * as CollectionTools from './CollectionTools.js';
import * as SchemeTools from './SchemeTools.js';

// ── Auth context ────────────────────────────────────────────────────────────

export interface McpAuth {
	user: UserContext | null;
	/** Request audit context (IP/user-agent) — forwarded to DataService for create/update/delete. */
	audit: { ipAddress?: string; userAgent?: string };
	/** True when the (collection, permission) pair is granted for this request. */
	can(collection: string, perm: Permission): Promise<boolean>;
}

export async function buildAuth(req: Request): Promise<McpAuth> {
	const audit = extractAuditContext(req);

	// Auth disabled (AUTH_DISABLED=true) → synthetic admin, mirrors permission.ts.
	if (config.authDisabled) {
		return { user: { userId: 'dev', login: 'dev', isAdmin: true }, audit, can: async () => true };
	}

	const user = await resolveUser(req);

	return {
		user,
		audit,
		async can(collection, perm) {
			// Schema metadata is read-only descriptors — public read, like permission.ts.
			if ((perm === 'L' || perm === 'R') && collection.startsWith('appscheme')) return true;
			if (!user) return false;
			if (user.isAdmin) return true;
			// User-scoped collections never leak without admin (MCP.md vigilance #1).
			if (collection.startsWith('appuser')) return false;
			return grantService.checkGrant(user.userId, collection, perm);
		},
	};
}

/** Throw a FORBIDDEN error if the permission is not granted. Tools call this first. */
export async function requirePerm(auth: McpAuth, collection: string, perm: Permission): Promise<void> {
	if (!(await auth.can(collection, perm))) {
		throw new Error(`FORBIDDEN: ${perm} on ${collection}`);
	}
}

// ── Tool registry (schema-driven listing) ───────────────────────────────────

export interface McpToolDef {
	name: string;
	description: string;
	inputSchema: Record<string, any>;
	run(args: Record<string, any>, auth: McpAuth): Promise<unknown>;
}

const collectionArg = { collection: { type: 'string', description: 'Collection code' } };

export const TOOLS: McpToolDef[] = [
	// ── Schema tools ──
	{
		name: 'list_collections',
		description: 'List all collection codes in the current org model.',
		inputSchema: { type: 'object', properties: {} },
		run: () => SchemeTools.listCollections(),
	},
	{
		name: 'get_schema',
		description: 'Get the full schema (fields, fks, views) for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getSchema(collection);
		},
	},
	{
		name: 'get_fields',
		description: 'Get the field definitions for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getFields(collection);
		},
	},
	{
		name: 'get_fks',
		description: 'Get the foreign-key relations for one collection.',
		inputSchema: { type: 'object', properties: collectionArg, required: ['collection'] },
		run: async ({ collection }, auth) => {
			await requirePerm(auth, collection, 'R');
			return SchemeTools.getFks(collection);
		},
	},
	{
		name: 'analyze_schema',
		description:
			'Diagnose the model: list FK references that point to collections absent from the model (unresolved refs). No args.',
		inputSchema: { type: 'object', properties: {} },
		run: () => analyzeSchema(),
	},
	// ── Collection CRUD tools ──
	{
		name: 'find',
		description: 'Find documents in a collection (Mongo-style query). Result set is capped.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter (default {})' },
				limit: { type: 'number', description: 'Max documents (default 100, max 1000)' },
			},
			required: ['collection'],
		},
		run: async ({ collection, query, limit }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.find(collection, query ?? {}, limit);
		},
	},
	{
		name: 'find_one',
		description: 'Find a single document in a collection.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, query: { type: 'object', description: 'Mongo filter (default {})' } },
			required: ['collection'],
		},
		run: async ({ collection, query }, auth) => {
			await requirePerm(auth, collection, 'R');
			return CollectionTools.findOne(collection, query ?? {});
		},
	},
	{
		name: 'count',
		description: 'Count documents matching a query in a collection.',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, query: { type: 'object', description: 'Mongo filter (default {})' } },
			required: ['collection'],
		},
		run: async ({ collection, query }, auth) => {
			await requirePerm(auth, collection, 'L');
			return CollectionTools.count(collection, query ?? {});
		},
	},
	{
		name: 'create',
		description: 'Insert a document into a collection (schema validation, FK checks, audit, broadcast — same pipeline as REST).',
		inputSchema: {
			type: 'object',
			properties: { ...collectionArg, data: { type: 'object', description: 'Document to insert' } },
			required: ['collection', 'data'],
		},
		run: async ({ collection, data }, auth) => {
			await requirePerm(auth, collection, 'C');
			return CollectionTools.create(collection, data ?? {}, { user: auth.user ?? undefined, audit: auth.audit });
		},
	},
	{
		name: 'update',
		description:
			'Update documents matching a query ($set), one record at a time (schema validation, FK checks, audit, broadcast — same pipeline as REST). Empty query is refused. Capped at 1000 matches per call.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter selecting documents to update' },
				data: { type: 'object', description: 'Fields to $set' },
			},
			required: ['collection', 'query', 'data'],
		},
		run: async ({ collection, query, data }, auth) => {
			await requirePerm(auth, collection, 'U');
			return CollectionTools.update(collection, query ?? {}, data ?? {}, { user: auth.user ?? undefined, audit: auth.audit });
		},
	},
	{
		name: 'delete',
		description:
			'Delete documents matching a query, one record at a time (audit, broadcast — same pipeline as REST). Soft delete by default (sets deletedAt); pass permanent:true for hard delete. Empty query is refused. Capped at 1000 matches per call.',
		inputSchema: {
			type: 'object',
			properties: {
				...collectionArg,
				query: { type: 'object', description: 'Mongo filter selecting documents to delete' },
				permanent: { type: 'boolean', description: 'Hard-delete instead of soft delete (default false)' },
			},
			required: ['collection', 'query'],
		},
		run: async ({ collection, query, permanent }, auth) => {
			await requirePerm(auth, collection, 'D');
			return CollectionTools.deleteMany(collection, query ?? {}, { user: auth.user ?? undefined, audit: auth.audit }, { permanent: permanent === true });
		},
	},
];

const TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

/** MCP tools/list payload — derived from the registry. */
export function listToolDescriptors(): Array<{ name: string; description: string; inputSchema: Record<string, any> }> {
	return TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }));
}

/** Dispatch a tool call → MCP CallTool result ({ content, isError? }). */
export async function callTool(
	name: string,
	args: Record<string, any>,
	auth: McpAuth,
	req?: Partial<Request>
): Promise<{ content: Array<{ type: 'text'; text: string }>; isError?: boolean }> {
	const tool = TOOL_BY_NAME.get(name);
	const auditCtx = req ? extractAuditContext(req as Request) : {};
	const collection = (args?.collection as string) ?? name;

	if (!tool) {
		logAudit({
			action: 'execute', userId: auth.user?.userId, login: auth.user?.login,
			resourceType: collection, status: 'failure',
			failureReason: `Unknown MCP tool: ${name}`, details: { tool: name, args },
			...auditCtx,
		});
		return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
	}

	try {
		const result = await tool.run(args ?? {}, auth);
		logAudit({
			action: 'execute', userId: auth.user?.userId, login: auth.user?.login,
			resourceType: collection, status: 'success',
			details: { tool: name, args },
			...auditCtx,
		});
		const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
		return { content: [{ type: 'text', text }] };
	} catch (e) {
		const msg = (e as Error).message;
		const isForbidden = msg.startsWith('FORBIDDEN');
		logAudit({
			action:        isForbidden ? 'permission_denied' : 'execute',
			userId:        auth.user?.userId,
			login:         auth.user?.login,
			resourceType:  collection,
			status:        isForbidden ? 'denied' : 'failure',
			failureReason: msg,
			details:       { tool: name, args },
			...auditCtx,
		});
		return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
	}
}

// ── Schema diagnostic ────────────────────────────────────────────────────────

export interface SchemaAnalysis {
	collections: number;
	unresolvedRefs: Array<{ collection: string; fk: string; target: string }>;
}

/**
 * Lightweight FK diagnostic over the deployed model: for every fk on every
 * collection, flag references whose target collection is absent from the model.
 * (Replaces the planned schemaWalker.analyzeSchema, which does not exist.)
 */
async function analyzeSchema(): Promise<SchemaAnalysis> {
	const model = await SchemeTools.getAllSchemas();
	const known = new Set(Object.keys(model));
	const unresolvedRefs: SchemaAnalysis['unresolvedRefs'] = [];

	for (const [collection, def] of Object.entries(model)) {
		const fks = (def as any)?.fks ?? {};
		for (const [fkKey, fk] of Object.entries(fks)) {
			// FK target = the relation key (collection code it points to).
			const target = ((fk as any)?.collection as string) ?? fkKey;
			if (!known.has(target)) {
				unresolvedRefs.push({ collection, fk: fkKey, target });
			}
		}
	}

	return { collections: known.size, unresolvedRefs };
}
