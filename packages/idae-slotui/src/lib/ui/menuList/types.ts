export const menuListDemoValues = {};
export const menuListItemDemoValues = {};
export const menuListTitleDemoValues = {};
import { demoerArgs } from '$lib/base/demoer/demoer.utils.js';
import type { DemoerStoryProps } from '$lib/base/demoer/types.js';
import type { CommonProps, Data, IconObj } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Represents the props for the Menu component.
 *
 * @template T - The type of data for the menu items.
 */
export type MenuListProps<T = Data> = CommonProps & {
	menuItemsInstances?: any[]; // svelte i
	hasIcon?: boolean;
	onclick?: (event: CustomEvent<T>, itemIndex: number) => void;

	element?: HTMLElement;

	menuListItems?: MenuListItemProps[];

	data?: T[];
	tall?: ElementProps['tall'];
	width?: ElementProps['width'];
	/**  displayed field for the listItem  */
	presentationField?: [keyof T];
	/** displayed as a grid */
	grid?: boolean | number;
	/** index to select the item */
	selectedIndex?: number;
	/**  field used to  select the item */
	selectorField?: keyof T;
	/**  selected data */
	selectedData?: T;
	/**  show last item on selected */
	showLastOnSelected?: boolean;
	/** role  available for li element */
	role?: 'directory' | 'group' | 'listbox' | 'menu' | 'menubar' | 'tablist' | 'toolbar' | 'tree';
	/**  actions to be performed on the menu */
	actions?: {
		navigate: (e: KeyboardEvent) => void;
		gotoIndex: (idx: number) => void;
	};
	menuListItemProps?: MenuListItemProps<T>;
	/** @deprecated use menuItemsList */
	menuList?: MenuListItemProps[];
	children?: Snippet<[{ item: Data; itemIndex: number }]>;
	menuListItem?: Snippet<[{ item: Data; itemIndex: number }]>;
	listItemBottom?: Snippet<[{ item: Data; itemIndex: number }]>;
};

export type MenuListItemProps<T = Data> = CommonProps & {
	/**  displayed field for the listItem  */
	presentationField?: [keyof T];
	/** element root HTMLDivElement props */
	element?: HTMLElement | null;
	selectorField?: keyof T;
	/** text displayed in the menu item */
	text?: string;

	/** text props, shown on the right side of the menuItem */
	action?: string;
	/**  dense prop */
	tall?: ElementProps['tall'];
	/**  dense prop */
	width?: ElementProps['width'];
	/** icon displayed in the menu item */
	icon?: string;
	/**  icon object at start */
	iconFirst?: IconObj;
	/** icon object at end */
	iconLast?: IconObj;
	/** color of the icon */
	iconColor?: string;
	/** href, li will become an a */
	href?: string;
	/** size of the icon */
	iconSize?: IconObj['iconSize'];
	/** whether to show a divider after the menu item */
	divider?: boolean;
	/** whether to show a divider before the menu item */
	dividerBefore?: MenuListItemProps['divider'];
	/** data associated with the menu item */
	data?: T;
	/** makes the menu item selectable */
	selectable?: boolean;
	/** html tag to use, default ul */
	tag?: string;
	/** whether the menu item is selected */
	selected?: boolean;
	/** wrap */
	wrap?: boolean;
	/** @deprecated
	 * function to be called when the menu item is clicked */
	onMenuItemClick?: (data: T) => void;
	/** function to be called when the menu item is clicked */
	onclick?: (event: CustomEvent<T>, itemIndex: number) => void;
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
	menuItemFirst?: Snippet;
	menuItemLast?: Snippet;
	children?: Snippet<[{ item: T; itemIndex: number; selected: number }]>;
	rest?: any;
};

const menuListDemoValues: DemoerStoryProps<MenuListProps> = {
	tall: {
		type: 'tall'
	}
	/* menuListItems: {
		type: 'menuListItems',
		default: [
			{
				text: 'Home',
				icon: 'home'
			},
			{
				text: 'About',
				icon: 'info'
			},
			{
				text: 'Contact',
				icon: 'phone'
			}
		],
		private: true
	} */
};

export const { parameters, componentArgs } = demoerArgs(menuListDemoValues);
