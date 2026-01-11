import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IdaeDb } from '../src/lib/idaeDb.js';
import { DbType } from '../src/lib/@types/types.js';
import { MongoDBAdapter } from '../src/lib/adapters/MongoDBAdapter.js';

describe('MongoDB Adapter Tests', () => {
	let mongoDb: IdaeDb;
	let testCollection: MongoDBAdapter<any>;
  let mongoServer: MongoMemoryServer;
  let uri: string;

	beforeAll(async () => {
		// Start in-memory MongoDB with a smaller binary version for faster download
		mongoServer = await MongoMemoryServer.create({ binary: { version: '4.4.6' } });
		uri = mongoServer.getUri();
		// Initialize the database connection
		mongoDb = IdaeDb.init(uri, {
			dbType: DbType.MONGODB,
			dbScope: 'test'
		});
		await mongoDb.db('idae_test_db');
		testCollection = mongoDb.collection('test_collection') as MongoDBAdapter<any>;
	});

	afterEach(async () => {
		// Clear the test collection after each test
		await testCollection.deleteWhere({ query: {} });
	});

	afterAll(async () => {
		// Close the database connection and stop server
			if (mongoDb) {
				await mongoDb.closeAllConnections();
			}
			if (mongoServer) {
				await mongoServer.stop();
			}
	});

	it('should insert a document', async () => {
		const testDoc = { name: 'Test User', email: 'test@example.com' };
		const created = await testCollection.create(testDoc);
		expect(created).toBeDefined();
		expect(created.name).toBe('Test User');
	});

	it('should find a document', async () => {
		const testDoc = { name: 'Find Test', email: 'find@example.com' };
		await testCollection.create(testDoc);

		const foundDoc = await testCollection.findOne({ query: { email: 'find@example.com' } });
		expect(foundDoc).toBeDefined();
		expect(foundDoc?.name).toBe('Find Test');
	});

	it('should update a document', async () => {
		const testDoc = { name: 'Update Test', email: 'update@example.com' };
		const created = await testCollection.create(testDoc);

		const id = (created as any)._id;
		const updateResult = await testCollection.update(id as any, { name: 'Updated Name' });
		expect(updateResult.modifiedCount).toBe(1);

		const updatedDoc = await testCollection.findOne({ query: { email: 'update@example.com' } });
		expect(updatedDoc?.name).toBe('Updated Name');
	});

	it('should delete a document', async () => {
		const testDoc = { name: 'Delete Test', email: 'delete@example.com' };
		const created = await testCollection.create(testDoc);

		const id = (created as any)._id;
		const deleteResult = await testCollection.deleteById(id as any);
		expect(deleteResult.deletedCount).toBe(1);

		const deletedDoc = await testCollection.findOne({ query: { email: 'delete@example.com' } });
		expect(deletedDoc).toBeNull();
	});

	it('should handle complex queries', async () => {
		await testCollection.create({ name: 'Complex Test 1', age: 25 });
		await testCollection.create({ name: 'Complex Test 2', age: 30 });
		await testCollection.create({ name: 'Complex Test 3', age: 35 });

		const results = await testCollection.find({ query: { age: { $gt: 25 } } });
		expect(results.length).toBe(2);
		expect(results[0].age).toBeGreaterThan(25);
		expect(results[1].age).toBeGreaterThan(25);
	});

	it('should create and use an index', async () => {
		await testCollection.createIndex({ email: 1 }, { unique: true });

		await testCollection.create({ name: 'Index Test', email: 'index@example.com' });

		// This should throw an error due to duplicate email
		await expect(
			testCollection.create({ name: 'Index Test 2', email: 'index@example.com' })
		).rejects.toThrow();
	});
});
