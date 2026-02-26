import type { ButtonProps } from '$lib/controls/button/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type SorterFieldType = {
	sortByField: string;
	sortByTitleField?: string;
	sortByOrder?: 'asc' | 'desc' | 'none';
	order?: number;
};

export type SortItem = {};

export type SortererProps = CommonProps & {
	/** Data to be sorted */
	data: Data[];
	/** binding : final sorted data as raw object  */
	sortedData?: Data[];
	fields: SorterFieldType[];
	activeCommonSortField?: string;
	/** Function to call when the data is sorted */
	onSort?: (sortedData: any[]) => void;
};

export type SorterProps = {
	/** The data to sort */
	data: Data[];
	/** binding : final sorted data as raw object  */
	sortedData?: Data[];

	/** The field to sort by */
	sortByField: string;

	/** The title of the field to sort by */
	sortByTitleField?: string;
	/** list of available sorts shown to user */
	sortListItems?: string[];
	/** The order to sort by */
	sortByOrder?: 'asc' | 'desc' | 'none' | string;

	/** The active field to sort by */
	activeCommonSortField?: string;
	/** Sorter mode */
	sorterMode?: 'button' | 'menu' | 'free';

	children?: Snippet<[ButtonProps]>;
};

export const SorterDemoValues = {};

export const sortererDemoValues = {};
