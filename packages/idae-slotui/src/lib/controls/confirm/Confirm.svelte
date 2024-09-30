<script lang="ts" generics="T=any">
	import { fade } from 'svelte/transition';
	import Button from '$lib/controls/button/Button.svelte';
	import { onDestroy } from 'svelte';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import type { ConfirmProps } from './types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let step: string = $state('initial'); 

	let {
		class: className = '',
		initialRef = null,
		contentRef = null,
		tooltipInitial = null,
		primaryInitial = '',
		primaryConfirm = '',
		iconInitial = '',
		iconColorInitial = 'inherit',
		primary = 'confirm',
		icon = 'check-circle-outline',
		iconColor = 'green',
		tall,
		autoClose = true,
		loading,
		data,
		action = () => {},
		iconCancel = { icon: 'mdi:cancel-bold', color: 'red',iconSize:'large' },
		variant,
		buttonInitial,
		buttonConfirm,
		buttonCancel,
		children,
		confirmInitial,
		...rest
	}: ConfirmProps<T> & Partial<Omit<HTMLDivElement, 'style'>> = $props();

	let rost = rest as HTMLAttributes<any>;

	let loadingState = $state(false);

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
		if (action) {
			if (action instanceof Promise) loadingState = true;

			try {
				loadingState = true;
				action(data).then(() => {
					loadingState = false;
					if (autoClose) step = 'initial';

					return data;
				});
			} catch (e) {
				if (typeof action == 'function') {
					action(data);
					if (autoClose) step = 'initial';
				}
			}
			/* Promise.resolve(action).then(
				() => { 
					loadingState = false;
					console.log('action done');
					if (autoClose) step = 'initial';
				},
				() => {
					console.log('action done done');
					if (autoClose) step = 'initial';
				}
			); */
		}
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
			{#if buttonInitial}
				<Button {tall} {variant} {...buttonInitial}  />
			{:else}
				<Button
					{tall}
					variant= {variant}
					width="full"
					icon={{ icon: iconInitial, color: iconColorInitial }}
					title={tooltipInitial}
				>
					{primaryInitial} 
				</Button>
			{/if} 
			</Slotted>
		</div>
	{/if}
	{#if step === 'confirm'}
			{#if buttonCancel}
				<Button {tall}   {...buttonCancel} onclick={(event:any)=>{handleClickCancel(event);buttonCancel?.onclick?.(event)}}    />
			{:else}
				<Button
					onclick={handleClickCancel}  
					variant= {'naked'}
					icon={iconCancel}
					{tall}
					title="cancel"
					value="cancel"
					width="auto"
				/>
			{/if}
		<div class={className + ' confirm-validate'} in:fade|global bind:this={contentRef}> 
			<Slotted child={children} slotArgs={{ step }}>
			{#if buttonConfirm}
				<Button {tall} {variant} {...buttonConfirm}  onclick={(event:any)=>{handleAction(event);buttonConfirm?.onclick?.(event)}}    />
			{:else}
				<Button
					title="confirm"
					loading={loadingState}
					{tall}
					onclick={handleAction}
					{icon} 
					variant= {variant}
					value={primaryConfirm}
				/>
			{/if}
			</Slotted>
		</div>
	{/if}
</div>

<style lang="scss">
	@import './confirm.scss';
</style>
