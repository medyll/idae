<!--
DataSort.svelte
Single-field sort control. Click cycles none → asc → desc → none.
Designed to be stacked (multi-sort): each instance mutates a shared bindable `sortBy` array.

@prop {string} field - Field name to sort by
@prop {string} [title] - Display label (defaults to field)
@prop {SortBy[]} sortBy - Bindable array. Entry is upserted/removed for this field.
-->
<script lang="ts">
	import type { SortBy } from '$lib/types/index.js';

	let {
		field,
		title,
		sortBy = $bindable([])
	}: {
		field: string;
		title?: string;
		sortBy?: SortBy[];
	} = $props();

	const current = $derived(sortBy.find(s => s.field === field)?.direction ?? 'none');

	function next(dir: 'none' | 'asc' | 'desc'): 'none' | 'asc' | 'desc' {
		return dir === 'none' ? 'asc' : dir === 'asc' ? 'desc' : 'none';
	}

	function cycle(): void {
		const nextDir = next(current);
		const others = sortBy.filter(s => s.field !== field);
		sortBy = nextDir === 'none' ? others : [...others, { field, direction: nextDir }];
		// TODO: persist active sort via MachinePrefs (per collection) once MachinePrefs is ready
	}

	const icon = $derived(
		current === 'asc' ? '↑' : current === 'desc' ? '↓' : '↕'
	);
</script>

<button
	type="button"
	class="data-sort-btn"
	class:active={current !== 'none'}
	onclick={cycle}
	title="Sort by {title ?? field}"
>
	<span class="data-sort-label">{title ?? field}</span>
	<span class="data-sort-icon">{icon}</span>
</button>

<style>
	@layer components {
		.data-sort-btn {
			display: inline-flex;
			align-items: center;
			gap: 0.25rem;
			padding: 0.25rem 0.5rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: 0.875rem;
		}
		.data-sort-btn.active {
			background: var(--color-primary);
			color: var(--color-on-primary);
			border-color: var(--color-primary);
		}
		.data-sort-icon {
			font-size: 0.75rem;
			opacity: 0.7;
		}
	}
</style>
