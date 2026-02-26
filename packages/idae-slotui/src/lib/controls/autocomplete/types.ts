export const autocompleteDemoValues = {};
export const autoCompleteDemoValues = {};
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

export type AutoCompleteProps<T = Data> = CommonProps & {
	/** className off the root component */
	class?: string;
	/** element root HTMLDivElement props */
	element?: HTMLDivElement;
	/** initial data to look in */
	data: T[];
	/** show all data when search is empty */
	showAllOnEmpty?: boolean;
	/** default field to be used for searches, can be * */
	searchField?: string | '*';
	/**
	 * defaults fields to be shown
	 */
	dataFieldName?: keyof T | (keyof T)[];
	/** search mode : exact or partial match*/
	mode?: 'exact' | 'partial';
	/** external bind use, to read filtered data */
	filteredData?: T[];
	/** selectedIndex : index of the selected item in data */
	selectedIndex?: number;
	/** selectedIndex : index of the selected item in data */
	onchange?: (args: T) => void;
	autoCompleteEmpty?: Snippet;
	autoCompleteNoResults?: Snippet;
};

const AutoCompleteDemoValues: DemoerStoryProps<AutoCompleteProps> = {
	data: {
		type: 'array',
		values: [
			[
				{ name: 'John', age: 25 },
				{ name: 'Jane', age: 30 }
			]
		],
		default: []
	},
	showAllOnEmpty: {
		type: 'boolean',
		default: false
	},
	searchField: {
		type: 'string',
		values: ['name', 'age', '*'],
		default: '*'
	},
	mode: {
		type: 'string',
		values: ['exact', 'partial'],
		default: 'exact'
	}
};

export let { parameters, componentArgs } = demoerArgs(AutoCompleteDemoValues);
