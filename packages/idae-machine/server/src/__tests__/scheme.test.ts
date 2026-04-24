import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { idaeApi } from '@medyll/idae-api';
import mongoose from 'mongoose';
import { registerSchemeRoutes } from '../routes/scheme.js';
import { registerHealthRoutes } from '../routes/health.js';
import { AppScheme } from '../models/AppScheme.js';

describe('Scheme Endpoints', () => {
	beforeEach(async () => {
		// Reset singleton for clean state
		(IdaeApi as any).resetInstance?.() || (idaeApi as any).constructor.resetInstance();

		// Connect to memory database
		await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/idae_machine_test');
	});

	afterEach(async () => {
		// Clean up test data
		await AppScheme.deleteMany({});

		const instance = (idaeApi as any).constructor.getInstance();
		if (instance.state === 'running') {
			await instance.stop();
		}

		await mongoose.disconnect();
	});

	describe('GET /api/scheme', () => {
		it('should return empty array when no schemes exist', async () => {
			const instance = (idaeApi as any).constructor.getInstance();
			instance.setOptions({ port: 3457, useMemoryDb: true });
			registerHealthRoutes();
			registerSchemeRoutes();
			await instance.start();

			const response = await request(instance.app).get('/api/scheme');

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('schemes');
			expect(response.body.schemes).toBeInstanceOf(Array);
			expect(response.body.schemes).toHaveLength(0);
		});

		it('should return all schemes', async () => {
			// Seed test data
			await AppScheme.create({
				idappscheme: '1',
				code: 'produit',
				name: 'Produits',
				_views: {
					entityModel: [{ field_name: 'nomProduit', title: 'Nom' }],
					listView: [{ field_name: 'nomProduit', title: 'Nom' }],
					miniView: [{ field_name: 'nomProduit', title: 'Nom' }]
				}
			});

			await AppScheme.create({
				idappscheme: '2',
				code: 'client',
				name: 'Clients',
				_views: {
					entityModel: [{ field_name: 'nomClient', title: 'Nom' }],
					listView: [{ field_name: 'nomClient', title: 'Nom' }],
					miniView: [{ field_name: 'nomClient', title: 'Nom' }]
				}
			});

			const instance = (idaeApi as any).constructor.getInstance();
			instance.setOptions({ port: 3458, useMemoryDb: true });
			registerHealthRoutes();
			registerSchemeRoutes();
			await instance.start();

			const response = await request(instance.app).get('/api/scheme');

			expect(response.status).toBe(200);
			expect(response.body.schemes).toHaveLength(2);
			expect(response.body.schemes[0]).toHaveProperty('code');
			expect(response.body.schemes[0]).toHaveProperty('name');
			expect(response.body.schemes[0]).toHaveProperty('_views');
		});
	});

	describe('GET /api/scheme/:table', () => {
		it('should return 404 for unknown table', async () => {
			const instance = (idaeApi as any).constructor.getInstance();
			instance.setOptions({ port: 3459, useMemoryDb: true });
			registerHealthRoutes();
			registerSchemeRoutes();
			await instance.start();

			const response = await request(instance.app).get('/api/scheme/unknown');

			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty('error');
		});

		it('should return single scheme by code', async () => {
			// Seed test data
			await AppScheme.create({
				idappscheme: '1',
				code: 'produit',
				name: 'Produits',
				_views: {
					entityModel: [{ field_name: 'nomProduit', title: 'Nom' }],
					listView: [{ field_name: 'nomProduit', title: 'Nom' }],
					miniView: [{ field_name: 'nomProduit', title: 'Nom' }]
				}
			});

			const instance = (idaeApi as any).constructor.getInstance();
			instance.setOptions({ port: 3460, useMemoryDb: true });
			registerHealthRoutes();
			registerSchemeRoutes();
			await instance.start();

			const response = await request(instance.app).get('/api/scheme/produit');

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty('code', 'produit');
			expect(response.body).toHaveProperty('name', 'Produits');
			expect(response.body).toHaveProperty('_views');
			expect(response.body._views).toHaveProperty('entityModel');
			expect(response.body._views).toHaveProperty('listView');
			expect(response.body._views).toHaveProperty('miniView');
		});
	});
});
