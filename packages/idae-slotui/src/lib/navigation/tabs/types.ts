import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps } from '$lib/types/index.js';
import type { Component, Snippet } from 'svelte';

export type TabItem = {
	label: string;
	code?: string;
	secondary?: string;
	withUid?: string;
	withContent?: any;
	withComponent?: any;
	componentProps?: Record<string, any>;
};

export type TabsItemsProps = TabItem[];

// Props moved to the component module script during migration.

export const tabsDemoValues: DemoerStoryProps<any> = {
	activeTabCode: {
		type: 'string',
		values: ['tab1', 'tab2', 'tab3', 'tab4', 'tab5']
	},
	orientation: {
		type: 'orientation',
		default: 'vertical'
	},
	items: {
		type: 'array',
		values: [],
		default: [
			{
				label: 'Tab 1',
				code: 'tab1',
				secondary: 'Secondary 1',
				withContent: 'Content 1 : withContent'
			},
			{
				label: 'Tab 2',
				code: 'tab2',
				secondary: 'Secondary 2'
			},
			{
				label: 'Tab 3',
				code: 'tab3',
				secondary: 'Secondary 3'
			},
			{
				label: 'Tab 4',
				code: 'tab4',
				secondary: 'Secondary 4'
			},
			{
				label: 'Tab 5',
				code: 'tab5',
				secondary: 'Secondary 5'
			}
		],
		private: true
	}
};

export const { parameters, componentArgs } = demoerArgs<any>(tabsDemoValues);

// Export tabs demo values for generator
export { tabsDemoValues };
