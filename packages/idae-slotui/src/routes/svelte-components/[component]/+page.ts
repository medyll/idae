/** @type {import('./$types.js').PageLoad} */
export async function load({ params }) {
	// console.log({params})
	return { ...params };
}
