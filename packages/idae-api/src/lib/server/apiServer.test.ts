import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { idaeApi } from '@medyll/idae-api';
import request from 'supertest';

describe('@medyll/idae-api', () => {
	beforeAll(async () => {
		// Configure and start the server
		idaeApi.setOptions({
			port: 3000,
			enableAuth: false,
			onInUse: 'reboot'
		});
		await idaeApi.start();
	});

	afterAll(async () => {
		await idaeApi.stop();
	});

	describe('CRUD operations', () => {
		const testData = { name: 'Test Item', value: 42 };
		let createdItemId: string;

		it('CREATE - should create a new item in the default database', async () => {
			const response = await request(idaeApi.app).post('/testCollection').send(testData);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('_id');
			createdItemId = response.body._id;
		});

		it('READ - should retrieve the created item', async () => {
			const response = await request(idaeApi.app).get(`/testCollection/${createdItemId}`);

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject(testData);
		});

		// ... autres tests CRUD ...
	});

	describe('Database and collection naming', () => {
		it('should handle dbName.collectionName format', async () => {
			const response = await request(idaeApi.app)
				.post('/testDb.testCollection')
				.send({ name: 'Test Item' });

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('_id');
		});

		// ... autres tests de nommage ...
	});

	// ... autres suites de tests ...
});
