import type { CommonProps, Data } from '$lib/types/index.js';

export type JsonerProps = CommonProps & {
	/** The data to be displayed */
	data: Data[];

	/** The mode of the data */
	mode?: 'array' | 'object' | 'string' | 'number';
};

export const JsonerDemoValues = {};
