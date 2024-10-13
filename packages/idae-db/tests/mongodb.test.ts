import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { IdaeDb, DbType } from '../src/lib/idaeDb.js';
import { MongoDBAdapter } from '../src/lib/adapters/MongoDBAdapter.js';

describe('MongoDB Adapter Tests', () => {
	let mongoDb: IdaeDb;
	let testCollection: MongoDBAdapter<any>;

	beforeAll(async () => {
		// Initialize the database connection
		mongoDb = IdaeDb.init('mongodb://localhost:27017', {
			dbType: DbType.MONGODB,
			dbScope: 'test_'
		});
		await mongoDb.db('idae_test_db');
		testCollection = mongoDb.collection('test_collection') as MongoDBAdapter<any>;
	});

	afterEach(async () => {
		// Clear the test collection after each test
		await testCollection.deleteWhere({ query: {} });
	});

	afterAll(async () => {
		// Close the database connection
		await mongoDb.closeConnection();
	});

	it('should insert a document', async () => {
		const testDoc = { name: 'Test User', email: 'test@example.com' };
		const result = await testCollection.update('test1', testDoc);
		expect(result.modifiedCount).toBe(1);
	});

	it('should find a document', async () => {
		const testDoc = { name: 'Find Test', email: 'find@example.com' };
		await testCollection.update('find1', testDoc);

		const foundDoc = await testCollection.findOne({ query: { email: 'find@example.com' } });
		expect(foundDoc).toBeDefined();
		expect(foundDoc?.name).toBe('Find Test');
	});

	it('should update a document', async () => {
		const testDoc = { name: 'Update Test', email: 'update@example.com' };
		await testCollection.update('update1', testDoc);

		const updateResult = await testCollection.update('update1', { name: 'Updated Name' });
		expect(updateResult.modifiedCount).toBe(1);

		const updatedDoc = await testCollection.findOne({ query: { email: 'update@example.com' } });
		expect(updatedDoc?.name).toBe('Updated Name');
	});

	it('should delete a document', async () => {
		const testDoc = { name: 'Delete Test', email: 'delete@example.com' };
		await testCollection.update('delete1', testDoc);

		const deleteResult = await testCollection.deleteById('delete1');
		expect(deleteResult.deletedCount).toBe(1);

		const deletedDoc = await testCollection.findOne({ query: { email: 'delete@example.com' } });
		expect(deletedDoc).toBeNull();
	});

	it('should handle complex queries', async () => {
		await testCollection.update('complex1', { name: 'Complex Test 1', age: 25 });
		await testCollection.update('complex2', { name: 'Complex Test 2', age: 30 });
		await testCollection.update('complex3', { name: 'Complex Test 3', age: 35 });

		const results = await testCollection.find({ query: { age: { $gt: 25 } } });
		const docs = await results.toArray();
		expect(docs.length).toBe(2);
		expect(docs[0].age).toBeGreaterThan(25);
		expect(docs[1].age).toBeGreaterThan(25);
	});

	it('should create and use an index', async () => {
		await testCollection.createIndex({ email: 1 }, { unique: true });

		await testCollection.update('index1', { name: 'Index Test', email: 'index@example.com' });

		// This should throw an error due to duplicate email
		await expect(
			testCollection.update('index2', { name: 'Index Test 2', email: 'index@example.com' })
		).rejects.toThrow();
	});
});
