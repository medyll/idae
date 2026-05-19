import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerHook, dispatch, clearHooks } from '../hooks/HooksRegistry.js';
import type { HookContext } from '../hooks/types.js';

describe('HooksRegistry', () => {
	beforeEach(() => {
		clearHooks();
	});

	afterEach(() => {
		clearHooks();
	});

	describe('registerHook + dispatch', () => {
		it('calls handler when event is dispatched', async () => {
			const fn = vi.fn();
			registerHook('post:create', fn);
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('passes context to handler', async () => {
			const ctx: HookContext = { event: 'post:create', collection: 'orders', recordId: '123', data: { name: 'test' } };
			let received: HookContext | undefined;
			registerHook('post:create', (c) => { received = c; });
			await dispatch('post:create', ctx);
			expect(received).toEqual(ctx);
		});
	});

	describe('priority ordering', () => {
		it('executes handlers in priority order (ascending)', async () => {
			const order: number[] = [];
			registerHook('post:create', () => { order.push(100); }, { priority: 100 });
			registerHook('post:create', () => { order.push(10); },  { priority: 10 });
			registerHook('post:create', () => { order.push(50); },  { priority: 50 });
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			expect(order).toEqual([10, 50, 100]);
		});
	});

	describe('non-blocking error handling', () => {
		it('continues executing remaining handlers after non-blocking throw', async () => {
			const called: number[] = [];
			registerHook('post:create', () => { called.push(1); throw new Error('fail'); });
			registerHook('post:create', () => { called.push(2); });
			registerHook('post:create', () => { called.push(3); });
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			expect(called).toEqual([1, 2, 3]);
		});
	});

	describe('blocking error handling', () => {
		it('propagates error and stops execution', async () => {
			const called: number[] = [];
			registerHook('post:create', () => { called.push(1); throw new Error('blocking'); }, { blocking: true });
			registerHook('post:create', () => { called.push(2); });
			await expect(dispatch('post:create', { event: 'post:create', collection: 'test' }))
				.rejects.toThrow('blocking');
			expect(called).toEqual([1]);
		});
	});

	describe('collection filter', () => {
		it('only calls handler for matching collection', async () => {
			const fn = vi.fn();
			registerHook('post:create', fn, { collection: 'orders' });
			await dispatch('post:create', { event: 'post:create', collection: 'users' });
			expect(fn).not.toHaveBeenCalled();
			await dispatch('post:create', { event: 'post:create', collection: 'orders' });
			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	describe('clearHooks', () => {
		it('clears all hooks when no event specified', async () => {
			const fn = vi.fn();
			registerHook('post:create', fn);
			registerHook('post:update', fn);
			clearHooks();
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			await dispatch('post:update', { event: 'post:update', collection: 'test' });
			expect(fn).not.toHaveBeenCalled();
		});

		it('clears only specified event', async () => {
			const fn1 = vi.fn();
			const fn2 = vi.fn();
			registerHook('post:create', fn1);
			registerHook('post:update', fn2);
			clearHooks('post:create');
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			await dispatch('post:update', { event: 'post:update', collection: 'test' });
			expect(fn1).not.toHaveBeenCalled();
			expect(fn2).toHaveBeenCalledTimes(1);
		});
	});

	describe('async handlers', () => {
		it('awaits async handlers', async () => {
			let done = false;
			registerHook('post:create', async () => {
				await new Promise(r => setTimeout(r, 10));
				done = true;
			});
			await dispatch('post:create', { event: 'post:create', collection: 'test' });
			expect(done).toBe(true);
		});
	});
});
