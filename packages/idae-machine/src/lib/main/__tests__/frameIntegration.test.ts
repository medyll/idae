import { describe, it, expect, beforeEach, vi } from 'vitest';
import { machineFrameManager, type FrameControls } from '../frame/MachineFrameManager.js';
import { computeFrameId } from '../frame/frameUtils.js';
import { Machine } from '../machine.js';

describe('Sprint 24 — Frame Manager Integration', () => {
	beforeEach(() => {
		machineFrameManager.clear();
	});

	describe('loadIn → frameManager → Frame flow', () => {
		it('loadIn delegates to frameManager.load with correct frameId', async () => {
			const machine = new Machine();
			const loadSpy = vi.spyOn(machineFrameManager, 'load');

			// Register a mock frame
			const controls: FrameControls = {
				load: vi.fn(),
				show: vi.fn(),
				hide: vi.fn(),
				toggle: vi.fn(),
				close: vi.fn(),
			};
			machineFrameManager.register('main', controls);

			await machine.loadIn('explorer.list', 'main', 'vehicle');

			expect(loadSpy).toHaveBeenCalledWith('main', 'explorer.list', 'vehicle', undefined, undefined);
			expect(controls.load).toHaveBeenCalledWith('explorer.list', 'vehicle', undefined, undefined);
		});

		it('loadFrame computes frameId and delegates correctly', async () => {
			const machine = new Machine();

			const controls: FrameControls = {
				load: vi.fn(),
				show: vi.fn(),
				hide: vi.fn(),
				toggle: vi.fn(),
				close: vi.fn(),
			};
			machineFrameManager.register('vehicle:42', controls);

			await machine.loadFrame('card.form', 'vehicle', '42');

			expect(controls.load).toHaveBeenCalledWith('card.form', 'vehicle', '42', undefined);
		});
	});

	describe('FrameControls lifecycle', () => {
		it('register → load → show → hide → toggle → close flow', () => {
			const controls: FrameControls = {
				load: vi.fn(),
				show: vi.fn(),
				hide: vi.fn(),
				toggle: vi.fn(),
				close: vi.fn(),
			};

			machineFrameManager.register('test-frame', controls);
			expect(machineFrameManager.has('test-frame')).toBe(true);

			// Simulate lifecycle
			machineFrameManager.getControls('test-frame')!.show();
			expect(controls.show).toHaveBeenCalled();

			machineFrameManager.getControls('test-frame')!.hide();
			expect(controls.hide).toHaveBeenCalled();

			machineFrameManager.getControls('test-frame')!.toggle();
			expect(controls.toggle).toHaveBeenCalled();

			// close delegates to controls.close() — Frame's close() handles unregister
			machineFrameManager.close('test-frame');
			expect(controls.close).toHaveBeenCalled();
		});
	});

	describe('computeFrameId consistency', () => {
		it('produces same ID regardless of var key order', () => {
			const id1 = computeFrameId('vehicle', '42', { z: 'last', a: 'first', m: 'mid' });
			const id2 = computeFrameId('vehicle', '42', { a: 'first', m: 'mid', z: 'last' });
			expect(id1).toBe(id2);
			expect(id1).toBe('vehicle:42:a=first&m=mid&z=last');
		});

		it('handles edge cases consistently', () => {
			expect(computeFrameId('vehicle')).toBe('vehicle');
			// Empty string collectionId is falsy → treated as no collectionId
			expect(computeFrameId('vehicle', '')).toBe('vehicle');
			expect(computeFrameId('vehicle', undefined, {})).toBe('vehicle');
			expect(computeFrameId('vehicle', '42', {})).toBe('vehicle:42');
		});
	});

	describe('openFrames reactivity', () => {
		it('openFrames reflects current registry state', () => {
			expect(machineFrameManager.openFrames.size).toBe(0);

			const c1: FrameControls = { load: vi.fn(), show: vi.fn(), hide: vi.fn(), toggle: vi.fn(), close: vi.fn() };
			const c2: FrameControls = { load: vi.fn(), show: vi.fn(), hide: vi.fn(), toggle: vi.fn(), close: vi.fn() };

			machineFrameManager.register('frame-a', c1);
			expect(machineFrameManager.openFrames.size).toBe(1);
			expect(machineFrameManager.openFrames.has('frame-a')).toBe(true);

			machineFrameManager.register('frame-b', c2);
			expect(machineFrameManager.openFrames.size).toBe(2);

			machineFrameManager.unregister('frame-a');
			expect(machineFrameManager.openFrames.size).toBe(1);
			expect(machineFrameManager.openFrames.has('frame-a')).toBe(false);
		});
	});
});
