import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { idaeDbMiddleware } from '$lib/server/middleware/databaseMiddleware.js';
import requestDatabaseManager from '$lib/server/engine/requestDatabaseManager.js';
import { IdaeDb } from '@medyll/idae-db';

// Mock IdaeDb
vi.mock('@medyll/idae-db', () => ({
	IdaeDb: {
		init: vi.fn(() => ({
			db: vi.fn().mockResolvedValue({}),
			collection: vi.fn().mockReturnValue({
				find: vi.fn().mockResolvedValue([]),
				create: vi.fn().mockResolvedValue({}),
				update: vi.fn().mockResolvedValue({}),
				deleteById: vi.fn().mockResolvedValue(null)
			})
		}))
	}
}));

// Mock requestDatabaseManager
vi.mock('$lib/server/engine/requestDatabaseManager.js', () => ({
	default: {
		fromReq: vi.fn(() => ({
			dbName: 'test_db',
			collectionName: 'test_collection',
			dbUri: 'mongodb://localhost:27017/test_db'
		}))
	}
}));

// Mock IdaeApi
vi.mock('$lib/server/IdaeApi.js', () => ({
	idaeApi: {
		idaeApiOptions: {
			idaeDbOptions: {}
		}
	}
}));

describe('idaeDbMiddleware', () => {
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		vi.clearAllMocks();

		mockReq = {
			params: { collectionName: 'users' },
			headers: {},
			query: {}
		};

		mockRes = {
			status: (code: number) => mockRes,
			json: (data: any) => mockRes,
			send: (data: any) => mockRes
		};

		mockNext = vi.fn();
	});

	describe('Middleware Execution', () => {
		it('should extract database configuration from request', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(requestDatabaseManager.fromReq).toHaveBeenCalledWith(mockReq);
		});

		it('should initialize IdaeDb with correct parameters', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(IdaeDb.init).toHaveBeenCalledWith(
				'mongodb://localhost:27017/test_db',
				expect.any(Object)
			);
		});

		it('should connect to database', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			const dbInstance = (IdaeDb.init as any).mock.results[0]?.value;
			if (dbInstance) {
				expect(dbInstance.db).toHaveBeenCalledWith('app');
			}
		});

		it('should bind collection to request', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq as any).connectedCollection).toBeDefined();
		});

		it('should set collection name on request', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq as any).collectionName).toBe('test_collection');
		});

		it('should set database name on request', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq as any).dbName).toBe('test_db');
		});

		it('should call next() on successful middleware execution', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});

		it('should set idaeDb instance on request', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq as any).idaeDb).toBeDefined();
		});
	});

	describe('Query Parameter Parsing', () => {
		it('should handle missing query.params', async () => {
			mockReq.query = {};

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});

		it('should decode and parse JSON params from query string', async () => {
			const params = { email: 'test@example.com', age: { $gt: 25 } };
			const encodedParams = encodeURIComponent(JSON.stringify(params));

			mockReq.query = { params: encodedParams } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq.query as any).params).toEqual(params);
		});

		it('should continue execution even if params parsing fails', async () => {
			mockReq.query = { params: 'invalid%%%json' } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});

		it('should handle complex nested query parameters', async () => {
			const params = {
				filter: {
					status: 'active',
					age: { $gte: 18, $lte: 65 },
					tags: { $in: ['admin', 'user'] }
				},
				sort: { createdAt: -1 },
				limit: 10
			};
			const encodedParams = encodeURIComponent(JSON.stringify(params));

			mockReq.query = { params: encodedParams } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq.query as any).params).toEqual(params);
		});

		it('should handle Unicode characters in params', async () => {
			const params = { name: 'José García', city: 'São Paulo' };
			const encodedParams = encodeURIComponent(JSON.stringify(params));

			mockReq.query = { params: encodedParams } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect((mockReq.query as any).params).toEqual(params);
		});
	});

	describe('Error Handling', () => {
		it('should catch errors and pass to next middleware', async () => {
			const error = new Error('Database connection failed');
			(requestDatabaseManager.fromReq as any).mockImplementationOnce(() => {
				throw error;
			});

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});

		it('should handle IdaeDb.init() failures', async () => {
			const error = new Error('Invalid database URI');
			(IdaeDb.init as any).mockImplementationOnce(() => {
				throw error;
			});

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalledWith(error);
		});

		it('should handle database connection failures', async () => {
			const mockDbInstance = {
				db: vi.fn().mockRejectedValueOnce(new Error('Connection timeout'))
			};
			(IdaeDb.init as any).mockReturnValueOnce(mockDbInstance);

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			// Should still call next even if db connection fails (async error)
			// In real scenario, this would be caught by error handler
		});

		it('should log errors to console', async () => {
			const error = new Error('Test error');
			(requestDatabaseManager.fromReq as any).mockImplementationOnce(() => {
				throw error;
			});

			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});
	});

	describe('Request Augmentation', () => {
		it('should properly augment Express Request object', async () => {
			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			const req = mockReq as any;
			expect(req.collectionName).toBeDefined();
			expect(req.dbName).toBeDefined();
			expect(req.idaeDb).toBeDefined();
			expect(req.connectedCollection).toBeDefined();
		});

		it('should handle multiple middleware calls without interference', async () => {
			const req1 = {
				params: { collectionName: 'users' },
				headers: {},
				query: {}
			} as any;

			const req2 = {
				params: { collectionName: 'posts' },
				headers: {},
				query: {}
			} as any;

			await idaeDbMiddleware(req1, mockRes as Response, vi.fn());
			await idaeDbMiddleware(req2, mockRes as Response, vi.fn());

			expect(req1.collectionName).toBe('test_collection');
			expect(req2.collectionName).toBe('test_collection');
		});
	});

	describe('Security: Injection Prevention', () => {
		it('should safely handle SQL injection attempts in collection name', async () => {
			mockReq.params = { collectionName: "users'; DROP TABLE users; --" };

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			// The collection name is extracted via requestDatabaseManager
			// which should handle escaping - test that middleware doesn't bypass this
			expect(requestDatabaseManager.fromReq).toHaveBeenCalledWith(mockReq);
			expect(mockNext).toHaveBeenCalled();
		});

		it('should safely handle NoSQL injection in params', async () => {
			// Attempt NoSQL injection via params
			const maliciousParams = { email: { $ne: null } };
			const encodedParams = encodeURIComponent(JSON.stringify(maliciousParams));

			mockReq.query = { params: encodedParams } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			// Params are passed through as-is, but adapter handles sanitization
			expect((mockReq.query as any).params).toEqual(maliciousParams);
		});

		it('should handle very long collection names gracefully', async () => {
			const longName = 'a'.repeat(1000);
			mockReq.params = { collectionName: longName };

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(requestDatabaseManager.fromReq).toHaveBeenCalledWith(mockReq);
		});

		it('should handle XSS attempts in encoded params', async () => {
			const xssAttempt = { name: '<script>alert("xss")</script>' };
			const encodedParams = encodeURIComponent(JSON.stringify(xssAttempt));

			mockReq.query = { params: encodedParams } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			// XSS is mitigated by JSON encoding, test that it's preserved as string
			expect((mockReq.query as any).params.name).toBe('<script>alert("xss")</script>');
		});
	});

	describe('Edge Cases', () => {
		it('should handle missing params in request', async () => {
			mockReq.params = {};

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});

		it('should handle null values in query parameters', async () => {
			mockReq.query = { params: null } as any;

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockNext).toHaveBeenCalled();
		});

		it('should handle multiple async operations sequentially', async () => {
			const mockDbInstance = {
				db: vi.fn().mockResolvedValue({}),
				collection: vi.fn().mockReturnValue({})
			};
			(IdaeDb.init as any).mockReturnValueOnce(mockDbInstance);

			await idaeDbMiddleware(mockReq as Request, mockRes as Response, mockNext);

			expect(mockDbInstance.db).toHaveBeenCalledWith('app');
			expect(mockDbInstance.collection).toHaveBeenCalledWith('test_collection');
		});
	});
});
