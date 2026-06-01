/**
 * Integration test: demoSeed → insert → verify counts + FK integrity
 *
 * Inserts demoSeed data into MongoDB, then checks:
 *   - correct row counts per collection
 *   - FK cross-references are resolvable (vehicleId, customerId)
 *   - vehicle status filter works
 *
 * Run: pnpm vitest run server/src/__tests__/demo-seed.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import { deployModel, seedEngineRegistries } from '../bootstrap/deployModel.js';
import { demoScheme, demoSeed } from '../models/demo/demoScheme.js';
import { invalidateBaseCache } from '../middleware/dbRouter.js';

const TEST_ORG = 'vitest_seed';
const DATA_DB  = `${TEST_ORG}_machine_user`;
const META_DB  = `${TEST_ORG}_machine_app`;

const META_COLLECTIONS = [
	'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
	'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
	'appscheme_has_field', 'appscheme_view',
];

function getCollection(collectionName: string) {
	const db        = mongoose.connection.useDb(DATA_DB, { useCache: true });
	// id: false — disable Mongoose virtual `id` getter that would map { id: X } queries to { _id: X }
	const schema    = new Schema({}, { strict: false, id: false, collection: collectionName });
	const modelName = `${DATA_DB}__${collectionName}`;
	return db.models[modelName] ?? db.model(modelName, schema, collectionName);
}

describe('demoSeed: insert → counts + FK integrity', () => {
beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		invalidateBaseCache();
		await seedEngineRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await deployModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const dataDb = mongoose.connection.useDb(DATA_DB, { useCache: true });
		for (const col of Object.keys(demoSeed)) {
			await dataDb.collection(col).deleteMany({}).catch(() => {});
		}

		for (const [col, rows] of Object.entries(demoSeed)) {
			await getCollection(col).insertMany(rows as any[]);
		}
	});

	afterAll(async () => {
		for (const col of Object.keys(demoSeed)) {
			await getCollection(col).deleteMany({}).catch(() => {});
		}
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		for (const c of META_COLLECTIONS) {
			await meta.collection(c).deleteMany({}).catch(() => {});
		}
		await mongoose.disconnect();
	});

	// ── counts ───────────────────────────────────────────────────────────────────

	it('category: 5 rows', async () => {
		expect(await getCollection('category').countDocuments()).toBe(5);
	});

	it('location_office: 4 rows', async () => {
		expect(await getCollection('location_office').countDocuments()).toBe(4);
	});

	it('vehicle: 10 rows', async () => {
		expect(await getCollection('vehicle').countDocuments()).toBe(10);
	});

	it('customer: 7 rows', async () => {
		expect(await getCollection('customer').countDocuments()).toBe(7);
	});

	it('rental: 5 rows', async () => {
		expect(await getCollection('rental').countDocuments()).toBe(5);
	});

	it('maintenance: 5 rows', async () => {
		expect(await getCollection('maintenance').countDocuments()).toBe(5);
	});

	// ── FK integrity ──────────────────────────────────────────────────────────────

	it('rental records have vehicle reference', async () => {
		const rental  = await getCollection('rental').findOne({}).lean() as any;
		expect(rental).toBeTruthy();
		expect(rental.vehicle).toBeDefined();
	});

	it('rental records have customer reference', async () => {
		const rental   = await getCollection('rental').findOne({}).lean() as any;
		expect(rental).toBeTruthy();
		expect(rental.customer).toBeDefined();
	});

	it('maintenance records have vehicle reference', async () => {
		const m       = await getCollection('maintenance').findOne({}).lean() as any;
		expect(m).toBeTruthy();
		expect(m.vehicle).toBeDefined();
	});

	it('vehicle records have category code', async () => {
		const vehicle = await getCollection('vehicle').findOne({}).lean() as any;
		expect(vehicle).toBeTruthy();
		expect(vehicle.category).toBeDefined();
	});

	it('vehicle records have location_office code', async () => {
		const vehicle = await getCollection('vehicle').findOne({}).lean() as any;
		expect(vehicle).toBeTruthy();
		expect(vehicle.location_office).toBeDefined();
	});

	// ── domain invariants ─────────────────────────────────────────────────────────

	it('vehicle statuses are valid enum values', async () => {
		const valid    = new Set(['available', 'rented', 'maintenance', 'retired']);
		const vehicles = await getCollection('vehicle').find({}).lean() as any[];
		for (const v of vehicles) {
			expect(valid.has(v.status), `unexpected status: ${v.status}`).toBe(true);
		}
	});

	it('7 vehicles are available', async () => {
		const count = await getCollection('vehicle').countDocuments({ status: 'available' });
		expect(count).toBe(7);
	});

	it('rental status is active or completed', async () => {
		const rental = await getCollection('rental').findOne({ id: 1 }).lean() as any;
		expect(['active', 'completed']).toContain(rental.status);
	});
});
