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
	@reference "tailwindcss";

	:root {
		--menu-min-width: 150px;
		--menu-padding: 0.25rem;
		--menu-color: var(--sld-color-foreground);
		--menu-item-border-radius: var(--sld-radius-small);
		--menu-item-icon-width: 16px;
		--menu-item-text-padding-left: 0.25rem;
	}

	ul.menu {
		margin: 0;
		min-width: var(--menu-min-width);
		padding: var(--menu-padding);
		cursor: pointer;
		display: block;
		color: var(--menu-color);
	}

	ul.menu li.menuTitle {
		position: sticky;
		margin-top: 0px;
		top: 0px;
		z-index: 1;
	}

	li.menuItem {
		border-radius: var(--menu-item-border-radius);
		overflow: hidden;
		display: flex;
		align-items: center;
		border: 1px solid transparent;
	}

	li.menuItem .menuListItemIcon {
		width: var(--menu-item-icon-width);
		max-width: var(--menu-item-icon-width);
		text-align: center;
		overflow: hidden;
		display: flex;
		justify-content: center;
	}

	li.menuItem .menu-list-item-text {
		flex: 1;
		padding-left: var(--menu-item-text-padding-left);
	}

	li.menuItem .menu-list-item-action {
		display: block;
	}
</style>

<MenuList {...rest} class="menu" />
