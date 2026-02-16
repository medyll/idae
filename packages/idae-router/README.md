# idae-router

A lightweight, framework-agnostic SPA router (factory `createRouter`) with path params, query parsing, lifecycle hooks, DOM rendering into an outlet, link interception, and support for actions that return cleanup functions.

## Complex Example

This example demonstrates routes that return HTML, DOM nodes, perform async effects, return cleanup functions, and use lifecycle hooks and programmatic navigation.

```ts
import { createRouter } from './src/lib';

const routes = [
	{ path: '/', action: () => '<h1>Home</h1><p>Welcome.</p>' },
	{
		path: '/about',
		action: () => {
			const frag = document.createDocumentFragment();
			const h = document.createElement('h1');
			h.textContent = 'About';
			frag.appendChild(h);
			return frag;
		}
	},
	{
		path: '/user/:id',
		action: async (ctx) => {
			// simulate async data load
			const data = await new Promise((res) =>
				setTimeout(() => res({ id: ctx.params.id, name: 'User ' + ctx.params.id }), 200)
			);
			const div = document.createElement('div');
			div.innerHTML = `<h1>User ${ctx.params.id}</h1><p>Name: ${(data as any).name}</p>`;
			// return a cleanup function to be called on leave
			const timer = setInterval(() => console.log('polling for user', ctx.params.id), 1000);
			return () => clearInterval(timer);
		}
	},
	{
		path: '/posts',
		action: (ctx) => {
			const el = document.createElement('div');
			el.innerHTML =
				'<h1>Posts</h1><ul><li><a href="/posts/1/comments">Post 1 comments</a></li></ul>';
			return el;
		}
	},
	{
		path: '/posts/:postId/comments',
		action: (ctx) => {
			// effect-only action (no render) — e.g., track analytics
			console.log('Viewing comments for', ctx.params.postId);
			return; // keep previous view
		}
	}
];

const router = createRouter({
	routes,
	outlet: '#app',
	mode: 'history',
	linkInterception: true,
	notFound: () => '<h1>404 — Not Found</h1>'
});

// before hook: block access to /posts if not authed
router.before((to, from, next) => {
	if (to.path.startsWith('/posts') && !window.localStorage.getItem('authed')) {
		// redirect to /login
		next('/login');
		return;
	}
	next();
});

router.after((to) => {
	console.log('navigated to', to.path);
});

router.onLeave((from) => {
	console.log('left', from.path);
});

// programmatic navigation examples
document.getElementById('go-user')?.addEventListener('click', () => router.push('/user/42'));
document.getElementById('refresh')?.addEventListener('click', () => router.refresh());
```

Behavior notes:

- `action` may return `string | Node | DocumentFragment` to render into the outlet.
- `action` may return `void` for effect-only actions (router keeps previous DOM view).
- `action` may return a function — this will be treated as a cleanup and invoked when navigating away.
- `before(to, from, next)` supports async flows via calling `next()`/`next(path)`/`next(false)`.

## Usage

- Import `createRouter` from the package entry (`src/lib` during development).
- Provide an `outlet` selector (default `#app`) where views are mounted.
- Use `push`, `replace`, and `refresh` on the router instance for programmatic navigation.
