<!--
CollectionNav.svelte
Sidebar nav listing all collections from appscheme.
No frame awareness — pure UI + callback.
-->
<script lang="ts">
	import DataList from '$lib/data-ui/data/DataList.svelte';
	import { machine } from '$lib/main/machine.js';

	let {
		activeCollection = '',
		onSelect,
		filter,
		sortBy = { field: 'order', direction: 'asc' as const },
	}: {
		activeCollection?: string;
		onSelect?: (code: string) => void;
		filter?: string[];
		sortBy?: { field: string; direction: 'asc' | 'desc' };
	} = $props();

	function handleClick(code: string): void {
		if (onSelect) {
			onSelect(code);
		} else {
			machine.loadFrame('explorer', code, undefined, { mode: 'list' });
		}
	}
</script>
jiji
<DataList collection="appscheme" {sortBy}> 
	<div>test</div>
	{#snippet item({ record: row })}
		{#if !filter || filter.includes(String(row.code))}
			<li>
				<button
					type="button"
					class="list-item btn-ghost"
					class:active={row.code === activeCollection}
					onclick={() => handleClick(String(row.code))}
				>
					<div class="list-item-content">{row.name ?? row.code}</div>
				</button>
			</li>
		{/if}
	{/snippet}
</DataList>

<style>
	.list-item.btn-ghost {
		width: 100%;
		justify-content: flex-start;
		border: none;
		background: transparent;
		text-align: left;
		padding: 6px 8px;
		border-radius: var(--radius-sm);
		cursor: pointer;
	}
	.list-item.btn-ghost:hover { background: var(--color-hover); }
	.list-item.btn-ghost.active {
		background: var(--color-primary-subtle, #ede9fe);
		color: var(--color-primary, #4f46e5);
		font-weight: var(--font-medium, 500);
	}
</style>
