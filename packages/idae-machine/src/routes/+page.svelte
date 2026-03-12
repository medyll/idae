<!--
idae-machine Demo - Complete Component Showcase
Shows all UI components working together with real data binding
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';
	import { testScheme } from '$lib/demo/testScheme.js';

	// UI Components
	import CollectionButton from '$lib/ui/CollectionButton.svelte';
	import CollectionList from '$lib/ui/CollectionList.svelte';
	import CollectionListMenu from '$lib/ui/CollectionListMenu.svelte';
	import CollectionListFieldValues from '$lib/ui/CollectionListFieldValues.svelte';
	import CollectionFks from '$lib/ui/CollectionFks.svelte';
	import CollectionReverseFks from '$lib/ui/CollectionReverseFks.svelte';

	// Form Components
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import FieldValue from '$lib/form/FieldValue.svelte';

	// Fragment Components
	import Frame from '$lib/fragments/Frame.svelte';
	import Confirm from '$lib/fragments/Confirm.svelte';
	import Selector from '$lib/fragments/Selector.svelte';
	import InfoLine from '$lib/fragments/InfoLine.svelte';

	// Initialize machine
	machine.init({ dbName: 'demo-db', version: 1, model: testScheme });
	machine.start();

	// State
	let selectedCollection = $state('users');
	let activeTab = $state<'grid' | 'menu' | 'create' | 'edit' | 'relationships'>('grid');
	let selectedRecord = $state<Record<string, unknown> | null>(null);
	let showEditForm = $state(false);

	// Get available collections
	const collections = Object.keys(testScheme.schema || {});

	// Validate before delete
	function confirmDelete() {
		if (selectedRecord) {
			// In a real app, would call delete on the store
			selectedRecord = null;
			showEditForm = false;
		}
	}
</script>

<div class="demo-page">
	<!-- Header -->
	<header class="demo-header">
		<h1>🎯 idae-machine Component Showcase</h1>
		<p>Interactive demonstration of all UI & Form components</p>
	</header>

	<!-- Main Layout with Frame -->
	<Frame showPanel={true} panelMode="expanded">
		<!-- Left Navigation Panel -->
		<svelte:fragment slot="leftNav">
			<nav class="left-panel">
				<h3>Collections</h3>

				<!-- Selector for Collections -->
				<div class="selector-wrapper">
					{#each collections as col}
						<button
							class={`collection-btn ${selectedCollection === col ? 'active' : ''}`}
							onclick={() => {
								selectedCollection = col;
								selectedRecord = null;
								showEditForm = false;
							}}
						>
							📦 {col}
						</button>
					{/each}
				</div>

				<!-- Create Button -->
				<div class="create-section">
					<h4>Actions</h4>
					<CollectionButton collection={selectedCollection} mode="create" />
				</div>

				<!-- Info Section -->
				<div class="info-section">
					<InfoLine label="Collection" value={selectedCollection} />
					<InfoLine
						label="Selected"
						value={selectedRecord ? 'Record selected' : 'No selection'}
					/>
				</div>
			</nav>
		</svelte:fragment>

		<!-- Main Content Area -->
		<div class="main-content">
			<!-- Tabs Navigation -->
			<div class="tabs-nav">
				<button
					class={`tab ${activeTab === 'grid' ? 'active' : ''}`}
					onclick={() => activeTab = 'grid'}
				>
					📊 Grid View
				</button>
				<button
					class={`tab ${activeTab === 'menu' ? 'active' : ''}`}
					onclick={() => activeTab = 'menu'}
				>
					📋 Menu View
				</button>
				<button
					class={`tab ${activeTab === 'create' ? 'active' : ''}`}
					onclick={() => activeTab = 'create'}
				>
					➕ Create
				</button>
				{#if selectedRecord}
					<button
						class={`tab ${activeTab === 'edit' ? 'active' : ''}`}
						onclick={() => activeTab = 'edit'}
					>
						✏️ Edit
					</button>
					<button
						class={`tab ${activeTab === 'relationships' ? 'active' : ''}`}
						onclick={() => activeTab = 'relationships'}
					>
						🔗 Relations
					</button>
				{/if}
			</div>

			<!-- Tab Content -->
			<div class="tab-content">
				<!-- Tab: Grid View - CollectionList -->
				{#if activeTab === 'grid'}
					<div class="view-section">
						<h2>📊 Grid View - CollectionList Component</h2>
						<p class="description">
							CollectionList displays all records in a responsive grid with CollectionListFieldValues
						</p>
						<div class="collection-grid">
							<CollectionList
								collection={selectedCollection}
								displayMode="grid"
								onclick={(record) => {
									selectedRecord = record;
									showEditForm = true;
									activeTab = 'edit';
								}}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Menu View - CollectionListMenu -->
				{#if activeTab === 'menu'}
					<div class="view-section">
						<h2>📋 Menu View - CollectionListMenu Component</h2>
						<p class="description">
							CollectionListMenu displays records as a vertical menu list
						</p>
						<div class="collection-menu">
							<CollectionListMenu
								collection={selectedCollection}
								onclick={(record) => {
									selectedRecord = record;
									showEditForm = true;
									activeTab = 'edit';
								}}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Create - CreateUpdate -->
				{#if activeTab === 'create'}
					<div class="view-section">
						<h2>➕ Create New Record - CreateUpdate Component</h2>
						<p class="description">
							CreateUpdate form with automatic field generation and validation
						</p>
						<div class="form-wrapper">
							<CreateUpdate
								collection={selectedCollection}
								mode="create"
								onsubmit={(data) => {
									console.log('Record created:', data);
									activeTab = 'grid';
								}}
							/>
						</div>
					</div>
				{/if}

				<!-- Tab: Edit - CreateUpdate + Confirm -->
				{#if activeTab === 'edit' && selectedRecord}
					<div class="view-section">
						<h2>✏️ Edit Record - CreateUpdate Component</h2>
						<p class="description">
							Edit existing record with validation and delete confirmation
						</p>
						<div class="form-wrapper">
							<CreateUpdate
								collection={selectedCollection}
								mode="edit"
								data={selectedRecord}
								onsubmit={(data) => {
									console.log('Record updated:', data);
									selectedRecord = null;
									activeTab = 'grid';
								}}
							/>

							<!-- Delete Confirmation -->
							<div class="delete-section">
								<Confirm
									validate={confirmDelete}
									message="Delete this record?"
								/>
							</div>
						</div>
					</div>
				{/if}

				<!-- Tab: Relationships -->
				{#if activeTab === 'relationships' && selectedRecord}
					<div class="view-section">
						<h2>🔗 Relationships - CollectionFks & CollectionReverseFks</h2>
						<p class="description">
							View foreign key relationships and reverse relationships for this record
						</p>

						<!-- Foreign Keys -->
						<div class="relationships-section">
							<h3>Foreign Keys (FK)</h3>
							<div class="fk-viewer">
								<CollectionFks collection={selectedCollection}>
									{#snippet children(fkEntry)}
										<div class="fk-item">
											<strong>{fkEntry[0]}</strong>: References collection
										</div>
									{/snippet}
								</CollectionFks>
							</div>
						</div>

						<!-- Reverse Foreign Keys -->
						<div class="relationships-section">
							<h3>Reverse Relationships</h3>
							<div class="reverse-fk-viewer">
								<CollectionReverseFks
									collection={selectedCollection}
									showTitle={true}
								>
									{#snippet children(reverseFkEntry)}
										<div class="reverse-fk-item">
											Collection <strong>{reverseFkEntry[0]}</strong> references this
										</div>
									{/snippet}
								</CollectionReverseFks>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Field Values Showcase (always visible) -->
			{#if selectedRecord}
				<div class="field-values-section">
					<h3>🎯 CollectionListFieldValues - Selected Record Fields</h3>
					<div class="fields-display">
						<CollectionListFieldValues
							collection={selectedCollection}
							data={selectedRecord}
							mode="show"
						/>
					</div>
				</div>
			{/if}
		</div>
	</Frame>

	<!-- Footer -->
	<footer class="demo-footer">
		<p>
			idae-machine v1.0 • Showcasing all UI components: CollectionButton, CollectionList,
			CollectionListMenu, CollectionListFieldValues, CollectionFks, CollectionReverseFks,
			CreateUpdate, FieldValue, Frame, Confirm, Selector, and InfoLine
		</p>
	</footer>
</div>

<style>
	.demo-page {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.demo-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 30px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.demo-header h1 {
		margin: 0 0 10px 0;
		font-size: 2.5em;
	}

	.demo-header p {
		margin: 0;
		opacity: 0.9;
		font-size: 1.1em;
	}

	:global([class*="paper"]) {
		background: white;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.left-panel {
		padding: 20px;
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
		transition: all 0.3s;
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

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 20px;
	}

	.tabs-nav {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		background: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.tab {
		padding: 10px 20px;
		border: 2px solid #ddd;
		background: white;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.3s;
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

	.field-values-section {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

	.demo-footer {
		background: #333;
		color: white;
		padding: 20px;
		text-align: center;
		margin-top: 40px;
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
