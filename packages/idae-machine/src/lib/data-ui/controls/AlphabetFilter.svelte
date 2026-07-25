<!--
AlphabetFilter.svelte
First-letter index for a collection's presentation field. Bindable `where` emits
{ [field]: { startsWith: letter } } or undefined ("Tous").

Operator keys are BARE, not $-prefixed: qoolie's matchOperators switches on 'eq' /
'startsWith' / 'contains' and has no default branch, so a '$startsWith' key is skipped
and the clause matches every record instead of filtering. (The $-prefixed spelling in
node_modules/@medyll/qoolie/dist/lib/operators.d.ts is a stale published artifact — the
linked workspace source in packages/qoolie is authoritative.)

Letters are derived from the data rather than hardcoded A-Z: startsWith is also
case-SENSITIVE, so a fixed uppercase alphabet silently matches nothing on
lowercase-stored values. Offering only the initials that actually occur — in their
stored case — makes every button a guaranteed hit and mirrors the legacy screen, which
built its index from a distinct() over the column.

@prop {string} collection
@prop {string} [field] - defaults to the first token of template.presentation
@prop {Where|undefined} [where] - $bindable
@prop {string|undefined} [letter] - $bindable selected letter (as stored)
-->
<script module lang="ts">
	import type { Where } from '$lib/types/index.js';

	export interface AlphabetFilterProps {
		collection: string;
		field?: string;
		where?: Where | undefined;
		letter?: string | undefined;
	}
</script>

<script lang="ts">
	import { machine } from '$lib/main/machine.js';

	let {
		collection,
		field,
		where = $bindable(undefined),
		letter = $bindable(undefined)
	}: AlphabetFilterProps = $props();

	// Setup-time subscription — collection is fixed per instance (CLAUDE.md invariant 10).
	const src = machine.store<Record<string, unknown>>(collection);

	const effectiveField = $derived.by(() => {
		if (field) return field;
		const scheme = machine.logic.collection(collection);
		const presentation = scheme?.template?.presentation as string | undefined;
		return presentation?.split(/\s+/).filter(Boolean)[0];
	});

	// Distinct stored initials. Mixed-case data yields one entry per stored case; each
	// still matches, which is preferable to a merged entry that would drop records.
	const letters = $derived.by(() => {
		const key = effectiveField;
		if (!key) return [];
		const seen = new Set<string>();
		for (const record of src.records as Record<string, unknown>[]) {
			const raw = record[key];
			if (typeof raw !== 'string' || raw.length === 0) continue;
			seen.add(raw[0]);
		}
		return [...seen].sort((a, b) => a.localeCompare(b));
	});

	function select(next: string | undefined): void {
		letter = next;
		where = next && effectiveField ? { [effectiveField]: { startsWith: next } } : undefined;
	}
</script>

<div class="alphabet-filter" role="group" aria-label="Filtrer par lettre">
	<button type="button" class="alphabet-filter-item" aria-pressed={letter == null} onclick={() => select(undefined)}>
		Tous
	</button>
	{#each letters as l (l)}
		<button type="button" class="alphabet-filter-item" aria-pressed={letter === l} onclick={() => select(l)}>
			{l.toLocaleUpperCase()}
		</button>
	{/each}
</div>

<style>
	@layer components {
		.alphabet-filter {
			display: flex;
			flex-wrap: wrap;
			gap: var(--gutter-xs);
		}
		.alphabet-filter-item {
			all: unset;
			box-sizing: border-box;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			min-width: var(--control-height);
			min-height: var(--control-height);
			padding: 0 var(--pad-xs);
			border-radius: var(--radius-xs);
			font-size: var(--text-xs);
			cursor: pointer;
			color: var(--color-text);
		}
		.alphabet-filter-item:hover {
			background: var(--color-surface-hover);
		}
		.alphabet-filter-item[aria-pressed='true'] {
			background: var(--color-primary);
			color: var(--default-color-surface-light);
		}
	}
</style>
