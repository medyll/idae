import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';
import { config } from '../config.js';

const miniModel: any = {
	product: {
		keyPath:  '++id',
		base:     'test_base',
		model:    {},
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:   { type: 'id',   readonly: true },
				name: { type: 'text', required: true },
			},
			fks: {}
		}
	}
};

const TEST_ORG = 'vitest';

describe('seedSchemeFromModel', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
	});

	afterEach(async () => {
		const db = mongoose.connection.useDb(`${TEST_ORG}_machine_app`, { useCache: true });
		await db.collection('appscheme_base').deleteMany({ code: 'test_base' });
		await db.collection('appscheme').deleteMany({ code: 'product' });
		await db.collection('appscheme_field').deleteMany({ collection: 'product' });
	});

	afterAll(async () => {
		await mongoose.disconnect();
	});

	it('seeds appscheme_base, appscheme, appscheme_field', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const db      = mongoose.connection.useDb(`${TEST_ORG}_machine_app`, { useCache: true });
		const bases   = await db.collection('appscheme_base').find().toArray();
		const schemes = await db.collection('appscheme').find().toArray();
		const fields  = await db.collection('appscheme_field').find().toArray();

		expect(bases.some((b: any) => b.code === 'test_base')).toBe(true);
		expect(schemes.some((s: any) => s.code === 'product')).toBe(true);
		expect(fields.some((f: any) => f.name === 'id' && f.collection === 'product')).toBe(true);
		expect(fields.some((f: any) => f.name === 'name' && f.required === true)).toBe(true);
	});

	it('is idempotent — second seed does not duplicate', async () => {
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
		await seedSchemeFromModel(miniModel, { org: TEST_ORG, mongoUri: config.mongodbUri });

		const db      = mongoose.connection.useDb(`${TEST_ORG}_machine_app`, { useCache: true });
		const schemes = await db.collection('appscheme').find({ code: 'product' }).toArray();
		expect(schemes.length).toBe(1);
	});
});
