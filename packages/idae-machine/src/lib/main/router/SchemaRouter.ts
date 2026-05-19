import { createRouter } from '@medyll/idae-router';
import { mount, unmount, type SvelteComponent } from 'svelte';
import { logger } from '$lib/utils/logger.js';
import { componentRegistry } from '$lib/main/router/componentRegistry.js';
import { parseLoadInUrl, type LoadInSegment } from '$lib/main/router/urlParser.js';
import { machine } from '$lib/main/machine.js';

export interface RoutePermission {
	permission: 'C' | 'R' | 'U' | 'D' | 'L';
	table?: string;
}

export interface SchemaRouterConfig {
	baseUrl?: string;
	authEnabled?: boolean;
	loginRoute?: string;
	forbiddenRoute?: string;
}

interface RouteMetadata {
	title?: string;
	public?: boolean;
	permission?: { code: string; table?: string };
}

interface MountedComponent {
	component: typeof SvelteComponent;
	target: Element;
	app: Record<string, unknown>;
}

export class SchemaRouter {
	private router: any = null;
	private schemes: any[] = [];
	private config: Required<SchemaRouterConfig>;
	private permissionCheck: (permission: string, table?: string) => boolean;
	private mountedComponents: Map<string, MountedComponent[]> = new Map();

	constructor(config: SchemaRouterConfig = {}) {
		this.config = {
			baseUrl:        config.baseUrl        || '/',
			authEnabled:    config.authEnabled     ?? false,
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
			linkInterception: true,
			routes,
			notFound:         () => this.renderNotFound()
		} as any);

		this.router?.before?.((to: any, _from: any, next: any) => {
			this.handleAuthGuard(to, next);
		});

		this.router?.before?.((to: any, _from: any, next: any) => {
			this.handlePermissionGuard(to, next);
		});

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

			routes.push({ path: `/${table}`,          action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: table,              permission: { code: 'L', table } } as RouteMetadata });
			routes.push({ path: `/${table}/new`,       action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: `New ${table}`,     permission: { code: 'C', table } } as RouteMetadata });
			routes.push({ path: `/${table}/:id`,       action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: table,              permission: { code: 'R', table } } as RouteMetadata });
			routes.push({ path: `/${table}/:id/edit`,  action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: `Edit ${table}`,    permission: { code: 'U', table } } as RouteMetadata });
		});

		routes.push({ path: '/+*', action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: 'LoadIn' } as RouteMetadata });

		return routes;
	}

	private async handleLoadIn(ctx: any): Promise<void> {
		const path = ctx.path ?? '';
		const segments = parseLoadInUrl(path);

		const cleanups: (() => void)[] = [];

		for (const seg of segments) {
			try {
				const Comp = await componentRegistry.resolve(seg.modulePath);
				const target = document.querySelector(`[data-target-zone="${seg.targetId}"]`);
				if (!target) continue;

				const props: Record<string, unknown> = {
					collection: seg.collection,
					dataId: seg.collectionId
				};

				if (seg.modulePath.startsWith('explorer.')) {
					props.onclick = (record: Record<string, unknown>) => {
						const recordId = (record as any)?.id ?? (record as any)?._id;
						const detailPath = seg.modulePath === 'explorer.list' ? 'explorer.split' : 'card.edit';
						machine.loadIn(detailPath, seg.targetId, seg.collection, recordId);
					};
				}

				const app = mount(Comp as typeof SvelteComponent, {
					target,
					props
				});

				const cleanup = () => unmount(app);
				cleanups.push(cleanup);

				const existing = this.mountedComponents.get(seg.targetId) ?? [];
				existing.push({ component: Comp, target, app });
				this.mountedComponents.set(seg.targetId, existing);
			} catch {
				logger.warn(`[SchemaRouter] Failed to resolve component: ${seg.modulePath}`);
			}
		}

		if (cleanups.length > 0) {
			ctx.onLeave?.(() => cleanups.forEach(fn => fn()));
		}
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
		if (!this.config.authEnabled) { next(); return; }
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

	private renderHome(): string { return '<h1>Home</h1>'; }
	private renderLogin(): string { return '<h1>Login</h1>'; }
	private renderForbidden(): string { return '<h1>403 - Forbidden</h1>'; }
	private renderNotFound(): string { return '<h1>404 - Not Found</h1>'; }

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
