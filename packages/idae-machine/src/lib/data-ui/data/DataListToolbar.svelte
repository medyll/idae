<script module lang="ts">
	import type { Where } from '@medyll/qoolie';
	export type DataListDisplayMode = 'list' | 'table' | 'card' | 'actions';

	export interface DataListToolbarProps {
		collection: string;
		collectionId?: number | string;
		mode?: DataListDisplayMode;
		where?: Where;
	}
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
