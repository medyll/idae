import type { CommonProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DataOpGroupByOptions, DataOpSortBy } from '@medyll/idae-engine';

export type LoopProps<T> = CommonProps & {
	title?: string;
	data?: T[];
	naked?: boolean;
	groupBy?: DataOpGroupByOptions<T>;
	sortBy?: DataOpSortBy<T>;
	tag?: string;
	children?: Snippet<[{ item: T; idx: number }]>;
	loopTitle?: Snippet;
	loopGroupTitle?: Snippet<[{ key: any; data: T[]; idx: number }]>;
};

let data = [
	{ id: 1, name: 'Jean', lastname: 'paul', job: 'developer' },
	{ id: 2, name: 'Alice', lastname: 'Smith', job: 'designer' },
	{ id: 3, name: 'John', lastname: 'Doe', job: 'manager' },
	{ id: 4, name: 'Emily', lastname: 'Johnson', job: 'engineer' },
	{ id: 5, name: 'Michael', lastname: 'Williams', job: 'developer' },
	{ id: 6, name: 'Sophia', lastname: 'Brown', job: 'designer' },
	{ id: 7, name: 'Daniel', lastname: 'Miller', job: 'manager' },
	{ id: 8, name: 'Olivia', lastname: 'Davis', job: 'engineer' },
	{ id: 9, name: 'Matthew', lastname: 'Wilson', job: 'developer' },
	{ id: 10, name: 'Ava', lastname: 'Taylor', job: 'designer' },
	{ id: 11, name: 'David', lastname: 'Anderson', job: 'manager' },
	{ id: 12, name: 'Emma', lastname: 'Thomas', job: 'engineer' },
	{ id: 13, name: 'Joseph', lastname: 'Jackson', job: 'developer' },
	{ id: 14, name: 'Mia', lastname: 'White', job: 'designer' },
	{ id: 15, name: 'James', lastname: 'Harris', job: 'manager' },
	{ id: 16, name: 'Isabella', lastname: 'Martin', job: 'engineer' },
	{ id: 17, name: 'Benjamin', lastname: 'Clark', job: 'developer' },
	{ id: 18, name: 'Abigail', lastname: 'Lewis', job: 'designer' },
	{ id: 19, name: 'Ethan', lastname: 'Lee', job: 'manager' },
	{ id: 20, name: 'Charlotte', lastname: 'Walker', job: 'engineer' }
];

export const looperDemoValues: DemoerStoryProps<any> = {
	data: {
		type: 'array',
		values: [data],
		default: data,
		private: true
	},
	naked: {
		type: 'boolean',
		values: [true, false],
		default: false
	},
	title: {
		type: 'string',
		values: ['Looping title']
	},
	tag: {
		type: 'string',
		values: ['div', 'section', 'article'],
		default: 'div'
	}
};
export let { parameters, componentArgs } = demoerArgs(looperDemoValues);
