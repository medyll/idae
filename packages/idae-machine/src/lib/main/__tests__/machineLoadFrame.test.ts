import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Machine } from '../machine.js';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

let mockRouterInstance: { push: ReturnType<typeof vi.fn>; before: (fn: unknown) => void } | null = null;

vi.mock('@medyll/idae-router', () => ({
	createRouter: vi.fn(() => {
		mockRouterInstance = {
			before: () => {},
			push:   vi.fn(),
		};
		return mockRouterInstance;
	})
}));

vi.mock('$lib/utils/logger.js', () => ({
	logger: { info: vi.fn(), warn: vi.fn() }
}));

describe('Machine.loadFrame — URL-driven', () => {
	let machine: Machine;

	beforeEach(() => {
		machine = new Machine();
		machineFrameManager.clear();
		mockRouterInstance = null;
	});

	it('pushes hash URL with /+zone/modulePath/collection', () => {
		machine.loadFrame('explorer', 'vehicle');

		expect(mockRouterInstance?.push).toHaveBeenCalledTimes(1);
		const url = mockRouterInstance!.push.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle');
	});

	it('includes collectionId in URL', () => {
		machine.loadFrame('explorer', 'vehicle', '42');

		const url = mockRouterInstance!.push.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42');
	});

	it('serializes vars as query string', () => {
		machine.loadFrame('explorer', 'vehicle', '42', { mode: 'card' });

		const url = mockRouterInstance!.push.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42?mode=card');
	});

	it('uses explicit zone when provided', () => {
		machine.loadFrame('explorer', 'vehicle', undefined, undefined, 'main.modal');

		const url = mockRouterInstance!.push.mock.calls[0][0] as string;
		expect(url).toBe('/+main.modal/explorer/vehicle');
	});

	it('omits vars query when empty', () => {
		machine.loadFrame('explorer', 'vehicle', '42', {});

		const url = mockRouterInstance!.push.mock.calls[0][0] as string;
		expect(url).toBe('/+main/explorer/vehicle/42');
	});

	it('exposes frameManager via framer getter', () => {
		expect(machine.framer).toBe(machineFrameManager);
	});

	it('exposes frameManager via deprecated frameManager getter', () => {
		expect(machine.frameManager).toBe(machineFrameManager);
	});
});
