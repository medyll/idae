import type { MachineModel } from '../../../../src/lib/types/machine-model.js';
import { field } from '../../../../src/lib/main/machine/fieldBuilder.js';

export const demoScheme: MachineModel = {
	vehicle: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as {
			id:                string;
			license_plate:     string;
			model:             string;
			brand:             string;
			year:              number;
			categoryId?:       string;
			locationOfficeId?: string;
			status:            'available' | 'rented' | 'maintenance' | 'retired';
			mileage?:          number;
			created_at?:       Date;
		},
		fields: {
			id:               field('id',                    { readonly: true }),
			license_plate:    field('text',                  { required: true }),
			model:            field('text',                  { required: true }),
			brand:            field('text'),
			year:             field('number'),
			categoryId:       field('fk-category.id'),
			locationOfficeId: field('fk-location_office.id'),
			status:           field('text'),
			mileage:          field('number'),
			created_at:       field('date'),
		},
		fks: {
			category:        { code: 'category',        multiple: false, required: false },
			location_office: { code: 'location_office', multiple: false, required: false },
		},
		template: {
			presentation: 'license_plate model brand year status',
		},
	},

	category: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as { id: string; code: string; name: string; description?: string },
		fields: {
			id:          field('id',        { readonly: true }),
			code:        field('text',      { required: true }),
			name:        field('text',      { required: true }),
			description: field('text-lg'),
		},
		fks: {},
		template: {
			presentation: 'name',
		},
	},

	customer: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as {
			id:               string;
			first_name:       string;
			last_name:        string;
			email:            string;
			phone?:           string;
			drivers_license?: string;
			created_at?:      Date;
		},
		fields: {
			id:              field('id',    { readonly: true }),
			first_name:      field('text',  { required: true }),
			last_name:       field('text',  { required: true }),
			email:           field('email', { required: true }),
			phone:           field('text'),
			drivers_license: field('text'),
			created_at:      field('date'),
		},
		fks: {},
		template: {
			presentation: 'first_name last_name email',
		},
	},

	rental: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as {
			id:            string;
			vehicleId:     string;
			customerId:    string;
			start_date:    Date;
			end_date?:     Date;
			price_per_day: number;
			total_price?:  number;
			status:        'booked' | 'active' | 'completed' | 'cancelled';
		},
		fields: {
			id:            field('id',             { readonly: true }),
			vehicleId:     field('fk-vehicle.id',  { required: true }),
			customerId:    field('fk-customer.id', { required: true }),
			start_date:    field('date',           { required: true }),
			end_date:      field('date'),
			price_per_day: field('number',         { required: true }),
			total_price:   field('number'),
			status:        field('text'),
		},
		fks: {
			vehicle:  { code: 'vehicle',  required: true, multiple: false },
			customer: { code: 'customer', required: true, multiple: false },
		},
		template: {
			presentation: 'fks.vehicle.license_plate fks.customer.last_name start_date status',
		},
	},

	location_office: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as {
			id:      string;
			code:    string;
			address: string;
			city:    string;
			country: string;
			phone?:  string;
		},
		fields: {
			id:      field('id',   { readonly: true }),
			code:    field('text', { required: true }),
			address: field('text'),
			city:    field('text'),
			country: field('text'),
			phone:   field('text'),
		},
		fks: {},
		template: {
			presentation: 'code city address',
		},
	},

	maintenance: {
		keyPath: '++id',
		base:    'machine_user',
		model:   {},
		ts:      {} as {
			id:        string;
			vehicleId: string;
			date:      Date;
			type:      string;
			cost?:     number;
			notes?:    string;
		},
		fields: {
			id:        field('id',            { readonly: true }),
			vehicleId: field('fk-vehicle.id', { required: true }),
			date:      field('date'),
			type:      field('text'),
			cost:      field('number'),
			notes:     field('text-lg'),
		},
		fks: {
			vehicle: { code: 'vehicle', required: true, multiple: false },
		},
		template: {
			presentation: 'fks.vehicle.license_plate date type cost',
		},
	},
};

export const demoSeed = {
	category: [
		{ id: 1, code: 'compact', name: 'Compact',  description: 'Small cars, economical.' },
		{ id: 2, code: 'suv',     name: 'SUV',      description: 'Sport Utility Vehicles.' },
		{ id: 3, code: 'lux',     name: 'Luxury',   description: 'Premium vehicles.' },
	],
	location_office: [
		{ id: 1, code: 'PAR-01', address: '10 Rue de Paris', city: 'Paris', country: 'France', phone: '+33123456789' },
		{ id: 2, code: 'LYO-01', address: '5 Rue de Lyon',   city: 'Lyon',  country: 'France' },
	],
	vehicle: [
		{ id: 1, license_plate: 'AA-111-BB', model: 'Clio',   brand: 'Renault', year: 2018, categoryId: 1, locationOfficeId: 1, status: 'available', mileage: 45000 },
		{ id: 2, license_plate: 'CC-222-DD', model: '208',    brand: 'Peugeot', year: 2019, categoryId: 1, locationOfficeId: 1, status: 'rented',    mileage: 32000 },
		{ id: 3, license_plate: 'EE-333-FF', model: 'Captur', brand: 'Renault', year: 2020, categoryId: 2, locationOfficeId: 2, status: 'available', mileage: 15000 },
	],
	customer: [
		{ id: 1, first_name: 'Alice', last_name: 'Durand', email: 'alice@example.com', phone: '+33611223344' },
		{ id: 2, first_name: 'Bob',   last_name: 'Martin', email: 'bob@example.com' },
	],
	rental: [
		{ id: 1, vehicleId: 2, customerId: 1, start_date: new Date('2026-03-01'), end_date: new Date('2026-03-05'), price_per_day: 45, total_price: 180, status: 'completed' },
	],
	maintenance: [
		{ id: 1, vehicleId: 1, date: new Date('2026-02-20'), type: 'oil change', cost: 120, notes: 'Standard maintenance' },
	],
};

export default demoSeed;
