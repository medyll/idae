import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

export const demoScheme: MachineModel = {

	// ── Référentiels ──────────────────────────────────────────────────────────

	category: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',     readonly: true },
			code:            { type: 'text',   required: true },
			name:            { type: 'text',   required: true },
			description:     { type: 'text-lg' },
			daily_rate_base: { type: 'number' },
		},
		fks: {},
		template: { presentation: 'name code' },
	},

	location_office: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',    readonly: true },
			code:    { type: 'text',  required: true },
			name:    { type: 'text',  required: true },
			address: { type: 'text' },
			city:    { type: 'text' },
			country: { type: 'text' },
			phone:   { type: 'phone' },
			manager: { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name city code' },
	},

	supplier: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',    readonly: true },
			code:         { type: 'text',  required: true },
			name:         { type: 'text',  required: true },
			type:         { type: 'text' },
			contact_name: { type: 'text' },
			email:        { type: 'email' },
			phone:        { type: 'phone' },
			city:         { type: 'text' },
			country:      { type: 'text' },
		},
		fks: {},
		template: { presentation: 'name city type' },
	},

	seller: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',    readonly: true },
			first_name:      { type: 'text',  required: true },
			last_name:       { type: 'text',  required: true },
			email:           { type: 'email', required: true },
			phone:           { type: 'phone' },
			status:          { type: 'text' },
			hire_date:       { type: 'date' },
		},
		fks: {
			location_office: { code: 'location_office', multiple: false },
		},
		template: { presentation: 'first_name last_name email status' },
	},

	// ── Flotte ────────────────────────────────────────────────────────────────

	vehicle: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',    readonly: true },
			license_plate:   { type: 'text',  required: true },
			model:           { type: 'text',  required: true },
			brand:           { type: 'text',  required: true },
			year:            { type: 'number' },
			color:           { type: 'text' },
			fuel_type:       { type: 'text' },
			status:          { type: 'text' },
			mileage:         { type: 'number' },
			created_at:      { type: 'date' },
		},
		fks: {
			category:        { code: 'category',        multiple: false },
			location_office: { code: 'location_office', multiple: false },
		},
		template: { presentation: 'license_plate brand model year status' },
	},

	vehicle_acquisition: {
		base: 'machine_base',
		fields: {
			id:               { type: 'id',       readonly: true },
			acquisition_date: { type: 'date',     required: true },
			purchase_price:   { type: 'currency', required: true },
			invoice_ref:      { type: 'text' },
			warranty_months:  { type: 'number' },
			notes:            { type: 'text-lg' },
		},
		fks: {
			vehicle:  { code: 'vehicle',  multiple: false, required: true },
			supplier: { code: 'supplier', multiple: false, required: true },
		},
		template: { presentation: 'acquisition_date purchase_price invoice_ref' },
	},

	insurance: {
		base: 'machine_base',
		fields: {
			id:             { type: 'id',       readonly: true },
			provider:       { type: 'text',     required: true },
			policy_number:  { type: 'text',     required: true },
			start_date:     { type: 'date' },
			expires_at:     { type: 'date' },
			annual_premium: { type: 'currency' },
			coverage_type:  { type: 'text' },
			status:         { type: 'text' },
		},
		fks: {
			vehicle: { code: 'vehicle', multiple: false, required: true },
		},
		template: { presentation: 'provider policy_number expires_at status' },
	},

	maintenance: {
		base: 'machine_base',
		fields: {
			id:                 { type: 'id',       readonly: true },
			date:               { type: 'date' },
			type:               { type: 'text' },
			cost:               { type: 'currency' },
			mileage_at_service: { type: 'number' },
			notes:              { type: 'text-lg' },
			status:             { type: 'text' },
		},
		fks: {
			vehicle: { code: 'vehicle', required: true, multiple: false },
		},
		template: { presentation: 'date type status cost' },
	},

	fuel_log: {
		base: 'machine_base',
		fields: {
			id:      { type: 'id',       readonly: true },
			date:    { type: 'date',     required: true },
			liters:  { type: 'number',   required: true },
			cost:    { type: 'currency' },
			mileage: { type: 'number' },
			station: { type: 'text' },
		},
		fks: {
			vehicle: { code: 'vehicle', required: true, multiple: false },
		},
		template: { presentation: 'date liters cost mileage' },
	},

	// ── Location ──────────────────────────────────────────────────────────────

	customer: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',    readonly: true },
			first_name:      { type: 'text',  required: true },
			last_name:       { type: 'text',  required: true },
			email:           { type: 'email', required: true },
			phone:           { type: 'phone' },
			drivers_license: { type: 'text' },
			address:         { type: 'text' },
			city:            { type: 'text' },
			loyalty_points:  { type: 'number' },
			created_at:      { type: 'date' },
		},
		fks: {},
		template: { presentation: 'last_name first_name email city' },
	},

	pricing_rule: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',       readonly: true },
			season_code:   { type: 'text',     required: true },
			price_per_day: { type: 'currency', required: true },
			min_days:      { type: 'number' },
			discount_pct:  { type: 'number' },
			valid_from:    { type: 'date' },
			valid_until:   { type: 'date' },
		},
		fks: {
			category: { code: 'category', required: true, multiple: false },
		},
		template: { presentation: 'season_code price_per_day category' },
	},

	rental: {
		base: 'machine_base',
		fields: {
			id:              { type: 'id',       readonly: true },
			start_date:      { type: 'date',     required: true },
			planned_return:  { type: 'date' },
			end_date:        { type: 'date' },
			price_per_day:   { type: 'currency', required: true },
			total_price:     { type: 'currency' },
			deposit:         { type: 'currency' },
			pickup_mileage:  { type: 'number' },
			return_mileage:  { type: 'number' },
			status:          { type: 'text' },
			notes:           { type: 'text-lg' },
		},
		fks: {
			vehicle:  { code: 'vehicle',  required: true, multiple: false },
			customer: { code: 'customer', required: true, multiple: false },
			seller:   { code: 'seller',   required: false, multiple: false },
		},
		template: { presentation: 'start_date status price_per_day total_price' },
	},

	damage_report: {
		base: 'machine_base',
		fields: {
			id:                  { type: 'id',       readonly: true },
			reported_at:         { type: 'date',     required: true },
			description:         { type: 'text-lg',  required: true },
			location_on_vehicle: { type: 'text' },
			estimated_cost:      { type: 'currency' },
			repair_cost:         { type: 'currency' },
			charged_to_customer: { type: 'boolean' },
			status:              { type: 'text' },
		},
		fks: {
			rental:  { code: 'rental',  required: true, multiple: false },
			vehicle: { code: 'vehicle', required: true, multiple: false },
		},
		template: { presentation: 'reported_at status estimated_cost description' },
	},

	// ── CRM / Ventes ──────────────────────────────────────────────────────────

	lead: {
		base: 'machine_base',
		fields: {
			id:         { type: 'id',       readonly: true },
			first_name: { type: 'text',     required: true },
			last_name:  { type: 'text',     required: true },
			email:      { type: 'email' },
			phone:      { type: 'phone' },
			source:     { type: 'text' },
			interest:   { type: 'text' },
			budget:     { type: 'currency' },
			status:     { type: 'text' },
			notes:      { type: 'text-lg' },
			created_at: { type: 'date' },
		},
		fks: {
			seller: { code: 'seller', multiple: false },
		},
		template: { presentation: 'last_name first_name status source' },
	},

	sale_task: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',       readonly: true },
			type:         { type: 'text',     required: true },
			title:        { type: 'text',     required: true },
			due_date:     { type: 'date',     required: true },
			completed_at: { type: 'date' },
			priority:     { type: 'text' },
			status:       { type: 'text' },
			notes:        { type: 'text-lg' },
		},
		fks: {
			seller:   { code: 'seller',   required: true,  multiple: false },
			lead:     { code: 'lead',     required: false, multiple: false },
			customer: { code: 'customer', required: false, multiple: false },
		},
		template: { presentation: 'title type priority status due_date' },
	},

};

// ── Seed data ──────────────────────────────────────────────────────────────

export const demoSeed = {

	category: [
		{ id: 1, code: 'compact',  name: 'Compact',       description: 'Small cars, economical.', daily_rate_base: 35 },
		{ id: 2, code: 'suv',      name: 'SUV',           description: 'Sport Utility Vehicles.', daily_rate_base: 65 },
		{ id: 3, code: 'lux',      name: 'Luxury',        description: 'Premium vehicles.',       daily_rate_base: 120 },
		{ id: 4, code: 'utility',  name: 'Utility',       description: 'Vans and cargo vehicles.',daily_rate_base: 55 },
		{ id: 5, code: 'electric', name: 'Electric',      description: 'Zero-emission fleet.',    daily_rate_base: 75 },
	],

	location_office: [
		{ id: 1, code: 'PAR-01', name: 'Paris Centre',   address: '10 Rue de Rivoli',    city: 'Paris',  country: 'France', phone: '+33123456789', manager: 'Sophie Laurent' },
		{ id: 2, code: 'PAR-02', name: 'Paris Orly',     address: 'Aéroport Orly T4',   city: 'Orly',   country: 'France', phone: '+33123456790', manager: 'Marc Dupont' },
		{ id: 3, code: 'LYO-01', name: 'Lyon Part-Dieu', address: '5 Rue de Bonnel',    city: 'Lyon',   country: 'France', phone: '+33472456789', manager: 'Claire Morin' },
		{ id: 4, code: 'MRS-01', name: 'Marseille',      address: '3 Quai du Port',     city: 'Marseille', country: 'France', phone: '+33491456789' },
	],

	supplier: [
		{ id: 1, code: 'REN-FR',  name: 'Renault Distribution France', type: 'dealer',   contact_name: 'Jean-Paul Renaud', email: 'fleet@renault-distrib.fr', phone: '+33155667788', city: 'Boulogne',  country: 'France' },
		{ id: 2, code: 'PSA-IDF', name: 'Stellantis Fleet Île-de-France', type: 'dealer', contact_name: 'Isabelle Caron',  email: 'fleet@stellantis-idf.fr',  phone: '+33144556677', city: 'Poissy',   country: 'France' },
		{ id: 3, code: 'AUT-EU',  name: 'AutoAuctions Europe',          type: 'auction', contact_name: 'Peter Muller',    email: 'sales@autoauctions.eu',    phone: '+49302234567', city: 'Frankfurt', country: 'Germany' },
		{ id: 4, code: 'BYD-FR',  name: 'BYD France Importation',       type: 'importer',contact_name: 'Li Wei',          email: 'fleet@byd-france.fr',      phone: '+33140221133', city: 'Paris',    country: 'France' },
	],

	seller: [
		{ id: 1, first_name: 'Thomas',   last_name: 'Bernard',  email: 'tbernard@fleet.demo',  phone: '+33611001001', location_office: 1, status: 'active', hire_date: new Date('2022-03-15') },
		{ id: 2, first_name: 'Camille',  last_name: 'Rousseau', email: 'crousseau@fleet.demo', phone: '+33622002002', location_office: 1, status: 'active', hire_date: new Date('2023-07-01') },
		{ id: 3, first_name: 'Antoine',  last_name: 'Leblanc',  email: 'aleblanc@fleet.demo',  phone: '+33633003003', location_office: 3, status: 'active', hire_date: new Date('2021-11-20') },
		{ id: 4, first_name: 'Nathalie', last_name: 'Simon',    email: 'nsimon@fleet.demo',    phone: '+33644004004', location_office: 2, status: 'active', hire_date: new Date('2024-01-08') },
	],

	vehicle: [
		{ id: 1,  license_plate: 'AA-111-BB', model: 'Clio V',       brand: 'Renault',  year: 2022, color: 'Blanc',    fuel_type: 'essence',    category: 1, location_office: 1, status: 'available',   mileage: 28500 },
		{ id: 2,  license_plate: 'CC-222-DD', model: '208',           brand: 'Peugeot',  year: 2021, color: 'Gris',     fuel_type: 'diesel',     category: 1, location_office: 1, status: 'rented',      mileage: 45200 },
		{ id: 3,  license_plate: 'EE-333-FF', model: 'Captur',        brand: 'Renault',  year: 2023, color: 'Bleu',     fuel_type: 'hybride',    category: 2, location_office: 2, status: 'available',   mileage: 11800 },
		{ id: 4,  license_plate: 'GG-444-HH', model: 'Classe E',      brand: 'Mercedes', year: 2023, color: 'Noir',     fuel_type: 'diesel',     category: 3, location_office: 1, status: 'available',   mileage: 9300  },
		{ id: 5,  license_plate: 'II-555-JJ', model: 'Model 3',       brand: 'Tesla',    year: 2023, color: 'Blanc',    fuel_type: 'électrique', category: 5, location_office: 1, status: 'available',   mileage: 16200 },
		{ id: 6,  license_plate: 'KK-666-LL', model: 'Berlingo',      brand: 'Citroën',  year: 2022, color: 'Gris',     fuel_type: 'diesel',     category: 4, location_office: 3, status: 'maintenance', mileage: 72000 },
		{ id: 7,  license_plate: 'MM-777-NN', model: 'Atto 3',        brand: 'BYD',      year: 2024, color: 'Vert',     fuel_type: 'électrique', category: 5, location_office: 2, status: 'available',   mileage: 3200  },
		{ id: 8,  license_plate: 'OO-888-PP', model: 'Clio V',        brand: 'Renault',  year: 2022, color: 'Rouge',    fuel_type: 'essence',    category: 1, location_office: 4, status: 'available',   mileage: 34100 },
		{ id: 9,  license_plate: 'QQ-999-RR', model: '3008',          brand: 'Peugeot',  year: 2023, color: 'Gris',     fuel_type: 'hybride',    category: 2, location_office: 3, status: 'rented',      mileage: 22400 },
		{ id: 10, license_plate: 'SS-000-TT', model: 'Classe S',      brand: 'Mercedes', year: 2024, color: 'Noir',     fuel_type: 'hybride',    category: 3, location_office: 1, status: 'available',   mileage: 5100  },
	],

	vehicle_acquisition: [
		{ id: 1, vehicle: 1,  supplier: 1, acquisition_date: new Date('2022-01-10'), purchase_price: 18500, invoice_ref: 'REN-2022-0042', warranty_months: 24 },
		{ id: 2, vehicle: 2,  supplier: 2, acquisition_date: new Date('2021-06-15'), purchase_price: 16200, invoice_ref: 'PSA-2021-0887', warranty_months: 24 },
		{ id: 3, vehicle: 3,  supplier: 1, acquisition_date: new Date('2023-02-20'), purchase_price: 24800, invoice_ref: 'REN-2023-0115', warranty_months: 36 },
		{ id: 4, vehicle: 4,  supplier: 3, acquisition_date: new Date('2023-04-05'), purchase_price: 52000, invoice_ref: 'AUT-2023-0033', warranty_months: 12, notes: 'Véhicule démonstration' },
		{ id: 5, vehicle: 5,  supplier: 3, acquisition_date: new Date('2023-05-18'), purchase_price: 38500, invoice_ref: 'AUT-2023-0071', warranty_months: 48 },
		{ id: 6, vehicle: 7,  supplier: 4, acquisition_date: new Date('2024-01-08'), purchase_price: 31200, invoice_ref: 'BYD-2024-0009', warranty_months: 60 },
		{ id: 7, vehicle: 10, supplier: 3, acquisition_date: new Date('2024-03-01'), purchase_price: 89000, invoice_ref: 'AUT-2024-0012', warranty_months: 24 },
	],

	insurance: [
		{ id: 1, vehicle: 1,  provider: 'AXA',      policy_number: 'AXA-2022-FL-001', start_date: new Date('2022-01-10'), expires_at: new Date('2025-01-10'), annual_premium: 840,  coverage_type: 'tous risques', status: 'active' },
		{ id: 2, vehicle: 2,  provider: 'Allianz',  policy_number: 'ALZ-2021-FL-002', start_date: new Date('2021-06-15'), expires_at: new Date('2024-06-15'), annual_premium: 780,  coverage_type: 'tous risques', status: 'expired' },
		{ id: 3, vehicle: 4,  provider: 'Groupama', policy_number: 'GRP-2023-FL-003', start_date: new Date('2023-04-05'), expires_at: new Date('2026-04-05'), annual_premium: 1850, coverage_type: 'tous risques', status: 'active' },
		{ id: 4, vehicle: 5,  provider: 'Maif',     policy_number: 'MAI-2023-FL-004', start_date: new Date('2023-05-18'), expires_at: new Date('2026-05-18'), annual_premium: 1200, coverage_type: 'tous risques', status: 'active' },
		{ id: 5, vehicle: 7,  provider: 'AXA',      policy_number: 'AXA-2024-FL-005', start_date: new Date('2024-01-08'), expires_at: new Date('2027-01-08'), annual_premium: 960,  coverage_type: 'tous risques', status: 'active' },
	],

	customer: [
		{ id: 1, first_name: 'Alice',    last_name: 'Durand',   email: 'alice.durand@example.com',   phone: '+33611223344', city: 'Paris',     drivers_license: '01-2345-6789', loyalty_points: 450, created_at: new Date('2024-01-15') },
		{ id: 2, first_name: 'Bob',      last_name: 'Martin',   email: 'bob.martin@example.com',     phone: '+33622334455', city: 'Lyon',      drivers_license: '02-3456-7890', loyalty_points: 120 },
		{ id: 3, first_name: 'Chloé',    last_name: 'Petit',    email: 'chloe.petit@example.com',    phone: '+33633445566', city: 'Marseille', drivers_license: '03-4567-8901', loyalty_points: 80  },
		{ id: 4, first_name: 'David',    last_name: 'Leroy',    email: 'david.leroy@example.com',                          city: 'Bordeaux',  drivers_license: '04-5678-9012', loyalty_points: 0   },
		{ id: 5, first_name: 'Emma',     last_name: 'Moreau',   email: 'emma.moreau@example.com',    phone: '+33655667788', city: 'Paris',     drivers_license: '05-6789-0123', loyalty_points: 310, created_at: new Date('2024-03-20') },
		{ id: 6, first_name: 'François', last_name: 'Simon',    email: 'f.simon@example.com',        phone: '+33666778899', city: 'Nantes',    drivers_license: '06-7890-1234', loyalty_points: 0   },
		{ id: 7, first_name: 'Giulia',   last_name: 'Ferrari',  email: 'g.ferrari@example.com',      phone: '+33677889900', city: 'Nice',      drivers_license: 'IT-AA-123456', loyalty_points: 60  },
	],

	pricing_rule: [
		{ id: 1, category: '1', season_code: 'standard', price_per_day: 35,  min_days: 1, discount_pct: 0,  valid_from: new Date('2026-01-01'), valid_until: new Date('2026-12-31') },
		{ id: 2, category: '1', season_code: 'summer',   price_per_day: 45,  min_days: 3, discount_pct: 0,  valid_from: new Date('2026-06-15'), valid_until: new Date('2026-09-15') },
		{ id: 3, category: '2', season_code: 'standard', price_per_day: 65,  min_days: 1, discount_pct: 0  },
		{ id: 4, category: '2', season_code: 'summer',   price_per_day: 85,  min_days: 3, discount_pct: 5  },
		{ id: 5, category: '3', season_code: 'standard', price_per_day: 120, min_days: 2, discount_pct: 0  },
		{ id: 6, category: '3', season_code: 'weekend',  price_per_day: 150, min_days: 2, discount_pct: 0  },
		{ id: 7, category: '5', season_code: 'standard', price_per_day: 75,  min_days: 1, discount_pct: 10, valid_from: new Date('2026-01-01') },
		{ id: 8, category: '1', season_code: 'week',     price_per_day: 28,  min_days: 7, discount_pct: 20 },
	],

	rental: [
		{ id: 1, vehicle: 2, customer: 1, seller: 1, start_date: new Date('2026-03-01'), end_date: new Date('2026-03-05'),  planned_return: new Date('2026-03-05'),  price_per_day: 35,  total_price: 140,  deposit: 300, pickup_mileage: 44800, return_mileage: 45200, status: 'completed', notes: 'Client satisfait' },
		{ id: 2, vehicle: 9, customer: 5, seller: 2, start_date: new Date('2026-05-10'), planned_return: new Date('2026-05-17'), price_per_day: 85, deposit: 500, pickup_mileage: 21600, status: 'active' },
		{ id: 3, vehicle: 3, customer: 3, seller: 1, start_date: new Date('2026-04-18'), end_date: new Date('2026-04-22'),  planned_return: new Date('2026-04-22'),  price_per_day: 65,  total_price: 260,  deposit: 400, pickup_mileage: 11200, return_mileage: 11800, status: 'completed' },
		{ id: 4, vehicle: 4, customer: 7, seller: 3, start_date: new Date('2026-02-14'), end_date: new Date('2026-02-16'),  planned_return: new Date('2026-02-16'),  price_per_day: 120, total_price: 240,  deposit: 800, pickup_mileage: 9000,  return_mileage: 9300,  status: 'completed', notes: 'Cadeau Saint-Valentin' },
		{ id: 5, vehicle: 1, customer: 2, seller: 4, start_date: new Date('2026-05-20'), planned_return: new Date('2026-05-27'), price_per_day: 28, deposit: 250, pickup_mileage: 28500, status: 'active', notes: 'Tarif semaine' },
	],

	damage_report: [
		{ id: 1, rental: 1, vehicle: 2, reported_at: new Date('2026-03-05'), description: 'Rayure sur le pare-chocs arrière gauche, environ 15cm', location_on_vehicle: 'Pare-chocs arrière gauche', estimated_cost: 350, repair_cost: 280, charged_to_customer: true,  status: 'repaired' },
		{ id: 2, rental: 4, vehicle: 4, reported_at: new Date('2026-02-16'), description: 'Impact sur le rétroviseur droit, vitre fissurée',         location_on_vehicle: 'Rétroviseur droit',          estimated_cost: 180, charged_to_customer: false, status: 'repaired', notes: 'Accrochage parking, responsabilité partagée' },
	],

	maintenance: [
		{ id: 1, vehicle: 1,  date: new Date('2026-02-20'), type: 'oil_change',         cost: 120, mileage_at_service: 28000, notes: 'Révision standard',              status: 'completed' },
		{ id: 2, vehicle: 6,  date: new Date('2026-05-15'), type: 'clutch_replacement',  cost: 980, mileage_at_service: 71500, notes: 'Embrayage usé',                  status: 'in_progress' },
		{ id: 3, vehicle: 2,  date: new Date('2026-06-01'), type: 'tire_rotation',       cost: 80,  mileage_at_service: 46000,                                          status: 'scheduled' },
		{ id: 4, vehicle: 5,  date: new Date('2026-04-10'), type: 'brake_inspection',    cost: 150, mileage_at_service: 15800, notes: 'Freins avant 60%',               status: 'completed' },
		{ id: 5, vehicle: 8,  date: new Date('2026-03-25'), type: 'oil_change',          cost: 115, mileage_at_service: 33800,                                          status: 'completed' },
	],

	fuel_log: [
		{ id: 1,  vehicle: 1, date: new Date('2026-04-05'), liters: 38.5, cost: 63.5,  mileage: 27200, station: 'Total Orly' },
		{ id: 2,  vehicle: 2, date: new Date('2026-04-02'), liters: 42.0, cost: 67.2,  mileage: 44100, station: 'BP Paris 12' },
		{ id: 3,  vehicle: 3, date: new Date('2026-04-08'), liters: 35.0, cost: 58.5,  mileage: 11100, station: 'Esso Lyon' },
		{ id: 4,  vehicle: 8, date: new Date('2026-04-12'), liters: 40.0, cost: 66.0,  mileage: 33500, station: 'Total Marseille' },
		{ id: 5,  vehicle: 9, date: new Date('2026-05-08'), liters: 44.5, cost: 72.5,  mileage: 21400, station: 'Shell Lyon' },
	],

	lead: [
		{ id: 1, first_name: 'Marc',    last_name: 'Fontaine', email: 'marc.fontaine@gmail.com',    phone: '+33611000001', source: 'website',    interest: 'SUV longue durée',       budget: 1500,  seller: 1, status: 'qualified',   created_at: new Date('2026-04-15'), notes: 'Entreprise de 10 salariés, besoin flotte' },
		{ id: 2, first_name: 'Laure',   last_name: 'Garnier',  email: 'l.garnier@societe.fr',       phone: '+33622000002', source: 'referral',   interest: 'Compact économique',     budget: 800,   seller: 2, status: 'contacted',   created_at: new Date('2026-05-02') },
		{ id: 3, first_name: 'Romain',  last_name: 'Leroux',   email: 'romain.leroux@hotmail.com',                         source: 'social',     interest: 'Véhicule électrique',    budget: 2000,  seller: 1, status: 'new',         created_at: new Date('2026-05-18') },
		{ id: 4, first_name: 'Sylvie',  last_name: 'Dupuis',   email: 'sdupuis@mairie.fr',          phone: '+33633000003', source: 'phone',      interest: 'Utilitaires x3',         budget: 4500,  seller: 3, status: 'negotiation', created_at: new Date('2026-03-10'), notes: 'Mairie — 3 berlingo, contrat annuel' },
		{ id: 5, first_name: 'Kevin',   last_name: 'Bastien',  email: 'k.bastien@startup.io',       phone: '+33644000004', source: 'event',      interest: 'Luxe pour événement',    budget: 500,   seller: 2, status: 'lost',        created_at: new Date('2026-02-28'), notes: 'Budget insuffisant pour nos tarifs' },
		{ id: 6, first_name: 'Amélie',  last_name: 'Chabert',  email: 'a.chabert@cabinet.com',                             source: 'website',    interest: 'Classe E ou équivalent', budget: 3000,  seller: 4, status: 'qualified',   created_at: new Date('2026-05-10') },
	],

	sale_task: [
		{ id: 1,  seller: 1, lead: 1, type: 'call',      title: 'Rappel qualification flotte',            due_date: new Date('2026-05-25'), priority: 'high',   status: 'todo',        notes: 'Demander taille exacte flotte et budget annuel' },
		{ id: 2,  seller: 1, lead: 1, type: 'quote',     title: 'Préparer devis flotte 5 SUV',             due_date: new Date('2026-05-28'), priority: 'high',   status: 'todo' },
		{ id: 3,  seller: 2, lead: 2, type: 'email',     title: 'Envoyer brochure compact',                due_date: new Date('2026-05-22'), priority: 'medium', status: 'done',        completed_at: new Date('2026-05-21') },
		{ id: 4,  seller: 2, lead: 2, type: 'follow_up', title: 'Relance suite brochure',                  due_date: new Date('2026-05-29'), priority: 'medium', status: 'todo' },
		{ id: 5,  seller: 3, lead: 4, type: 'visit',     title: 'Visite mairie — présentation utilitaires', due_date: new Date('2026-05-23'), priority: 'urgent', status: 'in_progress', notes: 'RDV confirmé 14h, salle du conseil' },
		{ id: 6,  seller: 3, lead: 4, type: 'quote',     title: 'Devis contrat annuel 3 Berlingo',         due_date: new Date('2026-05-26'), priority: 'urgent', status: 'todo' },
		{ id: 7,  seller: 1, lead: 3, type: 'demo',      title: 'Démonstration Atto 3',                    due_date: new Date('2026-06-01'), priority: 'medium', status: 'todo',        notes: 'Proposer essai véhicule #7' },
		{ id: 8,  seller: 4, lead: 6, type: 'call',      title: 'Premier contact — cabinet avocat',        due_date: new Date('2026-05-23'), priority: 'high',   status: 'todo' },
		{ id: 9,  seller: 2, customer: 1, type: 'follow_up', title: 'Fidélisation Alice Durand',           due_date: new Date('2026-06-05'), priority: 'low',    status: 'todo',        notes: '450 pts fidélité — proposer offre premium' },
		{ id: 10, seller: 1, customer: 5, type: 'call',   title: 'Satisfaction Emma Moreau',            due_date: new Date('2026-05-27'), priority: 'medium', status: 'todo',        notes: 'Location en cours — vérifier satisfaction' },
	],
};

export default demoSeed;
