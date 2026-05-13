import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import {
	listRecords, getRecord, createRecord, updateRecord, deleteRecord
} from '../routes/data.js';
import type { Request, Response } from 'express';

const TEST_ORG    = 'vitest';
const TEST_TABLE  = 'testcollection';
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

function mockReq(opts: { params?: any; query?: any; body?: any } = {}): Request {
	return { params: opts.params ?? {}, query: opts.query ?? {}, body: opts.body ?? {} } as unknown as Request;
}

function getTestCollection() {
	const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
	const schema = new Schema({}, { strict: false, timestamps: true, collection: TEST_TABLE });
	const name = `${DATA_DB}__${TEST_TABLE}`;
	return db.models[name] ?? db.model(name, schema, TEST_TABLE);
}

describe('Data CRUD handlers', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;

		// Seed appscheme so dbRouter can find testcollection → machine_base
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').updateOne(
			{ code: TEST_TABLE },
			{ $set: { code: TEST_TABLE, base: TEST_BASE } },
			{ upsert: true }
		);
	});

	afterAll(async () => {
		const meta = mongoose.connection.useDb(META_DB, { useCache: true });
		await meta.collection('appscheme').deleteOne({ code: TEST_TABLE });
		const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
		await db.collection(TEST_TABLE).drop().catch(() => {});
		await mongoose.disconnect();
	});

	afterEach(async () => {
		await getTestCollection().deleteMany({});
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
		beforeEach(async () => {
			await getTestCollection().insertMany([
				{ name: 'Item 1', value: 10 },
				{ name: 'Item 2', value: 20 },
				{ name: 'Item 3', value: 30 },
			]);
		});

		it('returns paginated list', async () => {
			const req = mockReq({ params: { table: TEST_TABLE }, query: { page: '1', limit: '2' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._status).toBe(200);
			expect(res._body.data).toHaveLength(2);
			expect(res._body.meta.total).toBe(3);
		});

		it('supports descending sort', async () => {
			const req = mockReq({ params: { table: TEST_TABLE }, query: { sort: 'value', order: 'desc' } });
			const res = mockRes();
			await listRecords(req, res);
			expect(res._body.data[0].value).toBe(30);
		});
	});

	describe('getRecord', () => {
		it('returns single record by id', async () => {
			const col = getTestCollection();
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
			const col = getTestCollection();
			const doc = await col.create({ name: 'Old', value: 1 });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() }, body: { name: 'New', value: 2 } });
			const res = mockRes();
			await updateRecord(req, res);
			expect(res._status).toBe(200);
			expect(res._body.name).toBe('New');
		});
	});

	describe('deleteRecord', () => {
		it('deletes record', async () => {
			const col = getTestCollection();
			const doc = await col.create({ name: 'Gone' });
			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);
		});
	});
});
