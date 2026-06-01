import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { idaeApi } from '@medyll/idae-api';
import { registerHealthRoutes } from '../routes/health.js';

describe('Health Endpoints', () => {
	beforeEach(() => {
		(idaeApi as any).constructor?.resetInstance?.();
	});

	afterEach(async () => {
		const instance = (idaeApi as any).constructor.getInstance();
		if (instance.state === 'running') {
			await instance.stop();
		}
	});

	describe('GET /health', () => {
		it('should return health status', async () => {
			const instance = (idaeApi as any).constructor.getInstance();
			instance.setOptions({ port: 3456, useMemoryDb: true });
			registerHealthRoutes();
			await instance.start();

			const response = await request(instance.app).get('/health');

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('status', 'ok');
		});
	});
});
