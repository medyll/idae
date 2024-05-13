import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { T } from 'vitest/dist/reporters-xEmem8D4.js';

export type DataListRowProps = CommonProps & {
	/** data for the row */
	data: T;

	/** children slot for the default cell content */
	children?: Snippet;
};
export interface DataCellType {
	/** internal use */
	index: number;
	/** column identifier data.id ?? generated */
	columnId: string | number;
	width: string;
	/** applied inline css style to header */
	headerStyle?: string;
	style?: string;
	order?: number;
	/** data field */
	field?: string;
	/** data field title shown in header*/
	fieldTitle?: string;
	/** use as convenience */
	fieldType?: string;
	/** transform data */
	getter?: (data: Record<string, unknown>) => void;
	htmlElement?: HTMLElement;
}

export interface RowType {
	data?: Data;
}

export interface groupByOptions {
	showMainHeader?: boolean;
	showSubGroupsHeader?: boolean;
	showEmptyGroup?: boolean;
	subPaginationSize?: number;
}
export interface DataListStoreType {
	config: {
		isSortable?: boolean;
		defaultSortByField?: string;
		defaultSortByOrder: 'asc' | 'desc' | 'none' | string;
		sortingIcons: Record<string, string[]>;
		noWrap?: boolean;
		dataTypes?: Record<string, (item: any) => any>;
	};
	sortBy: {
		activeSortByField?: string;
		activeSortByOrder?: 'asc' | 'desc' | 'none' | string;
	};
	groupBy: {
		groupByField: string | string[];
		groupByOptions: groupByOptions;
	};
	idField?: string;
	selectedRowId?: string;
	columns: Record<string, DataCellType>;
	headerNodes?: Record<string, DataCellType>;
	hasColumnsProps?: boolean;
	data: Data[];
}
