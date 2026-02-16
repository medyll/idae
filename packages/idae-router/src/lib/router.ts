import type {
	Route,
	RouterOptions,
	RouterInstance,
	Context,
	BeforeHook,
	AfterHook,
	OnLeaveHook
} from './types';
import { compilePath, matchCompiled, parseQuery } from './matcher';
import { mountResult } from './render';

export function createRouter(opts: RouterOptions = {}): RouterInstance {
	const mode = opts.mode || 'history';
	const base = (opts.base || '').replace(/\/$/, '');
	const outletEl = resolveOutlet(opts.outlet || '#app');
	const linkInterception = opts.linkInterception ?? true;

	const routes: Route[] = opts.routes || [];
	const beforeHooks: BeforeHook[] = [];
	const afterHooks: AfterHook[] = [];
	const onLeaveHooks: OnLeaveHook[] = [];

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
		const chain = findRouteChain(routes, pathname);
		const mergedParams: Record<string, string> = {};
		for (const rec of chain) Object.assign(mergedParams, rec.params);
		return {
			path: pathname + (search ? '?' + search : ''),
			params: mergedParams,
			query: parseQuery(search || ''),
			state,
			metadata: (chain.length ? chain[chain.length - 1].route.metadata : metadata) || metadata || {},
			matched: chain
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

	// helper: join parent and child path pieces
	function joinPaths(parent: string, child: string) {
		if (!parent) return child.startsWith('/') ? child : '/' + child;
		if (child.startsWith('/')) return child;
		return (parent.replace(/\/$/, '') + '/' + child).replace(/\/+/g, '/');
	}

	// recursively attempt to match a route tree against the pathname
	function findRouteChain(rs: Route[], pathname: string, parentPrefix = ''): Array<{ route: Route; params: Record<string, string>; path: string }> {
		for (const r of rs) {
			const fullPath = r.path.startsWith('/') ? r.path : joinPaths(parentPrefix || '', r.path);
			const compiled = compilePath(fullPath);
			const params = matchCompiled(compiled, pathname);
			// if exact match found (leaf)
			if (params) {
				const record = { route: r, params, path: fullPath };
				if (r.children && r.children.length) {
					const childChain = findRouteChain(r.children, pathname, fullPath);
					if (childChain.length) return [record, ...childChain];
				}
				return [record];
			}
			// if no exact match, but there are children, check prefix match so parent can match a portion
			if (r.children && r.children.length) {
				const src = compiled.regex.source.replace(/\$$/, '');
				const prefixRe = new RegExp(src + '(?:/|$)');
				const m = prefixRe.exec(pathname);
				if (m) {
					// extract params for the prefix match
					const params: Record<string, string> = {};
					for (let i = 1; i < m.length; i++) {
						const key = compiled.keys[i - 1] || String(i - 1);
						params[key] = decodeURIComponent(m[i] || '');
					}
					const record = { route: r, params, path: fullPath };
					const childChain = findRouteChain(r.children, pathname, fullPath);
					if (childChain.length) return [record, ...childChain];
					// no child matched, but parent matched as prefix: return parent
					return [record];
				}
			}
		}
		return [];
	}

	async function handleNavigation(pathWithQuery: string, state?: unknown) {
		const [pathname] = pathWithQuery.split('?');
		const chain = findRouteChain(routes, pathname);
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
			const action = rec.route.action;
			const result = await Promise.resolve(action(toContext));
			if (typeof result === 'function') {
				newCleanups.push(result as () => void);
			} else {
				newCleanups.push(null);
				mountResult(parentOutlet, result as unknown as string | Node | DocumentFragment);
				// find child outlet inside the mounted parent content
				const childOutlet = parentOutlet.querySelector('[data-idae-outlet]') as Element | null;
				if (childOutlet) parentOutlet = childOutlet;
				// otherwise parentOutlet stays the same as fallback
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
		handleNavigation(full, state, replace).catch(() => {});
	}

	function applyBase(path: string) {
		if (!base) return path;
		if (path.startsWith(base)) return path;
		return base + (path.startsWith('/') ? '' : '/') + path;
	}

	function onPop() {
		const p = getPathFromLocation();
		handleNavigation(p).catch(() => {});
	}

	function setupListeners() {
		window.addEventListener(mode === 'history' ? 'popstate' : 'hashchange', onPop);
		if (linkInterception) {
			document.addEventListener('click', onLinkClick);
		}
	}

	// teardownListeners kept out for now; listeners are attached for router lifetime

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
	setTimeout(() => {
		const p = getPathFromLocation();
		handleNavigation(p).catch(() => {});
	}, 0);

	return {
		push(path: string, state?: unknown) {
			navigate(path, state, false);
		},
		replace(path: string, state?: unknown) {
			navigate(path, state, true);
		},
		refresh() {
			const p = getPathFromLocation();
			handleNavigation(p, history.state).catch(() => {});
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
		}
	} as RouterInstance;
}

export default createRouter;
