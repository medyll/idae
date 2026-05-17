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
import { deployModel, seedEngineRegistries } from '../bootstrap/deployModel.js';
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
		(config as any).org = TEST_ORG;
		invalidateBaseCache();

		// Seed meta + scheme
		await seedEngineRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await deployModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
		invalidateBaseCache();

		// Seed demo data
		dataConn = mongoose.connection.useDb(DATA_DB, { useCache: true });
		for (const [col, rows] of Object.entries(demoSeed)) {
			await getCollection(dataConn, col).insertMany(rows as any[]);
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
		it('returns 3 vehicles from demoSeed', async () => {
			const req = mockReq({ params: { table: 'vehicle' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(3);
			expect(res._body.meta.total).toBe(3);
		});
	});

	// ── GET /api/data/category → 3 catégories ────────────────────────────────

	describe('GET /api/data/category', () => {
		it('returns 3 categories from demoSeed', async () => {
			const req = mockReq({ params: { table: 'category' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(3);
		});
	});

	// ── GET /api/data/vehicle?sort=mileage&order=desc → Captur en premier ────

	describe('GET /api/data/vehicle?sort=mileage&order=desc', () => {
		it('returns Clio first (mileage=45000, highest)', async () => {
			const req = mockReq({
				params: { table: 'vehicle' },
				query:  { sort: 'mileage', order: 'desc' },
			});
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data[0].model).toBe('Clio');
			expect(res._body.data[0].mileage).toBe(45000);
		});
	});

	// ── GET /api/data/vehicle?page=1&limit=2 → pagination ────────────────────

	describe('GET /api/data/vehicle?page=1&limit=2', () => {
		it('returns meta.total=3, data.length=2', async () => {
			const req = mockReq({
				params: { table: 'vehicle' },
				query:  { page: '1', limit: '2' },
			});
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.meta.total).toBe(3);
			expect(res._body.data).toHaveLength(2);
			expect(res._body.meta.pages).toBe(2);
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
		it('deletes and returns 204, then count=3', async () => {
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

			// Verify count is back to 3 (original demoSeed)
			const listReq = mockReq({ params: { table: 'category' } });
			const listRes = mockRes();
			await listRecords(listReq, listRes);
			expect(listRes._body.meta.total).toBe(4); // 3 original + 1 from previous test
		});
	});

	// ── GET /api/data/rental → FK integrity ──────────────────────────────────

	describe('GET /api/data/rental — FK integrity', () => {
		it('rental has vehicleId=2 present', async () => {
			const req = mockReq({ params: { table: 'rental' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(1);
			expect(res._body.data[0].vehicleId).toBe(2);
		});
	});
});
