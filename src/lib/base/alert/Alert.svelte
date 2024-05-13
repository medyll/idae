<svelte:options accessors={true} runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { ElementProps } from '$lib/types/index.js';
	import type { AlertProps } from './types.js';

	const alertActions: Record<'open' | 'toggle' | 'close', Function> = {
		open,
		toggle,
		close
	};

	let {
		class: className,
		message,
		draggable = false,
		children,
		topButtonSlot,
		messageSlot,
		buttonZoneSlot,
		buttonCloseSlot,
		level = $bindable<ElementProps['levels']>('info'),
		isOpen = $bindable<boolean>(false),
		element = $bindable<HTMLDialogElement>(),
		actions = $bindable<Record<'open' | 'toggle' | 'close', Function>>(alertActions)
	}: AlertProps = $props();

	const handleClick = (event: Event) => {
		if ((event?.target as Element)?.getAttribute('data-close')) {
			event.stopPropagation();
			actions.close();
		}
	};

	$effect(() => {
		if (element) {
			element.addEventListener('click', handleClick, true);
		}
		return () => {
			if (element) {
				element.removeEventListener('click', handleClick);
			}
		};
	});

	function open() {
		isOpen = true;
	}
	function toggle() {
		isOpen = !isOpen;
	}
	function close() {
		isOpen = false;
	}
</script>

{#if isOpen}
	<dialog
		open={isOpen}
		{draggable}
		bind:this={element}
		transition:fade|global
		class="alert {className}"
	>
		<article class="dialog-content border-color-scheme-{level}">
			<header class="header-bar">
				<div class="dot bg-themed-scheme-{level}" />
				<div class="title">
					{#if children}
						{@render children()}
					{:else}
						{message}
					{/if}
				</div>
				{#if topButtonSlot}
					{@render topButtonSlot()}
				{/if}
				<div data-close>
					{#if buttonCloseSlot}
						{@render buttonCloseSlot()}
					{:else}
						<Button
							ratio="1/1"
							icon="window-close"
							variant="naked"
							onclick={() => {
								isOpen = !isOpen;
							}}
							aria-label="Close"
						/>
					{/if}
				</div>
			</header>
			{#if messageSlot}
				<Divider />
				{@render messageSlot()}
			{/if}
			{#if buttonZoneSlot}
				<footer class="dialog-footer">
					{@render buttonZoneSlot()}
				</footer>
			{/if}
		</article>
	</dialog>
{/if}

<style lang="scss">
	@import './alert.scss';
</style>
