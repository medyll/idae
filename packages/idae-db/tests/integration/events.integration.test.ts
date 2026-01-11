import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IdaeDb } from '../../src/lib/idaeDb.js';
import { DbType } from '../../src/lib/@types/types.js';
import { IdaeDbAdapter } from '../../src/lib/IdaeDbAdapter.js';
import { MockAdapter } from '../fixtures/mock-adapter.js';
import { testUsers, TestUser } from '../fixtures/test-data.js';

describe('Event System Integration Tests', () => {
	const TEST_URI = 'mock://localhost:27017/test-events';
	let db: IdaeDb;

	beforeEach(() => {
		// Register MockAdapter
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MockAdapter as any);
		db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
	});

	afterEach(async () => {
		await db.closeAllConnections();
	});

	describe('Global event propagation', () => {
		it('should apply global events to all collections', async () => {
			const globalCreatePre = vi.fn();
			const globalCreatePost = vi.fn();

			db.registerEvents({
				create: {
					pre: globalCreatePre,
					post: globalCreatePost
				}
			} as any);

			// Connect and get collection
			const connection = await db.db('test-db');
			const usersCollection = db.collection<TestUser>('users');

			// Perform operation
			await usersCollection.create({ name: 'John', email: 'john@test.com' });

			// Events should be emitted
			expect(globalCreatePre).toHaveBeenCalled();
			expect(globalCreatePost).toHaveBeenCalled();
		});

		it('should propagate multiple event types', async () => {
			const events = {
				create: { pre: vi.fn(), post: vi.fn() },
				update: { pre: vi.fn(), post: vi.fn() },
				deleteById: { pre: vi.fn(), post: vi.fn() }
			};

			db.registerEvents(events as any);

			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('test-collection');

			// Create
			const created = await collection.create({ name: 'Test', email: 'test@test.com' });
			expect(events.create.pre).toHaveBeenCalled();
			expect(events.create.post).toHaveBeenCalled();

			// Update
			const id = (created as any)._id;
			await collection.update(id, { name: 'Updated' });
			expect(events.update.pre).toHaveBeenCalled();
			expect(events.update.post).toHaveBeenCalled();

			// Delete
			await collection.deleteById(id);
			expect(events.deleteById.pre).toHaveBeenCalled();
			expect(events.deleteById.post).toHaveBeenCalled();
		});

		it('should separate events between different db instances', async () => {
			const db1 = IdaeDb.init('mock://uri1', { dbType: DbType.MONGODB });
			const db2 = IdaeDb.init('mock://uri2', { dbType: DbType.MONGODB });

			const events1 = { create: { pre: vi.fn() } };
			const events2 = { create: { pre: vi.fn() } };

			db1.registerEvents(events1 as any);
			db2.registerEvents(events2 as any);

			// Both should be independent
			expect(db1).not.toBe(db2);
		});

		it('should handle event listeners added after global registration', async () => {
			db.registerEvents({
				create: { pre: vi.fn() }
			} as any);

			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			// Add additional listener
			const additionalListener = vi.fn();
			collection.on('pre:create', additionalListener);

			await collection.create({ name: 'Test', email: 'test@test.com' });

			expect(additionalListener).toHaveBeenCalled();
		});
	});

	describe('Error propagation through event system', () => {
		it('should emit error events on operation failure', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const errorListener = vi.fn();
			collection.on('error:deleteById', errorListener);

			// Try to delete non-existent document
			try {
				await collection.deleteById('nonexistent-id');
			} catch (e) {
				// expected
			}

			expect(errorListener).toHaveBeenCalled();
		});

		it('should allow error event handlers', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const errors: Error[] = [];

			collection.on('error:deleteById', (err) => {
				errors.push(err);
			});

			try {
				await collection.deleteById('nonexistent-id');
			} catch (e) {
				// handled
			}

			expect(errors).toHaveLength(1);
			expect(errors[0]).toBeInstanceOf(Error);
		});

		it('should emit error for all failed operations', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const errorHandlers = {
				create: vi.fn(),
				update: vi.fn(),
				delete: vi.fn()
			};

			collection.on('error:create', errorHandlers.create);
			collection.on('error:update', errorHandlers.update);
			collection.on('error:deleteById', errorHandlers.delete);

			// Only delete should error
			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// expected
			}

			expect(errorHandlers.delete).toHaveBeenCalled();
		});
	});

	describe('Event listener lifecycle', () => {
		it('should support adding listeners after collection creation', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const listener = vi.fn();
			collection.on('pre:create', listener);

			await collection.create({ name: 'Test', email: 'test@test.com' });

			expect(listener).toHaveBeenCalled();
		});

		it('should support removing listeners', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const listener = vi.fn();
			collection.on('pre:create', listener);

			// Remove listener
			collection.off('pre:create', listener);

			await collection.create({ name: 'Test', email: 'test@test.com' });

			expect(listener).not.toHaveBeenCalled();
		});

		it('should support once() for single-fire listeners', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const listener = vi.fn();
			collection.once('pre:create', listener);

			await collection.create({ name: 'Test1', email: 'test1@test.com' });
			await collection.create({ name: 'Test2', email: 'test2@test.com' });

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe('Event data consistency', () => {
		it('should pass correct data to pre/post events', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const preData: any = {};
			const postData: any = {};

			collection.on('pre:create', (...args) => {
				preData.args = args;
			});

			collection.on('post:create', (...args) => {
				postData.args = args;
			});

			const userData = { name: 'Alice', email: 'alice@test.com' };
			const result = await collection.create(userData);

			expect(preData.args[0]).toEqual(userData);
			expect(postData.args[0]).toHaveProperty('_id');
			expect(postData.args[1]).toEqual(userData);
		});

		it('should maintain event data integrity across multiple operations', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const operations: any[] = [];

			collection.on('pre:create', (data) => {
				operations.push({ type: 'pre:create', data });
			});

			collection.on('post:create', (result, data) => {
				operations.push({ type: 'post:create', result, data });
			});

			await collection.create({ name: 'User1', email: 'user1@test.com' });
			await collection.create({ name: 'User2', email: 'user2@test.com' });

			expect(operations).toHaveLength(4); // 2 creates * (pre + post)
			expect(operations[0].data.name).toBe('User1');
			expect(operations[2].data.name).toBe('User2');
		});
	});

	describe('Complex event scenarios', () => {
		it('should handle nested operations with events', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const eventLog: string[] = [];

			collection.on('pre:create', () => eventLog.push('pre:create'));
			collection.on('post:create', () => eventLog.push('post:create'));
			collection.on('pre:find', () => eventLog.push('pre:find'));
			collection.on('post:find', () => eventLog.push('post:find'));

			const created = await collection.create({ name: 'Test', email: 'test@test.com' });
			const found = await collection.findOne({});

			expect(eventLog).toContain('pre:create');
			expect(eventLog).toContain('post:create');
			expect(eventLog).toContain('pre:find');
			expect(eventLog).toContain('post:find');
		});

		it('should handle multiple concurrent operations', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const createCounts = {
				pre: 0,
				post: 0
			};

			collection.on('pre:create', () => createCounts.pre++);
			collection.on('post:create', () => createCounts.post++);

			const ops = testUsers.map((user) => collection.create(user));
			await Promise.all(ops);

			expect(createCounts.pre).toBeGreaterThan(0);
			expect(createCounts.post).toBeGreaterThan(0);
		});
	});
});

describe('Connection Lifecycle Integration', () => {
	const TEST_URI = 'mock://localhost:27017/test-lifecycle';
	let db: IdaeDb;

	beforeEach(() => {
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MockAdapter as any);
	});

	afterEach(async () => {
		if (db) {
			await db.closeAllConnections();
		}
	});

	it('should manage connection state through db() and collection()', async () => {
		db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

		const connection = await db.db('test-db');
		expect(connection).toBeDefined();

		const collection = db.collection<TestUser>('users');
		expect(collection).toBeDefined();

		// Operations should work
		const result = await collection.create({ name: 'Test', email: 'test@test.com' });
		expect(result).toHaveProperty('_id');
	});

	it('should throw when collection() called without db()', () => {
		db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

		expect(() => {
			db.collection<TestUser>('users');
		}).toThrow();
	});

	it('should reuse connection on multiple db() calls', async () => {
		db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });

		const conn1 = await db.db('test-db');
		const conn2 = await db.db('test-db');

		expect(conn1).toBe(conn2);
	});
});
