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
    /** @deprecated use dense*/
    density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';
    dense?: ElementProps['dense'];
    /** index to select the item */
    selectedIndex?: number;
    /** menu can have no border */
    bordered?: boolean;
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
    /** @deprecated use menuItemsList */
    menuList?: MenuListItemProps[];
    children?: Snippet<[
        {
            item: Data;
            itemIndex: number;
        }
    ]>;
    rest?: any;
};