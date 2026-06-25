<!--
MainMenu.svelte — global start overlay. Columns per appscheme_base, each listing
permitted+pref collections (zone 'start', pref app_menu_start). Toggled from TaskBar's
menu button via bind:open. Consumes useMenuTree('start') — no inline rights/prefs joins.
Launch verbs resolved via machine.menu.verbs directly (IdaeMenuManager.launch() keys
verbs by collection, not verb-name, see CLAUDE.md note).
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { useMenuTree } from '$lib/data-ui/utils/useMenuTree.svelte.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const startMenu = useMenuTree(() => 'start');

	function launch(collection: string): void {
		machine.menu.verbs.explorer?.(collection);
		open = false;
	}

	function launchAll(items: Array<{ collection: string }>): void {
		for (const item of items) machine.menu.verbs.explorer?.(item.collection);
		open = false;
	}

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
	<main-menu-component role="dialog" aria-modal="true">
		<button
			type="button"
			class="main-menu-backdrop"
			aria-label="Close"
			onclick={() => (open = false)}
		></button>
		{#each startMenu.tree.groups as group (group.key)}
			<main-menu-column>
				<h3>{group.label}</h3>
				<button
					type="button"
					class="main-menu-launch-all"
					onclick={() => launchAll(group.items)}
				>
					Tout ouvrir
				</button>
				{#each group.items as item (item.key)}
					<button type="button" class="main-menu-item" onclick={() => launch(item.collection)}>
						{#if item.icon}<span class="main-menu-item-icon">{item.icon}</span>{/if}
						{item.label}
					</button>
				{/each}
			</main-menu-column>
		{:else}
			<span class="main-menu-empty">—</span>
		{/each}
	</main-menu-component>
{/if}

<style>
	@layer components {
		main-menu-component {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
			gap: var(--gutter-lg, 1.5rem);
			position: fixed;
			inset: 0;
			z-index: var(--z-modal, 1000);
			padding: var(--gutter-xl, 3rem);
			background: var(--color-surface);
			overflow-y: auto;
		}
		.main-menu-backdrop {
			all: unset;
			position: absolute;
			inset: 0;
			z-index: -1;
			cursor: pointer;
		}
		main-menu-column {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		.main-menu-launch-all {
			all: unset;
			cursor: pointer;
			font-size: 0.8125rem;
			color: var(--color-text-muted, #888);
			padding: 0.125rem 0;
		}
		.main-menu-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.main-menu-item:hover {
			background: var(--color-surface-alt);
		}
		.main-menu-item-icon {
			display: inline-block;
		}
		.main-menu-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
