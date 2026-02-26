export const menuDemoValues = {};
export const menuItemDemoValues = {};
export const menuTitleDemoValues = {};
import type { CommonProps, Data } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';

/**
 * Represents the props for the Menu component.
 *
 * @template T - The type of data for the menu items.
 */
export type MenuProps<T = Data> = CommonProps & {
	menuItemsInstances?: any[]; // svelte i
	hasIcon?: boolean;
	onMenuItemClick?: Function;

	element?: HTMLElement;

	menuItemsList?: MenuItemProps[];

	data?: T[];
	/** @deprecated use dense*/
	density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	/** @deprecated use tall*/
	dense?: ElementProps['dense'];
	/** preset value for the box-size of the component */
	tall?: ElementProps['dense'];
	/** index to select the item */
	selectedIndex?: number;

	/** menu can have no border */
	bordered?: boolean;
	/**  field used to  select the item */
	selectorField?: keyof T;
	/**  selected data */
	selectedData?: T;
	/** role  available for li element */
	role?: 'directory' | 'group' | 'listbox' | 'menu' | 'menubar' | 'tablist' | 'toolbar' | 'tree';
	/**  actions to be performed on the menu */
	actions?: {
		navigate: (idx: number) => void;
	};
	/** @deprecated */
	menuList?: MenuItemProps[];
	children?: Snippet<[{ item: Data; itemIndex: number }]>;
};

export type MenuItemProps<T = any> = CommonProps & {
	/** element root HTMLDivElement props */
	element?: HTMLElement | null;

	/** text displayed in the menu item */
	text?: string;

	/** text props, shown on the right side of the menuItem */
	action?: string;

	/** icon displayed in the menu item */
	icon?: string;

	/** color of the icon */
	iconColor?: string;

	/** size of the icon */
	iconSize?: ElementProps['sizeType'];

	/** whether to show a divider after the menu item */
	divider?: boolean;

	/** whether to show a divider before the menu item */
	dividerBefore?: MenuItemProps['divider'];

	/** data associated with the menu item */
	data?: T;

	/** whether the menu item is selected */
	selected?: boolean;

	/** @deprecated
	 * function to be called when the menu item is clicked */
	onMenuItemClick?: (data: T) => void;
	/** function to be called when the menu item is clicked */
	onclick?: (data: T) => void;
	/** position in the list */
	itemIndex?: number;
	/** role  available for li element */
	role?:
		| 'listitem'
		| 'option'
		| 'tab'
		| 'treeitem'
		| 'menuitem'
		| 'menuitemradio'
		| 'menuitemcheckbox';
	menuItemStart?: Snippet;
	menuItemEnd?: Snippet;
	children?: Snippet<[{ item: T; itemIndex: number; selected: number }]>;
	rest?: any;
};
