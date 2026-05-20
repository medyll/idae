import { describe, it, expect, afterEach } from 'vitest';
import { IdbCollection } from './IdbCollection';
import { IdbEventBus, idbEventBus } from './IdbEventBus';

const TEST_STORE = 'users';
const TEST_KEYPATH = 'id';

interface User {
	id: string;
	name: string;
	email: string;
	age?: number;
}

let dbCounter = 0;

function getTestDbName(): string {
	return `collection-test-${++dbCounter}`;
}

async function setup(dbName: string, eventBus?: IdbEventBus): Promise<IdbCollection<User>> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(dbName, 1);
		req.onupgradeneeded = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(TEST_STORE)) {
				db.createObjectStore(TEST_STORE, { keyPath: TEST_KEYPATH });
			}
		};
		req.onsuccess = () => {
			req.result.close();
			resolve(new IdbCollection<User>(TEST_STORE, TEST_KEYPATH, { dbName, version: 1 }, eventBus));
		};
		req.onerror = () => reject(req.error);
	});
}

function teardown(dbName: string): Promise<void> {
	return new Promise((resolve) => {
		const req = indexedDB.deleteDatabase(dbName);
		req.onsuccess = () => resolve();
		req.onerror = () => resolve(); // ignore errors
		req.onblocked = () => resolve();
	});
}

describe('IdbCollection', () => {
	afterEach(async () => {
		idbEventBus.dataState = {};
	});

	describe('add', () => {
		it('should add a record', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			const result = await col.add({ id: 'u1', name: 'Alice', email: 'alice@test.com' });

			expect(result).toBeDefined();
			expect((result as User).id).toBe('u1');
			expect((result as User).name).toBe('Alice');
			await teardown(dbName);
		});

		it('should emit add event', async () => {
			const dbName = getTestDbName();
			const bus = new IdbEventBus();
			const col = await setup(dbName, bus);

			let emitted: any;
			bus.on(TEST_STORE, (detail) => { emitted = detail; });

			await col.add({ id: 'u1', name: 'Bob', email: 'bob@test.com' });

			expect(emitted).toBeDefined();
			expect(emitted.op).toBe('add');
			expect(emitted.data.name).toBe('Bob');
			await teardown(dbName);
		});
	});

	describe('get', () => {
		it('should get a record by id', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'alice@test.com' });

			const user = await col.get('u1');
			expect(user.name).toBe('Alice');
			await teardown(dbName);
		});
	});

	describe('getAll', () => {
		it('should return all records', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'a@test.com' });
			await col.add({ id: 'u2', name: 'Bob', email: 'b@test.com' });
			await col.add({ id: 'u3', name: 'Charlie', email: 'c@test.com' });

			const all = await col.getAll();
			expect(all).toHaveLength(3);
			await teardown(dbName);
		});
	});

	describe('put', () => {
		it('should upsert a record', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'alice@test.com' });

			const updated = await col.put({ id: 'u1', name: 'Alice Updated', email: 'alice@new.com' });
			expect((updated as User).name).toBe('Alice Updated');

			const fetched = await col.get('u1');
			expect(fetched.name).toBe('Alice Updated');
			await teardown(dbName);
		});
	});

	describe('update', () => {
		it('should merge data into existing record', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'alice@test.com', age: 30 });

			const updated = await col.update('u1', { age: 31 });
			expect((updated as User).name).toBe('Alice');
			expect((updated as User).age).toBe(31);
			await teardown(dbName);
		});
	});

	describe('delete', () => {
		it('should delete a record', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'alice@test.com' });

			const result = await col.delete('u1');
			expect(result).toBe(true);

			const all = await col.getAll();
			expect(all).toHaveLength(0);
			await teardown(dbName);
		});
	});

	describe('where', () => {
		it('should filter by direct equality', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', email: 'a@test.com', age: 30 });
			await col.add({ id: 'u2', name: 'Bob', email: 'b@test.com', age: 25 });
			await col.add({ id: 'u3', name: 'Charlie', email: 'c@test.com', age: 30 });

			const result = await col.where({ age: 30 } as any);
			expect(result).toHaveLength(2);
			await teardown(dbName);
		});

		it('should filter with gt operator', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', age: 30 });
			await col.add({ id: 'u2', name: 'Bob', age: 25 });
			await col.add({ id: 'u3', name: 'Charlie', age: 35 });

			const result = await col.where({ age: { gt: 28 } } as any);
			expect(result).toHaveLength(2);
			await teardown(dbName);
		});

		it('should filter with in operator', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice' });
			await col.add({ id: 'u2', name: 'Bob' });
			await col.add({ id: 'u3', name: 'Charlie' });

			const result = await col.where({ name: { in: ['Alice', 'Charlie'] } } as any);
			expect(result).toHaveLength(2);
			await teardown(dbName);
		});

		it('should filter with contains operator', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice Smith' });
			await col.add({ id: 'u2', name: 'Bob Jones' });
			await col.add({ id: 'u3', name: 'Alice Brown' });

			const result = await col.where({ name: { contains: 'Alice' } } as any);
			expect(result).toHaveLength(2);
			await teardown(dbName);
		});

		it('should support sorting', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Charlie', age: 35 });
			await col.add({ id: 'u2', name: 'Alice', age: 30 });
			await col.add({ id: 'u3', name: 'Bob', age: 25 });

			const result = await col.where({}, { sortBy: { name: 'asc' } });
			expect(result[0].name).toBe('Alice');
			expect(result[2].name).toBe('Charlie');
			await teardown(dbName);
		});

		it('should support first/last', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice' });
			await col.add({ id: 'u2', name: 'Bob' });

			const result = await col.where({});
			expect(result.first()?.name).toBe('Alice');
			expect(result.last()?.name).toBe('Bob');
			await teardown(dbName);
		});
	});

	describe('updateWhere', () => {
		it('should update all matching records', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', age: 30 });
			await col.add({ id: 'u2', name: 'Bob', age: 30 });
			await col.add({ id: 'u3', name: 'Charlie', age: 25 });

			await col.updateWhere({ age: 30 } as any, { age: 31 });

			const all = await col.getAll();
			expect(all.find((u) => u.id === 'u1')?.age).toBe(31);
			expect(all.find((u) => u.id === 'u2')?.age).toBe(31);
			expect(all.find((u) => u.id === 'u3')?.age).toBe(25);
			await teardown(dbName);
		});
	});

	describe('deleteWhere', () => {
		it('should delete all matching records', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', age: 30 });
			await col.add({ id: 'u2', name: 'Bob', age: 30 });
			await col.add({ id: 'u3', name: 'Charlie', age: 25 });

			await col.deleteWhere({ age: 30 } as any);

			const all = await col.getAll();
			expect(all).toHaveLength(1);
			expect(all[0].name).toBe('Charlie');
			await teardown(dbName);
		});
	});

	describe('count', () => {
		it('should count all records without query', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice' });
			await col.add({ id: 'u2', name: 'Bob' });
			await col.add({ id: 'u3', name: 'Charlie' });

			const total = await col.count();
			expect(total).toBe(3);
			await teardown(dbName);
		});

		it('should count matching records with query', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			await col.add({ id: 'u1', name: 'Alice', age: 30 });
			await col.add({ id: 'u2', name: 'Bob', age: 25 });
			await col.add({ id: 'u3', name: 'Charlie', age: 30 });

			const count = await col.count({ age: 30 } as any);
			expect(count).toBe(2);
			await teardown(dbName);
		});
	});

	describe('batchAdd', () => {
		it('should add multiple records in one transaction', async () => {
			const dbName = getTestDbName();
			const col = await setup(dbName);
			const results = await col.batchAdd([
				{ id: 'u1', name: 'Alice', email: 'a@test.com' },
				{ id: 'u2', name: 'Bob', email: 'b@test.com' },
				{ id: 'u3', name: 'Charlie', email: 'c@test.com' }
			]);

			expect(results).toHaveLength(3);
			const all = await col.getAll();
			expect(all).toHaveLength(3);
			await teardown(dbName);
		});
	});

	describe('silent mode', () => {
		it('should not emit events when silent=true', async () => {
			const dbName = getTestDbName();
			const bus = new IdbEventBus();
			const col = await setup(dbName, bus);

			let emitted = false;
			bus.on(TEST_STORE, () => { emitted = true; });

			await col.add({ id: 'u1', name: 'Silent', email: 's@test.com' }, { silent: true });
			expect(emitted).toBe(false);
			await teardown(dbName);
		});
	});
});
