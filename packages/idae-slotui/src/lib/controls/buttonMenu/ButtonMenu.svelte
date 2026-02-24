<script module lang="ts">
import type { MenuListProps } from '$lib/ui/menuList/types.js';
import type { PopperProps } from '$lib/ui/popper/types.js';
/**
 * Props for the ButtonMenu component.
 * Extends ButtonProps with menu and popper support.
 * @template T - The type of the menu data
 */
export type ButtonMenuProps<T = any> = {
	/** Props for the menu list */
	menuProps?: MenuListProps<T>;
	/** Props for the popper */
	popperProps?: PopperProps;
	/** If true, disables the button */
	disabled?: boolean;
	/** Reference to the button element */
	element?: HTMLElement;
	/** Reference to the popper element */
	popperElement?: HTMLElement;
	/** Custom menu item renderer */
	menuItem?: (args: { item: T }) => any;
	/** Slot for children content */
	children?: any;
	// ...rest of ButtonProps fields (not repeated here for brevity)
};
</script>
<script lang="ts" generics="T">
import Popper from '$lib/ui/popper/Popper.svelte';
import MenuList from '$lib/ui/menuList/MenuList.svelte';
import Button from '../button/Button.svelte';
import MenuListItem from '$lib/ui/menuList/MenuListItem.svelte';

let {
	menuProps = {} as MenuListProps<T>,
	popperProps = {} as PopperProps,
	disabled = false,
	element = $bindable(),
	popperElement,
	menuItem,
	children,
	...rest
}: ButtonMenuProps<T> = $props();

let isOpen = $derived(() => popperProps?.isOpen ?? false);
let chevron = $derived(disabled ? 'fluent:chevron-up-20-regular' : 'fluent:chevron-up-12-down');
</script>

<Button
	onclick={() => {
		isOpen = true;
	}}
	{...rest}
	bind:element
	iconEnd={{ icon: chevron, rotation: isOpen ? 180 : 0 }}
	{children}
/>
{#if isOpen && !disabled}
	<Popper
		bind:element={popperElement}
		bind:isOpen
		parentNode={element}
		{...popperProps}
		position="BC"
		stickToHookWidth={true}
	>
		<MenuList {...menuProps}>
			{#snippet children({ item })}
				{#if menuItem}
					{@render menuItem?.({ item })}
				{:else}
					<MenuListItem {...item} />
				{/if}
			{/snippet}
		</MenuList>
	</Popper>
{/if}

<style global lang="css">
	@import '../button/button.css';
	@import './button-menu.css';
</style>
