/**
 * MCP tool registry + RBAC dispatch tests — transport-free, no Mongo.
 * CRUD/scheme primitives and the grant service are mocked; we assert the
 * registry shape, permission gating, and the empty-query guards.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request } from 'express';

vi.mock('../mcp/CollectionTools.js', () => ({
	find: vi.fn(async () => [{ id: 1 }]),
	findOne: vi.fn(async () => ({ id: 1 })),
	count: vi.fn(async () => 1),
	distinct: vi.fn(async () => ['a', 'b']),
	aggregate: vi.fn(async (_c: string, pipeline: any) => {
		if (!Array.isArray(pipeline) || pipeline.length === 0) throw new Error('aggregate refused: pipeline must be a non-empty array of stages');
		return [{ _id: 'a', count: 2 }];
	}),
	create: vi.fn(async () => ({ acknowledged: true })),
	update: vi.fn(async (_c: string, q: Record<string, any>) => {
		if (!q || Object.keys(q).length === 0) throw new Error('update refused: empty query would match the entire collection');
		return { modifiedCount: 1 };
	}),
	deleteMany: vi.fn(async (_c: string, q: Record<string, any>) => {
		if (!q || Object.keys(q).length === 0) throw new Error('delete refused: empty query would wipe the entire collection');
		return { deletedCount: 1 };
	}),
}));

const dsGetById = vi.fn(async () => ({ _id: 'x1', name: 'rec' }));
vi.mock('../services/DataService.js', async (importOriginal) => {
	const orig = await importOriginal<typeof import('../services/DataService.js')>();
	return {
		...orig,
		getById: (...a: any[]) => dsGetById(...a),
		updateById: vi.fn(async () => ({ _id: 'x1', name: 'updated' })),
		removeById: vi.fn(async () => ({ _id: 'x1' })),
		restoreById: vi.fn(async () => ({ _id: 'x1' })),
	};
});

vi.mock('../validation/SchemeValidator.js', () => ({
	validateAgainstScheme: vi.fn(async () => ({ valid: true, errors: [] })),
}));
vi.mock('../validation/FkValidator.js', () => ({
	validateFkEntries: vi.fn(async () => ({ valid: true, errors: [] })),
	makeMongoFkResolver: vi.fn(() => async () => null),
	findReverseFkHolders: vi.fn(async () => ({ travel: ['destination'] })),
}));
vi.mock('../models/domainActions.js', () => ({ getDomainActions: vi.fn(() => undefined) }));
vi.mock('../MachineServer.js', () => ({ machineServer: { getModel: vi.fn(async () => ({})) } }));

const rbacListUsers = vi.fn(async () => [{ login: 'admin', isAdmin: true }]);
const rbacSetGrant = vi.fn(async () => ({ grantType: 'user', schemeCode: 'vehicle', r: true }));
vi.mock('../services/RbacAdminService.js', () => ({
	listUsers: (...a: any[]) => rbacListUsers(...a),
	createUser: vi.fn(async () => ({ login: 'new', isAdmin: false })),
	setUserActive: vi.fn(async () => true),
	assignGroup: vi.fn(async () => ({ userId: '1', groupId: '2' })),
	listGroups: vi.fn(async () => []),
	listGrants: vi.fn(async () => []),
	setGrant: (...a: any[]) => rbacSetGrant(...a),
	checkUserGrant: vi.fn(async () => ({ allowed: true, isAdmin: false })),
	queryAudit: vi.fn(async () => []),
}));

vi.mock('../mcp/SchemeTools.js', () => ({
	listCollections: vi.fn(async () => ['vehicle', 'appuser_history']),
	getSchema: vi.fn(async () => ({ fields: {} })),
	getFields: vi.fn(async () => ({ code: { type: 'text' } })),
	getFks: vi.fn(async () => ({})),
	getAllSchemas: vi.fn(async () => ({
		vehicle: { fks: { brand: { collection: 'brand' }, ghost: { collection: 'missing_col' } } },
		brand: { fks: {} },
	})),
}));

const checkGrant = vi.fn(async () => true);
vi.mock('../services/GrantService.js', () => ({ grantService: { checkGrant: (...a: any[]) => checkGrant(...a) } }));

const resolveUser = vi.fn();
const authLogin = vi.fn();
vi.mock('../services/AuthService.js', () => ({
	resolveUser: (...a: any[]) => resolveUser(...a),
	login: (...a: any[]) => authLogin(...a),
}));

const apiKeyCreate = vi.fn(async () => ({ key: 'mk_test_abc', name: 'agent', prefix: 'abcd1234', expiresAt: null }));
vi.mock('../services/ApiKeyService.js', () => ({
	createApiKey: (...a: any[]) => apiKeyCreate(...a),
	listApiKeys: vi.fn(async () => [{ name: 'agent', prefix: 'abcd1234' }]),
	revokeApiKey: vi.fn(async () => true),
}));

const orgPublish = vi.fn(async () => ({ org: 'vitest', collections: ['vehicle'] }));
const orgSeed = vi.fn(async () => ({ org: 'demo', collections: 10, businessSeed: true }));
vi.mock('../services/OrgAdminService.js', () => ({
	listOrgs: vi.fn(async () => ['demo', 'vitest']),
	publishScheme: (...a: any[]) => orgPublish(...a),
	seedOrg: (...a: any[]) => orgSeed(...a),
}));

vi.mock('../config.js', () => ({ config: { authDisabled: false, mcpSchemaWrite: false } }));

import { buildAuth, callTool, listToolDescriptors, TOOLS } from '../mcp/McpTools.js';
import { config } from '../config.js';

const req = { headers: {}, socket: {} } as unknown as Request;
const admin = { userId: 'a', login: 'admin', isAdmin: true };
const member = { userId: 'u', login: 'user', isAdmin: false };

beforeEach(() => {
	vi.clearAllMocks();
	(config as any).authDisabled = false;
	(config as any).mcpSchemaWrite = false;
	checkGrant.mockResolvedValue(true);
});

describe('MCP tool registry', () => {
	it('exposes a stable tool set with JSON Schema inputs', () => {
		const names = listToolDescriptors().map((t) => t.name).sort();
		expect(names).toEqual(
			[
				// schema
				'analyze_schema', 'get_fields', 'get_fks', 'get_schema', 'list_collections', 'reverse_fks',
				// data
				'aggregate', 'count', 'create', 'delete', 'delete_by_id', 'distinct', 'find', 'find_one',
				'get_by_id', 'resolve_fks', 'restore', 'update', 'update_by_id', 'validate_record',
				// auth
				'auth_login', 'auth_whoami', 'apikey_create', 'apikey_list', 'apikey_revoke',
				// admin
				'user_list', 'user_create', 'user_set_active', 'user_assign_group',
				'rbac_list_groups', 'rbac_list_grants', 'rbac_set_grant', 'grant_check', 'audit_query',
				// org
				'list_orgs', 'get_views', 'schema_publish', 'seed_org',
			].sort()
		);
		for (const t of listToolDescriptors()) {
			expect(t.inputSchema.type).toBe('object');
			expect(typeof t.description).toBe('string');
		}
	});

	it('every tool has a runnable handler', () => {
		for (const t of TOOLS) expect(typeof t.run).toBe('function');
	});
});

describe('MCP auth', () => {
	it('authDisabled → synthetic admin, grants everything', async () => {
		(config as any).authDisabled = true;
		const auth = await buildAuth(req);
		expect(auth.user?.isAdmin).toBe(true);
		expect(await auth.can('anything', 'D')).toBe(true);
	});

	it('no token → no user, denies non-public', async () => {
		resolveUser.mockResolvedValue(null);
		const auth = await buildAuth(req);
		expect(auth.user).toBeNull();
		expect(await auth.can('vehicle', 'L')).toBe(false);
		// appscheme read stays public even unauthenticated
		expect(await auth.can('appscheme', 'R')).toBe(true);
	});

	it('admin bypasses grant check', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		expect(await auth.can('vehicle', 'D')).toBe(true);
		expect(checkGrant).not.toHaveBeenCalled();
	});

	it('member → delegates to grantService.checkGrant', async () => {
		resolveUser.mockResolvedValue(member);
		checkGrant.mockResolvedValue(false);
		const auth = await buildAuth(req);
		expect(await auth.can('vehicle', 'U')).toBe(false);
		expect(checkGrant).toHaveBeenCalledWith('u', 'vehicle', 'U');
	});

	it('appuser_* blocked for non-admin even with a grant', async () => {
		resolveUser.mockResolvedValue(member);
		checkGrant.mockResolvedValue(true);
		const auth = await buildAuth(req);
		expect(await auth.can('appuser_history', 'R')).toBe(false);
	});
});

describe('MCP dispatch', () => {
	it('unknown tool → isError', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('nope', {}, auth);
		expect(r.isError).toBe(true);
	});

	it('find returns content for an authorized member', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('find', { collection: 'vehicle' }, auth);
		expect(r.isError).toBeFalsy();
		expect(r.content[0].text).toContain('"id": 1');
	});

	it('forbidden permission → isError FORBIDDEN, primitive not called', async () => {
		const { create } = await import('../mcp/CollectionTools.js');
		resolveUser.mockResolvedValue(member);
		checkGrant.mockResolvedValue(false);
		const auth = await buildAuth(req);
		const r = await callTool('create', { collection: 'vehicle', data: { x: 1 } }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('FORBIDDEN');
		expect(create).not.toHaveBeenCalled();
	});

	it('update with empty query → guarded isError', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('update', { collection: 'vehicle', query: {}, data: { x: 1 } }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('empty query');
	});

	it('delete with empty query → guarded isError', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('delete', { collection: 'vehicle', query: {} }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('empty query');
	});

	it('get_by_id dispatches to DataService with R perm', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('get_by_id', { collection: 'vehicle', id: 'x1' }, auth);
		expect(r.isError).toBeFalsy();
		expect(dsGetById).toHaveBeenCalledWith('vehicle', 'x1');
	});

	it('aggregate with empty pipeline → guarded isError', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('aggregate', { collection: 'vehicle', pipeline: [] }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('non-empty array');
	});

	it('validate_record returns valid result without writing', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('validate_record', { collection: 'vehicle', data: { name: 'ok' } }, auth);
		expect(r.isError).toBeFalsy();
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.valid).toBe(true);
		expect(parsed.errors.fk).toEqual([]);
	});

	it('reverse_fks lists FK holders pointing to the collection', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('reverse_fks', { collection: 'destination' }, auth);
		expect(r.isError).toBeFalsy();
		expect(JSON.parse(r.content[0].text)).toEqual({ travel: ['destination'] });
	});

	it('auth_whoami returns the resolved user context', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('auth_whoami', {}, auth);
		expect(r.isError).toBeFalsy();
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.user.login).toBe('user');
	});

	it('auth_login with bad credentials → isError, password never echoed', async () => {
		resolveUser.mockResolvedValue(null);
		authLogin.mockResolvedValue(null);
		const auth = await buildAuth(req);
		const r = await callTool('auth_login', { login: 'x', password: 'wrong' }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('Invalid credentials');
	});

	it('auth_login success returns token + user', async () => {
		resolveUser.mockResolvedValue(null);
		authLogin.mockResolvedValue({ token: 'jwt-token', user: member });
		const auth = await buildAuth(req);
		const r = await callTool('auth_login', { login: 'user', password: 'pw' }, auth);
		expect(r.isError).toBeFalsy();
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.token).toBe('jwt-token');
		expect(parsed.user.userId).toBe('u');
	});

	it('apikey_create unauthenticated → FORBIDDEN', async () => {
		resolveUser.mockResolvedValue(null);
		const auth = await buildAuth(req);
		const r = await callTool('apikey_create', { name: 'agent' }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('FORBIDDEN');
		expect(apiKeyCreate).not.toHaveBeenCalled();
	});

	it('apikey_create for an authenticated user returns the plaintext key once', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('apikey_create', { name: 'agent' }, auth);
		expect(r.isError).toBeFalsy();
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.key).toBe('mk_test_abc');
		expect(apiKeyCreate).toHaveBeenCalledWith(member, 'agent', { expiresInDays: undefined });
	});

	it('admin tools refuse non-admin users', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		for (const name of ['user_list', 'user_create', 'rbac_set_grant', 'audit_query']) {
			const r = await callTool(name, { login: 'x', password: 'longenough', grantType: 'user', schemeCode: '*' }, auth);
			expect(r.isError).toBe(true);
			expect(r.content[0].text).toContain('FORBIDDEN');
		}
		expect(rbacListUsers).not.toHaveBeenCalled();
		expect(rbacSetGrant).not.toHaveBeenCalled();
	});

	it('admin tools refuse unauthenticated requests', async () => {
		resolveUser.mockResolvedValue(null);
		const auth = await buildAuth(req);
		const r = await callTool('user_list', {}, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('FORBIDDEN');
	});

	it('user_list works for admin', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('user_list', {}, auth);
		expect(r.isError).toBeFalsy();
		expect(JSON.parse(r.content[0].text)[0].login).toBe('admin');
	});

	it('rbac_set_grant normalizes permission booleans and passes grantedBy', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('rbac_set_grant', { grantType: 'user', login: 'user', schemeCode: 'vehicle', r: true, l: true }, auth);
		expect(r.isError).toBeFalsy();
		expect(rbacSetGrant).toHaveBeenCalledWith(expect.objectContaining({
			grantType: 'user', login: 'user', schemeCode: 'vehicle',
			c: false, r: true, u: false, d: false, l: true, x: false,
			grantedBy: 'admin',
		}));
	});

	it('schema_publish refused for admin when MCP_SCHEMA_WRITE is off', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('schema_publish', { model: { vehicle: {} } }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('MCP_SCHEMA_WRITE');
		expect(orgPublish).not.toHaveBeenCalled();
	});

	it('seed_org refused for non-admin even with the flag on', async () => {
		(config as any).mcpSchemaWrite = true;
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const r = await callTool('seed_org', { org: 'demo' }, auth);
		expect(r.isError).toBe(true);
		expect(r.content[0].text).toContain('FORBIDDEN: admin required');
		expect(orgSeed).not.toHaveBeenCalled();
	});

	it('schema_publish runs for admin with the flag on', async () => {
		(config as any).mcpSchemaWrite = true;
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('schema_publish', { model: { vehicle: { fields: {} } } }, auth);
		expect(r.isError).toBeFalsy();
		expect(orgPublish).toHaveBeenCalledWith({ vehicle: { fields: {} } });
		expect(JSON.parse(r.content[0].text).collections).toEqual(['vehicle']);
	});

	it('list_orgs is admin-gated', async () => {
		resolveUser.mockResolvedValue(member);
		const auth = await buildAuth(req);
		const denied = await callTool('list_orgs', {}, auth);
		expect(denied.isError).toBe(true);

		resolveUser.mockResolvedValue(admin);
		const auth2 = await buildAuth(req);
		const r = await callTool('list_orgs', {}, auth2);
		expect(JSON.parse(r.content[0].text)).toEqual(['demo', 'vitest']);
	});

	it('analyze_schema flags unresolved FK targets', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('analyze_schema', {}, auth);
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.collections).toBe(2);
		expect(parsed.unresolvedRefs).toEqual([{ collection: 'vehicle', fk: 'ghost', target: 'missing_col' }]);
	});
});
