// packages\idae-api\tests\api.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { apiServer } from '$lib/apiServer';

describe('API Server Tests', () => {
	beforeAll(async () => {
		apiServer.setOptions({
			port: 3000,
			enableAuth: true,
			jwtSecret: 'test_secret',
			tokenExpiration: '1h'
		});
		await apiServer.start();
	});

	afterAll(async () => {
		await apiServer.stop();
	});

	let authToken: string;

	describe('Authentication', () => {
		it('should login successfully', async () => {
			const res = await request(apiServer.app)
				.post('/login')
				.send({ username: 'admin', password: 'password' });
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token');
			authToken = res.body.token;
		});

		it('should fail login with incorrect credentials', async () => {
			const res = await request(apiServer.app)
				.post('/login')
				.send({ username: 'admin', password: 'wrongpassword' });
			expect(res.status).toBe(401);
		});
	});

	describe('CRUD Operations', () => {
		describe('Without Authentication', () => {
			it('should fail to create a new item', async () => {
				const res = await request(apiServer.app)
					.post('/testCollection')
					.send({ name: 'Test Item' });
				expect(res.status).toBe(401);
			});

			it('should fail to get all items', async () => {
				const res = await request(apiServer.app).get('/testCollection');
				expect(res.status).toBe(401);
			});

			it('should fail to get a specific item', async () => {
				const res = await request(apiServer.app).get('/testCollection/someId');
				expect(res.status).toBe(401);
			});

			it('should fail to update an item', async () => {
				const res = await request(apiServer.app)
					.put('/testCollection/someId')
					.send({ name: 'Updated Test Item' });
				expect(res.status).toBe(401);
			});

			it('should fail to delete an item', async () => {
				const res = await request(apiServer.app).delete('/testCollection/someId');
				expect(res.status).toBe(401);
			});
		});

		describe('With Authentication', () => {
			it('should create a new item', async () => {
				const res = await request(apiServer.app)
					.post('/testCollection')
					.set('Authorization', `Bearer ${authToken}`)
					.send({ name: 'Test Item' });
				expect(res.status).toBe(201);
				expect(res.body).toHaveProperty('_id');
			});

			it('should get all items', async () => {
				const res = await request(apiServer.app)
					.get('/testCollection')
					.set('Authorization', `Bearer ${authToken}`);
				expect(res.status).toBe(200);
				expect(Array.isArray(res.body)).toBeTruthy();
			});

			it('should get a specific item', async () => {
				// Assuming we know an ID, replace 'knownId' with an actual ID
				const res = await request(apiServer.app)
					.get('/testCollection/knownId')
					.set('Authorization', `Bearer ${authToken}`);
				expect(res.status).toBe(200);
				expect(res.body).toHaveProperty('_id');
			});

			it('should update an item', async () => {
				// Assuming we know an ID, replace 'knownId' with an actual ID
				const res = await request(apiServer.app)
					.put('/testCollection/knownId')
					.set('Authorization', `Bearer ${authToken}`)
					.send({ name: 'Updated Test Item' });
				expect(res.status).toBe(200);
				expect(res.body.name).toBe('Updated Test Item');
			});

			it('should delete an item', async () => {
				// Assuming we know an ID, replace 'knownId' with an actual ID
				const res = await request(apiServer.app)
					.delete('/testCollection/knownId')
					.set('Authorization', `Bearer ${authToken}`);
				expect(res.status).toBe(200);
			});
		});
	});

	describe('Custom Routes', () => {
		it('should handle public custom route', async () => {
			const res = await request(apiServer.app).get('/public/custom/route');
			expect(res.status).toBe(200);
			// Add more specific expectations based on your custom route
		});

		it('should handle protected custom route', async () => {
			const res = await request(apiServer.app)
				.get('/protected/custom/route')
				.set('Authorization', `Bearer ${authToken}`);
			expect(res.status).toBe(200);
			// Add more specific expectations based on your custom route
		});

		it('should fail to access protected custom route without token', async () => {
			const res = await request(apiServer.app).get('/protected/custom/route');
			expect(res.status).toBe(401);
		});
	});
});
