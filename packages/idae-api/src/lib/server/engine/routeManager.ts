//  packages\idae-api\src\lib\engine\routeManager.ts
import type { RouteDefinition } from '$lib/config/routeDefinitions';

export class RouteManager {
	private static instance: RouteManager;
	private routes: RouteDefinition[] = [];

	private constructor() {}

	public static getInstance(): RouteManager {
		if (!RouteManager.instance) {
			RouteManager.instance = new RouteManager();
		}
		return RouteManager.instance;
	}

	public addRoute(route: RouteDefinition): void {
		this.routes.push({ ...route, disabled: route.disabled || false });
	}

	public addRoutes(routes: RouteDefinition[]): void {
		routes.forEach((route) => this.addRoute(route));
	}

	public removeRoute(path: string, method: string | string[]): void {
		this.routes = this.routes.filter(
			(r) =>
				!(
					r.path === path &&
					(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
				)
		);
	}

	public getRoutes(): RouteDefinition[] {
		return this.routes.filter((route) => !route.disabled);
	}

	public enableRoute(path: string, method: string | string[]): void {
		const route = this.routes.find(
			(r) =>
				r.path === path &&
				(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
		);
		if (route) {
			route.disabled = false;
		}
	}

	public disableRoute(path: string, method: string | string[]): void {
		const route = this.routes.find(
			(r) =>
				r.path === path &&
				(Array.isArray(r.method) ? r.method.includes(method as string) : r.method === method)
		);
		if (route) {
			route.disabled = true;
		}
	}
}
