/**
 * Integration test: demoScheme → publishModel → getModel → MachineModel shape
 *
 * Verifies that the full server roundtrip produces a MachineModel that:
 *   - contains all expected collections
 *   - preserves field types (including fk-* syntax)
 *   - preserves FK relations
 *   - preserves keyPath and base
 *
 * Run with: pnpm vitest run server/src/__tests__/demo-roundtrip.test.ts
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { publishModel, seedIdaeRegistries } from '../bootstrap/publishModel.js';
import { machineServer } from '../MachineServer.js';
import { demoScheme } from '../models/demo/demoScheme.js';
import { idaeModelCore } from '../idae/index.js';
import type { MachineModel } from '../../../src/lib/types/machine-model.js';

const TEST_ORG = 'vitest_demo';
const META_DB  = `${TEST_ORG}_machine_app`;

const COLLECTIONS = ['vehicle', 'category', 'customer', 'rental', 'location_office', 'maintenance'] as const;

function mockRes(): any {
	const res: any = { _status: 200 };
	res.json   = (b: any) => { res._body = b; return res; };
	res.status = (c: number) => { res._status = c; return res; };
	return res;
}

describe('demoScheme roundtrip: publishModel → getModel', () => {
	let model: MachineModel;

	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		await seedIdaeRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await publishModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
		model = await machineServer.getModel();
	});

	afterAll(async () => {
		const db = mongoose.connection.useDb(META_DB, { useCache: true });
		const collections = [
			'appscheme', 'appscheme_base', 'appscheme_field', 'appscheme_field_type',
			'appscheme_field_group', 'appscheme_type', 'appscheme_view_type',
			'appscheme_has_field', 'appscheme_view',
		];
		for (const col of collections) await db.collection(col).deleteMany({});
		await mongoose.disconnect();
	});

	it('returns all expected collections', () => {
		for (const col of COLLECTIONS) {
			expect(model, `missing collection: ${col}`).toHaveProperty(col);
		}
	});

	it('each collection has keyPath and base', () => {
		for (const col of COLLECTIONS) {
			expect(model[col].keyPath, `${col}.keyPath`).toBe('++id');
			expect(model[col].base,    `${col}.base`).toBeTruthy();
		}
	});

	// ── vehicle ─────────────────────────────────────────────────────────────────

	describe('vehicle', () => {
		it('has all fields with correct types', () => {
			const { fields } = model.vehicle;
			expect(fields.id.type).toBe('id');
			expect(fields.id.readonly).toBe(true);
			expect(fields.license_plate.type).toBe('text');
			expect(fields.license_plate.required).toBe(true);
			// FK relations live in `fks` (getModel contract); the fk-X.code field
			// synthesis is a client-builder step (foldFksIntoFields), asserted there.
			expect(fields.year.type).toBe('number');
			expect(fields.mileage.type).toBe('number');
			expect(fields.created_at.type).toBe('date');
		});

		it('has correct fks', () => {
			const { fks } = model.vehicle;
			expect(fks.category).toMatchObject({ code: 'category', multiple: false });
			expect(fks.location_office).toMatchObject({ code: 'location_office', multiple: false });
		});
	});

	// ── rental ───────────────────────────────────────────────────────────────────

	describe('rental', () => {
		it('has fks for vehicle and customer (required)', () => {
			const { fks } = model.rental;
			expect(fks.vehicle).toMatchObject({ code: 'vehicle', multiple: false, required: true });
			expect(fks.customer).toMatchObject({ code: 'customer', multiple: false, required: true });
		});
	});

	// ── maintenance ──────────────────────────────────────────────────────────────

	describe('maintenance', () => {
		it('has fk for vehicle (required)', () => {
			expect(model.maintenance.fks.vehicle).toMatchObject({ code: 'vehicle', multiple: false, required: true });
		});
	});

	// ── category (no fks) ────────────────────────────────────────────────────────

	describe('category', () => {
		it('has fields and empty fks', () => {
			expect(model.category.fields.code.required).toBe(true);
			expect(model.category.fields.description.type).toBe('text-lg');
			expect(Object.keys(model.category.fks)).toHaveLength(0);
		});
	});

	// ── idempotency ──────────────────────────────────────────────────────────────

	it('second publishModel produces same model (idempotent)', async () => {
		await publishModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
		const model2 = await machineServer.getModel();
		expect(Object.keys(model2)).toEqual(expect.arrayContaining(COLLECTIONS));
		expect(model2.vehicle.fields.license_plate.type).toBe('text');
		expect(model2.rental.fks.vehicle.code).toBe('vehicle');
	});

	// ── META_FK_KEYS regression ──────────────────────────────────────────────────
	// MachineServer.getModel() builds the in-memory model's `fks` from each scheme's
	// `fkRelations` doc (the record's own `fks` value-bag of base/type pointers is not
	// a relation source). appscheme_field_group and appscheme_view_type are real
	// DECLARED relations (idae-model-core.ts: appscheme_field.fks.appscheme_field_group,
	// appscheme_view.fks.appscheme_view_type) that happen to share their name with
	// meta-registry collections — they must survive, or DataField never resolves them
	// as fk (no FieldSelect rendered).
	it('publishing idaeModelCore keeps declared fks named like meta-registry collections', async () => {
		await publishModel(idaeModelCore.collections as unknown as MachineModel, { org: TEST_ORG, mongoUri: config.mongodbUri });
		const metaModel = await machineServer.getModel();

		expect(metaModel.appscheme_field.fks).toHaveProperty('appscheme_field_type');
		expect(metaModel.appscheme_field.fks).toHaveProperty('appscheme_field_group');
		expect(metaModel.appscheme_field.fks.appscheme_field_group).toMatchObject({ code: 'appscheme_field_group' });

		expect(metaModel.appscheme_view.fks).toHaveProperty('appscheme_view_type');
		expect(metaModel.appscheme_view.fks.appscheme_view_type).toMatchObject({ code: 'appscheme_view_type' });
	});
});

describe('meta-collections: appuser_prefs, appuser_activity, appuser_history', () => {
	const { collections } = idaeModelCore;

	it('appuser_prefs exists in idae-model-core with correct fields', () => {
		expect(collections).toHaveProperty('appuser_prefs');
		const prefs = collections.appuser_prefs as any;
		expect(prefs.base).toBe('machine_user');
		expect(prefs.rights.ops).toEqual(expect.arrayContaining(['C', 'R', 'U', 'D', 'L']));
		expect(prefs.fields.id).toEqual({ required: true, readonly: true });
		expect(prefs.fields.code).toEqual({ required: true, readonly: false });
		expect(prefs.fields.value).toEqual({ required: false, readonly: false });
		expect(prefs.fks.appuser).toMatchObject({ code: 'appuser', multiple: false, required: true });
		expect(prefs.template.presentation).toBe('code value');
	});

	it('appuser_activity exists in idae-model-core with correct fields (insert-only)', () => {
		expect(collections).toHaveProperty('appuser_activity');
		const activity = collections.appuser_activity as any;
		expect(activity.base).toBe('machine_user');
		expect(activity.rights.ops).toEqual(expect.arrayContaining(['C', 'R', 'L']));
		expect(activity.rights.ops).not.toContain('U');
		expect(activity.rights.ops).not.toContain('D');
		expect(activity.fields.id).toEqual({ required: true, readonly: true });
		expect(activity.fields.code).toEqual({ required: true, readonly: true });
		expect(activity.fields.collection).toEqual({ required: true, readonly: true });
		expect(activity.fields.collection_value).toEqual({ required: true, readonly: true });
		expect(activity.fields.collection_vars).toEqual({ required: false, readonly: true });
		expect(activity.fields.timestamp).toEqual({ required: true, readonly: true });
		expect(activity.fks.appuser).toMatchObject({ code: 'appuser', multiple: false, required: true });
		expect(activity.template.presentation).toBe('code collection timestamp');
	});

	it('appuser_history exists in idae-model-core with correct fields', () => {
		expect(collections).toHaveProperty('appuser_history');
		const history = collections.appuser_history as any;
		expect(history.base).toBe('machine_user');
		expect(history.rights.ops).toEqual(expect.arrayContaining(['C', 'R', 'U', 'D', 'L']));
		expect(history.fields.id).toEqual({ required: true, readonly: true });
		expect(history.fields.collection).toEqual({ required: true, readonly: false });
		expect(history.fields.collection_value).toEqual({ required: true, readonly: false });
		expect(history.fields.label).toEqual({ required: false, readonly: false });
		expect(history.fields.count).toEqual({ required: true, readonly: false });
		expect(history.fields.lastSeen).toEqual({ required: true, readonly: false });
		expect(history.fks.appuser).toMatchObject({ code: 'appuser', multiple: false, required: true });
		expect(history.template.presentation).toBe('collection label lastSeen');
	});
});
