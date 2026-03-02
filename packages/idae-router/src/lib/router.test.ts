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

	it('leaves ctx.data undefined for routes with no http/http_source', async () => {
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
		expect(capturedData).toBeUndefined();
		expect(fetch).not.toHaveBeenCalled();
	});
});
