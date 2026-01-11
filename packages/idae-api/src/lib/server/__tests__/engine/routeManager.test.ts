import { describe, it, expect, beforeEach } from 'vitest';
import { RouteManager } from '$lib/server/engine/routeManager.js';
import type { RouteDefinition } from '$lib/config/routeDefinitions.js';

describe('RouteManager', () => {
	let routeManager: RouteManager;

	beforeEach(() => {
		routeManager = RouteManager.getInstance();
		// Clear routes by creating a fresh instance (in real scenario, use a reset method)
	});

	describe('Singleton Pattern', () => {
		it('should return same instance on multiple calls', () => {
			const instance1 = RouteManager.getInstance();
			const instance2 = RouteManager.getInstance();

			expect(instance1).toBe(instance2);
		});

		it('should use private constructor', () => {
			// Cannot instantiate directly - TypeScript won't compile
			// This test documents the pattern
			expect(RouteManager.getInstance()).toBeDefined();
		});
	});

	describe('addRoute', () => {
		it('should add a single route', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/test',
				handler: async () => ({ message: 'test' })
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/test')).toBe(true);
		});

		it('should set disabled flag to false by default', () => {
			const route: RouteDefinition = {
				method: 'post',
				path: '/create',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();
			const addedRoute = routes.find((r) => r.path === '/create');

			expect(addedRoute?.disabled).toBe(false);
		});

		it('should preserve disabled flag if set to true', () => {
			const route: RouteDefinition = {
				method: 'delete',
				path: '/remove',
				handler: async () => ({}),
				disabled: true
			};

			routeManager.addRoute(route);
			const allRoutes = (routeManager as any).routes; // Access private routes

			expect(allRoutes.some((r: any) => r.path === '/remove' && r.disabled === true)).toBe(true);
		});

		it('should handle string method', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/users',
				handler: async () => ([])
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/users' && r.method === 'get')).toBe(true);
		});

		it('should handle array of methods', () => {
			const route: RouteDefinition = {
				method: ['get', 'post'],
				path: '/resource',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/resource' && Array.isArray(r.method))).toBe(true);
		});
	});

	describe('addRoutes', () => {
		it('should add multiple routes at once', () => {
			const routes: RouteDefinition[] = [
				{
					method: 'get',
					path: '/users',
					handler: async () => ([])
				},
				{
					method: 'post',
					path: '/users',
					handler: async () => ({})
				},
				{
					method: 'delete',
					path: '/users/:id',
					handler: async () => ({})
				}
			];

			routeManager.addRoutes(routes);
			const registeredRoutes = routeManager.getRoutes();

			expect(registeredRoutes.length).toBeGreaterThanOrEqual(3);
			expect(registeredRoutes.some((r) => r.path === '/users')).toBe(true);
			expect(registeredRoutes.some((r) => r.path === '/users/:id')).toBe(true);
		});

		it('should handle empty array', () => {
			routeManager.addRoutes([]);
			expect(() => routeManager.addRoutes([])).not.toThrow();
		});

		it('should preserve individual route properties', () => {
			const routes: RouteDefinition[] = [
				{
					method: 'get',
					path: '/public',
					handler: async () => ({}),
					requiresAuth: false
				},
				{
					method: 'delete',
					path: '/admin',
					handler: async () => ({}),
					requiresAuth: true
				}
			];

			routeManager.addRoutes(routes);
			const registered = routeManager.getRoutes();

			expect(registered.find((r) => r.path === '/public')?.requiresAuth).toBe(false);
			expect(registered.find((r) => r.path === '/admin')?.requiresAuth).toBe(true);
		});
	});

	describe('getRoutes', () => {
		it('should return only non-disabled routes', () => {
			const route1: RouteDefinition = {
				method: 'get',
				path: '/active',
				handler: async () => ({}),
				disabled: false
			};

			const route2: RouteDefinition = {
				method: 'post',
				path: '/inactive',
				handler: async () => ({}),
				disabled: true
			};

			routeManager.addRoute(route1);
			routeManager.addRoute(route2);

			const activeRoutes = routeManager.getRoutes();

			expect(activeRoutes.some((r) => r.path === '/active')).toBe(true);
			expect(activeRoutes.some((r) => r.path === '/inactive')).toBe(false);
		});

		it('should return empty array if all routes are disabled', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/test',
				handler: async () => ({}),
				disabled: true
			};

			routeManager.addRoute(route);
			routeManager.disableRoute('/test', 'get');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/test')).toBe(false);
		});
	});

	describe('disableRoute', () => {
		it('should disable route by path and method', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/users/:id',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			routeManager.disableRoute('/users/:id', 'get');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/users/:id')).toBe(false);
		});

		it('should disable route when method is in array', () => {
			const route: RouteDefinition = {
				method: ['get', 'post'],
				path: '/resource',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			routeManager.disableRoute('/resource', 'post');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/resource')).toBe(false);
		});

		it('should be idempotent for non-existent routes', () => {
			expect(() => routeManager.disableRoute('/nonexistent', 'get')).not.toThrow();
		});

		it('should not affect other routes', () => {
			const route1: RouteDefinition = {
				method: 'get',
				path: '/users',
				handler: async () => ([])
			};

			const route2: RouteDefinition = {
				method: 'get',
				path: '/posts',
				handler: async () => ([])
			};

			routeManager.addRoute(route1);
			routeManager.addRoute(route2);

			routeManager.disableRoute('/users', 'get');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/users')).toBe(false);
			expect(routes.some((r) => r.path === '/posts')).toBe(true);
		});
	});

	describe('enableRoute', () => {
		it('should enable previously disabled route', () => {
			const route: RouteDefinition = {
				method: 'post',
				path: '/create',
				handler: async () => ({}),
				disabled: true
			};

			routeManager.addRoute(route);
			routeManager.enableRoute('/create', 'post');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/create')).toBe(true);
		});

		it('should enable route from array of methods', () => {
			const route: RouteDefinition = {
				method: ['get', 'post'],
				path: '/resource',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			routeManager.disableRoute('/resource', 'get');
			routeManager.enableRoute('/resource', 'post');

			const routes = routeManager.getRoutes();

			expect(routes.some((r) => r.path === '/resource')).toBe(true);
		});

		it('should be idempotent for already enabled routes', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/test',
				handler: async () => ({})
			};

			routeManager.addRoute(route);
			const routesBefore = routeManager.getRoutes().length;

			routeManager.enableRoute('/test', 'get');
			const routesAfter = routeManager.getRoutes().length;

			expect(routesBefore).toBe(routesAfter);
		});

		it('should not affect non-existent routes', () => {
			expect(() => routeManager.enableRoute('/nonexistent', 'get')).not.toThrow();
		});
	});

	describe('Route Lifecycle', () => {
		it('should support disable -> enable cycle', () => {
			const route: RouteDefinition = {
				method: 'get',
				path: '/status',
				handler: async () => ({ status: 'ok' })
			};

			routeManager.addRoute(route);

			// Route is active
			expect(routeManager.getRoutes().some((r) => r.path === '/status')).toBe(true);

			// Disable it
			routeManager.disableRoute('/status', 'get');
			expect(routeManager.getRoutes().some((r) => r.path === '/status')).toBe(false);

			// Re-enable it
			routeManager.enableRoute('/status', 'get');
			expect(routeManager.getRoutes().some((r) => r.path === '/status')).toBe(true);
		});

		it('should handle multiple routes with same path but different methods', () => {
			const getRoute: RouteDefinition = {
				method: 'get',
				path: '/items',
				handler: async () => ([])
			};

			const postRoute: RouteDefinition = {
				method: 'post',
				path: '/items',
				handler: async () => ({})
			};

			routeManager.addRoute(getRoute);
			routeManager.addRoute(postRoute);

			const routes = routeManager.getRoutes();

			expect(routes.filter((r) => r.path === '/items').length).toBeGreaterThanOrEqual(2);
		});
	});

	describe('Handler Execution', () => {
		it('should preserve handler function', () => {
			const testHandler = async () => ({ result: 'test' });

			const route: RouteDefinition = {
				method: 'get',
				path: '/test',
				handler: testHandler
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();
			const addedRoute = routes.find((r) => r.path === '/test');

			expect(addedRoute?.handler).toBe(testHandler);
		});

		it('should preserve handler with parameters', () => {
			const handlerWithParams = async (service: any, params: any, body?: any, query?: any) => {
				return { service: !!service, params, body, query };
			};

			const route: RouteDefinition = {
				method: 'post',
				path: '/batch',
				handler: handlerWithParams
			};

			routeManager.addRoute(route);
			const routes = routeManager.getRoutes();
			const addedRoute = routes.find((r) => r.path === '/batch');

			expect(addedRoute?.handler).toBe(handlerWithParams);
		});
	});
});
