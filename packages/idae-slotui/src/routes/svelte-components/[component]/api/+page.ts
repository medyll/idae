/** @type {import('./$types.js').PageLoad} */
export async function load({ params }) {
	return { component: params.component };
}
