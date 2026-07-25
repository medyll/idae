<!--
MainMenuContent.svelte
Right-hand content of the global start menu.
Loaded via machine.framer.loadIn('main-menu.content', collection, { zone: 'main-menu-content' }).

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
			onclick={() => machine.framer.loadInDialog('form', collection, undefined, { vars: { mode: 'create' } })}
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
			gap: var(--gutter-sm);
			padding: var(--pad-sm);
			background: var(--color-surface-raised);
			color: var(--color-text);
			overflow-y: auto;
		}
		.mmc-title {
			margin: 0;
			font-size: var(--text-md);
			font-weight: var(--font-semibold);
		}
		.mmc-meta {
			margin: 0;
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
		main-menu-content-actions {
			display: flex;
			gap: var(--gutter-xs);
			flex-wrap: wrap;
		}
		.mmc-action {
			all: unset;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-height: var(--control-height);
			padding: 0 var(--pad-sm);
			border-radius: var(--radius-sm);
			background: var(--color-surface-raised);
			border: var(--border-width) solid var(--color-border-strong);
			color: var(--color-text);
			font-size: var(--text-sm);
			cursor: pointer;
		}
		.mmc-action:hover {
			background: var(--color-surface-hover);
		}
		.mmc-action--primary {
			background: var(--color-primary);
			border-color: var(--color-primary-hover);
			color: var(--default-color-surface-light);
		}
		.mmc-action--primary:hover {
			background: var(--color-primary-hover);
			border-color: var(--color-primary-hover);
		}
	}
</style>
