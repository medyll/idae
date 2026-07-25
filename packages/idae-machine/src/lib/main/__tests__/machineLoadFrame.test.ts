import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

let mockPush = vi.fn();

vi.mock('@medyll/idae-router', () => ({
	createRouter: vi.fn(() => ({
		before: () => {},
		push: vi.fn()
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
		machineFrameManager.setRouter({
			push: mockPush,
			openFrame: vi.fn(),
			openDialog: vi.fn(),
			closeFrame: vi.fn()
		});
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
		machine.framer.loadFrame('explorer', 'vehicle', '42', { vars: { mode: 'card' } });

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42?mode=card');
	});

	it('uses explicit zone when provided', () => {
		machine.framer.loadFrame('explorer', 'vehicle', undefined, { zone: 'main' });

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle');
	});

	it('omits vars query when empty', () => {
		machine.framer.loadFrame('explorer', 'vehicle', '42', {});

		const url = mockPush.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42');
	});

	it('loads directly without changing the URL when history is false', () => {
		const openFrame = vi.fn();
		machineFrameManager.setRouter({
			push: mockPush,
			openFrame,
			openDialog: vi.fn(),
			closeFrame: vi.fn()
		});

		machine.framer.loadFrame('explorer', 'vehicle', '42', {
			zone: 'panel',
			vars: { mode: 'card' },
			history: false
		});

		expect(mockPush).not.toHaveBeenCalled();
		expect(openFrame).toHaveBeenCalledWith({
			modulePath: 'explorer',
			collection: 'vehicle',
			collectionId: '42',
			vars: { mode: 'card' },
			zone: 'panel'
		});
	});

	it('loadIn takes its optional zone from options', () => {
		machine.framer.loadIn('explorer', 'vehicle', '42', { zone: 'panel' });

		expect(mockPush).toHaveBeenCalledWith('/+panel/explorer/vehicle/42');
	});

	it('exposes machineFrameManager via framer getter', () => {
		expect(machine.framer).toBe(machineFrameManager);
	});
});
