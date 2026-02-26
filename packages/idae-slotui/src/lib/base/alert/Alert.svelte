<script module lang="ts">
import type { Snippet } from 'svelte';
import Divider from '$lib/base/divider/Divider.svelte';
import { fade } from 'svelte/transition';
import Slotted from '$lib/utils/slotted/Slotted.svelte';
import IconButton from '$lib/controls/buttonIcon/ButtonIcon.svelte';
/**
 * @description:  Represents an alert message with customizable level, message, and slot support.
 * @property {string} [class] - Class name for the alert root element, allowing custom styling.
 * @property {HTMLDialogElement} [element] - Reference to the dialog element for imperative access.
 * @property {string} [level] - Alert level (e.g., 'info', 'warning', 'error'), used for color and icon.
 * @property {string} [message] - Main message to display in the alert body.
 * @property {boolean} [draggable] - If true, makes the alert dialog draggable by the user.
 * @property {boolean} [isOpen] - Controls the visibility of the alert dialog.
 * @property {Snippet} [children] - Slot for custom content inside the alert (replaces message if provided).
 * @property {Snippet} [alertTopButton] - Slot for a button or element in the alert header (e.g., actions).
 * @property {Snippet} [alertMessage] - Slot for additional message content below the header.
 * @property {Snippet} [alertButtonZone] - Slot for custom buttons or actions in the alert footer.
 * @property {Snippet} [alertButtonClose] - Slot for a custom close button in the header.
 */
export type AlertProps = {
	/**
	 * Class name for the alert root element, allowing custom styling.
	 */
	class?: string;

	/**
	 * Reference to the dialog element for imperative access.
	 */
	element?: HTMLDialogElement;

	/**
	 * Alert level (e.g., 'info', 'warning', 'error'), used for color and icon.
	 */
	level?: string;

	/**
	 * Main message to display in the alert body.
	 */
	message?: string;

	/**
	 * If true, makes the alert dialog draggable by the user.
	 */
	draggable?: boolean;

	/**
	 * Controls the visibility of the alert dialog.
	 */
	isOpen?: boolean;

	/**
	 * Slot for custom content inside the alert (replaces message if provided).
	 */
	children?: Snippet;

	/**
	 * Slot for a button or element in the alert header (e.g., actions).
	 */
	alertTopButton?: Snippet;

	/**
	 * Slot for additional message content below the header.
	 */
	alertMessage?: Snippet;

	/**
	 * Slot for custom buttons or actions in the alert footer.
	 */
	alertButtonZone?: Snippet;

	/**
	 * Slot for a custom close button in the header.
	 */
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
		class="alert {className} rounded border shadow-lg bg-[var(--alert-color-background)] border-[var(--alert-color-border)] min-w-[350px] p-0 inline-block relative overflow-hidden">
		<article class="dialog-content border-b-4 border-[var(--alert-color-border)] p-[var(--alert-pad)]">
			<header class="header-bar flex items-center gap-[var(--alert-gap-small,1rem)] p-[var(--alert-p-small)]">
				<div class="dot bg-themed-scheme-{level} border border-[var(--alert-color-border)] rounded h-4 w-1"></div>
				<div class="title flex-1 flex items-center">
					<Slotted child={children}>{message}</Slotted>
				</div>
				<Slotted child={alertTopButton} />
				<button data-close type="button" class="rounded m-1 p-1" onclick={() => { isOpen = !isOpen; }} aria-label="Close">
					<Slotted child={alertButtonClose}>
						<IconButton
							icon="window-close"
							variant="naked"
						/>
					</Slotted>
				</button>
			</header>
			{#if alertMessage}
				<Divider />
				{@render alertMessage()}
			{/if}
			{#if alertButtonZone}
				<footer class="dialog-footer flex justify-end p-[var(--alert-pad)] border-t border-[var(--alert-color-border)]">
					{@render alertButtonZone()}
				</footer>
			{/if}
		</article>
	</dialog>
{/if}  
	 
 

<style global lang="postcss">
	@reference "tailwindcss";

	:root {
		--alert-radius: var(--sld-radius-small);
		--alert-color-border: var(--sld-color-border);
		--alert-color-background: var(--sld-color-background);
		--alert-elevation: var(--sld-elevation-4);
		--alert-pad: var(--sld-pad-small);
		--alert-gap: var(--sld-gap-small);
	}

	dialog.alert {
		&[open="true"] {
			display: none;
		}
		position: relative;
		min-width: 350px;
		display: inline-block;
		border-radius: var(--alert-radius);
		border: 1px solid var(--alert-color-border);
		background-color: var(--alert-color-background);
		box-shadow: var(--alert-elevation);
		overflow: hidden;
		padding: 0;
	}

	dialog.alert article.dialog-content {
		padding: var(--alert-pad);
		border-bottom: 4px solid var(--alert-color-border);
	}

	dialog.alert article.dialog-content header.header-bar {
		display: flex;
		align-items: center;
		padding: var(--alert-pad-small);
		gap: var(--alert-gap-small, 1rem);
	}

	dialog.alert article.dialog-content header.header-bar .dot {
		display: inline-block;
		border: 1px solid var(--alert-color-border);
		border-radius: var(--alert-radius);
		height: 16px;
		width: 4px;
		transform: translate(-50%, 0);
	}

	dialog.alert article.dialog-content header.header-bar .title {
		flex: 1;
		display: flex;
		align-items: center;
	}

	dialog.alert article.dialog-content header.header-bar [data-close] {
		border-radius: var(--alert-radius);
		margin: 0.25rem;
		padding: 0.25rem;
	}

	dialog.alert article.dialog-content footer.dialog-footer {
		display: flex;
		justify-content: flex-end;
		padding: var(--alert-pad);
		border-top: 1px solid var(--alert-color-border);
	}

	dialog.alert article.dialog-content footer.dialog-footer button {
		margin-left: 1rem;
	}

	.bg-themed-scheme-discrete {
		color: black;
		text-shadow: 0 0 0.125rem #b3b3b3;
		background-color: #ccc;
	}

	.bg-themed-scheme-success {
		color: white;
		text-shadow: 0 0 0.125rem #004d00;
		background-color: green;
	}

	.bg-themed-scheme-info {
		color: black;
		text-shadow: 0 0 0.125rem #ffd324;
		background-color: #ffdd57;
	}

	.bg-themed-scheme-warning {
		color: black;
		text-shadow: 0 0 0.125rem #b49104;
		background-color: #e6b905;
	}

	.bg-themed-scheme-alert {
		color: black;
		text-shadow: 0 0 0.125rem #cc5c00;
		background-color: #ff7300;
	}

	.bg-themed-scheme-error {
		color: white;
		text-shadow: 0 0 0.125rem #cc0000;
		background-color: red;
	}
</style>
