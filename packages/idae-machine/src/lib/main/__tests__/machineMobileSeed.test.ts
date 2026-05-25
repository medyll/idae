/**
 * S36-05 / BL-01 — mobile-first auto-seed
 * Verifies that boot() calls seedIfEmpty(seed) iff mode='mobile-first' and seed is provided.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@medyll/qoolie/svelte', () => ({
	useQoolieCollection: vi.fn(() => ({ items: [] })),
	useQoolieQuery:      vi.fn(() => ({ items: [] })),
}));

const seedIfEmptyMock = vi.fn().mockResolvedValue(undefined);
vi.mock('$lib/main/machineSeed.js', () => ({
	seedIfEmpty: seedIfEmptyMock,
	seed:        vi.fn().mockResolvedValue(undefined),
}));

import { Machine } from '../machine.js';
import { demoScheme } from '../../demo/demoScheme.js';

const testSeed = {
	vehicle: [{ id: 1, brand: 'Renault', model: 'Clio' }],
};

describe('S36-05: BL-01 mobile-first auto-seed', () => {
	beforeEach(() => {
		seedIfEmptyMock.mockClear();
	});

	it('stores seed in _seed via init()', () => {
		const m = new Machine();
		m.init({ dbName: 'test-seed', version: 1, model: demoScheme, sync: { mode: 'mobile-first' }, seed: testSeed });
		expect(m._seed).toBe(testSeed);
	});

	it('calls seedIfEmpty on boot when mode=mobile-first and seed provided', async () => {
		const m = new Machine();
		m.init({ dbName: 'mobile-seed-test', version: 1, model: demoScheme, sync: { mode: 'mobile-first' }, seed: testSeed });
		await m.boot();
		expect(seedIfEmptyMock).toHaveBeenCalledOnce();
		expect(seedIfEmptyMock).toHaveBeenCalledWith(testSeed);
	});

	it('does NOT call seedIfEmpty when mode=server-first', async () => {
		const m = new Machine();
		m.init({ dbName: 'server-seed-test', version: 1, model: demoScheme, sync: { mode: 'server-first' }, seed: testSeed });
		await m.boot();
		expect(seedIfEmptyMock).not.toHaveBeenCalled();
	});

	it('does NOT call seedIfEmpty when mode=mobile-first but no seed provided', async () => {
		const m = new Machine();
		m.init({ dbName: 'mobile-no-seed', version: 1, model: demoScheme, sync: { mode: 'mobile-first' } });
		await m.boot();
		expect(seedIfEmptyMock).not.toHaveBeenCalled();
	});

	it('does NOT call seedIfEmpty when sync is false', async () => {
		const m = new Machine();
		m.init({ dbName: 'sync-false-seed', version: 1, model: demoScheme, sync: false, seed: testSeed });
		await m.boot();
		expect(seedIfEmptyMock).not.toHaveBeenCalled();
	});
});
