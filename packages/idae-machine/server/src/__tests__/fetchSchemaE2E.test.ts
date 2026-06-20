/**
 * E2E test: real Express server → machineServer.getModel() → MachineModel
 *
 * Spins up a minimal HTTP server (port 0) serving GET /api/scheme from MongoDB,
 * then verifies machineServer.getModel() returns the expected demoScheme collections.
 *
 * Run: cd server && pnpm vitest run src/__tests__/fetchSchemaE2E.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { createServer, type Server } from 'http';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { machineServer } from '../MachineServer.js';
import { publishModel, seedIdaeRegistries } from '../bootstrap/publishModel.js';
import { demoScheme } from '../models/demo/demoScheme.js';
import { invalidateBaseCache } from '../middleware/dbRouter.js';

const TEST_ORG = 'vitest_e2e';
const META_DB  = `${TEST_ORG}_machine_app`;

const META_COLLECTIONS = [
	'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
	'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
	'appscheme_has_field', 'appscheme_view',
];

let httpServer: Server;
let baseUrl: string;

describe('fetchSchema E2E: real HTTP → machineServer', () => {
	beforeAll(async () => {
		// Deploy demoScheme into vitest_e2e org
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		invalidateBaseCache();
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await publishModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });

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
		app.get('/api/scheme/:table', async (req, res) => {
			try {
				const model = await machineServer.getModel(req.params.table);
				if (!model[req.params.table]) {
					res.status(404).json({ error: `Scheme '${req.params.table}' not found` });
					return;
				}
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

	it('/api/scheme returns all demoScheme collections', async () => {
		const res   = await fetch(`${baseUrl}/api/scheme`);
		const model = await res.json() as Record<string, unknown>;
		expect(res.status).toBe(200);
		const expected = Object.keys(demoScheme);
		for (const col of expected) {
			expect(model, `missing: ${col}`).toHaveProperty(col);
		}
	});

	it('/api/scheme/:table returns 404 for unknown collection', async () => {
		const res = await fetch(`${baseUrl}/api/scheme/nonexistent`);
		expect(res.status).toBe(404);
	});

	it('machineServer.getModel() returns model with correct fields for vehicle', async () => {
		const model = await machineServer.getModel();
		expect(model.vehicle).toBeDefined();
		expect(model.vehicle.fields).toHaveProperty('license_plate');
		expect(model.vehicle.fields).toHaveProperty('model');
		expect(model.vehicle.fields).toHaveProperty('mileage');
	});

	it('machineServer.getModel() returns FK definitions for vehicle', async () => {
		const model = await machineServer.getModel();
		expect(model.vehicle.fks).toHaveProperty('category');
		expect(model.vehicle.fks).toHaveProperty('location_office');
	});

	it('machineServer.getModel() returns FK definitions for rental', async () => {
		const model = await machineServer.getModel();
		expect(model.rental).toBeDefined();
		expect(model.rental.fks).toHaveProperty('vehicle');
		expect(model.rental.fks).toHaveProperty('customer');
	});

	it('machineServer.getModel() includes _views for collections', async () => {
		const model = await machineServer.getModel();
		expect(model.vehicle).toBeDefined();
		const vehicle = model.vehicle;
		expect(vehicle._views).toBeDefined();
		expect(Array.isArray(vehicle._views.focus)).toBe(true);
	});
});
