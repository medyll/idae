import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { idaeApi } from '@medyll/idae-api';
import mongoose from 'mongoose';
import { registerDataRoutes } from '../routes/data.js';
import { registerHealthRoutes } from '../routes/health.js';

describe('Data Endpoints (CRUD)', () => {
	const baseUrl = 'http://localhost';
	let app: any;
	let testId: string;

	beforeEach(async () => {
		// Reset singleton for clean state
		(IdaeApi as any).resetInstance?.() || (idaeApi as any).constructor.resetInstance();

		// Connect to memory database
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/idae_machine_test');

		const instance = (idaeApi as any).constructor.getInstance();
		instance.setOptions({ port: 3470, useMemoryDb: true });
		registerHealthRoutes();
		registerDataRoutes();
		await instance.start();
		app = instance.app;
	});

	afterEach(async () => {
		// Clean up test data
		const TestModel = mongoose.models['testcollection'] || mongoose.model('testcollection', new mongoose.Schema({}, { strict: false, collection: 'testcollection' }));
		await TestModel.deleteMany({});

		const instance = (idaeApi as any).constructor.getInstance();
		if (instance.state === 'running') {
			await instance.stop();
		}

		await mongoose.disconnect();
	});

	describe('POST /api/data/:table', () => {
		it('should create a new record', async () => {
			const testData = { name: 'Test Item', value: 100 };

			const response = await request(app)
				.post('/api/data/testcollection')
				.send(testData)
				.expect(201);

			expect(response.body).toHaveProperty('_id');
			expect(response.body.name).toBe('Test Item');
			expect(response.body.value).toBe(100);
			expect(response.body).toHaveProperty('createdAt');
			expect(response.body).toHaveProperty('updatedAt');

			testId = response.body._id;
		});

		it('should reject invalid table names', async () => {
			const response = await request(app)
				.post('/api/data/invalid-table!')
				.send({ name: 'Test' })
				.expect(400);

			expect(response.body).toHaveProperty('error');
		});
	});

	describe('GET /api/data/:table', () => {
		beforeEach(async () => {
			// Seed test data
			const TestModel = mongoose.models['testcollection'] || mongoose.model('testcollection', new mongoose.Schema({}, { strict: false, collection: 'testcollection' }));
			await TestModel.insertMany([
				{ name: 'Item 1', value: 10 },
				{ name: 'Item 2', value: 20 },
				{ name: 'Item 3', value: 30 }
			]);
		});

		it('should return paginated list', async () => {
			const response = await request(app)
				.get('/api/data/testcollection')
				.query({ page: 1, limit: 2 })
				.expect(200);

			expect(response.body).toHaveProperty('data');
			expect(response.body).toHaveProperty('meta');
			expect(response.body.data).toHaveLength(2);
			expect(response.body.meta.total).toBe(3);
			expect(response.body.meta.page).toBe(1);
			expect(response.body.meta.limit).toBe(2);
			expect(response.body.meta.pages).toBe(2);
		});

		it('should support sorting', async () => {
			const response = await request(app)
				.get('/api/data/testcollection')
				.query({ sort: 'value', order: 'desc' })
				.expect(200);

			expect(response.body.data[0].value).toBe(30);
			expect(response.body.data[1].value).toBe(20);
			expect(response.body.data[2].value).toBe(10);
		});

		it('should support filtering', async () => {
			const response = await request(app)
				.get('/api/data/testcollection')
				.query({ 'filter[name]': 'Item 2' })
				.expect(200);

			expect(response.body.data).toHaveLength(1);
			expect(response.body.data[0].name).toBe('Item 2');
		});
	});

	describe('GET /api/data/:table/:id', () => {
		beforeEach(async () => {
			// Create test record
			const TestModel = mongoose.models['testcollection'] || mongoose.model('testcollection', new mongoose.Schema({}, { strict: false, collection: 'testcollection' }));
			const record = await TestModel.create({ name: 'Test Item', value: 42 });
			testId = record._id.toString();
		});

		it('should return single record', async () => {
			const response = await request(app)
				.get(`/api/data/testcollection/${testId}`)
				.expect(200);

			expect(response.body).toHaveProperty('_id', testId);
			expect(response.body.name).toBe('Test Item');
			expect(response.body.value).toBe(42);
		});

		it('should return 404 for non-existent record', async () => {
			const fakeId = new mongoose.Types.ObjectId().toString();

			const response = await request(app)
				.get(`/api/data/testcollection/${fakeId}`)
				.expect(404);

			expect(response.body).toHaveProperty('error');
		});
	});

	describe('PUT /api/data/:table/:id', () => {
		beforeEach(async () => {
			// Create test record
			const TestModel = mongoose.models['testcollection'] || mongoose.model('testcollection', new mongoose.Schema({}, { strict: false, collection: 'testcollection' }));
			const record = await TestModel.create({ name: 'Original', value: 100 });
			testId = record._id.toString();
		});

		it('should update existing record', async () => {
			const updateData = { name: 'Updated', value: 200 };

			const response = await request(app)
				.put(`/api/data/testcollection/${testId}`)
				.send(updateData)
				.expect(200);

			expect(response.body.name).toBe('Updated');
			expect(response.body.value).toBe(200);
			expect(response.body).toHaveProperty('updatedAt');
		});

		it('should return 404 for non-existent record', async () => {
			const fakeId = new mongoose.Types.ObjectId().toString();

			const response = await request(app)
				.put(`/api/data/testcollection/${fakeId}`)
				.send({ name: 'Test' })
				.expect(404);

			expect(response.body).toHaveProperty('error');
		});
	});

	describe('DELETE /api/data/:table/:id', () => {
		beforeEach(async () => {
			// Create test record
			const TestModel = mongoose.models['testcollection'] || mongoose.model('testcollection', new mongoose.Schema({}, { strict: false, collection: 'testcollection' }));
			const record = await TestModel.create({ name: 'To Delete' });
			testId = record._id.toString();
		});

		it('should delete record', async () => {
			await request(app)
				.delete(`/api/data/testcollection/${testId}`)
				.expect(204);

			// Verify deletion
			const TestModel = mongoose.models['testcollection'];
			const record = await TestModel.findById(testId);
			expect(record).toBeNull();
		});

		it('should return 404 for non-existent record', async () => {
			const fakeId = new mongoose.Types.ObjectId().toString();

			const response = await request(app)
				.delete(`/api/data/testcollection/${fakeId}`)
				.expect(404);

			expect(response.body).toHaveProperty('error');
		});
	});
});
