import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IdaeDb } from '../../src/lib/idaeDb.js';
import { IdaeDbAdapter } from '../../src/lib/IdaeDbAdapter.js';
import { DbType } from '../../src/lib/@types/types.js';
import { MockAdapter } from '../fixtures/mock-adapter.js';
import { TestUser, testUsers } from '../fixtures/test-data.js';

describe('Singleton and Multiple Database Instances Integration', () => {
	beforeEach(() => {
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MockAdapter as any);
		IdaeDbAdapter.addAdapter(DbType.MYSQL, MockAdapter as any);
	});

	afterEach(async () => {
		// Cleanup any open connections
	});

	describe('Singleton pattern verification', () => {
		it('should return same instance for identical parameters', () => {
			const uri = 'mock://localhost:27017/db1';
			const options = { dbType: DbType.MONGODB };

			const db1 = IdaeDb.init(uri, options);
			const db2 = IdaeDb.init(uri, options);
			const db3 = IdaeDb.init(uri, options);

			expect(db1).toBe(db2);
			expect(db2).toBe(db3);
		});

		it('should create different instances for different URIs', () => {
			const uri1 = 'mock://localhost:27017/db1';
			const uri2 = 'mock://localhost:27017/db2';
			const uri3 = 'mock://localhost:3306/db3';

			const db1 = IdaeDb.init(uri1, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(uri2, { dbType: DbType.MONGODB });
			const db3 = IdaeDb.init(uri3, { dbType: DbType.MONGODB });

			expect(db1).not.toBe(db2);
			expect(db2).not.toBe(db3);
			expect(db1).not.toBe(db3);
		});

		it('should create different instances for different dbTypes', () => {
			const uri = 'mock://localhost:27017/db';

			const mongoDb = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(uri, { dbType: DbType.MYSQL });
			const chromaDb = IdaeDb.init(uri, { dbType: DbType.CHROMADB });

			expect(mongoDb).not.toBe(mysqlDb);
			expect(mysqlDb).not.toBe(chromaDb);
			expect(mongoDb).not.toBe(chromaDb);
		});

		it('should preserve instance identity across module boundaries', () => {
			const uri = 'mock://localhost:27017/test';
			const options = { dbType: DbType.MONGODB };

			// Simulate getting instances from different parts of app
			const serviceADb = IdaeDb.init(uri, options);
			const serviceBDb = IdaeDb.init(uri, options);
			const serviceCDb = IdaeDb.init(uri, options);

			expect(serviceADb).toBe(serviceBDb);
			expect(serviceBDb).toBe(serviceCDb);
		});
	});

	describe('Multiple database instances isolation', () => {
		it('should isolate data between instances', async () => {
			const db1 = IdaeDb.init('mock://db1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://db2', { dbType: DbType.MONGODB });

			const conn1 = await db1.db('testDb');
			const conn2 = await db2.db('testDb');

			const col1 = db1.collection<TestUser>('users');
			const col2 = db2.collection<TestUser>('users');

			const user1 = await col1.create({ name: 'Alice', email: 'alice@db1.com', age: 25, active: true });
			const user2 = await col2.create({ name: 'Bob', email: 'bob@db2.com', age: 30, active: true });

			expect(col1).not.toBe(col2);
			expect((user1 as any)._id).toBeDefined();
			expect((user2 as any)._id).toBeDefined();
		});

		it('should maintain separate connections per instance', async () => {
			const db1 = IdaeDb.init('mock://uri1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://uri2', { dbType: DbType.MONGODB });

			const conn1 = await db1.db('db1');
			const conn2 = await db2.db('db2');

			expect(conn1).not.toBe(conn2);
			expect(conn1.uri).toBe('mock://uri1');
			expect(conn2.uri).toBe('mock://uri2');
		});

		it('should isolate event listeners between instances', async () => {
			const db1 = IdaeDb.init('mock://uri1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://uri2', { dbType: DbType.MONGODB });

			const conn1 = await db1.db('db1');
			const conn2 = await db2.db('db2');

			const col1 = db1.collection<TestUser>('users');
			const col2 = db2.collection<TestUser>('users');

			const events1 = { createCount: 0 };
			const events2 = { createCount: 0 };

			col1.on('post:create', () => events1.createCount++);
			col2.on('post:create', () => events2.createCount++);

			await col1.create({ name: 'Test1', email: 'test1@db1.com', age: 25, active: true });
			expect(events1.createCount).toBe(1);
			expect(events2.createCount).toBe(0);

			await col2.create({ name: 'Test2', email: 'test2@db2.com', age: 30, active: true });
			expect(events1.createCount).toBe(1);
			expect(events2.createCount).toBe(1);
		});
	});

	describe('Same instance reuse across operations', () => {
		it('should maintain same instance across multiple operations', async () => {
			const uri = 'mock://localhost:27017/app';
			const options = { dbType: DbType.MONGODB };

			const db = IdaeDb.init(uri, options);

			const conn1 = await db.db('testDb');
			const col1 = db.collection<TestUser>('users');
			await col1.create({ name: 'User1', email: 'user1@test.com', age: 25, active: true });

			const col2 = db.collection<TestUser>('products');
			await col2.createIndex('name');

			// Both collections should share same db instance
			const db2 = IdaeDb.init(uri, options);
			expect(db).toBe(db2);
		});

		it('should allow sequential operations on same instance', async () => {
			const uri = 'mock://localhost/app';
			const db = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const conn = await db.db('testDb');

			const users = db.collection<TestUser>('users');
			const products = db.collection<any>('products');

			// Multiple sequential operations
			await users.create({ name: 'User', email: 'user@test.com', age: 25, active: true });
			await products.create({ name: 'Product', price: 100, stock: 5, category: 'Test' });

			const allUsers = await users.find({});
			const allProducts = await products.find({});

			expect(allUsers.length).toBeGreaterThan(0);
			expect(allProducts.length).toBeGreaterThan(0);
		});
	});

	describe('Database type isolation', () => {
		it('should handle MongoDB and MySQL instances separately', () => {
			const uri = 'mock://localhost/shared';

			const mongoDb = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(uri, { dbType: DbType.MYSQL });
			const chromaDb = IdaeDb.init(uri, { dbType: DbType.CHROMADB });

			expect(mongoDb).not.toBe(mysqlDb);
			expect(mysqlDb).not.toBe(chromaDb);

			expect(mongoDb.options.dbType).toBe(DbType.MONGODB);
			expect(mysqlDb.options.dbType).toBe(DbType.MYSQL);
			expect(chromaDb.options.dbType).toBe(DbType.CHROMADB);
		});

		it('should use correct adapter for each database type', () => {
			const uri = 'mock://localhost/adapter-test';

			const mongoDb = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const mysqlDb = IdaeDb.init(uri, { dbType: DbType.MYSQL });

			const mongoAdapter = mongoDb.adapterClass;
			const mysqlAdapter = mysqlDb.adapterClass;

			expect(mongoAdapter).toBeDefined();
			expect(mysqlAdapter).toBeDefined();
			expect(mongoDb.options.dbType).toBe(DbType.MONGODB);
			expect(mysqlDb.options.dbType).toBe(DbType.MYSQL);
		});
	});

	describe('Connection key generation', () => {
		it('should generate unique keys for different configurations', () => {
			const configs = [
				{ uri: 'mongo://db1', type: DbType.MONGODB },
				{ uri: 'mongo://db2', type: DbType.MONGODB },
				{ uri: 'mongo://db1', type: DbType.MYSQL },
				{ uri: 'mysql://db1', type: DbType.MONGODB }
			];

			const instances = configs.map((config) =>
				IdaeDb.init(config.uri, { dbType: config.type })
			);

			const keys = instances.map((db) => db.connectionKey);
			const uniqueKeys = new Set(keys);

			// All keys should be unique since configs are different
			expect(uniqueKeys.size).toBe(configs.length);
		});

		it('should generate identical keys for identical parameters', () => {
			const uri = 'mock://localhost/key-test';
			const options = { dbType: DbType.MONGODB };

			const db1 = IdaeDb.init(uri, options);
			const db2 = IdaeDb.init(uri, options);

			expect(db1.connectionKey).toBe(db2.connectionKey);
		});
	});

	describe('Global event management', () => {
		it('should apply global events only to target instance', async () => {
			const db1 = IdaeDb.init('mock://uri1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://uri2', { dbType: DbType.MONGODB });

			const counts = { db1Creates: 0, db2Creates: 0 };

			db1.registerEvents({
				create: { post: () => counts.db1Creates++ }
			} as any);

			db2.registerEvents({
				create: { post: () => counts.db2Creates++ }
			} as any);

			const conn1 = await db1.db('db1');
			const conn2 = await db2.db('db2');

			await db1.collection<TestUser>('users').create({
				name: 'Test',
				email: 'test@db1.com',
				age: 25,
				active: true
			});

			expect(counts.db1Creates).toBeGreaterThan(0);
			expect(counts.db2Creates).toBe(0);
		});
	});

	describe('Multiple collections per instance', () => {
		it('should handle multiple collections on same instance', async () => {
			const db = IdaeDb.init('mock://localhost/collections', { dbType: DbType.MONGODB });
			const conn = await db.db('testDb');

			const users = db.collection<TestUser>('users');
			const products = db.collection<any>('products');
			const orders = db.collection<any>('orders');

			// All should be able to operate independently
			const user = await users.create({ name: 'User', email: 'user@test.com', age: 25, active: true });
			const product = await products.create({ name: 'Product', price: 100, stock: 5, category: 'Test' });
			const order = await orders.create({
				userId: (user as any)._id,
				productId: (product as any)._id,
				quantity: 1,
				total: 100,
				status: 'pending'
			});

			expect(user).toHaveProperty('_id');
			expect(product).toHaveProperty('_id');
			expect(order).toHaveProperty('_id');
		});
	});

	describe('Concurrent instance operations', () => {
		it('should handle concurrent operations on different instances', async () => {
			const db1 = IdaeDb.init('mock://db1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://db2', { dbType: DbType.MONGODB });

			const conn1 = await db1.db('testDb');
			const conn2 = await db2.db('testDb');

			const col1 = db1.collection<TestUser>('users');
			const col2 = db2.collection<TestUser>('users');

			const ops = testUsers.slice(0, 2).map((user, idx) => {
				const collection = idx % 2 === 0 ? col1 : col2;
				return collection.create(user);
			});

			const results = await Promise.all(ops);

			expect(results).toHaveLength(2);
			results.forEach((result) => {
				expect(result).toHaveProperty('_id');
			});
		});

		it('should maintain isolation during concurrent operations', async () => {
			const uris = ['mock://concurrent1', 'mock://concurrent2', 'mock://concurrent3'];
			const dbs = uris.map((uri) => IdaeDb.init(uri, { dbType: DbType.MONGODB }));

			const conns = await Promise.all(dbs.map((db) => db.db('testDb')));

			const collections = dbs.map((db) => db.collection<TestUser>('users'));

			const createOps = collections.map((col, idx) =>
				col.create({
					...testUsers[idx],
					name: `User${idx}`
				})
			);

			const results = await Promise.all(createOps);

			expect(results).toHaveLength(3);
			expect(results[0]).toHaveProperty('name', 'User0');
			expect(results[1]).toHaveProperty('name', 'User1');
			expect(results[2]).toHaveProperty('name', 'User2');
		});
	});

	describe('Instance lifecycle', () => {
		it('should create instance on first init', () => {
			const uri = 'mock://lifecycle1';
			const db = IdaeDb.init(uri, { dbType: DbType.MONGODB });

			expect(db).toBeDefined();
			expect(db.uri).toBe(uri);
		});

		it('should reuse instance on subsequent inits', () => {
			const uri = 'mock://lifecycle2';
			const db1 = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init(uri, { dbType: DbType.MONGODB });
			const db3 = IdaeDb.init(uri, { dbType: DbType.MONGODB });

			expect(db1).toBe(db2);
			expect(db2).toBe(db3);
		});

		it('should handle closing individual connections', async () => {
			const uri = 'mock://lifecycle3';
			const db = IdaeDb.init(uri, { dbType: DbType.MONGODB });

			const conn = await db.db('testDb');
			await db.closeConnection();

			// Instance should still exist
			expect(db).toBeDefined();
		});

		it('should handle closing all connections', async () => {
			const uri = 'mock://lifecycle4';
			const db = IdaeDb.init(uri, { dbType: DbType.MONGODB });

			await db.db('db1');
			await db.db('db2');

			await db.closeAllConnections();

			// Instance should still exist
			expect(db).toBeDefined();
		});
	});
});
