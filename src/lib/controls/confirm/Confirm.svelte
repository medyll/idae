<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '$lib/controls/button/Button.svelte';
	import { onDestroy } from 'svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ConfirmProps } from './types.js';
	import Content from '$lib/utils/content/Content.svelte';

	let step: string = $state('initial');

	let {
		class: className = '',
		style,
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
		initial,
		...rest
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

<Content>somecontent</Content>
<div {style} {...rest} class="confirm {className}">
	{#if step === 'initial'}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class={'confirm-initial ' + className}
			in:fade|global
			onclick={handleClickInitial}
			bind:this={initialRef}
			title={tooltipInitial}
		>
			<Slotted child={initial}
				><slot name="initial"
					><Button
						variant="naked"
						iconColor={iconColorInitial}
						icon={iconInitial}
						primary={primaryInitial}
						title:tooltipInitial
					/></slot
				></Slotted
			>
		</div>
	{/if}
	{#if step === 'confirm'}
		<div class={className + ' confirm-validate'} in:fade|global bind:this={contentRef}>
			<span>
				<Button onclick={handleClickCancel} variant="naked" icon={iconCancel} title="cancel" />
			</span>
			<Slotted child={children}>
				<Button onclick={handleAction} {icon} size="auto" {primary} focus />
			</Slotted>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './confirm.scss';
</style>
