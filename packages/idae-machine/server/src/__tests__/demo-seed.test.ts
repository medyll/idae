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
		invalidateBaseCache();

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

	it('category: 3 rows', async () => {
		expect(await getCollection('category').countDocuments()).toBe(3);
	});

	it('location_office: 2 rows', async () => {
		expect(await getCollection('location_office').countDocuments()).toBe(2);
	});

	it('vehicle: 3 rows', async () => {
		expect(await getCollection('vehicle').countDocuments()).toBe(3);
	});

	it('customer: 2 rows', async () => {
		expect(await getCollection('customer').countDocuments()).toBe(2);
	});

	it('rental: 1 row', async () => {
		expect(await getCollection('rental').countDocuments()).toBe(1);
	});

	it('maintenance: 1 row', async () => {
		expect(await getCollection('maintenance').countDocuments()).toBe(1);
	});

	// ── FK integrity ──────────────────────────────────────────────────────────────

	it('rental.vehicleId resolves to existing vehicle', async () => {
		const rental  = await getCollection('rental').findOne({ id: 1 }).lean() as any;
		expect(rental).toBeTruthy();
		const vehicle = await getCollection('vehicle').findOne({ id: rental.vehicleId }).lean();
		expect(vehicle).toBeTruthy();
	});

	it('rental.customerId resolves to existing customer', async () => {
		const rental   = await getCollection('rental').findOne({ id: 1 }).lean() as any;
		const customer = await getCollection('customer').findOne({ id: rental.customerId }).lean();
		expect(customer).toBeTruthy();
	});

	it('maintenance.vehicleId resolves to existing vehicle', async () => {
		const m       = await getCollection('maintenance').findOne({ id: 1 }).lean() as any;
		const vehicle = await getCollection('vehicle').findOne({ id: m.vehicleId }).lean();
		expect(vehicle).toBeTruthy();
	});

	it('all vehicle.categoryId values resolve in category', async () => {
		const vehicles = await getCollection('vehicle').find({}).lean() as any[];
		const catIds   = [...new Set(vehicles.map((v) => v.categoryId))];
		const cats     = await getCollection('category').find({ id: { $in: catIds } }).lean();
		expect(cats.length).toBe(catIds.length);
	});

	it('all vehicle.locationOfficeId values resolve in location_office', async () => {
		const vehicles  = await getCollection('vehicle').find({}).lean() as any[];
		const officeIds = [...new Set(vehicles.map((v) => v.locationOfficeId))];
		const offices   = await getCollection('location_office').find({ id: { $in: officeIds } }).lean();
		expect(offices.length).toBe(officeIds.length);
	});

	// ── domain invariants ─────────────────────────────────────────────────────────

	it('vehicle statuses are valid enum values', async () => {
		const valid    = new Set(['available', 'rented', 'maintenance', 'retired']);
		const vehicles = await getCollection('vehicle').find({}).lean() as any[];
		for (const v of vehicles) {
			expect(valid.has(v.status), `unexpected status: ${v.status}`).toBe(true);
		}
	});

	it('2 vehicles are available', async () => {
		const count = await getCollection('vehicle').countDocuments({ status: 'available' });
		expect(count).toBe(2);
	});

	it('rental status is completed', async () => {
		const rental = await getCollection('rental').findOne({ id: 1 }).lean() as any;
		expect(rental.status).toBe('completed');
	});
});
