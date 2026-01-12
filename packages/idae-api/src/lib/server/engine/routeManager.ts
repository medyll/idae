//  packages\idae-api\src\lib\engine\routeManager.ts
import type { RouteDefinition } from "$lib/config/routeDefinitions.js";

export class RouteManager {
  private static instance: RouteManager;
  private routes: RouteDefinition[] = [];

  private constructor() {}

  public static getInstance(): RouteManager {
    const instance = RouteManager.instance ?? new RouteManager();

    // In test runs we want isolated state between cases
    if (process.env.NODE_ENV === "test") {
      instance.clearRoutes();
    }

    RouteManager.instance = instance;
    return instance;
  }

  public addRoute(route: RouteDefinition): void {
    // Remove any existing route with the same path/method to avoid stale handlers
    this.routes = this.routes.filter(
      (r) =>
        r.path !== route.path ||
        (Array.isArray(r.method)
          ? !Array.isArray(route.method) || !route.method.some((m) => r.method.includes(m))
          : Array.isArray(route.method)
            ? !route.method.includes(r.method as string)
            : r.method !== route.method),
    );

    this.routes.push({ ...route, disabled: route.disabled || false });
  }

  public addRoutes(routes: RouteDefinition[]): void {
    routes.forEach((route) => this.addRoute(route));
  }

  public getRoutes(): RouteDefinition[] {
    return this.routes.filter((route) => !route.disabled);
  }

  public enableRoute(path: string, method: string | string[]): void {
    this.routes.forEach((r) => {
      if (
        r.path === path &&
        (Array.isArray(r.method)
          ? r.method.includes(method as string)
          : r.method === method)
      ) {
        r.disabled = false;
      }
    });
  }

  public disableRoute(path: string, method: string | string[]): void {
    this.routes.forEach((r) => {
      if (
        r.path === path &&
        (Array.isArray(r.method)
          ? r.method.includes(method as string)
          : r.method === method)
      ) {
        r.disabled = true;
      }
    });
  }

  // Utility primarily for tests to reset state safely
  public clearRoutes(): void {
    this.routes = [];
  }
}
