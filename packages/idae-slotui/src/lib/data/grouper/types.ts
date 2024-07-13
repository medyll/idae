import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import { type DataOpGroupByOptions, type DataOpGroupResult } from '@medyll/idae-engine';
import type { ButtonProps } from '$lib/controls/button/types.js';
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

export type GrouperProps<T extends object> = CommonProps & {
	/** Grouper mode */
	grouperMode?: 'button' | 'menu';

	/** Final grouped data as raw object */
	groupedData?: DataOpGroupResult<T>;

	/** List of available groups shown to user instead of auto-discovery */
	groupListItems: string[];

	/** Data to group */
	data: T[];

	/** groupBy options Field from data to group by */
	groupBy: DataOpGroupByOptions<T>;

	/** @deprecated Field from data to group by */
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

	buttonProps?: ButtonProps;
	elementButton?: HTMLElement;
	/** Children snippet for the default content */
	children?: Snippet;
};

let data = [
	{
		id: 1,
		name: 'Jean',
		lastname: 'paul',
		job: 'developer',
		situation: { age: 21, city: 'london' }
	},
	{
		id: 2,
		name: 'Alice',
		lastname: 'Smith',
		job: 'designer',
		situation: { age: 22, city: 'paris' }
	},
	{
		id: 3,
		name: 'John',
		lastname: 'Doe',
		job: 'manager',
		situation: { age: 23, city: 'berlin' }
	},
	{
		id: 4,
		name: 'Emily',
		lastname: 'Johnson',
		job: 'engineer',
		situation: { age: 24, city: 'madrid' }
	},
	{
		id: 5,
		name: 'Michael',
		lastname: 'Williams',
		job: 'developer',
		situation: { age: 25, city: 'rome' }
	},
	{
		id: 6,
		name: 'Sophia',
		lastname: 'Brown',
		job: 'designer',
		situation: { age: 26, city: 'lisbon' }
	},
	{
		id: 7,
		name: 'Daniel',
		lastname: 'Miller',
		job: 'manager',
		situation: { age: 27, city: 'amsterdam' }
	},
	{
		id: 8,
		name: 'Olivia',
		lastname: 'Davis',
		job: 'engineer',
		situation: { age: 28, city: 'brussels' }
	},
	{
		id: 9,
		name: 'Matthew',
		lastname: 'Wilson',
		job: 'developer',
		situation: { age: 29, city: 'dublin' }
	},
	{
		id: 10,
		name: 'Ava',
		lastname: 'Taylor',
		job: 'designer',
		situation: { age: 30, city: 'athens' }
	},
	{
		id: 11,
		name: 'David',
		lastname: 'Anderson',
		job: 'manager',
		situation: { age: 31, city: 'stockholm' }
	},
	{
		id: 12,
		name: 'Emma',
		lastname: 'Thomas',
		job: 'engineer',
		situation: { age: 32, city: 'helsinki' }
	}
];

export const grouperDemoValues: DemoerStoryProps<GrouperProps> = {
	data: {
		type: 'data',
		private: true,
		values: [data]
	},
	groupBy: {
		type: 'string',
		values: ['group']
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
