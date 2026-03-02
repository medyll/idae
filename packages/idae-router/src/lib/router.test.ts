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
