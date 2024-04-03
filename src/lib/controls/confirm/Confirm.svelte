<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '$lib/controls/button/Button.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import type { CommonProps } from '$lib/types/index.js';

	let step: string = 'initial';

	type ConfirmProps = CommonProps & {
		/** class off the root component */
		class?: string;

		/** css style off the root component */
		style?: string;

		/** element initial HTMLDivElement props */
		initialRef?: HTMLElement | null;

		/** element confirm HTMLDivElement props */
		contentRef?: HTMLElement | null;

		/** text displayed on initial button */
		tooltipInitial?: string | null;

		/** text displayed on initial button */
		primaryInitial: string;

		/** icon displayed on the initial button */
		iconInitial: string;

		/** color of the icon displayed on the initial button */
		iconColorInitial: string;

		/** text displayed on confirm button */
		primary: string;

		/** icon displayed on the confirm button */
		icon: string;

		/** color of the icon displayed on the confirm button
		 * @type string
		 */
		iconColor: string;

		/** action initiated on confirmation */
		action: () => void;

		/** icon to display for back action */
		iconCancel: string;
		slots: {
			initial: Snippet;
		};
	};

	let {
		class: className = '',
		style = '',
		initialRef = null,
		contentRef = null,
		tooltipInitial = null,
		primaryInitial = '',
		iconInitial = '',
		iconColorInitial = 'inherit',
		primary = 'confirm',
		icon = 'check-circle-outline',
		iconColor = 'green',
		action = () => {},
		iconCancel = 'chevron-left',
		children,
		slots
	}: ConfirmProps = $props();

	function handleClickInitial(event: any) {
		event.preventDefault();
		event.stopPropagation();
		step = 'confirm';
	}

	function handleClickCancel(event: any) {
		event.preventDefault();
		event.stopPropagation();
		step = 'initial';
	}

	function handleAction(event: any) {
		event.preventDefault();
		event.stopPropagation();
		if (action) action();
	}

	onDestroy(() => {
		step = 'initial';
	});
</script>

{#if step === 'initial'}
	<span
		class={className}
		{style}
		in:fade|global
		on:click={handleClickInitial}
		bind:this={initialRef}
		title={tooltipInitial}
		role="button"
	>
		<slot name="initial"
			><Button
				naked
				iconColor={iconColorInitial}
				icon={iconInitial}
				primary={primaryInitial}
				title:tooltipInitial
			/></slot
		>
	</span>
{/if}
{#if step === 'confirm'}
	<span class={className + ' contentSlot'} {style} in:fade|global bind:this={contentRef}>
		<span on:click={handleClickCancel}>
			<Button naked icon={iconCancel} title="cancel" />
		</span>
		{#if children}
			{@render children()}
		{:else}
			<Button on:click={handleAction} {iconColor} {icon} size="auto" {primary} focus />
		{/if}
	</span>
{/if}

<style lang="scss">
	@import '../../styles/slotui-vars.scss';
	@import '../../styles/presets.scss';
	.contentSlot {
		display: flex;
		align-items: center;
	}
</style>
