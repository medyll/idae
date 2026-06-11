/**
 * MCP admin tools — user management, RBAC grants, audit trail. Admin-only.
 *
 * These bypass the generic collection tools on purpose: they hash passwords,
 * resolve holders by login/group code, upsert grants on their identity key,
 * and invalidate the GrantService cache — none of which a raw appuser_* write
 * would do.
 */

import * as RbacAdmin from '../../services/RbacAdminService.js';
import { logAudit } from '../../services/AuditService.js';
import { type McpToolDef, requireAdmin } from '../types.js';

const PERMS = ['C', 'R', 'U', 'D', 'L', 'X'] as const;

export const adminTools: McpToolDef[] = [
	{
		name: 'user_list',
		description: 'List users of the current org (login, email, active/locked, admin flag). Admin only. Password hashes are never returned.',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => {
			requireAdmin(auth);
			return RbacAdmin.listUsers();
		},
	},
	{
		name: 'user_create',
		description: 'Create a user (password ≥ 8 chars, bcrypt-hashed). Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'Unique login' },
				password: { type: 'string', description: 'Initial password (min 8 chars)' },
				email: { type: 'string', description: 'Optional email' },
				isAdmin: { type: 'boolean', description: 'Grant the ADMIN flag (default false)' },
			},
			required: ['login', 'password'],
		},
		run: async ({ login, password, email, isAdmin }, auth) => {
			const admin = requireAdmin(auth);
			const user = await RbacAdmin.createUser({ login, password, email, isAdmin });
			logAudit({
				action: 'create', userId: admin.userId, login: admin.login,
				resourceType: 'appuser', resourceId: user.login,
				status: 'success', details: { isAdmin: user.isAdmin, via: 'mcp' },
				...auth.audit,
			});
			return user;
		},
	},
	{
		name: 'user_set_active',
		description: 'Enable or disable a user. Disabling immediately kills the user\'s API keys and denies new logins. Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'User login' },
				isActive: { type: 'boolean', description: 'true = enable, false = disable' },
			},
			required: ['login', 'isActive'],
		},
		run: async ({ login, isActive }, auth) => {
			const admin = requireAdmin(auth);
			const changed = await RbacAdmin.setUserActive(login, isActive === true);
			logAudit({
				action: 'update', userId: admin.userId, login: admin.login,
				resourceType: 'appuser', resourceId: login,
				status: 'success', details: { isActive: isActive === true, via: 'mcp' },
				...auth.audit,
			});
			return { login, isActive: isActive === true, changed };
		},
	},
	{
		name: 'user_assign_group',
		description: 'Assign a user to a group (grant cascade applies on next check). Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'User login' },
				groupCode: { type: 'string', description: 'Group code (see rbac_list_groups)' },
			},
			required: ['login', 'groupCode'],
		},
		run: async ({ login, groupCode }, auth) => {
			const admin = requireAdmin(auth);
			const result = await RbacAdmin.assignGroup(login, groupCode);
			logAudit({
				action: 'update', userId: admin.userId, login: admin.login,
				resourceType: 'appuser_assignment', resourceId: `${login}→${groupCode}`,
				status: 'success', details: { via: 'mcp' },
				...auth.audit,
			});
			return { login, groupCode, ...result };
		},
	},
	{
		name: 'rbac_list_groups',
		description: 'List groups with their grants. Admin only.',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => {
			requireAdmin(auth);
			return RbacAdmin.listGroups();
		},
	},
	{
		name: 'rbac_list_grants',
		description: 'List grants — all, or filtered by user login or group code. Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'Filter: direct grants of this user' },
				groupCode: { type: 'string', description: 'Filter: grants of this group' },
			},
		},
		run: async ({ login, groupCode }, auth) => {
			requireAdmin(auth);
			return RbacAdmin.listGrants({ login, groupCode });
		},
	},
	{
		name: 'rbac_set_grant',
		description:
			'Create or replace a grant (upsert on grantType + holder + schemeCode). schemeCode "*" = all collections. Flushes the grant cache. Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				grantType: { type: 'string', enum: ['user', 'group'], description: 'Grant holder kind' },
				login: { type: 'string', description: "User login (grantType 'user')" },
				groupCode: { type: 'string', description: "Group code (grantType 'group')" },
				schemeCode: { type: 'string', description: "Collection code or '*'" },
				c: { type: 'boolean' }, r: { type: 'boolean' }, u: { type: 'boolean' },
				d: { type: 'boolean' }, l: { type: 'boolean' }, x: { type: 'boolean' },
				constraints: { type: 'object', description: 'Optional constraints (territory, maxAmount, departments, businessUnits…)' },
			},
			required: ['grantType', 'schemeCode'],
		},
		run: async ({ grantType, login, groupCode, schemeCode, c, r, u, d, l, x, constraints }, auth) => {
			const admin = requireAdmin(auth);
			const grant = await RbacAdmin.setGrant({
				grantType, login, groupCode, schemeCode,
				c: c === true, r: r === true, u: u === true,
				d: d === true, l: l === true, x: x === true,
				constraints, grantedBy: admin.login,
			});
			logAudit({
				action: 'update', userId: admin.userId, login: admin.login,
				resourceType: 'appuser_grant', resourceId: `${grantType}:${login ?? groupCode}:${schemeCode}`,
				status: 'success', details: { grant, via: 'mcp' },
				...auth.audit,
			});
			return grant;
		},
	},
	{
		name: 'grant_check',
		description:
			"Resolve a user's effective access (direct + group + type cascade, constraints merged) for one collection and permission (C/R/U/D/L/X). Admin only.",
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'User login' },
				collection: { type: 'string', description: 'Collection code' },
				permission: { type: 'string', enum: [...PERMS], description: 'Permission to check' },
			},
			required: ['login', 'collection', 'permission'],
		},
		run: async ({ login, collection, permission }, auth) => {
			requireAdmin(auth);
			if (!PERMS.includes(permission)) throw new Error(`Invalid permission '${permission}' (${PERMS.join('/')})`);
			return RbacAdmin.checkUserGrant(login, collection, permission);
		},
	},
	{
		name: 'audit_query',
		description:
			'Query the audit trail (newest first). Filters: action, login, resourceType, status, since (ISO date). Limit default 100, max 1000. Admin only.',
		inputSchema: {
			type: 'object',
			properties: {
				action: { type: 'string', description: 'e.g. login, create, update, delete, execute, permission_denied' },
				login: { type: 'string' },
				resourceType: { type: 'string', description: 'Collection / resource' },
				status: { type: 'string', enum: ['success', 'failure', 'denied'] },
				since: { type: 'string', description: 'ISO date lower bound' },
				limit: { type: 'number', description: 'Max entries (default 100, max 1000)' },
			},
		},
		run: async (args, auth) => {
			requireAdmin(auth);
			return RbacAdmin.queryAudit(args as RbacAdmin.AuditQuery);
		},
	},
];
