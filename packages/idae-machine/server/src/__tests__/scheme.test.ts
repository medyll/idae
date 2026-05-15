import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { getAllSchemes, getScheme } from '../routes/scheme.js';
import type { Request, Response } from 'express';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';

const TEST_ORG = 'vitest';
const META_DB  = `${TEST_ORG}_machine_app`;

const miniModel: any = {
	product: {
		keyPath:  '++id',
		base:     'machine_base',
		model:    {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:         { type: 'id',   readonly: true },
				name:       { type: 'text', required: true },
				categoryId: { type: 'fk-category.id' },
			},
			fks: {
				category: { code: 'category', multiple: false, required: false }
			}
		}
	}
};

function mockRes(): any {
	const res: any = { _status: 200 };
	res.json   = (b: any) => { res._body = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	return res;
}
function mockReq(params: Record<string, string> = {}): Request {
	return { params } as unknown as Request;
}

describe('GET /api/scheme', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
	});

	afterAll(async () => {
		const db = mongoose.connection.useDb(META_DB, { useCache: true });
		const collections = [
			'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
			'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
			'appscheme_has_field', 'appscheme_view',
		];
		for (const col of collections) {
			await db.collection(col).deleteMany({});
		}
		await mongoose.disconnect();
	});

	it('GET /api/scheme returns IdbqModel JSON with fields and fks', async () => {
		const req = mockReq();
		const res = mockRes();
		await getAllSchemes(req, res);

		expect(res._status).toBe(200);
		expect(res._body).toHaveProperty('product');

		const product = res._body.product;
		expect(product.keyPath).toBe('++id');
		expect(product.base).toBe('machine_base');
		expect(product.template.fields).toHaveProperty('id');
		expect(product.template.fields).toHaveProperty('name');
		expect(product.template.fields).toHaveProperty('categoryId');
		expect(product.template.fields.categoryId.type).toBe('fk-category.id');
		expect(product.template.fks).toHaveProperty('category');
		expect(product.template.fks.category.code).toBe('category');
	});

	it('GET /api/scheme/:table returns single collection', async () => {
		const req = mockReq({ table: 'product' });
		const res = mockRes();
		await getScheme(req, res);

		expect(res._status).toBe(200);
		expect(res._body).toHaveProperty('product');
		expect(res._body.product.template.fields.name.required).toBe(true);
	});

	it('GET /api/scheme/:table returns 404 for unknown', async () => {
		const req = mockReq({ table: 'nonexistent' });
		const res = mockRes();
		await getScheme(req, res);
		expect(res._status).toBe(404);
	});
});
