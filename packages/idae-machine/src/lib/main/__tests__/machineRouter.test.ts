import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MachineRouter } from '../machine/MachineRouter.js';
import { createRouter } from '@medyll/idae-router';

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

		it('registers only the catch-all /+* route', () => {
			router.init();
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)?.[0] as any;
			expect(lastCall.routes).toHaveLength(1);
			expect(lastCall.routes[0].path).toBe('/+*');
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
	});
});
