import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type DataListHeadProps = {
	style?: string;
	element?: HTMLDivElement;
	stickyHeader?: boolean;
	onSort?: Function;
	children?: Snippet;
};
export type DataListRowProps<T> = CommonProps & {
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

export type DataListCellProps = {
	element?: HTMLElement;
	field: string;
	style?: string;
	fieldType?: string;
	columnId?: string | number | undefined;
	noWrap?: boolean;
	title?: string;
	children?: Snippet<[{ fieldData: Data }]>;
};

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
