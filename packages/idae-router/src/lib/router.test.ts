// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter } from './index';

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
});
