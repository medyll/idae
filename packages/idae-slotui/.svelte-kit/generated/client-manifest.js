export { matchers } from './client-matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')];

export const server_loads = [0];

export const dictionary = {
	"/": [7],
	"/about": [8,[2]],
	"/slots/[slot]": [9,[3]],
	"/svelte-components": [10,[4]],
	"/svelte-components/[component]": [11,[4,5]],
	"/svelte-components/[component]/api": [12,[4,5,6]]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};