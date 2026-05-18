import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import {
	listRecords, getRecord, createRecord, updateRecord, deleteRecord, restoreRecord
} from '../routes/data.js';
import type { Request, Response } from 'express';
import { getConn, invalidateBaseCache } from '../middleware/dbRouter.js';
import { invalidateSchemeCache } from '../validation/SchemeValidator.js';

const TEST_ORG    = 'vitest';
const TEST_TABLE  = 'datacollection';
const TEST_BASE   = 'machine_base';
const META_DB     = `${TEST_ORG}_machine_app`;
const DATA_DB     = `${TEST_ORG}_${TEST_BASE}`;

function mockRes() {
	const res: any = { _status: 200 };
	res.json   = (b: any) => { res._body = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	res.send   = () => res;
	return res;
}

function mockReq(opts: { params?: any; query?: any; body?: any; headers?: any } = {}): Request {
	return {
		params: opts.params ?? {},
		query: opts.query ?? {},
		body: opts.body ?? {},
		headers: opts.headers ?? {},
		socket: { remoteAddress: '127.0.0.1' }
	} as unknown as Request;
}

// Use same connection as handlers (mongooseConnectionManager via getConn)
// to guarantee both see identical MongoDB state.
async function getTestCollection() {
	const db   = await getConn(DATA_DB);
	const name = `${DATA_DB}__${TEST_TABLE}`;
	if (db.models[name]) return db.models[name];
	return db.model(name, new Schema({}, { strict: false, collection: TEST_TABLE }), TEST_TABLE);
}

describe('Data CRUD handlers', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		(config as any).org = TEST_ORG;
		invalidateBaseCache();
		invalidateSchemeCache();

		// Seed appscheme so dbRouter can find datacollection → machine_base
		const meta = await getConn(META_DB);
		await meta.collection('appscheme').updateOne(
			{ code: TEST_TABLE },
			{ $set: { code: TEST_TABLE, base: TEST_BASE } },
			{ upsert: true }
		);
	});

	afterAll(async () => {
		const meta = await getConn(META_DB);
		await meta.collection('appscheme').deleteOne({ code: TEST_TABLE });
		const db = await getConn(DATA_DB);
		await db.collection(TEST_TABLE).drop().catch(() => {});
		// mongoose.disconnect() handled by globalTeardown
	});

	afterEach(async () => {
		await (await getTestCollection()).deleteMany({});
	});

	describe('createRecord', () => {
		it('creates a record and returns 201', async () => {
			const req = mockReq({ params: { table: TEST_TABLE }, body: { name: 'Item A', value: 1 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
			expect(res._body).toHaveProperty('_id');
			expect(res._body.name).toBe('Item A');
		});

		it('rejects invalid table name', async () => {
			const req = mockReq({ params: { table: 'bad-table!' }, body: {} });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(400);
		});
	});

	describe('listRecords', () => {
		it('returns paginated list', async () => {
			const col = await getTestCollection();
			await col.deleteMany({});
			await col.insertMany([
				{ name: 'Item 1', value: 10 },
				{ name: 'Item 2', value: 20 },
				{ name: 'Item 3', value: 30 },
			]);

			const req = mockReq({ params: { table: TEST_TABLE }, query: { page: '1', limit: '2' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(2);
			expect(res._body.meta.total).toBe(3);
		});

		it('supports descending sort', async () => {
			const col = await getTestCollection();
			await col.deleteMany({});
			await col.insertMany([
				{ name: 'Item 1', value: 10 },
				{ name: 'Item 2', value: 20 },
				{ name: 'Item 3', value: 30 },
			]);

			const req = mockReq({ params: { table: TEST_TABLE }, query: { sort: 'value', order: 'desc' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._body.data[0].value).toBe(30);
		});
	});

	describe('getRecord', () => {
		it('returns single record by id', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'X', value: 42 });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await getRecord(req, res);
			expect(res._status).toBe(200);
			expect(res._body.name).toBe('X');
		});

		it('returns 404 for missing record', async () => {
			const req = mockReq({ params: { table: TEST_TABLE, id: new mongoose.Types.ObjectId().toString() } });
			const res = mockRes();
			await getRecord(req, res);
			expect(res._status).toBe(404);
		});
	});

	describe('updateRecord', () => {
		it('updates record', async () => {
			const col = await getTestCollection();
			await col.deleteMany({});
			const doc = await col.create({ name: 'Old', value: 1 });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() }, body: { name: 'New', value: 2 } });
			const res = mockRes();
			await updateRecord(req, res);
			expect(res._status).toBe(200);
			expect(res._body.name).toBe('New');
		});
	});

	describe('deleteRecord', () => {
		it('soft deletes record (default)', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'To Delete' });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);

			// Verify deletedAt is set
			const found = await col.findById(doc._id.toString()).lean();
			expect(found).toHaveProperty('deletedAt');
		});

		it('permanent delete with ?permanent=true', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'Gone Forever' });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() }, query: { permanent: 'true' } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);

			// Verify record is gone
			const found = await col.findById(doc._id.toString()).lean();
			expect(found).toBeNull();
		});

		it('returns 404 for missing record', async () => {
			const req = mockReq({ params: { table: TEST_TABLE, id: new mongoose.Types.ObjectId().toString() } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(404);
		});
	});

	describe('restoreRecord', () => {
		it('restores soft-deleted record', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'Restore Me', deletedAt: new Date().toISOString() });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await restoreRecord(req, res);
			expect(res._status).toBe(200);
			expect(res._body).not.toHaveProperty('deletedAt');

			// Verify deletedAt is removed
			const found = await col.findById(doc._id.toString()).lean();
			expect(found).not.toHaveProperty('deletedAt');
		});

		it('returns 404 for missing record', async () => {
			const req = mockReq({ params: { table: TEST_TABLE, id: new mongoose.Types.ObjectId().toString() } });
			const res = mockRes();
			await restoreRecord(req, res);
			expect(res._status).toBe(404);
		});
	});

	describe('soft delete filtering', () => {
		it('listRecords excludes soft-deleted records', async () => {
			const col = await getTestCollection();
			await col.create({ name: 'Active Item' });
			await col.create({ name: 'Deleted Item', deletedAt: new Date().toISOString() });

			const req = mockReq({ params: { table: TEST_TABLE } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(1);
			expect(res._body.data[0].name).toBe('Active Item');
		});

		it('getRecord returns 404 for soft-deleted record', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'Hidden', deletedAt: new Date().toISOString() });

			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await getRecord(req, res);
			expect(res._status).toBe(404);
		});
	});

	describe('audit trail', () => {
		const AUDIT_DB = `${TEST_ORG}_machine_user`;

		async function getAuditEntries() {
			const conn = await getConn(AUDIT_DB);
			return conn.collection('appuser_audit').find({ resourceType: TEST_TABLE }).sort({ performedAt: -1 }).toArray();
		}

		it('createRecord logs audit entry', async () => {
			const req = mockReq({ params: { table: TEST_TABLE }, body: { name: 'Audited Item' } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);

			// Wait for fire-and-forget audit write
			await new Promise(r => setTimeout(r, 100));

			const entries = await getAuditEntries();
			const createEntry = entries.find(e => e.action === 'create');
			expect(createEntry).toBeDefined();
			expect(createEntry?.resourceId).toBe(String(res._body._id));
			expect(createEntry?.status).toBe('success');
		});

		it('updateRecord logs audit entry with changed fields', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'Old', value: 1 });

			const req = mockReq({
				params: { table: TEST_TABLE, id: doc._id.toString() },
				body: { name: 'New', value: 2 }
			});
			const res = mockRes();
			await updateRecord(req, res);
			expect(res._status).toBe(200);

			await new Promise(r => setTimeout(r, 100));

			const entries = await getAuditEntries();
			const updateEntry = entries.find(e => e.action === 'update');
			expect(updateEntry).toBeDefined();
			expect(updateEntry?.details?.fields).toContain('name');
			expect(updateEntry?.details?.fields).toContain('value');
		});

		it('deleteRecord logs audit entry with permanent flag', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'To Delete' });

			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);

			await new Promise(r => setTimeout(r, 100));

			const entries = await getAuditEntries();
			const deleteEntry = entries.find(e => e.action === 'delete');
			expect(deleteEntry).toBeDefined();
			expect(deleteEntry?.details?.permanent).toBe(false);
		});

		it('permanent delete logs audit entry', async () => {
			const col = await getTestCollection();
			const doc = await col.create({ name: 'Gone Forever' });

			const req = mockReq({
				params: { table: TEST_TABLE, id: doc._id.toString() },
				query: { permanent: 'true' }
			});
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);

			await new Promise(r => setTimeout(r, 100));

			const entries = await getAuditEntries();
			const deleteEntry = entries.find(e => e.action === 'delete' && e.details?.permanent === true);
			expect(deleteEntry).toBeDefined();
		});
	});
});
