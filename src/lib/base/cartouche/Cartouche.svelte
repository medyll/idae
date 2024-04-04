<svelte:options runes={true} accessors={true} />

<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { SvelteComponent } from 'svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { IconProps } from '@iconify/svelte';
	import type { CommonProps, ElementProps } from '$lib/types/index.js';

	type CartoucheClasses = {
		control: string;
		controlIcon: string;
		controlLabel: string;
		content: string;
	};

	type CartoucheProps = CommonProps & {
		/** className off the root component */
		class?: string;
		/** classNames off the whole component */
		classes: CartoucheClasses;
		/** css style off the root component */
		style?: string;
		/** element root HTMLDivElement props */
		element?: HTMLDivElement;
		/** displayed title of the cartouche */
		primary: string;
		/** displayed sub title of the cartouche */
		secondary?: string;
		icon?: string;
		iconProps: IconProps;
		/** can be set as a prop or as a className */
		stacked: boolean;
		component?: SvelteComponent;
		componentProps: Record<string, any>;
		/** State of content is preserved while visibility is toggled */
		keepCartoucheContent: boolean;
		/** show the title divider line */
		showTitleDivider: boolean;
		/** show the default border style */
		bordered: boolean;
		isOpen: boolean;
		/** component actions
		 * @type {Record<'open'|'toggle' | 'close', Function>}
		 */
		actions: Record<'open' | 'toggle' | 'close', Function>;

		dense: ElementProps['dense'];
	};

	let {
		class: className = '',
		classes = {} as CartoucheClasses,
		style = undefined,
		element,
		primary = '',
		secondary = undefined,
		icon = undefined,
		iconProps = {} as IconProps,
		stacked = false,
		component = undefined,
		componentProps = {},
		keepCartoucheContent = true,
		showTitleDivider = false,
		bordered = true,
		isOpen = $bindable(false),
		dense,
		actions = {
			open,
			toggle,
			close
		}
	}: CartoucheProps = $props();

	function open() {
		isOpen = true;
	}
	function toggle() {
		isOpen = !isOpen;
	}
	function close() {
		isOpen = false;
	}

	const chevronIcon = !isOpen ? 'chevron-down' : 'chevron-up';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class:stacked
	bind:this={element}
	class="cartouche {className}"
	data-bordered={bordered ?? false}
	{style}
>
	<div class="control {classes.control} dense-{dense}" on:click={actions.toggle}>
		{#if icon || iconProps || $$slots.cartoucheIcon}
			<div class="controlIcon {classes.controlIcon}">
				<slot name="cartoucheIcon">
					<Icon {icon} {...iconProps} />
				</slot>
			</div>
		{/if}
		<div class="controlLabel {classes.controlLabel}">
			{#if primary || $$slots.primarySlot}
				<slot name="primarySlot">{primary}</slot>
				<div><slot name="secondarySlot">{secondary ?? ''}</slot></div>
			{/if}
		</div>
		<div class={showTitleDivider ? 'divider' : ''} style="flex:1" />
		{#if $$slots.cartoucheButtons}
			<div
				on:click={(event) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				class="cartoucheAction"
			>
				<slot name="cartoucheButtons" />
			</div>
		{/if}
		<div class="chevron">
			<Button variant="naked" icon={chevronIcon} />
		</div>
	</div>
	{#if isOpen || keepCartoucheContent}
		<div aria-expanded={isOpen} class="content {classes.content}" transition:slide|global>
			{#if component}
				<svelte:component this={component} {...componentProps} />
			{/if}
			<slot />
		</div>
	{/if}
</div>

<style lang="scss">
	@import './cartouche.scss';
</style>
