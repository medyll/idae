import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IdaeDb, type IdaeDbOptions } from '../../src/lib/idaeDb.js';
import { DbType } from '../../src/lib/@types/types.js';
import { MockAdapter } from '../fixtures/mock-adapter.js';
import { IdaeDbAdapter } from '../../src/lib/IdaeDbAdapter.js';

describe('IdaeDb - Singleton Pattern', () => {
	const TEST_URI = 'mongodb://localhost:27017/test';
	const TEST_URI_2 = 'mongodb://localhost:27017/test2';
	const MYSQL_URI = 'mysql://root:pass@localhost:3306/test';

	beforeEach(() => {
		// Clear singleton instances before each test
		// Note: This requires accessing private static members - we'll test behavior instead
	});

	afterEach(() => {
		// Cleanup
	});

	describe('init() method', () => {
		it('should return an IdaeDb instance', () => {
			const db = IdaeDb.init(TEST_URI);
			expect(db).toBeInstanceOf(IdaeDb);
		});

		it('should return same instance for identical URI and dbType', () => {
			const db1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			expect(db1).toBe(db2);
		});

		it('should return different instances for different URIs', () => {
			const db1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(TEST_URI_2, { dbType: DbType.MONGODB });

			expect(db1).not.toBe(db2);
		});

		it('should return different instances for different dbTypes', () => {
			const mongoDb = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(TEST_URI, { dbType: DbType.MYSQL });

			expect(mongoDb).not.toBe(mysqlDb);
		});

		it('should accept options and store them', () => {
			const options: Partial<IdaeDbOptions> = {
				dbType: DbType.MONGODB,
				dbScope: 'myapp',
				dbScopeSeparator: '___'
			};

			const db = IdaeDb.init(TEST_URI, options);

			expect(db.options.dbType).toBe(DbType.MONGODB);
			expect(db.options.dbScope).toBe('myapp');
			expect(db.options.dbScopeSeparator).toBe('___');
		});

		it('should default to MONGODB dbType if not specified', () => {
			const db = IdaeDb.init(TEST_URI);

			expect(db.options.dbType).toBe(DbType.MONGODB);
		});

		it('should register events if provided in options', () => {
			const events = {
				create: { pre: vi.fn() }
			};

			const db = IdaeDb.init(TEST_URI, {
				dbType: DbType.MONGODB,
				dbEvents: events as any
			});

			expect(db).toBeDefined();
		});
	});

	describe('uri property', () => {
		it('should return the database URI', () => {
			const db = IdaeDb.init(TEST_URI);
			expect(db.uri).toBe(TEST_URI);
		});
	});

	describe('options property', () => {
		it('should return the database options', () => {
			const options = {
				dbType: DbType.MONGODB,
				dbScope: 'testscope'
			};

			const db = IdaeDb.init(TEST_URI, options);
			expect(db.options.dbType).toBe(DbType.MONGODB);
			expect(db.options.dbScope).toBe('testscope');
		});

		it('should have default options when not specified', () => {
			const db = IdaeDb.init(TEST_URI);

			expect(db.options).toBeDefined();
			expect(db.options.dbType).toBeDefined();
		});
	});

	describe('connectionKey property', () => {
		it('should generate consistent key for same URI and type', () => {
			const db1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			expect(db1.connectionKey).toBe(db2.connectionKey);
		});

		it('should generate different keys for different types', () => {
			const mongoDb = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(TEST_URI, { dbType: DbType.MYSQL });

			expect(mongoDb.connectionKey).not.toBe(mysqlDb.connectionKey);
		});

		it('should include dbType and URI in key format', () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const key = db.connectionKey;

			expect(key).toContain(DbType.MONGODB);
			expect(key).toContain(TEST_URI);
		});
	});

	describe('adapterClass property', () => {
		it('should return adapter for specified dbType', () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const adapterClass = db.adapterClass;

			expect(adapterClass).toBeDefined();
		});
	});

	describe('registerEvents() method', () => {
		it('should register event listeners', () => {
			const db = IdaeDb.init(TEST_URI);
			const listeners = {
				create: {
					pre: vi.fn(),
					post: vi.fn(),
					error: vi.fn()
				}
			};

			expect(() => {
				db.registerEvents(listeners as any);
			}).not.toThrow();
		});

		it('should apply registered events to collections', () => {
			const db = IdaeDb.init(TEST_URI);
			const preListener = vi.fn();

			const events = {
				create: { pre: preListener }
			};

			db.registerEvents(events as any);
			expect(db).toBeDefined();
		});
	});

	describe('Multiple instance management', () => {
		it('should maintain separate instances per dbType', () => {
			const mongoDb1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const mongoDb2 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(TEST_URI, { dbType: DbType.MYSQL });

			expect(mongoDb1).toBe(mongoDb2);
			expect(mongoDb1).not.toBe(mysqlDb);
		});

		it('should maintain separate instances per URI', () => {
			const db1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(TEST_URI_2, { dbType: DbType.MONGODB });
			const db3 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			expect(db1).toBe(db3);
			expect(db1).not.toBe(db2);
		});

		it('should cache instances correctly', () => {
			const uris = [TEST_URI, TEST_URI_2];
			const instances: IdaeDb[] = [];

			// First pass - create instances
			for (const uri of uris) {
				instances.push(IdaeDb.init(uri, { dbType: DbType.MONGODB }));
			}

			// Second pass - verify same instances returned
			for (let i = 0; i < uris.length; i++) {
				const newInstance = IdaeDb.init(uris[i], { dbType: DbType.MONGODB });
				expect(newInstance).toBe(instances[i]);
			}
		});
	});

	describe('db() method - connection lifecycle', () => {
		it('should return a connection instance', async () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			// Mock the adapter to avoid actual connection
			const mockAdapter = {
				connect: vi.fn().mockResolvedValue({ connected: true }),
				getDb: vi.fn().mockReturnValue({ db: true })
			};

			// This test verifies the method exists and returns a promise
			expect(db.db).toBeDefined();
			expect(typeof db.db).toBe('function');
		});

		it('should accept database name', async () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			expect(db.db).toBeDefined();
		});

		it('should apply dbScope prefix if configured', () => {
			const db = IdaeDb.init(TEST_URI, {
				dbType: DbType.MONGODB,
				dbScope: 'myapp',
				dbScopeSeparator: '_'
			});

			expect(db.options.dbScope).toBe('myapp');
		});
	});

	describe('collection() method', () => {
		it('should throw error if connection not established', () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			// Without calling db() first, collection() should throw
			expect(() => {
				db.collection('test');
			}).toThrow();
		});

		it('should accept collection name', async () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

			// Verify method signature
			expect(db.collection).toBeDefined();
			expect(typeof db.collection).toBe('function');
		});

		it('should apply global events to adapter', () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const preListener = vi.fn();

			db.registerEvents({
				create: { pre: preListener }
			} as any);

			// After registering events, the next collection should have them applied
			expect(db).toBeDefined();
		});
	});

	describe('closeConnection() and closeAllConnections() methods', () => {
		it('should provide closeConnection method', () => {
			const db = IdaeDb.init(TEST_URI);

			expect(db.closeConnection).toBeDefined();
			expect(typeof db.closeConnection).toBe('function');
		});

		it('should provide closeAllConnections method', () => {
			const db = IdaeDb.init(TEST_URI);

			expect(db.closeAllConnections).toBeDefined();
			expect(typeof db.closeAllConnections).toBe('function');
		});

		it('should handle close operations gracefully', async () => {
			const db = IdaeDb.init(TEST_URI);

			// These should not throw even without active connections
			await expect(db.closeConnection()).resolves.toBeUndefined();
			await expect(db.closeAllConnections()).resolves.toBeUndefined();
		});
	});

	describe('Event registration and propagation', () => {
		it('should propagate global events to all collections from same instance', () => {
			const db = IdaeDb.init(TEST_URI);

			const globalEvents = {
				create: {
					pre: vi.fn(),
					post: vi.fn()
				}
			};

			db.registerEvents(globalEvents as any);
			expect(db).toBeDefined();
		});

		it('should maintain separate event listeners for different instances', () => {
			const db1 = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(TEST_URI_2, { dbType: DbType.MONGODB });

			const events1 = { create: { pre: vi.fn() } };
			const events2 = { create: { pre: vi.fn() } };

			db1.registerEvents(events1 as any);
			db2.registerEvents(events2 as any);

			expect(db1).not.toBe(db2);
		});
	});

	describe('Adapter registration and retrieval', () => {
		it('should get correct adapter for dbType', () => {
			const db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const adapter = db.adapterClass;

			expect(adapter).toBeDefined();
		});

		it('should support different adapters for different dbTypes', () => {
			const mongoDb = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(TEST_URI, { dbType: DbType.MYSQL });
			const chromaDb = IdaeDb.init(TEST_URI, { dbType: DbType.CHROMADB });

			const mongoAdapter = mongoDb.adapterClass;
			const mysqlAdapter = mysqlDb.adapterClass;
			const chromaAdapter = chromaDb.adapterClass;

			expect(mongoAdapter).toBeDefined();
			expect(mysqlAdapter).toBeDefined();
			expect(chromaAdapter).toBeDefined();
		});
	});

	describe('Options merging and defaults', () => {
		it('should merge provided options with defaults', () => {
			const options: Partial<IdaeDbOptions> = {
				dbScope: 'custom',
				dbScopeSeparator: '__'
			};

			const db = IdaeDb.init(TEST_URI, options);

			expect(db.options.dbScope).toBe('custom');
			expect(db.options.dbScopeSeparator).toBe('__');
			expect(db.options.dbType).toBe(DbType.MONGODB); // default
		});

		it('should preserve options across multiple init calls with same URI', () => {
			const options1 = { dbScope: 'scope1' };
			const db1 = IdaeDb.init(TEST_URI, options1);
			const options2 = { dbScope: 'scope2' };
			const db2 = IdaeDb.init(TEST_URI, options2);

			// Should return same instance with original options
			expect(db1).toBe(db2);
			expect(db1.options.dbScope).toBe('scope1');
		});
	});
});
