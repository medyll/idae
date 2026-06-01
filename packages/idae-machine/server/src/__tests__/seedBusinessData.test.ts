/**
 * S31-04 — seedBusinessData unit/integration test.
 *
 * Verifies:
 *   - inserts when collection is empty
 *   - skips when collection already has docs (idempotent)
 *   - skips when input rows are empty/undefined
 *
 * Run: pnpm vitest run server/src/__tests__/seedBusinessData.test.ts
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';
import { seedBusinessData } from '../bootstrap/seedBusinessData.js';

const TEST_DB = 'vitest_seed_business_user';

describe('seedBusinessData', () => {
	let conn: mongoose.Connection;

	beforeAll(async () => {
		conn = mongoose.createConnection(config.mongodbUri, { dbName: TEST_DB });
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
		await seedBusinessData(
			{ vehicle: [{ id: 1, brand: 'Toyota' }, { id: 2, brand: 'Honda' }] },
			conn,
		);
		const count = await conn.collection('vehicle').countDocuments();
		expect(count).toBe(2);
	});

	it('skips collection that already has documents (idempotent)', async () => {
		await conn.collection('vehicle').insertOne({ id: 99, brand: 'Existing' });
		await seedBusinessData(
			{ vehicle: [{ id: 1, brand: 'Toyota' }, { id: 2, brand: 'Honda' }] },
			conn,
		);
		const count = await conn.collection('vehicle').countDocuments();
		expect(count).toBe(1);
	});

	it('skips empty input rows', async () => {
		await seedBusinessData({ vehicle: [] }, conn);
		const count = await conn.collection('vehicle').countDocuments();
		expect(count).toBe(0);
	});

	it('handles multi-collection input', async () => {
		await seedBusinessData(
			{
				vehicle:  [{ id: 1, brand: 'A' }],
				category: [{ id: 1, name: 'sedan' }, { id: 2, name: 'suv' }],
			},
			conn,
		);
		expect(await conn.collection('vehicle').countDocuments()).toBe(1);
		expect(await conn.collection('category').countDocuments()).toBe(2);
	});

	it('partial idempotence — one collection seeded, other empty', async () => {
		await conn.collection('vehicle').insertOne({ id: 99, brand: 'X' });

		await seedBusinessData(
			{
				vehicle:  [{ id: 1, brand: 'A' }, { id: 2, brand: 'B' }],
				category: [{ id: 1, name: 'sedan' }],
			},
			conn,
		);
		expect(await conn.collection('vehicle').countDocuments()).toBe(1);
		expect(await conn.collection('category').countDocuments()).toBe(1);
	});
});
