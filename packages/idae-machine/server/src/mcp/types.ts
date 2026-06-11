/**
 * MCP shared types — auth context and tool definition shape.
 *
 * Lives apart from McpTools.ts so per-domain tool modules (mcp/tools/*.ts) can
 * import the contract without a circular dependency on the registry.
 */

import type { Permission, UserContext } from '../middleware/permission.js';

export interface McpAuth {
	user: UserContext | null;
	/** Request audit context (IP/user-agent) — forwarded to DataService for create/update/delete. */
	audit: { ipAddress?: string; userAgent?: string };
	/** True when the (collection, permission) pair is granted for this request. */
	can(collection: string, perm: Permission): Promise<boolean>;
}

export interface McpToolDef {
	name: string;
	description: string;
	inputSchema: Record<string, any>;
	run(args: Record<string, any>, auth: McpAuth): Promise<unknown>;
}

/** Throw a FORBIDDEN error if the permission is not granted. Tools call this first. */
export async function requirePerm(auth: McpAuth, collection: string, perm: Permission): Promise<void> {
	if (!(await auth.can(collection, perm))) {
		throw new Error(`FORBIDDEN: ${perm} on ${collection}`);
	}
}

/** Throw a FORBIDDEN error if the request carries no authenticated user. */
export function requireUser(auth: McpAuth): UserContext {
	if (!auth.user) throw new Error('FORBIDDEN: authentication required');
	return auth.user;
}

/** Throw a FORBIDDEN error unless the authenticated user is an admin. */
export function requireAdmin(auth: McpAuth): UserContext {
	const user = requireUser(auth);
	if (!user.isAdmin) throw new Error('FORBIDDEN: admin required');
	return user;
}

export const collectionArg = { collection: { type: 'string', description: 'Collection code' } };
