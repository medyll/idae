import type { LayoutLoad } from './$types.js';
// triggering the layout load
export const load: LayoutLoad = async (params) => {
	// console.log(params)
	return {
		...params
	};
};
