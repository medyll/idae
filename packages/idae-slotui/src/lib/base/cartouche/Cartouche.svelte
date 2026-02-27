<script module lang="ts">
import type { CommonProps, ElementProps } from '$lib/types/index.js';
import type { Snippet, SvelteComponent } from 'svelte';
/**
 * CSS class names for Cartouche sub-elements.
 */
export type CartoucheClasses = {
	control: string;
	controlIcon: string;
	controlLabel: string;
	content: string;
};

/**
 * Props for the Cartouche component.
 * Represents a card-like container with title, subtitle, icon, and flexible slots.
 */
export type CartoucheProps = CommonProps & {
	/** CSS class for the root element */
	class?: string;
	/** Custom class names for sub-elements */
	classes?: CartoucheClasses;
	/** Inline style for the root element */
	style?: string;
	/** Reference to the root HTMLDivElement */
	element?: HTMLDivElement;
	/** Title text for the cartouche */
	primary: string;
	/** Subtitle text for the cartouche */
	secondary?: string;
	/** Icon name for the cartouche */
	icon?: ElementProps["icon"];
	/** If true, layout is stacked */
	stacked?: boolean;
	/** Svelte component to render inside the cartouche */
	component?: SvelteComponent;
	/** Props to pass to the rendered component */
	componentProps?: Record<string, any>;
	/** Preserve content state while toggling visibility */
	keepCartoucheContent?: boolean;
	/** Show a divider line below the title */
	showTitleDivider?: boolean;
	/** Show a border around the cartouche */
	bordered?: boolean;
	/** Whether the cartouche is open */
	isOpen?: boolean;
	/** Actions for the cartouche (open, toggle, close) */
	actions?: Record<'open' | 'toggle' | 'close', (event: Event) => void>;
	/** @deprecated: Use tall instead */
	dense?: ElementProps["dense"];
	/** Preset for cartouche height */
	tall?: ElementProps["tall"];
	/** Slot for children content */
	children?: Snippet;
	/** Slot for the icon */
	cartoucheIcon?: Snippet;
	/** Slot for the primary title */
	cartouchePrimary?: Snippet;
	/** Slot for the secondary title */
	cartoucheSecondary?: Snippet;
	/** Slot for the buttons */
	cartoucheButtons?: Snippet;
};
</script>
<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ExpandProps } from '$lib/types/index.js';

	export const actions = {
		open,
		toggle,
		close
	};

	let {
		class: className = '',
		classes = {} as CartoucheClasses,
		style = undefined,
		element = $bindable(),
		primary,
		secondary,
		icon,
		stacked = false,
		component,
		componentProps = {},
		keepCartoucheContent = true,
		showTitleDivider = false,
		bordered = false,
		children,
		cartoucheIcon,
		cartouchePrimary,
		cartoucheSecondary,
		cartoucheButtons,
		isOpen = $bindable(),
		dense,
		tall = "small"
	}: ExpandProps<CartoucheProps> = $props();

	function open() {
		isOpen = true;
	}
	function toggle(event: Event) {
		isOpen = !isOpen;
	}
	function close() {
		isOpen = false;
	}

	const chevronIcon = $derived(!isOpen ? 'chevron-down' : 'chevron-up');

	let Component = $state(component);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class:stacked
	bind:this={element}
	class="cartouche {className} overflow-hidden rounded shadow-sm bg-[var(--cartouche-background-color)]"
	data-bordered={bordered ?? false}
	aria-expanded={isOpen} 
	{style}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="control {classes.control} tall-{tall} flex items-center gap-[var(--cartouche-control-gap)] cursor-pointer px-1 py-0.5 bg-[var(--cartouche-background-color)] hover:bg-[var(--cartouche-background-color-hover)]" {tall} onclick={actions.toggle}>
		{#if icon || cartoucheIcon}
			<div class="controlIcon {classes.controlIcon} flex items-center px-2">
				<Slotted child={cartoucheIcon}>
					<Icon {icon} />
				</Slotted>
			</div>
		{/if}
		<div class="controlLabel {classes.controlLabel} cursor-pointer px-2">
			{#if primary || cartouchePrimary}
				<Slotted child={cartouchePrimary}>
					{primary}
				</Slotted>
				<div>
					<Slotted child={cartoucheSecondary}>
						{secondary ?? ''}
					</Slotted>
				</div>
			{/if}
		</div>
		<div class={showTitleDivider ? 'divider' : ''} style="flex:1" />
		{#if cartoucheButtons}
			<div
				onclick={(event) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				class="cartouche-control-actions"
			>
				<Slotted child={cartoucheButtons}></Slotted>
			</div>
		{/if}
		<div class="chevron cursor-pointer p-2 flex items-center">
			<Button variant="flat" icon={chevronIcon} />
		</div>
	</div>
	{#if isOpen || keepCartoucheContent}
	<div class="content-wrapper" aria-expanded={isOpen}>	
		<div aria-expanded={isOpen} class="content {classes.content} overflow-hidden bg-[var(--cartouche-background-color)] p-1 pt-0 rounded" transition:slide>
			{#if Component}
				<Component  {...componentProps} />
			{/if}
			<Slotted child={children} />
		</div>
	</div>
	{/if}
</div>

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--cartouche-radius: var(--sld-radius-large);
		--cartouche-bg: var(--sld-color-cartouche-bg);
		--cartouche-color: var(--sld-color-cartouche-text);
		--cartouche-padding: 1rem 2rem;
	}

	.cartouche {
		border-radius: var(--cartouche-radius);
		background: var(--cartouche-bg);
		color: var(--cartouche-color);
		padding: var(--cartouche-padding);
		font-size: 1.1em;
		font-weight: 500;
	}
</style>
