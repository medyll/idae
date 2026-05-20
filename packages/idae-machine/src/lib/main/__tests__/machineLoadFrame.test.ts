import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

describe('Machine.loadFrame', () => {
	let machine: Machine;

	beforeEach(() => {
		machine = new Machine();
		// Clear any leftover frames from previous tests
		machineFrameManager.clear();
	});

	it('computes correct frameId and delegates to frameManager.load', async () => {
		const loadSpy = vi.spyOn(machineFrameManager, 'load');

		// Register a mock frame so load doesn't throw
		const controls = {
			load: vi.fn(),
			show: vi.fn(),
			hide: vi.fn(),
			toggle: vi.fn(),
			close: vi.fn(),
		};
		machineFrameManager.register('vehicle:42', controls);

		await machine.loadFrame('card.form', 'vehicle', '42');

		expect(loadSpy).toHaveBeenCalledWith('vehicle:42', 'card.form', 'vehicle', '42', undefined);
		expect(controls.load).toHaveBeenCalledWith('card.form', 'vehicle', '42', undefined);
	});

	it('computes frameId without collectionId', async () => {
		const loadSpy = vi.spyOn(machineFrameManager, 'load');

		const controls = {
			load: vi.fn(),
			show: vi.fn(),
			hide: vi.fn(),
			toggle: vi.fn(),
			close: vi.fn(),
		};
		machineFrameManager.register('vehicle', controls);

		await machine.loadFrame('explorer.list', 'vehicle');

		expect(loadSpy).toHaveBeenCalledWith('vehicle', 'explorer.list', 'vehicle', undefined, undefined);
	});

	it('computes frameId with vars', async () => {
		const controls = {
			load: vi.fn(),
			show: vi.fn(),
			hide: vi.fn(),
			toggle: vi.fn(),
			close: vi.fn(),
		};
		machineFrameManager.register('vehicle:42:tab=info', controls);

		await machine.loadFrame('card.form', 'vehicle', '42', { tab: 'info' });

		expect(controls.load).toHaveBeenCalledWith('card.form', 'vehicle', '42', { tab: 'info' });
	});

	it('exposes frameManager via getter', () => {
		expect(machine.frameManager).toBe(machineFrameManager);
	});
});
