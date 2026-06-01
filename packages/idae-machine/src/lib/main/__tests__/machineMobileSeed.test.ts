/**
 * S36-05 / BL-01 — mobile-first auto-seed
 * Verifies that boot() calls seed(seed, { onlyIfEmpty: true }) iff mode='mobile-first' and seed is provided.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@medyll/qoolie/svelte', () => ({
	useQoolieCollection: vi.fn(() => ({ items: [] })),
	useQoolieQuery:      vi.fn(() => ({ items: [] })),
}));

const seedMock = vi.fn().mockResolvedValue(undefined);
vi.mock('$lib/main/machineSeed.js', () => ({
	seed: seedMock,
}));

import { Machine } from '../machine.js';
import { demoScheme } from '../../demo/demoScheme.js';

const testSeed = {
	vehicle: [{ id: 1, brand: 'Renault', model: 'Clio' }],
};

describe('S36-05: BL-01 mobile-first auto-seed', () => {
	beforeEach(() => {
		seedMock.mockClear();
	});

	it('stores seed in _seed via init()', () => {
		const m = new Machine();
		m.init({ dbName: 'test-seed', version: 1, business: demoScheme, sync: { mode: 'mobile-first' }, seed: testSeed });
		expect(m._seed).toBe(testSeed);
	});

	it('calls seed with onlyIfEmpty on boot when mode=mobile-first and seed provided', async () => {
		const m = new Machine();
		m.init({ dbName: 'mobile-seed-test', version: 1, business: demoScheme, sync: { mode: 'mobile-first' }, seed: testSeed });
		await m.boot();
		expect(seedMock).toHaveBeenCalledOnce();
		expect(seedMock).toHaveBeenCalledWith(testSeed, { onlyIfEmpty: true });
	});

	it('does NOT call seed when mode=server-first', async () => {
		const m = new Machine();
		m.init({ dbName: 'server-seed-test', version: 1, business: demoScheme, sync: { mode: 'server-first' }, seed: testSeed });
		await m.boot();
		expect(seedMock).not.toHaveBeenCalled();
	});

	it('does NOT call seed when mode=mobile-first but no seed provided', async () => {
		const m = new Machine();
		m.init({ dbName: 'mobile-no-seed', version: 1, business: demoScheme, sync: { mode: 'mobile-first' } });
		await m.boot();
		expect(seedMock).not.toHaveBeenCalled();
	});

	it('does NOT call seed when sync is false', async () => {
		const m = new Machine();
		m.init({ dbName: 'sync-false-seed', version: 1, business: demoScheme, sync: false, seed: testSeed });
		await m.boot();
		expect(seedMock).not.toHaveBeenCalled();
	});
});
