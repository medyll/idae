import type { IdbqModel } from '@medyll/idae-idbql';

export type Product = {
	id:          string;
	name:        string;
	description: string;
	price:       number;
	categoryId:  string;
	created_at:  Date;
	is_active:   boolean;
};

export type ProductCategory = {
	id:          string;
	name:        string;
	description: string;
};

export const testScheme = {
	vehicle:         {
		keyPath:  '++id',
		model:    {},
		ts:       {} as {
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
		template: {
			index:        'id',
			presentation: 'license_plate model brand year status',
			fields:       {
				id:               'id (readonly)',
				license_plate:    'text (required)',
				model:            'text (required)',
				brand:            'text',
				year:             'number',
				categoryId:       'fk-category.id',
				locationOfficeId: 'fk-location_office.id',
				status:           'text',
				mileage:          'number',
				created_at:       'date'
			},
			fks:          {
				category:        { code: 'category', rules: '', multiple: false },
				location_office: { code: 'location_office', rules: '', multiple: false }
			}
		}
	},
	category:        {
		keyPath:  '++id',
		model:    {},
		ts:       {} as { id: string; code: string; name: string; description?: string },
		template: {
			index:        'id',
			presentation: 'name',
			fields:       {
				id:          'id (readonly)',
				code:        'text (required)',
				name:        'text (required)',
				description: 'text-long'
			},
			fks:          {}
		}
	},
	customer:        {
		keyPath:  '++id',
		model:    {},
		ts:       {} as {
			id: string;
			first_name: string;
			last_name: string;
			email: string;
			phone?: string;
			drivers_license?: string;
			created_at?: Date;
		},
		template: {
			index:        'id',
			presentation: 'first_name last_name email',
			fields:       {
				id:              'id (readonly)',
				first_name:      'text (required)',
				last_name:       'text (required)',
				email:           'text (required)',
				phone:           'text',
				drivers_license: 'text',
				created_at:      'date'
			},
			fks:          {}
		}
	},
	rental:          {
		keyPath:  '++id',
		model:    {},
		ts:       {} as {
			id: string;
			vehicleId: string;
			customerId: string;
			start_date: Date;
			end_date?: Date;
			price_per_day: number;
			total_price?: number;
			status: 'booked' | 'active' | 'completed' | 'cancelled';
		},
		template: {
			index:        'id',
			presentation: 'vehicleId customerId start_date end_date status',
			fields:       {
				id:            'id (readonly)',
				vehicleId:     'fk-vehicle.id (required)',
				customerId:    'fk-customer.id (required)',
				start_date:    'date (required)',
				end_date:      'date',
				price_per_day: 'number (required)',
				total_price:   'number',
				status:        'text'
			},
			fks:          {
				vehicle:  { code: 'vehicle', rules: 'required', multiple: false },
				customer: { code: 'customer', rules: 'required', multiple: false }
			}
		}
	},
	location_office: {
		keyPath:  '++id',
		model:    {},
		ts:       {} as {
			id: string;
			code: string;
			address: string;
			city: string;
			country: string;
			phone?: string;
		},
		template: {
			index:        'id',
			presentation: 'code city address',
			fields:       {
				id:      'id (readonly)',
				code:    'text (required)',
				address: 'text',
				city:    'text',
				country: 'text',
				phone:   'text'
			},
			fks:          {}
		}
	},
	maintenance:     {
		keyPath:  '++id',
		model:    {},
		ts:       {} as {
			id: string;
			vehicleId: string;
			date: Date;
			type: string;
			cost?: number;
			notes?: string;
		},
		template: {
			index:        'id',
			presentation: 'vehicleId date type cost',
			fields:       {
				id:        'id (readonly)',
				vehicleId: 'fk-vehicle.id (required)',
				date:      'date',
				type:      'text',
				cost:      'number',
				notes:     'text-long'
			},
			fks:          {
				vehicle: { code: 'vehicle', rules: 'required', multiple: false }
			}
		}
	}
} satisfies IdbqModel;

// Demo seed data moved inline here (to avoid creating new directories in automated run)
export const demoSeed = {
	category:        [
		{ id: 1, code: 'compact', name: 'Compact', description: 'Small cars, economical.' },
		{ id: 2, code: 'suv', name: 'SUV', description: 'Sport Utility Vehicles.' },
		{ id: 3, code: 'lux', name: 'Luxury', description: 'Premium vehicles.' }
	],
	location_office: [
		{
			id: 1,
			code: 'PAR-01',
			address: '10 Rue de Paris',
			city: 'Paris',
			country: 'France',
			phone: '+33123456789'
		},
		{ id: 2, code: 'LYO-01', address: '5 Rue de Lyon', city: 'Lyon', country: 'France' }
	],
	vehicle:         [
		{
			id: 1,
			license_plate: 'AA-111-BB',
			model: 'Clio',
			brand: 'Renault',
			year: 2018,
			categoryId: 1,
			locationOfficeId: 1,
			status: 'available',
			mileage: 45000
		},
		{
			id: 2,
			license_plate: 'CC-222-DD',
			model: '208',
			brand: 'Peugeot',
			year: 2019,
			categoryId: 1,
			locationOfficeId: 1,
			status: 'rented',
			mileage: 32000
		},
		{
			id: 3,
			license_plate: 'EE-333-FF',
			model: 'Captur',
			brand: 'Renault',
			year: 2020,
			categoryId: 2,
			locationOfficeId: 2,
			status: 'available',
			mileage: 15000
		}
	],
	customer:        [
		{
			id: 1,
			first_name: 'Alice',
			last_name: 'Durand',
			email: 'alice@example.com',
			phone: '+33611223344'
		},
		{ id: 2, first_name: 'Bob', last_name: 'Martin', email: 'bob@example.com' }
	],
	rental:          [
		{
			id: 1,
			vehicleId: 2,
			customerId: 1,
			start_date: new Date('2026-03-01'),
			end_date: new Date('2026-03-05'),
			price_per_day: 45,
			total_price: 180,
			status: 'completed'
		}
	],
	maintenance:     [
		{
			id: 1,
			vehicleId: 1,
			date: new Date('2026-02-20'),
			type: 'oil change',
			cost: 120,
			notes: 'Standard maintenance'
		}
	]
};

export default demoSeed;
