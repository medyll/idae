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
	private router: ReturnType<typeof createRouter> | null = null;
	private config: Required<MachineRouterConfig>;

	constructor(config: MachineRouterConfig = {}) {
		this.config = {
			baseUrl:     config.baseUrl     || '/',
			authEnabled: config.authEnabled ?? false,
			loginRoute:  config.loginRoute  || '/login',
		};
	}

	init() {
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{ path: '/+*', action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: 'LoadIn' } },
		];

		this.router = createRouter({
			mode:             'hash',
			base:             this.config.baseUrl,
			linkInterception: true,
			routes,
			...(placeholderOutlet && { outlet: placeholderOutlet })
		});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.router?.before?.((to: any, _from: any, next: any) => {
			this.handleAuthGuard(to, next);
		});

		logger.info('🧭 Machine router initialized');
		return this.router;
	}

	private async handleLoadIn(ctx: { path?: string }): Promise<void> {
		const path = ctx.path ?? '';
		const segments = parseLoadInUrl(path);

		for (const seg of segments) {
			// frameId is content-keyed: "modulePath:zone" — mirrors loadInDialog's "dialog:modulePath:collection:id".
			// Enables registry lookup by content, and allows sibling-hide across zone frames.
			const contentFrameId = `${seg.modulePath}:${seg.targetId}`;

			const mountFn = async (frameId: string) => {
				if (typeof document === 'undefined') return;
				// DOM zone lookup uses zone name (targetId), not the content-keyed frameId.
				const zone = frameId.slice(frameId.indexOf(':') + 1);
				const target = await this.waitForZone(zone);
				if (!target) return;
				// Zones can opt out of the taskbar via data-taskbar="false" (inner content zones).
				const taskbar = (target as HTMLElement).dataset.taskbar !== 'false';
				const { mount } = await import('svelte');
				const { default: Frame } = await import('$lib/shell/Frame.svelte');
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				mount(Frame as any, { target, props: { id: frameId, taskbar } });
			};

			try {
				await machineFrameManager.load(
					contentFrameId,
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

	/**
	 * Deep-link cold boot: the initial hash dispatch can fire before the shell
	 * (and its [data-target-zone]) is mounted — auth gating renders <App/> only
	 * after boot resolves. Wait for the zone instead of dropping the navigation.
	 * Resolves null on timeout (load then fails as before).
	 */
	private waitForZone(zone: string, timeoutMs = 15_000): Promise<Element | null> {
		const selector = `[data-target-zone="${zone}"]`;
		const existing = document.querySelector(selector);
		if (existing) return Promise.resolve(existing);
		return new Promise((resolve) => {
			const observer = new MutationObserver(() => {
				const el = document.querySelector(selector);
				if (el) {
					observer.disconnect();
					clearTimeout(timer);
					resolve(el);
				}
			});
			const timer = setTimeout(() => {
				observer.disconnect();
				resolve(null);
			}, timeoutMs);
			observer.observe(document.body, { childList: true, subtree: true });
		});
	}

	private handleAuthGuard(to: { path?: string; metadata?: Record<string, unknown> }, next: (arg?: false | string | void) => void): void {
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

	getRouter() { return this.router; }
}

export function createMachineRouter(config?: MachineRouterConfig): MachineRouter {
	return new MachineRouter(config);
}
