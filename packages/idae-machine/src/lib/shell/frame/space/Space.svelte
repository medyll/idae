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
			<span class="space-tile-icon"><Icon icon="ph:list" /></span>
			<span class="space-tile-label">Parcourir {collection}</span>
		</button>
		<button type="button" class="space-tile" onclick={openCreate}>
			<span class="space-tile-icon"><Icon icon="ph:plus" /></span>
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
			gap: var(--gutter-sm);
			padding: var(--pad-sm);
			overflow-y: auto;
		}
		space-header {
			display: flex;
			align-items: baseline;
			gap: var(--gutter-sm);
		}
		space-header h2 {
			margin: 0;
			text-transform: capitalize;
		}
		.space-record {
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
		space-actions {
			display: flex;
			gap: var(--gutter-sm);
			flex-wrap: wrap;
		}
		.space-tile {
			all: unset;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--gutter-xs);
			width: calc(var(--gutter-3xl) * 1.75);
			height: calc(var(--gutter-3xl) * 1.75);
			padding: var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-xs);
			background: var(--color-surface-alt);
			color: var(--color-text);
			cursor: pointer;
			text-align: center;
		}
		.space-tile:hover {
			background: var(--color-surface-hover);
		}
		.space-tile-icon :global(svg) {
			font-size: var(--icon-size-md);
		}
		.space-tile-label {
			font-size: var(--text-sm);
			line-height: var(--leading-tight);
		}
		space-body {
			display: block;
		}
		.space-empty {
			color: var(--color-text-muted);
		}
	}
</style>
