<script lang="ts">
	import { fade } from 'svelte/transition';
	import Divider from '$lib/base/divider/Divider.svelte';
	import Button from '$lib/controls/button/Button.svelte';
	import type { ElementProps, ExpandProps } from '$lib/types/index.js';
	import type { AlertProps } from './types.js';
	import Slotted from '$lib/utils/slotted/Slotted.svelte';
	import IconButton from '$lib/controls/button/IconButton.svelte';

	export const actions: Record<'open' | 'toggle' | 'close', Function> = {
		open,
		toggle,
		close
	};

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
	}: ExpandProps<AlertProps> = $props();

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

<style lang="scss">
	@import './alert.scss';
</style>
