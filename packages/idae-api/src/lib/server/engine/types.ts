import type { FilterQuery } from 'mongoose';

// packages\idae-api\src\lib\engine\types.ts
export interface ApiServerRequestParams<T extends object> {
	id?: string;
	query?: FilterQuery<T>;
	sortBy?: string;
	body?: any;
}

export interface SortOptions {
	[key: string]: 1 | -1;
}
