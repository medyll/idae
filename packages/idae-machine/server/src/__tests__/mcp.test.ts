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
vi.mock('../services/AuthService.js', () => ({ resolveUser: (...a: any[]) => resolveUser(...a) }));

vi.mock('../config.js', () => ({ config: { authDisabled: false } }));

import { buildAuth, callTool, listToolDescriptors, TOOLS } from '../mcp/McpTools.js';
import { config } from '../config.js';

const req = { headers: {}, socket: {} } as unknown as Request;
const admin = { userId: 'a', login: 'admin', isAdmin: true };
const member = { userId: 'u', login: 'user', isAdmin: false };

beforeEach(() => {
	vi.clearAllMocks();
	(config as any).authDisabled = false;
	checkGrant.mockResolvedValue(true);
});

describe('MCP tool registry', () => {
	it('exposes a stable tool set with JSON Schema inputs', () => {
		const names = listToolDescriptors().map((t) => t.name).sort();
		expect(names).toEqual(
			['analyze_schema', 'count', 'create', 'delete', 'find', 'find_one', 'get_fields', 'get_fks', 'get_schema', 'list_collections', 'update'].sort()
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

	it('analyze_schema flags unresolved FK targets', async () => {
		resolveUser.mockResolvedValue(admin);
		const auth = await buildAuth(req);
		const r = await callTool('analyze_schema', {}, auth);
		const parsed = JSON.parse(r.content[0].text);
		expect(parsed.collections).toBe(2);
		expect(parsed.unresolvedRefs).toEqual([{ collection: 'vehicle', fk: 'ghost', target: 'missing_col' }]);
	});
});
