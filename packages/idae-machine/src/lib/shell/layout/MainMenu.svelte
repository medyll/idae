<!--
MainMenu.svelte — global start overlay. Two-zone layout:
  - main-menu-dock (left): vertical list of permitted+pref collections grouped by
    appscheme_base. Group labels are hidden.
  - main-menu-content (right): home (Today-like) when no collection selected;
    collection detail when a collection is selected.
Toggled from TaskBar's menu button via bind:open.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { useMenuTree } from '$lib/data-ui/utils/useMenuTree.svelte.js';
	import type { MenuItem } from '$lib/idae/menu/IdaeMenuStore.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const startMenu = useMenuTree(() => 'start');

	let selected = $state<MenuItem | undefined>(undefined);

	function select(item: MenuItem): void {
		selected = item;
	}

	function launchExplorer(collection: string): void {
		machine.menu.verbs.explorer?.(collection);
		open = false;
	}

	function launchCreate(collection: string): void {
		machine.menu.verbs.create?.(collection);
		open = false;
	}

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') open = false;
	}

	// Mock icon alternating by group index — the source icon field may contain
	// text tokens like "table", so we render a safe emoji instead for now.
	function mockIcon(groupIndex: number): string {
		return groupIndex % 2 === 0 ? '📁' : '📂';
	}
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
	<main-menu-component role="dialog" aria-modal="true">
		<button
			type="button"
			class="main-menu-backdrop"
			aria-label="Close backdrop"
			onclick={() => (open = false)}
		></button>

		<main-menu-panel>
			<button
				type="button"
				class="main-menu-close"
				aria-label="Close menu"
				onclick={() => (open = false)}
			>
				×
			</button>

			<main-menu-dock>
				{#each startMenu.tree.groups as group, groupIndex (group.key)}
					<main-menu-group>
						{#each group.items as item (item.key)}
							<button
								type="button"
								class="main-menu-dock-item"
								aria-pressed={selected?.collection === item.collection}
								onclick={() => select(item)}
							>
								<span class="main-menu-dock-item-icon">{mockIcon(groupIndex)}</span>
								<span class="main-menu-dock-item-label">{item.collection}</span>
								<span class="main-menu-dock-item-caret">▸</span>
							</button>
						{/each}
					</main-menu-group>
				{:else}
					<span class="main-menu-empty">—</span>
				{/each}
			</main-menu-dock>

			<main-menu-content>
				{#if selected}
					{@const collection = selected.collection}
					<main-menu-collection-header>
						<button
							type="button"
							class="main-menu-action main-menu-action--primary"
							onclick={() => launchCreate(collection)}
						>
							Créer {collection}
						</button>
					</main-menu-collection-header>

					<main-menu-collection-actions>
						<button
							type="button"
							class="main-menu-tile"
							onclick={() => launchExplorer(collection)}
						>
							<span class="main-menu-tile-icon">📄</span>
							<span class="main-menu-tile-label">Espace {collection}</span>
						</button>
						<button type="button" class="main-menu-tile">
							<span class="main-menu-tile-icon">🔍</span>
							<span class="main-menu-tile-label">Recherche rapide</span>
						</button>
					</main-menu-collection-actions>

					<main-menu-collection-links>
						<button type="button" class="main-menu-link">Parcourir</button>
						<button type="button" class="main-menu-link">Comparer</button>
						<button type="button" class="main-menu-link">Trier</button>
					</main-menu-collection-links>

					<main-menu-status-list>
						<div class="main-menu-status-row">
							<span class="main-menu-status-label">Total</span>
							<span class="main-menu-status-count">0</span>
						</div>
					</main-menu-status-list>

					<main-menu-recent-list>
						<h4>{collection.toUpperCase()}</h4>
						<span class="main-menu-empty">Aucun enregistrement récent</span>
					</main-menu-recent-list>
				{:else}
					<main-menu-home>
						<h3>Aujourd'hui</h3>
						<p class="main-menu-empty">Home du main-menu (mock)</p>
					</main-menu-home>
				{/if}
			</main-menu-content>
		</main-menu-panel>
	</main-menu-component>
{/if}

<style>
	@layer components {
		main-menu-component {
			display: flex;
			align-items: flex-start;
			justify-content: center;
			position: fixed;
			inset: 0;
			z-index: var(--z-modal, 1000);
			padding: var(--gutter-md, 1rem);
			background: rgba(0, 0, 0, 0.45);
			overflow: hidden;
		}
		.main-menu-backdrop {
			all: unset;
			position: absolute;
			inset: 0;
			z-index: -1;
			cursor: pointer;
		}
		main-menu-panel {
			display: flex;
			position: relative;
			width: 100%;
			max-width: 31.25rem;
			height: calc(100% - var(--gutter-md, 1rem) * 2);
			max-height: 48rem;
			background: var(--color-surface, #ffffff);
			border-radius: var(--radius-lg, 12px);
			box-shadow: var(--shadow-xl, 0 20px 60px rgba(0, 0, 0, 0.3));
			overflow: hidden;
		}
		.main-menu-close {
			all: unset;
			position: absolute;
			top: var(--gutter-sm, 0.5rem);
			right: var(--gutter-sm, 0.5rem);
			z-index: 1;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 2rem;
			height: 2rem;
			cursor: pointer;
			border-radius: var(--radius-full, 9999px);
			background: var(--color-surface-alt, #e5e7eb);
			color: var(--color-text, #111827);
			font-size: 1.25rem;
			line-height: 1;
		}
		.main-menu-close:hover {
			background: var(--color-surface-elevated, #d1d5db);
		}
		main-menu-dock {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
			width: 14rem;
			flex-shrink: 0;
			background: var(--color-surface-alt, #f3f4f6);
			color: var(--color-text, #111827);
			padding: var(--gutter-md, 1rem);
			padding-top: 2.5rem;
			overflow-y: auto;
		}
		main-menu-group {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
		}
		.main-menu-dock-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.375rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
			color: inherit;
		}
		.main-menu-dock-item:hover,
		.main-menu-dock-item[aria-pressed='true'] {
			background: var(--color-surface-elevated, rgba(0, 0, 0, 0.08));
		}
		.main-menu-dock-item-icon {
			display: inline-flex;
			width: 1.25rem;
			justify-content: center;
		}
		.main-menu-dock-item-label {
			flex: 1;
		}
		.main-menu-dock-item-caret {
			display: inline-flex;
			opacity: 0.6;
		}
		main-menu-content {
			display: flex;
			flex-direction: column;
			flex: 1;
			gap: var(--gutter-lg, 1.5rem);
			padding: var(--gutter-lg, 1.5rem);
			padding-top: 2.5rem;
			overflow-y: auto;
			background: var(--color-surface, #ffffff);
			color: var(--color-text, #111827);
		}
		main-menu-collection-header {
			display: flex;
		}
		main-menu-collection-actions {
			display: flex;
			gap: var(--gutter-md, 1rem);
			flex-wrap: wrap;
		}
		main-menu-collection-links {
			display: flex;
			gap: var(--gutter-md, 1rem);
		}
		main-menu-status-list {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
		}
		main-menu-recent-list {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		main-menu-home {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		.main-menu-action {
			all: unset;
			cursor: pointer;
			padding: 0.5rem 1rem;
			border-radius: var(--radius-sm, 4px);
			background: var(--color-surface-elevated);
			border: 1px solid var(--color-border);
		}
		.main-menu-action--primary {
			background: var(--color-primary, #3b82f6);
			color: var(--color-text-on-primary, #fff);
			border-color: transparent;
		}
		.main-menu-tile {
			all: unset;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 1rem 1.5rem;
			border-radius: var(--radius-md, 8px);
			border: 1px solid var(--color-border);
			min-width: 8rem;
		}
		.main-menu-tile-icon {
			font-size: 1.5rem;
		}
		.main-menu-link {
			all: unset;
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.main-menu-link:hover {
			background: var(--color-surface-alt);
		}
		.main-menu-status-row {
			display: flex;
			justify-content: space-between;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.main-menu-status-row:hover {
			background: var(--color-surface-alt);
		}
		.main-menu-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
