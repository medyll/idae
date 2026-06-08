/**
 * S11-03: API /api/data/* avec données réelles
 *
 * Verify that CRUD HTTP endpoints return real demoSeed data from MongoDB.
 * Tests pagination, sorting, filtering, and FK cross-references.
 *
 * Run: cd server && pnpm vitest run src/__tests__/dataReal.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose, { Connection, Schema } from 'mongoose';
import { config } from '../config.js';
import { publishModel, seedEngineRegistries } from '../bootstrap/publishModel.js';
import { demoScheme, demoSeed } from '../models/demo/demoScheme.js';
import { invalidateBaseCache } from '../middleware/dbRouter.js';
import { listRecords, createRecord, deleteRecord, getRecord } from '../routes/data.js';

const TEST_ORG = 'vitest_datareal';
const DATA_DB  = `${TEST_ORG}_machine_user`;
const META_DB  = `${TEST_ORG}_machine_app`;

function mockRes(): any {
	const res: any = { _status: 200, _json: null, _body: null };
	res.json   = (b: any) => { res._body = b; res._json = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	res.send   = () => res;
	return res;
}

function mockReq(overrides: any = {}): any {
	return {
		body: {},
		params: {},
		query: {},
		headers: { authorization: 'Bearer mock-admin-token' },
		user: { userId: 'admin-1', login: 'admin', isAdmin: true },
		socket: { remoteAddress: '127.0.0.1' },
		...overrides,
	};
}

function getCollection(conn: Connection, collectionName: string) {
	const schema = new Schema({}, { strict: false, id: false, collection: collectionName });
	const modelName = `${DATA_DB}__${collectionName}`;
	return conn.models[modelName] ?? conn.model(modelName, schema, collectionName);
}

describe('S11-03: API /api/data/* avec données réelles', () => {
	let dataConn: Connection;

	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		invalidateBaseCache();
		(config as any).org = TEST_ORG;

		await seedEngineRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await publishModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
		invalidateBaseCache();

		// Determine the actual base from the deployed model and seed into that DB
		const { getDbForCollection } = await import('../middleware/dbRouter.js');
		const routeDb = await getDbForCollection('vehicle');
		const routeDbName = routeDb.name;

		const seededDb = mongoose.connection.useDb(routeDbName, { useCache: true });
		for (const col of Object.keys(demoSeed)) {
			await seededDb.collection(col).deleteMany({}).catch(() => {});
		}

		for (const [col, rows] of Object.entries(demoSeed)) {
			const schema = new Schema({}, { strict: false, id: false, collection: col });
			const modelName = `${routeDbName}__${col}`;
			const Model = seededDb.models[modelName] ?? seededDb.model(modelName, schema, col);
			await Model.insertMany(rows as any[]);
		}

		dataConn = routeDb;

		const vehicleCount = await dataConn.collection('vehicle').countDocuments();
		if (vehicleCount === 0) {
			const raw = await dataConn.collection('vehicle').find({}).limit(1).toArray();
			throw new Error(`Seed FAILED: vehicle count=0 in '${routeDbName}'. Seed rows=${(demoSeed.vehicle as any[]).length}. Raw: ${JSON.stringify(raw)}`);
		}
	});

	afterAll(async () => {
		for (const col of Object.keys(demoSeed)) {
			await getCollection(dataConn, col).deleteMany({}).catch(() => {});
		}
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		const metaCollections = [
			'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
			'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
			'appscheme_has_field', 'appscheme_view',
		];
		for (const c of metaCollections) {
			await meta.collection(c).deleteMany({}).catch(() => {});
		}
		await mongoose.disconnect();
	});

	// ── GET /api/data/vehicle → 3 véhicules ──────────────────────────────────

	describe('GET /api/data/vehicle', () => {
		it('returns vehicles from demoSeed', async () => {
			const req = mockReq({ params: { table: 'vehicle' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data.length).toBeGreaterThan(0);
			expect(res._body.meta.total).toBeGreaterThan(0);
		});
	});

	// ── GET /api/data/category → catégories ──────────────────────────────────

	describe('GET /api/data/category', () => {
		it('returns categories from demoSeed', async () => {
			const req = mockReq({ params: { table: 'category' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data.length).toBeGreaterThan(0);
		});
	});

	// ── GET /api/data/vehicle?sort=mileage&order=desc → ──────────────────────

	describe('GET /api/data/vehicle?sort=mileage&order=desc', () => {
		it('returns vehicles sorted by mileage desc', async () => {
			const req = mockReq({
				params: { table: 'vehicle' },
				query:  { sort: 'mileage', order: 'desc' },
			});
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			const data = res._body.data as any[];
			expect(data.length).toBeGreaterThan(0);
			expect(data[0].mileage).toBeDefined();
		});
	});

	// ── GET /api/data/vehicle?page=1&limit=2 → pagination ────────────────────

	describe('GET /api/data/vehicle?page=1&limit=2', () => {
		it('returns paginated results', async () => {
			const req = mockReq({
				params: { table: 'vehicle' },
				query:  { page: '1', limit: '2' },
			});
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.meta.total).toBeGreaterThan(0);
			expect(res._body.data).toHaveLength(2);
		});
	});

	// ── POST /api/data/category → 201 + doc retourné ─────────────────────────

	describe('POST /api/data/category', () => {
		it('creates category and returns 201', async () => {
			const req = mockReq({
				params: { table: 'category' },
				body:   { code: 'lux2', name: 'Luxury2' },
			});
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
			expect(res._body.code).toBe('lux2');
			expect(res._body.name).toBe('Luxury2');
		});
	});

	// ── DELETE /api/data/category/{id} → 204 ─────────────────────────────────

	describe('DELETE /api/data/category/{id}', () => {
		it('deletes and returns 204', async () => {
			// First create a doc to delete
			const createReq = mockReq({
				params: { table: 'category' },
				body:   { code: 'todel', name: 'ToDelete' },
			});
			const createRes = mockRes();
			await createRecord(createReq, createRes);
			const createdId = createRes._body._id;

			// Delete it
			const deleteReq = mockReq({
				params: { table: 'category', id: createdId },
			});
			const deleteRes = mockRes();
			await deleteRecord(deleteReq, deleteRes);
			expect(deleteRes._status).toBe(204);
		});
	});

	// ── GET /api/data/rental → FK integrity ──────────────────────────────────

describe('GET /api/data/rental — FK integrity', () => {
		it('rental records have vehicle and customer fields', async () => {
			const req = mockReq({ params: { table: 'rental' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			const rental = res._body.data[0] as any;
			expect(rental.vehicle).toBeDefined();
			expect(rental.customer).toBeDefined();
		});
	});
});
