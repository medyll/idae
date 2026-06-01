/**
 * seedBusinessData unit/integration test.
 *
 * Verifies the current opts-based signature:
 *   seedBusinessData({ org, mongoUri, model, data, clearFirst? })
 * Collections route to `${org}_${base}` (base from model, else 'machine_user').
 *
 * Verifies:
 *   - inserts when collection is empty
 *   - skips when collection already has docs (idempotent, clearFirst=false)
 *   - skips empty/undefined rows
 *   - multi-collection insert
 *   - clearFirst wipes stale docs then re-inserts
 *
 * Run: pnpm vitest run src/__tests__/seedBusinessData.test.ts
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { seedBusinessData } from '../bootstrap/seedBusinessData.js';

const ORG  = 'vitest_seed';
const BASE = 'machine_user';            // DEFAULT_BASE — model entries omitted → routes here
const DB   = `${ORG}_${BASE}`;

// Empty model → every collection falls back to DEFAULT_BASE ('machine_user').
const seed = (data: Record<string, unknown[]>, clearFirst = false) =>
	seedBusinessData({ org: ORG, mongoUri: config.mongodbUri, model: {}, data, clearFirst });

describe('seedBusinessData', () => {
	let conn: mongoose.Connection;

	beforeAll(async () => {
		conn = mongoose.createConnection(config.mongodbUri, { dbName: DB });
		await conn.asPromise();
	});

	afterAll(async () => {
		await conn.dropDatabase().catch(() => {});
		await conn.close();
	});

	beforeEach(async () => {
		await conn.collection('vehicle').deleteMany({}).catch(() => {});
		await conn.collection('category').deleteMany({}).catch(() => {});
	});

	it('inserts rows when collection empty', async () => {
		await seed({ vehicle: [{ id: 1, brand: 'Toyota' }, { id: 2, brand: 'Honda' }] });
		expect(await conn.collection('vehicle').countDocuments()).toBe(2);
	});

	it('skips collection that already has documents (idempotent)', async () => {
		await conn.collection('vehicle').insertOne({ id: 99, brand: 'Existing' });
		await seed({ vehicle: [{ id: 1, brand: 'Toyota' }, { id: 2, brand: 'Honda' }] });
		expect(await conn.collection('vehicle').countDocuments()).toBe(1);
	});

	it('skips empty input rows', async () => {
		await seed({ vehicle: [] });
		expect(await conn.collection('vehicle').countDocuments()).toBe(0);
	});

	it('handles multi-collection input', async () => {
		await seed({
			vehicle:  [{ id: 1, brand: 'A' }],
			category: [{ id: 1, name: 'sedan' }, { id: 2, name: 'suv' }],
		});
		expect(await conn.collection('vehicle').countDocuments()).toBe(1);
		expect(await conn.collection('category').countDocuments()).toBe(2);
	});

	it('partial idempotence — one collection seeded, other empty', async () => {
		await conn.collection('vehicle').insertOne({ id: 99, brand: 'X' });
		await seed({
			vehicle:  [{ id: 1, brand: 'A' }, { id: 2, brand: 'B' }],
			category: [{ id: 1, name: 'sedan' }],
		});
		expect(await conn.collection('vehicle').countDocuments()).toBe(1);
		expect(await conn.collection('category').countDocuments()).toBe(1);
	});

	it('clearFirst wipes stale docs then re-inserts', async () => {
		await conn.collection('vehicle').insertMany([{ id: 90, brand: 'Old1' }, { id: 91, brand: 'Old2' }]);
		await seed({ vehicle: [{ id: 1, brand: 'Fresh' }] }, true);
		const docs = await conn.collection('vehicle').find({}).toArray();
		expect(docs).toHaveLength(1);
		expect(docs[0].brand).toBe('Fresh');
	});
});
