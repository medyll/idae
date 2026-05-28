<!--
Dialog.svelte — floating, draggable, non-modal dialog (Svelte 5 runes).
Draggable by the header bar ([data-drag-handle]). Stacking via css-base --z-modal.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { draggable, centerInViewport } from '$lib/data-ui/utils/draggable.js';

	type Props = {
		open?: boolean;
		iconClose?: string;
		/** Center on first mount. */
		center?: boolean;
		/** Remove from DOM when closed (used by imperative openDialog). */
		removeOnClose?: boolean;
		onClose?: () => void;
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
	};

	let {
		open = $bindable(true),
		iconClose = 'mdi:close',
		center = true,
		removeOnClose = false,
		onClose = () => {},
		children,
		header,
		footer
	}: Props = $props();

	let element = $state<HTMLDialogElement>();

	$effect(() => {
		if (element && open && center) centerInViewport(element);
	});

	export function close() {
		open = false;
		onClose();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

{#if open}
	<dialog
		bind:this={element}
		open
		class="idae-dialog"
		use:draggable={{ handle: '[data-drag-handle]' }}
		onkeydown={onKeydown}
	>
		<header class="idae-dialog__bar" data-drag-handle>
			{#if header}
				{@render header()}
			{/if}
			<button
				type="button"
				class="btn-icon btn-sm idae-dialog__close"
				aria-label="Close"
				onclick={close}
			>
				<Icon icon={iconClose} />
			</button>
		</header>

		<div class="idae-dialog__body">
			{#if children}{@render children()}{/if}
		</div>

		{#if footer}
			<footer class="idae-dialog__footer">{@render footer()}</footer>
		{/if}
	</dialog>
{/if}

<style lang="postcss">
	@layer components {
		:global(dialog.idae-dialog) {
			position: fixed;
			top: 0;
			left: 0;
			margin: 0;
			padding: 0;
			min-width: 260px;
			max-height: 90vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			color: var(--color-text);
			background: var(--color-surface-raised);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-md);
			box-shadow: var(--shadow-lg);
			z-index: var(--z-modal);
		}

		:global(dialog.idae-dialog .idae-dialog__bar) {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			padding: var(--pad-xs) var(--pad-sm);
			cursor: grab;
			background: var(--color-surface-alt);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		:global(dialog.idae-dialog .idae-dialog__close) {
			margin-left: auto;
		}

		:global(dialog.idae-dialog .idae-dialog__body) {
			flex: 1;
			overflow: auto;
			padding: var(--pad-md);
		}

		:global(dialog.idae-dialog .idae-dialog__footer) {
			display: flex;
			justify-content: flex-end;
			gap: var(--gutter-sm);
			padding: var(--pad-sm) var(--pad-md);
			border-top: var(--border-width) solid var(--color-border);
		}
	}
</style>
