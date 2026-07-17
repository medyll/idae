// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MachineRouter } from '../machine/MachineRouter.js';
import { createRouter } from '@medyll/idae-router';
import { machineFrameManager } from '../frame/MachineFrameManager.js';

vi.mock('$lib/utils/logger.js', () => ({
	logger: { info: vi.fn(), warn: vi.fn() }
}));

let mockRouterInstance: any;

vi.mock('@medyll/idae-router', () => ({
	createRouter: vi.fn(() => {
		const hooks: Function[] = [];
		mockRouterInstance = {
			_before: hooks,
			before(fn: Function) { hooks.push(fn); },
			push: vi.fn(),
		};
		return mockRouterInstance;
	})
}));

describe('MachineRouter', () => {
	let router: MachineRouter;

	beforeEach(() => {
		vi.clearAllMocks();
		router = new MachineRouter();
	});

	describe('defaults', () => {
		it('uses base "/" by default', () => {
			router.init();
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any;
			expect(lastCall.base).toBe('/');
		});

		it('uses hash mode', () => {
			router.init();
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any;
			expect(lastCall.mode).toBe('hash');
		});

		it('has authEnabled false by default', () => {
			const r = new MachineRouter();
			expect((r as any).config.authEnabled).toBe(false);
		});

		it('registers one catch-all route so an empty routed state can close dialogs', () => {
			router.init();
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any;
			expect(lastCall.routes).toHaveLength(1);
			expect(lastCall.routes[0].path).toBe('/*');
		});
	});

	describe('auth guard', () => {
		it('skips auth guard when authEnabled is false (default)', () => {
			router.init();
			const next = vi.fn();
			const to = { metadata: {}, path: '/test' };
			mockRouterInstance._before[0](to, {}, next);
			expect(next).toHaveBeenCalledWith();
		});

		it('redirects to loginRoute when authEnabled and no token', () => {
			router = new MachineRouter({ authEnabled: true });
			router.init();

			// Stub localStorage.getItem → no token
			const originalLocalStorage = globalThis.localStorage;
			(globalThis as any).localStorage = { getItem: () => null };

			const next = vi.fn();
			const to = { metadata: {}, path: '/foo' };
			mockRouterInstance._before[0](to, {}, next);

			expect(next).toHaveBeenCalledWith(expect.stringMatching(/^\/login\?redirect=/));

			(globalThis as any).localStorage = originalLocalStorage;
		});

		it('allows navigation when route metadata is public', () => {
			router = new MachineRouter({ authEnabled: true });
			router.init();

			const next = vi.fn();
			const to = { metadata: { public: true }, path: '/login' };
			mockRouterInstance._before[0](to, {}, next);

			expect(next).toHaveBeenCalledWith();
		});
	});

	describe('waitForZone (deep-link cold boot)', () => {
		afterEach(() => {
			document.querySelectorAll('[data-target-zone]').forEach((el) => el.remove());
		});

		it('resolves immediately when the zone is already in the DOM', async () => {
			const el = document.createElement('div');
			el.setAttribute('data-target-zone', 'main');
			document.body.appendChild(el);

			const found = await (router as any).waitForZone('main', 100);
			expect(found).toBe(el);
		});

		it('resolves when the zone is mounted after the dispatch', async () => {
			const promise = (router as any).waitForZone('main', 2000);

			const el = document.createElement('div');
			el.setAttribute('data-target-zone', 'main');
			setTimeout(() => document.body.appendChild(el), 20);

			const found = await promise;
			expect(found).toBe(el);
		});

		it('resolves null on timeout when the zone never mounts', async () => {
			const found = await (router as any).waitForZone('ghost', 50);
			expect(found).toBeNull();
		});
	});

	describe('navigate / push', () => {
		it('navigate delegates to router.push', () => {
			router.init();
			router.navigate('/foo');
			expect(mockRouterInstance.push).toHaveBeenCalledWith('/foo');
		});

		it('push is an alias for navigate', () => {
			router.init();
			router.push('/bar');
			expect(mockRouterInstance.push).toHaveBeenCalledWith('/bar');
		});

		it('goes back when closing the current frame after an in-app push', () => {
			router.init();
			const path = '/+main/explorer/vehicle';
			router.push(path);
			window.location.hash = path;
			const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

			router.closeFrame('explorer:main');

			expect(back).toHaveBeenCalledOnce();
			back.mockRestore();
		});

		it('cleans a cold deep-link instead of leaving the origin', () => {
			router.init();
			window.history.replaceState({}, '', '/#/+placeholder');
			window.location.hash = '/+main/explorer/vehicle';
			const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

			router.closeFrame('explorer:main');

			expect(back).not.toHaveBeenCalled();
			expect(window.location.hash).toBe('');
			back.mockRestore();
		});

		it('does not change history when closing a frame absent from the current URL', () => {
			router.init();
			window.location.hash = '/+main/explorer/vehicle';
			const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});
			const replace = vi.spyOn(window.history, 'replaceState');

			router.closeFrame('dashboard:main');

			expect(back).not.toHaveBeenCalled();
			expect(replace).not.toHaveBeenCalled();
			back.mockRestore();
			replace.mockRestore();
		});

		it('adds a dialog segment while preserving the current routed page', () => {
			router.init();
			window.location.hash = '/+main/explorer/vehicle';

			router.openDialog({ modulePath: 'fiche', collection: 'vehicle', collectionId: '42' });

			expect(mockRouterInstance.push).toHaveBeenLastCalledWith(
				'/+main/explorer/vehicle/+dialog/fiche/vehicle/42'
			);
		});

		it('pushes the pre-dialog URL when the user closes a routed dialog', () => {
			router.init();
			window.location.hash = '/+main/explorer/vehicle';
			router.openDialog({ modulePath: 'fiche', collection: 'vehicle', collectionId: '42' });
			window.location.hash = '/+main/explorer/vehicle/+dialog/fiche/vehicle/42';

			router.closeFrame('dialog:fiche:vehicle:42');

			expect(mockRouterInstance.push).toHaveBeenLastCalledWith('/+main/explorer/vehicle');
		});

		it('restores a dialog from a routed Back/Forward state', async () => {
			router.init();
			const loadDialog = vi.spyOn(machineFrameManager, 'loadInDialog').mockResolvedValue();
			const route = (vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any).routes[0];

			await route.action({ path: '/+dialog/fiche/vehicle/42' });

			expect(loadDialog).toHaveBeenCalledWith(
				'fiche',
				'vehicle',
				'42',
				{ vars: undefined, history: false }
			);
			loadDialog.mockRestore();
		});

		it('closes a routed dialog silently when it disappears from the URL', async () => {
			router.init();
			const loadDialog = vi.spyOn(machineFrameManager, 'loadInDialog').mockResolvedValue();
			const has = vi.spyOn(machineFrameManager, 'has').mockReturnValue(true);
			const close = vi.spyOn(machineFrameManager, 'close').mockImplementation(() => {});
			const route = (vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any).routes[0];

			await route.action({ path: '/+dialog/fiche/vehicle/42' });
			await route.action({ path: '/' });

			expect(close).toHaveBeenCalledWith('dialog:fiche:vehicle:42', { history: false });
			loadDialog.mockRestore();
			has.mockRestore();
			close.mockRestore();
		});

		it('keeps the previous dialog in the URL when closing the top dialog', () => {
			router.init();
			window.location.hash = '/+main/explorer/vehicle';
			router.openDialog({ modulePath: 'fiche', collection: 'vehicle', collectionId: '42' });
			window.location.hash = '/+main/explorer/vehicle/+dialog/fiche/vehicle/42';
			router.openDialog({ modulePath: 'fiche.update', collection: 'vehicle', collectionId: '42' });
			window.location.hash = '/+main/explorer/vehicle/+dialog/fiche/vehicle/42/+dialog/fiche.update/vehicle/42';

			router.closeFrame('dialog:fiche.update:vehicle:42');

			expect(mockRouterInstance.push).toHaveBeenLastCalledWith(
				'/+main/explorer/vehicle/+dialog/fiche/vehicle/42'
			);
		});
	});
});
