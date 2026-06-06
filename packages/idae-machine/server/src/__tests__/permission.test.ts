import { describe, it, expect, vi, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import { checkPermission, requireDroit } from '../middleware/permission.js';
import { grantService } from '../services/GrantService.js';
import * as AuthService from '../services/AuthService.js';
import { createRecord, listRecords } from '../routes/data.js';
import type { Request, Response, NextFunction } from 'express';

const TEST_ORG   = 'vitest';
const TEST_TABLE = 'perm_test_col';
const TEST_BASE  = 'machine_base';
const META_DB    = `${TEST_ORG}_machine_app`;
const DATA_DB    = `${TEST_ORG}_${TEST_BASE}`;

function mockRes(): any {
	const res: any = { _status: 200 };
	res.json   = (b: any) => { res._body = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	return res;
}

function mockReq(opts: { params?: any; query?: any; body?: any; headers?: any } = {}): Request {
	return {
		params:    opts.params  ?? {},
		query:     opts.query   ?? {},
		body:      opts.body    ?? {},
		headers:   opts.headers ?? {},
		socket:    { remoteAddress: '127.0.0.1' } as any,
	} as unknown as Request;
}

function withAuth(headers: any = {}): any {
	return { ...headers, authorization: 'Bearer valid-token' };
}

function getTestCol() {
	const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
	const schema = new Schema({}, { strict: false, collection: TEST_TABLE });
	const name = `${DATA_DB}__${TEST_TABLE}`;
	return db.models[name] ?? db.model(name, schema, TEST_TABLE);
}

describe('Permission Middleware', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').updateOne(
			{ code: TEST_TABLE },
			{ $set: { code: TEST_TABLE, base: TEST_BASE } },
			{ upsert: true }
		);
	});

	afterAll(async () => {
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').deleteOne({ code: TEST_TABLE });
		const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
		await db.collection(TEST_TABLE).drop().catch(() => {});
		await mongoose.disconnect();
	});

	afterEach(async () => {
		await getTestCol().deleteMany({});
		vi.restoreAllMocks();
	});

	beforeEach(() => {
		vi.spyOn(AuthService, 'resolveUser').mockResolvedValue({
			userId: 'test-user-1',
			login: 'testuser',
			isAdmin: false,
		});
	});

	describe('checkPermission handler', () => {
		it('returns allowed for authenticated user', async () => {
			vi.spyOn(grantService, 'checkGrant').mockResolvedValueOnce(true);
			const req = mockReq({ headers: withAuth(), query: { permission: 'R', table: 'product' } });
			const res = mockRes();
			await checkPermission(req, res);
			expect(res._status).toBe(200);
			expect(res._body).toHaveProperty('allowed');
			expect(res._body).toHaveProperty('permission', 'R');
		});

		it('returns 400 when permission param missing', async () => {
			const req = mockReq({ headers: withAuth(), query: {} });
			const res = mockRes();
			await checkPermission(req, res);
			expect(res._status).toBe(400);
		});

		it('returns allowed:false without auth', async () => {
			const req = mockReq({ query: { permission: 'R', table: 'product' } });
			const res = mockRes();
			await checkPermission(req, res);
			expect(res._body.allowed).toBe(false);
		});
	});

	describe('requireDroit middleware', () => {
		// server/.env sets AUTH_DISABLED=true (dev) → synthetic-admin bypass.
		// These tests exercise the real auth/grant path, so force it on.
		const prevAuthDisabled = config.authDisabled;
		beforeEach(() => { (config as any).authDisabled = false; });
		afterEach(() => { (config as any).authDisabled = prevAuthDisabled; });

		it('calls next() when user has permission', async () => {
			vi.spyOn(grantService, 'resolveAccess').mockResolvedValueOnce({ allowed: true, permission: 'R', constraints: null } as any);
			const next: NextFunction = vi.fn();
			const req = mockReq({ headers: withAuth(), params: { table: TEST_TABLE } });
			const res = mockRes();
			await requireDroit('R')(req, res, next);
			expect(next).toHaveBeenCalled();
			expect(res._status).toBe(200);
		});

		it('returns 401 when no auth header', async () => {
			vi.spyOn(AuthService, 'resolveUser').mockResolvedValue(null);
			const next: NextFunction = vi.fn();
			const req = mockReq({ params: { table: TEST_TABLE } });
			const res = mockRes();
			await requireDroit('R')(req, res, next);
			expect(next).not.toHaveBeenCalled();
			expect(res._status).toBe(401);
		});

		it('returns 403 when permission denied', async () => {
			vi.spyOn(grantService, 'resolveAccess').mockResolvedValueOnce({ allowed: false, permission: 'R', constraints: null } as any);
			const next: NextFunction = vi.fn();
			const req = mockReq({ headers: withAuth(), params: { table: TEST_TABLE } });
			const res = mockRes();
			await requireDroit('R')(req, res, next);
			expect(next).not.toHaveBeenCalled();
			expect(res._status).toBe(403);
		});
	});

	describe('CRUD with permission guard', () => {
		it('creates a record when authorized', async () => {
			const req = mockReq({ headers: withAuth(), params: { table: TEST_TABLE }, body: { name: 'Perm Test' } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
			expect(res._body.name).toBe('Perm Test');
		});

		it('lists records when authorized', async () => {
			await getTestCol().insertMany([{ name: 'A' }, { name: 'B' }]);
			const req = mockReq({ headers: withAuth(), params: { table: TEST_TABLE }, query: {} });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.meta.total).toBe(2);
		});
	});
});
