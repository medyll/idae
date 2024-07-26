import type { PageServerLoad } from './$types';
import '$lib/example';
export const load = (async () => {
	console.log('red');
	return {};
}) satisfies PageServerLoad;
