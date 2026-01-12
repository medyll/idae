import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IdaeDb } from '../../src/lib/idaeDb.js';
import { IdaeDbAdapter } from '../../src/lib/IdaeDbAdapter.js';
import { DbType } from '../../src/lib/@types/types.js';
import { MockAdapter } from '../fixtures/mock-adapter.js';
import { TestUser } from '../fixtures/test-data.js';

describe('Error Handling Integration Tests', () => {
	const TEST_URI = 'mock://localhost:27017/test-errors';
	let db: IdaeDb;

	beforeEach(() => {
		IdaeDbAdapter.addAdapter(DbType.MONGODB, MockAdapter as any);
		db = IdaeDb.init(TEST_URI, { dbType: DbType.MONGODB });
	});

	afterEach(async () => {
		await db.closeAllConnections();
	});

	describe('Invalid operations', () => {
		it('should throw error when calling collection() without db()', () => {
			expect(() => {
				db.collection('test');
			}).toThrow('Connection for');
		});

		it('should throw error on invalid adapter type in new db instance', () => {
			const invalidDb = IdaeDb.init(TEST_URI, {
				dbType: 'INVALID_TYPE' as DbType
			});

			expect(() => {
				new IdaeDbAdapter('test', {} as any, invalidDb.options.dbType);
			}).toThrow();
		});
	});

	describe('CRUD operation errors', () => {
		let collection: IdaeDbAdapter<TestUser>;

		beforeEach(async () => {
			const connection = await db.db('test-db');
			collection = db.collection<TestUser>('users');
		});

		it('should throw error when deleting non-existent document', async () => {
			await expect(collection.deleteById('nonexistent')).rejects.toThrow(
				'not found'
			);
		});

		it('should throw error when updating non-existent document', async () => {
			await expect(collection.update('nonexistent', { name: 'Updated' })).rejects.toThrow(
				'not found'
			);
		});

		it('should emit error event on deletion failure', async () => {
			const errorSpy = vi.fn();
			collection.on('error:deleteById', errorSpy);

			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// expected
			}

			expect(errorSpy).toHaveBeenCalled();
		});

		it('should emit error event on update failure', async () => {
			const errorSpy = vi.fn();
			collection.on('error:update', errorSpy);

			try {
				await collection.update('nonexistent', { name: 'New' });
			} catch (e) {
				// expected
			}

			expect(errorSpy).toHaveBeenCalled();
		});
	});

	describe('Error recovery', () => {
		let collection: IdaeDbAdapter<TestUser>;

		beforeEach(async () => {
			const connection = await db.db('test-db');
			collection = db.collection<TestUser>('users');
		});

		it('should allow operations after error', async () => {
			// First operation fails
			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// expected
			}

			// Second operation succeeds
			const created = await collection.create({ name: 'Success', email: 'success@test.com' });
			expect(created).toHaveProperty('_id');
		});

		it('should handle consecutive errors', async () => {
			const errors: any[] = [];

			collection.on('error:deleteById', (err) => errors.push(err));

			try {
				await collection.deleteById('nonexistent1');
			} catch (e) {
				// expected
			}

			try {
				await collection.deleteById('nonexistent2');
			} catch (e) {
				// expected
			}

			expect(errors).toHaveLength(2);
		});

		it('should allow error listener to handle errors gracefully', async () => {
			const handleError = vi.fn();

			collection.on('error:deleteById', (err) => {
				handleError(err.message);
			});

			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// Error is handled by listener and also thrown
			}

			expect(handleError).toHaveBeenCalled();
		});
	});

	describe('Transaction error handling', () => {
		let collection: IdaeDbAdapter<TestUser>;

		beforeEach(async () => {
			const connection = await db.db('test-db');
			collection = db.collection<TestUser>('users');
		});

		it('should handle errors in transaction callback', async () => {
			const callback = vi.fn().mockRejectedValue(new Error('Transaction failed'));

			await expect(collection.transaction(callback)).rejects.toThrow('Transaction failed');
		});

		it('should emit error event on transaction failure', async () => {
			const errorSpy = vi.fn();
			collection.on('error:transaction', errorSpy);

			const callback = vi.fn().mockRejectedValue(new Error('Txn error'));

			try {
				await collection.transaction(callback);
			} catch (e) {
				// expected
			}

			expect(errorSpy).toHaveBeenCalled();
		});

		it('should still emit pre event even if transaction fails', async () => {
			const preSpy = vi.fn();
			collection.on('pre:transaction', preSpy);

			const callback = vi.fn().mockRejectedValue(new Error('Txn error'));

			try {
				await collection.transaction(callback);
			} catch (e) {
				// expected
			}

			expect(preSpy).toHaveBeenCalled();
		});
	});

	describe('Global error handling', () => {
		it('should handle global error listeners', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const globalErrors: any[] = [];

			collection.on('error:deleteById', (err) => globalErrors.push(err));
			collection.on('error:update', (err) => globalErrors.push(err));

			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// expected
			}

			try {
				await collection.update('nonexistent', { name: 'New' });
			} catch (e) {
				// expected
			}

			expect(globalErrors).toHaveLength(2);
		});

		it('should allow registering error handlers through registerEvents', async () => {
			const connection = await db.db('test-db');
			const collection = db.collection<TestUser>('users');

			const errorHandlers = {
				deleteById: vi.fn()
			};

			collection.registerEvents({
				deleteById: {
					error: errorHandlers.deleteById
				}
			});

			try {
				await collection.deleteById('nonexistent');
			} catch (e) {
				// expected
			}

			expect(errorHandlers.deleteById).toHaveBeenCalled();
		});
	});

	describe('Error propagation', () => {
		let collection: IdaeDbAdapter<TestUser>;

		beforeEach(async () => {
			const connection = await db.db('test-db');
			collection = db.collection<TestUser>('users');
		});

		it('should propagate error after emitting error event', async () => {
			const errorListener = vi.fn();
			collection.on('error:deleteById', errorListener);

			await expect(collection.deleteById('nonexistent')).rejects.toThrow();
			expect(errorListener).toHaveBeenCalled();
		});

		it('should allow catching thrown errors', async () => {
			let caughtError: Error | null = null;

			try {
				await collection.deleteById('nonexistent');
			} catch (err) {
				caughtError = err as Error;
			}

			expect(caughtError).not.toBeNull();
			expect(caughtError?.message).toContain('not found');
		});

		it('should not prevent error propagation even if listener throws', async () => {
			collection.on('error:deleteById', () => {
				throw new Error('Listener error');
			});

			// The error from deleteById should still be thrown
			await expect(collection.deleteById('nonexistent')).rejects.toThrow();
		});
	});

	describe('Concurrent operation errors', () => {
		let collection: IdaeDbAdapter<TestUser>;

		beforeEach(async () => {
			const connection = await db.db('test-db');
			collection = db.collection<TestUser>('users');
		});

		it('should handle errors from concurrent operations', async () => {
			const errors: any[] = [];

			collection.on('error:deleteById', (err) => errors.push(err));

			// Run multiple concurrent delete operations
			const promises = [
				collection.deleteById('nonexistent1').catch(() => {}),
				collection.deleteById('nonexistent2').catch(() => {}),
				collection.deleteById('nonexistent3').catch(() => {})
			];

			await Promise.all(promises);

			expect(errors.length).toBeGreaterThan(0);
		});

		it('should maintain error isolation in concurrent operations', async () => {
			const errorLog: string[] = [];

			collection.on('error:deleteById', (err) => {
				errorLog.push(`delete:${err.message}`);
			});

			collection.on('error:update', (err) => {
				errorLog.push(`update:${err.message}`);
			});

			const ops = [
				collection.deleteById('nonexistent').catch(() => {}),
				collection.update('nonexistent', { name: 'New' }).catch(() => {})
			];

			await Promise.all(ops);

			expect(errorLog.length).toBeGreaterThanOrEqual(2);
		});
	});
});
