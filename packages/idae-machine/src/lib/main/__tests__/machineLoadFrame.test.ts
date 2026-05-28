import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

let mockPush = vi.fn();

vi.mock('@medyll/idae-router', () => ({
	createRouter: vi.fn(() => ({
		before: () => {},
		push:   vi.fn(),
	}))
}));

vi.mock('$lib/utils/logger.js', () => ({
	logger: { info: vi.fn(), warn: vi.fn() }
}));

describe('machine.framer.loadFrame — URL-driven', () => {
	let machine: Machine;

	beforeEach(() => {
		machine = new Machine();
		machineFrameManager.clear();
		mockPush = vi.fn();
		machineFrameManager.setRouter(mockPush);
	});

	it('pushes hash URL with /+zone/modulePath/collection', () => {
		machine.framer.loadFrame('explorer', 'vehicle');

		expect(mockPush).toHaveBeenCalledTimes(1);
		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle');
	});

	it('includes collectionId in URL', () => {
		machine.framer.loadFrame('explorer', 'vehicle', '42');

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42');
	});

	it('serializes vars as query string', () => {
		machine.framer.loadFrame('explorer', 'vehicle', '42', { mode: 'card' });

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42?mode=card');
	});

	it('uses explicit zone when provided', () => {
		machine.framer.loadFrame('explorer', 'vehicle', undefined, undefined, 'main.modal');

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main.modal/explorer/vehicle');
	});

	it('omits vars query when empty', () => {
		machine.framer.loadFrame('explorer', 'vehicle', '42', {});

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42');
	});

	it('exposes machineFrameManager via framer getter', () => {
		expect(machine.framer).toBe(machineFrameManager);
	});
});
