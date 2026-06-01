/**
 * S11-01: IDB CRUD round-trip via machine.collection()
 *
 * Tests all CRUD verbs (create, getAll, where, update, delete, count)
 * on all 6 demoScheme collections using fake-indexeddb.
 */
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Machine } from '../machine.js';
import { demoScheme, demoSeed } from '../../demo/demoScheme.js';

const COLLECTIONS = ['vehicle', 'category', 'customer', 'rental', 'location_office', 'maintenance'] as const;

let _dbCounter = 0;

function resetIndexedDB() {
	(globalThis as any).indexedDB = new IDBFactory();
}

function uniqueDbName(base: string) {
	return `${base}-${++_dbCounter}`;
}

async function createStartedMachine(dbName: string) {
	const m = new Machine(dbName, 1, demoScheme);
	await m.boot();
	return m;
}

describe('S11-01: machine.collection() IDB CRUD round-trip', () => {
	beforeEach(() => {
		resetIndexedDB();
	});

	afterEach(() => {
		_dbCounter = 0;
	});

	describe('machine.boot() with demoScheme — zero errors', () => {
		it('starts without throwing', async () => {
			await expect(createStartedMachine(uniqueDbName('s11-start-test'))).resolves.toBeDefined();
		});

		it('exposes all 6 collections via machine.collection()', async () => {
			const m = await createStartedMachine(uniqueDbName('s11-collections-test'));
			for (const name of COLLECTIONS) {
				expect(() => m.collection(name)).not.toThrow();
				expect(m.collection(name)).toBeDefined();
			}
		});

		it('throws for nonexistent collection', async () => {
			const m = await createStartedMachine(uniqueDbName('s11-nonexistent-test'));
			expect(() => m.collection('nonexistent')).toThrow(/Collection "nonexistent" not found/);
		});
	});

	describe('category collection — full CRUD', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-category-crud'));
		});

		it('create returns doc with id', async () => {
			const col = m.collection('category');
			const doc = await col.create({ code: 'x', name: 'X' });
			expect(doc).toBeDefined();
			expect(doc.id).toBeDefined();
		});

		it('getAll returns created doc', async () => {
			const col = m.collection('category');
			await col.create({ code: 'x', name: 'X' });
			const all = await col.getAll();
			expect(all).toHaveLength(1);
			expect(all[0].code).toBe('x');
			expect(all[0].name).toBe('X');
		});

		it('update returns modified doc', async () => {
			const col = m.collection('category');
			const created = await col.create({ code: 'upd', name: 'Before' });
			const updated = await col.update(created.id, { name: 'After' });
			expect(updated.name).toBe('After');
			expect(updated.code).toBe('upd');
		});

		it('delete returns true, getAll no longer contains it', async () => {
			const col = m.collection('category');
			const created = await col.create({ code: 'del', name: 'ToDelete' });
			const result = await col.delete(created.id);
			expect(result).toBe(true);
			const all = await col.getAll();
			expect(all.find((d: any) => d.id === created.id)).toBeUndefined();
		});

		it('count returns correct integer', async () => {
			const col = m.collection('category');
			await col.create({ code: 'c1', name: 'C1' });
			await col.create({ code: 'c2', name: 'C2' });
			const count = await col.count();
			expect(count).toBe(2);
		});
	});

	describe('vehicle collection — CRUD + where filter', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-vehicle-crud'));
		});

		it('create returns doc with id', async () => {
			const col = m.collection('vehicle');
			const doc = await col.create({
				license_plate: 'XX-999-YY',
				model: 'TestCar',
				brand: 'TestBrand',
				status: 'available',
			});
			expect(doc.id).toBeDefined();
			expect(doc.license_plate).toBe('XX-999-YY');
		});

		it('where filters correctly', async () => {
			const col = m.collection('vehicle');
			await col.create({ license_plate: 'AA-001-BB', model: 'Available1', brand: 'A', status: 'available' });
			await col.create({ license_plate: 'BB-002-CC', model: 'Rented1', brand: 'B', status: 'rented' });
			await col.create({ license_plate: 'CC-003-DD', model: 'Available2', brand: 'C', status: 'available' });

			const available = await col.where({ status: 'available' });
			expect(available).toHaveLength(2);
			expect(available.every((v: any) => v.status === 'available')).toBe(true);
		});

		it('update modifies vehicle', async () => {
			const col = m.collection('vehicle');
			const created = await col.create({
				license_plate: 'UP-001-DD',
				model: 'ToUpdate',
				brand: 'Brand',
				status: 'available',
			});
			const updated = await col.update(created.id, { status: 'rented', mileage: 5000 });
			expect(updated.status).toBe('rented');
			expect(updated.mileage).toBe(5000);
		});

		it('delete removes vehicle', async () => {
			const col = m.collection('vehicle');
			const created = await col.create({
				license_plate: 'DL-001-EE',
				model: 'ToDelete',
				brand: 'Brand',
				status: 'available',
			});
			await col.delete(created.id);
			const all = await col.getAll();
			expect(all.find((v: any) => v.id === created.id)).toBeUndefined();
		});

		it('count returns correct number', async () => {
			const col = m.collection('vehicle');
			await col.create({ license_plate: 'C1-001-FF', model: 'M1', brand: 'B', status: 'available' });
			await col.create({ license_plate: 'C2-002-GG', model: 'M2', brand: 'B', status: 'rented' });
			expect(await col.count()).toBe(2);
		});
	});

	describe('customer collection — CRUD', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-customer-crud'));
		});

		it('full CRUD cycle', async () => {
			const col = m.collection('customer');
			const created = await col.create({
				first_name: 'John',
				last_name: 'Doe',
				email: 'john@example.com',
			});
			expect(created.id).toBeDefined();

			const all = await col.getAll();
			expect(all.some((c: any) => c.id === created.id)).toBe(true);

			const updated = await col.update(created.id, { phone: '+33600000000' });
			expect(updated.phone).toBe('+33600000000');

			await col.delete(created.id);
			expect(await col.count()).toBe(0);
		});
	});

	describe('rental collection — CRUD with FK references', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-rental-crud'));
		});

		it('create rental with FK ids', async () => {
			const col = m.collection('rental');
			const doc = await col.create({
				vehicleId: 1,
				customerId: 1,
				start_date: new Date('2026-06-01'),
				price_per_day: 50,
				status: 'booked',
			});
			expect(doc.id).toBeDefined();
			expect(doc.vehicleId).toBe(1);
			expect(doc.customerId).toBe(1);
		});

		it('where filters by status', async () => {
			const col = m.collection('rental');
			await col.create({ vehicleId: 1, customerId: 1, start_date: new Date('2026-06-01'), price_per_day: 50, status: 'active' });
			await col.create({ vehicleId: 2, customerId: 2, start_date: new Date('2026-06-05'), price_per_day: 60, status: 'booked' });

			const active = await col.where({ status: 'active' });
			expect(active).toHaveLength(1);
			expect(active[0].status).toBe('active');
		});

		it('update and delete', async () => {
			const col = m.collection('rental');
			const created = await col.create({
				vehicleId: 1, customerId: 1, start_date: new Date('2026-06-01'), price_per_day: 50, status: 'booked',
			});
			const updated = await col.update(created.id, { status: 'active', total_price: 200 });
			expect(updated.status).toBe('active');
			expect(updated.total_price).toBe(200);

			await col.delete(created.id);
			expect(await col.count()).toBe(0);
		});
	});

	describe('location_office collection — CRUD', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-location-office-crud'));
		});

		it('full CRUD cycle', async () => {
			const col = m.collection('location_office');
			const created = await col.create({
				code: 'TEST-01',
				address: '1 Test Street',
				city: 'Testville',
				country: 'Testland',
			});
			expect(created.id).toBeDefined();
			expect(created.code).toBe('TEST-01');

			const all = await col.getAll();
			expect(all.some((o: any) => o.id === created.id)).toBe(true);

			const updated = await col.update(created.id, { phone: '+33100000000' });
			expect(updated.phone).toBe('+33100000000');

			await col.delete(created.id);
			expect(await col.count()).toBe(0);
		});
	});

	describe('maintenance collection — CRUD with FK reference', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-maintenance-crud'));
		});

		it('full CRUD cycle', async () => {
			const col = m.collection('maintenance');
			const created = await col.create({
				vehicleId: 1,
				date: new Date('2026-05-01'),
				type: 'tire rotation',
				cost: 80,
				notes: 'Routine maintenance',
			});
			expect(created.id).toBeDefined();
			expect(created.vehicleId).toBe(1);

			const all = await col.getAll();
			expect(all.some((m: any) => m.id === created.id)).toBe(true);

			const updated = await col.update(created.id, { cost: 95, notes: 'Updated notes' });
			expect(updated.cost).toBe(95);

			await col.delete(created.id);
			expect(await col.count()).toBe(0);
		});
	});

	describe('all 6 collections — data survives full cycle', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-all-collections-cycle'));
		});

		it('create + getAll on every collection', async () => {
			const ops = [
				{ name: 'vehicle',     data: { license_plate: 'CY-001-AA', model: 'CycleCar', brand: 'CB', status: 'available' } },
				{ name: 'category',    data: { code: 'cyc', name: 'CycleCat' } },
				{ name: 'customer',    data: { first_name: 'Cycle', last_name: 'User', email: 'cycle@test.com' } },
				{ name: 'rental',      data: { vehicleId: 1, customerId: 1, start_date: new Date('2026-07-01'), price_per_day: 40, status: 'booked' } },
				{ name: 'location_office', data: { code: 'CYC-01', city: 'CycleCity', country: 'CycleLand' } },
				{ name: 'maintenance', data: { vehicleId: 1, date: new Date('2026-07-15'), type: 'inspection' } },
			];

			const createdIds: Record<string, any> = {};
			for (const { name, data } of ops) {
				const col = m.collection(name);
				const doc = await col.create(data);
				expect(doc.id).toBeDefined();
				createdIds[name] = doc.id;
			}

			for (const { name } of ops) {
				const col = m.collection(name);
				const all = await col.getAll();
				expect(all.some((d: any) => d.id === createdIds[name])).toBe(true);
			}
		});
	});

	describe('edge cases', () => {
		let m: Machine;

		beforeEach(async () => {
			m = await createStartedMachine(uniqueDbName('s11-edge-cases'));
		});

		it('count with query filter', async () => {
			const col = m.collection('vehicle');
			await col.create({ license_plate: 'EQ-001-AA', model: 'M1', brand: 'B', status: 'available' });
			await col.create({ license_plate: 'EQ-002-BB', model: 'M2', brand: 'B', status: 'rented' });
			await col.create({ license_plate: 'EQ-003-CC', model: 'M3', brand: 'B', status: 'available' });

			const availableCount = await col.count({ status: 'available' });
			expect(availableCount).toBe(2);
		});

		it('delete non-existent id returns true (IndexedDB idempotent)', async () => {
			const col = m.collection('category');
			const result = await col.delete(99999);
			expect(result).toBe(true);
		});

		it('update non-existent id upserts', async () => {
			const col = m.collection('category');
			const result = await col.update(99999, { code: 'ghost', name: 'Ghost' });
			expect(result.id).toBe(99999);
			expect(result.name).toBe('Ghost');
		});
	});
});
