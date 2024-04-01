import type { Data } from '$lib/types/index.js';
import type { ElementProps } from '$typings/index.js';
import type { Snippet } from 'svelte';

export type MenuProps<T = any> = {
	menuItemsInstances?: any[]; // svelte i
	hasIcon?: boolean;
	onMenuItemClick?: Function;

	element: HTMLElement | null;
	/** @deprecated */
	menuList?: IMenuItemProps[];

	menuItemsList?: IMenuItemProps[];

	data?: T[];

	density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';

	style?: string;

	/** menu can have no border */
	bordered?: boolean;

	selectedIndex?: number;
	/**  actions to be performed on the menu */
	actions: {
		navigate: (idx: number) => void;
	};
	children: Snippet<[{ item: Data; itemIndex: number }]>;
	rest: any;
};

export type IMenuItemProps<T = any> = {
	class?: string | undefined;
	text: string;
	action: string;
	icon?: string;
	iconColor: string;
	iconSize: string;
	divider?: boolean;
	dividerBefore?: boolean;
	data?: T;
	selected?: boolean;
	onMenuItemClick: () => void;
	itemIndex?: number | ElementProps['expansion'];
};
