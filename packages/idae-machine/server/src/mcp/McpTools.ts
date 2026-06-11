/**
 * McpTools — MCP auth context, tool registry composition, and dispatch.
 *
 * Pure-ish wiring: depends only on services (auth/rbac) and the per-domain tool
 * modules (mcp/tools/*.ts), never on the HTTP transport. McpServer.ts consumes
 * this to register handlers on the SDK Server. Kept transport-free so it is
 * unit-testable.
 *
 * RBAC reuses AuthService.resolveUser (JWT or API key Bearer) +
 * GrantService.checkGrant — no logic duplication. appuser_* is blocked unless
 * admin; appscheme read is public.
 */

import type { Request } from 'express';
import { config } from '../config.js';
import { resolveUser } from '../services/AuthService.js';
import { grantService } from '../services/GrantService.js';
import { logAudit, extractAuditContext } from '../services/AuditService.js';
import { type McpAuth, type McpToolDef, requirePerm } from './types.js';
import { schemaTools, analyzeSchema, type SchemaAnalysis } from './tools/schemaTools.js';
import { dataTools } from './tools/dataTools.js';
import { authTools } from './tools/authTools.js';

export { requirePerm, analyzeSchema };
export type { McpAuth, McpToolDef, SchemaAnalysis };

// ── Auth context ────────────────────────────────────────────────────────────

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

// ── Tool registry (composed from per-domain modules) ────────────────────────

export const TOOLS: McpToolDef[] = [...schemaTools, ...dataTools, ...authTools];

const TOOL_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

/** MCP tools/list payload — derived from the registry. */
export function listToolDescriptors(): Array<{ name: string; description: string; inputSchema: Record<string, any> }> {
	return TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }));
}

/** Args whose values must never reach the audit log. */
const SENSITIVE_ARGS = new Set(['password']);

function redactArgs(args: Record<string, any> | undefined): Record<string, any> {
	if (!args) return {};
	const out: Record<string, any> = {};
	for (const [k, v] of Object.entries(args)) {
		out[k] = SENSITIVE_ARGS.has(k) ? '[redacted]' : v;
	}
	return out;
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
	const safeArgs = redactArgs(args);

	if (!tool) {
		logAudit({
			action: 'execute', userId: auth.user?.userId, login: auth.user?.login,
			resourceType: collection, status: 'failure',
			failureReason: `Unknown MCP tool: ${name}`, details: { tool: name, args: safeArgs },
			...auditCtx,
		});
		return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
	}

	try {
		const result = await tool.run(args ?? {}, auth);
		logAudit({
			action: 'execute', userId: auth.user?.userId, login: auth.user?.login,
			resourceType: collection, status: 'success',
			details: { tool: name, args: safeArgs },
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
			details:       { tool: name, args: safeArgs },
			...auditCtx,
		});
		return { content: [{ type: 'text', text: `Error: ${msg}` }], isError: true };
	}
}
