<!--
DataGroup.svelte
Group-by control. Menu lists FK fields whose target collection has isGroup or isType flag.
Click sets/clears groupBy.

@prop {string} collection - Source collection name
@prop {string|undefined} groupBy - Bindable group field name (FK field key)
-->
<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		groupBy = $bindable(undefined)
	}: {
		collection: string;
		groupBy?: string | undefined;
	} = $props();

	let open = $state(false);

	const groupableFields = $derived.by(() => {
		const collLogic = safeCollection(collection);
		if (!collLogic) return [] as { field: string; label: string }[];
		const fks = collLogic.fks ?? {};
		const model = machine.logic.model;
		const out: { field: string; label: string }[] = [];
		for (const [fkName, fkDef] of Object.entries(fks)) {
			const target = model[fkDef.code];
			if (!target) continue;
			if (target.isGroup || target.isType) {
				out.push({ field: fkName, label: fkName });
			}
		}
		return out;
	});

	function safeCollection(name: string) {
		try {
			return machine.logic.collection(name);
		} catch {
			return null;
		}
	}

	function pick(field: string | undefined): void {
		groupBy = field;
		open = false;
		// TODO: persist active groupBy via MachinePrefs (per collection) once MachinePrefs is ready
	}

	const label = $derived(groupBy ? `Group: ${groupBy}` : 'Group');
</script>

<div class="data-group">
	<button
		type="button"
		class="data-group-btn"
		class:active={!!groupBy}
		onclick={() => (open = !open)}
	>
		{label} ▾
	</button>
	{#if open}
		<ul class="data-group-menu" role="menu">
			{#each groupableFields as opt (opt.field)}
				<li>
					<button type="button" class="data-group-item" onclick={() => pick(opt.field)}>
						{opt.label}
					</button>
				</li>
			{/each}
			{#if groupableFields.length === 0}
				<li class="data-group-empty">No groupable fields</li>
			{/if}
			{#if groupBy}
				<li class="data-group-sep"></li>
				<li>
					<button type="button" class="data-group-item clear" onclick={() => pick(undefined)}>
						Clear grouping
					</button>
				</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	@layer components {
		.data-group {
			position: relative;
			display: inline-block;
		}
		.data-group-btn {
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: 0.875rem;
		}
		.data-group-btn.active {
			background: var(--color-primary);
			color: var(--color-on-primary);
			border-color: var(--color-primary);
		}
		.data-group-menu {
			position: absolute;
			top: 100%;
			left: 0;
			margin: 0.25rem 0 0;
			padding: 0.25rem 0;
			list-style: none;
			background: var(--color-surface);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-sm);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			min-width: 160px;
			z-index: 10;
		}
		.data-group-item {
			width: 100%;
			text-align: left;
			padding: 0.375rem 0.75rem;
			background: transparent;
			border: none;
			cursor: pointer;
			font-size: 0.875rem;
		}
		.data-group-item:hover {
			background: var(--color-hover);
		}
		.data-group-item.clear {
			color: var(--color-text-muted, #888);
		}
		.data-group-empty {
			padding: 0.375rem 0.75rem;
			color: var(--color-text-muted, #888);
			font-size: 0.875rem;
		}
		.data-group-sep {
			height: 1px;
			background: var(--color-border);
			margin: 0.25rem 0;
		}
	}
</style>
