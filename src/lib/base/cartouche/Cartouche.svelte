<svelte:options runes={true} accessors={true} />

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class:stacked
	bind:this={element}
	class="cartouche {className}"
	data-bordered={bordered ?? false}
	{style}
>
	<div class="control {classes.control} dense-{dense}" onclick={actions.toggle}>
		{#if icon || cartoucheIcon || $$slots.cartoucheIcon}
			<div class="controlIcon {classes.controlIcon}">
				<Slotted child={cartoucheIcon}>
					<slot name="cartoucheIcon">
						<Icon {icon} />
					</slot>
				</Slotted>
			</div>
		{/if}
		<div class="controlLabel {classes.controlLabel}">
			{#if primary || cartouchePrimarySlot || $$slots.primarySlot}
				<Slotted child={cartouchePrimarySlot}>
					<slot name="primarySlot">{primary}</slot>
				</Slotted>
				<div>
					<Slotted child={cartoucheSecondarySlot}>
						<slot name="secondarySlot">{secondary ?? ''}</slot>
					</Slotted>
				</div>
			{/if}
		</div>
		<div class={showTitleDivider ? 'divider' : ''} style="flex:1" />
		{#if cartoucheButtons || $$slots.cartoucheButtons}
			<div
				onclick={(event) => {
					event.preventDefault();
					event.stopPropagation();
				}}
				class="cartoucheAction"
			>
				<Slotted child={cartoucheButtons}>
					<slot name="cartoucheButtons" /></Slotted
				>
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
			<Slotted child={children}>
				<slot />
			</Slotted>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './cartouche.scss';
</style>
