<!--
Today.svelte — BL-16. "Today" dashboard frame (zone main), distinct from 'dashboard'
(Espace/accueil). Three sections, each gated by rights + the BL-13 menu generator:
  - today-create: quick-create per permitted+pref collection (zone 'create').
  - today-my-lists: records owned by the current user (fks.appuser === currentUser.code).
  - today-echeancier: records bounded by dateDebut/dateFin, upcoming/ongoing first.
Reads via machine.store (reactive); writes via machine.menu.verbs.create (machine.action
under the hood, BL-08). Owner/date collections are enumerated once at setup from
machine.logic.collections() (static post-boot schema), never re-joined per render.
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { useMenuTree } from '$lib/data-ui/utils/useMenuTree.svelte.js';

	type RecordRow = Record<string, unknown> & {
		id?: unknown;
		code?: unknown;
		fks?: { appuser?: { code?: unknown } };
	};

	const createMenu = useMenuTree(() => 'create');

	const permitted = machine.rights.allowedCollections('L');

	const ownerCollections = machine.logic
		.collections()
		.filter((s) => Object.values(s.fks).some((fk) => fk.code === 'appuser'))
		.map((s) => s.collection)
		.filter((c) => permitted.includes(c));

	const dateCollections = machine.logic
		.collections()
		.filter((s) => 'dateDebut' in s.fields && 'dateFin' in s.fields)
		.map((s) => s.collection)
		.filter((c) => permitted.includes(c));

	// machine.store() registers a reactive subscription per call — must happen once
	// at setup, never inside $derived (see useMenuTree.svelte.ts for the rationale).
	const ownerStores = ownerCollections.map((collection) => ({
		collection,
		src: machine.store(collection)
	}));
	const dateStores = dateCollections.map((collection) => ({
		collection,
		src: machine.store(collection)
	}));

	const myLists = $derived.by(() => {
		const userCode = machine.rights.currentUser?.code;
		if (userCode == null) return [];
		return ownerStores
			.map(({ collection, src }) => ({
				collection,
				records: (src.records as RecordRow[]).filter((r) => r.fks?.appuser?.code === userCode).slice(0, 5)
			}))
			.filter((group) => group.records.length > 0);
	});

	const echeancier = $derived.by(() => {
		const today = new Date().toISOString().slice(0, 10);
		const items: Array<{ collection: string; record: RecordRow }> = [];
		for (const { collection, src } of dateStores) {
			for (const record of src.records as RecordRow[]) {
				const fin = record.dateFin as string | undefined;
				if (fin == null || fin >= today) items.push({ collection, record });
			}
		}
		items.sort((a, b) =>
			String(a.record.dateDebut ?? '').localeCompare(String(b.record.dateDebut ?? ''))
		);
		return items.slice(0, 15);
	});

	function quickCreate(collection: string): void {
		machine.menu.verbs.create?.(collection);
	}
</script>

<today-dashboard-component>
	<today-section data-section="create">
		<h3>Créer</h3>
		<today-create>
			{#each createMenu.tree.groups as group (group.key)}
				{#each group.items as item (item.key)}
					<button type="button" class="today-create-item" onclick={() => quickCreate(item.collection)}>
						{#if item.icon}<span class="today-create-item-icon">{item.icon}</span>{/if}
						{item.label}
					</button>
				{/each}
			{:else}
				<span class="today-empty">—</span>
			{/each}
		</today-create>
	</today-section>

	<today-section data-section="my-lists">
		<h3>Mes listes</h3>
		<today-my-lists>
			{#each myLists as group (group.collection)}
				<today-my-lists-group>
					<h4>{group.collection}</h4>
					{#each group.records as record (record.id ?? record.code)}
						<div class="today-my-lists-item">{record.code ?? record.id}</div>
					{/each}
				</today-my-lists-group>
			{:else}
				<span class="today-empty">—</span>
			{/each}
		</today-my-lists>
	</today-section>

	<today-section data-section="echeancier">
		<h3>Échéancier</h3>
		<today-echeancier>
			{#each echeancier as entry (`${entry.collection}:${entry.record.id ?? entry.record.code}`)}
				<div class="today-echeancier-item">
					<span class="today-echeancier-collection">{entry.collection}</span>
					<span class="today-echeancier-dates">{entry.record.dateDebut} → {entry.record.dateFin ?? '—'}</span>
				</div>
			{:else}
				<span class="today-empty">—</span>
			{/each}
		</today-echeancier>
	</today-section>
</today-dashboard-component>

<style>
	@layer components {
		today-dashboard-component {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
			gap: var(--gutter-lg, 1.5rem);
			padding: var(--gutter-lg, 1.5rem);
		}
		today-section {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		today-create {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		.today-create-item {
			all: unset;
			display: flex;
			align-items: center;
			gap: var(--gutter-sm, 0.5rem);
			cursor: pointer;
			padding: 0.25rem 0.5rem;
			border-radius: var(--radius-sm, 4px);
		}
		.today-create-item:hover {
			background: var(--color-surface-alt);
		}
		today-my-lists {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		today-my-lists-group {
			display: flex;
			flex-direction: column;
		}
		today-echeancier {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-sm, 0.5rem);
		}
		.today-echeancier-item {
			display: flex;
			justify-content: space-between;
			gap: var(--gutter-sm, 0.5rem);
		}
		.today-empty {
			color: var(--color-text-muted, #888);
		}
	}
</style>
