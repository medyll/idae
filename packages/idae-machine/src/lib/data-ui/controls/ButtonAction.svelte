<!--
ButtonAction.svelte
Generic toolbar/menu action button — dispatches a framer navigation for a record/collection.
Composable brick for toolbars (Fiche, lists…), main-menu tiles, and dock actions.

@prop {string} collection
@prop {string|number} [collectionId] - record id (omit for collection-level frames)
@prop {RegistryKey} frame - target frame type (componentRegistry key)
@prop {'loadFrame'|'loadInDialog'} [action='loadFrame'] - framer dispatch
@prop {string} [label] - button text (defaults to frame key)
@prop {string} [title] - tooltip
@prop {string} [icon] - Iconify icon name; bare names are prefixed with "typcn:"
@prop {Record<string,string>} [vars] - extra vars passed to framer
@prop {'default'|'primary'|'tile'} [variant='default'] - visual style
@prop {() => void} [afterRun] - callback fired after the framer dispatch
@snippet children - custom button content (overrides label/icon)
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';
	import type { RegistryKey } from '$lib/main/router/componentRegistry.js';

	let {
		collection,
		collectionId,
		frame,
		action = 'loadFrame',
		label,
		title,
		icon,
		vars,
		variant = 'default',
		afterRun,
		children
	}: {
		collection: string;
		collectionId?: string | number;
		frame: RegistryKey;
		action?: 'loadFrame' | 'loadInDialog';
		label?: string;
		title?: string;
		icon?: string;
		vars?: Record<string, string>;
		variant?: 'default' | 'primary' | 'tile';
		afterRun?: () => void;
		children?: Snippet;
	} = $props();

	function normalizeIcon(value: string | undefined, fallback = 'typcn:folder'): string {
		if (!value) return fallback;
		const trimmed = value.trim();
		if (!trimmed) return fallback;
		if (/^\d+$/.test(trimmed)) return fallback;
		if (/\s/.test(trimmed)) return fallback;
		if (trimmed.includes(':')) return trimmed;
		return `typcn:${trimmed}`;
	}

	function run(): void {
		if (action === 'loadInDialog') {
			void machine.framer.loadInDialog(frame, collection, collectionId, vars);
		} else {
			machine.framer.loadFrame(frame, collection, collectionId, vars);
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
		<span class="button-action-label">{label ?? frame}</span>
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
			gap: var(--gutter-xs, 0.25rem);
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			color: var(--color-text);
			cursor: pointer;
			font-size: 0.875rem;
			line-height: 1.2;
		}
		.button-action:hover {
			background: var(--color-hover);
		}
		.button-action--primary {
			background: var(--color-primary, #2563eb);
			border-color: var(--color-primary, #2563eb);
			color: var(--color-on-primary, #ffffff);
		}
		.button-action--primary:hover {
			background: var(--color-primary-hover, #1d4ed8);
			border-color: var(--color-primary-hover, #1d4ed8);
		}
		.button-action--tile {
			flex-direction: column;
			width: 6rem;
			height: 6rem;
			padding: var(--gutter-sm, 0.5rem);
			border-radius: var(--radius-md, 8px);
			background: var(--color-surface-alt, #f3f4f6);
			border-color: transparent;
			color: var(--color-text, #111827);
			text-align: center;
		}
		.button-action--tile:hover {
			background: var(--color-surface-elevated, #e5e7eb);
		}
		.button-action-icon :global(svg) {
			font-size: 1.25em;
			vertical-align: middle;
		}
		.button-action--tile .button-action-icon :global(svg) {
			font-size: 1.5rem;
		}
		.button-action-label {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
