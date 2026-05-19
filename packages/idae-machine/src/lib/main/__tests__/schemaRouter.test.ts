import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SchemaRouter } from '../router/SchemaRouter.js';
import { componentRegistry } from '../router/componentRegistry.js';
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

describe('SchemaRouter', () => {
	let router: SchemaRouter;

	beforeEach(() => {
		componentRegistry.clear();
		vi.clearAllMocks();
		router = new SchemaRouter();
	});

	describe('defaults', () => {
		it('uses base "/" by default', () => {
			router.init([]);
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)[0] as any;
			expect(lastCall.base).toBe('/');
		});

		it('has authEnabled false by default', () => {
			const r = new SchemaRouter();
			expect((r as any).config.authEnabled).toBe(false);
		});

		it('does not use outlet option (managed by actions)', () => {
			router.init([]);
			const lastCall = vi.mocked(createRouter).mock.calls.at(-1)[0] as any;
			expect(lastCall.outlet).toBeUndefined();
		});
	});

	describe('permission guard', () => {
		it('calls next() when permission check passes', () => {
			router.setPermissionCheck(() => true);
			router.init([]);
			const next = vi.fn();
			const to = { metadata: { permission: { code: 'L', table: 'test' } } };
			mockRouterInstance._before[1](to, {}, next);
			expect(next).toHaveBeenCalledWith();
		});

		it('redirects to /403 when permission check fails', () => {
			router.setPermissionCheck(() => false);
			router.init([]);
			const next = vi.fn();
			const to = { metadata: { permission: { code: 'L', table: 'test' } }, path: '/test' };
			mockRouterInstance._before[1](to, {}, next);
			expect(next).toHaveBeenCalledWith('/403');
		});
	});

	describe('auth guard', () => {
		it('skips auth guard when authEnabled is false (default)', () => {
			router.init([]);
			const next = vi.fn();
			const to = { metadata: {}, path: '/test' };
			mockRouterInstance._before[0](to, {}, next);
			expect(next).toHaveBeenCalledWith();
		});
	});

	describe('navigate / push', () => {
		it('navigate delegates to router.push', () => {
			router.init([]);
			router.navigate('/foo');
			expect(mockRouterInstance.push).toHaveBeenCalledWith('/foo');
		});

		it('push is an alias for navigate', () => {
			router.init([]);
			router.push('/bar');
			expect(mockRouterInstance.push).toHaveBeenCalledWith('/bar');
		});
	});
});
