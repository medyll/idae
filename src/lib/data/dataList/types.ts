import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type DataListProps = {
	/** className off the root component */
	class?: string;

	/** css style off the root component */
	style?: string;

	/** element root HTMLDivElement props */
	element?: HTMLDivElement | null;

	/** show or hide the dataList header */
	showHeader?: boolean;

	/** is the datalist sortable */
	isSortable?: boolean;

	/** order on which the sorted list is sorted */
	sortByOrder?: 'asc' | 'desc' | 'none' | string;

	/** group field on which data will be grouped, can use dot notation as dot path */
	groupByField?: string | string[];

	/** options used when props.groupByField is defined */
	groupByOptions?: groupByOptions;

	/** field used for selection */
	selectorField?: string;

	fieldValue?: any;

	/** field value used for selection */
	selectorFieldValue?: any;

	/** binding, used when multiple buttons */
	activeCommonSortField?: string;

	/** set noWrap = true to have ellipsis on all cells content */
	noWrap?: boolean;

	/** set noWrap = true to have ellipsis on all header cells content */
	noWrapHeader?: boolean;

	/** represents your data types used to display values */
	dataTypes?: Record<string, any>;

	/** data to loop through */
	data?: any[];

	/** used only if data is provided */
	idField?: string;

	/** columns declaration */
	columns?: Record<string, DataCellType>;

	/** Virtualizer instance for the list */
	virtualizer?: boolean;

	/** Loading state of the list */
	isLoadingDrawerProps?: boolean;

	dataListHead?: Snippet;
	dataListFooter?: Snippet;
	dataListRow?: Snippet<[{ rawData: Data; item: Data }]>;
	dataListCell?: Snippet<[{ fieldType: string; fieldName: string; fieldValue: any }]>;
	groupTitleSlot?: Snippet<[{ item: Data }]>;
};

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

	/** children snippet for the default cell content */
	children?: Snippet;
};
export interface DataCellType {
	/** internal use */
	index?: number;
	/** column identifier data.id ?? generated */
	columnId?: string | number;
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
	field?: string;
	style?: string;
	fieldType?: string;
	columnId?: string | number;
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
