<!--
CollectionNav.svelte
Sidebar nav listing collections from appscheme.
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

<div class="nav-section">
	<div class="nav-heading">Administration</div>
	<ul class="list list-stack">
		<li>
			<button type="button" class="list-item btn-ghost"
				onclick={() => machine.loadFrame('rbac.matrix', 'appuser_grant')}>
				<div class="list-item-content">Permissions</div>
			</button>
		</li>
		{#each [
			{ col: 'appuser',            label: 'Users' },
			{ col: 'appuser_group',      label: 'Groups' },
			{ col: 'appuser_type',       label: 'Types' },
			{ col: 'appuser_assignment', label: 'Assignments' },
			{ col: 'appuser_audit',      label: 'Audit Log' }
		] as entry (entry.col)}
			<li>
				<button type="button" class="list-item btn-ghost"
					class:active={entry.col === activeCollection}
					onclick={() => machine.loadFrame('explorer', entry.col, undefined, { mode: 'list' })}>
					<div class="list-item-content">{entry.label}</div>
				</button>
			</li>
		{/each}
	</ul>
</div>

<div class="nav-heading">Collections</div>
<DataList collection="appscheme" {sortBy} listClass="list list-stack">
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
	.nav-section { margin-bottom: 12px; }
	.nav-heading {
		font-size: 0.75em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-muted, #888);
		padding: 8px 8px 4px;
	}
	.list-item.btn-ghost.active {
		background: var(--color-primary-subtle, #ede9fe);
		color: var(--color-primary, #4f46e5);
		font-weight: var(--font-medium, 500);
	}
</style>
