import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { seedSchemeFromModel } from '../bootstrap/seedSchemeFromModel.js';

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

describe('seedSchemeFromModel', () => {
	let mongod: MongoMemoryServer;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		await mongoose.connect(mongod.getUri());
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongod.stop();
	});

	it('seeds appscheme_base, appscheme, appscheme_field', async () => {
		await seedSchemeFromModel(miniModel, { org: 'test', mongoUri: mongod.getUri() });

		const db    = mongoose.connection.useDb('test_machine_app', { useCache: true });
		const bases = await db.collection('appscheme_base').find().toArray();
		const schemes = await db.collection('appscheme').find().toArray();
		const fields  = await db.collection('appscheme_field').find().toArray();

		expect(bases.some((b) => b.code === 'test_base')).toBe(true);
		expect(schemes.some((s) => s.code === 'product')).toBe(true);
		expect(fields.some((f) => f.name === 'id' && f.collection === 'product')).toBe(true);
		expect(fields.some((f) => f.name === 'name' && f.required === true)).toBe(true);
	});

	it('is idempotent — second seed does not duplicate', async () => {
		await seedSchemeFromModel(miniModel, { org: 'test', mongoUri: mongod.getUri() });
		await seedSchemeFromModel(miniModel, { org: 'test', mongoUri: mongod.getUri() });

		const db      = mongoose.connection.useDb('test_machine_app', { useCache: true });
		const schemes = await db.collection('appscheme').find({ code: 'product' }).toArray();
		expect(schemes.length).toBe(1);
	});
});
