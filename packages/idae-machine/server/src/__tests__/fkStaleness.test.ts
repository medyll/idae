import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import mongoose from 'mongoose';
import { config } from '../config.js';

const getAllRelations = vi.fn();
vi.mock('../MachineServer.js', () => ({
	machineServer: {
		getAllRelations: (...args: unknown[]) => getAllRelations(...args),
	},
}));

const getDbForCollection = vi.fn();
vi.mock('../middleware/dbRouter.js', () => ({
	getDbForCollection: (...args: unknown[]) => getDbForCollection(...args),
}));

import { refoldReverseFkSnapshots, nullifyReverseFkSnapshots } from '../validation/FkStaleness.js';
import { invalidateFkDefsCache } from '../validation/FkValidator.js';

const TEST_DB = 'vitest_fkstaleness';

describe('FK staleness cascade (UNMULTIPLE.md Phase 5)', () => {
	beforeAll(async () => {
		if (mongoose.connection.readyState === 0) {
			await mongoose.connect(config.mongodbUri);
		}
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		getDbForCollection.mockResolvedValue(conn);
	});

	afterEach(async () => {
		invalidateFkDefsCache();
		getAllRelations.mockReset();
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').deleteMany({});
	});

	afterAll(async () => {
		await mongoose.connection.useDb(TEST_DB, { useCache: true }).dropDatabase();
		await mongoose.disconnect();
	});

	it('refolds every holder snapshot when the target record updates', async () => {
		getAllRelations.mockResolvedValue({
			vehicle: { category: { code: 'category', required: false } },
		});
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').insertOne({
			id: 1, code: '1',
			fks: { category: { id: 7, code: 'compact', name: 'Compact' } },
		});

		await refoldReverseFkSnapshots('category', { id: 7, code: 'compact', name: 'Compact SUV' });

		const updated = await conn.collection('vehicle').findOne({ id: 1 });
		expect(updated?.fks?.category).toMatchObject({ id: 7, code: 'compact', name: 'Compact SUV' });
	});

	it('only refolds holders whose snapshot id matches the updated target', async () => {
		getAllRelations.mockResolvedValue({
			vehicle: { category: { code: 'category', required: false } },
		});
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').insertMany([
			{ id: 1, code: '1', fks: { category: { id: 7, code: 'compact', name: 'Compact' } } },
			{ id: 2, code: '2', fks: { category: { id: 9, code: 'suv', name: 'SUV' } } },
		]);

		await refoldReverseFkSnapshots('category', { id: 7, code: 'compact', name: 'Compact SUV' });

		const untouched = await conn.collection('vehicle').findOne({ id: 2 });
		expect(untouched?.fks?.category).toMatchObject({ id: 9, code: 'suv', name: 'SUV' });
	});

	it('strips _id and nested fks from the refolded snapshot', async () => {
		getAllRelations.mockResolvedValue({
			vehicle: { category: { code: 'category', required: false } },
		});
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').insertOne({
			id: 1, code: '1',
			fks: { category: { id: 7, code: 'compact', name: 'Compact' } },
		});

		await refoldReverseFkSnapshots('category', {
			_id: 'mongo_oid', id: 7, code: 'compact', name: 'Compact SUV', fks: { sub: { id: 1 } },
		} as any);

		const updated = await conn.collection('vehicle').findOne({ id: 1 });
		expect(updated?.fks?.category._id).toBeUndefined();
		expect(updated?.fks?.category.fks).toBeUndefined();
	});

	it('does nothing when no collection holds a FK to the target', async () => {
		getAllRelations.mockResolvedValue({ vehicle: {} });
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').insertOne({
			id: 1, code: '1',
			fks: { category: { id: 7, code: 'compact', name: 'Compact' } },
		});

		await refoldReverseFkSnapshots('category', { id: 7, code: 'compact', name: 'Renamed' });

		const untouched = await conn.collection('vehicle').findOne({ id: 1 });
		expect(untouched?.fks?.category?.name).toBe('Compact');
	});

	it('unsets the holder snapshot when the target record is deleted', async () => {
		getAllRelations.mockResolvedValue({
			vehicle: { category: { code: 'category', required: false } },
		});
		const conn = mongoose.connection.useDb(TEST_DB, { useCache: true });
		await conn.collection('vehicle').insertOne({
			id: 1, code: '1',
			fks: { category: { id: 7, code: 'compact', name: 'Compact' } },
		});

		await nullifyReverseFkSnapshots('category', 7);

		const updated = await conn.collection('vehicle').findOne({ id: 1 });
		expect(updated?.fks?.category).toBeUndefined();
	});
});
