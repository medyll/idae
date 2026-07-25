<!--
DataGroup.svelte
Group-by control. Menu lists FK fields whose target collection has isGroup or isType flag.
Click sets/clears groupBy.

@prop {string} collection - Source collection name
@prop {string|undefined} groupBy - Bindable group field name (FK field key)
-->
<script module lang="ts">
	export interface DataGroupProps {
		collection: string;
		groupBy?: string | undefined;
	}
</script>

<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		groupBy = $bindable(undefined)
	}: DataGroupProps = $props();

	let open = $state(false);

	// Any field or FK relation can be a grouping axis. Plain fields group on
	// their raw value; FK fields resolve their label via DataList (parseFkGroupKey).
	const groupableFields = $derived.by(() => {
		const collLogic = machine.logic.collection(collection);
		if (!collLogic) return [] as { field: string; label: string }[];
		const fields = (collLogic.fields ?? {}) as Record<string, { type?: string }>;
		const fks    = (collLogic.fks ?? {}) as Record<string, unknown>;
		const out: { field: string; label: string }[] = [];
		const seen = new Set<string>();
		const SKIP_TYPES = new Set(['id', 'json', 'password']);
		for (const [name, def] of Object.entries(fields)) {
			if (name.startsWith('_')) continue;
			if (SKIP_TYPES.has(def?.type ?? '')) continue;
			out.push({ field: name, label: name });
			seen.add(name);
		}
		// FK relations not already declared as a flat field (e.g. engine meta fks).
		for (const fkName of Object.keys(fks)) {
			if (seen.has(fkName)) continue;
			out.push({ field: `fks.${fkName}`, label: fkName });
		}
		return out;
	});

	function pick(field: string | undefined): void {
		groupBy = field;
		open = false;
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
			padding: var(--pad-xs) var(--pad-sm);
			border: var(--border-width) solid var(--color-border);
			background: var(--color-surface);
			border-radius: var(--radius-sm);
			cursor: pointer;
			font-size: var(--text-sm);
		}
		.data-group-btn.active {
			background: var(--color-primary);
			color: var(--default-color-surface-light);
			border-color: var(--color-primary);
		}
		.data-group-menu {
			position: absolute;
			top: 100%;
			left: 0;
			margin: var(--marg-xs) 0 0;
			padding: var(--pad-xs) 0;
			list-style: none;
			background: var(--color-surface-overlay);
			border: var(--border-width) solid var(--color-border);
			border-radius: var(--radius-sm);
			box-shadow: var(--shadow-md);
			min-width: calc(var(--gutter-3xl) * 2.5);
			z-index: var(--z-dropdown);
		}
		.data-group-item {
			width: 100%;
			text-align: left;
			padding: var(--pad-xs) var(--pad-sm);
			background: transparent;
			border: none;
			cursor: pointer;
			font-size: var(--text-sm);
		}
		.data-group-item:hover {
			background: var(--color-surface-hover);
		}
		.data-group-item.clear {
			color: var(--color-text-muted);
		}
		.data-group-empty {
			padding: var(--pad-xs) var(--pad-sm);
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
		.data-group-sep {
			height: var(--border-width);
			background: var(--color-border);
			margin: var(--marg-xs) 0;
		}
	}
</style>
