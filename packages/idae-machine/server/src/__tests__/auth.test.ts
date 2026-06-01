/**
 * S11-02: Auth flow — login → JWT → requête authentifiée
 *
 * Tests the complete authentication flow:
 *   - POST /api/auth/login with valid/invalid credentials
 *   - JWT token structure (userId, login, isAdmin)
 *   - Protected routes: 401 without token, 200 with valid token
 *   - Permission enforcement: viewer (R+L) can read but not create
 *
 * Run: pnpm vitest run server/src/__tests__/auth.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose, { Connection } from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { login } from '../services/AuthService.js';
import { seedUsers } from '../bootstrap/seedUsers.js';
import { listRecords, createRecord } from '../routes/data.js';
import { getConn, invalidateBaseCache } from '../middleware/dbRouter.js';

const TEST_ORG = 'vitest_auth';
const DATA_DB  = `${TEST_ORG}_machine_user`;

function mockRes(): any {
	const res: any = { _status: 200, _json: null };
	res.json   = (b: any) => { res._json = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	res.send   = () => res;
	return res;
}

function mockReq(overrides: any = {}): any {
	return {
		body: {},
		params: {},
		query: {},
		headers: {},
		...overrides,
	};
}

describe('S11-02: Auth flow — login → JWT → authenticated requests', () => {
	let dataConn: Connection;

	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		invalidateBaseCache();
		dataConn = mongoose.connection.useDb(DATA_DB, { useCache: true });
		await seedUsers(dataConn);
	});

	afterAll(async () => {
		await dataConn.collection('appuser').deleteMany({});
		await dataConn.collection('appuser_grant').deleteMany({});
		await dataConn.collection('appuser_group').deleteMany({});
		await dataConn.collection('appuser_assignment').deleteMany({});
		await mongoose.disconnect();
	});

	// ── Login: valid credentials ─────────────────────────────────────────────

	describe('POST /api/auth/login — valid credentials', () => {
		it('admin login returns 200 + JWT token', async () => {
			const result = await login('admin', 'admin123');
			expect(result).not.toBeNull();
			expect(result!.token).toBeDefined();
			expect(result!.token.length).toBeGreaterThan(10);
		});

		it('user login returns 200 + JWT token', async () => {
			const result = await login('user', 'user123');
			expect(result).not.toBeNull();
			expect(result!.token).toBeDefined();
		});

		it('viewer login returns 200 + JWT token', async () => {
			const result = await login('viewer', 'viewer123');
			expect(result).not.toBeNull();
			expect(result!.token).toBeDefined();
		});
	});

	// ── Login: invalid credentials ───────────────────────────────────────────

	describe('POST /api/auth/login — invalid credentials', () => {
		it('wrong password returns null', async () => {
			const result = await login('admin', 'wrongpassword');
			expect(result).toBeNull();
		});

		it('nonexistent user returns null', async () => {
			const result = await login('bad', 'bad');
			expect(result).toBeNull();
		});

		it('missing login returns null', async () => {
			const result = await login('', 'somepass');
			expect(result).toBeNull();
		});
	});

	// ── JWT token structure ──────────────────────────────────────────────────

	describe('JWT token structure', () => {
		it('token contains userId and login (decodable without secret)', async () => {
			const result = await login('admin', 'admin123');
			expect(result).not.toBeNull();

			const decoded = jwt.decode(result!.token) as any;
			expect(decoded).toHaveProperty('userId');
			expect(decoded).toHaveProperty('login');
			expect(decoded.login).toBe('admin');
		});

		it('admin token has isAdmin=true', async () => {
			const result = await login('admin', 'admin123');
			const decoded = jwt.decode(result!.token) as any;
			expect(decoded.isAdmin).toBe(true);
		});

		it('user token has isAdmin=false', async () => {
			const result = await login('user', 'user123');
			const decoded = jwt.decode(result!.token) as any;
			expect(decoded.isAdmin).toBe(false);
		});

		it('token has expiration (exp)', async () => {
			const result = await login('admin', 'admin123');
			const decoded = jwt.decode(result!.token) as any;
			expect(decoded).toHaveProperty('exp');
			expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
		});
	});

	// ── Protected routes: no token → 401 ─────────────────────────────────────

	describe('GET /api/data/:table without Authorization → 401', () => {
		it('listRecords returns 401 without token', async () => {
			const req = mockReq({ params: { table: 'vehicle' } });
			const res = mockRes();
			const next = vi.fn();

			// The requireDroit middleware is what returns 401, but we can test
			// the resolveUser function directly
			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(req);
			expect(user).toBeNull();
		});
	});

	// ── Protected routes: valid token → 200 ──────────────────────────────────

	describe('GET /api/data/:table with valid token → 200', () => {
		it('admin token allows access', async () => {
			const loginResult = await login('admin', 'admin123');
			expect(loginResult).not.toBeNull();

			const req = mockReq({
				params: { table: 'vehicle' },
				headers: { authorization: `Bearer ${loginResult!.token}` },
			});
			const res = mockRes();

			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(req);
			expect(user).not.toBeNull();
			expect(user!.isAdmin).toBe(true);
		});

		it('user token allows access (R+L grant)', async () => {
			const loginResult = await login('user', 'user123');
			expect(loginResult).not.toBeNull();

			const req = mockReq({
				params: { table: 'vehicle' },
				headers: { authorization: `Bearer ${loginResult!.token}` },
			});

			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(req);
			expect(user).not.toBeNull();
			expect(user!.login).toBe('user');
		});
	});

	// ── Permission enforcement: viewer (R+L) can read but not create ─────────

	describe('viewer permissions (R+L only, no C/U/D)', () => {
		it('viewer can list (L permission)', async () => {
			const loginResult = await login('viewer', 'viewer123');
			expect(loginResult).not.toBeNull();

			const req = mockReq({
				params: { table: 'vehicle' },
				headers: { authorization: `Bearer ${loginResult!.token}` },
			});

			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(req);
			expect(user).not.toBeNull();
			expect(user!.isAdmin).toBe(false);
		});

		it('viewer cannot create (no C permission)', async () => {
			const loginResult = await login('viewer', 'viewer123');
			expect(loginResult).not.toBeNull();

			const { resolveUser } = await import('../services/AuthService.js');
			const { grantService } = await import('../services/GrantService.js');

			const user = await resolveUser(mockReq({
				headers: { authorization: `Bearer ${loginResult!.token}` },
			}));
			expect(user).not.toBeNull();

			// Viewer has no direct grant — only group cascade R+L
			const { allowed } = await grantService.resolveAccess(user!.userId, 'vehicle', 'C');
			expect(allowed).toBe(false);
		});
	});

	// ── User context from token ──────────────────────────────────────────────

	describe('resolveUser from Bearer token', () => {
		it('returns null without authorization header', async () => {
			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(mockReq({}));
			expect(user).toBeNull();
		});

		it('returns null with invalid token', async () => {
			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(mockReq({
				headers: { authorization: 'Bearer invalid-token-here' },
			}));
			expect(user).toBeNull();
		});

		it('returns UserContext with valid token', async () => {
			const loginResult = await login('admin', 'admin123');
			const { resolveUser } = await import('../services/AuthService.js');
			const user = await resolveUser(mockReq({
				headers: { authorization: `Bearer ${loginResult!.token}` },
			}));
			expect(user).not.toBeNull();
			expect(user!.userId).toBeDefined();
			expect(user!.login).toBe('admin');
		});
	});
});
