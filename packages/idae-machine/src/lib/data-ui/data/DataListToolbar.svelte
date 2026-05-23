<script module lang="ts">
	export type Mode = 'list' | 'table' | 'card' | 'actions';
</script>

<script lang="ts" generics="COL extends Record<string, unknown>">
	const currentMode = $derived(userMode ?? modeProp);
</script>

<div class="data-toolbar">
	<div class="mode-switcher">
		<button
			type="button"
			class="mode-btn"
			class:active={currentMode === 'list'}
			onclick={() => setMode('list')}>List</button
		>
		<button
			type="button"
			class="mode-btn"
			class:active={currentMode === 'table'}
			onclick={() => setMode('table')}>Table</button
		>
		<button
			type="button"
			class="mode-btn"
			class:active={currentMode === 'actions'}
			onclick={() => setMode('actions')}>Actions</button
		>
	</div>
</div>
