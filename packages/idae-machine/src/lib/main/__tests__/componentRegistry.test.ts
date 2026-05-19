import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentRegistry } from '../router/componentRegistry.js';
import type { Component } from 'svelte';

describe('ComponentRegistry', () => {
	let registry: ComponentRegistry;

	beforeEach(() => {
		registry = new ComponentRegistry();
	});

	describe('register + resolve', () => {
		it('resolves a registered key to its component', async () => {
			const mockComponent = {} as Component;
			registry.register('test.component', () => Promise.resolve({ default: mockComponent }));

			const resolved = await registry.resolve('test.component');
			expect(resolved).toBe(mockComponent);
		});

		it('caches the resolved component (loader called once)', async () => {
			let callCount = 0;
			const mockComponent = {} as Component;
			registry.register('cached.component', () => {
				callCount++;
				return Promise.resolve({ default: mockComponent });
			});

			await registry.resolve('cached.component');
			await registry.resolve('cached.component');
			await registry.resolve('cached.component');

			expect(callCount).toBe(1);
		});

		it('throws Error("[registry] unknown: ...") for unregistered key', async () => {
			await expect(registry.resolve('unknown.key')).rejects.toThrow('[registry] unknown: unknown.key');
		});
	});

	describe('registerMany', () => {
		it('registers multiple components at once', async () => {
			const compA = {} as Component;
			const compB = {} as Component;

			registry.registerMany({
				'a': () => Promise.resolve({ default: compA }),
				'b': () => Promise.resolve({ default: compB }),
			});

			expect(await registry.resolve('a')).toBe(compA);
			expect(await registry.resolve('b')).toBe(compB);
		});
	});

	describe('has', () => {
		it('returns true for registered keys', () => {
			registry.register('exists', () => Promise.resolve({ default: {} as Component }));
			expect(registry.has('exists')).toBe(true);
		});

		it('returns false for unregistered keys', () => {
			expect(registry.has('missing')).toBe(false);
		});
	});

	describe('keys', () => {
		it('returns all registered keys', () => {
			registry.registerMany({
				'one': () => Promise.resolve({ default: {} as Component }),
				'two': () => Promise.resolve({ default: {} as Component }),
				'three': () => Promise.resolve({ default: {} as Component }),
			});

			const keys = registry.keys();
			expect(keys).toContain('one');
			expect(keys).toContain('two');
			expect(keys).toContain('three');
			expect(keys).toHaveLength(3);
		});

		it('returns empty array for empty registry', () => {
			expect(registry.keys()).toEqual([]);
		});
	});

	describe('clear', () => {
		it('removes all entries', () => {
			registry.registerMany({
				'a': () => Promise.resolve({ default: {} as Component }),
				'b': () => Promise.resolve({ default: {} as Component }),
			});

			registry.clear();

			expect(registry.keys()).toEqual([]);
			expect(registry.has('a')).toBe(false);
		});
	});
});
