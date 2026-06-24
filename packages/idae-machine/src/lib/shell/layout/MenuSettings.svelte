<!--
MenuSettings.svelte — BL-18. Per-zone settings gear: replaces the mock TaskBar ⚙.
For each menu zone (side/start/create/panel) toggles which PERMITTED collections show,
writing appuser_prefs via machine.action (upsertOn ['code'], keys from menuPrefs.ts).
"Unset" stays distinct from "explicitly hidden" — toggling back to the default visible
state does not delete the pref row, it just flips its value back to true (BL-12 policy:
an absent key already means visible, so writing `true` is a no-op for visibility but
keeps the row, matching the simplest machine.action upsert contract).
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import {
		MENU_ZONES,
		menuPrefsScope,
		isMenuCollectionVisible,
		readMenuPrefsFromRecords,
		type MenuZone
	} from '$lib/data-ui/utils/menuPrefs.js';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	const zones = Object.keys(MENU_ZONES) as MenuZone[];
	let activeZone = $state<MenuZone>('side');

	const appschemeSrc = machine.store('appscheme');
	const prefsSrc = machine.store('appuser_prefs');

	const permitted = machine.rights.allowedCollections('L');

	const prefs = $derived.by(() => {
		const userId = machine.rights.currentUser?.id;
		if (userId == null) return {} as Record<string, unknown>;
		return readMenuPrefsFromRecords(
			prefsSrc.records as Array<{ code?: unknown; value?: unknown }>,
			userId
		);
	});

	type Row = { collection: string; label: string; checked: boolean };

	const rows = $derived.by((): Row[] => {
		const appscheme = appschemeSrc.records as Array<{ code: string; name?: string }>;
		return permitted
			.map((collection) => {
				const scheme = appscheme.find((s) => s.code === collection);
				return {
					collection,
					label: scheme?.name ?? collection,
					checked: isMenuCollectionVisible(activeZone, collection, prefs, false)
				};
			})
			.sort((a, b) => a.label.localeCompare(b.label));
	});

	const hasPrefsForZone = $derived(
		permitted.some((c) => menuPrefsScope(activeZone, c) in prefs)
	);

	function toggle(row: Row): void {
		const userId = machine.rights.currentUser?.id;
		if (userId == null) return;
		void machine.action(
			'appuser_prefs',
			{ code: `${userId}:${menuPrefsScope(activeZone, row.collection)}`, value: !row.checked },
			{ upsertOn: ['code'] }
		);
	}
</script>

{#if open}
	<menu-settings-component role="dialog" aria-modal="true">
		<button type="button" class="menu-settings-backdrop" aria-label="Close" onclick={() => (open = false)}
		></button>

		<menu-settings-tabs>
			{#each zones as zone (zone)}
				<button
					type="button"
					class="menu-settings-tab"
					aria-pressed={activeZone === zone}
					onclick={() => (activeZone = zone)}
				>
					{zone}
				</button>
			{/each}
		</menu-settings-tabs>

		{#if !hasPrefsForZone}
			<p class="menu-settings-warning">Aucune préférence configurée pour cette zone — tout est visible par défaut.</p>
		{/if}

		<menu-settings-zone>
			{#each rows as row (row.collection)}
				<button
					type="button"
					class="menu-settings-toggle"
					aria-pressed={row.checked}
					onclick={() => toggle(row)}
				>
					<span class="menu-settings-toggle-check">{row.checked ? '☑' : '☐'}</span>
					{row.label}
				</button>
			{:else}
				<span class="menu-settings-empty">—</span>
			{/each}
		</menu-settings-zone>
	</menu-settings-component>
{/if}

<style>
	@layer components {
		menu-settings-component {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-md, 1rem);
			position: fixed;
			inset: 10% 25%;
			z-index: var(--z-modal, 1000);
			padding: var(--gutter-lg, 1.5rem);
			background: var(--color-surface);
			border-radius: var(--radius-md, 8px);
			box-shadow: var(--shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.2));
			overflow-y: auto;
		}
		.menu-settings-backdrop {
			all: unset;
			position: fixed;
			inset: 0;
			z-index: -1;
			cursor: pointer;
		}
		menu-settings-tabs {
			display: flex;
			gap: var(--gutter-sm, 0.5rem);
			border-bottom: var(--border-width) solid var(--color-border);
			padding-bottom: var(--gutter-sm, 0.5rem);
		}
		.menu-settings-tab {
			all: unset;
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
			text-transform: capitalize;
		}
		.menu-settings-tab[aria-pressed='true'] {
			background: var(--color-surface-alt);
			font-weight: 600;
		}
		.menu-settings-warning {
			color: var(--color-warning, #b45309);
			margin: 0;
		}
		menu-settings-zone {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs, 0.25rem);
		}
		.menu-settings-toggle {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.menu-settings-toggle:hover {
			background: var(--color-surface-alt);
		}
		.menu-settings-toggle-check {
			display: inline-block;
			width: 1.2em;
		}
		.menu-settings-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
