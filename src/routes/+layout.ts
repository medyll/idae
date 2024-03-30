import type { LayoutLoad } from './$types.js';

export const load: LayoutLoad = async (params) => {
	// console.log(params)
	return {
		...params
	};
};
