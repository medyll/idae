import { createRouter } from '@medyll/idae-router';
import { logger } from '$lib/utils/logger.js';
import { parseLoadInUrl } from '$lib/main/router/urlParser.js';
import { machineFrameManager } from '$lib/main/frame/MachineFrameManager.js';

export interface MachineRouterConfig {
	baseUrl?: string;
	/** Enable auth guard. When true, non-public routes redirect to loginRoute if no token. */
	authEnabled?: boolean;
	loginRoute?: string;
}

interface RouteMetadata {
	title?: string;
	public?: boolean;
}

/**
 * MachineRouter — thin URL dispatcher on top of idae-router.
 *
 * Sole responsibility: catch hash URLs of shape `/+zone/modulePath/collection[/id][?vars]`
 * and delegate to machineFrameManager (which loads existing Frame or mounts a new one).
 *
 * Auth guard is kept but disabled by default — enable via `authEnabled: true` when wiring login.
 *
 * RBAC is NOT here:
 *  - Server enforces via `requireDroit` middleware (authoritative).
 *  - UI hints via `machineRights.checkAccess` (display layer).
 */
export class MachineRouter {
	private router: any = null;
	private config: Required<MachineRouterConfig>;

	constructor(config: MachineRouterConfig = {}) {
		this.config = {
			baseUrl:     config.baseUrl     || '/',
			authEnabled: config.authEnabled ?? false,
			loginRoute:  config.loginRoute  || '/login',
		};
	}

	init(): any {
		// Router outlet unused — actions delegate to machineFrameManager (Frame.svelte = real mount target).
		// In browser: provide offscreen placeholder so createRouter doesn't throw.
		// In SSR/test (no document): omit outlet entirely.
		const placeholderOutlet = typeof document !== 'undefined' ? (() => {
			const el = document.createElement('div');
			el.setAttribute('data-idae-router-placeholder', '');
			el.style.cssText = 'display:none;position:fixed;left:-9999px;';
			document.body.appendChild(el);
			return el;
		})() : undefined;

		const routes = [
			{ path: '/+*', action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: 'LoadIn' } as RouteMetadata },
		];

		this.router = createRouter({
			mode:             'hash',
			base:             this.config.baseUrl,
			linkInterception: true,
			routes,
			...(placeholderOutlet && { outlet: placeholderOutlet })
		} as any);

		this.router?.before?.((to: any, _from: any, next: any) => {
			this.handleAuthGuard(to, next);
		});

		logger.info('🧭 Machine router initialized');
		return this.router;
	}

	private async handleLoadIn(ctx: any): Promise<void> {
		const path = ctx.path ?? '';
		const segments = parseLoadInUrl(path);

		const mountFn = async (frameId: string) => {
			if (typeof document === 'undefined') return;
			const target = document.querySelector(`[data-target-zone="${frameId}"]`);
			if (!target) return;
			const { mount } = await import('svelte');
			const { default: Frame } = await import('$lib/shell/Frame.svelte');
			mount(Frame as any, { target, props: { id: frameId } });
		};

		for (const seg of segments) {
			try {
				await machineFrameManager.load(
					seg.targetId,
					seg.modulePath,
					seg.collection,
					seg.collectionId,
					seg.vars,
					mountFn
				);
			} catch (err) {
				logger.warn(`[MachineRouter] Failed to load frame: ${seg.modulePath} → ${seg.targetId}`, err);
			}
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

	navigate(path: string): void {
		this.router ? this.router.push(path) : (location.href = path);
	}

	push(path: string): void {
		this.navigate(path);
	}

	getRouter(): any { return this.router; }
}

export function createMachineRouter(config?: MachineRouterConfig): MachineRouter {
	return new MachineRouter(config);
}
