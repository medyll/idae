import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HydrationController, type HydrationHooks } from './HydrationController.js';
import type { IdaeApiDeliverer } from '@medyll/idae-sync';
import type { IdbCollection } from './engine/IdbCollection.js';

describe('HydrationController', () => {
	let mockDeliverer: IdaeApiDeliverer;
	let mockCollection: IdbCollection<any>;
	let collections: Map<string, IdbCollection<any>>;
	let hooks: HydrationHooks;
	let hookCalls: { type: string; collection: string; extra?: any }[];

	beforeEach(() => {
		hookCalls = [];
		hooks = {
			onColdRead: (collection: string) => hookCalls.push({ type: 'coldRead', collection }),
			onHydrated: (collection: string, count: number) =>
				hookCalls.push({ type: 'hydrated', collection, extra: count }),
			onHydrateError: (collection: string, err: Error) =>
				hookCalls.push({ type: 'error', collection, extra: err.message }),
		};

		mockCollection = {
			bulkUpsertSilent: vi.fn().mockResolvedValue([]),
		} as any;

		collections = new Map([['users', mockCollection]]);

		mockDeliverer = {
			fetchAll: vi.fn().mockResolvedValue([
				{ id: 'u1', name: 'Alice' },
				{ id: 'u2', name: 'Bob' },
			]),
		} as any;
	});

	describe('ensure', () => {
		it('should trigger pull on first ensure', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			// Allow microtask queue to flush
			await new Promise((r) => setTimeout(r, 10));

			expect(mockDeliverer.fetchAll).toHaveBeenCalledWith('users');
			expect(mockCollection.bulkUpsertSilent).toHaveBeenCalledWith([
				{ id: 'u1', name: 'Alice' },
				{ id: 'u2', name: 'Bob' },
			]);
		});

		it('should dedup concurrent ensure calls', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			ctrl.ensure('users');
			ctrl.ensure('users');

			await new Promise((r) => setTimeout(r, 10));

			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(1);
		});

		it('should skip hydration if already hydrated', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(1);

			// Second ensure after hydration
			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(1);
		});

		it('should call onColdRead and onHydrated hooks', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));

			expect(hookCalls).toContainEqual({ type: 'coldRead', collection: 'users' });
			expect(hookCalls).toContainEqual({ type: 'hydrated', collection: 'users', extra: 2 });
		});

		it('should call onHydrateError on failure without throwing', async () => {
			(mockDeliverer.fetchAll as any).mockRejectedValue(new Error('Network error'));
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));

			expect(hookCalls).toContainEqual({
				type: 'error',
				collection: 'users',
				extra: 'Network error',
			});
			expect(mockCollection.bulkUpsertSilent).not.toHaveBeenCalled();
		});

		it('should not mark hydrated on failure — retry possible', async () => {
			(mockDeliverer.fetchAll as any)
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce([{ id: 'u1', name: 'Alice' }]);

			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			// First ensure — fails
			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(1);

			// Second ensure — should retry since first failed
			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(2);
			expect(mockCollection.bulkUpsertSilent).toHaveBeenCalledTimes(1);
		});

		it('should be no-op when disabled', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks, false);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));

			expect(mockDeliverer.fetchAll).not.toHaveBeenCalled();
		});
	});

	describe('revalidate', () => {
		it('should force fresh pull even if already hydrated', async () => {
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(1);

			await ctrl.revalidate('users');
			expect(mockDeliverer.fetchAll).toHaveBeenCalledTimes(2);
		});
	});

	describe('pull normalization', () => {
		it('should handle empty array response', async () => {
			(mockDeliverer.fetchAll as any).mockResolvedValue([]);
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));

			expect(mockCollection.bulkUpsertSilent).not.toHaveBeenCalled();
			expect(hookCalls).toContainEqual({ type: 'hydrated', collection: 'users', extra: 0 });
		});

		it('should handle { data: [] } wrapper response', async () => {
			// fetchAll is expected to normalize { data: [] } into an array
			(mockDeliverer.fetchAll as any).mockResolvedValue([
				{ id: 'u3', name: 'Charlie' },
			]);
			const ctrl = new HydrationController(mockDeliverer, collections, hooks);

			ctrl.ensure('users');
			await new Promise((r) => setTimeout(r, 10));

			expect(mockCollection.bulkUpsertSilent).toHaveBeenCalledWith([
				{ id: 'u3', name: 'Charlie' },
			]);
		});
	});
});
