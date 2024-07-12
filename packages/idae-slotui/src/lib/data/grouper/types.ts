import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type GroupItemType<T = Data> = {
	primary: string;
	secondary: string;
	icon?: string;
	data?: T;
};

export type GroupTitleType<T = Data> = {
	isGroup: boolean;
	code: string;
	primary: string;
	data?: T;
};

export type GroupedDataType<T = Data> = [GroupTitleType, T[]][];

export type GrouperProps<T = Data> = CommonProps & {
	/** Grouper mode */
	grouperMode?: 'button' | 'menu';

	/** Final grouped data as raw object */
	groupedData?: Record<string, T[]>;

	/** Final grouped data computed by component, available to slotui model caller */
	groupedTemplateData?: GroupedDataType;

	/** List of available groups shown to user */
	groupListItems: string[];

	/** Data to group */
	data: Data[];

	/** Field from data to group by */
	groupByField: string;

	/** Presented field from data to group by */
	groupByTitleField?: string;

	/** Order on which the grouped list is sorted */
	groupByOrder?: 'asc' | 'desc';

	/** Show ungrouped data */
	showUnGrouped?: boolean;

	/** Ungrouped title when show ungrouped data props is set to true */
	ungroupedTitle?: string;

	/** Active group field, useful when several */
	activeGroupField?: string;

	/** Children snippet for the default content */
	children?: Snippet;
};

export const grouperDemoValues: DemoerStoryProps<GrouperProps> = {
	data: {
		type: 'data',
		private: true
	},
	grouperMode: {
		type: 'string',
		values: ['menu', 'button']
	},
	showUnGrouped: {
		type: 'boolean'
	},
	groupByField: {
		type: 'string',
		values: [undefined, 'subgroup']
	},
	groupListItems: {
		type: 'string',
		values: [undefined, ['group', 'subgroup']]
	}
};
export const { parameters, componentArgs } = demoerArgs(grouperDemoValues);
