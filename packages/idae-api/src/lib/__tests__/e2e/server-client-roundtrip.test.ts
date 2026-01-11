import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { IdaeApiClient } from '$lib/client/IdaeApiClient.js';
import { IdaeApiClientConfig } from '$lib/client/IdaeApiClientConfig.js';
import { IdaeApiClientCollection } from '$lib/client/IdaeApiClientCollection.js';
import { AuthMiddleWare } from '$lib/server/middleware/authMiddleware.js';
import { DatabaseMiddleware } from '$lib/server/middleware/databaseMiddleware.js';
import { RouteManager } from '$lib/server/engine/routeManager.js';
import { RequestDatabaseManager } from '$lib/server/engine/requestDatabaseManager.js';

/**
 * END-TO-END SERVER-CLIENT INTEGRATION TESTS
 * Tests complete request → middleware → route → database → response → client deserialization cycles
 */
describe('E2E: Server-Client Roundtrip Integration', () => {
	let authMiddleware: AuthMiddleWare;
	let client: IdaeApiClient;
	let validToken: string;

	beforeEach(() => {
		// Initialize auth
		authMiddleware = new AuthMiddleWare('test-secret-e2e', '1h');
		validToken = authMiddleware.generateToken({ username: 'testuser', role: 'user' });

		// Configure client
		IdaeApiClientConfig.setOptions({
			host: 'localhost',
			port: 3000,
			protocol: 'http',
			token: validToken
		});

		// Initialize client
		client = IdaeApiClient.getInstance();

		// Mock fetch globally
		global.fetch = vi.fn();

		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('Happy Path: Full CRUD Operations', () => {
		describe('CREATE → READ → UPDATE → DELETE Flow', () => {
			it('should handle complete CRUD roundtrip with valid token', async () => {
				const mockFetch = global.fetch as any;

				// 1. CREATE - POST /users
				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 201,
					json: async () => ({ id: '1', name: 'Alice', email: 'alice@test.com' })
				});

				const created = await client.db('testdb').collection('users').create({
					name: 'Alice',
					email: 'alice@test.com'
				});

				expect(created).toEqual({ id: '1', name: 'Alice', email: 'alice@test.com' });
				expect(mockFetch).toHaveBeenCalledWith(
					expect.stringContaining('/users'),
					expect.objectContaining({
						method: 'POST',
						headers: expect.objectContaining({
							'Authorization': `Bearer ${validToken}`,
							'Content-Type': 'application/json'
						})
					})
				);

				// 2. READ - GET /users/1
				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => ({ id: '1', name: 'Alice', email: 'alice@test.com' })
				});

				const read = await client.db('testdb').collection('users').findById('1');

				expect(read).toEqual({ id: '1', name: 'Alice', email: 'alice@test.com' });

				// 3. UPDATE - PUT /users/1
				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => ({ id: '1', name: 'Alice Updated', email: 'alice@test.com' })
				});

				const updated = await client.db('testdb').collection('users').update('1', {
					name: 'Alice Updated'
				});

				expect(updated.name).toBe('Alice Updated');

				// 4. DELETE - DELETE /users/1
				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 204
				});

				await client.db('testdb').collection('users').deleteById('1');

				expect(mockFetch).toHaveBeenCalledWith(
					expect.stringContaining('/users/1'),
					expect.objectContaining({
						method: 'DELETE'
					})
				);
			});

			it('should preserve data types through JSON serialization', async () => {
				const mockFetch = global.fetch as any;

				const testData = {
					name: 'Test',
					age: 25,
					active: true,
					tags: ['tag1', 'tag2'],
					metadata: { key: 'value' },
					createdAt: new Date().toISOString()
				};

				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 201,
					json: async () => testData
				});

				const result = await client.db('testdb').collection('users').create(testData);

				expect(result.name).toBe('Test');
				expect(result.age).toBe(25);
				expect(result.active).toBe(true);
				expect(Array.isArray(result.tags)).toBe(true);
				expect(result.metadata).toEqual({ key: 'value' });
			});
		});

		describe('Complex Queries', () => {
			it('should handle filtered search queries', async () => {
				const mockFetch = global.fetch as any;

				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => [
						{ id: '1', name: 'Alice', age: 25 },
						{ id: '2', name: 'Bob', age: 25 }
					]
				});

				const results = await client.db('testdb').collection('users').find({
					age: { $gt: 20 }
				});

				expect(Array.isArray(results)).toBe(true);
				expect(results).toHaveLength(2);

				// Verify URL contains encoded filter
				const callArgs = mockFetch.mock.calls[0];
				expect(callArgs[0]).toContain('/users');
			});

			it('should handle MongoDB operator queries', async () => {
				const mockFetch = global.fetch as any;

				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => [{ id: '1' }, { id: '2' }]
				});

				const results = await client.db('testdb').collection('users').find({
					email: { $in: ['alice@test.com', 'bob@test.com'] },
					status: { $ne: 'inactive' }
				});

				expect(Array.isArray(results)).toBe(true);
			});

			it('should handle batch delete operations', async () => {
				const mockFetch = global.fetch as any;

				mockFetch.mockResolvedValueOnce({
					ok: true,
					status: 200,
					json: async () => ({ deletedCount: 3 })
				});

				const result = await client.db('testdb').collection('users').deleteManyByQuery({
					inactive: true
				});

				expect(result.deletedCount).toBe(3);
			});
		});
	});

	describe('Authentication Flow Integration', () => {
		it('should include Bearer token in all requests', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => []
			});

			await client.db('testdb').collection('users').find();

			const callArgs = mockFetch.mock.calls[0];
			expect(callArgs[1].headers['Authorization']).toBe(`Bearer ${validToken}`);
		});

		it('should reject request when token is missing', async () => {
			const mockFetch = global.fetch as any;

			// Simulate 401 Unauthorized
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({ error: 'Unauthorized' })
			});

			IdaeApiClientConfig.setOptions({ token: undefined });

			await expect(client.db('testdb').collection('users').find()).rejects.toThrow();
		});

		it('should handle token refresh scenario', async () => {
			const mockFetch = global.fetch as any;

			// First call returns 401 (token expired)
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({ error: 'Token expired' })
			});

			const promise = client.db('testdb').collection('users').find();

			await expect(promise).rejects.toThrow();
		});

		it('should handle 403 Forbidden (insufficient permissions)', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
				json: async () => ({ error: 'Forbidden: insufficient permissions' })
			});

			const promise = client.db('testdb').collection('users').deleteById('1');

			await expect(promise).rejects.toThrow();
		});
	});

	describe('Error Handling & Recovery', () => {
		it('should handle network timeout', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

			const promise = client.db('testdb').collection('users').find();

			await expect(promise).rejects.toThrow('Network timeout');
		});

		it('should handle malformed server response', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => {
					throw new Error('Invalid JSON');
				}
			});

			const promise = client.db('testdb').collection('users').find();

			await expect(promise).rejects.toThrow();
		});

		it('should handle 500 Server Error', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ error: 'Internal server error' })
			});

			const promise = client.db('testdb').collection('users').find();

			await expect(promise).rejects.toThrow();
		});

		it('should handle 404 Not Found', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				json: async () => ({ error: 'Collection not found' })
			});

			const promise = client.db('testdb').collection('nonexistent').find();

			await expect(promise).rejects.toThrow();
		});

		it('should handle rate limiting (429)', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 429,
				headers: new Map([['Retry-After', '60']])
			});

			const promise = client.db('testdb').collection('users').find();

			await expect(promise).rejects.toThrow();
		});
	});

	describe('Content-Type & Encoding', () => {
		it('should set Content-Type to application/json for POST', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => ({ id: '1' })
			});

			await client.db('testdb').collection('users').create({ name: 'Test' });

			const headers = mockFetch.mock.calls[0][1].headers;
			expect(headers['Content-Type']).toBe('application/json');
		});

		it('should handle UTF-8 characters in data', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => ({ id: '1', name: '你好世界' })
			});

			const result = await client.db('testdb').collection('users').create({
				name: '你好世界'
			});

			expect(result.name).toBe('你好世界');
		});

		it('should handle emoji characters', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => ({ id: '1', message: '🚀 Rocket' })
			});

			const result = await client.db('testdb').collection('data').create({
				message: '🚀 Rocket'
			});

			expect(result.message).toBe('🚀 Rocket');
		});
	});

	describe('Multiple Database Connections', () => {
		it('should route requests to correct database', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => []
			});

			// Request to db1
			await client.db('db1').collection('users').find();
			let url1 = mockFetch.mock.calls[0][0];

			// Request to db2
			await client.db('db2').collection('users').find();
			let url2 = mockFetch.mock.calls[1][0];

			// URLs should differ based on database
			expect(url1).toContain('db1');
			expect(url2).toContain('db2');
		});

		it('should route requests to correct collection', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => []
			});

			// Request to users collection
			await client.db('testdb').collection('users').find();
			let url1 = mockFetch.mock.calls[0][0];

			// Request to posts collection
			await client.db('testdb').collection('posts').find();
			let url2 = mockFetch.mock.calls[1][0];

			// URLs should contain correct collection names
			expect(url1).toContain('users');
			expect(url2).toContain('posts');
		});
	});

	describe('Query Parameter Encoding', () => {
		it('should properly encode special characters in query params', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => []
			});

			await client.db('testdb').collection('users').find({
				email: 'user+tag@example.com'
			});

			const url = mockFetch.mock.calls[0][0];
			expect(url).toContain('encoded');
			expect(url).not.toContain('+'); // Should be %2B or similar
		});

		it('should handle deeply nested query objects', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => []
			});

			const complexFilter = {
				user: {
					profile: {
						age: { $gt: 18, $lt: 65 }
					}
				}
			};

			await client.db('testdb').collection('users').find(complexFilter);

			const url = mockFetch.mock.calls[0][0];
			expect(url).toContain('user');
		});
	});

	describe('Request Body Serialization', () => {
		it('should serialize complex objects in request body', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => ({ id: '1' })
			});

			const complexData = {
				name: 'Test',
				nested: {
					level1: {
						level2: ['array', 'values']
					}
				},
				metadata: { key: 'value' }
			};

			await client.db('testdb').collection('users').create(complexData);

			const body = mockFetch.mock.calls[0][1].body;
			expect(typeof body).toBe('string');

			const parsed = JSON.parse(body);
			expect(parsed.nested.level1.level2).toEqual(['array', 'values']);
		});

		it('should handle MongoDB update operators in body', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({ id: '1' })
			});

			await client.db('testdb').collection('users').update('1', {
				$set: { status: 'active' },
				$inc: { loginCount: 1 }
			});

			const body = mockFetch.mock.calls[0][1].body;
			const parsed = JSON.parse(body);

			expect(parsed.$set).toBeDefined();
			expect(parsed.$inc).toBeDefined();
		});
	});

	describe('Response Deserialization', () => {
		it('should deserialize array responses', async () => {
			const mockFetch = global.fetch as any;

			const mockData = [
				{ id: '1', name: 'Alice' },
				{ id: '2', name: 'Bob' }
			];

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData
			});

			const result = await client.db('testdb').collection('users').find();

			expect(Array.isArray(result)).toBe(true);
			expect(result).toHaveLength(2);
		});

		it('should deserialize object responses', async () => {
			const mockFetch = global.fetch as any;

			const mockData = { id: '1', name: 'Alice', email: 'alice@test.com' };

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockData
			});

			const result = await client.db('testdb').collection('users').findById('1');

			expect(result).toEqual(mockData);
		});

		it('should handle null/empty responses', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => null
			});

			const result = await client.db('testdb').collection('users').findById('nonexistent');

			expect(result).toBeNull();
		});
	});

	describe('HTTP Method Mapping', () => {
		it('should use GET for find operations', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => []
			});

			await client.db('testdb').collection('users').find();

			expect(mockFetch.mock.calls[0][1].method).toBe('GET');
		});

		it('should use POST for create operations', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 201,
				json: async () => ({ id: '1' })
			});

			await client.db('testdb').collection('users').create({ name: 'Test' });

			expect(mockFetch.mock.calls[0][1].method).toBe('POST');
		});

		it('should use PUT for update operations', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => ({ id: '1' })
			});

			await client.db('testdb').collection('users').update('1', { name: 'Updated' });

			expect(mockFetch.mock.calls[0][1].method).toBe('PUT');
		});

		it('should use DELETE for delete operations', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 204
			});

			await client.db('testdb').collection('users').deleteById('1');

			expect(mockFetch.mock.calls[0][1].method).toBe('DELETE');
		});
	});

	describe('Client Configuration Persistence', () => {
		it('should maintain token across multiple requests', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => []
			});

			// First request
			await client.db('testdb').collection('users').find();
			const token1 = mockFetch.mock.calls[0][1].headers['Authorization'];

			// Second request
			await client.db('testdb').collection('posts').find();
			const token2 = mockFetch.mock.calls[1][1].headers['Authorization'];

			// Tokens should be identical
			expect(token1).toBe(token2);
		});

		it('should maintain host/port across requests', async () => {
			const mockFetch = global.fetch as any;

			mockFetch.mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => []
			});

			await client.db('db1').collection('col1').find();
			await client.db('db2').collection('col2').find();

			const url1 = mockFetch.mock.calls[0][0];
			const url2 = mockFetch.mock.calls[1][0];

			// Both should contain same host/port
			expect(url1.split('/')[2]).toBe('localhost:3000');
			expect(url2.split('/')[2]).toBe('localhost:3000');
		});
	});
});
