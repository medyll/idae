<svelte:options accessors runes />

<script lang="ts">
	import Menu from '$lib/ui/menu/Menu.svelte';
	import type { Snippet } from 'svelte';
	import type { PopperProps } from '$lib/ui/popper/types.js';
	import type { MenuProps } from '$lib/ui/menu/types.js';
	import Popper from '$lib/ui/popper/Popper.svelte';
	import Button from './Button.svelte';
	import type { ButtonProps } from './types.js';

	type ButtonMenuProps = ButtonProps & {
		menuProps: MenuProps;
		popperProps: PopperProps;
		class: string;
		element: HTMLButtonElement;
		menuItem?: Snippet;
		rest: ButtonProps;
	};

	let {
		element,
		menuProps = {},
		popperProps = {},
		class: className,
		menuItem = undefined,
		...rest
	}: ButtonMenuProps = $props();
</script>

<Button class={'ButtonMenu ' + className} {...rest} bind:element>
	<slot />
</Button>
<Popper parentNode={element} {...popperProps}>
	<Menu {...menuProps}><slot name="menuItem">{@render menuItem?.()}</slot></Menu>
</Popper>

<style lang="scss">
	@import './ButtonMenu.scss';
</style>
