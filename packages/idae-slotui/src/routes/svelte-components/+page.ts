import type { PageLoad } from './$types.js';
export async function load({ params: PageLoad }) {
	// console.log({params})
	return {
		headers: {
			Accept: 'application/json'
		},
		status: 200,
		body: { from: '[component]' }
	};
}
