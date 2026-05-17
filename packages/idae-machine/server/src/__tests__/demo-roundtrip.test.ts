/**
 * Integration test: demoScheme → deployModel → getModel → MachineModel shape
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
import { deployModel, seedEngineRegistries } from '../bootstrap/deployModel.js';
import { machineServer } from '../MachineServer.js';
import { demoScheme } from '../models/demo/demoScheme.js';
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

describe('demoScheme roundtrip: deployModel → getModel', () => {
	let model: MachineModel;

	beforeAll(async () => {
		await mongoose.connect(config.mongodbUri);
		(config as any).org = TEST_ORG;
		await seedEngineRegistries({ org: TEST_ORG, mongoUri: config.mongodbUri });
		await deployModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
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
			expect(fields.categoryId.type).toBe('fk-category.id');
			expect(fields.locationOfficeId.type).toBe('fk-location_office.id');
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
		it('has FK fields for vehicle and customer', () => {
			const { fields } = model.rental;
			expect(fields.vehicleId.type).toBe('fk-vehicle.id');
			expect(fields.vehicleId.required).toBe(true);
			expect(fields.customerId.type).toBe('fk-customer.id');
			expect(fields.customerId.required).toBe(true);
		});

		it('has fks for vehicle and customer', () => {
			const { fks } = model.rental;
			expect(fks.vehicle).toMatchObject({ code: 'vehicle', multiple: false });
			expect(fks.customer).toMatchObject({ code: 'customer', multiple: false });
		});
	});

	// ── maintenance ──────────────────────────────────────────────────────────────

	describe('maintenance', () => {
		it('has FK field for vehicle', () => {
			const { fields } = model.maintenance;
			expect(fields.vehicleId.type).toBe('fk-vehicle.id');
			expect(fields.vehicleId.required).toBe(true);
		});

		it('has fk for vehicle', () => {
			expect(model.maintenance.fks.vehicle).toMatchObject({ code: 'vehicle', multiple: false });
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

	it('second deployModel produces same model (idempotent)', async () => {
		await deployModel(demoScheme, { org: TEST_ORG, mongoUri: config.mongodbUri });
		const model2 = await machineServer.getModel();
		expect(Object.keys(model2)).toEqual(expect.arrayContaining(COLLECTIONS));
		expect(model2.vehicle.fields.license_plate.type).toBe('text');
		expect(model2.rental.fks.vehicle.code).toBe('vehicle');
	});
});
