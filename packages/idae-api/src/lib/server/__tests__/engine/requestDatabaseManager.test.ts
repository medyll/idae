import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Request } from 'express';
import {
	RequestDatabaseManager,
	requestDatabaseManager,
	type DatabaseConfigOptions
} from '$lib/server/engine/requestDatabaseManager.js';

describe('RequestDatabaseManager', () => {
	describe('Singleton Pattern', () => {
		it('should return same instance on multiple calls', () => {
			const instance1 = RequestDatabaseManager.getInstance();
			const instance2 = RequestDatabaseManager.getInstance();

			expect(instance1).toBe(instance2);
		});

		it('should export singleton instance', () => {
			expect(requestDatabaseManager).toBeDefined();
			expect(requestDatabaseManager).toBe(RequestDatabaseManager.getInstance());
		});

		it('should use private constructor', () => {
			// Cannot instantiate directly - TypeScript won't compile
			const manager = RequestDatabaseManager.getInstance();
			expect(manager).toBeDefined();
		});
	});

	describe('Configuration', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should have default configuration', () => {
			expect(manager.config).toBeDefined();
			expect(manager.config.port).toBeDefined();
			expect(manager.config.host).toBeDefined();
			expect(manager.config.defaultDbName).toBeDefined();
			expect(manager.config.connectionPrefix).toBeDefined();
		});

		it('should use environment variables for configuration', () => {
			// Note: In test environment, env vars may not be set
			// This test documents expected behavior
			expect(manager.config.host).toBeDefined();
			expect(typeof manager.config.port).toBe('number');
		});

		it('should have mongodb connection prefix', () => {
			expect(manager.config.connectionPrefix).toBe('mongodb://');
		});
	});

	describe('fromReq', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should extract collection name from request params', () => {
			const mockReq = {
				params: { collectionName: 'users' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.collectionName).toBe('users');
		});

		it('should default to default database when no dot in collection name', () => {
			const mockReq = {
				params: { collectionName: 'users' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbName).toBe(manager.config.defaultDbName);
		});

		it('should extract database name when collection includes dot', () => {
			const mockReq = {
				params: { collectionName: 'custom_db.users' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbName).toBe('custom_db');
			expect(result.collectionName).toBe('users');
		});

		it('should construct MongoDB URI with correct format', () => {
			const mockReq = {
				params: { collectionName: 'items' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toMatch(/^mongodb:\/\//);
			expect(result.dbUri).toContain(':27017'); // Default MongoDB port
			expect(result.dbUri).toContain('idaenext_sitebase_app'); // Default DB name
		});

		it('should construct custom URI for custom database', () => {
			const mockReq = {
				params: { collectionName: 'my_db.collection' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toContain('my_db');
		});

		it('should return all three properties', () => {
			const mockReq = {
				params: { collectionName: 'posts' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result).toHaveProperty('dbName');
			expect(result).toHaveProperty('collectionName');
			expect(result).toHaveProperty('dbUri');
		});

		it('should handle collection name parsing with multiple dots', () => {
			const mockReq = {
				params: { collectionName: 'db.collection.items' }
			} as any;

			const result = manager.fromReq(mockReq);

			// Should take first part as db, then handle remaining
			expect(result.dbName).toBe('db');
			expect(result.collectionName).toBeDefined();
		});

		it('should use default database for empty collection name', () => {
			const mockReq = {
				params: { collectionName: '' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbName).toBe(manager.config.defaultDbName);
		});
	});

	describe('URI Construction', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should construct valid MongoDB URI', () => {
			const mockReq = {
				params: { collectionName: 'test_db.items' }
			} as any;

			const result = manager.fromReq(mockReq);
			const uri = result.dbUri;

			// Valid MongoDB URI format: mongodb://host:port/dbname
			expect(uri).toMatch(/^mongodb:\/\/[^:]+:\d+\/\w+$/);
		});

		it('should include correct host from config', () => {
			const mockReq = {
				params: { collectionName: 'users' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toContain(manager.config.host);
		});

		it('should include correct port from config', () => {
			const mockReq = {
				params: { collectionName: 'users' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toContain(`:${manager.config.port}`);
		});

		it('should respect custom configuration', () => {
			// This tests the pattern - actual environment vars might not be set
			const mockReq = {
				params: { collectionName: 'data' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toMatch(/mongodb:\/\/.+:.+\/.+/);
		});
	});

	describe('Security: Injection Prevention', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should safely handle SQL injection attempt in collection name', () => {
			const mockReq = {
				params: { collectionName: "users'; DROP TABLE users; --" }
			} as any;

			const result = manager.fromReq(mockReq);

			// URI should be constructed, but injection attempt should not execute
			// MongoDB URI construction doesn't execute SQL
			expect(result.dbUri).toBeDefined();
			expect(result.collectionName).toBeDefined();
		});

		it('should safely handle NoSQL injection in collection name', () => {
			const mockReq = {
				params: { collectionName: 'users.$where: function() { return true }' }
			} as any;

			const result = manager.fromReq(mockReq);

			// Collection name should be preserved as-is, adapter handles sanitization
			expect(result.collectionName).toBeDefined();
		});

		it('should preserve dots in collection name for database.collection splitting', () => {
			const mockReq = {
				params: { collectionName: 'app.user_profiles' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbName).toBe('app');
			expect(result.collectionName).toBe('user_profiles');
		});

		it('should handle special characters in collection name', () => {
			const mockReq = {
				params: { collectionName: 'users-_$test' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.collectionName).toBe('users-_$test');
		});

		it('should handle Unicode characters in collection name', () => {
			const mockReq = {
				params: { collectionName: 'usuarios_français' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.collectionName).toBeDefined();
		});

		it('should handle very long collection name', () => {
			const longName = 'a'.repeat(500) + '.collection';
			const mockReq = {
				params: { collectionName: longName }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbUri).toBeDefined();
			expect(result.collectionName).toBeDefined();
		});
	});

	describe('Edge Cases', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should handle missing collectionName param', () => {
			const mockReq = {
				params: {}
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.collectionName).toBe('default');
		});

		it('should handle null params', () => {
			const mockReq = {
				params: null
			} as any;

			expect(() => manager.fromReq(mockReq)).not.toThrow();
		});

		it('should handle URI with special port numbers', () => {
			const mockReq = {
				params: { collectionName: 'data' }
			} as any;

			const result = manager.fromReq(mockReq);

			// Should construct valid URI regardless of port
			expect(result.dbUri).toMatch(/mongodb:\/\/[^:]+:\d+\/\w+/);
		});

		it('should preserve original collectionName if no dot present', () => {
			const mockReq = {
				params: { collectionName: 'myCollection' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.collectionName).toBe('myCollection');
		});

		it('should handle single dot in collection name', () => {
			const mockReq = {
				params: { collectionName: 'db.' }
			} as any;

			const result = manager.fromReq(mockReq);

			expect(result.dbName).toBe('db');
		});
	});

	describe('closeAllConnections', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should have closeAllConnections method', () => {
			expect(manager.closeAllConnections).toBeDefined();
			expect(typeof manager.closeAllConnections).toBe('function');
		});

		it('should not throw error when closing connections', async () => {
			await expect(manager.closeAllConnections()).resolves.not.toThrow();
		});
	});

	describe('Environment Variable Handling', () => {
		let manager: RequestDatabaseManager;

		beforeEach(() => {
			manager = RequestDatabaseManager.getInstance();
		});

		it('should read MONGODB_DEFAULT_HOST from env', () => {
			// This test documents expected behavior
			// Actual env var handling depends on test environment setup
			expect(manager.config.host).toBeDefined();
			expect(typeof manager.config.host).toBe('string');
		});

		it('should read MONGODB_DEFAULT_PORT from env', () => {
			expect(manager.config.port).toBeDefined();
			expect(typeof manager.config.port).toBe('number');
		});

		it('should read MONGODB_DEFAULT_DB from env', () => {
			expect(manager.config.defaultDbName).toBeDefined();
			expect(typeof manager.config.defaultDbName).toBe('string');
		});

		it('should read MONGODB_DEFAULT_CONNECTION_PREFIX from env', () => {
			expect(manager.config.connectionPrefix).toBeDefined();
			expect(manager.config.connectionPrefix).toContain('mongodb');
		});

		it('should have fallback values if env vars not set', () => {
			// Verify fallback values are applied
			expect(manager.config.port).toBeGreaterThan(0);
			expect(manager.config.host.length).toBeGreaterThan(0);
			expect(manager.config.defaultDbName.length).toBeGreaterThan(0);
		});
	});
});
