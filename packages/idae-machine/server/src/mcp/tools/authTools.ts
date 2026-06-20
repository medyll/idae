/**
 * MCP auth tools — login, identity introspection, and long-lived API keys.
 *
 * `auth_login` issues a short-lived JWT (same as REST /api/auth/login);
 * `apikey_create` issues a long-lived key (`mk_<org>_<secret>`) bound to the
 * calling user — RBAC scope is the user's grants, the plaintext is returned
 * exactly once. Both token kinds are accepted as Bearer on REST and MCP.
 */

import { login } from '../../services/AuthService.js';
import { createApiKey, listApiKeys, revokeApiKey } from '../../services/ApiKeyService.js';
import { logAudit } from '../../services/AuditService.js';
import { config } from '../../config.js';
import { type McpToolDef, requireUser } from '../types.js';

export const authTools: McpToolDef[] = [
	{
		name: 'auth_login',
		description:
			'Authenticate with login + password. Returns a JWT Bearer token and the user context. Pass the token in the Authorization header of subsequent MCP requests.',
		inputSchema: {
			type: 'object',
			properties: {
				login: { type: 'string', description: 'User login' },
				password: { type: 'string', description: 'User password' },
			},
			required: ['login', 'password'],
		},
		run: async ({ login: loginName, password }, auth) => {
			if (!loginName || !password) throw new Error('login and password are required');

			const result = await login(loginName, password);

			if (!result) {
				logAudit({
					action: 'login_failed', login: loginName,
					resourceType: 'auth', status: 'failure',
					failureReason: 'Invalid credentials (MCP)',
					...auth.audit,
				});
				throw new Error('Invalid credentials');
			}

			logAudit({
				action: 'login', userId: result.user.userId, login: result.user.login,
				resourceType: 'auth', status: 'success', details: { via: 'mcp' },
				...auth.audit,
			});

			return result;
		},
	},
	{
		name: 'auth_whoami',
		description: 'Return the authenticated user context for the current request (or null when unauthenticated).',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => ({
			user: auth.user,
			authDisabled: config.authDisabled,
			tokenKind: auth.user ? (config.authDisabled ? 'disabled' : 'bearer') : null,
		}),
	},
	{
		name: 'apikey_create',
		description:
			'Create a long-lived API key bound to the authenticated user (RBAC scope = the user\'s grants). The plaintext key is returned ONCE — store it securely. Use it as a Bearer token on REST and MCP.',
		inputSchema: {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Human label for the key (e.g. "ci-agent")' },
				expiresInDays: { type: 'number', description: 'Optional expiry in days (default: never expires)' },
			},
			required: ['name'],
		},
		run: async ({ name, expiresInDays }, auth) => {
			const user = requireUser(auth);
			const result = await createApiKey(user, name, { expiresInDays });

			logAudit({
				action: 'create', userId: user.userId, login: user.login,
				resourceType: 'appuser_apikey', resourceId: result.prefix,
				status: 'success', details: { name: result.name, expiresAt: result.expiresAt },
				...auth.audit,
			});

			return result;
		},
	},
	{
		name: 'apikey_list',
		description: 'List the authenticated user\'s API keys (metadata only — never the secret).',
		inputSchema: { type: 'object', properties: {} },
		run: async (_args, auth) => {
			const user = requireUser(auth);
			return listApiKeys(user.userId);
		},
	},
	{
		name: 'apikey_revoke',
		description: 'Revoke an API key by its prefix. Non-admin users can only revoke their own keys.',
		inputSchema: {
			type: 'object',
			properties: { prefix: { type: 'string', description: 'Key prefix (from apikey_list / apikey_create)' } },
			required: ['prefix'],
		},
		run: async ({ prefix }, auth) => {
			const user = requireUser(auth);
			if (!prefix) throw new Error('prefix is required');

			const revoked = await revokeApiKey(user, prefix);

			logAudit({
				action: 'delete', userId: user.userId, login: user.login,
				resourceType: 'appuser_apikey', resourceId: prefix,
				status: revoked ? 'success' : 'failure',
				...(revoked ? {} : { failureReason: 'Key not found or not owned by caller' }),
				...auth.audit,
			});

			return { revoked, prefix };
		},
	},
];
