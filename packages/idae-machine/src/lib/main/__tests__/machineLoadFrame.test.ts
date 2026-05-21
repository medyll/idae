import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

const mockControls = () => ({
	load: vi.fn(),
	show: vi.fn(),
	hide: vi.fn(),
	toggle: vi.fn(),
	close: vi.fn(),
});

describe('Machine.loadFrame', () => {
	let machine: Machine;

	beforeEach(() => {
		machine = new Machine();
		machineFrameManager.clear();
	});

	it('loads into main zone by default', async () => {
		const controls = mockControls();
		machineFrameManager.register('main', controls);

		await machine.loadFrame('explorer', 'vehicle');

		expect(controls.load).toHaveBeenCalledWith('explorer', 'vehicle', undefined, undefined);
	});

	it('passes collectionId to main zone', async () => {
		const controls = mockControls();
		machineFrameManager.register('main', controls);

		await machine.loadFrame('explorer', 'vehicle', '42', { mode: 'card' });

		expect(controls.load).toHaveBeenCalledWith('explorer', 'vehicle', '42', { mode: 'card' });
	});

	it('loads into explicit zone when provided', async () => {
		const controls = mockControls();
		machineFrameManager.register('main.modal', controls);

		await machine.loadFrame('explorer', 'vehicle', undefined, undefined, 'main.modal');

		expect(controls.load).toHaveBeenCalledWith('explorer', 'vehicle', undefined, undefined);
	});

	it('exposes frameManager via framer getter', () => {
		expect(machine.framer).toBe(machineFrameManager);
	});

	it('exposes frameManager via deprecated frameManager getter', () => {
		expect(machine.frameManager).toBe(machineFrameManager);
	});
});
