/**
 * machineSeed.test.ts
 * Unit tests for seed() and seedIfEmpty() (backward-compat shim).
 * The machine.collection() is mocked so no real IndexedDB is needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build a minimal mock collection store
function makeMockStore() {
	const docs: unknown[] = [];
	return {
		docs,
		create: vi.fn(async (row: unknown) => { docs.push(row); }),
		getAll: vi.fn(async () => [...docs]),
	};
}

// Mock machine singleton — seed() imports { machine } from machine.js
vi.mock('$lib/main/machine.js', () => {
	const stores: Record<string, ReturnType<typeof makeMockStore>> = {};
	const machineInstance = {
		collection: vi.fn((name: string) => {
			if (!stores[name]) stores[name] = makeMockStore();
			return stores[name];
		}),
		_stores: stores,
	};
	return { machine: machineInstance };
});

import { machine } from '$lib/main/machine.js';
import { seed, seedIfEmpty } from '$lib/main/machineSeed.js';

function getStore(name: string) {
	return (machine as unknown as { collection(n: string): ReturnType<typeof makeMockStore> }).collection(name);
}

beforeEach(() => {
	vi.clearAllMocks();
	// Reset stores by clearing the mock implementation
	(machine.collection as ReturnType<typeof vi.fn>).mockImplementation((name: string) => {
		const store = makeMockStore();
		return store;
	});
});

describe('seed() — always insert', () => {
	it('inserts all rows into the collection', async () => {
		const inserted: unknown[] = [];
		const mockStore = {
			create: vi.fn(async (row: unknown) => { inserted.push(row); }),
			getAll: vi.fn(async () => []),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seed({ vehicle: [{ brand: 'Renault' }, { brand: 'Peugeot' }] });

		expect(machine.collection).toHaveBeenCalledWith('vehicle');
		expect(mockStore.create).toHaveBeenCalledTimes(2);
		expect(inserted).toHaveLength(2);
	});

	it('handles multiple collections in one call', async () => {
		const vehicleStore = { create: vi.fn(), getAll: vi.fn(async () => []) };
		const categoryStore = { create: vi.fn(), getAll: vi.fn(async () => []) };

		(machine.collection as ReturnType<typeof vi.fn>)
			.mockImplementation((name: string) => name === 'vehicle' ? vehicleStore : categoryStore);

		await seed({
			vehicle: [{ brand: 'Renault' }],
			category: [{ name: 'SUV' }, { name: 'Sedan' }],
		});

		expect(vehicleStore.create).toHaveBeenCalledTimes(1);
		expect(categoryStore.create).toHaveBeenCalledTimes(2);
	});

	it('inserts even if collection already has data (no onlyIfEmpty)', async () => {
		const mockStore = {
			create: vi.fn(),
			getAll: vi.fn(async () => [{ brand: 'Existing' }]),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seed({ vehicle: [{ brand: 'New' }] });

		expect(mockStore.create).toHaveBeenCalledTimes(1);
		expect(mockStore.getAll).not.toHaveBeenCalled();
	});
});

describe('seed() — onlyIfEmpty option', () => {
	it('skips insert when collection already has data', async () => {
		const mockStore = {
			create: vi.fn(),
			getAll: vi.fn(async () => [{ brand: 'Existing' }]),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seed({ vehicle: [{ brand: 'New' }] }, { onlyIfEmpty: true });

		expect(mockStore.getAll).toHaveBeenCalledOnce();
		expect(mockStore.create).not.toHaveBeenCalled();
	});

	it('inserts when collection is empty', async () => {
		const mockStore = {
			create: vi.fn(),
			getAll: vi.fn(async () => []),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seed({ vehicle: [{ brand: 'Renault' }] }, { onlyIfEmpty: true });

		expect(mockStore.getAll).toHaveBeenCalledOnce();
		expect(mockStore.create).toHaveBeenCalledOnce();
	});

	it('checks each collection independently', async () => {
		const vehicleStore = { create: vi.fn(), getAll: vi.fn(async () => [{ brand: 'Existing' }]) };
		const categoryStore = { create: vi.fn(), getAll: vi.fn(async () => []) };

		(machine.collection as ReturnType<typeof vi.fn>)
			.mockImplementation((name: string) => name === 'vehicle' ? vehicleStore : categoryStore);

		await seed({ vehicle: [{ brand: 'New' }], category: [{ name: 'SUV' }] }, { onlyIfEmpty: true });

		expect(vehicleStore.create).not.toHaveBeenCalled();  // already had data
		expect(categoryStore.create).toHaveBeenCalledOnce(); // was empty
	});
});

describe('seedIfEmpty() — @deprecated shim', () => {
	it('delegates to seed() with onlyIfEmpty:true', async () => {
		const mockStore = {
			create: vi.fn(),
			getAll: vi.fn(async () => []),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seedIfEmpty({ vehicle: [{ brand: 'Renault' }] });

		expect(mockStore.getAll).toHaveBeenCalledOnce();
		expect(mockStore.create).toHaveBeenCalledOnce();
	});

	it('skips if data exists (same as seed with onlyIfEmpty)', async () => {
		const mockStore = {
			create: vi.fn(),
			getAll: vi.fn(async () => [{ brand: 'Existing' }]),
		};
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

		await seedIfEmpty({ vehicle: [{ brand: 'New' }] });

		expect(mockStore.create).not.toHaveBeenCalled();
	});
});

describe('seed() — edge cases', () => {
	it('handles empty data object without errors', async () => {
		await expect(seed({})).resolves.toBeUndefined();
		expect(machine.collection).not.toHaveBeenCalled();
	});

	it('handles collection with zero rows', async () => {
		const mockStore = { create: vi.fn(), getAll: vi.fn(async () => []) };
		(machine.collection as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);
		await seed({ vehicle: [] });
		expect(mockStore.create).not.toHaveBeenCalled();
	});
});
