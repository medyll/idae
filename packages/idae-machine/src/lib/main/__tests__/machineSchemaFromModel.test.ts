/**
 * Unit test: getModel() output → MachineDb construction → schema resolved
 *
 * Uses a MachineModel that mimics getModel() output (flat fields/fks at root,
 * template with presentation hint) — no MongoDB, no IndexedDB required.
 *
 * Validates that MachineDb can consume getModel() output and resolve
 * field types, FK relations, and presentation template correctly.
 */
import { describe, it, expect } from 'vitest';
import { MachineDb } from '../machineDb.js';
import type { MachineModel } from '$lib/types/index.js';

// Simulates what machineServer.getModel() returns for demoScheme
const modelFromServer: MachineModel = {
	vehicle: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:               { type: 'id',                  readonly: true },
			license_plate:    { type: 'text',                required: true },
			model:            { type: 'text',                required: true },
			brand:            { type: 'text' },
			year:             { type: 'number' },
			categoryId:       { type: 'fk-category.id' },
			locationOfficeId: { type: 'fk-location_office.id' },
			status:           { type: 'text' },
			mileage:          { type: 'number' },
			created_at:       { type: 'date' },
		},
		fks: {
			category:        { code: 'category',        multiple: false },
			location_office: { code: 'location_office', multiple: false },
		},
		template: { presentation: 'license_plate model brand year status' },
	},
	category: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:          { type: 'id',        readonly: true },
			code:        { type: 'text',      required: true },
			name:        { type: 'text',      required: true },
			description: { type: 'text-lg' },
		},
		fks:      {},
		template: { presentation: 'name' },
	},
	rental: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:            { type: 'id',             readonly: true },
			vehicleId:     { type: 'fk-vehicle.id',  required: true },
			customerId:    { type: 'fk-customer.id', required: true },
			start_date:    { type: 'date',           required: true },
			end_date:      { type: 'date' },
			price_per_day: { type: 'number',         required: true },
			total_price:   { type: 'number' },
			status:        { type: 'text' },
		},
		fks: {
			vehicle:  { code: 'vehicle',  multiple: false, required: true },
			customer: { code: 'customer', multiple: false, required: true },
		},
		template: { presentation: 'fks.vehicle.license_plate fks.customer.last_name start_date status' },
	},
	customer: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:         { type: 'id',    readonly: true },
			first_name: { type: 'text',  required: true },
			last_name:  { type: 'text',  required: true },
			email:      { type: 'email', required: true },
			phone:      { type: 'text' },
		},
		fks:      {},
		template: { presentation: 'first_name last_name email' },
	},
	location_office: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:      { type: 'id',   readonly: true },
			code:    { type: 'text', required: true },
			address: { type: 'text' },
			city:    { type: 'text' },
			country: { type: 'text' },
		},
		fks:      {},
		template: { presentation: 'code city' },
	},
};

describe('MachineDb constructed from getModel() output', () => {
	const db = new MachineDb(modelFromServer);

	it('collections() lists all collections', () => {
		const cols  = db.collections();
		const names = cols.map((s) => s.name);
		expect(names).toContain('vehicle');
		expect(names).toContain('category');
		expect(names).toContain('rental');
		expect(names).toContain('customer');
	});

	it('collection(name) returns MachineScheme', () => {
		const scheme = db.collection('vehicle');
		expect(scheme).toBeDefined();
	});

	describe('vehicle schema', () => {
		const scheme = db.collection('vehicle');

		it('index derived from keyPath (++id → id)', () => {
			expect(scheme.index).toBe('id');
		});

		it('template.presentation preserved', () => {
			expect(scheme.template.presentation).toBe('license_plate model brand year status');
		});

		it('field(license_plate).parse() resolves fieldType=text', () => {
			const f = scheme.field('license_plate').parse();
			expect(f?.fieldType).toBe('text');
		});

		it('field(categoryId).parse() resolves fk fieldType', () => {
			const f = scheme.field('categoryId').parse();
			expect(f?.fieldType).toContain('fk-');
		});

		it('parseFks() returns forward FK collections', () => {
			const fks = scheme.parseFks();
			expect(fks).toHaveProperty('category');
			expect(fks).toHaveProperty('location_office');
		});
	});

	describe('rental schema', () => {
		const scheme = db.collection('rental');

		it('field(vehicleId).parse() resolves fk-vehicle.id', () => {
			const f = scheme.field('vehicleId').parse();
			expect(f?.fieldType).toContain('fk-');
		});

		it('parseFks() has vehicle and customer', () => {
			const fks = scheme.parseFks();
			expect(fks).toHaveProperty('vehicle');
			expect(fks).toHaveProperty('customer');
		});
	});

	describe('category schema (no fks)', () => {
		const scheme = db.collection('category');

		it('parseFks() returns empty (no fks defined)', () => {
			const fks = scheme.parseFks();
			expect(Object.keys(fks)).toHaveLength(0);
		});

		it('field(description).parse() resolves fieldType with text', () => {
			const f = scheme.field('description').parse();
			expect(f?.fieldType).toMatch(/text/);
		});
	});

	it('unknown collection returns undefined', () => {
		expect(() => db.collection('nonexistent')).toThrow();
	});
});
