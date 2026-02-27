<script module lang="ts">
import type { Snippet } from 'svelte';
import type { ButtonProps } from '../button/Button.svelte';
/**
 * Props for the Confirm component.
 * Represents a confirm dialog with customizable steps, actions, and slot content.
 */
export type ConfirmProps<T = any> = {
	/** Class name for the root element. */
	class?: string;
	/** Data sent on confirm. */
	data?: T;
	/** Ref for the initial element. */
	initialRef?: HTMLElement | null;
	/** Ref for the confirm content element. */
	contentRef?: HTMLElement | null;
	/** Tooltip for the initial button. */
	tooltipInitial?: string | null;
	/** Text for the initial button. */
	primaryInitial?: string;
	/** Text for the confirm button. */
	primaryConfirm: string;
	/** Icon for the initial button. */
	iconInitial?: string;
	/** Color for the initial icon. */
	iconColorInitial?: string;
	/** Text for the confirm button. */
	primary?: string;
	/** Icon for the confirm button. */
	icon?: any;
	/** Height preset for the button. */
	tall?: string;
	/** Variant for the button. */
	variant?: string;
	/** Color for the confirm icon. */
	iconColor?: string;
	/** Icon size for the confirm icon. */
	iconSize?: string;
	/** Auto-close after confirm. */
	autoClose?: boolean;
	/** Loading state for the confirm button. */
	loading?: boolean;
	/** Icon for loading state. */
	iconLoading?: any;
	/** Action to perform on confirm. */
	action?: Promise<T> | ((data?: T) => void);
	/** Icon for cancel action. */
	iconCancel?: any;
	/** Props for the initial button. */
	buttonInitial?: ButtonProps;
	/** Props for the confirm button. */
	buttonConfirm?: ButtonProps;
	/** Props for the cancel button. */
	buttonCancel?: ButtonProps;
	/** Slot for children content. */
	children?: Snippet;
	/** Slot for initial confirm content. */
	confirmInitial?: Snippet;
};
</script>

<script lang="ts" generics="T=any">
import { fade } from 'svelte/transition';
import Button from '$lib/controls/button/Button.svelte';
import { onDestroy } from 'svelte';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
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
	iconCancel = { icon: 'mdi:cancel-bold', color: 'red', iconSize: 'large' },
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

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--confirm-radius: var(--sld-radius-medium);
		--confirm-bg: var(--sld-color-background);
		--confirm-border: var(--sld-color-border);
		--confirm-padding: 1rem;
	}

	.confirm {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: var(--confirm-radius);
		background: var(--confirm-bg);
		border: 1px solid var(--confirm-border);
		padding: var(--confirm-padding);
		font-size: 1em;
	}

	.confirm-initial {}

	.confirm-validate { display: flex; align-items: center; }
</style>
