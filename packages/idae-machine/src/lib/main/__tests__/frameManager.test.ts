import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MachineFrameManager, type FrameControls } from '../frame/MachineFrameManager.js';

function makeControls(overrides: Partial<FrameControls> = {}): FrameControls {
	return {
		load:     vi.fn(),
		show:     vi.fn(),
		hide:     vi.fn(),
		toggle:   vi.fn(),
		close:    vi.fn(),
		...overrides,
	};
}

describe('MachineFrameManager', () => {
	let manager: MachineFrameManager;

	beforeEach(() => {
		manager = new MachineFrameManager();
	});

	describe('register / unregister', () => {
		it('registers a frame and makes it available via has/getControls', () => {
			const controls = makeControls();
			manager.register('frame-1', controls);

			expect(manager.has('frame-1')).toBe(true);
			expect(manager.getControls('frame-1')).toBe(controls);
		});

		it('throws if registering a duplicate frameId', () => {
			const controls = makeControls();
			manager.register('dup', controls);
			expect(() => manager.register('dup', makeControls())).toThrow(
				'[FrameManager] frame "dup" already registered'
			);
		});

		it('unregister removes the frame (no-op if not found)', () => {
			const controls = makeControls();
			manager.register('removable', controls);
			expect(manager.has('removable')).toBe(true);

			manager.unregister('removable');
			expect(manager.has('removable')).toBe(false);
			expect(manager.getControls('removable')).toBeUndefined();

			// No-op for unknown
			expect(() => manager.unregister('nonexistent')).not.toThrow();
		});
	});

	describe('openFrames', () => {
		it('returns a readonly view of the registry', () => {
			manager.register('a', makeControls());
			manager.register('b', makeControls());

			const view = manager.openFrames;
			expect(view.size).toBe(2);
			expect(view.has('a')).toBe(true);
			expect(view.has('b')).toBe(true);
		});

		it('returns empty map when no frames registered', () => {
			expect(manager.openFrames.size).toBe(0);
		});
	});

	describe('load — known frame', () => {
		it('delegates to controls.load() when frame is registered', async () => {
			const controls = makeControls();
			manager.register('vehicle', controls);

			await manager.load('vehicle', 'card.form', 'vehicle', '42', { tab: 'info' });

			expect(controls.load).toHaveBeenCalledWith('card.form', 'vehicle', '42', { tab: 'info' });
		});

		it('calls load with minimal args (no collectionId, no vars)', async () => {
			const controls = makeControls();
			manager.register('simple', controls);

			await manager.load('simple', 'explorer.list', 'vehicle');

			expect(controls.load).toHaveBeenCalledWith('explorer.list', 'vehicle', undefined, undefined);
		});
	});

	describe('load — unknown frame with DOM zone', () => {
		it('throws when frame not registered and no DOM zone exists', async () => {
			await expect(
				manager.load('ghost', 'card.form', 'vehicle')
			).rejects.toThrow('[FrameManager] frame "ghost" not found and no DOM zone');
		});

		it('throws when frame not registered, zone exists, but no mountFn provided', async () => {
			// Simulate DOM zone via manual document mock
			const zone = { setAttribute: vi.fn() };
			const querySelector = vi.fn().mockReturnValue(zone);
			(globalThis as any).document = { querySelector, body: { appendChild: vi.fn(), removeChild: vi.fn() } };

			await expect(
				manager.load('dynamic-frame', 'card.form', 'vehicle')
			).rejects.toThrow('[FrameManager] frame "dynamic-frame" not registered — mountFn required');

			delete (globalThis as any).document;
		});

		it('mounts via mountFn, then loads after auto-registration', async () => {
			const zone = { setAttribute: vi.fn() };
			const querySelector = vi.fn().mockReturnValue(zone);
			(globalThis as any).document = { querySelector, body: { appendChild: vi.fn(), removeChild: vi.fn() } };

			const controls = makeControls();

			const mountFn = vi.fn().mockImplementation(async (frameId: string) => {
				manager.register(frameId, controls);
			});

			await manager.load('auto-frame', 'card.form', 'vehicle', '99', undefined, mountFn);

			expect(mountFn).toHaveBeenCalledWith('auto-frame');
			expect(controls.load).toHaveBeenCalledWith('card.form', 'vehicle', '99', undefined);

			delete (globalThis as any).document;
		});

		it('throws if mountFn succeeds but frame did not register', async () => {
			const zone = { setAttribute: vi.fn() };
			const querySelector = vi.fn().mockReturnValue(zone);
			(globalThis as any).document = { querySelector, body: { appendChild: vi.fn(), removeChild: vi.fn() } };

			const mountFn = vi.fn().mockResolvedValue(undefined);

			await expect(
				manager.load('broken-frame', 'card.form', 'vehicle', undefined, undefined, mountFn)
			).rejects.toThrow('[FrameManager] frame "broken-frame" failed to register after mount');

			delete (globalThis as any).document;
		});
	});

	describe('show / hide / toggle / close', () => {
		it('show delegates to controls.show()', () => {
			const controls = makeControls();
			manager.register('s1', controls);
			manager.show('s1');
			expect(controls.show).toHaveBeenCalled();
		});

		it('hide delegates to controls.hide()', () => {
			const controls = makeControls();
			manager.register('s2', controls);
			manager.hide('s2');
			expect(controls.hide).toHaveBeenCalled();
		});

		it('toggle delegates to controls.toggle()', () => {
			const controls = makeControls();
			manager.register('s3', controls);
			manager.toggle('s3');
			expect(controls.toggle).toHaveBeenCalled();
		});

		it('close delegates to controls.close()', () => {
			const controls = makeControls();
			manager.register('s4', controls);
			manager.close('s4');
			expect(controls.close).toHaveBeenCalled();
		});

		it('show throws for unknown frame', () => {
			expect(() => manager.show('missing')).toThrow('[FrameManager] frame "missing" not found');
		});

		it('hide throws for unknown frame', () => {
			expect(() => manager.hide('missing')).toThrow('[FrameManager] frame "missing" not found');
		});

		it('toggle throws for unknown frame', () => {
			expect(() => manager.toggle('missing')).toThrow('[FrameManager] frame "missing" not found');
		});

		it('close throws for unknown frame', () => {
			expect(() => manager.close('missing')).toThrow('[FrameManager] frame "missing" not found');
		});
	});

	describe('clear', () => {
		it('removes all registered frames', () => {
			manager.register('x', makeControls());
			manager.register('y', makeControls());
			expect(manager.openFrames.size).toBe(2);

			manager.clear();
			expect(manager.openFrames.size).toBe(0);
		});
	});

	describe('singleton export', () => {
		it('exports a singleton instance', async () => {
			const { machineFrameManager } = await import('../frame/MachineFrameManager.js');
			expect(machineFrameManager).toBeInstanceOf(MachineFrameManager);
		});
	});
});
