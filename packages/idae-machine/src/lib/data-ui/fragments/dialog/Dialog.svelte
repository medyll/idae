<!--
Dialog.svelte — floating, draggable, non-modal frame (Svelte 5 runes).
A dialog IS a frame: it registers in machine.framer and mounts its content via the
shared host (componentRegistry). Rendered floating instead of filling a static zone.
Draggable by the header bar. Stacking via css-base --z-modal.
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { untrack, type Snippet } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { FrameControls } from '$lib/main/frame/MachineFrameManager.js';
	import { draggable, centerInViewport } from '$lib/data-ui/utils/draggable.js';

	type Props = {
		open?: boolean;
		id: string;
		modulePath?: string;
		collection?: string;
		collectionId?: string;
		vars?: Record<string, string>;
		iconClose?: string;
		center?: boolean;
		removeOnClose?: boolean;
		onClose?: () => void;
		header?: Snippet;
		footer?: Snippet;
		children?: Snippet;
	};

	let {
		open = $bindable(true),
		id,
		modulePath,
		collection,
		collectionId,
		vars,
		iconClose = 'mdi:close',
		center = true,
		removeOnClose = false,
		onClose = () => {},
		header,
		footer,
		children
	}: Props = $props();

	let element = $state<HTMLDialogElement>();
	let bodyEl = $state<HTMLDivElement>();
	let visible = $state(true);
	let title = $state('');

	// fill:false — a floating dialog is content-driven, so the mounted frame must
	// sit in normal flow (not absolute inset:0) for the dialog to grow to fit it.
	const host = machine.framer.createHost(() => bodyEl, { fill: false });

	function setTitle(col?: string, colId?: string) {
		if (!col) return;
		machine.framer.resolveLabel(col, colId).then((label) => {
			title = label ? `${col} — ${label}` : col;
		});
	}

	/** Raise above sibling dialogs: same --z-modal layer, DOM order decides paint order. */
	function raise() {
		const parent = element?.parentElement;
		if (parent && element && parent.lastElementChild !== element) {
			parent.appendChild(element);
		}
	}

	function focusDialog() {
		visible = true;
		raise();
		element?.focus();
	}

	const controls: FrameControls = {
		load: (mp, col, colId, v) => {
			host.load(mp, col, colId, v);
			setTitle(col, colId);
		},
		show: () => { visible = true; },
		hide: () => { visible = false; },
		toggle: () => { visible = !visible; },
		close: () => close(),
		focus: () => focusDialog()
	};

	$effect(() => {
		untrack(() => machine.framer.register(id, controls, { replace: true }));
		if (modulePath && collection) {
			host.load(modulePath, collection, collectionId, vars);
			setTitle(collection, collectionId);
		}
		return () => {
			untrack(() => machine.framer.unregister(id));
			host.destroy();
		};
	});

	$effect(() => {
		if (element && open && center) centerInViewport(element);
	});

	export function close() {
		host.destroy();
		untrack(() => machine.framer.unregister(id));
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
		tabindex="-1"
		style:display={visible ? 'flex' : 'none'}
		use:draggable={{ handle: '[data-drag-handle]' }}
		onpointerdown={raise}
		onkeydown={onKeydown}
		aria-label={title}
	>
		<header class="idae-dialog__bar" data-drag-handle>
			{#if header}
				{@render header()}
			{:else}
				<span class="idae-dialog__title">{title}</span>
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

		<div
			class="idae-dialog__body"
			class:idae-dialog__body--framed={!!modulePath}
			bind:this={bodyEl}
		>
			{#if !modulePath && children}{@render children()}{/if}
		</div>

		{#if footer}
			<footer class="idae-dialog__footer">{@render footer()}</footer>
		{/if}
	</dialog>
{/if}

<style lang="postcss">
	:global(dialog.idae-dialog) {
		z-index: var(--z-modal);
		isolation: isolate;
	}

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
		}

		:global(dialog.idae-dialog .idae-dialog__bar) {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
			padding: var(--pad-xs) var(--pad-sm);
			position: relative;
			z-index: var(--z-dropdown);
			cursor: grab;
			background: var(--color-surface-alt);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		:global(dialog.idae-dialog .idae-dialog__title) {
			flex: 1;
			font-size: var(--text-sm);
			font-weight: 600;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		:global(dialog.idae-dialog .idae-dialog__close) {
			margin-left: auto;
		}

		:global(dialog.idae-dialog .idae-dialog__body) {
			/* basis auto (not 0): dialog has no fixed height, so the body must
			   take its content size and let the dialog grow up to max-height. */
			flex: 1 1 auto;
			position: relative;
			min-height: 0;
			overflow: auto;
			padding: var(--pad-md);
		}

		:global(dialog.idae-dialog .idae-dialog__body--framed) {
			padding: 0;
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
