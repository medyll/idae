<script lang="ts">
	import CreateUpdate from '$lib/form/CreateUpdate.svelte';
	import { machine } from '$lib/main/machine.js';
	import { testScheme } from '$lib/demo/testScheme.js';
	import { MachineSchemeValidate } from '$lib/main/machine/MachineSchemeValidate.js';

	// Initialize machine
	machine.init({ dbName: 'demo-db', version: 1, model: testScheme });
	machine.start();

	// State (Svelte 5 runes)
	let activeTab = $state<'explore' | 'create' | 'crud' | 'validate'>('explore');
	let selectedCollection = $state('users');
	let selectedRecord = $state<Record<string, unknown> | null>(null);
	let allRecords = $state<Record<string, unknown>[]>([]);
	let formData = $state<Record<string, unknown>>({});
	let validationErrors = $state<Record<string, string>>({});

	// Collections available
	const collections = Object.keys(testScheme.schema || {});

	// Sample data
	$effect(() => {
		// Load sample data
		if (selectedCollection) {
			const schema = testScheme.schema[selectedCollection];
			if (schema && !allRecords.length) {
				// Add sample records
				const sampleData = {
					users: [
						{ name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
						{ name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
					],
					products: [
						{ title: 'Laptop', price: 999.99, inStock: true },
						{ title: 'Mouse', price: 29.99, inStock: true },
					],
				};

				if (sampleData[selectedCollection as keyof typeof sampleData]) {
					allRecords = sampleData[selectedCollection as keyof typeof sampleData];
				}
			}
		}
	});

	// Load records when collection changes
	function loadCollection(collection: string) {
		selectedCollection = collection;
		selectedRecord = null;
		formData = {};
		validationErrors = {};
	}

	// CRUD Operations
	function handleCreate() {
		allRecords = [...allRecords, { ...formData }];
		formData = {};
		validationErrors = {};
	}

	function handleUpdate() {
		if (selectedRecord) {
			const index = allRecords.indexOf(selectedRecord);
			if (index >= 0) {
				allRecords[index] = { ...formData };
				allRecords = [...allRecords];
				selectedRecord = null;
				formData = {};
			}
		}
	}

	function handleDelete() {
		if (selectedRecord) {
			allRecords = allRecords.filter((r) => r !== selectedRecord);
			selectedRecord = null;
			formData = {};
		}
	}

	function selectRecord(record: Record<string, unknown>) {
		selectedRecord = record;
		formData = { ...record };
	}

	// Validation
	async function validateForm() {
		const validator = new MachineSchemeValidate(selectedCollection, machine.machineDb);

		// Register sample validators
		validator.registerCustom('email', (val) =>
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val))
		);

		validator.registerCustom('password', (val) => String(val).length >= 8);

		validator.registerCrossField({
			fields: ['password', 'passwordConfirm'],
			validator: (data) => data.password === data.passwordConfirm,
		});

		const result = await validator.validateForm(formData);
		validationErrors = result.errors;
		return result.isValid;
	}
</script>

<div class="demo-container">
	<header class="demo-header">
		<h1>🎯 idae-machine Demo Explorer</h1>
		<p>Interactive showcase of form components & CRUD operations</p>
	</header>

	<div class="demo-nav" role="tablist">
		<button
			class={activeTab === 'explore' ? 'active' : ''}
			onclick={() => (activeTab = 'explore')}
			role="tab"
			aria-selected={activeTab === 'explore'}
		>
			📊 Explorer
		</button>
		<button
			class={activeTab === 'create' ? 'active' : ''}
			onclick={() => (activeTab = 'create')}
			role="tab"
			aria-selected={activeTab === 'create'}
		>
			➕ Create
		</button>
		<button
			class={activeTab === 'crud' ? 'active' : ''}
			onclick={() => (activeTab = 'crud')}
			role="tab"
			aria-selected={activeTab === 'crud'}
		>
			✏️ CRUD
		</button>
		<button
			class={activeTab === 'validate' ? 'active' : ''}
			onclick={() => (activeTab = 'validate')}
			role="tab"
			aria-selected={activeTab === 'validate'}
		>
			✓ Validate
		</button>
	</div>

	<div class="demo-content">
		<!-- Collection Selector -->
		<div class="collection-selector">
			<label for="collection-select">Collection:</label>
			<select id="collection-select" value={selectedCollection} onchange={(e) => loadCollection(e.currentTarget.value)}>
				{#each collections as col}
					<option value={col}>{col}</option>
				{/each}
			</select>
		</div>

		<!-- Tab: Explorer -->
		{#if activeTab === 'explore'}
			<div class="tab-content">
				<h2>📊 Data Explorer: {selectedCollection}</h2>
				<div class="explorer-grid">
					{#each allRecords as record (record)}
						<div
							class={`explorer-card ${selectedRecord === record ? 'selected' : ''}`}
							onclick={() => selectRecord(record)}
							role="button"
							tabindex="0"
							onkeydown={(e) => e.key === 'Enter' && selectRecord(record)}
						>
							<div class="card-content">
								{#each Object.entries(record) as [key, value]}
									<div class="field-row">
										<span class="field-name">{key}:</span>
										<span class="field-value">{value}</span>
									</div>
								{/each}
							</div>
							<div class="card-actions">
								<button onclick={() => selectRecord(record)} class="btn-small">Edit</button>
								<button onclick={handleDelete} class="btn-small btn-danger">Delete</button>
							</div>
						</div>
					{/each}
					{#if allRecords.length === 0}
						<p class="empty-state">No records. Create one to get started →</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Tab: Create -->
		{#if activeTab === 'create'}
			<div class="tab-content">
				<h2>➕ Create New {selectedCollection}</h2>
				<form onsubmit={(e) => { e.preventDefault(); handleCreate(); }}>
					<div class="form-group">
						{#each Object.keys(testScheme.schema[selectedCollection]?.fields || {}) as fieldName}
							<div class="form-field">
								<label for={fieldName}>{fieldName}:</label>
								<input
									id={fieldName}
									type="text"
									placeholder={fieldName}
									bind:value={formData[fieldName]}
									class={validationErrors[fieldName] ? 'error' : ''}
								/>
								{#if validationErrors[fieldName]}
									<span class="error-msg">{validationErrors[fieldName]}</span>
								{/if}
							</div>
						{/each}
					</div>
					<div class="form-actions">
						<button type="submit" class="btn-primary">Create Record</button>
						<button
							type="button"
							class="btn-secondary"
							onclick={() => {
								formData = {};
								validationErrors = {};
							}}
						>
							Clear
						</button>
					</div>
				</form>
			</div>
		{/if}

		<!-- Tab: CRUD Operations -->
		{#if activeTab === 'crud'}
			<div class="tab-content">
				<h2>✏️ CRUD Operations</h2>
				{#if selectedRecord}
					<div class="crud-editor">
						<h3>Editing Record:</h3>
						<form onsubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
							<div class="form-group">
								{#each Object.entries(selectedRecord) as [key, value]}
									<div class="form-field">
										<label for={key}>{key}:</label>
										<input
											id={key}
											type="text"
											value={formData[key] || ''}
											oninput={(e) => (formData[key] = e.currentTarget.value)}
										/>
									</div>
								{/each}
							</div>
							<div class="form-actions">
								<button type="submit" class="btn-primary">Update Record</button>
								<button type="button" class="btn-danger" onclick={handleDelete}>
									Delete Record
								</button>
								<button
									type="button"
									class="btn-secondary"
									onclick={() => {
										selectedRecord = null;
										formData = {};
									}}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				{:else}
					<p class="info-msg">Select a record from the explorer to edit it.</p>
				{/if}
			</div>
		{/if}

		<!-- Tab: Validation -->
		{#if activeTab === 'validate'}
			<div class="tab-content">
				<h2>✓ Validation Testing</h2>
				<div class="form-group">
					<h3>Test Form Validators:</h3>
					{#each Object.keys(testScheme.schema[selectedCollection]?.fields || {}) as fieldName}
						<div class="form-field">
							<label for={`test-${fieldName}`}>{fieldName}:</label>
							<input
								id={`test-${fieldName}`}
								type="text"
								placeholder={`Enter ${fieldName}`}
								bind:value={formData[fieldName]}
								class={validationErrors[fieldName] ? 'error' : ''}
							/>
							{#if validationErrors[fieldName]}
								<span class="error-msg">❌ {validationErrors[fieldName]}</span>
							{:else if formData[fieldName]}
								<span class="success-msg">✅ Valid</span>
							{/if}
						</div>
					{/each}
				</div>
				<div class="form-actions">
					<button onclick={validateForm} class="btn-primary">Validate Form</button>
					<button
						onclick={() => {
							formData = {};
							validationErrors = {};
						}}
						class="btn-secondary"
					>
						Clear
					</button>
				</div>
				{#if Object.keys(validationErrors).length > 0}
					<div class="validation-results error">
						<h4>❌ Validation Errors:</h4>
						<ul>
							{#each Object.entries(validationErrors) as [field, error]}
								<li>{field}: {error}</li>
							{/each}
						</ul>
					</div>
				{:else if Object.keys(formData).length > 0}
					<div class="validation-results success">
						<h4>✅ All Validations Passed!</h4>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<footer class="demo-footer">
		<p>idae-machine v1.0 | Showcasing form components, validation, and CRUD operations</p>
	</footer>
</div>

<style>
	.demo-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.demo-header {
		text-align: center;
		margin-bottom: 30px;
		padding: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 8px;
	}

	.demo-header h1 {
		margin: 0 0 10px 0;
		font-size: 2.5em;
	}

	.demo-header p {
		margin: 0;
		opacity: 0.9;
	}

	.demo-nav {
		display: flex;
		gap: 10px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.demo-nav button {
		padding: 10px 20px;
		border: 2px solid #ddd;
		background: white;
		cursor: pointer;
		border-radius: 6px;
		transition: all 0.3s;
		font-weight: 500;
	}

	.demo-nav button.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.demo-nav button:hover {
		border-color: #667eea;
	}

	.demo-content {
		background: white;
		padding: 30px;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.collection-selector {
		margin-bottom: 20px;
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.collection-selector label {
		font-weight: 600;
	}

	.collection-selector select {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1em;
	}

	.tab-content {
		animation: fadeIn 0.3s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	h2 {
		color: #333;
		margin-bottom: 20px;
	}

	.explorer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 15px;
		margin-bottom: 20px;
	}

	.explorer-card {
		border: 2px solid #eee;
		border-radius: 6px;
		padding: 15px;
		cursor: pointer;
		transition: all 0.3s;
	}

	.explorer-card:hover {
		border-color: #667eea;
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
	}

	.explorer-card.selected {
		border-color: #667eea;
		background: #f5f5ff;
	}

	.card-content {
		margin-bottom: 10px;
	}

	.field-row {
		display: flex;
		justify-content: space-between;
		padding: 5px 0;
		font-size: 0.9em;
	}

	.field-name {
		font-weight: 600;
		color: #555;
	}

	.field-value {
		color: #888;
		word-break: break-all;
	}

	.card-actions {
		display: flex;
		gap: 10px;
		padding-top: 10px;
		border-top: 1px solid #eee;
	}

	.btn-small {
		flex: 1;
		padding: 6px 10px;
		border: 1px solid #ddd;
		background: white;
		cursor: pointer;
		border-radius: 4px;
		font-size: 0.85em;
		transition: all 0.2s;
	}

	.btn-small:hover {
		background: #f5f5f5;
	}

	.btn-small.btn-danger {
		color: #e74c3c;
		border-color: #e74c3c;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-field {
		margin-bottom: 15px;
	}

	.form-field label {
		display: block;
		margin-bottom: 5px;
		font-weight: 600;
		color: #333;
	}

	.form-field input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1em;
		transition: border-color 0.3s;
	}

	.form-field input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.form-field input.error {
		border-color: #e74c3c;
	}

	.error-msg {
		display: block;
		color: #e74c3c;
		font-size: 0.85em;
		margin-top: 5px;
	}

	.success-msg {
		display: block;
		color: #27ae60;
		font-size: 0.85em;
		margin-top: 5px;
	}

	.form-actions {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.btn-primary {
		padding: 12px 24px;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background 0.3s;
	}

	.btn-primary:hover {
		background: #5568d3;
	}

	.btn-secondary {
		padding: 12px 24px;
		background: #ecf0f1;
		color: #333;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background 0.3s;
	}

	.btn-secondary:hover {
		background: #d5dbdb;
	}

	.btn-danger {
		padding: 12px 24px;
		background: #e74c3c;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 600;
		transition: background 0.3s;
	}

	.btn-danger:hover {
		background: #c0392b;
	}

	.crud-editor {
		border: 1px solid #ddd;
		padding: 20px;
		border-radius: 6px;
		background: #f9f9f9;
	}

	.crud-editor h3 {
		margin-top: 0;
	}

	.info-msg,
	.empty-state {
		color: #666;
		padding: 20px;
		text-align: center;
		background: #f5f5f5;
		border-radius: 6px;
		border-left: 4px solid #667eea;
	}

	.validation-results {
		margin-top: 20px;
		padding: 15px;
		border-radius: 6px;
		border-left: 4px solid;
	}

	.validation-results.error {
		background: #fadbd8;
		border-left-color: #e74c3c;
	}

	.validation-results.success {
		background: #d5f4e6;
		border-left-color: #27ae60;
	}

	.validation-results h4 {
		margin-top: 0;
	}

	.validation-results ul {
		margin: 10px 0 0 0;
		padding-left: 20px;
	}

	.demo-footer {
		text-align: center;
		margin-top: 30px;
		padding-top: 20px;
		border-top: 1px solid #ddd;
		color: #999;
		font-size: 0.9em;
	}

	@media (max-width: 768px) {
		.demo-container {
			padding: 10px;
		}

		.demo-header h1 {
			font-size: 1.8em;
		}

		.explorer-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.form-actions button {
			width: 100%;
		}
	}
</style>
