import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose, { Schema } from 'mongoose';
import { config } from '../config.js';
import {
	createRecord, updateRecord, deleteRecord
} from '../routes/data.js';
import type { Request, Response } from 'express';
import { domainActionsRegistry, registerDomainActions, type DomainActions, getDomainActions } from '../models/domainActions.js';

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

function mockReq(opts: { params?: any; query?: any; body?: any; headers?: any } = {}): Request {
	return {
		params: opts.params ?? {},
		query: opts.query ?? {},
		body: opts.body ?? {},
		headers: opts.headers ?? {},
		socket: { remoteAddress: '127.0.0.1' }
	} as unknown as Request;
}

function getTestCollection() {
	const db = mongoose.connection.useDb(DATA_DB, { useCache: true });
	const schema = new Schema({}, { strict: false, collection: TEST_TABLE });
	const name = `${DATA_DB}__${TEST_TABLE}`;
	return db.models[name] ?? db.model(name, schema, TEST_TABLE);
}

describe('DomainActions registry', () => {
	afterEach(() => {
		domainActionsRegistry.clear();
	});

	it('registers and retrieves domain actions', () => {
		const actions: DomainActions = { validate: () => ({ valid: true, errors: {} }) };
		registerDomainActions('test', actions);
		expect(getDomainActions('test')).toBe(actions);
	});

	it('returns undefined for unregistered collection', () => {
		expect(getDomainActions('nonexistent')).toBeUndefined();
	});
});

describe('Domain actions in data handlers', () => {
	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;

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
		domainActionsRegistry.clear();
	});

	describe('validate hook', () => {
		it('blocks create when domain validation fails', async () => {
			registerDomainActions(TEST_TABLE, {
				validate: (data) => {
					const d = data as Record<string, unknown>;
					if (d.value && Number(d.value) < 0) {
						return { valid: false, errors: { value: 'Must be positive' } };
					}
					return { valid: true, errors: {} };
				}
			});

			const req = mockReq({ params: { table: TEST_TABLE }, body: { name: 'Bad', value: -5 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(400);
			expect(res._body.error).toBe('Domain validation failed');
			expect(res._body.details.value).toBe('Must be positive');
		});

		it('allows create when domain validation passes', async () => {
			registerDomainActions(TEST_TABLE, {
				validate: () => ({ valid: true, errors: {} })
			});

			const req = mockReq({ params: { table: TEST_TABLE }, body: { name: 'Good', value: 10 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
		});

		it('works without any domain actions registered', async () => {
			const req = mockReq({ params: { table: TEST_TABLE }, body: { name: 'No Actions' } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
		});
	});

	describe('beforeDelete hook', () => {
		it('can veto deletion by throwing', async () => {
			registerDomainActions(TEST_TABLE, {
				beforeDelete: async () => {
					throw new Error('Cannot delete active records');
				}
			});

			const col = getTestCollection();
			const doc = await col.create({ name: 'Protected' });

			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			try {
				await deleteRecord(req, res);
			} catch {
				// expected — error propagates through outer try/catch
			}
			expect(res._status).toBe(500);
		});

		it('allows delete when beforeDelete passes', async () => {
			registerDomainActions(TEST_TABLE, {
				beforeDelete: async () => { /* allow */ }
			});

			const col = getTestCollection();
			await col.deleteMany({});
			const doc = await col.create({ name: 'Deletable' });

			const req = mockReq({ params: { table: TEST_TABLE, id: doc._id.toString() } });
			const res = mockRes();
			await deleteRecord(req, res);
			expect(res._status).toBe(204);
		});
	});

	describe('demo vehicule validation', () => {
		const VEHICULE_TABLE = 'vehicule';

		beforeAll(async () => {
			const meta = mongoose.connection.useDb(META_DB, { useCache: true });
			await meta.collection('appscheme').updateOne(
				{ code: VEHICULE_TABLE },
				{ $set: { code: VEHICULE_TABLE, base: TEST_BASE } },
				{ upsert: true }
			);
		});

		afterAll(async () => {
			const meta = mongoose.connection.useDb(META_DB, { useCache: true });
			await meta.collection('appscheme').deleteOne({ code: VEHICULE_TABLE });
		});

		it('rejects negative kilometrage', async () => {
			// Clear and re-import demo actions to register vehicule
			domainActionsRegistry.clear();
			await import('../models/demo/actions.js');

			const req = mockReq({ params: { table: VEHICULE_TABLE }, body: { name: 'Car', kilometrage: -100 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(400);
			expect(res._body.details.kilometrage).toBe('Minimum 0');
		});

		it('rejects zero or negative prixJour', async () => {
			// Force fresh import by clearing registry and manually registering
			domainActionsRegistry.clear();
			registerDomainActions('vehicule', {
				validate(data) {
					const errors: Record<string, string> = {};
					const d = data as Record<string, unknown>;
					if (d.kilometrage !== undefined && d.kilometrage !== null && Number(d.kilometrage) < 0)
						errors.kilometrage = 'Kilométrage ne peut pas être négatif';
					if (d.prixJour !== undefined && d.prixJour !== null && Number(d.prixJour) <= 0)
						errors.prixJour = 'Prix journalier doit être > 0';
					return { valid: Object.keys(errors).length === 0, errors };
				}
			});

			const req = mockReq({ params: { table: VEHICULE_TABLE }, body: { name: 'Car', prixJour: 0 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(400);
			expect(res._body.details.prixJour).toBe('Prix journalier doit être > 0');
		});

		it('accepts valid vehicule', async () => {
			domainActionsRegistry.clear();
			await import('../models/demo/actions.js');

			const req = mockReq({ params: { table: VEHICULE_TABLE }, body: { name: 'Car', kilometrage: 5000, prixJour: 50 } });
			const res = mockRes();
			await createRecord(req, res);
			expect(res._status).toBe(201);
		});
	});
});
