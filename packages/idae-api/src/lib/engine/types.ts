export interface RequestParams {
	id?: string;
	query?: any;
	sortBy?: string;
	body?: any;
}

export interface SortOptions {
	[key: string]: 1 | -1;
}
