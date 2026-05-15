import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { IdaeDb, DbType } from '@medyll/idae-db';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';
import { config } from '../config.js';

const TEST_ORG = 'vitest';

const META_COLS = [
	'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
	'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
	'appscheme_has_field', 'appscheme_has_table_field', 'appscheme_view',
];

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

let idaeDb: IdaeDb;

describe('seedSchemeFromModel', () => {
	beforeAll(async () => {
		idaeDb = IdaeDb.init(config.mongodbUri, {
			dbType:           DbType.MONGODB,
			dbScope:          TEST_ORG,
			dbScopeSeparator: '_',
			idaeModelOptions: {
				autoIncrementFormat:       () => 'id',
				autoIncrementDbCollection: 'auto_increment',
			},
		});
		await idaeDb.db('machine_app'); // → vitest_machine_app
	});

	afterEach(async () => {
		for (const name of META_COLS) {
			await idaeDb.collection(name).deleteWhere({ query: {} });
		}
	});

	afterAll(async () => {
		await (idaeDb as any).closeAllConnections?.();
	});

	it('seeds all meta collections', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const ftCount  = (await idaeDb.collection('appscheme_field_type').find({ query: {} })).length;
		const fgCount  = (await idaeDb.collection('appscheme_field_group').find({ query: {} })).length;
		const stCount  = (await idaeDb.collection('appscheme_type').find({ query: {} })).length;
		const vtCount  = (await idaeDb.collection('appscheme_view_type').find({ query: {} })).length;

		expect(ftCount).toBeGreaterThan(5);
		expect(fgCount).toBeGreaterThan(5);
		expect(stCount).toBeGreaterThan(0);
		expect(vtCount).toBe(5);

		const bases   = await idaeDb.collection('appscheme_base').find({ query: {} });
		const schemes = await idaeDb.collection('appscheme').find({ query: {} });
		const fields  = await idaeDb.collection('appscheme_field').find({ query: {} });
		const hasF    = await idaeDb.collection('appscheme_has_field').find({ query: {} });
		const hasTF   = await idaeDb.collection('appscheme_has_table_field').find({ query: {} });
		const views   = await idaeDb.collection('appscheme_view').find({ query: {} });

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

		const product = await idaeDb.collection('appscheme').findOne({ query: { code: 'product' } });

		expect(product?.gridFks?.appscheme_base?.code).toBe('test_base');
		expect(product?.gridFks?.appscheme_type?.code).toBe('standard');
		expect(product?.gridFks?.category?.code).toBe('category');
		expect(product?.gridFks?.category?.multiple).toBe(false);
	});

	it('is idempotent — second seed does not duplicate appscheme', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const schemes = await idaeDb.collection('appscheme').find({ query: { code: 'product' } });
		expect(schemes.length).toBe(1);
	});
});
