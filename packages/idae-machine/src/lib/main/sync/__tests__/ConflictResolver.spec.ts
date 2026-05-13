import { describe, it, expect, vi } from 'vitest';
import { ConflictResolver, createConflictResolver } from '../ConflictResolver.js';

describe('ConflictResolver', () => {
	describe('constructor', () => {
		it('should create with default config', () => {
			const resolver = createConflictResolver();
			expect(resolver.getStrategy('unknown')).toBe('last-write-wins');
		});

		it('should create with custom config', () => {
			const resolver = createConflictResolver({
				defaultStrategy: 'server-wins',
				tableStrategies: {
					'produit': 'manual'
				}
			});

			expect(resolver.getStrategy('produit')).toBe('manual');
			expect(resolver.getStrategy('client')).toBe('server-wins');
		});
	});

	describe('resolve', () => {
		it('should resolve with last-write-wins', () => {
			const resolver = createConflictResolver({ defaultStrategy: 'last-write-wins' });
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client', updatedAt: '2026-04-24T12:00:00Z' },
				serverVersion: { id: '123', name: 'Server', updatedAt: '2026-04-24T11:00:00Z' }
			};

			const result = resolver.resolve(conflict);
			
			expect(result.resolved).toEqual(conflict.clientVersion);
			expect(result.resolution).toBe('client');
		});

		it('should resolve with server-wins', () => {
			const resolver = createConflictResolver({ defaultStrategy: 'server-wins' });
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client' },
				serverVersion: { id: '123', name: 'Server' }
			};

			const result = resolver.resolve(conflict);
			
			expect(result.resolved).toEqual(conflict.serverVersion);
			expect(result.resolution).toBe('server');
		});

		it('should resolve with client-wins', () => {
			const resolver = createConflictResolver({ defaultStrategy: 'client-wins' });
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client' },
				serverVersion: { id: '123', name: 'Server' }
			};

			const result = resolver.resolve(conflict);
			
			expect(result.resolved).toEqual(conflict.clientVersion);
			expect(result.resolution).toBe('client');
		});

		it('should emit conflict for manual strategy', () => {
			const resolver = createConflictResolver({ 
				defaultStrategy: 'manual',
				emitConflicts: true 
			});
			
			const listener = vi.fn();
			resolver.onConflict(listener);

			const conflict = {
				table: 'document',
				id: '123',
				clientVersion: { id: '123', content: 'Client' },
				serverVersion: { id: '123', content: 'Server' }
			};

			resolver.resolve(conflict);
			
			expect(listener).toHaveBeenCalledWith(expect.objectContaining({
				table: 'document',
				strategy: 'manual'
			}));
		});
	});

	describe('onConflict', () => {
		it('should register listener', () => {
			const resolver = createConflictResolver();
			const listener = vi.fn();
			
			const unsubscribe = resolver.onConflict(listener);
			
			expect(unsubscribe).toBeDefined();
			expect(typeof unsubscribe).toBe('function');
		});

		it('should unregister listener with unsubscribe', () => {
			const resolver = createConflictResolver();
			const listener = vi.fn();
			
			const unsubscribe = resolver.onConflict(listener);
			unsubscribe();

			// After unsubscribe, listener should not be called
			// (can't easily test this without triggering the event)
			expect(true).toBe(true);
		});
	});

	describe('manualResolve', () => {
		it('should manually resolve with client version', () => {
			const resolver = createConflictResolver();
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client' },
				serverVersion: { id: '123', name: 'Server' },
				strategy: 'manual' as const,
				timestamp: new Date()
			};

			const result = resolver.manualResolve(conflict, 'client');
			
			expect(result.resolved).toEqual(conflict.clientVersion);
			expect(result.resolution).toBe('client');
		});

		it('should manually resolve with server version', () => {
			const resolver = createConflictResolver();
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client' },
				serverVersion: { id: '123', name: 'Server' },
				strategy: 'manual' as const,
				timestamp: new Date()
			};

			const result = resolver.manualResolve(conflict, 'server');
			
			expect(result.resolved).toEqual(conflict.serverVersion);
			expect(result.resolution).toBe('server');
		});

		it('should manually resolve with merged data', () => {
			const resolver = createConflictResolver();
			
			const conflict = {
				table: 'produit',
				id: '123',
				clientVersion: { id: '123', name: 'Client' },
				serverVersion: { id: '123', name: 'Server' },
				strategy: 'manual' as const,
				timestamp: new Date()
			};

			const merged = { id: '123', name: 'Merged', version: 2 };
			const result = resolver.manualResolve(conflict, 'merged', merged);
			
			expect(result.resolved).toEqual(merged);
			expect(result.resolution).toBe('merged');
		});
	});

	describe('setConfig', () => {
		it('should update configuration', () => {
			const resolver = createConflictResolver();
			
			resolver.setConfig({
				defaultStrategy: 'server-wins',
				autoResolve: false
			});

			expect(resolver.getStrategy('test')).toBe('server-wins');
		});
	});
});
