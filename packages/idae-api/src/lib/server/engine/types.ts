import type { QueryFilter } from 'mongoose';

// packages\idae-api\src\lib\engine\types.ts
export interface ApiServerRequestParams<T extends object> {
	id?: string;
	query?: QueryFilter<T>;
	sortBy?: string;
	body?: any;
}

export interface SortOptions {
	[key: string]: 1 | -1;
}
