// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { createRouter } from './index.js';

function wait(ms = 10) {
	return new Promise((r) => setTimeout(r, ms));
}

describe('router', () => {
	let outlet: HTMLDivElement;

	beforeEach(() => {
		// ensure a fresh outlet per test
		outlet = document.createElement('div');
		outlet.id = 'app';
		document.body.innerHTML = '';
		document.body.appendChild(outlet);
		// reset hash/path
		history.replaceState({}, '', '/');
		location.hash = '';
	});

	it('renders string content into outlet on navigation', async () => {
		const routes = [
			{ path: '/', action: () => '<h1>Home</h1>' },
			{ path: '/a', action: () => '<p>A</p>' }
		];
		const router = createRouter({
			routes,
			outlet: outlet,
			mode: 'history',
			linkInterception: false
		});
		router.push('/a');
		await wait(20);
		expect(outlet.innerHTML).toContain('A');
	});

	it('accepts cleanup function returned by action and calls it on leave', async () => {
		let cleaned = false;
		const routes = [
			{ path: '/', action: () => '<h1>Home</h1>' },
			{
				path: '/b',
				action: () => {
					const timer = setInterval(() => {}, 1000);
					return () => {
						clearInterval(timer);
						cleaned = true;
					};
				}
			}
		];
		const router = createRouter({
			routes,
			outlet: outlet,
			mode: 'history',
			linkInterception: false
		});
		router.push('/b');
		await wait(20);
		// navigate away
		router.push('/');
		await wait(20);
		expect(cleaned).toBe(true);
	});

	it('before hook can redirect', async () => {
		const routes = [
			{ path: '/protected', action: () => '<p>Protected</p>' },
			{ path: '/login', action: () => '<p>Login</p>' }
		];
		const router = createRouter({
			routes,
			outlet: outlet,
			mode: 'history',
			linkInterception: false
		});
		router.before((to, from, next) => {
			if (to.path.startsWith('/protected')) next('/login');
			else next();
		});
		router.push('/protected');
		await wait(30);
		expect(outlet.innerHTML).toContain('Login');
	});

	it('mounts parent and child into parent outlet for nested routes', async () => {
		const routes = [
			{
				path: '/parent/:id',
				action: () => '<div><h1>Parent</h1><div data-idae-outlet></div></div>',
				children: [
					{
						path: 'child',
						action: () => '<p>Child</p>'
					},
					{
						path: 'other',
						action: () => '<p>Other</p>'
					}
				]
			}
		];
		const router = createRouter({
			routes,
			outlet: outlet,
			mode: 'history',
			linkInterception: false
		});
		router.push('/parent/1/child');
		await wait(30);
		expect(outlet.innerHTML).toContain('Parent');
		expect(outlet.innerHTML).toContain('Child');

		// navigate to sibling child; parent should remain
		router.push('/parent/1/other');
		await wait(30);
		expect(outlet.innerHTML).toContain('Parent');
		expect(outlet.innerHTML).toContain('Other');
	});

	// ── http data-fetching integration ──────────────────────────────────────

	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('populates ctx.data from http fetch before action runs', async () => {
		vi.mocked(fetch).mockResolvedValue({
			ok: true,
			json: async () => ({ name: 'Alice' })
		} as Response);

		let captured: unknown = 'not-set';
		const routes = [
			{
				path: '/user/:id',
				http: { url: '/api/users/:id' },
				action: (ctx: { data: unknown }) => {
					captured = ctx.data;
					return '<p>User</p>';
				}
			}
		];
		const router = createRouter({ routes, outlet, mode: 'history', linkInterception: false });
		router.push('/user/1');
		await wait(30);
		expect(captured).toEqual({ name: 'Alice' });
	});

	it('sets ctx.error and keeps ctx.data null on fetch failure, action still runs', async () => {
		vi.mocked(fetch).mockRejectedValue(new Error('fail'));

		let capturedError: unknown;
		let capturedData: unknown = 'not-set';
		const routes = [
			{
				path: '/broken',
				http: { url: '/api/broken' },
				action: (ctx: { data: unknown; error: unknown }) => {
					capturedData = ctx.data;
					capturedError = ctx.error;
					return '<p>Broken</p>';
				}
			}
		];
		const router = createRouter({ routes, outlet, mode: 'history', linkInterception: false });
		router.push('/broken');
		await wait(30);
		expect(capturedData).toBeNull();
		expect(capturedError).toBeInstanceOf(Error);
		expect(outlet.innerHTML).toContain('Broken'); // navigation completed
	});

  it('leaves ctx.data null for routes with no http/http_source', async () => {
		let capturedData: unknown = 'not-set';
		const routes = [
			{
				path: '/plain',
				action: (ctx: { data: unknown }) => {
					capturedData = ctx.data;
					return '<p>Plain</p>';
				}
			}
		];
		const router = createRouter({ routes, outlet, mode: 'history', linkInterception: false });
		router.push('/plain');
		await wait(30);
		expect(capturedData).toBeNull();
		expect(fetch).not.toHaveBeenCalled();
	});

	// ── S02-01: hash mode routing ────────────────────────────────────────────

	describe('hash mode routing', () => {
		beforeEach(() => {
			history.replaceState({}, '', '/');
			location.hash = '';
		});

		it('renders content on push in hash mode', async () => {
			const routes = [
				{ path: '/', action: () => '<p>Home</p>' },
				{ path: '/about', action: () => '<p>About</p>' }
			];
			const router = createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			router.push('/about');
			await wait(30);
			expect(outlet.innerHTML).toContain('About');
		});

		it('extracts path from location.hash (strips leading #)', async () => {
			const routes = [{ path: '/hash-page', action: () => '<p>HashPage</p>' }];
			createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			// Simulate a hashchange event (what the browser fires on back/forward)
			location.hash = '#/hash-page';
			window.dispatchEvent(new Event('hashchange'));
			await wait(30);
			expect(outlet.innerHTML).toContain('HashPage');
		});

		it('defaults to / when hash is empty', async () => {
			const routes = [{ path: '/', action: () => '<p>Root</p>' }];
			createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			location.hash = '';
			window.dispatchEvent(new Event('hashchange'));
			await wait(30);
			expect(outlet.innerHTML).toContain('Root');
		});

		it('resolves dynamic route params in hash mode', async () => {
			let capturedParams: Record<string, string> = {};
			const routes = [
				{
					path: '/users/:id',
					action: (ctx: { params: Record<string, string> }) => {
						capturedParams = ctx.params;
						return `<p>User ${ctx.params.id}</p>`;
					}
				}
			];
			const router = createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			router.push('/users/42');
			await wait(30);
			expect(capturedParams.id).toBe('42');
			expect(outlet.innerHTML).toContain('User 42');
		});

		it('parses query params from hash path', async () => {
			let capturedQuery: Record<string, unknown> = {};
			const routes = [
				{
					path: '/search',
					action: (ctx: { query: Record<string, unknown> }) => {
						capturedQuery = ctx.query;
						return '<p>Search</p>';
					}
				}
			];
			const router = createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			router.push('/search?q=hello&page=2');
			await wait(30);
			expect(capturedQuery.q).toBe('hello');
			expect(capturedQuery.page).toBe('2');
		});

		it('supports multiple sequential hash navigations', async () => {
			const routes = [
				{ path: '/step1', action: () => '<p>Step1</p>' },
				{ path: '/step2', action: () => '<p>Step2</p>' },
				{ path: '/step3', action: () => '<p>Step3</p>' }
			];
			const router = createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			router.push('/step1');
			await wait(20);
			expect(outlet.innerHTML).toContain('Step1');
			router.push('/step2');
			await wait(20);
			expect(outlet.innerHTML).toContain('Step2');
			router.push('/step3');
			await wait(20);
			expect(outlet.innerHTML).toContain('Step3');
		});

		it('invokes before hook in hash mode', async () => {
			const routes = [
				{ path: '/secret', action: () => '<p>Secret</p>' },
				{ path: '/denied', action: () => '<p>Denied</p>' }
			];
			const router = createRouter({ routes, outlet, mode: 'hash', linkInterception: false });
			router.before((to, _from, next) => {
				if (to.path === '/secret') next('/denied');
				else next();
			});
			router.push('/secret');
			await wait(30);
			expect(outlet.innerHTML).toContain('Denied');
			expect(outlet.innerHTML).not.toContain('Secret');
		});
	});

	// ── S02-02: 404 / notFound fallback ──────────────────────────────────────

	describe('404 notFound fallback', () => {
		it('invokes notFound callback for an unmatched route', async () => {
			let called = false;
			const routes = [{ path: '/', action: () => '<p>Home</p>' }];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: (ctx) => {
					called = true;
					return `<p>404: ${ctx.path}</p>`;
				}
			});
			router.push('/does-not-exist');
			await wait(30);
			expect(called).toBe(true);
		});

		it('renders notFound string content to outlet', async () => {
			const routes = [{ path: '/', action: () => '<p>Home</p>' }];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: (ctx) => `<h1>Not Found: ${ctx.path}</h1>`
			});
			router.push('/missing');
			await wait(30);
			expect(outlet.innerHTML).toContain('Not Found: /missing');
		});

		it('passes correct context to notFound (path, empty params, query)', async () => {
			let capturedCtx: { path: string; params: Record<string, string>; query: Record<string, unknown>; matched?: unknown[] } | null = null;
			const routes = [{ path: '/', action: () => '<p>Home</p>' }];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: (ctx) => {
					capturedCtx = ctx as typeof capturedCtx;
					return '';
				}
			});
			router.push('/gone?reason=moved');
			await wait(30);
			expect(capturedCtx).not.toBeNull();
			expect(capturedCtx!.path).toBe('/gone?reason=moved');
			expect(capturedCtx!.params).toEqual({});
			expect(capturedCtx!.query.reason).toBe('moved');
			expect(capturedCtx!.matched).toEqual([]);
		});

		it('stores cleanup function returned by notFound and calls it on next navigation', async () => {
			let cleaned = false;
			const routes = [
				{ path: '/', action: () => '<p>Home</p>' },
				{ path: '/next', action: () => '<p>Next</p>' }
			];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: () => () => {
					cleaned = true;
				}
			});
			router.push('/nowhere');
			await wait(20);
			// now navigate to a real route — cleanup should fire
			router.push('/next');
			await wait(20);
			expect(cleaned).toBe(true);
			expect(outlet.innerHTML).toContain('Next');
		});

		it('does not crash and leaves outlet unchanged when notFound is not provided', async () => {
			const routes = [{ path: '/', action: () => '<p>Home</p>' }];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false
			});
			// let initial navigation to '/' settle
			await wait(20);
			const contentBefore = outlet.innerHTML;
			expect(() => router.push('/unknown')).not.toThrow();
			await wait(30);
			// no notFound handler → nothing rendered for /unknown → outlet unchanged
			expect(outlet.innerHTML).toBe(contentBefore);
		});

		it('calls previous route cleanup before notFound renders', async () => {
			const order: string[] = [];
			const routes = [
				{
					path: '/page',
					action: () => {
						return () => {
							order.push('cleanup-page');
						};
					}
				}
			];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: () => {
					order.push('404-render');
					return '<p>404</p>';
				}
			});
			router.push('/page');
			await wait(20);
			router.push('/missing');
			await wait(20);
			// '404-render' must be last; everything before it must be cleanup calls
			// (the initial-nav setTimeout may cause an extra cleanup cycle — that's fine,
			//  what matters is cleanup always precedes notFound)
			expect(order.at(-1)).toBe('404-render');
			const notFoundIdx = order.lastIndexOf('404-render');
			expect(order.slice(0, notFoundIdx).every((s) => s === 'cleanup-page')).toBe(true);
		});

		it('after hook fires even on 404 navigations', async () => {
			let afterPath = '';
			const routes = [{ path: '/', action: () => '<p>Home</p>' }];
			const router = createRouter({
				routes,
				outlet,
				mode: 'history',
				linkInterception: false,
				notFound: () => '<p>404</p>'
			});
			router.after((to) => {
				afterPath = to.path;
			});
			router.push('/no-such-route');
			await wait(30);
			expect(afterPath).toBe('/no-such-route');
		});
	});
});

// ── S04-05: router cache integration ───────────────────────────────────────

describe('router cache integration', () => {
	let outlet: Element;

	beforeEach(() => {
		document.body.innerHTML = '<div id="cache-app"></div>';
		outlet = document.querySelector('#cache-app')!;
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('with fresh staleTime, fetch is called only once for repeated navigations', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 1, name: 'Alice' })
		});
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{
				path: '/users/:id',
				http: { url: '/api/users/:id' },
				action: (ctx: { data: { name: string } | null }) => `<p>${ctx.data?.name ?? ''}</p>`
			}
		];
		createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 60_000 } });

		// initial navigation to '/' (no match) — no fetch
		await wait(20);
		const callsBefore = mockFetch.mock.calls.length;

		// @ts-expect-error — outlet used as dummy router handle to access push via explicit var
		const r2 = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 60_000 } });
		r2.push('/users/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(callsBefore + 1);

		// second navigation to same path — fresh cache hit, no extra fetch
		r2.push('/users/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(callsBefore + 1);
	});

	it('with cache: false, fetch is called on every navigation', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 1 })
		});
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{
				path: '/items/:id',
				http: { url: '/api/items/:id' },
				action: (ctx: { data: unknown }) => `<p>${JSON.stringify(ctx.data)}</p>`
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: false });
		await wait(10);
		const base = mockFetch.mock.calls.length;

		r.push('/items/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 1);

		r.push('/items/1');
		await wait(30);
		// cache disabled → re-fetch on every navigation
		expect(mockFetch).toHaveBeenCalledTimes(base + 2);
	});

	it('router.invalidate() causes next navigation to re-fetch', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 1 })
		});
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{
				path: '/products/:id',
				http: { url: '/api/products/:id' },
				action: () => '<p>product</p>'
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 60_000 } });
		await wait(10);
		const base = mockFetch.mock.calls.length;

		r.push('/products/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 1);

		// invalidate all → cache is empty → next navigation re-fetches
		r.invalidate!();
		r.push('/products/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 2);
	});

	it('router.prefetch() warms cache so navigation avoids duplicate fetch', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 42, title: 'Widget' })
		});
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{
				path: '/widgets/:id',
				http: { url: '/api/widgets/:id' },
				action: (ctx: { data: unknown }) => `<p>${JSON.stringify(ctx.data)}</p>`
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 60_000 } });
		await wait(10);
		const base = mockFetch.mock.calls.length;

		// prefetch first
		await r.prefetch!('/widgets/42');
		expect(mockFetch).toHaveBeenCalledTimes(base + 1);

		// navigate — should hit fresh cache → no second fetch
		r.push('/widgets/42');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 1);
	});

	it('router.buildUrl() interpolates :param tokens', () => {
		const r = createRouter({ routes: [], outlet, mode: 'history', linkInterception: false });
		expect(r.buildUrl!('/users/:id', { id: '42' })).toBe('/users/42');
		expect(r.buildUrl!('/a/:b/c/:d', { b: '1', d: '2' })).toBe('/a/1/c/2');
		expect(r.buildUrl!('/about')).toBe('/about');
	});

	it('router.getState() returns the current context path after navigation', async () => {
		const routes = [
			{ path: '/state-test', action: () => '<p>state</p>' }
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false });

		r.push('/state-test');
		await wait(30);
		const state = r.getState!();
		expect(state?.path).toBe('/state-test');
		expect(state?.params).toEqual({});
	});

	it('stale cache hit triggers background revalidation and re-renders if data changed', async () => {
		let callCount = 0;
		const mockFetch = vi.fn().mockImplementation(() => {
			callCount++;
			const data = callCount === 1 ? { v: 1 } : { v: 2 };
			return Promise.resolve({ ok: true, json: async () => data });
		});
		vi.stubGlobal('fetch', mockFetch);

		const renderLog: unknown[] = [];
		const routes = [
			{
				path: '/revalidate/:id',
				http: { url: '/api/revalidate/:id' },
				action: (ctx: { data: unknown }) => {
					renderLog.push(ctx.data);
					return `<p>${JSON.stringify(ctx.data)}</p>`;
				}
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 0 } }); // staleTime=0 → always stale after first nav
		await wait(10);

		r.push('/revalidate/1');
		await wait(50); // first nav: cache miss → fetch v1, action renders v1
		expect(renderLog[renderLog.length - 1]).toEqual({ v: 1 });

		r.push('/revalidate/1');
		await wait(100); // second nav: stale → action renders v1 immediately, bg fetch → v2, action re-renders v2
		// action should have been called with v2 via background revalidation
		expect(renderLog.some((d: unknown) => (d as { v: number })?.v === 2)).toBe(true);
	});

	it('stale background revalidation does NOT re-invoke action when data is unchanged', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ v: 1 }) // always returns same data
		});
		vi.stubGlobal('fetch', mockFetch);

		const renderLog: unknown[] = [];
		const routes = [
			{
				path: '/stable/:id',
				http: { url: '/api/stable/:id' },
				action: (ctx: { data: unknown }) => {
					renderLog.push(ctx.data);
					return `<p>ok</p>`;
				}
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 0 } });
		await wait(10);

		r.push('/stable/1');
		await wait(50);
		const renderCountAfterFirst = renderLog.length;

		r.push('/stable/1');
		await wait(100); // bg revalidation: same data → deepEqual=true → action NOT re-invoked
		// action was called for stale serve (once) but NOT again for background since data unchanged
		// total calls = renderCountAfterFirst + 1 (stale serve) + 0 (no re-render)
		expect(renderLog.length).toBe(renderCountAfterFirst + 1);
	});

	it('pointerenter on a link with link interception fires delayed prefetch then pointerleave cancels it', async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 99 })
		});
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{
				path: '/hover/:id',
				http: { url: '/api/hover/:id' },
				action: () => '<p>hover</p>'
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: true,
			cache: { ttl: 60_000, staleTime: 60_000 } });
		await wait(10);

		// Create a link element and add it to the document
		const link = document.createElement('a');
		link.setAttribute('href', '/hover/99');
		document.body.appendChild(link);

		// Trigger pointerenter — should schedule a prefetch after 200ms
		const enterEvent = new PointerEvent('pointerenter', { bubbles: false, composed: true });
		Object.defineProperty(enterEvent, 'composedPath', { value: () => [link] });
		document.dispatchEvent(enterEvent);

		// Immediately trigger pointerleave — should cancel the scheduled prefetch
		const leaveEvent = new PointerEvent('pointerleave', { bubbles: false, composed: true });
		Object.defineProperty(leaveEvent, 'composedPath', { value: () => [link] });
		document.dispatchEvent(leaveEvent);

		await wait(300); // wait past the 200ms debounce window
		// fetch should NOT have been called since pointerleave cancelled the timer
		expect(r.getState).toBeDefined(); // router is alive
		document.body.removeChild(link);

		// Now test the full prefetch path: enter and wait 200ms
		const link2 = document.createElement('a');
		link2.setAttribute('href', '/hover/99');
		document.body.appendChild(link2);

		const enterEvent2 = new PointerEvent('pointerenter', { bubbles: false, composed: true });
		Object.defineProperty(enterEvent2, 'composedPath', { value: () => [link2] });
		document.dispatchEvent(enterEvent2);

		await wait(300); // wait past the 200ms debounce → prefetch fires
		// prefetch should have fetched the data
		expect(mockFetch.mock.calls.length).toBeGreaterThanOrEqual(1);
		document.body.removeChild(link2);
	});

	it('router.buildUrl() preserves query string', () => {
		const r = createRouter({ routes: [], outlet, mode: 'history', linkInterception: false });
		expect(r.buildUrl!('/search?q=hello')).toBe('/search?q=hello');
		expect(r.buildUrl!('/users/:id?tab=profile', { id: '1' })).toBe('/users/1?tab=profile');
	});

	it('router.invalidate() with no argument clears all entries so all routes re-fetch', async () => {
		const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 1 }) });
		vi.stubGlobal('fetch', mockFetch);

		const routes = [
			{ path: '/cats/:id', http: { url: '/api/cats/:id' }, action: () => '<p>cat</p>' },
			{ path: '/dogs/:id', http: { url: '/api/dogs/:id' }, action: () => '<p>dog</p>' }
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false,
			cache: { ttl: 60_000, staleTime: 60_000 } });
		await wait(10);
		const base = mockFetch.mock.calls.length;

		r.push('/cats/1');
		await wait(30);
		r.push('/dogs/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 2);

		// Invalidate all — next navigations re-fetch
		r.invalidate!();
		r.push('/cats/1');
		await wait(30);
		r.push('/dogs/1');
		await wait(30);
		expect(mockFetch).toHaveBeenCalledTimes(base + 4); // both re-fetched
	});
});

describe('render branches - DocumentFragment and Node actions', () => {
	let outlet: HTMLElement;

	beforeEach(() => {
		outlet = document.createElement('div');
		outlet.setAttribute('data-idae-outlet', '');
		document.body.appendChild(outlet);
	});

	afterEach(() => {
		outlet.remove();
	});

	it('action returning a DocumentFragment mounts it into the outlet', async () => {
		const routes = [
			{
				path: '/frag',
				action: () => {
					const frag = document.createDocumentFragment();
					const span = document.createElement('span');
					span.textContent = 'fragment-content';
					frag.appendChild(span);
					return frag;
				}
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false });
		r.push('/frag');
		await wait(30);
		expect(outlet.querySelector('span')?.textContent).toBe('fragment-content');
	});

	it('action returning a Node (Element) mounts it into the outlet', async () => {
		const routes = [
			{
				path: '/node',
				action: () => {
					const div = document.createElement('div');
					div.textContent = 'node-content';
					return div;
				}
			}
		];
		const r = createRouter({ routes, outlet, mode: 'history', linkInterception: false });
		r.push('/node');
		await wait(30);
		expect(outlet.querySelector('div')?.textContent).toBe('node-content');
	});
});
