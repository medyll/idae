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
