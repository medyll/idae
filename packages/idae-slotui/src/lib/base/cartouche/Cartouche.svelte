<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import IconButton from '$lib/controls/button/IconButton.svelte';
	import type { CartoucheClasses, CartoucheProps } from './types.js';
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
	class="cartouche {className}"
	data-bordered={bordered ?? false}
	aria-expanded={isOpen} 
	{style}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="control {classes.control} tall-{tall}" {tall} onclick={actions.toggle}>
		{#if icon || cartoucheIcon}
			<div class="controlIcon {classes.controlIcon}">
				<Slotted child={cartoucheIcon}>
					<Icon {icon} />
				</Slotted>
			</div>
		{/if}
		<div class="controlLabel {classes.controlLabel}">
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
		<div class="chevron">
			<Button variant="flat"   icon={chevronIcon} />
		</div>
	</div>
	{#if isOpen || keepCartoucheContent}
	<div class="content-wrapper" aria-expanded={isOpen}>	
		<div aria-expanded={isOpen} class="content {classes.content}" transition:slide>
			{#if Component}
				<Component  {...componentProps} />
			{/if}
			<Slotted child={children} />
		</div>
	</div>
	{/if}
</div>

<style global lang="scss">
	@use './cartouche.scss';
</style>
