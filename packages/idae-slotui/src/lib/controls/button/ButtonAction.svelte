<script lang="ts">
import type { Snippet } from 'svelte';
import type { PopperProps } from '$lib/ui/popper/types.js';
import type { MenuProps } from '$lib/ui/menu/types.js';
import Popper from '$lib/ui/popper/Popper.svelte';
import Button from './Button.svelte';
import type { ButtonProps } from './Button.svelte';
import Icon from '$lib/base/icon/Icon.svelte';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import type { ExpandProps } from '$lib/types/index.js';

type ButtonActionProps = ButtonProps & {
	menuProps?: MenuProps;
	popperProps?: PopperProps;
	popperContent?: Snippet;
};

let {
	element,
	class: className = '',
	menuProps = {},
	popperProps = {},
	popperContent = undefined,
	disabled = false,
	variant = 'bordered',
	tall = 'small',
	children,
	...rest
}: ExpandProps<ButtonActionProps> = $props();
let holder = $state<HTMLDivElement>();
let isOpen = $derived(() => popperProps?.isOpen ?? false);
let chevron = 'fluent:chevron-down-20-regular';
</script>

<div bind:this={holder} class="button button-action selected {variant} tall-{tall} {className}">
	<Button {...rest} {tall} bind:element variant="naked">
		<Slotted child={children} />
	</Button>
	<Button
		{disabled}
		onclick={() => {
			isOpen = true;
		}}
		{tall}
		variant="naked" 
		icon={{icon:chevron,rotation:isOpen ? 180 : 0}}
		class="chevron" />
</div>
{#if isOpen && !disabled}
	<Popper bind:isOpen parentNode={holder} stickToHookWidth={true} autoClose={true} {...popperProps}>
		<Slotted child={popperContent} />
	</Popper>
{/if}

<style global lang="scss">
	@use './button.scss';
	@use './button-action.scss';
</style>
