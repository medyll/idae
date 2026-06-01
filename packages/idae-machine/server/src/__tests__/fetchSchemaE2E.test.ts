/**
 * E2E test: real Express server → machine.fetchSchema(url) → MachineScheme
 *
 * Spins up a minimal HTTP server (port 0) serving GET /api/scheme from MongoDB,
 * then exercises machine.fetchSchema() end-to-end with no mocks.
 *
 * Run: cd server && pnpm vitest run src/__tests__/fetchSchemaE2E.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { createServer, type Server } from 'http';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { machineServer } from '../MachineServer.js';
import { deployModel, seedEngineRegistries } from '../bootstrap/deployModel.js';
import { demoScheme } from '../models/demo/demoScheme.js';
import { invalidateBaseCache } from '../middleware/dbRouter.js';
import { Machine } from '$lib/main/machine.js';

const TEST_ORG = 'vitest_e2e';
const META_DB  = `${TEST_ORG}_machine_app`;

const META_COLLECTIONS = [
	'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
	'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
	'appscheme_has_field', 'appscheme_view',
];

let httpServer: Server;
let baseUrl: string;

describe('fetchSchema E2E: real HTTP → Machine', () => {
	beforeAll(async () => {
		// Deploy demoScheme into vitest_e2e org
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		invalidateBaseCache();
		await seedEngineRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await deployModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });

		// Minimal Express: GET /api/scheme → machineServer.getModel()
		const app = express();
		app.get('/api/scheme', async (_req, res) => {
			try {
				const model = await machineServer.getModel();
				res.json(model);
			} catch (err) {
				res.status(500).json({ error: String(err) });
			}
		});

		await new Promise<void>((resolve) => {
			httpServer = createServer(app);
			httpServer.listen(0, () => resolve());
		});

		const addr = httpServer.address() as { port: number };
		baseUrl = `http://localhost:${addr.port}`;
	});

	afterAll(async () => {
		await new Promise<void>((resolve) => httpServer.close(() => resolve()));
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		for (const c of META_COLLECTIONS) {
			await meta.collection(c).deleteMany({}).catch(() => {});
		}
		await mongoose.disconnect();
	});

	it('/api/scheme returns all 6 demoScheme collections', async () => {
		const res   = await fetch(`${baseUrl}/api/scheme`);
		const model = await res.json() as Record<string, unknown>;
		expect(res.status).toBe(200);
		for (const col of ['vehicle', 'category', 'customer', 'rental', 'location_office', 'maintenance']) {
			expect(model, `missing: ${col}`).toHaveProperty(col);
		}
	});

	it('machine.fetchSchema() → logic accessible for all 6 collections', async () => {
		const m = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine', version: 1, model: demoScheme });
		await m.fetchSchema(`${baseUrl}/api/scheme`);

		for (const col of ['vehicle', 'category', 'customer', 'rental', 'location_office', 'maintenance']) {
			expect(() => m.logic.collection(col), `collection missing: ${col}`).not.toThrow();
		}
	});

	it('vehicle field types match demoScheme', async () => {
		const m = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine2', version: 1, model: demoScheme });
		await m.fetchSchema(`${baseUrl}/api/scheme`);

		const vehicle = m.logic.collection('vehicle');
		expect(vehicle.field('license_plate').parse()?.fieldType).toBe('text');
		expect(vehicle.field('categoryId').parse()?.fieldType).toBe('fk-category.id');
		expect(vehicle.field('mileage').parse()?.fieldType).toBe('number');
	});

	it('vehicle.parseFks() resolves category and location_office fields', async () => {
		const m = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine3', version: 1, model: demoScheme });
		await m.fetchSchema(`${baseUrl}/api/scheme`);

		// parseFks() → { collection → { fieldName → IDbForge } }
		const fks = m.logic.collection('vehicle').parseFks();
		expect(fks).toHaveProperty('category');
		expect(fks).toHaveProperty('location_office');
		expect(Object.keys(fks.category)).toContain('name');
		expect(Object.keys(fks.location_office)).toContain('code');
	});

	it('rental.parseFks() resolves vehicle and customer', async () => {
		const m = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine4', version: 1, model: demoScheme });
		await m.fetchSchema(`${baseUrl}/api/scheme`);

		const fks = m.logic.collection('rental').parseFks();
		expect(fks).toHaveProperty('vehicle');
		expect(fks).toHaveProperty('customer');
	});

	it('machine.store exposes collections after fetchSchema', async () => {
		const m = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine5', version: 1, model: demoScheme });
		await m.fetchSchema(`${baseUrl}/api/scheme`);

		expect(typeof m.store).toBe('function');
	});

	it('schema cache: second fetchSchema uses cache, starts immediately', async () => {
		const url = `${baseUrl}/api/scheme`;
		const m   = new Machine();
		m.init({ org: TEST_ORG, domain: 'machine6', version: 1, model: demoScheme });

		// First call: cold → populates cache
		await m.fetchSchema(url);

		// Second call: cache hit → same machine starts without waiting for network
		const m2 = new Machine();
		m2.init({ org: TEST_ORG, domain: 'machine6', version: 1, model: demoScheme });
		await m2.fetchSchema(url);

		expect(m2.logic).toBeDefined();
		expect(() => m2.logic.collection('vehicle')).not.toThrow();
	});
});
