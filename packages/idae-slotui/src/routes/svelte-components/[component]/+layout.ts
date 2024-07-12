// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

/** @type {import('./$types.js').PageLoad} */
export async function load({ params }) {
	// console.log({params})
	return { ...params };
}
