/**
 * Unit test: getModel() output → MachineDb construction → schema resolved
 *
 * Uses a MachineModel that mimics getModel() output (scalar fields in `fields`,
 * FK relations exclusively in `fks` block — no fk-* typed scalar fields).
 */
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeAll } from 'vitest';
import { bootWithRelations } from './_relationTestUtils.js';
import type { MachineDb } from '../machineDb.js';
import type { MachineModel } from '$lib/types/index.js';

// Simulates what machineServer.getModel() returns for demoScheme.
// FK relations live in `fks` only — never as fk-* typed scalars in `fields`.
const modelFromServer: MachineModel = {
	vehicle: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:           { type: 'id',     readonly: true },
			license_plate:{ type: 'text',   required: true },
			model:        { type: 'text',   required: true },
			brand:        { type: 'text' },
			year:         { type: 'number' },
			status:       { type: 'text' },
			mileage:      { type: 'number' },
			created_at:   { type: 'date' },
		},
		fkRelations: {
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
			id:          { type: 'id',      readonly: true },
			code:        { type: 'text',    required: true },
			name:        { type: 'text',    required: true },
			description: { type: 'text-lg' },
		},
		fkRelations:      {},
		template: { presentation: 'name' },
	},
	rental: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		fields: {
			id:           { type: 'id',     readonly: true },
			start_date:   { type: 'date',   required: true },
			end_date:     { type: 'date' },
			price_per_day:{ type: 'number', required: true },
			total_price:  { type: 'number' },
			status:       { type: 'text' },
		},
		fkRelations: {
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
		fkRelations:      {},
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
		fkRelations:      {},
		template: { presentation: 'code city' },
	},
};

describe('MachineDb constructed from getModel() output', () => {
	let db: MachineDb;
	beforeAll(async () => {
		const m = await bootWithRelations('schema-from-model', modelFromServer);
		db = m.logic;
	});

	it('collections() lists all collections', () => {
		const names = db.collections().map((s) => s.name);
		expect(names).toContain('vehicle');
		expect(names).toContain('category');
		expect(names).toContain('rental');
		expect(names).toContain('customer');
	});

	it('collection(name) returns MachineScheme', () => {
		expect(db.collection('vehicle')).toBeDefined();
	});

	describe('vehicle schema', () => {
		const scheme = () => db.collection('vehicle');

		it('index derived from keyPath (++id → id)', () => {
			expect(scheme().index).toBe('id');
		});

		it('template.presentation preserved', () => {
			expect(scheme().template.presentation).toBe('license_plate model brand year status');
		});

		it('field(license_plate).parse() resolves fieldType=text', () => {
			expect(scheme().field('license_plate').parse()?.fieldType).toBe('text');
		});

		it('parseFks() returns forward FK collections', () => {
			const fks = scheme().parseFks();
			expect(fks).toHaveProperty('category');
			expect(fks).toHaveProperty('location_office');
		});

		it('field(category).parse() resolves FK relation from fks block (no FIELD_NOT_FOUND)', () => {
			// category lives in `fks`, not `fields` — getFieldRule must synthesize
			// a fk-<code>.code rule so DataField can render it (view="fk" path).
			const f = scheme().field('category').parse();
			expect(f?.fieldType).toBe('fk-category.code');
			expect(f?.is).toBe('fk');
		});

		it('no fk-* typed scalars in fields', () => {
			const hasFkScalar = Object.values(scheme().fields).some(
				(f: any) => (f?.type ?? '').startsWith('fk-')
			);
			expect(hasFkScalar).toBe(false);
		});
	});

	describe('rental schema', () => {
		const scheme = () => db.collection('rental');

		it('parseFks() has vehicle and customer', () => {
			const fks = scheme().parseFks();
			expect(fks).toHaveProperty('vehicle');
			expect(fks).toHaveProperty('customer');
		});

		it('no fk-* typed scalars in fields', () => {
			const hasFkScalar = Object.values(scheme().fields).some(
				(f: any) => (f?.type ?? '').startsWith('fk-')
			);
			expect(hasFkScalar).toBe(false);
		});
	});

	describe('category schema (no fks)', () => {
		const scheme = () => db.collection('category');

		it('parseFks() returns empty', () => {
			expect(Object.keys(scheme().parseFks())).toHaveLength(0);
		});

		it('field(description).parse() resolves fieldType with text', () => {
			expect(scheme().field('description').parse()?.fieldType).toMatch(/text/);
		});
	});

	it('unknown collection throws', () => {
		expect(() => db.collection('nonexistent')).toThrow();
	});
});
