<script module lang="ts">
	import type { Snippet } from "svelte";
	import type { ElementProps, CommonProps } from '$lib/types/index.js'; 
 
	export interface AlertProps extends CommonProps {
		/** alert level */
		level?: ElementProps["levels"];
		/** message to be shown */
		message?: string;
		/** make the alert draggable */
		draggable?: boolean;
		/** show or hide the alert */
		isOpen?: boolean;
		children?: Snippet;
		alertTopButton?: Snippet;
		alertMessage?: Snippet;
		alertButtonZone?: Snippet;
		alertButtonClose?: Snippet;
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { ExpandProps } from '$lib/types/index.js';
	// import type { AlertProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import IconButton from '$lib/controls/button/IconButton.svelte';

	let {
		class: className,
		message,
		draggable = false,
		level = $bindable<ElementProps['levels']>('info'),
		isOpen = $bindable<boolean>(false),
		element = $bindable<HTMLDialogElement>(),
		children,
		alertTopButton,
		alertMessage,
		alertButtonZone,
		alertButtonClose
	}: AlertProps = $props();

	export const actions: Record<'open' | 'toggle' | 'close', Function> = {
		open,
		toggle,
		close
	};

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
				<div class="dot bg-themed-scheme-{level}"></div>
				<div class="title">
					<Slotted child={children}>{message}</Slotted>
				</div>
				<Slotted child={alertTopButton} />
				<div data-close>
					<Slotted child={alertButtonClose}
						><IconButton
							icon="window-close"
							variant="naked"
							onclick={() => {
								isOpen = !isOpen;
							}}
							aria-label="Close"
						/></Slotted
					>
				</div>
			</header>
			{#if alertMessage}
				<Divider />
				{@render alertMessage()}
			{/if}
			{#if alertButtonZone}
				<footer class="dialog-footer">
					{@render alertButtonZone()}
				</footer>
			{/if}
		</article>
	</dialog>
{/if}

<style global> 
	@import './alert.tailwind.css';
</style>
