import type { CommonProps, Data } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
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
    role?: 'listitem' | 'option' | 'tab' | 'treeitem' | 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
    menuItemStart?: Snippet;
    menuItemEnd?: Snippet;
    children?: Snippet<[
        {
            item: T;
            itemIndex: number;
            selected: number;
        }
    ]>;
    rest?: any;
};