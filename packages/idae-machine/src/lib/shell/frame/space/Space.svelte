<!--
Space.svelte — collection workspace frame (zone main).
A dedicated landing page for a collection, distinct from explorer/list.
Mounted via machine.framer.loadFrame('space', collection).
-->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		collectionId,
		vars
	}: {
		collection: string;
		collectionId?: string | number;
		vars?: Record<string, string>;
	} = $props();

	function openExplorer(): void {
		machine.menu.verbs.explorer?.(collection);
	}

	function openCreate(): void {
		machine.menu.verbs.create?.(collection);
	}
</script>

<space-component>
	<space-header>
		<h2>Espace {collection}</h2>
		{#if collectionId != null}<span class="space-record">{collectionId}</span>{/if}
	</space-header>

	<space-actions>
		<button type="button" class="space-tile" onclick={openExplorer}>
			<span class="space-tile-icon"><Icon icon="typcn:th-list" /></span>
			<span class="space-tile-label">Parcourir {collection}</span>
		</button>
		<button type="button" class="space-tile" onclick={openCreate}>
			<span class="space-tile-icon"><Icon icon="typcn:plus" /></span>
			<span class="space-tile-label">Créer {collection}</span>
		</button>
	</space-actions>

	<space-body>
		<p class="space-empty">Espace {collection} — à enrichir.</p>
	</space-body>
</space-component>

<style>
	@layer components {
		space-component {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-lg, 1.5rem);
			padding: var(--gutter-lg, 1.5rem);
			overflow-y: auto;
		}
		space-header {
			display: flex;
			align-items: baseline;
			gap: var(--gutter-sm, 0.5rem);
		}
		space-header h2 {
			margin: 0;
			text-transform: capitalize;
		}
		.space-record {
			color: var(--color-text-muted, #888);
			font-size: var(--font-size-sm, 0.875rem);
		}
		space-actions {
			display: flex;
			gap: var(--gutter-md, 1rem);
			flex-wrap: wrap;
		}
		.space-tile {
			all: unset;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--gutter-xs, 0.25rem);
			width: 8rem;
			height: 8rem;
			padding: var(--gutter-sm, 0.5rem);
			border-radius: var(--radius-md, 8px);
			background: var(--color-surface-alt, #f3f4f6);
			color: var(--color-text, #111827);
			cursor: pointer;
			text-align: center;
		}
		.space-tile:hover {
			background: var(--color-surface-elevated, #e5e7eb);
		}
		.space-tile-icon :global(svg) {
			font-size: 1.75rem;
		}
		.space-tile-label {
			font-size: var(--font-size-sm, 0.875rem);
			line-height: 1.2;
		}
		space-body {
			display: block;
		}
		.space-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
