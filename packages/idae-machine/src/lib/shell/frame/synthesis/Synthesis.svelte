<script lang="ts">
	let {
		collection,
		collectionId
	}: {
		collection: string;
		collectionId: string;
	} = $props();
</script>

<synthesis-component>
	<synthesis-sidebar>
		<button class="action-favorite" aria-label="Favorite"></button>
		<synthesis-sidebar-info>
			<span class="record-type">record.scheme.name</span>
			<span class="record-id">record.id</span>
		</synthesis-sidebar-info>
		<synthesis-sidebar-actions>
			<datalist-rfks>
				<button class="action-create">
					<span class="icon-appscheme"></span>
					create {'appscheme'}
				</button>
			</datalist-rfks>
		</synthesis-sidebar-actions>
	</synthesis-sidebar>

	<synthesis-main>
		<synthesis-header>
			<span class="icon-appscheme"></span>
			<group-info>
				<div class="record-title">data.description</div>
				<div class="record-subtitle">{collection}</div>
			</group-info>
		</synthesis-header>

		<synthesis-tabs>
			<button class="tab-item is-active">Fiche</button>
			<button class="tab-item">Synthèse</button>
			<button class="tab-item">Modifier</button>
			<button class="tab-item">Vue complète</button>
		</synthesis-tabs>

		<synthesis-toolbar>
			<button class="action-home" aria-label="Home">
				<span class="icon-home"></span>
			</button>
			<datalist-rfks>
				<button class="action-navigate">
					<span class="icon-appscheme"></span>
					{'appscheme'}
				</button>
			</datalist-rfks>
		</synthesis-toolbar>

		<synthesis-panes>
			<synthesis-pane-left>
				<!-- Record fields / form -->
			</synthesis-pane-left>
			<synthesis-pane-right>
				<!-- Data lists, sections -->
			</synthesis-pane-right>
		</synthesis-panes>
	</synthesis-main>
</synthesis-component>

<style>
	@layer components {
		synthesis-component {
			display: flex;
			height: 100%;
			width: 100%;
			overflow: hidden;
		}

		synthesis-sidebar {
			display: flex;
			flex-direction: column;
			width: 240px;
			background: var(--color-surface-alt);
			border-right: var(--border-width) solid var(--color-border);
		}

		synthesis-sidebar-info {
			display: flex;
			flex-direction: column;
			gap: var(--gutter-xs);
			padding: var(--pad-md);
		}

		synthesis-sidebar-actions {
			display: flex;
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

		synthesis-tabs {
			display: flex;
			gap: var(--gutter-xs);
			padding: var(--pad-sm) var(--pad-md);
			border-bottom: var(--border-width) solid var(--color-border);
		}

		synthesis-toolbar {
			display: flex;
			align-items: center;
			gap: var(--gutter-sm);
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
		}

		synthesis-pane-right {
			display: flex;
			flex-direction: column;
			flex: 2;
			min-width: 0;
			overflow: auto;
		}

		datalist-rfks {
			display: flex;
			gap: var(--gutter-xs);
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
		}

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
	}
</style>
