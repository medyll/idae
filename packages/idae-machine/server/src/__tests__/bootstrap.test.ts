import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';
import { config } from '../config.js';

const TEST_ORG = 'vitest';
const META_DB  = `${TEST_ORG}_machine_app`;

const miniModel: any = {
	product: {
		keyPath:  '++id',
		base:     'test_base',
		model:    {},
		template: {
			index:        'id',
			presentation: 'name',
			fields: {
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

describe('seedSchemeFromModel', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
	});

	afterEach(async () => {
		const db = mongoose.connection.useDb(META_DB, { useCache: true });
		const cols = [
			'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
			'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
			'appscheme_has_field', 'appscheme_has_table_field', 'appscheme_view',
		];
		for (const col of cols) await db.collection(col).deleteMany({});
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	it('seeds all meta collections', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const db = mongoose.connection.useDb(META_DB, { useCache: true });

		// Static reference data
		expect(await db.collection('appscheme_field_type').countDocuments()).toBeGreaterThan(5);
		expect(await db.collection('appscheme_field_group').countDocuments()).toBeGreaterThan(5);
		expect(await db.collection('appscheme_type').countDocuments()).toBeGreaterThan(0);
		expect(await db.collection('appscheme_view_type').countDocuments()).toBe(5);

		// Dynamic data
		const bases   = await db.collection('appscheme_base').find().toArray();
		const schemes = await db.collection('appscheme').find().toArray();
		const fields  = await db.collection('appscheme_field').find().toArray();
		const hasF    = await db.collection('appscheme_has_field').find().toArray();
		const hasTF   = await db.collection('appscheme_has_table_field').find().toArray();
		const views   = await db.collection('appscheme_view').find().toArray();

		expect(bases.some((b: any) => b.code === 'test_base')).toBe(true);
		expect(schemes.some((s: any) => s.code === 'product')).toBe(true);
		expect(fields.some((f: any) => f.code === 'name' && f.required === 1)).toBe(true);
		expect(fields.some((f: any) => f.code === 'categoryId' && f.field_type === 'fk')).toBe(true);
		expect(hasF.some((h: any) => h.gridFks?.appscheme?.code === 'product' && h.gridFks?.appscheme_field?.code === 'id')).toBe(true);
		expect(hasTF.some((h: any) => h.gridFks?.appscheme_link?.code === 'category')).toBe(true);
		expect(views.length).toBeGreaterThan(0);
	});

	it('appscheme.gridFks contains appscheme_base and FK links', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const db      = mongoose.connection.useDb(META_DB, { useCache: true });
		const product = await db.collection('appscheme').findOne({ code: 'product' });

		expect(product?.gridFks?.appscheme_base?.code).toBe('test_base');
		expect(product?.gridFks?.appscheme_type?.code).toBe('standard');
		expect(product?.gridFks?.category?.code).toBe('category');
		expect(product?.gridFks?.category?.multiple).toBe(false);
	});

	it('is idempotent — second seed does not duplicate appscheme', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const db      = mongoose.connection.useDb(META_DB, { useCache: true });
		const schemes = await db.collection('appscheme').find({ code: 'product' }).toArray();
		expect(schemes.length).toBe(1);
	});
});
