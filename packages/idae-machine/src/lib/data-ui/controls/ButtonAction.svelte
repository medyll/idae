<!--
ButtonAction.svelte
Generic toolbar action button — dispatches a framer navigation for a record/collection.
Composable brick for toolbars (Fiche, lists…). Replaces hardcoded inline buttons.

@prop {string} collection
@prop {string|number} [collectionId] - record id (omit for collection-level frames)
@prop {RegistryKey} frame - target frame type (componentRegistry key)
@prop {'loadFrame'|'loadInDialog'} [action='loadFrame'] - framer dispatch
@prop {string} [label] - button text (defaults to frame key)
@prop {string} [title] - tooltip
@prop {Record<string,string>} [vars] - extra vars passed to framer
@snippet children - custom button content (overrides label)
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { machine } from '$lib/main/machine.js';
	import type { RegistryKey } from '$lib/main/router/componentRegistry.js';

	let {
		collection,
		collectionId,
		frame,
		action = 'loadFrame',
		label,
		title,
		vars,
		children
	}: {
		collection: string;
		collectionId?: string | number;
		frame: RegistryKey;
		action?: 'loadFrame' | 'loadInDialog';
		label?: string;
		title?: string;
		vars?: Record<string, string>;
		children?: Snippet;
	} = $props();

	function run(): void {
		if (action === 'loadInDialog') {
			void machine.framer.loadInDialog(frame, collection, collectionId, vars);
		} else {
			machine.framer.loadFrame(frame, collection, collectionId, vars);
		}
	}
</script>

<button type="button" class="button-action" {title} onclick={run}>
	{#if children}{@render children()}{:else}{label ?? frame}{/if}
</button>

<style>
	@layer components {
		.button-action {
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: 0.875rem;
		}
		.button-action:hover {
			background: var(--color-hover);
		}
	}
</style>
