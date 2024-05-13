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
	}: BackdropProps = $props();

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
		<div bind:this={elementContent} class="backdrop-content">
			{#if isLoading}
				<div class="backdrop-content-loader">
					<slot name="backdropLoading">
						<Icon icon="mdi:loading" fontSize="large" rotate />
					</slot>
				</div>
			{:else}
				<div class="backdrop-content-inner" bind:this={elementContentInner}>
					<slot />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@import './backdrop.scss';
</style>
