<script module lang="ts">
import type { Snippet } from 'svelte';
/**
 * Props for the Alert component.
 * Represents an alert message with customizable level, message, and slot support.
 */
export type AlertProps = {
	/** Class name for the alert root */
	class?: string;
	/** Reference to the dialog element */
	element?: HTMLDialogElement;
	/** Alert level (e.g., info, warning, error) */
	level?: string;
	/** Message to be shown in the alert */
	message?: string;
	/** Make the alert draggable */
	draggable?: boolean;
	/** Show or hide the alert */
	isOpen?: boolean;
	/** Slot for children content */
	children?: Snippet;
	/** Slot for top button */
	alertTopButton?: Snippet;
	/** Slot for alert message */
	alertMessage?: Snippet;
	/** Slot for button zone */
	alertButtonZone?: Snippet;
	/** Slot for close button */
	alertButtonClose?: Snippet;
};
</script>

<script lang="ts">

	let {
	  class: className = '',
	  message,
	  draggable = false,
	  level = $bindable<string>('info'),
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

<style global lang="scss">
	@use './alert.scss';
</style>
