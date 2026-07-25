<!--
ButtonAction.svelte
Generic toolbar/menu action button — dispatches a framer navigation for a record/collection.
Composable brick for toolbars (Fiche, lists…), main-menu tiles, and dock actions.

@prop {string} collection
@prop {string|number} [collectionId] - record id (omit for collection-level frames)
@prop {RegistryKey} pathKey - target componentRegistry/path key
@prop {'loadFrame'|'loadInDialog'} [action='loadFrame'] - framer dispatch
@prop {string} [label] - button text (defaults to path key)
@prop {string} [title] - tooltip
@prop {string} [icon] - Iconify icon name; bare names are prefixed with "ph:"
@prop {Record<string,string>} [vars] - extra vars passed to framer
@prop {'default'|'primary'|'tile'} [variant='default'] - visual style
@prop {() => void} [afterRun] - callback fired after the framer dispatch
@snippet children - custom button content (overrides label/icon)
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { RegistryKey } from '$lib/main/router/componentRegistry.js';

	export interface ButtonActionProps {
		collection: string;
		collectionId?: string | number;
		pathKey: RegistryKey;
		action?: 'loadFrame' | 'loadInDialog';
		label?: string;
		title?: string;
		icon?: string;
		vars?: Record<string, string>;
		variant?: 'default' | 'primary' | 'tile';
		afterRun?: () => void;
		children?: Snippet;
	}
</script>

<script lang="ts">
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		collectionId,
		pathKey,
		action = 'loadFrame',
		label,
		title,
		icon,
		vars,
		variant = 'default',
		afterRun,
		children
	}: ButtonActionProps = $props();

	function normalizeIcon(value: string | undefined, fallback = 'ph:folder'): string {
		if (!value) return fallback;
		const trimmed = value.trim();
		if (!trimmed) return fallback;
		if (/^\d+$/.test(trimmed)) return fallback;
		if (/\s/.test(trimmed)) return fallback;
		if (trimmed.includes(':')) return trimmed;
		return `ph:${trimmed}`;
	}

	function run(): void {
		if (action === 'loadInDialog') {
			void machine.framer.loadInDialog(pathKey, collection, collectionId, { vars });
		} else {
			machine.framer.loadFrame(pathKey, collection, collectionId, { vars });
		}
		afterRun?.();
	}
</script>

<button
	type="button"
	class="button-action"
	class:button-action--primary={variant === 'primary'}
	class:button-action--tile={variant === 'tile'}
	{title}
	onclick={run}
>
	{#if children}
		{@render children()}
	{:else}
		{#if icon}
			<span class="button-action-icon"><Icon icon={normalizeIcon(icon)} /></span>
		{/if}
		<span class="button-action-label">{label ?? pathKey}</span>
	{/if}
</button>

<style>
	@layer components {
		.button-action {
			all: unset;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: var(--gutter-xs);
			min-height: var(--control-height);
			padding: 0 var(--pad-sm);
			border: var(--border-width) solid var(--color-border-strong);
			background: var(--color-surface-raised);
			border-radius: var(--radius-sm);
			color: var(--color-text);
			cursor: pointer;
			font-size: var(--text-sm);
			line-height: var(--leading-none);
		}
		.button-action:hover {
			background: var(--color-surface-hover);
		}
		.button-action--primary {
			background: var(--color-primary);
			border-color: var(--color-primary-hover);
			color: var(--default-color-surface-light);
		}
		.button-action--primary:hover {
			background: var(--color-primary-hover);
			border-color: var(--color-primary-hover);
		}
		.button-action--tile {
			flex-direction: column;
			width: calc(var(--gutter-3xl) * 1.5);
			height: calc(var(--gutter-3xl) * 1.5);
			padding: var(--pad-sm);
			border-radius: var(--radius-xs);
			background: var(--color-surface-alt);
			border-color: transparent;
			color: var(--color-text);
			text-align: center;
		}
		.button-action--tile:hover {
			background: var(--color-surface-hover);
		}
		.button-action-icon :global(svg) {
			font-size: var(--icon-size-sm);
			vertical-align: middle;
		}
		.button-action--tile .button-action-icon :global(svg) {
			font-size: var(--icon-size-md);
		}
		.button-action-label {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
