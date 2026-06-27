<!--
MainMenuContent.svelte
Right-hand content of the global start menu.
Loaded via machine.framer.loadIn('main-menu-content' /* zone */, 'main-menu.content' /* frame key */, collection).

@prop {string} collection - currently selected collection
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let { collection }: { collection: string } = $props();

	const data = $derived(machine.store(collection, {}));
</script>

<main-menu-content-frame>
	<h4 class="mmc-title">{collection}</h4>
	<p class="mmc-meta">
		{data.records?.length ?? 0} enregistrement(s)
	</p>
	<main-menu-content-actions>
		<button
			type="button"
			class="mmc-action"
			onclick={() => machine.framer.loadFrame('space', collection)}
		>
			Espace
		</button>
		<button
			type="button"
			class="mmc-action"
			onclick={() => machine.framer.loadFrame('explorer', collection)}
		>
			Parcourir
		</button>
		<button
			type="button"
			class="mmc-action mmc-action--primary"
			onclick={() => machine.framer.loadInDialog('form', collection, undefined, { mode: 'create' })}
		>
			Créer
		</button>
	</main-menu-content-actions>
</main-menu-content-frame>

<style>
	@layer components {
		main-menu-content-frame {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-md, 1rem);
			padding: var(--gutter-md, 1rem);
			background: var(--color-surface, #ffffff);
			color: var(--color-text, #111827);
			overflow-y: auto;
		}
		.mmc-title {
			margin: 0;
			font-size: 1.125rem;
			font-weight: 600;
		}
		.mmc-meta {
			margin: 0;
			color: var(--color-text-muted, #6b7280);
			font-size: 0.875rem;
		}
		main-menu-content-actions {
			display: flex;
			gap: var(--gutter-sm, 0.5rem);
			flex-wrap: wrap;
		}
		.mmc-action {
			all: unset;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0.375rem 0.75rem;
			border-radius: var(--radius-sm, 4px);
			background: var(--color-surface-alt, #f3f4f6);
			border: 1px solid var(--color-border);
			color: var(--color-text, #111827);
			font-size: 0.875rem;
			cursor: pointer;
		}
		.mmc-action:hover {
			background: var(--color-surface-elevated, #e5e7eb);
		}
		.mmc-action--primary {
			background: var(--color-primary, #2563eb);
			border-color: var(--color-primary, #2563eb);
			color: var(--color-on-primary, #ffffff);
		}
		.mmc-action--primary:hover {
			background: var(--color-primary-hover, #1d4ed8);
			border-color: var(--color-primary-hover, #1d4ed8);
		}
	}
</style>
