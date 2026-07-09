<script lang="ts">
	import DataRecord from '$lib/data-ui/data/DataRecord.svelte';
	import DataForm from '$lib/data-ui/data/DataForm.svelte';
	import DataListRfk from '$lib/data-ui/data/DataListRfk.svelte';
	import { machine } from '$lib/main/machine.js';
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import RecordToolbar from '$lib/shell/layout/RecordToolbar.svelte';
	import TemplateShell from '$lib/shell/layout/TemplateShell.svelte';

	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string;
		dataId?: string;
	} = $props();

	function safeScheme(name: string) {
		try {
			return machine.logic.collection(name);
		} catch {
			return null;
		}
	}

	const store = $derived(machine.store<Record<string, unknown>>(collection));
	const record = $derived(store.records.find((r) => String(r.id) === String(collectionId)) ?? {});
	const scheme = $derived(safeScheme(collection));
	const presentation = $derived(
		(scheme as { template?: { presentation?: string } } | null)?.template?.presentation ?? ''
	);

	const recordLabel = $derived.by(() => {
		if (!record || !presentation) return collectionId;
		const label = presentation
			.split(/\s+/)
			.filter(Boolean)
			.map((tok) => {
				let cur: unknown = record;
				for (const seg of tok.split('.')) {
					if (cur == null) return '';
					cur = (cur as Record<string, unknown>)[seg];
				}
				return cur == null ? '' : String(cur);
			})
			.filter(Boolean)
			.join(' ');
		return label || collectionId;
	});

	const reverseFks = $derived(scheme ? scheme.parseReverseFks() : {});
	const rfkEntries = $derived(
		Object.entries(reverseFks).map(([col, rels]) => ({
			collection: col,
			relations: rels as Record<string, unknown>
		}))
	);

	let activeTab = $state<'sheet' | 'edit' | 'full'>('sheet');
	let isFavorite = $state(false);

	// "Vue complète" = every declared scheme field, bypassing the named view.
	const allFields = $derived(
		scheme ? Object.keys((scheme as { fields?: Record<string, unknown> }).fields ?? {}) : []
	);

	const modeTabs = [
		{ id: 'sheet', label: 'Fiche' },
		{ id: 'edit', label: 'Modifier' },
		{ id: 'full', label: 'Vue complète' }
	] as const;

	function toggleFavorite() {
		isFavorite = !isFavorite;
		void machine.action(
			'appuser_prefs',
			{
				code: 'fav',
				collection,
				collection_value: collectionId,
				name: recordLabel,
				value: isFavorite
			},
			{ upsertOn: ['collection', 'collection_value'] }
		);
	}

	function handleCreateRfk(rfkCollection: string) {
		void machine.framer.loadInDialog('form', rfkCollection);
	}

	function handleNavRfk(rfkCollection: string) {
		machine.framer.loadFrame('explorer', rfkCollection);
	}
</script>

<TemplateShell {collection} {collectionId}>
	{#snippet leftbar()}
		<synthesis-sidebar>
			<button
				class="action-favorite"
				aria-label="Favorite"
				class:is-active={isFavorite}
				onclick={toggleFavorite}
			>
				☆
			</button>
			<synthesis-sidebar-info>
				<span class="record-type">{scheme?.collection ?? collection}</span>
				<span class="record-id">{collectionId}</span>
				<span class="record-label">{recordLabel}</span>
			</synthesis-sidebar-info>
			<synthesis-sidebar-actions>
				{#each rfkEntries as rfk (rfk.collection)}
					<button class="action-create" onclick={() => handleCreateRfk(rfk.collection)}>
						<span class="icon-appscheme"></span>
						créer {rfk.collection}
					</button>
				{/each}
			</synthesis-sidebar-actions>
		</synthesis-sidebar>
	{/snippet}

	<synthesis-main>
		<synthesis-header>
			<span class="icon-appscheme"></span>
			<group-info>
				<div class="record-title">{recordLabel}</div>
				<div class="record-subtitle">{scheme?.collection ?? collection}</div>
			</group-info>
		</synthesis-header>

		<fiche-header>
			<synthesis-modes>
				{#each modeTabs as tab (tab.id)}
					<button
						class="tab-item"
						class:is-active={activeTab === tab.id}
						onclick={() => (activeTab = tab.id)}
					>
						{tab.label}
					</button>
				{/each}
			</synthesis-modes>
			<RecordToolbar {collection} {collectionId} />
		</fiche-header>

		<synthesis-tabs>
			<button
				class="action-home"
				aria-label="Home"
				onclick={() => machine.framer.loadFrame('explorer', collection)}
			>
				<span class="icon-home"></span>
			</button>
			{#each rfkEntries as rfk (rfk.collection)}
				<button class="action-navigate" onclick={() => machine.framer.loadInDialog('fiche.update', rfk.collection)}>
					<span class="icon-appscheme"></span>
					{rfk.collection}
				</button>
			{/each}
		</synthesis-tabs>

		<synthesis-panes>
			<synthesis-pane-left>
				<DataRecord {collection} data={record} mode="show" view="flat"/>
				<hr />
				<DataRecord {collection} data={record} mode="show" view="fk"  />
			</synthesis-pane-left>
			<synthesis-pane-right>
				<!-- <DataList {collection} where={{ id: { eq: Number(collectionId) } }} view="fk" /> -->
				{#if record}
					<DataListRfk {collection} {collectionId} showTitle={true} />
				{/if}
			</synthesis-pane-right>
		</synthesis-panes>
	</synthesis-main>
</TemplateShell>

<style>
	@layer components {
		/* Root is TemplateShell now (.template-shell = flex row, height:100%,
		   provided globally by shell.css) — no local wrapper needed. */

		/* Fills TemplateShell's aside.shell-sidebar (which already carries
		   border-right/height from shell.css) — width + distinct background only. */
		synthesis-sidebar {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 240px;
			background: var(--color-surface-alt);
		}

		synthesis-sidebar-info {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding: var(--pad-md);
		}

		synthesis-sidebar-actions {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			margin-top: auto;
			padding: var(--pad-sm);
		}

		synthesis-main {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
			background: var(--color-surface);
		}

		synthesis-header {
			display: flex;
			align-items: center;
			gap: var(--gutter-md);
			padding: var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		group-info {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
		}

		fiche-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--gutter-md);
			padding: 0 var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		synthesis-modes {
			display: flex;
			gap: var(--gutter-xs);
		}

		synthesis-tabs {
			display: flex;
			gap: var(--gutter-xs);
			padding: var(--pad-sm) var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		synthesis-panes {
			display: flex;
			flex: 1;
			min-height: 0;
		}

		synthesis-pane-left {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
			border-right: var(--border-width) solid var(--color-border);
			overflow: auto;
			padding: var(--pad-md);
		}

		synthesis-pane-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			min-width: 0;
			overflow: auto;
			padding: var(--pad-md);
		}

		/* Atoms */
		.action-favorite {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			padding: 0;
			border: none;
			background: transparent;
			cursor: pointer;
			color: var(--color-text-muted);
			font-size: var(--text-lg);
		}

		.action-favorite.is-active,
		.action-favorite:hover {
			color: var(--color-warning);
		}

		.action-create,
		.action-navigate {
			display: inline-flex;
			align-items: center;
			gap: var(--gutter-xs);
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-md);
			background: var(--color-surface-raised);
			cursor: pointer;
			color: var(--color-text);
			font-size: var(--text-sm);
			white-space: nowrap;
		}

		.action-home {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: var(--pad-xs);
			border: none;
			background: transparent;
			cursor: pointer;
			color: var(--color-text-muted);
		}

		.action-home:hover {
			color: var(--color-text);
		}

		.icon-appscheme,
		.icon-home {
			display: inline-block;
			width: 16px;
			height: 16px;
		}

		.record-title {
			font-weight: var(--font-semibold);
			color: var(--color-text);
		}

		.record-subtitle,
		.record-type,
		.record-id {
			font-size: var(--text-sm);
			color: var(--color-text-muted);
		}

		.record-label {
			font-size: var(--text-base);
			font-weight: var(--font-medium);
			color: var(--color-text);
			margin-top: var(--gutter-xs);
		}

		.tab-item {
			display: inline-flex;
			align-items: center;
			padding: var(--pad-xs) var(--pad-sm);
			border: none;
			border-bottom: 2px solid transparent;
			background: transparent;
			cursor: pointer;
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}

		.tab-item.is-active {
			color: var(--color-primary);
			border-bottom-color: var(--color-primary);
		}

		.tab-item:hover {
			color: var(--color-text);
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--gutter-sm);
			padding: var(--pad-xl);
			color: var(--color-text-muted);
		}

		.empty-state-icon {
			font-size: var(--text-3xl);
		}

		.empty-state-title {
			font-size: var(--text-lg);
			font-weight: var(--font-medium);
		}
	}
</style>
