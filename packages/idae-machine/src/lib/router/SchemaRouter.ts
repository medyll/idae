import { createRouter, type RouterInstance, type Context } from '@medyll/idae-router';
import type { AppScheme } from '../main/api/types.js';
import { logger } from '../utils/logger.js';

/**
 * Route permission metadata
 */
interface RoutePermission {
	permission: 'C' | 'R' | 'U' | 'D' | 'L';
	table?: string;
}

/**
 * Router configuration
 */
interface SchemaRouterConfig {
	baseUrl?: string;
	outlet?: string;
	authEnabled?: boolean;
	loginRoute?: string;
	forbiddenRoute?: string;
}

/**
 * Schema Router - generates routes from schemas with permission guards
 */
export class SchemaRouter {
	private router: RouterInstance | null = null;
	private schemes: AppScheme[] = [];
	private config: Required<SchemaRouterConfig>;
	private permissionCheck: (permission: string, table?: string) => boolean;

	constructor(config: SchemaRouterConfig = {}) {
		this.config = {
			baseUrl: config.baseUrl || '/app',
			outlet: config.outlet || '#app',
			authEnabled: config.authEnabled ?? true,
			loginRoute: config.loginRoute || '/login',
			forbiddenRoute: config.forbiddenRoute || '/403'
		};

		// Default permission check - will be overridden
		this.permissionCheck = () => true;
	}

	/**
	 * Set permission check function
	 */
	setPermissionCheck(fn: (permission: string, table?: string) => boolean): void {
		this.permissionCheck = fn;
	}

	/**
	 * Initialize router with schemas
	 */
	init(schemes: AppScheme[]): RouterInstance {
		this.schemes = schemes;

		// Generate routes from schemas
		const routes = this.generateRoutes();

		// Create router instance
		this.router = createRouter({
			mode: 'history',
			base: this.config.baseUrl,
			outlet: this.config.outlet,
			routes,
			linkInterception: true
		});

		// Add permission guard
		this.router.beforeEach((to, _from, next) => {
			this.handlePermissionGuard(to, next);
		});

		// Add auth guard if enabled
		if (this.config.authEnabled) {
			this.router.beforeEach((to, _from, next) => {
				this.handleAuthGuard(to, next);
			});
		}

		logger.info('🧭 Schema router initialized');
		return this.router;
	}

	/**
	 * Generate routes from schemas
	 */
	private generateRoutes() {
		const routes = [];

		// Home route
		routes.push({
			path: '/',
			action: () => this.renderHome(),
			metadata: { title: 'Home' }
		});

		// Login route
		routes.push({
			path: '/login',
			action: () => this.renderLogin(),
			metadata: { title: 'Login', public: true }
		});

		// 403 Forbidden route
		routes.push({
			path: '/403',
			action: () => this.renderForbidden(),
			metadata: { title: 'Forbidden', public: true }
		});

		// Generate CRUD routes for each schema
		this.schemes.forEach((scheme) => {
			const table = scheme.code;

			// List view (L permission)
			routes.push({
				path: `/${table}`,
				action: () => this.renderList(table),
				metadata: {
					title: scheme.name,
					permission: { code: 'L', table }
				} as RoutePermission
			});

			// Create view (C permission)
			routes.push({
				path: `/${table}/new`,
				action: () => this.renderCreate(table),
				metadata: {
					title: `New ${scheme.name}`,
					permission: { code: 'C', table }
				} as RoutePermission
			});

			// Detail view (R permission)
			routes.push({
				path: `/${table}/:id`,
				action: (ctx: Context) => this.renderDetail(table, ctx.params.id),
				metadata: {
					title: scheme.name,
					permission: { code: 'R', table }
				} as RoutePermission
			});

			// Edit view (U permission)
			routes.push({
				path: `/${table}/:id/edit`,
				action: (ctx: Context) => this.renderEdit(table, ctx.params.id),
				metadata: {
					title: `Edit ${scheme.name}`,
					permission: { code: 'U', table }
				} as RoutePermission
			});
		});

		// 404 route
		routes.push({
			path: '/*',
			action: () => this.renderNotFound(),
			metadata: { title: 'Not Found' }
		});

		return routes;
	}

	/**
	 * Handle permission guard
	 */
	private handlePermissionGuard(to: Context, next: (redirect?: string) => void): void {
		const permission = to.metadata?.permission as RoutePermission | undefined;

		if (!permission) {
			next();
			return;
		}

		const hasAccess = this.permissionCheck(permission.code, permission.table);

		if (!hasAccess) {
			logger.warn(`⛔ Permission denied: ${permission.code} on ${permission.table}`);
			next(this.config.forbiddenRoute);
		} else {
			next();
		}
	}

	/**
	 * Handle auth guard
	 */
	private handleAuthGuard(to: Context, next: (redirect?: string) => void): void {
		const isPublic = to.metadata?.public === true;
		const isAuthenticated = this.checkAuthentication();

		if (!isAuthenticated && !isPublic) {
			logger.warn('⛔ Not authenticated, redirecting to login');
			next(`${this.config.loginRoute}?redirect=${encodeURIComponent(to.path)}`);
		} else {
			next();
		}
	}

	/**
	 * Check if user is authenticated
	 */
	private checkAuthentication(): boolean {
		// Check for JWT token in localStorage
		const token = localStorage.getItem('auth_token');
		return !!token;
	}

	/**
	 * Render functions - return HTML or mount components
	 */
	private renderHome(): string {
		return '<h1>Home</h1>';
	}

	private renderLogin(): string {
		return '<h1>Login</h1>';
	}

	private renderForbidden(): string {
		return '<h1>403 - Forbidden</h1><p>You do not have permission to access this resource.</p>';
	}

	private renderNotFound(): string {
		return '<h1>404 - Not Found</h1>';
	}

	private renderList(table: string): string {
		return `<h1>List: ${table}</h1>`;
	}

	private renderCreate(table: string): string {
		return `<h1>Create: ${table}</h1>`;
	}

	private renderDetail(table: string, id: string): string {
		return `<h1>Detail: ${table} / ${id}</h1>`;
	}

	private renderEdit(table: string, id: string): string {
		return `<h1>Edit: ${table} / ${id}</h1>`;
	}

	/**
	 * Navigate to a route
	 */
	navigate(path: string): void {
		if (this.router) {
			this.router.push(path);
		} else {
			location.href = path;
		}
	}

	/**
	 * Get current router instance
	 */
	getRouter(): RouterInstance | null {
		return this.router;
	}
}

/**
 * Create schema router instance
 */
export function createSchemaRouter(config?: SchemaRouterConfig): SchemaRouter {
	return new SchemaRouter(config);
}
