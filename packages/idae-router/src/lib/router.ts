import type {
	Route,
	RouterOptions,
	RouterInstance,
	Context,
	BeforeHook,
	AfterHook,
	OnLeaveHook
} from './types';
import { parseQuery, matchRouteTree } from './matcher';
import { mountResult } from './render';
import { findOutlet } from './render';
import { fetchRouteData, resolveUrl } from './fetcher.js';
import { createCacheStore, deepEqual } from './cache.js';
import type { CacheStore } from './cache.js';

/**
 * Create a new router instance and begin listening for navigation events.
 *
 * Attaches `popstate` / `hashchange` listeners and performs an initial navigation
 * to the current URL on the next microtask. Returns a `RouterInstance` with
 * imperative navigation helpers and lifecycle hook registration.
 *
 * @public
 * @param opts - Router configuration options.
 * @returns A fully initialised `RouterInstance`.
 * @since 0.1.0
 * @example
 * ```ts
 * import { createRouter } from '@medyll/idae-router';
 *
 * const router = createRouter({
 *   mode: 'history',
 *   outlet: '#app',
 *   routes: [
 *     { path: '/', action: () => '<h1>Home</h1>' },
 *     { path: '/about', action: () => '<h1>About</h1>' }
 *   ]
 * });
 *
 * router.push('/about');
 * ```
 */
export function createRouter(opts: RouterOptions = {}): RouterInstance {
	const mode = opts.mode || 'history';
	const base = (opts.base || '').replace(/\/$/, '');
	const outletEl = resolveOutlet(opts.outlet || '#app');
	const linkInterception = opts.linkInterception ?? true;

	const routes: Route[] = opts.routes || [];
	const beforeHooks: BeforeHook[] = [];
	const afterHooks: AfterHook[] = [];
	const onLeaveHooks: OnLeaveHook[] = [];

	// ── Cache initialisation ──────────────────────────────────────────────────
	const cacheEnabled = opts.cache !== false;
	const cacheOpts = cacheEnabled ? (opts.cache as import('./types').CacheOptions | undefined) : undefined;
	const cacheTtl = cacheOpts?.ttl ?? 60_000;
	const cacheStaleTime = cacheOpts?.staleTime ?? 0;
	const cacheStore: CacheStore = createCacheStore(cacheEnabled);

	function getCacheKey(route: Route, params: Record<string, string>): string | null {
		const config = route.http || route.http_source;
		if (!config) return null;
		const type = route.http ? 'internal' : 'external';
		const url = resolveUrl(config, type, params);
		return `GET ${url}`;
	}

	let currentContext: Context | null = null;
	let currentCleanups: Array<(() => void) | null> = [];

	function resolveOutlet(sel: string | Element): Element {
		if (typeof sel === 'string') {
			const el = document.querySelector(sel);
			if (!el) throw new Error(`Outlet not found: ${sel}`);
			return el;
		}
		return sel as Element;
	}

	function getPathFromLocation(): string {
		if (mode === 'hash') {
			const h = location.hash || '#/';
			return h.startsWith('#') ? h.slice(1) : h;
		}
		return location.pathname + location.search;
	}

	function buildContext(
		pathWithQuery: string,
		state?: unknown,
		metadata?: Record<string, unknown>
	): Context {
		const [pathname, search] = pathWithQuery.split('?');
		// find matched chain and merge params
		const chain = matchRouteTree(routes, pathname);
		const mergedParams: Record<string, string> = {};
		for (const rec of chain) Object.assign(mergedParams, rec.params);
		return {
			path: pathname + (search ? '?' + search : ''),
			params: mergedParams,
			query: parseQuery(search || ''),
			state,
			metadata: (chain.length ? chain[chain.length - 1].route.metadata : metadata) || metadata || {},
			matched: chain,
			data: null
		};
	}

	async function runBeforeHooks(
		to: Context,
		from: Context | null
	): Promise<{ allow: true } | { allow: false; redirect?: string }> {
		for (const hook of beforeHooks) {
			const decision = await new Promise<string | false | void>((resolve) => {
				const next = (arg?: false | string | void) =>
					resolve(arg as unknown as string | false | void);
				// allow hook to be sync or async
				Promise.resolve(hook(to, from, next)).catch(() => resolve(false));
			});
			if (decision === false) return { allow: false };
			if (typeof decision === 'string') return { allow: false, redirect: decision };
		}
		return { allow: true };
	}

	// matchRouteTree provided by matcher handles recursive route tree matching

	async function handleNavigation(pathWithQuery: string, state?: unknown) {
		const [pathname] = pathWithQuery.split('?');
		const chain = matchRouteTree(routes, pathname);
		const toContext = buildContext(pathWithQuery, state);
		const fromContext = currentContext;

		const beforeResult = await runBeforeHooks(toContext, fromContext);
		if (!beforeResult.allow) {
			if ('redirect' in beforeResult && typeof beforeResult.redirect === 'string') {
				navigate(beforeResult.redirect, undefined, false);
			}
			return;
		}

		// call onLeave for previous view and cleanup (all levels)
		if (currentCleanups && currentCleanups.length) {
			for (const fn of currentCleanups) {
				if (typeof fn === 'function') {
					try {
						fn();
					} catch (e) {
						void e;
					}
				}
			}
			currentCleanups = [];
		}
		if (fromContext) {
			for (const fn of onLeaveHooks) fn(fromContext);
		}

		if (!chain.length) {
			if (opts.notFound) {
				const res = await opts.notFound(toContext);
				if (typeof res === 'function') currentCleanups = [res as () => void];
				else {
					currentCleanups = [];
					mountResult(outletEl, res as unknown as string | Node | DocumentFragment);
				}
			}
			currentContext = toContext;
			for (const h of afterHooks) h(toContext, fromContext);
			return;
		}

		// mount matched chain parent -> child. Track per-level cleanup functions
		const newCleanups: Array<(() => void) | null> = [];
		let parentOutlet = outletEl;
		for (const rec of chain) {
			// ── SWR cache + fetch ──────────────────────────────────────────────
			let levelContext: Context;
			if (rec.route.http || rec.route.http_source) {
				const cacheKey = getCacheKey(rec.route, toContext.params);
				const hit = cacheKey ? cacheStore.get(cacheKey, cacheTtl, cacheStaleTime) : undefined;

				if (hit) {
					// Cache hit — serve immediately
					levelContext = { ...toContext, data: hit.entry.data, isRevalidating: hit.state === 'stale' };
				} else {
					// Cache miss — fetch now
					const { data, error } = await fetchRouteData(rec.route, toContext.params);
					if (cacheKey && !error) {
						cacheStore.set(cacheKey, {
							data,
							timestamp: Date.now(),
							url: cacheKey.slice(4),
							status: 200
						});
					}
					levelContext = { ...toContext, data: data ?? null, error };
				}
			} else {
				levelContext = toContext;
			}

			const action = rec.route.action;
			if (!action) continue;
			const result = await Promise.resolve(action(levelContext));
			if (typeof result === 'function') {
				newCleanups.push(result as () => void);
			} else {
				newCleanups.push(null);
				mountResult(parentOutlet, result as unknown as string | Node | DocumentFragment);
				// find child outlet inside the mounted parent content
				const childOutlet = findOutlet(parentOutlet);
				if (childOutlet) parentOutlet = childOutlet;
				// otherwise parentOutlet stays the same as fallback

				// ── Background SWR revalidation ──────────────────────────────
				if (levelContext.isRevalidating) {
					const cacheKey = getCacheKey(rec.route, toContext.params);
					const capturedOutlet = parentOutlet;
					const capturedCtx = toContext;
					const capturedAction = rec.route.action;
					const staleData = levelContext.data;
					if (cacheKey && capturedAction) {
						fetchRouteData(rec.route, capturedCtx.params)
							.then(async (fresh) => {
								if (fresh.error || deepEqual(fresh.data, staleData)) return;
								cacheStore.set(cacheKey, {
									data: fresh.data,
									timestamp: Date.now(),
									url: cacheKey.slice(4),
									status: 200
								});
								const freshCtx: Context = {
									...capturedCtx,
									data: fresh.data ?? null,
									isRevalidating: false
								};
								const freshResult = await Promise.resolve(capturedAction(freshCtx));
								if (typeof freshResult !== 'function') {
									mountResult(
										capturedOutlet,
										freshResult as unknown as string | Node | DocumentFragment
									);
								}
							})
							.catch(() => {/* ignore revalidation errors */});
					}
				}
			}
		}

		currentCleanups = newCleanups;
		currentContext = toContext;
		for (const h of afterHooks) h(toContext, fromContext);
	}

	function navigate(rawPath: string, state?: unknown, replace = false) {
		const full = applyBase(rawPath);
		if (mode === 'history') {
			if (replace) history.replaceState(state, '', full);
			else history.pushState(state, '', full);
		} else {
			if (replace) location.replace('#' + rawPath);
			else location.hash = rawPath;
		}
		handleNavigation(full, state, replace).catch((error) => {
			if (typeof error === 'object' && error instanceof Error) {
				handleError(error, full);
			} else {
				handleError(new Error(String(error)), full);
			}
		});
	}

	function handleError(error: Error, path: string) {
		if (instance.onError) {
			instance.onError(error, path);
		} else {
			console.error(`[Router] Navigation to "${path}" failed:`, error);
		}
	}

	function applyBase(path: string) {
		if (!base) return path;
		if (path.startsWith(base)) return path;
		return base + (path.startsWith('/') ? '' : '/') + path;
	}

	function onPop() {
		const p = getPathFromLocation();
		handleNavigation(p).catch((error) => {
			if (typeof error === 'object' && error instanceof Error) {
				handleError(error, p);
			} else {
				handleError(new Error(String(error)), p);
			}
		});
	}

	function setupListeners() {
		window.addEventListener(mode === 'history' ? 'popstate' : 'hashchange', onPop);
		if (linkInterception) {
			document.addEventListener('click', onLinkClick);
			if (cacheEnabled) {
				document.addEventListener('pointerenter', onPointerEnter, { capture: true });
				document.addEventListener('pointerleave', onPointerLeave, { capture: true });
			}
		}
	}

	// teardownListeners kept out for now; listeners are attached for router lifetime

	const prefetchTimers = new Map<Element, ReturnType<typeof setTimeout>>();

	function onPointerEnter(e: PointerEvent) {
		const target = e.composedPath().find((n) => (n as Element).nodeType === 1) as Element | undefined;
		if (!target) return;
		const anchor = (target as HTMLElement).closest ? (target as HTMLElement).closest('a') : null;
		if (!anchor) return;
		const a = anchor as HTMLAnchorElement;
		const href = a.getAttribute('href');
		if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
		const timer = setTimeout(() => {
			prefetchTimers.delete(anchor);
			instance.prefetch?.(href).catch(() => {/* ignore */});
		}, 200);
		prefetchTimers.set(anchor, timer);
	}

	function onPointerLeave(e: PointerEvent) {
		const target = e.composedPath().find((n) => (n as Element).nodeType === 1) as Element | undefined;
		if (!target) return;
		const anchor = (target as HTMLElement).closest ? (target as HTMLElement).closest('a') : null;
		if (!anchor) return;
		const timer = prefetchTimers.get(anchor);
		if (timer) {
			clearTimeout(timer);
			prefetchTimers.delete(anchor);
		}
	}

	function onLinkClick(e: MouseEvent) {
		if (e.defaultPrevented) return;
		if (e.button !== 0) return;
		const target = e.composedPath().find((n) => (n as Element).nodeType === 1) as
			| Element
			| undefined;
		if (!target) return;
		const anchor = (target as HTMLElement).closest ? (target as HTMLElement).closest('a') : null;
		if (!anchor) return;
		const a = anchor as HTMLAnchorElement;
		if (a.target && a.target !== '' && a.target !== '_self') return;
		if (a.hasAttribute('download')) return;
		const href = a.getAttribute('href');
		if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;
		e.preventDefault();
		navigate(href);
	}

	setupListeners();

	// initial navigation
	const instance: RouterInstance = {
		push(path: string, state?: unknown) {
			navigate(path, state, false);
		},
		replace(path: string, state?: unknown) {
			navigate(path, state, true);
		},
		refresh() {
			const p = getPathFromLocation();
			handleNavigation(p, history.state).catch((error) => {
				if (typeof error === 'object' && error instanceof Error) {
					handleError(error, p);
				} else {
					handleError(new Error(String(error)), p);
				}
			});
		},
		navigate,
		before(fn: BeforeHook) {
			beforeHooks.push(fn);
		},
		after(fn: AfterHook) {
			afterHooks.push(fn);
		},
		onLeave(fn: OnLeaveHook) {
			onLeaveHooks.push(fn);
		},
		/**
		 * Pre-fetch data for `path` and populate the cache. No navigation is triggered.
		 * A no-op when caching is disabled.
		 */
		async prefetch(path: string): Promise<void> {
			if (!cacheEnabled) return;
			const [pathname] = path.split('?');
			const chain = matchRouteTree(routes, pathname);
			for (const rec of chain) {
				if (!rec.route.http && !rec.route.http_source) continue;
				const cacheKey = getCacheKey(rec.route, rec.params);
				if (!cacheKey) continue;
				const hit = cacheStore.get(cacheKey, cacheTtl, cacheStaleTime);
				if (hit?.state === 'fresh') continue;
				const result = await fetchRouteData(rec.route, rec.params);
				if (!result.error) {
					cacheStore.set(cacheKey, {
						data: result.data ?? null,
						timestamp: Date.now(),
						url: cacheKey.slice(4),
						status: 200
					});
				}
			}
		},
		/**
		 * Invalidate cache entries. Pass a pattern (supports trailing `*` glob) or omit to clear all.
		 */
		invalidate(pattern?: string): void {
			if (!cacheEnabled) return;
			if (pattern === undefined) cacheStore.clear();
			else cacheStore.invalidate(pattern);
		},
		/**
		 * Build a URL string from a path pattern, interpolating `:param` tokens.
		 */
		buildUrl(path: string, params?: Record<string, string>): string {
			const [pathname, search] = path.split('?');
			const interpolated = params
				? pathname.replace(/:([\w]+)/g, (_, key) => params[key] ?? `:${key}`)
				: pathname;
			return interpolated + (search ? '?' + search : '');
		},
		/**
		 * Return the current navigation context (or null before first navigation).
		 */
		getState(): Context | null {
			return currentContext;
		}
	};

	setTimeout(() => {
		const p = getPathFromLocation();
		handleNavigation(p).catch((error) => {
			if (typeof error === 'object' && error instanceof Error) {
				handleError(error, p);
			} else {
				handleError(new Error(String(error)), p);
			}
		});
	}, 0);

	return instance;
}

export default createRouter;
