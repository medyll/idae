import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getAllSchemes, getScheme } from '../routes/scheme.js';
import type { Request, Response } from 'express';

const TEST_ORG = 'vitest';

function mockRes() {
	const res: any = {};
	res.json    = (body: any) => { res._body = body; res._status = res._status ?? 200; return res; };
	res.status  = (code: number) => { res._status = code; return res; };
	return res;
}

function mockReq(params: Record<string, string> = {}): Request {
	return { params } as unknown as Request;
}

describe('GET /api/scheme', () => {
	const META_DB = `${TEST_ORG}_machine_app`;

	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		// Set config org to our test org
		(config as any).org = TEST_ORG;

		const db = mongoose.connection.useDb(META_DB, { useCache: true });
		await db.collection('appscheme_base').insertOne({ code: 'machine_base', name: 'Base' });
		await db.collection('appscheme').insertOne({
			code: 'vehicle', base: 'machine_base', index: 'id', presentation: 'id', keyPath: '++id'
		});
		await db.collection('appscheme_field').insertMany([
			{ collection: 'vehicle', name: 'id',    type: 'id',   readonly: true,  required: false, private: false },
			{ collection: 'vehicle', name: 'brand', type: 'text', readonly: false, required: true,  private: false },
		]);
	});

	afterAll(async () => {
		const db = mongoose.connection.useDb(META_DB, { useCache: true });
		await db.collection('appscheme_base').deleteMany({ code: 'machine_base' });
		await db.collection('appscheme').deleteMany({ code: 'vehicle' });
		await db.collection('appscheme_field').deleteMany({ collection: 'vehicle' });
		await mongoose.disconnect();
	});

	it('GET /api/scheme returns IdbqModel JSON', async () => {
		const req = mockReq();
		const res = mockRes();
		await getAllSchemes(req, res);

		expect(res._status ?? 200).toBe(200);
		expect(res._body).toHaveProperty('vehicle');
		expect(res._body.vehicle).toHaveProperty('keyPath', '++id');
		expect(res._body.vehicle).toHaveProperty('base', 'machine_base');
		expect(res._body.vehicle.template.fields).toHaveProperty('id');
		expect(res._body.vehicle.template.fields).toHaveProperty('brand');
	});

	it('GET /api/scheme/:table returns single collection', async () => {
		const req = mockReq({ table: 'vehicle' });
		const res = mockRes();
		await getScheme(req, res);

		expect(res._status ?? 200).toBe(200);
		expect(res._body).toHaveProperty('vehicle');
		expect(res._body.vehicle.template.fields.brand.required).toBe(true);
	});

	it('GET /api/scheme/:table returns 404 for unknown', async () => {
		const req = mockReq({ table: 'nonexistent' });
		const res = mockRes();
		await getScheme(req, res);

		expect(res._status).toBe(404);
	});
});
