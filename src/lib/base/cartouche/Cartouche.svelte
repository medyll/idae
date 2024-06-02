<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { CartoucheClasses, CartoucheProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';

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
		bordered = true,
		children,
		cartoucheIcon,
		cartouchePrimary: cartouchePrimarySlot,
		cartoucheSecondary: cartoucheSecondarySlot,
		cartoucheButtons,
		isOpen = $bindable(false),
		dense,
		tall,
		actions = {
			open,
			toggle,
			close
		}
	}: CartoucheProps = $props();

	function open() {
		isOpen = true;
	}
	function toggle(event: Event) {
		isOpen = !isOpen;
	}
	function close() {
		isOpen = false;
	}

	const chevronIcon = !isOpen ? 'chevron-down' : 'chevron-up';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class:stacked
	bind:this={element}
	class="cartouche {className}"
	data-bordered={bordered ?? false}
	{style}
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="control {classes.control} dense-{dense}" onclick={actions.toggle}>
		{#if icon || cartoucheIcon}
			<div class="controlIcon {classes.controlIcon}">
				<Slotted child={cartoucheIcon}>
					<Icon {icon} />
				</Slotted>
			</div>
		{/if}
		<div class="controlLabel {classes.controlLabel}">
			{#if primary || cartouchePrimarySlot}
				<Slotted child={cartouchePrimarySlot}>
					{primary}
				</Slotted>
				<div>
					<Slotted child={cartoucheSecondarySlot}>
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
				class="cartoucheAction"
			>
				<Slotted child={cartoucheButtons}></Slotted>
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

			<Slotted child={children} />
		</div>
	{/if}
</div>

<style lang="scss">
	@import './cartouche.scss';
</style>
