<!--
idae-machine Demo - Complete Component Showcase
Shows all UI components working together with real data binding
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { testScheme } from '$lib/demo/testScheme.js';

	// Data Components
	import DataPicker from '$lib/data/DataPicker.svelte';
	import DataList from '$lib/data/DataList.svelte';
	import DataListActions from '$lib/data/DataListActions.svelte';
	import DataListFields from '$lib/data/DataListFields.svelte';
	import DataLinks from '$lib/data/DataLinks.svelte';
	import DataLinksBack from '$lib/data/DataLinksBack.svelte';
	import DataCreate from '$lib/data/DataCreate.svelte';
	import DataEdit from '$lib/data/DataEdit.svelte';
	import DataProvider from '$lib/data/DataProvider.svelte';

	// Field Components
	import FieldDisplay from '$lib/field/FieldDisplay.svelte';
	import FieldEditor from '$lib/field/FieldEditor.svelte';

	// Fragment Components
	import Frame from '$lib/fragments/Frame.svelte';
	import Confirm from '$lib/fragments/Confirm.svelte';
	import Selector from '$lib/fragments/Selector.svelte';
	import InfoLine from '$lib/fragments/InfoLine.svelte';
	import Skeleton from '$lib/fragments/Skeleton.svelte';
	import CollectionList from '$lib/collection/CollectionList.svelte';

	// Initialize machine — testScheme IS the model (top-level keys = collection names)
	machine.init({ dbName: 'demo-db', version: 1, model: testScheme });
	machine.start();

	// Collections = top-level keys of testScheme
	const collections = Object.keys(testScheme);

	// State
	let selectedCollection = $state<string>(collections[0] ?? 'product');
	let activeTab = $state<'grid' | 'menu' | 'create' | 'update' | 'relationships' | 'components'>('grid');
	let selectedRecord = $state<Record<string, unknown> | null>(null);
	let isLoading = $state(false);

	function selectRecord(record: Record<string, unknown>, _index?: number | string) {
		selectedRecord = record;
		activeTab = 'update';
	}

	function confirmDelete() {
		selectedRecord = null;
		activeTab = 'grid';
	}
</script>

<div class="demo-page" data-testid="demo-page">
	<!-- Header -->
	<header class="demo-header">
		<h1>idae-machine Component Showcase</h1>
		<p>Interactive demonstration of all UI &amp; Form components</p>
	</header>

	<!-- Layout: panneau gauche + contenu principal -->
	<div class="page-layout">
		<!-- Panneau gauche -->
		<nav class="left-panel" data-testid="left-panel">
			<h3>Collections</h3>

			<div class="selector-wrapper" data-testid="collection-selector">
				<CollectionList >
					{#snippet children({collection})}
					<button
						class="collection-btn"
						class:active={selectedCollection === collection.name}
						data-testid="collection-btn-{collection.name}"
						onclick={() => {
							selectedCollection = collection.name;
							selectedRecord = null;
							activeTab = 'grid';
						}}>
						{collection.name}
					</button>
					{/snippet}
				</CollectionList>
			</div>

			<div class="create-section">
				<h4>Actions</h4>
				<DataPicker collection={selectedCollection} mode="create" />
			</div>

			<div class="info-section" data-testid="info-section">
				<InfoLine label="Collection" value={selectedCollection} />
				<InfoLine
					label="Selected"
					value={selectedRecord ? 'Record selected' : 'No selection'}
				/>
			</div>
		</nav>

		<!-- Contenu principal -->
		<main class="main-content">
			<!-- Tabs Navigation -->
			<nav class="tabs-nav" data-testid="tabs-nav">
				<button
					class="tab"
					class:active={activeTab === 'grid'}
					data-testid="tab-grid"
					onclick={() => (activeTab = 'grid')}
				>
					📊 Grid View
				</button>
				<button
					class="tab"
					class:active={activeTab === 'menu'}
					data-testid="tab-menu"
					onclick={() => (activeTab = 'menu')}
				>
					📋 Menu View
				</button>
				<button
					class="tab"
					class:active={activeTab === 'create'}
					data-testid="tab-create"
					onclick={() => (activeTab = 'create')}
				>
					➕ Create
				</button>
				{#if selectedRecord}
					<button
						class="tab"
						class:active={activeTab === 'update'}
						data-testid="tab-update"
						onclick={() => (activeTab = 'update')}
					>
						✏️ Update
					</button>
					<button
						class="tab"
						class:active={activeTab === 'relationships'}
						data-testid="tab-relationships"
						onclick={() => (activeTab = 'relationships')}
					>
						🔗 Relations
					</button>
				{/if}
				<button
					class="tab"
					class:active={activeTab === 'components'}
					data-testid="tab-components"
					onclick={() => (activeTab = 'components')}
				>
					⚙️ Advanced
				</button>
			</nav>

			<!-- Tab Content -->
			<div class="tab-content">
				<!-- Tab: Grid View -->
				{#if activeTab === 'grid'}
					<div class="view-section" data-testid="view-grid">
						<h2>📊 Grid View — DataList</h2>
						<p class="description">
							DataList affiche tous les enregistrements en grille avec DataListFields
						</p>
						<div class="collection-grid">
							<DataList
								collection={selectedCollection}
								displayMode="grid"
								onclick={(data, idx) => selectRecord(data as unknown as Record<string, unknown>, idx)}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Menu View -->
				{#if activeTab === 'menu'}
					<div class="view-section" data-testid="view-menu">
						<h2>📋 Menu View — DataListActions</h2>
						<p class="description">
							DataListActions affiche les enregistrements en liste verticale
						</p>
						<div class="collection-menu">
							<DataListActions
								collection={selectedCollection}
								onclick={(data, idx) => selectRecord(data as unknown as Record<string, unknown>, idx)}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Create -->
				{#if activeTab === 'create'}
					<div class="view-section" data-testid="view-create">
						<h2>➕ Create — nouveau enregistrement</h2>
						<p class="description">
							Composant <code>Create</code> : formulaire de création avec génération automatique des champs et validation.
							Props : <code>collection</code>, <code>withData</code>, <code>showFields</code>, <code>displayMode</code>, <code>onsubmit</code>.
						</p>
						<div class="form-wrapper">
							<DataCreate
								collection={selectedCollection}
								onsubmit={() => { activeTab = 'grid'; }}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Update -->
				{#if activeTab === 'update' && selectedRecord}
					<div class="view-section" data-testid="view-update">
						<h2>✏️ Update — édition d'un enregistrement</h2>
						<p class="description">
							Composant <code>Update</code> : formulaire d'édition avec validation, édition inline et suppression.
							Props : <code>collection</code>, <code>data</code>, <code>dataId</code>, <code>inPlaceEdit</code>, <code>showFks</code>, <code>onsubmit</code>.
						</p>
						<div class="form-wrapper">
							<DataEdit
								collection={selectedCollection}
								data={selectedRecord}
								onsubmit={() => {
									selectedRecord = null;
									activeTab = 'grid';
								}}
							/>
							<div class="delete-section">
								<Confirm validate={confirmDelete} message="Supprimer cet enregistrement ?" />
							</div>
						</div>

						<div class="field-values-section" data-testid="view-field-values">
							<h3>DataListFields — Champs du record sélectionné</h3>
							<div class="fields-display">
								<DataListFields
									collection={selectedCollection}
									data={selectedRecord}
									mode="show"
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Tab: Relationships -->
				{#if activeTab === 'relationships' && selectedRecord}
					<div class="view-section" data-testid="view-relationships">
						<h2>🔗 Relations — DataLinks &amp; DataLinksBack</h2>

						<div class="relationships-section">
							<h3>Foreign Keys (FK)</h3>
							<div class="fk-viewer">
								<DataLinks collection={selectedCollection}>
									{#snippet children(fkEntry: [string, unknown])}
										<div class="fk-item">
											<strong>{fkEntry[0]}</strong>: references collection
										</div>
									{/snippet}
								</DataLinks>
							</div>
						</div>

						<div class="relationships-section">
							<h3>Reverse Relationships</h3>
							<div class="reverse-fk-viewer">
								<DataLinksBack collection={selectedCollection} showTitle={true}>
									{#snippet children(reverseFkEntry: [string, unknown])}
										<div class="reverse-fk-item">
											Collection <strong>{reverseFkEntry[0]}</strong> references this one
										</div>
									{/snippet}
								</DataLinksBack>
							</div>
						</div>
					</div>
				{/if}

				<!-- Tab: Advanced Components -->
				{#if activeTab === 'components'}
					<div class="view-section" data-testid="view-components">
						<h2>⚙️ Composants avancés</h2>

						<!-- Skeleton -->
						<div class="advanced-section" data-testid="skeleton-section">
							<h3>État de chargement — Skeleton</h3>
							<button
								class="toggle-btn"
								data-testid="toggle-skeleton"
								onclick={() => (isLoading = !isLoading)}
							>
								{isLoading ? 'Masquer' : 'Afficher'} le chargement
							</button>
							{#if isLoading}
								<div class="skeleton-demo" data-testid="skeleton-demo">
									<Skeleton class="w-full" />
								</div>
							{/if}
						</div>

						<!-- FieldInPlace -->
						<div class="advanced-section" data-testid="field-inplace-section">
							<h3>Inline edit — FieldEditor</h3>
							<p>Edit a field directly with inline confirmation:</p>
							<div class="field-inplace-demo">
								<FieldEditor
									collection={selectedCollection}
									field="name"
									validate={() => console.log('Validated')}
									message="Confirm change?"
								>
									{#snippet children()}✏️ Edit{/snippet}
									{#snippet confirm(msg)}✅ {msg}{/snippet}
									{#snippet cancel()}❌ Cancel{/snippet}
								</FieldEditor>
							</div>
						</div>

						<!-- Selector -->
						<div class="advanced-section" data-testid="selector-section">
							<h3>Sélecteur — Selector</h3>
							<p>Rendu d'une liste de valeurs avec snippet <code>item</code> :</p>
							<div class="selector-demo">
								<Selector values={['vehicle', 'category', 'customer', 'rental', 'location_office', 'maintenance']} value={selectedCollection}>
									{#snippet item(val, active)}
										<span class="selector-item" class:active>{val}</span>
									{/snippet}
								</Selector>
							</div>
						</div>

						<!-- DataProvider -->
						<div class="advanced-section" data-testid="dataprovider-section">
							<h3>Contexte — DataProvider</h3>
							<p>Fournit le contexte collection + données aux composants enfants sans prop drilling.</p>
							<div class="info-box">
								<code>&lt;DataProvider collection="product" bind:data={'{'}formData{'}'}&gt;</code>
							</div>
						</div>

						<!-- FieldDisplay standalone -->
						<div class="advanced-section" data-testid="fieldvalue-section">
							<h3>Field display — FieldDisplay</h3>
							<p>Renders a field according to its type (text, number, boolean, date, fk...):</p>
							<div class="field-value-demo">
								<FieldDisplay
									collection={selectedCollection}
									fieldName="name"
									data={{ name: 'Example product', id: 'demo-1' }}
									mode="show"
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</main>
	</div>

	<!-- Footer -->
	<footer class="demo-footer" data-testid="footer">
		<p>idae-machine v1.0 • Complete Component Showcase</p>
		<p style="margin-top: 10px; font-size: 0.85em;">
			Data (10): DataPicker, DataList, DataListActions, DataListFields, DataLinks, DataLinksBack, DataForm, DataCreate, DataEdit, DataProvider •
			Field (2): FieldDisplay, FieldEditor •
			Fragments (5): Frame, Confirm, Selector, InfoLine, Skeleton
		</p>
	</footer>
</div>

<style>
	.demo-page {
		min-height: 100vh;
		background: #f5f5f5;
		display: flex;
		flex-direction: column;
	}

	.demo-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white; 
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		flex-shrink: 0; 
		& h1 {
			margin: 0 0 10px 0;
			font-size: 2.5em;
		} 
		& p {
			margin: 0;
			opacity: 0.9;
			font-size: 1.1em;
		}
	}

	/* Layout horizontal : panneau gauche + contenu */
	.page-layout {
		display: flex;
		flex: 1;
		gap: 0;
		min-height: 0;
	}

	/* Panneau gauche */
	.left-panel {
		width: 260px;
		flex-shrink: 0;
		background: white;
		padding: 20px;
		border-right: 1px solid #e0e0e0;
		overflow-y: auto;
		box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
	}

	.left-panel h3 {
		margin-top: 0;
		color: #333;
		font-size: 1.2em;
		border-bottom: 2px solid #667eea;
		padding-bottom: 10px;
	}

	.left-panel h4 {
		margin-top: 20px;
		color: #555;
		font-size: 0.95em;
	}

	.selector-wrapper {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}

	.collection-btn {
		padding: 10px 15px;
		border: 2px solid #ddd;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
		font-weight: 500;
	}

	.collection-btn:hover {
		border-color: #667eea;
		background: #f9f9f9;
	}

	.collection-btn.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.create-section {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #eee;
	}

	.info-section {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #eee;
	}

	.frame-demo-section {
		margin-top: 20px;
		padding-top: 20px;
		border-top: 1px solid #eee;
	}

	.frame-demo-wrapper {
		background: #f5f5f5;
		border-radius: 6px;
		padding: 10px;
		margin-top: 8px;
	}

	.frame-demo-text {
		margin: 0;
		font-size: 0.85em;
		color: #666;
		font-style: italic;
	}

	/* Contenu principal */
	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
		overflow-y: auto;
		min-width: 0;
	}

	.tabs-nav {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		background: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
	}

	.tab {
		padding: 10px 20px;
		border: 2px solid #ddd;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
	}

	.tab:hover {
		border-color: #667eea;
	}

	.tab.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.tab-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.view-section {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.view-section h2 {
		margin-top: 0;
		color: #333;
		border-bottom: 2px solid #667eea;
		padding-bottom: 15px;
	}

	.description {
		color: #666;
		font-size: 0.95em;
		margin: 10px 0 20px 0;
		font-style: italic;
	}

	.collection-grid {
		margin-top: 20px;
	}

	.collection-menu {
		margin-top: 20px;
		max-width: 500px;
	}

	.form-wrapper {
		margin-top: 20px;
		max-width: 600px;
	}

	.delete-section {
		margin-top: 30px;
		padding-top: 20px;
		border-top: 1px solid #eee;
	}

	.field-values-section {
		background: #f9f9f9;
		padding: 20px;
		border-radius: 8px;
		margin-top: 20px;
	}

	.field-values-section h3 {
		margin-top: 0;
		color: #333;
	}

	.fields-display {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
		margin-top: 15px;
	}

	.relationships-section {
		margin-top: 25px;
		padding: 15px;
		background: #f9f9f9;
		border-radius: 6px;
	}

	.relationships-section h3 {
		margin-top: 0;
		color: #555;
	}

	.fk-viewer,
	.reverse-fk-viewer {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.fk-item,
	.reverse-fk-item {
		padding: 10px;
		background: white;
		border-left: 3px solid #667eea;
		border-radius: 4px;
	}

	.advanced-section {
		margin-top: 25px;
		padding: 20px;
		background: #f9f9f9;
		border-radius: 6px;
		border-left: 4px solid #667eea;
	}

	.advanced-section h3 {
		margin-top: 0;
		color: #555;
	}

	.advanced-section p {
		margin: 10px 0;
		color: #666;
	}

	.toggle-btn {
		padding: 8px 16px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		margin: 10px 0;
	}

	.toggle-btn:hover {
		background: #5568d3;
	}

	.skeleton-demo {
		padding: 20px;
		background: white;
		border-radius: 6px;
		margin-top: 15px;
	}

	.field-inplace-demo,
	.field-value-demo,
	.selector-demo {
		padding: 20px;
		background: white;
		border-radius: 6px;
		margin-top: 15px;
	}

	.info-box {
		padding: 15px;
		background: white;
		border-radius: 6px;
		margin-top: 15px;
		border: 1px solid #ddd;
	}

	.info-box code {
		display: block;
		padding: 10px;
		background: #f5f5f5;
		border-radius: 4px;
		margin-top: 10px;
		font-family: monospace;
		font-size: 0.9em;
	}

	.demo-footer {
		background: #333;
		color: white;
		padding: 20px;
		text-align: center;
		flex-shrink: 0;
		font-size: 0.9em;
	}

	.demo-footer p {
		margin: 0;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.demo-header h1 {
			font-size: 1.8em;
		}

		.page-layout {
			flex-direction: column;
		}

		.left-panel {
			width: 100%;
			border-right: none;
			border-bottom: 1px solid #e0e0e0;
		}

		.fields-display {
			grid-template-columns: 1fr;
		}

		.tabs-nav {
			flex-direction: column;
		}

		.tab {
			width: 100%;
		}
	}
</style>


