<svelte:options runes={true} accessors />

<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '$lib/base/icon/Icon.svelte';
	import type { CommonProps } from '$lib/types/index.js';

	/** Backdrop controller */
	const actionsnope = {
		close: () => {
			isOpen = false;
		},
		open: () => {
			isOpen = true;
		}
	};

	type Props = CommonProps & {
		/** backdrop class */
		class?: string;
		/** backdrop style */
		style?: string;
		/** 
			css position mode of the backdrop
			@type {'absolute' | 'fixed' | 'relative'}  
		*/
		flow?: 'absolute' | 'fixed' | 'relative';
		/** auto-close backdrop on click */
		autoClose?: boolean;
		/** show or hide the backdrop */
		isOpen?: boolean;
		/** if in loading state, it will show a loading icon or $$slots.loadingSlot */
		isLoading?: boolean;
		/** backdrop actions */
		actions?: Record<'open' | 'close', Function>;
		element?: HTMLDivElement;
		elementContent?: HTMLDivElement;
		elementContentInner?: HTMLDivElement;
		classes?: {
			backdrop?: string;
			backdropContent?: string;
			backdropContentInner?: string;
		};
	};
	let {
		class: className,
		style,
		flow = 'fixed',
		autoClose = false,
		isOpen = $bindable(),
		isLoading = false,
		actions = actionsnope,
		element,
		elementContent,
		elementContentInner,
		classes = {}
	} = $props() as Props;

	$effect(() => {
		element?.addEventListener('click', testAutoClose);
		elementContentInner?.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	});

	function testAutoClose() {
		if (autoClose) isOpen = false;
	}
</script>

{#if isOpen}
	<div
		in:fade|global
		out:fade|global
		bind:this={element}
		class="backdrop {className}"
		style="position:{flow};{style}"
		role="dialog"
		tabindex="-1"
	>
		<div bind:this={elementContent} class="backdropContent pos-abs h-full w-full">
			{#if isLoading}
				<div class="flex-h flex-align-middle-center">
					<slot name="backdropLoading">
						<Icon icon="mdi:loading" fontSize="large" rotate />
					</slot>
				</div>
			{:else}
				<div class="backdropContentInner" bind:this={elementContentInner}>
					<slot />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@import './backdrop.scss';
</style>
