import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type DataListProps<T = Data> = {
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
	data?: T[];

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

export const DataListDemoValues: DemoerStoryProps<DataListProps<any>> = {
	data: {
		type: 'data',
		values: [[{ name: 'name1' }, { name: 'name2' }]],
		private: true
	},
	isSortable: {
		type: 'boolean',
		values: [true, false]
	},
	sortByOrder: {
		type: 'string',
		values: ['asc', 'desc', 'none'],
		default: 'none'
	},
	groupByField: {
		type: 'string',
		values: [undefined, 'name']
	},
	groupByOptions: {
		type: 'object',
		values: [
			{
				showMainHeader: true,
				showSubGroupsHeader: true,
				showEmptyGroup: true,
				subPaginationSize: 10
			}
		]
	},
	selectorField: {
		type: 'string',
		values: ['name']
	},
	selectorFieldValue: {
		type: 'string',
		values: ['name']
	},
	activeCommonSortField: {
		type: 'string',
		values: ['name']
	},
	noWrap: {
		type: 'boolean'
	},
	noWrapHeader: {
		type: 'boolean',
		values: [true]
	},
	columns: {
		type: 'object',
		values: [{ name: 'name' }]
	}
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

export type DataListCellProps<T> = {
	element?: HTMLElement;
	field?: string;
	style?: string;
	fieldType?: string;
	columnId?: string | number;
	noWrap?: boolean;
	title?: string;
	children?: Snippet<[{ fieldData: T }]>;
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

/* 	let parameters: any = {
		groupByField: {
			type: 'string',
			values: ['group', 'groupByObjectKey', 'groupByArrayObjectKey', undefined]
		},
		virtualizer: {
			type: 'boolean',
			values: [true, false]
		},
		isSortable: {
			type: 'boolean',
			values: [true, false]
		}
	}; */

const dataListDemoValues: DemoerStoryProps<DataListProps<any>> = {
	data: {
		type: 'data',
		values: [[{ name: 'name1' }, { name: 'name2' }]],
		private: true
	},
	isSortable: {
		type: 'boolean',
		values: [true, false]
	},
	groupByField: {
		type: 'string',
		values: [undefined, 'group', 'groupByObjectKey', 'groupByArrayObjectKey']
	}
};

export let { parameters, componentArgs } = demoerArgs(dataListDemoValues);
