import { v4 as uuid } from 'uuid';

export const seed = {
	category: [
		{ id: 'cat-compact', code: 'compact', name: 'Compact', description: 'Small, economical cars' },
		{ id: 'cat-suv', code: 'suv', name: 'SUV', description: 'Spacious, all-terrain' }
	],
	location_office: [
		{ id: 'office-paris', code: 'PAR', address: '1 Rue de Demo, Paris', city: 'Paris', country: 'FR', phone: '+33 1 23 45 67 89' }
	],
	vehicle: [
		{ id: 'veh-1', license_plate: 'AB-123-CD', model: 'Clio', brand: 'Renault', year: 2019, categoryId: 'cat-compact', locationOfficeId: 'office-paris', status: 'available', mileage: 45000 },
		{ id: 'veh-2', license_plate: 'EF-456-GH', model: 'Captur', brand: 'Renault', year: 2021, categoryId: 'cat-suv', locationOfficeId: 'office-paris', status: 'maintenance', mileage: 20000 }
	],
	customer: [
		{ id: 'cus-1', first_name: 'Alice', last_name: 'Dupont', email: 'alice.dupont@example.com' },
		{ id: 'cus-2', first_name: 'Bob', last_name: 'Martin', email: 'bob.martin@example.com' }
	],
	rental: [
		{ id: 'r-1', vehicleId: 'veh-1', customerId: 'cus-1', start_date: new Date('2026-03-01'), end_date: new Date('2026-03-05'), price_per_day: 45, total_price: 225, status: 'completed' }
	],
	maintenance: [
		{ id: 'm-1', vehicleId: 'veh-2', date: new Date('2026-02-20'), type: 'oil-change', cost: 120, notes: 'Changed oil and filter' }
	]
};
