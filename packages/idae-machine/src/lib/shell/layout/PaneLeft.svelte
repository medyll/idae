<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	interface Props {
		onSelect?: (detail: { collection: string; id?: string }) => void;
		activeCollection?: string;
	}

	let { onSelect, activeCollection = '' }: Props = $props();

	let query = $state('');

	type SchemeRow = { code: string; name?: string; order?: number; [k: string]: unknown };

	const store = $derived(machine.store['appscheme']);

	const rawItems = $derived.by(() => {
		if (!store) return [] as SchemeRow[];
		return (store.getAll() ?? []) as SchemeRow[];
	});

	const filteredItems = $derived.by(() => {
		let rows = rawItems.filter(r => machine.rights.checkAccess(r.code, 'R'));
		if (query) {
			const q = query.toLowerCase();
			rows = rows.filter(r =>
				r.code.toLowerCase().includes(q) ||
				(r.name ?? '').toLowerCase().includes(q)
			);
		}
		return rows;
	});
</script>

<div class="pane-left">
	<div class="toolbar">
		<input
			type="search"
			bind:value={query}
			placeholder="Search collections…"
			aria-label="Search collections"
		/>
	</div>
	<div class="pane-list">
		<ul class="list list-stack" role="list">
			{#each filteredItems as row (row.code)}
				<li>
					<button
						type="button"
						class="list-item btn-ghost"
						class:active={row.code === activeCollection}
						onclick={() => onSelect?.({ collection: row.code as string })}
					>
						<div class="list-item-content">{row.name ?? row.code}</div>
					</button>
				</li>
			{/each}
		</ul>

	</div>
</div>

<style>
	.pane-left {
		flex: 1;
		display: flex;
		flex-direction: column;
		border-right: var(--border-width) solid var(--color-border);
		overflow: hidden;
	}

	.pane-list {
		flex: 1;
		overflow-y: auto;
		padding: 0 var(--pad-md) var(--pad-md);
	}

	.list-item.btn-ghost {
		width: 100%;
		justify-content: flex-start;
		border: none;
		background: transparent;
	}
</style>
