import { createRouter } from '@medyll/idae-router';
import { logger } from '$lib/utils/logger.js';
import { parseLoadInUrl, type LoadInSegment } from '$lib/main/router/urlParser.js';
import { buildLoadInUrl } from '$lib/main/frame/frameUrl.js';
import {
	machineFrameManager,
	type DialogNavigationEvent,
	type NavigationEvent
} from '$lib/main/frame/MachineFrameManager.js';
import type { RegistryKey } from '$lib/main/router/componentRegistry.js';

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
	private pushedRoutes = new Set<string>();
	private routedDialogIds = new Set<string>();
	private dialogReturnPaths = new Map<string, string>();
	private dialogOptions = new Map<
		string,
		Pick<DialogNavigationEvent, 'modal' | 'closable' | 'draggable' | 'fullscreen'>
	>();

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
			{ path: '/*', action: (ctx: any) => this.handleLoadIn(ctx), metadata: { title: 'LoadIn' } },
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
		const desiredDialogIds = new Set(
			segments
				.filter((seg) => seg.targetId === 'dialog')
				.map((seg) => this.dialogFrameId(seg.modulePath, seg.collection, seg.collectionId))
		);

		for (const frameId of this.routedDialogIds) {
			if (desiredDialogIds.has(frameId)) continue;
			if (machineFrameManager.has(frameId)) {
				machineFrameManager.close(frameId, { history: false });
			}
			this.routedDialogIds.delete(frameId);
		}

		for (const seg of segments) {
			if (seg.targetId === 'dialog') {
				const frameId = this.dialogFrameId(seg.modulePath, seg.collection, seg.collectionId);
				const dialogOptions = this.dialogOptions.get(frameId);
				await machineFrameManager.loadInDialog(
					seg.modulePath as RegistryKey,
					seg.collection,
					seg.collectionId,
					{ vars: seg.vars, history: false, ...dialogOptions }
				);
				this.routedDialogIds.add(frameId);
				continue;
			}
			await this.mountZoneFrame(seg);
		}
	}

	/** Mount a frame without changing the URL (framer history:false). */
	openFrame(event: NavigationEvent): void {
		void this.mountZoneFrame({
			targetId: event.zone,
			modulePath: event.modulePath,
			collection: event.collection,
			collectionId: event.collectionId === undefined ? undefined : String(event.collectionId),
			vars: event.vars
		});
	}

	private async mountZoneFrame(seg: LoadInSegment): Promise<void> {
		// frameId is content-keyed: "modulePath:zone" — mirrors dialog frame ids.
		const contentFrameId = `${seg.modulePath}:${seg.targetId}`;
		const mountFn = async (frameId: string) => {
			if (typeof document === 'undefined') return;
			const zone = frameId.slice(frameId.indexOf(':') + 1);
			const target = await this.waitForZone(zone);
			if (!target) return;
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
		this.pushedRoutes.add(path);
		this.router ? this.router.push(path) : (location.href = path);
	}

	push(path: string): void {
		this.navigate(path);
	}

	/** Add a business dialog to the current routed state. */
	openDialog(event: DialogNavigationEvent): void {
		if (typeof window === 'undefined') return;
		const currentPath = window.location.hash.replace(/^#/, '') || '/';
		const frameId = this.dialogFrameId(event.modulePath, event.collection, event.collectionId);
		const alreadyPresent = parseLoadInUrl(currentPath).some(
			(seg) => seg.targetId === 'dialog'
				&& this.dialogFrameId(seg.modulePath, seg.collection, seg.collectionId) === frameId
		);
		if (alreadyPresent) return;

		this.dialogReturnPaths.set(frameId, currentPath);
		this.dialogOptions.set(frameId, {
			modal: event.modal,
			closable: event.closable,
			draggable: event.draggable,
			fullscreen: event.fullscreen
		});
		const basePath = currentPath.split('?')[0].replace(/\/$/, '');
		const vars = event.vars && Object.keys(event.vars).length > 0
			? new URLSearchParams(event.vars).toString()
			: undefined;
		const dialogPath = buildLoadInUrl(
			event.modulePath,
			'dialog',
			event.collection,
			event.collectionId,
			vars
		);
		this.push(`${basePath === '' ? '' : basePath}${dialogPath}`);
	}

	/**
	 * Keep browser history aligned when a routed zone frame closes.
	 * Routes pushed inside the app can safely go back. A cold deep-link only goes
	 * back when its referrer is same-origin; otherwise the frame hash is removed
	 * in place so closing never sends the user back to another site.
	 */
	closeFrame(frameId: string): void {
		if (typeof window === 'undefined') return;
		const path = window.location.hash.replace(/^#/, '');
		const segments = parseLoadInUrl(path);
		const isCurrentFrame = segments.some(
			(seg) => `${seg.modulePath}:${seg.targetId}` === frameId
				|| (seg.targetId === 'dialog'
					&& this.dialogFrameId(seg.modulePath, seg.collection, seg.collectionId) === frameId)
		);
		if (!isCurrentFrame) return;

		if (frameId.startsWith('dialog:')) {
			const returnPath = this.dialogReturnPaths.get(frameId);
			this.dialogReturnPaths.delete(frameId);
			if (returnPath) {
				this.push(returnPath);
				return;
			}

			const remaining = segments.filter(
				(seg) => this.dialogFrameId(seg.modulePath, seg.collection, seg.collectionId) !== frameId
			);
			const remainingPath = remaining.map((seg, index) => {
				const isLast = index === remaining.length - 1;
				const vars = isLast && seg.vars
					? new URLSearchParams(seg.vars).toString()
					: undefined;
				return buildLoadInUrl(seg.modulePath, seg.targetId, seg.collection, seg.collectionId, vars);
			}).join('');
			this.push(remainingPath || '/');
			return;
		}

		let sameOriginReferrer = false;
		if (document.referrer) {
			try {
				sameOriginReferrer = new URL(document.referrer).origin === window.location.origin;
			} catch {
				sameOriginReferrer = false;
			}
		}

		if (this.pushedRoutes.has(path) || sameOriginReferrer) {
			window.history.back();
			return;
		}

		window.history.replaceState(
			window.history.state,
			'',
			`${window.location.pathname}${window.location.search}`
		);
	}

	getRouter() { return this.router; }

	private dialogFrameId(modulePath: string, collection: string, collectionId?: string | number): string {
		return `dialog:${modulePath}:${collection}:${collectionId ?? ''}`;
	}
}

export function createMachineRouter(config?: MachineRouterConfig): MachineRouter {
	return new MachineRouter(config);
}
