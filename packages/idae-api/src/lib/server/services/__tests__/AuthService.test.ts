import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../AuthService.js';
import type { UserValidatorFn } from '../AuthService.js';
import type { Request, Response } from 'express';

const JWT_SECRET = 'test-secret-key';
const EXPIRATION = '1h';

function mockRes() {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	} as unknown as Response;
	return res;
}

function mockReq(body: object = {}): Request {
	return { body } as Request;
}

describe('AuthService', () => {
	describe('constructor', () => {
		it('accepts no validateUser — login returns 501', async () => {
			const svc = new AuthService(JWT_SECRET, EXPIRATION);
			const res = mockRes();
			// Access private method via cast
			await (svc as any).handleLogin(mockReq({ username: 'admin', password: 'password' }), res);
			expect(res.status).toHaveBeenCalledWith(501);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ error: expect.stringContaining('not implemented') })
			);
		});
	});

	describe('hardcoded credentials must not work', () => {
		it('rejects admin/password when validateUser always returns false', async () => {
			const neverValid: UserValidatorFn = () => false;
			const svc = new AuthService(JWT_SECRET, EXPIRATION, neverValid);
			const res = mockRes();
			await (svc as any).handleLogin(mockReq({ username: 'admin', password: 'password' }), res);
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('rejects admin/password with no validator (501)', async () => {
			const svc = new AuthService(JWT_SECRET, EXPIRATION);
			const res = mockRes();
			await (svc as any).handleLogin(mockReq({ username: 'admin', password: 'password' }), res);
			expect(res.status).not.toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledWith(501);
		});
	});

	describe('handleLogin with custom validator', () => {
		it('returns a token when validator approves', async () => {
			const alwaysValid: UserValidatorFn = () => true;
			const svc = new AuthService(JWT_SECRET, EXPIRATION, alwaysValid);
			const res = mockRes();
			await (svc as any).handleLogin(mockReq({ username: 'bob', password: 'secure123' }), res);
			expect(res.json).toHaveBeenCalledWith(
				expect.objectContaining({ token: expect.any(String) })
			);
		});

		it('returns 401 when validator rejects', async () => {
			const neverValid: UserValidatorFn = () => false;
			const svc = new AuthService(JWT_SECRET, EXPIRATION, neverValid);
			const res = mockRes();
			await (svc as any).handleLogin(mockReq({ username: 'bob', password: 'wrong' }), res);
			expect(res.status).toHaveBeenCalledWith(401);
		});

		it('returns 400 when body is missing credentials', async () => {
			const svc = new AuthService(JWT_SECRET, EXPIRATION, () => true);
			const res = mockRes();
			await (svc as any).handleLogin(mockReq({}), res);
			expect(res.status).toHaveBeenCalledWith(400);
		});
	});

	describe('generateToken / verifyToken', () => {
		it('round-trips a payload correctly', () => {
			const svc = new AuthService(JWT_SECRET, EXPIRATION);
			const payload = { username: 'alice', role: 'admin' };
			const token = svc.generateToken(payload);
			const decoded = svc.verifyToken(token) as any;
			expect(decoded.username).toBe('alice');
			expect(decoded.role).toBe('admin');
		});

		it('throws on invalid token', () => {
			const svc = new AuthService(JWT_SECRET, EXPIRATION);
			expect(() => svc.verifyToken('not.a.token')).toThrow('Invalid token');
		});
	});
});
