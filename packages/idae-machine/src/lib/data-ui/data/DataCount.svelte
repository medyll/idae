<!--
DataCount.svelte
Reactive record count for a collection — `machine.store(collection, where).records.length`,
optionally narrowed by a client-side predicate (for aggregates qoolie's Where can't express:
orphans, status exclusion, distinct…).

`where` is captured once at setup and passed straight to machine.store — per CLAUDE.md
invariant 10, machine.store() registers a subscription at call time and must not be
re-invoked reactively. A reactive query is expressed via `filter` instead, evaluated
inside the `count` $derived over the already-subscribed `records`.

@prop {string} collection
@prop {Where<T>} [where] - static qoolie where, applied at the store subscription
@prop {(record: T) => boolean} [filter] - reactive client-side predicate, applied on top of `where`
@prop {string} [label]
@snippet children({ count, records }) - custom rendering; default = label + count
-->
<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { Where } from '$lib/types/index.js';

	export interface DataCountProps<T extends Record<string, unknown> = Record<string, unknown>> {
		collection: string;
		where?: Where<T>;
		filter?: (record: T) => boolean;
		label?: string;
		children?: Snippet<[{ count: number; records: T[] }]>;
	}
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { machine } from '$lib/main/machine.js';

	let { collection, where, filter, label, children }: DataCountProps<T> = $props();

	// Setup-time subscription only — see file header.
	const src = machine.store<T>(collection, where);

	const records = $derived(filter ? (src.records as T[]).filter(filter) : (src.records as T[]));
	const count = $derived(records.length);
</script>

{#if children}
	{@render children({ count, records })}
{:else}
	<data-count-fragment>
		{#if label}<span class="data-count-label">{label}</span>{/if}
		<span class="data-count-value">{count}</span>
	</data-count-fragment>
{/if}

<style>
	@layer components {
		data-count-fragment {
			display: inline-flex;
			align-items: baseline;
			gap: var(--gutter-xs);
		}
		.data-count-label {
			color: var(--color-text-muted);
			font-size: var(--text-sm);
		}
		.data-count-value {
			font-weight: var(--font-semibold);
		}
	}
</style>
