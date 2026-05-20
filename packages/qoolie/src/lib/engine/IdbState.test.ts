import { describe, it, expect, afterEach } from 'vitest';
import { IdbCollection } from './IdbCollection';
import { CollectionState, createIdbState } from './IdbState';
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
	return `state-test-${++dbCounter}`;
}

async function setup(dbName: string, eventBus?: IdbEventBus) {
	const bus = eventBus || new IdbEventBus();

	// Create DB and store
	await new Promise<void>((resolve, reject) => {
		const req = indexedDB.open(dbName, 1);
		req.onupgradeneeded = (e) => {
			const db = (e.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(TEST_STORE)) {
				db.createObjectStore(TEST_STORE, { keyPath: TEST_KEYPATH });
			}
		};
		req.onsuccess = () => {
			req.result.close();
			resolve();
		};
		req.onerror = () => reject(req.error);
	});

	const col = new IdbCollection<User>(TEST_STORE, TEST_KEYPATH, { dbName, version: 1 }, bus);
	const state = new CollectionState<User>(TEST_STORE, col, bus);

	return { col, state, bus, dbName };
}

function teardown(dbName: string): Promise<void> {
	return new Promise((resolve) => {
		const req = indexedDB.deleteDatabase(dbName);
		req.onsuccess = () => resolve();
		req.onerror = () => resolve();
		req.onblocked = () => resolve();
	});
}

describe('CollectionState', () => {
	afterEach(() => {
		idbEventBus.dataState = {};
	});

	it('should initialize with empty dataState', async () => {
		const dbName = getTestDbName();
		const { state, bus } = await setup(dbName);

		expect(bus.dataState['users']).toBeDefined();
		expect(bus.dataState['users']).toEqual([]);
		await teardown(dbName);
	});

	it('should getAll from dataState', async () => {
		const dbName = getTestDbName();
		const { state, col } = await setup(dbName);

		await col.add({ id: 'u1', name: 'Alice', email: 'a@test.com' });
		await col.add({ id: 'u2', name: 'Bob', email: 'b@test.com' });

		// Wait for event bus to update dataState
		const all = state.getAll();
		expect(all).toHaveLength(2);
		await teardown(dbName);
	});

	it('should reflect add in dataState immediately', async () => {
		const dbName = getTestDbName();
		const { state, col } = await setup(dbName);

		await col.add({ id: 'u1', name: 'Alice', email: 'a@test.com' });

		const all = state.getAll();
		expect(all).toHaveLength(1);
		expect(all[0].name).toBe('Alice');
		await teardown(dbName);
	});

	it('should where query dataState', async () => {
		const dbName = getTestDbName();
		const { state, col } = await setup(dbName);

		await col.add({ id: 'u1', name: 'Alice', age: 30 });
		await col.add({ id: 'u2', name: 'Bob', age: 25 });
		await col.add({ id: 'u3', name: 'Charlie', age: 30 });

		const result = state.where({ age: 30 } as any);
		expect(result).toHaveLength(2);
		await teardown(dbName);
	});

	it('should get by id', async () => {
		const dbName = getTestDbName();
		const { state, col } = await setup(dbName);

		await col.add({ id: 'u1', name: 'Alice', email: 'a@test.com' });

		const user = state.get('u1');
		expect(user).toBeDefined();
		expect(user?.name).toBe('Alice');
		await teardown(dbName);
	});

	it('should delegate put to collection', async () => {
		const dbName = getTestDbName();
		const { state } = await setup(dbName);

		await state.add({ id: 'u1', name: 'Alice', email: 'a@test.com' } as User);
		await state.put({ id: 'u1', name: 'Alice Updated' } as User);

		const user = state.get('u1');
		expect(user?.name).toBe('Alice Updated');
		await teardown(dbName);
	});

	it('should delegate update to collection', async () => {
		const dbName = getTestDbName();
		const { state } = await setup(dbName);

		await state.add({ id: 'u1', name: 'Alice', email: 'a@test.com', age: 30 } as User);
		await state.update('u1', { age: 31 });

		const user = state.get('u1');
		expect(user?.age).toBe(31);
		expect(user?.name).toBe('Alice'); // preserved
		await teardown(dbName);
	});

	it('should delegate delete to collection', async () => {
		const dbName = getTestDbName();
		const { state } = await setup(dbName);

		await state.add({ id: 'u1', name: 'Alice', email: 'a@test.com' } as User);
		await state.delete('u1');

		const all = state.getAll();
		expect(all).toHaveLength(0);
		await teardown(dbName);
	});

	it('should delegate count to collection', async () => {
		const dbName = getTestDbName();
		const { state } = await setup(dbName);

		await state.add({ id: 'u1', name: 'Alice' } as User);
		await state.add({ id: 'u2', name: 'Bob' } as User);
		await state.add({ id: 'u3', name: 'Charlie' } as User);

		const total = await state.count();
		expect(total).toBe(3);
		await teardown(dbName);
	});
});

describe('createIdbState', () => {
	it('should create state map for multiple collections', async () => {
		const dbName = getTestDbName();
		const bus = new IdbEventBus();

		// Create DB with two stores
		await new Promise<void>((resolve, reject) => {
			const req = indexedDB.open(dbName, 1);
			req.onupgradeneeded = (e) => {
				const db = (e.target as IDBOpenDBRequest).result;
				db.createObjectStore('users', { keyPath: 'id' });
				db.createObjectStore('tasks', { keyPath: 'id' });
			};
			req.onsuccess = () => { req.result.close(); resolve(); };
			req.onerror = () => reject(req.error);
		});

		const collections = {
			users: new IdbCollection('users', 'id', { dbName, version: 1 }, bus),
			tasks: new IdbCollection('tasks', 'id', { dbName, version: 1 }, bus)
		};

		const { collectionState, qolie } = createIdbState<{ users: User; tasks: { id: string; title: string } }>(collections, bus);

		expect(collectionState.users).toBeDefined();
		expect(collectionState.tasks).toBeDefined();

		// qolie helper
		const usersQolie = qolie('users');
		expect(usersQolie).toBeInstanceOf(CollectionState);

		// Should throw for non-existent collection
		expect(() => qolie('nonexistent')).toThrow('Collection nonexistent not found');

		await teardown(dbName);
	});
});
