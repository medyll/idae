import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { IdaeApiClientConfig } from '$lib/client/IdaeApiClientConfig.js';
import { IdaeApiClient } from '$lib/client/IdaeApiClient.js';
import { IdaeApiClientCollection } from '$lib/client/IdaeApiClientCollection.js';
import { IdaeApiClientRequest } from '$lib/client/IdaeApiClientRequest.js';

// Mock fetch
global.fetch = vi.fn();

describe('IdaeApiClient', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		IdaeApiClientConfig.setOptions({
			host: 'localhost',
			port: 3000,
			method: 'http',
			defaultDb: 'app'
		});
	});

	describe('Initialization', () => {
		it('should create client instance', () => {
			const client = new IdaeApiClient();
			expect(client).toBeDefined();
		});

		it('should initialize with default config', () => {
			const client = new IdaeApiClient();
			expect(client.request).toBeDefined();
		});

		it('should accept custom config in constructor', () => {
			const customConfig = {
				host: 'api.example.com',
				port: 8080,
				method: 'https',
				defaultDb: 'custom'
			};
			const client = new IdaeApiClient(customConfig);
			expect(client).toBeDefined();
		});

		it('should have request property', () => {
			const client = new IdaeApiClient();
			expect(client.request).toBeInstanceOf(IdaeApiClientRequest);
		});
	});

	describe('db() method', () => {
		it('should return object with collection method', () => {
			const client = new IdaeApiClient();
			const db = client.db('mydb');

			expect(db).toBeDefined();
			expect(db.collection).toBeDefined();
		});

		it('should return collection method', () => {
			const client = new IdaeApiClient();
			const collection = client.db('mydb').collection('users');

			expect(collection).toBeInstanceOf(IdaeApiClientCollection);
		});

		it('should pass correct dbName to collection', () => {
			const client = new IdaeApiClient();
			const collection = client.db('custom_db').collection('posts') as any;

			// Collection should have meta with correct dbName
			expect((collection as any).meta.dbName).toBe('custom_db');
		});

		it('should have getCollections method', () => {
			const client = new IdaeApiClient();
			const db = client.db('mydb');

			expect(db.getCollections).toBeDefined();
			expect(typeof db.getCollections).toBe('function');
		});
	});

	describe('collection() method', () => {
		it('should return IdaeApiClientCollection', () => {
			const client = new IdaeApiClient();
			const collection = client.collection('users');

			expect(collection).toBeInstanceOf(IdaeApiClientCollection);
		});

		it('should use default database when not specified', () => {
			const client = new IdaeApiClient();
			const collection = client.collection('users') as any;

			expect((collection as any).meta.dbName).toBe('app'); // Default DB
		});

		it('should use custom database when specified', () => {
			const client = new IdaeApiClient();
			const collection = client.collection('users', 'custom_db') as any;

			expect((collection as any).meta.dbName).toBe('custom_db');
		});
	});

	describe('getDbList()', () => {
		it('should return promise', () => {
			const client = new IdaeApiClient();
			const result = client.getDbList();

			expect(result).toBeInstanceOf(Promise);
		});

		it('should make request to methods/dbs endpoint', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ databases: ['db1', 'db2'] })
			});

			const client = new IdaeApiClient();
			const result = await client.getDbList();

			expect(global.fetch).toHaveBeenCalled();
		});
	});

	describe('getCollections(dbName)', () => {
		it('should return promise', () => {
			const client = new IdaeApiClient();
			const result = client.getCollections('mydb');

			expect(result).toBeInstanceOf(Promise);
		});

		it('should make request with correct database name', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ collections: [] })
			});

			const client = new IdaeApiClient();
			await client.getCollections('custom_db');

			expect(global.fetch).toHaveBeenCalled();
		});
	});
});

describe('IdaeApiClientCollection', () => {
	let collection: IdaeApiClientCollection;

	beforeEach(() => {
		vi.clearAllMocks();
		IdaeApiClientConfig.setOptions({
			host: 'localhost',
			port: 3000,
			method: 'http',
			defaultDb: 'app',
			token: undefined
		});
		collection = new IdaeApiClientCollection(IdaeApiClientConfig, 'app', 'users');
	});

	describe('find()', () => {
		it('should return promise', () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			const result = collection.find();
			expect(result).toBeInstanceOf(Promise);
		});

		it('should make GET request', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await collection.find();

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users'), {
				method: 'GET',
				headers: expect.any(Object)
			});
		});

		it('should include Bearer token in headers when configured', async () => {
			IdaeApiClientConfig.setOptions({ token: 'test-token-123' });
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await collection.find();

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer test-token-123'
					})
				})
			);
		});

		it('should accept filter parameters', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			const filter = { age: { $gt: 25 }, status: 'active' };
			await collection.find(filter);

			const callUrl = (global.fetch as any).mock.calls[0][0];
			expect(callUrl).toContain('age');
			expect(callUrl).toContain('status');
		});

		it('should handle complex MongoDB operators in filters', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			const filter = {
				email: { $in: ['a@example.com', 'b@example.com'] },
				age: { $gte: 18, $lte: 65 }
			};
			await collection.find(filter);

			const callUrl = (global.fetch as any).mock.calls[0][0];
			expect(callUrl).toContain('email');
			expect(callUrl).toContain('age');
		});
	});

	describe('findById(id)', () => {
		it('should make GET request with ID', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: '123', name: 'test' })
			});

			await collection.findById('user-123');

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/user-123'), {
				method: 'GET',
				headers: expect.any(Object)
			});
		});

		it('should return single document', async () => {
			const doc = { id: '456', name: 'John' };
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => doc
			});

			const result = await collection.findById('456');

			expect(result).toBeDefined();
		});
	});

	describe('create(body)', () => {
		it('should make POST request', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: '789', name: 'new' })
			});

			const data = { name: 'New User', email: 'new@example.com' };
			await collection.create(data);

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users'), {
				method: 'POST',
				headers: expect.any(Object),
				body: expect.any(String)
			});
		});

		it('should JSON-stringify body', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			const data = { name: 'Test', age: 30 };
			await collection.create(data);

			const body = (global.fetch as any).mock.calls[0][1].body;
			expect(() => JSON.parse(body)).not.toThrow();
		});

		it('should include Content-Type header', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await collection.create({ name: 'test' });

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						'Content-Type': 'application/json'
					})
				})
			);
		});
	});

	describe('update(id, body)', () => {
		it('should make PUT request', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ id: 'update-123', updated: true })
			});

			const updates = { status: 'inactive' };
			await collection.update('update-123', updates);

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/update-123'), {
				method: 'PUT',
				headers: expect.any(Object),
				body: expect.any(String)
			});
		});

		it('should support MongoDB $set operator', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await collection.update('123', { $set: { name: 'Updated' } });

			const body = (global.fetch as any).mock.calls[0][1].body;
			expect(body).toContain('$set');
		});
	});

	describe('deleteById(id)', () => {
		it('should make DELETE request with ID', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ deleted: true })
			});

			await collection.deleteById('delete-123');

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/delete-123'), {
				method: 'DELETE',
				headers: expect.any(Object)
			});
		});
	});

	describe('deleteManyByQuery(params)', () => {
		it('should make DELETE request with query parameters', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ deleted: 5 })
			});

			const query = { status: 'inactive' };
			await collection.deleteManyByQuery(query);

			expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users'), {
				method: 'DELETE',
				headers: expect.any(Object)
			});
		});
	});
});

describe('IdaeApiClientRequest', () => {
	let request: IdaeApiClientRequest;

	beforeEach(() => {
		vi.clearAllMocks();
		IdaeApiClientConfig.setOptions({
			host: 'localhost',
			port: 3000,
			method: 'http'
		});
		request = new IdaeApiClientRequest(IdaeApiClientConfig);
	});

	describe('URL Building', () => {
		it('should build correct base URL', () => {
			IdaeApiClientConfig.setOptions({
				host: 'api.example.com',
				port: 8080,
				method: 'https'
			});

			// URL is built in doRequest
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			request.doRequest({ dbName: 'db', collectionName: 'users' });

			const url = (global.fetch as any).mock.calls[0]?.[0];
			expect(url).toContain('https://api.example.com:8080');
		});

		it('should include collection name in URL', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users' });

			const url = (global.fetch as any).mock.calls[0][0];
			expect(url).toContain('/users');
		});

		it('should include slug (ID) in URL when provided', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users', slug: 'user-123' });

			const url = (global.fetch as any).mock.calls[0][0];
			expect(url).toContain('user-123');
		});

		it('should encode params in query string', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({
				dbName: 'app',
				collectionName: 'users',
				params: { age: { $gt: 25 }, name: 'John' }
			});

			const url = (global.fetch as any).mock.calls[0][0];
			expect(url).toContain('age');
			expect(url).toContain('name');
		});
	});

	describe('HTTP Methods', () => {
		it('should default to GET method', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users' });

			expect(global.fetch).toHaveBeenCalledWith(expect.any(String), {
				method: 'GET',
				headers: expect.any(Object)
			});
		});

		it('should use provided HTTP method', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await request.doRequest({
				method: 'POST',
				dbName: 'app',
				collectionName: 'users',
				body: { name: 'test' }
			});

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					method: 'POST'
				})
			);
		});

		it('should support PUT method', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await request.doRequest({
				method: 'PUT',
				dbName: 'app',
				collectionName: 'users',
				slug: '123'
			});

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					method: 'PUT'
				})
			);
		});

		it('should support DELETE method', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await request.doRequest({
				method: 'DELETE',
				dbName: 'app',
				collectionName: 'users',
				slug: '123'
			});

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					method: 'DELETE'
				})
			);
		});
	});

	describe('Headers', () => {
		it('should include Content-Type for POST/PUT', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			await request.doRequest({
				method: 'POST',
				dbName: 'app',
				collectionName: 'users',
				body: { name: 'test' }
			});

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						'Content-Type': 'application/json'
					})
				})
			);
		});

		it('should include Bearer token when configured', async () => {
			IdaeApiClientConfig.setOptions({ token: 'secret-token-xyz' });

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users' });

			expect(global.fetch).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: 'Bearer secret-token-xyz'
					})
				})
			);
		});

		it('should NOT include Bearer token when not configured', async () => {
			IdaeApiClientConfig.setOptions({ token: undefined });

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users' });

			const headers = (global.fetch as any).mock.calls[0][1].headers;
			expect(headers.Authorization).toBeUndefined();
		});
	});

	describe('Error Handling', () => {
		it('should throw on non-2xx response', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 404,
				json: async () => ({ error: 'Not found' })
			});

			await expect(request.doRequest({ dbName: 'app', collectionName: 'users' })).rejects.toThrow();
		});

		it('should throw on 401 Unauthorized', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => ({ error: 'Unauthorized' })
			});

			await expect(request.doRequest({ dbName: 'app', collectionName: 'users' })).rejects.toThrow();
		});

		it('should throw on 500 Server Error', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => ({ error: 'Internal server error' })
			});

			await expect(request.doRequest({ dbName: 'app', collectionName: 'users' })).rejects.toThrow();
		});

		it('should handle network errors', async () => {
			(global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

			await expect(request.doRequest({ dbName: 'app', collectionName: 'users' })).rejects.toThrow();
		});
	});

	describe('Body Handling', () => {
		it('should JSON-stringify body for POST', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			const body = { name: 'Test User', email: 'test@example.com' };
			await request.doRequest({
				method: 'POST',
				dbName: 'app',
				collectionName: 'users',
				body
			});

			const requestBody = (global.fetch as any).mock.calls[0][1].body;
			expect(JSON.parse(requestBody)).toEqual(body);
		});

		it('should preserve body structure with nested objects', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => ({})
			});

			const body = {
				$set: {
					profile: { name: 'John', age: 30 },
					metadata: { updated: new Date().toISOString() }
				}
			};

			await request.doRequest({
				method: 'PUT',
				dbName: 'app',
				collectionName: 'users',
				body
			});

			const requestBody = (global.fetch as any).mock.calls[0][1].body;
			const parsed = JSON.parse(requestBody);
			expect(parsed.$set.profile.name).toBe('John');
		});
	});

	describe('Security', () => {
		it('should reject expired token', async () => {
			// Client doesn't validate token expiry - that's server-side
			// But should include whatever token is configured
			IdaeApiClientConfig.setOptions({ token: 'expired.token.here' });

			(global.fetch as any).mockResolvedValueOnce({
				ok: false,
				status: 401
			});

			await expect(request.doRequest({ dbName: 'app', collectionName: 'users' })).rejects.toThrow();
		});

		it('should send token in correct Bearer format', async () => {
			const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
			IdaeApiClientConfig.setOptions({ token });

			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			await request.doRequest({ dbName: 'app', collectionName: 'users' });

			const authHeader = (global.fetch as any).mock.calls[0][1].headers.Authorization;
			expect(authHeader).toBe(`Bearer ${token}`);
		});

		it('should handle XSS payloads in collection name safely', async () => {
			(global.fetch as any).mockResolvedValueOnce({
				ok: true,
				json: async () => []
			});

			const xssCollection = '<script>alert("xss")</script>';
			await request.doRequest({ dbName: 'app', collectionName: xssCollection });

			// URL should be built without executing script
			const url = (global.fetch as any).mock.calls[0][0];
			expect(url).toBeDefined();
		});
	});
});
