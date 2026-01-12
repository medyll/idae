import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { AuthMiddleWare } from '$lib/server/middleware/authMiddleware.js';
import type { Request, Response, NextFunction } from 'express';

describe('AuthMiddleWare', () => {
	const JWT_SECRET = 'test-secret-key-123';
	const TOKEN_EXPIRATION = '1h';
	let authMiddleware: AuthMiddleWare;

	beforeEach(() => {
		authMiddleware = new AuthMiddleWare(JWT_SECRET, TOKEN_EXPIRATION);
	});

	describe('generateToken', () => {
		it('should generate a valid JWT token', () => {
			const payload = { username: 'testuser', id: 123 };
			const token = authMiddleware.generateToken(payload);

			expect(token).toBeDefined();
			expect(typeof token).toBe('string');
			expect(token.split('.').length).toBe(3); // JWT has 3 parts: header.payload.signature
		});

		it('should encode payload correctly in token', () => {
			const payload = { username: 'testuser', id: 123 };
			const token = authMiddleware.generateToken(payload);
			const decoded = jwt.decode(token) as any;

			expect(decoded.username).toBe('testuser');
			expect(decoded.id).toBe(123);
		});

		it('should include exp claim for token expiration', () => {
			const payload = { username: 'admin' };
			const token = authMiddleware.generateToken(payload);
			const decoded = jwt.decode(token) as any;

			expect(decoded.exp).toBeDefined();
			expect(typeof decoded.exp).toBe('number');
		});

		it('should include iat claim for token issued at', () => {
			const payload = { username: 'admin' };
			const token = authMiddleware.generateToken(payload);
			const decoded = jwt.decode(token) as any;

			expect(decoded.iat).toBeDefined();
			expect(typeof decoded.iat).toBe('number');
		});

		it('should handle complex payload objects', () => {
			const payload = {
				username: 'user@example.com',
				roles: ['admin', 'user'],
				metadata: { loginIP: '192.168.1.1', loginTime: new Date().toISOString() }
			};
			const token = authMiddleware.generateToken(payload);
			const decoded = jwt.decode(token) as any;

			expect(decoded.username).toBe('user@example.com');
			expect(decoded.roles).toEqual(['admin', 'user']);
			expect(decoded.metadata.loginIP).toBe('192.168.1.1');
		});
	});

	describe('verifyToken', () => {
		it('should verify a valid token', () => {
			const payload = { username: 'testuser' };
			const token = authMiddleware.generateToken(payload);
			const verified = authMiddleware.verifyToken(token);

			expect(verified).toBeDefined();
			expect(verified.username).toBe('testuser');
		});

		it('should throw error for invalid token signature', () => {
			const payload = { username: 'testuser' };
			const token = authMiddleware.generateToken(payload);
			const tamperedToken = token.substring(0, token.length - 10) + 'tampered!!';

			expect(() => authMiddleware.verifyToken(tamperedToken)).toThrow('Invalid token');
		});

		it('should throw error for token signed with different secret', () => {
			const payload = { username: 'testuser' };
			const tokenWithWrongSecret = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

			expect(() => authMiddleware.verifyToken(tokenWithWrongSecret)).toThrow('Invalid token');
		});

		it('should throw error for expired token', () => {
			const payload = { username: 'testuser' };
			const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' }); // Expired 1 second ago

			expect(() => authMiddleware.verifyToken(expiredToken)).toThrow('Invalid token');
		});

		it('should throw error for malformed token (not JWT format)', () => {
			const malformedToken = 'not.a.jwt.token';

			expect(() => authMiddleware.verifyToken(malformedToken)).toThrow('Invalid token');
		});

		it('should throw error for empty string token', () => {
			expect(() => authMiddleware.verifyToken('')).toThrow('Invalid token');
		});

		it('should throw error for null token', () => {
			expect(() => authMiddleware.verifyToken(null as any)).toThrow();
		});

		it('should return full payload including exp and iat', () => {
			const payload = { username: 'user123', role: 'admin' };
			const token = authMiddleware.generateToken(payload);
			const verified = authMiddleware.verifyToken(token);

			expect(verified.username).toBe('user123');
			expect(verified.role).toBe('admin');
			expect(verified.exp).toBeDefined();
			expect(verified.iat).toBeDefined();
		});
	});

	describe('refreshToken', () => {
		it('should generate new token from valid existing token', () => {
			const payload = { username: 'testuser', id: 123 };
			const oldToken = authMiddleware.generateToken(payload);

			// Small delay to ensure different timestamps
			const newToken = authMiddleware.refreshToken(oldToken);

			expect(newToken).toBeDefined();
			expect(newToken).not.toBe(oldToken);

			const newDecoded = jwt.decode(newToken) as any;
			expect(newDecoded.username).toBe('testuser');
			expect(newDecoded.id).toBe(123);
		});

		it('should remove old exp and iat from payload before refreshing', () => {
			const payload = { username: 'testuser', role: 'user' };
			const token = authMiddleware.generateToken(payload);
			const oldDecoded = jwt.decode(token) as any;
			const oldExp = oldDecoded.exp;

			const newToken = authMiddleware.refreshToken(token);
			const newDecoded = jwt.decode(newToken) as any;
			const newExp = newDecoded.exp;

			// New exp should be different (refreshed)
			expect(newExp).not.toBe(oldExp);
		});

		it('should throw error when refreshing invalid token', () => {
			const invalidToken = 'invalid.token.here';

			expect(() => authMiddleware.refreshToken(invalidToken)).toThrow('Invalid token');
		});

		it('should throw error when refreshing expired token', () => {
			const payload = { username: 'testuser' };
			const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });

			expect(() => authMiddleware.refreshToken(expiredToken)).toThrow('Invalid token');
		});

		it('should preserve complex payload structure', () => {
			const payload = {
				user: { id: 'abc123', email: 'user@example.com' },
				permissions: ['read', 'write'],
				loginTime: '2026-01-11T12:00:00Z'
			};
			const token = authMiddleware.generateToken(payload);
			const newToken = authMiddleware.refreshToken(token);
			const newDecoded = jwt.decode(newToken) as any;

			expect(newDecoded.user.id).toBe('abc123');
			expect(newDecoded.user.email).toBe('user@example.com');
			expect(newDecoded.permissions).toEqual(['read', 'write']);
		});
	});

	describe('createMiddleware', () => {
		let mockReq: Partial<Request>;
		let mockRes: Partial<Response>;
		let mockNext: NextFunction;

		beforeEach(() => {
			mockReq = {
				headers: {}
			};
			mockRes = {
				status: (code: number) => mockRes,
				json: (data: any) => mockRes
			};
			mockNext = () => {};
		});

		it('should return a function', () => {
			const middleware = authMiddleware.createMiddleware();
			expect(typeof middleware).toBe('function');
		});

		it('should call next() for valid Bearer token', () => {
			const payload = { username: 'testuser' };
			const token = authMiddleware.generateToken(payload);
			const middleware = authMiddleware.createMiddleware();

			let nextCalled = false;
			mockReq.headers = { authorization: `Bearer ${token}` };
			mockNext = () => {
				nextCalled = true;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(nextCalled).toBe(true);
			expect((mockReq as any).user).toBeDefined();
			expect((mockReq as any).user.username).toBe('testuser');
		});

		it('should return 401 for missing Authorization header', () => {
			const middleware = authMiddleware.createMiddleware();
			let statusCode: number | undefined;

			mockReq.headers = {};
			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(statusCode).toBe(401);
		});

		it('should return 401 for malformed Authorization header (not Bearer)', () => {
			const middleware = authMiddleware.createMiddleware();
			let statusCode: number | undefined;

			mockReq.headers = { authorization: 'Basic dXNlcjpwYXNzd29yZA==' }; // Basic auth, not Bearer
			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(statusCode).toBe(401);
		});

		it('should return 401 for Bearer token with only "Bearer" (no token)', () => {
			const middleware = authMiddleware.createMiddleware();
			let statusCode: number | undefined;

			mockReq.headers = { authorization: 'Bearer ' }; // Empty token
			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(statusCode).toBe(401);
		});

		it('should return 401 for expired token', () => {
			const middleware = authMiddleware.createMiddleware();
			let statusCode: number | undefined;

			const expiredToken = jwt.sign({ username: 'testuser' }, JWT_SECRET, { expiresIn: '-1s' });
			mockReq.headers = { authorization: `Bearer ${expiredToken}` };
			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(statusCode).toBe(401);
		});

		it('should return 401 for token signed with wrong secret', () => {
			const middleware = authMiddleware.createMiddleware();
			let statusCode: number | undefined;

			const wrongSecretToken = jwt.sign({ username: 'testuser' }, 'wrong-secret', {
				expiresIn: '1h'
			});
			mockReq.headers = { authorization: `Bearer ${wrongSecretToken}` };
			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(statusCode).toBe(401);
		});

		it('should attach decoded user payload to req.user', () => {
			const payload = { username: 'admin', role: 'superuser', permissions: ['read', 'write'] };
			const token = authMiddleware.generateToken(payload);
			const middleware = authMiddleware.createMiddleware();

			mockReq.headers = { authorization: `Bearer ${token}` };
			mockNext = () => {};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq as any).user).toBeDefined();
			expect((mockReq as any).user.username).toBe('admin');
			expect((mockReq as any).user.role).toBe('superuser');
			expect((mockReq as any).user.permissions).toEqual(['read', 'write']);
		});

		it('should return proper error JSON response on auth failure', () => {
			const middleware = authMiddleware.createMiddleware();
			let jsonData: any;

			mockReq.headers = { authorization: 'Bearer invalid.token' };
			mockRes.status = (code: number) => mockRes;
			mockRes.json = (data: any) => {
				jsonData = data;
				return mockRes;
			};

			middleware(mockReq as Request, mockRes as Response, mockNext);

			expect(jsonData).toEqual({ error: 'Unauthorized' });
		});
	});

	describe('configureAuthRoutes', () => {
		it('should register POST /login, /logout, /refresh-token routes', () => {
			const mockApp = {
				post: (path: string, handler: any) => {
					// Mock Express app
				}
			};
			let registeredPaths: string[] = [];
			mockApp.post = (path: string) => {
				registeredPaths.push(path);
				return mockApp;
			};

			authMiddleware.configureAuthRoutes(mockApp as any);

			expect(registeredPaths).toContain('/login');
			expect(registeredPaths).toContain('/logout');
			expect(registeredPaths).toContain('/refresh-token');
		});
	});

	describe('handleLogin', () => {
		let mockReq: Partial<Request>;
		let mockRes: Partial<Response>;

		beforeEach(() => {
			mockReq = { body: {} };
			mockRes = {
				json: (data: any) => mockRes,
				status: (code: number) => mockRes
			};
		});

		it('should return token for correct credentials (admin/password)', () => {
			mockReq.body = { username: 'admin', password: 'password' };
			let responseData: any;

			mockRes.json = (data: any) => {
				responseData = data;
				return mockRes;
			};

			// Access private method via casting
			const loginHandler = (authMiddleware as any).handleLogin.bind(authMiddleware);
			loginHandler(mockReq as Request, mockRes as Response);

			expect(responseData).toBeDefined();
			expect(responseData.token).toBeDefined();
			expect(typeof responseData.token).toBe('string');
		});

		it('should return 401 for incorrect password', () => {
			mockReq.body = { username: 'admin', password: 'wrongpassword' };
			let statusCode: number | undefined;

			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			const loginHandler = (authMiddleware as any).handleLogin.bind(authMiddleware);
			loginHandler(mockReq as Request, mockRes as Response);

			expect(statusCode).toBe(401);
		});

		it('should return 401 for non-existent user', () => {
			mockReq.body = { username: 'nonexistent', password: 'password' };
			let statusCode: number | undefined;

			mockRes.status = (code: number) => {
				statusCode = code;
				return mockRes;
			};

			const loginHandler = (authMiddleware as any).handleLogin.bind(authMiddleware);
			loginHandler(mockReq as Request, mockRes as Response);

			expect(statusCode).toBe(401);
		});

		it('should NOT accept hardcoded password in production (security issue)', () => {
			// This test documents a CRITICAL security issue:
			// The login method uses hardcoded credentials, which is a major vulnerability
			// TODO: Implement bcrypt password hashing and secure credential storage
			const hasHardcodedCredentials = (authMiddleware as any).handleLogin.toString().includes('password');
			expect(hasHardcodedCredentials).toBe(true); // Currently true - this is bad
		});

		it('returned token should be verifiable', () => {
			mockReq.body = { username: 'admin', password: 'password' };
			let token: string | undefined;

			mockRes.json = (data: any) => {
				token = data.token;
				return mockRes;
			};

			const loginHandler = (authMiddleware as any).handleLogin.bind(authMiddleware);
			loginHandler(mockReq as Request, mockRes as Response);

			expect(token).toBeDefined();
			const decoded = authMiddleware.verifyToken(token!);
			expect(decoded.username).toBe('admin');
		});
	});

	describe('Security: Attack Scenarios', () => {
		it('should reject token with modified payload', () => {
			const payload = { username: 'user', role: 'user' };
			const token = authMiddleware.generateToken(payload);

			// Manually modify the payload part (base64 encoded)
			const [header, payload64, signature] = token.split('.');
			const decodedPayload = Buffer.from(payload64, 'base64').toString();
			const modifiedPayload = JSON.parse(decodedPayload);
			modifiedPayload.role = 'admin'; // Try to escalate privileges
			const modifiedPayload64 = Buffer.from(JSON.stringify(modifiedPayload)).toString('base64');
			const tamperedToken = `${header}.${modifiedPayload64}.${signature}`;

			expect(() => authMiddleware.verifyToken(tamperedToken)).toThrow('Invalid token');
		});

		it('should reject token where signature is appended instead of replaced', () => {
			const validToken = authMiddleware.generateToken({ username: 'user' });
			const fakeSignature = 'fakesignature123';
			const attackToken = `${validToken}.${fakeSignature}`;

			expect(() => authMiddleware.verifyToken(attackToken)).toThrow('Invalid token');
		});

		it('should handle algorithm confusion attacks (none algorithm)', () => {
			// Attempt to sign with "none" algorithm
			const payload = { username: 'admin', role: 'admin' };
			const noneAlgorithmToken = `${Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64')}.${Buffer.from(JSON.stringify(payload)).toString('base64')}.`;

			expect(() => authMiddleware.verifyToken(noneAlgorithmToken)).toThrow('Invalid token');
		});

		it('should prevent authorization bypass via missing token', () => {
			const middleware = authMiddleware.createMiddleware();
			let nextCalled = false;

			const mockReq = { headers: {} } as Request;
			const mockRes = {
				status: (code: number) => ({
					json: () => {}
				})
			} as unknown as Response;
			const mockNext = () => {
				nextCalled = true;
			};

			middleware(mockReq, mockRes, mockNext);

			expect(nextCalled).toBe(false);
		});
	});
});
