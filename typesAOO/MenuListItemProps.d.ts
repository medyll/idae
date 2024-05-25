import type { CommonProps, Data, IconObj } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
export type MenuListItemProps<T = Data> = CommonProps & {
    /** element root HTMLDivElement props */
    element?: HTMLElement | null;
    /** text displayed in the menu item */
    text?: string;
    /** text props, shown on the right side of the menuItem */
    action?: string;
    /**  dense prop */
    dense?: ElementProps['dense'];
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
    iconSize?: IconObj['size'];
    /** whether to show a divider after the menu item */
    divider?: boolean;
    /** whether to show a divider before the menu item */
    dividerBefore?: MenuListItemProps['divider'];
    /** data associated with the menu item */
    data?: T;
    /** makes the menu item selectable */
    selectable?: boolean;
    /** whether the menu item is selected */
    selected?: boolean;
    /** @deprecated
     * function to be called when the menu item is clicked */
    onMenuItemClick?: (data: T) => void;
    /** function to be called when the menu item is clicked */
    onclick?: (event: CustomEvent<T>, itemIndex: number) => void;
    /** position in the list */
    itemIndex?: number;
    /** role  available for li element */
    role?: 'listitem' | 'option' | 'tab' | 'treeitem' | 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
    menuItemFirst?: Snippet;
    menuItemLast?: Snippet;
    children?: Snippet<[
        {
            item: T;
            itemIndex: number;
            selected: number;
        }
    ]>;
    rest?: any;
};