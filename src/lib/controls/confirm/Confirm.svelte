<script lang="ts">
	import { fade } from 'svelte/transition';
	import Button from '$lib/controls/button/Button.svelte';
	import { onDestroy } from 'svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ConfirmProps } from './types.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { ExpandProps } from '$lib/types/index.js';

	let step: string = $state('initial');

	let {
		class: className = '',
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
		confirmInitial,
		...rest
	}: ExpandProps<ConfirmProps> = $props();

	let rost = rest as HTMLAttributes<any>;

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

<!-- #todo <Content>somecontent</Content> -->

<div {...rost} class="confirm {className}">
	{#if step === 'initial'}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class={'confirm-initial ' + className}
			in:fade|global
			onclick={handleClickInitial}
			bind:this={initialRef}
			title={tooltipInitial}
		>
			<Slotted child={confirmInitial} slotArgs={{ step }}>
				<Button
					variant="naked"
					icon={{ icon: iconInitial, color: iconColorInitial }}
					primary={primaryInitial}
				/>
			</Slotted>
		</div>
	{/if}
	{#if step === 'confirm'}
		<div class={className + ' confirm-validate'} in:fade|global bind:this={contentRef}>
			<span>
				<Button onclick={handleClickCancel} variant="naked" icon={iconCancel} title="cancel" />
			</span>
			<Slotted child={children} slotArgs={{ step }}>
				<Button onclick={handleAction} {icon} size="auto" {primary} />
			</Slotted>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './confirm.scss';
</style>
