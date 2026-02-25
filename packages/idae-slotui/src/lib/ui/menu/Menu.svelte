<script module lang="ts">
import type { CommonProps, Data } from '$lib/types/index.js';
import type { ElementProps } from '$lib/types/index.js';
import type { Snippet } from 'svelte';
/**
 * Props for the Menu component.
 * @template T - The type of data for the menu items.
 */
export type MenuProps<T = Data> = CommonProps & {
	menuItemsInstances?: any[];
	hasIcon?: boolean;
	onMenuItemClick?: Function;
	element?: HTMLElement;
	menuItemsList?: MenuItemProps[];
	data?: T[];
	/** @deprecated use dense*/
	density?: 'none' | 'tight' | 'default' | 'medium' | 'kind';
	/** @deprecated use tall*/
	dense?: ElementProps['dense'];
	/** Preset value for the box-size of the component */
	tall?: ElementProps['dense'];
	/** Index to select the item */
	selectedIndex?: number;
	/** Menu can have no border */
	bordered?: boolean;
	/** Field used to select the item */
	selectorField?: keyof T;
	/** Selected data */
	selectedData?: T;
	/** Role available for li element */
	role?: 'directory' | 'group' | 'listbox' | 'menu' | 'menubar' | 'tablist' | 'toolbar' | 'tree';
	/** Actions to be performed on the menu */
	actions?: {
		navigate: (idx: number) => void;
	};
};
</script>
<script lang="ts" generics="T= Data">
	import type { Data } from '$lib/types/index.js';
	import MenuList from '../menuList/MenuList.svelte';


	let { ...rest }: MenuListProps = $props();
</script>

<style global lang="postcss">
  @import './menu.css';
</style>

<MenuList {...rest} class="menu" />
