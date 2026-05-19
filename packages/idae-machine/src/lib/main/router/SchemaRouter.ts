import { createRouter } from '@medyll/idae-router';
import { logger } from '$lib/utils/logger.js';

export interface RoutePermission {
	permission: 'C' | 'R' | 'U' | 'D' | 'L';
	table?: string;
}

export interface SchemaRouterConfig {
	baseUrl?:        string;
	outlet?:         string;
	authEnabled?:    boolean;
	loginRoute?:     string;
	forbiddenRoute?: string;
}

interface RouteMetadata {
	title?:      string;
	public?:     boolean;
	permission?: { code: string; table?: string };
}

export class SchemaRouter {
	private router: any = null;
	private schemes: any[] = [];
	private config: Required<SchemaRouterConfig>;
	private permissionCheck: (permission: string, table?: string) => boolean;

	constructor(config: SchemaRouterConfig = {}) {
		this.config = {
			baseUrl:        config.baseUrl        || '/app',
			outlet:         config.outlet         || '#app',
			authEnabled:    config.authEnabled     ?? true,
			loginRoute:     config.loginRoute     || '/login',
			forbiddenRoute: config.forbiddenRoute || '/403'
		};
		this.permissionCheck = () => true;
	}

	setPermissionCheck(fn: (permission: string, table?: string) => boolean): void {
		this.permissionCheck = fn;
	}

	init(schemes: any[]): any {
		this.schemes = schemes;
		const routes = this.generateRoutes();

		this.router = createRouter({
			mode:             'history',
			base:             this.config.baseUrl,
			outlet:           this.config.outlet,
			routes,
			linkInterception: true
		} as any);

		this.router?.beforeEach?.((to: any, _from: any, next: any) => {
			this.handlePermissionGuard(to, next);
		});

		if (this.config.authEnabled) {
			this.router?.beforeEach?.((to: any, _from: any, next: any) => {
				this.handleAuthGuard(to, next);
			});
		}

		logger.info('🧭 Schema router initialized');
		return this.router;
	}

	private generateRoutes() {
		const routes: any[] = [];

		routes.push({ path: '/',      action: () => this.renderHome(),      metadata: { title: 'Home' } as RouteMetadata });
		routes.push({ path: '/login', action: () => this.renderLogin(),     metadata: { title: 'Login', public: true } as RouteMetadata });
		routes.push({ path: '/403',   action: () => this.renderForbidden(), metadata: { title: 'Forbidden', public: true } as RouteMetadata });

		this.schemes.forEach((scheme: any) => {
			const table = scheme.code ?? scheme.collection ?? String(scheme);

			routes.push({ path: `/${table}`,          action: () => this.renderList(table),           metadata: { title: table,              permission: { code: 'L', table } } as RouteMetadata });
			routes.push({ path: `/${table}/new`,       action: () => this.renderCreate(table),         metadata: { title: `New ${table}`,     permission: { code: 'C', table } } as RouteMetadata });
			routes.push({ path: `/${table}/:id`,       action: (ctx: any) => this.renderDetail(table, ctx?.params?.id), metadata: { title: table, permission: { code: 'R', table } } as RouteMetadata });
			routes.push({ path: `/${table}/:id/edit`,  action: (ctx: any) => this.renderEdit(table, ctx?.params?.id),   metadata: { title: `Edit ${table}`, permission: { code: 'U', table } } as RouteMetadata });
		});

		routes.push({ path: '/*', action: () => this.renderNotFound(), metadata: { title: 'Not Found' } as RouteMetadata });
		return routes;
	}

	private handlePermissionGuard(to: any, next: (redirect?: string) => void): void {
		const meta = to.metadata as RouteMetadata | undefined;
		if (!meta?.permission) { next(); return; }
		const { code, table } = meta.permission;
		if (!this.permissionCheck(code, table)) {
			logger.warn(`⛔ Permission denied: ${code} on ${table}`);
			next(this.config.forbiddenRoute);
		} else {
			next();
		}
	}

	private handleAuthGuard(to: any, next: (redirect?: string) => void): void {
		const meta = to.metadata as RouteMetadata | undefined;
		if (!meta?.public && !this.checkAuthentication()) {
			logger.warn('⛔ Not authenticated, redirecting to login');
			next(`${this.config.loginRoute}?redirect=${encodeURIComponent(to.path ?? '')}`);
		} else {
			next();
		}
	}

	private checkAuthentication(): boolean {
		return !!localStorage?.getItem?.('auth_token');
	}

	private renderHome():              string { return '<h1>Home</h1>'; }
	private renderLogin():             string { return '<h1>Login</h1>'; }
	private renderForbidden():         string { return '<h1>403 - Forbidden</h1>'; }
	private renderNotFound():          string { return '<h1>404 - Not Found</h1>'; }
	private renderList(t: string):     string { return `<h1>List: ${t}</h1>`; }
	private renderCreate(t: string):   string { return `<h1>Create: ${t}</h1>`; }
	private renderDetail(t: string, id: string): string { return `<h1>Detail: ${t}/${id}</h1>`; }
	private renderEdit(t: string, id: string):   string { return `<h1>Edit: ${t}/${id}</h1>`; }

	navigate(path: string): void {
		this.router ? this.router.push(path) : (location.href = path);
	}

	push(path: string): void {
		this.navigate(path);
	}

	getRouter(): any { return this.router; }
}

export function createSchemaRouter(config?: SchemaRouterConfig): SchemaRouter {
	return new SchemaRouter(config);
}
