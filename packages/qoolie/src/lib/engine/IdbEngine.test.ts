import { describe, it, expect, beforeEach } from 'vitest';
import { createDb, IdbEngine } from './IdbEngine';
import { IdbSchema } from './IdbSchema';
import type { IdbqModel } from './types';

interface User {
	id: string;
	name: string;
	email: string;
}

interface Task {
	id: string;
	title: string;
	userId: string;
}

const testModel: IdbqModel<{ users: User; tasks: Task }> = {
	users: {
		keyPath: 'id',
		model: {},
		ts: {} as User,
		template: {
			index: 'id',
			presentation: 'name',
			fields: { id: 'text', name: 'text', email: 'text' },
			fks: {}
		}
	},
	tasks: {
		keyPath: 'id',
		model: {},
		ts: {} as Task,
		template: {
			index: 'id',
			presentation: 'title',
			fields: { id: 'text', title: 'text', userId: 'text' },
			fks: {}
		}
	}
};

describe('IdbSchema', () => {
	it('should create an object store', () => {
		const schema = new IdbSchema();
		expect(typeof schema.createStore).toBe('function');
	});

	it('should create schema with multiple stores', async () => {
		const schema = new IdbSchema();
		const db = await openTestDbWithSchema('schema-test-1', 1, {
			users: 'id',
			tasks: 'id, userId'
		}, schema);

		expect(db.objectStoreNames.contains('users')).toBe(true);
		expect(db.objectStoreNames.contains('tasks')).toBe(true);

		db.close();
	});

	it('should handle auto-increment key paths', async () => {
		const schema = new IdbSchema();
		const db = await openTestDbWithSchema('schema-test-2', 1, {
			logs: '++id, timestamp, message'
		}, schema);

		expect(db.objectStoreNames.contains('logs')).toBe(true);

		db.close();
	});
});

describe('IdbEngine', () => {
	it('should create engine instance', () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-1');
		expect(idbDatabase).toBeInstanceOf(IdbEngine);
		expect(idbDatabase.schema).toBeDefined();
		expect(idbDatabase.idbqModel).toBe(testModel);
	});

	it('should expose collection accessors', () => {
		const { idbql } = createDb(testModel, 1).create('engine-test-2');
		expect(idbql.users).toBeDefined();
		expect(idbql.users.name).toBe('users');
		expect(idbql.users.keyPath).toBe('id');
		expect(idbql.tasks).toBeDefined();
	});

	it('should open database and create stores', async () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-3');
		await idbDatabase.open();

		expect(idbDatabase.idbDatabase).toBeDefined();
		expect(idbDatabase.idbDatabase?.objectStoreNames.contains('users')).toBe(true);
		expect(idbDatabase.idbDatabase?.objectStoreNames.contains('tasks')).toBe(true);

		idbDatabase.close();
	});

	it('should support transactions', async () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-4');
		await idbDatabase.open();

		const result = await idbDatabase.transaction('users', 'readwrite', async (tx) => {
			const store = tx.objectStore('users');
			store.add({ id: 'u1', name: 'Alice', email: 'alice@test.com' });
			return 'committed';
		});

		expect(result).toBe('committed');
		idbDatabase.close();
	});

	it('should throw if transaction called before open', async () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-5');

		await expect(
			idbDatabase.transaction('users', 'readonly', async () => 'ok')
		).rejects.toThrow('Database not initialized');
	});

	it('should close database connection', async () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-6');
		await idbDatabase.open();
		expect(idbDatabase.idbDatabase).toBeDefined();

		idbDatabase.close();
		expect(idbDatabase.idbDatabase).toBeUndefined();
	});

	it('should return collection info', () => {
		const { idbDatabase } = createDb(testModel, 1).create('engine-test-7');
		const info = idbDatabase.getCollectionInfo('users');
		expect(info).toEqual({ keyPath: 'id' });
	});
});

describe('createDb factory', () => {
	it('should return createDb result with all fields', async () => {
		const result = createDb(testModel, 1).create('factory-test-1');

		expect(result).toHaveProperty('idbDatabase');
		expect(result).toHaveProperty('idbql');
		expect(result).toHaveProperty('idbqModel');
		expect(result.idbqModel).toBe(testModel);

		await result.idbDatabase.open();
		expect(result.idbDatabase.idbDatabase).toBeDefined();
		result.idbDatabase.close();
	});

	it('should allow data operations after open', async () => {
		const { idbDatabase } = createDb(testModel, 1).create('factory-test-2');
		await idbDatabase.open();

		// Add a record via transaction, awaiting the request
		await idbDatabase.transaction('users', 'readwrite', async (tx) => {
			const store = tx.objectStore('users');
			const request = store.add({ id: 'u1', name: 'Bob', email: 'bob@test.com' });
			return new Promise((resolve, reject) => {
				request.onsuccess = () => resolve('added');
				request.onerror = () => reject(request.error);
			});
		});

		// Read it back
		const user = await idbDatabase.transaction('users', 'readonly', async (tx) => {
			const store = tx.objectStore('users');
			const request = store.get('u1');
			return new Promise((resolve, reject) => {
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
		});

		expect((user as any).name).toBe('Bob');
		expect((user as any).email).toBe('bob@test.com');

		idbDatabase.close();
	});
});

// Helper to open a raw IDBDatabase for schema tests
function openTestDb(name: string, version: number): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(name, version);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

// Helper to open a DB and create schema in onupgradeneeded
function openTestDbWithSchema(
	name: string,
	version: number,
	storeConfig: Record<string, string>,
	schema: IdbSchema
): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(name, version);
		request.onupgradeneeded = async (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			await schema.createSchema(db, storeConfig);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}
